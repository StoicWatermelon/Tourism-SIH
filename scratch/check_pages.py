from pathlib import Path
import re

base = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")
for fname in ["CodeBreakerz.html", "html/CodeBreakerz.html", "html/culture.html", "home.html", "index.html"]:
    f = base / fname
    text = f.read_text(encoding="utf-8", errors="ignore")
    cards = re.findall(r'<[^>]*class=[\'"][^\'"]*card[^\'"]*[\'"][^>]*>', text)
    print(f"=== {fname} ({len(cards)} cards) ===")
    for c in cards:
        print(" ", c)
