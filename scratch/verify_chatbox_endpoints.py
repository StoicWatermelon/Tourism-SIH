import urllib.request

def check(url, expected_snippets):
    res = urllib.request.urlopen(url)
    assert res.status == 200, f"Status {res.status}"
    content = res.read().decode("utf-8")
    for s in expected_snippets:
        assert s in content, f"Missing {s} in {url}"
    print(f"[OK] {url} passed ({len(content)} bytes)")

check("http://127.0.0.1:8000/html/home.html", ["id=\"ai\"", "id=\"messages\"", "id=\"chatForm\"", "id=\"chatInput\"", "sug_kolkata", "BHARAT AI"])
check("http://127.0.0.1:8000/html/ai.html", ["id=\"ai\"", "id=\"messages\"", "id=\"chatForm\"", "id=\"chatInput\"", "sug_kolkata", "BHARAT AI"])
check("http://127.0.0.1:8000/home.html", ["id=\"ai\"", "id=\"messages\"", "id=\"chatForm\"", "id=\"chatInput\"", "BHARAT AI"])
print("ALL HTML AI CHATBOX ENDPOINTS VERIFIED!")
