import re
from pathlib import Path

base = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")
app_js = (base / "js" / "app.js").read_text(encoding="utf-8")

lines = app_js.splitlines()
for i, line in enumerate(lines):
    if "destinationGrid" in line or "circuitsGrid" in line or "foodGrid" in line:
        print(f"Line {i+1}: {line.strip()}")
