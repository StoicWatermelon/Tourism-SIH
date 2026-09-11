import re

def check_colors(filepath):
    print(f"=== {filepath} ===")
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    for i, line in enumerate(text.split('\n'), 1):
        for m in re.finditer(r'color\s*:\s*([^;\"\'}]+)', line):
            c = m.group(1).strip()
            if not c.startswith('var(') and c not in ['#fff', '#ffffff', 'white', 'inherit', 'transparent']:
                safe_line = line.strip()[:110].encode('ascii', 'replace').decode('ascii')
                print(f"Line {i}: {c}  -->  {safe_line}")

check_colors('js/ai.js')
check_colors('html/food.html')
check_colors('html/planner.html')
