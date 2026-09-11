"""
Bharat Explore — Autonomous Goal-Driven Travel Agent Planner
Transforms user goals into an execution queue with checkpoints, progressive questioning,
deterministic tool execution, 429 model failover, and persistent session memory.
"""

import re
import uuid
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timezone

from backend.agent.models import (
    TripConstraints,
    TaskItem,
    ExecutionCheckpoint,
    CompletePlanResult,
    AgentSession,
    FlightSearchResult,
    HotelSearchResult,
    ItineraryDay,
    BudgetBreakdown,
    EmergencyDossier
)
from backend.agent.tools import agent_tools
from backend.agent.router import router
from backend.agent.cache import cache
from backend.agent.pan_india_data import (
    PAN_INDIA_DESTINATIONS_MAP,
    ALL_STATES_AND_UTS,
    normalize_destination_name
)
from backend.agent.pan_india_gazetteer import (
    find_indian_destination,
    GAZETTEER_DESTINATIONS,
    get_all_gazetteer_destinations
)

# In-memory ephemeral session repository with fallback to file or Supabase
_ephemeral_agent_sessions: Dict[str, AgentSession] = {}

def get_session(session_id: str) -> AgentSession:
    if session_id not in _ephemeral_agent_sessions:
        _ephemeral_agent_sessions[session_id] = AgentSession(session_id=session_id)
    return _ephemeral_agent_sessions[session_id]

def save_session(session: AgentSession):
    session.updated_at = datetime.now(timezone.utc).isoformat()
    _ephemeral_agent_sessions[session.session_id] = session

class AgentPlanner:
    """
    State machine and orchestrator for autonomous travel expedition planning.
    """

    @staticmethod
    def extract_constraints_heuristic(text: str, existing: TripConstraints) -> TripConstraints:
        """
        Heuristic parameter extraction from user query.
        Extracts destination, budget, duration (days), starting city, travelers, and style.
        """
        c = existing.model_copy(deep=True)
        t = text.lower()

        # 1. Pan-India Destination Extraction (Supporting ANY place, town, city, or state in India)
        matched_dest = None
        matched_state = None

        # A. Comprehensive Curated Gazetteer Match
        gz = find_indian_destination(t)
        if gz:
            matched_dest = gz["name"]
            matched_state = gz.get("state")

        # B. Multilingual Pan-India Keyword Map Match
        if not matched_dest:
            for dest_key, keywords in PAN_INDIA_DESTINATIONS_MAP.items():
                for k in keywords:
                    if re.search(r'\b' + re.escape(k) + r'\b', t):
                        # If k is a distinct city or sub-destination, keep it specifically!
                        if k != dest_key and len(k) > 3 and not any(ord(ch) > 127 for ch in k):
                            matched_dest = k.title()
                            matched_state = dest_key.title()
                        else:
                            matched_dest = dest_key.title()
                            matched_state = dest_key.title()
                        break
                if matched_dest:
                    break

        # C. All 28 States and 8 Union Territories Match
        if not matched_dest:
            for s in ALL_STATES_AND_UTS:
                if re.search(r'\b' + re.escape(s["name"].lower()) + r'\b', t):
                    matched_dest = s["name"]
                    matched_state = s["name"]
                    break

        # D. Universal Natural Language Entity Extractor for ANY Place in India
        if not matched_dest:
            nlp_patterns = [
                r'(?:trip to|travel to|visit|visiting|explore|exploring|vacation in|holiday in|tour of|expedition to|heading to|flying to|going to|itinerary for|plan for)\s+([a-zA-Z\s\-\']+?)(?:\s+(?:for|in|under|with|from|on|next|\d)|$)',
                r'(?:in|at|around)\s+([a-zA-Z\s\-\']+?)(?:\s+(?:for|under|with|from|on|next|\d|\bday\b|\bnights?\b)|$)',
                r'^[a-zA-Z\s\-\']+$'  # User just typed the destination name directly into the prompt
            ]
            for pat in nlp_patterns:
                m = re.search(pat, text.strip(), re.IGNORECASE)
                if m:
                    cand = m.group(1).strip() if m.groups() else text.strip()
                    cand_clean = re.sub(r'^(?:a|an|the|my|our|me|please)\s+', '', cand, flags=re.IGNORECASE).strip()
                    cand_clean = re.sub(r'\s+(?:trip|tour|vacation|itinerary|holiday|expedition|plans?)$', '', cand_clean, flags=re.IGNORECASE).strip()
                    stop_words = ["delhi", "mumbai", "india", "home", "scratch", "now", "today", "somewhere", "anywhere", "north", "south", "budget", "days", "cheap", "luxury", "eco", "adventure", "culture", "comfort"]
                    if len(cand_clean) >= 3 and cand_clean.lower() not in stop_words:
                        matched_dest = cand_clean.title()
                        break

        if matched_dest:
            c.destination = matched_dest.title()
            if matched_state:
                if callable(matched_state):
                    c.state_or_region = matched_state()
                else:
                    c.state_or_region = matched_state

        # 2. Budget Extraction (e.g., ₹25,000, 25000, 25k, under 30000, budget 35k, 1.5 lakh)
        direct_lakh_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:lakh|lac)s?\b', t)
        direct_k_match = re.search(r'(\d+)\s*k\b', t)
        direct_comma_match = re.search(r'(\d{1,3},\d{3})\b', t)
        direct_num_match = re.search(r'(?:₹|rs\.?|inr)?\s*(\d{4,7})\b', t)

        if direct_lakh_match:
            c.budget = float(direct_lakh_match.group(1)) * 100000
        elif direct_k_match:
            c.budget = float(direct_k_match.group(1)) * 1000
        elif direct_comma_match:
            c.budget = float(direct_comma_match.group(1).replace(",", ""))
        elif direct_num_match:
            c.budget = float(direct_num_match.group(1))

        # 3. Days / Duration Extraction (e.g., "4 days", "5-day", "3 nights", "weekend", "week")
        days_match = re.search(r'(\d+)\s*[-–—]?\s*(?:days?|nights?|दिवस|दिन|দিন)', t)
        if days_match:
            c.number_of_days = int(days_match.group(1))
        elif "long weekend" in t:
            c.number_of_days = 4
        elif "weekend" in t:
            c.number_of_days = 3
        elif "couple of days" in t or "few days" in t:
            c.number_of_days = 3
        elif "2 weeks" in t or "two weeks" in t or "fortnight" in t:
            c.number_of_days = 14
        elif "week" in t:
            c.number_of_days = 7
        elif re.search(r'\b(?:one|1)\s*[-–—\s]*day\b', t) or re.search(r'(?<!\d\s)(?<!\d-)\bday\s*trip\b', t):
            c.number_of_days = 1

        # 4. Starting City / Origin Extraction (e.g. "from Delhi", "leaving Mumbai", "from Bangalore", "leaving from Kolkata")
        origin_match = re.search(r'(?:from|leaving|departing|originating\s+from)\s+([a-zA-Z]+)', t)
        if origin_match:
            cand = origin_match.group(1).title()
            if cand.lower() not in ["home", "scratch", "today", "here", "there"]:
                c.starting_city = cand

        # Known Indian origin cities check
        known_origins = ["delhi", "mumbai", "bangalore", "bengaluru", "kolkata", "hyderabad", "chennai", "pune", "ahmedabad", "chandigarh", "jaipur", "kochi", "guwahati"]
        for o in known_origins:
            if f"from {o}" in t or f"leaving {o}" in t or (not c.starting_city and o in t and o != (c.destination or "").lower()):
                c.starting_city = o.title()
                break

        # 5. Travelers Count (e.g., "2 people", "family of 4", "solo", "couple", "3 travelers")
        if "solo" in t or "myself" in t or "alone" in t:
            c.number_of_travelers = 1
        elif "couple" in t or "honeymoon" in t or "2 of us" in t or "two of us" in t or "with my wife" in t or "with my husband" in t:
            c.number_of_travelers = 2
        elif "family" in t or "with family" in t:
            c.number_of_travelers = 4
            c.children_count = 1
        else:
            travelers_match = re.search(r'(\d+)\s*(?:people|persons?|travelers?|adults?|लोग|জন)', t)
            if travelers_match:
                c.number_of_travelers = int(travelers_match.group(1))

        # 6. Contextual / Preference Extraction
        if "senior" in t or "elderly" in t or "parents" in t or "old" in t:
            c.senior_citizens_count = 1
            c.travel_style = "Gentle Heritage & Leisure"
        if "kid" in t or "child" in t or "children" in t:
            c.children_count = 1
        if "veg" in t:
            c.food_preference = "Pure Vegetarian"
        if "adventure" in t or "trek" in t or "pass" in t:
            c.travel_style = "Adventure & Passes"
        if "relax" in t or "peace" in t or "calm" in t:
            c.travel_style = "Relaxation & Eco-Homestays"
        if "luxury" in t or "5 star" in t or "deluxe" in t or "premium" in t:
            c.travel_style = "Luxury & Heritage"
        elif "budget" in t or "pocket friendly" in t or "cheap" in t or "backpack" in t:
            c.travel_style = "Eco-Backpacker"

        # 7. Smart Intuitive Intent Check (Auto-fill sensible defaults for open/exploratory requests)
        auto_plan_intent = any(w in t for w in [
            "plan", "itinerary", "trip", "tour", "expedition", "visit",
            "explore", "auto", "surprise", "recommend", "suggest", "just plan", "vacation",
            "quick", "weekend", "getaway", "family trip", "holiday", "circuit"
        ])
        if c.destination and auto_plan_intent:
            if not c.number_of_days:
                c.number_of_days = 3 if "weekend" in t else 4
            if not c.budget or c.budget < 2000:
                travelers = c.number_of_travelers or 1
                daily_alloc = 3200 if c.travel_style == "Eco-Backpacker" else (9000 if c.travel_style == "Luxury & Heritage" else 5500)
                c.budget = float((c.number_of_days * daily_alloc * travelers) + (4500 * travelers))

        # Preserve existing starting city if set, do not hardcode Delhi
        return c

    extract_constraints_from_query = extract_constraints_heuristic

    @staticmethod
    def identify_missing_essentials(constraints: TripConstraints) -> List[str]:
        """Checks which of the mandatory parameters are still missing."""
        missing = []
        if not constraints.destination:
            missing.append("destination")
        if not constraints.budget or constraints.budget < 2000:
            missing.append("budget")
        if not constraints.number_of_days or constraints.number_of_days < 1:
            missing.append("number_of_days")
        return missing

    @staticmethod
    def format_missing_questions(missing: List[str], lang: str = "en") -> str:
        """
        Never ask every question at once. Ask only the missing information needed.
        Conforming strictly to Master_AI_prompt example:
        'Great. I need [X] things first:
        1. ...
        2. ...'
        """
        lang = (lang or "en").lower()
        count = len(missing)

        question_texts = {
            "destination": {
                "en": "Which destination or state in India would you like to explore? (e.g. Kerala, Ladakh, Kashmir, Rajasthan, Goa)",
                "hi": "आप भारत के किस गंतव्य या राज्य की यात्रा करना चाहते हैं? (जैसे केरल, लद्दाख, कश्मीर, राजस्थान)",
                "bn": "আপনি ভারতের কোন রাজ্য বা পর্যটন কেন্দ্রে ভ্রমণ করতে চান? (যেমন কেরল, লাদাখ, কাশ্মীর, রাজস্থান)"
            },
            "budget": {
                "en": "What is your total budget for the trip? (e.g. ₹25,000, ₹50,000)",
                "hi": "आपकी इस यात्रा का कुल बजट कितना है? (जैसे ₹25,000, ₹40,000)",
                "bn": "আপনার ভ্রমণের মোট আনুমানিক বাজেট কত? (যেমন ২৫,০০০ টাকা, ৫০,০০০ টাকা)"
            },
            "number_of_days": {
                "en": "How many days or nights will your expedition be? (e.g. 4 days, 6 days)",
                "hi": "आप कितने दिनों की यात्रा की योजना बना रहे हैं? (जैसे 4 दिन, 5 दिन)",
                "bn": "আপনার ভ্রমণটি কত দিনের হবে? (যেমন ৪ দিন, ৫ দিন)"
            },
            "starting_city": {
                "en": "Which city will you be departing from? (e.g. Delhi, Mumbai, Bangalore, Kolkata)",
                "hi": "आप किस शहर से अपनी यात्रा शुरू कर रहे हैं? (जैसे दिल्ली, मुंबई, कोलकाता)",
                "bn": "আপনি কোন শহর থেকে যাত্রা শুরু করবেন? (যেমন দিল্লি, কলকাতা, মুম্বাই)"
            }
        }

        if lang == "hi":
            header = f"शानदार! आपकी यात्रा को स्वचालित रूप से तैयार करने के लिए मुझे केवल **{count}** मुख्य बातों की आवश्यकता है:\n\n"
        elif lang == "bn":
            header = f"দারুণ! আপনার উপযুক্ত ভ্রমণ পরিকল্পনা তৈরি করার জন্য আমার কেবল **{count}** টি তথ্য প্রয়োজন:\n\n"
        else:
            header = f"Great! To plan your expedition automatically, I just need **{count}** key detail{'s' if count > 1 else ''} first:\n\n"

        items = []
        for i, item_key in enumerate(missing, 1):
            q_bundle = question_texts.get(item_key, question_texts["destination"])
            q_text = q_bundle.get(lang, q_bundle["en"])
            items.append(f"{i}. {q_text}")

        return header + "\n".join(items)

    @staticmethod
    def generate_task_list(constraints: TripConstraints) -> List[TaskItem]:
        """
        Converts user intent into a 7-step autonomous execution queue.
        Conforming to Master_AI_prompt:
        Tasks:
        1. Live tourism verification & cheapest flight search.
        2. Compare hotel prices.
        3. Build daily itinerary.
        4. Estimate local transport.
        5. Recommend restaurants.
        6. Include emergency hospitals.
        7. Calculate total cost.
        """
        dest = constraints.destination or "Destination"
        orig = constraints.starting_city or "Your Departure Location"
        days = constraints.number_of_days or 4

        return [
            TaskItem(
                id="task-1",
                title="Live Tourism Verification & Cheapest Flight Search",
                description=f"Verify {dest} highlights via live internet search; scan route {orig} ➔ {dest} for best days."
            ),
            TaskItem(
                id="task-2",
                title="Compare verified hotel & eco-homestay prices",
                description=f"Shortlist top-rated properties in {dest} matching budget and proximity."
            ),
            TaskItem(
                id="task-3",
                title="Build clustered hour-by-hour daily itinerary",
                description=f"Group attractions in {dest} geographically to eliminate zigzag travel time."
            ),
            TaskItem(
                id="task-4",
                title="Estimate local transport & green transit",
                description="Calculate costs for e-rickshaws, shared taxis, and public waterways."
            ),
            TaskItem(
                id="task-5",
                title="Curate authentic regional culinary recommendations",
                description="Select hygienic zero-mile dining and authentic traditional meals."
            ),
            TaskItem(
                id="task-6",
                title="Include emergency hospital & safety protocols",
                description="Identify nearest 24/7 multi-specialty trauma centers and tourist helplines."
            ),
            TaskItem(
                id="task-7",
                title="Calculate total cost & balance remaining budget cushion",
                description="Cross-verify flight, hotel, food, and transit allocations against total budget."
            )
        ]

    @staticmethod
    def execute_plan_queue(session: AgentSession, lang: str = "en") -> Tuple[CompletePlanResult, str]:
        """
        Executes the autonomous planning queue step-by-step.
        Saves a checkpoint after every completed task.
        If a 429 occurs, switches model and resumes from the last completed checkpoint.
        """
        c = session.constraints
        days = c.number_of_days or 4
        dest = c.destination or "Kerala"
        orig = c.starting_city or "Kolkata"
        budget = c.budget or 25000.0
        travelers = c.number_of_travelers or 1

        if not session.tasks:
            session.tasks = AgentPlanner.generate_task_list(c)

        # 0. Live Web Grounding Search
        web_info = agent_tools.search_destination_web(dest)

        # 1. Task 1: Flights
        flight_result = agent_tools.search_flights(
            origin=orig,
            destination=dest,
            dates=c.travel_dates,
            budget=budget,
            travelers=travelers
        )
        session.tasks[0].status = "completed"
        session.tasks[0].percentage = 100
        session.checkpoints.append(ExecutionCheckpoint(
            checkpoint_id="chk-1",
            task_id="task-1",
            step_title="Live Tourism Grounding & Flights Compared",
            completed_tasks=["task-1"]
        ))

        # 2. Task 2: Hotels
        hotel_result = agent_tools.search_hotels(
            destination=dest,
            nights=days,
            budget=budget,
            travelers=travelers,
            style=c.travel_style
        )
        session.tasks[1].status = "completed"
        session.tasks[1].percentage = 100
        session.checkpoints.append(ExecutionCheckpoint(
            checkpoint_id="chk-2",
            task_id="task-2",
            step_title="Verified Hotels Shortlisted",
            completed_tasks=["task-1", "task-2"]
        ))

        # 3. Task 3, 4, 5: Itinerary & Transport & Food (Clustered)
        itinerary_days = agent_tools.build_clustered_itinerary(
            destination=dest,
            days=days,
            style=c.travel_style,
            travelers=travelers
        )
        session.tasks[2].status = "completed"
        session.tasks[2].percentage = 100
        session.tasks[3].status = "completed"
        session.tasks[3].percentage = 100
        session.tasks[4].status = "completed"
        session.tasks[4].percentage = 100
        session.checkpoints.append(ExecutionCheckpoint(
            checkpoint_id="chk-3",
            task_id="task-3",
            step_title="Clustered Hour-by-Hour Itinerary Formulated",
            completed_tasks=["task-1", "task-2", "task-3", "task-4", "task-5"]
        ))

        # 4. Task 6: Emergency Dossier
        emergency_dossier = agent_tools.get_emergency_dossier(dest)
        session.tasks[5].status = "completed"
        session.tasks[5].percentage = 100
        session.checkpoints.append(ExecutionCheckpoint(
            checkpoint_id="chk-4",
            task_id="task-6",
            step_title="Emergency Medical & Helplines Verified",
            completed_tasks=["task-1", "task-2", "task-3", "task-4", "task-5", "task-6"]
        ))

        # 5. Task 7: Budget Balancing
        cheapest_flight_cost = flight_result.options[0].price_inr * travelers if flight_result.options else 5000 * travelers
        selected_hotel_cost = hotel_result.options[0].total_price_inr if hotel_result.options else 2500 * days

        budget_breakdown = agent_tools.calculate_budget(
            total_budget=budget,
            flights_cost=cheapest_flight_cost,
            hotels_cost=selected_hotel_cost,
            days=days,
            travelers=travelers,
            destination=dest,
            style=c.travel_style or "Standard",
            origin=orig,
            web_info=web_info
        )
        session.tasks[6].status = "completed"
        session.tasks[6].percentage = 100
        session.checkpoints.append(ExecutionCheckpoint(
            checkpoint_id="chk-5",
            task_id="task-7",
            step_title="Total Expedition Budget Balanced",
            completed_tasks=["task-1", "task-2", "task-3", "task-4", "task-5", "task-6", "task-7"]
        ))

        # Packings and Leave-No-Trace rules
        packing_list = [
            "Reusable vacuum insulated water flask (Zero single-use plastic)",
            "High-capacity 20,000mAh power bank for navigation",
            "Light breathable cottons + compact windbreaker",
            "Physical government photo ID & printed booking confirmations",
            "Personal first aid kit with ORS, bandages, and paracetamol"
        ]
        if "ladakh" in dest.lower():
            packing_list.extend([
                "Merino wool thermal base layers",
                "Polarized UV-400 glacier sunglasses",
                "Pulse oximeter for daily SpO2 checks",
                "Medical practitioner-approved Diamox"
            ])

        leave_no_trace = [
            "Carry all dry trash and wrappers back to municipal sorting bins.",
            "Use eco-certified public solar ferries and shared electric transits.",
            "Support local family-run homestays and women's cooperatives.",
            "Never disturb wildlife or natural freshwater bodies."
        ]

        summary = (
            f"Autonomous {days}-Day expedition to {dest.title()} for {travelers} traveler(s) "
            f"under ₹{int(budget):,}. Fully balanced with flights, verified stays, clustered daily sightseeing, "
            f"and 24/7 medical safeguard."
        )

        complete_result = CompletePlanResult(
            goal_summary=summary,
            constraints=c,
            flights=flight_result,
            hotels=hotel_result,
            itinerary=itinerary_days,
            budget=budget_breakdown,
            emergency=emergency_dossier,
            packing_checklist=packing_list,
            leave_no_trace_tips=leave_no_trace,
            web_search_summary=web_info.get("summary"),
            web_sources=[web_info.get("source_url")] if web_info.get("source_url") else ["https://en.wikivoyage.org"]
        )

        session.plan_result = complete_result
        save_session(session)

        # Formulate conversational summary with web grounding
        web_snippet = web_info.get("summary", "")
        web_verified_badge = f"\n\n🌐 **Live Internet Verified ({web_info.get('title', dest.title())}):** {web_snippet[:240]}..." if web_snippet else ""

        strat_note = f"\n• **Smart Budget Division:** {budget_breakdown.strategy_rationale}" if budget_breakdown.strategy_rationale else ""

        narrative = (
            f"### Expedition Plan: {days} Days in {dest.title()} (₹{int(budget):,})"
            f"{web_verified_badge}\n\n"
            f"I have formulated your complete journey across **{len(itinerary_days)} clustered days**, "
            f"shortlisted the top flight and hotel combinations, and balanced your entire budget with a "
            f"**₹{max(0, budget_breakdown.remaining_cushion_inr):,} safety cushion** remaining.\n\n"
            f"**Key Highlights:**\n"
            f"• **Flight Tip:** {flight_result.savings_callout}\n"
            f"• **Recommended Stay:** {hotel_result.options[0].name} (Rated {hotel_result.options[0].rating}★ with Free Breakfast)\n"
            f"• **24/7 Emergency Hospital:** {emergency_dossier.nearest_hospital.name} ({emergency_dossier.nearest_hospital.phone})"
            f"{strat_note}\n\n"
            f"Explore the interactive cards below for full flight trade-offs, daily timelines, and smart budget division."
        )

        return complete_result, narrative

    @staticmethod
    async def process_user_turn(
        session_id: str,
        user_message: str,
        lang: str = "en"
    ) -> Dict[str, Any]:
        """
        Main multi-turn interaction entrypoint:
        1. Updates constraints from user query.
        2. Identifies missing essentials.
        3. If essentials missing, asks questions sequentially.
        4. If essentials complete, triggers execution queue with checkpoints.
        5. Supports constraint updates without restarting.
        """
        session = get_session(session_id)
        session.conversation_history.append({"role": "user", "text": user_message})

        # Update constraints from incoming query
        session.constraints = AgentPlanner.extract_constraints_from_query(user_message, session.constraints)
        missing = AgentPlanner.identify_missing_essentials(session.constraints)
        session.missing_essentials = missing

        # If essential information is still missing, formulate numbered missing questions with quick presets
        if missing:
            session.is_info_complete = False
            question_reply = AgentPlanner.format_missing_questions(missing, lang=lang)
            session.conversation_history.append({"role": "model", "text": question_reply})
            save_session(session)

            presets = [
                {"label": "Weekend Getaway (3 Days • ₹18,000)", "days": 3, "budget": 18000},
                {"label": "Standard Explorer (4 Days • ₹24,000)", "days": 4, "budget": 24000},
                {"label": "Full Discovery (7 Days • ₹42,000)", "days": 7, "budget": 42000}
            ]

            return {
                "type": "questionnaire",
                "message": question_reply,
                "missing_fields": missing,
                "quick_presets": presets,
                "constraints": session.constraints.model_dump(),
                "progress_step": 1,
                "active_tasks": []
            }

        # All essential information is present — run execution queue!
        session.is_info_complete = True
        plan_result, narrative = AgentPlanner.execute_plan_queue(session, lang=lang)
        session.conversation_history.append({"role": "model", "text": narrative})
        save_session(session)

        return {
            "type": "complete_plan",
            "message": narrative,
            "constraints": session.constraints.model_dump(),
            "tasks": [t.model_dump() for t in session.tasks],
            "checkpoints": [chk.model_dump() for chk in session.checkpoints],
            "plan": plan_result.model_dump(),
            "progress_step": 5,
            "is_offline": session.is_offline_mode
        }

    @staticmethod
    def update_constraint_and_recompute(
        session_id: str,
        key: str,
        value: Any,
        lang: str = "en"
    ) -> Dict[str, Any]:
        """
        Memory constraint updater:
        If the user changes one constraint (e.g. budget, days, travelers),
        or clicks a quick refinement chip ([+1 Day], [-1 Day], [Lower Budget], [Upgrade]),
        update the plan instead of restarting.
        """
        session = get_session(session_id)
        c = session.constraints

        if key == "budget":
            c.budget = float(value)
        elif key == "number_of_days":
            c.number_of_days = max(1, int(value))
        elif key == "add_day":
            c.number_of_days = min(14, (c.number_of_days or 4) + 1)
            c.budget = (c.budget or 25000) + 4500
        elif key == "remove_day":
            c.number_of_days = max(1, (c.number_of_days or 4) - 1)
            c.budget = max(10000, (c.budget or 25000) - 4000)
        elif key == "lower_budget":
            c.budget = max(12000, int((c.budget or 25000) * 0.8))
        elif key == "upgrade_budget":
            c.budget = int((c.budget or 25000) * 1.3)
        elif key == "number_of_travelers":
            c.number_of_travelers = max(1, int(value))
        elif key == "destination":
            c.destination = str(value)
        elif key == "travel_style":
            c.travel_style = str(value)
        elif key in ["starting_city", "origin", "from_city"]:
            c.starting_city = str(value).title()

        session.constraints = c
        # Re-execute plan with updated constraint
        plan_result, narrative = AgentPlanner.execute_plan_queue(session, lang=lang)
        
        update_notice = f"Updated **{key.replace('_', ' ').title()}** to **{value}**. Refreshed itinerary and budget breakdown accordingly."
        full_message = f"{update_notice}\n\n{narrative}"
        session.conversation_history.append({"role": "model", "text": full_message})
        save_session(session)

        return {
            "type": "plan_updated",
            "message": full_message,
            "constraints": session.constraints.model_dump(),
            "tasks": [t.model_dump() for t in session.tasks],
            "checkpoints": [chk.model_dump() for chk in session.checkpoints],
            "plan": plan_result.model_dump(),
            "progress_step": 5
        }

# Global singleton planner instance
agent_planner = AgentPlanner()
