import urllib.request
import json
import sys

def test_chat(prompt, lang="en"):
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/chat",
        data=json.dumps({"message": prompt, "lang": lang}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        out = resp.read().decode("utf-8")
        assert len(out) > 30, f"Too short output: {out}"
        print(f"[OK] Prompt ({lang}): {len(out)} chars received")

if __name__ == "__main__":
    test_chat("Tell me about Kolkata & West Bengal heritage")
    test_chat("What are the must-visit places in Jaipur & Rajasthan?")
    test_chat("What should I pack for high-altitude passes like Khardung La?")
    test_chat("What is the mandatory acclimatization protocol for Leh?")
    test_chat("Tell me about Sikkim", lang="en")
    print("ALL STREAMING CHAT TESTS PASSED WITH FLYING COLORS!")
