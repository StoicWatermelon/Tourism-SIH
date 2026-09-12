import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

def find_sos_chunks(filepath):
    print(f"\n=======================================================")
    print(f"SOS CHUNKS IN: {filepath}")
    print(f"=======================================================")
    if not os.path.exists(filepath):
        print("File does not exist.")
        return
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    indices = [i for i, l in enumerate(lines) if 'sos' in l.lower()]
    if not indices:
        print("No SOS occurrences found.")
        return

    # Merge contiguous regions
    chunks = []
    c_start = max(0, indices[0] - 5)
    c_end = min(len(lines), indices[0] + 6)

    for idx in indices[1:]:
        s = max(0, idx - 5)
        e = min(len(lines), idx + 6)
        if s <= c_end:
            c_end = max(c_end, e)
        else:
            chunks.append((c_start, c_end))
            c_start, c_end = s, e
    chunks.append((c_start, c_end))

    for s, e in chunks:
        print(f"\n--- Lines {s+1} to {e} ---")
        for i in range(s, e):
            print(f"{i+1:4d}: {lines[i]}", end='')

if __name__ == '__main__':
    for f in [
        'Bharat_Explore_SIH_Tourism/backend/server.py',
        'Bharat_Explore_SIH_Tourism/js/map.js',
        'Bharat_Explore_SIH_Tourism/js/app.js',
        'Bharat_Explore_SIH_Tourism/css/map.css',
        'Bharat_Explore_SIH_Tourism/css/style.css',
        'Bharat_Explore_SIH_Tourism/js/i18n.js'
    ]:
        find_sos_chunks(f)
