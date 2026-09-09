import os
from pathlib import Path

base_dir = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")
assets_dir = base_dir / "assets" / "images"

all_imgs = sorted([p.name for p in assets_dir.iterdir()])

# Known foods
foods_keywords = [
    "kulcha", "alookegutke", "apong", "appam", "axone", "bai", "bajrakhicdi", "bebinca", 
    "bhuttekakees", "biryani", "bisibelebhath", "chaat", "chakhwi", "chhenapoda", "chila", 
    "churma", "coconut", "dalbaati", "dalma", "dham", "dhokla", "dhuska", "dohneiihong", 
    "dosa", "eromba", "fara", "fishcurry", "gongura", "gujratiflavours", "haleem", 
    "jadoh", "kafuli", "kahwa", "kebabs", "khaja", "khar"
]

places = []
foods = []
other = []

for img in all_imgs:
    lower = img.lower()
    if any(k in lower for k in foods_keywords):
        foods.append(img)
    elif lower == "favicon.png":
        other.append(img)
    else:
        places.append(img)

print(f"Places ({len(places)}):")
for p in places:
    print(f"  {p}")

print(f"\nFoods ({len(foods)}):")
for f in foods:
    print(f"  {f}")
