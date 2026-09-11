import json
import urllib.request
import sys

sys.stdout.reconfigure(encoding='utf-8')

TEST_DESTS = [
    {"query": "Plan a 4-day trip to Kerala under 30000 in comfort style", "name": "Kerala", "expected_terrain": "waterway/ferry"},
    {"query": "Plan 5 days in Ladakh under 45000 adventure", "name": "Ladakh", "expected_terrain": "4x4/mountain"},
    {"query": "3-day backpacking Jaipur under 15000 budget style", "name": "Jaipur", "expected_terrain": "heritage/rickshaw"},
    {"query": "Plan 4 days in Goa under 35000 luxury style", "name": "Goa", "expected_terrain": "coastal/beach"},
    {"query": "5 days in Meghalaya under 40000 eco nature style", "name": "Meghalaya", "expected_terrain": "ecotour/trekking"}
]

def run_all_tests():
    url = "http://127.0.0.1:8000/api/agent/chat"
    all_passed = True
    
    for td in TEST_DESTS:
        print(f"\n" + "="*70)
        print(f"TESTING: {td['name']} -> '{td['query']}'")
        print("="*70)
        
        payload = json.dumps({
            "message": td["query"],
            "session_id": f"test_session_{td['name'].lower()}",
            "lang": "en"
        }).encode("utf-8")
        
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                
                assert data.get("type") == "complete_plan", f"Expected 'complete_plan', got {data.get('type')}"
                plan = data.get("plan", {})
                
                # 1. Live Web Search Verification
                web_summary = plan.get("web_search_summary")
                sources = plan.get("web_sources", [])
                assert web_summary and len(web_summary) > 20, "Web summary should be rich"
                print(f"[LIVE WEB SEARCH]:\n  Excerpt: {web_summary[:160]}...")
                print(f"  Source: {sources[0] if sources else 'N/A'}")
                
                # 2. Smart Budget Division Verification
                b = plan.get("budget", {})
                total_b = b.get("total_budget_inr", 0)
                total_alloc = b.get("total_allocated_inr", 0)
                cushion = b.get("remaining_cushion_inr", 0)
                daily_avg = b.get("daily_avg_spend_inr", 0)
                categories = b.get("categories", [])
                
                assert total_alloc + cushion == total_b, f"Budget sum mismatch: {total_alloc} + {cushion} != {total_b}"
                assert len(categories) >= 5, f"Expected at least 5 budget categories, got {len(categories)}"
                
                print(f"\n[SMART BUDGET]: Total: Rs. {total_b:,} | Allocated: Rs. {total_alloc:,} | Cushion: Rs. {cushion:,} | Daily Avg: Rs. {daily_avg:,}")
                for c in categories:
                    print(f"  - {c['category']}: Rs. {c['cost_inr']:,} ({c['percentage']}%) -> {c['description']}")
                
                print(f"\n[STRATEGY RATIONALE]:\n  {b.get('strategy_rationale')}")
                print(f"\n[COST-SAVING TIPS]:")
                for tip in b.get("cost_saving_tips", []):
                    print(f"  * {tip}")
                
                # 3. Itinerary Clusters
                itin = plan.get("itinerary", [])
                print(f"\n[CLUSTERS]: {len(itin)} Days generated")
                for day in itin:
                    print(f"  Day {day.get('day_number')}: {day.get('theme')} [{day.get('area_cluster')}] ({len(day.get('activities', []))} activities)")
                    # verify no dict leakage in activity titles
                    for act in day.get("activities", []):
                        assert not str(act.get("activity", "")).startswith("{"), f"Raw dict leaked in activity: {act}"
                
                print(f"\n>>> TEST PASSED FOR {td['name']}! <<<")
        except Exception as e:
            print(f"\n>>> TEST FAILED FOR {td['name']}: {e} <<<")
            all_passed = False
            
    print("\n" + "="*70)
    print(f"OVERALL SUITE RESULT: {'ALL PASSED' if all_passed else 'SOME FAILED'}")
    print("="*70)
    return all_passed

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
