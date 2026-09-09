import re
from pathlib import Path

base_dir = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")
app_js = (base_dir / "js" / "app.js").read_text(encoding="utf-8")

# Extract localDestinations
dest_block = re.search(r'const localDestinations = \[(.*?)\];\s*let activeDestinations', app_js, re.DOTALL)
if dest_block:
    items = re.findall(r'\{[^{}]*id:\s*["\']([^"\']+)["\'][^{}]*name:\s*["\']([^"\']+)["\'][^{}]*img:\s*["\']([^"\']+)["\']', dest_block.group(1))
    print(f"Total destinations in localDestinations: {len(items)}")
    for d_id, name, img in items:
        is_external = img.startswith("http")
        print(f"  [{d_id}] {name} -> {img} ({'EXTERNAL' if is_external else 'LOCAL'})")
else:
    print("Could not find localDestinations block")
