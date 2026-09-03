import os
import json
from datetime import datetime
from typing import Optional, List
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from google import genai
from google.genai import types

from sqlalchemy import create_engine, Column, Integer, String, Boolean, Float, Text, DateTime, JSON
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# Base directory resolution
BASE_DIR = Path(__file__).resolve().parent.parent
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

SYSTEM_INSTRUCTION = (
    "You are Bharat AI, the high-altitude travel intelligence assistant for Bharat Explore (SIH 2026). "
    "Provide concise, immediate, 2-to-3 sentence travel and safety answers. "
    "Prioritize altitude safety, AMS precautions, mandatory 48-hour Leh acclimatization, pass conditions, eco-homestays, and leave-no-trace ethics. "
    "Be direct, factual, and crisp."
)

class ChatRequest(BaseModel):
    message: str

class JourneySaveRequest(BaseModel):
    session_id: str
    destination_ids: List[str]
    notes: Optional[str] = None
    travel_style: Optional[str] = "Adventure"

# --- REST Endpoints ---

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

# Fallback AI heuristic answers
OFFLINE_AI_RESPONSES = {
    "pack": "Essential Ladakh Packing List: layered thermal garments, fleece jacket, wind/waterproof outer shell, UV-polarized sunglasses, SPF 50+ sunscreen, lip balm with SPF, sturdy hiking boots, and reusable insulated water bottle. Plan 48 hours for altitude acclimatization.",
    "acclimat": "Altitude Safety Rule: Leh is at 11,500 ft. Spend the first 48 hours resting with zero physical exertion. Drink 4-5 liters of water daily with electrolytes. Consult a physician about Diamox (Acetazolamide) before ascending higher passes.",
    "pangong": "Pangong Lake Advisory: Best visited May through September. The lake sits at 14,270 ft. Travel via Chang La (17,688 ft) requires an Inner Line Permit (ILP) for Indian tourists and Protected Area Permit (PAP) for foreigners.",
    "budget": "Himalayan Trip Budget: A 5-7 day Ladakh trip typically averages ₹25,000–₹40,000 per traveler including dedicated 4x4 taxi hire, eco-homestays, community meals, and permit fees.",
    "pass": "Pass Safety Status: Khardung La (17,582 ft) and Chang La (17,688 ft) are operational during daytime hours. Always check Leh District Disaster Management advisories for surprise snowfall or military convoy clearances."
}

def get_heuristic_reply(prompt: str) -> str:
    p = prompt.lower()
    for key, val in OFFLINE_AI_RESPONSES.items():
        if key in p:
            return val
    return (
        "Namaste! 🙏 I am Bharat AI. For altitude travel in Ladakh, always observe mandatory 48-hour acclimatization in Leh. "
        "Keep hydrated, carry physical Inner Line Permits, respect monastic customs, and maintain eco-friendly leave-no-trace ethics."
    )

@app.post("/api/chat")
async def chat_stream_endpoint(req: ChatRequest):
    """Resilient streaming AI endpoint with Gemini 3.6 Flash optimized for minimum TTFT."""
    async def token_generator():
        # Immediate leading 1-byte yield to force immediate TCP transmission and avoid reverse-proxy buffering
        yield " "

        if not client:
            reply = get_heuristic_reply(req.message)
            for word in reply.split(" "):
                yield word + " "
            return

        try:
            config = types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.2,
                max_output_tokens=220,
                thinking_config=types.ThinkingConfig(thinking_level="low")
            )
            response_stream = await client.aio.models.generate_content_stream(
                model="gemini-3.6-flash",
                contents=req.message,
                config=config
            )
            async for chunk in response_stream:
                if chunk.text:
                    yield chunk.text
        except Exception as ex:
            print(f"[Gemini Streaming Error]: {ex}")
            # Fast error handling: yield immediately so frontend falls back without hanging
            yield f"[AI Error: {str(ex)}]"

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
    index_file = BASE_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {"message": "Bharat Explore API is running. Access endpoints via /api/destinations or /api/passes"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)