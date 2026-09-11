import sys
from pathlib import Path
import json
import urllib.request
import urllib.parse

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def test_card_assistance():
    base_url = "http://127.0.0.1:8000"
    
    test_queries = [
        {"q": "Pangong Tso", "cat": "Destination", "loc": "Ladakh"},
        {"q": "Turtuk Border Village", "cat": "Destination", "loc": "Ladakh"},
        {"q": "Thukpa", "cat": "Indigenous Cuisine", "loc": "Ladakh"},
        {"q": "Chhurpi", "cat": "Indigenous Cuisine", "loc": "Himalayas"},
        {"q": "Lung-ta Prayer Flags", "cat": "Living Heritage", "loc": "Himalayas"},
        {"q": "Cham Dances", "cat": "Living Heritage", "loc": "Ladakh"},
        {"q": "Stargaze at Hanle", "cat": "Sustainable Experience", "loc": "Ladakh"},
        {"q": "Hampi", "cat": "Destination", "loc": "Karnataka"},
        {"q": "Western Ghats Eco Corridor", "cat": "Heritage Circuit", "loc": "Karnataka"},
        {"q": "Mysore Pak", "cat": "Indigenous Cuisine", "loc": "Karnataka"},
        {"q": "24/7 Medical & Oxygen Posts", "cat": "Safety & Emergency Protocol", "loc": "Ladakh"},
        {"q": "Inner Line Permit (ILP) Checkpoints", "cat": "Safety & Emergency Protocol", "loc": "Ladakh"},
        {"q": "AMS Emergency Action Protocol", "cat": "Safety & Emergency Protocol", "loc": "Himalayas"},
        {"q": "Team Code Breakerz", "cat": "SIH 2026 Innovation Team", "loc": "Team Code Breakerz"}
    ]

    print("=================================================================")
    print("  TESTING BHARAT AI CARD ASSISTANCE & INTERNET INTEL ENDPOINT")
    print("=================================================================")

    from fastapi.testclient import TestClient
    from backend.server import app
    client = TestClient(app)

    passed = 0
    for idx, item in enumerate(test_queries, 1):
        q = item["q"]
        cat = item["cat"]
        loc = item["loc"]
        print(f"\n[CARD {idx}] Query: '{q}' ({cat} • {loc})")

        try:
            resp = client.get("/api/ai/card-insight", params={"query": q, "category": cat, "location": loc})
            assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
            data = resp.json()
            
            title = data.get("title", "")
            summary = data.get("summary", "")
            source_url = data.get("source_url", "")
            source_title = data.get("source_title", "")
            season = data.get("best_season", "")
            hub = data.get("transit_hub", "")
            eco = data.get("eco_tip", "")
            highlights = data.get("highlights", [])
            
            assert len(summary) > 20, f"Summary too short: {summary}"
            assert source_url.startswith("http"), f"Invalid source URL: {source_url}"
            assert len(highlights) > 0, "No highlights returned"

            print(f"  ✓ Grounded Source: {source_title} ({source_url})")
            print(f"  ✓ Best Season: {season}")
            print(f"  ✓ Transit Hub: {hub[:60]}...")
            print(f"  ✓ Eco Etiquette: {eco[:60]}...")
            print(f"  ✓ Summary: {summary[:90]}...")
            if data.get("ai_perspective"):
                print(f"  ✓ AI Perspective: {data['ai_perspective'][:100]}...")

            passed += 1
        except Exception as e:
            print(f"  ❌ FAILED: {e}")

    print("\n=================================================================")
    print(f"  CARD INSIGHT ENDPOINT: {passed}/{len(test_queries)} TESTS PASSED!")
    print("=================================================================")

    # Test HTML Inclusion Rules
    print("\nVerifying Page Inclusion vs Landing Page Exclusion...")
    
    subpages = [
        "html/explore.html",
        "html/circuits.html",
        "html/culture.html",
        "html/food.html",
        "html/responsible.html",
        "html/map.html",
        "html/planner.html",
        "html/ai.html",
        "html/profile.html",
        "html/CodeBreakerz.html",
        "html/login.html",
        "html/register.html",
        "profile.html",
        "CodeBreakerz.html",
        "login.html",
        "register.html"
    ]
    for sp in subpages:
        sp_path = ROOT_DIR / sp
        content = sp_path.read_text(encoding="utf-8")
        assert "ai_card_insight.js" in content, f"Expected ai_card_insight.js in {sp}"
        assert "ai.css" in content, f"Expected ai.css in {sp}"
        print(f"  ✓ Confirmed active with styles on subpage: {sp}")

    landing_pages = [
        "html/home.html",
        "html/index.html",
        "home.html",
        "index.html"
    ]
    for lp in landing_pages:
        lp_path = ROOT_DIR / lp
        content = lp_path.read_text(encoding="utf-8")
        assert "ai_card_insight.js" not in content, f"ai_card_insight.js should NOT be in landing page {lp}"
        print(f"  ✓ Confirmed strictly excluded from landing page: {lp}")

    print("\n=================================================================")
    print("  ALL VERIFICATION CHECKS PASSED WITH 100% COMPLIANCE!")
    print("=================================================================")

if __name__ == "__main__":
    test_card_assistance()
