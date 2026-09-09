# Update css/map.css and css/ai.css for soothing green tourism color scheme

# ==========================================
# 1. Update css/map.css
# ==========================================
with open("css/map.css", "r", encoding="utf-8") as f:
    map_css = f.read()

replacements_map = [
    (
        "background: linear-gradient(180deg, var(--paper, #f7f5f0) 0%, #e5e0d7 100%);",
        "background: linear-gradient(180deg, var(--paper, #f4efe4) 0%, #e5ddcc 100%);"
    ),
    (
        "background: rgba(10, 18, 26, 0.06);",
        "background: rgba(10, 28, 20, 0.06);"
    ),
    (
        "border: 1.5px solid rgba(10, 18, 26, 0.14);",
        "border: 1.5px solid rgba(10, 28, 20, 0.14);"
    ),
    (
        "color: var(--ink, #0a121a);",
        "color: var(--ink, #0a1c14);"
    ),
    (
        "background: rgba(10, 18, 26, 0.12);",
        "background: rgba(10, 28, 20, 0.12);"
    ),
    (
        "background: var(--ink, #0a121a);\n  border-color: var(--ink, #0a121a);\n  color: #fff;\n  box-shadow: 0 4px 14px rgba(10, 18, 26, 0.28);",
        "background: #1b4332;\n  border-color: #1b4332;\n  color: #fff;\n  box-shadow: 0 4px 14px rgba(27, 67, 50, 0.35);"
    ),
    (
        "color: var(--gold-pop, #ffb703);",
        "color: var(--gold-pop, #e9c46a);"
    ),
    (
        "--pin-color: #ff6b35;",
        "--pin-color: #2d6a4f;"
    ),
    (
        ".hotspot-pin.cat-mountains { --pin-color: #ff6b35; }\n.hotspot-pin.cat-heritage  { --pin-color: #ffb703; }\n.hotspot-pin.cat-nature    { --pin-color: #2a9d8f; }\n.hotspot-pin.cat-coastal   { --pin-color: #00b4d8; }",
        ".hotspot-pin.cat-mountains { --pin-color: #1b4332; }\n.hotspot-pin.cat-heritage  { --pin-color: #e9c46a; }\n.hotspot-pin.cat-nature    { --pin-color: #2d6a4f; }\n.hotspot-pin.cat-coastal   { --pin-color: #52b788; }"
    ),
    (
        "background: rgba(12, 22, 32, 0.98) !important;",
        "background: rgba(7, 24, 17, 0.98) !important;"
    ),
    (
        "border-top-color: rgba(12, 22, 32, 0.98) !important;",
        "border-top-color: rgba(7, 24, 17, 0.98) !important;"
    ),
    (
        "border-bottom-color: rgba(12, 22, 32, 0.98) !important;",
        "border-bottom-color: rgba(7, 24, 17, 0.98) !important;"
    ),
    (
        "border-left-color: rgba(12, 22, 32, 0.98) !important;",
        "border-left-color: rgba(7, 24, 17, 0.98) !important;"
    ),
    (
        "border-right-color: rgba(12, 22, 32, 0.98) !important;",
        "border-right-color: rgba(7, 24, 17, 0.98) !important;"
    ),
    (
        "background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(12, 22, 32, 0.92) 100%);",
        "background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(7, 24, 17, 0.95) 100%);"
    ),
    (
        ".map-card-badge.mountains { border-color: #ff6b35; color: #ff9e79; }\n.map-card-badge.heritage  { border-color: #ffb703; color: #ffc93c; }\n.map-card-badge.nature    { border-color: #2a9d8f; color: #52b788; }\n.map-card-badge.coastal   { border-color: #00b4d8; color: #90e0ef; }",
        ".map-card-badge.mountains { border-color: #52b788; color: #95d5b2; }\n.map-card-badge.heritage  { border-color: #e9c46a; color: #f4d06f; }\n.map-card-badge.nature    { border-color: #2d6a4f; color: #74c69d; }\n.map-card-badge.coastal   { border-color: #40916c; color: #b7e4c7; }"
    ),
    (
        "background: linear-gradient(135deg, var(--accent, #ff6b35) 0%, #e04b16 100%);",
        "background: linear-gradient(135deg, #2d6a4f 0%, #1a4332 100%);"
    )
]

for old_s, new_s in replacements_map:
    map_css = map_css.replace(old_s, new_s)

with open("css/map.css", "w", encoding="utf-8") as f:
    f.write(map_css)

print("Updated css/map.css successfully!")

# ==========================================
# 2. Update css/ai.css
# ==========================================
with open("css/ai.css", "r", encoding="utf-8") as f:
    ai_css = f.read()

replacements_ai = [
    (
        "background: radial-gradient(circle at 75% 25%, #152632 0%, #0c181f 60%, #070e13 100%);",
        "background: radial-gradient(circle at 75% 25%, #102d21 0%, #0a2118 60%, #071711 100%);"
    ),
    (
        "background: rgba(0, 180, 216, 0.15);\n  border: 1px solid rgba(0, 180, 216, 0.35);\n  color: var(--teal-pop, #00b4d8);",
        "background: rgba(82, 183, 136, 0.18);\n  border: 1px solid rgba(82, 183, 136, 0.4);\n  color: #74c69d;"
    ),
    (
        "border: 1px solid rgba(255, 255, 255, 0.2);",
        "border: 1px solid rgba(116, 198, 157, 0.25);"
    ),
    (
        ".ai-suggestions button:hover {\n  background: rgba(255, 255, 255, 0.2);\n  transform: translateY(-2px);\n}",
        ".ai-suggestions button:hover {\n  background: rgba(82, 183, 136, 0.22);\n  border-color: #74c69d;\n  color: #fff;\n  transform: translateY(-2px);\n}"
    ),
    (
        "background: #ffffff;\n  color: var(--ink, #0a121a);",
        "background: #faf8f2;\n  color: var(--ink, #0a1c14);"
    ),
    (
        "border: 1px solid rgba(255, 255, 255, 0.8);",
        "border: 1.5px solid rgba(82, 183, 136, 0.25);"
    ),
    (
        "background: #f8fafb;",
        "background: #f4efe4;"
    ),
    (
        "background: linear-gradient(135deg, var(--accent, #ff6b35) 0%, #e04b16 100%);\n  box-shadow: 0 0 12px var(--accent-glow, rgba(255, 107, 53, 0.35));",
        "background: linear-gradient(135deg, #2d6a4f 0%, #1a4332 100%);\n  box-shadow: 0 0 12px rgba(82, 183, 136, 0.45);"
    ),
    (
        "background: linear-gradient(135deg, var(--teal-pop, #00b4d8) 0%, var(--gold-pop, #ffb703) 100%);\n  box-shadow: 0 0 18px rgba(0, 180, 216, 0.6);",
        "background: linear-gradient(135deg, #52b788 0%, #e9c46a 100%);\n  box-shadow: 0 0 18px rgba(82, 183, 136, 0.6);"
    ),
    (
        "background: linear-gradient(135deg, #ff6b35 0%, #ffb703 100%);\n  box-shadow: 0 0 22px rgba(255, 107, 53, 0.7);",
        "background: linear-gradient(135deg, #2d6a4f 0%, #74c69d 100%);\n  box-shadow: 0 0 22px rgba(82, 183, 136, 0.7);"
    ),
    (
        "background: #f4f6f8;",
        "background: #ffffff;\n  border: 1px solid rgba(45, 106, 79, 0.12);"
    ),
    (
        "background: linear-gradient(135deg, var(--accent, #ff6b35) 0%, #dd4b1b 100%);\n  color: #fff;\n  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);",
        "background: linear-gradient(135deg, #2d6a4f 0%, #1a4332 100%);\n  color: #fff;\n  box-shadow: 0 4px 12px rgba(45, 106, 79, 0.35);"
    ),
    (
        "background: #f1f3f4;",
        "background: #ffffff;\n  border: 1px solid rgba(45, 106, 79, 0.18);"
    ),
    (
        "background: var(--ink, #0a121a);",
        "background: #1b4332;"
    ),
    (
        "background: #1c2e38;",
        "background: #2d6a4f;"
    ),
    (
        "color: var(--accent, #ff6b35);",
        "color: #2d6a4f;"
    ),
    (
        "color: var(--emerald-pop, #2a9d8f);",
        "color: #52b788;"
    ),
    (
        "color: var(--ink, #0a121a);",
        "color: var(--ink, #0a1c14);"
    ),
    (
        "background: #fff;\n  border-radius: var(--radius, 16px);\n  padding: 30px;\n  display: grid;\n  gap: 14px;\n  box-shadow: var(--depth-sm, 0 4px 14px rgba(10, 18, 26, 0.08));\n  border: 1px solid rgba(12, 23, 30, 0.08);",
        "background: #faf8f2;\n  border-radius: var(--radius, 16px);\n  padding: 30px;\n  display: grid;\n  gap: 14px;\n  box-shadow: var(--depth-sm, 0 4px 14px rgba(10, 26, 19, 0.08));\n  border: 1px solid rgba(45, 106, 79, 0.14);"
    ),
    (
        "background: #fafaf8;\n  color: var(--ink, #0a121a);",
        "background: #ffffff;\n  color: var(--ink, #0a1c14);"
    ),
    (
        "border: 1px solid #dfe3e6;",
        "border: 1px solid rgba(45, 106, 79, 0.18);"
    ),
    (
        "border-color: var(--accent, #ff6b35);",
        "border-color: #2d6a4f;"
    ),
    (
        "accent-color: var(--accent, #ff6b35);",
        "accent-color: #2d6a4f;"
    ),
    (
        "background: var(--surface-dark, #0d1a24);",
        "background: var(--surface-dark, #0c231a);"
    ),
    (
        "color: var(--gold-pop, #ffb703);",
        "color: var(--gold-pop, #e9c46a);"
    ),
    (
        "border-left: 4px solid #2a9d8f;",
        "border-left: 4px solid #52b788;"
    )
]

for old_s, new_s in replacements_ai:
    ai_css = ai_css.replace(old_s, new_s)

with open("css/ai.css", "w", encoding="utf-8") as f:
    f.write(ai_css)

print("Updated css/ai.css successfully!")
