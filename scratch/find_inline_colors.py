# Scan all inline colors in js/ai.js and js/ai_card_insight.js and js/app.js
import re

def scan(filename):
    print(f"=== {filename} ===")
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for i, l in enumerate(lines, 1):
        if 'style=' in l and 'color:' in l:
            # print line number and the style attribute
            styles = re.findall(r'style="([^"]*)"', l)
            for s in styles:
                if 'color:' in s:
                    print(f"Line {i}: {s}")

scan('js/ai.js')
scan('js/ai_card_insight.js')
scan('js/app.js')
