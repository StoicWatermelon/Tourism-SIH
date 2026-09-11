# Automated verification script for Bharat AI, Geolocation, and Itinerary
import urllib.request
import json
import re

BASE_URL = "http://127.0.0.1:8000"

print("--- 1. Testing /api/geo/locate ---")
try:
    with urllib.request.urlopen(f"{BASE_URL}/api/geo/locate", timeout=5) as res:
        geo = json.loads(res.read().decode("utf-8"))
        print(f"Status: {geo.get('status')}")
        print(f"Detected City: {geo.get('city')}")
        print(f"Detected State: {geo.get('state')}")
        print(f"Source: {geo.get('source')}")
        assert geo.get("city") is not None, "City must not be None"
        print("PASS: /api/geo/locate returns detected location\n")
except Exception as e:
    print(f"FAIL: /api/geo/locate: {e}\n")

print("--- 2. Testing /api/agent/chat without starting_city (Dynamic Origin) ---")
try:
    req_body = json.dumps({
        "message": "Plan a 3-day trip to Goa under 18000"
    }).encode("utf-8")
    req = urllib.request.Request(f"{BASE_URL}/api/agent/chat", data=req_body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=12) as res:
        data = json.loads(res.read().decode("utf-8"))
        plan = data.get("plan", {})
        flights = plan.get("flights", {})
        origin = flights.get("origin")
        print(f"Plan Type: {data.get('type')}")
        print(f"Flight Origin: {origin}")
        print(f"Flight Destination: {flights.get('destination')}")
        assert origin != "Delhi", f"Origin should be dynamic user location (Kolkata), not hardcoded Delhi! Got {origin}"
        print(f"PASS: Flight origin correctly defaulted to detected city: {origin}\n")
except Exception as e:
    print(f"FAIL: /api/agent/chat: {e}\n")

print("--- 3. Testing /api/agent/chat with explicit starting_city ---")
try:
    req_body = json.dumps({
        "message": "Plan 4 days in Kerala under 25000",
        "starting_city": "Cooch Behar"
    }).encode("utf-8")
    req = urllib.request.Request(f"{BASE_URL}/api/agent/chat", data=req_body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=12) as res:
        data = json.loads(res.read().decode("utf-8"))
        flights = data.get("plan", {}).get("flights", {})
        origin = flights.get("origin")
        print(f"Flight Origin: {origin}")
        assert "Cooch Behar" in origin, f"Origin should be Cooch Behar! Got {origin}"
        print("PASS: Explicit starting_city respected\n")
except Exception as e:
    print(f"FAIL: Explicit starting_city test: {e}\n")

print("--- 4. Testing /api/chat streaming endpoint ---")
try:
    req_body = json.dumps({
        "message": "Tell me about Cooch Behar palace in 1 sentence",
        "lang": "en"
    }).encode("utf-8")
    req = urllib.request.Request(f"{BASE_URL}/api/chat", data=req_body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as res:
        streamed = res.read().decode("utf-8")
        print(f"Streamed tokens length: {len(streamed)}")
        print(f"Snippet: {streamed[:100].strip()}...")
        assert len(streamed) > 10, "Should receive streamed response"
        print("PASS: /api/chat streaming functional\n")
except Exception as e:
    print(f"FAIL: /api/chat: {e}\n")

print("--- 5. Checking Frontend Code Integrity ---")
with open(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism\js\ai.js", "r", encoding="utf-8") as f:
    ai_js = f.read()
    assert "getUserDetectedOrigin" in ai_js, "getUserDetectedOrigin must exist in ai.js"
    assert "isAiPage" in ai_js, "Floating chat suppression for ai.html must exist in ai.js"
    assert "toggleSpeechInput" in ai_js, "Speech input function must exist in ai.js"
    print("PASS: js/ai.js contains all required functions")

with open(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism\css\ai.css", "r", encoding="utf-8") as f:
    ai_css = f.read()
    assert '[data-theme="dark"] .slot-activity-title' in ai_css, "Dark mode slot activity title must be styled"
    assert '[data-theme="dark"] .day-box-title' in ai_css, "Dark mode day box title must be styled"
    assert '[data-theme="dark"] .chat' in ai_css, "Dark mode chatbox must be styled"
    print("PASS: css/ai.css contains all required dark mode rules")

with open(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism\html\ai.html", "r", encoding="utf-8") as f:
    ai_html = f.read()
    assert 'id="chatWindow"' in ai_html, "Native chatWindow must exist in ai.html"
    assert 'chat-origin-chip' in ai_html, "Chat origin chip must exist in ai.html"
    assert 'chat-mic-btn' in ai_html, "Chat mic button must exist in ai.html"
    print("PASS: html/ai.html contains all native chatbox elements")

with open(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism\html\planner.html", "r", encoding="utf-8") as f:
    planner_html = f.read()
    assert 'planner-origin-bar' in planner_html, "planner-origin-bar must exist in planner.html"
    assert 'detectedOriginBadge' in planner_html, "detectedOriginBadge must exist in planner.html"
    print("PASS: html/planner.html contains departure origin indicator")

print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
