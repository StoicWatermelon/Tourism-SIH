import urllib.request
import re

def verify(url, needles):
    req = urllib.request.urlopen(url)
    assert req.status == 200, f"Status: {req.status}"
    content = req.read().decode("utf-8")
    for needle in needles:
        assert needle in content, f"Missing [{needle}] in {url}"
    print(f"[OK] {url} verified ({len(content)} bytes)")

# Test HTML endpoints
verify("http://127.0.0.1:8000/html/home.html", [
    'id="floatingChatTrigger"',
    'id="floatingChatWidget"',
    'id="floatingChatForm"',
    'id="floatingChatInput"',
    'id="floatingMessages"',
    'id="ai"',
    'id="chatForm"',
    'id="chatInput"',
    'id="messages"'
])

verify("http://127.0.0.1:8000/home.html", [
    'id="floatingChatTrigger"',
    'id="floatingChatWidget"',
    'id="floatingChatForm"',
    'id="floatingChatInput"',
    'id="floatingMessages"',
    'id="ai"',
    'id="chatForm"'
])

verify("http://127.0.0.1:8000/index.html", [
    'css/ai.css',
    'js/ai.js'
])

verify("http://127.0.0.1:8000/css/ai.css", [
    '.floating-chat-trigger',
    '.floating-chat-widget',
    '.floating-chat-widget.active'
])

verify("http://127.0.0.1:8000/js/ai.js", [
    'initFloatingChat',
    'askFloatingAI'
])

print("ALL PERSISTENT FLOATING CHATBOX CHECKS PASSED PERFECTLY!")
