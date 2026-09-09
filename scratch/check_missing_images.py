import os
import re
from pathlib import Path

base_dir = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")
html_files = sorted(list((base_dir / "html").glob("*.html")) + list(base_dir.glob("*.html")))
assets_img_dir = base_dir / "assets" / "images"
existing_images = {p.name.lower(): p.name for p in assets_img_dir.iterdir()}

print(f"Total available assets/images: {len(existing_images)}")
print("Available images list:")
for name in sorted(existing_images.keys()):
    print(f"  {name}")

print("\n--- Scanning HTML files for image references & cards without images ---")

for hf in html_files:
    text = hf.read_text(encoding="utf-8", errors="ignore")
    # check all img tags
    img_tags = re.findall(r'<img[^>]+>', text, re.I)
    bg_urls = re.findall(r'url\(([^)]+)\)', text, re.I)
    
    missing = []
    for tag in img_tags:
        m = re.search(r'src=["\']([^"\']+)["\']', tag, re.I)
        if m:
            src = m.group(1).strip()
            if src.startswith("data:") or src.startswith("http://") or src.startswith("https://"):
                continue
            clean_src = src.split("?")[0].split("#")[0]
            target = (hf.parent / clean_src).resolve()
            if not target.exists():
                missing.append(("img", src, tag))
                
    for raw_url in bg_urls:
        url = raw_url.strip("\"' \t\r\n")
        if url.startswith("data:") or url.startswith("http://") or url.startswith("https://"):
            continue
        clean_url = url.split("?")[0].split("#")[0]
        target = (hf.parent / clean_url).resolve()
        if not target.exists():
            missing.append(("bg", url, raw_url))
            
    if missing:
        print(f"\n{hf.relative_to(base_dir)}: {len(missing)} missing/broken image paths:")
        for kind, s, detail in missing:
            print(f"   [{kind}] {s}")

print("\n--- Scanning JS data files for image references ---")
js_files = sorted(list((base_dir / "js").glob("*.js"))) + sorted(list((base_dir / "src").glob("**/*.js"))) + sorted(list((base_dir / "src").glob("**/*.ts*")))
for jf in js_files:
    text = jf.read_text(encoding="utf-8", errors="ignore")
    # Look for image file extensions
    matches = re.findall(r'["\']([^"\']+\.(?:png|jpg|jpeg|webp|svg))["\']', text, re.I)
    missing_js = []
    for m in matches:
        if m.startswith("http://") or m.startswith("https://") or m.startswith("data:"):
            continue
        clean = m.split("?")[0].split("#")[0]
        # try relative to jf parent, or relative to base_dir, or relative to html
        target1 = (base_dir / clean).resolve()
        target2 = (base_dir / "assets" / "images" / Path(clean).name).resolve()
        if not target1.exists() and not target2.exists():
            missing_js.append(m)
    if missing_js:
        print(f"\n{jf.relative_to(base_dir)}: {len(missing_js)} unresolved image paths:")
        for m in set(missing_js):
            print(f"   - {m}")
