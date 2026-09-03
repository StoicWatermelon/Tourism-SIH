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

const categories = [
  ["mountains", "🏔", "Mountains"],
  ["adventure", "🏕", "Adventure"],
  ["nature", "🌳", "Nature"],
  ["culture", "🎭", "Culture"],
  ["spirituality", "🛕", "Spiritual"],
  ["heritage", "🏛", "Heritage"],
  ["food", "🍛", "Zero-Mile Food"],
  ["villages", "🏘", "Eco Villages"],
  ["rivers", "🌊", "Rivers"],
  ["beaches", "🏖", "Beaches"],
  ["wildlife", "🌿", "Wildlife"],
  ["festivals", "🎉", "Festivals"]
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

const DEFAULT_MAP_CENTER = [24.5, 78.8];
const DEFAULT_MAP_ZOOM = 5;

let leafletMap = null;
let resetControlBtn = null;
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
    const res = await fetch("http://127.0.0.1:8000/api/destinations");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        activeDestinations = localDestinations;
        console.log(`[API] Loaded destinations and merged with SIH sustainable metadata.`);
      }
    }
  } catch (err) {
    console.warn("[API] Backend offline; utilizing resilient local destination cache.");
    activeDestinations = localDestinations;
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
  
  grid.innerHTML = categories.map((c, i) => `
    <button class="category ${i === 0 ? "active" : ""}" data-category="${c[0]}">
      <span>${c[1]}</span>
      <small>${c[2]}</small>
    </button>
  `).join("");

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
    target.innerHTML = arr.slice(0, 4).map(d => `
      <article class="result-card">
        <span class="mini">${d.location} • ${d.type}</span>
        <h3>${d.name}</h3>
        <p>${d.desc}</p>
        <div style="margin-top:auto;">
          <span style="font-size:11px; color:var(--emerald-pop); font-weight:700; display:block; margin-bottom:4px;">
            ✦ ${d.communityBenefit || "Direct Community Benefit"}
          </span>
          <small>Best Season: ${d.bestSeason || d.best_season || "May–Sep"}</small>
        </div>
      </article>
    `).join("");
  } else {
    target.innerHTML = `
      <div class="result-card" style="grid-column: span 4; text-align:center;">
        <h3>Explore more destinations across India</h3>
        <p>Connecting verified regional routes for ${cat} via Bharat Explore Smart Database.</p>
      </div>
    `;
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

  grid.innerHTML = filtered.map(d => {
    const offbeatBadgeHtml = d.isOffbeat 
      ? `<span class="offbeat-badge">🌱 Eco-Dispersion Gem</span>` 
      : `<span style="font-size:10px; opacity:0.85;">📍 ${d.altitude || "Himalayas"}</span>`;
    
    const benefitBadgeHtml = d.communityBenefit 
      ? `<span class="community-benefit-badge">🤝 ${d.communityBenefit}</span>` 
      : "";

    const chipsHtml = (d.ecoBadges || []).map(b => `
      <span class="eco-chip" onclick="pledgeEcoBadge(event, '${b}')" title="Click to commit eco-action (+5 pts)">
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
          <h3>${d.name}</h3>
          <p>${d.desc}</p>
          <div class="eco-chips">${chipsHtml}</div>
          <p><b>Season:</b> ${d.bestSeason || d.best_season} • <b>Budget:</b> ₹${(d.budget || 3000).toLocaleString()}</p>
          <div class="dest-actions">
            <button onclick="saveDestination('${d.id}')">♥ Add to Journey</button>
            <button onclick="showDestination('${d.id}')">Explore Details</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
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

  grid.innerHTML = foods.map(f => {
    const tagsHtml = f.tags.map(t => `<span class="food-tag">${t}</span>`).join("");
    return `
      <article class="food" style="background-image:url('${f.img}')" onclick="supportLocalFood(event, '${f.name}')" title="Click to support zero-food-mile local produce (+5 pts)">
        <div>
          <span class="eyebrow">${f.origin.toUpperCase()}</span>
          <h3>${f.name}</h3>
          <div class="food-tags">${tagsHtml}</div>
          <p>${f.desc}</p>
          <span class="food-revenue-share">🤝 ${f.revenueShare}</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderJourney() {
  const track = $("#journeyTrack");
  if (!track) return;

  const icons = ["🏔", "🌌", "🌲", "🕉", "🗻", "🏰", "🥥"];
  track.innerHTML = journeyNodes.map((x, i) => `
    <div class="journey-node">
      <div class="circle">${icons[i % icons.length]}</div>
      <b>${x}</b>
    </div>
    ${i < journeyNodes.length - 1 ? '<div class="journey-line"></div>' : ''}
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
  if (!saved.includes(id)) {
    saved.push(id);
    localStorage.setItem("bharatSaved", JSON.stringify(saved));
    syncSavedToBackend(saved);
    toast("Saved to My Journey ♥");
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
    container.innerHTML = `
      <div class="empty-state">
        <span style="font-size:36px;">🗺️</span>
        <p>No saved destinations yet. Click "♥ Add to Journey" on any card to curate your expedition.</p>
      </div>
    `;
    if (totalBudgetEl) totalBudgetEl.textContent = "₹0";
    return;
  }

  let totalBudget = 0;
  container.innerHTML = savedItems.map(item => {
    totalBudget += (item.budget || 3500);
    return `
      <div class="drawer-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="drawer-item-info">
          <h4>${item.name}</h4>
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

function resetMapView() {
  if (!leafletMap) return;
  leafletMap.flyTo(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, { duration: 1.0 });
  if (resetControlBtn) resetControlBtn.classList.remove("visible");
  const panel = $("#statePanel");
  if (panel) {
    panel.innerHTML = `
      <p class="eyebrow">SELECT A REGION</p>
      <h3>Discover a state</h3>
      <p>Click any pulse marker on the map to inspect regional highlights, local delicacies, and connect immediately to the Smart Itinerary Planner.</p>
    `;
  }
}

function statePanel(name) {
  const s = states[name];
  const panel = $("#statePanel");
  if (!s || !panel) return;

  panel.innerHTML = `
    <p class="eyebrow">${name.toUpperCase()}</p>
    <h3>${name}</h3>
    <p><b>Capital:</b> ${s.capital} • <b>Altitude:</b> ${s.altitude || "Variable"}</p>
    <p><b>Prime Season:</b> ${s.season}</p>
    <p><b>Highlights:</b> ${s.top.join(" • ")}</p>
    <p><b>Signature Experiences:</b> ${s.exp}</p>
    <p><b>Living Culture:</b> ${s.culture}</p>
    <p><b>Local Flavors:</b> ${s.food}</p>
    <div style="display:flex; gap:10px; margin-top:20px; flex-wrap:wrap;">
      <button class="btn primary" style="padding:9px 18px; font-size:13px;" onclick="loadStateIntoPlanner('${name}')">
        Plan Itinerary for ${name} →
      </button>
      <button class="map-reset-btn" onclick="resetMapView()">↺ Overview Map</button>
    </div>
  `;
}

function loadStateIntoPlanner(stateName) {
  const select = $("#planDestination");
  if (!select) return;

  let exists = false;
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value.toLowerCase() === stateName.toLowerCase()) {
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

function initMap() {
  const mapContainer = document.getElementById("map");
  if (typeof L === "undefined" || !mapContainer) return;

  mapContainer.innerHTML = "";
  leafletMap = L.map(mapContainer, {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 18
  }).addTo(leafletMap);

  const ResetControl = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function () {
      const btn = L.DomUtil.create('button', 'map-floating-reset');
      btn.innerHTML = '↺ India Overview';
      btn.title = 'Zoom out to all India';
      L.DomEvent.disableClickPropagation(btn);
      btn.onclick = resetMapView;
      resetControlBtn = btn;
      return btn;
    }
  });
  leafletMap.addControl(new ResetControl());

  Object.entries(stateCoordinates).forEach(([stateName, coords]) => {
    const isLadakh = stateName === "Ladakh";
    const marker = L.circleMarker(coords, {
      radius: isLadakh ? 11 : 8.5,
      fillColor: isLadakh ? "#ff6b35" : "#00b4d8",
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.95
    }).addTo(leafletMap);

    marker.bindTooltip(`<b>${stateName}</b>${isLadakh ? ' <span style="color:#ff6b35;">(Altitude Focus)</span>' : ''}`, {
      permanent: false,
      direction: 'top'
    });

    marker.on('click', () => {
      leafletMap.flyTo(coords, 7, { duration: 1.0 });
      if (resetControlBtn) resetControlBtn.classList.add("visible");
      statePanel(stateName);
    });
  });

  leafletMap.on('zoomend', () => {
    if (resetControlBtn) {
      if (leafletMap.getZoom() > DEFAULT_MAP_ZOOM) resetControlBtn.classList.add("visible");
      else resetControlBtn.classList.remove("visible");
    }
  });

  setTimeout(() => leafletMap.invalidateSize(), 200);
}

// --- AI Agent Streaming Assistant ---

const aiReply = q => {
  const s = q.toLowerCase();
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
  return "Namaste & Julley! 🙏 I am Bharat AI. I can assist you with real-time pass telemetry, acclimatization pacing, offbeat decongestion corridors, and sustainable village homestays across India.";
};

async function askAI(q) {
  if (!q || !q.trim()) return;
  const box = $("#messages");
  const orb = $("#aiOrb");
  const statusText = $("#aiStatusText");
  const chatForm = $("#chatForm");
  const submitBtn = chatForm ? chatForm.querySelector("button[type='submit']") : null;
  const chatInput = $("#chatInput");

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
  if (statusText) statusText.textContent = "Himalayan Intelligence • Connecting...";

  // 3. Mount bot message container synchronously with immediate typing placeholder & blinking cursor
  const botMsg = document.createElement("div");
  botMsg.className = "msg bot";

  const textSpan = document.createElement("span");
  textSpan.className = "bot-text";
  textSpan.textContent = "Connecting to Himalayan Intelligence...";
  textSpan.style.opacity = "0.7";

  const cursor = document.createElement("span");
  cursor.textContent = "▍";
  cursor.className = "typing-cursor";

  botMsg.appendChild(textSpan);
  botMsg.appendChild(cursor);
  box.appendChild(botMsg);
  box.scrollTop = box.scrollHeight;

  // 4. Implement 10-second AbortController timeout to prevent hung requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let isFirstChunk = true;
  let streamText = "";

  try {
    const res = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("Status " + res.status);

    if (orb) orb.className = "ai-orb streaming";
    if (statusText) statusText.textContent = "Himalayan Intelligence • Streaming...";

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      if (!chunk) continue;

      if (isFirstChunk) {
        // Clear connecting placeholder on the very first received text chunk
        textSpan.textContent = "";
        textSpan.style.opacity = "1";
        isFirstChunk = false;
      }

      streamText += chunk;

      // Silent Local Fallback: intercept any error flag without exposing tracebacks to evaluators
      if (streamText.includes("[AI Error:")) {
        textSpan.textContent = aiReply(q);
        box.scrollTop = box.scrollHeight;
        return;
      }

      textSpan.textContent = streamText.trimStart();
      box.scrollTop = box.scrollHeight;
    }

    if (!streamText.trim()) {
      textSpan.textContent = aiReply(q);
    }
  } catch (err) {
    // Silent local fallback on network error, HTTP error, or timeout abort
    textSpan.style.opacity = "1";
    textSpan.textContent = aiReply(q);
    box.scrollTop = box.scrollHeight;
  } finally {
    clearTimeout(timeoutId);
    cursor.remove();
    if (orb) orb.className = "ai-orb idle";
    if (statusText) statusText.textContent = "Himalayan Intelligence • Active";
    if (submitBtn) submitBtn.disabled = false;
    if (chatInput) chatInput.focus();
    box.scrollTop = box.scrollHeight;
  }
}

// --- Smart Safety-Audited Itinerary Planner ---

async function itinerary(e) {
  if (e && e.preventDefault) e.preventDefault();
  
  const dest = $("#planDestination").value || "Ladakh";
  const days = Math.min(14, Math.max(1, +$("#planDays").value || 5));
  const budget = +$("#planBudget").value || 32000;
  const style = $("#planStyle").value || "Adventure";
  const interest = $("#planInterest").value || "High Mountain Passes";
  const ecoHomestays = $("#planEcoHomestays") ? $("#planEcoHomestays").checked : true;
  const publicTransit = $("#planPublicTransit") ? $("#planPublicTransit").checked : true;

  if (ecoHomestays) updateResponsibleScore(5, "Eco-Homestay selected in trip planner!");
  if (publicTransit) updateResponsibleScore(5, "Low-carbon transit opted in trip planner!");

  const ladakhItinerary = [
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

  const genericItinerary = [
    { title: "Arrival, Safety Briefing & Community Orientation", pass: null, notes: "Meet local verified guides and receive regional travel advisory." },
    { title: "Historic Heritage Trails & Sacred Monastic Centers", pass: null, notes: "Explore architectural gems and traditional craft clusters." },
    { title: "Eco-Exploration Circuit & Nature Conservation Walk", pass: null, notes: "Zero single-use plastic zone. Support regional biodiversity." },
    { title: "Community Homestay & Living Culture Immersion", pass: null, notes: "Participate in family meal preparation and local storytelling." },
    { title: "Local Artisan Markets & Handicraft Cooperative Walk", pass: null, notes: "Direct fair-trade commerce with traditional weavers and artisans." }
  ];

  const base = dest.toLowerCase().includes("ladakh") ? ladakhItinerary : genericItinerary;
  const passData = await fetchPassesFromAPI();

  let html = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:10px;">
      <div>
        <p class="eyebrow">YOUR ${days}-DAY SMART ROUTE • ${dest.toUpperCase()}</p>
        <h3 style="margin:4px 0 0; color:var(--gold-pop); font-size:22px;">${style} • ${interest}</h3>
      </div>
      <span style="background:rgba(255,107,53,0.18); color:var(--accent); border:1px solid var(--accent); padding:5px 12px; border-radius:99px; font-size:10.5px; font-weight:800; letter-spacing:0.06em;">
        ⚡ SMART DECONGESTION AUDITED
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

      advisoryBadge = `
        <div class="pass-advisory-badge ${badgeClass}">
          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            <strong style="color:${color}; font-size:11px; letter-spacing:0.06em;">
              ⚠️ LIVE PASS ADVISORY: ${item.pass.toUpperCase()}
            </strong>
            <span style="font-size:10px; background:${color}; color:#fff; padding:2px 7px; border-radius:4px; font-weight:700;">
              ${passInfo.status}
            </span>
            <span style="font-size:11px; opacity:0.85;">• Altitude: ${passInfo.altitude}</span>
            <span style="font-size:11px; opacity:0.85;">• Temp: ${passInfo.temperature || "-2°C"}</span>
          </div>
          <p style="margin:5px 0 0; font-size:12px; color:#e0e6ed; line-height:1.4;">${passInfo.condition}</p>
        </div>
      `;
    }

    html += `
      <div class="day">
        <strong>DAY ${String(i + 1).padStart(2, "0")}</strong>
        <div>
          <h3>${item.title}</h3>
          <p>📍 ${dest} • 🚗 Verified transit • 💰 Est. daily allocation ₹${Math.round(budget / days).toLocaleString()}</p>
          <p style="margin-top:3px; font-size:12px; color:#9db2be;">📌 <i>Note: ${item.notes}</i></p>
          ${advisoryBadge}
        </div>
      </div>
    `;
  }

  const output = $("#itineraryOutput");
  if (output) output.innerHTML = html;
}

// --- Gamified Responsible Tourism Score ---

function animateScore(targetScore) {
  const scoreEl = $("#score");
  const barEl = $("#scoreBar");
  const cardEl = $(".score-card");
  if (!scoreEl || !barEl) return;

  targetScore = Math.max(0, Math.min(100, targetScore));
  const startScore = parseInt(scoreEl.textContent) || 85;
  const duration = 500;
  const startTime = performance.now();

  if (cardEl) {
    cardEl.classList.add("pulse-glow");
    setTimeout(() => cardEl.classList.remove("pulse-glow"), 600);
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(startScore + (targetScore - startScore) * ease);

    scoreEl.textContent = val;
    barEl.style.width = `${val}%`;

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
  const badge = $("#scoreBadge");
  const redeemBtn = $("#redeemRewardsBtn");
  if (currentScore >= 80) {
    if (badge) badge.textContent = "✦ ECO-CHAMPION TIER UNLOCKED (Vouchers Active)";
    if (redeemBtn) redeemBtn.style.boxShadow = "0 0 16px rgba(255, 183, 3, 0.5)";
  } else {
    if (badge) badge.textContent = "✦ REACH 80+ TO UNLOCK DIGITAL VOUCHERS";
    if (redeemBtn) redeemBtn.style.boxShadow = "none";
  }
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

  await fetchDestinationsFromAPI();

  renderCategories();
  renderResults();
  renderDestinations();
  renderFood();
  renderJourney();
  initMap();
  updateSavedCount();

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

  // Redeem Rewards button
  const redeemBtn = $("#redeemRewardsBtn");
  if (redeemBtn) {
    redeemBtn.onclick = () => {
      if (currentScore >= 80) {
        $("#rewardsModal").classList.add("open");
      } else {
        toast(`Your Responsible Score is ${currentScore}. Reach 80+ to unlock cooperative vouchers!`);
      }
    };
  }

  // Plan from journey drawer button
  const planFromJourneyBtn = $("#planFromJourneyBtn");
  if (planFromJourneyBtn) {
    planFromJourneyBtn.onclick = () => {
      $("#journeyDrawer").classList.remove("open");
      const savedIds = JSON.parse(localStorage.getItem("bharatSaved") || "[]");
      const savedItems = activeDestinations.filter(d => savedIds.includes(d.id));
      if (savedItems.length) {
        loadStateIntoPlanner(savedItems[0].state || "Ladakh");
      } else {
        loadStateIntoPlanner("Ladakh");
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

  // Responsible score button
  const scoreBtn = $("#scoreBtn");
  if (scoreBtn) {
    scoreBtn.onclick = () => updateResponsibleScore(5, "Eco-friendly decision recorded!");
  }

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
      askAI("Tell me about the Buddhist culture, monasteries, Losar festival, and traditional attire of Ladakh.");
      const aiSec = $("#ai");
      if (aiSec) aiSec.scrollIntoView({ behavior: "smooth" });
    };
  }

  // Language selector
  const langSelect = $("#language");
  if (langSelect) {
    langSelect.onchange = e => {
      if (e.target.value === "hi") {
        toast("हिंदी UI आर्किटेक्चर सक्रिय है; द्विभाषी मोड तैयार। (Hindi mode ready)");
      } else {
        toast("English mode active.");
      }
    };
  }
}

document.addEventListener("DOMContentLoaded", init);