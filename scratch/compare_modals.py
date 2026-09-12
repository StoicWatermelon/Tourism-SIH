import re

with open('profile.html', 'r', encoding='utf-8') as f:
    root_profile = f.read()

with open('Bharat_Explore_SIH_Tourism/profile.html', 'r', encoding='utf-8') as f:
    sub_profile = f.read()

def get_modal(html):
    m = re.search(r'(<div class="modal" id="fieldKitModal"[\s\S]*?<!-- Modal Close / End -->|<!-- /#fieldKitModal -->|<div class="modal" id="fieldKitModal"[\s\S]*?</div>\s*</div>\s*</div>)', html)
    return m.group(0) if m else 'NOT FOUND'

root_m = get_modal(root_profile)
sub_m = get_modal(sub_profile)

with open('scratch/modal_comparison.txt', 'w', encoding='utf-8') as out:
    out.write(f"ROOT MODAL ({len(root_m)} chars):\n{root_m}\n\n{'='*50}\nSUB MODAL ({len(sub_m)} chars):\n{sub_m}")

print("Wrote scratch/modal_comparison.txt")
