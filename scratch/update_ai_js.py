# Update js/ai.js with dynamic origin, ai.html floating suppression, and native chat cards
import re

ai_js_path = r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism\js\ai.js"

with open(ai_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add origin detection right after AI_API_ORIGIN
origin_code = '''  const AI_API_ORIGIN = window.location.protocol.startsWith("http") ? "" : "http://127.0.0.1:8000";

  // Dynamic user origin location tracking (GPS / IP address)
  let detectedUserOrigin = null;

  async function getUserDetectedOrigin() {
    if (detectedUserOrigin) return detectedUserOrigin;
    const cached = sessionStorage.getItem("bharat_user_origin_city");
    if (cached && cached.trim()) {
      detectedUserOrigin = cached.trim();
      updateOriginBadges(detectedUserOrigin, "Saved");
      return detectedUserOrigin;
    }

    try {
      const res = await fetch(`${AI_API_ORIGIN}/api/geo/locate`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.city) {
          detectedUserOrigin = data.city;
          sessionStorage.setItem("bharat_user_origin_city", detectedUserOrigin);
          updateOriginBadges(detectedUserOrigin, data.source === "gps" ? "GPS" : "IP");
          return detectedUserOrigin;
        }
      }
    } catch (e) {
      console.warn("[Geo Locate Error]:", e);
    }

    detectedUserOrigin = "Kolkata";
    sessionStorage.setItem("bharat_user_origin_city", detectedUserOrigin);
    updateOriginBadges(detectedUserOrigin, "Default");
    return detectedUserOrigin;
  }

  function tryGpsOriginDetection() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await fetch(`${AI_API_ORIGIN}/api/geo/locate?lat=${lat}&lon=${lon}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.city) {
              detectedUserOrigin = data.city;
              sessionStorage.setItem("bharat_user_origin_city", detectedUserOrigin);
              updateOriginBadges(detectedUserOrigin, "GPS");
            }
          }
        } catch (err) {
          console.warn("[GPS reverse locate error]:", err);
        }
      },
      err => {},
      { timeout: 8000, maximumAge: 300000 }
    );
  }

  function updateOriginBadges(city, source) {
    const badges = document.querySelectorAll(".detected-origin-badge, #detectedOriginBadge");
    badges.forEach(b => {
      b.innerHTML = `<span class="origin-city-name">${city}</span> <span class="origin-source-tag">${source || "Auto"}</span>`;
    });
    const originInputs = document.querySelectorAll("#planOriginInput, .plan-origin-input");
    originInputs.forEach(inp => {
      if (!inp.value || inp.dataset.autoFilled === "true") {
        inp.value = city;
        inp.dataset.autoFilled = "true";
      }
    });
  }

  function setUserOriginCity(city) {
    if (!city || !city.trim()) return;
    detectedUserOrigin = city.trim();
    sessionStorage.setItem("bharat_user_origin_city", detectedUserOrigin);
    updateOriginBadges(detectedUserOrigin, "Manual");
  }

  window.getUserDetectedOrigin = getUserDetectedOrigin;
  window.setUserOriginCity = setUserOriginCity;
  window.tryGpsOriginDetection = tryGpsOriginDetection;'''

target1 = '  const AI_API_ORIGIN = window.location.protocol.startsWith("http") ? "" : "http://127.0.0.1:8000";'
if target1 in content:
    content = content.replace(target1, origin_code, 1)
    print("1. Injected origin detection helper")
else:
    print("WARNING: target1 not found")

# 2. Suppress floating chat on ai.html in initFloatingChat()
target2 = '  function initFloatingChat() {\n    let trigger = $("#floatingChatTrigger");'
replacement2 = '''  function initFloatingChat() {
    // Suppress on dedicated ai.html page which has its own native embedded chatbox console
    const isAiPage = window.location.pathname.endsWith("ai.html") || 
                     window.location.pathname.includes("/ai.html") || 
                     window.location.pathname.endsWith("/ai") ||
                     Boolean(document.getElementById("chatWindow") && document.getElementById("chatInput") && !document.getElementById("floatingChatWidget"));
    if (isAiPage) {
      return;
    }

    let trigger = $("#floatingChatTrigger");'''

if target2 in content:
    content = content.replace(target2, replacement2, 1)
    print("2. Suppressed floating chat on ai.html")
else:
    print("WARNING: target2 not found")

# 3. In itinerary(e), pass starting_city and origin
target3 = '        const res = await fetch(`${AI_API_ORIGIN}/api/agent/chat`, {\n          method: "POST",\n          headers: { "Content-Type": "application/json" },\n          body: JSON.stringify({ message: queryStr, session_id: agentSessionId, lang: lang })\n        });'
replacement3 = '''        const userOrigin = await getUserDetectedOrigin();
        const res = await fetch(`${AI_API_ORIGIN}/api/agent/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: queryStr,
            session_id: agentSessionId,
            lang: lang,
            starting_city: userOrigin
          })
        });'''

if target3 in content:
    content = content.replace(target3, replacement3, 1)
    print("3. Passed starting_city in itinerary()")
else:
    print("WARNING: target3 not found")

# 4. In askPlannerAI(q), pass starting_city
target4 = '''    try {
      const res = await fetch(`${AI_API_ORIGIN}/api/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q.trim(),
          session_id: agentSessionId,
          lang: lang
        })
      });'''

replacement4 = '''    try {
      const userOrigin = await getUserDetectedOrigin();
      const res = await fetch(`${AI_API_ORIGIN}/api/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q.trim(),
          session_id: agentSessionId,
          lang: lang,
          starting_city: userOrigin
        })
      });'''

if target4 in content:
    content = content.replace(target4, replacement4, 1)
    print("4. Passed starting_city in askPlannerAI()")
else:
    print("WARNING: target4 not found")

# 5. In askAI(q), handle planning intent with cards inside native in-page chat
target5 = '''    // 3. Mount bot message container synchronously with immediate typing placeholder & blinking cursor
    const botMsg = document.createElement("div");
    botMsg.className = "msg bot";

    const textSpan = document.createElement("span");
    textSpan.className = "bot-text";
    textSpan.textContent = placeholderText;
    textSpan.style.opacity = "0.7";

    const cursor = document.createElement("span");
    cursor.textContent = "▍";
    cursor.className = "typing-cursor";

    botMsg.appendChild(textSpan);
    botMsg.appendChild(cursor);
    box.appendChild(botMsg);
    box.scrollTop = box.scrollHeight;'''

replacement5 = '''    // 3. Mount bot message container synchronously with immediate typing placeholder & blinking cursor
    const botMsg = document.createElement("div");
    botMsg.className = "msg bot";

    const textSpan = document.createElement("span");
    textSpan.className = "bot-text";
    textSpan.textContent = placeholderText;
    textSpan.style.opacity = "0.7";

    const cursor = document.createElement("span");
    cursor.textContent = "▍";
    cursor.className = "typing-cursor";

    botMsg.appendChild(textSpan);
    botMsg.appendChild(cursor);
    box.appendChild(botMsg);
    box.scrollTop = box.scrollHeight;

    // Check if user is asking for trip planning / itinerary — if so, run through autonomous agent and render full rich cards!
    if (typeof detectPlanningIntent === "function" && detectPlanningIntent(q)) {
      if (orb) orb.className = "ai-orb thinking";
      if (statusText) statusText.textContent = "Formulating expedition plan...";
      textSpan.textContent = "🗺️ Formulating your personalized expedition plan across flights, certified stays, daily itineraries, and budget allocations...";

      try {
        const userOrigin = await getUserDetectedOrigin();
        const res = await fetch(`${AI_API_ORIGIN}/api/agent/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: q.trim(),
            session_id: agentSessionId,
            lang: lang,
            starting_city: userOrigin
          })
        });

        if (!res.ok) throw new Error(`Agent error: ${res.status}`);
        const data = await res.json();

        if (data.session_id) {
          agentSessionId = data.session_id;
          localStorage.setItem("bharat_agent_session_id", agentSessionId);
        }

        if (cursor && cursor.parentNode) cursor.remove();
        textSpan.style.opacity = "1";
        textSpan.innerHTML = renderMarkdown(data.message || "");

        // Render interactive cards inside this bot message
        if (data.plan) {
          let cardsHtml = "";
          if (data.plan.web_search_summary && typeof renderWebGroundedBadge === "function") {
            cardsHtml += renderWebGroundedBadge(data.plan);
          }
          if (data.plan.flights && typeof renderFlightCard === "function") {
            cardsHtml += renderFlightCard(data.plan.flights);
          }
          if (data.plan.hotels && typeof renderHotelCard === "function") {
            cardsHtml += renderHotelCard(data.plan.hotels);
          }
          if (data.plan.itinerary && typeof renderItineraryCard === "function") {
            cardsHtml += renderItineraryCard(data.plan.itinerary);
          }
          if (data.plan.budget && typeof renderBudgetCard === "function") {
            cardsHtml += renderBudgetCard(data.plan.budget);
          }
          if (data.plan.emergency && typeof renderEmergencyCard === "function") {
            cardsHtml += renderEmergencyCard(data.plan.emergency);
          }

          if (cardsHtml) {
            const cardsContainer = document.createElement("div");
            cardsContainer.className = "inbuilt-chat-cards-wrap";
            cardsContainer.innerHTML = cardsHtml;
            botMsg.appendChild(cardsContainer);
          }
        } else if (data.quick_presets && data.quick_presets.length > 0) {
          const presetsWrap = document.createElement("div");
          presetsWrap.className = "chat-quick-presets";
          presetsWrap.style.marginTop = "12px";
          presetsWrap.innerHTML = data.quick_presets.map(p => `
            <button type="button" class="chat-prompt-pill" onclick="window.askAI && askAI('Plan a ${p.days}-day trip with budget ₹${p.budget}')">
              ⚡ ${p.label}
            </button>
          `).join('');
          botMsg.appendChild(presetsWrap);
        }

        if (orb) orb.className = "ai-orb idle";
        if (statusText) statusText.textContent = activeText;
        if (submitBtn) submitBtn.disabled = false;
        if (chatInput) {
          chatInput.disabled = false;
          chatInput.focus();
        }
        box.scrollTop = box.scrollHeight;
        isGenerating = false;

        chatHistory.push({ role: "user", text: q });
        chatHistory.push({ role: "model", text: (data.message || "Plan generated.") });
        return;
      } catch (agentErr) {
        console.warn("[Agent Live Itinerary in chat failed, falling back to conversational stream]:", agentErr);
        // continue to standard streaming
      }
    }'''

if target5 in content:
    content = content.replace(target5, replacement5, 1)
    print("5. Upgraded askAI with agent card rendering")
else:
    print("WARNING: target5 not found")

# 6. Kick off origin detection on init
target6 = '    // Initialize Pan-India State & Territory Explorer\n    initPanIndiaExplorer();'
replacement6 = '''    // Initialize user origin location detection (GPS / IP)
    getUserDetectedOrigin();
    tryGpsOriginDetection();

    // Initialize Pan-India State & Territory Explorer
    initPanIndiaExplorer();'''

if target6 in content:
    content = content.replace(target6, replacement6, 1)
    print("6. Auto-detect origin on initialization")
else:
    print("WARNING: target6 not found")

with open(ai_js_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Updated js/ai.js")
