from pathlib import Path
import re

base = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")
app_js = (base / "js" / "app.js").read_text(encoding="utf-8")

match = re.search(r'function\s+renderCategories\s*\(.*?\)\s*\{(?:[^{}]*|\{[^{}]*\})*\}', app_js)
if match:
    print(match.group(0))
else:
    # find lines around renderCategories
    for i, line in enumerate(app_js.splitlines()):
        if "renderCategories" in line:
            print(f"Line {i+1}: {line}")
