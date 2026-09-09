import re
from pathlib import Path

base = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")
app_js = (base / "js" / "app.js").read_text(encoding="utf-8")

# Extract localDestinations array
dest_match = re.search(r'const\s+localDestinations\s*=\s*\[(.*?)\];', app_js, re.DOTALL)
if dest_match:
    dest_str = dest_match.group(1)
    items = re.findall(r'id:\s*["\']([^"\']+)["\'].*?name:\s*["\']([^"\']+)["\'].*?img:\s*["\']([^"\']+)["\']', dest_str, re.DOTALL)
    print(f"Total destinations in localDestinations: {len(items)}")
    for item_id, name, img in items:
        status = "OK (Local)" if not img.startswith("http") else "UNSPLASH REMOTE"
        print(f"{item_id:15} | {name:30} | {status} | {img[:50]}")
else:
    print("localDestinations not found")
