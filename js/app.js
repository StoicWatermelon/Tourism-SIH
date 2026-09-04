/**
 * Bharat Explore — High-Altitude & Pan-India Tourism Intelligence
 * Smart India Hackathon (SIH 2026) Official Platform
 * Clean, flat modern UI with institutional glassmorphism & sustainable tourism engines
 */

// Curated destinations dataset featuring decongestion & offbeat corridors
const localDestinations = [
  {
    id: "pangong",
    name: "Pangong Tso Lake",
    location: "Ladakh",
    state: "Ladakh",
    category: "mountains",
    emotion: "peace",
    bestSeason: "May–Sep",
    difficulty: "Easy",
    type: "Alpine Lake",
    budget: 5000,
    altitude: "14,270 ft",
    isOffbeat: false,
    footfall: "High Footfall Hotspot",
    communityBenefit: "82% Direct Community Revenue",
    ecoBadges: [
      "Plastic-Free / Reusable Flask Mandatory",
      "Glacier Stream Protection"
    ],
    img: "https://images.unsplash.com/photo-1577500680965-6054e87d944b?auto=format&fit=crop&fm=jpg&q=85&w=1400",
    desc: "A dramatic 134 km saline lake at 14,270 ft shifting from turquoise to deep cobalt. High visitor congestion requires strict zero-plastic protocols."
  },
  {
    id: "hanle",
    name: "Hanle Dark Sky Reserve",
    location: "Ladakh",
    state: "Ladakh",
    category: "nature",
    emotion: "peace",
    bestSeason: "May–Oct",
    difficulty: "Moderate",
    type: "Dark Sky Reserve",
    budget: 5500,
    altitude: "14,900 ft",
    isOffbeat: true,
    footfall: "Eco-Dispersion Gem",
    communityBenefit: "95% Direct Community Revenue",
    ecoBadges: [
      "Dark Sky Protected",
      "Zero Light Pollution",
      "Village Astrostays"
    ],
    img: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=900&q=85",
    desc: "India's first certified Dark Sky Sanctuary offering pristine naked-eye Milky Way observation and village-run astrostays."
  },
  {
    id: "turtuk",
    name: "Turtuk Border Village",
    location: "Ladakh",
    state: "Ladakh",
    category: "culture",
    emotion: "culture",
    bestSeason: "Apr–Oct",
    difficulty: "Easy",
    type: "Heritage Village",
    budget: 4000,
    altitude: "9,800 ft",
    isOffbeat: true,
    footfall: "Eco-Dispersion Gem",
    communityBenefit: "90% Direct Community Revenue",
    ecoBadges: [
      "Eco-Dispersion Gem",
      "Organic Apricot Orchards",
      "Balti Living Museum"
    ],
    img: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=900&q=85",
    desc: "Northernmost village of India nestled in apricot groves, celebrating unique Balti culture, stone architecture, and women's cooperatives."
  },
  {
    id: "sham",
    name: "Sham Valley Eco Corridor",
    location: "Ladakh",
    state: "Ladakh",
    category: "villages",
    emotion: "peace",
    bestSeason: "Year-Round",
    difficulty: "Easy",
    type: "Eco Valley",
    budget: 3500,
    altitude: "10,200 ft",
    isOffbeat: true,
    footfall: "Eco-Dispersion Gem",
    communityBenefit: "92% Direct Community Revenue",
    ecoBadges: [
      "Acclimatization Priority",
      "Solar Heated Homestays",
      "Low-Carbon Route"
    ],
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    desc: "The gentle 'Baby Trek' corridor, ideal for safe low-altitude acclimatization while supporting smallholder apricot orchards and village homestays."
  },
  {
    id: "nubra",
    name: "Nubra Valley & Diskit",
    location: "Ladakh",
    state: "Ladakh",
    category: "mountains",
    emotion: "adventure",
    bestSeason: "May–Sep",
    difficulty: "Moderate",
    type: "Cold Desert",
    budget: 6500,
    altitude: "10,000 ft",
    isOffbeat: false,
    footfall: "High Footfall Hotspot",
    communityBenefit: "85% Direct Community Revenue",
    ecoBadges: [
      "Plastic-Free / Reusable Flask Mandatory",
      "Bactrian Camel Welfare"
    ],
    img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85",
    desc: "High-altitude desert valley featuring white sand dunes, Bactrian double-humped camels, and Diskit Gompa overlooking the Shyok River."
  },
  {
    id: "khardung",
    name: "Khardung La Pass",
    location: "Ladakh",
    state: "Ladakh",
    category: "adventure",
    emotion: "adventure",
    bestSeason: "May–Oct",
    difficulty: "Moderate",
    type: "Mountain Pass",
    budget: 2500,
    altitude: "17,582 ft",
    isOffbeat: false,
    footfall: "High Traffic Pass",
    communityBenefit: "80% Direct Community Revenue",
    ecoBadges: [
      "Acclimatization Priority",
      "Strict 15-Min Stay Limit",
      "4x4 Certified Route"
    ],
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    desc: "Legendary Himalayan pass connecting Leh to Nubra and Siachen. High altitude requires acclimatization priority and brief stops."
  },
  {
    id: "tsomoriri",
    name: "Tso Moriri Lake Sanctuary",
    location: "Ladakh",
    state: "Ladakh",
    category: "nature",
    emotion: "peace",
    bestSeason: "May–Sep",
    difficulty: "Moderate",
    type: "Wetland Reserve",
    budget: 7000,
    altitude: "14,836 ft",
    isOffbeat: true,
    footfall: "Eco-Dispersion Gem",
    communityBenefit: "94% Direct Community Revenue",
    ecoBadges: [
      "Black-Necked Crane Sanctuary",
      "Zero-Waste Camping",
      "Dark Sky Protected"
    ],
    img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85",
    desc: "Ramsar wetland sanctuary and sacred high-altitude lake surrounded by stark Changthang wilderness and nomadic settlements."
  },
  {
    id: "leh",
    name: "Leh Old Town Heritage Core",
    location: "Ladakh",
    state: "Ladakh",
    category: "culture",
    emotion: "culture",
    bestSeason: "Apr–Oct",
    difficulty: "Easy",
    type: "Living Heritage",
    budget: 3500,
    altitude: "11,500 ft",
    isOffbeat: false,
    footfall: "Urban Hub",
    communityBenefit: "90% Direct Community Revenue",
    ecoBadges: [
      "Mud-Brick Heritage Conservation",
      "Dzomsa Eco Refill Partner"
    ],
    img: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=900&q=85",
    desc: "Historic centre of Himalayan trade, home to Leh Palace, traditional wood and clay bakeries, and heritage stupas."
  },
  {
    id: "shanti",
    name: "Shanti Stupa Hilltop",
    location: "Leh",
    state: "Ladakh",
    category: "spirituality",
    emotion: "spirituality",
    bestSeason: "Apr–Oct",
    difficulty: "Easy",
    type: "Sacred Monument",
    budget: 500,
    altitude: "11,840 ft",
    isOffbeat: false,
    footfall: "Popular Landmark",
    communityBenefit: "100% Peace Trust Monastic Fund",
    ecoBadges: [
      "Monastic Silence Enforced",
      "Clean Solar Illumination"
    ],
    img: "https://images.unsplash.com/photo-1657617832971-6e966739cd10?auto=format&fit=crop&fm=jpg&q=85&w=1400",
    desc: "Hilltop Buddhist stupa offering panoramic 360° views of the Leh valley, Chanspa terraced fields, and snow-capped Zanskar peaks."
  },
  {
    id: "hemis",
    name: "Hemis Monastic Sanctuary",
    location: "Ladakh",
    state: "Ladakh",
    category: "culture",
    emotion: "culture",
    bestSeason: "Jun–Sep",
    difficulty: "Easy",
    type: "Monastery",
    budget: 1200,
    altitude: "12,000 ft",
    isOffbeat: false,
    footfall: "Heritage Center",
    communityBenefit: "88% Direct Community Revenue",
    ecoBadges: [
      "Ancient Murals Integrity",
      "Snow Leopard Buffer Zone"
    ],
    img: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=900&q=85",
    desc: "Drukpa lineage Buddhist monastery dating back to 1672, celebrated for its annual Cham masked dances and ancient thangka preservation."
  },
  {
    id: "zanskar",
    name: "Zanskar Deep Gorges",
    location: "Ladakh",
    state: "Ladakh",
    category: "adventure",
    emotion: "adventure",
    bestSeason: "Jun–Sep",
    difficulty: "Hard",
    type: "Expedition Valley",
    budget: 9000,
    altitude: "13,100 ft",
    isOffbeat: true,
    footfall: "Eco-Dispersion Gem",
    communityBenefit: "95% Direct Community Revenue",
    ecoBadges: [
      "Eco-Dispersion Gem",
      "Pristine Remote Circuit",
      "Leave No Trace Mandate"
    ],
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    desc: "Raw, isolated Himalayan river canyons, cliffside Phugtal monastery, and legendary trekking passes connecting Padum to Manali."
  },
  {
    id: "spiti",
    name: "Spiti Valley Middle Land",
    location: "Himachal Pradesh",
    state: "Himachal Pradesh",
    category: "mountains",
    emotion: "adventure",
    bestSeason: "Jun–Oct",
    difficulty: "Moderate",
    type: "Alpine Valley",
    budget: 6000,
    altitude: "12,500 ft",
    isOffbeat: true,
    footfall: "Eco-Dispersion Gem",
    communityBenefit: "91% Direct Community Revenue",
    ecoBadges: [
      "Eco-Dispersion Gem",
      "Dark Sky Protected",
      "Fossil Protection Zone"
    ],
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85",
    desc: "Cold desert valley renowned for Key Gompa, Tabo world heritage murals, and Langza marine fossil protection sites."
  }
];

let activeDestinations = [...localDestinations];
let currentFilter = "all";

// 20 Pan-India Regional Heritage & Eco Circuits with crisp, bounded assets
const regionalCircuits = [
  { id: "srinagar", name: "Srinagar & Dal Lake", state: "Jammu & Kashmir", region: "north", img: "assets/images/srinagar.jpg", desc: "Alpine water reflections, floating markets & Shalimar gardens", alt: "5,200 ft" },
  { id: "kurukshetra", name: "Kurukshetra Sacred Sarovar", state: "Haryana", region: "north", img: "assets/images/kurukshetra.png", desc: "Brahma Sarovar ghats, ancient pilgrimage corridors & epic history", alt: "850 ft" },
  { id: "rockgarden", name: "Rock Garden Sculptures", state: "Chandigarh", region: "north", img: "assets/images/rockgarden.png", desc: "World-renowned zero-waste visionary sculpture oasis", alt: "1,050 ft" },
  { id: "tawang", name: "Tawang Monastery Corridor", state: "Arunachal Pradesh", region: "northeast", img: "assets/images/tawang.png", desc: "High-altitude Tibetan monastery perched at 10,000 ft", alt: "10,000 ft" },
  { id: "cherrapunji", name: "Cherrapunji Living Root Bridges", state: "Meghalaya", region: "northeast", img: "assets/images/cherrapunji.png", desc: "Bio-engineered Ficus elastica bridges & mist-shrouded canyons", alt: "4,860 ft" },
  { id: "loktaklake", name: "Loktak Floating Lake", state: "Manipur", region: "northeast", img: "assets/images/loktaklake.png", desc: "Unique circular floating biomass phumdis & Sangai deer sanctuary", alt: "2,520 ft" },
  { id: "kohima", name: "Kohima & Naga Hills", state: "Nagaland", region: "northeast", img: "assets/images/kohima.png", desc: "Hornbill cultural heritage, scenic mountain ridges & tribal crafts", alt: "4,738 ft" },
  { id: "aizawl", name: "Aizawl & Durtlang Ridge", state: "Mizoram", region: "northeast", img: "assets/images/aizawl.png", desc: "Tranquil cloud-kissed ridges, Mizo bamboo crafts & church spires", alt: "3,700 ft" },
  { id: "ujjayantapalace", name: "Ujjayanta Royal Palace", state: "Tripura", region: "northeast", img: "assets/images/ujjayantapalace.png", desc: "Neoclassical lakeside palace surrounded by Mughal gardens", alt: "42 ft" },
  { id: "hampi", name: "Hampi UNESCO Ruins", state: "Karnataka", region: "south-islands", img: "assets/images/hampi.png", desc: "Granite boulder empire, Tungabhadra River & Vijayanagara architecture", alt: "1,530 ft" },
  { id: "hyderabad", name: "Hyderabad Heritage Core", state: "Telangana", region: "south-islands", img: "assets/images/hyderabad.png", desc: "Charminar, Golconda fortress acoustics & Nizami culinary trail", alt: "1,778 ft" },
  { id: "visakhapatnam", name: "Visakhapatnam Ghats Coast", state: "Andhra Pradesh", region: "south-islands", img: "assets/images/visakhapatnam.png", desc: "Where the Eastern Ghats plunge dramatically into the Bay of Bengal", alt: "150 ft" },
  { id: "whitetown", name: "White Town Promenade", state: "Puducherry", region: "south-islands", img: "assets/images/whitetown.png", desc: "Cobblestone French colonial villas, cafes & Bay promenade", alt: "20 ft" },
  { id: "kavaratti", name: "Kavaratti Coral Lagoon", state: "Lakshadweep", region: "south-islands", img: "assets/images/kavaratti.png", desc: "Pristine white sand atolls, turquoise waters & marine reserves", alt: "10 ft" },
  { id: "swarajdeep", name: "Swaraj Dweep (Havelock)", state: "Andaman & Nicobar", region: "south-islands", img: "assets/images/swarajdeep.png", desc: "Radhanagar Beach sunsets, bio-luminescent kayaking & reefs", alt: "30 ft" },
  { id: "mumbai", name: "Mumbai Marine Promenade", state: "Maharashtra", region: "west-central", img: "assets/images/mumbai.png", desc: "Gateway of India, Arabian Sea breeze & Victorian Gothic heritage", alt: "46 ft" },
  { id: "daman", name: "Moti Daman Coastal Fort", state: "Daman & Diu", region: "west-central", img: "assets/images/daman.png", desc: "16th-century ramparts overlooking the Arabian sea & palm beaches", alt: "16 ft" },
  { id: "khajuraho", name: "Khajuraho Temple Marvels", state: "Madhya Pradesh", region: "west-central", img: "assets/images/khajuraho.png", desc: "Intricate Chandela dynasty sandstone art & living cultural legacy", alt: "930 ft" },
  { id: "bastar", name: "Bastar Indigenous Corridors", state: "Chhattisgarh", region: "west-central", img: "assets/images/bastar.png", desc: "Chitrakote horseshoe falls & sacred Dhokra lost-wax bronze crafts", alt: "1,800 ft" },
  { id: "hundrufalls", name: "Hundru Falls Cascade", state: "Jharkhand", region: "west-central", img: "assets/images/hundrufalls.png", desc: "320 ft Subarnarekha drop carving spectacular granite rock pools", alt: "2,140 ft" }
];

const categories = [
  ["mountains", "🏔", "Mountains"],
  ["adventure", "🏕", "Adventure"],
  ["nature", "🌳", "Nature"],
  ["culture", "🎭", "Culture"],
  ["spirituality", "🛕", "Spiritual"],
  ["heritage", "🏛", "Heritage"],
  ["food", "🍛", "Zero-Mile Food"],
  ["villages", "🏘", "Eco Villages"]
];

const states = {
  Ladakh: {
    capital: "Leh",
    altitude: "11,500 – 18,380 ft",
    season: "May – September",
    top: ["Pangong Tso", "Nubra Valley", "Hanle Dark Sky", "Turtuk", "Khardung La"],
    exp: "High-altitude passes, Dark Sky stargazing, solar village homestays, apricot trail decongestion",
    culture: "Tibetan Buddhist heritage, sacred Cham dances, Losar celebrations",
    food: "Thukpa, Skyu, Butter Tea (Gur Gur), Tingmo, Organic Apricot Treats"
  },
  "Himachal Pradesh": {
    capital: "Shimla",
    altitude: "2,200 – 14,000 ft",
    season: "March – June & Sep – Nov",
    top: ["Spiti Valley", "Manali", "Dharamshala", "Kinnaur"],
    exp: "Alpine trekking, cedar valleys, river rafting, mountain homestays",
    culture: "Himalayan folk traditions, Buddhist monasteries in Dharamshala & Spiti",
    food: "Dham, Siddu, Chha Gosht, Babru"
  },
  Uttarakhand: {
    capital: "Dehradun",
    altitude: "1,500 – 12,000 ft",
    season: "March – June & Sep – Nov",
    top: ["Valley of Flowers", "Rishikesh", "Auli", "Chopta"],
    exp: "Garhwal & Kumaon alpine trails, Ganges rafting, spiritual yoga retreats",
    culture: "Garhwali & Kumaoni rituals, Ganga Aarti",
    food: "Kafuli, Chainsoo, Aloo ke Gutke, Bal Mithai"
  },
  Sikkim: {
    capital: "Gangtok",
    altitude: "5,400 – 17,800 ft",
    season: "March – May & Oct – Dec",
    top: ["Gurudongmar Lake", "Pelling", "Yuksom", "Nathula Pass"],
    exp: "Kanchenjunga vistas, 100% organic farms, sacred alpine lakes",
    culture: "Lepcha, Bhutia, and Nepali traditions",
    food: "Momos, Thukpa, Gundruk, Kinema"
  },
  Rajasthan: {
    capital: "Jaipur",
    altitude: "700 – 1,200 ft",
    season: "October – March",
    top: ["Jaipur", "Jaisalmer", "Udaipur", "Jodhpur"],
    exp: "Living fortresses, Thar desert dune safaris, royal palaces, stepwells",
    culture: "Rajput heritage, Kalbelia dance, block printing",
    food: "Dal Baati Churma, Ker Sangri, Gatte ki Sabzi"
  },
  Goa: {
    capital: "Panaji",
    altitude: "Sea level",
    season: "November – February",
    top: ["Palolem", "Old Goa Churches", "Dudhsagar Falls", "Fontainhas"],
    exp: "Eco-coastal trails, spice plantations, kayaking, Portuguese heritage walks",
    culture: "Konkani & Indo-Portuguese architecture and music",
    food: "Fish Curry Thali, Bebinca, Poi, Xacuti"
  },
  Kerala: {
    capital: "Thiruvananthapuram",
    altitude: "Sea level – 8,800 ft",
    season: "October – March",
    top: ["Alleppey Backwaters", "Munnar", "Kochi", "Wayanad"],
    exp: "Electric solar houseboats, Ayurvedic wellness retreats, tea estate hikes",
    culture: "Kathakali, Theyyam, Kalaripayattu martial arts",
    food: "Appam with Stew, Sadya, Kerala Fish Roast"
  },
  "West Bengal": {
    capital: "Kolkata",
    altitude: "Sea level – 7,000 ft",
    season: "October – March",
    top: ["Darjeeling Tiger Hill", "Sundarbans Mangroves", "Kalimpong"],
    exp: "Himalayan toy train, Royal Bengal tiger boat safaris, colonial heritage",
    culture: "Bengali literature, Rabindra Sangeet, terracotta craft",
    food: "Macher Jhol, Kosha Mangsho, Mishti Doi, Sandesh"
  }
};

// Local Economy Direct-Link Foods with zero food miles & community cooperative tags
const foods = [
  {
    name: "Organic Momos",
    origin: "Ladakh",
    desc: "Steamed dumplings stuffed with wild mountain greens or pasture yak chhurpi cheese.",
    tags: ["Locally Sourced", "Zero Food Miles", "Community-Led Cooperative"],
    revenueShare: "92% Direct Community Revenue",
    img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=700&q=80"
  },
  {
    name: "High-Altitude Thukpa",
    origin: "Ladakh",
    desc: "Warming whole-grain noodle soup slow-simmered with mountain celery, root radish, and garlic broth.",
    tags: ["Locally Sourced", "Zero Food Miles"],
    revenueShare: "88% Direct Community Revenue",
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80"
  },
  {
    name: "Traditional Skyu Stew",
    origin: "Ladakh",
    desc: "Handcrafted wheat and barley thumb-pasta stew slow-cooked on village solar & clay hearths.",
    tags: ["Locally Sourced", "Community-Led Cooperative"],
    revenueShare: "95% Direct Community Revenue",
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80"
  },
  {
    name: "Steamed Tingmo",
    origin: "Ladakh",
    desc: "Fluffy flower-shaped steamed bread made with organic Tsampa stone-ground wheat.",
    tags: ["Locally Sourced", "Zero Food Miles"],
    revenueShare: "90% Direct Community Revenue",
    img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80"
  },
  {
    name: "Salted Butter Tea (Gur Gur)",
    origin: "Ladakh",
    desc: "Essential high-altitude hydration tea churned with pasture yak butter and Himalayan rock salt.",
    tags: ["Locally Sourced", "Community-Led Cooperative"],
    revenueShare: "94% Direct Community Revenue",
    img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80"
  }
];

const journeyNodes = [
  "Ladakh (High Passes)",
  "Hanle (Dark Sky)",
  "Himachal (Spiti)",
  "Uttarakhand (Ganges)",
  "Sikkim (Himalayas)",
  "Rajasthan (Deserts)",
  "Kerala (Backwaters)"
];

const stateCoordinates = {
  Ladakh: [34.1526, 77.5771],
  "Himachal Pradesh": [31.1048, 77.1734],
  Uttarakhand: [30.3165, 78.0322],
  Sikkim: [27.3389, 88.6065],
  Rajasthan: [26.9124, 75.7873],
  Goa: [15.2993, 74.1240],
  Kerala: [10.8505, 76.2711],
  "West Bengal": [22.5726, 88.3639]
};


// ═══════════════════════════════════════════════════════
//  INTERACTIVE MAP & HOTSPOTS ENGINE
//  Extracted to js/map.js (Leaflet GIS, 44 Hotspots & GeoJSON)
// ═══════════════════════════════════════════════════════

let currentScore = 85;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// Toast notification helper
const toast = (text) => {
  const t = $("#toast");
  if (!t) return;
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2800);
};

// --- Backend API Integration ---

async function fetchDestinationsFromAPI() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600);
    const res = await fetch("http://127.0.0.1:8000/api/destinations", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        activeDestinations = data;
        renderDestinations();
        console.log(`[API] Loaded destinations and merged with SIH sustainable metadata.`);
      }
    }
  } catch (err) {
    console.warn("[API] Backend offline or delayed; utilizing resilient local destination cache.");
  }
}

async function fetchPassesFromAPI() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/passes");
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("[API] Passes API unreachable; using simulated pass telemetry.");
  }
  return {
    "Khardung La": {
      status: "OPEN",
      altitude: "17,582 ft",
      condition: "Pass cleared. Crossing permitted between 06:00 and 16:00 with 4x4 snow chains.",
      safe: true,
      temperature: "-2°C"
    },
    "Chang La": {
      status: "CAUTION",
      altitude: "17,688 ft",
      condition: "High ridge winds (-5°C). Snow drift active near summit. Cross before 14:00.",
      safe: true,
      temperature: "-5°C"
    },
    "Zoji La": {
      status: "RESTRICTED",
      altitude: "11,575 ft",
      condition: "Freight convoy movement active from Sonamarg. Expect intermittent 2-hour delays.",
      safe: false,
      temperature: "1°C"
    },
    "Baralacha La": {
      status: "OPEN",
      altitude: "16,040 ft",
      condition: "Clear passage on Manali-Leh highway. Acclimatization stop recommended at Jispa.",
      safe: true,
      temperature: "-4°C"
    }
  };
}

function getSessionId() {
  let sid = localStorage.getItem("bharatSessionId");
  if (!sid) {
    sid = "sih_user_" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("bharatSessionId", sid);
  }
  return sid;
}

async function syncSavedToBackend(savedIds) {
  try {
    await fetch("http://127.0.0.1:8000/api/journey/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: getSessionId(),
        destination_ids: savedIds,
        notes: "SIH 2026 Sustainable Expedition"
      })
    });
  } catch (e) {
    // Silent fallback
  }
}

// --- Dynamic Rendering & Decongestion Engine ---

function renderCategories() {
  const grid = $("#categoryGrid");
  if (!grid) return;
  
  grid.innerHTML = categories.map((c, i) => {
    const label = (window.i18n && typeof window.i18n.getCategoryName === "function")
      ? (window.i18n.getCategoryName(c[0]) || c[2])
      : c[2];
    return `
      <button class="category ${i === 0 ? "active" : ""}" data-category="${c[0]}">
        <span>${c[1]}</span>
        <small>${label}</small>
      </button>
    `;
  }).join("");

  $$(".category").forEach(b => {
    b.onclick = () => {
      $$(".category").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      renderResults(b.dataset.category);
    };
  });
}

function renderResults(cat = "mountains") {
  const target = $("#categoryResults");
  if (!target) return;

  let arr = activeDestinations.filter(d => (d.category || "").toLowerCase() === cat.toLowerCase());
  if (!arr.length) {
    arr = activeDestinations.filter(d => 
      (d.name || "").toLowerCase().includes(cat.toLowerCase()) || 
      (d.type || "").toLowerCase().includes(cat.toLowerCase())
    );
  }

  if (arr.length) {
    target.innerHTML = arr.slice(0, 4).map(d => {
      const trans = (window.i18n && typeof window.i18n.getDestinationTranslation === "function")
        ? window.i18n.getDestinationTranslation(d.id)
        : null;
      const dName = (trans && trans.name) ? trans.name : d.name;
      const dDesc = (trans && trans.desc) ? trans.desc : d.desc;
      const seasonLbl = (window.i18n && typeof window.i18n.t === "function") ? window.i18n.t("lbl_season") : "Best Season:";

      return `
        <article class="result-card">
          <span class="mini">${d.location} • ${d.type}</span>
          <h3>${dName}</h3>
          <p>${dDesc}</p>
          <div style="margin-top:auto;">
            <span style="font-size:11px; color:var(--emerald-pop); font-weight:700; display:block; margin-bottom:4px;">
              ✦ ${d.communityBenefit || "Direct Community Benefit"}
            </span>
            <small>${seasonLbl} ${d.bestSeason || d.best_season || "May–Sep"}</small>
          </div>
        </article>
      `;
    }).join("");
  } else {
    target.innerHTML = `
      <div class="result-card" style="grid-column: span 4; text-align:center;">
        <h3>Explore more destinations across India</h3>
        <p>Connecting verified regional routes for ${cat} via Bharat Explore Smart Database.</p>
      </div>
    `;
  }
}

function renderCircuits(region = "all") {
  const grid = $("#circuitsGrid");
  if (!grid) return;

  const filtered = region === "all" 
    ? regionalCircuits 
    : regionalCircuits.filter(c => c.region === region);

  const actionText = (window.i18n && typeof window.i18n.t === "function")
    ? window.i18n.t("btn_explore_node")
    : "Explore Regional Node →";

  grid.innerHTML = filtered.map(c => {
    const customDesc = (window.i18n && typeof window.i18n.getCircuitTranslation === "function")
      ? (window.i18n.getCircuitTranslation(c.id) || c.desc)
      : c.desc;

    return `
      <article class="circuit-card" style="background-image: url('${c.img}')" onclick="selectCircuit('${c.state}')" title="Explore ${c.name} (${c.state})">
        <div class="circuit-card-overlay">
          <span class="circuit-tag">${c.state} • ${c.alt}</span>
          <h3>${c.name}</h3>
          <p>${customDesc}</p>
          <span class="circuit-action">${actionText}</span>
        </div>
      </article>
    `;
  }).join("");

  // Add 3D perspective tilt & specular glow to circuit cards
  addCard3D(grid.querySelectorAll(".circuit-card"), { maxTilt: 9, glow: true });
}

function selectCircuit(stateName) {
  toast(`Selected ${stateName} regional circuit.`);
  statePanel(stateName);
  const mapSec = $("#mapSection");
  if (mapSec) {
    mapSec.scrollIntoView({ behavior: "smooth" });
  }
}

function renderDestinations() {
  const grid = $("#destinationGrid");
  if (!grid) return;

  let filtered = activeDestinations;
  if (currentFilter === "offbeat") {
    filtered = activeDestinations.filter(d => d.isOffbeat);
  } else if (currentFilter === "high-altitude") {
    filtered = activeDestinations.filter(d => (d.altitude || "").includes("14,") || (d.altitude || "").includes("17,"));
  } else if (currentFilter === "community") {
    filtered = activeDestinations.filter(d => (d.communityBenefit || "").includes("9") || d.category === "villages");
  }

  const addText = (window.i18n && typeof window.i18n.t === "function") ? window.i18n.t("btn_add_journey") : "♥ Add to Journey";
  const exploreText = (window.i18n && typeof window.i18n.t === "function") ? window.i18n.t("btn_explore_details") : "Explore Details";
  const seasonLabel = (window.i18n && typeof window.i18n.t === "function") ? window.i18n.t("lbl_season") : "Season:";
  const budgetLabel = (window.i18n && typeof window.i18n.t === "function") ? window.i18n.t("lbl_budget") : "Budget:";
  const ecoGemLabel = (window.i18n && typeof window.i18n.t === "function") ? window.i18n.t("badge_eco_gem") : "🌱 Eco-Dispersion Gem";
  const pledgeTitle = (window.i18n && typeof window.i18n.t === "function") ? window.i18n.t("title_eco_pledge") : "Click to commit eco-action (+5 pts)";

  grid.innerHTML = filtered.map(d => {
    const trans = (window.i18n && typeof window.i18n.getDestinationTranslation === "function") 
      ? window.i18n.getDestinationTranslation(d.id) 
      : null;
    const displayName = (trans && trans.name) ? trans.name : d.name;
    const displayDesc = (trans && trans.desc) ? trans.desc : d.desc;

    const offbeatBadgeHtml = d.isOffbeat 
      ? `<span class="offbeat-badge">${ecoGemLabel}</span>` 
      : `<span style="font-size:10px; opacity:0.85;">📍 ${d.altitude || "Himalayas"}</span>`;
    
    const benefitBadgeHtml = d.communityBenefit 
      ? `<span class="community-benefit-badge">🤝 ${d.communityBenefit}</span>` 
      : "";

    const chipsHtml = (d.ecoBadges || []).map(b => `
      <span class="eco-chip" onclick="pledgeEcoBadge(event, '${b}')" title="${pledgeTitle}">
        ${b}
      </span>
    `).join("");

    return `
      <article class="destination" style="background-image:url('${d.img}')">
        <div class="dest-top-badges">
          ${offbeatBadgeHtml}
          ${benefitBadgeHtml}
        </div>

        <div class="dest-info">
          <span class="eyebrow">${d.location.toUpperCase()} • ${d.type}</span>
          <h3>${displayName}</h3>
          <p>${displayDesc}</p>
          <div class="eco-chips">${chipsHtml}</div>
          <p><b>${seasonLabel}</b> ${d.bestSeason || d.best_season} • <b>${budgetLabel}</b> ₹${(d.budget || 3000).toLocaleString()}</p>
          <div class="dest-actions">
            <button onclick="saveDestination('${d.id}')">${addText}</button>
            <button onclick="showDestination('${d.id}')">${exploreText}</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Specular mouse-tracking glow — cached rect on enter to avoid layout thrashing
  grid.querySelectorAll(".destination").forEach(card => {
    let rect = null;
    card.addEventListener("mouseenter", () => {
      rect = card.getBoundingClientRect();
    }, { passive: true });
    card.addEventListener("mousemove", (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    }, { passive: true });
    card.addEventListener("mouseleave", () => {
      rect = null;
    }, { passive: true });
  });
}

// Clickable practical travel tags pledge
function pledgeEcoBadge(event, badgeText) {
  if (event) event.stopPropagation();
  updateResponsibleScore(5, `Eco-Pledge committed: "${badgeText}"`);
}

// Local food support action
function supportLocalFood(event, foodName) {
  if (event) event.stopPropagation();
  updateResponsibleScore(5, `Zero-Food-Miles choice: Supported ${foodName}!`);
}

function renderFood() {
  const grid = $("#foodGrid");
  if (!grid) return;

  const supportTitle = (window.i18n && typeof window.i18n.t === "function") 
    ? window.i18n.t("title_food_support") 
    : "Click to support zero-food-mile local produce (+5 pts)";

  grid.innerHTML = foods.map(f => {
    const trans = (window.i18n && typeof window.i18n.getFoodTranslation === "function")
      ? window.i18n.getFoodTranslation(f.name)
      : null;
    const displayName = (trans && trans.name) ? trans.name : f.name;
    const displayDesc = (trans && trans.desc) ? trans.desc : f.desc;

    const tagsHtml = f.tags.map(t => `<span class="food-tag">${t}</span>`).join("");
    return `
      <article class="food" style="background-image:url('${f.img}')" onclick="supportLocalFood(event, '${f.name}')" title="${supportTitle}">
        <div>
          <span class="eyebrow">${f.origin.toUpperCase()}</span>
          <h3>${displayName}</h3>
          <div class="food-tags">${tagsHtml}</div>
          <p>${displayDesc}</p>
          <span class="food-revenue-share">🤝 ${f.revenueShare}</span>
        </div>
      </article>
    `;
  }).join("");

  // Add mouse-tracking 3D tilt + specular glow to food cards
  addCard3D(grid.querySelectorAll(".food"), { maxTilt: 8 });
}

// Universal 3D Card Interactivity — specular glow + tilt on any card selector
function addCard3D(cards, opts = {}) {
  const maxTilt = opts.maxTilt || 6;  // degrees
  const glow = opts.glow !== false;   // default true

  cards.forEach(card => {
    let rect = null;
    let rafId = null;

    card.addEventListener("mouseenter", () => {
      rect = card.getBoundingClientRect();
    }, { passive: true });

    card.addEventListener("mousemove", (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
        const dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1

        const rotY = dx * maxTilt;
        const rotX = -dy * maxTilt * 0.6;

        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;

        if (glow) {
          const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
          const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
          card.style.setProperty("--mouse-x", `${x}%`);
          card.style.setProperty("--mouse-y", `${y}%`);
        }
      });
    }, { passive: true });

    card.addEventListener("mouseleave", () => {
      rect = null;
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = "";
    }, { passive: true });
  });
}

function renderJourney() {
  const track = $("#journeyTrack");
  if (!track) return;

  const nodes = (window.i18n && typeof window.i18n.getJourneyNodes === "function") 
    ? window.i18n.getJourneyNodes() 
    : journeyNodes;

  const icons = ["🏔", "🌌", "🌲", "🕉", "🗻", "🏰", "🥥"];
  track.innerHTML = nodes.map((x, i) => `
    <div class="journey-node">
      <div class="circle">${icons[i % icons.length]}</div>
      <b>${x}</b>
    </div>
    ${i < nodes.length - 1 ? '<div class="journey-line"></div>' : ''}
  `).join("");
}

function showDestination(id) {
  const d = activeDestinations.find(x => x.id === id);
  if (!d) return;
  toast(`${d.name} (${d.location}): Altitude ${d.altitude || "High Altitude"} • ${d.communityBenefit || "Eco Certified"}`);
}

// --- Journey Bookmarks & Drawer Flow ---

function updateSavedCount() {
  const saved = JSON.parse(localStorage.getItem("bharatSaved") || "[]");
  const countEl = $("#navSavedCount");
  const drawerCount = $("#drawerCount");

  if (countEl) countEl.textContent = saved.length;
  if (drawerCount) drawerCount.textContent = saved.length;
}

function saveDestination(id) {
  let saved = JSON.parse(localStorage.getItem("bharatSaved") || "[]");
  const dest = activeDestinations.find(d => d.id === id);
  if (!saved.includes(id)) {
    saved.push(id);
    localStorage.setItem("bharatSaved", JSON.stringify(saved));
    syncSavedToBackend(saved);
    // Pillar 3: Award eco points for saving offbeat/eco-dispersion destinations
    if (dest && dest.isOffbeat) {
      updateResponsibleScore(10, `Eco-Dispersion gem saved: ${dest.name}!`);
    } else {
      toast("Saved to My Journey ♥");
    }
  } else {
    toast("Already in your Journey list ♥");
  }
  updateSavedCount();
  renderJourneyDrawer();
}

function removeSavedDestination(id) {
  let saved = JSON.parse(localStorage.getItem("bharatSaved") || "[]");
  saved = saved.filter(x => x !== id);
  localStorage.setItem("bharatSaved", JSON.stringify(saved));
  syncSavedToBackend(saved);
  updateSavedCount();
  renderJourneyDrawer();
  toast("Removed from your Journey list");
}

function renderJourneyDrawer() {
  const container = $("#journeyDrawerList");
  const totalBudgetEl = $("#journeyTotalBudget");
  if (!container) return;

  const savedIds = JSON.parse(localStorage.getItem("bharatSaved") || "[]");
  const savedItems = activeDestinations.filter(d => savedIds.includes(d.id));

  if (!savedItems.length) {
    const emptyMsg = (window.i18n && typeof window.i18n.t === "function") 
      ? window.i18n.t("drawer_empty") 
      : "No saved destinations yet. Click \"♥ Add to Journey\" on any destination card to bookmark your dream route.";
    container.innerHTML = `
      <div class="empty-state">
        <span style="font-size:36px;">🗺️</span>
        <p>${emptyMsg}</p>
      </div>
    `;
    if (totalBudgetEl) totalBudgetEl.textContent = "₹0";
    return;
  }

  let totalBudget = 0;
  container.innerHTML = savedItems.map(item => {
    totalBudget += (item.budget || 3500);
    const trans = (window.i18n && typeof window.i18n.getDestinationTranslation === "function")
      ? window.i18n.getDestinationTranslation(item.id)
      : null;
    const itemName = (trans && trans.name) ? trans.name : item.name;

    return `
      <div class="drawer-item">
        <img src="${item.img}" alt="${itemName}">
        <div class="drawer-item-info">
          <h4>${itemName}</h4>
          <p>📍 ${item.location} • ₹${(item.budget || 3500).toLocaleString()}</p>
          <span style="font-size:10.5px; color:var(--emerald-pop); font-weight:700;">${item.communityBenefit || "Eco Certified"}</span>
        </div>
        <button class="drawer-item-remove" onclick="removeSavedDestination('${item.id}')" title="Remove" aria-label="Remove destination">✕</button>
      </div>
    `;
  }).join("");

  if (totalBudgetEl) totalBudgetEl.textContent = `₹${totalBudget.toLocaleString()}`;
}

// --- Leaflet Map & State Discovery Engine ---


// ═══════════════════════════════════════════════════════
//  LEAFLET MAP & STATE DISCOVERY ENGINE
//  Extracted to js/map.js (Tile layer, cards, boundaries & filters)
// ═══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
//  AI AGENT & SMART ITINERARY PLANNER
//  Extracted to js/ai.js (Streaming chat, markdown, pass-audited route generator)
// ═══════════════════════════════════════════════════════

// --- Gamified Responsible Tourism Score ---

function animateScore(targetScore) {
  const scoreEl = $("#score");
  const barEl = $("#scoreBar");
  const ringFill = $("#scoreRingFill");
  const cardEl = $(".score-card");
  if (!scoreEl) return;

  targetScore = Math.max(0, Math.min(100, targetScore));
  const startScore = parseInt(scoreEl.textContent) || 85;
  const duration = 600;
  const startTime = performance.now();
  // SVG ring: circumference = 2 * PI * r = 2 * PI * 65 ≈ 408
  const CIRCUMFERENCE = 408;

  if (cardEl) {
    cardEl.classList.add("pulse-glow");
    setTimeout(() => cardEl.classList.remove("pulse-glow"), 700);
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(startScore + (targetScore - startScore) * ease);

    scoreEl.textContent = val;
    if (barEl) barEl.style.width = `${val}%`;
    // Animate SVG ring: offset decreases as score increases
    if (ringFill) {
      const dashOffset = CIRCUMFERENCE - (val / 100) * CIRCUMFERENCE;
      ringFill.style.strokeDashoffset = dashOffset;
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      currentScore = targetScore;
      localStorage.setItem("bharatScore", currentScore);
      checkRewardUnlock();
    }
  }

  requestAnimationFrame(step);
}

function updateResponsibleScore(delta, message) {
  const newScore = Math.min(100, Math.max(0, currentScore + delta));
  animateScore(newScore);
  if (message) toast(`${message} (+${delta} pts)`);
}

function checkRewardUnlock() {
  // Legacy token coupon vouchers replaced by The Great Himalayan Eco-Expedition game
}

function triggerEcoAction(type) {
  const actions = {
    plastic: { pts: 5, msg: "Reused hydration flask & zero single-use plastic commitment!" },
    homestay: { pts: 10, msg: "Booked certified Ladakhi village homestay!" },
    water: { pts: 5, msg: "Protected fragile glacial streams & natural water springs!" },
    culture: { pts: 5, msg: "Observed monastic silence & respectful cultural etiquette!" },
    wildlife: { pts: 5, msg: "Maintained leave-no-trace distance from high-altitude wildlife!" },
    local: { pts: 10, msg: "Purchased direct handloom pashmina from village cooperative!" }
  };
  const act = actions[type] || { pts: 5, msg: "Eco-action recorded!" };
  updateResponsibleScore(act.pts, act.msg);
}

function pledgeEcoPass() {
  updateResponsibleScore(10, "Himalayan Leave-No-Trace Pledge signed!");
  const modal = $("#fieldKitModal");
  if (modal) modal.classList.remove("open");
}

// Pillar 3: Plastic-Free Reusable Flask Toggle
function togglePlasticFree(btn) {
  if (!btn) return;
  if (btn.classList.contains("pledged")) {
    btn.classList.remove("pledged");
    toast("Plastic-free pledge removed.");
  } else {
    btn.classList.add("pledged");
    updateResponsibleScore(5, "Pledged Plastic-Free & Reusable Flask commitment!");
  }
}

// --- Global Search ---

function search(q) {
  q = (q || "").toLowerCase().trim();
  const resultsEl = $("#searchResults");
  if (!resultsEl) return;

  const matches = activeDestinations.filter(d => 
    `${d.name} ${d.location} ${d.type} ${d.category} ${d.desc} ${d.state || ""}`.toLowerCase().includes(q)
  );

  if (matches.length) {
    resultsEl.innerHTML = matches.map(d => `
      <article class="result-card">
        <span class="mini">${d.location} • ${d.type}</span>
        <h3>${d.name}</h3>
        <p>${d.desc}</p>
        <span style="font-size:11px; color:var(--emerald-pop); font-weight:700; display:block; margin:6px 0;">
          ✦ ${d.communityBenefit || "Eco Certified"}
        </span>
        <div style="display:flex; gap:8px; margin-top:10px;">
          <button class="btn primary" style="padding:6px 14px; font-size:12px;" onclick="showDestination('${d.id}')">Explore</button>
          <button class="btn ghost" style="padding:6px 14px; font-size:12px; color:var(--ink); border-color:rgba(0,0,0,0.15);" onclick="saveDestination('${d.id}')">♥ Save</button>
        </div>
      </article>
    `).join("");
  } else {
    resultsEl.innerHTML = `
      <div class="result-card" style="grid-column: span 4; text-align:center;">
        <h3>No direct match found for "${q}"</h3>
        <p>Try searching for: Pangong, Turtuk, Hanle, Nubra, Khardung La, Spiti, or Monasteries.</p>
      </div>
    `;
  }
}

// --- App Initialization ---

async function init() {
  const savedScore = localStorage.getItem("bharatScore");
  if (savedScore) {
    currentScore = parseInt(savedScore, 10);
    const scoreEl = $("#score");
    const barEl = $("#scoreBar");
    if (scoreEl) scoreEl.textContent = currentScore;
    if (barEl) barEl.style.width = `${currentScore}%`;
  }
  checkRewardUnlock();

  // Instant render with resilient local data (0ms startup delay)
  activeDestinations = localDestinations;

  renderCategories();
  renderResults();
  renderCircuits();
  renderDestinations();
  renderFood();
  renderJourney();
  updateSavedCount();

  // Re-render dynamic grids whenever language switches
  window.addEventListener("bharat-lang-changed", () => {
    renderCategories();
    renderCircuits();
    renderDestinations();
    renderFood();
    renderJourney();
    checkRewardUnlock();
    renderJourneyDrawer();
  });

  // Initialize modular subsystems
  if (typeof window.initMap === "function") window.initMap();
  if (typeof window.initAI === "function") window.initAI();

  // Background non-blocking API sync
  fetchDestinationsFromAPI();

  // Circuit region filter pills
  $$(".circuit-pill").forEach(pill => {
    pill.onclick = () => {
      $$(".circuit-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      renderCircuits(pill.dataset.region);
    };
  });

  // Decongestion & Offbeat filter pills
  $$(".filter-pill").forEach(pill => {
    pill.onclick = () => {
      $$(".filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentFilter = pill.dataset.filter;
      renderDestinations();

      if (currentFilter === "offbeat") {
        toast("🌱 Decongestion Active: Highlighting low-footfall secondary gems to protect fragile ecosystems.");
      } else {
        toast(`Filtered by: ${pill.textContent.trim()}`);
      }
    };
  });

  // Map Hotspot Category Filter Pills
  $$(".map-filter-pill").forEach(pill => {
    pill.onclick = () => {
      $$(".map-filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      filterMapHotspots(pill.dataset.mapFilter);
    };
  });

  // Floating navbar scroll effect
  window.addEventListener("scroll", () => {
    const nav = $("#navbar");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 25);
  }, { passive: true });

  // Mobile menu toggle
  const navToggle = $(".nav-toggle");
  if (navToggle) {
    navToggle.onclick = () => {
      const nav = $(".nav");
      nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", nav.classList.contains("open"));
    };

    $$(".nav nav a").forEach(a => {
      a.addEventListener("click", () => {
        const nav = $(".nav");
        if (nav && nav.classList.contains("open")) {
          nav.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // Itinerary form submission
  const plannerForm = $("#plannerForm");
  if (plannerForm) plannerForm.onsubmit = itinerary;

  // AI Chat form submission
  const chatForm = $("#chatForm");
  if (chatForm) {
    chatForm.onsubmit = e => {
      e.preventDefault();
      const input = $("#chatInput");
      askAI(input.value);
      input.value = "";
    };
  }

  // Suggestion buttons
  $$(".ai-suggestions button").forEach(b => {
    b.onclick = () => askAI(b.dataset.question);
  });

  // Global search buttons
  const globalSearchBtn = $("#globalSearchBtn");
  if (globalSearchBtn) {
    globalSearchBtn.onclick = () => {
      search($("#globalSearch").value);
      $("#searchModal").classList.add("open");
    };
  }

  const globalSearch = $("#globalSearch");
  if (globalSearch) {
    globalSearch.onkeydown = e => {
      if (e.key === "Enter") $("#globalSearchBtn").click();
    };
  }

  const searchBtn = $("#searchBtn");
  if (searchBtn) {
    searchBtn.onclick = () => $("#searchModal").classList.add("open");
  }

  const modalSearch = $("#modalSearch");
  if (modalSearch) {
    modalSearch.oninput = e => search(e.target.value);
  }

  // Saved Journey button -> Opens Journey Drawer with Offline Field Kit
  const savedBtn = $("#savedBtn");
  if (savedBtn) {
    savedBtn.onclick = () => {
      renderJourneyDrawer();
      $("#journeyDrawer").classList.add("open");
    };
  }

  // Emergency & Eco Field Kit quick button in Navbar
  const fieldKitQuickBtn = $("#fieldKitQuickBtn");
  if (fieldKitQuickBtn) {
    fieldKitQuickBtn.onclick = () => {
      $("#fieldKitModal").classList.add("open");
    };
  }

  // Open field kit from drawer
  const openFieldKitBtn = $("#openFieldKitBtn");
  if (openFieldKitBtn) {
    openFieldKitBtn.onclick = () => {
      $("#journeyDrawer").classList.remove("open");
      $("#fieldKitModal").classList.add("open");
    };
  }


  // Plan from journey drawer button
  const planFromJourneyBtn = $("#planFromJourneyBtn");
  if (planFromJourneyBtn) {
    planFromJourneyBtn.onclick = () => {
      $("#journeyDrawer").classList.remove("open");
      const savedIds = JSON.parse(localStorage.getItem("bharatSaved") || "[]");
      const savedItems = activeDestinations.filter(d => savedIds.includes(d.id));
      const targetState = savedItems.length ? (savedItems[0].state || "Ladakh") : "Ladakh";
      if (typeof window.loadStateIntoPlanner === "function") {
        window.loadStateIntoPlanner(targetState);
      }
    };
  }

  // Clear journey button
  const clearJourneyBtn = $("#clearJourneyBtn");
  if (clearJourneyBtn) {
    clearJourneyBtn.onclick = () => {
      localStorage.setItem("bharatSaved", "[]");
      syncSavedToBackend([]);
      updateSavedCount();
      renderJourneyDrawer();
      toast("Cleared all saved destinations");
    };
  }

  // Close modals
  $$("[data-close]").forEach(x => {
    x.onclick = () => {
      $$(".modal").forEach(m => m.classList.remove("open"));
    };
  });

  $$(".modal").forEach(m => {
    m.addEventListener("click", (e) => {
      if (e.target === m) m.classList.remove("open");
    });
  });


  // Emotion pills
  $$(".emotion-row button").forEach(b => {
    b.onclick = () => {
      const m = {
        peace: "mountains",
        adventure: "adventure",
        culture: "culture",
        nature: "nature",
        spirituality: "spirituality",
        food: "food"
      };
      renderResults(m[b.dataset.emotion] || "mountains");
      const exp = $("#explore");
      if (exp) exp.scrollIntoView({ behavior: "smooth" });
    };
  });

  // View all destinations button
  const showAllBtn = $("#showAllDestinations");
  if (showAllBtn) {
    showAllBtn.onclick = () => {
      currentFilter = "all";
      $$(".filter-pill").forEach(p => p.classList.remove("active"));
      const allPill = document.querySelector('.filter-pill[data-filter="all"]');
      if (allPill) allPill.classList.add("active");
      renderDestinations();
      toast("Showing all verified destinations.");
    };
  }

  // Culture section button
  const cultureBtn = $("#cultureBtn");
  if (cultureBtn) {
    cultureBtn.onclick = () => {
      if (typeof window.askAI === "function") {
        window.askAI("Tell me about the Buddhist culture, monasteries, Losar festival, and traditional attire of Ladakh.");
      }
      const aiSec = $("#ai");
      if (aiSec) aiSec.scrollIntoView({ behavior: "smooth" });
    };
  }

  // Language selector
  const langSelect = $("#language");
  if (langSelect) {
    langSelect.onchange = e => {
      if (window.i18n && typeof window.i18n.setLanguage === "function") {
        window.i18n.setLanguage(e.target.value);
      }
    };
  }

  // --- 3D Immersive Systems Initialization ---
  initScrollReveal();

  requestAnimationFrame(() => {
    initAmbientParticles();
    initExperienceCard3D();
  });
}

// ═══════════════════════════════════════════════════════
//  SCROLL-TRIGGERED REVEAL ANIMATIONS
//  Fades up section headings and grids as they enter
//  the viewport using IntersectionObserver.
// ═══════════════════════════════════════════════════════

function initScrollReveal() {
  const selectors = [
    ".section-head",
    ".category-grid",
    ".destination-grid",
    ".experience-grid",
    ".food-grid",
    ".planner",
    ".score-card",
    ".chat",
    ".ai-copy",
    ".responsible-copy",
    ".culture-copy",
    ".map-layout",
    ".journey-track",
    ".decongestion-container",
    ".economy-direct-banner",
    ".final-cta > .eyebrow",
    ".final-cta > h2",
    ".final-cta > .btn"
  ];

  const elements = document.querySelectorAll(selectors.join(","));
  elements.forEach((el, i) => {
    el.classList.add("reveal-on-scroll");
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.3)}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });

  elements.forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════════════════
//  AMBIENT FLOATING PARTICLES
// ═══════════════════════════════════════════════════════

function initAmbientParticles() {
  const darkSections = document.querySelectorAll(
    ".hero, .section.dark, .split-section, .journey, .circuit-section"
  );

  darkSections.forEach(section => {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className = "ambient-particle";

      const size = 2 + Math.random() * 3;
      const colors = [
        "rgba(255, 183, 3, 0.35)",
        "rgba(0, 180, 216, 0.3)",
        "rgba(255, 255, 255, 0.18)"
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --duration: ${14 + Math.random() * 12}s;
        --delay: ${Math.random() * 10}s;
        --drift-x: ${(Math.random() - 0.5) * 50}px;
        --drift-y: ${-20 - Math.random() * 40}px;
        --max-opacity: ${0.12 + Math.random() * 0.18};
      `;

      section.appendChild(particle);
    }
  });
}

// ═══════════════════════════════════════════════════════
//  EXPERIENCE CARD 3D TILT
// ═══════════════════════════════════════════════════════

function initExperienceCard3D() {
  const cards = document.querySelectorAll(".experience-grid article");
  if (cards.length) {
    addCard3D(cards, { maxTilt: 8, glow: true });
  }
}

document.addEventListener("DOMContentLoaded", init);

// ═══════════════════════════════════════════════════════
//  GLOBAL WINDOW EXPORTS FOR MODULAR SUBSYSTEMS
// ═══════════════════════════════════════════════════════

window.$ = $;
window.$$ = $$;
window.toast = toast;
window.updateResponsibleScore = updateResponsibleScore;
window.fetchPassesFromAPI = fetchPassesFromAPI;
window.activeDestinations = activeDestinations;
window.localDestinations = localDestinations;
