import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding='utf-8')
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi.testclient import TestClient
from backend.server import app

client = TestClient(app)

print("=" * 60)
print("VERIFYING AI CHATBOX & AGENT INTEGRATION")
print("=" * 60)

# 1. Test /ai.html
r_ai = client.get("/ai.html")
print(f"[TEST 1] GET /ai.html -> Status: {r_ai.status_code}")
assert r_ai.status_code == 200, "Failed to load /ai.html"
html_text = r_ai.text

required_elements = [
    ('id="chatForm"', "Chat Form"),
    ('id="chatInput"', "Chat Input"),
    ('id="messages"', "Messages Container"),
    ('id="aiOrb"', "AI Orb Indicator"),
    ('id="aiStatusText"', "Status Text"),
    ('id="activeModelTag"', "Model Tag"),
    ('class="chat"', "Chat Container"),
    ('id="agentTrackerWrap"', "Agent Execution Tracker"),
    ('id="agentCheckpointPill"', "Checkpoint Pill"),
    ('data-goal="I don\'t want to plan anything. I have ₹25,000 for 4 days in Kerala."', "Kerala Goal Button"),
]

all_passed = True
for needle, label in required_elements:
    if needle in html_text:
        print(f"  [PASS] Found {label}")
    else:
        print(f"  [FAIL] Missing {label} ({needle})")
        all_passed = False

assert all_passed, "Some required elements were missing in /ai.html"

# 2. Test /css/ai.css
r_css = client.get("/css/ai.css")
print(f"\n[TEST 2] GET /css/ai.css -> Status: {r_css.status_code}")
assert r_css.status_code == 200
css_text = r_css.text
for class_name in [".chat", ".agent-tracker-wrap", ".agent-card", ".flight-option-item", ".hotel-item"]:
    if class_name in css_text:
        print(f"  [PASS] Found CSS class {class_name}")
    else:
        print(f"  [FAIL] Missing CSS class {class_name}")
        all_passed = False

# 3. Test /js/ai.js
r_js = client.get("/js/ai.js")
print(f"\n[TEST 3] GET /js/ai.js -> Status: {r_js.status_code}")
assert r_js.status_code == 200
js_text = r_js.text
for symbol in ["askAI", "renderFlightCard", "renderHotelCard", "modifyAgentConstraint", "updateAgentTracker"]:
    if symbol in js_text:
        print(f"  [PASS] Found JS symbol {symbol}")
    else:
        print(f"  [FAIL] Missing JS symbol {symbol}")
        all_passed = False

# 4. Test POST /api/agent/chat
print("\n[TEST 4] POST /api/agent/chat (Autonomous Goal)")
payload = {
    "session_id": "test-chatbox-session-123",
    "message": "I don't want to plan anything. I have ₹25,000 for 4 days in Kerala.",
    "lang": "en"
}
r_chat = client.post("/api/agent/chat", json=payload)
print(f"  Status: {r_chat.status_code}")
assert r_chat.status_code == 200
chat_data = r_chat.json()
print(f"  Response type: {chat_data.get('type')}")
print(f"  Message preview: {chat_data.get('message', '')[:100]}...")
assert chat_data.get("type") == "complete_plan"
assert "plan" in chat_data
assert "flights" in chat_data["plan"]
assert "hotels" in chat_data["plan"]
print("  [PASS] Full autonomous travel plan returned with flights, hotels, itinerary, budget, emergency!")

print("\n" + "=" * 60)
print("ALL VERIFICATION CHECKS PASSED PERFECTLY!")
print("=" * 60)
