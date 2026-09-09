import urllib.request
import urllib.error
import sys

BASE_URL = "http://127.0.0.1:8000"

routes = [
    "/",
    "/index.html",
    "/explore",
    "/explore.html",
    "/circuits",
    "/circuits.html",
    "/map",
    "/map.html",
    "/planner",
    "/planner.html",
    "/ai",
    "/ai.html",
    "/responsible",
    "/responsible.html",
    "/culture",
    "/culture.html",
    "/food",
    "/food.html",
    "/login",
    "/login.html",
    "/register",
    "/register.html",
    "/profile",
    "/profile.html",
    "/codebreakerz",
    "/team",
    "/html/index.html",
    "/html/explore.html",
    "/html/circuits.html",
    "/html/map.html",
    "/html/planner.html",
    "/html/ai.html",
    "/html/responsible.html",
    "/html/culture.html",
    "/html/food.html",
    "/api/destinations",
    "/api/passes"
]

success = 0
failed = 0

for r in routes:
    url = f"{BASE_URL}{r}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "RouteTester/1.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            code = resp.getcode()
            body = resp.read()
            print(f"[OK] {code} {r} (size: {len(body)} bytes)")
            success += 1
    except urllib.error.HTTPError as e:
        print(f"[FAIL] HTTP {e.code} for {r}")
        failed += 1
    except Exception as ex:
        print(f"[ERROR] {r} -> {ex}")
        failed += 1

print(f"\nResults: {success} passed, {failed} failed out of {len(routes)} routes.")
if failed > 0:
    sys.exit(1)
