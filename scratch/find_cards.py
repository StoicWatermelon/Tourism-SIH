import os
import re
import sys
from pathlib import Path

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

base = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")

print("========================================")
print("1. CHECKING ALL HTML FILES FOR CARDS & IMGS")
print("========================================")
html_files = sorted(list(base.glob("*.html")) + list((base / "html").glob("*.html")))
for html_file in html_files:
    content = html_file.read_text(encoding="utf-8", errors="ignore")
    rel_path = html_file.relative_to(base)
    
    # Check for <img> tags
    imgs = re.findall(r'<img[^>]*>', content, re.I)
    
    # Check cards
    cards = re.findall(r'<[^>]+class=["\'][^"\']*(?:card|destination|portal|circuit|cuisine|item|tile|heritage|monument)[^"\']*["\'][^>]*>', content, re.I)
    
    # Check style="background-image:..."
    bgs = re.findall(r'url\([\'"]?([^\'")]+)[\'"]?\)', content, re.I)
    
    broken_or_remote = []
    for img in imgs:
        src_m = re.search(r'src=["\']([^"\']*)["\']', img, re.I)
        if src_m:
            src = src_m.group(1)
            if not src or "unsplash" in src.lower() or "placeholder" in src.lower() or "via.placeholder" in src.lower():
                broken_or_remote.append(f"Remote/Placeholder <img>: {src}")
            elif not src.startswith("http") and not src.startswith("data:"):
                clean = src.split("?")[0].split("#")[0]
                p1 = (html_file.parent / clean).resolve()
                p2 = (base / clean.lstrip("/")).resolve()
                if not p1.exists() and not p2.exists():
                    broken_or_remote.append(f"Broken <img>: {src}")
        else:
            broken_or_remote.append(f"Missing src attribute in: {img}")

    for bg in bgs:
        if "unsplash" in bg.lower() or "placeholder" in bg.lower():
            broken_or_remote.append(f"Remote/Placeholder bg: {bg}")
        elif not bg.startswith("http") and not bg.startswith("data:"):
            clean = bg.split("?")[0].split("#")[0]
            p1 = (html_file.parent / clean).resolve()
            p2 = (base / clean.lstrip("/")).resolve()
            if not p1.exists() and not p2.exists():
                broken_or_remote.append(f"Broken bg: {bg}")

    print(f"\n{rel_path}: {len(cards)} card elements, {len(imgs)} imgs, {len(bgs)} bg-urls")
    for item in broken_or_remote:
        print(f"  --> {item}")

print("\n========================================")
print("2. CHECKING JAVASCRIPT DATA OBJECTS")
print("========================================")
js_files = sorted(list((base / "js").glob("*.js")))
for js_file in js_files:
    content = js_file.read_text(encoding="utf-8", errors="ignore")
    rel_path = js_file.relative_to(base)
    
    # find image / img properties
    # e.g., img: '...', image: '...'
    matches = re.finditer(r'(?:img|image|photo|thumbnail|banner)\s*:\s*["\']([^"\']*)["\']', content, re.I)
    findings = []
    count = 0
    for m in matches:
        count += 1
        val = m.group(1)
        if not val or "unsplash" in val.lower() or "placeholder" in val.lower() or val.startswith("http"):
            findings.append((m.start(), f"Remote/Placeholder: {val}"))
        elif not val.startswith("data:"):
            clean = val.split("?")[0].split("#")[0]
            p1 = (base / clean.lstrip("/")).resolve()
            if not p1.exists():
                findings.append((m.start(), f"Broken local: {val}"))
    
    print(f"\n{rel_path}: {count} image keys, {len(findings)} remote/placeholder/broken")
    for pos, desc in findings:
        # get surrounding context (line)
        line_no = content[:pos].count("\n") + 1
        line_content = content.splitlines()[line_no - 1].strip()
        print(f"  Line {line_no}: {desc}")
        print(f"    Context: {line_content[:90]}")
