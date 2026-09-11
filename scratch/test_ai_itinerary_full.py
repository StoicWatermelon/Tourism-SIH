import json
import urllib.request
import urllib.error
import sys

sys.stdout.reconfigure(encoding='utf-8')

def test_itinerary(dest_query):
    print(f"\n==================================================")
    print(f"Testing Itinerary Agent Query: '{dest_query}'")
    print(f"==================================================")
    url = "http://127.0.0.1:8000/api/agent/chat"
    payload = json.dumps({
        "message": dest_query,
        "session_id": "test_session_verify_001",
        "lang": "en"
    }).encode("utf-8")
    
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            status = resp.status
            body = resp.read().decode("utf-8")
            data = json.loads(body)
            print(f"Response Status: {status}")
            print(f"Response Type: {data.get('type')}")
            
            if data.get("type") == "complete_plan":
                plan = data.get("plan", {})
                web_summary = plan.get("web_search_summary")
                print("\n[LIVE WEB INTELLIGENCE SEARCH SUMMARY]:")
                print(web_summary if web_summary else "None")
                
                budget = plan.get("budget", {})
                print("\n[SMART BUDGET BREAKDOWN]:")
                print(f"  Total Budget: Rs. {budget.get('total_budget_inr')}")
                print(f"  Total Allocated: Rs. {budget.get('total_allocated_inr')}")
                print(f"  Daily Avg Spend: Rs. {budget.get('daily_avg_spend_inr')}")
                print(f"  Remaining Cushion: Rs. {budget.get('remaining_cushion_inr')}")
                for cat in budget.get("categories", []):
                    print(f"    - {cat.get('category')}: Rs. {cat.get('cost_inr')} ({cat.get('percentage')}%) - {cat.get('description')}")
                print(f"  Strategy Rationale: {budget.get('strategy_rationale')}")
                print(f"  Cost Saving Tips: {budget.get('cost_saving_tips')}")
                
                print("\n[ITINERARY CLUSTERS]:")
                for day in plan.get("itinerary", []):
                    print(f"  Day {day.get('day_number')}: {day.get('theme')} ({day.get('area_cluster')}) - {len(day.get('activities', []))} activities")
                
                print("\n[HOTELS]:")
                hotels_data = plan.get("hotels", {})
                hotel_options = hotels_data.get("options", []) if isinstance(hotels_data, dict) else hotels_data
                for h in hotel_options:
                    print(f"  - {h.get('name')} | Rs. {h.get('price_per_night')}/night | {h.get('rating')}★ | {h.get('sustainability_badge')}")
                
                return True
            else:
                print("Unexpected type:", data)
                return False
    except urllib.error.URLError as e:
        print("HTTP Error:", e)
        return False

if __name__ == "__main__":
    t1 = test_itinerary("Plan a 4-day trip to Kerala under 30000 in comfort style")
    t2 = test_itinerary("Plan 5 days in Ladakh under 45000 adventure")
    print(f"\nFinal Result: Kerala: {'PASS' if t1 else 'FAIL'}, Ladakh: {'PASS' if t2 else 'FAIL'}")
