import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Ensure UTF-8 stdout
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from fastapi.testclient import TestClient
from backend.server import app
from backend.agent import agent_planner, agent_tools, router, get_session

def run_tests():
    print("=================================================================")
    print("  BHARAT EXPLORE — AUTONOMOUS TRAVEL AGENT TEST SUITE")
    print("=================================================================")

    client = TestClient(app)

    # 1. Benchmark Goal Query Execution
    print("\n[TEST 1] Testing Goal: 'I don't want to plan anything. I have ₹25,000 for 4 days in Kerala.'")
    res1 = client.post("/api/agent/chat", json={
        "session_id": "test-sess-benchmark",
        "message": "I don't want to plan anything. I have ₹25,000 for 4 days in Kerala.",
        "lang": "en"
    })
    assert res1.status_code == 200, f"Expected 200, got {res1.status_code}"
    data1 = res1.json()
    assert data1["type"] == "complete_plan", f"Expected complete_plan, got {data1['type']}"
    assert data1["constraints"]["destination"] == "Kerala"
    assert data1["constraints"]["budget"] == 25000.0
    assert data1["constraints"]["number_of_days"] == 4
    assert len(data1["tasks"]) == 7, f"Expected 7 tasks, got {len(data1['tasks'])}"
    assert len(data1["checkpoints"]) == 5, f"Expected 5 checkpoints, got {len(data1['checkpoints'])}"
    assert data1["plan"]["flights"] is not None
    assert len(data1["plan"]["hotels"]["options"]) > 0
    assert len(data1["plan"]["itinerary"]) == 4
    assert data1["plan"]["budget"]["is_within_budget"] is True
    print(f"  ✓ SUCCESS: Full autonomous plan generated! Remaining cushion: ₹{data1['plan']['budget']['remaining_cushion_inr']:,}")
    print(f"  ✓ Flight savings tip: {data1['plan']['flights']['savings_callout']}")
    print(f"  ✓ Top Hotel: {data1['plan']['hotels']['options'][0]['name']} (Rating: {data1['plan']['hotels']['options'][0]['rating']}★)")
    print(f"  ✓ Nearest Hospital: {data1['plan']['emergency']['nearest_hospital']['name']}")

    # 2. Information Gathering (Minimal missing questions)
    print("\n[TEST 2] Testing Incomplete Query: 'Plan me a trip to Kashmir.'")
    res2 = client.post("/api/agent/chat", json={
        "session_id": "test-sess-vague",
        "message": "Plan me a trip to Kashmir.",
        "lang": "en"
    })
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["type"] == "questionnaire", f"Expected questionnaire, got {data2['type']}"
    assert "budget" in data2["missing_fields"]
    assert "number_of_days" in data2["missing_fields"]
    assert "destination" not in data2["missing_fields"]
    print(f"  ✓ SUCCESS: Agent asked ONLY for missing essentials (budget & duration):\n{data2['message']}")

    # 3. Multi-Turn Memory & Progression
    print("\n[TEST 3] Testing Multi-Turn Follow-Up: 'Budget is 35000 for 5 days'")
    res3 = client.post("/api/agent/chat", json={
        "session_id": "test-sess-vague",
        "message": "Budget is 35000 for 5 days",
        "lang": "en"
    })
    assert res3.status_code == 200
    data3 = res3.json()
    assert data3["type"] == "complete_plan", f"Expected complete_plan, got {data3['type']}"
    assert data3["constraints"]["destination"] == "Kashmir"
    assert data3["constraints"]["budget"] == 35000.0
    assert data3["constraints"]["number_of_days"] == 5
    assert len(data3["plan"]["itinerary"]) == 5
    print(f"  ✓ SUCCESS: Memory preserved! Formulated 5-day Kashmir plan under ₹35,000.")

    # 4. Constraint Mutation without restarting
    print("\n[TEST 4] Testing Constraint Update: Changing budget from ₹35,000 to ₹45,000")
    res4 = client.post("/api/agent/update-constraint", json={
        "session_id": "test-sess-vague",
        "key": "budget",
        "value": 45000,
        "lang": "en"
    })
    assert res4.status_code == 200
    data4 = res4.json()
    assert data4["type"] == "plan_updated"
    assert data4["constraints"]["budget"] == 45000.0
    new_cushion = data4["plan"]["budget"]["remaining_cushion_inr"]
    print(f"  ✓ SUCCESS: Plan updated dynamically without restarting! New cushion: ₹{new_cushion:,}")

    # 5. Model Router & 429 Cooldown Failover
    print("\n[TEST 5] Testing Model Router 429 Cooldown & Failover")
    primary_model = router.MODELS_CASCADE[0]["id"]
    router._mark_rate_limited(primary_model, cooldown_seconds=60)
    next_model = router.get_next_available_model()
    assert next_model["id"] != primary_model, f"Expected failover from {primary_model}"
    print(f"  ✓ SUCCESS: 429 simulated on {primary_model}. Router switched automatically to backup: {next_model['id']} ({next_model['tier']})")

    # 6. Session Persistence Retrieval
    print("\n[TEST 6] Testing Session Persistence: GET /api/agent/session/{session_id}")
    res6 = client.get("/api/agent/session/test-sess-benchmark")
    assert res6.status_code == 200
    data6 = res6.json()
    assert data6["session_id"] == "test-sess-benchmark"
    assert data6["is_info_complete"] is True
    assert len(data6["checkpoints"]) == 5
    print("  ✓ SUCCESS: Full session state, checkpoints, and plan retrieved from persistent memory!")

    # 7. Backward Compatibility Verification
    print("\n[TEST 7] Testing Backward Compatibility: /api/passes and /api/health")
    passes_res = client.get("/api/passes")
    assert passes_res.status_code == 200
    passes_data = passes_res.json()
    assert len(passes_data) >= 5
    print(f"  ✓ SUCCESS: Mountain pass telemetry operational ({len(passes_data)} passes monitored: {', '.join(list(passes_data.keys())[:3])}...).")

    health_res = client.get("/api/health")
    assert health_res.status_code == 200
    print("  ✓ SUCCESS: System health check passed.")

    print("\n=================================================================")
    print("  ALL 7 VERIFICATION SUITES PASSED FLAWLESSLY! (100% GREEN)")
    print("=================================================================")

if __name__ == "__main__":
    run_tests()
