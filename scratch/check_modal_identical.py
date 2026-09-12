import os
import re

sub = 'Bharat_Explore_SIH_Tourism'
files = [
  'home.html', 'html/home.html', 'index.html', 'html/index.html',
  'profile.html', 'html/profile.html', 'map.html', 'html/map.html',
  'html/ai.html', 'html/circuits.html', 'html/culture.html',
  'html/explore.html', 'html/food.html', 'html/planner.html',
  'html/responsible.html'
]

modals = {}
for f in files:
    p = os.path.join(sub, f)
    with open(p, 'r', encoding='utf-8') as fp:
        c = fp.read()
        m = re.search(r'(<!-- Himalayan Emergency Help & SOS Dispatch Modal[\s\S]*?</div>\s*</div>\s*</div>)', c)
        if not m:
            m = re.search(r'(<div class="modal" id="fieldKitModal"[\s\S]*?</div>\s*</div>\s*</div>)', c)
        if m:
            modals[f] = m.group(0).strip()
        else:
            modals[f] = 'NOT FOUND'

first_key = files[0]
first_modal = modals[first_key]
print(f"Length of first modal ({first_key}): {len(first_modal)}")

for f in files[1:]:
    m = modals[f]
    print(f"{f}: {len(m)} chars, equals first: {m == first_modal}")
