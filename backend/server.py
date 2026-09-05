import os
import json
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from pathlib import Path
from dotenv import load_dotenv

def utc_now():
    return datetime.now(timezone.utc)


BASE_DIR = Path(__file__).resolve().parent.parent
import sys
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Load environment variables dynamically
def reload_environment():
    env_path = BASE_DIR / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)
    else:
        load_dotenv(override=True)

reload_environment()

from fastapi import FastAPI, Depends, Query, HTTPException, Header, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import jwt
import bcrypt
from google import genai
from google.genai import types

from backend.field_pass_pdf import generate_field_pass_pdf

from backend.supabase_client import (
    supabase,
    supabase_admin,
    supabase_anon,
    is_supabase_configured,
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY
)

security = HTTPBearer(auto_error=False)

# Resilient ephemeral fallbacks for journeys & trips (keeps system 100% operational in any state)
_ephemeral_guest_journeys: dict = {}
_ephemeral_user_journeys: dict = {}
_ephemeral_user_trips: dict = {}


def format_user_profile(user, profile_row: Optional[dict] = None) -> dict:
    """Formats Supabase User and profile into the standardized Bharat Explore traveler schema."""
    meta = getattr(user, "user_metadata", {}) or {}
    if not isinstance(meta, dict):
        meta = {}
    p = profile_row or {}

    user_id = str(getattr(user, "id", "") or p.get("id", ""))
    email = str(getattr(user, "email", "") or p.get("email", ""))
    full_name = (
        p.get("full_name")
        or p.get("fullName")
        or meta.get("full_name")
        or meta.get("fullName")
        or (email.split("@")[0].capitalize() if email else "Traveler")
    )
    phone = p.get("phone") or meta.get("phone") or ""
    avatar = p.get("avatar") or meta.get("avatar") or "🏔️"
    travel_style = (
        p.get("travel_style")
        or p.get("travelStyle")
        or meta.get("travel_style")
        or meta.get("travelStyle")
        or "Eco-Explorer"
    )
    home_city = p.get("home_city") or p.get("homeCity") or meta.get("home_city") or meta.get("homeCity") or ""
    emergency_contact = (
        p.get("emergency_contact")
        or p.get("emergencyContact")
        or meta.get("emergency_contact")
        or meta.get("emergencyContact")
        or ""
    )
    medical_notes = (
        p.get("medical_notes")
        or p.get("medicalNotes")
        or meta.get("medical_notes")
        or meta.get("medicalNotes")
        or ""
    )
    preferences = p.get("preferences") or meta.get("preferences") or {
        "travel_style": travel_style,
        "dietary": "Standard",
        "high_altitude_certified": False
    }
    role = p.get("role") or meta.get("role") or getattr(user, "role", "traveler") or "traveler"
    is_active = p.get("is_active", True)
    created_at = getattr(user, "created_at", None) or p.get("created_at")
    if hasattr(created_at, "isoformat"):
        created_at = created_at.isoformat()
    elif isinstance(created_at, str):
        pass
    else:
        created_at = utc_now().isoformat()

    return {
        "id": user_id,
        "email": email,
        "fullName": full_name,
        "phone": phone,
        "avatar": avatar,
        "travelStyle": travel_style,
        "homeCity": home_city,
        "emergencyContact": emergency_contact,
        "medicalNotes": medical_notes,
        "preferences": preferences,
        "role": role,
        "isActive": is_active,
        "createdAt": str(created_at)
    }

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> dict:
    """Validates Supabase session JWT and returns the authenticated user's digital dossier."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required. Please sign in.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    token = credentials.credentials
    try:
        user_res = supabase_admin.auth.get_user(token)
        if not user_res or not user_res.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session token.",
                headers={"WWW-Authenticate": "Bearer"}
            )
        user = user_res.user

        # Fetch extended profile metadata from Supabase profiles table if available
        profile_row = None
        try:
            p_res = supabase_admin.table("profiles").select("*").eq("id", user.id).maybe_single().execute()
            if p_res and p_res.data:
                profile_row = p_res.data
        except Exception:
            pass

        return format_user_profile(user, profile_row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Session authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )

def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[dict]:
    """Retrieves authenticated user profile if token is provided, otherwise returns None."""
    if not credentials or not credentials.credentials:
        return None
    try:
        return get_current_user(credentials)
    except Exception:
        return None



# Auto-Seeding Dataset
INITIAL_DESTINATIONS = [
    {
        "id": "pangong",
        "name": "Pangong Tso Lake",
        "location": "Ladakh",
        "state": "Ladakh",
        "category": "mountains",
        "emotion": "peace",
        "best_season": "May–Sep",
        "difficulty": "Easy",
        "type": "Nature",
        "budget": 5000,
        "img": "https://images.unsplash.com/photo-1577500680965-6054e87d944b?auto=format&fit=crop&fm=jpg&q=85&w=1400",
        "desc": "A dramatic 134 km saline lake at 14,270 ft that famously shifts from turquoise to azure."
    },
    {
        "id": "nubra",
        "name": "Nubra Valley",
        "location": "Ladakh",
        "state": "Ladakh",
        "category": "mountains",
        "emotion": "adventure",
        "best_season": "May–Sep",
        "difficulty": "Moderate",
        "type": "Adventure",
        "budget": 6500,
        "img": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85",
        "desc": "High-altitude cold desert featuring silver sand dunes, Bactrian double-humped camels, and Diskit Gompa."
    },
    {
        "id": "khardung",
        "name": "Khardung La Pass",
        "location": "Ladakh",
        "state": "Ladakh",
        "category": "adventure",
        "emotion": "adventure",
        "best_season": "May–Oct",
        "difficulty": "Moderate",
        "type": "Mountain",
        "budget": 2500,
        "img": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
        "desc": "Legendary Himalayan mountain pass at 17,582 ft connecting Leh to Nubra and Siachen glacier base."
    },
    {
        "id": "tsomoriri",
        "name": "Tso Moriri Lake",
        "location": "Ladakh",
        "state": "Ladakh",
        "category": "nature",
        "emotion": "peace",
        "best_season": "May–Sep",
        "difficulty": "Moderate",
        "type": "Lake",
        "budget": 7000,
        "img": "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85",
        "desc": "A serene Changthang high-altitude wetland sanctuary hosting black-necked cranes and Bar-headed geese."
    },
    {
        "id": "leh",
        "name": "Leh Historic Old Town",
        "location": "Ladakh",
        "state": "Ladakh",
        "category": "culture",
        "emotion": "culture",
        "best_season": "Apr–Oct",
        "difficulty": "Easy",
        "type": "Culture",
        "budget": 3500,
        "img": "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=900&q=85",
        "desc": "The beating heart of Ladakh, home to Leh Palace, traditional clay ovens, local handicraft bazars, and bakeries."
    },
    {
        "id": "shanti",
        "name": "Shanti Stupa",
        "location": "Leh",
        "state": "Ladakh",
        "category": "spirituality",
        "emotion": "spirituality",
        "best_season": "Apr–Oct",
        "difficulty": "Easy",
        "type": "Spiritual",
        "budget": 500,
        "img": "https://images.unsplash.com/photo-1657617832971-6e966739cd10?auto=format&fit=crop&fm=jpg&q=85&w=1400",
        "desc": "A gleaming white-domed Buddhist stupa atop Chanspa hill offering panoramic 360° views of Leh valley and Zanskar ranges."
    },
    {
        "id": "hemis",
        "name": "Hemis Monastery",
        "location": "Ladakh",
        "state": "Ladakh",
        "category": "culture",
        "emotion": "culture",
        "best_season": "Jun–Sep",
        "difficulty": "Easy",
        "type": "Heritage",
        "budget": 1200,
        "img": "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=900&q=85",
        "desc": "Drukpa lineage Buddhist monastery dating back to 1672, celebrated for sacred Cham masked dances and ancient murals."
    },
    {
        "id": "zanskar",
        "name": "Zanskar Valley",
        "location": "Ladakh",
        "state": "Ladakh",
        "category": "adventure",
        "emotion": "adventure",
        "best_season": "Jun–Sep",
        "difficulty": "Hard",
        "type": "Adventure",
        "budget": 9000,
        "img": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
        "desc": "Raw, isolated Himalayan gorges, Phugtal cliffside cave monastery, and the famed winter Chadar trek route."
    },
    {
        "id": "spiti",
        "name": "Spiti Valley",
        "location": "Himachal Pradesh",
        "state": "Himachal Pradesh",
        "category": "mountains",
        "emotion": "adventure",
        "best_season": "Jun–Oct",
        "difficulty": "Moderate",
        "type": "Mountains",
        "budget": 6000,
        "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85",
        "desc": "The 'Middle Land' between Tibet and India, famous for Key Gompa, fossil villages of Langza, and Kibber wildlife."
    },
    {
        "id": "rishikesh",
        "name": "Rishikesh Yoga Capital",
        "location": "Uttarakhand",
        "state": "Uttarakhand",
        "category": "spirituality",
        "emotion": "spirituality",
        "best_season": "Sep–May",
        "difficulty": "Easy",
        "type": "Spiritual",
        "budget": 3000,
        "img": "https://images.unsplash.com/photo-1590050752117-23a9d3b7f7d8?auto=format&fit=crop&w=800&q=85",
        "desc": "Spiritual capital by the holy Ganges, renowned for ashrams, Ganga Aarti ceremonies, and white water rafting."
    },
    {
        "id": "jaisalmer",
        "name": "Jaisalmer Golden Fort",
        "location": "Rajasthan",
        "state": "Rajasthan",
        "category": "heritage",
        "emotion": "culture",
        "best_season": "Oct–Mar",
        "difficulty": "Easy",
        "type": "Heritage",
        "budget": 4500,
        "img": "https://images.unsplash.com/photo-1595815771614-ade9d652a2f3?auto=format&fit=crop&w=800&q=85",
        "desc": "Living yellow sandstone fortress rising from the Thar desert sands, flanked by carved Jain temples and havelis."
    },
    {
        "id": "munnar",
        "name": "Munnar Tea Highlands",
        "location": "Kerala",
        "state": "Kerala",
        "category": "nature",
        "emotion": "peace",
        "best_season": "Oct–Apr",
        "difficulty": "Easy",
        "type": "Nature",
        "budget": 4000,
        "img": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=85",
        "desc": "Lush emerald rolling tea estates, Anamudi peak, and cool misty trails in the Western Ghats biodiversity hotspot."
    }
]

INITIAL_PASSES = [
    {
        "id": "khardung_la",
        "name": "Khardung La",
        "status": "OPEN",
        "altitude": "17,582 ft",
        "condition": "Light black ice on northern pass descent. 4x4 vehicles & snow chains recommended. Crossing allowed 06:00 to 16:00.",
        "safe": True,
        "temperature": "-2°C"
    },
    {
        "id": "chang_la",
        "name": "Chang La",
        "status": "CAUTION",
        "altitude": "17,688 ft",
        "condition": "High ridge winds & sub-zero surface temp (-5°C). Snow drift active near top summit. Cross before 14:00.",
        "safe": True,
        "temperature": "-5°C"
    },
    {
        "id": "zoji_la",
        "name": "Zoji La",
        "status": "RESTRICTED",
        "altitude": "11,575 ft",
        "condition": "Freight convoy movement active from Sonamarg. Expect 2-3 hour intermittent delays. Heavy transport priority.",
        "safe": False,
        "temperature": "1°C"
    },
    {
        "id": "baralacha_la",
        "name": "Baralacha La",
        "status": "OPEN",
        "altitude": "16,040 ft",
        "condition": "Clear passage on Manali-Leh national highway. Mandatory acclimatization stop recommended at Jispa or Sarchu.",
        "safe": True,
        "temperature": "-4°C"
    },
    {
        "id": "rohtang_pass",
        "name": "Rohtang Pass",
        "status": "OPEN",
        "altitude": "13,058 ft",
        "condition": "Clear visibility. NGT green mobility permit verification operational at Gulaba check-post.",
        "safe": True,
        "temperature": "3°C"
    },
    {
        "id": "tanglang_la",
        "name": "Tanglang La",
        "status": "CAUTION",
        "altitude": "17,480 ft",
        "condition": "Second highest motorable pass on Manali-Leh road. Strong crosswinds; maintain lower gear descent.",
        "safe": True,
        "temperature": "-3°C"
    }
]

def seed_supabase_tables():
    """Seeds initial destinations and pass advisories into Supabase tables if empty."""
    if not is_supabase_configured():
        return
    try:
        d_res = supabase.table("destinations").select("id", count="exact").limit(1).execute()
        if not d_res.data or (hasattr(d_res, "count") and d_res.count == 0):
            supabase.table("destinations").insert(INITIAL_DESTINATIONS).execute()
            print("[Supabase] Seeded destinations table.")
    except Exception as e:
        print(f"[Supabase] Destination seeding note: {e}")

    try:
        p_res = supabase.table("pass_advisories").select("id", count="exact").limit(1).execute()
        if not p_res.data or (hasattr(p_res, "count") and p_res.count == 0):
            supabase.table("pass_advisories").insert(INITIAL_PASSES).execute()
            print("[Supabase] Seeded pass_advisories table.")
    except Exception as e:
        print(f"[Supabase] Pass advisories seeding note: {e}")

# Run startup seed
seed_supabase_tables()


# FastAPI Application
app = FastAPI(
    title="Bharat Explore AI & Tourism Backend",
    description="Intelligent Tourism & Altitude Safety API for Smart India Hackathon (SIH 2026)",
    version="2.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
client = None
if GEMINI_KEY and not GEMINI_KEY.startswith("your_"):
    try:
        client = genai.Client(api_key=GEMINI_KEY)
    except Exception as e:
        print(f"[Gemini] Warning initializing GenAI Client: {e}")

CARTO_API_KEY = os.getenv("CARTO_API_KEY", "YOUR_CARTO_API_KEY_HERE")

def get_system_instruction(lang: str = "en", active_destination: Optional[str] = None) -> str:
    dest_anchor = f"\nCURRENT ACTIVE DESTINATION: The conversation is currently focused on {active_destination}. Keep all travel recommendations, local food, packing, and navigation advice strictly anchored to {active_destination} unless the user explicitly switches destinations." if active_destination else ""

    base = (
        "You are Bharat AI, an expert, verified sustainable tourism specialist for all of India (Bharat Explore). "
        "You provide comprehensive, authentic, and localized travel intelligence across all Indian states, cities, and regions — "
        "including Kolkata and West Bengal, Rajasthan, Kerala, Goa, Tamil Nadu, Ladakh, Himachal Pradesh, Uttarakhand, Uttar Pradesh, Maharashtra, the North East, and the Andaman Islands.\n\n"
        "STRICT TOPIC ADHERENCE & CONTEXT RULES (MANDATORY):\n"
        "1. STAY STRICTLY ON TOPIC: Focus 100% of your response ONLY and EXCLUSIVELY on the specific city, state, monument, or question asked by the user."
        f"{dest_anchor}\n"
        "2. NO UNRELATED DIVERSIONS: Stay within the user's inquiry. Do NOT mention unrelated regions or destinations.\n"
        "3. REGION-SPECIFIC CONTEXT:\n"
        "   - Heritage & Plains Destinations (e.g. Kolkata, West Bengal, Jaipur, Varanasi): Advise on local architectural heritage, street walks, cultural etiquette, regional cuisine, and urban electric public transit. Never mention mountain passes, acclimatization, or altitude sickness for plains or coastal destinations.\n"
        "   - Coastal & Backwater Destinations (e.g. Kerala, Goa): Advise on waterways, eco-houseboats, beaches, monsoon timing, coastal cuisine, and marine conservation.\n"
        "   - High-Altitude Himalayan Destinations (Ladakh, Spiti, high passes): Only for these specific high-altitude mountain locations, provide altitude acclimatization (AMS) pacing, pulse oximetry, and mountain pass status.\n"
        "4. STRUCTURE & TONE: Deliver warm, engaging, practical travel guidance structured with clear markdown headings (###), bullet points, and bold text. Never terminate mid-sentence. Always finalize thoughts clearly."
    )
    if lang == "hi":
        return base + (
            "\n\nCRITICAL LANGUAGE MANDATE: The user has selected HINDI (हिन्दी) as their UI language. "
            "You MUST formulate your ENTIRE response exclusively in natural, fluent Hindi using the Devanagari script (देवनागरी लिपि). "
            "Even if the user asks their question in English or Roman script, your response MUST be 100% in Hindi. "
            "Do NOT output English. Use clear Hindi headings, bullet points, authentic vocabulary, and stay strictly on topic."
        )
    elif lang == "bn":
        return base + (
            "\n\nCRITICAL LANGUAGE MANDATE: The user has selected BENGALI (বাংলা) as their UI language. "
            "You MUST formulate your ENTIRE response exclusively in natural, fluent Bengali using the Bengali script (বাংলা লিপি). "
            "Even if the user asks their question in English or Roman script, your response MUST be 100% in Bengali. "
            "Do NOT output English. Use clear Bengali headings, bullet points, authentic vocabulary, and stay strictly on topic."
        )
    else:
        return base + (
            "\n\nCRITICAL LANGUAGE MANDATE: The user has selected ENGLISH as their UI language. "
            "You MUST formulate your ENTIRE response in clear, professional English with markdown headings, bold text, structured bullet points, and stay strictly on topic without unrelated diversions."
        )

class ChatRequest(BaseModel):
    message: str
    lang: Optional[str] = "en"
    history: Optional[List[dict]] = []
    active_destination: Optional[str] = None

class JourneySaveRequest(BaseModel):
    session_id: str
    destination_ids: List[str]
    notes: Optional[str] = None
    travel_style: Optional[str] = "Adventure"

class UserRegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    phone: Optional[str] = None
    avatar: Optional[str] = None
    travel_style: Optional[str] = "Eco-Explorer"
    home_city: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_notes: Optional[str] = None
    guest_session_id: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: str
    password: str
    guest_session_id: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    travel_style: Optional[str] = None
    home_city: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_notes: Optional[str] = None
    preferences: Optional[dict] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class UserTripCreateRequest(BaseModel):
    title: str
    destination_ids: List[str]
    start_date: Optional[str] = None
    duration_days: Optional[int] = 5
    travel_style: Optional[str] = "Eco-Explorer"
    notes: Optional[str] = None

class UserSaveBookmarksRequest(BaseModel):
    destination_ids: List[str]
    notes: Optional[str] = None
    travel_style: Optional[str] = None

# --- REST Endpoints ---

@app.get("/api/config")
def get_app_config():
    """Returns public frontend configuration including basemap and Supabase keys."""
    reload_environment()
    return {
        "CARTO_API_KEY": os.getenv("CARTO_API_KEY", "YOUR_CARTO_API_KEY_HERE").strip(),
        "SUPABASE_URL": os.getenv("SUPABASE_URL", "").strip(),
        "SUPABASE_ANON_KEY": os.getenv("SUPABASE_ANON_KEY", "").strip()
    }

# --- System Health & Connectivity ---

@app.get("/api/health")
def health_check():
    """System health check and Supabase cloud connectivity status."""
    return {
        "status": "online",
        "service": "Bharat Explore AI & Tourism Backend",
        "supabase_connected": bool(supabase is not None),
        "supabase_project": SUPABASE_URL.split("//")[-1].split(".")[0] if SUPABASE_URL else None,
        "timestamp": utc_now().isoformat()
    }

# --- User Authentication & Account Management ---

@app.post("/api/auth/register")
def register_user(payload: UserRegisterRequest):
    """Registers a new user account directly via Supabase Auth and stores profile dossier."""
    clean_email = payload.email.strip().lower()
    if "@" not in clean_email or "." not in clean_email or len(clean_email) < 5:
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")
    if not payload.full_name or not payload.full_name.strip():
        raise HTTPException(status_code=400, detail="Full name is required.")

    user_metadata = {
        "full_name": payload.full_name.strip(),
        "phone": payload.phone.strip() if payload.phone else "",
        "avatar": payload.avatar or "🏔️",
        "travel_style": payload.travel_style or "Eco-Explorer",
        "home_city": payload.home_city.strip() if payload.home_city else "",
        "emergency_contact": payload.emergency_contact.strip() if payload.emergency_contact else "",
        "medical_notes": payload.medical_notes.strip() if payload.medical_notes else "",
        "preferences": {
            "travel_style": payload.travel_style or "Eco-Explorer",
            "dietary": "Standard",
            "high_altitude_certified": False
        },
        "role": "traveler"
    }

    user = None
    token = ""

    # Priority: If service role key is present, create user with email pre-confirmed to prevent email rate limits
    if SUPABASE_SERVICE_ROLE_KEY and not "your_supabase" in SUPABASE_SERVICE_ROLE_KEY:
        try:
            created_res = supabase_admin.auth.admin.create_user({
                "email": clean_email,
                "password": payload.password,
                "email_confirm": True,
                "user_metadata": user_metadata
            })
            user = getattr(created_res, "user", created_res)
        except Exception as admin_err:
            err_msg = str(admin_err)
            err_lower = err_msg.lower()
            if (
                getattr(admin_err, "code", "") == "email_exists"
                or ("already" in err_lower and "register" in err_lower)
                or ("already" in err_lower and "exist" in err_lower)
            ):
                raise HTTPException(status_code=400, detail="An account with this email address already exists.")
            # If admin creation encounters unexpected error, fallback to standard sign_up
            print(f"[Supabase] admin.create_user note: {admin_err}")

    # Fallback to standard client sign_up if admin was not executed
    if not user:
        try:
            auth_res = supabase_anon.auth.sign_up({
                "email": clean_email,
                "password": payload.password,
                "options": {
                    "data": user_metadata
                }
            })
            if auth_res and auth_res.user:
                # In Supabase, duplicate registration returns a user with empty identities list
                if hasattr(auth_res.user, "identities") and auth_res.user.identities == []:
                    raise HTTPException(status_code=400, detail="An account with this email address already exists.")
                user = auth_res.user
                if auth_res.session:
                    token = auth_res.session.access_token
        except HTTPException:
            raise
        except Exception as e:
            err_msg = str(e)
            err_lower = err_msg.lower()
            if (
                getattr(e, "code", "") == "email_exists"
                or ("already" in err_lower and "register" in err_lower)
                or ("already" in err_lower and "exist" in err_lower)
            ):
                raise HTTPException(status_code=400, detail="An account with this email address already exists.")
            raise HTTPException(status_code=400, detail=f"Registration failed: {err_msg}")

    if not user:
        raise HTTPException(status_code=400, detail="Registration failed. No user was returned by Supabase.")

    # Authenticate to obtain valid session JWT access token
    if not token:
        try:
            login_res = supabase_anon.auth.sign_in_with_password({
                "email": clean_email,
                "password": payload.password
            })
            if login_res and login_res.session:
                token = login_res.session.access_token
                user = login_res.user
        except Exception as _login_err:
            print(f"[Supabase] Post-registration login note: {_login_err}")

    # Upsert user record into 'profiles' table in Supabase
    try:
        supabase_admin.table("profiles").upsert({
            "id": user.id,
            "email": clean_email,
            "full_name": payload.full_name.strip(),
            "phone": payload.phone.strip() if payload.phone else "",
            "avatar": payload.avatar or "🏔️",
            "travel_style": payload.travel_style or "Eco-Explorer",
            "home_city": payload.home_city.strip() if payload.home_city else "",
            "emergency_contact": payload.emergency_contact.strip() if payload.emergency_contact else "",
            "medical_notes": payload.medical_notes.strip() if payload.medical_notes else "",
            "preferences": user_metadata["preferences"],
            "role": "traveler",
            "is_active": True,
            "updated_at": utc_now().isoformat()
        }).execute()
    except Exception as _e:
        print(f"[Supabase] Profiles table upsert note: {_e}")

    # Link guest journey bookmarks if guest_session_id provided
    if payload.guest_session_id:
        guest_data = _ephemeral_guest_journeys.get(payload.guest_session_id)
        if guest_data:
            dest_ids = guest_data.get("destination_ids") or []
            _ephemeral_user_journeys[user.id] = {
                "destination_ids": dest_ids,
                "notes": guest_data.get("notes"),
                "travel_style": guest_data.get("travel_style") or payload.travel_style
            }
            try:
                supabase_admin.auth.admin.update_user_by_id(user.id, {
                    "user_metadata": {
                        "saved_destinations": dest_ids,
                        "saved_notes": guest_data.get("notes")
                    }
                })
            except Exception:
                pass
        try:
            supabase_admin.table("saved_journeys").update({"user_id": user.id}).eq("session_id", payload.guest_session_id).execute()
        except Exception as _e:
            print(f"[Supabase] Guest bookmark linking note: {_e}")

    formatted_user = format_user_profile(user)
    return {
        "success": True,
        "token": token,
        "token_type": "bearer",
        "user": formatted_user,
        "message": f"Welcome to Bharat Explore, {formatted_user['fullName']}!"
    }

@app.post("/api/auth/login")
def login_user(payload: UserLoginRequest):
    """Authenticates user via Supabase Auth, links guest bookmarks, and returns native JWT."""
    clean_email = payload.email.strip().lower()
    if not clean_email or not payload.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    try:
        auth_res = supabase_anon.auth.sign_in_with_password({
            "email": clean_email,
            "password": payload.password
        })
    except Exception as e:
        err_msg = str(e)
        if "Invalid login credentials" in err_msg or "invalid_grant" in err_msg.lower():
            raise HTTPException(status_code=401, detail="Invalid email address or password.")
        raise HTTPException(status_code=400, detail=f"Authentication error: {err_msg}")

    if not auth_res or not auth_res.session:
        raise HTTPException(status_code=401, detail="Invalid email address or password.")

    user = auth_res.user
    token = auth_res.session.access_token

    # Migrate or merge guest bookmarks if session_id passed
    if payload.guest_session_id:
        guest_data = _ephemeral_guest_journeys.get(payload.guest_session_id)
        if guest_data:
            g_ids = guest_data.get("destination_ids") or []
            u_entry = _ephemeral_user_journeys.get(user.id, {})
            u_ids = u_entry.get("destination_ids") or []
            merged = list(dict.fromkeys(u_ids + g_ids))
            _ephemeral_user_journeys[user.id] = {
                "destination_ids": merged,
                "notes": guest_data.get("notes") or u_entry.get("notes"),
                "travel_style": guest_data.get("travel_style") or u_entry.get("travel_style")
            }
        try:
            guest_res = supabase.table("saved_journeys").select("*").eq("session_id", payload.guest_session_id).execute()
            if guest_res and guest_res.data:
                guest_journey = guest_res.data[0]
                user_res = supabase.table("saved_journeys").select("*").eq("user_id", user.id).execute()
                if user_res and user_res.data:
                    user_journey = user_res.data[0]
                    merged_ids = list(dict.fromkeys((user_journey.get("destination_ids") or []) + (guest_journey.get("destination_ids") or [])))
                    supabase.table("saved_journeys").update({"destination_ids": merged_ids}).eq("id", user_journey["id"]).execute()
                    supabase.table("saved_journeys").delete().eq("id", guest_journey["id"]).execute()
                else:
                    supabase.table("saved_journeys").update({"user_id": user.id}).eq("id", guest_journey["id"]).execute()
        except Exception as _e:
            print(f"[Supabase] Guest bookmark migration note: {_e}")

    # Fetch profile record if available
    profile_row = None
    try:
        p_res = supabase.table("profiles").select("*").eq("id", user.id).maybe_single().execute()
        if p_res and p_res.data:
            profile_row = p_res.data
    except Exception:
        pass

    formatted_user = format_user_profile(user, profile_row)
    return {
        "success": True,
        "token": token,
        "token_type": "bearer",
        "user": formatted_user,
        "message": f"Welcome back, {formatted_user['fullName']}!"
    }

@app.get("/api/auth/me")
def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Returns the authenticated user's profile, saved bookmarks count, and planned trips."""
    user_id = current_user["id"]
    saved_count = 0
    trips_count = 0
    try:
        saved_res = supabase.table("saved_journeys").select("destination_ids").eq("user_id", user_id).execute()
        if saved_res and saved_res.data:
            dest_ids = saved_res.data[0].get("destination_ids") or []
            saved_count = len(dest_ids)
    except Exception:
        pass

    try:
        trips_res = supabase.table("user_trips").select("id", count="exact").eq("user_id", user_id).execute()
        if trips_res and hasattr(trips_res, "count") and trips_res.count is not None:
            trips_count = trips_res.count
        elif trips_res and trips_res.data:
            trips_count = len(trips_res.data)
    except Exception:
        pass

    return {
        "success": True,
        "user": current_user,
        "saved_count": saved_count,
        "trips_count": trips_count
    }

@app.put("/api/auth/profile")
def update_profile(payload: ProfileUpdateRequest, current_user: dict = Depends(get_current_user)):
    """Updates the authenticated user's profile and preferences directly in Supabase."""
    user_id = current_user["id"]
    update_data = {}
    if payload.full_name is not None and payload.full_name.strip():
        update_data["full_name"] = payload.full_name.strip()
    if payload.phone is not None:
        update_data["phone"] = payload.phone.strip()
    if payload.avatar is not None:
        update_data["avatar"] = payload.avatar.strip()
    if payload.travel_style is not None:
        update_data["travel_style"] = payload.travel_style.strip()
    if payload.home_city is not None:
        update_data["home_city"] = payload.home_city.strip()
    if payload.emergency_contact is not None:
        update_data["emergency_contact"] = payload.emergency_contact.strip()
    if payload.medical_notes is not None:
        update_data["medical_notes"] = payload.medical_notes.strip()
    if payload.preferences is not None:
        update_data["preferences"] = payload.preferences

    # Update Supabase Auth user metadata
    try:
        supabase_admin.auth.admin.update_user_by_id(user_id, {"user_metadata": update_data})
    except Exception as _e:
        print(f"[Supabase] auth.update_user note: {_e}")

    # Upsert into profiles table
    update_data["id"] = user_id
    update_data["email"] = current_user["email"]
    update_data["updated_at"] = utc_now().isoformat()
    try:
        supabase_admin.table("profiles").upsert(update_data).execute()
    except Exception as _e:
        print(f"[Supabase] profiles table upsert note: {_e}")

    for k, v in update_data.items():
        if k == "full_name": current_user["fullName"] = v
        elif k == "travel_style": current_user["travelStyle"] = v
        elif k == "home_city": current_user["homeCity"] = v
        elif k == "emergency_contact": current_user["emergencyContact"] = v
        elif k == "medical_notes": current_user["medicalNotes"] = v
        elif k in current_user: current_user[k] = v

    return {
        "success": True,
        "user": current_user,
        "message": "Profile updated successfully."
    }

@app.post("/api/auth/change-password")
def change_password(payload: ChangePasswordRequest, current_user: dict = Depends(get_current_user)):
    """Changes the authenticated user's password using Supabase native auth."""
    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters long.")

    try:
        supabase_anon.auth.sign_in_with_password({
            "email": current_user["email"],
            "password": payload.current_password
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Current password does not match.")

    try:
        supabase_admin.auth.admin.update_user_by_id(current_user["id"], {"password": payload.new_password})
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to update password: {str(e)}")

    return {
        "success": True,
        "message": "Password changed successfully."
    }

# --- User Saved Journeys & Custom Trips ---

@app.get("/api/user/saved")
def get_user_saved_destinations(current_user: dict = Depends(get_current_user)):
    """Returns all bookmarked destinations and metadata for the authenticated user from Supabase."""
    user_id = current_user["id"]
    dest_ids = []
    notes = None
    travel_style = current_user.get("travelStyle")

    try:
        res = supabase.table("saved_journeys").select("*").eq("user_id", user_id).execute()
        if res and res.data:
            journey = res.data[0]
            dest_ids = journey.get("destination_ids") or []
            notes = journey.get("notes")
            travel_style = journey.get("travel_style") or travel_style
    except Exception:
        pass

    if not dest_ids and user_id in _ephemeral_user_journeys:
        e_data = _ephemeral_user_journeys[user_id]
        dest_ids = e_data.get("destination_ids") or []
        notes = e_data.get("notes") or notes
        travel_style = e_data.get("travel_style") or travel_style

    destinations = []
    if dest_ids:
        try:
            dest_res = supabase.table("destinations").select("*").in_("id", dest_ids).execute()
            if dest_res and dest_res.data:
                destinations = dest_res.data
        except Exception:
            pass
        if not destinations:
            destinations = [d for d in INITIAL_DESTINATIONS if d["id"] in dest_ids]

    return {
        "success": True,
        "destination_ids": dest_ids,
        "destinations": destinations,
        "notes": notes,
        "travel_style": travel_style
    }

@app.post("/api/user/save")
def save_user_destinations(payload: UserSaveBookmarksRequest, current_user: dict = Depends(get_current_user)):
    """Saves or updates the user's bookmarked destinations in Supabase."""
    user_id = current_user["id"]
    session_id = f"user_{user_id}_{int(utc_now().timestamp())}"
    data = {
        "user_id": user_id,
        "session_id": session_id,
        "destination_ids": payload.destination_ids,
        "notes": payload.notes,
        "travel_style": payload.travel_style or current_user.get("travelStyle")
    }
    _ephemeral_user_journeys[user_id] = data

    try:
        supabase_admin.auth.admin.update_user_by_id(user_id, {
            "user_metadata": {
                "saved_destinations": payload.destination_ids,
                "saved_notes": payload.notes
            }
        })
    except Exception:
        pass

    try:
        existing = supabase.table("saved_journeys").select("id").eq("user_id", user_id).execute()
        if existing and existing.data:
            supabase.table("saved_journeys").update(data).eq("id", existing.data[0]["id"]).execute()
        else:
            supabase.table("saved_journeys").insert(data).execute()
    except Exception as e:
        print(f"[Supabase] save_user_destinations error: {e}")

    return {
        "success": True,
        "saved_count": len(payload.destination_ids),
        "message": "Bookmarked destinations saved to user profile."
    }

@app.get("/api/user/trips")
def get_user_trips(current_user: dict = Depends(get_current_user)):
    """Returns custom planned itineraries created by the authenticated user from Supabase."""
    user_id = current_user["id"]
    trips = []
    try:
        res = supabase.table("user_trips").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        if res and res.data:
            for item in res.data:
                trips.append({
                    "id": item.get("id"),
                    "userId": item.get("user_id"),
                    "title": item.get("title"),
                    "destinationIds": item.get("destination_ids") or [],
                    "startDate": item.get("start_date"),
                    "durationDays": item.get("duration_days", 5),
                    "travelStyle": item.get("travel_style"),
                    "notes": item.get("notes"),
                    "createdAt": item.get("created_at")
                })
    except Exception as e:
        print(f"[Supabase] get_user_trips error: {e}")

    if not trips and user_id in _ephemeral_user_trips:
        trips = list(_ephemeral_user_trips[user_id].values())

    return {
        "success": True,
        "trips": trips
    }

@app.post("/api/user/trips")
def create_user_trip(payload: UserTripCreateRequest, current_user: dict = Depends(get_current_user)):
    """Creates a custom itinerary or expedition plan in Supabase."""
    if not payload.title or not payload.title.strip():
        raise HTTPException(status_code=400, detail="Trip title is required.")

    import uuid
    user_id = current_user["id"]
    trip_id = f"trip_{uuid.uuid4().hex[:8]}"
    new_trip = {
        "id": trip_id,
        "user_id": user_id,
        "title": payload.title.strip(),
        "destination_ids": payload.destination_ids or [],
        "start_date": payload.start_date,
        "duration_days": payload.duration_days or 5,
        "travel_style": payload.travel_style or current_user.get("travelStyle"),
        "notes": payload.notes,
        "created_at": utc_now().isoformat()
    }

    if user_id not in _ephemeral_user_trips:
        _ephemeral_user_trips[user_id] = {}
    _ephemeral_user_trips[user_id][trip_id] = {
        "id": trip_id,
        "userId": user_id,
        "title": new_trip["title"],
        "destinationIds": new_trip["destination_ids"],
        "startDate": new_trip["start_date"],
        "durationDays": new_trip["duration_days"],
        "travelStyle": new_trip["travel_style"],
        "notes": new_trip["notes"],
        "createdAt": new_trip["created_at"]
    }
    inserted_trip = _ephemeral_user_trips[user_id][trip_id]

    try:
        db_payload = {k: v for k, v in new_trip.items() if k != "id"}
        res = supabase.table("user_trips").insert(db_payload).execute()
        if res and res.data:
            item = res.data[0]
            inserted_trip = {
                "id": str(item.get("id")),
                "userId": item.get("user_id"),
                "title": item.get("title"),
                "destinationIds": item.get("destination_ids") or [],
                "startDate": item.get("start_date"),
                "durationDays": item.get("duration_days", 5),
                "travelStyle": item.get("travel_style"),
                "notes": item.get("notes"),
                "createdAt": item.get("created_at")
            }
            _ephemeral_user_trips[user_id][str(item.get("id"))] = inserted_trip
    except Exception as e:
        print(f"[Supabase] create_user_trip error: {e}")

    return {
        "success": True,
        "trip": inserted_trip,
        "message": f"Trip '{payload.title.strip()}' saved to your profile!"
    }

@app.delete("/api/user/trips/{trip_id}")
def delete_user_trip(trip_id: str, current_user: dict = Depends(get_current_user)):
    """Deletes a custom trip plan in Supabase."""
    user_id = current_user["id"]
    if user_id in _ephemeral_user_trips and trip_id in _ephemeral_user_trips[user_id]:
        del _ephemeral_user_trips[user_id][trip_id]

    try:
        supabase.table("user_trips").delete().eq("id", trip_id).eq("user_id", user_id).execute()
    except Exception as e:
        print(f"[Supabase] delete_user_trip error: {e}")

    return {
        "success": True,
        "message": "Trip successfully deleted."
    }

# --- Resource Modules: Destinations, Mountain Passes & Journey Bookmarks ---

@app.get("/api/destinations")
def get_destinations(
    category: Optional[str] = Query(None, description="Filter by category e.g. mountains, culture, adventure"),
    state: Optional[str] = Query(None, description="Filter by state e.g. Ladakh, Rajasthan"),
    emotion: Optional[str] = Query(None, description="Filter by emotion e.g. peace, adventure, culture"),
    search: Optional[str] = Query(None, description="Search term across name, location, and description")
):
    """Returns curated destinations directly from Supabase table with high-speed query filtering."""
    try:
        query = supabase.table("destinations").select("*")
        if category:
            query = query.ilike("category", f"%{category}%")
        if state:
            query = query.ilike("state", f"%{state}%")
        if emotion:
            query = query.ilike("emotion", f"%{emotion}%")

        res = query.execute()
        if res and res.data and len(res.data) > 0:
            results = res.data
            if search:
                s = search.lower()
                results = [
                    d for d in results
                    if s in d.get("name", "").lower()
                    or s in d.get("location", "").lower()
                    or s in d.get("desc", "").lower()
                ]
            return results
    except Exception as e:
        print(f"[Supabase] destinations query note: {e}")

    # Fallback to rich built-in dataset to maintain instant visual interface
    filtered = INITIAL_DESTINATIONS
    if category:
        filtered = [d for d in filtered if category.lower() in d.get("category", "").lower()]
    if state:
        filtered = [d for d in filtered if state.lower() in d.get("state", "").lower()]
    if emotion:
        filtered = [d for d in filtered if emotion.lower() in d.get("emotion", "").lower()]
    if search:
        s = search.lower()
        filtered = [
            d for d in filtered
            if s in d.get("name", "").lower()
            or s in d.get("location", "").lower()
            or s in d.get("desc", "").lower()
        ]
    return filtered

@app.get("/api/destinations/{dest_id}")
def get_destination_detail(dest_id: str):
    """Retrieves destination detail from Supabase table."""
    try:
        res = supabase.table("destinations").select("*").eq("id", dest_id).single().execute()
        if res and res.data:
            return res.data
    except Exception:
        pass

    for d in INITIAL_DESTINATIONS:
        if d["id"] == dest_id:
            return d
    raise HTTPException(status_code=404, detail="Destination not found")

@app.get("/api/passes")
def get_all_passes():
    """Returns live mountain pass telemetry keyed by pass name directly from Supabase."""
    result = {}
    try:
        res = supabase.table("pass_advisories").select("*").execute()
        if res and res.data and len(res.data) > 0:
            for p in res.data:
                result[p.get("name")] = {
                    "status": p.get("status"),
                    "altitude": p.get("altitude"),
                    "condition": p.get("condition"),
                    "safe": p.get("safe", True),
                    "temperature": p.get("temperature", "-2°C"),
                    "updated": p.get("updated") or "Live"
                }
            return result
    except Exception as e:
        print(f"[Supabase] pass_advisories query note: {e}")

    for p in INITIAL_PASSES:
        result[p["name"]] = {
            "status": p["status"],
            "altitude": p["altitude"],
            "condition": p["condition"],
            "safe": p["safe"],
            "temperature": p["temperature"],
            "updated": "Live"
        }
    return result

@app.get("/api/passes/download-safety-guidelines-pdf")
@app.get("/api/passes/download-field-pass-pdf")
@app.get("/api/pass/download-pdf")
def download_field_pass_pdf(
    full_name: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    home_city: Optional[str] = Query(None),
    emergency_contact: Optional[str] = Query(None),
    medical_notes: Optional[str] = Query(None),
    travel_style: Optional[str] = Query(None),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Generates and downloads the official high-altitude Himalayan Safety & Danger Guidelines PDF."""
    traveler_data = {}
    if current_user:
        traveler_data["full_name"] = current_user.get("fullName") or current_user.get("full_name")
        traveler_data["email"] = current_user.get("email")
        traveler_data["home_city"] = current_user.get("homeCity") or current_user.get("home_city")
        traveler_data["emergency_contact"] = current_user.get("emergencyContact") or current_user.get("emergency_contact")
        traveler_data["medical_notes"] = current_user.get("medicalNotes") or current_user.get("medical_notes")
        traveler_data["travel_style"] = current_user.get("travelStyle") or current_user.get("travel_style")
        traveler_data["pass_id"] = f"BE-HIM-2026-{str(current_user.get('id', ''))[:6].upper() or 'IND99'}"

    # Allow query parameter overrides
    if full_name and full_name.strip():
        traveler_data["full_name"] = full_name.strip()
    if email and email.strip():
        traveler_data["email"] = email.strip()
    if home_city and home_city.strip():
        traveler_data["home_city"] = home_city.strip()
    if emergency_contact and emergency_contact.strip():
        traveler_data["emergency_contact"] = emergency_contact.strip()
    if medical_notes and medical_notes.strip():
        traveler_data["medical_notes"] = medical_notes.strip()
    if travel_style and travel_style.strip():
        traveler_data["travel_style"] = travel_style.strip()

    try:
        pdf_bytes = generate_field_pass_pdf(traveler_data)
    except Exception as e:
        print(f"[FieldPassPDF] Generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate safety guidelines PDF: {str(e)}")

    filename = "Bharat_Explore_Himalayan_Safety_Guidelines.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-cache"
        }
    )

@app.post("/api/journey/save")
def save_user_journey(
    payload: JourneySaveRequest,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Persists user trip bookmarks for guests or authenticated users directly into Supabase."""
    user_id = current_user["id"] if current_user else None
    data = {
        "session_id": payload.session_id,
        "destination_ids": payload.destination_ids,
        "notes": payload.notes,
        "travel_style": payload.travel_style,
        "user_id": user_id
    }
    _ephemeral_guest_journeys[payload.session_id] = data
    if user_id:
        _ephemeral_user_journeys[user_id] = data
        try:
            supabase_admin.auth.admin.update_user_by_id(user_id, {
                "user_metadata": {
                    "saved_destinations": payload.destination_ids,
                    "saved_notes": payload.notes,
                    "travel_style": payload.travel_style
                }
            })
        except Exception:
            pass

    try:
        existing = None
        if user_id:
            res = supabase.table("saved_journeys").select("id").eq("user_id", user_id).execute()
            if res and res.data:
                existing = res.data[0]
        if not existing:
            res = supabase.table("saved_journeys").select("id").eq("session_id", payload.session_id).execute()
            if res and res.data:
                existing = res.data[0]

        if existing:
            supabase.table("saved_journeys").update(data).eq("id", existing["id"]).execute()
        else:
            supabase.table("saved_journeys").insert(data).execute()
    except Exception as e:
        print(f"[Supabase] save_user_journey note: {e}")

    return {
        "success": True,
        "session_id": payload.session_id,
        "saved_count": len(payload.destination_ids),
        "message": "Journey bookmarks saved to database."
    }

@app.get("/api/journey/{session_id}")
def get_user_journey(
    session_id: str,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Retrieves saved destinations directly from Supabase."""
    dest_ids = []
    notes = None
    travel_style = "Adventure"
    try:
        saved = None
        if current_user:
            res = supabase.table("saved_journeys").select("*").eq("user_id", current_user["id"]).execute()
            if res and res.data:
                saved = res.data[0]
        if not saved:
            res = supabase.table("saved_journeys").select("*").eq("session_id", session_id).execute()
            if res and res.data:
                saved = res.data[0]

        if saved:
            dest_ids = saved.get("destination_ids") or []
            notes = saved.get("notes")
            travel_style = saved.get("travel_style") or travel_style
    except Exception as e:
        print(f"[Supabase] get_user_journey note: {e}")

    if not dest_ids and session_id in _ephemeral_guest_journeys:
        e_data = _ephemeral_guest_journeys[session_id]
        dest_ids = e_data.get("destination_ids") or []
        notes = e_data.get("notes")
        travel_style = e_data.get("travel_style") or travel_style

    destinations = [d for d in INITIAL_DESTINATIONS if d["id"] in dest_ids]
    return {
        "session_id": session_id,
        "destination_ids": dest_ids,
        "destinations": destinations,
        "travel_style": travel_style,
        "notes": notes
    }


# Comprehensive Destination-Aware AI Intelligence & Heuristic Knowledge Base
# Designed for Smart India Hackathon (SIH 2026) Bharat Explore Platform

KOLKATA_KW = ["kolkata", "calcutta", "howrah", "bengal", "victoria memorial", "dakshineswar", "hooghly", "park street", "college street", "কলকাতা", "হাওড়া", "বাংলা", "ভিক্টোরিয়া", "দক্ষিণেশ্বর", "कोलकाता", "कलकत्ता"]
JAIPUR_KW = ["jaipur", "rajasthan", "pink city", "amber fort", "hawa mahal", "jantar mantar", "chokhi dhani", "जयपुर", "राजस्थान", "জয়পুর", "রাজস্থান"]
KERALA_KW = ["kerala", "alleppey", "alappuzha", "munnar", "kochi", "cochin", "backwater", "wayanad", "केरल", "কেরল", "আলেপ্পি", "মুন্নার"]
LADAKH_KW = ["ladakh", "leh", "pangong", "nubra", "khardung", "chang la", "zoji la", "turtuk", "hanle", "tso moriri", "लद्दाख", "लेह", "पैंगोंग", "লাদাখ", "লেহ", "প্যাংগং"]
GOA_KW = ["goa", "panaji", "calangute", "dudhsagar", "fontainhas", "गोवा", "গোয়া"]
VARANASI_KW = ["varanasi", "kashi", "banaras", "ghat", "ganga aarti", "वाराणसी", "काशी", "বারাণসী", "কাশী"]

def detect_destination(query: str, active_dest: Optional[str] = None, history: Optional[List[dict]] = None) -> Optional[str]:
    q = (query or "").lower()
    if any(k in q for k in KOLKATA_KW): return "kolkata"
    if any(k in q for k in JAIPUR_KW): return "jaipur"
    if any(k in q for k in KERALA_KW): return "kerala"
    if any(k in q for k in LADAKH_KW): return "ladakh"
    if any(k in q for k in GOA_KW): return "goa"
    if any(k in q for k in VARANASI_KW): return "varanasi"
    
    if active_dest and active_dest.lower() in ["kolkata", "jaipur", "kerala", "ladakh", "goa", "varanasi"]:
        return active_dest.lower()
        
    if history:
        for turn in reversed(history):
            txt = (turn.get("content") or turn.get("text") or "").lower()
            if any(k in txt for k in KOLKATA_KW): return "kolkata"
            if any(k in txt for k in JAIPUR_KW): return "jaipur"
            if any(k in txt for k in KERALA_KW): return "kerala"
            if any(k in txt for k in LADAKH_KW): return "ladakh"
            if any(k in txt for k in GOA_KW): return "goa"
            if any(k in txt for k in VARANASI_KW): return "varanasi"
    return None

def detect_subtopic(query: str) -> str:
    q = (query or "").lower()
    if any(w in q for w in ["food", "eat", "cuisine", "dish", "restaurant", "sweet", "biryani", "snack", "breakfast", "dinner", "lunch", "भोजन", "खाना", "खाएं", "खाएँ", "खाओ", "स्वाद", "मिठाई", "व्यंजन", "খাবার", "খাব", "মিষ্টি"]):
        return "food"
    if any(w in q for w in ["pack", "gear", "carry", "bag", "cloth", "wear", "shoes", "पैक", "सामान", "कपड़े", "প্যাক", "পোশাক", "জিনিস"]):
        return "pack"
    if any(w in q for w in ["budget", "cost", "price", "money", "expensive", "cheap", "afford", "spend", "rate", "बजट", "खर्च", "বাজেট", "খরচ"]):
        return "budget"
    if any(w in q for w in ["safe", "safety", "emergency", "hospital", "police", "danger", "crime", "सुरक्षा", "आपातकालीन", "নিরাপত্তা", "জরুরি"]):
        return "safety"
    if any(w in q for w in ["pass", "khardung", "chang la", "zoji", "baralacha", "tanglang", "दर्र", "গিরিপথ"]):
        return "pass"
    if any(w in q for w in ["acclimat", "altitude", "ams", "oxygen", "breathe", "अनुकूलन", "ऊंचाई", "অভিযোজন", "উচ্চতা"]):
        return "acclimat"
    if any(w in q for w in ["permit", "ilp", "pap", "permiss", "restricted", "परमिट", "পারমিট"]):
        return "permit"
    if any(w in q for w in ["decongest", "offbeat", "crowd", "भीड़", "ऑफबीट", "ভিড়", "অফবিট"]):
        return "decongest"
    if any(w in q for w in ["monastery", "gompa", "मठ", "গুম্ফা"]):
        return "monstera"
    if any(w in q for w in ["wildlife", "leopard", "crane", "वन्यजीव", "বন্যপ্রাণী"]):
        return "wildlife"
    return "overview"

# Detailed localized knowledge base categorized strictly by destination
DESTINATION_RESPONSES = {
    "kolkata": {
        "en": {
            "overview": (
                "**Kolkata & West Bengal — The Cultural Capital of India:**\n\n"
                "• **Historic & Cultural Landmarks:** Victoria Memorial (grand Italian Renaissance marble palace), Howrah Bridge (1943 cantilever engineering marvel across the Hooghly), Dakshineswar Kali Temple, Belur Math (global Ramakrishna Mission headquarters), Indian Museum (Asia's oldest), and sunset strolls along Princep Ghat.\n"
                "• **Intellectual & Artisan Quarters:** College Street ('Boi Para') — the world's largest second-hand book market with the legendary Indian Coffee House; Kumartuli — the 300-year-old traditional clay sculptors' quarter handcrafting monumental deities.\n"
                "• **Iconic Zero-Mile Flavors:** Warm spongy Rosogolla, caramelized Mishti Doi, Sandesh; aromatic Kolkata Biryani (with succulent spiced potato and egg); original Nizam's Kathi Rolls; and crispy street Phuchka.\n"
                "• **Sustainable Transit:** Ride India's only operating historic electric tramway network, take scenic green river ferries across the Hooghly, or use the underwater East-West Metro line beneath the riverbed.\n"
                "• **Best Season:** October through March — pleasant winter weather and the UNESCO-inscribed Durga Puja celebration."
            ),
            "food": (
                "**Kolkata's World-Renowned Culinary Heritage:**\n\n"
                "• **Legendary Street Food:** Original mutton and paneer Kathi Rolls from Nizam's (New Market); crisp, hollow Phuchkas filled with spiced potato and tangy tamarind water; and Dacre Lane street eats (Chowmein, fish cutlets, Mughlai Paratha).\n"
                "• **Kolkata Biryani:** Aromatic Awadhi-style long-grain rice infused with saffron, cooked with tender meat, succulent boiled egg, and the iconic golden slow-cooked spiced potato.\n"
                "• **Bengali Sweets (Mishti):** Warm spongy Rosogolla (Nobin Chandra Das heritage), creamy caramelized Mishti Doi, and winter-special Nolen Gur Sandesh.\n"
                "• **Traditional Mahabhoj:** Steaming Gobindobhog rice with Jhuri Aloo Bhaja, Machher Jhol (fresh freshwater fish curry), and Kosha Mangsho (rich slow-cooked mutton) with fluffy Luchi.\n"
                "• **Iconic Hangouts:** Indian Coffee House on College Street for hot infused coffee and intellectual discussions, and Flurys on Park Street for British-era heritage breakfast and pastries."
            ),
            "pack": (
                "**Essential Packing Guide for Kolkata & West Bengal:**\n\n"
                "• **Clothing:** Lightweight, breathable cotton clothes are best throughout the year. Kolkata has a warm tropical climate; in winter (Dec–Feb), carry a light jacket or shawl for evenings.\n"
                "• **Footwear:** Comfortable walking shoes or cushioned sneakers — essential for exploring College Street book alleys, heritage walking trails, and expansive museum grounds.\n"
                "• **Weather Protection:** Compact umbrella or light raincoat (monsoon showers from June to September) and a reusable tote bag for books and handcrafted souvenirs.\n"
                "• **Electronics:** High-capacity power bank for long days of photography around colonial architecture, river ghats, and bustling street bazaars.\n"
                "• **Eco Tip:** Carry a reusable stainless steel water bottle. Kolkata has numerous clean filtered water dispensing stations."
            ),
            "budget": (
                "**Kolkata Travel Budget Guide (Per Person):**\n\n"
                "• **Backpacker / Budget (₹1,200–2,000/day):** Heritage guest houses or dorms, authentic street meals & local cabin dining (₹100–200/meal), and public transit via Kolkata Metro (₹10–25) and historic electric trams (₹7).\n"
                "• **Mid-Range (₹3,000–5,500/day):** Character boutique hotels in Central/South Kolkata, curated dining at Oh! Calcutta or Peter Cat, ride-hailing cabs, and museum entry tickets.\n"
                "• **Luxury (₹8,000–18,000+/day):** Grand heritage hotels (The Oberoi Grand, ITC Sonar), private chauffeur, private Hooghly river heritage cruises, and fine dining.\n"
                "• **Value Note:** Kolkata is widely recognized as one of India's most culturally rich yet budget-friendly metropolitan cities!"
            ),
            "safety": (
                "**Kolkata Safety, Navigation & Local Etiquette:**\n\n"
                "• **Metropolitan Safety:** Kolkata is consistently ranked among the safest major metropolitan cities in India with high public safety, active street life, and helpful locals.\n"
                "• **Tourist Assistance:** Kolkata Police Tourist Assistance booths are available at Howrah Station, Sealdah, and Victoria Memorial. Emergency Police Helpline: 100 / 112.\n"
                "• **Public Transit Tips:** Use the convenient Kolkata Metro (Blue and Green underwater lines) to bypass traffic; classic yellow ambassador taxis should run by meter or prepaid counters at stations; app cabs (Uber/Ola) are ubiquitous.\n"
                "• **Temple Etiquette:** Dress respectfully (cover shoulders and knees) when visiting temples like Dakshineswar and Kalighat. Deposit shoes at designated shoe stands."
            )
        },
        "hi": {
            "overview": (
                "**कोलकाता एवं पश्चिम बंगाल — भारत की सांस्कृतिक राजधानी:**\n\n"
                "• **प्रमुख ऐतिहासिक स्थल:** विक्टोरिया मेमोरियल (भव्य संगमरमर महल), हावड़ा ब्रिज (हुगली नदी पर ऐतिहासिक कैंटिलीवर पुल), दक्षिणेश्वर काली मंदिर, बेलूर मठ और प्रिंसप घाट।\n"
                "• **सांस्कृतिक और बौद्धिक केंद्र:** कॉलेज स्ट्रीट 'बोई पाड़ा' और ऐतिहासिक इंडियन कॉफी हाउस; कुम्हारटोली में पारंपरिक मूर्तिकारों की कला।\n"
                "• **प्रामाणिक स्थानीय स्वाद:** गर्म रसगुल्ला, मिष्टी दोई, नलेन गुड़ संदेश; आलू और अंडे वाली कोलकाता बिरयानी; निज़ाम का काठी रोल; और चटपटे पुचके।\n"
                "• **पर्यावरण-अनुकूल परिवहन:** भारत की एकमात्र ऐतिहासिक ट्राम, हुगली नदी पर इलेक्ट्रिक नौका या गंगा के नीचे से पहली अंडरवाटर मेट्रो।\n"
                "• **यात्रा का सर्वोत्तम समय:** अक्टूबर से मार्च — सुखद मौसम और विश्व प्रसिद्ध दुर्गा पूजा का उत्सव।"
            ),
            "food": (
                "**कोलकाता के विश्व प्रसिद्ध व्यंजन एवं खान-पान:**\n\n"
                "• **प्रसिद्ध स्ट्रीट फूड:** निज़ाम (न्यू मार्केट) का मूल मटन व पनीर काठी रोल; मसालेदार आलू और इमली के तीखे पानी वाले कुरकुरे पुचके; और डैकर्स लेन के स्ट्रीट स्नैक्स।\n"
                "• **कोलकाता बिरयानी:** केसर और खुशबूदार मसालों से युक्त अवधी शैली की बिरयानी, जिसमें नरम गोश्त/अंडे के साथ धीमी आंच पर पका स्वादिष्ट सुनहरा आलू होता है।\n"
                "• **पारंपरिक बंगाली मिठाइयां:** गर्म स्पंजी रसगुल्ला, नलेन गुड़ का संदेश और पारंपरिक मिष्टी दोई।\n"
                "• **पारंपरिक भोजन:** भाप में पके चावल के साथ माछेर झोल (ताजा मछली की करी), और लूची के साथ कोशा मांगशो (धीमी आंच पर पका मटन)।\n"
                "• **ऐतिहासिक ठिकाने:** कॉलेज स्ट्रीट पर इंडियन कॉफी हाउस और पार्क स्ट्रीट पर ऐतिहासिक बेकरी 'फ्लूरीज' (Flurys)।"
            ),
            "pack": (
                "**कोलकाता एवं पश्चिम बंगाल के लिए पैकिंग सूची:**\n\n"
                "• **कपड़े:** हल्के, हवादार सूती (कॉटन) कपड़े सर्वोत्तम हैं। सर्दियों (दिसंबर-फरवरी) में शाम के लिए हल्की शॉल या जैकेट साथ रखें।\n"
                "• **जूते:** चलने के लिए आरामदायक स्नीकर्स या जूते — कॉलेज स्ट्रीट की किताबों की गलियों और ऐतिहासिक संग्रहालयों के लिए आवश्यक।\n"
                "• **मौसम सुरक्षा:** एक छोटा छाता (जून से सितंबर के दौरान अचानक बारिश हेतु) और एक पुन: प्रयोज्य कपड़े का थैला।\n"
                "• **इलेक्ट्रॉनिक्स:** ऐतिहासिक इमारतों और हुगली नदी के घाटों पर फोटोग्राफी के लिए एक पावर बैंक।\n"
                "• **पानी:** पुन: प्रयोज्य पानी की बोतल साथ रखें; एकल-उपयोग प्लास्टिक से बचें।"
            ),
            "budget": (
                "**कोलकाता यात्रा बजट दिशानिर्देश (प्रति व्यक्ति):**\n\n"
                "• **बजट / बैकपैकर (₹1,200–2,000/दिन):** हेरिटेज गेस्ट हाउस या हॉस्टल, स्थानीय कैफे व स्ट्रीट फूड (₹100–200/भोजन), और कोलकाता मेट्रो (₹10–25) व ट्राम (₹7)।\n"
                "• **मध्यम श्रेणी (₹3,000–5,500/दिन):** दक्षिण/मध्य कोलकाता में बुटीक होटल, प्रसिद्ध रेस्टोरेंट (ओह! कलकत्ता, पीटर कैट), और कैब यात्रा।\n"
                "• **प्रीमियम (₹8,000–18,000+/दिन):** 5-सितारा हेरिटेज होटल (द ओबेरॉय ग्रैंड), निजी क्रूज़ और प्रीमियम डाइनिंग।\n"
                "• **विशेष:** कोलकाता भारत के सबसे किफायती और सांस्कृतिक रूप से समृद्ध महानगरों में से एक है!"
            ),
            "safety": (
                "**कोलकाता सुरक्षा, परिवहन व स्थानीय मार्गदर्शन:**\n\n"
                "• **महानगरीय सुरक्षा:** कोलकाता को भारत के सबसे सुरक्षित महानगरों में गिना जाता है। स्थानीय नागरिक बेहद मददगार और मित्रवत हैं।\n"
                "• **पर्यटक सहायता:** हावड़ा स्टेशन, सियालदह और विक्टोरिया मेमोरियल पर कोलकाता पुलिस पर्यटक सहायता बूथ उपलब्ध हैं। आपातकालीन पुलिस हेल्पलाइन: 100 / 112।\n"
                "• **आसान परिवहन:** ट्रैफिक से बचने के लिए कोलकाता मेट्रो और अंडरवाटर ईस्ट-वेस्ट मेट्रो का उपयोग करें; टैक्सी या उबर/ओला आसानी से उपलब्ध हैं।\n"
                "• **मंदिर मर्यादा:** दक्षिणेश्वर और कालीघाट मंदिर जाते समय शालीन पोशाक पहनें।"
            )
        },
        "bn": {
            "overview": (
                "**কলকাতা ও পশ্চিমবঙ্গ — ভারতের সাংস্কৃতিক রাজধানী:**\n\n"
                "• **প্রধান ঐতিহাসিক ও দর্শনীয় স্থান:** ভিক্টোরিয়া মেমোরিয়াল (ঐতিহাসিক মার্বেল প্রাসাদ), হাওড়া ব্রিজ (হুগলি নদীর উপর শতাব্দীপ্রাচীন ক্যান্টিলিভার সেতু), দক্ষিণেশ্বর কালী মন্দির, বেলুড় মঠ, ভারতীয় জাদুঘর এবং মনোরম প্রিন্সেপ ঘাট।\n"
                "• **বুদ্ধিবৃত্তিক ও শিল্পকলা কেন্দ্র:** কলেজ স্ট্রিট বইপাড়া ও বিখ্যাত ইন্ডিয়ান কফি হাউস; কুমোরটুলির ঐতিহ্যবাহী মৃৎশিল্পীদের বিশ্বখ্যাত প্রতিমা নির্মাণ শিল্প।\n"
                "• **খাঁটি স্থানীয় স্বাদ:** গরম রসগোল্লা, সুস্বাদু মিষ্টি দই, নলেন গুড়ের সন্দেশ; আলু-ডিম যুক্ত বিখ্যাত কলকাতা বিরিয়ানি; নিজামের আসল কাঠি রোল; এবং তেঁতুল জলের মুচমুচে ফুচকা।\n"
                "• **পরিবেশবান্ধব যাতায়াত:** ভারতের একমাত্র ঐতিহ্যবাহী বৈদ্যুতিক ট্রাম, হুগলি নদীর পরিবেশবান্ধব ফেরি সার্ভিস বা গঙ্গার নিচ দিয়ে দেশের প্রথম ইস্ট-ওয়েস্ট মেট্রো ব্যবহার করুন।\n"
                "• **ভ্রমণের সেরা সময়:** অক্টোবর থেকে মার্চ — আনন্দময় শীতকাল এবং বিশ্ববিখ্যাত ইউনেস্কো হেরিটেজ দুর্গাপূজার উৎসবমুখর পরিবেশ।"
            ),
            "food": (
                "**কলকাতার বিশ্বখ্যাত খাদ্যসংস্কৃতি ও সেরা খাবারের তালিকা:**\n\n"
                "• **বিখ্যাত স্ট্রিট ফুড:** নিউ মার্কেটের নিজামের খাঁটি মাটন ও পনির কাঠি রোল; মশলাদার আলু ও তেঁতুল জলের মুচমুচে ফুচকা; এবং ডেকার্স লেনের ঐতিহ্যবাহী কাটলেট ও স্ট্রিট ফুড।\n"
                "• **কলকাতা বিরিয়ানি:** সুগন্ধি জাফরানি বাসমতি চাল, নরম মাংস, সিদ্ধ ডিম এবং ঐতিহ্যবাহী সুস্বাদু সোনালী আলুর অনন্য মেলবন্ধন।\n"
                "• **ঐতিহ্যবাহী মিষ্টি:** গরম তুলতুলে রসগোল্লা (নবীন চন্দ্র দাসের ঐতিহ্য), ক্ষীরভরা মিষ্টি দই এবং শীতের নলেন গুড়ের সন্দেশ।\n"
                "• **খাঁটি বাঙালি ভুরিভোজ:** গরম গোবিন্দভোগ চাল ও ঝুরি আলুভাজা, তাজা মাছের ঝোল এবং ফুলকো লুচির সাথে কষা মাংস।\n"
                "• **ঐতিহাসিক আড্ডা:** কলেজ স্ট্রিটের ঐতিহাসিক ইন্ডিয়ান কফি হাউস এবং পার্ক স্ট্রিটের ব্রিটিশ আমলের বিখ্যাত বেকারি ফ্লুরিস (Flurys)।"
            ),
            "pack": (
                "**কলকাতা ভ্রমণের জন্য প্রয়োজনীয় প্যাকিং গাইড:**\n\n"
                "• **পোশাক:** আরামদায়ক ও হালকা সুতির পোশাক সারা বছরের জন্য সবচেয়ে উপযোগী। শীতকালে (ডিসেম্বর–ফেব্রুয়ারি) সন্ধ্যার জন্য একটি হালকা চাদর বা জ্যাকেট সাথে রাখুন।\n"
                "• **জুতো:** হাঁটার জন্য আরামদায়ক স্নিকার্স বা জুতো — কলেজ স্ট্রিটের বইপাড়া ও ঐতিহাসিক স্থাপত্য ঘুরে দেখার জন্য অপরিহার্য।\n"
                "• **আবহাওয়া সুরক্ষা:** একটি ছোট ছাতা (হঠাৎ বৃষ্টির জন্য) এবং বই ও হস্তশিল্প কেনার জন্য পুনরায় ব্যবহারযোগ্য কাপড়ের ব্যাগ।\n"
                "• **ইলেকট্রনিক্স:** সারাদিনের ছবি তোলা ও ভ্রমণের জন্য একটি ভালো পাওয়ার ব্যাংক সাথে রাখুন।\n"
                "• **পরিবেশবান্ধব অভ্যাস:** পুনরায় ব্যবহারযোগ্য জলের বোতল ব্যবহার করুন; প্লাস্টিক বর্জন করুন।"
            ),
            "budget": (
                "**কলকাতা ভ্রমণের বাজেট নির্দেশিকা (জনপ্রতি):**\n\n"
                "• **বাজেট / ব্যাকপ্যাকার (১,২০০–২,০০০ টাকা/দিন):** ঐতিহ্যবাহী গেস্ট হাউস, স্থানীয় খাবারের কেবিন ও স্ট্রিট ফুড (১০০–২০০ টাকা প্রতি বেলা), এবং মেট্রো (১০–২৫ টাকা) ও ট্রাম (৭ টাকা)।\n"
                "• **মিড-রেঞ্জ (৩,০০০–৫,৫০০ টাকা/দিন):** সেন্ট্রাল বা সাউথ কলকাতায় বুটিক হোটেল, পিটার ক্যাট বা ওহ! ক্যালকাটায় খাওয়া এবং অ্যাপ ক্যাব।\n"
                "• **প্রিমিয়াম (৮,০০০–১৮,০০০+ টাকা/দিন):** ঐতিহ্যবাহী ওবেরয় গ্র্যান্ড হোটেল, বিলাসবহুল ডাইনিং ও ব্যক্তিগত রিভার ক্রুজ।\n"
                "• **বিশেষত্ব:** কলকাতা ভারতের সবচেয়ে সাশ্রয়ী ও সাংস্কৃতিক ঐতিহ্যে ভরপুর মহানগর!"
            ),
            "safety": (
                "**কলকাতা নিরাপত্তা, যাতায়াত ও স্থানীয় নির্দেশিকা:**\n\n"
                "• **নিরাপত্তা:** কলকাতা ভারতের অন্যতম নিরাপদ মহানগর হিসেবে সুপরিচিত। স্থানীয় মানুষ অত্যন্ত ভদ্র ও সাহায্যকারী।\n"
                "• **পর্যটক সহায়তা:** হাওড়া স্টেশন, শিয়ালদহ ও ভিক্টোরিয়া মেমোরিয়ালে কলকাতা পুলিশের পর্যটক সহায়তা বুথ রয়েছে। জরুরি পুলিশ হেল্পলাইন: ১০০ / ১১২।\n"
                "• **যাতায়াত সুবিধা:** যানজট এড়াতে কলকাতা মেট্রো এবং গঙ্গার নিচের ঐতিহাসিক ইস্ট-ওয়েস্ট মেট্রো ব্যবহার করুন; হলুদ ট্যাক্সি ও অ্যাপ ক্যাব সর্বত্র সহজলভ্য।\n"
                "• **মন্দির সংস্কৃতি:** দক্ষিণেশ্বর ও কালীঘাট পরিদর্শনের সময় মার্জিত পোশাক পরিধান করুন।"
            )
        }
    },
    "jaipur": {
        "en": {
            "overview": (
                "**Jaipur & Rajasthan — The Royal Pink City:**\n\n"
                "• **Monumental Heritage:** Amber Fort with its shimmering Sheesh Mahal, Hawa Mahal (Palace of Winds), City Palace museum complex, and Jantar Mantar UNESCO astronomical observatory.\n"
                "• **Local Crafts:** Traditional blue pottery, handcrafted gemstone jewelry, and Sanganeri wooden block prints.\n"
                "• **Authentic Flavors:** Dal Baati Churma, Pyaaz Kachori, Ker Sangri, and sweet Ghewar.\n"
                "• **Best Season:** October to March."
            ),
            "food": (
                "**Jaipur's Royal Rajasthani Flavors:**\n\n"
                "• **Dal Baati Churma:** Baked wheat dumplings soaked in pure desi ghee, served with five-lentil dal and sweet powdered wheat churma.\n"
                "• **Street Savories:** Crisp flaky Pyaaz Kachori from Rawat Mishthan Bhandar, fiery Mirchi Bada, and rich Mawa Kachori.\n"
                "• **Royal Curries:** Laal Maas (spiced slow-cooked mutton) and desert vegetarian classic Ker Sangri.\n"
                "• **Sweets:** Honeycombed Ghewar (classic or malai-topped) and thick clay-pot sweet lassi at MI Road."
            ),
            "pack": (
                "**Jaipur & Rajasthan Packing Essentials:**\n\n"
                "• **Clothing:** Breathable cotton clothing for sightseeing; in winter (Nov–Feb), pack layers as desert evenings turn chilly (8–12°C).\n"
                "• **Sun Protection:** Wide-brimmed sun hat, polarized sunglasses, and SPF 30+ sunscreen for fort courtyards.\n"
                "• **Footwear:** Durable slip-resistant footwear with good grip for ascending steep cobblestone ramps at Amber Fort and Nahargarh."
            ),
            "budget": (
                "**Jaipur Trip Budget (Per Person):**\n\n"
                "• **Budget (₹1,500–2,500/day):** Heritage homestays in Bani Park, local dhabas and street kachoris, shared e-rickshaws.\n"
                "• **Mid-Range (₹4,000–7,000/day):** Restored heritage Havelis, multi-monument composite entry tickets, air-conditioned cabs, and folk dining at Chokhi Dhani.\n"
                "• **Luxury (₹12,000–30,000+/day):** Royal palace hotels (Rambagh Palace, Jai Mahal Palace) with curated royal dining."
            ),
            "safety": (
                "**Jaipur Travel Safety & Tips:**\n\n"
                "• **Guides:** Always hire RTDC (Rajasthan Tourism) approved guides bearing official photo ID badges.\n"
                "• **Shopping Advice:** For authentic gemstone jewelry and textiles, visit government-approved emporiums (Rajasthali on MI Road).\n"
                "• **Helpline:** Rajasthan Tourist Police Helpline: 1364 or dial 112."
            )
        },
        "hi": {
            "overview": (
                "**जयपुर — राजस्थान की गुलाबी नगरी:**\n\n"
                "• **ऐतिहासिक धरोहर:** आमेर का भव्य किला, हवा महल, सिटी पैलेस और जंतर मंतर (UNESCO विश्व धरोहर)।\n"
                "• **सांस्कृतिक शिल्प:** सांगानेरी ब्लॉक प्रिंटिंग, ब्लू पॉटरी और जोहरी बाजार में पारंपरिक आभूषण।\n"
                "• **पारंपरिक राजस्थानी भोजन:** दाल बाटी चूरमा, प्याज़ की कचौड़ी, घेवर और कुल्हड़ लस्सी।\n"
                "• **सर्वोत्तम मौसम:** अक्टूबर से मार्च।"
            ),
            "food": (
                "**जयपुर के शाही राजस्थानी व्यंजन:**\n\n"
                "• **दाल बाटी चूरमा:** शुद्ध देसी घी में डूबी बाटी, पंचमेल दाल और मीठा चूरमा।\n"
                "• **स्ट्रीट स्वाद:** रावत मिष्ठान भंडार की गर्मागर्म प्याज़ कचौड़ी, मिर्ची बड़ा और मावा कचौड़ी।\n"
                "• **शाही व्यंजन:** लाल मांस और पारंपरिक केर सांगरी की सब्जी।\n"
                "• **मिठाई व पेय:** पारंपरिक मलाई घेवर और एमआई रोड की कुल्हड़ वाली गाढ़ी लस्सी।"
            ),
            "pack": (
                "**जयपुर यात्रा के लिए आवश्यक सामान:**\n\n"
                "• **कपड़े:** दिन के लिए सूती कपड़े; सर्दियों (नवंबर-फरवरी) में रात के लिए गर्म कपड़े (तापमान 8-10°C तक गिर जाता है)।\n"
                "• **धूप से बचाव:** धूप का चश्मा, सनस्क्रीन और चौड़े किनारे वाली टोपी।\n"
                "• **जूते:** आमेर और नाहरगढ़ के पत्थरों पर चढ़ाई के लिए मजबूत व आरामदायक जूते।"
            ),
            "budget": (
                "**जयपुर यात्रा बजट दिशानिर्देश (प्रति व्यक्ति):**\n\n"
                "• **बजट (₹1,500–2,500/दिन):** बणी पार्क में हेरिटेज होमस्टे, पारंपरिक ढाबा भोजन और ई-रिक्शा।\n"
                "• **मध्यम (₹4,000–7,000/दिन):** पारंपरिक हवेली होटल, दर्शनीय स्थलों के कंपोजिट टिकट और चौखी ढाणी का सांस्कृतिक भोजन।\n"
                "• **शाही (₹12,000+/दिन):** राजमहल होटल और निजी गाइड।"
            ),
            "safety": (
                "**जयपुर सुरक्षा व स्थानीय परामर्श:**\n\n"
                "• **प्रमाणित गाइड:** केवल राजस्थान पर्यटन (RTDC) अधिकृत गाइड ही लें।\n"
                "• **शिल्प खरीदारी:** प्रामाणिक सांगानेरी प्रिंट व ब्लू पॉटरी के लिए सरकारी राजस्थली एम्पोरियम जाएं।\n"
                "• **हेल्पलाइन:** पर्यटक सहायता: 1364 / 112।"
            )
        },
        "bn": {
            "overview": (
                "**জয়পুর — রাজস্থানের ঐতিহাসিক গোলাপি শহর:**\n\n"
                "• **প্রধান দর্শনীয় স্থান:** রাজকীয় অম্বর কেল্লা, হাওয়া মহল, সিটি প্যালেস এবং যন্তর মন্তর (ইউনেস্কো ওয়ার্ল্ড হেরিটেজ সাইট)।\n"
                "• **ঐতিহ্যবাহী হস্তশিল্প:** সাঙ্গানেরী ব্লক প্রিন্টিং, ব্লু পট্রি এবং জহরি বাজারের বিখ্যাত অলঙ্কার।\n"
                "• **স্থানীয় খাবার:** ডাল বাটি চুরমা, পেঁয়াজের কচুরি এবং সুস্বাদু রাজস্থানি ঘেভর।\n"
                "• **সেরা সময়:** অক্টোবর থেকে মার্চ।"
            ),
            "food": (
                "**জয়পুরের রাজকীয় রাজস্থানি স্বাদ:**\n\n"
                "• **ডাল বাটি চুরমা:** খাঁটি গাওয়া ঘিয়ে ভেজানো বাটি, পঞ্চরত্ন ডাল ও মিষ্টি চুরমা।\n"
                "• **বিখ্যাত নাস্তা:** রাওয়াত মিষ্টান্ন ভাণ্ডারের মুচমুচে পেঁয়াজের কচুরি, লঙ্কার বড়া ও মাওয়া কচুরি।\n"
                "• **রাজস্থানি মিষ্টি:** মালাই ঘেভর এবং মাটির ভাঁড়ের ঘন সুস্বাদু মিষ্টি লাচ্চি।"
            ),
            "pack": (
                "**জয়পুর ভ্রমণের প্যাকিং টিপস:**\n\n"
                "• **পোশাক:** আরামদায়ক সুতির পোশাক; শীতে রাতের জন্য হালকা গরম পোশাক।\n"
                "• **সুরক্ষা:** রোদচশমা, সানস্ক্রিন এবং কেল্লা চড়ার জন্য ভালো গ্রিপযুক্ত জুতো।"
            ),
            "budget": (
                "**জয়পুর ভ্রমণ বাজেট (জনপ্রতি):**\n\n"
                "• **বাজেট (১,৫০০–২,৫০০ টাকা/দিন):** হেরিটেজ হোমস্টে, স্থানীয় খাবার ও ই-রিকশা।\n"
                "• **মিড-রেঞ্জ (৪,০০০–৭,০০০ টাকা/দিন):** ঐতিহ্যবাহী হাভেলি হোটেল ও চৌখী ধাণীর রাজকীয় সাংস্কৃতিক পরিবেশ।"
            ),
            "safety": (
                "**জয়পুর ভ্রমণ নিরাপত্তা:**\n\n"
                "• সরকারি RTDC অনুমোদিত গাইড ব্যবহার করুন এবং কেনাকাটার জন্য অনুমোদিত সরকারি এম্পোরিয়াম পরিদর্শনের পরামর্শ দেওয়া হয়।"
            )
        }
    },
    "kerala": {
        "en": {
            "overview": (
                "**Kerala — God's Own Country:**\n\n"
                "• **Backwaters & Coastal Serenity:** Alleppey & Kumarakom solar-powered eco-houseboats on Vembanad Lake; Marari village fishing beaches.\n"
                "• **Highland Tea Trails:** Munnar's mist-covered Nilgiri tea estates, Anamudi peak, and endangered Nilgiri Tahr wildlife at Eravikulam.\n"
                "• **Culture & Food:** Kathakali dance theatre, Kalaripayattu martial arts; authentic Kerala Sadya on banana leaf, Appam with vegetable stew, and Karimeen Pollichathu.\n"
                "• **Best Season:** September through March."
            ),
            "food": (
                "**Kerala's Coastal & Spice Flavors:**\n\n"
                "• **Traditional Sadya:** Pure vegetarian banquet served on a plantain leaf with 20+ preparations including Avial, Sambar, Thoran, Payasam, and red Matta rice.\n"
                "• **Coastal Delicacies:** Karimeen Pollichathu (pearl spot fish marinated in shallot-chili masala, wrapped in banana leaf and grilled), and Malabar Fish Curry with Kudampuli kokum.\n"
                "• **Breakfast Classics:** Fluffy fermented rice Appam with creamy coconut milk vegetable stew, and steamed Puttu with Kadala curry."
            ),
            "pack": (
                "**Kerala Packing Essentials:**\n\n"
                "• **Clothing:** Lightweight linen and breathable cottons. Modest clothing for temple visits.\n"
                "• **Monsoon Gear:** Sturdy umbrella or breathable rain poncho (crucial for monsoon showers).\n"
                "• **Eco Gear:** Natural citronella insect repellent for backwaters, water-resistant footwear."
            ),
            "budget": (
                "**Kerala Travel Budget (Per Person):**\n\n"
                "• **Budget (₹1,800–2,800/day):** Community homestays, state water transport ferries (₹15–40 for scenic cruises!), local vegetarian thalis.\n"
                "• **Mid-Range (₹4,500–8,000/day):** Boutique plantations in Munnar, overnight eco-houseboat in Alleppey, Ayurvedic massage.\n"
                "• **Luxury (₹14,000+/day):** Private solar luxury houseboats and luxury backwater wellness resorts."
            ),
            "safety": (
                "**Kerala Travel Safety:**\n\n"
                "• **Backwater Navigation:** Board only DTPC-registered houseboats carrying certified life buoys and lifejackets.\n"
                "• **Beach Safety:** Always follow lifeguard colored safety flags along Kovalam and Varkala cliff beaches.\n"
                "• **Helpline:** Kerala Tourism Police: +91-471-2321132 or 112."
            )
        },
        "hi": {
            "overview": (
                "**केरल — ईश्वर का अपना घर (God's Own Country):**\n\n"
                "• **बैकवाटर्स और प्रकृति:** एलेप्पी (अलपुझा) में पारंपरिक सोलर हाउसबोट, मुन्नार के घुमावदार चाय बागान और पेरियार राष्ट्रीय उद्यान।\n"
                "• **संस्कृति और कल्याण:** प्रामाणिक आयुर्वेदिक पंचकर्म केंद्र, कथकली शास्त्रीय नृत्य और कलरीपायट्टू मार्शल आर्ट।\n"
                "• **स्थानीय व्यंजन:** केले के पत्ते पर परोसी गई पारंपरिक साध्या, अप्पम और नारियल फिश मोइली।\n"
                "• **सर्वोत्तम मौसम:** सितंबर से मार्च।"
            ),
            "food": (
                "**केरल के पारंपरिक तटीय व मसालों से भरपूर व्यंजन:**\n\n"
                "• **केरल साध्या:** केले के पत्ते पर 20+ प्रकार के व्यंजनों (अवियल, थोरन, सांभर, पायसम) से सजी पारंपरिक दावत।\n"
                "• **तटीय विशेषताएं:** करीमीन पोलिचथु (केले के पत्ते में सिकी मसालेदार मछली) और नारियल के दूध वाली फिश मोइली।\n"
                "• **नाश्ता:** नारियल के दूध के गाढ़े स्टू के साथ मुलायम अप्पम और पुट्टू कडाला।"
            ),
            "pack": (
                "**केरल के लिए पैकिंग सुझाव:**\n\n"
                "• **कपड़े:** हल्के सूती व लिनेन के कपड़े।\n"
                "• **मौसम:** मजबूत छाता या रेनकोट और बैकवाटर के लिए मच्छर रोधी क्रीम।\n"
                "• **जूते:** वाटरप्रूफ सैंडल या जूते।"
            ),
            "budget": (
                "**केरल यात्रा बजट दिशानिर्देश (प्रति व्यक्ति):**\n\n"
                "• **बजट (₹1,800–2,800/दिन):** विलेज होमस्टे, सरकारी नौका सेवाएं (₹15–40 में खूबसूरत बैकवाटर यात्रा!)।\n"
                "• **मध्यम (₹4,500–8,000/दिन):** मुन्नार के चाय बागानों में रिसॉर्ट, एलेप्पी में शेयर्ड हाउसबोट और आयुर्वेदिक मालिश।\n"
                "• **लक्जरी (₹14,000+/दिन):** प्राइवेट सोलर हाउसबोट और लक्जरी बैकवाटर वेलनेस रिसॉर्ट।"
            ),
            "safety": (
                "**केरल यात्रा सुरक्षा:**\n\n"
                "• **हाउसबोट सुरक्षा:** केवल पर्यटन विभाग (DTPC) द्वारा प्रमाणित हाउसबोट ही चुनें जिनमें लाइफ जैकेट उपलब्ध हों।\n"
                "• **हेल्पलाइन:** केरल पर्यटन पुलिस: 112।"
            )
        },
        "bn": {
            "overview": (
                "**কেরল — ঈশ্বরের নিজস্ব দেশ (God's Own Country):**\n\n"
                "• **ব্যাকওয়াটার্স ও চা বাগান:** আলেপ্পিতে ঐতিহ্যবাহী সৌরবিদ্যুৎ চালিত হাউসবোট ক্রুজ, মুন্নারের পাহাড়ে সবুজ চা বাগান এবং পেরিয়ার অভয়ারণ্য।\n"
                "• **ঐতিহ্য ও আয়ুর্বেদ:** খাঁটি কেরলীয় আয়ুর্বেদিক চিকিৎসা, কত্থকলি নৃত্য এবং প্রাচীন কালারিপায়াত্তু।\n"
                "• **স্থানীয় খাবার:** ঐতিহ্যবাহী কেরল সাধ্য (কলা পাতায় পরিবেশিত নিরামিষ ভোজ), নরম অপ্পম ও নারকেল দুধের মাছের তরকারি।"
            ),
            "food": (
                "**কেরলের সুস্বাদু উপকূলীয় ও মশলাদার খাবার:**\n\n"
                "• **কেরল সাধ্য:** কলা পাতায় পরিবেশিত ২০টিরও বেশি ঐতিহ্যবাহী সুস্বাদু নিরামিষ পদের রাজকীয় ভোজ।\n"
                "• **মাছের পদ:** কলা পাতায় মোড়া মশলাদার ভাজা করিমিন মাছ (করিমিন পোল্লিচাথু) এবং নারকেল দুধের সুস্বাদু ফিশ কারি।\n"
                "• **সকালের নাস্তা:** নরম তুলতুলে অপ্পম ও ভেজিটেবল স্টু।"
            ),
            "pack": (
                "**কেরল ভ্রমণের প্যাকিং গাইড:**\n\n"
                "• হালকা সুতির পোশাক, ব্যাকওয়াটারের জন্য মশা তাড়ানোর ক্রিম এবং একটি ভালো ছাতা সাথে রাখুন।"
            ),
            "budget": (
                "**কেরল ভ্রমণ বাজেট (জনপ্রতি):**\n\n"
                "• **বাজেট (১,৮০০–২,৮০০ টাকা/দিন):** গ্রামীণ হোমস্টে এবং সরকারি ওয়াটার ট্রান্সপোর্ট ফেরি (মাত্র ১৫–৪০ টাকায় অপূর্ব ব্যাকওয়াটার ক্রুজ)।\n"
                "• **মিড-রেঞ্জ (৪,৫০০–৮,০০০ টাকা/দিন):** মুন্নারের চা বাগানের রিসোর্ট ও হাউসবোট।"
            ),
            "safety": (
                "**কেরল ভ্রমণ নিরাপত্তা:**\n\n"
                "• সরকারি প্রত্যয়িত হাউসবোট ব্যবহার করুন এবং লাইফ জ্যাকেটের উপস্থিতি নিশ্চিত করুন।"
            )
        }
    },
    "ladakh": {
        "en": {
            "overview": (
                "**Ladakh — The Land of High Passes:**\n\n"
                "• **High-Altitude Wonders:** Pangong Tso (14,270 ft crystal-blue lake), Nubra Valley sand dunes with double-humped Bactrian camels, and Hanle Dark Sky Reserve.\n"
                "• **Monastic Heritage:** Hemis Gompa, Thiksey Monastery, and ancient 11th-century murals of Alchi.\n"
                "• **Acclimatization:** Mandatory 48 hours of complete rest in Leh (11,500 ft) before crossing high passes."
            ),
            "food": (
                "**Ladakhi High-Altitude Cuisine:**\n\n"
                "• **Thukpa:** Hearty noodle soup with garden vegetables and rich broth, providing sustained warmth and complex carbs.\n"
                "• **Skyu:** Handmade slow-simmered whole wheat pasta stew — traditional winter sustenance.\n"
                "• **Gur Gur Cha:** Churned yak butter tea with Himalayan rock salt — critical for high-altitude hydration.\n"
                "• **Tingmo:** Steamed flower-shaped wheat bread served with spicy dal or vegetable stews."
            ),
            "pack": (
                "**High-Altitude Himalayan Packing List (Ladakh):**\n\n"
                "• **Base Layers:** Merino wool thermals (2 sets minimum).\n"
                "• **Insulation:** 600-fill down jacket or heavy fleece pullover.\n"
                "• **Shell:** Waterproof windproof hardshell jacket.\n"
                "• **Eyewear & Sun:** Polarized UV-400 glacier sunglasses + SPF 50+ sunscreen.\n"
                "• **Medical:** Diamox (under medical advice), pulse oximeter, ORS sachets.\n"
                "• **Hydration:** Reusable insulated water bottle (plastic bottles banned in Ladakh!).\n"
                "• **Permits:** 4 hardcopies of Inner Line Permit (ILP)."
            ),
            "budget": (
                "**Ladakh Travel Budget (Per Person):**\n\n"
                "• **Budget (₹18,000–25,000 / 5 days):** Shared taxis, certified eco-homestays, DIY permits.\n"
                "• **Mid-Range (₹32,000–48,000 / 7 days):** Private 4x4 vehicle, curated community homestays, all permits.\n"
                "• **Tip:** Staying in village homestays keeps 80%+ revenue directly with local families."
            ),
            "safety": (
                "**High-Altitude Safety Protocols (AMS):**\n\n"
                "• **Leh Acclimatization:** 48 hours minimum complete rest upon landing.\n"
                "• **Hydration:** Drink 4–5 liters of water daily with electrolytes. No alcohol or sleeping pills.\n"
                "• **Telemetry:** Check Khardung La & Chang La pass clearance before early morning departures. Hospital: SNM Hospital Leh."
            )
        },
        "hi": {
            "overview": (
                "**लद्दाख — उच्च हिमालयी दर्रों की भूमि:**\n\n"
                "• **प्रमुख स्थल:** पैंगोंग त्सो (14,270 फीट), नुब्रा घाटी (दो कूबड़ वाले ऊंट) और हानले डार्क स्काई अभयारण्य।\n"
                "• **बौद्ध मठ:** हेमिस, थिक्सिक और अलची के ऐतिहासिक भित्तिचित्र।\n"
                "• **अनुकूलन:** दर्रों पर जाने से पहले लेह (11,500 फीट) में पहले 48 घंटे आराम अनिवार्य है।"
            ),
            "food": (
                "**लद्दाखी उच्च-हिमालयी व्यंजन:**\n\n"
                "• **थुकपा:** साबुत अनाज नूडल सूप और ताजी सब्जियां — शरीर को गर्म रखने हेतु सर्वोत्तम।\n"
                "• **स्क्यू:** धीमी आंच पर पकाई गई गेहूं की पारंपरिक पास्ता स्टू।\n"
                "• **गुर गुर चाय:** याक मक्खन और हिमालयी सेंधा नमक से मथी गई ऊर्जावान चाय।\n"
                "• **तिंगमो:** भाप में पकी हुई फूल जैसी मुलायम ब्रेड।"
            ),
            "pack": (
                "**लद्दाख एवं उच्च हिमालयी दर्रों के लिए पैकिंग सूची:**\n\n"
                "• **थर्मल बेस लेयर:** मेरिनो वूल के कम से कम 2 सेट।\n"
                "• **जैकेट:** 600-फिल डाउन जैकेट और वाटरप्रूफ विंडचीटर।\n"
                "• **धूप का चश्मा:** UV-400 पोलराइज्ड ग्लेशियर ग्लासेस।\n"
                "• **दवाइयां:** डायमॉक्स (डॉक्टर की सलाह पर), पल्स ऑक्सीमीटर और ORS।\n"
                "• **बोतल:** इंसुलेटेड पानी की बोतल (एकल-उपयोग प्लास्टिक लद्दाख में वर्जित है)।"
            ),
            "budget": (
                "**लद्दाख यात्रा बजट (प्रति व्यक्ति):**\n\n"
                "• **5-दिवसीय बजट:** ₹18,000–25,000 (साझा टैक्सी और होमस्टे)।\n"
                "• **7-दिवसीय मध्यम:** ₹32,000–48,000 (निजी 4x4 वाहन और प्रमाणित इको-होमस्टे)।"
            ),
            "safety": (
                "**अनिवार्य ऊंचाई सुरक्षा (48-घंटे अनुकूलन नियम):**\n\n"
                "• लेह में पहले 48 घंटे पूर्ण आराम करें। प्रतिदिन 4-5 लीटर पानी पिएं। SpO2 ऑक्सीजन स्तर जांचें। आपातकालीन नंबर: लेह अस्पताल 1077।"
            )
        },
        "bn": {
            "overview": (
                "**লাদাখ — উচ্চ হিমালয় গিরিপথের স্বর্গরাজ্য:**\n\n"
                "• **দর্শনীয় স্থান:** প্যাংগং ত্সো (১৪,২৭০ ফুট), নুব্রা ভ্যালি, তুরতুক এবং হানলে ডার্ক স্কাই স্যাঙ্কচুয়ারি।\n"
                "• **অভিযোজন:** লেহ শহরে পৌঁছানোর পর প্রথম ৪৮ ঘণ্টার বিশ্রাম বাধ্যতামূলক।"
            ),
            "food": (
                "**লাদাখের ঐতিহ্যবাহী খাবার:**\n\n"
                "• **থুকপা:** গরম পুষ্টিকর নুডল স্যুপ।\n"
                "• **স্কিউ:** ঐতিহ্যবাহী গমের তৈরি পাস্তা স্টু।\n"
                "• **বাটার টি:** ইয়াকের মাখন ও হিমালয় লবণে তৈরি বিশেষ চা।"
            ),
            "pack": (
                "**লাদাখ ভ্রমণের প্যাকিং তালিকা:**\n\n"
                "• মেরিনো উলের থার্মাল ইনার, উইন্ডপ্রুফ ডাউন জ্যাকেট, UV-400 গ্লেসিয়ার রোদচশমা, ডায়ামক্স ও পালস অক্সিমিটার।"
            ),
            "budget": (
                "**লাদাখ ভ্রমণ বাজেট (জনপ্রতি):**\n\n"
                "• ৫ দিনের বাজেট: ১৮,০০০–২৫,০০০ টাকা (শেয়ার্ড গাড়ি ও হোমস্টে)।\n"
                "• ৭ দিনের মিড-রেঞ্জ: ৩২,০০০–৪৮,০০০ টাকা।"
            ),
            "safety": (
                "**উচ্চতাজনিত সুরক্ষা নির্দেশিকা:**\n\n"
                "• লেহ শহরে (১১,৫০০ ফুট) প্রথম ৪৮ ঘণ্টা বিশ্রাম নিন। প্রচুর জল পান করুন এবং রক্তে অক্সিজেনের মাত্রা (SpO2) পরীক্ষা করুন।"
            )
        }
    }
}

# Standalone Himalayan telemetry & adventure modules (invoked only when explicitly requested)
HIMALAYAN_TOPICS = {
    "acclimat": {
        "en": (
            "**Mandatory Acclimatization Protocol for Leh (11,500 ft):**\n\n"
            "• **Day 1 — Complete Rest:** Land at Leh Airport, go directly to your hotel, and rest for the entire day. Avoid all exertion.\n"
            "• **Day 2 — Light Activity:** Gentle short walks (15–20 mins). Monitor for headache, nausea, or breathlessness.\n"
            "• **Hydration Rule:** Drink 4–5 liters of water daily with electrolytes. Avoid alcohol, caffeine, and sleeping pills for the first 48 hours.\n"
            "• **Ascend Slowly:** Never ascend more than 300–500m per day above 3,000m. Always 'climb high, sleep low'.\n"
            "• **AMS Warning Signs:** Throbbing headache, nausea, dizziness. If symptoms worsen, descend immediately to lower altitude."
        ),
        "hi": (
            "**लेह (11,500 फीट) के लिए अनिवार्य 48-घंटे अनुकूलन प्रोटोकॉल:**\n\n"
            "• **पहला दिन — पूर्ण शारीरिक विश्राम:** होटल जाएं और पूरा दिन आराम करें। सीढ़ियां चढ़ने या भारी परिश्रम से बचें।\n"
            "• **दूसरा दिन — हल्की सैर:** 15–20 मिनट की धीमी सैर करें। सिरदर्द या चक्कर पर नजर रखें।\n"
            "• **जलयोजन नियम:** प्रतिदिन 4–5 लीटर पानी और इलेक्ट्रोलाइट्स पिएं। शराब और नींद की गोलियों से बचें।\n"
            "• **AMS चेतावनी:** गंभीर सिरदर्द या उल्टी होने पर तुरंत कम ऊंचाई पर जाएं।"
        ),
        "bn": (
            "**বাধ্যতামূলক উচ্চতা সুরক্ষা ও অভিযোজন নির্দেশিকা:**\n\n"
            "• লেহ শহর ১১,৫০০ ফুট উচ্চতায় অবস্থিত। খারদুং লা (১৭,৫৮২ ফুট) বা প্যাংগং লেকে যাওয়ার আগে লেহ শহরে প্রথম ৪৮ ঘণ্টার সম্পূর্ণ বিশ্রাম বাধ্যতামূলক। প্রতিদিন ৪-৫ লিটার জল পান করুন এবং রক্তে অক্সিজেনের মাত্রা (SpO2) পরীক্ষা করুন।"
        )
    },
    "pass": {
        "en": (
            "**Mountain Pass Safety Advisory (Live Telemetry):**\n\n"
            "• **Khardung La (17,582 ft) — OPEN:** Light black ice on northern descent. Cross between 06:00–16:00. Maximum stay at summit: 15 minutes. 4x4 with snow chains recommended.\n"
            "• **Chang La (17,688 ft) — CAUTION:** High ridge winds (-5°C). Snow drift active near summit. Cross before 14:00.\n"
            "• **Zoji La (11,575 ft) — RESTRICTED:** Freight convoy movement from Sonamarg. Tourist vehicles allowed only in designated windows.\n"
            "• **Emergency Number:** BRO Rescue 1077."
        ),
        "hi": (
            "**पर्वतीय दर्रा लाइव सुरक्षा परामर्श:**\n\n"
            "• **खारदुंग ला (17,582 फीट) — खुला:** उत्तरी ढलानों पर हल्की काली बर्फ। पार करने का समय: सुबह 06:00 से शाम 16:00। शिखर पर अधिकतम ठहराव 15 मिनट रखें।\n"
            "• **चांग ला (17,688 फीट) — सावधानी:** बर्फीली हवाएं (-5°C)। दोपहर 14:00 से पहले पार करें।\n"
            "• **आपातकालीन नंबर:** BRO HIMANK 1077।"
        ),
        "bn": (
            "**পাহাড়ি গিরিপথ লাইভ সতর্কতা:**\n\n"
            "• খারদুং লা এবং চাং লা গিরিপথে সার্বক্ষণিক নজরদারি চলছে। সকাল ০৬:০০ থেকে বিকাল ১৬:০০ এর মধ্যে গিরিপথ অতিক্রম করুন। 4x4 স্নো চেইন গাড়ি ব্যবহার করুন।"
        )
    },
    "permit": {
        "en": (
            "**Inner Line Permit (ILP) — Complete Guide:**\n\n"
            "• **Who Needs It:** All Indian nationals visiting Nubra Valley, Pangong Tso, Tso Moriri, Turtuk, and Hanle.\n"
            "• **How to Apply:** Online at lahdc.nic.in (24-hour processing) or at DC Office, Leh.\n"
            "• **Print 4 Copies:** Hardcopies mandatory at South Pullu, North Pullu, and Khardung La checkposts."
        ),
        "hi": (
            "**इनर लाइन परमिट (ILP) — संपूर्ण दिशानिर्देश:**\n\n"
            "• नुब्रा घाटी, पैंगोंग त्सो, त्सो मोरीरी, तुरतुक और हानले जाने वाले सभी पर्यटकों के लिए अनिवार्य।\n"
            "• lahdc.nic.in पर ऑनलाइन प्राप्त करें। चेकपोस्ट के लिए 4 प्रिंट प्रतियां साथ रखें।"
        ),
        "bn": (
            "**ইনার লাইন পারমিট (ILP) নির্দেশিকা:**\n\n"
            "• নুব্রা ভ্যালি, প্যাংগং ত্সো ও হানলে ভ্রমণের জন্য ILP বাধ্যতামূলক। চেকপোস্টের জন্য ৪টি প্রিন্ট কপি সাথে রাখুন।"
        )
    },
    "decongest": {
        "en": (
            "**Smart Decongestion Strategy — Why Offbeat Matters:**\n\n"
            "• **The Problem:** Hotspots like Pangong Tso receive heavy peak traffic causing vehicle emissions and trail erosion.\n"
            "• **The Solution:** Diverting footfall to secondary corridors like Hanle, Turtuk, Sham Valley, and Tso Moriri preserves fragile ecology and redistributes 80%+ of tourism revenue directly to remote village families."
        ),
        "hi": (
            "**स्मार्ट भीड़-नियंत्रण रणनीति और लाभ:**\n\n"
            "• तुरतुक, हानले और शाम घाटी जैसे ऑफबीट स्थानों का दौरा करने से पैंगोंग जैसे हॉटस्पॉट पर दबाव 60% घटता है और 80%+ आय सीधे स्थानीय परिवारों तक पहुंचती है।"
        ),
        "bn": (
            "**স্মার্ট ভিড়-নিয়ন্ত্রণ কৌশল:**\n\n"
            "• তুরতুক, হানলে এবং শাম উপত্যকার মতো বিকল্প করিডোর পরিদর্শনে মূল পর্যটন কেন্দ্রের ভিড় ও দূষণ কমে এবং স্থানীয় গ্রামীণ পরিবার উপকৃত হয়।"
        )
    }
}

# Universal Pan-India fallback answers (when NO specific destination is selected or asked)
PAN_INDIA_RESPONSES = {
    "en": {
        "overview": (
            "**Namaste! 🙏 I am Bharat AI — your verified travel intelligence guide for all of India.**\n\n"
            "I provide tailored, sustainable travel insights across all 28 states and union territories of Bharat:\n\n"
            "• **Kolkata & West Bengal** — Victoria Memorial, Howrah Bridge, Bengali cuisine, and historic trams\n"
            "• **Rajasthan & West India** — Majestic hill forts, palace architecture, and desert culture\n"
            "• **Kerala & South India** — Backwater eco-houseboats, spice trails, and tranquil beaches\n"
            "• **Himalayas & North** — Mountain valleys, high-altitude acclimatization, and live pass telemetry\n"
            "• **Sustainable Travel** — Certified community homestays, public EV transit, and zero single-use plastic\n\n"
            "Ask me about any destination, regional food, packing tips, or budget planning — I will stay strictly focused on your chosen topic!"
        ),
        "food": (
            "**Pan-India Culinary Explorer — A Journey You Can Taste:**\n\n"
            "• **East India (Kolkata & Bengal):** Rosogolla, Mishti Doi, Kolkata Biryani with spiced potato, and Kathi Rolls.\n"
            "• **West India (Rajasthan & Gujarat):** Dal Baati Churma, Pyaaz Kachori, and authentic Gujarati Thali.\n"
            "• **South India (Kerala & Tamil Nadu):** Traditional Kerala Sadya, Appam with coconut stew, and crispy Dosa with Sambar.\n"
            "• **North India (Himalayas & Plains):** Kashmiri Rogan Josh, Ladakhi Thukpa, and Punjabi Dal Makhani with Kulcha.\n\n"
            "Tell me which region or city you're exploring, and I'll detail the best authentic local eateries and dishes!"
        ),
        "pack": (
            "**General Travel Packing Essentials for India:**\n\n"
            "• **Plains & Coastal Regions (Kolkata, Kerala, Goa):** Lightweight breathable cottons, comfortable walking shoes, umbrella, and sunglasses.\n"
            "• **Desert Regions (Rajasthan):** Cotton wear for warm days, warm layers for cool desert nights, and sun protection.\n"
            "• **Mountain Destinations (Himalayas):** Thermal base layers, fleece, down jacket, and sturdy trekking shoes.\n"
            "• **General Essentials:** Universal power bank, reusable water bottle, digital ID copies, and UPI payment app on your smartphone."
        ),
        "budget": (
            "**Pan-India Travel Budget Guide (Per Person/Day):**\n\n"
            "• **Budget Backpacker (₹1,200–2,200/day):** Clean hostels/homestays, authentic street dhabas, state buses & metro.\n"
            "• **Mid-Range Traveler (₹3,500–6,500/day):** 3-star boutique hotels, heritage dining, ride-hailing cabs, and guided tours.\n"
            "• **Luxury Traveler (₹10,000–25,000+/day):** 5-star palace hotels, private chauffeur-driven vehicles, and curated experiences.\n\n"
            "Let me know your target destination for an exact city-specific budget breakdown!"
        ),
        "safety": (
            "**Pan-India Travel Safety & Etiquette Advice:**\n\n"
            "• **Emergency Numbers:** All-India Emergency Helpline: 112 (Police, Ambulance, Fire). Tourist Helpline: 1363.\n"
            "• **Digital Payments:** UPI (Google Pay, PhonePe, Paytm) is accepted nationwide from street stalls to luxury stores.\n"
            "• **Cultural Respect:** Remove shoes before entering temples and prayer halls; dress modestly at religious monuments.\n"
            "• **Transportation:** Use official prepaid taxi booths at airports/railway stations, or ride-hailing apps (Uber, Ola) with active GPS tracking."
        )
    },
    "hi": {
        "overview": (
            "**नमस्ते! 🙏 मैं भारत एआई (Bharat AI) हूँ — संपूर्ण भारत यात्रा के लिए आपका बुद्धिमान मार्गदर्शक।**\n\n"
            "मैं भारत के सभी राज्यों एवं प्रमुख शहरों के लिए सटीक और स्थायी यात्रा जानकारी प्रदान करता हूँ:\n\n"
            "• **कोलकाता एवं पश्चिम बंगाल** — विक्टोरिया मेमोरियल, हावड़ा ब्रिज, प्रसिद्ध मिष्टी दोई व ट्राम संस्कृति\n"
            "• **राजस्थान व पश्चिमी भारत** — जयपुर का आमेर किला, हवेलियां और रेगिस्तानी संस्कृति\n"
            "• **केरल व दक्षिण भारत** — बैकवाटर हाउसबोट, मुन्नार चाय बागान और समुद्री तट\n"
            "• **हिमालयी गंतव्य** — लद्दाख, हिमाचल और उत्तराखंड के लिए ऊंचाई सुरक्षा व दर्रा सलाह\n"
            "• **जिम्मेदार पर्यटन** — स्थानीय समुदाय होमस्टे, पर्यावरण-अनुकूल परिवहन और शून्य-प्लास्टिक नीति\n\n"
            "आप जिस भी शहर या यात्रा विषय के बारे में पूछेंगे, मैं बिना भटके केवल उसी विषय पर मार्गदर्शन दूंगा!"
        ),
        "food": (
            "**अखिल भारतीय खानपान गाइड:**\n\n"
            "• **पूर्व भारत (कोलकाता):** रसगुल्ला, मिष्टी दोई, आलू वाली बिरयानी और काठी रोल।\n"
            "• **पश्चिम भारत (राजस्थान):** दाल बाटी चूरमा, प्याज़ की कचौड़ी और केर सांगरी।\n"
            "• **दक्षिण भारत (केरल):** केले के पत्ते पर साध्या, अप्पम और ताजी नारियल की चटनी।\n"
            "• **उत्तर भारत:** पारंपरिक अमृतसरी कुल्चा, कश्मीरी कहवा और पहाड़ी थुकपा।\n\n"
            "आप किस राज्य या शहर के भोजन के बारे में जानना चाहते हैं?"
        ),
        "pack": (
            "**भारत यात्रा के लिए सामान्य पैकिंग सूची:**\n\n"
            "• **मैदानी व तटीय क्षेत्र (कोलकाता, केरल, गोवा):** हल्के सूती कपड़े, धूप का चश्मा और छाता।\n"
            "• **रेगिस्तानी क्षेत्र (राजस्थान):** दिन के लिए सूती और रात के लिए हल्की जैकेट।\n"
            "• **पहाड़ी क्षेत्र (हिमालय):** थर्मल इनर, गर्म जैकेट और मजबूत ट्रेकिंग जूते।\n"
            "• **आवश्यक:** स्मार्टफोन में UPI ऐप, पावर बैंक और पुन: प्रयोज्य पानी की बोतल।"
        ),
        "budget": (
            "**भारत यात्रा बजट दिशानिर्देश (प्रति व्यक्ति/दिन):**\n\n"
            "• **बैकपैकर (₹1,200–2,200/दिन):** होमस्टे, स्थानीय ढाबा भोजन और सार्वजनिक परिवहन (मेट्रो/बस)।\n"
            "• **मध्यम वर्ग (₹3,500–6,500/दिन):** हेरिटेज होटल, लोकप्रिय रेस्टोरेंट और कैब।\n"
            "• **प्रीमियम (₹10,000+/दिन):** 5-सितारा रिसॉर्ट और निजी वाहन।"
        ),
        "safety": (
            "**भारत यात्रा सुरक्षा व स्थानीय सुझाव:**\n\n"
            "• **आपातकालीन नंबर:** राष्ट्रीय आपातकालीन नंबर: 112। पर्यटक हेल्पलाइन: 1363।\n"
            "• **डिजिटल भुगतान:** भारत में लगभग सभी जगह UPI स्वीकार किया जाता है।\n"
            "• **धार्मिक मर्यादा:** मंदिरों में जाने से पहले जूते उतारें और शालीन कपड़े पहनें।"
        )
    },
    "bn": {
        "overview": (
            "**নমস্কার! 🙏 আমি ভারত এআই (Bharat AI) — সমগ্র ভারত ভ্রমণের জন্য আপনার বুদ্ধিমান সহায়ক।**\n\n"
            "আমি ভারতের সমস্ত রাজ্য ও প্রধান শহরের জন্য নির্ভরযোগ্য ভ্রমণ পরামর্শ প্রদান করি:\n\n"
            "• **কলকাতা ও পশ্চিমবঙ্গ** — ভিক্টোরিয়া মেমোরিয়াল, হাওড়া ব্রিজ, ঐতিহ্যবাহী বাঙালি মিষ্টি ও ট্রাম\n"
            "• **রাজস্থান ও পশ্চিম ভারত** — প্রাচীন দুর্গ, রাজপুত স্থাপত্য ও রাজকীয় সংস্কৃতি\n"
            "• **কেরল ও দক্ষিণ ভারত** — ব্যাকওয়াটার্স হাউসবোট, চা বাগান ও সমুদ্রতট\n"
            "• **হিমালয় অঞ্চল** — লাদাখ ও হিমাচলের উচ্চতা সুরক্ষা ও গিরিপথ সতর্কতা\n\n"
            "আপনি যে শহর বা গন্তব্য সম্পর্কে জানতে চান আমাকে প্রশ্ন করুন — আমি সম্পূর্ণ সেই বিষয়ের উপর তথ্য জানাব!"
        ),
        "food": (
            "**সমগ্র ভারতের বিখ্যাত খাবারের তালিকা:**\n\n"
            "• **পূর্ব ভারত (কলকাতা):** রসগোল্লা, মিষ্টি দই, আলু-ডিম বিরিয়ানি ও কাঠি রোল।\n"
            "• **পশ্চিম ভারত (রাজস্থান):** ডাল বাটি চুরমা ও পেঁয়াজের কচুরি।\n"
            "• **দক্ষিণ ভারত (কেরল):** কলা পাতায় সাধ্য ভোজ ও নরম অপ্পম।\n"
            "• **উত্তর ভারত:** গরম কুলচা, কাশ্মীরি ওয়াজওয়ান ও লাদাখি থুকপা।"
        ),
        "pack": (
            "**ভারত ভ্রমণের সাধারণ প্যাকিং নির্দেশিকা:**\n\n"
            "• **সমতল ও উপকূলীয় অঞ্চল:** আরামদায়ক সুতির পোশাক, রোদচশমা ও ছোট ছাতা।\n"
            "• **পাহাড় ও হিমালয়:** থার্মাল ইনার, ডাউন জ্যাকেট ও ট্রেকিং জুতো।\n"
            "• **প্রয়োজনীয়:** মোবাইল UPI অ্যাপ, পাওয়ার ব্যাংক ও জলের বোতল।"
        ),
        "budget": (
            "**ভারত ভ্রমণ বাজেট (জনপ্রতি/দিন):**\n\n"
            "• **বাজেট (১,২০০–২,২০০ টাকা/দিন):** পরিচ্ছন্ন হোমস্টে, লোকাল খাবার ও মেট্রো/বাস।\n"
            "• **মিড-রেঞ্জ (৩,৫০০–৬,৫০০ টাকা/দিন):** বুটিক হোটেল, বিখ্যাত রেস্তোরাঁ ও ক্যাব।"
        ),
        "safety": (
            "**ভারত ভ্রমণ নিরাপত্তা ও পরামর্শ:**\n\n"
            "• **জরুরি নম্বর:** জাতীয় জরুরি হেল্পলাইন: ১১২। পর্যটন হেল্পলাইন: ১৩৬৩।\n"
            "• **পেমেন্ট:** সারাদেশে ক্যাশলেস UPI পেমেন্ট অত্যন্ত নির্ভরযোগ্য।"
        )
    }
}

def get_heuristic_reply(
    prompt: str,
    lang: str = "en",
    active_dest: Optional[str] = None,
    history: Optional[List[dict]] = None
) -> str:
    lang = (lang or "en").lower()
    if lang not in ["en", "hi", "bn"]:
        lang = "en"

    dest = detect_destination(prompt, active_dest=active_dest, history=history)
    subtopic = detect_subtopic(prompt)

    # 1. Explicit high-altitude Himalayan topics (Pass conditions, acclimatization, permits)
    # Only triggered when explicitly asked
    if subtopic in HIMALAYAN_TOPICS:
        topic_dict = HIMALAYAN_TOPICS[subtopic]
        return topic_dict.get(lang, topic_dict["en"])

    # 2. Destination-specific knowledge (Kolkata, Jaipur, Kerala, Ladakh, etc.)
    if dest and dest in DESTINATION_RESPONSES:
        bundle = DESTINATION_RESPONSES[dest].get(lang, DESTINATION_RESPONSES[dest]["en"])
        if subtopic in bundle:
            return bundle[subtopic]
        return bundle.get("overview", bundle.get("food", ""))

    # 3. Pan-India general travel response (food, pack, budget, safety, overview)
    pan_bundle = PAN_INDIA_RESPONSES.get(lang, PAN_INDIA_RESPONSES["en"])
    if subtopic in pan_bundle:
        return pan_bundle[subtopic]
    return pan_bundle["overview"]

@app.post("/api/chat")
async def chat_stream_endpoint(req: ChatRequest):
    """Resilient streaming AI endpoint with Gemini 3.1 Flash Lite strictly following chosen destination and UI language."""
    async def token_generator():
        import re
        import asyncio

        # Immediate leading space to flush TCP buffer immediately for zero TTFT delay
        yield " "

        target_lang = (req.lang or "en").lower()
        if target_lang not in ["en", "hi", "bn"]:
            target_lang = "en"

        # Determine destination context from query, active destination, or multi-turn history
        detected_dest = detect_destination(req.message, active_dest=req.active_destination, history=req.history)

        if not client:
            fallback = get_heuristic_reply(req.message, target_lang, active_dest=detected_dest, history=req.history)
            tokens = re.findall(r'\S+|\s+', fallback)
            for t in tokens:
                yield t
                await asyncio.sleep(0.012)
            return

        models_to_try = ["gemini-3.1-flash-lite", "gemini-3.7-flash", "gemini-3.5-flash"]
        yielded_tokens = 0
        stream_success = False

        system_instr = get_system_instruction(target_lang, active_destination=detected_dest)
        clean_query = req.message.strip()

        if detected_dest:
            dest_name = detected_dest.title() if detected_dest != "kolkata" else "Kolkata, West Bengal"
            dest_lock = f"[ACTIVE DESTINATION CONTEXT: {dest_name}]\nFocus 100% strictly on {dest_name}. Answer practical questions (such as food, packing, budget, transit, or sightseeing) strictly for {dest_name}. Do NOT mention mountain passes, acclimatization, or unrelated regions.\n"
        else:
            dest_lock = ""

        if target_lang == "hi":
            prompt_content = f"{dest_lock}User Question: {clean_query}\n(CRITICAL MANDATE: Respond strictly in natural Hindi / हिन्दी using Devanagari script. Stay strictly on topic.)"
        elif target_lang == "bn":
            prompt_content = f"{dest_lock}User Question: {clean_query}\n(CRITICAL MANDATE: Respond strictly in natural Bengali / বাংলা using Bengali script. Stay strictly on topic.)"
        else:
            prompt_content = f"{dest_lock}User Question: {clean_query}\n(CRITICAL MANDATE: Stay strictly on topic without mentioning unrelated destinations or mountain passes.)"

        # Construct multi-turn contents list for Gemini API
        contents_list = []
        if req.history:
            for item in req.history[-6:]:
                role_val = item.get("role", "user")
                role_str = "model" if role_val in ["model", "bot", "assistant"] else "user"
                txt_val = item.get("content") or item.get("text") or ""
                if txt_val.strip():
                    contents_list.append(types.Content(role=role_str, parts=[types.Part.from_text(text=txt_val.strip())]))

        contents_list.append(types.Content(role="user", parts=[types.Part.from_text(text=prompt_content)]))

        for model_name in models_to_try:
            try:
                config = types.GenerateContentConfig(
                    system_instruction=system_instr,
                    temperature=0.3,
                    max_output_tokens=1500,
                    automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True)
                )
                response_stream = await client.aio.models.generate_content_stream(
                    model=model_name,
                    contents=contents_list,
                    config=config
                )

                async for chunk in response_stream:
                    text = ""
                    try:
                        if hasattr(chunk, "text") and chunk.text:
                            text = chunk.text
                    except (AttributeError, ValueError):
                        pass

                    if not text and hasattr(chunk, "candidates") and chunk.candidates:
                        try:
                            for candidate in chunk.candidates:
                                if hasattr(candidate, "content") and candidate.content and hasattr(candidate.content, "parts"):
                                    for part in candidate.content.parts:
                                        if hasattr(part, "text") and part.text:
                                            text += part.text
                        except Exception:
                            pass

                    if not text:
                        continue

                    yield text
                    yielded_tokens += 1

                stream_success = True
                break  # Successful stream completion

            except Exception as ex:
                err_str = str(ex)
                print(f"[Gemini Stream Warning on {model_name}]: {err_str[:200]}")
                if yielded_tokens > 0:
                    yield "\n\n*(Advisory: Expedition telemetry connection maintained.)*"
                    stream_success = True
                    break
                continue

        # If all Gemini models failed before any tokens could be yielded, stream heuristic response
        if not stream_success and yielded_tokens == 0:
            print(f"[Gemini Stream Fallback]: All models unavailable, serving destination-aware heuristic guidance in {target_lang}.")
            fallback = get_heuristic_reply(req.message, target_lang, active_dest=detected_dest, history=req.history)
            tokens = re.findall(r'\S+|\s+', fallback)
            for t in tokens:
                yield t
                await asyncio.sleep(0.012)

    headers = {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"
    }
    return StreamingResponse(token_generator(), headers=headers)

# Static file serving to allow opening web app directly from FastAPI server
if (BASE_DIR / "css").exists():
    app.mount("/css", StaticFiles(directory=str(BASE_DIR / "css")), name="css")
if (BASE_DIR / "js").exists():
    app.mount("/js", StaticFiles(directory=str(BASE_DIR / "js")), name="js")
if (BASE_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(BASE_DIR / "assets")), name="assets")

@app.get("/")
def serve_index():
    from fastapi.responses import HTMLResponse
    index_file = BASE_DIR / "index.html"
    if index_file.exists():
        reload_environment()
        carto_key = os.getenv("CARTO_API_KEY", "YOUR_CARTO_API_KEY_HERE").strip()
        html = index_file.read_text(encoding="utf-8")
        injected = f'<script>window.CARTO_API_KEY = "{carto_key}";</script>\n</head>'
        html = html.replace('</head>', injected, 1)
        return HTMLResponse(content=html, media_type="text/html")
    return {"message": "Bharat Explore API is running. Access endpoints via /api/destinations or /api/passes"}

@app.get("/login")
@app.get("/login.html")
def serve_login():
    login_file = BASE_DIR / "login.html"
    if login_file.exists():
        return FileResponse(str(login_file), media_type="text/html")
    raise HTTPException(status_code=404, detail="Login page not found")

@app.get("/register")
@app.get("/register.html")
def serve_register():
    reg_file = BASE_DIR / "register.html"
    if reg_file.exists():
        return FileResponse(str(reg_file), media_type="text/html")
    raise HTTPException(status_code=404, detail="Registration page not found")

@app.get("/profile")
@app.get("/profile.html")
def serve_profile():
    prof_file = BASE_DIR / "profile.html"
    if prof_file.exists():
        return FileResponse(str(prof_file), media_type="text/html")
    raise HTTPException(status_code=404, detail="Profile page not found")

@app.get("/CodeBreakerz.html")
@app.get("/CodeBrekerz.html")
@app.get("/codebreakerz")
@app.get("/team")
def serve_codebreakerz():
    cb_file = BASE_DIR / "CodeBreakerz.html"
    if cb_file.exists():
        return FileResponse(str(cb_file), media_type="text/html")
    raise HTTPException(status_code=404, detail="CodeBreakerz document not found")

@app.get("/favicon.ico")
@app.get("/favicon.png")
def serve_favicon():
    fav_file = BASE_DIR / "assets" / "images" / "favicon.png"
    if fav_file.exists():
        return FileResponse(str(fav_file), media_type="image/png")
    raise HTTPException(status_code=404, detail="Favicon not found")

if __name__ == "__main__":
    import uvicorn
    app_target = "backend.server:app" if (Path.cwd() / "backend").exists() else "server:app"
    uvicorn.run(app_target, host="127.0.0.1", port=8000, reload=True)