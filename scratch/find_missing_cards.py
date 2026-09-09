import re
from pathlib import Path

base = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")

html_files = sorted(list(base.glob("*.html")) + list((base / "html").glob("*.html")))

print("=== CHECKING CARDS IN HTML FILES ===")
for hf in html_files:
    content = hf.read_text(encoding="utf-8", errors="ignore")
    # find all card-like sections or articles
    # matches like <article ...> or <div class="...card...">
    cards = re.findall(r'(<(?:article|div)[^>]*class=[\'"][^\'"]*(?:card|destination|portal|feature|box|tile|item)[^\'"]*[\'"][^>]*>.*?</(?:article|div)>)', content, re.DOTALL | re.I)
    
    suspicious = []
    for c in cards:
        # Check if card has an image (img tag or style="background-image:...")
        has_img = "<img" in c or "background-image" in c or "url(" in c
        # check if it has remote unsplash
        if "unsplash.com" in c:
            suspicious.append(f"Contains Unsplash: {c[:80]}...")
        elif not has_img:
            # check if it's a content card that might need an image
            # e.g., culture-card, team card, etc.
            # print snippet
            first_line = c.splitlines()[0]
            title = re.search(r'<h[1-6][^>]*>(.*?)</h[1-6]>', c, re.I)
            title_text = title.group(1) if title else "No H tag"
            suspicious.append(f"No image: {first_line[:50]} | Title: {title_text}")

    if suspicious:
        print(f"\n{hf.relative_to(base)} ({len(cards)} cards total):")
        for s in suspicious:
            print(" ", s)
