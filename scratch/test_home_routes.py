import urllib.request

urls = [
    "http://127.0.0.1:8000/",
    "http://127.0.0.1:8000/home",
    "http://127.0.0.1:8000/home.html",
    "http://127.0.0.1:8000/explore",
    "http://127.0.0.1:8000/circuits",
    "http://127.0.0.1:8000/map",
    "http://127.0.0.1:8000/planner",
    "http://127.0.0.1:8000/ai",
    "http://127.0.0.1:8000/responsible",
    "http://127.0.0.1:8000/culture",
    "http://127.0.0.1:8000/food",
    "http://127.0.0.1:8000/overview",
    "http://127.0.0.1:8000/src/index.css"
]

for u in urls:
    try:
        resp = urllib.request.urlopen(u, timeout=5)
        print(f"[OK {resp.getcode()}] {u}")
    except Exception as e:
        print(f"[ERR] {u} -> {e}")

# Check content of root '/'
try:
    with urllib.request.urlopen("http://127.0.0.1:8000/", timeout=5) as r:
        html = r.read().decode('utf-8')
        print("Contains 'Venture without edges.':", "Venture without edges." in html)
        print("Contains 'Uncover with keen instinct.':", "Uncover with keen instinct." in html)
        print("Contains 'Plan my escape today':", "Plan my escape today" in html)
        print("Contains 'SECURE BY DESIGN':", "SECURE BY DESIGN" in html)
        print("Contains 'nav_home':", "nav_home" in html)
except Exception as e:
    print("Failed to read root:", e)
