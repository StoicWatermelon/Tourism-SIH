import re
import urllib.request
import json
import subprocess

def test_syntax():
    print("=== Testing JS Syntax ===")
    for path in ['js/ai.js', 'js/app.js']:
        res = subprocess.run(['node', '--check', path], capture_output=True, text=True)
        if res.returncode == 0:
            print(f"PASS: {path} syntax OK")
        else:
            print(f"FAIL: {path} syntax error: {res.stderr}")

def test_api():
    print("\n=== Testing Backend APIs ===")
    try:
        # 1. Geo locate
        req = urllib.request.urlopen("http://127.0.0.1:8000/api/geo/locate", timeout=5)
        geo = json.loads(req.read().decode())
        print(f"PASS: /api/geo/locate -> {geo}")
    except Exception as e:
        print(f"FAIL: /api/geo/locate: {e}")

    try:
        # 2. Agent chat
        payload = json.dumps({
            "message": "Plan a 3 day trip to Goa under 20000",
            "session_id": "test_session_dark_mode",
            "lang": "en",
            "starting_city": "Kolkata"
        }).encode()
        req = urllib.request.Request(
            "http://127.0.0.1:8000/api/agent/chat",
            data=payload,
            headers={"Content-Type": "application/json"}
        )
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read().decode())
        print(f"PASS: /api/agent/chat returned type: {data.get('type')}, plan keys: {list(data.get('plan', {}).keys())}")
    except Exception as e:
        print(f"FAIL: /api/agent/chat: {e}")

def test_css_rules():
    print("\n=== Testing CSS Dark Mode Rules ===")
    with open('css/ai.css', 'r', encoding='utf-8') as f:
        ai_css = f.read()
    with open('css/style.css', 'r', encoding='utf-8') as f:
        style_css = f.read()

    itinerary_selectors = [
        'body.ai-page #floatingChatContainer',
        '[data-theme="dark"] .grounded-badge-card',
        '[data-theme="dark"] .agent-summary-text',
        '[data-theme="dark"] .agent-source-footer',
        '[data-theme="dark"] .hotel-subtext',
        '[data-theme="dark"] .slot-tip',
        '[data-theme="dark"] .itinerary-cluster-subtext',
        '[data-theme="dark"] .emergency-tag',
        '[data-theme="dark"] .emergency-hosp-address',
        '[data-theme="dark"] .cat-name',
        '[data-theme="dark"] .cat-desc',
        '[data-theme="dark"] .cat-cost-val',
        '[data-theme="dark"] .cat-pct',
        '[data-theme="dark"] .budget-tips-box',
        '[data-theme="dark"] .budget-tips-title',
        '[data-theme="dark"] .budget-strategy-box',
        '[data-theme="dark"] .budget-cushion-box',
        '[data-theme="dark"] .flight-tradeoff-box',
        '[data-theme="dark"] .itinerary-safety-alert',
        '[data-theme="dark"] .day-notes-line',
        '.chat-native-page',
        '.ai-console-workspace'
    ]
    for sel in itinerary_selectors:
        if sel in ai_css:
            print(f"PASS: ai.css contains '{sel}'")
        else:
            print(f"FAIL: ai.css MISSING '{sel}'")

    cuisine_selectors = [
        '[data-theme="dark"] .superfood-calc-header p',
        '[data-theme="dark"] .superfood-btn .sf-name',
        '[data-theme="dark"] .superfood-btn .sf-origin',
        '[data-theme="dark"] .superfood-btn.selected .sf-name',
        '[data-theme="dark"] .cuisine-showcase-header p',
        '[data-theme="dark"] .cuisine-ingredient-card',
        '[data-theme="dark"] .cuisine-ingredient-info h5',
        '[data-theme="dark"] .cuisine-ingredient-info small',
        '[data-theme="dark"] #recipeModalCoop',
        '[data-theme="dark"] #recipeModalPair',
        '[data-theme="dark"] #recipeModalCarbon',
        '[data-theme="dark"] #recipeModalPrep',
        '[data-theme="dark"] #recipeModalNutrition',
        '[data-theme="dark"] .food-empty-state h3',
        '[data-theme="dark"] .food-empty-state p'
    ]
    for sel in cuisine_selectors:
        if sel in style_css:
            print(f"PASS: style.css contains '{sel}'")
        else:
            print(f"FAIL: style.css MISSING '{sel}'")

def test_html_structure():
    print("\n=== Testing HTML Elements ===")
    with open('html/ai.html', 'r', encoding='utf-8') as f:
        ai_html = f.read()
    
    assert 'class="ai-page"' in ai_html, "ai.html body must have ai-page class"
    assert 'ai-console-workspace' in ai_html, "ai.html must have ai-console-workspace"
    assert 'chat-native-page' in ai_html, "ai.html must have chat-native-page"
    assert 'id="chatWindow"' in ai_html, "ai.html must have #chatWindow"
    assert 'id="messages"' in ai_html, "ai.html must have #messages"
    assert 'id="chatInput"' in ai_html, "ai.html must have #chatInput"
    assert 'id="chatMicBtn"' in ai_html, "ai.html must have #chatMicBtn"
    assert 'id="stateChipsScroll"' in ai_html, "ai.html must have #stateChipsScroll"
    assert 'id="aiQuickStrip"' in ai_html, "ai.html must have #aiQuickStrip"
    print("PASS: html/ai.html structure verified!")

if __name__ == '__main__':
    test_syntax()
    test_api()
    test_css_rules()
    test_html_structure()
