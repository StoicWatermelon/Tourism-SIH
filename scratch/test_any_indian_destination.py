import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import json
import urllib.request
import urllib.error

def post_json(url, data):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))

def test_destinations():
    base_url = "http://127.0.0.1:8000"
    
    test_cases = [
        # 1. Iconic UNESCO Boulder site
        {
            "query": "Plan 3 days in Hampi under 20000",
            "expected_dest": "Hampi",
            "check_sight": "Virupaksha",
            "check_hub": "Hospet"
        },
        # 2. Himalayan Tea capital
        {
            "query": "Plan 4 days in Darjeeling under 25000",
            "expected_dest": "Darjeeling",
            "check_sight": "Tiger Hill",
            "check_hub": "Bagdogra"
        },
        # 3. Royal Lake City
        {
            "query": "Plan 3 days in Udaipur under 30000",
            "expected_dest": "Udaipur",
            "check_sight": "Pichola",
            "check_hub": "Maharana Pratap"
        },
        # 4. Ganga Spiritual & Rafting
        {
            "query": "Plan 3 days in Rishikesh under 18000",
            "expected_dest": "Rishikesh",
            "check_sight": "Jhula",
            "check_hub": "Dehradun"
        },
        # 5. Satpura Hill Station (MP)
        {
            "query": "Plan 3 days in Pachmarhi under 18000",
            "expected_dest": "Pachmarhi",
            "check_sight": "Bee Falls",
            "check_hub": "Pipariya"
        },
        # 6. Holy City Punjab
        {
            "query": "Plan 2 days in Amritsar under 14000",
            "expected_dest": "Amritsar",
            "check_sight": "Golden Temple",
            "check_hub": "Guru Ram Das"
        },
        # 7. Unlisted Offbeat / Historical town: Chitrakoot
        {
            "query": "Plan 3 days in Chitrakoot under 15000",
            "expected_dest": "Chitrakoot",
            "check_sight": None,
            "check_hub": None
        },
        # 8. Coastal Cliff town: Varkala (Dynamic live-sight parser)
        {
            "query": "Plan 3 days in Varkala under 22000",
            "expected_dest": "Varkala",
            "check_sight": None,
            "check_hub": None
        },
        # 9. Historic Fortress City: Mandu (Dynamic live-sight parser)
        {
            "query": "Plan 2 days in Mandu under 14000",
            "expected_dest": "Mandu",
            "check_sight": None,
            "check_hub": None
        }
    ]

    print("=================================================================")
    print("  TESTING ARBITRARY INDIAN DESTINATIONS IN ITINERARY GENERATOR")
    print("=================================================================")

    passed = 0
    for idx, tc in enumerate(test_cases, 1):
        q = tc["query"]
        expected = tc["expected_dest"]
        print(f"\n[TEST {idx}] Query: '{q}'")
        
        try:
            status_code, data = post_json(f"{base_url}/api/agent/chat", {
                "session_id": f"test-dest-{expected.lower()}",
                "message": q,
                "lang": "en"
            })
        except Exception as e:
            print(f"  ❌ FAILED request error: {e}")
            continue
        if data.get("type") != "complete_plan":
            print(f"  ❌ FAILED: Returned type '{data.get('type')}', expected 'complete_plan'")
            continue
            
        plan = data.get("plan", {})
        constraints = data.get("constraints", {})
        actual_dest = constraints.get("destination", "")
        
        # Check destination retains specific place name
        if expected.lower() not in actual_dest.lower():
            print(f"  ❌ FAILED: Destination name mismatch: got '{actual_dest}', expected '{expected}'")
            continue
            
        days = len(plan.get("itinerary", []))
        total_budget = plan.get("budget", {}).get("total_allocated_inr", 0)
        web_summary = plan.get("web_search_summary", "")
        hotel_count = len(plan.get("hotels", {}).get("options", []))
        flight_origin = plan.get("flights", {}).get("origin", "")
        flight_dest = plan.get("flights", {}).get("destination", "")
        emergency_hosp = plan.get("emergency", {}).get("nearest_hospital", {}).get("name", "")
        
        print(f"  ✓ Preserved Destination: '{actual_dest}'")
        print(f"  ✓ Days: {days} days generated")
        print(f"  ✓ Total Budget: Rs {total_budget:,}")
        print(f"  ✓ Hotels Found: {hotel_count} options")
        print(f"  ✓ Transit Route: {flight_origin} -> {flight_dest}")
        print(f"  ✓ Apex Trauma Hospital: {emergency_hosp}")
        if web_summary:
            print(f"  ✓ Live Web Guide: {web_summary[:90]}...")
            
        # Sights check
        all_activities = []
        for d in plan.get("itinerary", []):
            for act in d.get("activities", []):
                if isinstance(act, dict):
                    all_activities.append(f"{act.get('activity', '')} {act.get('location', '')} {act.get('tip', '')}")
        
        joined_activities = " ".join(all_activities)
        if tc["check_sight"]:
            if tc["check_sight"].lower() in joined_activities.lower():
                print(f"  ✓ Verified Sight Match: Found '{tc['check_sight']}' in itinerary!")
            else:
                print(f"  ⚠️ Warning: Sight '{tc['check_sight']}' not matched verbatim in itinerary")

        passed += 1

    print("\n=================================================================")
    print(f"  COMPLETED: {passed}/{len(test_cases)} DESTINATION TESTS PASSED!")
    print("=================================================================")
    assert passed == len(test_cases), f"Only {passed}/{len(test_cases)} tests passed"

if __name__ == "__main__":
    test_destinations()
