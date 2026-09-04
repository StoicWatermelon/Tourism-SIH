/**
 * Bharat Explore — Internationalization (i18n) Engine
 * Supported Languages: English (en), Hindi (hi), Bengali (bn)
 * Provides instant in-place client-side translation across UI, AI Assistant, and Planner
 */

(function () {
  'use strict';

  const $ = window.$ || (s => document.querySelector(s));
  const $$ = window.$$ || (s => [...document.querySelectorAll(s)]);

  const TRANSLATIONS = {
    en: {
      // Navbar
      brand: "BHARAT <b>EXPLORE</b>",
      nav_explore: "Explore",
      nav_circuits: "3D Portals",
      nav_map: "State Map",
      nav_planner: "Plan Journey",
      nav_ai: "Bharat AI",
      nav_responsible: "Responsible Travel",
      nav_search: "Global Search",
      nav_offline_pass: "🛡️ Offline Pass",
      nav_saved_title: "My Journey Bookmarks",

      // Hero
      hero_badge: "SIH 2026 SUSTAINABLE TOURISM PLATFORM",
      hero_eyebrow: "THE LAND OF HIGH PASSES",
      hero_title: "LADAKH",
      hero_sub: "Where Himalayan clouds meet crystal high-altitude lakes, solar eco-villages, and ancient monastic corridors.",
      hero_cta_explore: "Explore Sustainable Circuits →",
      hero_cta_plan: "Plan Safety-Audited Journey",
      hero_location: "📍 Ladakh, India • 11,500+ ft Altitude • AMS Safety Protocols Active",
      stat_alt: "ft average altitude",
      stat_monasteries: "sacred monasteries",
      stat_passes: "monitored high passes",

      // Quick search & emotions
      search_eyebrow: "DISCOVER WITH PURPOSE",
      search_title: "What kind of journey calls you?",
      search_placeholder: "Search Pangong, Turtuk, Hanle, Spiti, Monasteries...",
      search_btn: "Explore →",
      emotion_peace: "☁ Peaceful Retreats",
      emotion_adventure: "⚡ High Adventure",
      emotion_culture: "◈ Living Culture",
      emotion_nature: "◌ Pure Nature",
      emotion_spirituality: "✦ Sacred Trails",
      emotion_food: "🍛 Zero-Mile Food",

      // Category exploration
      cat_eyebrow: "EXPLORE INDIA",
      cat_title: "One Nation. Infinite Pathways.",
      cat_sub: "From rugged cold deserts and Dark Sky sanctuaries to sacred river ghats and tropical backwaters, explore verified tourism nodes.",

      // 3D Portals
      circuits_eyebrow: "PAN-INDIA 3D REGIONAL PORTALS",
      circuits_title: "20 Verified Cultural & Ecological Nodes",
      circuits_sub: "Distinct regional heritage corridors. Hover to explore interactive 3D perspective depth; click any portal to focus on the map or planner.",
      circuit_all: "All India (20)",
      circuit_north: "North & Himalayas",
      circuit_northeast: "North East",
      circuit_west_central: "West & Central",
      circuit_south_islands: "South & Islands",

      // Map
      map_eyebrow: "INTERACTIVE DISCOVERY",
      map_title: "India, State by State.",
      map_sub: "Interactive spatial discovery powered by Leaflet.js. Hover over any pulse node to preview its live telemetry card, or click to inspect and plan itineraries.",
      map_filter_all: "All Hotspots (44)",
      map_filter_mountains: "🏔️ High Passes & Peaks (11)",
      map_filter_heritage: "🏛️ Heritage & Culture (13)",
      map_filter_nature: "🌿 Wildlife & Biospheres (12)",
      map_filter_coastal: "🏖️ Coastal & Islands (8)",
      map_panel_eyebrow: "SELECT A REGION",
      map_panel_title: "Discover India",
      map_panel_desc: "Hover over any pulse marker on the map to preview interactive cards, or click to inspect full regional telemetry and connect immediately to the Smart Itinerary Planner.",

      // Decongestion & Destinations
      dest_eyebrow: "HIMALAYAN DESTINATION EXPLORER & DECONGESTION",
      dest_title: "Explore the Roof of the World.",
      dest_view_all: "View all circuits →",
      filter_all: "All Circuits (12)",
      filter_offbeat: "🌱 Offbeat & Low-Footfall Gems",
      filter_altitude: "🏔 High-Altitude (14,000+ ft)",
      filter_community: "🏘 Community Homestays",
      decongest_title: "Smart Decongestion Policy Engine:",
      decongest_desc: "Highlighting secondary corridors (Hanle Dark Sky Reserve, Turtuk Border Village, and Sham Valley) diverts tourist footprint away from over-saturated hotspots (Pangong Tso & Central Leh), preserves fragile alpine permafrost and water tables, and redistributes 80%+ of revenue directly to indigenous village families.",

      // AI Chat
      ai_badge: "✦ POWERED BY GEMINI 3.1 FLASH LITE",
      ai_eyebrow: "BHARAT AI ASSISTANT",
      ai_title: "Your intelligent Himalayan guide.",
      ai_sub: "Real-time conversational intelligence trained with altitude acclimation wisdom, mountain pass conditions, permit regulations, and leave-no-trace ethics.",
      sug_acclimat: "48-Hr Acclimatization",
      sug_decongest: "Decongestion Benefits",
      sug_pack: "High-Pass Packing",
      sug_passes: "Live Pass Conditions",
      ai_bot_title: "BHARAT AI",
      ai_bot_status: "Himalayan Intelligence • Active",
      ai_welcome: "Julley & Namaste! 🙏 I am Bharat AI, your intelligent guide for high-altitude Himalayan and Indian travel. Ask me about AMS safety, pass advisories, eco-homestays, offbeat corridors, or custom itineraries!",
      ai_input_placeholder: "Ask Bharat AI about routes, altitude safety, permits...",
      ai_send: "Send →",

      // Planner
      plan_eyebrow: "SMART ITINERARY BUILDER",
      plan_title: "Turn days into lifelong memories.",
      plan_sub: "AI-audited itinerary generator factoring in live mountain pass safety alerts, acclimatization pacing, and responsible travel choices.",
      plan_lbl_dest: "Destination",
      plan_lbl_days: "Days",
      plan_lbl_budget: "Budget per person (₹)",
      plan_lbl_style: "Travel style",
      plan_lbl_interest: "Primary Interest",
      plan_chk_homestays: "Prioritize Certified Eco-Homestays (+15 Responsible Score)",
      plan_chk_transit: "Opt for Shared/EV Transits & Carbon-Neutral Trails (+10 Score)",
      plan_btn_generate: "⚡ Generate Safety-Audited Itinerary",
      plan_empty_title: "Safety-Audited Dynamic Route",
      plan_empty_sub: "Fill out the expedition parameters on the left to compute a live itinerary audited against real-time mountain pass telemetry and AMS acclimatization pacing.",
      
      // Planner Select Options
      opt_ladakh: "Ladakh (High Altitude Focus)",
      opt_hp: "Himachal Pradesh",
      opt_uk: "Uttarakhand",
      opt_sikkim: "Sikkim",
      opt_raj: "Rajasthan",
      opt_kerala: "Kerala",
      opt_style_adventure: "⚡ Adventure & Mountain Pass Exploration",
      opt_style_offbeat: "🌱 Offbeat Decongestion & Village Homestays",
      opt_style_culture: "◈ Heritage, Monasteries & Living Traditions",
      opt_style_photo: "📷 Landscape & Astrophotography",
      opt_int_passes: "High Mountain Passes & Summits",
      opt_int_villages: "Offbeat Border Villages (Turtuk, Hanle)",
      opt_int_lakes: "Alpine Lakes (Pangong & Tso Moriri)",
      opt_int_monasteries: "Historic Gompas & Ancient Murals",
      opt_int_ecotrails: "Community Homestays & Eco Trails",

      // Experience Highlights
      exp_eyebrow: "COMMUNITY & NATURE EXPERIENCES",
      exp_title: "Travel beyond the postcard.",
      exp_sub: "Support indigenous knowledge, fragile mountain ecosystems, and grassroots economies.",
      exp_card1_title: "Live Local",
      exp_card1_desc: "Stay in solar-heated Himalayan village homestays, bake bread with Ladakhi families, and purchase direct handwoven pashmina.",
      exp_card2_title: "Conquer High Passes",
      exp_card2_desc: "Traverse Khardung La and Chang La under calibrated safety advisories with 4x4 certified local drivers.",
      exp_card3_title: "Stargaze at Hanle",
      exp_card3_desc: "Witness the Milky Way in India's first Dark Sky Sanctuary with pristine zero-light-pollution night skies.",
      exp_card4_title: "Sacred Silence",
      exp_card4_desc: "Experience early dawn monastic prayers at Thiksey, butter-lamp reflections, and century-old Buddhist philosophy.",

      // Responsible Tourism
      resp_eyebrow: "LEAVE NO TRACE • TRAVEL ETHICALLY",
      resp_title: "Travel beautifully. Leave it better.",
      resp_sub: "Himalayan ecology is extremely fragile. Bharat Explore gamifies your commitment to sustainable choices, converting eco-habits into tangible perks.",
      resp_pill_plastic: "Zero single-use plastic pledge",
      resp_pill_homestay: "Certified village homestay stay",
      resp_pill_water: "Respect glacier water springs",
      resp_pill_culture: "Monastic silence & prayer etiquette",
      resp_pill_wildlife: "Snow leopard habitat respect",
      resp_pill_local: "Direct artisan commerce pledge",
      resp_btn_plastic: "🫙 Pledge Plastic-Free / Reusable Flask",
      resp_score_title: "RESPONSIBLE TRAVELLER SCORE",
      resp_btn_simulate: "Simulate Eco-Action (+5)",
      resp_btn_redeem: "Redeem Perks 🎁",

      // Culture & Living Traditions
      cul_eyebrow: "CULTURE & LIVING TRADITIONS",
      cul_title: "Every mountain pass holds a thousand stories.",
      cul_sub: "Understand sacred prayer flags (Lung-ta), sacred Cham masked dances, mud-brick solar architecture, and seasonal Losar celebrations through immersive storytelling.",
      cul_btn: "Explore Cultural Storylines →",

      // Taste of the Himalayas
      food_eyebrow: "TASTE OF THE HIMALAYAS • LOCAL ECONOMY DIRECT-LINK",
      food_title: "A journey you can taste.",
      food_sub: "Nutritious, warming, and crafted for high-altitude resilience. 100% locally sourced from Ladakhi women-led cooperatives and organic farmers.",

      // Signature Pan-India Trail
      about_eyebrow: "SIGNATURE PAN-INDIA TRAIL",
      about_title: "Journey Across Bharat.",
      about_sub: "Begin in the high passes of Ladakh, traverse alpine pine valleys, sacred desert fortresses, and southern emerald waters.",

      // Final CTA Banner
      cta_eyebrow: "BHARAT EXPLORE • SIH 2026",
      cta_title: "Your Himalayan expedition begins now.",
      cta_btn: "Start Your Journey →",

      // Modals
      search_modal_eyebrow: "GLOBAL TOURISM SEARCH",
      search_modal_title: "Find your next journey.",
      search_modal_placeholder: "Search Pangong, Nubra, Turtuk, Hanle, Monasteries...",
      rewards_eyebrow: "ECO-CHAMPION PRIVILEGES",
      rewards_title: "Local Cooperative Digital Vouchers",
      rewards_sub: "Thank you for traveling responsibly! Present these digital vouchers to our verified grassroots partners in Ladakh and the Himalayas:",
      drawer_eyebrow: "MY CURATED EXPEDITION",
      drawer_title: "Saved Destinations",
      drawer_plan: "Plan Custom Itinerary →",
      drawer_clear: "Clear All",

      // Field Kit Modal
      fieldkit_badge: "OFFLINE EMERGENCY & ECO TRAVEL PASS",
      fieldkit_header: "Himalayan Travel Safety & Field Kit",
      fieldkit_desc: "Critical offline guidance for traveling through remote sectors (Pangong, Changthang, Nubra, Hanle) where cellular connectivity is intermittent or zero.",
      fieldkit_print: "🖨️ Print / Save Offline Field Kit",
      fieldkit_pledge: "✦ Sign Eco-Traveler Pledge (+10 Score)",

      // Experience Badges
      exp_badge_local: "85% Local Benefit",
      exp_badge_guides: "Certified 4x4 Guides",
      exp_badge_pollution: "Zero Light Pollution",
      exp_badge_heritage: "Heritage Integrity",

      // Level & Perk Badges
      resp_level_silver: "🥈 Silver Eco-Traveler",
      resp_level_guardian: "🏔 Himalayan Guardian",
      resp_perk_unlocked: "✦ ECO-CHAMPION TIER UNLOCKED",
      resp_perk_guardian_unlocked: "✦ HIMALAYAN GUARDIAN TIER UNLOCKED",
      resp_perk_locked: "✦ REACH 80+ TO UNLOCK DIGITAL VOUCHERS",

      // Culture Tags
      cul_tag_flags: "Prayer Flags (Lung-ta)",
      cul_tag_cham: "Cham Dances",
      cul_tag_arch: "Mud-Brick Architecture",
      cul_tag_losar: "Losar New Year",
      cul_tag_cuisine: "Ladakhi Cuisine",
      cul_tag_pashmina: "Pashmina Weaving",

      // Food Banner
      food_banner_title: "Farm-to-Table & Zero Food Miles:",
      food_banner_desc: "Every featured dish relies on indigenous high-altitude grains (tsampa roasted barley, buckwheat), wild seabuckthorn, sun-dried apricots, and pasture yak dairy, minimizing carbon transport footprint while ensuring 80%+ direct revenue stays with local grower cooperatives.",

      // Reward Vouchers
      reward_tier80_header: "🥈 SILVER ECO-TRAVELER — Score 80+",
      reward_tier95_header: "🏔 HIMALAYAN GUARDIAN — Score 95+",
      c1_tag: "15% DISCOUNT",
      c1_title: "Leh Women's Handloom Cooperative",
      c1_desc: "15% off authentic hand-woven Ladakhi pashmina shawls, felt bags, and natural-dye textiles sourced directly from Changthang artisans.",
      c2_tag: "COMPLIMENTARY",
      c2_title: "Tingmo Community Homestay, Nubra",
      c2_desc: "Complimentary traditional salted butter tea (Gur Gur) & authentic Tingmo steamed bread at this community-run eco-homestay.",
      c3_tag: "₹500 OFF",
      c3_title: "Himalayan Homestay Cooperative",
      c3_desc: "₹500 direct voucher toward your booking at any affiliated village homestay in Rumbak, Hemis Shukpachan, or Turtuk.",
      c4_tag: "PRIORITY ACCESS",
      c4_title: "Hanle Dark Sky Stargazing Session",
      c4_desc: "Priority access pass for an exclusive guided Milky Way stargazing session at India's first Dark Sky Sanctuary — hosted by Hanle village astronomers.",
      c5_tag: "10% DISCOUNT",
      c5_title: "Leh Tibetan Artisan Bakery",
      c5_desc: "Complimentary artisanal butter tea and 10% off organic buckwheat cookies & apricot pies baked on traditional clay hearths.",

      // Drawer
      drawer_empty: "No saved destinations yet. Click \"♥ Add to Journey\" on any destination card to bookmark your dream route.",
      drawer_budget_lbl: "Estimated Total Experience Budget:",
      drawer_kit_title: "🛡️ Offline Field Kit & Emergency Pass",
      drawer_kit_sub: "Access hospital helplines, ILP checkpoints & AMS protocols.",
      drawer_kit_btn: "Open Field Kit 📄",

      // Field Kit Cards
      kit_c1_title: "24/7 Medical & Oxygen Posts",
      kit_c1_i1: "<b>SNM District Hospital, Leh:</b> Primary altitude trauma centre & hyperbaric chamber. Tel: <code>+91-1982-252014</code>",
      kit_c1_i2: "<b>Diskit Sub-District Hospital (Nubra):</b> 24/7 emergency oxygen & ambulance base. Tel: <code>+91-1982-220022</code>",
      kit_c1_i3: "<b>Tangtse Emergency Clinic:</b> Located before Pangong Lake for SpO2 stabilization.",
      kit_c1_i4: "<b>BRO Highway Rescue & HIMANK:</b> Emergency road clearance. Tel: <code>1077</code>",
      kit_c2_title: "Inner Line Permit (ILP) Checkpoints",
      kit_c2_i1: "<b>Carry 4 Physical Hardcopies:</b> Required at South Pullu, North Pullu, Khardung La, and Tsaga La check-posts.",
      kit_c2_i2: "<b>Designated ILP Circuits:</b> Nubra Valley, Pangong Tso, Tso Moriri, Turtuk, Tyakshi, and Hanle.",
      kit_c2_i3: "<b>Valid Photo ID:</b> Aadhaar Card, Passport, or Voter ID required alongside digital LAHDC receipt.",
      kit_c3_title: "AMS Emergency Action Protocol",
      kit_c3_i1: "<b>Golden Rule:</b> Never ascend with symptoms of Acute Mountain Sickness (AMS).",
      kit_c3_i2: "<b>Symptoms:</b> Throbbing headache, nausea, extreme fatigue, shortness of breath at rest.",
      kit_c3_i3: "<b>Action:</b> Descend immediately to Leh (11,500 ft) or nearest low camp. Administer supplemental oxygen.",
      kit_c3_i4: "<b>Hydration:</b> 4–5 liters daily with oral rehydration salts (ORS).",
      kit_c4_title: "Himalayan Leave-No-Trace Code",
      kit_c4_i1: "<b>No Single-Use Bottles:</b> Refill filtered boiled water at Dzomsa eco-stations in Leh.",
      kit_c4_i2: "<b>Glacier Streams:</b> No soap or detergents within 100m of alpine streams or lakes.",
      kit_c4_i3: "<b>Monastic Respect:</b> Remove shoes, walk clockwise around stupas, and ask prior photo consent.",

      // Dynamic Card & UI Labels
      btn_add_journey: "♥ Add to Journey",
      btn_explore_details: "Explore Details",
      btn_explore_node: "Explore Regional Node →",
      lbl_season: "Season:",
      lbl_budget: "Budget:",
      badge_eco_gem: "🌱 Eco-Dispersion Gem",
      title_eco_pledge: "Click to commit eco-action (+5 pts)",
      title_food_support: "Click to support zero-food-mile local produce (+5 pts)"
    },

    hi: {
      // Navbar
      brand: "भारत <b>एक्सप्लोर</b>",
      nav_explore: "अन्वेषण करें",
      nav_circuits: "3D परिपथ",
      nav_map: "राज्य मानचित्र",
      nav_planner: "यात्रा योजना",
      nav_ai: "भारत AI",
      nav_responsible: "जिम्मेदार पर्यटन",
      nav_search: "खोजें",
      nav_offline_pass: "🛡️ ऑफलाइन पास",
      nav_saved_title: "मेरी सुरक्षित यात्रा",

      // Hero
      hero_badge: "SIH 2026 सतत पर्यटन मंच",
      hero_eyebrow: "ऊंचे दर्रों की पावन भूमि",
      hero_title: "लद्दाख",
      hero_sub: "जहां हिमालयी बादल क्रिस्टल झीलों, सौर पर्यावरण-गांवों और प्राचीन बौद्ध मठों से मिलते हैं।",
      hero_cta_explore: "सतत परिपथ देखें →",
      hero_cta_plan: "सुरक्षा-समीक्षित यात्रा बनाएं",
      hero_location: "📍 लद्दाख, भारत • 11,500+ फीट ऊंचाई • AMS सुरक्षा प्रोटोकॉल सक्रिय",
      stat_alt: "फीट औसत ऊंचाई",
      stat_monasteries: "पवित्र बौद्ध मठ",
      stat_passes: "निगरानी वाले दर्रे",

      // Quick search & emotions
      search_eyebrow: "उद्देश्य के साथ खोजें",
      search_title: "आपको किस प्रकार की यात्रा आकर्षित करती है?",
      search_placeholder: "पैंगोंग, तुरतुक, हानले, स्पीति, मठ खोजें...",
      search_btn: "खोजें →",
      emotion_peace: "☁ शांतिपूर्ण विश्राम",
      emotion_adventure: "⚡ उच्च रोमांच",
      emotion_culture: "◈ सजीव संस्कृति",
      emotion_nature: "◌ शुद्ध प्रकृति",
      emotion_spirituality: "✦ पवित्र पथ",
      emotion_food: "🍛 स्थानीय भोजन",

      // Category exploration
      cat_eyebrow: "भारत का अन्वेषण",
      cat_title: "एक राष्ट्र। अनंत रास्ते।",
      cat_sub: "ठंडे रेगिस्तानों और डार्क स्काई अभयारण्यों से लेकर पवित्र गंगा घाटों और बैकवाटर्स तक, सत्यापित पर्यटन स्थलों का अन्वेषण करें।",

      // 3D Portals
      circuits_eyebrow: "अखिल भारतीय 3D क्षेत्रीय पोर्टल",
      circuits_title: "20 सत्यापित सांस्कृतिक और पारिस्थितिक नोड्स",
      circuits_sub: "विशिष्ट क्षेत्रीय विरासत गलियारे। 3D गहराई का अनुभव करें; किसी भी पोर्टल पर क्लिक करके मानचित्र या योजनाकार पर देखें।",
      circuit_all: "संपूर्ण भारत (20)",
      circuit_north: "उत्तर और हिमालय",
      circuit_northeast: "पूर्वोत्तर भारत",
      circuit_west_central: "पश्चिम और मध्य",
      circuit_south_islands: "दक्षिण और द्वीप",

      // Map
      map_eyebrow: "इंटरएक्टिव अन्वेषण",
      map_title: "राज्य दर राज्य भारत।",
      map_sub: "लीफलेट आधारित इंटरएक्टिव मानचित्र। किसी भी नोड पर जाकर लाइव कार्ड देखें या क्लिक करके यात्रा योजना बनाएं।",
      map_filter_all: "सभी स्थल (44)",
      map_filter_mountains: "🏔️ ऊंचे दर्रे और चोटियां (11)",
      map_filter_heritage: "🏛️ धरोहर और संस्कृति (13)",
      map_filter_nature: "🌿 वन्यजीव और अभयारण्य (12)",
      map_filter_coastal: "🏖️ तटीय और द्वीप (8)",
      map_panel_eyebrow: "एक क्षेत्र चुनें",
      map_panel_title: "भारत की खोज करें",
      map_panel_desc: "नक्शे पर किसी भी मार्कर पर कर्सर ले जाकर कार्ड देखें, या पूर्ण विवरण देखने और सीधे यात्रा योजनाकार से जुड़ने के लिए क्लिक करें।",

      // Decongestion & Destinations
      dest_eyebrow: "हिमालयी गंतव्य और भीड़-नियंत्रण",
      dest_title: "दुनिया की छत का अन्वेषण करें।",
      dest_view_all: "सभी परिपथ देखें →",
      filter_all: "सभी परिपथ (12)",
      filter_offbeat: "🌱 ऑफबीट और शांत स्थल",
      filter_altitude: "🏔 उच्च तुंगता (14,000+ फीट)",
      filter_community: "🏘 सामुदायिक होमस्टे",
      decongest_title: "स्मार्ट भीड़-नियंत्रण नीति प्रणाली:",
      decongest_desc: "हानले डार्क स्काई रिजर्व, तुरतुक सीमावर्ती गांव और शाम घाटी जैसे माध्यमिक गलियारों को बढ़ावा देकर पैंगोंग त्सो और लेह जैसे भीड़भाड़ वाले स्थलों पर दबाव कम होता है, संवेदनशील पर्यावरण की रक्षा होती है और 80%+ आय सीधे स्थानीय परिवारों तक पहुंचती है।",

      // AI Chat
      ai_badge: "✦ जेमिनी 3.1 फ्लैश लाइट द्वारा संचालित",
      ai_eyebrow: "भारत AI सहायक",
      ai_title: "आपका बुद्धिमान हिमालयी मार्गदर्शक।",
      ai_sub: "ऊंचाई अनुकूलन, दर्रों की स्थिति, परमिट और पर्यावरण संरक्षण के लिए प्रशिक्षित रीयल-टाइम AI।",
      sug_acclimat: "48-घंटे अनुकूलन नियम",
      sug_decongest: "ऑफबीट यात्रा के लाभ",
      sug_pack: "दर्रों के लिए आवश्यक सामान",
      sug_passes: "दर्रों की लाइव स्थिति",
      ai_bot_title: "भारत AI",
      ai_bot_status: "हिमालयी बुद्धिमत्ता • सक्रिय",
      ai_welcome: "Julley & Namaste! 🙏 I am Bharat AI, your intelligent guide for high-altitude Himalayan and Indian travel. Ask me about AMS safety, pass advisories, eco-homestays, offbeat corridors, or custom itineraries!",
      ai_input_placeholder: "भारत AI से मार्ग, ऊंचाई सुरक्षा, परमिट के बारे में पूछें...",
      ai_send: "भेजें →",

      // Planner
      plan_eyebrow: "स्मार्ट यात्रा योजनाकार",
      plan_title: "दिनों को सुनहरी यादों में बदलें।",
      plan_sub: "लाइव दर्रा सुरक्षा अलर्ट, ऊंचाई अनुकूलन और जिम्मेदार यात्रा विकल्पों को ध्यान में रखकर तैयार की जाने वाली यात्रा योजना।",
      plan_lbl_dest: "गंतव्य",
      plan_lbl_days: "दिन",
      plan_lbl_budget: "प्रति व्यक्ति बजट (₹)",
      plan_lbl_style: "यात्रा शैली",
      plan_lbl_interest: "प्राथमिक रुचि",
      plan_chk_homestays: "प्रमाणित पर्यावरण-अनुकूल होमस्टे को प्राथमिकता दें (+15 स्कोर)",
      plan_chk_transit: "साझा/EV वाहनों और कार्बन-तटस्थ मार्गों का चयन करें (+10 स्कोर)",
      plan_btn_generate: "⚡ सुरक्षा-समीक्षित यात्रा बनाएं",
      plan_empty_title: "सुरक्षा-समीक्षित गतिशील मार्ग",
      plan_empty_sub: "वास्तविक समय के दर्रा डेटा और ऊंचाई अनुकूलन के आधार पर एक लाइव यात्रा कार्यक्रम तैयार करने के लिए बाईं ओर पैरामीटर भरें।",

      // Planner Select Options
      opt_ladakh: "लद्दाख (उच्च तुंगता केंद्र)",
      opt_hp: "हिमाचल प्रदेश",
      opt_uk: "उत्तराखंड",
      opt_sikkim: "सिक्किम",
      opt_raj: "राजस्थान",
      opt_kerala: "केरल",
      opt_style_adventure: "⚡ रोमांच और दर्रा अन्वेषण",
      opt_style_offbeat: "🌱 ऑफबीट यात्रा और ग्रामीण होमस्टे",
      opt_style_culture: "◈ धरोहर, मठ और सजीव परंपराएं",
      opt_style_photo: "📷 प्राकृतिक दृश्य और खगोल-फोटोग्राफी",
      opt_int_passes: "ऊंचे हिमालयी दर्रे और चोटियां",
      opt_int_villages: "ऑफबीट सीमावर्ती गांव (तुरतुक, हानले)",
      opt_int_lakes: "अल्पाइन झीलें (पैंगोंग और त्सो मोरीरी)",
      opt_int_monasteries: "प्राचीन बौद्ध मठ और भित्तिचित्र",
      opt_int_ecotrails: "सामुदायिक होमस्टे और पर्यावरण ट्रेल्स",

      // Experience Highlights
      exp_eyebrow: "सामुदायिक और प्रकृति अनुभव",
      exp_title: "पोस्टकार्ड से परे यात्रा करें।",
      exp_sub: "स्थानीय ज्ञान, संवेदनशील पर्वतीय पारिस्थितिकी और जमीनी अर्थव्यवस्था का समर्थन करें।",
      exp_card1_title: "स्थानीय जीवन जिएं",
      exp_card1_desc: "सौर-गर्म हिमालयी गांव के होमस्टे में ठहरें, लद्दाखी परिवारों के साथ रोटी बनाएं और सीधे हाथ से बुनी पश्मीना खरीदें।",
      exp_card2_title: "ऊंचे दर्रे पार करें",
      exp_card2_desc: "4x4 प्रमाणित स्थानीय ड्राइवरों के साथ सुरक्षा सलाह के तहत खारदुंग ला और चांग ला पार करें।",
      exp_card3_title: "हानले में तारों को निहारें",
      exp_card3_desc: "शून्य प्रकाश प्रदूषण वाले भारत के पहले डार्क स्काई अभयारण्य में मिल्की वे के साक्षी बनें।",
      exp_card4_title: "पवित्र शांति",
      exp_card4_desc: "थिक्सिक में भोर की मठ प्रार्थनाओं, मक्खन के दीयों और सदियों पुराने बौद्ध दर्शन का अनुभव करें।",

      // Responsible Tourism
      resp_eyebrow: "कोई निशान न छोड़ें • नैतिक यात्रा करें",
      resp_title: "खूबसूरती से यात्रा करें। इसे और बेहतर बनाएं।",
      resp_sub: "हिमालय की पारिस्थितिकी अत्यंत संवेदनशील है। भारत एक्सप्लोर आपकी पर्यावरण अनुकूल आदतों को स्थानीय लाभों में बदलता है।",
      resp_pill_plastic: "एकल-उपयोग प्लास्टिक मुक्त प्रतिज्ञा",
      resp_pill_homestay: "प्रमाणित ग्रामीण होमस्टे में प्रवास",
      resp_pill_water: "हिमनद जल स्रोतों का सम्मान",
      resp_pill_culture: "मठों में शांति और प्रार्थना शिष्टाचार",
      resp_pill_wildlife: "हिम तेंदुए के आवास का सम्मान",
      resp_pill_local: "कारीगरों से सीधे खरीद की प्रतिज्ञा",
      resp_btn_plastic: "🫙 प्लास्टिक मुक्त / पुनः प्रयोज्य फ्लास्क प्रतिज्ञा",
      resp_score_title: "जिम्मेदार यात्री स्कोर",
      resp_btn_simulate: "इको-एक्शन दर्ज करें (+5)",
      resp_btn_redeem: "उपहार भुनाएं 🎁",

      // Culture & Living Traditions
      cul_eyebrow: "संस्कृति और सजीव परंपराएं",
      cul_title: "हर पर्वतीय दर्रे में छिपी हैं हजारों कहानियां।",
      cul_sub: "पवित्र प्रार्थना झंडे (लुंग-ता), चाम मुखौटा नृत्य, मिट्टी-ईंट की सौर वास्तुकला और लोसार उत्सव को समझें।",
      cul_btn: "सांस्कृतिक कहानियां देखें →",

      // Taste of the Himalayas
      food_eyebrow: "हिमालय का स्वाद • स्थानीय अर्थव्यवस्था से सीधा जुड़ाव",
      food_title: "एक यात्रा जिसे आप चख सकते हैं।",
      food_sub: "पौष्टिक, गर्म और उच्च ऊंचाई के लिए अनुकूल। लद्दाखी महिला सहकारी समितियों और जैविक किसानों से 100% स्थानीय रूप से प्राप्त।",

      // Signature Pan-India Trail
      about_eyebrow: "अखिल भारतीय हस्ताक्षर यात्रा",
      about_title: "भारत भर की यात्रा।",
      about_sub: "लद्दाख के ऊंचे दर्रों से शुरुआत करें, चीड़ की घाटियों, पवित्र किलों और दक्षिण के मनोरम बैकवाटर्स की यात्रा करें।",

      // Final CTA Banner
      cta_eyebrow: "भारत एक्सप्लोर • SIH 2026",
      cta_title: "आपका हिमालयी अभियान अब शुरू होता है।",
      cta_btn: "अपनी यात्रा शुरू करें →",

      // Modals
      search_modal_eyebrow: "वैश्विक पर्यटन खोज",
      search_modal_title: "अपनी अगली यात्रा खोजें।",
      search_modal_placeholder: "पैंगोंग, नुब्रा, तुरतुक, हानले, मठ खोजें...",
      rewards_eyebrow: "पर्यावरण-संरक्षक विशेषाधिकार",
      rewards_title: "स्थानीय सहकारी डिजिटल वाउचर",
      rewards_sub: "जिम्मेदारी से यात्रा करने के लिए धन्यवाद! लद्दाख और हिमालय में हमारे सत्यापित साझेदारों को ये डिजिटल वाउचर दिखाएं:",
      drawer_eyebrow: "मेरी चुनिंदा यात्रा",
      drawer_title: "सुरक्षित गंतव्य",
      drawer_plan: "कस्टम यात्रा योजना बनाएं →",
      drawer_clear: "सभी हटाएं",

      // Field Kit Modal
      fieldkit_badge: "ऑफलाइन आपातकालीन एवं पर्यावरण यात्रा पास",
      fieldkit_header: "हिमालयी यात्रा सुरक्षा और फील्ड किट",
      fieldkit_desc: "दूरदराज के क्षेत्रों (पैंगोंग, चांगथांग, नुब्रा, हानले) में यात्रा के लिए महत्वपूर्ण ऑफलाइन मार्गदर्शन जहां नेटवर्क सीमित या शून्य है।",
      fieldkit_print: "🖨️ प्रिंट / ऑफलाइन फील्ड किट सहेजें",
      fieldkit_pledge: "✦ पर्यावरण प्रतिज्ञा पर हस्ताक्षर करें (+10 स्कोर)",

      // Experience Badges
      exp_badge_local: "85% स्थानीय लाभ",
      exp_badge_guides: "प्रमाणित 4x4 गाइड",
      exp_badge_pollution: "शून्य प्रकाश प्रदूषण",
      exp_badge_heritage: "विरासत की शुद्धता",

      // Level & Perk Badges
      resp_level_silver: "🥈 सिल्वर इको-यात्री",
      resp_level_guardian: "🏔 हिमालयी संरक्षक",
      resp_perk_unlocked: "✦ इको-चैंपियन स्तर अनलॉक (वाउचर सक्रिय)",
      resp_perk_guardian_unlocked: "✦ हिमालयी संरक्षक स्तर अनलॉक",
      resp_perk_locked: "✦ डिजिटल कूपन अनलॉक करने के लिए 80+ तक पहुंचें",

      // Culture Tags
      cul_tag_flags: "प्रार्थना झंडे (लुंग-ता)",
      cul_tag_cham: "छाम नृत्य",
      cul_tag_arch: "मिट्टी-ईंट सौर वास्तुकला",
      cul_tag_losar: "लोसार नव वर्ष",
      cul_tag_cuisine: "लद्दाखी व्यंजन",
      cul_tag_pashmina: "पश्मीना बुनाई",

      // Food Banner
      food_banner_title: "खेत से थाली तक व शून्य खाद्य मील:",
      food_banner_desc: "प्रत्येक व्यंजन स्थानीय उच्च-ऊंचाई वाले अनाजों (त्सम्पा भुनी हुई जौ, कुट्टू), जंगली सीबकथॉर्न, सूखे खुबानी और याक डेयरी पर आधारित है, जो कार्बन पदचिह्न को कम करते हुए 80%+ प्रत्यक्ष आय स्थानीय उत्पादक सहकारी समितियों तक पहुंचाता है।",

      // Reward Vouchers
      reward_tier80_header: "🥈 सिल्वर इको-यात्री — स्कोर 80+",
      reward_tier95_header: "🏔 हिमालयी संरक्षक — स्कोर 95+",
      c1_tag: "15% छूट",
      c1_title: "लेह महिला हथकरघा सहकारी समिति",
      c1_desc: "चांगथांग के कारीगरों द्वारा निर्मित प्रामाणिक हस्तनिर्मित पश्मीना शॉल, बैग और प्राकृतिक रंगों के वस्त्रों पर 15% छूट।",
      c2_tag: "मानार्थ",
      c2_title: "तिंगमो सामुदायिक होमस्टे, नुब्रा",
      c2_desc: "इस सामुदायिक पर्यावरण-होमस्टे में पारंपरिक नमकीन बटर चाय (गुर गुर) और प्रामाणिक तिंगमो स्टीम्ड ब्रेड मानार्थ।",
      c3_tag: "₹500 की छूट",
      c3_title: "हिमालयन होमस्टे सहकारी समिति",
      c3_desc: "रुमबक, हेमिस शुकपाचन या तुरतुक में किसी भी संबद्ध गांव के होमस्टे की बुकिंग पर ₹500 का सीधा वाउचर।",
      c4_tag: "प्राथमिकता प्रवेश",
      c4_title: "हानले डार्क स्काई तारा दर्शन सत्र",
      c4_desc: "भारत के पहले डार्क स्काई अभयारण्य में विशेष निर्देशित मिल्की वे तारा दर्शन सत्र हेतु प्राथमिकता पास — हानले ग्रामीण खगोलविदों द्वारा आयोजित।",
      c5_tag: "10% छूट",
      c5_title: "लेह तिब्बती कारीगर बेकरी",
      c5_desc: "पारंपरिक मिट्टी के चूल्हों पर पकी जैविक कुट्टू कुकीज और खुबानी पाई पर 10% छूट एवं मानार्थ बटर चाय।",

      // Drawer
      drawer_empty: "अभी तक कोई सुरक्षित गंतव्य नहीं है। अपनी यात्रा तैयार करने के लिए किसी भी कार्ड पर '♥ Add to Journey' पर क्लिक करें।",
      drawer_budget_lbl: "अनुमानित कुल अनुभव बजट:",
      drawer_kit_title: "🛡️ ऑफलाइन फील्ड किट और आपातकालीन पास",
      drawer_kit_sub: "अस्पताल हेल्पलाइन, आईएलपी चेकपॉइंट और एएमएस प्रोटोकॉल देखें।",
      drawer_kit_btn: "फील्ड किट खोलें 📄",

      // Field Kit Cards
      kit_c1_title: "24/7 चिकित्सा एवं ऑक्सीजन केंद्र",
      kit_c1_i1: "<b>एसएनएम जिला अस्पताल, लेह:</b> प्राथमिक ऊंचाई ट्रॉमा सेंटर एवं हाइपरबेरिक चैंबर। दूरभाष: <code>+91-1982-252014</code>",
      kit_c1_i2: "<b>डिस्कित उप-जिला अस्पताल (नुब्रा):</b> 24/7 आपातकालीन ऑक्सीजन व एम्बुलेंस बेस। दूरभाष: <code>+91-1982-220022</code>",
      kit_c1_i3: "<b>तांगत्से आपातकालीन क्लिनिक:</b> SpO2 स्थिरीकरण हेतु पैंगोंग झील से पहले स्थित।",
      kit_c1_i4: "<b>बीआरओ हाईवे रेस्क्यू एवं हिमांक:</b> आपातकालीन सड़क निकासी। दूरभाष: <code>1077</code>",
      kit_c2_title: "इनर लाइन परमिट (ILP) चेकपॉइंट",
      kit_c2_i1: "<b>4 भौतिक प्रतियां साथ रखें:</b> साउथ पुल्लू, नॉर्थ पुल्लू, खारदुंग ला और त्सागा ला चौकियों पर आवश्यक।",
      kit_c2_i2: "<b>नामित ILP सर्किट:</b> नुब्रा घाटी, पैंगोंग त्सो, त्सो मोरीरी, तुरतुक, त्याक्षी और हानले।",
      kit_c2_i3: "<b>वैध फोटो पहचान पत्र:</b> डिजिटल LAHDC रसीद के साथ आधार कार्ड, पासपोर्ट या मतदाता पहचान पत्र अनिवार्य।",
      kit_c3_title: "AMS आपातकालीन कार्य प्रोटोकॉल",
      kit_c3_i1: "<b>स्वर्ण नियम:</b> एक्यूट माउंटेन सिकनेस (AMS) के लक्षणों के साथ कभी भी ऊंचाई पर न जाएं।",
      kit_c3_i2: "<b>लक्षण:</b> धड़कता सिरदर्द, मतली, अत्यधिक थकान, आराम के समय सांस फूलना।",
      kit_c3_i3: "<b>कार्रवाई:</b> तुरंत लेह (11,500 फीट) या निकटतम निचले शिविर में उतरें। पूरक ऑक्सीजन लें।",
      kit_c3_i4: "<b>जलयोजन:</b> ओआरएस (ORS) के साथ प्रतिदिन 4-5 लीटर पानी पिएं।",
      kit_c4_title: "हिमालयी लीव-नो-ट्रेस पर्यावरण संहिता",
      kit_c4_i1: "<b>एकल-उपयोग बोतलें प्रतिबंधित:</b> लेह में दज़ोमसा इको-स्टेशनों पर फ़िल्टर किया हुआ उबला पानी भरें।",
      kit_c4_i2: "<b>हिमनद धाराएं:</b> पर्वतीय धाराओं या झीलों के 100 मीटर के भीतर साबुन या डिटर्जेंट का उपयोग न करें।",
      kit_c4_i3: "<b>धार्मिक सम्मान:</b> जूते उतारें, स्तूपों की परिक्रमा दक्षिणावर्त करें और तस्वीरें लेने से पहले अनुमति लें।",

      // Dynamic Card & UI Labels
      btn_add_journey: "♥ यात्रा में जोड़ें",
      btn_explore_details: "विवरण देखें",
      btn_explore_node: "क्षेत्रीय नोड देखें →",
      lbl_season: "मौसम:",
      lbl_budget: "बजट:",
      badge_eco_gem: "🌱 पर्यावरण-संरक्षण स्थल",
      title_eco_pledge: "पर्यावरण-प्रतिज्ञा दर्ज करें (+5 अंक)",
      title_food_support: "शून्य-खाद्य-मील स्थानीय भोजन का समर्थन करें (+5 अंक)"
    },

    bn: {
      // Navbar
      brand: "ভারত <b>এক্সপ্লোর</b>",
      nav_explore: "অন্বেষণ করুন",
      nav_circuits: "3D পোর্টাল",
      nav_map: "রাজ্য মানচিত্র",
      nav_planner: "ভ্রমণ পরিকল্পনা",
      nav_ai: "ভারত AI",
      nav_responsible: "দায়িত্বশীল পর্যটন",
      nav_search: "অনুসন্ধান",
      nav_offline_pass: "🛡️ অফলাইন পাস",
      nav_saved_title: "আমার সংরক্ষিত ভ্রমণ",

      // Hero
      hero_badge: "SIH 2026 টেকসই পর্যটন প্ল্যাটফর্ম",
      hero_eyebrow: "উঁচু গিরিপথের দেশ",
      hero_title: "লাদাখ",
      hero_sub: "যেখানে হিমালয়ের মেঘ স্ফটিক হ্রদ, সৌর পরিবেশ-গ্রাম এবং প্রাচীন বৌদ্ধ মঠের সাথে মিলিত হয়।",
      hero_cta_explore: "টেকসই সার্কিট দেখুন →",
      hero_cta_plan: "নিরাপদ ভ্রমণ পরিকল্পনা করুন",
      hero_location: "📍 লাদাখ, ভারত • ১১,৫০০+ ফুট উচ্চতা • AMS সুরক্ষা সক্রিয়",
      stat_alt: "গড় উচ্চতা (ফুট)",
      stat_monasteries: "পবিত্র বৌদ্ধ মঠ",
      stat_passes: "নজরদারি করা গিরিপথ",

      // Quick search & emotions
      search_eyebrow: "উদ্দেশ্য নিয়ে আবিষ্কার করুন",
      search_title: "কেমন যাত্রা আপনাকে আকর্ষণ করে?",
      search_placeholder: "প্যাংগং, তুরতুক, হানলে, স্পিতি, মঠ খুঁজুন...",
      search_btn: "খুঁজুন →",
      emotion_peace: "☁ শান্ত পরিবেশ",
      emotion_adventure: "⚡ রোমাঞ্চকর অভিযান",
      emotion_culture: "◈ জীবন্ত সংস্কৃতি",
      emotion_nature: "◌ বিশুদ্ধ প্রকৃতি",
      emotion_spirituality: "✦ পবিত্র পথ",
      emotion_food: "🍛 খাঁটি স্থানীয় খাবার",

      // Category exploration
      cat_eyebrow: "ভারত অন্বেষণ",
      cat_title: "এক দেশ। অনন্ত পথ।",
      cat_sub: "দুর্গম ঠান্ডা মরুভূমি ও ডার্ক স্কাই রিজার্ভ থেকে শুরু করে পবিত্র গঙ্গার ঘাট ও উপকূলীয় অঞ্চল অন্বেষণ করুন।",

      // 3D Portals
      circuits_eyebrow: "সর্বভারতীয় 3D আঞ্চলিক পোর্টাল",
      circuits_title: "২০টি যাচাইকৃত সাংস্কৃতিক ও পরিবেশগত নোড",
      circuits_sub: "অনন্য আঞ্চলিক ঐতিহ্য করিডোর। 3D গভীরতা অনুভব করুন; যেকোনো পোর্টালে ক্লিক করে মানচিত্র বা ভ্রমণসূচিতে যান।",
      circuit_all: "সমগ্র ভারত (২০)",
      circuit_north: "উত্তর ও হিমালয়",
      circuit_northeast: "উত্তর-পূর্ব ভারত",
      circuit_west_central: "পশ্চিম ও মধ্য ভারত",
      circuit_south_islands: "দক্ষিণ ও দ্বীপপুঞ্জ",

      // Map
      map_eyebrow: "ইন্টারেক্টিভ আবিষ্কার",
      map_title: "রাজ্যভিত্তিক ভারত।",
      map_sub: "ইন্টারেক্টিভ মানচিত্র। যেকোনো নোডে হোভার করে লাইভ তথ্য দেখুন অথবা ক্লিক করে ভ্রমণ পরিকল্পনা তৈরি করুন।",
      map_filter_all: "সমস্ত স্থান (৪৪)",
      map_filter_mountains: "🏔️ উঁচু গিরিপথ ও শৃঙ্গ (১১)",
      map_filter_heritage: "🏛️ ঐতিহ্য ও সংস্কৃতি (১৩)",
      map_filter_nature: "🌿 বন্যপ্রাণী ও বায়োস্ফিয়ার (১২)",
      map_filter_coastal: "🏖️ উপকূল ও দ্বীপপুঞ্জ (৮)",
      map_panel_eyebrow: "একটি অঞ্চল নির্বাচন করুন",
      map_panel_title: "ভারত আবিষ্কার করুন",
      map_panel_desc: "মানচিত্রের যেকোনো মার্কারে কার্সার রেখে কার্ড দেখুন, অথবা সম্পূর্ণ তথ্য জানতে এবং সরাসরি ভ্রমণ পরিকল্পনাকারীর সাথে যুক্ত হতে ক্লিক করুন।",

      // Decongestion & Destinations
      dest_eyebrow: "হিমালয় ভ্রমণ ও ভিড়-নিয়ন্ত্রণ",
      dest_title: "বিশ্বের ছাদ অন্বেষণ করুন।",
      dest_view_all: "সমস্ত সার্কিট দেখুন →",
      filter_all: "সমস্ত সার্কিট (১২)",
      filter_offbeat: "🌱 অফবিট ও নির্জন স্থান",
      filter_altitude: "🏔 উচ্চ পর্বতমালা (১৪,০০০+ ফুট)",
      filter_community: "🏘 গ্রামীণ হোমস্টে",
      decongest_title: "স্মার্ট ভিড়-নিয়ন্ত্রণ নীতি ব্যবস্থা:",
      decongest_desc: "হানলে ডার্ক স্কাই রিজার্ভ, তুরতুক সীমান্তবর্তী গ্রাম এবং শাম উপত্যকার মতো বিকল্প পথ বেছে নিলে প্যাংগং লেক ও লেহ শহরের ভিড় কমে, হিমালয়ের সংবেদনশীল পরিবেশ সুরক্ষিত থাকে এবং ৮০%+ পর্যটন আয় সরাসরি স্থানীয় গ্রামবাসী পরিবারের কাছে পৌঁছায়।",

      // AI Chat
      ai_badge: "✦ জেমিনি ৩.১ ফ্ল্যাশ লাইট দ্বারা চালিত",
      ai_eyebrow: "ভারত AI সহকারী",
      ai_title: "আপনার বুদ্ধিমান হিমালয় গাইড।",
      ai_sub: "উচ্চতা অভিযোজন, গিরিপথের অবস্থা, পারমিট এবং পরিবেশ রক্ষার জন্য প্রশিক্ষিত রিয়েল-টাইম AI।",
      sug_acclimat: "৪৮ ঘণ্টা অভিযোজন নিয়ম",
      sug_decongest: "অফবিট ভ্রমণের সুবিধা",
      sug_pack: "গিরিপথের জন্য প্যাকিং",
      sug_passes: "গিরিপথের লাইভ অবস্থা",
      ai_bot_title: "ভারত AI",
      ai_bot_status: "হিমালয় বুদ্ধিমত্তা • সক্রিয়",
      ai_welcome: "Julley & Namaste! 🙏 I am Bharat AI, your intelligent guide for high-altitude Himalayan and Indian travel. Ask me about AMS safety, pass advisories, eco-homestays, offbeat corridors, or custom itineraries!",
      ai_input_placeholder: "ভারত AI কে রুট, উচ্চতা সুরক্ষা, পারমিট সম্পর্কে জিজ্ঞাসা করুন...",
      ai_send: "পাঠান →",

      // Planner
      plan_eyebrow: "স্মার্ট ভ্রমণ পরিকল্পনাকারী",
      plan_title: "দিনগুলোকে আজীবন স্মৃতিতে রূপ দিন।",
      plan_sub: "লাইভ গিরিপথ সতর্কতা, উচ্চতা অভিযোজন এবং দায়িত্বশীল ভ্রমণ পছন্দের ভিত্তিতে তৈরি এআই-পর্যালোচিত ভ্রমণসূচি।",
      plan_lbl_dest: "গন্তব্য",
      plan_lbl_days: "দিন",
      plan_lbl_budget: "জনপ্রতি বাজেট (₹)",
      plan_lbl_style: "ভ্রমণ শৈলী",
      plan_lbl_interest: "মূল আগ্রহ",
      plan_chk_homestays: "প্রত্যয়িত পরিবেশবান্ধব হোমস্টেকে অগ্রাধিকার দিন (+১৫ স্কোর)",
      plan_chk_transit: "শেয়ার্ড/EV যান এবং কার্বন-মুক্ত রুট বেছে নিন (+১০ স্কোর)",
      plan_btn_generate: "⚡ নিরাপদ ভ্রমণসূচি তৈরি করুন",
      plan_empty_title: "নিরাপদ গতিশীল ভ্রমণপথ",
      plan_empty_sub: "রিয়েল-টাইম গিরিপথের অবস্থা এবং উচ্চতা অভিযোজনের ভিত্তিতে ভ্রমণসূচি তৈরি করতে বাঁদিকের ফর্মটি পূরণ করুন।",

      // Planner Select Options
      opt_ladakh: "লাদাখ (উচ্চ পর্বত কেন্দ্র)",
      opt_hp: "হিমাচল প্রদেশ",
      opt_uk: "উত্তরাখণ্ড",
      opt_sikkim: "সিকিম",
      opt_raj: "রাজস্থান",
      opt_kerala: "কেরালা",
      opt_style_adventure: "⚡ রোমাঞ্চ ও গিরিপথ অভিযান",
      opt_style_offbeat: "🌱 অফবিট ভ্রমণ ও গ্রামীণ হোমস্টে",
      opt_style_culture: "◈ ঐতিহ্য, মঠ ও জীবন্ত সংস্কৃতি",
      opt_style_photo: "📷 ল্যান্ডস্কেপ ও অ্যাস্ট্রোফটোগ্রাফি",
      opt_int_passes: "উঁচু গিরিপথ ও পর্বতশৃঙ্গ",
      opt_int_villages: "অফবিট সীমান্তবর্তী গ্রাম (তুরতুক, হানলে)",
      opt_int_lakes: "অ্যালপাইন হ্রদ (প্যাংগং ও সো মোরিরি)",
      opt_int_monasteries: "ঐতিহাসিক গুম্ফা ও প্রাচীন দেওয়ালচিত্র",
      opt_int_ecotrails: "গ্রামীণ হোমস্টে ও পরিবেশবান্ধব ট্রেইল",

      // Experience Highlights
      exp_eyebrow: "সম্প্রদায় ও প্রকৃতি অভিজ্ঞতা",
      exp_title: "পোস্টকার্ডের সীমানা ছাড়িয়ে ভ্রমণ।",
      exp_sub: "স্থানীয় জ্ঞান, সংবেদনশীল পর্বত বাস্তুতন্ত্র এবং তৃণমূল অর্থনীতির সমর্থন করুন।",
      exp_card1_title: "স্থানীয় জীবনযাপন",
      exp_card1_desc: "সৌরশক্তিচালিত পাহাড়ি হোমস্টেতে থাকুন, লাদাখি পরিবারের সাথে খাবার রান্না করুন এবং স্থানীয় তাঁতিদের থেকে খাঁটি পশমিনা কিনুন।",
      exp_card2_title: "উঁচু গিরিপথ জয় করুন",
      exp_card2_desc: "নিরাপত্তা সতর্কতার সাথে অভিজ্ঞ স্থানীয় চালকদের সহযোগিতায় খারদুং লা ও চাং লা অতিক্রম করুন।",
      exp_card3_title: "হানলেতে তারা দর্শন",
      exp_card3_desc: "ভারতের প্রথম ডার্ক স্কাই স্যাঙ্কচুয়ারিতে সম্পূর্ণ অন্ধকার আকাশে ছায়াপথ প্রত্যক্ষ করুন।",
      exp_card4_title: "পবিত্র প্রশান্তি",
      exp_card4_desc: "থিকসে মঠে ভোরবেলার প্রার্থনা, মাখনের প্রদীপের আভা এবং প্রাচীন বৌদ্ধ দর্শনের অভিজ্ঞতা নিন।",

      // Responsible Tourism
      resp_eyebrow: "পরিবেশ রক্ষা করুন • দায়িত্বশীল ভ্রমণ",
      resp_title: "সুন্দরভাবে ভ্রমণ করুন। পরিবেশকে আরও উন্নত রাখুন।",
      resp_sub: "হিমালয়ের বাস্তুতন্ত্র অত্যন্ত সংবেদনশীল। ভারত এক্সপ্লোর আপনার পরিবেশবান্ধব পছন্দগুলোকে বিশেষ সুযোগ-সুবিধায় রূপান্তরিত করে।",
      resp_pill_plastic: "একক ব্যবহার্য প্লাস্টিক বর্জন প্রতিজ্ঞা",
      resp_pill_homestay: "প্রত্যয়িত গ্রামীণ হোমস্টেতে অবস্থান",
      resp_pill_water: "হিমবাহের জল উৎসের সুরক্ষা",
      resp_pill_culture: "মঠে নীরবতা ও প্রার্থনা শিষ্টাচার",
      resp_pill_wildlife: "তুষার চিতার বাসস্থানের সুরক্ষা",
      resp_pill_local: "স্থানীয় কারিগরদের থেকে সরাসরি ক্রয়ের অঙ্গীকার",
      resp_btn_plastic: "🫙 প্লাস্টিক-মুক্ত / পুনঃব্যবহারযোগ্য ফ্লাস্ক অঙ্গীকার",
      resp_score_title: "দায়িত্বশীল পর্যটক স্কোর",
      resp_btn_simulate: "পরিবেশবান্ধব কাজ রেকর্ড করুন (+৫)",
      resp_btn_redeem: "সুবিধা দাবি করুন 🎁",

      // Culture & Living Traditions
      cul_eyebrow: "সংস্কৃতি ও জীবন্ত ঐতিহ্য",
      cul_title: "প্রতিটি গিরিপথেই রয়েছে হাজারো ইতিহাস ও গল্প।",
      cul_sub: "পবিত্র প্রার্থনা পতাকা (লুং-তা), ছাম মুখোশ নৃত্য, পরিবেশবান্ধব মাটির স্থাপত্য এবং লোসার উৎসব সম্পর্কে জানুন।",
      cul_btn: "সাংস্কৃতিক কাহিনী অন্বেষণ করুন →",

      // Taste of the Himalayas
      food_eyebrow: "হিমালয়ের স্বাদ • স্থানীয় অর্থনীতিতে প্রত্যক্ষ অবদান",
      food_title: "এমন এক যাত্রা যার স্বাদ আপনি গ্রহণ করতে পারেন।",
      food_sub: "পুষ্টিকর, শরীর উষ্ণকারী এবং উচ্চতার উপযোগী। লাদাখি নারী সমবায় এবং জৈব কৃষকদের থেকে সংগৃহীত।",

      // Signature Pan-India Trail
      about_eyebrow: "স্বাক্ষরিত সর্বভারতীয় ভ্রমণপথ",
      about_title: "ভারতজুড়ে এক অনন্য যাত্রা।",
      about_sub: "লাদাখের উঁচু গিরিপথ থেকে শুরু করে পাইন উপত্যকা, মরু দুর্গ এবং দক্ষিণের শান্ত জলাশয় ঘুরে দেখুন।",

      // Final CTA Banner
      cta_eyebrow: "ভারত এক্সপ্লোর • SIH 2026",
      cta_title: "আপনার হিমালয় অভিযান এখনই শুরু হোক।",
      cta_btn: "আপনার যাত্রা শুরু করুন →",

      // Modals
      search_modal_eyebrow: "সার্বজনীন পর্যটন অনুসন্ধান",
      search_modal_title: "আপনার পরবর্তী ভ্রমণ খুঁজুন।",
      search_modal_placeholder: "প্যাংগং, নুব্রা, তুরতুক, হানলে, মঠ অনুসন্ধান করুন...",
      rewards_eyebrow: "ইকো-চ্যাম্পিয়ন বিশেষ সুবিধাসমূহ",
      rewards_title: "স্থানীয় সমবায় ডিজিটাল ভাউচার",
      rewards_sub: "দায়িত্বশীলভাবে ভ্রমণের জন্য ধন্যবাদ! লাদাখ এবং হিমালয়ে আমাদের অংশীদারদের কাছে এই ভাউচারগুলি উপস্থাপন করুন:",
      drawer_eyebrow: "আমার নির্বাচিত ভ্রমণসূচি",
      drawer_title: "সংরক্ষিত গন্তব্যসমূহ",
      drawer_plan: "কাস্টম ভ্রমণ পরিকল্পনা তৈরি করুন →",
      drawer_clear: "সব সাফ করুন",

      // Field Kit Modal
      fieldkit_badge: "অফলাইন জরুরি ও পরিবেশ ভ্রমণ পাস",
      fieldkit_header: "হিমালয় ভ্রমণ সুরক্ষা ও ফিল্ড কিট",
      fieldkit_desc: "প্যাংগং, চাংথাং, নুব্রা, হানলের মতো প্রত্যন্ত অঞ্চলে ভ্রমণের জন্য গুরুত্বপূর্ণ অফলাইন নির্দেশিকা যেখানে মোবাইল নেটওয়ার্ক থাকে না।",
      fieldkit_print: "🖨️ প্রিন্ট / সংরক্ষণ করুন",
      fieldkit_pledge: "✦ ইকো-ট্রাভেলার প্রতিজ্ঞায় স্বাক্ষর করুন (+১০ স্কোর)",

      // Experience Badges
      exp_badge_local: "৮৫% স্থানীয় অর্থনীতিতে অবদান",
      exp_badge_guides: "প্রত্যয়িত 4x4 গাইড",
      exp_badge_pollution: "শূন্য আলো দূষণ",
      exp_badge_heritage: "ঐতিহ্যের পবিত্রতা",

      // Level & Perk Badges
      resp_level_silver: "🥈 সিলভার ইকো-ভ্রমণকারী",
      resp_level_guardian: "🏔 হিমালয় অভিভাবক",
      resp_perk_unlocked: "✦ ইকো-চ্যাম্পিয়ন স্তর আনলক হয়েছে (ভাউচার সক্রিয়)",
      resp_perk_guardian_unlocked: "✦ হিমালয় অভিভাবক স্তর আনলক হয়েছে",
      resp_perk_locked: "✦ ডিজিটাল ভাউচার আনলক করতে ৮০+ স্কোরে পৌঁছান",

      // Culture Tags
      cul_tag_flags: "প্রার্থনা পতাকা (লুং-তা)",
      cul_tag_cham: "ছাম মুখোশ নৃত্য",
      cul_tag_arch: "মাটির তৈরি সৌর স্থাপত্য",
      cul_tag_losar: "লোসার নববর্ষ",
      cul_tag_cuisine: "লাদাখি খাবার",
      cul_tag_pashmina: "পশমিনা বয়ন",

      // Food Banner
      food_banner_title: "ফার্ম-টু-টেবিল ও শূন্য খাদ্য পরিবহন:",
      food_banner_desc: "প্রতিটি খাবার স্থানীয় উচ্চতার শস্য (সাম্পা বার্লি, বাকহুইট), বুনো সীবাকথর্ন, রোদে শুকানো এপ্রিকট এবং চমরী গাইয়ের দুগ্ধজাত পণ্য দিয়ে তৈরি, যা কার্বন নিঃসরণ কমিয়ে আয়ের ৮০%+ সরাসরি স্থানীয় কৃষক সমবায়কে পৌঁছে দেয়।",

      // Reward Vouchers
      reward_tier80_header: "🥈 সিলভার ইকো-ভ্রমণকারী — স্কোর ৮০+",
      reward_tier95_header: "🏔 হিমালয় অভিভাবক — স্কোর ৯৫+",
      c1_tag: "১৫% ছাড়",
      c1_title: "লেহ মহিলা তাঁত সমবায় সমিতি",
      c1_desc: "চাংথাং শিল্পীদের তৈরি খাঁটি হাতে বোনা লাদাখি পশমিনা শাল ও প্রাকৃতিক রঙের পোশাকে ১৫% ছাড়।",
      c2_tag: "বিনামূল্যে সৌজন্য",
      c2_title: "তিংমো গ্রামীণ হোমস্টে, নুব্রা",
      c2_desc: "এই পরিবেশবান্ধব গ্রামীণ হোমস্টেতে ঐতিহ্যবাহী মাখন চা (গুর গুর) এবং গরম তিংমো স্টিমড রুটি বিনামূল্যে উপভোগ করুন।",
      c3_tag: "₹৫০০ ছাড়",
      c3_title: "হিমালয়ান হোমস্টে সমবায় সমিতি",
      c3_desc: "রুমবাক, হেমিশ শুকপাচান বা তুরতুকের যেকোনো অনুমোদিত গ্রামীণ হোমস্টে বুকিংয়ে সরাসরি ₹৫০০ ছাড়।",
      c4_tag: "অগ্রাধিকার প্রবেশাধিকার",
      c4_title: "হানলে ডার্ক স্কাই তারামণ্ডল পর্যবেক্ষণ",
      c4_desc: "ভারতের প্রথম ডার্ক স্কাই স্যাঙ্কচুয়ারিতে স্থানীয় গ্রামবাসীদের পরিচালনায় আকাশগঙ্গা ছায়াপথ দর্শনের অগ্রাধিকার পাস।",
      c5_tag: "১০% ছাড়",
      c5_title: "লেহ তিব্বতি বেকারি",
      c5_desc: "ঐতিহ্যবাহী মাটির চুলায় তৈরি অর্গানিক বাকহুইট কুকিজ ও এপ্রিকট পাইয়ে ১০% ছাড় এবং সৌজন্যমূলক বাটার চা।",

      // Drawer
      drawer_empty: "এখনো কোনো গন্তব্য সংরক্ষিত নেই। আপনার প্রিয় ভ্রমণপথ বুকমার্ক করতে যেকোনো কার্ডে '♥ Add to Journey' ক্লিক করুন।",
      drawer_budget_lbl: "আনুমানিক মোট ভ্রমণ বাজেট:",
      drawer_kit_title: "🛡️ অফলাইন ফিল্ড কিট ও জরুরি পাস",
      drawer_kit_sub: "হাসপাতাল হেল্পলাইন, আইএলপি চেকপয়েন্ট এবং এএমএস প্রোটোকল দেখুন।",
      drawer_kit_btn: "ফিল্ড কিট খুলুন 📄",

      // Field Kit Cards
      kit_c1_title: "২৪/৭ চিকিৎসা ও অক্সিজেন কেন্দ্র",
      kit_c1_i1: "<b>এসএনএম জেলা হাসপাতাল, লেহ:</b> প্রধান উচ্চতাজনিত ট্রমা সেন্টার ও হাইপারবারিক চেম্বার। ফোন: <code>+91-1982-252014</code>",
      kit_c1_i2: "<b>দিস্কিত মহকুমা হাসপাতাল (নুব্রা):</b> ২৪/৭ জরুরি অক্সিজেন ও অ্যাম্বুলেন্স বেস। ফোন: <code>+91-1982-220022</code>",
      kit_c1_i3: "<b>তাংৎসে জরুরি ক্লিনিক:</b> প্যাংগং হ্রদের আগে SpO2 স্থিতিশীলতার জন্য কেন্দ্র।",
      kit_c1_i4: "<b>বিআরও হাইওয়ে উদ্ধার ও হিমাঙ্ক:</b> জরুরি সড়ক নিষ্কাশন। ফোন: <code>1077</code>",
      kit_c2_title: "ইনার লাইন পারমিট (ILP) চেকপয়েন্ট",
      kit_c2_i1: "<b>৪টি হার্ডকপি সাথে রাখুন:</b> সাউথ পুল্লু, নর্থ পুল্লু, খারদুং লা এবং সাগা লা চেকপোস্টে প্রয়োজন।",
      kit_c2_i2: "<b>নির্দিষ্ট ILP সার্কিট:</b> নুব্রা উপত্যকা, প্যাংগং সো, সো মোরিরি, তুরতুক ও হানলে।",
      kit_c2_i3: "<b>বৈধ ছবিযুক্ত পরিচয়পত্র:</b> ডিজিটাল LAHDC রসিদের সাথে আধার, পাসপোর্ট বা ভোটার আইডি বাধ্যতামূলক।",
      kit_c3_title: "উচ্চতাজনিত অসুস্থতা (AMS) জরুরি প্রোটোকল",
      kit_c3_i1: "<b>সোনালী নিয়ম:</b> একিউট মাউন্টেন সিকনেস (AMS)-এর লক্ষণ নিয়ে কখনোই উপরে উঠবেন না।",
      kit_c3_i2: "<b>লক্ষণ:</b> তীব্র মাথাব্যথা, বমি ভাব, অতিরিক্ত ক্লান্তি, বিশ্রামের সময় শ্বাসকষ্ট।",
      kit_c3_i3: "<b>করণীয়:</b> অবিলম্বে লেহ (১১,৫০০ ফুট) বা নিকটবর্তী নিচু স্থানে নেমে আসুন। অক্সিজেন গ্রহণ করুন।",
      kit_c3_i4: "<b>পর্যাপ্ত জলপান:</b> ওআরএস সহ দিনে ৪-৫ লিটার জল পান করুন।",
      kit_c4_title: "হিমালয় পরিবেশ রক্ষা নির্দেশিকা",
      kit_c4_i1: "<b>প্লাস্টিক বোতল নিষিদ্ধ:</b> লেহের জুমসা ইকো-স্টেশনে পরিশ্রুত জল পুনরায় ভর্তি করুন।",
      kit_c4_i2: "<b>হিমবাহের জলাশয়:</b> পাহাড়ি নদী বা হ্রদের ১০০ মিটারের মধ্যে সাবান বা ডিটারজেন্ট ব্যবহার করবেন না।",
      kit_c4_i3: "<b>মঠের শিষ্টাচার:</b> জুতো খুলুন, স্তূপের চারপাশ ঘড়ির কাঁটার দিকে প্রদক্ষিণ করুন এবং ছবি তোলার আগে অনুমতি নিন।",

      // Dynamic Card & UI Labels
      btn_add_journey: "♥ তালিকায় যোগ করুন",
      btn_explore_details: "বিস্তারিত দেখুন",
      btn_explore_node: "আঞ্চলিক নোড অন্বেষণ করুন →",
      lbl_season: "ঋতু:",
      lbl_budget: "বাজেট:",
      badge_eco_gem: "🌱 পরিবেশ-বান্ধব অফবিট রত্ন",
      title_eco_pledge: "পরিবেশবান্ধব অঙ্গীকার নিশ্চিত করুন (+৫ পয়েন্ট)",
      title_food_support: "স্থানীয় খাদ্য পণ্যকে সমর্থন করুন (+৫ পয়েন্ট)"
    }
  };

  const CATEGORY_NAMES = {
    mountains: { en: "Mountains", hi: "पहाड़ व दर्रे", bn: "পাহাড় ও গিরিপথ" },
    adventure: { en: "Adventure", hi: "रोमांच", bn: "রোমাঞ্চকর অভিযান" },
    nature: { en: "Nature", hi: "प्रकृति", bn: "প্রকৃতি ও হ্রদ" },
    culture: { en: "Culture", hi: "संस्कृति", bn: "সংস্কৃতি ও উৎসব" },
    spirituality: { en: "Spiritual", hi: "आध्यात्मिक", bn: "আধ্যাত্মিক স্থান" },
    heritage: { en: "Heritage", hi: "धरोहर व वास्तुकला", bn: "ঐতিহাসিক স্থান" },
    food: { en: "Zero-Mile Food", hi: "स्थानीय जैविक भोजन", bn: "স্থানীয় খাঁটি খাবার" },
    villages: { en: "Eco Villages", hi: "पर्यावरण गांव", bn: "পরিবেশবান্ধব গ্রাম" }
  };

  const JOURNEY_NODES = {
    en: [
      "Ladakh (High Passes)",
      "Hanle (Dark Sky)",
      "Himachal (Spiti)",
      "Uttarakhand (Ganges)",
      "Sikkim (Himalayas)",
      "Rajasthan (Deserts)",
      "Kerala (Backwaters)"
    ],
    hi: [
      "लद्दाख (ऊंचे दर्रे)",
      "हानले (डार्क स्काई)",
      "हिमाचल (स्पीति)",
      "उत्तराखंड (गंगा)",
      "सिक्किम (हिमालय)",
      "राजस्थान (थार मरुस्थल)",
      "केरल (बैकवाटर्स)"
    ],
    bn: [
      "লাদাখ (উঁচু গিরিপথ)",
      "হানলে (ডার্ক স্কাই)",
      "হিমাচল (স্পিতি)",
      "উত্তরাখণ্ড (গঙ্গা)",
      "সিকিম (হিমালয়)",
      "রাজস্থান (মরুভূমি)",
      "কেরালা (ব্যাকওয়াটার্স)"
    ]
  };

  const DESTINATION_TRANSLATIONS = {
    pangong: {
      hi: { name: "पैंगोंग त्सो झील", desc: "14,270 फीट की ऊंचाई पर 134 किमी लंबी अल्पाइन झील जो फिरोजा से गहरे कोबाल्ट रंग में बदलती है। उच्च भीड़भाड़ के कारण सख्त शून्य-प्लास्टिक प्रोटोकॉल अनिवार्य है।" },
      bn: { name: "প্যাংগং সো হ্রদ", desc: "১৪,২৭০ ফুট উচ্চতায় ১৩৪ কিমি দীর্ঘ নীলকান্তমণির মতো সুন্দর হ্রদ। অতিরিক্ত ভিড়ের কারণে এখানে কঠোরভাবে প্লাস্টিক নিষিদ্ধ।" }
    },
    hanle: {
      hi: { name: "हानले डार्क स्काई रिजर्व", desc: "भारत का पहला प्रमाणित डार्क स्काई अभयारण्य जो नग्न आंखों से प्राचीन मिल्की वे अवलोकन और ग्रामीणों द्वारा संचालित एस्ट्रोस्टे प्रदान करता है।" },
      bn: { name: "হানলে ডার্ক স্কাই রিজার্ভ", desc: "ভারতের প্রথম প্রত্যয়িত ডার্ক স্কাই স্যাঙ্কচুয়ারি, যেখানে খালি চোখেই মহাজাগতিক ছায়াপথ ও তারামণ্ডল স্পষ্ট দেখা যায়।" }
    },
    turtuk: {
      hi: { name: "तुरतुक सीमावर्ती गांव", desc: "खुबानी के बगीचों में बसा भारत का सबसे उत्तरी गांव, जो अनूठी बाल्टी संस्कृति, पत्थर की वास्तुकला और महिला सहकारी समितियों का घर है।" },
      bn: { name: "তুরতুক সীমান্ত গ্রাম", desc: "এপ্রিকট বাগানে ঘেরা ভারতের উত্তরতম গ্রাম, যা নিজস্ব বাল্টি সংস্কৃতি, প্রাচীন পাথরের স্থাপত্য ও গ্রামীণ জীবনযাত্রার জন্য বিখ্যাত।" }
    },
    sham: {
      hi: { name: "शाम वैली इको कॉरिडोर", desc: "सुरक्षित कम ऊंचाई वाले अनुकूलन के लिए आदर्श 'बेबी ट्रेक' गलियारा, जो छोटे खुबानी बागों और गांव के होमस्टे का समर्थन करता है।" },
      bn: { name: "শাম ভ্যালি ইকো করিডোর", desc: "নিরাপদ উচ্চতা অভিযোজনের জন্য আদর্শ সবুজ উপত্যকা, যা স্থানীয় এপ্রিকট চাষি ও গ্রামীণ হোমস্টে পরিবারগুলিকে সাহায্য করে।" }
    },
    nubra: {
      hi: { name: "नुब्रा घाटी और डिस्कित", desc: "सफेद रेत के टीलों, दो कूबड़ वाले बैक्ट्रियन ऊंटों और श्योक नदी के सामने स्थित डिस्कित गोम्पा वाली उच्च-ऊंचाई वाली मरुस्थलीय घाटी।" },
      bn: { name: "নুব্রা উপত্যকা ও দিস্কিত", desc: "সাদা বালিয়াড়ি, ডাবল কুঁজওয়ালা ব্যাক্ট্রিয়ান উট এবং শ্যোক নদীর তীরে ঐতিহাসিক দিস্কিত মঠ সমৃদ্ধ এক বিস্ময়কর ঠান্ডা মরুভূমি।" }
    },
    khardung: {
      hi: { name: "खारदुंग ला दर्रा", desc: "दुनिया के सबसे ऊंचे मोटर योग्य दर्रों में से एक (17,582 फीट), जो लेह को नुब्रा और सियाचिन ग्लेशियर मार्ग से जोड़ता है।" },
      bn: { name: "খারদুং লা গিরিপথ", desc: "বিশ্বের অন্যতম উচ্চতম মোটরযান চলাচলের উপযোগী গিরিপথ (১৭,৫৮২ ফুট), যা লেহকে নুব্রা উপত্যকার সাথে যুক্ত করেছে।" }
    },
    tsomoriri: {
      hi: { name: "त्सो मोरीरी वेटलैंड", desc: "चांगथांग का पवित्र रामसर स्थल, जो काली गर्दन वाले सारस और चांगपा खानाबदोश बस्तियों का संरक्षण क्षेत्र है।" },
      bn: { name: "সো মোরিরি রামসার হ্রদ", desc: "চাংথাং মালভূমির এক অতিসংবেদনশীল সংরক্ষিত হ্রদ, যা পরিযায়ী পাখি এবং যাযাবর উপজাতিদের আবাসস্থল।" }
    },
    leh: {
      hi: { name: "लेह ओल्ड टाउन हेरिटेज कोर", desc: "हिमालयी व्यापार का ऐतिहासिक केंद्र, जो लेह पैलेस, पारंपरिक लकड़ी-मिट्टी की बेकरियों और विरासत स्तूपों का घर है।" },
      bn: { name: "লেহ ওল্ড টাউন হেরিটেজ কোর", desc: "হিমালয়ান বাণিজ্যের ঐতিহাসিক কেন্দ্র, যেখানে অবস্থিত লেহ রাজপ্রাসাদ, ঐতিহ্যবাহী মাটির রুটিঘর ও প্রাচীন স্তূপ।" }
    },
    shanti: {
      hi: { name: "शांति स्तूप पहाड़ी", desc: "पहाड़ी की चोटी पर स्थित बौद्ध स्तूप जो लेह घाटी, चांसपा सीढ़ीदार खेतों और बर्फ से ढकी जांस्कर चोटियों का 360° विहंगम दृश्य प्रस्तुत करता है।" },
      bn: { name: "শান্তি স্তূপ পাহাড় চূড়া", desc: "পাহাড়ের চূড়ায় অবস্থিত সুন্দর বৌদ্ধ স্তূপ, যেখান থেকে লেহ উপত্যকা ও বরফে ঢাকা জানস্কার পর্বতশ্রেণীর ৩৬০° প্যানোরামিক দৃশ্য দেখা যায়।" }
    },
    hemis: {
      hi: { name: "हेमिस और थिकसे मठ", desc: "प्राचीन थंगका कला, वार्षिक चाम मुखौटा नृत्य और 11,800 फीट पर रहने वाली भिक्षु परंपराओं वाला प्रतिष्ठित मठ परिसर।" },
      bn: { name: "হেমিশ ও থিকসে বৌদ্ধ মঠ", desc: "শতাব্দী প্রাচীন বৌদ্ধ দর্শন, পবিত্র মুখোশ নৃত্য এবং স্বর্ণময় বৌদ্ধ মূর্তি সম্বলিত ঐতিহাসিক মঠ।" }
    },
    padum: {
      hi: { name: "पदुम और जांस्कर घाटी", desc: "जांस्कर का दुर्गम दिल, जहां कच्ची नदी की घाटियां, चट्टानी फुगताल मठ और विशाल हिमालयी ट्रेल्स हैं।" },
      bn: { name: "পাদুম ও জানস্কার উপত্যকা", desc: "হিমালয়ের গভীর উপত্যকা, যেখানে পাহাড়ের গায়ে ঝুলন্ত ফুগতাল মঠ ও দুঃসাহসিক নদী ট্রেকিং পথ রয়েছে।" }
    },
    zanskar: {
      hi: { name: "फुगताल गुफा मठ", desc: "गहरी घाटी की चट्टान पर शहद के छत्ते की तरह निर्मित 12वीं सदी का विस्मयकारी गुफा मठ।" },
      bn: { name: "ফুগতাল গুহা মঠ", desc: "দ্বাদশ শতাব্দীর প্রাচীনতম বৌদ্ধ গুহা মঠ, যা পাহাড়ের খাড়া খাদের খাঁজে তৈরি এক অনন্য স্থাপত্য।" }
    },
    changla: {
      hi: { name: "चांग ला दर्रा", desc: "17,688 फीट की ऊंचाई पर स्थित रणनीतिक और सुंदर दर्रा, जो पैंगोंग त्सो और हानले की यात्रा का प्रवेश द्वार है।" },
      bn: { name: "চাং লা গিরিপথ", desc: "১৭,৬৮৮ ফুট উচ্চতার তুষারাবৃত গিরিপথ, যা প্যাংগং সো এবং দূরবর্তী হানলে যাওয়ার প্রধান পাহাড়ি পথ।" }
    },
    spiti: {
      hi: { name: "स्पीति घाटी (मध्य भूमि)", desc: "की गोम्पा, ताबो विश्व धरोहर भित्तिचित्रों और लैंग्ज़ा जीवाश्म संरक्षण स्थलों के लिए प्रसिद्ध शीत मरुस्थल घाटी।" },
      bn: { name: "স্পিতি উপত্যকা (মধ্যভূমি)", desc: "ঐতিহাসিক কি মঠ, বিশ্বখ্যাত প্রাচীন তাবো দেওয়ালচিত্র এবং কোটি বছরের সামুদ্রিক জীবাশ্মের জন্য পরিচিত ঠান্ডা মরুভূমি।" }
    }
  };

  const CIRCUIT_TRANSLATIONS = {
    srinagar: { hi: "डल झील, शिकारा की सैर और शालीमार बाग के अल्पाइन पानी के प्रतिबिंब", bn: "ডাল হ্রদের স্ফটিক জল, ভাসমান শিকারা ও কাশ্মীরি শালিমার বাগান" },
    kurukshetra: { hi: "ब्रह्म सरोवर घाट, प्राचीन तीर्थ गलियारे और ऐतिहासिक धरोहर", bn: "ব্রহ্ম সরোবর ঘাট, প্রাচীন তীর্থ ঐতিহ্য ও ঐতিহাসিক সংস্কৃতি" },
    rockgarden: { hi: "शून्य-अपशिष्ट पर्यावरण-शिल्प कला का विश्व प्रसिद्ध केंद्र", bn: "বর্জ্য পদার্থ দিয়ে তৈরি বিশ্বখ্যাত ভাস্কর্য উদ্যান" },
    tawang: { hi: "10,000 फीट की ऊंचाई पर स्थित प्रतिष्ठित तिब्बती बौद्ध मठ", bn: "১০,০০০ ফুট উচ্চতায় অবস্থিত ঐতিহাসিক তাওয়াং বৌদ্ধ মঠ" },
    cherrapunji: { hi: "प्राकृतिक फिकस जड़ों से बने जीवित पुल और धुंध से ढकी घाटियां", bn: "মেঘালয়ের জীবন্ত গাছের শেকড়ের তৈরি সাঁকো ও গভীর উপত্যকা" },
    loktaklake: { hi: "अद्वितीय तैरते हुए फुमदी द्वीप और दुर्लभ संगाई हिरण अभयारण्य", bn: "বিশ্বের একমাত্র ভাসমান হ্রদ ও বিরল সাংগাই হরিণের প্রাকৃতিক আবাসস্থল" },
    kohima: { hi: "हॉर्नबिल सांस्कृतिक विरासत, मनोरम पर्वतमाला और जनजातीय कला", bn: "হর্নবিল সাংস্কৃতিক ঐতিহ্য, সবুজ পাহাড় ও সমৃদ্ধ উপজাতীয় সংস্কৃতি" },
    aizawl: { hi: "शांत बादलों से ढकी पहाड़ियां, मिजो बांस शिल्प और गिरजाघर", bn: "মেঘের দেশে শান্ত পাহাড়ের চূড়া, বাঁশের হস্তশিল্প ও ঐতিহ্যবাহী গির্জা" },
    ujjayantapalace: { hi: "मुगल उद्यानों और झीलों से घिरा राजसी नवशास्त्रीय महल", bn: "মুঘল বাগান ও হ্রদ পরিবেষ্টিত ত্রিপুরার ঐতিহাসিক রাজপ্রাসাদ" },
    hampi: { hi: "ग्रेनाइट शिलाखंड, तुंगभद्रा नदी और विजयनगर साम्राज्य के अवशेष", bn: "তুঙ্গভদ্রা নদীর তীরে বিজয়নগর সাম্রাজ্যের গ্রানাইট পাথরের অনন্য স্থাপত্য" },
    hyderabad: { hi: "चारमीनार, गोलकुंडा किले का वास्तुशिल्प और समृद्ध निज़ामी परंपराएं", bn: "চারমিনার, ঐতিহাসিক গোলকোণ্ডা দুর্গ ও ঐতিহ্যবাহী নিজামি খাবার" },
    visakhapatnam: { hi: "जहां पूर्वी घाट सीधे बंगाल की खाड़ी के नीले पानी में मिलते हैं", bn: "যেখানে পূর্বঘাট পর্বতমালার পাহাড় সরাসরি বঙ্গোপসাগরের নীল জলে মিশেছে" },
    whitetown: { hi: "फ्रांसीसी औपनिवेशिक विला, कैफे और समुद्र तट का सैरगाह", bn: "ফরাসি ঔপনিবেশিক স্থাপত্য, শান্ত সমুদ্র সৈকত ও মনোরম কাফে" },
    kavaratti: { hi: "सफेद रेत के मूंगा एटोल, फिरोजा लैगून और समृद्ध समुद्री जीवन", bn: "স্বচ্ছ নীল সমুদ্র, প্রবাল প্রাচীর ও আদিম প্রাকৃতিক সৌন্দর্য" },
    swarajdeep: { hi: "राधानगर समुद्र तट का सूर्यास्त और जैव-दीप्तिमान कयाकिंग", bn: "রাধানগর সৈকতের অপরূপ সূর্যাস্ত ও জীবন্ত প্রবাল প্রাচীর" },
    mumbai: { hi: "गेटवे ऑफ इंडिया, अरब सागर की हवा और विक्टोरियन गोथिक विरासत", bn: "গেটওয়ে অফ ইন্ডিয়া, আরব সাগরের হাওয়া ও ভিক্টোরিয়ান স্থাপত্য" },
    daman: { hi: "16वीं सदी की पुर्तगाली प्राचीर और पाम के पेड़ वाले तटीय समुद्र तट", bn: "১৬শ শতাব্দীর ঐতিহাসিক পর্তুগিজ দুর্গ ও নারকেল বীথি ঘেরা সৈকত" },
    khajuraho: { hi: "चंदेल वंश की बारीक बलुआ पत्थर की मंदिर वास्तुकला", bn: "চান্দেল রাজবংশের অপূর্ব বেলেপাথরের খোদাই করা মন্দির স্থাপত্য" },
    bastar: { hi: "चित्रकूट घोड़ानाल जलप्रपात और प्राचीन ढोकरा कांस्य शिल्प", bn: "চিত্রকূট জলপ্রপাত এবং প্রাচীন ঢোকরা ধাতব লোকশিল্পের কেন্দ্র" },
    hundrufalls: { hi: "320 फीट ऊंचा स्वर्णरेखा जलप्रपात और ग्रेनाइट रॉक पूल", bn: "সুবর্ণরেখা নদীর ৩২০ ফুট উঁচু জলপ্রপাত ও প্রকাণ্ড পাথুরে নদী অববাহিকা" }
  };

  const FOOD_TRANSLATIONS = {
    "Organic Momos": {
      hi: { name: "जैविक मोमोज", desc: "जंगली पहाड़ी साग या याक के छुरपी पनीर से भरे भाप में पके स्वादिष्ट मोमोज।" },
      bn: { name: "অর্গানিক মোমো", desc: "বুনো পাহাড়ি শাকসবজি অথবা ইয়াকের ছুরপি পনির দিয়ে তৈরি গরম ভাপা মোমো।" }
    },
    "High-Altitude Thukpa": {
      hi: { name: "उच्च-हिमालयी थुकपा", desc: "पहाड़ी अजवाइन, मूली और लहसुन के शोरबे के साथ पकाया गया गरमा-गर्म नूडल सूप।" },
      bn: { name: "হিমালয়ান থুকপা", desc: "পাহাড়ি মশলা, তাজা শাকসবজি ও রসুনের নির্যাস দিয়ে তৈরি গরম নুডল স্যুপ।" }
    },
    "Traditional Skyu Stew": {
      hi: { name: "पारंपरिक स्क्यू स्टू", desc: "सौर चूल्हों और मिट्टी के बर्तनों में पकाया गया गेहूं और जौ के अंगूठे के आकार का पास्ता स्टू।" },
      bn: { name: "ঐতিহ্যবাহী স্কিউ স্টু", desc: "গম ও বার্লির হাতে তৈরি দেশীয় পাস্তা, যা গ্রামের মাটির উনুনে ধীরে ধীরে রান্না করা হয়।" }
    },
    "Steamed Tingmo": {
      hi: { name: "स्टीम्ड तिंगमो ब्रेड", desc: "जैविक त्सम्पा पत्थर-पिसे गेहूं से बनी फूल के आकार की बेहद मुलायम स्टीम्ड ब्रेड।" },
      bn: { name: "ভাপা তিংমো রুটি", desc: "স্থানীয় গম দিয়ে তৈরি নরম, স্তরে স্তরে ফুল-আকৃতির গরম ভাপা ঐতিহ্যবাহী রুটি।" }
    },
    "Salted Butter Tea (Gur Gur)": {
      hi: { name: "नमकीन बटर चाय (गुर गुर)", desc: "याक के मक्खन और हिमालयी सेंधा नमक से मथी गई उच्च-ऊंचाई जलयोजन की जीवनरेखा चाय।" },
      bn: { name: "ঐতিহ্যবাহী বাটার চা (গুর গুর)", desc: "ইয়াকের মাখন ও হিমালয় শিলালবণ দিয়ে তৈরি শরীর উষ্ণকারী ঔষধি চা।" }
    }
  };

  let currentLang = localStorage.getItem("bharatLang") || "en";

  function t(key, lang = currentLang) {
    const bundle = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return bundle[key] || TRANSLATIONS.en[key] || key;
  }

  function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = "en";
    currentLang = lang;
    localStorage.setItem("bharatLang", lang);

    document.documentElement.lang = lang;

    // Translate all elements with data-i18n
    $$("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const val = t(key, lang);
      if (val) {
        if (el.innerHTML.includes("<") || val.includes("<")) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Translate placeholder attributes
    $$("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = t(key, lang);
      if (val) el.placeholder = val;
    });

    // Translate title attributes
    $$("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      const val = t(key, lang);
      if (val) el.title = val;
    });

    // Sync select dropdown if exists
    const select = $("#language");
    if (select && select.value !== lang) {
      select.value = lang;
    }

    // Update AI suggestions dataset if present
    const sugMap = {
      en: [
        "What is the mandatory acclimatization protocol for Leh?",
        "How does visiting offbeat places like Turtuk and Hanle help decongestion?",
        "What should I pack for high-altitude passes like Khardung La?",
        "What are the current advisory conditions for Khardung La and Chang La?"
      ],
      hi: [
        "लेह के लिए 48 घंटे का अनिवार्य अनुकूलन प्रोटोकॉल क्या है?",
        "तुरतुक और हानले जैसी ऑफबीट जगहों पर जाने से भीड़-नियंत्रण में कैसे मदद मिलती है?",
        "खारदुंग ला जैसे ऊंचे दर्रों के लिए मुझे क्या पैक करना चाहिए?",
        "खारदुंग ला और चांग ला के लिए वर्तमान सलाहकारी स्थिति क्या है?"
      ],
      bn: [
        "লেহ পৌঁছানোর পর বাধ্যতামূলক ৪৮ ঘণ্টার অভিযোজন নিয়ম কী?",
        "তুরতুক ও হানলের মতো অফবিট জায়গায় ভ্রমণ কীভাবে ভিড় নিয়ন্ত্রণে সাহায্য করে?",
        "খারদুং লা এর মতো উচ্চ গিরিপথের জন্য কী কী জিনিস প্যাক করা উচিত?",
        "খারদুং লা এবং চাং লা গিরিপথের বর্তমান অবস্থা কী?"
      ]
    };

    const sugs = $$(".ai-suggestions button");
    const questions = sugMap[lang] || sugMap.en;
    sugs.forEach((btn, idx) => {
      if (questions[idx]) btn.dataset.question = questions[idx];
    });

    // Keep AI's default welcome reply in English language
    const messages = $("#messages");
    if (messages) {
      const botMsgs = messages.querySelectorAll(".msg.bot");
      if (botMsgs.length === 1 && !messages.querySelector(".msg.user")) {
        botMsgs[0].innerHTML = t("ai_welcome", "en");
      }
    }

    // Notify user with ambient toast
    const langNames = { en: "English", hi: "हिंदी (Hindi)", bn: "বাংলা (Bengali)" };
    if (window.toast) {
      window.toast(`Language switched to ${langNames[lang] || lang}`);
    }

    // Trigger event for any interested component
    window.dispatchEvent(new CustomEvent("bharat-lang-changed", { detail: { lang } }));
  }

  function initI18n() {
    const select = $("#language");
    if (select) {
      select.value = currentLang;
      select.onchange = (e) => {
        setLanguage(e.target.value);
      };
    }
    // Apply saved or default language
    setLanguage(currentLang);
  }

  window.i18n = {
    t,
    setLanguage,
    getLanguage: () => currentLang,
    translations: TRANSLATIONS,
    getCategoryName: (catId) => {
      const item = CATEGORY_NAMES[catId];
      if (!item) return null;
      return item[currentLang] || item.en;
    },
    getJourneyNodes: () => {
      return JOURNEY_NODES[currentLang] || JOURNEY_NODES.en;
    },
    getDestinationTranslation: (destId) => {
      const item = DESTINATION_TRANSLATIONS[destId];
      if (!item) return null;
      return item[currentLang] || null;
    },
    getCircuitTranslation: (circuitId) => {
      const item = CIRCUIT_TRANSLATIONS[circuitId];
      if (!item) return null;
      return item[currentLang] || null;
    },
    getFoodTranslation: (foodName) => {
      const item = FOOD_TRANSLATIONS[foodName];
      if (!item) return null;
      return item[currentLang] || null;
    }
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initI18n, 10);
  } else {
    document.addEventListener("DOMContentLoaded", initI18n);
  }
})();
