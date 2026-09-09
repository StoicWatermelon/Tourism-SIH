from pathlib import Path
import re

base = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")
image_files = set([f.name for f in (base / "assets" / "images").glob("*.*")])

all_files = list(base.glob("*.html")) + list((base / "html").glob("*.html")) + list((base / "js").glob("*.js")) + list((base / "css").glob("*.css"))

used_images = set()
for f in all_files:
    text = f.read_text(encoding="utf-8", errors="ignore")
    for img in image_files:
        if img.lower() in text.lower():
            used_images.add(img)

unused_images = sorted(list(image_files - used_images))
print(f"Total images: {len(image_files)}")
print(f"Used images: {len(used_images)}")
print(f"Unused images ({len(unused_images)}):")
for u in unused_images:
    print(f"  - {u}")
