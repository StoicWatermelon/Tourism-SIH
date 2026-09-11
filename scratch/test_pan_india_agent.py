import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from fastapi.testclient import TestClient
from backend.server import app

def run_pan_india_tests():
    print("=================================================================")
    print("  PAN-INDIA & SMART INTUITIVE INPUT TEST SUITE")
    print("=================================================================")

    client = TestClient(app)

    # 1. Test Natural Exploratory Query: "Explore Meghalaya"
    print("\n[TEST 1] Natural Query: 'Explore Meghalaya'")
    res1 = client.post("/api/agent/chat", json={
        "session_id": "test-meghalaya-smart",
        "message": "Explore Meghalaya",
        "lang": "en"
    })
    assert res1.status_code == 200, f"Error: {res1.text}"
    data1 = res1.json()
    assert data1["type"] == "complete_plan", f"Expected complete_plan, got {data1['type']}"
    assert data1["constraints"]["destination"] == "Meghalaya"
    assert data1["constraints"]["number_of_days"] == 4
    assert data1["constraints"]["budget"] > 0
    assert data1["plan"]["web_search_summary"] is not None
    assert len(data1["plan"]["itinerary"]) == 4
    print(f"  ✓ SUCCESS: Generated immediate 4-day Meghalaya plan!")
    print(f"  ✓ Live Web Summary: {data1['plan']['web_search_summary'][:120]}...")
    print(f"  ✓ Emergency Center: {data1['plan']['emergency']['nearest_hospital']['name']}")
    print(f"  ✓ Hotel: {data1['plan']['hotels']['options'][0]['name']}")

    # 2. Test Weekend Expression: "Weekend in Sikkim"
    print("\n[TEST 2] Natural Query: 'Weekend in Sikkim'")
    res2 = client.post("/api/agent/chat", json={
        "session_id": "test-sikkim-weekend",
        "message": "Weekend in Sikkim",
        "lang": "en"
    })
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["type"] == "complete_plan"
    assert data2["constraints"]["destination"] == "Sikkim"
    assert data2["constraints"]["number_of_days"] == 3
    assert len(data2["plan"]["itinerary"]) == 3
    print(f"  ✓ SUCCESS: Correctly parsed 'Weekend' -> 3 days in Sikkim!")
    print(f"  ✓ Live Web Summary: {data2['plan']['web_search_summary'][:120]}...")

    # 3. Test Family Vacation Expression: "Explore Tamil Nadu with family"
    print("\n[TEST 3] Natural Query: 'Explore Tamil Nadu with family'")
    res3 = client.post("/api/agent/chat", json={
        "session_id": "test-tn-family",
        "message": "Explore Tamil Nadu with family",
        "lang": "en"
    })
    assert res3.status_code == 200
    data3 = res3.json()
    assert data3["type"] == "complete_plan"
    assert data3["constraints"]["destination"] == "Tamil Nadu"
    assert data3["constraints"]["number_of_travelers"] == 4
    print(f"  ✓ SUCCESS: Parsed 'with family' -> 4 travelers in Tamil Nadu!")
    print(f"  ✓ Total Budget allocated: ₹{data3['plan']['budget']['total_allocated_inr']:,}")

    # 4. Test Island Union Territory: "Explore Andaman"
    print("\n[TEST 4] Island Territory: 'Explore Andaman'")
    res4 = client.post("/api/agent/chat", json={
        "session_id": "test-andaman",
        "message": "Explore Andaman",
        "lang": "en"
    })
    assert res4.status_code == 200
    data4 = res4.json()
    assert data4["type"] == "complete_plan"
    assert "Andaman" in data4["constraints"]["destination"]
    assert data4["plan"]["emergency"]["nearest_hospital"] is not None
    print(f"  ✓ SUCCESS: Verified Andaman Island Plan & Hubs!")
    print(f"  ✓ Hospital: {data4['plan']['emergency']['nearest_hospital']['name']}")

    # 5. Test 1-Click Refinement: "+1 Day"
    print("\n[TEST 5] 1-Click Refinement: Add 1 Day")
    res5 = client.post("/api/agent/update-constraint", json={
        "session_id": "test-meghalaya-smart",
        "key": "add_day",
        "value": 1,
        "lang": "en"
    })
    assert res5.status_code == 200
    data5 = res5.json()
    assert data5["type"] == "plan_updated"
    assert data5["constraints"]["number_of_days"] == 5
    assert len(data5["plan"]["itinerary"]) == 5
    print(f"  ✓ SUCCESS: Dynamically extended plan to 5 days without restarting!")

    print("\n=================================================================")
    print("  ALL PAN-INDIA & INTUITIVE INPUT TESTS PASSED PERFECTLY!")
    print("=================================================================")

if __name__ == "__main__":
    run_pan_india_tests()
