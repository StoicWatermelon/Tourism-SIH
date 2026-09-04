/**
 * Bharat Explore — AI Assistant & Smart Itinerary Engine
 * Smart India Hackathon (SIH 2026) Official Platform
 * Modular client architecture for streaming AI guidance & pass-audited itinerary planning
 */

(function () {
  'use strict';

  // Shared DOM helpers with fallback
  const $ = window.$ || (s => document.querySelector(s));
  const $$ = window.$$ || (s => [...document.querySelectorAll(s)]);
  const toast = (...args) => (window.toast ? window.toast(...args) : console.log(...args));
  const updateResponsibleScore = (...args) => (window.updateResponsibleScore ? window.updateResponsibleScore(...args) : null);

// ═══════════════════════════════════════════════════════
//  MARKDOWN RENDERER FOR AI CHAT
// ═══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
//  MARKDOWN RENDERER FOR AI CHAT
// ═══════════════════════════════════════════════════════

/**
 * Enhanced markdown renderer for AI responses
 * Supports headings (###, ##), bold, italics, bullets, numbered lists, and paragraphs
 */
function renderMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^###\s+(.+)$/gm, '<h4 class="ai-heading">$1</h4>');
  html = html.replace(/^##\s+(.+)$/gm, '<h3 class="ai-heading">$1</h3>');

  // Bold & Italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');

  // Bullet list items (•, -, *)
  html = html.replace(/^[•\-\*]\s+(.+)$/gm, '<div class="ai-list-item"><span class="ai-bullet">•</span> $1</div>');

  // Numbered list items (1., 2., etc.)
  html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<div class="ai-list-item"><span class="ai-num">$1.</span> $2</div>');

  // Paragraph breaks & newlines
  html = html.replace(/\n\n+/g, '</p><p class="ai-para">');
  html = html.replace(/\n/g, '<br>');

  return '<p class="ai-para">' + html + '</p>';
}

// ═══════════════════════════════════════════════════════
//  RULE-BASED AI FALLBACK ENGINE (OFFLINE RESILIENCE)
// ═══════════════════════════════════════════════════════

const aiReply = q => {
  const lang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";
  const s = (q || "").toLowerCase();

  if (lang === "hi") {
    if (s.includes("भीड़") || s.includes("decongest") || s.includes("ऑफबीट") || s.includes("तुरतुक") || s.includes("हानले") || s.includes("लाभ")) {
      return "**स्मार्ट भीड़-नियंत्रण रणनीति:**\n\nतुरतुक, हानले और शाम घाटी जैसे माध्यमिक गलियारों का दौरा करने से पैंगोंग झील और लेह जैसे अत्यधिक भीड़भाड़ वाले हॉटस्पॉट्स पर दबाव काफी कम होता है। इससे वाहन प्रदूषण घटता है, हिमनदों के जल स्रोतों की रक्षा होती है और 80%+ पर्यटन आय सीधे दूरदराज के लद्दाखी परिवारों तक पहुंचती है।";
    }
    if (s.includes("सामान") || s.includes("पैक") || s.includes("pack") || s.includes("gear")) {
      return "**उच्च हिमालयी दर्रों के लिए आवश्यक पैकिंग सूची:**\n\n• **थर्मल बेस लेयर्स:** मेरिनो वूल के कम से कम 2 सेट।\n• **विंडप्रूफ जैकेट:** 600-फिल डाउन जैकेट और वाटरप्रूफ विंडचीटर।\n• **धूप का चश्मा:** UV-400 पोलराइज्ड ग्लेशियर ग्लासेस (17,000 फीट पर तीव्र पराबैंगनी किरणों से बचाव हेतु आवश्यक)।\n• **पुनः प्रयोज्य फ्लास्क:** इंसुलेटेड गर्म पानी की बोतल (एकल-उपयोग प्लास्टिक लद्दाख में पूर्णतः प्रतिबंधित है)।\n• **सनस्क्रीन:** SPF 50+ सनस्क्रीन और लिप बाम।\n• **दवाइयां:** डायमॉक्स (AMS रोकथाम हेतु चिकित्सक से परामर्श लें), ORS इलेक्ट्रोलाइट्स और पल्स ऑक्सीमीटर।";
    }
    if (s.includes("अनुकूलन") || s.includes("acclimat") || s.includes("ams") || s.includes("ऊंचाई") || s.includes("नियम")) {
      return "**अनिवार्य ऊंचाई सुरक्षा (48-घंटे AMS अनुकूलन नियम):**\n\nलेह 11,500 फीट की ऊंचाई पर स्थित है। खारदुंग ला (17,582 फीट) या पैंगोंग त्सो जाने से पहले लेह में पहले 48 घंटे पूर्ण शारीरिक विश्राम अनिवार्य है। प्रतिदिन 4-5 लीटर पानी पिएं, शराब व नींद की गोलियों से बचें और नियमित रूप से SpO2 ऑक्सीजन स्तर जांचें। यदि सिरदर्द या चक्कर बढ़े, तो तुरंत कम ऊंचाई पर जाएं।";
    }
    if (s.includes("दर्र") || s.includes("pass") || s.includes("खारदुंग") || s.includes("चांग") || s.includes("सड़क")) {
      return "**पर्वतीय दर्रा लाइव सुरक्षा परामर्श:**\n\nखारदुंग ला और चांग ला पर लगातार निगरानी रखी जा रही है। दर्रों को पार करने की अनुमति सुबह 06:00 से शाम 16:00 बजे के बीच ही है। सुबह प्रस्थान करने से पहले उत्तरी ढलानों पर ब्लैक आइस (काली बर्फ) की जांच करें। 4x4 स्नो चेन वाहन अनिवार्य हैं।";
    }
    return "Julley & Namaste! 🙏 I am Bharat AI, your intelligent companion for high-altitude Himalayan and Indian travel. I can help you with real-time pass telemetry, altitude acclimatization pacing, offbeat decongestion corridors, and certified Ladakh village homestays. Ask me anything!";
  }

  if (lang === "bn") {
    if (s.includes("ভিড়") || s.includes("decongest") || s.includes("অফবিট") || s.includes("তুরতুক") || s.includes("হানলে") || s.includes("সুবিধা")) {
      return "**স্মার্ট ভিড়-নিয়ন্ত্রণ কৌশল:**\n\nতুরতুক, হানলে এবং শাম উপত্যকার মতো বিকল্প করিডোর পরিদর্শনে প্যাংগং লেক ও লেহ শহরের ভিড় কমে। এর ফলে দূষণ হ্রাস পায়, ভূগর্ভস্থ জলস্তর সংরক্ষিত থাকে এবং পর্যটন ব্যয়ের ৮০%+ অর্থ সরাসরি স্থানীয় গ্রামীণ পরিবারের কাছে পৌঁছায়।";
    }
    if (s.includes("প্যাক") || s.includes("জিনিস") || s.includes("pack") || s.includes("gear")) {
      return "**উচ্চ হিমালয় গিরিপথের প্রয়োজনীয় প্যাকিং তালিকা:**\n\n• **থার্মাল বেস লেয়ার:** মেরিনো উলের অন্তত ২ সেট।\n• **উইন্ডপ্রুফ জ্যাকেট:** ডাউন ফেদার জ্যাকেট ও উইন্ডচিটার।\n• **রোদচশমা:** UV-400 পোলারাইজড গ্লেসিয়ার চশমা (উচ্চতায় প্রখর অতিবেগুনি রশ্মি থেকে বাঁচার জন্য)।\n• **থার্মো ফ্লাস্ক:** পুনরায় ব্যবহারযোগ্য ইনসুলেটেড জলের বোতল (একক ব্যবহার্য প্লাস্টিক লাদাখে নিষিদ্ধ)।\n• **সানস্ক্রিন:** SPF 50+ সানস্ক্রিন এবং ময়েশ্চারাইজার।\n• **ওষুধ:** ডায়ামক্স (AMS সুরক্ষার জন্য চিকিৎসকের পরামর্শ নিন), ওআরএস ও পালস অক্সিমিটার।";
    }
    if (s.includes("অভিযোজন") || s.includes("acclimat") || s.includes("ams") || s.includes("উচ্চতা") || s.includes("নিয়ম")) {
      return "**বাধ্যতামূলক উচ্চতা সুরক্ষা ও অভিযোজন নির্দেশিকা:**\n\nলেহ শহর ১১,৫০০ ফুট উচ্চতায় অবস্থিত। খারদুং লা (১৭,৫৮২ ফুট) বা প্যাংগং লেকে যাওয়ার আগে লেহ শহরে প্রথম ৪৮ ঘণ্টার সম্পূর্ণ বিশ্রাম বাধ্যতামূলক। প্রতিদিন ৪-৫ লিটার জল পান করুন, অতিরিক্ত শারীরিক পরিশ্রম এড়িয়ে চলুন এবং রক্তে অক্সিজেনের মাত্রা (SpO2) পরীক্ষা করুন। লক্ষণ বাড়লে অবিলম্বে নিচে নেমে আসুন।";
    }
    if (s.includes("গিরিপথ") || s.includes("pass") || s.includes("খারদুং") || s.includes("চাং") || s.includes("রাস্তা")) {
      return "**পাহাড়ি গিরিপথ লাইভ সতর্কতা:**\n\nখারদুং লা এবং চাং লা গিরিপথে সার্বক্ষণিক নজরদারি চলছে। সকাল ০৬:০০ থেকে বিকাল ১৬:০০ এর মধ্যে গিরিপথ অতিক্রমের অনুমতি দেওয়া হয়। সকালে রওনা হওয়ার আগে রাস্তায় পিচ্ছিল বরফ (ব্ল্যাক আইস) আছে কিনা তা দেখে নিন। 4x4 স্নো চেইন গাড়ি ব্যবহার বাধ্যতামূলক।";
    }
    return "Julley & Namaste! 🙏 I am Bharat AI, your intelligent companion for high-altitude Himalayan and Indian travel. I can help you with real-time pass telemetry, altitude acclimatization pacing, offbeat decongestion corridors, and certified Ladakh village homestays. Ask me anything!";
  }

  // English fallback
  if (s.includes("decongest") || s.includes("offbeat") || s.includes("turtuk") || s.includes("hanle")) {
    return "Smart Decongestion Strategy: Visiting secondary corridors like Turtuk, Hanle, and Sham Valley diverts tourist footprint away from saturated hotspots like Pangong Lake. This reduces vehicle emissions, relieves alpine water tables, and redistributes 80%+ of tourism revenue directly to remote village families.";
  }
  if (s.includes("pack") || s.includes("gear")) {
    return "High-Pass Himalayan Packing: 1) Thermal base layers (merino wool), 2) Down jacket & windproof shell, 3) Polarized UV-400 sunglasses, 4) Reusable insulated hydration flask (no single-use plastic), 5) High-SPF sunscreen & lip balm, 6) Diamox (consult physician for AMS).";
  }
  if (s.includes("acclimat") || s.includes("ams") || s.includes("altitude")) {
    return "Mandatory Altitude Safety: Leh is situated at 11,500 ft. You MUST allocate 48 hours in Leh for complete rest before ascending Khardung La (17,582 ft) or Pangong Tso. Hydrate with 4+ liters of water daily, avoid alcohol, and carry a pulse oximeter.";
  }
  if (s.includes("pass") || s.includes("khardung") || s.includes("road")) {
    return "Mountain Pass Advisory: Khardung La and Chang La are currently under active monitoring. Pass crossings are permitted between 06:00 and 16:00. Check for black ice on northern descents before early morning departures.";
  }
  return "Julley & Namaste! 🙏 I am Bharat AI, your intelligent companion for high-altitude Himalayan and Indian travel. I can help you with real-time pass telemetry, altitude acclimatization pacing, offbeat decongestion corridors, and certified Ladakh village homestays. Ask me anything!";
};

// ═══════════════════════════════════════════════════════
//  STREAMING AI CHAT ENGINE WITH ADAPTIVE TOKEN DISPATCHER
// ═══════════════════════════════════════════════════════

let isGenerating = false;

async function askAI(q) {
  if (!q || !q.trim() || isGenerating) return;
  const box = $("#messages");
  const orb = $("#aiOrb");
  const statusText = $("#aiStatusText");
  const chatForm = $("#chatForm");
  const submitBtn = chatForm ? chatForm.querySelector("button[type='submit']") : null;
  const chatInput = $("#chatInput");

  const lang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";
  const connectingText = lang === "hi" ? "हिमालयी बुद्धिमत्ता • कनेक्ट हो रहा है..." : lang === "bn" ? "হিমালয় বুদ্ধিমত্তা • সংযুক্ত হচ্ছে..." : "Himalayan Intelligence • Connecting...";
  const streamingText = lang === "hi" ? "हिमालयी बुद्धिमत्ता • उत्तर आ रहा है..." : lang === "bn" ? "হিমালয় বুদ্ধিমত্তা • উত্তর লেখা হচ্ছে..." : "Himalayan Intelligence • Streaming...";
  const activeText = lang === "hi" ? "हिमालयी बुद्धिमत्ता • सक्रिय" : lang === "bn" ? "হিমালয় বুদ্ধিমত্তা • सक्रिय" : "Himalayan Intelligence • Active";
  const placeholderText = lang === "hi" ? "हिमालयी बुद्धिमत्ता से संपर्क किया जा रहा है..." : lang === "bn" ? "হিমালয় বুদ্ধিমত্তার সাথে যোগাযোগ করা হচ্ছে..." : "Connecting to Himalayan Intelligence...";

  isGenerating = true;

  // Safeguard: Disable submit button to prevent parallel conflicting requests
  if (submitBtn) submitBtn.disabled = true;

  // 1. Instantly append user message synchronously (<10ms)
  const userMsg = document.createElement("div");
  userMsg.className = "msg user";
  userMsg.textContent = q;
  box.appendChild(userMsg);
  box.scrollTop = box.scrollHeight;

  // 2. Instantly update orb & status indicator
  if (orb) orb.className = "ai-orb thinking";
  if (statusText) statusText.textContent = connectingText;

  // 3. Mount bot message container synchronously with immediate typing placeholder & blinking cursor
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

  // 4. Token Queue & Typewriter Dispatcher State
  const tokenQueue = [];
  let displayedText = "";
  let isStreamFinished = false;
  let isDispatcherRunning = false;
  let isFirstToken = true;

  // Dynamic Activity Watchdog (resets on incoming chunks)
  const controller = new AbortController();
  let watchdogTimer = null;
  const resetWatchdog = (ms = 30000) => {
    if (watchdogTimer) clearTimeout(watchdogTimer);
    watchdogTimer = setTimeout(() => {
      console.warn("[Bharat AI] Activity watchdog timeout (30s inactivity). Aborting connection.");
      controller.abort();
    }, ms);
  };
  resetWatchdog(30000);

  // Finalize UI once stream is done AND all tokens have rendered
  function finalizeUI() {
    if (watchdogTimer) clearTimeout(watchdogTimer);
    if (cursor && cursor.parentNode) cursor.remove();
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

  // Token Typewriter Dispatcher loop
  function processTokenQueue() {
    if (tokenQueue.length > 0) {
      if (isFirstToken) {
        textSpan.textContent = "";
        textSpan.style.opacity = "1";
        isFirstToken = false;
      }

      // Adaptive cadence: if queue builds up from network burst, drain faster
      let tokensToDrain = 1;
      let delayMs = 18; // Default natural LLM cadence

      if (tokenQueue.length > 35) {
        tokensToDrain = 3;
        delayMs = 6;
      } else if (tokenQueue.length > 18) {
        tokensToDrain = 2;
        delayMs = 10;
      } else if (tokenQueue.length > 8) {
        tokensToDrain = 1;
        delayMs = 14;
      }

      for (let i = 0; i < tokensToDrain && tokenQueue.length > 0; i++) {
        displayedText += tokenQueue.shift();
      }

      textSpan.innerHTML = renderMarkdown(displayedText.trimStart());
      box.scrollTop = box.scrollHeight;

      setTimeout(processTokenQueue, delayMs);
    } else if (!isStreamFinished) {
      // Stream still active over network, waiting for next packet
      setTimeout(processTokenQueue, 25);
    } else {
      // Both stream finished and token queue completely drained!
      isDispatcherRunning = false;
      textSpan.innerHTML = renderMarkdown(displayedText.trimStart());
      finalizeUI();
    }
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q, lang: lang }),
      signal: controller.signal
    });

    if (!res.ok) throw new Error("Status " + res.status);

    if (orb) orb.className = "ai-orb streaming";
    if (statusText) statusText.textContent = streamingText;

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      resetWatchdog(30000);

      const chunk = decoder.decode(value, { stream: true });
      if (!chunk) continue;

      // Tokenize chunk into words and whitespace
      const tokens = chunk.match(/\S+|\s+/g);
      if (tokens && tokens.length > 0) {
        tokenQueue.push(...tokens);
        if (!isDispatcherRunning) {
          isDispatcherRunning = true;
          processTokenQueue();
        }
      }
    }

    isStreamFinished = true;
  } catch (err) {
    console.warn("[Bharat AI Stream Catch]:", err);
    isStreamFinished = true;
  } finally {
    // If no tokens were ever enqueued (offline or instant error), load fallback reply
    if (displayedText.trim().length === 0 && tokenQueue.length === 0) {
      const fallback = aiReply(q);
      const tokens = fallback.match(/\S+|\s+/g) || [fallback];
      tokenQueue.push(...tokens);
    }

    // Ensure dispatcher is kicked off to drain tokens
    if (!isDispatcherRunning) {
      isDispatcherRunning = true;
      processTokenQueue();
    }
  }
}

// ═══════════════════════════════════════════════════════
//  SMART SAFETY-AUDITED ITINERARY PLANNER
// ═══════════════════════════════════════════════════════

  let lastItineraryParams = null;

  async function itinerary(e) {
    if (e && e.preventDefault) e.preventDefault();
    
    const dest = ($("#planDestination") && $("#planDestination").value) || "Ladakh";
    const days = Math.min(14, Math.max(1, +($("#planDays") && $("#planDays").value) || 5));
    const budget = +($("#planBudget") && $("#planBudget").value) || 32000;
    const style = ($("#planStyle") && $("#planStyle").value) || "Adventure";
    const interest = ($("#planInterest") && $("#planInterest").value) || "High Mountain Passes";
    const ecoHomestays = $("#planEcoHomestays") ? $("#planEcoHomestays").checked : true;
    const publicTransit = $("#planPublicTransit") ? $("#planPublicTransit").checked : true;

    if (e) {
      if (ecoHomestays) updateResponsibleScore(15, "Certified eco-homestay prioritized in trip planner!");
      if (publicTransit) updateResponsibleScore(10, "EV/shared transit opted in trip planner!");
    }

    lastItineraryParams = { dest, days, budget, style, interest };

    const lang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";

    const ladakhItineraryEn = [
      { title: "Leh Arrival & Mandatory 48-Hour Acclimatization", pass: null, notes: "Complete physical rest. Drink 4L water with electrolytes. Monitor SpO2 levels." },
      { title: "Sham Valley Offbeat Corridor: Basgo & Alchi", pass: null, notes: "Smart Decongestion route at lower altitude (10,200 ft). Supporting local apricot growers." },
      { title: "Leh → Nubra Valley Crossing Khardung La Pass", pass: "Khardung La", notes: "Summit stop limited to 15 mins to avoid AMS. 4x4 certified vehicle transfer." },
      { title: "Turtuk Border Village Heritage Immersion", pass: null, notes: "Decongestion offbeat gem. Supporting women's handwoven pashmina cooperative." },
      { title: "Nubra → Pangong Tso via Shyok River Scenic Route", pass: null, notes: "Scenic river canyon road. Check water crossing clearance." },
      { title: "Pangong Lake Sunrise & Hanle Dark Sky Reserve", pass: "Chang La", notes: "Traverse Chang La to reach Hanle Dark Sky Reserve. Experience zero light pollution astrostays." },
      { title: "Hemis & Thiksey Himalayan Monasteries", pass: null, notes: "Morning prayers, ancient fresco preservation, and living Tibetan Buddhist culture." },
      { title: "Tso Moriri High-Altitude Wetland Sanctuary", pass: null, notes: "Changthang nomadic settlements, Korzok village homestay, and wildlife respect zone." },
      { title: "Local Artisan Markets, Seed-paper Packing & Eco-departure", pass: null, notes: "Leave no trace; purchase direct local handicrafts." }
    ];

    const ladakhItineraryHi = [
      { title: "लेह आगमन और अनिवार्य 48 घंटे का अनुकूलन", pass: null, notes: "पूर्ण शारीरिक विश्राम। इलेक्ट्रोलाइट्स के साथ 4 लीटर पानी पिएं। SpO2 स्तर की निगरानी करें।" },
      { title: "शाम घाटी ऑफबीट कॉरिडोर: बासगो और अलची", pass: null, notes: "निचली ऊंचाई (10,200 फीट) पर स्मार्ट भीड़-नियंत्रण मार्ग। स्थानीय खुबानी उत्पादकों का समर्थन।" },
      { title: "लेह → नुब्रा घाटी (खारदुंग ला दर्रा पार करना)", pass: "Khardung La", notes: "AMS से बचाव के लिए दर्रे पर रुकने का समय केवल 15 मिनट। 4x4 प्रमाणित वाहन से यात्रा।" },
      { title: "तुरतुक सीमावर्ती गांव विरासत भ्रमण", pass: null, notes: "ऑफबीट शांति स्थल। महिला हस्तनिर्मित पश्मीना सहकारी समिति का समर्थन।" },
      { title: "नुब्रा → श्योक नदी के रास्ते पैंगोंग त्सो", pass: null, notes: "मनोरम नदी घाटी सड़क। जल बहाव और सड़क स्थिति की जांच करें।" },
      { title: "पैंगोंग झील सूर्योदय और हानले डार्क स्काई रिजर्व", pass: "Chang La", notes: "चांग ला पार कर हानले पहुंचें। शून्य प्रकाश प्रदूषण में रात के आकाश और एस्ट्रोस्टे का आनंद लें।" },
      { title: "हेमिस और थिकसे हिमालयी बौद्ध मठ", pass: null, notes: "प्रातःकालीन प्रार्थना, प्राचीन भित्तिचित्र और जीवंत तिब्बती बौद्ध संस्कृति।" },
      { title: "त्सो मोरीरी उच्च-ऊंचाई वेटलैंड अभयारण्य", pass: null, notes: "चांगपा खानाबदोश बस्तियां, कोरज़ोक गांव का होमस्टे और वन्यजीव संरक्षण क्षेत्र।" },
      { title: "स्थानीय कारीगर बाजार और पर्यावरण अनुकूल प्रस्थान", pass: null, notes: "कोई निशान न छोड़ें; स्थानीय ग्रामीणों से सीधे हस्तशिल्प खरीदें।" }
    ];

    const ladakhItineraryBn = [
      { title: "লেহ আগমন এবং বাধ্যতামূলক ৪৮ ঘণ্টার বিশ্রাম ও অভিযোজন", pass: null, notes: "সম্পূর্ণ শারীরিক বিশ্রাম নিন। পর্যাপ্ত জল ও ওআরএস পান করুন। SpO2 পরীক্ষা করুন।" },
      { title: "শাম ভ্যালি অফবিট করিডোর: বাসগো এবং আলচি", pass: null, notes: "কম উচ্চতায় (১০,২০০ ফুট) স্মার্ট ভিড়-নিয়ন্ত্রণ রুট। স্থানীয় এপ্রিকট চাষিদের সহায়তা।" },
      { title: "লেহ → নুব্রা উপত্যকা (খারদুং লা গিরিপথ অতিক্রম)", pass: "Khardung La", notes: "উচ্চতাজনিত অসুস্থতা এড়াতে গিরিপথে অবস্থান ১৫ মিনিটের মধ্যে সীমাবদ্ধ রাখুন। 4x4 গাড়ি ব্যবহার করুন।" },
      { title: "তুরতুক সীমান্ত গ্রাম ঐতিহ্য ও সংস্কৃতি দর্শন", pass: null, notes: "শান্ত অফবিট স্থান। স্থানীয় মহিলা তাঁত সমবায়কে সমর্থন করুন।" },
      { title: "নুব্রা → শ্যোক নদীর মনোরম পথ হয়ে প্যাংগং সো", pass: null, notes: "নদীর গিরিখাত দিয়ে সুন্দর পাহাড়ি পথ। জলপ্রবাহ পরীক্ষা করে এগোন।" },
      { title: "প্যাংগং সূর্যোদয় ও হানলে ডার্ক স্কাই রিজার্ভ", pass: "Chang La", notes: "চাং লা অতিক্রম করে হানলে পৌঁছান। সম্পূর্ণ আলো-দূষণহীন নির্মল আকাশে তারা দেখুন।" },
      { title: "হেমিশ ও থিকসে প্রাচীন বৌদ্ধ মঠ", pass: null, notes: "ভোরবেলার প্রার্থনা, ঐতিহাসিক প্রাচীরচিত্র ও জীবন্ত তিব্বতি বৌদ্ধ দর্শন।" },
      { title: "সো মোরিরি রামসার হ্রদ ও সংবেদনশীল জলাভূমি", pass: null, notes: "চাংপা যাযাবরদের বসতি, কোরজোক গ্রামীণ হোমস্টে ও বন্যপ্রাণী অভয়ারণ্য।" },
      { title: "স্থানীয় কারিগর বাজার ও পরিবেশবান্ধব প্রস্থান", pass: null, notes: "পরিবেশ পরিষ্কার রাখুন; স্থানীয় গ্রামীণ হস্তশিল্প সংগ্রহ করুন।" }
    ];

    const genericItineraryEn = [
      { title: "Arrival, Safety Briefing & Community Orientation", pass: null, notes: "Meet local verified guides and receive regional travel advisory." },
      { title: "Historic Heritage Trails & Sacred Monastic Centers", pass: null, notes: "Explore architectural gems and traditional craft clusters." },
      { title: "Eco-Exploration Circuit & Nature Conservation Walk", pass: null, notes: "Zero single-use plastic zone. Support regional biodiversity." },
      { title: "Community Homestay & Living Culture Immersion", pass: null, notes: "Participate in family meal preparation and local storytelling." },
      { title: "Local Artisan Markets & Handicraft Cooperative Walk", pass: null, notes: "Direct fair-trade commerce with traditional weavers and artisans." }
    ];

    const genericItineraryHi = [
      { title: "आगमन, सुरक्षा ब्रीफिंग और सामुदायिक परिचय", pass: null, notes: "स्थानीय सत्यापित गाइडों से मिलें और क्षेत्रीय यात्रा परामर्श प्राप्त करें।" },
      { title: "ऐतिहासिक धरोहर ट्रेल्स और पवित्र आध्यात्मिक केंद्र", pass: null, notes: "वास्तुशिल्प स्थलों और पारंपरिक शिल्प समूहों का अन्वेषण करें।" },
      { title: "पर्यावरण अन्वेषण सर्किट और प्रकृति संरक्षण सैर", pass: null, notes: "एकल-उपयोग प्लास्टिक मुक्त क्षेत्र। क्षेत्रीय जैव विविधता का सम्मान करें।" },
      { title: "सामुदायिक होमस्टे और सजीव संस्कृति का अनुभव", pass: null, notes: "पारंपरिक भोजन पकाने और स्थानीय लोककथाओं में भाग लें।" },
      { title: "स्थानीय कारीगर बाजार और हथकरघा सहकारी भ्रमण", pass: null, notes: "पारंपरिक बुनकरों और कारीगरों से सीधे उत्पाद खरीदें।" }
    ];

    const genericItineraryBn = [
      { title: "আগমন, নিরাপত্তা পরামর্শ ও আঞ্চলিক পরিচিতি", pass: null, notes: "স্থানীয় প্রত্যয়িত গাইডের সাথে দেখা করুন এবং ভ্রমণ সতর্কতা জানুন।" },
      { title: "ঐতিহাসিক স্থাপত্য ও পবিত্র আধ্যাত্মিক কেন্দ্র দর্শন", pass: null, notes: "প্রাচীন স্থাপত্য ও স্থানীয় লোকশিল্প কেন্দ্র অন্বেষণ করুন।" },
      { title: "পরিবেশবান্ধব প্রাকৃতিক ট্রেইল ও জীববৈচিত্র্য ভ্রমণ", pass: null, notes: "প্লাস্টিক বর্জন এলাকা। স্থানীয় পরিবেশের সুরক্ষা নিশ্চিত করুন।" },
      { title: "গ্রামীণ হোমস্টে ও স্থানীয় সংস্কৃতি অভিজ্ঞতা", pass: null, notes: "পারিবারিক রান্নাবান্না ও স্থানীয় লোকগাথা শ্রবণ।" },
      { title: "স্থানীয় কারিগর বাজার ও তাঁত সমবায় সমিতি পরিদর্শন", pass: null, notes: "স্থানীয় তাঁতি ও শিল্পীদের থেকে সরাসরি পণ্য কিনুন।" }
    ];

    const isLadakh = dest.toLowerCase().includes("ladakh");
    const base = isLadakh
      ? (lang === "hi" ? ladakhItineraryHi : lang === "bn" ? ladakhItineraryBn : ladakhItineraryEn)
      : (lang === "hi" ? genericItineraryHi : lang === "bn" ? genericItineraryBn : genericItineraryEn);
    
    // Safe fetch for mountain passes
    let passData = {};
    if (typeof window.fetchPassesFromAPI === "function") {
      passData = await window.fetchPassesFromAPI();
    } else {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/passes");
        if (res.ok) passData = await res.json();
      } catch (err) {
        passData = {
          "Khardung La": { status: "OPEN", altitude: "17,582 ft", condition: "Pass cleared. Crossing permitted between 06:00 and 16:00.", safe: true, temperature: "-2°C" },
          "Chang La": { status: "CAUTION", altitude: "17,688 ft", condition: "High ridge winds (-5°C). Snow drift active near summit.", safe: true, temperature: "-5°C" }
        };
      }
    }

    const headerEyebrow = lang === "hi" 
      ? `आपकी ${days}-दिवसीय स्मार्ट यात्रा • ${dest.toUpperCase()}`
      : lang === "bn"
      ? `আপনার ${days}-দিনের স্মার্ট ভ্রমণসূচি • ${dest.toUpperCase()}`
      : `YOUR ${days}-DAY SMART ROUTE • ${dest.toUpperCase()}`;

    const badgeAuditText = lang === "hi"
      ? "⚡ स्मार्ट भीड़-नियंत्रण द्वारा सत्यापित"
      : lang === "bn"
      ? "⚡ স্মার্ট ভিড়-নিয়ন্ত্রণ দ্বারা যাচাইকৃত"
      : "⚡ SMART DECONGESTION AUDITED";

    const dayPrefix = lang === "hi" ? "दिन" : lang === "bn" ? "দিন" : "DAY";
    const transitText = lang === "hi" ? "🚗 सत्यापित परिवहन" : lang === "bn" ? "🚗 প্রত্যয়িত পরিবহন" : "🚗 Verified transit";
    const budgetText = lang === "hi" ? "💰 अनु. दैनिक खर्च" : lang === "bn" ? "💰 আনু. দৈনিক বরাদ্দ" : "💰 Est. daily allocation";
    const notePrefix = lang === "hi" ? "सुझाव:" : lang === "bn" ? "পরামর্শ:" : "Note:";

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:10px;">
        <div>
          <p class="eyebrow">${headerEyebrow}</p>
          <h3 style="margin:4px 0 0; color:var(--gold-pop); font-size:22px;">${style} • ${interest}</h3>
        </div>
        <span style="background:rgba(255,107,53,0.18); color:var(--accent); border:1px solid var(--accent); padding:5px 12px; border-radius:99px; font-size:10.5px; font-weight:800; letter-spacing:0.06em;">
          ${badgeAuditText}
        </span>
      </div>
    `;

    for (let i = 0; i < days; i++) {
      const item = base[i % base.length];
      const passInfo = item.pass ? passData[item.pass] : null;

      let advisoryBadge = "";
      if (passInfo) {
        const isOk = passInfo.status === "OPEN";
        const isCaution = passInfo.status === "CAUTION";
        const badgeClass = isOk ? "status-open" : isCaution ? "status-caution" : "status-restricted";
        const color = isOk ? "#2a9d8f" : isCaution ? "#f4a261" : "#e63946";
        const advisoryTitle = lang === "hi" 
          ? `⚠️ लाइव दर्रा परामर्श: ${item.pass.toUpperCase()}`
          : lang === "bn"
          ? `⚠️ লাইভ গিরিপথ সতর্কতা: ${item.pass.toUpperCase()}`
          : `⚠️ LIVE PASS ADVISORY: ${item.pass.toUpperCase()}`;

        advisoryBadge = `
          <div class="pass-advisory-badge ${badgeClass}">
            <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
              <strong style="color:${color}; font-size:11px; letter-spacing:0.06em;">
                ${advisoryTitle}
              </strong>
              <span style="font-size:10px; background:${color}; color:#fff; padding:2px 7px; border-radius:4px; font-weight:700;">
                ${passInfo.status}
              </span>
              <span style="font-size:11px; opacity:0.85;">• ${passInfo.altitude}</span>
              <span style="font-size:11px; opacity:0.85;">• ${passInfo.temperature || "-2°C"}</span>
            </div>
            <p style="margin:5px 0 0; font-size:12px; color:#e0e6ed; line-height:1.4;">${passInfo.condition}</p>
          </div>
        `;
      }

      html += `
        <div class="day">
          <strong>${dayPrefix} ${String(i + 1).padStart(2, "0")}</strong>
          <div>
            <h3>${item.title}</h3>
            <p>📍 ${dest} • ${transitText} • ${budgetText} ₹${Math.round(budget / days).toLocaleString()}</p>
            <p style="margin-top:3px; font-size:12px; color:#9db2be;">📌 <i>${notePrefix} ${item.notes}</i></p>
            ${advisoryBadge}
          </div>
        </div>
      `;
    }

    const output = $("#itineraryOutput");
    if (output) output.innerHTML = html;
  }

  // Re-generate active itinerary on language change if user already generated one
  window.addEventListener("bharat-lang-changed", () => {
    const output = $("#itineraryOutput");
    if (output && !output.querySelector(".empty-state") && lastItineraryParams) {
      itinerary();
    }
  });

  // ═══════════════════════════════════════════════════════
  //  PLANNER STATE CONNECTOR
  // ═══════════════════════════════════════════════════════

  function loadStateIntoPlanner(stateName) {
    const select = $("#planDestination");
    if (!select) return;

    let exists = false;
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value.toLowerCase() === stateName.toLowerCase() || select.options[i].text.toLowerCase().includes(stateName.toLowerCase())) {
        select.selectedIndex = i;
        exists = true;
        break;
      }
    }

    if (!exists) {
      const opt = document.createElement("option");
      opt.value = stateName;
      opt.text = stateName;
      select.add(opt);
      select.value = stateName;
    }

    toast(`Selected ${stateName} for safety-audited itinerary generation.`);
    const plannerSec = $("#planner");
    if (plannerSec) {
      plannerSec.scrollIntoView({ behavior: "smooth" });
    }

    const form = $("#plannerForm");
    if (form) form.dispatchEvent(new Event("submit"));
  }

  // ═══════════════════════════════════════════════════════
  //  AI & PLANNER INITIALIZATION
  // ═══════════════════════════════════════════════════════

  function initAI() {
    // Itinerary form submission
    const plannerForm = $("#plannerForm");
    if (plannerForm) plannerForm.onsubmit = itinerary;

    // AI Chat form submission
    const chatForm = $("#chatForm");
    if (chatForm) {
      chatForm.onsubmit = e => {
        e.preventDefault();
        const input = $("#chatInput");
        if (input) {
          askAI(input.value);
          input.value = "";
        }
      };
    }

    // Suggestion buttons
    $$(".ai-suggestions button").forEach(b => {
      b.onclick = () => askAI(b.dataset.question);
    });
  }

  // Expose on window for cross-file and inline HTML button accessibility
  window.renderMarkdown = renderMarkdown;
  window.aiReply = aiReply;
  window.askAI = askAI;
  window.itinerary = itinerary;
  window.loadStateIntoPlanner = loadStateIntoPlanner;
  window.initAI = initAI;

  // Auto-initialize if DOM is ready, or on DOMContentLoaded
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initAI, 20);
  } else {
    document.addEventListener("DOMContentLoaded", initAI);
  }
})();
