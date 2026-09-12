import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from fastapi.testclient import TestClient
from backend.server import app

client = TestClient(app)

# 1. Test CodeBreakerz cards
cb_tests = [
    {"query": "Team Code Breakerz", "category": "SIH 2026 Innovation Team", "location": "Techno Main Salt Lake (TMSL)"},
    {"query": "Sarnajit Dhar (Team Captain)", "category": "SIH 2026 Innovation Team", "location": "Techno Main Salt Lake (TMSL)", "desc": "Strategic visionary."},
    {"query": "Piyal Tambuli (Lead Developer & Principal Core Engineer)", "category": "SIH 2026 Innovation Team", "location": "Techno Main Salt Lake (TMSL)", "desc": "Master of advanced systems architecture."},
    {"query": "Riddhadeb Parua (Lead Developer & Principal Core Engineer)", "category": "SIH 2026 Innovation Team", "location": "Techno Main Salt Lake (TMSL)", "desc": "Master of core algorithms and backend scalability."}
]

print("=== TESTING CODEBREAKERZ AI INTEL (TMSL) ===")
for t in cb_tests:
    resp = client.get("/api/ai/card-insight", params=t)
    assert resp.status_code == 200, f"Status {resp.status_code}"
    d = resp.json()
    q = t["query"]
    print(f"\n[Query]: {q}")
    print(f"  Source Title: {d.get('source_title')}")
    print(f"  Location: {d.get('location')}")
    print(f"  Summary: {d.get('summary')[:100]}...")
    print(f"  Transit Hub: {d.get('transit_hub')}")
    print(f"  Hide Actions: {d.get('hide_actions')}")
    assert "Guru Nanak" not in d.get("summary", ""), "Error: Guru Nanak found in summary!"
    assert "Guru Nanak" not in d.get("source_title", ""), "Error: Guru Nanak found in source_title!"
    assert "Techno Main Salt Lake" in d.get("summary", ""), "Error: Techno Main Salt Lake not in summary!"
    assert d.get("hide_actions") == True, "Error: hide_actions should be True for CodeBreakerz!"
    print("  ✓ PASS: Fully grounded to Techno Main Salt Lake (TMSL) with zero GNIT references")

# 2. Test destination cards to ensure they are UNCHANGED
other_tests = [
    {"query": "Pangong Tso", "category": "Destination", "location": "Ladakh"},
    {"query": "Mysore Pak", "category": "Indigenous Cuisine", "location": "Karnataka"}
]

print("\n=== TESTING OTHER CARDS (MUST REMAIN UNCHANGED) ===")
for t in other_tests:
    resp = client.get("/api/ai/card-insight", params=t)
    assert resp.status_code == 200, f"Status {resp.status_code}"
    d = resp.json()
    q = t["query"]
    print(f"\n[Query]: {q}")
    print(f"  Source Title: {d.get('source_title')}")
    print(f"  Hide Actions: {d.get('hide_actions')}")
    assert d.get("hide_actions") in [False, None], "Error: hide_actions should NOT be True for travel cards!"
    print("  ✓ PASS: Other card remains unchanged")

print("\nALL SERVER TESTS PASSED SUCCESSFULLY!")
