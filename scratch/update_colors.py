import re

# ==========================================
# 1. Update css/style.css
# ==========================================
with open("css/style.css", "r", encoding="utf-8") as f:
    style_content = f.read()

# Update :root
old_root = """ :root {
  --ink: #0c171e;
  --muted: #4e5f6c;
  --paper: #f4efe6;
  --white: #ffffff;
  --accent: #ff6b35;
  --accent-glow: rgba(255, 107, 53, 0.35);
  --teal-pop: #00b4d8;
  --gold-pop: #ffb703;
  --emerald-pop: #2a9d8f;
  --deep: #081116;
  --surface-dark: rgba(18, 26, 40, 0.78);
  --border-dark: rgba(255, 255, 255, 0.12);
  --radius: 20px;
  --radius-sm: 12px;
  --line: rgba(12, 23, 30, 0.08);

  /* Refined Institutional Shadows */
  --depth-sm: 0 4px 14px rgba(12, 23, 30, 0.05), 0 1px 3px rgba(12, 23, 30, 0.03);
  --depth-md: 0 14px 32px -6px rgba(12, 23, 30, 0.12), 0 4px 10px rgba(12, 23, 30, 0.04);
  --depth-lg: 0 22px 48px -10px rgba(12, 23, 30, 0.18), 0 6px 16px rgba(12, 23, 30, 0.05);
  --depth-glow: 0 12px 28px -4px var(--accent-glow);
}""".strip()

new_root = """:root {
  --ink: #0a1c14;
  --muted: #466153;
  --paper: #f4efe4;
  --paper-warm: #eae2d0;
  --cream: #faf7f0;
  --cream-card: #fdfbf7;
  --white: #ffffff;
  --accent: #2d6a4f;
  --accent-light: #40916c;
  --accent-glow: rgba(45, 106, 79, 0.38);
  --green-primary: #2d6a4f;
  --green-soothing: #387c5e;
  --green-soft: #52b788;
  --green-mint: #74c69d;
  --green-pale: #d8f3dc;
  --teal-pop: #52b788;
  --gold-pop: #e9c46a;
  --emerald-pop: #52b788;
  --deep: #071711;
  --forest-dark: #0c231a;
  --forest-card: #123024;
  --surface-dark: rgba(12, 35, 26, 0.88);
  --border-dark: rgba(116, 198, 157, 0.2);
  --radius: 20px;
  --radius-sm: 12px;
  --line: rgba(45, 106, 79, 0.1);

  /* Refined Soothing Tourism Shadows */
  --depth-sm: 0 4px 14px rgba(10, 26, 19, 0.05), 0 1px 3px rgba(10, 26, 19, 0.03);
  --depth-md: 0 14px 32px -6px rgba(10, 26, 19, 0.12), 0 4px 10px rgba(10, 26, 19, 0.04);
  --depth-lg: 0 22px 48px -10px rgba(10, 26, 19, 0.18), 0 6px 16px rgba(10, 26, 19, 0.05);
  --depth-glow: 0 12px 28px -4px var(--accent-glow);
}"""

# Replacements in style.css
replacements_style = [
    (
        "background: radial-gradient(circle at 10% 10%, #fff9f0 0%, #f4efe6 50%, #eae4d8 100%);",
        "background: radial-gradient(circle at 10% 10%, #fdfbf7 0%, #f4efe4 50%, #e8e0ce 100%);"
    ),
    (
        "background: rgba(10, 15, 26, 0.82);",
        "background: rgba(7, 24, 17, 0.86);"
    ),
    (
        "background: rgba(6, 12, 22, 0.94);",
        "background: rgba(5, 18, 13, 0.96);"
    ),
    (
        "box-shadow: 0 14px 36px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 107, 53, 0.12);",
        "box-shadow: 0 14px 36px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(82, 183, 136, 0.22);"
    ),
    (
        "background: #081017;",
        "background: #071711;"
    ),
    (
        "radial-gradient(circle at 70% 30%, rgba(0, 180, 216, 0.14) 0%, transparent 60%),\n              radial-gradient(circle at 25% 70%, rgba(255, 107, 53, 0.12) 0%, transparent 60%);",
        "radial-gradient(circle at 70% 30%, rgba(82, 183, 136, 0.18) 0%, transparent 60%),\n              radial-gradient(circle at 25% 70%, rgba(45, 106, 79, 0.22) 0%, transparent 60%);"
    ),
    (
        "background: linear-gradient(180deg, rgba(8, 16, 23, 0.45) 0%, rgba(8, 16, 23, 0.75) 65%, #f4efe6 100%);",
        "background: linear-gradient(180deg, rgba(7, 23, 17, 0.45) 0%, rgba(7, 23, 17, 0.8) 65%, #f4efe4 100%);"
    ),
    (
        "background: radial-gradient(circle at center, transparent 45%, rgba(8, 16, 23, 0.65) 100%);",
        "background: radial-gradient(circle at center, transparent 45%, rgba(7, 23, 17, 0.7) 100%);"
    ),
    (
        "background: rgba(255, 107, 53, 0.15);",
        "background: rgba(45, 106, 79, 0.25);"
    ),
    (
        "border: 1px solid rgba(255, 107, 53, 0.35);",
        "border: 1px solid rgba(82, 183, 136, 0.45);"
    ),
    (
        "background: linear-gradient(135deg, var(--accent) 0%, #e04b16 100%);\n  color: #fff;\n  box-shadow: 0 6px 18px rgba(255, 107, 53, 0.3);",
        "background: linear-gradient(135deg, #2d6a4f 0%, #1a4332 100%);\n  color: #fff;\n  box-shadow: 0 6px 18px rgba(45, 106, 79, 0.38);"
    ),
    (
        "box-shadow: 0 10px 24px rgba(255, 107, 53, 0.4);",
        "box-shadow: 0 10px 24px rgba(82, 183, 136, 0.45);"
    ),
    (
        "background: rgba(14, 23, 34, 0.7);",
        "background: rgba(10, 30, 22, 0.78);"
    ),
    (
        "border: 1px solid rgba(12, 23, 30, 0.08);",
        "border: 1px solid rgba(45, 106, 79, 0.12);"
    ),
    (
        "background: #1a2c38;",
        "background: #2d6a4f;"
    ),
    (
        "background: linear-gradient(135deg, var(--accent) 0%, #e04b16 100%);",
        "background: linear-gradient(135deg, #2d6a4f 0%, #1a4332 100%);"
    ),
    (
        "background: #0f172a;",
        "background: #091c15;"
    ),
    (
        "background: rgba(15, 23, 42, 0.8);",
        "background: rgba(9, 28, 21, 0.85);"
    ),
    (
        "background: rgba(30, 41, 59, 0.6);",
        "background: rgba(16, 45, 34, 0.65);"
    ),
    (
        "background: #dde2de;",
        "background: #e4dcce;"
    ),
    (
        "background: #eef1ea;",
        "background: #ede6d6;"
    ),
    (
        "background: #0d171c;",
        "background: #071711;"
    ),
    (
        "background: #18262f;",
        "background: #0f2c20;"
    ),
    (
        "background: #f1eee6;",
        "background: linear-gradient(180deg, #f4efe4 0%, #e6decb 100%);"
    )
]

# Apply root replacement
root_regex = r':root\s*\{[^}]+\}'
style_content = re.sub(root_regex, new_root, style_content, count=1)

for old_s, new_s in replacements_style:
    style_content = style_content.replace(old_s, new_s)

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(style_content)

print("Updated css/style.css successfully!")
