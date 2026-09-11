"""
Bharat Explore — Autonomous Travel Agent Data Models
Defines structured schemas for agent state, execution queue, checkpoints, tools, and responses.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timezone

def get_utc_now():
    return datetime.now(timezone.utc).isoformat()

class TripConstraints(BaseModel):
    # Essential parameters
    starting_city: Optional[str] = None
    destination: Optional[str] = None
    state_or_region: Optional[str] = None
    budget: Optional[float] = None
    number_of_travelers: int = 1
    travel_dates: Optional[str] = None
    number_of_days: Optional[int] = None

    # Optional / Contextual parameters
    children_count: int = 0
    senior_citizens_count: int = 0
    disabilities: Optional[str] = None
    medical_conditions: Optional[str] = None
    wheelchair_accessible: bool = False
    preferred_transport: Optional[str] = None  # Flight, Train, Road, EV
    hotel_preference: Optional[str] = None    # Homestay, Heritage, Luxury, Budget
    food_preference: Optional[str] = None     # Pure Veg, Jain, Local Regional, Halal, Any
    travel_style: str = "Adventure & Culture" # Relaxation, Adventure, Heritage, Nature
    weather_preference: Optional[str] = None

class TaskItem(BaseModel):
    id: str
    title: str
    description: str
    status: str = "pending"  # pending, in_progress, completed, failed
    percentage: int = 0
    retry_count: int = 0
    error: Optional[str] = None
    result: Optional[Dict[str, Any]] = None

class ExecutionCheckpoint(BaseModel):
    checkpoint_id: str
    task_id: str
    step_title: str
    timestamp: str = Field(default_factory=get_utc_now)
    completed_tasks: List[str] = []
    state_snapshot: Dict[str, Any] = {}

class FlightOption(BaseModel):
    airline: str
    flight_number: str
    departure_time: str
    arrival_time: str
    duration: str
    stops: str
    price_inr: int
    cabin_baggage: str = "7 kg included"
    checkin_baggage: str = "15 kg included"
    cancellation_policy: str = "Standard refundable with fee"
    is_recommended: bool = False

class DayPriceComparison(BaseModel):
    day: str
    date_str: str
    price_inr: int
    difference_note: Optional[str] = None

class FlightSearchResult(BaseModel):
    origin: str
    destination: str
    recommended_day: str
    savings_callout: str
    options: List[FlightOption] = []
    day_comparisons: List[DayPriceComparison] = []
    alternative_airports: List[str] = []
    tradeoff_summary: str

class HotelOption(BaseModel):
    id: str
    name: str
    category: str
    price_per_night_inr: int
    total_price_inr: int
    rating: float
    reviews_count: int
    location: str
    distance_from_attractions: str
    amenities: List[str] = []
    cancellation_policy: str
    breakfast_included: bool = True
    wifi_included: bool = True
    ac_available: bool = True
    booking_source: str = "Booking.com / Verified Partner"
    is_recommended: bool = False

class HotelSearchResult(BaseModel):
    destination: str
    nights: int
    options: List[HotelOption] = []
    recommendation_note: str

class ActivitySlot(BaseModel):
    time_slot: str  # e.g., "08:00 AM - 09:30 AM"
    time_label: str # e.g., "08:00"
    activity: str
    location: str
    category: str   # Heritage, Food, Transit, Nature, Rest
    duration_mins: int
    transit_mins_from_prev: int = 0
    estimated_cost_inr: int = 0
    accessibility_notes: Optional[str] = None
    tip: Optional[str] = None

class ItineraryDay(BaseModel):
    day_number: int
    theme: str
    area_cluster: str
    activities: List[ActivitySlot] = []
    estimated_day_cost_inr: int = 0
    total_transit_mins: int = 0
    acclimatization_safety_note: Optional[str] = None

class CategoryCost(BaseModel):
    category: str
    cost_inr: int
    percentage: float
    description: str

class BudgetBreakdown(BaseModel):
    total_budget_inr: int
    total_allocated_inr: int
    remaining_cushion_inr: int
    categories: List[CategoryCost] = []
    is_within_budget: bool = True
    cushion_health_advice: str
    strategy_rationale: Optional[str] = None
    daily_avg_spend_inr: Optional[int] = None
    cost_saving_tips: List[str] = []
    smart_division_insights: List[str] = []

class EmergencyHospital(BaseModel):
    name: str
    type: str
    distance: str
    address: str
    phone: str
    has_24x7_trauma: bool = True

class EmergencyDossier(BaseModel):
    destination: str
    nearest_hospital: EmergencyHospital
    backup_hospital: Optional[EmergencyHospital] = None
    national_emergency_number: str = "112"
    tourist_helpline: str = "1363"
    police_station: Dict[str, str] = {}
    pharmacy_24x7: Dict[str, str] = {}
    weather_alert: Optional[str] = None
    high_altitude_medical_tips: Optional[str] = None

class CompletePlanResult(BaseModel):
    goal_summary: str
    constraints: TripConstraints
    flights: Optional[FlightSearchResult] = None
    hotels: Optional[HotelSearchResult] = None
    itinerary: List[ItineraryDay] = []
    budget: Optional[BudgetBreakdown] = None
    emergency: Optional[EmergencyDossier] = None
    packing_checklist: List[str] = []
    leave_no_trace_tips: List[str] = []
    web_search_summary: Optional[str] = None
    web_sources: List[str] = []
    data_freshness_disclaimer: str = "Estimates grounded in live internet search verification across regional tourism boards, Skyscanner, and Booking.com benchmarks."

class AgentSession(BaseModel):
    session_id: str
    user_id: Optional[str] = None
    constraints: TripConstraints = Field(default_factory=TripConstraints)
    missing_essentials: List[str] = []
    is_info_complete: bool = False
    tasks: List[TaskItem] = []
    checkpoints: List[ExecutionCheckpoint] = []
    plan_result: Optional[CompletePlanResult] = None
    active_model: str = "gemini-3.1-flash-lite"
    is_offline_mode: bool = False
    conversation_history: List[Dict[str, str]] = []
    created_at: str = Field(default_factory=get_utc_now)
    updated_at: str = Field(default_factory=get_utc_now)
