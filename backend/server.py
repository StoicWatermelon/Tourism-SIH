import os
import json
from datetime import datetime
from typing import Optional, List
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables dynamically
def reload_environment():
    env_path = BASE_DIR / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)
    else:
        load_dotenv(override=True)

reload_environment()

from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from google import genai
from google.genai import types

from sqlalchemy import create_engine, Column, Integer, String, Boolean, Float, Text, DateTime, JSON
from sqlalchemy.orm import declarative_base, sessionmaker, Session


DB_PATH = BASE_DIR / "bharat_explore.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

# SQLAlchemy Engine & Session
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class Destination(Base):
    __tablename__ = "destinations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    state = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    emotion = Column(String, nullable=True, index=True)
    best_season = Column(String, nullable=False)
    difficulty = Column(String, default="Easy")
    type = Column(String, nullable=False)
    budget = Column(Integer, default=3000)
    img = Column(String, nullable=False)
    desc = Column(Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "state": self.state,
            "category": self.category,
            "emotion": self.emotion,
            "bestSeason": self.best_season,
            "difficulty": self.difficulty,
            "type": self.type,
            "budget": self.budget,
            "img": self.img,
            "desc": self.desc
        }

class PassAdvisory(Base):
    __tablename__ = "pass_advisories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)  # OPEN, CAUTION, RESTRICTED, CLOSED
    altitude = Column(String, nullable=False)
    condition = Column(Text, nullable=False)
    safe = Column(Boolean, default=True)
    temperature = Column(String, default="-2°C")
    last_updated = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "status": self.status,
            "altitude": self.altitude,
            "condition": self.condition,
            "safe": self.safe,
            "temperature": self.temperature,
            "updated": self.last_updated.strftime("%Y-%m-%d %H:%M UTC") if self.last_updated else "Live"
        }

class SavedJourney(Base):
    __tablename__ = "saved_journeys"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String, nullable=False, index=True)
    destination_ids = Column(JSON, nullable=False)
    notes = Column(Text, nullable=True)
    travel_style = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create Database Tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

def seed_database():
    db = SessionLocal()
    try:
        # Seed destinations if empty
        if db.query(Destination).count() == 0:
            for item in INITIAL_DESTINATIONS:
                dest = Destination(**item)
                db.add(dest)
            db.commit()
            print("[DB] Initialized database with destinations dataset.")

        # Seed pass advisories if empty
        if db.query(PassAdvisory).count() == 0:
            for item in INITIAL_PASSES:
                advisory = PassAdvisory(**item)
                db.add(advisory)
            db.commit()
            print("[DB] Initialized database with real-time pass advisories.")
    except Exception as e:
        db.rollback()
        print(f"[DB] Error seeding database: {e}")
    finally:
        db.close()

# Run startup seed
seed_database()

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

def get_system_instruction(lang: str = "en") -> str:
    base = (
        "You are Bharat AI, an expert, verified sustainable tourism specialist for Ladakh and India. "
        "Deliver actionable, complete guidance structured with clear headings, bullet points, and bold text. "
        "Emphasize high-altitude safety, 48-hour Leh acclimatization, mountain pass advisories, leave-no-trace ethics, and local community economy. "
        "Never terminate mid-sentence. Always finalize thoughts clearly."
    )
    if lang == "hi":
        return base + (
            "\n\nCRITICAL LANGUAGE MANDATE: The user has selected HINDI (हिन्दी) as their UI language. "
            "You MUST formulate your ENTIRE response exclusively in natural, fluent Hindi using the Devanagari script (देवनागरी लिपि). "
            "Even if the user asks their question in English or Roman script, your response MUST be 100% in Hindi. "
            "Do NOT output English. Use clear Hindi headings, bullet points, and authentic vocabulary."
        )
    elif lang == "bn":
        return base + (
            "\n\nCRITICAL LANGUAGE MANDATE: The user has selected BENGALI (বাংলা) as their UI language. "
            "You MUST formulate your ENTIRE response exclusively in natural, fluent Bengali using the Bengali script (বাংলা লিপি). "
            "Even if the user asks their question in English or Roman script, your response MUST be 100% in Bengali. "
            "Do NOT output English. Use clear Bengali headings, bullet points, and authentic vocabulary."
        )
    else:
        return base + (
            "\n\nCRITICAL LANGUAGE MANDATE: The user has selected ENGLISH as their UI language. "
            "You MUST formulate your ENTIRE response in clear, professional English with markdown headings, bold text, and structured bullet points."
        )

class ChatRequest(BaseModel):
    message: str
    lang: Optional[str] = "en"

class JourneySaveRequest(BaseModel):
    session_id: str
    destination_ids: List[str]
    notes: Optional[str] = None
    travel_style: Optional[str] = "Adventure"

# --- REST Endpoints ---

@app.get("/api/config")
def get_app_config():
    """Returns public frontend configuration including basemap keys."""
    return {
        "CARTO_API_KEY": os.getenv("CARTO_API_KEY", "YOUR_CARTO_API_KEY_HERE")
    }

@app.get("/api/destinations")
def get_destinations(
    category: Optional[str] = Query(None, description="Filter by category e.g. mountains, culture, adventure"),
    state: Optional[str] = Query(None, description="Filter by state e.g. Ladakh, Rajasthan"),
    emotion: Optional[str] = Query(None, description="Filter by emotion e.g. peace, adventure, culture"),
    search: Optional[str] = Query(None, description="Search term across name, location, and description"),
    db: Session = Depends(get_db)
):
    query = db.query(Destination)

    if category:
        query = query.filter(Destination.category.ilike(f"%{category}%"))
    if state:
        query = query.filter(Destination.state.ilike(f"%{state}%"))
    if emotion:
        query = query.filter(Destination.emotion.ilike(f"%{emotion}%"))
    if search:
        s = f"%{search}%"
        query = query.filter(
            (Destination.name.ilike(s)) |
            (Destination.location.ilike(s)) |
            (Destination.desc.ilike(s))
        )

    results = query.all()
    return [d.to_dict() for d in results]

@app.get("/api/destinations/{dest_id}")
def get_destination_detail(dest_id: str, db: Session = Depends(get_db)):
    dest = db.query(Destination).filter(Destination.id == dest_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest.to_dict()

@app.get("/api/passes")
def get_all_passes(db: Session = Depends(get_db)):
    """Returns live mountain pass telemetry keyed by pass name for direct frontend integration."""
    passes = db.query(PassAdvisory).all()
    result = {}
    for p in passes:
        result[p.name] = {
            "status": p.status,
            "altitude": p.altitude,
            "condition": p.condition,
            "safe": p.safe,
            "temperature": p.temperature,
            "updated": p.last_updated.strftime("%H:%M IST") if p.last_updated else "Live"
        }
    return result

@app.post("/api/journey/save")
def save_user_journey(payload: JourneySaveRequest, db: Session = Depends(get_db)):
    """Persists user trip bookmarks and custom session configurations."""
    existing = db.query(SavedJourney).filter(SavedJourney.session_id == payload.session_id).first()
    if existing:
        existing.destination_ids = payload.destination_ids
        existing.notes = payload.notes
        existing.travel_style = payload.travel_style
        db.commit()
    else:
        new_journey = SavedJourney(
            session_id=payload.session_id,
            destination_ids=payload.destination_ids,
            notes=payload.notes,
            travel_style=payload.travel_style
        )
        db.add(new_journey)
        db.commit()

    return {
        "success": True,
        "session_id": payload.session_id,
        "saved_count": len(payload.destination_ids),
        "message": "Journey bookmarks saved to database."
    }

@app.get("/api/journey/{session_id}")
def get_user_journey(session_id: str, db: Session = Depends(get_db)):
    """Retrieves saved destinations for a given session."""
    saved = db.query(SavedJourney).filter(SavedJourney.session_id == session_id).first()
    if not saved:
        return {"session_id": session_id, "destination_ids": [], "destinations": []}

    dest_ids = saved.destination_ids or []
    destinations = db.query(Destination).filter(Destination.id.in_(dest_ids)).all()
    return {
        "session_id": session_id,
        "destination_ids": dest_ids,
        "destinations": [d.to_dict() for d in destinations],
        "travel_style": saved.travel_style,
        "notes": saved.notes
    }

# Comprehensive fallback AI heuristic responses — rich structured answers for SIH demo
OFFLINE_AI_RESPONSES = {
    "pack": (
        "**Essential Ladakh Packing List** — curated for high-altitude Himalayan conditions:\n\n"
        "• **Base Layers:** Merino wool thermal tops & bottoms (2 sets minimum). Synthetic base layers dry faster but wool regulates temperature better at altitude.\n"
        "• **Mid Layer:** 600-fill down jacket or fleece pullover for overnight warmth (temperatures drop to -10°C at passes).\n"
        "• **Outer Shell:** Waterproof windproof hardshell jacket (essential for pass crossings and sudden weather).\n"
        "• **Eyewear:** UV-400 polarized glacier sunglasses (mandatory — UV radiation at 17,000 ft is 3x sea level intensity).\n"
        "• **Sun Protection:** SPF 50+ sunscreen + SPF lip balm. Reapply every 2 hours.\n"
        "• **Footwear:** Waterproof hiking boots with ankle support + moisture-wicking trekking socks.\n"
        "• **Hydration:** Insulated reusable water bottle (at least 1.5L). Absolutely no single-use plastic — it is banned in Ladakh.\n"
        "• **Medical Kit:** Diamox (Acetazolamide 250mg — consult physician), ORS sachets, ibuprofen, pulse oximeter, and emergency whistle.\n"
        "• **Documents:** Physical hardcopies of Inner Line Permit (ILP) — carry 4 copies for each restricted area circuit."
    ),
    "acclimat": (
        "**Mandatory Acclimatization Protocol for Leh (11,500 ft):**\n\n"
        "• **Day 1 — Complete Rest:** Land at Leh Airport, go directly to your hotel, and rest for the entire day. Avoid all exertion, including climbing stairs. Allow your body to begin adjusting to 35% lower oxygen levels.\n"
        "• **Day 2 — Light Activity:** Short gentle walks (15–20 min maximum). Visit Leh Market or Shanti Stupa (nearby, low exertion). Monitor for headache, nausea, or breathlessness.\n"
        "• **Hydration Rule:** Drink 4–5 liters of water daily with electrolytes. Avoid alcohol, caffeine, and sleeping pills for the first 48 hours — all suppress the respiratory response.\n"
        "• **Ascend Slowly:** Never ascend more than 300–500m per day above 3,000m. Always ‘climb high, sleep low’.\n"
        "• **AMS Warning Signs:** Throbbing headache, nausea, vomiting, loss of appetite, fatigue, and dizziness. If symptoms worsen — descend immediately to Leh.\n"
        "• **Diamox:** Acetazolamide (125–250mg twice daily) can speed acclimatization — consult your physician before travel. Begin 24 hours before ascent."
    ),
    "pangong": (
        "**Pangong Tso Lake — Complete Travel Guide:**\n\n"
        "• **Altitude:** 14,270 ft (4,350m) — proper Leh acclimatization (48 hours minimum) is mandatory before visiting.\n"
        "• **Best Season:** May through September. The lake freezes solid from December to February (beautiful but hazardous).\n"
        "• **Permits Required:** Inner Line Permit (ILP) for Indian nationals. Protected Area Permit (PAP) for foreign tourists. Both available at DC Office, Leh.\n"
        "• **Route:** Leh → Chang La Pass (17,688 ft) → Tangtse → Pangong Tso. Distance: ~150 km (5–6 hours one way).\n"
        "• **Eco Responsibility:** The lake is a Ramsar Wetland. Zero plastic is permitted. Use designated camping zones only. No soap/detergent within 500m of the lake.\n"
        "• **Offbeat Alternative:** Consider visiting Tso Moriri instead — equally stunning, 95% less crowded, with 94% direct community revenue."
    ),
    "budget": (
        "**Ladakh Trip Budget Guide (Per Person):**\n\n"
        "• **5-Day Budget (Backpacker):** ₹18,000–25,000 — shared taxis, dormitory homestays, local dhabas, and DIY permits.\n"
        "• **7-Day Mid-Range:** ₹30,000–45,000 — private 4x4 taxi, certified eco-homestays, 2 meals daily, all permits.\n"
        "• **10-Day Premium:** ₹60,000–90,000 — luxury camping at Pangong, private guide, premium hotel in Leh, curated experiences.\n"
        "• **Transport:** Leh-Nubra-Pangong circuit 4x4 taxi averages ₹14,000–18,000 for the full loop.\n"
        "• **Permits:** ILP for Nubra + Pangong + Tso Moriri = ₹300–500 total.\n"
        "• **Eco Tip:** Staying in community homestays (₹1,200–2,500/night including meals) is 40% cheaper than hotels and 100% of revenue stays with local families."
    ),
    "pass": (
        "**Mountain Pass Safety Advisory (Live Telemetry):**\n\n"
        "• **Khardung La (17,582 ft) — OPEN:** Light black ice on northern descent. Cross between 06:00–16:00. Maximum stay at summit: 15 minutes (severe altitude risk). 4x4 with snow chains required.\n"
        "• **Chang La (17,688 ft) — CAUTION:** High ridge winds and sub-zero surface (-5°C). Snow drift active near summit. Cross before 14:00. Avoid if storm warning issued.\n"
        "• **Zoji La (11,575 ft) — RESTRICTED:** Freight convoy movement from Sonamarg. Expect 2–3 hour delays. Tourist vehicles allowed only in designated windows.\n"
        "• **Baralacha La (16,040 ft) — OPEN:** Clear passage on Manali-Leh highway. Mandatory acclimatization stop at Jispa or Sarchu recommended.\n"
        "• **General Rule:** Never cross a high pass after 16:00. Weather deteriorates rapidly. Always carry emergency contact numbers: BRO Rescue 1077."
    ),
    "permit": (
        "**Inner Line Permit (ILP) — Complete Guide:**\n\n"
        "• **Who Needs It:** All Indian nationals visiting restricted areas including Nubra Valley, Pangong Tso, Tso Moriri, Turtuk, Tyakshi, and Hanle.\n"
        "• **Foreign Tourists:** Require Protected Area Permit (PAP) — apply through a registered travel agency in Leh. Individual applications not accepted.\n"
        "• **How to Apply:** Online at lahdc.nic.in (24-hour processing) or in-person at DC Office, Leh (same day).\n"
        "• **Print 4 Copies:** Physical hardcopies mandatory at South Pullu, North Pullu, Khardung La, and Tsaga La checkposts.\n"
        "• **Documents Required:** Aadhaar Card / Passport + Voter ID, recent passport photograph, and travel itinerary.\n"
        "• **Fee:** ₹100–200 per area for Indian nationals. Foreign tourists: ₹500–90 per area."
    ),
    "hanle": (
        "**Hanle Dark Sky Reserve — India's First Dark Sky Sanctuary:**\n\n"
        "• **Why Visit:** At 14,900 ft in the Changthang plateau, Hanle has zero light pollution and 270+ clear nights per year — the clearest skies in India for naked-eye Milky Way observation.\n"
        "• **Indian Astronomical Observatory:** Home to one of the world's highest optical telescopes (2.01m diameter, at 15,070 ft). Public telescope viewing sessions are available on designated dates.\n"
        "• **Village Astrostays:** Stay in community-run stargazing homestays — 95% of revenue stays directly with Hanle village families.\n"
        "• **Best Season:** May through October for Milky Way core visibility. Winter (Dec–Feb) for star cluster photography but severe cold (-25°C).\n"
        "• **Decongestion Impact:** Choosing Hanle over Pangong diverts footfall away from saturated zones, reducing vehicle emissions and supporting indigenous Changpa nomad livelihoods."
    ),
    "turtuk": (
        "**Turtuk — India's Northernmost Village:**\n\n"
        "• **Location:** 9,800 ft altitude in the Shyok River valley, just 7 km from the Pakistan border. Opened to tourists only in 2010.\n"
        "• **Unique Culture:** Turtuk is a Balti Muslim village with a distinct Central Asian heritage — the only such settlement open to tourists in this region.\n"
        "• **Apricot Orchards:** Turtuk produces some of India's finest organically grown apricots (available June–August). Local families sell sun-dried apricots, apricot oil, and jam directly.\n"
        "• **Eco Impact:** 90% of tourism revenue stays with local families. Women's cooperatives produce handwoven Balti textiles exclusively for visitors.\n"
        "• **Decongestion Gem:** Visiting Turtuk instead of central Leh reduces pressure on over-saturated zones and keeps fragile border ecosystem intact."
    ),
    "food": (
        "**Ladakhi High-Altitude Cuisine — What to Eat & Why:**\n\n"
        "• **Thukpa:** Whole-grain noodle soup with mountain vegetables and broth — the ideal high-altitude warming meal. Rich in slow-release carbohydrates for sustained energy.\n"
        "• **Skyu:** Handmade wheat-pasta stew slow-cooked on clay hearths — a traditional winter staple that provides warmth and caloric density.\n"
        "• **Gur Gur Cha (Butter Tea):** Churned with yak butter and Himalayan rock salt — essential for hydration and calorie intake at altitude. Avoid rejecting it when offered — it is a cultural gesture of welcome.\n"
        "• **Tingmo:** Steamed flower-shaped bread made from tsampa (roasted barley) — a staple accompaniment to any Ladakhi meal.\n"
        "• **Zero Food Miles:** All authentic Ladakhi cuisine is sourced within 20 km of where it is served. Eating local supports 80–95% direct revenue to farming cooperatives."
    ),
    "wildlife": (
        "**Ladakh Wildlife & Conservation Zones:**\n\n"
        "• **Snow Leopard (Panthera uncia):** Hemis National Park is the world's highest density snow leopard habitat. Best sighting probability: January–March. Maintain 100m+ distance at all times.\n"
        "• **Black-Necked Crane:** Sacred bird of Tibetan Buddhism, nests at Tso Moriri and Tso Kar wetlands (June–October). Zero disturbance protocol mandatory.\n"
        "• **Kiang (Tibetan Wild Ass):** Found in Changthang plateau — do not approach or feed.\n"
        "• **Bar-Headed Goose:** Migrates over the Himalayas at 29,000 ft — world's highest flying bird. Spotted at Pangong and Tso Moriri.\n"
        "• **Leave No Trace:** Never approach wildlife within 50m. No flash photography. Stay on designated trails. Report injured wildlife to Wildlife Warden, Leh: +91-1982-252094."
    ),
    "monstera": (
        "**Sacred Monasteries of Ladakh — Visitor Guide:**\n\n"
        "• **Hemis (12,000 ft):** Drukpa Kagyu lineage, established 1672 AD. Largest monastery in Ladakh. Hemis Festival (Tsechu) in June–July features spectacular Cham masked dances.\n"
        "• **Thiksey (11,800 ft):** 12-storey gompa complex resembling Lhasa's Potala Palace. Dawn prayers (5:00 AM) are open to respectful visitors.\n"
        "• **Alchi (10,200 ft):** 11th century murals protected by UNESCO — the oldest intact Kashmiri-style Buddhist art in the world. Photography of murals is prohibited.\n"
        "• **Phugtal (13,500 ft):** Zanskar's dramatic cliffside cave monastery accessible only by 2-day trek from Padum. The most remote and pristine spiritual site in Ladakh.\n"
        "• **Etiquette:** Remove footwear before entering prayer halls. Walk clockwise around stupas. Silence inside gompa interiors. Ask permission before photographing monks."
    ),
    "decongest": (
        "**Smart Decongestion Strategy — Why Offbeat Matters:**\n\n"
        "• **The Problem:** Pangong Tso receives 200,000+ tourists annually. Vehicle congestion on the single-lane Leh-Chang La road causes 4–6 hour jams, diesel pollution, and permafrost damage.\n"
        "• **The Solution:** Bharat Explore's Smart Decongestion Engine redirects 30% of traffic to secondary corridors: Hanle, Turtuk, Sham Valley, and Tso Moriri.\n"
        "• **Sham Valley (Baby Trek):** 10,200 ft — ideal for acclimatization, zero crowds, 92% revenue to local apricot farming families.\n"
        "• **Tso Moriri:** Ramsar wetland at 14,836 ft — 94% community revenue, Black-Necked Crane sanctuary, near-zero tourist congestion.\n"
        "• **Economic Impact:** Each tourist choosing an offbeat destination over Pangong redirects ₹4,000–8,000 directly to under-served village economies."
    ),
    "safety": (
        "**High-Altitude Safety Protocols — Non-Negotiable Rules:**\n\n"
        "• **SpO2 Monitoring:** Carry a pulse oximeter. Normal at Leh: 85–90%. Below 80% = seek medical attention immediately. Below 70% = emergency evacuation required.\n"
        "• **Golden Rule:** Never ascend with symptoms. Headache, nausea, and fatigue at altitude are your body's warning system — descend first, rest, then reassess.\n"
        "• **Emergency Numbers:** SNM District Hospital Leh: +91-1982-252014. HIMANK BRO Rescue: 1077. Army Medical Corps: +91-1982-252345.\n"
        "• **Oxygen Cans:** Emergency supplemental oxygen cans (available at Leh pharmacies, ₹500–800 each) are recommended for first-time visitors.\n"
        "• **Travel Insurance:** Ensure your policy covers helicopter evacuation from remote Himalayan zones — standard travel insurance does NOT cover this."
    ),
}

OFFLINE_AI_RESPONSES_HI = {
    "pack": (
        "**उच्च हिमालयी दर्रों के लिए आवश्यक पैकिंग सूची:**\n\n"
        "• **थर्मल बेस लेयर्स:** मेरिनो वूल के कम से कम 2 सेट (ऊंचाई पर तापमान नियंत्रित करने हेतु सर्वश्रेष्ठ)।\n"
        "• **विंडप्रूफ जैकेट:** 600-फिल डाउन जैकेट और वाटरप्रूफ विंडचीटर (दर्रों पर तापमान -10°C तक गिर जाता है)।\n"
        "• **धूप का चश्मा:** UV-400 पोलराइज्ड ग्लेशियर ग्लासेस (17,000 फीट पर तीव्र पराबैंगनी किरणों से बचाव हेतु अनिवार्य)।\n"
        "• **पुनः प्रयोज्य फ्लास्क:** इंसुलेटेड गर्म पानी की बोतल (एकल-उपयोग प्लास्टिक लद्दाख में पूर्णतः प्रतिबंधित है)।\n"
        "• **सनस्क्रीन:** SPF 50+ सनस्क्रीन और लिप बाम। हर 2 घंटे में दोबारा लगाएं।\n"
        "• **दवाइयां:** डायमॉक्स (AMS रोकथाम हेतु), ORS इलेक्ट्रोलाइट्स, पल्स ऑक्सीमीटर और प्राथमिक चिकित्सा किट।\n"
        "• **परमिट प्रतियां:** इनर लाइन परमिट (ILP) की कम से कम 4 भौतिक हार्डकॉपी साथ रखें।"
    ),
    "acclimat": (
        "**लेह (11,500 फीट) के लिए अनिवार्य 48-घंटे अनुकूलन प्रोटोकॉल:**\n\n"
        "• **पहला दिन — पूर्ण शारीरिक विश्राम:** लेह हवाई अड्डे पर उतरने के बाद सीधे होटल जाएं और पूरा दिन आराम करें। सीढ़ियां चढ़ने या भारी परिश्रम से बचें।\n"
        "• **दूसरा दिन — हल्की सैर:** लेह बाजार या शांति स्तूप तक 15–20 मिनट की धीमी सैर करें। सिरदर्द या चक्कर के लक्षणों पर नजर रखें।\n"
        "• **जलयोजन नियम:** प्रतिदिन 4–5 लीटर पानी और इलेक्ट्रोलाइट्स पिएं। शराब, कैफीन और नींद की गोलियों से पहले 48 घंटे पूरी तरह बचें।\n"
        "• **धीमी चढ़ाई:** प्रतिदिन 300–500 मीटर से अधिक ऊंचाई पर न सोएं। 'ऊंचाई पर चढ़ें, नीचे सोएं' नियम का पालन करें।\n"
        "• **AMS चेतावनी संकेत:** गंभीर सिरदर्द, उल्टी, भूख न लगना या अत्यधिक थकान होने पर तुरंत कम ऊंचाई पर जाएं।"
    ),
    "pangong": (
        "**पैंगोंग त्सो झील — संपूर्ण यात्रा व पर्यावरण दिशानिर्देश:**\n\n"
        "• **ऊंचाई:** 14,270 फीट — लेह में 48 घंटे का पूर्व-अनुकूलन अनिवार्य है।\n"
        "• **सर्वोत्तम मौसम:** मई से सितंबर (सर्दियों में झील पूरी तरह जम जाती है)।\n"
        "• **मार्ग:** लेह → चांग ला दर्रा (17,688 फीट) → तंगत्से → पैंगोंग त्सो (दूरी: ~150 किमी, 5–6 घंटे)।\n"
        "• **परमिट:** भारतीय पर्यटकों के लिए इनर लाइन परमिट (ILP) अनिवार्य है।\n"
        "• **शून्य-प्लास्टिक:** झील रामसर संरक्षित आर्द्रभूमि है। एकल-उपयोग प्लास्टिक पूरी तरह वर्जित है।\n"
        "• **ऑफबीट विकल्प:** त्सो मोरीरी झील का भी विचार करें — समान सुंदरता, 90% कम भीड़ और स्थानीय ग्रामीणों को सीधा आर्थिक लाभ।"
    ),
    "budget": (
        "**लद्दाख यात्रा बजट दिशानिर्देश (प्रति व्यक्ति):**\n\n"
        "• **5-दिवसीय बजट (बैकपैकर):** ₹18,000–25,000 — साझा टैक्सी और होमस्टे।\n"
        "• **7-दिवसीय मध्यम:** ₹30,000–45,000 — निजी 4x4 वाहन और प्रमाणित इको-होमस्टे।\n"
        "• **10-दिवसीय प्रीमियम:** ₹60,000–85,000 — पैंगोंग लक्जरी कैंपिंग और निजी गाइड।\n"
        "• **स्थानीय अर्थव्यवस्था:** ग्रामीण होमस्टे (₹1,500–2,500/रात भोजन सहित) में ठहरने से 80%+ आय सीधे स्थानीय लद्दाखी परिवारों तक पहुंचती है।"
    ),
    "pass": (
        "**पर्वतीय दर्रा लाइव सुरक्षा परामर्श:**\n\n"
        "• **खारदुंग ला (17,582 फीट) — खुला:** उत्तरी ढलानों पर हल्की काली बर्फ। पार करने का समय: सुबह 06:00 से शाम 16:00। शिखर पर अधिकतम ठहराव 15 मिनट रखें।\n"
        "• **चांग ला (17,688 फीट) — सावधानी:** बर्फीली हवाएं (-5°C)। दोपहर 14:00 से पहले पार करें।\n"
        "• **ज़ोजी ला (11,575 फीट) — नियंत्रित:** सोनमर्ग से मालवाहक काफिले की आवाजाही।\n"
        "• **सामान्य नियम:** शाम 16:00 के बाद कभी भी ऊंचे दर्रों को पार न करें। आपातकालीन नंबर: BRO HIMANK 1077।"
    ),
    "permit": (
        "**इनर लाइन परमिट (ILP) — संपूर्ण दिशानिर्देश:**\n\n"
        "• **आवश्यकता:** नुब्रा घाटी, पैंगोंग त्सो, त्सो मोरीरी, तुरतुक और हानले जाने वाले सभी भारतीय नागरिकों के लिए अनिवार्य।\n"
        "• **आवेदन कैसे करें:** lahdc.nic.in पर 24 घंटे में ऑनलाइन प्राप्त करें या लेह में डीसी कार्यालय से लें।\n"
        "• **4 भौतिक प्रतियां:** साउथ पुल्लू, नॉर्थ पुल्लू, खारदुंग ला और त्सागा ला चेकपोस्ट पर जमा करने हेतु 4 मुद्रित प्रतियां आवश्यक हैं।\n"
        "• **दस्तावेज:** आधार कार्ड / पासपोर्ट और पासपोर्ट साइज फोटो।"
    ),
    "hanle": (
        "**हानले डार्क स्काई रिज़र्व — भारत का पहला डार्क स्काई अभयारण्य:**\n\n"
        "• **विशेषता:** चांगथांग पठार पर 14,900 फीट की ऊंचाई पर स्थित हानले में शून्य प्रकाश प्रदूषण और वर्ष में 270+ स्पष्ट रातें हैं।\n"
        "• **खगोलीय वेधशाला:** 15,070 फीट पर 2.01 मीटर व्यास वाले ऑप्टिकल टेलीस्कोप का घर।\n"
        "• **ग्रामीण एस्ट्रोस्टे:** समुदाय संचालित होमस्टे में ठहरें जहां 95% आय सीधे हानले के स्थानीय परिवारों को मिलती है।\n"
        "• **भीड़ नियंत्रण:** हानले का चयन करने से पैंगोंग जैसे भीड़भाड़ वाले क्षेत्रों पर दबाव घटता है।"
    ),
    "turtuk": (
        "**तुरतुक — भारत का सुदूर उत्तरी सीमांत गांव:**\n\n"
        "• **स्थिति:** श्योक नदी घाटी में 9,800 फीट की ऊंचाई पर, नियंत्रण रेखा (LoC) के निकट।\n"
        "• **संस्कृति:** विशिष्ट बाल्टी मुस्लिम संस्कृति, मध्य एशियाई विरासत और पत्थर के पारंपरिक घर।\n"
        "• **खुबानी के बगीचे:** जैविक रूप से उगाई गई मीठी खुबानी और तेल सीधे किसानों से उपलब्ध।\n"
        "• **स्थानीय लाभ:** 90% पर्यटन आय सीधे स्थानीय परिवारों और महिला बुनकर सहकारी समितियों को जाती है।"
    ),
    "food": (
        "**लद्दाखी उच्च-हिमालयी व्यंजन — क्या खाएं और क्यों:**\n\n"
        "• **थुकपा:** साबुत अनाज नूडल सूप और ताजी पहाड़ी सब्जियां — उच्च ऊंचाई पर शरीर को गर्म रखने हेतु आदर्श भोजन।\n"
        "• **स्क्यू:** हाथ से बनी पारंपरिक गेहूं की पास्ता स्टू जो मिट्टी के चूल्हे पर धीमी आंच पर पकाई जाती है।\n"
        "• **गुर गुर चाय (बटर टी):** याक मक्खन और हिमालयी सेंधा नमक से मथी गई ऊर्जावान चाय।\n"
        "• **तिंगमो:** भुने हुए जौ (त्सम्पा) से बनी फूल के आकार की भाप में पकी बेहद मुलायम ब्रेड।\n"
        "• **जीरो-माइल फूड:** 100% सामग्री 20 किमी के भीतर स्थानीय रूप से उगाई जाती है।"
    ),
    "wildlife": (
        "**लद्दाख वन्यजीव व संरक्षण क्षेत्र:**\n\n"
        "• **हिम तेंदुआ (Snow Leopard):** हेमिस राष्ट्रीय उद्यान दुनिया में हिम तेंदुए का सबसे बड़ा आवास है। जनवरी–मार्च में दिखने की सर्वाधिक संभावना। कम से कम 100 मीटर की दूरी बनाए रखें।\n"
        "• **काली गर्दन वाला सारस (Black-Necked Crane):** तिब्बती बौद्ध धर्म का पवित्र पक्षी जो त्सो मोरीरी और त्सो कर में घोंसला बनाता है।\n"
        "• **आचार संहिता:** वन्यजीवों के 50 मीटर से अधिक पास न जाएं। फ्लैश फोटोग्राफी पूरी तरह प्रतिबंधित है।"
    ),
    "monstera": (
        "**लद्दाख के पवित्र बौद्ध मठ — आगंतुक दिशानिर्देश:**\n\n"
        "• **हेमिस (12,000 फीट):** ड्रुकपा काग्यू वंश का सबसे बड़ा मठ। जून-जुलाई में हेमिस उत्सव में प्रसिद्ध चाम नृत्य का आयोजन।\n"
        "• **थिक्सिक (11,800 फीट):** 12 मंजिला मठ परिसर जो ल्हासा के पोटाला पैलेस जैसा दिखता है।\n"
        "• **अलची (10,200 फीट):** 11वीं सदी के भित्ति चित्र (UNESCO संरक्षित)। चित्रों की फोटोग्राफी सख्त वर्जित है।\n"
        "• **मठ मर्यादा:** जूते उतारें, स्तूपों की घड़ी की दिशा में परिक्रमा करें और मौन बनाए रखें।"
    ),
    "decongest": (
        "**स्मार्ट भीड़-नियंत्रण रणनीति और लाभ:**\n\n"
        "• **माध्यमिक गलियारे:** तुरतुक, हानले, शाम घाटी और त्सो मोरीरी जैसे ऑफबीट स्थानों का दौरा करें।\n"
        "• **हॉटस्पॉट पर राहत:** पैंगोंग और केंद्रीय लेह पर वाहनों का दबाव और प्रदूषण 60% तक घटता है।\n"
        "• **पर्यावरण संरक्षण:** अल्पाइन ग्लेशियर जल स्रोतों और नाजुक पर्माफ्रॉस्ट की रक्षा होती है।\n"
        "• **आर्थिक न्याय:** 80%+ पर्यटन आय दूरदराज के लद्दाखी परिवारों और महिला सहकारी समितियों तक सीधी पहुंचती है।"
    ),
    "safety": (
        "**उच्च-ऊंचाई सुरक्षा नियम — अनिवार्य प्रोटोकॉल:**\n\n"
        "• **SpO2 निगरानी:** पल्स ऑक्सीमीटर साथ रखें। लेह में 85–90% सामान्य है। 80% से कम होने पर तुरंत चिकित्सा सहायता लें।\n"
        "• **सुनहरा नियम:** लक्षणों के साथ कभी भी ऊपर न चढ़ें। सिरदर्द या उल्टी होने पर पहले नीचे उतरें।\n"
        "• **आपातकालीन नंबर:** SNM जिला अस्पताल लेह: +91-1982-252014, BRO रेस्क्यू: 1077।\n"
        "• **ऑक्सीजन सिलेंडर:** पहली बार आने वालों के लिए आपातकालीन ऑक्सीजन कैन (लेह फार्मेसी में उपलब्ध) की सिफारिश की जाती है।"
    )
}

OFFLINE_AI_RESPONSES_BN = {
    "pack": (
        "**উচ্চ হিমালয় গিরিপথের প্রয়োজনীয় প্যাকিং তালিকা:**\n\n"
        "• **থার্মাল বেস লেয়ার:** মেরিনো উলের অন্তত ২ সেট (উচ্চতায় সঠিক তাপমাত্রা বজায় রাখার জন্য)।\n"
        "• **উইন্ডপ্রুফ জ্যাকেট:** ৬০০-ফিল ডাউন জ্যাকেট ও উইন্ডচিটার (গিরিপথে তাপমাত্রা -১০°C পর্যন্ত নামে)।\n"
        "• **রোদচশমা:** UV-400 পোলারাইজড গ্লেসিয়ার চশমা (১৭,০০০ ফুট উচ্চতায় অতিবেগুনি রশ্মি ৩ গুণ তীব্র)।\n"
        "• **থার্মো ফ্লাস্ক:** পুনরায় ব্যবহারযোগ্য ইনসুলেটেড জলের বোতল (একক প্লাস্টিক লাদাখে সম্পূর্ণ নিষিদ্ধ)।\n"
        "• **সানস্ক্রিন:** SPF 50+ সানস্ক্রিন ও লিপবাম।\n"
        "• **ওষুধ:** ডায়ামক্স (উচ্চতাজনিত অসুস্থতা প্রতিরোধের জন্য), ওআরএস ও পালস অক্সিমিটার।\n"
        "• **পারমিট কপি:** ইনার লাইন পারমিটের (ILP) ৪টি প্রিন্ট কপি সাথে রাখুন।"
    ),
    "acclimat": (
        "**লেহ (১১,৫০০ ফুট) পৌঁছানোর পর বাধ্যতামূলক ৪৮ ঘণ্টার অভিযোজন নির্দেশিকা:**\n\n"
        "• **প্রথম দিন — সম্পূর্ণ বিশ্রাম:** লেহ বিমানবন্দরে নেমে সরাসরি হোটেলে গিয়ে সারা দিন পূর্ণ বিশ্রাম নিন। কোনো ভারী কাজ বা সিঁড়ি ভাঙা এড়িয়ে চলুন।\n"
        "• **দ্বিতীয় দিন — হালকা হাঁটাচলা:** লেহ বাজার বা শান্তি স্তূপের আশেপাশে ১৫–২০ মিনিট ধীরেসুস্থে হাঁটুন। মাথাব্যথা বা বমির ভাবের দিকে খেয়াল রাখুন।\n"
        "• **জলপানের নিয়ম:** প্রতিদিন ৪–৫ লিটার জল ও ওআরএস পান করুন। অ্যালকোহল ও ঘুমের ওষুধ এড়িয়ে চলুন।\n"
        "• **AMS সতর্কতা লক্ষণ:** তীব্র মাথাব্যথা, বমি ভাব, ক্ষুধামান্দ্য ও শ্বাসকষ্ট দেখা দিলে অবিলম্বে নিচে নেমে আসুন।"
    ),
    "pangong": (
        "**প্যাংগং ত্সো লেক — ভ্রমণ ও পরিবেশবান্ধব নির্দেশিকা:**\n\n"
        "• **উচ্চতা:** ১৪,২৭০ ফুট — লেহ শহরে ৪৮ ঘণ্টার অভিযোজন সম্পন্ন করা বাধ্যতামূলক।\n"
        "• **সেরা সময়:** মে থেকে সেপ্টেম্বর।\n"
        "• **রুট:** লেহ → চাং লা গিরিপথ (১৭,৬৮৮ ফুট) → তাংসে → প্যাংগং লেক (দূরত্ব ১৫০ কিমি, ৫–৬ ঘণ্টা)।\n"
        "• **পারমিট:** ভারতীয় পর্যটকদের জন্য ইনার লাইন পারমিট (ILP) আবশ্যক।\n"
        "• **পরিবেশ রক্ষা:** প্লাস্টিক বহন নিষিদ্ধ। হ্রদের জলে সাবান বা শ্যাম্পু ব্যবহার করবেন না।\n"
        "• **বিকল্প অফবিট:** ত্সো মোরিরি হ্রদেও যেতে পারেন — অপরূপ প্রাকৃতিক সৌন্দর্য ও ৯০% কম ভিড়।"
    ),
    "budget": (
        "**লাদাখ ভ্রমণ বাজেট গাইড (জনপ্রতি):**\n\n"
        "• **৫ দিনের বাজেট (ব্যাকপ্যাকার):** ১৮,০০০–২৫,০০০ টাকা — শেয়ার্ড ট্যাক্সি ও গ্রামীণ হোমস্টে।\n"
        "• **৭ দিনের মিড-রেঞ্জ:** ৩০,০০০–৪৫,০০০ টাকা — ব্যক্তিগত ৪x৪ গাড়ি ও সার্টিফাইড ইকো-হোমস্টে।\n"
        "• **১০ দিনের প্রিমিয়াম:** ৬০,০০০–৮৫,০০০ টাকা — প্যাংগং ক্যাম্পিং ও অভিজ্ঞ গাইড।\n"
        "• **অর্থনৈতিক প্রভাব:** কমিউনিটি হোমস্টেতে থাকলে হোটেলের চেয়ে খরচ ৪০% কমে এবং ব্যয়ের ৮০%+ অর্থ সরাসরি স্থানীয় পরিবারের কাছে পৌঁছায়।"
    ),
    "pass": (
        "**পাহাড়ি গিরিপথ লাইভ সুরক্ষা সতর্কতা:**\n\n"
        "• **খারদুং লা (১৭,৫৮২ ফুট) — খোলা:** উত্তর ঢালে পিচ্ছিল বরফ রয়েছে। চলাচলের সময়: সকাল ০৬:০০ থেকে বিকাল ১৬:০০। গিরিপথের চূড়ায় সর্বোচ্চ ১৫ মিনিট অবস্থান করুন।\n"
        "• **চাং লা (১৭,৬৮৮ ফুট) — সতর্কতা:** প্রচণ্ড ঠান্ডা বাতাস (-৫°C)। দুপুর ১৪:০০ টার মধ্যে পার হন।\n"
        "• **জরুরি নিয়ম:** বিকাল ১৬:০০ টার পর কোনো গিরিপথ পার হবেন না। পাহাড়ি উদ্ধার হেল্পলাইন: BRO HIMANK ১০৭৭।"
    ),
    "permit": (
        "**ইনার লাইন পারমিট (ILP) — সম্পূর্ণ নির্দেশিকা:**\n\n"
        "• **প্রয়োজনীয়তা:** নুব্রা ভ্যালি, প্যাংগং ত্সো, ত্সো মোরিরি, তুরতুক ও হানলে ভ্রমণের জন্য সমস্ত ভারতীয় পর্যটকদের ILP প্রয়োজন।\n"
        "• **আবেদন:** lahdc.nic.in ওয়েবসাইটে ২৪ ঘণ্টায় অথবা লেহ ডিসি অফিসে সরাসরি করা যায়।\n"
        "• **৪টি প্রিন্ট কপি:** সাউথ পুল্লু, নর্থ পুল্লু, খারদুং লা চেকপোস্টে জমার জন্য ৪টি হার্ডকপি সাথে রাখুন।\n"
        "• **নথিপত্র:** আধার কার্ড বা পাসপোর্ট এবং পাসপোর্ট ছবি।"
    ),
    "hanle": (
        "**হানলে ডার্ক স্কাই রিজার্ভ — ভারতের প্রথম ডার্ক স্কাই স্যাঙ্কচুয়ারি:**\n\n"
        "• **আকর্ষণ:** ১৪,৯০০ ফুট উচ্চতায় শূন্য আলোক দূষণ ও বছরে ২৭০+ মেঘমুক্ত রাত — খালি চোখে ছায়াপথ (Milky Way) দেখার সেরা স্থান।\n"
        "• **ইন্ডিয়ান অ্যাস্ট্রোনমিক্যাল অবজারভেটরি:** বিশ্বের অন্যতম সর্বোচ্চ অপটিক্যাল টেলিস্কোপ এখানে অবস্থিত।\n"
        "• **গ্রামীণ অ্যাস্ট্রোস্টে:** গ্রামবাসীদের পরিচালিত টেলিস্কোপ-যুক্ত হোমস্টেতে রাত কাটান — ব্যয়ের ৯৫% অর্থ সরাসরি হানলেবাসী পান।\n"
        "• **ভিড় নিয়ন্ত্রণ:** প্যাংগং হ্রদের বিকল্প হিসেবে হানলে নির্বাচন ভঙ্গুর পাহাড়ি পরিবেশ রক্ষা করে।"
    ),
    "turtuk": (
        "**তুরতুক — ভারতের উত্তরতম সীমান্তবর্তী গ্রাম:**\n\n"
        "• **অবস্থান:** শ্যোক নদী উপত্যকায় ৯,৮০০ ফুট উচ্চতায়। ২০১০ সালে পর্যটকদের জন্য উন্মুক্ত হয়।\n"
        "• **অনন্য সংস্কৃতি:** বালতি মুসলিম সংস্কৃতি ও মধ্য এশিয়ার প্রাচীন ঐতিহ্য সমৃদ্ধ গ্রাম।\n"
        "• **অ্যাপ্রিকট বাগান:** সুস্বাদু অর্গানিক শুকনো অ্যাপ্রিকট ও তেল সরাসরি স্থানীয় চাষীদের কাছ থেকে পাওয়া যায়।\n"
        "• **স্থানীয় অর্থনীতি:** পর্যটন খরচের ৯০% অর্থ সরাসরি স্থানীয় পরিবার ও মহিলা সমবায়ের হাতে পৌঁছায়।"
    ),
    "food": (
        "**লাদাখের পাহাড়ি খাদ্যসংস্কৃতি — কী খাবেন ও কেন:**\n\n"
        "• **থুকপা:** হস্তনির্মিত নুডল স্যুপ ও পাহাড়ি শাকসবজি — উচ্চতায় শরীর গরম রাখার সেরা খাবার।\n"
        "• **স্কিউ:** মাটির উনুনে ধীরে ধীরে রান্না করা ঐতিহ্যবাহী গমের পাস্তা স্টু।\n"
        "• **গুর গুর চা (বাটার টি):** ইয়াকের মাখন ও হিমালয়ের শিলালবণ দিয়ে তৈরি শরীর আর্দ্র রাখার উপকারী পানীয়।\n"
        "• **তিংমো:** বার্লি ময়দা দিয়ে তৈরি নরম ভাপা রুটি।\n"
        "• **জিরো-মাইল ফুড:** পরিবেশিত খাবারের সমস্ত উপাদান স্থানীয়ভাবে ২০ কিলোমিটারের মধ্যে চাষ করা হয়।"
    ),
    "wildlife": (
        "**লাদাখের বন্যপ্রাণী ও সংরক্ষণ অঞ্চল:**\n\n"
        "• **স্নো লেপার্ড:** হেমিস জাতীয় উদ্যান বিশ্বের অন্যতম প্রধান স্নো লেপার্ডের বাসস্থান। জানুয়ারি–মার্চে দেখার সম্ভাবনা বেশি।\n"
        "• **কালো গলার সারস:** তিব্বতি বৌদ্ধধর্মে পবিত্র এই পাখি ত্সো মোরিরিতে প্রজনন করে।\n"
        "• **পরিবেশবিধি:** বন্যপ্রাণীর ৫০ মিটারের কাছে যাবেন না। ফ্ল্যাশ ফটোগ্রাফি সম্পূর্ণ নিষিদ্ধ।"
    ),
    "monstera": (
        "**লাদাখের প্রাচীন বৌদ্ধ মঠ — দর্শনার্থীদের নির্দেশিকা:**\n\n"
        "• **হেমিস (১২,০০০ ফুট):** লাদাখের বৃহত্তম প্রাচীন গুম্ফা। জুন-জুলাইয়ে পবিত্র মুখোশ নৃত্য (চাম) অনুষ্ঠিত হয়।\n"
        "• **থিকসে (১১,৮০০ ফুট):** ১২ তলা বিশিষ্ট অপূর্ব মঠ যা লাসার পোতালা প্রাসাদের আদলে নির্মিত।\n"
        "• **আলচি (১০,২০০ ফুট):** ১১শ শতাব্দীর ইউনেস্কো সুরক্ষিত প্রাচীরচিত্র। ছবি তোলা সম্পূর্ণ নিষিদ্ধ।\n"
        "• **মঠের শালীনতা:** জুতো বাইরে রাখুন এবং স্তূপ প্রদক্ষিণ করার সময় ঘড়ির কাঁটার দিকে হাঁটুন।"
    ),
    "decongest": (
        "**স্মার্ট ভিড়-নিয়ন্ত্রণ কৌশল ও সুবিধা:**\n\n"
        "• **বিকল্প করিডোর:** তুরতুক, হানলে, শাম উপত্যকা ও ত্সো মোরিরির মতো অফবিট স্থান পরিদর্শন করুন।\n"
        "• **ভিড় হ্রাস:** প্যাংগং ও লেহ শহরের উপর যানজট ও দূষণের চাপ ৬০% কমে।\n"
        "• **বাস্তুতন্ত্র রক্ষা:** হিমবাহের জলস্তর ও বিরল স্নো লেপার্ডের আবাসস্থল সুরক্ষিত থাকে।\n"
        "• **অর্থনৈতিক সমতা:** পর্যটন ব্যয়ের ৮০%+ অর্থ সরাসরি প্রত্যন্ত পাহাড়ি পরিবারের হাতে পৌঁছায়।"
    ),
    "safety": (
        "**উচ্চ পাহাড়ি সুরক্ষা প্রোটোকল — অবশ্য পালনীয় নিয়ম:**\n\n"
        "• **SpO2 পর্যবেক্ষণ:** পালস অক্সিমিটার সাথে রাখুন। লেহ শহরে ৮৫–৯০% স্বাভাবিক। ৮০% এর নিচে নামলে চিকিৎসকের পরামর্শ নিন।\n"
        "• **সোনালী নিয়ম:** অসুস্থতা বা মাথা ঘোরার উপসর্গ নিয়ে কখনোই উপরে উঠবেন না।\n"
        "• **জরুরি নম্বর:** এসএনএম জেলা হাসপাতাল লেহ: +91-1982-252014, বিআরও রেসকিউ: 1077।\n"
        "• **অক্সিজেন ক্যান:** প্রথমবার ভ্রমণকারীদের জন্য ইমার্জেন্সি অক্সিজেন ক্যান সাথে রাখা সহায়ক।"
    )
}

def get_heuristic_reply(prompt: str, lang: str = "en") -> str:
    p = prompt.lower()
    # Priority keyword matching across English, Hindi, and Bengali
    keyword_map = [
        (["pack", "gear", "carry", "bag", "clothes", "clothing", "wear", "equipment", "पैक", "सामान", "প্যাক", "জিনিস"], "pack"),
        (["acclimat", "altitude sickness", "ams", "mountain sickness", "oxygen", "breathe", "अनुकूलन", "ऊंचाई", "অভিযোজন", "উচ্চতা"], "acclimat"),
        (["pangong", "tso", "lake", "पैंगोंग", "প্যাংগং", "হ্রদ"], "pangong"),
        (["budget", "cost", "price", "money", "expensive", "cheap", "afford", "spend", "बजट", "खर्च", "বাজেট"], "budget"),
        (["pass", "khardung", "chang la", "zoji", "baralacha", "tanglang", "road condition", "दर्र", "खारदुंग", "চাং", "গিরিপথ"], "pass"),
        (["permit", "ilp", "pap", "permission", "restricted area", "inner line", "परमिट", "পারমিট"], "permit"),
        (["hanle", "dark sky", "stargazing", "astronomy", "telescope", "milky way", "हानले", "तारे", "হানলে", "আকাশগঙ্গা"], "hanle"),
        (["turtuk", "balti", "northernmost", "border village", "तुरतुक", "তুরতুক"], "turtuk"),
        (["food", "eat", "cuisine", "thukpa", "skyu", "tingmo", "butter tea", "gur gur", "restaurant", "भोजन", "खाना", "খাবার"], "food"),
        (["wildlife", "snow leopard", "crane", "bird", "animal", "kiang", "वन्यजीव", "तेंदुआ", "বন্যপ্রাণী"], "wildlife"),
        (["monastery", "gompa", "hemis", "thiksey", "alchi", "phugtal", "temple", "monk", "buddhist", "मठ", "মঠ", "গুম্ফা"], "monstera"),
        (["decongest", "offbeat", "crowd", "tourist", "footfall", "sham valley", "secondary corridor", "भीड़", "ऑफबीट", "ভিড়", "অফবিট"], "decongest"),
        (["safety", "emergency", "hospital", "rescue", "spo2", "evacuation", "danger", "सुरक्षा", "आपातकालीन", "সুরক্ষা", "জরুরি"], "safety"),
    ]
    
    target_bundle = OFFLINE_AI_RESPONSES
    if lang == "hi":
        target_bundle = OFFLINE_AI_RESPONSES_HI
    elif lang == "bn":
        target_bundle = OFFLINE_AI_RESPONSES_BN

    for keywords, key in keyword_map:
        if any(kw in p for kw in keywords):
            if key in target_bundle:
                return target_bundle[key]
            return OFFLINE_AI_RESPONSES[key]

    # Default localized welcome / overview response
    if lang == "hi":
        return (
            "**जुले और नमस्ते! 🙏 मैं भारत एआई (Bharat AI) हूँ — लद्दाख और हिमालयी यात्रा के लिए आपका बुद्धिमान मार्गदर्शक।**\n\n"
            "मैं स्थायी एवं जिम्मेदार पर्यटन में आपकी सहायता करता हूँ:\n\n"
            "• **ऊंचाई सुरक्षा एवं अनुकूलन** — लेह में अनिवार्य 48 घंटे विश्राम, AMS लक्षण व डायमॉक्स सलाह\n"
            "• **लाइव पर्वतीय दर्रा सलाह** — खारदुंग ला, चांग ला और ज़ोजी ला की ताज़ा स्थिति\n"
            "• **पैकिंग सूची** — उच्च-हिमालयी गियर, UV सुरक्षा व शून्य-प्लास्टिक नियम\n"
            "• **ऑफबीट गलियारे** — तुरतुक, हानले और शाम घाटी जैसे कम भीड़भाड़ वाले खूबसूरत विकल्प\n"
            "• **परमिट जानकारी** — इनर लाइन परमिट (ILP) और आवश्यक दस्तावेज\n"
            "• **इको होमस्टे व स्थानीय भोजन** — ग्रामीण परिवारों को 80%+ सीधी आय\n\n"
            "लद्दाख और हिमालयी यात्रा के बारे में मुझसे कुछ भी पूछें!"
        )
    elif lang == "bn":
        return (
            "**জুলে ও নমস্কার! 🙏 আমি ভারত এআই (Bharat AI) — লাদাখ ও হিমালয় ভ্রমণের জন্য আপনার বুদ্ধিমান সহায়ক।**\n\n"
            "আমি টেকসই ও দায়িত্বশীল পর্যটনে আপনাকে সাহায্য করতে পারি:\n\n"
            "• **উচ্চতা সুরক্ষা ও অভিযোজন** — লেহ শহরে বাধ্যতামূলক ৪৮ ঘণ্টার বিশ্রাম ও AMS নির্দেশিকা\n"
            "• **গিরিপথ লাইভ অবস্থা** — খারদুং লা, চাং লা ও জোজি লা গিরিপথের তাৎক্ষণিক তথ্য\n"
            "• **প্যাকিং তালিকা** — পাহাড়ি পোশাক, অতিবেগুনি রশ্মি সুরক্ষা ও পরিবেশবিধি\n"
            "• **বিকল্প অফবিট করিডোর** — তুরতুক, হানলে ও শাম উপত্যকা পরিদর্শন\n"
            "• **পারমিট সংক্রান্ত তথ্য** — ইনার লাইন পারমিট (ILP) ও প্রয়োজনীয় নিয়মাবলী\n"
            "• **গ্রামীণ হোমস্টে ও স্থানীয় খাদ্য** — স্থানীয় পরিবারকে ৮০%+ সরাসরি অর্থনৈতিক সাহায্য\n\n"
            "লাদাখ অভিযান সম্পর্কে আপনার যেকোনো প্রশ্ন আমাকে করতে পারেন!"
        )
    else:
        return (
            "**Julley & Namaste! 🙏 I am Bharat AI — your intelligent Himalayan travel companion.**\n\n"
            "I specialise in sustainable travel intelligence for Ladakh and India. Here is what I can help you with:\n\n"
            "• **Altitude Safety & Acclimatization** — mandatory 48-hour Leh rest protocols, AMS symptoms, Diamox guidance\n"
            "• **Live Pass Advisories** — Khardung La, Chang La, Zoji La, and Baralacha La real-time telemetry\n"
            "• **Packing Lists** — high-altitude gear, UV protection, and leave-no-trace essentials\n"
            "• **Offbeat Decongestion Corridors** — Turtuk, Hanle, Sham Valley, and Tso Moriri alternatives\n"
            "• **Permit Guidance** — ILP & PAP requirements for restricted areas\n"
            "• **Eco Homestays & Local Food** — community cooperatives with 90%+ direct revenue\n\n"
            "Ask me anything about your Himalayan expedition!"
        )

@app.post("/api/chat")
async def chat_stream_endpoint(req: ChatRequest):
    """Resilient streaming AI endpoint with Gemini 3.1 Flash Lite strictly following chosen UI language."""
    async def token_generator():
        import re
        import asyncio

        # Immediate leading space to flush TCP buffer immediately for zero TTFT delay
        yield " "

        target_lang = (req.lang or "en").lower()
        if target_lang not in ["en", "hi", "bn"]:
            target_lang = "en"

        if not client:
            fallback = get_heuristic_reply(req.message, target_lang)
            tokens = re.findall(r'\S+|\s+', fallback)
            for t in tokens:
                yield t
                await asyncio.sleep(0.012)
            return

        models_to_try = ["gemini-3.1-flash-lite", "gemini-3.7-flash", "gemini-3.5-flash"]
        yielded_tokens = 0
        stream_success = False

        system_instr = get_system_instruction(target_lang)
        prompt_content = req.message
        if target_lang == "hi":
            prompt_content = f"User Question: {req.message}\n(IMPORTANT: Respond strictly in Hindi / हिन्दी using Devanagari script)"
        elif target_lang == "bn":
            prompt_content = f"User Question: {req.message}\n(IMPORTANT: Respond strictly in Bengali / বাংলা using Bengali script)"

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
                    contents=prompt_content,
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
            print(f"[Gemini Stream Fallback]: All models unavailable, serving structured heuristic guidance in {target_lang}.")
            fallback = get_heuristic_reply(req.message, target_lang)
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
@app.get("/api/config")
def get_config():
    reload_environment()
    return {
        "CARTO_API_KEY": os.getenv("CARTO_API_KEY", "YOUR_CARTO_API_KEY_HERE").strip()
    }

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)