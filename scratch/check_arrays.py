import re
from pathlib import Path

base = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")
app_js = (base / "js" / "app.js").read_text(encoding="utf-8")

for arr_name in ['regionalCircuits', 'categories', 'foods', 'journeyNodes']:
    match = re.search(r'(?:const|let|var)\s+' + arr_name + r'\s*=\s*(\[.*?\]);', app_js, re.DOTALL)
    if match:
        content = match.group(1)
        imgs = re.findall(r'(?:img|image|photo|icon):\s*["\']([^"\']+)["\']', content)
        print(f"\n=== Array: {arr_name} ({len(imgs)} images) ===")
        for img in imgs:
            clean = img.split("?")[0].split("#")[0]
            if img.startswith("http"):
                print(f"  Remote: {img[:60]}")
            else:
                exists = (base / clean.lstrip("/")).exists()
                print(f"  Local ({'EXISTS' if exists else 'MISSING'}): {img}")
    else:
        print(f"Array {arr_name} not found")
