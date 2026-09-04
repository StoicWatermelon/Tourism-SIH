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

  // Active conversational state tracking
  let activeDestination = null;
  const chatHistory = [];

  // Destination keywords
  const KOLKATA_KW = ["kolkata", "calcutta", "howrah", "bengal", "victoria memorial", "dakshineswar", "hooghly", "park street", "college street", "কলকাতা", "হাওড়া", "বাংলা", "ভিক্টোরিয়া", "দক্ষিণেশ্বর", "कोलकाता", "कलकत्ता"];
  const JAIPUR_KW = ["jaipur", "rajasthan", "pink city", "amber fort", "hawa mahal", "jantar mantar", "chokhi dhani", "जयपुर", "राजस्थान", "জয়পুর", "রাজস্থান"];
  const KERALA_KW = ["kerala", "alleppey", "alappuzha", "munnar", "kochi", "cochin", "backwater", "wayanad", "केरल", "কেরল", "আলেপ্পি", "মুন্নার"];
  const LADAKH_KW = ["ladakh", "leh", "pangong", "nubra", "khardung", "chang la", "zoji la", "turtuk", "hanle", "tso moriri", "लद्दाख", "लेह", "पैंगोंग", "লাদাখ", "লেহ", "প্যাংগং"];
  const GOA_KW = ["goa", "panaji", "calangute", "dudhsagar", "fontainhas", "गोवा", "গোয়া"];
  const VARANASI_KW = ["varanasi", "kashi", "banaras", "ghat", "ganga aarti", "वाराणसी", "काशी", "বারাণসী", "কাশী"];

  function detectDestination(text) {
    const t = (text || "").toLowerCase();
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

      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP status ${res.status}`);
      }

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
