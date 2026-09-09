from pathlib import Path

base = Path(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism")
images = sorted([f.name for f in (base / "assets" / "images").glob("*.*")])

print(f"Total images in assets/images: {len(images)}")
for i, img in enumerate(images):
    print(f"{i+1:2d}. {img}")
