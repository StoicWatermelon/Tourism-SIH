import pathlib
import re

base_dir = pathlib.Path(__file__).resolve().parent.parent
html_dir = base_dir / "html"

html_files = list(html_dir.glob("*.html"))
print(f"Checking {len(html_files)} HTML files in {html_dir}...")

missing = []

for f in html_files:
    content = f.read_text(encoding="utf-8")
    # find local css, js, images
    srcs = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', content)
    for ref in srcs:
        if ref.startswith("http") or ref.startswith("//") or ref.startswith("#") or ref.startswith("javascript:"):
            continue
        if ref.endswith(".html"):
            target = html_dir / ref
            if not target.exists():
                missing.append((f.name, ref, str(target)))
        elif ref.startswith("../"):
            target = (f.parent / ref).resolve()
            if not target.exists():
                missing.append((f.name, ref, str(target)))
        elif ref.startswith("/"):
            target = (base_dir / ref.lstrip("/")).resolve()
            if not target.exists() and not (html_dir / ref.lstrip("/")).exists():
                missing.append((f.name, ref, str(target)))

if missing:
    print(f"FAILED: Found {len(missing)} broken local references:")
    for fn, ref, path in missing:
        print(f"  In {fn}: {ref} -> {path} (NOT FOUND)")
else:
    print("SUCCESS: All local CSS, JS, image, and page links in all HTML files resolve successfully!")
