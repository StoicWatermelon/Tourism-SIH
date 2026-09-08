import os
import json
import xml.etree.ElementTree as ET
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parent.parent

html_files = list((ROOT / "html").glob("*.html")) + [ROOT / "index.html", ROOT / "home.html", ROOT / "login.html", ROOT / "register.html", ROOT / "profile.html", ROOT / "CodeBreakerz.html"]

print(f"=== Auditing {len(html_files)} HTML files for SEO and Mobile Compliance ===")
errors = []

for hf in html_files:
    content = hf.read_text(encoding="utf-8")
    rel = hf.relative_to(ROOT)
    
    # 1. Viewport fit cover
    if "viewport-fit=cover" not in content:
        errors.append(f"[{rel}] Missing viewport-fit=cover in meta viewport")
    
    # 2. Canonical tag
    if 'rel="canonical"' not in content:
        errors.append(f"[{rel}] Missing canonical link tag")
        
    # 3. Web App Manifest
    if 'rel="manifest"' not in content:
        errors.append(f"[{rel}] Missing link to manifest.json")
        
    # 4. Open Graph
    if 'property="og:title"' not in content:
        errors.append(f"[{rel}] Missing og:title")
    if 'property="og:url"' not in content:
        errors.append(f"[{rel}] Missing og:url")
        
    # 5. Twitter card
    if 'name="twitter:card"' not in content:
        errors.append(f"[{rel}] Missing twitter:card")
        
    # 6. JSON-LD schema
    if '<script type="application/ld+json">' in content:
        # Extract and parse JSON
        start = content.find('<script type="application/ld+json">') + len('<script type="application/ld+json">')
        end = content.find('</script>', start)
        json_str = content[start:end].strip()
        try:
            parsed = json.loads(json_str)
            assert "@context" in parsed, "Missing @context"
        except Exception as e:
            errors.append(f"[{rel}] Invalid JSON-LD schema: {e}")
    else:
        errors.append(f"[{rel}] Missing application/ld+json structured schema")

print(f"HTML File Audit Result: {len(errors)} issues found.")
for e in errors:
    print("  ERROR:", e)

# 2. Robots.txt audit
robots = ROOT / "robots.txt"
if robots.exists():
    r_text = robots.read_text(encoding="utf-8")
    assert "Sitemap:" in r_text, "robots.txt missing Sitemap declaration"
    assert "User-agent:" in r_text, "robots.txt missing User-agent"
    print("[OK] robots.txt verified.")
else:
    print("[ERROR] robots.txt missing!")

# 3. Sitemap.xml audit
sitemap = ROOT / "sitemap.xml"
if sitemap.exists():
    try:
        tree = ET.parse(sitemap)
        root = tree.getroot()
        urls = [elem.text for elem in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
        print(f"[OK] sitemap.xml valid XML with {len(urls)} registered URLs:")
        for u in urls:
            print(f"    - {u}")
    except Exception as e:
        print(f"[ERROR] sitemap.xml parse error: {e}")
else:
    print("[ERROR] sitemap.xml missing!")

# 4. Manifest.json audit
manifest = ROOT / "manifest.json"
if manifest.exists():
    try:
        m_data = json.loads(manifest.read_text(encoding="utf-8"))
        assert m_data.get("name"), "Manifest missing name"
        assert m_data.get("icons"), "Manifest missing icons"
        print("[OK] manifest.json valid PWA manifest.")
    except Exception as e:
        print(f"[ERROR] manifest.json error: {e}")
else:
    print("[ERROR] manifest.json missing!")

# 5. Live Server Endpoint Tests
print("\n=== Live FastAPI Server Routing Verification ===")
endpoints = [
    ("http://127.0.0.1:8000/robots.txt", "text/plain"),
    ("http://127.0.0.1:8000/sitemap.xml", "application/xml"),
    ("http://127.0.0.1:8000/manifest.json", "application/manifest+json"),
    ("http://127.0.0.1:8000/site.webmanifest", "application/manifest+json"),
    ("http://127.0.0.1:8000/explore/", "text/html"),
    ("http://127.0.0.1:8000/map/", "text/html"),
    ("http://127.0.0.1:8000/planner/", "text/html"),
    ("http://127.0.0.1:8000/ai/", "text/html"),
    ("http://127.0.0.1:8000/responsible/", "text/html"),
    ("http://127.0.0.1:8000/culture/", "text/html"),
    ("http://127.0.0.1:8000/food/", "text/html"),
    ("http://127.0.0.1:8000/login/", "text/html"),
    ("http://127.0.0.1:8000/profile/", "text/html"),
    ("http://127.0.0.1:8000/codebreakerz/", "text/html"),
]

for url, expected_type in endpoints:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            content_type = resp.headers.get("Content-Type", "")
            print(f"[OK] [{resp.status}] {url} -> Content-Type: {content_type}")
    except Exception as ex:
        print(f"[FAIL] {url}: {ex}")

print("\n=== Verification Completed ===")
