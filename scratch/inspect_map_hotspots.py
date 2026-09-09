import re
from pathlib import Path

base_dir = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")
map_js = (base_dir / "js" / "map.js").read_text(encoding="utf-8")

hotspots = re.findall(r'id:\s*["\']([^"\']+)["\'][^{}]*name:\s*["\']([^"\']+)["\'][^{}]*img:\s*["\']([^"\']+)["\']', map_js)
print(f"Total hotspots found: {len(hotspots)}")
for h_id, name, img in hotspots:
    if img.startswith("http"):
        print(f"  [HOTSPOT EXTERNAL] {h_id} ({name}) -> {img}")
    else:
        target = base_dir / img
        if not target.exists():
            print(f"  [HOTSPOT MISSING LOCAL] {h_id} ({name}) -> {img}")
        else:
            # print(f"  [OK] {h_id} -> {img}")
            pass
