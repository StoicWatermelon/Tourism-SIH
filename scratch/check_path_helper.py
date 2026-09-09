from pathlib import Path
import re

base = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")
app_js = (base / "js" / "app.js").read_text(encoding="utf-8")

matches = re.findall(r'.{0,40}assets/images.{0,40}', app_js)
print(f"Found {len(matches)} matches for 'assets/images' in app.js:")
for m in matches[:15]:
    print("  ", m.strip())
