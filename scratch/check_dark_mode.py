import re

def check_file(path):
    print(f"=== {path} ===")
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for i, line in enumerate(lines, 1):
        if 'style=' in line:
            for m in re.finditer(r'style="([^"]*)"', line):
                style_str = m.group(1)
                if any(k in style_str.lower() for k in ['background', 'color', '#fff', '#1d2d', '#2d6a', '#f4', '#eb', '#1b4332']):
                    print(f"Line {i}: {style_str}")

check_file('html/food.html')
check_file('html/planner.html')
check_file('html/ai.html')
