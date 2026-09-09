from pathlib import Path
import re

base = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")

files = list(base.glob("*.html")) + list((base / "html").glob("*.html")) + list((base / "js").glob("*.js")) + list((base / "css").glob("*.css"))

for f in files:
    text = f.read_text(encoding="utf-8", errors="ignore")
    matches = re.findall(r'[\'"]([^\'"]*assets/images/[^\'"]*)[\'"]', text)
    if matches:
        print(f"\n{f.relative_to(base)} ({len(matches)} matches):")
        for m in set(matches[:5]):
            print(f"  {m}")
