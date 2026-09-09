from pathlib import Path
from bs4 import BeautifulSoup
import sys

sys.stdout.reconfigure(encoding='utf-8')

base = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")

html_files = sorted(list(base.glob("*.html")) + list((base / "html").glob("*.html")))

for hf in html_files:
    text = hf.read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(text, "html.parser")
    
    card_elements = soup.find_all(lambda tag: (tag.name == 'article') or (tag.get('class') and any('card' in c.lower() for c in tag.get('class'))))
    
    suspicious = []
    for el in card_elements:
        classes = " ".join(el.get('class', []))
        if 'modal-card' in classes and not 'game-consequence-card' in classes:
            continue
        has_img = el.find('img') is not None
        style = el.get('style', '')
        has_bg = 'url(' in style
        
        h = el.find(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        h_text = h.get_text(strip=True) if h else ""
        
        if not has_img and not has_bg:
            suspicious.append((classes, h_text, str(el)[:120].replace('\n', ' ')))
            
    if suspicious:
        print(f"\n=== {hf.relative_to(base)} ({len(suspicious)} cards without img/bg) ===")
        for cls, ht, snippet in suspicious:
            print(f"  [{cls}] {ht}: {snippet[:90]}")
