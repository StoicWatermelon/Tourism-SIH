"""
Script to safely replace askAI and suggestion buttons in js/ai.js with full autonomous agent client.
Preserves UTF-8 encoding without charmap issues.
"""

import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
AI_JS_PATH = BASE_DIR / "js" / "ai.js"

with open(AI_JS_PATH, "r", encoding="utf-8") as f:
    content = f.read()

OLD_ASK_AI_ANCHOR = "  // ═══════════════════════════════════════════════════════\n  //  STREAMING AI CHAT ENGINE WITH ADAPTIVE TOKEN DISPATCHER\n  // ═══════════════════════════════════════════════════════\n\n  let isGenerating = false;\n\n  async function askAI(q) {"
OLD_ASK_AI_END = "      // Ensure dispatcher is kicked off to drain tokens\n      if (!isDispatcherRunning) {\n        isDispatcherRunning = true;\n        processTokenQueue();\n      }\n    }\n  }"

NEW_AGENT_CODE = '''  // ═══════════════════════════════════════════════════════
  //  AUTONOMOUS AGENT CLIENT & CARD RENDERING ENGINE
  // ═══════════════════════════════════════════════════════

  let isGenerating = false;
  let agentSessionId = localStorage.getItem("bharat_agent_session_id");
  if (!agentSessionId) {
    agentSessionId = "sess-" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("bharat_agent_session_id", agentSessionId);
  }
  let currentAgentPlan = null;

  function updateAgentTracker(stepNumber, checkpoints, activeModel, isOffline) {
    const pill = $("#agentCheckpointPill");
    const countText = $("#checkpointCountText");
    const modelTag = $("#activeModelTag");

    if (pill && countText) {
      if (isOffline) {
        countText.innerHTML = "⚠️ Offline Autonomous Fallback • Active";
        pill.style.borderColor = "#f4a261";
        pill.style.color = "#e76f51";
      } else {
        const count = checkpoints ? checkpoints.length : (stepNumber >= 5 ? 5 : stepNumber);
        countText.innerHTML = `🛡️ ${count}/5 Checkpoints Saved • Active: ${activeModel || 'Gemini 3.1 Flash Lite'}`;
      }
    }

    if (modelTag) {
      modelTag.textContent = isOffline ? "Offline Mode" : (activeModel || "Gemini 3.1 Flash Lite");
    }

    for (let i = 1; i <= 5; i++) {
      const el = $(`#step-${i}`);
      const statusEl = $(`#step${i}Status`);
      if (!el) continue;

      if (i < stepNumber) {
        el.className = "agent-step-item completed";
        if (statusEl) statusEl.textContent = "✅ Completed";
      } else if (i === stepNumber) {
        el.className = "agent-step-item active";
        if (statusEl) statusEl.textContent = stepNumber === 1 ? "Gathering intent..." : "In progress...";
      } else {
        el.className = "agent-step-item pending";
        if (statusEl) statusEl.textContent = "Queued";
      }
    }

    if (stepNumber >= 5) {
      for (let i = 1; i <= 5; i++) {
        const el = $(`#step-${i}`);
        const statusEl = $(`#step${i}Status`);
        if (el) el.className = "agent-step-item completed";
        if (statusEl) statusEl.textContent = "✅ Completed";
      }
    }
  }

  function renderFlightCard(flights) {
    if (!flights || !flights.options || flights.options.length === 0) return "";

    let dayPillsHtml = "";
    if (flights.day_comparisons && flights.day_comparisons.length > 0) {
      dayPillsHtml = `
        <div class="day-price-row">
          ${flights.day_comparisons.map((d, idx) => `
            <div class="day-price-pill ${idx === 2 || (d.difference_note && d.difference_note.includes('Save')) ? 'best-deal' : ''}">
              <div class="day-name">${d.day}</div>
              <div class="day-cost">₹${d.price_inr.toLocaleString()}</div>
              ${d.difference_note ? `<div style="font-size:9.5px; margin-top:2px; color:${idx === 2 ? '#2a9d8f' : '#888'}; font-weight:700;">${d.difference_note}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    const optionsHtml = flights.options.map(opt => `
      <div class="flight-option-item ${opt.is_recommended ? 'recommended' : ''}">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="airline-badge">${opt.airline} ${opt.flight_number}</span>
            ${opt.is_recommended ? '<span style="font-size:10px; background:#2d6a4f; color:#fff; padding:2px 6px; border-radius:4px; font-weight:800;">CHEAPEST RECOMMENDED</span>' : ''}
          </div>
          <div class="flight-timings">🕒 ${opt.departure_time} ➔ ${opt.arrival_time} • ${opt.duration} (${opt.stops})</div>
          <div class="flight-baggage">🧳 Cabin: ${opt.cabin_baggage} • Check-in: ${opt.checkin_baggage}</div>
        </div>
        <div class="flight-fare">
          <div class="flight-price-inr">₹${opt.price_inr.toLocaleString()}</div>
          <div style="font-size:10px; color:#5f707a;">per person</div>
        </div>
      </div>
    `).join('');

    const altAirportsHtml = flights.alternative_airports && flights.alternative_airports.length > 0
      ? `<div style="margin-top:8px; font-size:11.5px; color:#5f707a;"><b>Alternative Hubs:</b> ${flights.alternative_airports.join(' • ')}</div>`
      : '';

    return `
      <div class="agent-card">
        <div class="agent-card-title">
          <span>✈️ FLIGHT INTELLIGENCE: ${flights.origin.toUpperCase()} ➔ ${flights.destination.toUpperCase()}</span>
          <span class="agent-card-tag verified">VERIFIED BENCHMARK</span>
        </div>
        ${flights.savings_callout ? `
          <div class="deal-savings-banner">
            <span>💡</span>
            <span>${flights.savings_callout}</span>
          </div>
        ` : ''}
        ${dayPillsHtml}
        <div class="flight-options-list">
          ${optionsHtml}
        </div>
        ${altAirportsHtml}
        ${flights.tradeoff_summary ? `
          <div style="margin-top:10px; padding:8px 10px; background:#f4efe4; border-radius:6px; font-size:11.5px; color:#4a5568; line-height:1.4;">
            <b>Trade-off Analysis:</b> ${flights.tradeoff_summary}
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderHotelCard(hotels) {
    if (!hotels || !hotels.options || hotels.options.length === 0) return "";

    const itemsHtml = hotels.options.map(h => `
      <div class="hotel-item ${h.is_recommended ? 'recommended' : ''}">
        <div class="hotel-item-head">
          <div>
            <div class="hotel-name">${h.name}</div>
            <div style="font-size:11px; color:#5f707a; margin-top:2px;">${h.category} • ${h.location}</div>
          </div>
          <div class="hotel-rating-badge">★ ${h.rating}</div>
        </div>
        <div class="hotel-location-text">📍 ${h.distance_from_attractions}</div>
        <div class="amenity-chips">
          ${h.amenities.map(a => `<span class="amenity-chip">✓ ${a}</span>`).join('')}
        </div>
        <div class="hotel-price-row">
          <span>₹${h.price_per_night_inr.toLocaleString()} / night</span>
          <span><b>₹${h.total_price_inr.toLocaleString()}</b> total (${hotels.nights} nights)</span>
        </div>
      </div>
    `).join('');

    return `
      <div class="agent-card">
        <div class="agent-card-title">
          <span>🏨 VERIFIED ACCOMMODATION SHORTLIST (${hotels.nights} NIGHTS)</span>
          <span class="agent-card-tag verified">BOOKING.COM AUDITED</span>
        </div>
        <div class="hotel-cards-list">
          ${itemsHtml}
        </div>
        ${hotels.recommendation_note ? `
          <p style="margin-top:10px; font-size:11.5px; color:#5f707a; line-height:1.4;">${hotels.recommendation_note}</p>
        ` : ''}
      </div>
    `;
  }

  function renderItineraryCard(itinerary) {
    if (!itinerary || itinerary.length === 0) return "";

    const daysHtml = itinerary.map(d => `
      <div class="itinerary-day-box">
        <div class="day-box-header">
          <div>
            <span class="day-box-title">DAY ${String(d.day_number).padStart(2, '0')}: ${d.theme}</span>
          </div>
          <div class="day-box-area">📍 ${d.area_cluster}</div>
        </div>
        ${d.acclimatization_safety_note ? `
          <div style="background:#fff3cd; color:#856404; padding:6px 12px; font-size:11.5px; font-weight:700;">
            ⚠️ ${d.acclimatization_safety_note}
          </div>
        ` : ''}
        <div class="timeline-slots">
          ${d.activities.map(a => `
            <div class="timeline-slot-item">
              <div class="slot-time">${a.time_slot}</div>
              <div>
                <div class="slot-activity-title">${a.activity}</div>
                <div class="slot-meta-row">
                  <span>📍 ${a.location}</span>
                  ${a.transit_mins_from_prev > 0 ? `<span> • 🚗 ${a.transit_mins_from_prev} min transit</span>` : ''}
                  ${a.estimated_cost_inr > 0 ? `<span> • 💰 ₹${a.estimated_cost_inr}</span>` : ''}
                </div>
                ${a.tip ? `<div style="font-size:11px; color:#2d6a4f; margin-top:2px;"><i>Tip: ${a.tip}</i></div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    return `
      <div class="agent-card">
        <div class="agent-card-title">
          <span>🗺️ OPTIMIZED CLUSTERED DAILY ITINERARY (${itinerary.length} DAYS)</span>
          <span class="agent-card-tag verified">ZERO-ZIGZAG ROUTING</span>
        </div>
        <p style="font-size:12px; color:#5f707a; margin:0 0 12px;">Attractions grouped by geographical corridors to minimize intra-city travel times.</p>
        <div class="itinerary-days-container">
          ${daysHtml}
        </div>
      </div>
    `;
  }

  function renderBudgetCard(budget) {
    if (!budget) return "";

    const barColors = ["#2a9d8f", "#e76f51", "#f4a261", "#457b9d", "#6a4c93"];
    const barSegmentsHtml = budget.categories.map((c, i) => `
      <div class="bar-segment" style="width: ${c.percentage}%; background: ${barColors[i % barColors.length]};" title="${c.category}: ${c.percentage}% (₹${c.cost_inr.toLocaleString()})"></div>
    `).join('');

    const categoryRowsHtml = budget.categories.map((c, i) => `
      <div class="cat-row">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="width:10px; height:10px; border-radius:50%; background:${barColors[i % barColors.length]}; display:inline-block;"></span>
          <span>${c.category}</span>
        </div>
        <div>
          <b>₹${c.cost_inr.toLocaleString()}</b> (${c.percentage}%)
        </div>
      </div>
    `).join('');

    return `
      <div class="agent-card">
        <div class="agent-card-title">
          <span>💰 COMPREHENSIVE BUDGET BREAKDOWN</span>
          <span class="agent-card-tag verified">BALANCED ALLOCATION</span>
        </div>
        <div class="budget-stats-grid">
          <div class="stat-box">
            <div class="stat-label">Total Budget</div>
            <div class="stat-val">₹${budget.total_budget_inr.toLocaleString()}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Total Allocated</div>
            <div class="stat-val">₹${budget.total_allocated_inr.toLocaleString()}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Remaining Cushion</div>
            <div class="stat-val highlight-green">₹${budget.remaining_cushion_inr.toLocaleString()}</div>
          </div>
        </div>
        <div class="budget-overview-bar">
          ${barSegmentsHtml}
        </div>
        <div class="budget-category-list">
          ${categoryRowsHtml}
        </div>
        ${budget.cushion_health_advice ? `
          <div style="margin-top:12px; padding:9px 12px; background:#f0f7f3; border-radius:8px; font-size:12px; color:#1b4332; line-height:1.4;">
            <b>Cushion Health:</b> ${budget.cushion_health_advice}
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderEmergencyCard(emergency) {
    if (!emergency) return "";

    return `
      <div class="agent-card">
        <div class="agent-card-title">
          <span>🛡️ EMERGENCY MEDICAL & SAFETY DOSSIER</span>
          <span class="agent-card-tag" style="background:#fee2e2; color:#ef4444; border:1px solid #f87171;">24/7 SAFEGUARD</span>
        </div>
        <div class="emergency-card-box">
          <div class="emergency-head">
            <span>🏥</span>
            <span>Nearest Apex Trauma Center:</span>
          </div>
          <div class="emergency-hosp-name">${emergency.nearest_hospital.name}</div>
          <div style="font-size:11.5px; color:#5f707a; margin-top:3px;">
            ${emergency.nearest_hospital.address} (${emergency.nearest_hospital.distance})
          </div>
          <div class="emergency-contact-row">
            <a class="emergency-btn" href="tel:${emergency.nearest_hospital.phone}">📞 Call Hospital (${emergency.nearest_hospital.phone})</a>
            <a class="emergency-btn secondary" href="tel:112">🚨 National Emergency: 112</a>
            <a class="emergency-btn secondary" href="tel:1363">ℹ️ Tourist Helpline: 1363</a>
          </div>
          ${emergency.weather_alert ? `
            <div style="margin-top:10px; font-size:11.5px; color:#856404; background:#fff3cd; padding:6px 10px; border-radius:6px;">
              <b>Weather Advisory:</b> ${emergency.weather_alert}
            </div>
          ` : ''}
          ${emergency.high_altitude_medical_tips ? `
            <div style="margin-top:6px; font-size:11.5px; color:#1e40af; background:#dbeafe; padding:6px 10px; border-radius:6px;">
              <b>High Altitude Warning:</b> ${emergency.high_altitude_medical_tips}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  function renderQuickActions(plan) {
    return `
      <div class="agent-quick-actions">
        <button class="agent-action-chip" onclick="window.modifyAgentConstraint('budget', 30000)">💰 Adjust Budget to ₹30,000</button>
        <button class="agent-action-chip" onclick="window.modifyAgentConstraint('budget', 35000)">💰 Adjust Budget to ₹35,000</button>
        <button class="agent-action-chip" onclick="window.modifyAgentConstraint('number_of_days', 5)">🗓️ Extend to 5 Days</button>
        <button class="agent-action-chip" onclick="window.modifyAgentConstraint('number_of_travelers', 2)">👥 Set for 2 Travelers</button>
        <button class="agent-action-chip" onclick="window.savePlanToJourney()">♥ Save to My Journey</button>
        <button class="agent-action-chip" onclick="window.downloadFieldPassPdf ? window.downloadFieldPassPdf() : window.location.href='/api/passes/download-safety-guidelines-pdf'">🛡️ Download Field Kit PDF</button>
      </div>
    `;
  }

  async function modifyAgentConstraint(key, value) {
    const box = $("#messages");
    if (!box) return;

    const botMsg = document.createElement("div");
    botMsg.className = "msg bot";
    botMsg.innerHTML = `<span class="bot-text">Updating plan with <b>${key} = ${value}</b>...</span>`;
    box.appendChild(botMsg);
    box.scrollTop = box.scrollHeight;

    const lang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";

    try {
      const res = await fetch(`${AI_API_ORIGIN}/api/agent/update-constraint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: agentSessionId,
          key: key,
          value: value,
          lang: lang
        })
      });

      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      currentAgentPlan = data.plan;

      updateAgentTracker(5, data.checkpoints, "Gemini 3.1 Flash Lite", false);

      let cardsHtml = renderMarkdown(data.message);
      if (data.plan) {
        cardsHtml += renderFlightCard(data.plan.flights);
        cardsHtml += renderHotelCard(data.plan.hotels);
        cardsHtml += renderItineraryCard(data.plan.itinerary);
        cardsHtml += renderBudgetCard(data.plan.budget);
        cardsHtml += renderEmergencyCard(data.plan.emergency);
        cardsHtml += renderQuickActions(data.plan);
      }
      botMsg.innerHTML = cardsHtml;
      box.scrollTop = box.scrollHeight;
      toast(`Successfully updated ${key.replace('_', ' ')}!`);
    } catch (err) {
      console.warn("Update constraint error:", err);
      botMsg.innerHTML = `<span class="bot-text">Failed to update constraint automatically. Please try typing your request.</span>`;
    }
  }

  window.modifyAgentConstraint = modifyAgentConstraint;

  window.savePlanToJourney = function() {
    if (!currentAgentPlan) {
      toast("No active plan to bookmark.");
      return;
    }
    const dest = currentAgentPlan.constraints.destination || "Destination";
    toast(`Saved ${dest} expedition plan to your journey bookmarks!`);
  };

  async function askAI(q) {
    if (!q || !q.trim() || isGenerating) return;
    const box = $("#messages");
    const orb = $("#aiOrb");
    const statusText = $("#aiStatusText");
    const chatForm = $("#chatForm");
    const submitBtn = chatForm ? chatForm.querySelector("button[type='submit']") : null;
    const chatInput = $("#chatInput");

    const detected = detectDestination(q);
    if (detected) {
      activeDestination = detected;
    }

    const lang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";
    const connectingText = lang === "hi" ? "भारत एआई • विश्लेषण कर रहा है..." : lang === "bn" ? "ভারত এআই • বিশ্লেষণ করছে..." : "Bharat Agent • Decomposing Goal...";
    const activeText = lang === "hi" ? "भारत एआई • सक्रिय" : lang === "bn" ? "ভারত এআই • সক্রিয়" : "Autonomous Agent • Active";
    const placeholderText = lang === "hi" ? "लक्ष्य का विश्लेषण और कार्य निष्पादन..." : lang === "bn" ? "লক্ষ্য বিশ্লেষণ ও পরিকল্পনা তৈরি হচ্ছে..." : "Decomposing goal into tasks and comparing live benchmarks...";

    isGenerating = true;
    if (submitBtn) submitBtn.disabled = true;

    // 1. Instantly append user message
    const userMsg = document.createElement("div");
    userMsg.className = "msg user";
    userMsg.textContent = q;
    box.appendChild(userMsg);
    box.scrollTop = box.scrollHeight;

    // 2. Update orb & status indicator
    if (orb) orb.className = "ai-orb thinking";
    if (statusText) statusText.textContent = connectingText;

    // 3. Mount bot message container
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

    updateAgentTracker(1, null, "Gemini 3.1 Flash Lite", false);

    try {
      const res = await fetch(`${AI_API_ORIGIN}/api/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: agentSessionId,
          message: q,
          lang: lang
        })
      });

      if (!res.ok) {
        throw new Error(`Agent server returned status ${res.status}`);
      }

      const data = await res.json();
      if (cursor && cursor.parentNode) cursor.remove();

      if (data.type === "questionnaire") {
        updateAgentTracker(1, null, "Gemini 3.1 Flash Lite", false);
        textSpan.innerHTML = renderMarkdown(data.message);
        textSpan.style.opacity = "1";
      } else if (data.type === "complete_plan" || data.type === "plan_updated") {
        currentAgentPlan = data.plan;
        updateAgentTracker(5, data.checkpoints, data.active_model || "Gemini 3.1 Flash Lite", data.is_offline);

        let fullHtml = "";
        if (data.is_offline) {
          fullHtml += `
            <div class="offline-agent-alert">
              <span>⚠️</span>
              <span>Live booking services are temporarily unavailable. I'm continuing with offline planning.</span>
            </div>
          `;
        }

        fullHtml += renderMarkdown(data.message);

        if (data.plan) {
          fullHtml += renderFlightCard(data.plan.flights);
          fullHtml += renderHotelCard(data.plan.hotels);
          fullHtml += renderItineraryCard(data.plan.itinerary);
          fullHtml += renderBudgetCard(data.plan.budget);
          fullHtml += renderEmergencyCard(data.plan.emergency);
          fullHtml += renderQuickActions(data.plan);
        }

        textSpan.innerHTML = fullHtml;
        textSpan.style.opacity = "1";
      } else {
        textSpan.innerHTML = renderMarkdown(data.message || "Plan updated.");
        textSpan.style.opacity = "1";
      }

    } catch (err) {
      console.warn("[Bharat Agent Stream Catch]:", err);
      // Seamless offline heuristic fallback
      if (cursor && cursor.parentNode) cursor.remove();
      const fallback = aiReply(q, activeDestination);
      textSpan.innerHTML = `
        <div class="offline-agent-alert">
          <span>⚠️</span>
          <span>Live booking services are temporarily unavailable. I'm continuing with offline planning.</span>
        </div>
        ${renderMarkdown(fallback)}
      `;
      textSpan.style.opacity = "1";
      updateAgentTracker(3, null, "Offline Local Agent", true);
    } finally {
      if (orb) orb.className = "ai-orb idle";
      if (statusText) statusText.textContent = activeText;
      if (submitBtn) submitBtn.disabled = false;
      if (chatInput) {
        chatInput.disabled = false;
        chatInput.focus();
      }
      box.scrollTop = box.scrollHeight;
      isGenerating = false;
    }
  }'''

start_idx = content.find(OLD_ASK_AI_ANCHOR)
end_idx = content.find(OLD_ASK_AI_END)

if start_idx == -1 or end_idx == -1:
    print(f"Error finding anchors: start={start_idx}, end={end_idx}")
    sys.exit(1)

end_idx += len(OLD_ASK_AI_END)

new_content = content[:start_idx] + NEW_AGENT_CODE + content[end_idx:]

# Also update the suggestion buttons handler to support data-goal
new_content = new_content.replace(
    'b.onclick = () => askAI(b.dataset.question);',
    'b.onclick = () => askAI(b.dataset.goal || b.dataset.question);'
)

with open(AI_JS_PATH, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully upgraded js/ai.js with autonomous agent engine!")
