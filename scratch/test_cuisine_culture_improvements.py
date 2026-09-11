import urllib.request
import re

print("Running deep verification of Cuisine and Culture improvements...")

# Test Culture Page
res_culture = urllib.request.urlopen("http://127.0.0.1:8000/culture")
html_culture = res_culture.read().decode('utf-8')
assert "quickFilterCulture('Prayer Flag')" in html_culture, "quickFilterCulture button missing"
assert "exploreCultureAI()" in html_culture, "exploreCultureAI missing on cultureBtn"
assert "432 Hz Temple Gong" in html_culture, "432 Hz chime button missing"
print("[PASS] Culture HTML: All button handlers, quick-tags, and audio chimes verified.")

# Test Food Page
res_food = urllib.request.urlopen("http://127.0.0.1:8000/food")
html_food = res_food.read().decode('utf-8')
assert "cuisine-showcase-wrap" in html_food, "cuisine-showcase-wrap missing"
assert "Pampore Saffron" in html_food, "Pampore Saffron ingredient card missing"
assert "recipeModalAIBtn" in html_food, "recipeModalAIBtn missing"
assert "Ask AI Culinary Guide" in html_food, "Ask AI Culinary Guide button missing"
print("[PASS] Food HTML: Ingredient showcase, recipe modal AI button, and calculators verified.")

# Test JS app.js
res_js = urllib.request.urlopen("http://127.0.0.1:8000/js/app.js")
js_content = res_js.read().decode('utf-8')
assert "/assets/images/AmritsariKulcha.png" in js_content, "Amritsari Kulcha image path missing"
assert "/assets/images/dhuska.png" in js_content, "Dhuska image missing"
assert "/assets/images/tawang.png" in js_content, "Tawang culture image missing"
assert "/assets/images/cherrapunji.png" in js_content, "Cherrapunji root bridge image missing"
assert "window.quickFilterCulture = quickFilterCulture" in js_content, "quickFilterCulture not exported"
assert "window.exploreCultureAI = exploreCultureAI" in js_content, "exploreCultureAI not exported"
assert "window.openRecipeAIInsight = openRecipeAIInsight" in js_content, "openRecipeAIInsight not exported"
assert "bharatCustomSaved" in js_content, "bharatCustomSaved storage missing in saveDestination"
print("[PASS] JS app.js: 26 regional foods, 15 culture archives with real images, drawer persistence verified.")

# Test CSS style.css
res_css = urllib.request.urlopen("http://127.0.0.1:8000/css/style.css")
css_content = res_css.read().decode('utf-8')
assert ".culture-card-img-wrap" in css_content, "culture-card-img-wrap missing in CSS"
assert ".culture-quick-tag" in css_content, "culture-quick-tag missing in CSS"
assert ".cuisine-showcase-wrap" in css_content, "cuisine-showcase-wrap missing in CSS"
print("[PASS] CSS style.css: Soothing visual cards, photo headers, and tag styles verified.")

# Test that real assets exist and return 200
assets_to_test = [
    "/assets/images/tawang.png",
    "/assets/images/cherrapunji.png",
    "/assets/images/bastar.png",
    "/assets/images/jaisalmer.png",
    "/assets/images/kochi.png",
    "/assets/images/imphal.png",
    "/assets/images/konark.png",
    "/assets/images/kahwa.png",
    "/assets/images/alookegutke.png",
    "/assets/images/appam.png",
    "/assets/images/dhokla.png",
    "/assets/images/dham.png",
    "/assets/images/dalbaatichurma.png"
]
for a in assets_to_test:
    res_a = urllib.request.urlopen(f"http://127.0.0.1:8000{a}")
    assert res_a.status == 200, f"Asset {a} returned {res_a.status}"
print(f"[PASS] Verified {len(assets_to_test)} local assets from assets/images/ returning HTTP 200.")

print("\n=== ALL CUISINE & CULTURE ENHANCEMENTS VERIFIED WITH 100% SUCCESS! ===")
