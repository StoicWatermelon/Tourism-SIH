import re

files_to_check = [
    'html/planner.html',
    'html/food.html',
    'html/ai.html',
    'js/ai.js',
    'js/app.js'
]

print("=== SCANNING FOR INLINE COLORS ===")
for path in files_to_check:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.finditer(r'style=["\']([^"\']*)["\']', content, re.IGNORECASE)
    cleaned = set()
    for m in matches:
        style_str = m.group(1)
        color_matches = re.findall(r'(?:^|;|\s)color:\s*([^;]+)', style_str, re.IGNORECASE)
        for c in color_matches:
            cleaned.add(c.strip())
            
    print(f"\n{path}: {len(cleaned)} unique inline color values found:")
    for c in sorted(cleaned):
        is_dark = False
        if re.match(r'^#[0-5][0-9a-fA-F]{2,5}', c):
            is_dark = True
        elif 'rgba(0' in c.replace(' ', '') or 'rgb(0' in c.replace(' ', ''):
            is_dark = True
        marker = " [POTENTIALLY DARK!]" if is_dark else ""
        print(f"  - {c}{marker}")
