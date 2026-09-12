import difflib
import os

def get_diff(f1, f2):
    with open(f1, 'r', encoding='utf-8', errors='ignore') as a:
        lines_a = a.readlines()
    with open(f2, 'r', encoding='utf-8', errors='ignore') as b:
        lines_b = b.readlines()
    return list(difflib.unified_diff(lines_a, lines_b, fromfile=f1, tofile=f2, n=3))

files_to_check = [
    'backend/server.py',
    'js/app.js',
    'js/map.js',
    'css/style.css',
    'css/map.css',
    'js/i18n.js'
]

for f in files_to_check:
    sub_f = os.path.join('Bharat_Explore_SIH_Tourism', f)
    diff = get_diff(f, sub_f)
    clean_name = f.replace('/', '_').replace('\\', '_')
    out_path = os.path.join('scratch', f'diff_{clean_name}.txt')
    with open(out_path, 'w', encoding='utf-8') as out:
        out.writelines(diff)
    print(f'{f}: wrote diff to {out_path}, {len(diff)} diff lines')
