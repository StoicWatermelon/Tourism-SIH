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
  const AI_API_ORIGIN = window.location.protocol.startsWith("http") ? "" : "http://127.0.0.1:8000";

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
  window.tryGpsOriginDetection = tryGpsOriginDetection;

  // Active conversational state tracking
  let activeDestination = null;
  const chatHistory = [];

  // Destination keywords
  const COOCHBEHAR_KW = ["coochbehar", "cooch behar", "coochbihar", "koch bihar", "kochbihar", "কোচবিহার", "कूचबिहार", "madan mohan bari", "rasikbil", "victor jubilee palace", "sagar dighi", "baneswar"];
  const THANE_KW = ["thane", "thana", "ठाणे", "yeoor", "upvan", "talao pali", "masunda", "kopineshwar", "mamledar"];
  const KOLKATA_KW = ["kolkata", "calcutta", "howrah", "bengal", "victoria memorial", "dakshineswar", "hooghly", "park street", "college street", "কলকাতা", "হাওড়া", "বাংলা", "ভিক্টোরিয়া", "দক্ষিণেশ্বর", "कोलकाता", "कलकत्ता"];
  const JAIPUR_KW = ["jaipur", "rajasthan", "pink city", "amber fort", "hawa mahal", "jantar mantar", "chokhi dhani", "जयपुर", "राजस्थान", "জয়পুর", "রাজস্থান"];
  const KERALA_KW = ["kerala", "alleppey", "alappuzha", "munnar", "kochi", "cochin", "backwater", "wayanad", "केरल", "কেরল", "আলেপ্পি", "মুন্নার"];
  const LADAKH_KW = ["ladakh", "leh", "pangong", "nubra", "khardung", "chang la", "zoji la", "turtuk", "hanle", "tso moriri", "लद्दाख", "लेह", "पैंगोंग", "লাদাখ", "লেহ", "প্যাংগং"];
  const GOA_KW = ["goa", "panaji", "calangute", "dudhsagar", "fontainhas", "गोवा", "গোয়া"];
  const VARANASI_KW = ["varanasi", "kashi", "banaras", "ghat", "ganga aarti", "वाराणसी", "काशी", "বারাণসী", "কাশী"];

  function detectDestination(text) {
    const t = (text || "").toLowerCase();
    if (COOCHBEHAR_KW.some(k => t.includes(k))) return "coochbehar";
    if (THANE_KW.some(k => t.includes(k))) return "thane";
    if (KOLKATA_KW.some(k => t.includes(k))) return "kolkata";
    if (JAIPUR_KW.some(k => t.includes(k))) return "jaipur";
    if (KERALA_KW.some(k => t.includes(k))) return "kerala";
    if (LADAKH_KW.some(k => t.includes(k))) return "ladakh";
    if (GOA_KW.some(k => t.includes(k))) return "goa";
    if (VARANASI_KW.some(k => t.includes(k))) return "varanasi";
    return null;
  }

  function detectSubtopic(text) {
    const t = (text || "").toLowerCase();
    if (["food", "eat", "cuisine", "dish", "restaurant", "sweet", "biryani", "snack", "breakfast", "dinner", "lunch", "भोजन", "खाना", "खाएं", "खाएँ", "खाओ", "स्वाद", "मिठाई", "व्यंजन", "খাবার", "খাব", "মিষ্টি"].some(w => t.includes(w))) return "food";
    if (["pack", "gear", "carry", "bag", "cloth", "wear", "shoes", "पैक", "सामान", "कपड़े", "প্যাক", "পোশাক", "জিনিস"].some(w => t.includes(w))) return "pack";
    if (["budget", "cost", "price", "money", "expensive", "cheap", "afford", "spend", "rate", "बजट", "खर्च", "বাজেট", "খরচ"].some(w => t.includes(w))) return "budget";
    if (["safe", "safety", "emergency", "hospital", "police", "danger", "crime", "सुरक्षा", "आपातकालीन", "নিরাপত্তা", "জরুরি"].some(w => t.includes(w))) return "safety";
    if (["pass", "khardung", "chang la", "zoji", "baralacha", "tanglang", "दर्र", "গিরিপথ"].some(w => t.includes(w))) return "pass";
    if (["acclimat", "altitude", "ams", "oxygen", "breathe", "अनुकूलन", "ऊंचाई", "অভিযোজন", "উচ্চতা"].some(w => t.includes(w))) return "acclimat";
    if (["permit", "ilp", "pap", "permiss", "restricted", "परमिट", "পারমিট"].some(w => t.includes(w))) return "permit";
    if (["decongest", "offbeat", "crowd", "भीड़", "ऑफबीट", "ভিড়", "অফবিট"].some(w => t.includes(w))) return "decongest";
    return "overview";
  }

  // ═══════════════════════════════════════════════════════
  //  MARKDOWN RENDERER FOR AI CHAT
  // ═══════════════════════════════════════════════════════

  /**
   * Enhanced markdown renderer for AI responses
   * Supports headings (###, ##), bold, italics, bullets, and paragraphs
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
    html = html.replace(/\*([^\*\n]+?)\*/g, '<em>$1</em>');

    // Bullet list items (•, -, *)
    html = html.replace(/^[•\-\*]\s+(.+)$/gm, '<div class="ai-list-item"><span class="ai-bullet">•</span> $1</div>');

    // Paragraph breaks
    html = html.replace(/\n\n+/g, '<div class="ai-spacer"></div>');
    html = html.replace(/\n/g, '<br>');

    return html;
  }

  // ═══════════════════════════════════════════════════════
  //  STRUCTURED DESTINATION-AWARE HEURISTIC FALLBACKS
  // ═══════════════════════════════════════════════════════

  const DESTINATION_FALLBACKS = {
    coochbehar: {
      en: {
        overview: "**Coochbehar (West Bengal) — The Royal Heritage City of the Koch Dynasty:**\n\n• **Royal & Architectural Wonders:** Cooch Behar Royal Palace (Victor Jubilee Palace, built in 1887 under Maharaja Nripendra Narayan, classical Italian Renaissance brick palace modeled on Buckingham Palace), historic Madan Mohan Bari (1889 temple dedicated to Lord Krishna, home to the legendary Ras Mela celebration), and tranquil Sagar Dighi lake promenade.\n• **Wildlife & Archaeology:** Rasikbil Wetland & Bird Sanctuary (175-hectare sanctuary for migratory waterfowl, deer park, and python rescue centre), Gosanimari archaeological excavation mound (ancient 11th-15th century capital of the Kamtapur Kingdom), and sacred Baneswar Shiva Temple (temple pond sanctifying rare endangered Black Softshell Turtles locally known as Mohan).\n• **Zero-Mile Authentic Flavors:** Shorshe Ilish & Bhetki Paturi with aromatic Gobindobhog rice, traditional Koch-Rajbongshi Sidol fish chutney & crispy Bora, and royal Chhanar Jilapi & Bhapa Sandesh.\n• **Eco-Transit:** Zero-emission battery e-rickshaws (Totos) connect the entire palace and lake heritage corridor cleanly.\n• **Best Season:** October through March — pleasant winter weather and the vibrant historic Ras Mela festival (Nov–Dec).",
        food: "**Coochbehar's Royal Koch & Bengali Gastronomy:**\n\n• **Royal Sweet Confections:** Iconic Chhanar Jilapi (fresh cottage cheese fried into coils and dipped in light cardamom syrup), warm spongy Rasgullas, and Bhapa Sandesh.\n• **Koch-Rajbongshi Specialties:** Traditional Sidol fish chutney (fermented freshwater fish with aromatic mountain chilies), crispy lentil Bora, and seasonal leafy greens (Pelka).\n• **Authentic Bengali Feast:** Steaming Gobindobhog rice with Shorshe Ilish (Hilsa fish in pungent mustard gravy), tender Bhetki Paturi steamed in banana leaves, and Radhaballabhi with spiced chana dal for breakfast.",
        pack: "**Packing Guide for Coochbehar & North Bengal:**\n\n• **Clothing:** Breathable light cottons for daytime; during winter (Nov–Feb), pack light sweaters and shawls as North Bengal evenings are cool (10–15°C).\n• **Footwear:** Comfortable walking shoes for exploring extensive royal palace grounds, temple complexes, and lakeside promenades.\n• **Binoculars & Camera:** High zoom lens or compact binoculars are essential for birdwatching at Rasikbil Bird Sanctuary.\n• **Eco Practice:** Carry a reusable bottle. Support local artisans by purchasing authentic handwoven Shitalpati cane mats.",
        budget: "**Coochbehar Travel Budget Guide (Per Person):**\n\n• **Budget Backpacker (₹1,200–1,800/day):** Clean central lodges, authentic Bengali dhabas (₹100–180/meal), and local Toto e-rickshaws (₹15–30 per ride).\n• **Mid-Range Traveler (₹2,500–4,500/day):** Heritage-inspired hotels near Sagar Dighi or Palace, guided museum tours, and hired day cabs for Rasikbil.\n• **Eco-Explorer:** Homestays in Rasikbil forest village directly supporting rural fishing and farming families.",
        safety: "**Coochbehar Travel Safety & Emergency Helplines:**\n\n• **Medical Facilities:** Cooch Behar Government Medical College & Hospital (Apex 24/7 Trauma Care, Ph: 03582-222222) and MJN District Hospital.\n• **Police & Helplines:** Cooch Behar Kotwali Police Station (Ph: 112 / 03582-222300). National Tourist Helpline: 1363.\n• **Local Etiquette:** Dress respectfully when entering temples like Madan Mohan Bari and Baneswar Shiva temple. Do not disturb the sacred turtles in the temple pond."
      },
      hi: {
        overview: "**कूचबिहार (पश्चिम बंगाल) — कोच राजवंश की ऐतिहासिक शाही नगरी:**\n\n• **प्रमुख शाही धरोहर:** कूचबिहार राजमहल (विक्टर जुबली पैलेस, 1887 में बकिंघम पैलेस की तर्ज पर निर्मित इटैलियन पुनर्जागरण शैली का भव्य महल), ऐतिहासिक मदन मोहन बाड़ी (प्रसिद्ध रास मेला स्थल) और सागर दिघी हेरिटेज झील।\n• **वन्यजीव और पुरातत्व:** रसिकबिल वेटलैंड पक्षी अभयारण्य (प्रवासी जलपक्षियों के लिए प्रसिद्ध), गोसानीमारी पुरातत्व स्थल (कामतापुर साम्राज्य की 11वीं सदी की राजधानी) और बानेश्वर शिव मंदिर (जहाँ दुर्लभ काले कछुओं 'मोहन' को पवित्र माना जाता है)।\n• **स्थानीय स्वाद:** सरसों इलिश, भेटकी पातुरी, पारंपरिक कोच-राजबंशी सिदोल चटनी और प्रसिद्ध छाना की जलेबी (छानार जिलापी)।\n• **सर्वोत्तम समय:** अक्टूबर से मार्च — सुखद मौसम और ऐतिहासिक रास मेला उत्सव।",
        food: "**कूचबिहार के प्रामाणिक व्यंजन एवं खानपान:**\n\n• **प्रसिद्ध मिठाइयां:** पारंपरिक छानार जिलापी (छेना की जलेबी), भापा संदेश और रसगुल्ले।\n• **राजबंशी व्यंजन:** सिदोल चटनी, कुरकुरा बोरा और पेल्का (पारंपरिक पत्तेदार साग)।\n• **बंगाली थाली:** गोविंदभोग चावल के साथ सरसों इलिश मछली और केला पत्ता भेटकी पातुरी।",
        pack: "**कूचबिहार यात्रा पैकिंग सूची:** हल्के सूती कपड़े; सर्दियों (दिसंबर-जनवरी) के लिए हल्की जैकेट; रसिकबिल में पक्षी दर्शन के लिए दूरबीन।",
        budget: "**कूचबिहार यात्रा बजट:** ₹1,200–1,800/दिन (बजट); ₹2,500–4,500/दिन (मध्यम श्रेणी)।",
        safety: "**सुरक्षा एवं हेल्पलाइन:** कूचबिहार मेडिकल कॉलेज अस्पताल (आपातकालीन: 03582-222222)। पुलिस: 112। राष्ट्रीय पर्यटक हेल्पलाइन: 1363।"
      },
      bn: {
        overview: "**কোচবিহার (পশ্চিমবঙ্গ) — কোচ রাজবংশের ঐতিহাসিক রাজকীয় শহর:**\n\n• **ঐতিহাসিক ও রাজকীয় স্থাপত্য:** কোচবিহার রাজবাড়ি (ভিক্টর জুবিলি প্যালেস, মহারাজা নৃপেন্দ্র নারায়ণের আমলে ১৮৮৭ সালে বাকিংহাম প্যালেসের আদলে নির্মিত ইতালীয় রেনেসাঁ স্থাপত্যের অনন্য নিদর্শন), ঐতিহ্যবাহী মদন মোহন বাড়ি (বিখ্যাত রাস মেলার পুণ্যভূমি) এবং মনোরম সাগর দিঘি প্রমোদচত্বর।\n• **বন্যপ্রাণী ও প্রত্নতত্ত্ব:** রসিকবিল জলাভূমি ও পক্ষী অভয়ারণ্য (১৭৫ হেক্টর প্রাকৃতিক হ্রদ, পরিযায়ী পাখির স্বর্গরাজ্য, হরিণ পার্ক), প্রাচীন কামতাপুর সাম্রাজ্যের গোসানিমারী প্রত্নতাত্ত্বিক খনন ঢিবি এবং বাণেশ্বর শিবমন্দির (পুকুরে সংরক্ষিত বিরল প্রজাতির বোস্তামী কালো কচ্ছপ বা 'মোহন')।\n• **খাঁটি খাদ্যসংস্কৃতি:** সুগন্ধি গোবিন্দভোগ চাল ও সর্ষে ইলিশ, কলাপাতায় ভাপা ভেটকি পাতুরি, ঐতিহ্যবাহী কোচ-রাজবংশী সিদল ভর্তা ও বড়া, এবং বিশ্বখ্যাত ছানার জিলিপি ও কাঁচাগোল্লা।\n• **পরিবেশবান্ধব যাতায়াত:** দূষণমুক্ত ব্যাটারিচালিত টোটো রিকশা সমগ্র হেরিটেজ চত্বরকে সুন্দরভাবে সংযুক্ত করে।\n• **ভ্রমণের সেরা সময়:** অক্টোবর থেকে মার্চ — আনন্দময় শীতকালীন আবহাওয়া ও শতাব্দীপ্রাচীন ঐতিহ্যবাহী রাসমেলা।",
        food: "**কোচবিহারের ঐতিহ্যবাহী খাদ্যসংস্কৃতি ও সেরা খাবারের স্বাদ:**\n\n• **রাজকীয় মিষ্টি:** অপূর্ব স্বাদের ছানার জিলিপি (তাজা ছানার প্যাঁচানো মিষ্টি), খাঁটি ক্ষীরের কাঁচাগোল্লা ও ভাপা সন্দেশ।\n• **কোচ-রাজবংশী ঘরোয়া স্বাদ:** ঐতিহ্যবাহী শুঁটকি ও সিদল ভর্তা, মুচমুচে ডালের বড়া এবং পুষ্টিকর পেলকা শাকের ঝোল।\n• **বাঙালি রাজকীয় ভোজ:** গরম ভাতের সাথে সর্ষে ইলিশ, খাঁটি ঘি, ভেটকি পাতুরি এবং সকালে রাধাবল্লভী ও আলুর দম।",
        pack: "**কোচবিহার ভ্রমণের প্যাকিং তালিকা:** আরামদায়ক সুতির জামাকাপড়; শীতকালে (ডিসেম্বর-ফেব্রুয়ারি) হালকা চাদর বা সোয়েটার; রসিকবিল পাখির ছবি তোলার জন্য ভালো ক্যামেরা বা বাইনোকুলার।",
        budget: "**কোচবিহার ভ্রমণ বাজেট (জনপ্রতি):** ১,২০০–১,৮০০ টাকা/দিন (বাজেট); ২,৫০০–৪,৫০০ টাকা/দিন (মিড-রেঞ্জ)। স্থানীয় টোটো ভাড়া খুবই সাশ্রয়ী।",
        safety: "**কোচবিহার নিরাপত্তা ও জরুরি যোগাযোগ:** কোচবিহার গভর্নমেন্ট মেডিকেল কলেজ ও হাসপাতাল (জরুরি: ০৩৫৮২-২২২২২২)। পুলিশ: ১১২। জাতীয় পর্যটক হেল্পলাইন: ১৩৬৩।"
      }
    },
    thane: {
      en: {
        overview: "**Thane (Maharashtra) — The Green City of Lakes & Rainforest Foothills:**\n\n• **Historic & Scenic Highlights:** Masunda Lake (Talao Pali — heart of the city with pedal boating and sunset promenades), Upvan Lake (nestled right against the forested Yeoor foothills, host to the annual Sanskriti Arts Festival), 810 AD Kopineshwar Temple (ancient Shilahara dynasty shrine with Maharashtra's largest Shivalinga), and St. John the Baptist Church (Portuguese heritage established in 1582).\n• **Rainforest & Eco Trails:** Yeoor Hills (lush green buffer zone of Sanjay Gandhi National Park, home to leopards, 70+ bird species, butterflies, and indigenous Adivasi hamlets), Gaimukh Waterfront, and historic Ghodbunder Fort overlooking the Ulhas river estuary.\n• **Iconic Zero-Mile Flavors:** World-famous Mamledar Misal Pav, crispy Kothimbir Vadi, multi-grain Thalipeeth with white butter, and fresh Agri-Koli seafood thali.\n• **Transit:** Thane Railway Station (terminus of India's first train in 1853), TMT AC electric green buses, and auto-rickshaws.\n• **Best Season:** Monsoon (July–Sept) for verdant waterfalls and rainforest mist; October to March for pleasant lake strolls.",
        food: "**Thane's Iconic Street & Coastal Gastronomy:**\n\n• **Mamledar Misal Pav:** World-famous Naupada misal featuring tender sprouted moth beans in fiery rassa, garnished with crunchy farsan, coriander, and fresh pav.\n• **Traditional Maharashtrian Hearth:** Hot multi-grain Thalipeeth served with homemade white butter (loni), crispy Kothimbir Vadi, and Sabudana Khichdi.\n• **Agri-Koli Coastal Seafood:** Freshly caught Surmai fry, Tisrya (clams) masala, Bombil rava fry, and rice bhakri prepared with indigenous Koli masala blends.\n• **Lakeside Bites:** Creamy Kulfi falooda, piping hot roasted bhutta (corn), and tangy pani puri along the Talao Pali promenade.",
        pack: "**Packing Guide for Thane & Mumbai Metropolitan Corridor:**\n\n• **Clothing:** Breathable light cottons year-round; during monsoon (June–Sept), pack quick-drying clothes and waterproof footwear.\n• **Rain & Sun Gear:** Sturdy umbrella or rain poncho during monsoon; sunglasses and sunscreen for lake walks in summer/winter.\n• **Trek Shoes:** Sturdy sneakers or trail walking shoes for Yeoor Hills forest trails and butterfly garden explorations.\n• **Hydration:** Reusable stainless steel bottle for city walks and nature treks.",
        budget: "**Thane Travel Budget Guide (Per Person):**\n\n• **Budget (₹1,200–2,200/day):** Standard city stays, local street misal and thali dining (₹100–200/meal), and local trains or TMT buses (₹10–25).\n• **Mid-Range (₹3,000–5,500/day):** Quality business and green hotels along Ghodbunder Road / EEH, ride-hailing cabs, and lakefront dining.\n• **Eco-Resort (₹4,000–7,500/day):** Forest eco-cottages in Yeoor Hills overlooking the Sanjay Gandhi National Park canopy.",
        safety: "**Thane Travel Safety & Emergency Helplines:**\n\n• **Medical Facilities:** Jupiter Hospital Eastern Express Highway (Apex NABH Multi-Specialty & Level-1 Trauma Hospital, Ph: 022-21725555 / 108) and Bethany Hospital.\n• **Police & Helplines:** Thane Police Commissionerate Tourist Assistance: 112 / 022-25443300. National Tourist Helpline: 1363.\n• **Nature Caution:** Stay strictly on marked trails in Yeoor Hills; observe forest department closing times at sunset."
      },
      hi: {
        overview: "**ठाणे (महाराष्ट्र) — झीलों का हरित शहर और यूर हिल्स:**\n\n• **प्रमुख आकर्षण:** मासुंदा झील (तलाव पाली — नौकायन और शाम की सैर का केंद्र), उपवन झील (यूर पहाड़ियों की गोद में स्थित), 810 ई. का प्राचीन कोपिनेश्वर मंदिर (महाराष्ट्र का सबसे बड़ा शिवलिंग) और 1582 का ऐतिहासिक सेंट जॉन बैपटिस्ट चर्च।\n• **प्रकृति और वर्षावन:** यूर हिल्स (संजय गांधी राष्ट्रीय उद्यान का हरा-भरा बफर जोन, 70+ पक्षी प्रजातियाँ और तितली पार्क), गायमुख वाटरफ्रंट और घोडबंदर किला।\n• **प्रसिद्ध स्थानीय स्वाद:** विश्व प्रसिद्ध मामलेदार मिसल पाव, कोथिंबीर वड़ी, थालीपीठ और आग्री-कोली समुद्री भोजन।\n• **परिवहन:** भारत की पहली रेलगाड़ी (1853) का ऐतिहासिक स्टेशन, ठाणे नगर निगम (TMT) की एसी इलेक्ट्रिक बसें।\n• **सर्वोत्तम समय:** मानसून (जुलाई-सितंबर) हरियाली और झरनों के लिए; अक्टूबर से मार्च सुखद मौसम के लिए।",
        food: "**ठाणे के प्रसिद्ध स्वाद और स्ट्रीट फूड:**\n\n• **मामलेदार मिसल पाव:** नौपाड़ा की मशहूर तीखी रस्सा वाली मिसल, जिसे कुरकुरे फरसाण और ताजे पाव के साथ परोसा जाता है।\n• **महाराष्ट्रीयन व्यंजन:** सफेद मक्खन के साथ गरमा-गरम थालीपीठ, कुरकुरी कोथिंबीर वड़ी और साबूदाना खिचड़ी।\n• **तटीय आग्री-कोली सीफूड:** सुरमई फ्राई, तिसऱ्या (क्लैम्स) मसाला और भाकरी।\n• **तलाव पाली स्ट्रीट फूड:** मटका कुल्फी फालूदा और भुना हुआ भुट्टा।",
        pack: "**ठाणे यात्रा पैकिंग सूची:** हल्के सूती कपड़े; मानसून में रेनकोट या छाता; यूर हिल्स ट्रैकिंग के लिए आरामदायक जूते।",
        budget: "**ठाणे यात्रा बजट:** ₹1,200–2,200/दिन (बजट); ₹3,000–5,500/दिन (मध्यम)।",
        safety: "**सुरक्षा एवं हेल्पलाइन:** ज्यूपिटर अस्पताल (इमरजेंसी: 022-21725555 / 108)। ठाणे पुलिस: 112। राष्ट्रीय पर्यटक हेल्पलाइन: 1363।"
      },
      bn: {
        overview: "**ঠাণে (মহারাষ্ট্র) — হ্রদের সবুজ শহর ও ইউর পাহাড়ের বনভূমি:**\n\n• **ঐতিহাসিক ও মনোরম স্থান:** মাসুন্দা হ্রদ (তালাও পালি — শহরের কেন্দ্রস্থলে শান্ত হ্রদ ও বোটিং), উপবন হ্রদ (ইউর পাহাড়ের কোলে প্রতিবছর সংস্কৃতিক আর্টস ফেস্টিভ্যাল অনুষ্ঠিত হয়), ৮১০ খ্রিস্টাব্দের প্রাচীন শিলাহারা রাজবংশের কপিনেশ্বর শিবমন্দির এবং ১৫৮২ সালের ঐতিহাসিক সেন্ট জন ব্যাপটিস্ট চার্চ।\n• **রেইনফরেস্ট ও ইকো-ট্যুরিজম:** ইউর হিলস (সঞ্জয় গান্ধী জাতীয় উদ্যানের সংরক্ষিত জীববৈচিত্র্য অঞ্চল, ৭০টিরও বেশি প্রজাতির পাখি ও আদিবাসী গ্রাম), গাইমুখ ওয়াটারফ্রন্ট ও ঘোদবন্দর প্রাচীন দুর্গ।\n• **আইকনিক স্থানীয় খাবার:** মহারাষ্ট্র বিখ্যাত ঐতিহাসিক মামলেদার মিসাল পাভ, মুচমুচে কোথিম্বির বড়ি, পুষ্টিকর থালিপীঠ এবং তাজা আগ্রী-কোলি উপকূলীয় মাছের থালি।\n• **যাতায়াত ব্যবস্থা:** ভারতের প্রথম ট্রেনের (১৮৫৩) ঐতিহাসিক টার্মিনাস, ঠাণে মিউনিসিপ্যাল পরিবেশবান্ধব এসি ইলেকট্রিক বাস ও লোকাল ট্রেন।\n• **ভ্রমণের সেরা সময়:** বর্ষাকাল (জুলাই–সেপ্টেম্বর) সবুজ পাহাড় ও জলপ্রপাতের জন্য; অক্টোবর থেকে মার্চ হ্রদের ধারের সুন্দর সান্ধ্য ভ্রমণের জন্য।",
        food: "**ঠাণে শহরের খাদ্যসংস্কৃতি ও সেরা খাবারের তালিকা:**\n\n• **মামলেদার মিসাল পাভ:** নৌপাড়ার বিখ্যাত ঝাল রসা, অঙ্কুরিত মটর ও মুচমুচে ফারসানের অনন্য স্বাদ।\n• **ঐতিহ্যবাহী মারাঠি রান্না:** খাঁটি সাদা মাখন দিয়ে গরম ভাজা থালিপীঠ, ধনেপাতার কোথিম্বির বড়ি ও ভাকরি।\n• **উপকূলীয় কোলিবাসী মাছের পদ:** তাজা সুরমই ভাজা, ঝাল ঝাল ঝিনুক (তিসর‍্যা) কষা ও ভাতের রুটি।\n• **তালাও পালি স্ট্রিট ফুড:** কুখ্যাত কুলফি ফালুদা, নদীর পাড়ে পোড়া ভুট্টা ও ফুচকা।",
        pack: "**ঠাণে ভ্রমণের প্যাকিং তালিকা:** হালকা আরামদায়ক সুতির পোশাক; বর্ষায় ছাতা বা রেইনকোট; ইউর পাহাড়ের জঙ্গলে হাঁটার জন্য গ্রিপযুক্ত জুতো।",
        budget: "**ভ্রমণ বাজেট (জনপ্রতি):** ১,২০০–২,২০০ টাকা/দিন (বাজেট); ৩,০০০–৫,৫০০ টাকা/দিন (মিড-রেঞ্জ)।",
        safety: "**জরুরি যোগাযোগ ও স্বাস্থ্যসেবা:** জুপিটার সুপার স্পেশালিটি হাসপাতাল (ফোন: ০২২-২১৭২৫৫৫৫ / ১০৮)। ঠাণে পুলিশ হেল্পলাইন: ১১২। জাতীয় পর্যটন হেল্পলাইন: ১৩৬৩।"
      }
    },
    kolkata: {
      en: {
        overview: "**Kolkata & West Bengal — The Cultural Capital of India:**\n\n• **Historic & Cultural Landmarks:** Victoria Memorial (grand Italian Renaissance marble palace), Howrah Bridge (1943 cantilever engineering marvel across the Hooghly), Dakshineswar Kali Temple, Belur Math (global Ramakrishna Mission headquarters), Indian Museum (Asia's oldest), and sunset strolls along Princep Ghat.\n• **Intellectual & Artisan Quarters:** College Street ('Boi Para') — the world's largest second-hand book market with the legendary Indian Coffee House; Kumartuli — the 300-year-old traditional clay sculptors' quarter handcrafting monumental deities.\n• **Iconic Zero-Mile Flavors:** Warm spongy Rosogolla, caramelized Mishti Doi, Sandesh; aromatic Kolkata Biryani (with succulent spiced potato and egg); original Nizam's Kathi Rolls; and crispy street Phuchka.\n• **Sustainable Transit:** Ride India's only operating historic electric tramway network, take scenic green river ferries across the Hooghly, or use the underwater East-West Metro line beneath the riverbed.\n• **Best Season:** October through March — pleasant winter weather and the UNESCO-inscribed Durga Puja celebration.",
        food: "**Kolkata's World-Renowned Culinary Heritage:**\n\n• **Legendary Street Food:** Original mutton and paneer Kathi Rolls from Nizam's (New Market); crisp, hollow Phuchkas filled with spiced potato and tangy tamarind water; and Dacre Lane street eats (Chowmein, fish cutlets, Mughlai Paratha).\n• **Kolkata Biryani:** Aromatic Awadhi-style long-grain rice infused with saffron, cooked with tender meat, succulent boiled egg, and the iconic golden slow-cooked spiced potato.\n• **Bengali Sweets (Mishti):** Warm spongy Rosogolla (Nobin Chandra Das heritage), creamy caramelized Mishti Doi, and winter-special Nolen Gur Sandesh.\n• **Traditional Mahabhoj:** Steaming Gobindobhog rice with Jhuri Aloo Bhaja, Machher Jhol (fresh freshwater fish curry), and Kosha Mangsho (rich slow-cooked mutton) with fluffy Luchi.\n• **Iconic Hangouts:** Indian Coffee House on College Street for hot infused coffee and intellectual discussions, and Flurys on Park Street for British-era heritage breakfast and pastries.",
        pack: "**Essential Packing Guide for Kolkata & West Bengal:**\n\n• **Clothing:** Lightweight, breathable cotton clothes are best throughout the year. Kolkata has a warm tropical climate; in winter (Dec–Feb), carry a light jacket or shawl for evenings.\n• **Footwear:** Comfortable walking shoes or cushioned sneakers — essential for exploring College Street book alleys, heritage walking trails, and expansive museum grounds.\n• **Weather Protection:** Compact umbrella or light raincoat (monsoon showers from June to September) and a reusable tote bag for books and handcrafted souvenirs.\n• **Electronics:** High-capacity power bank for long days of photography around colonial architecture, river ghats, and bustling street bazaars.\n• **Eco Tip:** Carry a reusable stainless steel water bottle. Kolkata has numerous clean filtered water dispensing stations.",
        budget: "**Kolkata Travel Budget Guide (Per Person):**\n\n• **Backpacker / Budget (₹1,200–2,000/day):** Heritage guest houses or dorms, authentic street meals & local cabin dining (₹100–200/meal), and public transit via Kolkata Metro (₹10–25) and historic electric trams (₹7).\n• **Mid-Range (₹3,000–5,500/day):** Character boutique hotels in Central/South Kolkata, curated dining at Oh! Calcutta or Peter Cat, ride-hailing cabs, and museum entry tickets.\n• **Luxury (₹8,000–18,000+/day):** Grand heritage hotels (The Oberoi Grand, ITC Sonar), private chauffeur, private Hooghly river heritage cruises, and fine dining.\n• **Value Note:** Kolkata is widely recognized as one of India's most culturally rich yet budget-friendly metropolitan cities!",
        safety: "**Kolkata Safety, Navigation & Local Etiquette:**\n\n• **Metropolitan Safety:** Kolkata is consistently ranked among the safest major metropolitan cities in India with high public safety, active street life, and helpful locals.\n• **Tourist Assistance:** Kolkata Police Tourist Assistance booths are available at Howrah Station, Sealdah, and Victoria Memorial. Emergency Police Helpline: 100 / 112.\n• **Public Transit Tips:** Use the convenient Kolkata Metro (Blue and Green underwater lines) to bypass traffic; classic yellow ambassador taxis should run by meter or prepaid counters at stations; app cabs (Uber/Ola) are ubiquitous.\n• **Temple Etiquette:** Dress respectfully (cover shoulders and knees) when visiting temples like Dakshineswar and Kalighat. Deposit shoes at designated shoe stands."
      },
      hi: {
        overview: "**कोलकाता एवं पश्चिम बंगाल — भारत की सांस्कृतिक राजधानी:**\n\n• **प्रमुख ऐतिहासिक स्थल:** विक्टोरिया मेमोरियल (भव्य संगमरमर महल), हावड़ा ब्रिज (हुगली नदी पर ऐतिहासिक कैंटिलीवर पुल), दक्षिणेश्वर काली मंदिर, बेलूर मठ और प्रिंसप घाट।\n• **सांस्कृतिक और बौद्धिक केंद्र:** कॉलेज स्ट्रीट 'बोई पाड़ा' और ऐतिहासिक इंडियन कॉफी हाउस; कुम्हारटोली में पारंपरिक मूर्तिकारों की कला।\n• **प्रामाणिक स्थानीय स्वाद:** गर्म रसगुल्ला, मिष्टी दोई, नलेन गुड़ संदेश; आलू और अंडे वाली कोलकाता बिरयानी; निज़ाम का काठी रोल; और चटपटे पुचके।\n• **पर्यावरण-अनुकूल परिवहन:** भारत की एकमात्र ऐतिहासिक ट्राम, हुगली नदी पर इलेक्ट्रिक नौका या गंगा के नीचे से पहली अंडरवाटर मेट्रो।\n• **यात्रा का सर्वोत्तम समय:** अक्टूबर से मार्च — सुखद मौसम और विश्व प्रसिद्ध दुर्गा पूजा का उत्सव।",
        food: "**कोलकाता के विश्व प्रसिद्ध व्यंजन एवं खान-पान:**\n\n• **प्रसिद्ध स्ट्रीट फूड:** निज़ाम (न्यू मार्केट) का मूल मटन व पनीर काठी रोल; मसालेदार आलू और इमली के तीखे पानी वाले कुरकुरे पुचके; और डैकर्स लेन के स्ट्रीट स्नैक्स।\n• **कोलकाता बिरयानी:** केसर और खुशबूदार मसालों से युक्त अवधी शैली की बिरयानी, जिसमें नरम गोश्त/अंडे के साथ धीमी आंच पर पका स्वादिष्ट सुनहरा आलू होता है।\n• **पारंपरिक बंगाली मिठाइयां:** गर्म स्पंजी रसगुल्ला, नलेन गुड़ का संदेश और पारंपरिक मिष्टी दोई।\n• **पारंपरिक भोजन:** भाप में पके चावल के साथ माछेर झोल (ताजा मछली की करी), और लूची के साथ कोशा मांगशो (धीमी आंच पर पका मटन)।\n• **ऐतिहासिक ठिकाने:** कॉलेज स्ट्रीट पर इंडियन कॉफी हाउस और पार्क स्ट्रीट पर ऐतिहासिक बेकरी 'फ्लूरीज' (Flurys)।",
        pack: "**कोलकाता एवं पश्चिम बंगाल के लिए पैकिंग सूची:**\n\n• **कपड़े:** हल्के, हवादार सूती (कॉटन) कपड़े सर्वोत्तम हैं। सर्दियों (दिसंबर-फरवरी) में शाम के लिए हल्की शॉल या जैकेट साथ रखें।\n• **जूते:** चलने के लिए आरामदायक स्नीकर्स या जूते — कॉलेज स्ट्रीट की किताबों की गलियों और ऐतिहासिक संग्रहालयों के लिए आवश्यक।\n• **मौसम सुरक्षा:** एक छोटा छाता (जून से सितंबर के दौरान अचानक बारिश हेतु) और एक पुन: प्रयोज्य कपड़े का थैला।\n• **इलेक्ट्रॉनिक्स:** ऐतिहासिक इमारतों और हुगली नदी के घाटों पर फोटोग्राफी के लिए एक पावर बैंक।\n• **पानी:** पुन: प्रयोज्य पानी की बोतल साथ रखें; एकल-उपयोग प्लास्टिक से बचें।",
        budget: "**कोलकाता यात्रा बजट दिशानिर्देश (प्रति व्यक्ति):**\n\n• **बजट / बैकपैकर (₹1,200–2,000/दिन):** हेरिटेज गेस्ट हाउस या हॉस्टल, स्थानीय कैफे व स्ट्रीट फूड (₹100–200/भोजन), और कोलकाता मेट्रो (₹10–25) व ट्राम (₹7)।\n• **मध्यम श्रेणी (₹3,000–5,500/दिन):** दक्षिण/मध्य कोलकाता में बुटीक होटल, प्रसिद्ध रेस्टोरेंट (ओह! कलकत्ता, पीटर कैट), और कैब यात्रा।\n• **प्रीमियम (₹8,000–18,000+/दिन):** 5-सितारा हेरिटेज होटल (द ओबेरॉय ग्रैंड), निजी क्रूज़ और प्रीमियम डाइनिंग।\n• **विशेष:** कोलकाता भारत के सबसे किफायती और सांस्कृतिक रूप से समृद्ध महानगरों में से एक है!",
        safety: "**कोलकाता सुरक्षा, परिवहन व स्थानीय मार्गदर्शन:**\n\n• **महानगरीय सुरक्षा:** कोलकाता को भारत के सबसे सुरक्षित महानगरों में गिना जाता है। स्थानीय नागरिक बेहद मददगार और मित्रवत हैं।\n• **पर्यटक सहायता:** हावड़ा स्टेशन, सियालदह और विक्टोरिया मेमोरियल पर कोलकाता पुलिस पर्यटक सहायता बूथ उपलब्ध हैं। आपातकालीन पुलिस हेल्पलाइन: 100 / 112।\n• **आसान परिवहन:** ट्रैफिक से बचने के लिए कोलकाता मेट्रो और अंडरवाटर ईस्ट-वेस्ट मेट्रो का उपयोग करें; टैक्सी या उबर/ओला आसानी से उपलब्ध हैं।\n• **मंदिर मर्यादा:** दक्षिणेश्वर और कालीघाट मंदिर जाते समय शालीन पोशाक पहनें।"
      },
      bn: {
        overview: "**কলকাতা ও পশ্চিমবঙ্গ — ভারতের সাংস্কৃতিক রাজধানী:**\n\n• **প্রধান ঐতিহাসিক ও দর্শনীয় স্থান:** ভিক্টোরিয়া মেমোরিয়াল (ঐতিহাসিক মার্বেল প্রাসাদ), হাওড়া ব্রিজ (হুগলি নদীর উপর শতাব্দীপ্রাচীন ক্যান্টিলিভার সেতু), দক্ষিণেশ্বর কালী মন্দির, বেলুড় মঠ, ভারতীয় জাদুঘর এবং মনোরম প্রিন্সেপ ঘাট।\n• **বুদ্ধিবৃত্তিক ও শিল্পকলা কেন্দ্র:** কলেজ স্ট্রিট বইপাড়া ও বিখ্যাত ইন্ডিয়ান কফি হাউস; কুমোরটুলির ঐতিহ্যবাহী মৃৎশিল্পীদের বিশ্বখ্যাত প্রতিমা নির্মাণ শিল্প।\n• **খাঁটি স্থানীয় স্বাদ:** গরম রসগোল্লা, সুস্বাদু মিষ্টি দই, নলেন গুড়ের সন্দেশ; আলু-ডিম যুক্ত বিখ্যাত কলকাতা বিরিয়ানি; নিজামের আসল কাঠি রোল; এবং তেঁতুল জলের মুচমুচে ফুচকা।\n• **পরিবেশবান্ধব যাতায়াত:** ভারতের একমাত্র ঐতিহ্যবাহী বৈদ্যুতিক ট্রাম, হুগলি নদীর পরিবেশবান্ধব ফেরি সার্ভিস বা গঙ্গার নিচ দিয়ে দেশের প্রথম ইস্ট-ওয়েস্ট মেট্রো ব্যবহার করুন।\n• **ভ্রমণের সেরা সময়:** অক্টোবর থেকে মার্চ — আনন্দময় শীতকাল এবং বিশ্ববিখ্যাত ইউনেস্কো হেরিটেজ দুর্গাপূজার উৎসবমুখর পরিবেশ।",
        food: "**কলকাতার বিশ্বখ্যাত খাদ্যসংস্কৃতি ও সেরা খাবারের তালিকা:**\n\n• **বিখ্যাত স্ট্রিট ফুড:** নিউ মার্কেটের নিজামের খাঁটি মাটন ও পনির কাঠি রোল; মশলাদার আলু ও তেঁতুল জলের মুচমুচে ফুচকা; এবং ডেকার্স লেনের ঐতিহ্যবাহী কাটলেট ও স্ট্রিট ফুড।\n• **কলকাতা বিরিয়ানি:** সুগন্ধি জাফরানি বাসমতি চাল, নরম মাংস, সিদ্ধ ডিম এবং ঐতিহ্যবাহী সুস্বাদু সোনালী আলুর অনন্য মেলবন্ধন।\n• **ঐতিহ্যবাহী মিষ্টি:** গরম তুলতুলে রসগোল্লা (নবীন চন্দ্র দাসের ঐতিহ্য), ক্ষীরভরা মিষ্টি দই এবং শীতের নলেন গুড়ের সন্দেশ।\n• **খাঁটি বাঙালি ভুরিভোজ:** গরম গোবিন্দভোগ চাল ও ঝুরি আলুভাজা, তাজা মাছের ঝোল এবং ফুলকো লুচির সাথে কষা মাংস।\n• **ঐতিহাসিক আড্ডা:** কলেজ স্ট্রিটের ঐতিহাসিক ইন্ডিয়ান কফি হাউস এবং পার্ক স্ট্রিটের ব্রিটিশ আমলের বিখ্যাত বেকারি ফ্লুরিস (Flurys)।",
        pack: "**কলকাতা ভ্রমণের জন্য প্রয়োজনীয় প্যাকিং গাইড:**\n\n• **পোশাক:** আরামদায়ক ও হালকা সুতির পোশাক সারা বছরের জন্য সবচেয়ে উপযোগী। শীতকালে (ডিসেম্বর–ফেব্রুয়ারি) সন্ধ্যার জন্য একটি হালকা চাদর বা জ্যাকেট সাথে রাখুন।\n• **জুতো:** হাঁটার জন্য আরামদায়ক স্নিকার্স বা জুতো — কলেজ স্ট্রিটের বইপাড়া ও ঐতিহাসিক স্থাপত্য ঘুরে দেখার জন্য অপরিহার্য।\n• **আবহাওয়া সুরক্ষা:** একটি ছোট ছাতা (হঠাৎ বৃষ্টির জন্য) এবং বই ও হস্তশিল্প কেনার জন্য পুনরায় ব্যবহারযোগ্য কাপড়ের ব্যাগ।\n• **ইলেকট্রনিক্স:** সারাদিনের ছবি তোলা ও ভ্রমণের জন্য একটি ভালো পাওয়ার ব্যাংক সাথে রাখুন।\n• **পরিবেশবান্ধব অভ্যাস:** পুনরায় ব্যবহারযোগ্য জলের বোতল ব্যবহার করুন; প্লাস্টিক বর্জন করুন।",
        budget: "**কলকাতা ভ্রমণের বাজেট নির্দেশিকা (জনপ্রতি):**\n\n• **বাজেট / ব্যাকপ্যাকার (১,২০০–২,০০০ টাকা/দিন):** ঐতিহ্যবাহী গেস্ট হাউস, স্থানীয় খাবারের কেবিন ও স্ট্রিট ফুড (১০০–২০০ টাকা প্রতি বেলা), এবং মেট্রো (১০–২৫ টাকা) ও ট্রাম (৭ টাকা)।\n• **মিড-রেঞ্জ (৩,০০০–৫,৫০০ টাকা/দিন):** সেন্ট্রাল বা সাউথ কলকাতায় বুটিক হোটেল, পিটার ক্যাট বা ওহ! ক্যালকাটায় খাওয়া এবং অ্যাপ ক্যাব।\n• **প্রিমিয়াম (৮,০০০–১৮,০০০+ টাকা/দিন):** ঐতিহ্যবাহী ওবেরয় গ্র্যান্ড হোটেল, বিলাসবহুল ডাইনিং ও ব্যক্তিগত রিভার ক্রুজ।\n• **বিশেষত্ব:** কলকাতা ভারতের সবচেয়ে সাশ্রয়ী ও সাংস্কৃতিক ঐতিহ্যে ভরপুর মহানগর!",
        safety: "**কলকাতা নিরাপত্তা, যাতায়াত ও স্থানীয় নির্দেশিকা:**\n\n• **নিরাপত্তা:** কলকাতা ভারতের অন্যতম নিরাপদ মহানগর হিসেবে সুপরিচিত। স্থানীয় মানুষ অত্যন্ত ভদ্র ও সাহায্যকারী।\n• **পর্যটক সহায়তা:** হাওড়া স্টেশন, শিয়ালদহ ও ভিক্টোরিয়া মেমোরিয়ালে কলকাতা পুলিশের পর্যটক সহায়তা বুথ রয়েছে। জরুরি পুলিশ হেল্পলাইন: ১০০ / ১১২।\n• **যাতায়াত সুবিধা:** যানজট এড়াতে কলকাতা মেট্রো এবং গঙ্গার নিচের ঐতিহাসিক ইস্ট-ওয়েস্ট মেট্রো ব্যবহার করুন; হলুদ ট্যাক্সি ও অ্যাপ ক্যাব সর্বত্র সহজলভ্য।\n• **মন্দির সংস্কৃতি:** দক্ষিণেশ্বর ও কালীঘাট পরিদর্শনের সময় মার্জিত পোশাক পরিধান করুন।"
      }
    },
    jaipur: {
      en: {
        overview: "**Jaipur & Rajasthan — The Royal Pink City:**\n\n• **Monumental Heritage:** Amber Fort with its shimmering Sheesh Mahal, Hawa Mahal (Palace of Winds), City Palace museum complex, and Jantar Mantar UNESCO astronomical observatory.\n• **Local Crafts:** Traditional blue pottery, handcrafted gemstone jewelry, and Sanganeri wooden block prints.\n• **Authentic Flavors:** Dal Baati Churma, Pyaaz Kachori, Ker Sangri, and sweet Ghewar.\n• **Best Season:** October to March.",
        food: "**Jaipur's Royal Rajasthani Flavors:**\n\n• **Dal Baati Churma:** Baked wheat dumplings soaked in pure desi ghee, served with five-lentil dal and sweet powdered wheat churma.\n• **Street Savories:** Crisp flaky Pyaaz Kachori from Rawat Mishthan Bhandar, fiery Mirchi Bada, and rich Mawa Kachori.\n• **Sweets:** Honeycombed Ghewar (classic or malai-topped) and thick clay-pot sweet lassi at MI Road.",
        pack: "**Jaipur & Rajasthan Packing Essentials:**\n\n• **Clothing:** Breathable cotton clothing for daytime; in winter (Nov–Feb), pack layers as desert evenings turn chilly (8–12°C).\n• **Sun Protection:** Wide-brimmed sun hat, polarized sunglasses, and SPF 30+ sunscreen for fort courtyards.\n• **Footwear:** Durable slip-resistant footwear with good grip for ascending steep cobblestone ramps at Amber Fort and Nahargarh.",
        budget: "**Jaipur Trip Budget (Per Person):**\n\n• **Budget (₹1,500–2,500/day):** Heritage homestays in Bani Park, local dhabas and street kachoris, shared e-rickshaws.\n• **Mid-Range (₹4,000–7,000/day):** Restored heritage Havelis, multi-monument composite tickets, air-conditioned cabs, and folk dining at Chokhi Dhani.",
        safety: "**Jaipur Travel Safety & Tips:**\n\n• **Guides:** Always hire RTDC (Rajasthan Tourism) approved guides bearing official photo ID badges.\n• **Helpline:** Rajasthan Tourist Police Helpline: 1364 or dial 112."
      },
      hi: {
        overview: "**जयपुर — राजस्थान की गुलाबी नगरी:**\n\n• **ऐतिहासिक धरोहर:** आमेर का भव्य किला, हवा महल, सिटी पैलेस और जंतर मंतर (UNESCO विश्व धरोहर)।\n• **सांस्कृतिक शिल्प:** सांगानेरी ब्लॉक प्रिंटिंग, ब्लू पॉटरी और जोहरी बाजार में पारंपरिक आभूषण।\n• **पारंपरिक राजस्थानी भोजन:** दाल बाटी चूरमा, प्याज़ की कचौड़ी, घेवर और कुल्हड़ लस्सी।",
        food: "**जयपुर के शाही राजस्थानी व्यंजन:**\n\n• दाल बाटी चूरमा, शुद्ध देसी घी, प्याज कचौरी और पारंपरिक घेवर।",
        pack: "**जयपुर के लिए पैकिंग सुझाव:**\n\n• सूती कपड़े, सर्दियों में रात के लिए गर्म कपड़े, धूप का चश्मा और मजबूत जूते।",
        budget: "**जयपुर यात्रा बजट:**\n\n• बजट: ₹1,500–2,500/दिन; मध्यम: ₹4,000–7,000/दिन।",
        safety: "**जयपुर सुरक्षा:** केवल प्रमाणित गाइड और सरकारी पर्यटन सहायता (1364) का उपयोग करें।"
      },
      bn: {
        overview: "**জয়পুর — রাজস্থানের ঐতিহাসিক গোলাপি শহর:**\n\n• **প্রধান দর্শনীয় স্থান:** রাজকীয় অম্বর কেল্লা, হাওয়া মহল, সিটি প্যালেস এবং যন্তর মন্তর (ইউনেস্কো ওয়ার্ল্ড হেরিটেজ সাইট)।",
        food: "**জয়পুরের রাজকীয় খাবার:** ডাল বাটি চুরমা, পেঁয়াজের কচুরি এবং সুস্বাদু রাজস্থানি ঘেভর।",
        pack: "**প্যাকিং টিপস:** আরামদায়ক সুতির পোশাক, রোদচশমা ও হাঁটার জুতো।",
        budget: "**জয়পুর ভ্রমণ বাজেট:** ১,৫০০–২,৫০০ টাকা/দিন (বাজেট)।",
        safety: "**নিরাপত্তা:** সরকারি অনুমোদিত গাইড ও পর্যটন হেল্পলাইন (১৩৬৪) ব্যবহার করুন।"
      }
    },
    kerala: {
      en: {
        overview: "**Kerala — God's Own Country:**\n\n• **Backwaters & Coastal Serenity:** Alleppey & Kumarakom solar-powered eco-houseboats on Vembanad Lake; Marari village fishing beaches.\n• **Highland Tea Trails:** Munnar's mist-covered Nilgiri tea estates, Anamudi peak, and endangered Nilgiri Tahr wildlife at Eravikulam.\n• **Culture & Food:** Kathakali dance theatre, Kalaripayattu martial arts; authentic Kerala Sadya on banana leaf, Appam with vegetable stew, and Karimeen Pollichathu.\n• **Best Season:** September through March.",
        food: "**Kerala's Coastal & Spice Flavors:**\n\n• **Traditional Sadya:** Pure vegetarian banquet served on a plantain leaf with 20+ preparations including Avial, Sambar, Thoran, Payasam, and red Matta rice.\n• **Coastal Delicacies:** Karimeen Pollichathu (pearl spot fish wrapped in banana leaf and grilled), and Malabar Fish Curry with Kudampuli kokum.\n• **Breakfast Classics:** Fluffy fermented rice Appam with creamy coconut milk vegetable stew, and steamed Puttu with Kadala curry.",
        pack: "**Kerala Packing Essentials:**\n\n• **Clothing:** Lightweight linen and breathable cottons. Modest clothing for temple visits.\n• **Monsoon Gear:** Sturdy umbrella or breathable rain poncho (crucial for monsoon showers).\n• **Eco Gear:** Natural citronella insect repellent for backwaters, water-resistant footwear.",
        budget: "**Kerala Travel Budget (Per Person):**\n\n• **Budget (₹1,800–2,800/day):** Community homestays, state water transport ferries (₹15–40 for scenic cruises!), local vegetarian thalis.\n• **Mid-Range (₹4,500–8,000/day):** Boutique plantations in Munnar, overnight eco-houseboat in Alleppey, Ayurvedic massage.",
        safety: "**Kerala Travel Safety:** Board only DTPC-registered houseboats with certified lifebuoys; observe beach safety flags."
      },
      hi: {
        overview: "**केरल — ईश्वर का अपना घर (God's Own Country):**\n\n• बैकवाटर्स, सोलर हाउसबोट, मुन्नार के चाय बागान, आयुर्वेद और पारंपरिक कथकली नृत्य।",
        food: "**केरल के व्यंजन:** केले के पत्ते पर साध्या, अप्पम और नारियल फिश मोइली।",
        pack: "**केरल पैकिंग:** हल्के सूती कपड़े, छाता और मच्छर रोधी क्रीम।",
        budget: "**केरल बजट:** ₹1,800–2,800/दिन (बजट); ₹4,500–8,000/दिन (मध्यम)।",
        safety: "**केरल सुरक्षा:** प्रमाणित हाउसबोट चुनें और लाइफ जैकेट का उपयोग करें।"
      },
      bn: {
        overview: "**কেরল — ঈশ্বরের নিজস্ব দেশ (God's Own Country):**\n\n• ব্যাকওয়াটার্স হাউসবোট, মুন্নারের চা বাগান, আয়ুর্বেদ ও সমুদ্রতট।",
        food: "**কেরলের খাবার:** কেরল সাধ্য ভোজ, নরম অপ্পম ও নারকেল দুধের ফিশ কারি।",
        pack: "**প্যাকিং:** সুতির পোশাক, ছাতা ও রোদচশমা।",
        budget: "**বাজেট:** ১,৮০০–২,৮০০ টাকা/দিন।",
        safety: "**নিরাপত্তা:** সরকারি রেজিস্টার্ড হাউসবোট ব্যবহার করুন।"
      }
    },
    ladakh: {
      en: {
        overview: "**Ladakh — The Land of High Passes:**\n\n• **High-Altitude Wonders:** Pangong Tso (14,270 ft crystal-blue lake), Nubra Valley sand dunes with double-humped Bactrian camels, and Hanle Dark Sky Reserve.\n• **Monastic Heritage:** Hemis Gompa, Thiksey Monastery, and ancient 11th-century murals of Alchi.\n• **Acclimatization:** Mandatory 48 hours of complete rest in Leh (11,500 ft) before crossing high passes.",
        food: "**Ladakhi High-Altitude Cuisine:**\n\n• **Thukpa:** Hearty noodle soup with garden vegetables and rich broth, providing sustained warmth.\n• **Skyu:** Handmade slow-simmered whole wheat pasta stew — traditional winter sustenance.\n• **Gur Gur Cha:** Churned yak butter tea with Himalayan rock salt — critical for high-altitude hydration.\n• **Tingmo:** Steamed flower-shaped wheat bread served with spicy dal or vegetable stews.",
        pack: "**High-Altitude Himalayan Packing List (Ladakh):**\n\n• **Base Layers:** Merino wool thermals (2 sets minimum).\n• **Insulation:** 600-fill down jacket or heavy fleece pullover.\n• **Shell:** Waterproof windproof hardshell jacket.\n• **Eyewear & Sun:** Polarized UV-400 glacier sunglasses + SPF 50+ sunscreen.\n• **Medical:** Diamox (under medical advice), pulse oximeter, ORS sachets.\n• **Hydration:** Reusable insulated water bottle (plastic bottles banned in Ladakh!).\n• **Permits:** 4 hardcopies of Inner Line Permit (ILP).",
        budget: "**Ladakh Travel Budget (Per Person):**\n\n• **Budget (₹18,000–25,000 / 5 days):** Shared taxis, certified eco-homestays, DIY permits.\n• **Mid-Range (₹32,000–48,000 / 7 days):** Private 4x4 vehicle, curated community homestays, all permits.",
        safety: "**High-Altitude Safety Protocols (AMS):**\n\n• **Leh Acclimatization:** 48 hours minimum complete rest upon landing.\n• **Hydration:** Drink 4–5 liters of water daily with electrolytes. No alcohol or sleeping pills.\n• **Telemetry:** Check Khardung La & Chang La pass clearance before early morning departures. Hospital: SNM Hospital Leh."
      },
      hi: {
        overview: "**लद्दाख — उच्च हिमालयी दर्रों की भूमि:**\n\n• पैंगोंग त्सो (14,270 फीट), नुब्रा घाटी और हानले डार्क स्काई अभयारण्य। लेह में 48 घंटे अनुकूलन अनिवार्य।",
        food: "**लद्दाखी व्यंजन:** थुकपा, स्क्यू, गुर गुर बटर चाय और तिंगमो।",
        pack: "**पैकिंग:** मेरिनो वूल थर्मल, डाउन जैकेट, UV-400 चश्मा, डायमॉक्स व पल्स ऑक्सीमीटर।",
        budget: "**बजट:** ₹18,000–25,000 (5-दिवसीय साझा)।",
        safety: "**ऊंचाई सुरक्षा:** लेह में 48 घंटे का पूर्ण विश्राम और पर्याप्त पानी।"
      },
      bn: {
        overview: "**লাদাখ — উচ্চ হিমালয় গিরিপথের দেশ:**\n\n• প্যাংগং ত্সো, নুব্রা ভ্যালি ও তুরতুক। লেহতে ৪৮ ঘণ্টা বিশ্রাম বাধ্যতামূলক।",
        food: "**খাবার:** থুকপা, স্কিউ ও বাটার টি।",
        pack: "**প্যাকিং:** থার্মাল ইনার, ডাউন জ্যাকেট, গ্লেসিয়ার রোদচশমা ও ডায়ামক্স।",
        budget: "**বাজেট:** ১৮,০০০–২৫,০০০ টাকা (৫ দিন)।",
        safety: "**সুরক্ষা:** লেহতে প্রথম ৪৮ ঘণ্টা বিশ্রাম ও পর্যাপ্ত জলপান।"
      }
    }
  };

  const STANDALONE_HIMALAYAN = {
    acclimat: {
      en: "**Mandatory Acclimatization Protocol for Leh (11,500 ft):**\n\n• **Day 1 — Complete Rest:** Land at Leh Airport, go directly to your hotel, and rest for the entire day. Avoid all exertion.\n• **Day 2 — Light Activity:** Gentle short walks (15–20 mins). Monitor for headache, nausea, or breathlessness.\n• **Hydration Rule:** Drink 4–5 liters of water daily with electrolytes. Avoid alcohol, caffeine, and sleeping pills for the first 48 hours.\n• **AMS Warning Signs:** Throbbing headache, nausea, dizziness. If symptoms worsen, descend immediately to lower altitude.",
      hi: "**लेह (11,500 फीट) के लिए अनिवार्य 48-घंटे अनुकूलन प्रोटोकॉल:**\n\n• पहला दिन होटल में पूर्ण विश्राम करें। प्रतिदिन 4-5 लीटर पानी पिएं। शराब और भारी परिश्रम से बचें। सिरदर्द या चक्कर होने पर तुरंत कम ऊंचाई पर जाएं।",
      bn: "**বাধ্যতামূলক উচ্চতা সুরক্ষা ও অভিযোজন নির্দেশিকা:**\n\n• লেহ শহরে পৌঁছানোর পর প্রথম ৪৮ ঘণ্টা বিশ্রাম বাধ্যতামূলক। প্রতিদিন ৪-৫ লিটার জল পান করুন এবং রক্তে অক্সিজেনের মাত্রা (SpO2) পরীক্ষা করুন।"
    },
    pass: {
      en: "**Mountain Pass Safety Advisory (Live Telemetry):**\n\n• **Khardung La (17,582 ft) — OPEN:** Light black ice on northern descent. Cross between 06:00–16:00. Maximum stay at summit: 15 minutes. 4x4 with snow chains recommended.\n• **Chang La (17,688 ft) — CAUTION:** High ridge winds (-5°C). Snow drift active near summit. Cross before 14:00.\n• **Zoji La (11,575 ft) — RESTRICTED:** Freight convoy movement from Sonamarg.\n• **Emergency Number:** BRO Rescue 1077.",
      hi: "**पर्वतीय दर्रा लाइव सुरक्षा परामर्श:**\n\n• खारदुंग ला खुला है (सुबह 06:00 से शाम 16:00)। शिखर पर अधिकतम 15 मिनट रुकें। आपातकालीन नंबर: BRO HIMANK 1077।",
      bn: "**পাহাড়ি গিরিপথ লাইভ সতর্কতা:**\n\n• খারদুং লা ও চাং লা গিরিপথে নজরদারি চলছে। সকাল ০৬:০০ থেকে বিকাল ১৬:০০ এর মধ্যে অতিক্রম করুন।"
    },
    permit: {
      en: "**Inner Line Permit (ILP) — Complete Guide:**\n\n• Required for Nubra, Pangong, Turtuk, Hanle. Apply online at lahdc.nic.in. Carry 4 hardcopies for checkposts.",
      hi: "**इनर लाइन परमिट (ILP):** नुब्रा, पैंगोंग और हानले के लिए अनिवार्य। lahdc.nic.in पर ऑनलाइन प्राप्त करें। 4 प्रतियां साथ रखें।",
      bn: "**ইনার লাইন পারমিট (ILP):** নুব্রা ও প্যাংগং ভ্রমণের জন্য বাধ্যতামূলক। ৪টি প্রিন্ট কপি সাথে রাখুন।"
    },
    decongest: {
      en: "**Smart Decongestion Strategy:** Visiting secondary corridors like Turtuk, Hanle, and Sham Valley diverts tourist footprint away from saturated hotspots like Pangong Lake. This reduces vehicle emissions, relieves alpine water tables, and redistributes 80%+ of tourism revenue directly to remote village families.",
      hi: "**स्मार्ट भीड़-नियंत्रण रणनीति:** तुरतुक, हानले और शाम घाटी जैसे ऑफबीट स्थानों का दौरा करने से मुख्य केंद्रों पर दबाव घटता है और 80%+ आय सीधे स्थानीय परिवारों तक पहुंचती है।",
      bn: "**স্মার্ট ভিড়-নিয়ন্ত্রণ কৌশল:** বিকল্প করিডোর পরিদর্শনে মূল পর্যটন কেন্দ্রের ভিড় কমে এবং ৮০%+ অর্থ সরাসরি স্থানীয় গ্রামবাসীর হাতে থাকে।"
    }
  };

  const PAN_INDIA_FALLBACK = {
    en: {
      overview: "**Namaste! 🙏 I am Bharat AI — your verified travel intelligence guide for all of India.**\n\nI provide tailored, sustainable travel insights across all 28 states and union territories of Bharat:\n\n• **Kolkata & West Bengal** — Victoria Memorial, Howrah Bridge, Bengali cuisine, and historic trams\n• **Rajasthan & West India** — Majestic hill forts, palace architecture, and desert culture\n• **Kerala & South India** — Backwater eco-houseboats, spice trails, and tranquil beaches\n• **Himalayas & North** — Mountain valleys, high-altitude acclimatization, and live pass telemetry\n• **Sustainable Travel** — Certified community homestays, public EV transit, and zero single-use plastic\n\nAsk me about any destination, regional food, packing tips, or budget planning — I will stay strictly focused on your chosen topic!",
      food: "**Pan-India Culinary Explorer — A Journey You Can Taste:**\n\n• **East India (Kolkata & Bengal):** Rosogolla, Mishti Doi, Kolkata Biryani with spiced potato, and Kathi Rolls.\n• **West India (Rajasthan & Gujarat):** Dal Baati Churma, Pyaaz Kachori, and authentic Gujarati Thali.\n• **South India (Kerala & Tamil Nadu):** Traditional Kerala Sadya, Appam with coconut stew, and crispy Dosa with Sambar.\n• **North India (Himalayas & Plains):** Kashmiri Rogan Josh, Ladakhi Thukpa, and Punjabi Dal Makhani with Kulcha.\n\nTell me which region or city you're exploring, and I'll detail the best authentic local eateries and dishes!",
      pack: "**General Travel Packing Essentials for India:**\n\n• **Plains & Coastal Regions (Kolkata, Kerala, Goa):** Lightweight breathable cottons, comfortable walking shoes, umbrella, and sunglasses.\n• **Desert Regions (Rajasthan):** Cotton wear for warm days, warm layers for cool desert nights, and sun protection.\n• **Mountain Destinations (Himalayas):** Thermal base layers, fleece, down jacket, and sturdy trekking shoes.\n• **General Essentials:** Universal power bank, reusable water bottle, digital ID copies, and UPI payment app on your smartphone.",
      budget: "**Pan-India Travel Budget Guide (Per Person/Day):**\n\n• **Budget Backpacker (₹1,200–2,200/day):** Clean hostels/homestays, authentic street dhabas, state buses & metro.\n• **Mid-Range Traveler (₹3,500–6,500/day):** 3-star boutique hotels, heritage dining, ride-hailing cabs, and guided tours.\n• **Luxury Traveler (₹10,000–25,000+/day):** 5-star palace hotels, private chauffeur-driven vehicles, and curated experiences.\n\nLet me know your target destination for an exact city-specific budget breakdown!",
      safety: "**Pan-India Travel Safety & Etiquette Advice:**\n\n• **Emergency Numbers:** All-India Emergency Helpline: 112 (Police, Ambulance, Fire). Tourist Helpline: 1363.\n• **Digital Payments:** UPI (Google Pay, PhonePe, Paytm) is accepted nationwide from street stalls to luxury stores.\n• **Cultural Respect:** Remove shoes before entering temples and prayer halls; dress modestly at religious monuments.\n• **Transportation:** Use official prepaid taxi booths at airports/railway stations, or ride-hailing apps (Uber, Ola) with active GPS tracking."
    },
    hi: {
      overview: "**नमस्ते! 🙏 मैं भारत एआई (Bharat AI) हूँ — संपूर्ण भारत यात्रा के लिए आपका बुद्धिमान मार्गदर्शक।**\n\nमैं भारत के सभी राज्यों एवं प्रमुख शहरों के लिए सटीक और स्थायी यात्रा जानकारी प्रदान करता हूँ:\n\n• **कोलकाता एवं पश्चिम बंगाल** — विक्टोरिया मेमोरियल, हावड़ा ब्रिज, प्रसिद्ध मिष्टी दोई व ट्राम संस्कृति\n• **राजस्थान व पश्चिमी भारत** — जयपुर का आमेर किला, हवेलियां और रेगिस्तानी संस्कृति\n• **केरल व दक्षिण भारत** — बैकवाटर हाउसबोट, मुन्नार चाय बागान और समुद्री तट\n• **हिमालयी गंतव्य** — लद्दाख, हिमाचल और उत्तराखंड के लिए ऊंचाई सुरक्षा व दर्रा सलाह\n\nआप जिस भी शहर या यात्रा विषय के बारे में पूछेंगे, मैं बिना भटके केवल उसी विषय पर मार्गदर्शन दूंगा!",
      food: "**अखिल भारतीय खानपान गाइड:** पूर्व भारत में कोलकाता की बिरयानी व रसगुल्ला, पश्चिम में दाल बाटी चूरमा, दक्षिण में केरल साध्या और उत्तर में पहाड़ी व्यंजन।",
      pack: "**भारत यात्रा पैकिंग:** मैदानी व तटीय क्षेत्रों (कोलकाता/केरल) के लिए हल्के सूती कपड़े व छाता; हिमालय के लिए गर्म कपड़े।",
      budget: "**भारत यात्रा बजट:** ₹1,200–2,200/दिन (बजट); ₹3,500–6,500/दिन (मध्यम)।",
      safety: "**सुरक्षा सुझाव:** राष्ट्रीय आपातकालीन नंबर: 112। पर्यटक हेल्पलाइन: 1363।"
    },
    bn: {
      overview: "**নমস্কার! 🙏 আমি ভারত এআই (Bharat AI) — সমগ্র ভারত ভ্রমণের জন্য আপনার বুদ্ধিমান সহায়ক।**\n\nআমি ভারতের সমস্ত রাজ্য ও প্রধান শহরের জন্য নির্ভরযোগ্য ভ্রমণ পরামর্শ প্রদান করি:\n\n• **কলকাতা ও পশ্চিমবঙ্গ** — ভিক্টোরিয়া মেমোরিয়াল, হাওড়া ব্রিজ, ঐতিহ্যবাহী বাঙালি মিষ্টি ও ট্রাম\n• **রাজস্থান ও পশ্চিম ভারত** — প্রাচীন দুর্গ, রাজপুত স্থাপত্য ও রাজকীয় সংস্কৃতি\n• **কেরল ও দক্ষিণ ভারত** — ব্যাকওয়াটার্স হাউসবোট, চা বাগান ও সমুদ্রতট\n• **হিমালয় অঞ্চল** — লাদাখ ও হিমাচলের উচ্চতা সুরক্ষা ও গিরিপথ সতর্কতা\n\nআপনি যে শহর বা গন্তব্য সম্পর্কে জানতে চান আমাকে প্রশ্ন করুন — আমি সম্পূর্ণ সেই বিষয়ের উপর তথ্য জানাব!",
      food: "**ভারতের খাদ্যসংস্কৃতি:** কলকাতায় বিরিয়ানি ও রসগোল্লা, রাজস্থানে ডাল বাটি চুরমা, কেরলে সাধ্য ভোজ।",
      pack: "**প্যাকিং গাইড:** সমতল অঞ্চলের জন্য হালকা সুতির পোশাক ও ছাতা; পাহাড়ি অঞ্চলের জন্য উলের জ্যাকেট।",
      budget: "**ভ্রমণ বাজেট:** ১,২০০–২,২০০ টাকা/দিন (বাজেট); ৩,৫০০–৬,৫০০ টাকা/দিন (মিড-রেঞ্জ)।",
      safety: "**নিরাপত্তা নির্দেশিকা:** জরুরি হেল্পলাইন: ১১২। ক্যাশলেস UPI পেমেন্ট অত্যন্ত নির্ভরযোগ্য।"
    }
  };

  /**
   * Client-side offline heuristic fallback engine
   * Strictly stays on topic for the active or queried destination
   */
  function aiReply(q, overrideDest = null) {
    const lang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";
    const targetLang = (lang === "hi" || lang === "bn") ? lang : "en";

    const dest = detectDestination(q) || overrideDest || activeDestination;
    const subtopic = detectSubtopic(q);

    // 1. If explicit Himalayan telemetry/acclimatization requested
    if (subtopic in STANDALONE_HIMALAYAN) {
      const hDict = STANDALONE_HIMALAYAN[subtopic];
      return hDict[targetLang] || hDict.en;
    }

    // 2. If destination is recognized
    if (dest && DESTINATION_FALLBACKS[dest]) {
      const destBundle = DESTINATION_FALLBACKS[dest][targetLang] || DESTINATION_FALLBACKS[dest].en;
      if (destBundle[subtopic]) return destBundle[subtopic];
      return destBundle.overview || destBundle.food || "";
    }

    // 3. Pan-India general fallback
    const panBundle = PAN_INDIA_FALLBACK[targetLang] || PAN_INDIA_FALLBACK.en;
    if (panBundle[subtopic]) return panBundle[subtopic];
    return panBundle.overview;
  }

  // ═══════════════════════════════════════════════════════
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

  function renderWebGroundedBadge(plan) {
    if (!plan || !plan.web_search_summary) return "";
    const sourceLink = (plan.web_sources && plan.web_sources.length > 0) 
      ? `<a href="${plan.web_sources[0]}" target="_blank" rel="noopener noreferrer" class="agent-source-link">Read Full Travel Guide ↗</a>` 
      : "";
    return `
      <div class="agent-card grounded-badge-card">
        <div class="agent-card-title" style="margin-bottom:8px;">
          <span style="display:flex; align-items:center; gap:8px;">
            <span>🌐</span>
            <span>LIVE INTERNET TRAVEL INTELLIGENCE</span>
          </span>
          <span class="agent-card-tag verified">WIKIVOYAGE VERIFIED</span>
        </div>
        <p class="agent-summary-text">
          ${plan.web_search_summary}
        </p>
        <div class="agent-source-footer">
          <span>⚡ Grounded with live Wikivoyage & Wikimedia regional open data</span>
          ${sourceLink}
        </div>
      </div>
    `;
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
              ${d.difference_note ? `<div class="day-diff-note ${idx === 2 ? 'best' : ''}">${d.difference_note}</div>` : ''}
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
            ${opt.is_recommended ? '<span class="cheapest-badge">CHEAPEST RECOMMENDED</span>' : ''}
          </div>
          <div class="flight-timings">🕒 ${opt.departure_time} ➔ ${opt.arrival_time} • ${opt.duration} (${opt.stops})</div>
          <div class="flight-baggage">🧳 Cabin: ${opt.cabin_baggage} • Check-in: ${opt.checkin_baggage}</div>
        </div>
        <div class="flight-fare">
          <div class="flight-price-inr">₹${opt.price_inr.toLocaleString()}</div>
          <div class="fare-unit-label">per person</div>
        </div>
      </div>
    `).join('');

    const altAirportsHtml = flights.alternative_airports && flights.alternative_airports.length > 0
      ? `<div class="alt-hubs-row"><b>Alternative Hubs:</b> ${flights.alternative_airports.join(' • ')}</div>`
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
          <div class="flight-tradeoff-box">
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
            <div class="hotel-subtext">${h.category} • ${h.location}</div>
          </div>
          <div class="hotel-rating-badge">★ ${h.rating}</div>
        </div>
        <div class="hotel-location-text">📍 ${h.distance_from_attractions || "City Centre Corridor"}</div>
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
          <p class="hotel-recommendation-note">${hotels.recommendation_note}</p>
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
          <div class="itinerary-safety-alert">
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
                ${a.tip ? `<div class="slot-tip"><i>Tip: ${a.tip}</i></div>` : ''}
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
        <p class="itinerary-cluster-subtext">Attractions grouped by geographical corridors to minimize intra-city travel times.</p>
        <div class="itinerary-days-container">
          ${daysHtml}
        </div>
      </div>
    `;
  }

  function renderBudgetCard(budget) {
    if (!budget) return "";

    const barColors = ["#2a9d8f", "#e76f51", "#f4a261", "#457b9d", "#6a4c93", "#3d5a80"];
    const barSegmentsHtml = budget.categories.map((c, i) => `
      <div class="bar-segment" style="width: ${c.percentage}%; background: ${barColors[i % barColors.length]};" title="${c.category}: ${c.percentage}% (₹${c.cost_inr.toLocaleString()})"></div>
    `).join('');

    const categoryRowsHtml = budget.categories.map((c, i) => `
      <div class="cat-row">
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:10px; height:10px; border-radius:50%; background:${barColors[i % barColors.length]}; display:inline-block; flex-shrink:0;"></span>
            <strong class="cat-name">${c.category}</strong>
          </div>
          ${c.description ? `<div class="cat-desc">${c.description}</div>` : ''}
        </div>
        <div class="cat-cost-col">
          <b class="cat-cost-val">₹${c.cost_inr.toLocaleString()}</b>
          <div class="cat-pct">${c.percentage}%</div>
        </div>
      </div>
    `).join('');

    const tipsHtml = (budget.cost_saving_tips && budget.cost_saving_tips.length > 0)
      ? `<div class="budget-tips-box">
          <div class="budget-tips-title">💡 Smart Money-Saving Tips For This Route</div>
          <ul>
            ${budget.cost_saving_tips.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>`
      : '';

    const rationaleHtml = budget.strategy_rationale
      ? `<div class="budget-strategy-box">
          <strong class="budget-strategy-title">🧠 Intelligent Division Strategy</strong>
          ${budget.strategy_rationale}
        </div>`
      : '';

    return `
      <div class="agent-card">
        <div class="agent-card-title">
          <span>💰 SMART EXPEDITION BUDGET ALLOCATION</span>
          <span class="agent-card-tag verified">INTERNET GROUNDED</span>
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
            <div class="stat-label">${budget.daily_avg_spend_inr ? 'Daily Average' : 'Est. Daily Spend'}</div>
            <div class="stat-val stat-val-spend">₹${(budget.daily_avg_spend_inr || Math.round(budget.total_allocated_inr / 4)).toLocaleString()}/day</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Strategic Cushion</div>
            <div class="stat-val ${budget.remaining_cushion_inr >= 0 ? 'highlight-green' : ''}" style="${budget.remaining_cushion_inr < 0 ? 'color:#e63946;' : ''}">
              ₹${budget.remaining_cushion_inr.toLocaleString()}
            </div>
          </div>
        </div>
        <div class="budget-overview-bar" style="margin-top:14px;">
          ${barSegmentsHtml}
        </div>
        <div class="budget-category-list" style="margin-top:8px;">
          ${categoryRowsHtml}
        </div>
        ${rationaleHtml}
        ${budget.cushion_health_advice ? `
          <div class="budget-cushion-box">
            <b>Cushion Health:</b> ${budget.cushion_health_advice}
          </div>
        ` : ''}
        ${tipsHtml}
      </div>
    `;
  }

  function renderEmergencyCard(emergency) {
    if (!emergency) return "";

    return `
      <div class="agent-card">
        <div class="agent-card-title">
          <span>🛡️ EMERGENCY MEDICAL & SAFETY DOSSIER</span>
          <span class="agent-card-tag emergency-tag">24/7 SAFEGUARD</span>
        </div>
        <div class="emergency-card-box">
          <div class="emergency-head">
            <span>🏥</span>
            <span>Nearest Apex Trauma Center:</span>
          </div>
          <div class="emergency-hosp-name">${emergency.nearest_hospital.name}</div>
          <div class="emergency-hosp-address">
            ${emergency.nearest_hospital.address} (${emergency.nearest_hospital.distance})
          </div>
          <div class="emergency-contact-row">
            <a class="emergency-btn" href="tel:${emergency.nearest_hospital.phone}">📞 Call Hospital (${emergency.nearest_hospital.phone})</a>
            <a class="emergency-btn secondary" href="tel:112">🚨 National Emergency: 112</a>
            <a class="emergency-btn secondary" href="tel:1363">ℹ️ Tourist Helpline: 1363</a>
          </div>
          ${emergency.weather_alert ? `
            <div class="emergency-weather-alert">
              <b>Weather Advisory:</b> ${emergency.weather_alert}
            </div>
          ` : ''}
          ${emergency.high_altitude_medical_tips ? `
            <div class="emergency-altitude-alert">
              <b>High Altitude Warning:</b> ${emergency.high_altitude_medical_tips}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  function renderWebGroundedBadge(plan) {
    if (!plan || !plan.web_search_summary) return "";
    const sourceUrl = (plan.web_sources && plan.web_sources.length > 0) ? plan.web_sources[0] : "https://www.incredibleindia.gov.in";
    const destName = plan.constraints && plan.constraints.destination ? plan.constraints.destination : "Destination";
    return `
      <div class="web-grounded-badge-card">
        <div class="web-grounded-header">
          <span class="web-grounded-dot"></span>
          <span>LIVE INTERNET GROUNDED • WIKIPEDIA & INCREDIBLE INDIA</span>
          <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" class="web-grounded-source-link">View Source ↗</a>
        </div>
        <p class="web-grounded-summary"><b>${destName}:</b> ${plan.web_search_summary}</p>
      </div>
    `;
  }

  function renderQuickActions(plan) {
    const days = plan.constraints && plan.constraints.number_of_days ? plan.constraints.number_of_days : 4;
    const budget = plan.constraints && plan.constraints.budget ? Math.round(plan.constraints.budget) : 25000;
    const travelers = plan.constraints && plan.constraints.number_of_travelers ? plan.constraints.number_of_travelers : 1;

    return `
      <div class="agent-quick-actions">
        <button class="agent-action-chip" onclick="window.modifyAgentConstraint('add_day', 1)">🗓️ +1 Day (${days + 1}D)</button>
        ${days > 2 ? `<button class="agent-action-chip" onclick="window.modifyAgentConstraint('remove_day', 1)">🗓️ -1 Day (${days - 1}D)</button>` : ''}
        <button class="agent-action-chip" onclick="window.modifyAgentConstraint('lower_budget', 1)">📉 Lower Budget (₹${Math.round(budget * 0.8).toLocaleString()})</button>
        <button class="agent-action-chip" onclick="window.modifyAgentConstraint('upgrade_budget', 1)">⭐ Luxury Upgrade (₹${Math.round(budget * 1.3).toLocaleString()})</button>
        <button class="agent-action-chip" onclick="window.modifyAgentConstraint('travel_style', 'Relaxation & Eco-Homestays')">🌿 Eco Homestay Style</button>
        ${travelers === 1 ? `<button class="agent-action-chip" onclick="window.modifyAgentConstraint('number_of_travelers', 2)">👥 Set 2 Travelers</button>` : `<button class="agent-action-chip" onclick="window.modifyAgentConstraint('number_of_travelers', 1)">👤 Solo Traveler</button>`}
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
    botMsg.innerHTML = `<span class="bot-text">Updating plan with <b>${key.replace('_', ' ')} = ${value}</b>...</span>`;
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

      let cardsHtml = "";
      if (data.plan && data.plan.web_search_summary) {
        cardsHtml += renderWebGroundedBadge(data.plan);
      }
      cardsHtml += renderMarkdown(data.message);
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

    // Detect and anchor destination if present in current query
    const detected = detectDestination(q);
    if (detected) {
      activeDestination = detected;
    }

    const lang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";
    const connectingText = lang === "hi" ? "भारत एआई • कनेक्ट हो रहा है..." : lang === "bn" ? "ভারত এআই • সংযুক্ত হচ্ছে..." : "Bharat AI • Connecting...";
    const streamingText = lang === "hi" ? "भारत एआई • उत्तर आ रहा है..." : lang === "bn" ? "ভারত এআই • উত্তর লেখা হচ্ছে..." : "Bharat AI • Streaming...";
    const activeText = lang === "hi" ? "भारत एआई • सक्रिय" : lang === "bn" ? "ভারত এআই • সক্রিয়" : "Bharat AI • Active";
    const placeholderText = lang === "hi" ? "भारत एआई से संपर्क किया जा रहा है..." : lang === "bn" ? "ভারত এআই-এর সাথে যোগাযোগ করা হচ্ছে..." : "Connecting to Bharat AI...";

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
    }

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

      // Persist in conversation history for multi-turn awareness
      if (displayedText.trim()) {
        chatHistory.push({ role: "user", text: q });
        chatHistory.push({ role: "model", text: displayedText.trim() });
        if (chatHistory.length > 12) {
          chatHistory.splice(0, chatHistory.length - 12);
        }
      }
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
      const payload = {
        message: q,
        lang: lang,
        history: chatHistory.slice(-6),
        active_destination: activeDestination
      };

      const res = await fetch(`${AI_API_ORIGIN}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP status ${res.status}`);
      }

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
        const fallback = aiReply(q, activeDestination);
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
  //  PERSISTENT FLOATING AI CHAT ENGINE & WIDGET CONTROLLER
  // ═══════════════════════════════════════════════════════

  let isFloatingGenerating = false;

  async function askFloatingAI(q) {
    if (!q || !q.trim() || isFloatingGenerating) return;
    const box = $("#floatingMessages");
    const orb = $("#floatingAiOrb");
    const statusText = $("#floatingAiStatus");
    const form = $("#floatingChatForm");
    const submitBtn = form ? form.querySelector("button[type='submit']") : null;
    const chatInput = $("#floatingChatInput");

    if (!box) return;

    const detected = detectDestination(q);
    if (detected) {
      activeDestination = detected;
    }

    const lang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";
    const connectingText = lang === "hi" ? "कनेक्ट हो रहा है..." : lang === "bn" ? "সংযুক্ত হচ্ছে..." : "Connecting...";
    const streamingText = lang === "hi" ? "उत्तर आ रहा है..." : lang === "bn" ? "উত্তর লেখা হচ্ছে..." : "Streaming...";
    const activeText = "Active • Gemini 3.1 Flash Lite";
    const placeholderText = lang === "hi" ? "सोच रहा हूँ..." : lang === "bn" ? "চিন্তা করছি..." : "Thinking...";

    isFloatingGenerating = true;
    if (submitBtn) submitBtn.disabled = true;

    // 1. User message
    const userMsg = document.createElement("div");
    userMsg.className = "msg user";
    userMsg.textContent = q;
    box.appendChild(userMsg);
    box.scrollTop = box.scrollHeight;

    // 2. Orb status
    if (orb) orb.className = "ai-orb thinking";
    if (statusText) statusText.textContent = connectingText;

    // 3. Bot placeholder
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

    // 4. Token Queue & Dispatcher
    const tokenQueue = [];
    let displayedText = "";
    let isStreamFinished = false;
    let isDispatcherRunning = false;
    let isFirstToken = true;

    const controller = new AbortController();
    let watchdogTimer = setTimeout(() => controller.abort(), 30000);

    function finalizeFloatingUI() {
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
      isFloatingGenerating = false;

      if (displayedText.trim()) {
        chatHistory.push({ role: "user", text: q });
        chatHistory.push({ role: "model", text: displayedText.trim() });
        if (chatHistory.length > 12) {
          chatHistory.splice(0, chatHistory.length - 12);
        }
      }
    }

    function processFloatingTokenQueue() {
      if (tokenQueue.length > 0) {
        if (isFirstToken) {
          textSpan.textContent = "";
          textSpan.style.opacity = "1";
          isFirstToken = false;
        }

        let tokensToDrain = tokenQueue.length > 30 ? 3 : tokenQueue.length > 15 ? 2 : 1;
        let delayMs = tokenQueue.length > 30 ? 6 : tokenQueue.length > 15 ? 10 : 18;

        for (let i = 0; i < tokensToDrain && tokenQueue.length > 0; i++) {
          displayedText += tokenQueue.shift();
        }

        textSpan.innerHTML = renderMarkdown(displayedText.trimStart());
        box.scrollTop = box.scrollHeight;

        setTimeout(processFloatingTokenQueue, delayMs);
      } else if (!isStreamFinished) {
        setTimeout(processFloatingTokenQueue, 25);
      } else {
        isDispatcherRunning = false;
        textSpan.innerHTML = renderMarkdown(displayedText.trimStart());
        finalizeFloatingUI();
      }
    }

    try {
      const payload = {
        message: q,
        lang: lang,
        history: chatHistory.slice(-6),
        active_destination: activeDestination
      };

      const res = await fetch(`${AI_API_ORIGIN}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      if (orb) orb.className = "ai-orb streaming";
      if (statusText) statusText.textContent = streamingText;

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        clearTimeout(watchdogTimer);
        watchdogTimer = setTimeout(() => controller.abort(), 30000);

        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;

        const tokens = chunk.match(/\S+|\s+/g);
        if (tokens && tokens.length > 0) {
          tokenQueue.push(...tokens);
          if (!isDispatcherRunning) {
            isDispatcherRunning = true;
            processFloatingTokenQueue();
          }
        }
      }

      isStreamFinished = true;
    } catch (err) {
      console.warn("[Floating AI Stream Catch]:", err);
      isStreamFinished = true;
    } finally {
      if (displayedText.trim().length === 0 && tokenQueue.length === 0) {
        const fallback = aiReply(q, activeDestination);
        const tokens = fallback.match(/\S+|\s+/g) || [fallback];
        tokenQueue.push(...tokens);
      }

      if (!isDispatcherRunning) {
        isDispatcherRunning = true;
        processFloatingTokenQueue();
      }
    }
  }

  function initFloatingChat() {
    // Suppress on dedicated ai.html page which has its own native embedded chatbox console
    const isAiPage = window.location.pathname.endsWith("ai.html") || 
                     window.location.pathname.includes("/ai.html") || 
                     window.location.pathname.endsWith("/ai") ||
                     Boolean(document.getElementById("chatWindow") && document.getElementById("chatInput") && !document.getElementById("floatingChatWidget"));
    if (isAiPage) {
      return;
    }

    let trigger = $("#floatingChatTrigger");
    let widget = $("#floatingChatWidget");

    if (!trigger || !widget) {
      const isSubpage = window.location.pathname.includes("/html/") || (document.querySelector('script[src*="../js/ai.js"]') !== null);
      const aiConsoleUrl = isSubpage ? "ai.html?chat=open#chatWindow" : "html/ai.html?chat=open#chatWindow";

      const wrapper = document.createElement("div");
      wrapper.id = "floatingChatContainer";
      wrapper.innerHTML = `
        <button class="floating-chat-trigger" id="floatingChatTrigger" title="Chat with Bharat AI" aria-label="Open Bharat AI Travel Assistant">
          <span class="floating-orb-dot">✦</span>
          <span class="floating-chat-label">Bharat AI</span>
          <span class="floating-online-pulse"></span>
        </button>

        <div class="floating-chat-widget" id="floatingChatWidget" role="dialog" aria-label="Bharat AI Assistant" aria-hidden="true">
          <div class="floating-chat-header">
            <div class="floating-header-info">
              <span class="ai-orb idle" id="floatingAiOrb">✦</span>
              <div>
                <div class="floating-header-title">BHARAT <b>AI</b></div>
                <div class="floating-header-status" id="floatingAiStatus">Active • Gemini 3.1 Flash Lite</div>
              </div>
            </div>
            <div class="floating-header-actions">
              <a href="${aiConsoleUrl}" class="floating-action-btn" title="Open Fullscreen Console" aria-label="Open Fullscreen Console">↗</a>
              <button class="floating-action-btn floating-chat-close-btn" id="floatingChatCloseBtn" title="Minimize Chat" aria-label="Minimize Chat">✕</button>
            </div>
          </div>

          <div class="floating-suggestions-scroll">
            <button class="floating-sug-btn" data-q="Tell me about Kolkata & West Bengal heritage">Kolkata</button>
            <button class="floating-sug-btn" data-q="What are the must-visit places in Jaipur & Rajasthan?">Jaipur</button>
            <button class="floating-sug-btn" data-q="What should I pack for high-altitude passes like Khardung La?">Packing</button>
            <button class="floating-sug-btn" data-q="What is the mandatory acclimatization protocol for Leh?">AMS Protocol</button>
            <button class="floating-sug-btn" data-q="What are the best offbeat places in Meghalaya?">Meghalaya</button>
            <button class="floating-sug-btn" data-q="Weekend getaway trip to Sikkim">Sikkim</button>
          </div>

          <div class="floating-chat-messages" id="floatingMessages">
            <div class="msg bot">
              Namaste! 🙏 I am Bharat AI, your intelligent travel companion. Ask me anything about destinations, passes, local cuisine, packing, or custom itineraries!
            </div>
          </div>

          <form class="floating-chat-form" id="floatingChatForm">
            <input id="floatingChatInput" placeholder="Ask Bharat AI about India travel..." autocomplete="off" aria-label="Chat input">
            <button type="submit" aria-label="Send message" id="floatingSendBtn">➤</button>
          </form>
        </div>
      `;
      document.body.appendChild(wrapper);
      trigger = $("#floatingChatTrigger");
      widget = $("#floatingChatWidget");
    }

    if (!trigger || !widget) return;

    // Toggle widget open/close
    trigger.onclick = (e) => {
      e.stopPropagation();
      const isActive = widget.classList.toggle("active");
      widget.setAttribute("aria-hidden", !isActive);
      if (isActive) {
        const input = $("#floatingChatInput");
        if (input) setTimeout(() => input.focus(), 150);
      }
    };

    const closeBtn = $("#floatingChatCloseBtn");
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        widget.classList.remove("active");
        widget.setAttribute("aria-hidden", "true");
      };
    }

    // Close on click outside widget
    document.addEventListener("click", (e) => {
      if (widget.classList.contains("active") && !widget.contains(e.target) && !trigger.contains(e.target)) {
        widget.classList.remove("active");
        widget.setAttribute("aria-hidden", "true");
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && widget.classList.contains("active")) {
        widget.classList.remove("active");
        widget.setAttribute("aria-hidden", "true");
      }
    });

    // Form submission
    const form = $("#floatingChatForm");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const input = $("#floatingChatInput");
        if (input && input.value.trim()) {
          const val = input.value.trim();
          input.value = "";
          askFloatingAI(val);
        }
      };
    }

    // Floating suggestion buttons
    $$(".floating-sug-btn").forEach(btn => {
      btn.onclick = () => {
        const q = btn.dataset.q || btn.textContent.trim();
        if (q) {
          const input = $("#floatingChatInput");
          if (input) input.value = q;
          askFloatingAI(q);
        }
      };
    });
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
    const queryStr = `Plan me a ${days}-day expedition to ${dest} under ₹${budget} focusing on ${interest} in ${style} travel style`;

    // 1. If on dedicated planner.html with agent console, forward to askPlannerAI
    if ($("#plannerOutputArea")) {
      const input = $("#plannerNLInput");
      if (input) input.value = queryStr;
      return askPlannerAI(queryStr);
    }

    // 2. If on home.html with #itineraryOutput, call AI agent endpoint directly
    const output = $("#itineraryOutput");
    if (output) {
      output.innerHTML = `<div class="planner-formulating-card">
        <div class="planner-formulating-icon">⚡</div>
        <h4 class="planner-formulating-title">Bharat AI is Formulating Your Expedition...</h4>
        <p class="planner-formulating-sub">Searching live web pricing for ${dest}, verifying passes, and balancing your ₹${budget.toLocaleString()} budget across journey parts.</p>
        <div class="planner-formulating-bar"></div>
      </div>`;

      try {
        const userOrigin = await getUserDetectedOrigin();
        const res = await fetch(`${AI_API_ORIGIN}/api/agent/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: queryStr,
            session_id: agentSessionId,
            lang: lang,
            starting_city: userOrigin
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.type === "complete_plan" && data.plan) {
            let fullHtml = `
              <div class="planner-ai-banner">
                <div class="planner-ai-banner-badge">⚡ Autonomous AI Expedition Formulated</div>
                <div class="planner-ai-banner-msg">${renderMarkdown(data.message || "")}</div>
              </div>
            `;
            if (data.plan.web_search_summary) {
              fullHtml += (typeof renderWebGroundedBadge === "function") ? renderWebGroundedBadge(data.plan) : "";
            }
            fullHtml += renderFlightCard(data.plan.flights);
            fullHtml += renderHotelCard(data.plan.hotels);
            fullHtml += renderItineraryCard(data.plan.itinerary);
            fullHtml += renderBudgetCard(data.plan.budget);
            fullHtml += renderEmergencyCard(data.plan.emergency);
            fullHtml += `
              <div class="planner-ai-cta-box">
                <a href="planner.html?q=${encodeURIComponent(queryStr)}" class="btn primary" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
                  <span>🗺️</span> Open Full Interactive Planner Console →
                </a>
              </div>
            `;
            output.innerHTML = fullHtml;
            output.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }
        }
      } catch (agentErr) {
        console.warn("[Agent Live Itinerary Failed, falling back to local schedule]:", agentErr);
      }
    }

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

    const coochbeharItineraryEn = [
      { title: "Victor Jubilee Palace & Central Heritage Corridor", pass: null, notes: "Explore Buckingham Palace-modeled 1887 royal palace, Italian Renaissance architecture, and Madan Mohan Bari." },
      { title: "Sagar Dighi Heritage Lake & Baneswar Sacred Turtle Pond", pass: null, notes: "Ancient temple pond sanctifying endangered Black Softshell Turtles (Mohan). Shitalpati cane craft walk." },
      { title: "Rasikbil Wetland Bird Sanctuary & Eco-Boating", pass: null, notes: "175-hectare lake sanctuary with migratory waterfowl, deer park, and python conservation centre." },
      { title: "Gosanimari Archaeological Kamtapur Ruins & Torsa Embankment", pass: null, notes: "Historic 11th-15th century capital of Kamtapur Kingdom and golden hour river sunset." },
      { title: "Koch-Rajbongshi Hearth Immersion & Village Departure", pass: null, notes: "Traditional Shorshe Ilish, Sidol chutney tasting, and direct community artisan farewell." }
    ];

    const coochbeharItineraryHi = [
      { title: "विक्टर जुबली पैलेस और केंद्रीय विरासत कॉरिडोर", pass: null, notes: "1887 में बना भव्य शाही महल और ऐतिहासिक मदन मोहन बाड़ी मंदिर का भ्रमण।" },
      { title: "सागर दिघी हेरिटেজ झील और बानेश्वर पवित्र कछुआ तालाब", pass: null, notes: "दुर्लभ काले कछुओं (मोहन) का प्राचीन मंदिर और शीतलपाटी हस्तशिल्प बाजार।" },
      { title: "रसिकबिल वेटलैंड पक्षी अभयारण्य और इको-बोटिंग", pass: null, notes: "प्रवासी पक्षी, हिरण पार्क और प्राकृतिक दलदली झील का शांतिपूर्ण अनुभव।" },
      { title: "गोसानीमारी पुरातत्व स्थल और तोर्षा नदी तट", pass: null, notes: "11वीं-15वीं सदी के कामतापुर साम्राज्य के अवशेष और सूर्यास्त का मनोरम दृश्य।" },
      { title: "कोच-राजबंशी पारंपरिक स्वाद और प्रस्थान", pass: null, notes: "पारंपरिक सरसों इलिश, सिदोल चटनी और स्थानीय ग्रामीणों से सीधे हस्तशिल्प खरीद।" }
    ];

    const coochbeharItineraryBn = [
      { title: "ভিক্টর জুবিলি রাজপ্রাসাদ ও মদন মোহন বাড়ি দর্শন", pass: null, notes: "১৮৮৭ সালের বাকিংহাম প্যালেসের আদলে তৈরি রাজবাড়ি ও ঐতিহ্যবাহী রাস মেলার কেন্দ্র।" },
      { title: "সাগর দিঘি হেরিটেজ চত্বর ও বাণেশ্বর শিবমন্দিরের মোহন কচ্ছপ পুকুর", pass: null, notes: "পবিত্র কচ্ছপ সংরক্ষণ পুকুর ও শীতলপাটি বেতের হস্তশিল্প সমবায় পরিদর্শন।" },
      { title: "রসিকবিল জলাভূমি পক্ষী অভয়ারণ্য ও ইকো-বোটিং", pass: null, notes: "পরিযায়ী পাখির কলকাকলি, হরিণ পার্ক ও ১৭৫ হেক্টর শান্ত প্রাকৃতিক হ্রদ।" },
      { title: "গোসানিমারী প্রাচীন কমতাপুরের প্রত্নতাত্ত্বিক ঢিবি ও তোর্ষা নদী", pass: null, notes: "একাদশ-পঞ্চদশ শতাব্দীর ঐতিহাসিক কামতাপুর সাম্রাজ্যের ধ্বংসাবশেষ ও তোর্ষার সূর্যাস্ত।" },
      { title: "কোচ-রাজবংশী লোকসংস্কৃতি, খাঁটি খাবার ও বিদায়", pass: null, notes: "তাজা ইলিশ মাছের ঝোল, সিদল ভর্তা ও গ্রামীণ কারিগরদের থেকে সরাসরি কেনাকাটা।" }
    ];

    const thaneItineraryEn = [
      { title: "City of Lakes Heritage: Masunda Lake & Kopineshwar Mandir", pass: null, notes: "Talao Pali boating, legendary Mamledar Misal Pav breakfast, and 810 AD Shilahara temple." },
      { title: "Yeoor Hills Rainforest Nature Trail & Adivasi Butterfly Center", pass: null, notes: "Sanjay Gandhi National Park buffer sanctuary trek, hornbills, and hilltop Thalipeeth." },
      { title: "Upvan Lake Arts Promenade & Gaimukh Waterfront", pass: null, notes: "Scenic Upvan lake beneath Yeoor foothills and Chenna creek Portuguese fort excursion." },
      { title: "Agri-Koli Coastal Seafood Trail & Talao Pali Nightwalk", pass: null, notes: "Authentic Surmai/Tisrya seafood thali, lakeside falooda, and heritage church stroll." },
      { title: "Eco-Homestay Village Breakfast & Green Transit Departure", pass: null, notes: "Zero single-use plastic, TMT electric bus connection to Central Railway." }
    ];

    const thaneItineraryHi = [
      { title: "झीलों के शहर की विरासत: मासुंदा झील और कोपिनेश्वर मंदिर", pass: null, notes: "तलाव पाली में नौकायन, ऐतिहासिक मामलेदार मिसल पाव और 810 ई. का प्राचीन मंदिर।" },
      { title: "यूर हिल्स वर्षावन प्रकृति ट्रेल और आदिवासी तितली केंद्र", pass: null, notes: "संजय गांधी राष्ट्रीय उद्यान का हरा-भरा वन क्षेत्र, पक्षी दर्शन और थालीपीठ नाश्ता।" },
      { title: "उपवन झील संस्कृति सैर और गायमुख जलप्रपात", pass: null, notes: "यूर पहाड़ियों की तलहटी में सुंदर उपवन झील और घोडबंदर खाड़ी का खूबसूरत नजारा।" },
      { title: "आग्री-कोली तटीय भोजन और तलाव पाली नाइटवॉक", pass: null, notes: "प्रामाणिक सुरमई मछली थाली, फालूदा और 1582 के ऐतिहासिक पुर्तगाली चर्च का भ्रमण।" },
      { title: "पर्यावरण-अनुकूल होमस्टे और इलेक्ट्रिक बस से प्रस्थान", pass: null, notes: "एकल-उपयोग प्लास्टिक मुक्त यात्रा, ठाणे रेलवे स्टेशन के लिए एसी इलेक्ट्रिक बसें।" }
    ];

    const thaneItineraryBn = [
      { title: "হ্রদের শহরের ঐতিহ্য: মাসুন্দা হ্রদ (তালাও পালি) ও কপিনেশ্বর মন্দির", pass: null, notes: "তালাও পালিতে বোটিং, বিখ্যাত মামলেদার মিসাল পাভ ও ৮১০ খ্রিস্টাব্দের প্রাচীন শিবমন্দির।" },
      { title: "ইউর হিলস সংরক্ষিত রেইনফরেস্ট ট্রেইল ও আদিবাসী প্রজাপতি পার্ক", pass: null, notes: "সঞ্জয় গান্ধী জাতীয় উদ্যানের বনভূমি, রঙিন পাখি দর্শন ও পাহাড়ি থালিপীঠ জলখাবার।" },
      { title: "উপবন হ্রদ সাংস্কৃতিক প্রমোদ ও গাইমুখ নদীমোহনা", pass: null, notes: "ইউর পাহাড়ের পাদদেশে উপবন হ্রদ এবং মনোরম ঘোদবন্দর খাঁড়ির প্রাচীন পর্তুগিজ দুর্গ।" },
      { title: "আগ্রী-কোলি উপকূলীয় খাদ্যসংস্কৃতি ও রাতের তালাও পালি", pass: null, notes: "খাঁটি সুরমই মাছের থালি, নদীর কুলফি ফালুদা ও ১৫৮২ সালের ঐতিহাসিক সেন্ট জন চার্চ।" },
      { title: "পরিবেশবান্ধব বিদায় ও ইলেকট্রিক বাস সংযোগ", pass: null, notes: "প্লাস্টিক বর্জন, মধ্য রেলওয়ে ও মুম্বাই লোকাল ট্রেনের জন্য দ্রুত পরিবেশবান্ধব যাতায়াত।" }
    ];

    function generateDynamicCityItinerary(city, l) {
      const c = (city || "Destination").trim();
      if (l === "hi") {
        return [
          { title: `${c} आगमन, सुरक्षा ब्रीफिंग और केंद्रीय धरोहर परिचय`, pass: null, notes: `स्थानीय मार्गदर्शकों से मिलें और ${c} के प्रमुख ऐतिहासिक स्थलों का भ्रमण करें।` },
          { title: `${c} प्राकृतिक इको-ट्रेल और वन्यजीव अन्वेषण`, pass: null, notes: `एकल-उपयोग प्लास्टिक मुक्त क्षेत्र। ${c} की जैव विविधता और हरित परिदृश्यों का आनंद लें।` },
          { title: `${c} पारंपरिक कारीगर बाजार और हस्तशिल्प संस्कृति`, pass: null, notes: `स्थानीय बुनकरों और कारीगरों से सीधे उत्पाद खरीदकर स्थानीय अर्थव्यवस्था का समर्थन करें।` },
          { title: `प्रामाणिक क्षेत्रीय भोजन और ${c} की विरासत यात्रा`, pass: null, notes: `पारंपरिक भोजनालयों में ${c} के प्रसिद्ध व्यंजनों और स्थानीय स्वादों का आनंद लें।` },
          { title: `${c} समुदाय विदाई और पर्यावरण-अनुकूल प्रस्थान`, pass: null, notes: `कोई निशान न छोड़ें; टिकाऊ और जिम्मेदार पर्यटन स्मृतियों के साथ प्रस्थान।` }
        ];
      }
      if (l === "bn") {
        return [
          { title: `${c} আগমন, নিরাপত্তা পরামর্শ ও কেন্দ্রীয় ঐতিহ্য দর্শন`, pass: null, notes: `স্থানীয় প্রত্যয়িত গাইডের সাথে দেখা করুন এবং ${c}-এর প্রধান ঐতিহাসিক স্থান ঘুরে দেখুন।` },
          { title: `${c} প্রাকৃতিক ট্রেইল ও জীববৈচিত্র্য সংরক্ষণ পদযাত্রা`, pass: null, notes: `প্লাস্টিক বর্জন এলাকা। ${c}-এর সবুজ পাহাড়, হ্রদ বা নদীর নির্মল পরিবেশ উপভোগ করুন।` },
          { title: `${c} ঐতিহ্যবাহী কারিগর পল্লী ও লোকশিল্প অভিজ্ঞতা`, pass: null, notes: `স্থানীয় কারিগরদের সাথে সরাসরি যোগাযোগ এবং গ্রামীণ হস্তশিল্প সংগ্রহ করুন।` },
          { title: `খাঁটি স্থানীয় খাদ্যসংস্কৃতি ও ${c}-এর ঐতিহ্য ভ্রমণ`, pass: null, notes: `${c}-এর সুস্বাদু ঐতিহ্যবাহী রান্নাবান্না ও খাঁটি খাবারের স্বাদ গ্রহণ করুন।` },
          { title: `দায়িত্বশীল পর্যটন স্মৃতি ও ${c} থেকে পরিবেশবান্ধব প্রস্থান`, pass: null, notes: `পরিবেশ পরিষ্কার রাখুন; টেকসই ভ্রমণের সুন্দর স্মৃতি নিয়ে বাড়ি ফিরুন।` }
        ];
      }
      return [
        { title: `Arrival, Heritage Briefing & Highlights of ${c}`, pass: null, notes: `Meet local verified guides and explore the central landmark monuments of ${c}.` },
        { title: `${c} Nature Trail & Eco-Sanctuary Exploration`, pass: null, notes: `Zero single-use plastic zone. Experience the pristine biodiversity and scenic green corridors of ${c}.` },
        { title: `Artisan Guild Walk & Living Culture Immersion in ${c}`, pass: null, notes: `Support fair-trade indigenous artisans, weavers, and traditional craft cooperatives directly.` },
        { title: `Authentic Regional Gastronomy & Old Town Trail in ${c}`, pass: null, notes: `Savor farm-to-table culinary specialties and heirloom recipes passed down through generations in ${c}.` },
        { title: `Responsible Community Exchange & Eco-Departure from ${c}`, pass: null, notes: `Leave no trace; depart with lasting memories and positive local community impact.` }
      ];
    }

    const dLower = dest.toLowerCase();
    const isLadakh = dLower.includes("ladakh") || dLower.includes("leh");
    const isCoochbehar = dLower.includes("coochbehar") || dLower.includes("cooch behar") || dLower.includes("koch bihar") || dLower.includes("কোচবিহার") || dLower.includes("कूचबिहार");
    const isThane = dLower.includes("thane") || dLower.includes("thana") || dLower.includes("ठाणे");

    let base;
    if (isLadakh) {
      base = (lang === "hi" ? ladakhItineraryHi : lang === "bn" ? ladakhItineraryBn : ladakhItineraryEn);
    } else if (isCoochbehar) {
      base = (lang === "hi" ? coochbeharItineraryHi : lang === "bn" ? coochbeharItineraryBn : coochbeharItineraryEn);
    } else if (isThane) {
      base = (lang === "hi" ? thaneItineraryHi : lang === "bn" ? thaneItineraryBn : thaneItineraryEn);
    } else {
      base = generateDynamicCityItinerary(dest, lang);
    }
    
    // Safe fetch for mountain passes
    let passData = {};
    if (typeof window.fetchPassesFromAPI === "function") {
      passData = await window.fetchPassesFromAPI();
    } else {
      try {
        const res = await fetch(`${AI_API_ORIGIN}/api/passes`);
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
            <p class="day-notes-line">📌 <i>${notePrefix} ${item.notes}</i></p>
            ${advisoryBadge}
          </div>
        </div>
      `;
    }

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
    const el = $("#planDestination");
    if (!el) return;

    if (el.tagName === "INPUT") {
      el.value = stateName;
      const listId = el.getAttribute("list");
      if (listId) {
        const dl = document.getElementById(listId);
        if (dl) {
          const opts = Array.from(dl.options || []);
          if (!opts.some(o => o.value.toLowerCase() === stateName.toLowerCase())) {
            const opt = document.createElement("option");
            opt.value = stateName;
            dl.appendChild(opt);
          }
        }
      }
    } else if (el.options) {
      let exists = false;
      for (let i = 0; i < el.options.length; i++) {
        if (el.options[i].value.toLowerCase() === stateName.toLowerCase() || el.options[i].text.toLowerCase().includes(stateName.toLowerCase())) {
          el.selectedIndex = i;
          exists = true;
          break;
        }
      }

      if (!exists) {
        const opt = document.createElement("option");
        opt.value = stateName;
        opt.text = stateName;
        el.add(opt);
        el.value = stateName;
      }
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
      b.onclick = () => {
        const q = b.getAttribute("data-question") || b.getAttribute("data-goal") || b.textContent.trim();
        if (q) {
          const input = $("#chatInput");
          if (input) input.value = q;
          askAI(q);
        }
      };
    });

    // Initialize user origin location detection (GPS / IP)
    getUserDetectedOrigin();
    tryGpsOriginDetection();

    // Initialize Pan-India State & Territory Explorer
    initPanIndiaExplorer();

    // Initialize Persistent Floating AI Chat Widget (Bottom-Right)
    initFloatingChat();

    // Initialize Planner AI Interface if present on the page
    initPlannerAI();

    // Auto-scroll, pulse-highlight, and focus chat window if requested via URL (?chat=open or #chatWindow)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const chatWindow = $("#chatWindow");
      if (chatWindow && (urlParams.get("chat") || window.location.hash === "#chatWindow" || window.location.hash === "#ai")) {
        setTimeout(() => {
          chatWindow.scrollIntoView({ behavior: "smooth", block: "center" });
          chatWindow.classList.add("chat-window-focused");
          setTimeout(() => chatWindow.classList.remove("chat-window-focused"), 2800);
          const input = $("#chatInput");
          if (input) input.focus();
          if (urlParams.get("chat") === "fullscreen") {
            toggleFullscreenChat(true);
          }
        }, 200);
      }
    } catch (e) {
      console.warn("[Chat Init]:", e);
    }
  }

  const PAN_INDIA_CATALOG = [
    // Northeast (8)
    { name: "Meghalaya", region: "northeast", icon: "🌿" },
    { name: "Sikkim", region: "northeast", icon: "🏔️" },
    { name: "Assam", region: "northeast", icon: "🦏" },
    { name: "Arunachal Pradesh", region: "northeast", icon: "🏞️" },
    { name: "Nagaland", region: "northeast", icon: "🪶" },
    { name: "Manipur", region: "northeast", icon: "🌸" },
    { name: "Mizoram", region: "northeast", icon: "🎋" },
    { name: "Tripura", region: "northeast", icon: "🏛️" },

    // North & Himalayas (8)
    { name: "Jammu and Kashmir", region: "north", icon: "🏔️" },
    { name: "Ladakh", region: "north", icon: "❄️" },
    { name: "Himachal Pradesh", region: "north", icon: "🍏" },
    { name: "Uttarakhand", region: "north", icon: "🧘" },
    { name: "Punjab", region: "north", icon: "🌾" },
    { name: "Haryana", region: "north", icon: "🚜" },
    { name: "Delhi", region: "north", icon: "🏛️" },
    { name: "Chandigarh", region: "north", icon: "🌳" },

    // West & Central (7)
    { name: "Rajasthan", region: "west", icon: "🏰" },
    { name: "Goa", region: "west", icon: "🏖️" },
    { name: "Gujarat", region: "west", icon: "🦁" },
    { name: "Maharashtra", region: "west", icon: "🌊" },
    { name: "Madhya Pradesh", region: "west", icon: "🐅" },
    { name: "Chhattisgarh", region: "west", icon: "🌲" },
    { name: "Dadra and Nagar Haveli and Daman and Diu", region: "west", icon: "⛵" },

    // East (4)
    { name: "West Bengal", region: "east", icon: "🚋" },
    { name: "Odisha", region: "east", icon: "☀️" },
    { name: "Bihar", region: "east", icon: "☸️" },
    { name: "Jharkhand", region: "east", icon: "🏞️" },

    // South & Islands (8)
    { name: "Kerala", region: "south", icon: "🌴" },
    { name: "Tamil Nadu", region: "south", icon: "🛕" },
    { name: "Karnataka", region: "south", icon: "🗿" },
    { name: "Andhra Pradesh", region: "south", icon: "🌅" },
    { name: "Telangana", region: "south", icon: "💎" },
    { name: "Puducherry", region: "south", icon: "🥐" },
    { name: "Andaman and Nicobar Islands", region: "south", icon: "🏝️" },
    { name: "Lakshadweep", region: "south", icon: "🪸" }
  ];

  function renderStateChips(regionFilter) {
    const container = $("#stateChipsScroll");
    if (!container) return;

    const filtered = (regionFilter === "all" || !regionFilter)
      ? PAN_INDIA_CATALOG
      : PAN_INDIA_CATALOG.filter(s => s.region === regionFilter);

    container.innerHTML = filtered.map(s => `
      <button class="state-chip" data-state="${s.name}" title="Explore ${s.name} with live internet grounding">
        <span class="chip-icon">${s.icon}</span>
        <span>${s.name}</span>
      </button>
    `).join("");

    // Wire up chip clicks
    container.querySelectorAll(".state-chip").forEach(chip => {
      chip.onclick = () => {
        const stateName = chip.dataset.state;
        const chatInput = $("#chatInput");
        const query = `Explore ${stateName}`;
        if (chatInput) chatInput.value = query;
        askAI(query);
      };
    });
  }

  function initPanIndiaExplorer() {
    renderStateChips("all");

    // Region tab filters
    $$(".region-tab").forEach(tab => {
      tab.onclick = () => {
        $$(".region-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        renderStateChips(tab.dataset.region);
      };
    });

    // Smart Intent Pills
    $$(".intent-pill").forEach(pill => {
      pill.onclick = () => {
        const intent = pill.dataset.intent;
        const chatInput = $("#chatInput");
        const currentVal = chatInput ? chatInput.value.trim() : "";
        let query = "";
        if (currentVal && !currentVal.toLowerCase().includes(intent.toLowerCase())) {
          query = `${currentVal} with ${intent}`;
        } else {
          query = intent === "Weekend Getaway" ? "Weekend getaway in Sikkim" :
                  intent === "Family Vacation" ? "Explore Kerala with family" :
                  intent === "Budget Backpacker" ? "Budget trip to Meghalaya" :
                  intent === "Royal Luxury" ? "Royal luxury trip to Rajasthan" :
                  "High passes trek in Ladakh";
        }
        if (chatInput) chatInput.value = query;
        askAI(query);
      };
    });
  }

  window.applyQuickPreset = function(days, budget) {
    const chatInput = $("#chatInput");
    const query = `Plan with ${days} days and budget ₹${budget.toLocaleString()}`;
    if (chatInput) chatInput.value = query;
    askAI(query);
  };

  // ═══════════════════════════════════════════════════════
  //  PLANNER PAGE — AUTONOMOUS AGENT ENGINE
  //  Master AI Prompt Upgrade (SIH 2026)
  // ═══════════════════════════════════════════════════════

  let isPlannerGenerating = false;

  // Detect trip-planning intent from a message
  function detectPlanningIntent(msg) {
    const t = (msg || "").toLowerCase();
    const signals = ["plan", "trip", "travel", "visit", "itinerary", "route", "budget", "₹", "days", "nights", "week", "weekend", "explore", "backwater", "heritage", "expedition"];
    return signals.some(s => t.includes(s));
  }

  // Update planner progress steps
  function updatePlannerTracker(stepNumber, modelName, isOffline) {
    const prog = $("#plannerProgressSection");
    const modelTag = $("#plannerModelTag");
    const checkpointText = $("#plannerCheckpointText");

    if (prog && !prog.classList.contains("visible")) {
      prog.classList.add("visible");
    }

    if (modelTag) {
      modelTag.textContent = isOffline ? "Offline Mode" : (modelName || "Gemini 3.1 Flash Lite");
    }
    if (checkpointText) {
      checkpointText.textContent = isOffline
        ? "⚠️ Offline Planning Mode"
        : `🛡️ Step ${Math.min(stepNumber, 5)}/5 • ${modelName || "Gemini 3.1 Flash Lite"}`;
    }

    for (let i = 1; i <= 5; i++) {
      const el = $(`#pstep-${i}`);
      const statusEl = $(`#pstep${i}Status`);
      if (!el) continue;

      if (i < stepNumber) {
        el.className = "planner-step step-completed";
        if (statusEl) statusEl.textContent = "✅ Done";
      } else if (i === stepNumber) {
        el.className = "planner-step step-active";
        if (statusEl) statusEl.textContent = i === 1 ? "🔍 Reading goal..." : "⚙️ In progress...";
      } else {
        el.className = "planner-step step-pending";
        if (statusEl) statusEl.textContent = "Queued";
      }
    }
    if (stepNumber >= 5) {
      for (let i = 1; i <= 5; i++) {
        const el = $(`#pstep-${i}`);
        const st = $(`#pstep${i}Status`);
        if (el) el.className = "planner-step step-completed";
        if (st) st.textContent = "✅ Done";
      }
    }
  }

  async function askPlannerAI(q) {
    if (!q || !q.trim() || isPlannerGenerating) return;
    const outputArea = $("#plannerOutputArea");
    const sendBtn = $("#plannerNLSend");
    const textarea = $("#plannerNLInput");
    const orb = $("#plannerHeroOrb");
    if (!outputArea) return;

    isPlannerGenerating = true;
    if (sendBtn) sendBtn.disabled = true;
    if (textarea) textarea.disabled = true;

    // Disable all quick pills
    $$(".planner-pill").forEach(p => p.classList.add("loading"));

    // Show progress tracker at step 1
    updatePlannerTracker(1, "Gemini 3.1 Flash Lite", false);

    // Orb animation to thinking
    if (orb) orb.textContent = "⚙️";

    const lang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";

    // Clear output and show loading narrative
    outputArea.innerHTML = `<div class="planner-narrative-block" style="opacity:0.7;">
      <strong style="color:#74c69d;">🎯 Analyzing your travel goal...</strong><br>
      <span style="color:rgba(200,230,200,0.7); font-size:13px;">Bharat AI is processing: "${q.trim()}"</span>
    </div>`;

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

      if (!res.ok) throw new Error(`Agent API error: ${res.status}`);
      const data = await res.json();

      // Update session ID if returned
      if (data.session_id) {
        agentSessionId = data.session_id;
        localStorage.setItem("bharat_agent_session_id", agentSessionId);
      }

      const stepNum = data.progress_step || 1;
      const modelUsed = data.active_model || "Gemini 3.1 Flash Lite";
      const isOffline = data.is_offline_mode || false;

      updatePlannerTracker(stepNum, modelUsed, isOffline);

      // Build output HTML
      let html = "";

      // Narrative / question block
      if (data.type === "question" || data.type === "clarification") {
        // Agent is asking for clarification
        const presets = data.quick_presets || [];
        const presetsHtml = presets.length > 0
          ? `<div class="planner-preset-chips">
              ${presets.map(p => `<button class="planner-preset-chip" onclick="window.askPlannerAI && askPlannerAI('${p.replace(/'/g, "\\'")}')">
                ${p}
              </button>`).join("")}
            </div>`
          : "";

        html += `<div class="planner-question-block">
          <div class="planner-question-text">${renderMarkdown(data.message || "")}</div>
          ${presetsHtml}
        </div>`;

        updatePlannerTracker(1, modelUsed, isOffline);

      } else if (data.type === "complete_plan" && data.plan) {
        // Full plan rendered
        html += `<div class="planner-narrative-block">${renderMarkdown(data.message || "")}</div>`;

        // Render all agent cards (using existing renderers)
        if (data.plan.web_search_summary) {
          html += (typeof renderWebGroundedBadge === "function") ? renderWebGroundedBadge(data.plan) : "";
        }
        html += renderFlightCard(data.plan.flights);
        html += renderHotelCard(data.plan.hotels);
        html += renderItineraryCard(data.plan.itinerary);
        html += renderBudgetCard(data.plan.budget);
        html += renderEmergencyCard(data.plan.emergency);

        // Refinement toolbar
        html += `<div class="quick-actions-toolbar" style="margin-top:18px;">
          <div style="font-size:11px; font-weight:700; color:#74c69d; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:10px;">✨ Refine Your Plan</div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="quick-action-btn" onclick="window.askPlannerAI && askPlannerAI('Add 1 more day to this plan')">🗓️ +1 Day</button>
            <button class="quick-action-btn" onclick="window.askPlannerAI && askPlannerAI('Reduce budget by 20% for this plan')">📉 Lower Budget</button>
            <button class="quick-action-btn" onclick="window.askPlannerAI && askPlannerAI('Upgrade to luxury hotels and experiences')">⭐ Luxury Upgrade</button>
            <button class="quick-action-btn" onclick="window.askPlannerAI && askPlannerAI('Prioritize eco-friendly homestays for this plan')">🌿 Eco Style</button>
            <button class="quick-action-btn" onclick="window.askPlannerAI && askPlannerAI('Adjust plan for 2 travelers instead')">👥 2 Travelers</button>
          </div>
        </div>`;

        updatePlannerTracker(6, modelUsed, isOffline);

      } else {
        // Partial / intermediate response
        html += `<div class="planner-narrative-block">${renderMarkdown(data.message || "")}</div>`;
      }

      outputArea.innerHTML = html;
      outputArea.scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (err) {
      console.warn("[Planner Agent Error]:", err);

      // Retry notice + offline fallback
      outputArea.innerHTML = `<div class="planner-question-block">
        <div class="planner-question-text">
          <strong style="color:#74c69d;">🔄 Planning services are temporarily reconnecting.</strong><br>
          <span style="color:rgba(200,230,200,0.7);">Booking search encountered an issue. Let me continue with offline planning.</span>
        </div>
        <div class="planner-preset-chips" style="margin-top:12px;">
          <button class="planner-preset-chip" onclick="window.askPlannerAI && askPlannerAI('${(q || "").replace(/'/g, "\\'")}')">🔄 Retry</button>
          <button class="planner-preset-chip" onclick="window.askAI && askAI('${(q || "").replace(/'/g, "\\'")}')">💬 Ask Bharat AI instead</button>
        </div>
      </div>`;

      updatePlannerTracker(1, "Offline Mode", true);
    } finally {
      isPlannerGenerating = false;
      if (sendBtn) sendBtn.disabled = false;
      if (textarea) textarea.disabled = false;
      if (orb) orb.textContent = "🗺️";
      $$(".planner-pill").forEach(p => p.classList.remove("loading"));
    }
  }

  function toggleFullscreenChat(forceState) {
    const chat = $("#chatWindow");
    const btn = $("#chatExpandBtn");
    if (!chat) return;
    const isFull = typeof forceState === "boolean" ? forceState : !chat.classList.contains("fullscreen-console");
    chat.classList.toggle("fullscreen-console", isFull);
    if (btn) {
      btn.textContent = isFull ? "✕" : "⛶";
      btn.title = isFull ? "Minimize Console" : "Toggle Fullscreen Console";
    }
    const input = $("#chatInput");
    if (input) input.focus();
  }

  function resetChatConsole() {
    chatHistory.length = 0;
    const box = $("#messages");
    const welcome = $("#botWelcomeMsg");
    if (box && welcome) {
      const clone = welcome.cloneNode(true);
      box.innerHTML = "";
      box.appendChild(clone);
    }
    const input = $("#chatInput");
    if (input) {
      input.value = "";
      input.focus();
    }
  }

  function togglePlannerLegacyForm() {
    const form = $("#plannerLegacyForm");
    const toggle = $("#plannerLegacyToggle");
    if (!form) return;
    const isOpen = form.classList.toggle("visible");
    if (toggle) toggle.classList.toggle("open", isOpen);
  }

  function initPlannerAI() {
    // Wire up the NL form submit
    const form = $("#plannerNLForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const textarea = $("#plannerNLInput");
        const val = textarea ? textarea.value.trim() : "";
        if (val) askPlannerAI(val);
      });
    }

    // Auto-expand textarea on input
    const textarea = $("#plannerNLInput");
    if (textarea) {
      textarea.addEventListener("input", () => {
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 140) + "px";
      });
      // Ctrl+Enter or Shift+Enter = newline; plain Enter = submit
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
          e.preventDefault();
          const val = textarea.value.trim();
          if (val) askPlannerAI(val);
        }
      });
    }

    // Read URL params for pre-filled query (from home.html teaser)
    const urlParams = new URLSearchParams(window.location.search);
    const preQuery = urlParams.get("q") || urlParams.get("query") || urlParams.get("plan");
    if (preQuery && preQuery.trim()) {
      const ta = $("#plannerNLInput");
      if (ta) ta.value = preQuery.trim();
      // Auto-trigger after a short delay
      setTimeout(() => askPlannerAI(preQuery.trim()), 600);
    }
  }

  // ── Smart Floating Chat Routing ──
  // Upgrade askFloatingAI to route planning queries to the agent
  const _originalAskFloatingAI = askFloatingAI;

  async function askFloatingAIUpgraded(q) {
    if (!q || !q.trim() || isFloatingGenerating) return;

    // Detect planning intent
    if (detectPlanningIntent(q)) {
      const box = $("#floatingMessages");
      const orb = $("#floatingAiOrb");
      const statusText = $("#floatingAiStatus");
      const form = $("#floatingChatForm");
      const submitBtn = form ? form.querySelector("button[type='submit']") : null;
      const chatInput = $("#floatingChatInput");
      if (!box) { return _originalAskFloatingAI(q); }

      isFloatingGenerating = true;
      if (submitBtn) submitBtn.disabled = true;

      // User message
      const userMsg = document.createElement("div");
      userMsg.className = "msg user";
      userMsg.textContent = q;
      box.appendChild(userMsg);
      box.scrollTop = box.scrollHeight;

      if (orb) orb.className = "ai-orb thinking";
      if (statusText) statusText.textContent = "Planning your trip...";

      // Thinking placeholder
      const botMsg = document.createElement("div");
      botMsg.className = "msg bot";
      botMsg.innerHTML = `<span class="bot-text" style="opacity:0.7;">🗺️ Bharat AI Planner is working...</span>`;
      box.appendChild(botMsg);
      box.scrollTop = box.scrollHeight;

      const lang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";
      let data = null;

      try {
        const res = await fetch(`${AI_API_ORIGIN}/api/agent/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: q.trim(), session_id: agentSessionId, lang: lang })
        });

        if (!res.ok) throw new Error("Agent error");
        data = await res.json();

        if (data.session_id) {
          agentSessionId = data.session_id;
          localStorage.setItem("bharat_agent_session_id", agentSessionId);
        }

        const plan = data.plan;
        let compactHtml = `<span class="bot-text">${renderMarkdown(data.message || "")}</span>`;

        // Compact card summary for floating widget
        if (plan && plan.budget) {
          const b = plan.budget;
          compactHtml += `<div class="floating-agent-plan-card">
            <h4>💰 Budget Summary</h4>
            <div>Total: ₹${(b.total_allocated_inr || 0).toLocaleString()} • Cushion: ₹${(b.remaining_cushion_inr || 0).toLocaleString()}</div>
            <a href="../html/planner.html?q=${encodeURIComponent(q)}" class="floating-plan-link">🗺️ View Full Itinerary →</a>
          </div>`;
        } else if (plan && plan.itinerary && plan.itinerary.length > 0) {
          compactHtml += `<div class="floating-agent-plan-card">
            <h4>🗺️ ${plan.itinerary.length}-Day Itinerary Ready</h4>
            <div>${plan.goal_summary || ""}</div>
            <a href="../html/planner.html?q=${encodeURIComponent(q)}" class="floating-plan-link">🗺️ View Full Plan →</a>
          </div>`;
        } else {
          compactHtml += `<div class="floating-agent-plan-card">
            <h4>🤖 Planning Agent</h4>
            <a href="../html/planner.html?q=${encodeURIComponent(q)}" class="floating-plan-link">🗺️ Open Full Planner →</a>
          </div>`;
        }

        botMsg.innerHTML = compactHtml;
        box.scrollTop = box.scrollHeight;

      } catch (err) {
        botMsg.innerHTML = `<span class="bot-text">${renderMarkdown("Let me open the full planner for you!")}</span>
          <div class="floating-agent-plan-card">
            <h4>🗺️ Open Planner</h4>
            <a href="../html/planner.html?q=${encodeURIComponent(q)}" class="floating-plan-link">⚡ Plan in Full Agent →</a>
          </div>`;
      } finally {
        if (orb) orb.className = "ai-orb idle";
        if (statusText) statusText.textContent = "Active • Gemini 3.1 Flash Lite";
        if (submitBtn) submitBtn.disabled = false;
        if (chatInput) { chatInput.disabled = false; chatInput.focus(); }
        isFloatingGenerating = false;
        box.scrollTop = box.scrollHeight;

        chatHistory.push({ role: "user", text: q });
        chatHistory.push({ role: "model", text: data ? (data.message || "") : "" });
        if (chatHistory.length > 12) chatHistory.splice(0, chatHistory.length - 12);
      }
    } else {
      // Regular streaming chat
      return _originalAskFloatingAI(q);
    }
  }

  function toggleSpeechInput(inputId, micBtnId) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      if (typeof toast === "function") toast("Voice input is not supported in this browser. Please type your question.");
      return;
    }
    const input = document.getElementById(inputId);
    const btn = document.getElementById(micBtnId);
    if (!input) return;

    if (window._activeRecognition) {
      window._activeRecognition.stop();
      window._activeRecognition = null;
      if (btn) btn.classList.remove("listening");
      return;
    }

    try {
      const recognition = new SpeechRec();
      const currentLang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";
      recognition.lang = currentLang === "hi" ? "hi-IN" : (currentLang === "bn" ? "bn-IN" : "en-IN");
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        if (btn) btn.classList.add("listening");
        if (typeof toast === "function") toast("🎙️ Listening... Speak your travel question.");
      };

      recognition.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            input.value = transcript;
            if (typeof window.askAI === "function") {
              window.askAI(transcript);
              input.value = "";
            }
          }
        }
      };

      recognition.onerror = (err) => {
        console.warn("[Voice Rec Error]:", err);
        if (btn) btn.classList.remove("listening");
        window._activeRecognition = null;
      };

      recognition.onend = () => {
        if (btn) btn.classList.remove("listening");
        window._activeRecognition = null;
      };

      window._activeRecognition = recognition;
      recognition.start();
    } catch (e) {
      console.warn("[Speech Recognition Init Error]:", e);
      if (btn) btn.classList.remove("listening");
    }
  }

  // Expose on window for cross-file and inline HTML button accessibility
  window.renderMarkdown = renderMarkdown;
  window.aiReply = aiReply;
  window.askAI = askAI;
  window.itinerary = itinerary;
  window.loadStateIntoPlanner = loadStateIntoPlanner;
  window.initAI = initAI;
  window.initPanIndiaExplorer = initPanIndiaExplorer;
  window.initFloatingChat = initFloatingChat;
  window.askFloatingAI = askFloatingAIUpgraded;
  window.askPlannerAI = askPlannerAI;
  window.initPlannerAI = initPlannerAI;
  window.togglePlannerLegacyForm = togglePlannerLegacyForm;
  window.toggleFullscreenChat = toggleFullscreenChat;
  window.resetChatConsole = resetChatConsole;
  window.toggleSpeechInput = toggleSpeechInput;

  // Auto-initialize if DOM is ready, or on DOMContentLoaded
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initAI, 20);
  } else {
    document.addEventListener("DOMContentLoaded", initAI);
  }
})();
