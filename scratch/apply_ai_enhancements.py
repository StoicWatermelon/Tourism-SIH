import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# 1. Update css/ai.css
ai_css_path = BASE_DIR / "css" / "ai.css"
step151_css_path = BASE_DIR / "scratch" / "step151_chunk.css"

ai_css_content = ai_css_path.read_text(encoding="utf-8")
step151_css_content = step151_css_path.read_text(encoding="utf-8")

if ".agent-tracker-wrap" not in ai_css_content:
    print("Appending agent CSS styles to css/ai.css...")
    new_css = ai_css_content.rstrip() + "\n\n" + step151_css_content.strip() + "\n"
    ai_css_path.write_text(new_css, encoding="utf-8")
    print("css/ai.css updated successfully!")
else:
    print("css/ai.css already has agent styles.")

# 2. Update html/ai.html
ai_html_path = BASE_DIR / "html" / "ai.html"
step155_html_path = BASE_DIR / "scratch" / "step155_chunk.html"

ai_html_content = ai_html_path.read_text(encoding="utf-8")
step155_html_content = step155_html_path.read_text(encoding="utf-8")

# Target section to replace in html/ai.html
start_marker = '<!-- AI Split Section & Streaming Chatbot -->'
end_marker = '</section>'

start_pos = ai_html_content.find(start_marker)
if start_pos == -1:
    print("Error: Could not find start marker in html/ai.html")
    sys.exit(1)

# Find closing </section> for the split-section
end_pos = ai_html_content.find(end_marker, start_pos)
if end_pos == -1:
    print("Error: Could not find end marker in html/ai.html")
    sys.exit(1)
end_pos += len(end_marker)

target_content = ai_html_content[start_pos:end_pos]
print("Found target section to replace, length:", len(target_content))

new_html_content = ai_html_content[:start_pos] + step155_html_content.strip() + ai_html_content[end_pos:]
ai_html_path.write_text(new_html_content, encoding="utf-8")
print("html/ai.html updated successfully!")

# Verify critical IDs are present
updated_html = ai_html_path.read_text(encoding="utf-8")
for req_id in ["chatForm", "chatInput", "messages", "aiOrb", "aiStatusText", "agentTrackerWrap", "agentCheckpointPill"]:
    if f'id="{req_id}"' in updated_html:
        print(f"  [OK] ID confirmed: {req_id}")
    else:
        print(f"  [MISSING] WARNING: ID missing: {req_id}")

if 'class="chat"' in updated_html or "class='chat'" in updated_html:
    print("  [OK] .chat container confirmed")
else:
    print("  [MISSING] WARNING: .chat container missing")
