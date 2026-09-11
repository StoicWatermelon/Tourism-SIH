/**
 * Bharat Explore — High-Altitude & Pan-India Tourism Intelligence
 * Smart India Hackathon (SIH 2026) Official Platform
 * Clean, flat modern UI with institutional glassmorphism & sustainable tourism engines
 */

// ── Apply saved theme immediately to prevent flash of wrong theme ──
(function() {
  const saved = localStorage.getItem("bharatExploreTheme");
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

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
  },
  {
    id: "gulmarg",
    name: "Gulmarg Meadow of Flowers",
    location: "Jammu & Kashmir",
    state: "Jammu & Kashmir",
    category: "mountains",
    emotion: "adventure",
    bestSeason: "Year-Round",
    difficulty: "Moderate",
    type: "Alpine Crest",
    budget: 6500,
    altitude: "8,694 ft",
    isOffbeat: false,
    footfall: "Popular Crest",
    communityBenefit: "88% Direct Community Revenue",
    ecoBadges: [
      "Clean Snow Certification",
      "High-Altitude Gondola",
      "Zero-Litter Alpine"
    ],
    img: "assets/images/gulmarg.png",
    desc: "Premier alpine ski and meadow crest featuring pristine pine forests and one of the highest operating cable cars."
  },
  {
    id: "auli",
    name: "Auli Snow & Oak Slopes",
    location: "Uttarakhand",
    state: "Uttarakhand",
    category: "mountains",
    emotion: "nature",
    bestSeason: "Nov–Apr",
    difficulty: "Moderate",
    type: "Alpine Meadow",
    budget: 5500,
    altitude: "9,200 ft",
    isOffbeat: true,
    footfall: "Eco-Dispersion Gem",
    communityBenefit: "93% Direct Community Revenue",
    ecoBadges: [
      "Nanda Devi Sanctuary Buffer",
      "Zero Single-Use Plastic",
      "Solar Mountain Lodges"
    ],
    img: "assets/images/Auli.png",
    desc: "Himalayan ski slopes fringed by coniferous and oak forests with breathtaking panoramas of Nanda Devi and Kamet."
  },
  {
    id: "dharamshala",
    name: "Dharamshala & Kangra Valley",
    location: "Himachal Pradesh",
    state: "Himachal Pradesh",
    category: "culture",
    emotion: "peace",
    bestSeason: "Sep–Jun",
    difficulty: "Easy",
    type: "Mountain Sanctuary",
    budget: 4500,
    altitude: "4,780 ft",
    isOffbeat: false,
    footfall: "Cultural Core",
    communityBenefit: "91% Direct Community Revenue",
    ecoBadges: [
      "Monastic Heritage Trail",
      "Organic Tea Gardens",
      "Clean Mountain Water"
    ],
    img: "assets/images/dharamshala.png",
    desc: "Peaceful hillside town nestled under the Dhauladhar ranges, center of Tibetan culture, cedar trails, and tea estates."
  },
  {
    id: "jaisalmer",
    name: "Jaisalmer Living Fort",
    location: "Rajasthan",
    state: "Rajasthan",
    category: "heritage",
    emotion: "culture",
    bestSeason: "Oct–Mar",
    difficulty: "Easy",
    type: "Desert Citadel",
    budget: 4800,
    altitude: "738 ft",
    isOffbeat: false,
    footfall: "Living Fort Heritage",
    communityBenefit: "94% Direct Artisan Revenue",
    ecoBadges: [
      "Artisan Collective Certified",
      "Sustainable Camel Caravans",
      "Heritage Haveli Trust"
    ],
    img: "assets/images/jaisalmer.png",
    desc: "A golden sandstone living fortress rising from Thar desert dunes, sustained by resident artisan families and music guilds."
  },
  {
    id: "dawki",
    name: "Dawki Crystal Umngot River",
    location: "Meghalaya",
    state: "Meghalaya",
    category: "nature",
    emotion: "peace",
    bestSeason: "Nov–Apr",
    difficulty: "Easy",
    type: "Clear River Gorge",
    budget: 3800,
    altitude: "2,050 ft",
    isOffbeat: true,
    footfall: "Eco-Dispersion Gem",
    communityBenefit: "96% Direct Boatmen Revenue",
    ecoBadges: [
      "Zero-Motor Clear Waters",
      "Leave-No-Trace Riverbed",
      "Indigenous Boatmen Guild"
    ],
    img: "assets/images/dawki.png",
    desc: "Glass-transparent waters where wooden boats appear to float in mid-air over polished pebbles and green gorges."
  },
  {
    id: "dzukou",
    name: "Dzukou Valley Lily Sanctuary",
    location: "Nagaland",
    state: "Nagaland",
    category: "nature",
    emotion: "nature",
    bestSeason: "Jun–Sep",
    difficulty: "Hard",
    type: "High-Altitude Valley",
    budget: 4200,
    altitude: "8,045 ft",
    isOffbeat: true,
    footfall: "Eco-Dispersion Gem",
    communityBenefit: "98% Direct Tribal Council",
    ecoBadges: [
      "Plastic-Free Strictly Enforced",
      "Endemic Dzukou Lily Habitat",
      "Solar Forest Trek"
    ],
    img: "assets/images/dzukouvalley.png",
    desc: "Undulating emerald dwarf-bamboo valley famous for seasonal endemic lilies, pristine brooks, and silence."
  },
  {
    id: "gir",
    name: "Gir Asiatic Lion Habitat",
    location: "Gujarat",
    state: "Gujarat",
    category: "nature",
    emotion: "adventure",
    bestSeason: "Dec–Mar",
    difficulty: "Moderate",
    type: "Wildlife Reserve",
    budget: 5200,
    altitude: "450 ft",
    isOffbeat: false,
    footfall: "Protected Habitat",
    communityBenefit: "92% Direct Eco-Guide Revenue",
    ecoBadges: [
      "Apex Predator Conservation",
      "Maldhari Coexistence Zone",
      "Restricted Electric Safaris"
    ],
    img: "assets/images/gir.png",
    desc: "The only sanctuary in the world protecting wild Asiatic lions, coexisting alongside pastoral Maldhari settlements."
  },
  {
    id: "coorg",
    name: "Coorg Mist & Shade Coffee",
    location: "Karnataka",
    state: "Karnataka",
    category: "nature",
    emotion: "peace",
    bestSeason: "Oct–Apr",
    difficulty: "Easy",
    type: "Shade Plantation",
    budget: 4600,
    altitude: "3,800 ft",
    isOffbeat: false,
    footfall: "Hill Retreat",
    communityBenefit: "89% Direct Planter Revenue",
    ecoBadges: [
      "Bird-Friendly Shade Grown",
      "Western Ghats Biodiversity",
      "Zero-Chemical Estates"
    ],
    img: "assets/images/coorg.png",
    desc: "Lush Western Ghats hill district celebrated for bird-friendly shade-grown coffee, spice hills, and Kodava hospitality."
  },
  {
    id: "konark",
    name: "Konark Sun Temple Chariot",
    location: "Odisha",
    state: "Odisha",
    category: "heritage",
    emotion: "culture",
    bestSeason: "Oct–Mar",
    difficulty: "Easy",
    type: "UNESCO Monument",
    budget: 3200,
    altitude: "10 ft",
    isOffbeat: false,
    footfall: "Heritage Monument",
    communityBenefit: "90% Direct Artisan Revenue",
    ecoBadges: [
      "Kalinga Stone Conservation",
      "Solar Sound & Light Show",
      "Coastal Marine Buffer"
    ],
    img: "assets/images/konark.png",
    desc: "13th-century monumental stone chariot carved with 24 intricate astronomical wheels pulled by seven galloping horses."
  },
  {
    id: "chitrakote",
    name: "Chitrakote Horseshoe Falls",
    location: "Chhattisgarh",
    state: "Chhattisgarh",
    category: "nature",
    emotion: "nature",
    bestSeason: "Jul–Feb",
    difficulty: "Easy",
    type: "Horseshoe Waterfall",
    budget: 3400,
    altitude: "1,800 ft",
    isOffbeat: true,
    footfall: "Eco-Dispersion Gem",
    communityBenefit: "95% Direct Tribal Revenue",
    ecoBadges: [
      "Indravati River Basin Protection",
      "Tribal Craft Cooperative",
      "Zero Industrial Runoff"
    ],
    img: "assets/images/chitrakote.png",
    desc: "The Niagara of India, a 300-meter wide horseshoe waterfall roaring across granite cliffs into virgin sal forests."
  }
];

let activeDestinations = [...localDestinations];
let currentFilter = "all";

// 20 Pan-India Regional Heritage & Eco Circuits with crisp, bounded assets & waypoint telemetry
const regionalCircuits = [
  { id: "srinagar", name: "Srinagar & Dal Lake", state: "Jammu & Kashmir", region: "north", theme: "himalayan", img: "assets/images/srinagar.jpg", desc: "Alpine water reflections, floating markets & Shalimar gardens", alt: "5,200 ft", elevationFt: 5200, season: "Apr–Oct", waypoints: ["Jammu Tawi", "Patnitop", "Banihal Tunnel", "Dal Lake Shikara", "Shalimar Bagh"] },
  { id: "kurukshetra", name: "Kurukshetra Sacred Sarovar", state: "Haryana", region: "north", theme: "spiritual", img: "assets/images/kurukshetra.png", desc: "Brahma Sarovar ghats, ancient pilgrimage corridors & epic history", alt: "850 ft", elevationFt: 850, season: "Oct–Mar", waypoints: ["Delhi Hub", "Panipat", "Brahma Sarovar", "Jyotisar Teerth", "Sannihit Sarovar"] },
  { id: "rockgarden", name: "Rock Garden Sculptures", state: "Chandigarh", region: "north", theme: "heritage", img: "assets/images/rockgarden.png", desc: "World-renowned zero-waste visionary sculpture oasis", alt: "1,050 ft", elevationFt: 1050, season: "Year Round", waypoints: ["Sukhna Lake", "Nek Chand Oasis", "Sector 1 Promenade", "Capitol Complex"] },
  { id: "tawang", name: "Tawang Monastery Corridor", state: "Arunachal Pradesh", region: "northeast", theme: "himalayan", img: "assets/images/tawang.png", desc: "High-altitude Tibetan monastery perched at 10,000 ft", alt: "10,000 ft", elevationFt: 10000, season: "Apr–Oct", waypoints: ["Guwahati Gateway", "Tezpur", "Dirang Valley", "Sela Pass (13,700 ft)", "Tawang Gompa"] },
  { id: "cherrapunji", name: "Cherrapunji Living Root Bridges", state: "Meghalaya", region: "northeast", theme: "rainforest", img: "assets/images/cherrapunji.png", desc: "Bio-engineered Ficus elastica bridges & mist-shrouded canyons", alt: "4,860 ft", elevationFt: 4860, season: "Sep–May", waypoints: ["Shillong Peak", "Mawkdok Valley", "Nohkalikai Falls", "Double Decker Living Root Bridge", "Dawki River"] },
  { id: "loktaklake", name: "Loktak Floating Lake", state: "Manipur", region: "northeast", theme: "rainforest", img: "assets/images/loktaklake.png", desc: "Unique circular floating biomass phumdis & Sangai deer sanctuary", alt: "2,520 ft", elevationFt: 2520, season: "Nov–Apr", waypoints: ["Imphal Kangla Fort", "Sendra Island", "Keibul Lamjao National Park", "Phumdi Floating Homestay"] },
  { id: "kohima", name: "Kohima & Naga Hills", state: "Nagaland", region: "northeast", theme: "heritage", img: "assets/images/kohima.png", desc: "Hornbill cultural heritage, scenic mountain ridges & tribal crafts", alt: "4,738 ft", elevationFt: 4738, season: "Oct–May", waypoints: ["Dimapur Railhead", "Kohima War Memorial", "Kisama Heritage Village", "Dzukou Valley Trailhead"] },
  { id: "aizawl", name: "Aizawl & Durtlang Ridge", state: "Mizoram", region: "northeast", theme: "himalayan", img: "assets/images/aizawl.png", desc: "Tranquil cloud-kissed ridges, Mizo bamboo crafts & church spires", alt: "3,700 ft", elevationFt: 3700, season: "Oct–Apr", waypoints: ["Lengpui Airport", "Bara Bazar", "Durtlang Hills", "Solomon's Temple", "Reiek Tlang"] },
  { id: "ujjayantapalace", name: "Ujjayanta Royal Palace", state: "Tripura", region: "northeast", theme: "heritage", img: "assets/images/ujjayantapalace.png", desc: "Neoclassical lakeside palace surrounded by Mughal gardens", alt: "42 ft", elevationFt: 42, season: "Oct–Mar", waypoints: ["Agartala Core", "Ujjayanta Royal Grounds", "Neermahal Water Palace", "Unakoti Rock Bas-reliefs"] },
  { id: "hampi", name: "Hampi UNESCO Ruins", state: "Karnataka", region: "south-islands", theme: "spiritual", img: "assets/images/hampi.png", desc: "Granite boulder empire, Tungabhadra River & Vijayanagara architecture", alt: "1,530 ft", elevationFt: 1530, season: "Oct–Mar", waypoints: ["Hospet Junction", "Virupaksha Sanctuary", "Vitthala Stone Chariot", "Lotus Mahal", "Matanga Hill Sunrise"] },
  { id: "hyderabad", name: "Hyderabad Heritage Core", state: "Telangana", region: "south-islands", theme: "heritage", img: "assets/images/hyderabad.png", desc: "Charminar, Golconda fortress acoustics & Nizami culinary trail", alt: "1,778 ft", elevationFt: 1778, season: "Oct–Mar", waypoints: ["Charminar Gateway", "Mecca Masjid", "Laad Bazaar", "Chowmahalla Palace", "Golconda Acoustic Fort"] },
  { id: "visakhapatnam", name: "Visakhapatnam Ghats Coast", state: "Andhra Pradesh", region: "south-islands", theme: "coastal", img: "assets/images/visakhapatnam.png", desc: "Where the Eastern Ghats plunge dramatically into the Bay of Bengal", alt: "150 ft", elevationFt: 150, season: "Nov–Feb", waypoints: ["Ramakrishna Beach", "Kailasagiri Hill", "INS Kursura Submarine", "Bheemili Dutch Port", "Araku Valley Escarpment"] },
  { id: "whitetown", name: "White Town Promenade", state: "Puducherry", region: "south-islands", theme: "coastal", img: "assets/images/whitetown.png", desc: "Cobblestone French colonial villas, cafes & Bay promenade", alt: "20 ft", elevationFt: 20, season: "Nov–Mar", waypoints: ["Goubert Avenue Promenade", "French Quarter Villas", "Aurobindo Ashram", "Paradise Beach Island"] },
  { id: "kavaratti", name: "Kavaratti Coral Lagoon", state: "Lakshadweep", region: "south-islands", theme: "coastal", img: "assets/images/kavaratti.png", desc: "Pristine white sand atolls, turquoise waters & marine reserves", alt: "10 ft", elevationFt: 10, season: "Oct–Apr", waypoints: ["Agatti Airstrip", "Kavaratti Marine Lagoon", "Urja Mosque Sanctuary", "Coral Reef Snorkeling Reserve"] },
  { id: "swarajdeep", name: "Swaraj Dweep (Havelock)", state: "Andaman & Nicobar", region: "south-islands", theme: "coastal", img: "assets/images/swarajdeep.png", desc: "Radhanagar Beach sunsets, bio-luminescent kayaking & reefs", alt: "30 ft", elevationFt: 30, season: "Nov–Apr", waypoints: ["Port Blair Haddo Jetty", "Havelock Ferry Terminal", "Radhanagar Beach No. 7", "Elephant Beach Reef", "Kalapathar Cove"] },
  { id: "mumbai", name: "Mumbai Marine Promenade", state: "Maharashtra", region: "west-central", theme: "coastal", img: "assets/images/mumbai.png", desc: "Gateway of India, Arabian Sea breeze & Victorian Gothic heritage", alt: "46 ft", elevationFt: 46, season: "Oct–Mar", waypoints: ["Gateway of India", "Taj Heritage Wing", "Colaba Causeway", "Marine Drive Promenade", "Chhatrapati Shivaji Terminus"] },
  { id: "daman", name: "Moti Daman Coastal Fort", state: "Daman & Diu", region: "west-central", theme: "coastal", img: "assets/images/daman.png", desc: "16th-century ramparts overlooking the Arabian sea & palm beaches", alt: "16 ft", elevationFt: 16, season: "Nov–Mar", waypoints: ["Daman Port Gate", "Moti Daman Bastion", "Bom Jesus Cathedral", "Jampore Casuarina Beach"] },
  { id: "khajuraho", name: "Khajuraho Temple Marvels", state: "Madhya Pradesh", region: "west-central", theme: "spiritual", img: "assets/images/khajuraho.png", desc: "Intricate Chandela dynasty sandstone art & living cultural legacy", alt: "930 ft", elevationFt: 930, season: "Oct–Mar", waypoints: ["Kandariya Mahadeva", "Lakshmana Temple", "Chausath Yogini", "Raneh Waterfalls Canyon"] },
  { id: "bastar", name: "Bastar Indigenous Corridors", state: "Chhattisgarh", region: "west-central", theme: "heritage", img: "assets/images/bastar.png", desc: "Chitrakote horseshoe falls & sacred Dhokra lost-wax bronze crafts", alt: "1,800 ft", elevationFt: 1800, season: "Oct–Mar", waypoints: ["Jagdalpur Palace", "Chitrakote Niagara Falls", "Kanger Valley Caves", "Kondagaon Dhokra Artisan Guild"] },
  { id: "hundrufalls", name: "Hundru Falls Cascade", state: "Jharkhand", region: "west-central", theme: "rainforest", img: "assets/images/hundrufalls.png", desc: "320 ft Subarnarekha drop carving spectacular granite rock pools", alt: "2,140 ft", elevationFt: 2140, season: "Jul–Feb", waypoints: ["Ranchi Plateau", "Subarnarekha River Gorge", "Hundru Plunge Pool", "Jonha & Dassam Loop"] }
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
    name: "Amritsari Kulcha & Chole",
    origin: "Punjab",
    desc: "Crisp multi-layered tandoori flatbread stuffed with spiced potatoes, served with slow-cooked pindi chole.",
    tags: ["Locally Sourced", "Zero Food Miles", "Community Cooperative"],
    revenueShare: "95% Direct Farmer Revenue",
    img: "/assets/images/AmritsariKulcha.png"
  },
  {
    name: "Dal Baati Churma",
    origin: "Rajasthan",
    desc: "Wood-fired baked baatis drenched in pure desi ghee, paired with five-lentil panchmel dal and sweet churma.",
    tags: ["Traditional Recipe", "Zero Food Miles", "Heritage Kitchens"],
    revenueShare: "92% Direct Community Revenue",
    img: "/assets/images/dalbaatichurma.png"
  },
  {
    name: "Kashmiri Kahwa",
    origin: "Kashmir",
    desc: "Gentle green tea infused with whole saffron strands, green cardamom pods, cinnamon bark, and slivered almonds.",
    tags: ["High Altitude", "Zero Food Miles", "Artisan Harvested"],
    revenueShare: "96% Direct Grower Revenue",
    img: "/assets/images/kahwa.png"
  },
  {
    name: "Kerala Appam with Stew",
    origin: "Kerala",
    desc: "Soft fermented rice batter hoppers with fluffy lace edges, served with aromatic coconut milk vegetable stew.",
    tags: ["Zero Food Miles", "Organic Coconut", "Women's Cooperative"],
    revenueShare: "94% Direct Community Revenue",
    img: "/assets/images/appam.png"
  },
  {
    name: "Khaman Dhokla",
    origin: "Gujarat",
    desc: "Steamed fluffy gram flour cakes tempered with mustard seeds, curry leaves, and green chillies.",
    tags: ["Locally Sourced", "Zero Food Miles", "Heritage Recipe"],
    revenueShare: "91% Direct Community Revenue",
    img: "/assets/images/dhokla.png"
  },
  {
    name: "Hyderabadi Dum Biryani",
    origin: "Telangana",
    desc: "Fragrant aged basmati rice cooked in sealed handis with saffron, mint, fried shallots, and royal spice potpourri.",
    tags: ["Slow Food", "Community Cooperative"],
    revenueShare: "89% Direct Community Revenue",
    img: "/assets/images/biryani.png"
  },
  {
    name: "Traditional Bebinca",
    origin: "Goa",
    desc: "Indo-Portuguese seven-layered coconut milk and egg pudding delicately baked on gentle hearth embers.",
    tags: ["Heritage Bakeries", "Artisan Recipe"],
    revenueShare: "93% Direct Bakery Revenue",
    img: "/assets/images/bebinca.png"
  },
  {
    name: "Crisp Masala Dosa",
    origin: "Karnataka",
    desc: "Fermented rice and black lentil crepe roasted golden with butter, filled with spiced potato masala and fresh coconut chutney.",
    tags: ["Zero Food Miles", "Community Sourced"],
    revenueShare: "90% Direct Community Revenue",
    img: "/assets/images/dosa.png"
  },
  {
    name: "Goan Coastal Fish Curry",
    origin: "Goa",
    desc: "Fresh catch simmered in rich Kashmiri chilli and tangy kokum coconut gravy, honoring sustainable coastal fisheries.",
    tags: ["Sustainable Catch", "Zero Food Miles", "Fisherfolk Cooperative"],
    revenueShare: "95% Direct Fisherfolk Revenue",
    img: "/assets/images/fishcurry.png"
  },
  {
    name: "Aloo ke Gutke",
    origin: "Uttarakhand",
    desc: "Kumaoni mountain potatoes stir-fried in fragrant mustard oil with wild Himalayan jumboo herb and red chillies.",
    tags: ["Mountain Foraged", "Zero Food Miles", "Village Organic"],
    revenueShare: "97% Direct Homestay Revenue",
    img: "/assets/images/alookegutke.png"
  },
  {
    name: "Himachali Dham",
    origin: "Himachal Pradesh",
    desc: "Traditional satvik festive feast cooked in brass pots by Botis, featuring Madra, Mah ki Dal, and Khatta.",
    tags: ["Ancient Feast", "Zero Food Miles", "Solar Kitchens"],
    revenueShare: "93% Direct Community Revenue",
    img: "/assets/images/dham.png"
  },
  {
    name: "Chhena Poda",
    origin: "Odisha",
    desc: "Baked cottage cheese confection wrapped in sal leaves and caramelized slowly over charcoal embers.",
    tags: ["Dairy Cooperative", "Zero Food Miles"],
    revenueShare: "94% Direct Dairy Farmer Revenue",
    img: "/assets/images/chhenapoda.png"
  },
  {
    name: "Bhutte ka Kees",
    origin: "Madhya Pradesh",
    desc: "Fresh sweet corn grated and simmered in spiced milk with mustard seeds, coconut, and green chillies.",
    tags: ["Zero Food Miles", "Malwa Heritage", "Farm Fresh"],
    revenueShare: "95% Direct Farmer Revenue",
    img: "/assets/images/bhuttekakees.png"
  },
  {
    name: "Bisi Bele Bhath",
    origin: "Karnataka",
    desc: "Traditional hot lentil rice preparation slow-cooked with tamarind, nutmeg, marathi moggu, and pure ghee.",
    tags: ["Zero Food Miles", "Heritage Kitchens", "Probiotic Pulse"],
    revenueShare: "93% Direct Farmer Revenue",
    img: "/assets/images/bisibelebhath.png"
  },
  {
    name: "Jharkhandi Dhuska & Ghugni",
    origin: "Jharkhand",
    desc: "Golden fried rice and chana dal batter cakes paired with rustic kala chana curry and spicy tomato chutney.",
    tags: ["Tribal Kitchens", "Zero Food Miles", "Community Sourced"],
    revenueShare: "96% Direct Tribal Revenue",
    img: "/assets/images/dhuska.png"
  },
  {
    name: "Melt-in-Mouth Kebabs",
    origin: "Uttar Pradesh",
    desc: "Aromatic slow-smoked galouti kebabs infused with 16 royal spices, served with fresh mint and roomali roti.",
    tags: ["Slow Food", "Heritage Recipe", "Artisan Kitchens"],
    revenueShare: "91% Direct Kitchen Revenue",
    img: "/assets/images/kebabs.png"
  },
  {
    name: "Shahi Hyderabadi Haleem",
    origin: "Telangana",
    desc: "Slow-pounded wheat, barley, and lentils simmered overnight with pure ghee, rose petals, and fried cashew.",
    tags: ["Slow Food", "GI Tagged", "Heritage Guild"],
    revenueShare: "90% Direct Artisan Revenue",
    img: "/assets/images/haleem.png"
  },
  {
    name: "Pahadi Kafuli",
    origin: "Uttarakhand",
    desc: "Nutritious thick green gravy of mountain spinach and fenugreek leaves slow-cooked in traditional iron pots.",
    tags: ["Mountain Foraged", "Iron Rich", "Homestay Organic"],
    revenueShare: "98% Direct Homestay Revenue",
    img: "/assets/images/kafuli.png"
  },
  {
    name: "Assamese Khar",
    origin: "Assam",
    desc: "Ancestral alkaline broth prepared by filtering water through sun-dried banana peel ashes, with raw papaya.",
    tags: ["Ancestral Alkaline", "Zero Food Miles", "Wild Foraged"],
    revenueShare: "96% Direct Grower Revenue",
    img: "/assets/images/khar.png"
  },
  {
    name: "Khasi Jadoh",
    origin: "Meghalaya",
    desc: "Fragrant red hill rice cooked with indigenous wild mountain herbs, bay leaves, ginger, and black sesame.",
    tags: ["Indigenous Red Rice", "Zero Food Miles", "Women's Guild"],
    revenueShare: "95% Direct Farmer Revenue",
    img: "/assets/images/jadoh.png"
  },
  {
    name: "Manipuri Eromba",
    origin: "Manipur",
    desc: "Boiled mountain vegetables mashed with fiery King Chilli (U-Morok), wild herbs, and fermented local fish.",
    tags: ["Probiotic", "Wild Harvest", "Zero Preservatives"],
    revenueShare: "97% Direct Homestay Revenue",
    img: "/assets/images/eromba.png"
  },
  {
    name: "Naga Axone Stew",
    origin: "Nagaland",
    desc: "Naturally fermented organic soybeans stewed with smoked chillies, wild herbs, and bamboo shoot broth.",
    tags: ["Fermented Superfood", "Tribal Organic", "Zero Food Miles"],
    revenueShare: "96% Direct Tribal Revenue",
    img: "/assets/images/axone.png"
  },
  {
    name: "Mizo Bai Broth",
    origin: "Mizoram",
    desc: "Steamed organic mustard greens and bamboo shoots cooked with local soda and fermented pork/mushrooms.",
    tags: ["Alkaline", "Zero Oil", "Organic Garden"],
    revenueShare: "95% Direct Grower Revenue",
    img: "/assets/images/bai.png"
  },
  {
    name: "Tripuri Chakhwi",
    origin: "Tripura",
    desc: "Traditional alkaline bamboo shoot preparation slow-cooked with jackfruit seeds and wild mountain leaves.",
    tags: ["Forest Foraged", "Zero Food Miles", "Indigenous Recipe"],
    revenueShare: "97% Direct Tribal Revenue",
    img: "/assets/images/chakhwi.png"
  },
  {
    name: "Haryanvi Bajra Khichdi",
    origin: "Haryana",
    desc: "Nutrient-dense winter pearl millet and yellow lentils cooked on slow embers, served with fresh hand-churned white butter.",
    tags: ["Millets Superfood", "Zero Food Miles", "Farmer Cooperative"],
    revenueShare: "94% Direct Farmer Revenue",
    img: "/assets/images/bajrakhicdi.png"
  },
  {
    name: "Andhra Gongura Pachadi",
    origin: "Andhra Pradesh",
    desc: "Tangy red sorrel leaves ground in stone mortars with roasted red chillies, garlic, and cold-pressed sesame oil.",
    tags: ["Iron Rich", "Heritage Recipe", "Farmer Cooperative"],
    revenueShare: "93% Direct Farmer Revenue",
    img: "/assets/images/gongura.png"
  },
  {
    name: "Thukpa",
    origin: "Ladakh",
    desc: "Hearty noodle soup with vegetables and meat, a staple of high-altitude comfort.",
    tags: ["High Altitude", "Warm Soup", "Community Kitchen"],
    revenueShare: "95% Direct Farmer Revenue",
    img: "/assets/images/thukpa.png"
  },
  {
    name: "Skyu",
    origin: "Ladakh",
    desc: "Thick wheat flour dumplings simmered in broth, enjoyed during winter festivals.",
    tags: ["Winter Warmth", "Traditional", "Handmade"],
    revenueShare: "94% Direct Farmer Revenue",
    img: "/assets/images/skyu.png"
  },
  {
    name: "Butter Tea (Gur Gur)",
    origin: "Ladakh",
    desc: "Salted butter tea brewed with yak tea leaves, energizing for trekkers.",
    tags: ["Energy Boost", "Cultural", "High Altitude"],
    revenueShare: "96% Direct Farmer Revenue",
    img: "/assets/images/gurgurtea.png"
  },
  {
    name: "Tingmo",
    origin: "Ladakh",
    desc: "Steamed fluffy wheat buns served with soups and stews.",
    tags: ["Steamed Bread", "Soft", "Companion Dish"],
    revenueShare: "93% Direct Farmer Revenue",
    img: "/assets/images/tingmo.png"
  },
  {
    name: "Momos",
    origin: "Sikkim",
    desc: "Steamed dumplings filled with vegetables or meat, a Himalayan street snack.",
    tags: ["Dumpling", "Snack", "Popular"],
    revenueShare: "92% Direct Farmer Revenue",
    img: "/assets/images/momos.png"
  },
  {
    name: "Tsampa",
    origin: "Tibet",
    desc: "Roasted barley flour mixed with tea butter, a high-energy staple.",
    tags: ["Barley", "Energy", "Portable"],
    revenueShare: "95% Direct Farmer Revenue",
    img: "/assets/images/tsampa.png"
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
const APP_API_ORIGIN = window.location.protocol.startsWith("http") ? "" : "http://127.0.0.1:8000";

async function fetchDestinationsFromAPI() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);
    const res = await fetch(`${APP_API_ORIGIN}/api/destinations`, { signal: controller.signal });
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
    const res = await fetch(`${APP_API_ORIGIN}/api/passes`);
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
    const headers = (window.BharatAuth && typeof window.BharatAuth.getAuthHeaders === "function")
      ? window.BharatAuth.getAuthHeaders()
      : { "Content-Type": "application/json" };

    const url = `${APP_API_ORIGIN}/api/journey/save`;

    await fetch(url, {
      method: "POST",
      headers: headers,
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

window.syncUserSessionState = async function () {
  try {
    if (window.BharatAuth && window.BharatAuth.isAuthenticated()) {
      const savedData = await window.BharatAuth.getSavedDestinations();
      if (savedData && Array.isArray(savedData.destination_ids)) {
        let localSaved = JSON.parse(localStorage.getItem("bharatSaved") || "[]");
        const merged = Array.from(new Set([...localSaved, ...savedData.destination_ids]));
        localStorage.setItem("bharatSaved", JSON.stringify(merged));
      }
    }
    updateSavedCount();
    renderJourneyDrawer();
  } catch (e) {
    console.warn("Error syncing user session state:", e);
  }
};

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

let currentCircuitFilter = {
  region: "all",
  theme: "all",
  search: "",
  sort: "default"
};

function renderCircuits(opts = {}) {
  const grid = $("#circuitsGrid");
  if (!grid) return;

  if (typeof opts === "string") {
    currentCircuitFilter.region = opts;
  } else if (typeof opts === "object") {
    currentCircuitFilter = { ...currentCircuitFilter, ...opts };
  }

  let filtered = [...regionalCircuits];

  // Filter by region
  if (currentCircuitFilter.region && currentCircuitFilter.region !== "all") {
    filtered = filtered.filter(c => c.region === currentCircuitFilter.region);
  }

  // Filter by theme
  if (currentCircuitFilter.theme && currentCircuitFilter.theme !== "all") {
    filtered = filtered.filter(c => c.theme === currentCircuitFilter.theme);
  }

  // Filter by search query
  if (currentCircuitFilter.search && currentCircuitFilter.search.trim()) {
    const q = currentCircuitFilter.search.toLowerCase().trim();
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.state.toLowerCase().includes(q) || 
      c.desc.toLowerCase().includes(q) ||
      (c.alt && c.alt.toLowerCase().includes(q))
    );
  }

  // Sort
  if (currentCircuitFilter.sort === "alt-high") {
    filtered.sort((a, b) => (b.elevationFt || 0) - (a.elevationFt || 0));
  } else if (currentCircuitFilter.sort === "alt-low") {
    filtered.sort((a, b) => (a.elevationFt || 0) - (b.elevationFt || 0));
  } else if (currentCircuitFilter.sort === "name-az") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #ffffff; border-radius: var(--radius); border: 1px dashed rgba(13, 148, 136, 0.3);">
        <p style="font-size: 28px; margin: 0 0 10px;">🔍</p>
        <h3 style="font-family: var(--font-main); font-size: 18px; color: var(--ink); margin: 0 0 6px;">No regional corridor portals found</h3>
        <p style="font-size: 13.5px; color: #64748b; margin: 0 0 16px;">Try adjusting your search query or selecting "All India".</p>
        <button class="btn light" onclick="resetCircuitFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  const actionText = (window.i18n && typeof window.i18n.t === "function")
    ? window.i18n.t("btn_explore_node")
    : "3D Waypoints & Telemetry →";

  grid.innerHTML = filtered.map(c => {
    const customDesc = (window.i18n && typeof window.i18n.getCircuitTranslation === "function")
      ? (window.i18n.getCircuitTranslation(c.id) || c.desc)
      : c.desc;

    return `
      <article class="circuit-card" style="background-image: url('${c.img}')" onclick="openPortalDossier(event, '${c.id}')" title="Explore 3D Portal Telemetry for ${c.name} (${c.state})">
        <div class="circuit-card-overlay">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 6px;">
            <span class="circuit-tag">${c.state}</span>
            <span style="background: rgba(245, 158, 11, 0.28); border: 1px solid rgba(245, 158, 11, 0.6); color: #fbbf24; font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">⛰️ ${c.alt}</span>
          </div>
          <h3>${c.name}</h3>
          <p>${customDesc}</p>
          <div style="display: flex; gap: 8px; align-items: center; margin-top: auto; padding-top: 10px; flex-wrap: wrap;">
            <span class="circuit-action">${actionText}</span>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Add 3D perspective tilt & specular glow to circuit cards
  addCard3D(grid.querySelectorAll(".circuit-card"), { maxTilt: 9, glow: true });
}

function resetCircuitFilters() {
  currentCircuitFilter = { region: "all", theme: "all", search: "", sort: "default" };
  const searchInput = $("#portalSearchInput");
  if (searchInput) searchInput.value = "";
  const sortSelect = $("#portalSortSelect");
  if (sortSelect) sortSelect.value = "default";
  $$(".circuit-pill").forEach(p => p.classList.toggle("active", p.dataset.region === "all"));
  $$(".portal-theme-pill").forEach(p => p.classList.toggle("active", p.dataset.theme === "all"));
  renderCircuits();
}

function selectCircuit(stateName, circuitId) {
  const mapSec = $("#mapSection");
  if (mapSec) {
    toast(`Selected ${stateName} regional circuit.`);
    statePanel(stateName);
    mapSec.scrollIntoView({ behavior: "smooth" });
  } else if (circuitId) {
    openPortalDossier(null, circuitId);
  } else if (typeof window.openAICardInsight === "function") {
    const circ = (typeof regionalCircuits !== "undefined") ? regionalCircuits.find(c => c.state === stateName) : null;
    window.openAICardInsight({
      title: circ ? circ.name : `${stateName} Heritage Circuit`,
      location: stateName,
      category: "Heritage Circuit",
      desc: circ ? circ.desc : `Comprehensive heritage and eco-corridor exploration across ${stateName}.`,
      img: circ ? circ.img : ""
    });
  } else {
    toast(`Selected ${stateName} regional circuit.`);
  }
}

function openPortalDossier(event, id) {
  if (event) event.stopPropagation();
  const c = regionalCircuits.find(item => item.id === id);
  if (!c) return;

  const modal = $("#portalDossierModal");
  if (!modal) {
    selectCircuit(c.state);
    return;
  }

  const titleEl = $("#portalModalTitle");
  const stateEl = $("#portalModalState");
  const descEl = $("#portalModalDesc");
  const altEl = $("#portalModalAlt");
  const seasonEl = $("#portalModalSeason");
  const elevEl = $("#portalModalElevation");

  if (titleEl) titleEl.textContent = c.name;
  if (stateEl) stateEl.textContent = `${c.state} • ${c.theme ? c.theme.toUpperCase() : 'HERITAGE'} CORRIDOR`;
  if (descEl) descEl.textContent = c.desc;
  if (altEl) altEl.textContent = c.alt || "N/A";
  if (seasonEl) seasonEl.textContent = c.season || "Apr–Oct";
  if (elevEl) elevEl.textContent = `${(c.elevationFt || 0).toLocaleString()} ft`;

  const waypointsWrap = $("#portalModalWaypoints");
  if (waypointsWrap && c.waypoints) {
    waypointsWrap.innerHTML = c.waypoints.map((wp, idx) => `
      <div class="portal-node-chip">
        <span style="color: #34d399; font-weight: 700;">${idx + 1}.</span>
        <span>${wp}</span>
        ${idx < c.waypoints.length - 1 ? '<span class="portal-node-arrow">→</span>' : ''}
      </div>
    `).join("");
  }

  const planBtn = $("#portalModalPlanBtn");
  if (planBtn) {
    planBtn.onclick = () => {
      localStorage.setItem("planned_corridor", JSON.stringify({
        id: c.id,
        name: c.name,
        state: c.state,
        waypoints: c.waypoints || [c.name]
      }));
      toast(`Added ${c.name} to Custom Itinerary Planner!`);
      setTimeout(() => {
        window.location.href = "planner.html";
      }, 600);
    };
  }

  const bookmarkBtn = $("#portalModalBookmarkBtn");
  if (bookmarkBtn) {
    bookmarkBtn.onclick = () => {
      saveDestination(c.id, {
        name: c.name,
        location: c.state,
        budget: 4500,
        img: c.img,
        altitude: c.alt
      });
    };
  }

  const aiInsightBtn = $("#portalModalAIBtn");
  if (aiInsightBtn) {
    aiInsightBtn.onclick = () => {
      closePortalDossier();
      if (typeof window.openAICardInsight === "function") {
        window.openAICardInsight({
          title: c.name,
          location: c.state,
          category: "Heritage Circuit",
          desc: c.desc,
          img: c.img
        });
      }
    };
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closePortalDossier() {
  const modal = $("#portalDossierModal");
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
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
      : `<span class="dest-altitude-badge">📍 ${d.altitude || "Himalayas"}</span>`;
    
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
          <p class="dest-desc">${displayDesc}</p>
          <div class="eco-chips">${chipsHtml}</div>
          <p class="dest-meta"><b>${seasonLabel}</b> ${d.bestSeason || d.best_season} • <b>${budgetLabel}</b> ₹${(d.budget || 3000).toLocaleString()}</p>
          <div class="dest-actions">
            <button onclick="saveDestination('${d.id}')">${addText}</button>
            <button onclick="showDestination('${d.id}')">${exploreText}</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Specular mouse-tracking glow & z-index elevation on hover
  grid.querySelectorAll(".destination").forEach(card => {
    let rect = null;
    card.addEventListener("mouseenter", () => {
      rect = card.getBoundingClientRect();
      card.style.zIndex = "15";
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
      card.style.zIndex = "";
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
  if (typeof window.openAICardInsight === "function") {
    const f = (typeof foods !== "undefined") ? foods.find(x => x.name === foodName) : null;
    window.openAICardInsight({
      title: foodName,
      category: "Indigenous Cuisine",
      location: f ? f.origin : "Himalayas",
      desc: f ? f.desc : `Authentic regional culinary delicacy from ${f ? f.origin : 'India'}.`,
      img: f ? f.img : ""
    });
  }
}

let currentFoodFilter = {
  diet: "all",
  search: ""
};

const foodDetailsData = {
  "Kashmiri Kahwa": {
    prep: "Whole saffron stigmas steeped with crushed green cardamom and cinnamon on traditional brass samovars. Poured steaming over freshly slivered almonds and wild acacia honey.",
    coop: "Pampore Saffron Growers Cooperative (Jammu & Kashmir)",
    pair: "Fresh baked girda or sheermaal bread",
    carbonSaved: "1.4 kg CO2e / pot",
    nutrition: "High polyphenol antioxidant density; natural altitude respiratory soothing."
  },
  "Kerala Appam with Stew": {
    prep: "Stone-ground parboiled rice batter fermented overnight with natural coconut toddy yeasts. Swirled in iron appachatti pans for fluffy pillowed centers and paper-thin crisp lace edges.",
    coop: "Wayanad Organic Spices & Coconut Guild (Kerala)",
    pair: "Steamed banana and aromatic cardamom ginger tea",
    carbonSaved: "0.8 kg CO2e / meal",
    nutrition: "Naturally probiotic; 100% plant-based healthy fats."
  },
  "Himachali Dham": {
    prep: "Slow-cooked in heavy tin-lined brass pots (charoti) over wood hearths by generational community cooks (Botis). Free of onions and garlic, relying on yogurt, asafoetida, and dry ginger.",
    coop: "Kangra Valley Homestay & Farm Collective (Himachal Pradesh)",
    pair: "Red mountain rice and spicy Khatta tamarind chutney",
    carbonSaved: "2.1 kg CO2e / thali",
    nutrition: "Zero commercial preservatives; alkaline satvik nutrition."
  },
  "Aloo ke Gutke": {
    prep: "Mountain red potatoes boiled in mineral spring water, cubed, and flash-sautéed in cold-pressed mustard oil with Himalayan wild jumboo (allium) herb and toasted coriander.",
    coop: "Kumaon Alpine Women Farmers Network (Uttarakhand)",
    pair: "Cucumber Kheera Raita seasoned with mountain mustard seeds",
    carbonSaved: "1.2 kg CO2e / serving",
    nutrition: "High potassium & iron; natural cold-defense thermogenesis."
  },
  "Traditional Bebinca": {
    prep: "Indo-Portuguese delicacy crafted with rich pressed coconut milk, eggs, nutmeg, and ghee. Patiently layered and browned one tier at a time under hot coconut husk embers.",
    coop: "Old Goa Heritage Bakery Guild (Goa)",
    pair: "Espresso or light roasted chicory coffee",
    carbonSaved: "0.6 kg CO2e / slice",
    nutrition: "Rich in medium-chain triglycerides (MCTs)."
  },
  "Chhena Poda": {
    prep: "Fresh cow-milk cottage cheese kneaded with wild cardamom and raw unrefined cane sugar, securely wrapped in green sal leaves and baked slowly inside charcoal embers until charred and caramelized.",
    coop: "Nayagarh Dairy Artisans Union (Odisha)",
    pair: "Spring water or chilled rabri",
    carbonSaved: "0.9 kg CO2e / slice",
    nutrition: "High bioavailable casein protein and calcium."
  }
};

function renderFood(opts = {}) {
  const grid = $("#foodGrid");
  if (!grid) return;

  if (typeof opts === "string") {
    currentFoodFilter.diet = opts;
  } else if (typeof opts === "object") {
    currentFoodFilter = { ...currentFoodFilter, ...opts };
  }

  let filtered = [...foods];

  // Filter by diet
  if (currentFoodFilter.diet === "plant") {
    filtered = filtered.filter(f => !f.name.toLowerCase().includes("fish") && !f.name.toLowerCase().includes("mutton"));
  } else if (currentFoodFilter.diet === "warming") {
    filtered = filtered.filter(f => ["Kashmir", "Ladakh", "Himachal Pradesh", "Uttarakhand"].includes(f.origin) || f.tags.some(t => t.toLowerCase().includes("altitude")));
  } else if (currentFoodFilter.diet === "probiotic") {
    filtered = filtered.filter(f => ["Appam", "Dosa", "Dhokla", "Gundruk", "Siddu"].some(k => f.name.includes(k)));
  } else if (currentFoodFilter.diet === "sweet") {
    filtered = filtered.filter(f => ["Chhena Poda", "Bebinca", "Apricot", "Kahwa"].some(k => f.name.includes(k)));
  } else if (currentFoodFilter.diet === "coastal") {
    filtered = filtered.filter(f => ["Goa", "Kerala", "Karnataka", "Andhra Pradesh"].includes(f.origin));
  }

  // Filter by search
  if (currentFoodFilter.search && currentFoodFilter.search.trim()) {
    const q = currentFoodFilter.search.toLowerCase().trim();
    filtered = filtered.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.origin.toLowerCase().includes(q) || 
      f.desc.toLowerCase().includes(q) ||
      f.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="food-empty-state">
        <p style="font-size: 28px; margin: 0 0 10px;">🍲</p>
        <h3 style="font-family: var(--font-main); font-size: 18px; color: var(--ink); margin: 0 0 6px;">No culinary specialties found</h3>
        <p style="font-size: 13.5px; color: var(--muted); margin: 0 0 16px;">Try clearing your flavor search or view all delicacies.</p>
        <button class="btn light" onclick="resetFoodFilters()">Reset Dietary Filters</button>
      </div>
    `;
    return;
  }

  const supportTitle = (window.i18n && typeof window.i18n.t === "function") 
    ? window.i18n.t("title_food_support") 
    : "Click to support zero-food-mile local produce (+5 pts)";

  grid.innerHTML = filtered.map(f => {
    const trans = (window.i18n && typeof window.i18n.getFoodTranslation === "function")
      ? window.i18n.getFoodTranslation(f.name)
      : null;
    const displayName = (trans && trans.name) ? trans.name : f.name;
    const displayDesc = (trans && trans.desc) ? trans.desc : f.desc;
    const tagsHtml = f.tags.map(t => `<span class="food-tag">${t}</span>`).join("");

    let flavor = "Indigenous Specialty";
    if (f.name.includes("Kahwa") || f.name.includes("Gutke") || f.name.includes("Thukpa")) flavor = "🔥 Warming Spice";
    else if (f.name.includes("Appam") || f.name.includes("Dosa") || f.name.includes("Dhokla")) flavor = "🌾 Slow Fermented";
    else if (f.name.includes("Fish")) flavor = "🌊 Sustainable Catch";
    else if (f.name.includes("Chhena") || f.name.includes("Bebinca")) flavor = "🍯 Hearth Sweet";
    else if (f.name.includes("Dham")) flavor = "🛕 Satvik Temple Feast";

    return `
      <article class="food" style="background-image:url('${f.img}')" onclick="supportLocalFood(event, '${f.name}')" title="${supportTitle}">
        <div>
          <span class="food-flavor-badge">${flavor}</span>
          <span class="eyebrow">${f.origin.toUpperCase()}</span>
          <h3>${displayName}</h3>
          <div class="food-tags">${tagsHtml}</div>
          <p>${displayDesc}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 8px; flex-wrap: wrap; gap: 6px;">
            <span class="food-revenue-share">🤝 ${f.revenueShare}</span>
            <button class="food-recipe-btn" onclick="openFoodRecipeModal(event, '${f.name}')">📖 Recipe & Story</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Add mouse-tracking 3D tilt + specular glow to food cards
  addCard3D(grid.querySelectorAll(".food"), { maxTilt: 8 });
}

function resetFoodFilters() {
  currentFoodFilter = { diet: "all", search: "" };
  const input = $("#foodSearchInput");
  if (input) input.value = "";
  $$(".food-diet-pill").forEach(p => p.classList.toggle("active", p.dataset.diet === "all"));
  renderFood();
}

function openFoodRecipeModal(event, foodName) {
  if (event) event.stopPropagation();
  const f = foods.find(x => x.name === foodName) || { name: foodName, origin: "India", revenueShare: "90% Direct Farmer Margin", desc: "" };
  const detail = foodDetailsData[foodName] || {
    prep: `Traditional preparation crafted with local heirloom ingredients and zero food miles, passed down through generations.`,
    coop: `Local Village Farmers & Homestay Collective (${f.origin})`,
    pair: `Locally harvested herbal tea or regional whole-grain flatbreads`,
    carbonSaved: `1.0 kg CO2e / serving`,
    nutrition: `100% locally sourced, chemical-free wholesome harvest.`
  };

  const modal = $("#foodRecipeModal");
  if (!modal) {
    toast(`Viewing recipe secrets for ${foodName}!`);
    return;
  }

  const tEl = $("#recipeModalTitle");
  const oEl = $("#recipeModalOrigin");
  const dEl = $("#recipeModalDesc");
  const pEl = $("#recipeModalPrep");
  const cEl = $("#recipeModalCoop");
  const prEl = $("#recipeModalPair");
  const cbEl = $("#recipeModalCarbon");
  const nEl = $("#recipeModalNutrition");

  if (tEl) tEl.textContent = f.name;
  if (oEl) oEl.textContent = `${f.origin} • ${f.revenueShare}`;
  if (dEl) dEl.textContent = f.desc;
  if (pEl) pEl.textContent = detail.prep;
  if (cEl) cEl.textContent = detail.coop;
  if (prEl) prEl.textContent = detail.pair;
  if (cbEl) cbEl.textContent = detail.carbonSaved;
  if (nEl) nEl.textContent = detail.nutrition;

  const bookmarkBtn = $("#recipeModalBookmarkBtn");
  if (bookmarkBtn) {
    bookmarkBtn.onclick = () => {
      saveDestination(`food_${f.name.toLowerCase().replace(/\s+/g, '_')}`, {
        name: `${f.name} Dining Stop`,
        location: f.origin,
        budget: 650,
        img: f.img,
        altitude: "Culinary"
      });
      toast(`Saved ${f.name} to your Expedition Dining List! ♥`);
    };
  }

  const aiBtn = $("#recipeModalAIBtn");
  if (aiBtn) {
    aiBtn.onclick = () => {
      openRecipeAIInsight(f.name);
    };
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeFoodRecipeModal() {
  const modal = $("#foodRecipeModal");
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }
}

// ── Superfood Carbon & Nutrient Calculator ──
const superfoodMetrics = {
  tsampa: { name: "Tsampa (Roasted Barley)", carbon: 3.2, nutrient: 94, coop: "95%" },
  seabuckthorn: { name: "Wild Seabuckthorn", carbon: 4.8, nutrient: 99, coop: "98%" },
  chhurpi: { name: "Yak Chhurpi Cheese", carbon: 2.6, nutrient: 92, coop: "94%" },
  saffron: { name: "Pampore Saffron", carbon: 1.8, nutrient: 96, coop: "96%" },
  apricot: { name: "Wild Apricot Kernel", carbon: 3.5, nutrient: 91, coop: "92%" },
  blackrice: { name: "Chak-Hao Black Rice", carbon: 2.9, nutrient: 95, coop: "93%" }
};

let activeSuperfoods = new Set(["tsampa", "seabuckthorn"]);

function toggleSuperfood(id) {
  if (activeSuperfoods.has(id)) {
    if (activeSuperfoods.size > 1) activeSuperfoods.delete(id);
  } else {
    activeSuperfoods.add(id);
  }
  updateSuperfoodCalcUI();
}

function updateSuperfoodCalcUI() {
  let totalCarbon = 0;
  let totalNutrient = 0;
  let count = activeSuperfoods.size;

  activeSuperfoods.forEach(id => {
    const m = superfoodMetrics[id];
    if (m) {
      totalCarbon += m.carbon;
      totalNutrient += m.nutrient;
    }
  });

  const avgNutrient = count > 0 ? Math.round(totalNutrient / count) : 90;
  const carbonSavedKg = totalCarbon.toFixed(1);

  const carbonEl = $("#calcCarbonSaved");
  const nutrientEl = $("#calcNutrientScore");
  const countEl = $("#calcItemCount");

  if (carbonEl) carbonEl.textContent = `${carbonSavedKg} kg`;
  if (nutrientEl) nutrientEl.textContent = `${avgNutrient} / 100`;
  if (countEl) countEl.textContent = `${count} Superfoods`;

  $$(".superfood-btn").forEach(btn => {
    const id = btn.dataset.sfId;
    if (activeSuperfoods.has(id)) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });
}

// ═══════════════════════════════════════════════════════
//  CULTURE PAGE - LIVING TRADITIONS & AUDIO SUITE
// ═══════════════════════════════════════════════════════

const culturalTraditions = [
  {
    id: "lungta",
    category: "sacred",
    region: "Himalayas • Ladakh",
    badge: "✦ Sacred Symbolism",
    title: "Lung-ta: Wind Horse Prayer Flags",
    img: "/assets/images/tawang.png",
    desc: "The 5 primary colors represent the 5 cosmic elements: Blue (Sky), White (Air/Wind), Red (Fire), Green (Water), and Yellow (Earth). Placed on mountain ridges so the wind carries compassionate blessings across the cosmos.",
    protocol: "Always hang with reverence; never discard on soil",
    aiQuery: "Prayer flag Lung ta Ladakh"
  },
  {
    id: "cham",
    category: "dance",
    region: "Ladakh • Spiti • Sikkim",
    badge: "✦ Monastic Rituals",
    title: "Sacred Cham Masked Dances",
    img: "/assets/images/dharamshala.png",
    desc: "Performed in Buddhist monasteries during annual festivals such as Hemis Tsechu and Gustor. Lamas don ornate silk brocades and sacred deity masks symbolizing the triumph of wisdom over spiritual ignorance.",
    protocol: "Silent reverence; observe photography restrictions in sanctum",
    aiQuery: "Cham dance Tibetan Buddhist monastery"
  },
  {
    id: "solarmud",
    category: "architecture",
    region: "Ladakh • Zanskar",
    badge: "✦ Vernacular Design",
    title: "Mud-Brick Passive Solar Architecture",
    img: "/assets/images/srinagar.jpg",
    desc: "Century-old Ladakhi rammed-earth and sun-dried mud bricks with southward-facing timber balconies. In -25°C Himalayan winters, thermal mass stores heat during the day without consuming fossil fuels.",
    protocol: "Eco-Heritage: Preserved by local artisan stone masons",
    aiQuery: "Vernacular architecture of Ladakh passive solar"
  },
  {
    id: "pashmina",
    category: "crafts",
    region: "Changthang Plateau",
    badge: "✦ Grassroots Guild",
    title: "Pashmina & Changpa Nomads",
    img: "/assets/images/gulmarg.png",
    desc: "The semi-nomadic Changpa graze Capra hircus goats at 15,000+ ft. The ultra-fine underfleece (pashm) is spun on traditional handlooms into authentic GI-tagged pashmina shawls by women's cooperatives.",
    protocol: "Verify genuine Ladakh GI tag; support direct loom prices",
    aiQuery: "Changpa pashmina nomads Changthang"
  },
  {
    id: "rootbridges",
    category: "architecture",
    region: "Meghalaya • Khasi Hills",
    badge: "✦ Bio-Engineering",
    title: "Jingkieng Jri: Living Root Bridges",
    img: "/assets/images/cherrapunji.png",
    desc: "Centuries-old suspension bridges trained across torrential rainforest rivers using aerial roots of Ficus elastica trees by Khasi and Jaintia tribal communities. Unlike concrete, these living bridges grow stronger with age.",
    protocol: "Walk bare-foot or soft-soled; never damage live root shoots",
    aiQuery: "Living root bridges Cherrapunji Meghalaya"
  },
  {
    id: "dhokra",
    category: "crafts",
    region: "Chhattisgarh • Bastar",
    badge: "✦ Ancient Metallurgy",
    title: "Bastar Dhokra Lost-Wax Casting",
    img: "/assets/images/bastar.png",
    desc: "An unbroken 4,000-year metallurgic tradition descending directly from the Indus Valley Civilization's 'Dancing Girl'. Uses beeswax coils, river clay molds, and recycled scrap brass to create spiritual totems.",
    protocol: "Purchase directly from Bastar tribal artisan panchayats",
    aiQuery: "Dhokra lost wax casting Bastar Chhattisgarh"
  },
  {
    id: "kalbelia",
    category: "dance",
    region: "Rajasthan • Thar Desert",
    badge: "✦ UNESCO Intangible",
    title: "Kalbelia Nomadic Songs & Serpent Dance",
    img: "/assets/images/jaisalmer.png",
    desc: "A mesmerizing rhythmic dance of nomadic desert communities once renowned as snake-charmers. Performed to the drone of the poongi gourd instrument with flowing black swirling skirts embroidered with mirrors.",
    protocol: "Support authentic nomadic folk performers at Jaisalmer",
    aiQuery: "Kalbelia dance Rajasthan UNESCO"
  },
  {
    id: "theyyam",
    category: "sacred",
    region: "Kerala • Malabar",
    badge: "✦ Sacred Invocation",
    title: "Theyyam: Living Deity Shrines",
    img: "/assets/images/kochi.png",
    desc: "An archaic ritualistic performance art of northern Kerala where performers invoke divine ancestors in sacred groves (Kavu). Intricate face-painting and monumental headdresses (Mudi) transcend caste barriers.",
    protocol: "Respect sacred grove sanctum; avoid flash photography",
    aiQuery: "Theyyam ritual dance Kerala sacred groves"
  },
  {
    id: "sankirtana",
    category: "dance",
    region: "Manipur • Imphal Valley",
    badge: "✦ UNESCO Heritage",
    title: "Manipuri Nat Sankirtana & Raas Leela",
    img: "/assets/images/imphal.png",
    desc: "A devotional temple art blending Vaishnavite lyrical drama, classical cymbals (Kartal), and drum beats (Pung Cholom) with lyrical circular movements in hand-embroidered Kumil skirts.",
    protocol: "Maintain prayerful quietude in temple mandapam",
    aiQuery: "Manipuri Sankirtana classical dance"
  },
  {
    id: "konark",
    category: "architecture",
    region: "Odisha • Puri Coast",
    badge: "✦ Sun Temple Marvel",
    title: "Konark Stone Chariot & Classical Odissi",
    img: "/assets/images/konark.png",
    desc: "Monumental 13th-century Sun Temple carved as a cosmic chariot with 24 colossal stone wheels. The temple mandapas inspired classical Odissi dance postures celebrating cosmic rhythms.",
    protocol: "Protect fragile carved chlorite reliefs; walk on marked wooden walkways",
    aiQuery: "Konark Sun Temple architecture Odissi classical dance"
  },
  {
    id: "hampi",
    category: "sacred",
    region: "Karnataka • Tungabhadra",
    badge: "✦ UNESCO Sanctuary",
    title: "Hampi Stone Chariot & Vijayanagara Heritage",
    img: "/assets/images/hampi.png",
    desc: "Spiritual granite sanctuaries overlooking the rocky Tungabhadra river. Musical pillars, chariot shrines, and active Virupaksha worship have continued unbroken for over six centuries.",
    protocol: "Observe sacred temple protocols at Virupaksha shrine",
    aiQuery: "Hampi Vijayanagara temple architecture stone chariot"
  },
  {
    id: "ajanta",
    category: "sacred",
    region: "Maharashtra • Sahyadri",
    badge: "✦ Rock-Cut Sanctuaries",
    title: "Ajanta & Ellora Monolithic Kailash",
    img: "/assets/images/agantaandellora.png",
    desc: "Kailash Temple carved top-down from a single basalt cliff face by Rashtrakuta artisans, alongside ancient Buddhist cave chaityas preserving 2,000-year-old fresco murals.",
    protocol: "No flash photography inside painting-lined cave sanctums",
    aiQuery: "Ajanta Ellora caves Kailash temple monolithic architecture"
  },
  {
    id: "anandpur",
    category: "crafts",
    region: "Punjab • Shivalik Foothills",
    badge: "✦ Martial Arts & Valor",
    title: "Hola Mohalla & Gatka Martial Traditions",
    img: "/assets/images/anandpursahib.png",
    desc: "A vibrant living tradition founded in 1701 by Guru Gobind Singh Ji, featuring equestrian sports, poetry recitations, community langar feasting, and the Gatka martial art.",
    protocol: "Cover head with cloth and remove shoes inside Anandpur Sahib",
    aiQuery: "Hola Mohalla Anandpur Sahib Gatka martial art Sikh heritage"
  },
  {
    id: "auroville",
    category: "architecture",
    region: "Tamil Nadu • Coromandel",
    badge: "✦ Universal Sanctuary",
    title: "Auroville Matrimandir & Bioclimatic Design",
    img: "/assets/images/auroville.png",
    desc: "An international spiritual township dedicated to human unity. The golden sphere of the Matrimandir houses a silent crystal meditation chamber illuminated by directed solar beams.",
    protocol: "Pre-book silence concentration passes; maintain complete quiet",
    aiQuery: "Auroville Matrimandir sustainable architecture integral yoga"
  }
];

let currentCultureCategory = "all";
let currentCultureSearch = "";

function renderCultureCards(cat = "all", search = "") {
  const grid = $("#cultureCardsGrid");
  if (!grid) return;

  currentCultureCategory = cat;
  currentCultureSearch = search;

  let filtered = [...culturalTraditions];
  if (cat !== "all") {
    filtered = filtered.filter(item => item.category === cat);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.region.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) ||
      item.protocol.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #ffffff; border-radius: var(--radius); border: 1px dashed rgba(13, 148, 136, 0.3);">
        <p style="font-size: 28px; margin: 0 0 10px;">📜</p>
        <h3 style="font-family: var(--font-main); font-size: 18px; color: var(--ink); margin: 0 0 6px;">No living traditions match your search</h3>
        <p style="font-size: 13.5px; color: #64748b; margin: 0 0 16px;">Try clearing your search term or exploring "All Traditions".</p>
        <button class="btn light" onclick="resetCultureFilters()">View All Traditions</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <article class="culture-card" onclick="openCultureInsight(event, '${item.title}', '${item.region}', '${item.aiQuery}')">
      <div class="culture-card-img-wrap" style="background-image: url('${item.img}');">
        <span class="card-badge">${item.badge}</span>
        <span class="culture-region-tag">${item.region}</span>
      </div>
      <div class="culture-card-body">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="card-footer">
          <span class="culture-protocol-pill" title="Ethical Travel Protocol">🌿 ${item.protocol}</span>
          <button class="culture-explore-btn" onclick="openCultureInsight(event, '${item.title}', '${item.region}', '${item.aiQuery}')">Explore Story ↗</button>
        </div>
      </div>
    </article>
  `).join("");
}

function resetCultureFilters() {
  currentCultureCategory = "all";
  currentCultureSearch = "";
  const input = $("#cultureSearchInput");
  if (input) input.value = "";
  $$(".culture-filter-pill").forEach(p => p.classList.toggle("active", p.dataset.cat === "all"));
  renderCultureCards();
}

function quickFilterCulture(keyword) {
  const searchInput = $("#cultureSearchInput");
  if (searchInput) {
    searchInput.value = keyword;
  }
  $$(".culture-filter-pill").forEach(p => p.classList.remove("active"));
  renderCultureCards("all", keyword);
  const grid = $("#cultureCardsGrid");
  if (grid) {
    grid.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  toast(`Filtered living traditions: "${keyword}"`);
}

function exploreCultureAI() {
  if (typeof window.openAICardInsight === "function") {
    window.openAICardInsight({
      title: "Living Heritage & Sacred Traditions of Ladakh",
      location: "Ladakh & Western Himalayas",
      category: "Living Traditions",
      desc: "Immerse in ancient Gompa rituals, sacred Cham dances, mud-brick solar architectural wisdom, and nomadic Changpa Pashmina weaving.",
      query: "Ladakh Buddhist culture monasteries Cham dance Losar prayer flags"
    });
  } else {
    window.location.href = "ai.html?q=" + encodeURIComponent("Tell me about Buddhist monasteries, sacred Cham dance, and living traditions of Ladakh");
  }
}

function openCultureInsight(event, title, region, query) {
  if (event) event.stopPropagation();
  if (typeof window.openAICardInsight === "function") {
    window.openAICardInsight({
      title: title,
      location: region,
      category: "Living Heritage",
      desc: `Traditional cultural wisdom and living practices from ${region}.`,
      query: query || title
    });
  } else {
    toast(`Exploring cultural storylines for: ${title}`);
  }
}

function openRecipeAIInsight(foodName) {
  closeFoodRecipeModal();
  const f = foods.find(x => x.name === foodName) || { name: foodName, origin: "India", desc: "" };
  if (typeof window.openAICardInsight === "function") {
    window.openAICardInsight({
      title: `${f.name} Culinary Heritage`,
      category: "Indigenous Cuisine",
      location: f.origin,
      desc: f.desc,
      img: f.img,
      query: `${f.name} traditional preparation heirloom ingredients history ${f.origin}`
    });
  } else {
    toast(`Exploring AI insights for ${f.name}`);
  }
}

// Web Audio API harmonic bell & Tibetan singing bowl synthesis
let audioCtx = null;
function playCultureBell(freq = 280) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const harmonics = [1, 2.76, 5.4, 8.93];
    const gains = [0.45, 0.25, 0.12, 0.05];

    harmonics.forEach((h, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = idx === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq * h, now);

      gain.gain.setValueAtTime(gains[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 4);
    });

    const waveBars = document.querySelectorAll(".soundwave-bar");
    waveBars.forEach(b => b.classList.add("playing"));
    setTimeout(() => {
      waveBars.forEach(b => b.classList.remove("playing"));
    }, 3800);

    toast("🔔 Resonant sound of sacred Himalayan bowls (280 Hz)");
  } catch (err) {
    console.warn("Audio synthesis note:", err);
  }
}

// Cultural Quest Mini-Quiz logic
const cultureQuizData = [
  {
    q: "What element does the Blue flag represent in traditional Himalayan Lung-ta prayer flags?",
    opts: ["Fire", "Sky / Space", "Earth", "Water"],
    correct: 1,
    exp: "Blue symbolizes the boundless Sky and Space in sacred Himalayan Tibetan cosmology."
  },
  {
    q: "How are the living root bridges (Jingkieng Jri) of Meghalaya constructed?",
    opts: [
      "Carved from hollowed teak trunks",
      "Trained aerial roots of living Ficus elastica trees",
      "Braided bamboo soaked in resin",
      "Mud-plastered stone foundations"
    ],
    correct: 1,
    exp: "Khasi elders guide live aerial roots through betel-nut trunks; they take 15–25 years to mature and last for centuries."
  },
  {
    q: "Why do high-altitude Ladakhi homes traditionally use sun-dried mud bricks rather than concrete?",
    opts: [
      "They store thermal heat during sun hours and insulate down to -25°C",
      "They are lighter for mountain transport",
      "They are mandatory by religious decree",
      "They reflect solar radiation"
    ],
    correct: 0,
    exp: "Mud bricks provide high thermal mass that captures passive solar heat during the daytime and radiates it indoors during icy nights."
  }
];

let currentQuizIndex = 0;
let userQuizScore = 0;

function initCultureQuest() {
  const qBox = $("#cultureQuizQuestionBox");
  if (!qBox) return;

  const q = cultureQuizData[currentQuizIndex];
  qBox.innerHTML = `
    <h4><b>Question ${currentQuizIndex + 1} of ${cultureQuizData.length}:</b> ${q.q}</h4>
    <div class="quiz-options-grid">
      ${q.opts.map((opt, idx) => `
        <button class="quiz-opt-btn" onclick="answerCultureQuiz(${idx})">${opt}</button>
      `).join("")}
    </div>
    <div id="quizFeedbackBox" style="display: none; margin-top: 16px; padding: 12px 16px; border-radius: 10px; font-size: 13px;"></div>
  `;
}

function answerCultureQuiz(chosenIdx) {
  const q = cultureQuizData[currentQuizIndex];
  const buttons = document.querySelectorAll(".quiz-opt-btn");
  buttons.forEach((b, idx) => {
    b.disabled = true;
    if (idx === q.correct) b.classList.add("correct");
    if (idx === chosenIdx && idx !== q.correct) b.classList.add("wrong");
  });

  const feedback = $("#quizFeedbackBox");
  if (feedback) {
    feedback.style.display = "block";
    if (chosenIdx === q.correct) {
      userQuizScore += 5;
      updateResponsibleScore(5, "Cultural Heritage Discovery Quest: Correct answer!");
      feedback.style.background = "rgba(16, 185, 129, 0.2)";
      feedback.style.color = "#a7f3d0";
      feedback.innerHTML = `<b>✓ Correct! (+5 Pts)</b> ${q.exp}`;
      playCultureBell(320);
    } else {
      feedback.style.background = "rgba(239, 68, 68, 0.2)";
      feedback.style.color = "#fca5a5";
      feedback.innerHTML = `<b>Explanation:</b> ${q.exp}`;
    }
  }

  const scoreEl = $("#quizScoreValue");
  if (scoreEl) scoreEl.textContent = `${userQuizScore} Pts`;

  setTimeout(() => {
    if (currentQuizIndex < cultureQuizData.length - 1) {
      currentQuizIndex++;
      initCultureQuest();
    } else {
      if (feedback) {
        feedback.innerHTML += `<div style="margin-top: 10px; font-weight: 700; color: #fbbf24;">🎉 Cultural Quest Completed! You earned total ${userQuizScore} points for your traveler dossier!</div>`;
      }
    }
  }, 2400);
}

function selectKoraStep(stepNum) {
  $$(".kora-step-card").forEach((card, idx) => {
    card.classList.toggle("active-kora", idx + 1 === stepNum);
  });
  playCultureBell(350 + stepNum * 40);
  toast(`Sacred Protocol Step ${stepNum} focused.`);
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
      card.style.zIndex = "15";
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
      card.style.zIndex = "";
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
  if (typeof window.openAICardInsight === "function") {
    window.openAICardInsight({
      id: d.id,
      title: d.name,
      category: d.type || "Destination",
      location: d.location,
      desc: d.desc,
      img: d.img,
      altitude: d.altitude,
      season: d.bestSeason || d.best_season,
      budget: d.budget,
      communityBenefit: d.communityBenefit,
      ecoBadges: d.ecoBadges
    });
  } else {
    toast(`${d.name} (${d.location}): Altitude ${d.altitude || "High Altitude"} • ${d.communityBenefit || "Eco Certified"}`);
  }
}

// --- Journey Bookmarks & Drawer Flow ---

function updateSavedCount() {
  const saved = JSON.parse(localStorage.getItem("bharatSaved") || "[]");
  const countEl = $("#navSavedCount");
  const drawerCount = $("#drawerCount");

  if (countEl) countEl.textContent = saved.length;
  if (drawerCount) drawerCount.textContent = saved.length;
}

function saveDestination(id, extraData) {
  let saved = JSON.parse(localStorage.getItem("bharatSaved") || "[]");
  let customItems = JSON.parse(localStorage.getItem("bharatCustomSaved") || "{}");

  if (extraData) {
    customItems[id] = extraData;
    localStorage.setItem("bharatCustomSaved", JSON.stringify(customItems));
  }

  if (!saved.includes(id)) {
    saved.push(id);
    localStorage.setItem("bharatSaved", JSON.stringify(saved));
    syncSavedToBackend(saved);
    const dest = activeDestinations.find(d => d.id === id);
    if (dest && dest.isOffbeat) {
      updateResponsibleScore(10, `Eco-Dispersion gem saved: ${dest.name}!`);
    } else if (extraData && extraData.name) {
      updateResponsibleScore(5, `Saved ${extraData.name} to My Journey!`);
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
  let customItems = JSON.parse(localStorage.getItem("bharatCustomSaved") || "{}");
  saved = saved.filter(x => x !== id);
  delete customItems[id];
  localStorage.setItem("bharatSaved", JSON.stringify(saved));
  localStorage.setItem("bharatCustomSaved", JSON.stringify(customItems));
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
  const customItems = JSON.parse(localStorage.getItem("bharatCustomSaved") || "{}");

  const savedItems = savedIds.map(id => {
    let item = activeDestinations.find(d => d.id === id);
    if (item) return item;
    if (customItems[id]) {
      return { id, ...customItems[id] };
    }
    // Check in foods
    const f = foods.find(x => `food_${x.name.toLowerCase().replace(/\s+/g, '_')}` === id || x.name === id);
    if (f) {
      return { id, name: f.name, location: f.origin, img: f.img, budget: 650, communityBenefit: f.revenueShare };
    }
    // Check in regionalCircuits
    const c = regionalCircuits.find(x => x.id === id);
    if (c) {
      return { id, name: c.name, location: c.state, img: c.img, budget: 4500, communityBenefit: "3D Regional Corridor" };
    }
    return null;
  }).filter(Boolean);

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
        <img src="${item.img}" alt="${itemName}" style="object-fit:cover;">
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
  if (typeof window.syncUserSessionState === "function") {
    window.syncUserSessionState();
  }

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

  // Mobile menu toggle with touch outside & keyboard dismiss
  const navToggle = $(".nav-toggle");
  if (navToggle) {
    const closeMobileNav = () => {
      const nav = $(".nav");
      if (nav && nav.classList.contains("open")) {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    };

    navToggle.onclick = (e) => {
      e.stopPropagation();
      const nav = $(".nav");
      nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", nav.classList.contains("open"));
    };

    // Close on any link click
    $$(".nav nav a").forEach(a => {
      a.addEventListener("click", closeMobileNav);
    });

    // Close when tapping outside the open nav on mobile/tablets
    document.addEventListener("click", (e) => {
      const nav = $(".nav");
      if (nav && nav.classList.contains("open") && !nav.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close with Escape key for accessibility
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileNav();
    });

    // Close if orientation changes or screen resizes above mobile breakpoint
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1120) closeMobileNav();
    }, { passive: true });
  }

  // Itinerary form submission
  const plannerForm = $("#plannerForm");
  if (plannerForm) {
    plannerForm.onsubmit = e => {
      if (typeof window.itinerary === "function") return window.itinerary(e);
      if (typeof window.askPlannerAI === "function") {
        e.preventDefault();
        const dest = ($("#planDestination") && $("#planDestination").value) || "Ladakh";
        const days = ($("#planDays") && $("#planDays").value) || 5;
        const budget = ($("#planBudget") && $("#planBudget").value) || 30000;
        const style = ($("#planStyle") && $("#planStyle").value) || "Adventure";
        return window.askPlannerAI(`Plan me a ${days}-day trip to ${dest} with budget ₹${budget} in ${style} travel style`);
      }
    };
  }

  // AI Chat form submission
  const chatForm = $("#chatForm");
  if (chatForm) {
    chatForm.onsubmit = e => {
      e.preventDefault();
      const input = $("#chatInput");
      const val = input ? input.value.trim() : "";
      if (val && typeof window.askAI === "function") {
        window.askAI(val);
      }
      if (input) input.value = "";
    };
  }

  // Suggestion buttons
  $$(".ai-suggestions button").forEach(b => {
    b.onclick = () => {
      if (typeof window.askAI === "function") {
        window.askAI(b.dataset.question);
      }
    };
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

  // Footer field kit & AMS guidelines links
  const footerFieldKitLink = $("#footerFieldKitLink");
  if (footerFieldKitLink) {
    footerFieldKitLink.onclick = () => {
      $("#fieldKitModal").classList.add("open");
    };
  }

  const footerAmsLink = $("#footerAmsLink");
  if (footerAmsLink) {
    footerAmsLink.onclick = () => {
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
      exploreCultureAI();
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

  // --- Interactive Thematic Pages Initializers ---
  // 1. Culture Page
  if ($("#cultureCardsGrid")) {
    renderCultureCards();
    initCultureQuest();
    const cInput = $("#cultureSearchInput");
    if (cInput) {
      cInput.addEventListener("input", e => renderCultureCards(currentCultureCategory, e.target.value));
    }
    $$(".culture-filter-pill").forEach(pill => {
      pill.onclick = () => {
        $$(".culture-filter-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        renderCultureCards(pill.dataset.cat, currentCultureSearch);
      };
    });
  }

  // 2. Portals (Circuits) Page
  if ($("#circuitsGrid")) {
    const pInput = $("#portalSearchInput");
    if (pInput) {
      pInput.addEventListener("input", e => renderCircuits({ search: e.target.value }));
    }
    const pSort = $("#portalSortSelect");
    if (pSort) {
      pSort.addEventListener("change", e => renderCircuits({ sort: e.target.value }));
    }
    $$(".portal-theme-pill").forEach(pill => {
      pill.onclick = () => {
        $$(".portal-theme-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        renderCircuits({ theme: pill.dataset.theme });
      };
    });
  }

  // 3. Cuisine (Food) Page
  if ($("#foodGrid")) {
    const fInput = $("#foodSearchInput");
    if (fInput) {
      fInput.addEventListener("input", e => renderFood({ search: e.target.value }));
    }
    $$(".food-diet-pill").forEach(pill => {
      pill.onclick = () => {
        $$(".food-diet-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        renderFood({ diet: pill.dataset.diet });
      };
    });
    updateSuperfoodCalcUI();
  }

  // --- 3D Immersive Systems Initialization ---
  initScrollReveal();

  requestAnimationFrame(() => {
    initAmbientParticles();
    initExperienceCard3D();
  });

  // ── Theme Toggle ───────────────────────────────────────
  initThemeToggle();
}

// ═══════════════════════════════════════════════════════
//  DAY / NIGHT MODE TOGGLE
// ═══════════════════════════════════════════════════════

function initThemeToggle() {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;

  // Apply saved preference immediately (before paint)
  const saved = localStorage.getItem("bharatExploreTheme") || "light";
  applyTheme(saved, btn);

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next, btn);
    localStorage.setItem("bharatExploreTheme", next);
  });
}

function applyTheme(theme, btn) {
  document.documentElement.setAttribute("data-theme", theme);
  if (btn) {
    btn.textContent = theme === "dark" ? "🌙" : "☀️";
    btn.title = theme === "dark" ? "Switch to Day Mode" : "Switch to Night Mode";
  }
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
window.regionalCircuits = regionalCircuits;
window.foods = foods;
window.playCultureBell = playCultureBell;
window.renderCultureCards = renderCultureCards;
window.resetCultureFilters = resetCultureFilters;
window.openCultureInsight = openCultureInsight;
window.answerCultureQuiz = answerCultureQuiz;
window.selectKoraStep = selectKoraStep;
window.openPortalDossier = openPortalDossier;
window.closePortalDossier = closePortalDossier;
window.resetCircuitFilters = resetCircuitFilters;
window.openFoodRecipeModal = openFoodRecipeModal;
window.closeFoodRecipeModal = closeFoodRecipeModal;
window.resetFoodFilters = resetFoodFilters;
window.toggleSuperfood = toggleSuperfood;
window.exploreCultureAI = exploreCultureAI;
window.quickFilterCulture = quickFilterCulture;
window.openRecipeAIInsight = openRecipeAIInsight;

