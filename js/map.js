/**
 * Bharat Explore — Interactive Map & Spatial Discovery Engine
 * Smart India Hackathon (SIH 2026) Official Platform
 * Modular Leaflet GIS mapping, 44 telemetry nodes, single-active hover cards, & boundary rendering
 */

(function () {
  'use strict';

  // Shared DOM helpers with fallback
  const $ = window.$ || (s => document.querySelector(s));
  const $$ = window.$$ || (s => [...document.querySelectorAll(s)]);
  const toast = (...args) => (window.toast ? window.toast(...args) : console.log(...args));

// ═══════════════════════════════════════════════════════
//  COMPREHENSIVE PAN-INDIA HOTSPOTS DATASET (44 DESTINATIONS)
//  Complete geographic telemetry, local assets & interactive metadata
// ═══════════════════════════════════════════════════════

const indiaHotspots = [
  // ─── NORTH & HIMALAYAS ───
  {
    id: "ladakh",
    name: "Ladakh & Pangong Tso",
    state: "Ladakh",
    region: "north",
    regionName: "North & Himalayas",
    category: "mountains",
    coords: [34.1526, 77.5771],
    altitude: "11,500 – 14,270 ft",
    bestSeason: "May – Sep",
    highlights: ["Pangong Tso Lake", "Khardung La Pass", "Thiksey Monastery", "Nubra Valley"],
    desc: "Trans-Himalayan high plateau with shimmering cobalt alpine lakes, ancient Tibetan Buddhist gompas, and motorable high passes.",
    culture: "Tibetan Buddhist monastic heritage, sacred Cham masked dances, Losar celebrations.",
    food: "Thukpa, Skyu barley stew, Butter Tea (Gur Gur), Tsampa, Organic Apricots.",
    img: "https://images.unsplash.com/photo-1577500680965-6054e87d944b?auto=format&fit=crop&w=700&q=80",
    badge: "High-Altitude Focus"
  },
  {
    id: "hanle",
    name: "Hanle Dark Sky Reserve",
    state: "Ladakh",
    region: "north",
    regionName: "North & Himalayas",
    category: "mountains",
    coords: [32.7756, 78.9667],
    altitude: "14,900 ft",
    bestSeason: "May – Oct",
    highlights: ["Milky Way Core Stargazing", "Indian Astronomical Observatory", "Changthang Nomads"],
    desc: "India's first certified Dark Sky Sanctuary offering pristine naked-eye astrophotography in thin, crystal-clear high-altitude air.",
    culture: "Changpa nomadic pastoral life, high-altitude pashmina rearing, village astrostays.",
    food: "Fresh Yak Cheese (Chhurpi), Butter Tea, Tsampa Porridge.",
    img: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=700&q=80",
    badge: "Dark Sky Sanctuary"
  },
  {
    id: "srinagar",
    name: "Srinagar & Dal Lake",
    state: "Jammu & Kashmir",
    region: "north",
    regionName: "North & Himalayas",
    category: "nature",
    coords: [34.0837, 74.7973],
    altitude: "5,200 ft",
    bestSeason: "Apr – Oct",
    highlights: ["Dal Lake Houseboats", "Floating Vegetable Market", "Nishat Mughal Gardens", "Old City Bazaars"],
    desc: "The crown jewel of Kashmir, renowned for tranquil shikara rides on mirror lakes, hand-carved cedar houseboats, and majestic chinar avenues.",
    culture: "Kashmiri Sufi tradition, Pashmina needle embroidery, papier-mâché crafts.",
    food: "Wazwan, Rogan Josh, Kashmiri Kahwa with saffron and crushed almonds.",
    img: "assets/images/srinagar.jpg",
    badge: "Paradise of Lakes"
  },
  {
    id: "gulmarg",
    name: "Gulmarg Meadow of Flowers",
    state: "Jammu & Kashmir",
    region: "north",
    regionName: "North & Himalayas",
    category: "mountains",
    coords: [34.0484, 74.3805],
    altitude: "8,694 – 13,058 ft",
    bestSeason: "Year-Round (Winter Skiing)",
    highlights: ["Gulmarg Gondola Phase 2", "Apharwat Peak Snow Slopes", "Pine Alpine Basin"],
    desc: "Premier alpine ski and trekking destination featuring one of the world's highest operating passenger cable cars.",
    culture: "Himalayan alpine guiding, shepherd encampments, winter mountain sports.",
    food: "Harissa, Modur Pulao, Noon Chai with crisp Bakarkhani.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80",
    badge: "Alpine Ski Crest"
  },
  {
    id: "spiti",
    name: "Spiti Valley Cold Desert",
    state: "Himachal Pradesh",
    region: "north",
    regionName: "North & Himalayas",
    category: "mountains",
    coords: [32.2461, 78.0349],
    altitude: "12,500 – 15,000 ft",
    bestSeason: "Jun – Oct",
    highlights: ["Key Cliffside Monastery", "Chandratal Crescent Lake", "Hikkim Highest Post Office", "Kibber Wildlife"],
    desc: "Surreal Trans-Himalayan barren valley holding thousand-year-old Buddhist monasteries, deep gorges, and marine fossils.",
    culture: "Bodh monastic life, fossil preservation, solar homestays.",
    food: "Siddu, Thukpa, Seabuckthorn Tea, Chhang.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80",
    badge: "Cold Desert Wonder"
  },
  {
    id: "manali",
    name: "Manali & Rohtang Pass",
    state: "Himachal Pradesh",
    region: "north",
    regionName: "North & Himalayas",
    category: "mountains",
    coords: [32.2396, 77.1887],
    altitude: "6,726 – 13,058 ft",
    bestSeason: "Year-Round",
    highlights: ["Solang Valley", "Atal Tunnel Lahaul Gateway", "Old Manali Cedar Trails", "Beas River Cascades"],
    desc: "Verdant pine-clad valley surrounded by dramatic Pir Panjal peaks, serving as the gateway to the Lahaul high passes.",
    culture: "Kullu shawls and handlooms, Hadimba Devi temple folklore, Himalayan eco-cafes.",
    food: "Himachali Dham feast, Trout Fish, Babru, Bhey (lotus stem).",
    img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80",
    badge: "Alpine Gateway"
  },
  {
    id: "rishikesh",
    name: "Rishikesh Yoga Capital",
    state: "Uttarakhand",
    region: "north",
    regionName: "North & Himalayas",
    category: "nature",
    coords: [30.0869, 78.2676],
    altitude: "1,220 ft",
    bestSeason: "Oct – May",
    highlights: ["Ganga Evening Aarti", "Laxman Jhula & Ram Jhula", "White-Water Rafting", "Neelkanth Mahadev"],
    desc: "Spiritual haven where the emerald Ganges river rushes down from the Himalayan peaks into the peaceful Shivalik foothills.",
    culture: "Vedic chanting, ancient yoga ashrams, evening fire ceremonies.",
    food: "Aloo ke Gutke, Kafuli, Garhwali Thali, Fresh Mountain Herbal Teas.",
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=700&q=80",
    badge: "Yoga & River Capital"
  },
  {
    id: "valleyofflowers",
    name: "Valley of Flowers & Hemkund",
    state: "Uttarakhand",
    region: "north",
    regionName: "North & Himalayas",
    category: "mountains",
    coords: [30.7280, 79.6053],
    altitude: "11,500 – 14,400 ft",
    bestSeason: "Jul – Sep",
    highlights: ["Endemic Alpine Flora", "Hemkund Sahib Glacial Lake", "Nanda Devi Biosphere Buffer"],
    desc: "UNESCO World Heritage alpine valley carpeted in hundreds of rare wildflowers against hanging glaciers and cascading waterfalls.",
    culture: "Sacred mountain pilgrim trails, zero-waste biodiversity stewardship.",
    food: "Chainsoo, Mandua (finger millet) Roti, Jhangora Ki Kheer.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80",
    badge: "UNESCO Biosphere"
  },
  {
    id: "amritsar",
    name: "Amritsar Golden Temple",
    state: "Punjab",
    region: "north",
    regionName: "North & Himalayas",
    category: "heritage",
    coords: [31.6200, 74.8765],
    altitude: "750 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Sri Harmandir Sahib", "World's Largest Free Kitchen (Langar)", "Wagah Border Beating Retreat"],
    desc: "Spiritual epicenter of Sikhism, revered for the luminous gilded sanctum surrounded by the sacred Amrit Sarovar tank.",
    culture: "Sikh seva (selfless service), vibrant Gurbani kirtan, rich Punjabi warmth.",
    food: "Amritsari Kulcha with Chole, Creamy Makhan Lassi, Pinni.",
    img: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=700&q=80",
    badge: "Living Heritage"
  },
  {
    id: "chandigarh",
    name: "Chandigarh Rock Garden",
    state: "Chandigarh",
    region: "north",
    regionName: "North & Himalayas",
    category: "heritage",
    coords: [30.7525, 76.8101],
    altitude: "1,050 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Nek Chand's Recycled Rock Garden", "Sukhna Lake Promenade", "Le Corbusier Capitol Complex"],
    desc: "Pioneering modernist garden and urban masterpiece constructed entirely from industrial ceramics and recycled urban stone.",
    culture: "Eco-art recycling philosophy, modernist urban planning.",
    food: "Chole Bhature, Sarson ka Saag, Tandoori specialties.",
    img: "assets/images/rockgarden.png",
    badge: "Eco-Sculptural Wonder"
  },
  {
    id: "kurukshetra",
    name: "Kurukshetra Brahma Sarovar",
    state: "Haryana",
    region: "north",
    regionName: "North & Himalayas",
    category: "heritage",
    coords: [29.9695, 76.8783],
    altitude: "850 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Brahma Sarovar Sacred Water", "Jyotisar Birthplace of Gita", "Panorama Science Centre"],
    desc: "Ancient historical epicenter of the Mahabharata and Bhagavad Gita, surrounded by tranquil ghats and monumental bronze chariots.",
    culture: "Philosophical discourses, sacred solar dip rituals, Vedic heritage.",
    food: "Bajra Khichdi, Besan Masala Roti, Fresh A2 Cow Buttermilk.",
    img: "assets/images/kurukshetra.png",
    badge: "Ancient Epic Cradle"
  },

  // ─── NORTH EAST ───
  {
    id: "gangtok",
    name: "Gangtok & Kanchenjunga",
    state: "Sikkim",
    region: "northeast",
    regionName: "North East",
    category: "mountains",
    coords: [27.3389, 88.6065],
    altitude: "5,410 – 17,800 ft",
    bestSeason: "Mar – May & Oct – Dec",
    highlights: ["Gurudongmar High Lake", "Rumtek Monastery", "Nathula Border Pass", "Kanchenjunga Panoramic Views"],
    desc: "Capital of India's first 100% organic state, perched on mountain ridges overlooking cloud valleys and snowy Himalayan summits.",
    culture: "Lepcha, Bhutia, and Nepali traditions, organic sustainable farming.",
    food: "Steamed Momos, Thukpa, Gundruk soup, Kinema ferment, Tingmo.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80",
    badge: "100% Organic State"
  },
  {
    id: "tawang",
    name: "Tawang Monastery & Sela Pass",
    state: "Arunachal Pradesh",
    region: "northeast",
    regionName: "North East",
    category: "mountains",
    coords: [27.5861, 91.8594],
    altitude: "10,000 – 13,700 ft",
    bestSeason: "Mar – Oct",
    highlights: ["400-Year Tawang Monastery", "Sela Pass Frozen Lake", "Madhuri Lake", "Monpa Village Homestays"],
    desc: "Perched high in the Eastern Himalayas, home to the second largest Buddhist monastery in the world and mist-shrouded glacial passes.",
    culture: "Monpa tribal culture, wood carving, handmade paper craft (Mon Shugu).",
    food: "Zan millet porridge, Thukpa, Gyapa Khazi, Yak butter tea.",
    img: "assets/images/tawang.png",
    badge: "Eastern Himalaya Crest"
  },
  {
    id: "kaziranga",
    name: "Kaziranga Rhino Sanctuary",
    state: "Assam",
    region: "northeast",
    regionName: "North East",
    category: "nature",
    coords: [26.5775, 93.1711],
    altitude: "260 ft",
    bestSeason: "Nov – Apr",
    highlights: ["Great Indian One-Horned Rhinoceros", "Brahmaputra Floodplains", "Elephant Grass Safari", "Migratory Birds"],
    desc: "UNESCO World Heritage conservation miracle supporting two-thirds of the planet's great one-horned rhinoceros population.",
    culture: "Assamese village life, Bihu folk rhythms, handloom silk weaving.",
    food: "Masor Tenga (sour fish curry), Khar, Duck Curry with Ash Gourd, Pitha.",
    img: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=700&q=80",
    badge: "UNESCO Rhino Sanctuary"
  },
  {
    id: "majuli",
    name: "Majuli Sacred River Island",
    state: "Assam",
    region: "northeast",
    regionName: "North East",
    category: "nature",
    coords: [26.9544, 94.2144],
    altitude: "275 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Neo-Vaishnavite Satras", "Ancient Clay Mask Making", "Brahmaputra Sunset Ferries", "Mishing Bamboo Houses"],
    desc: "World's largest inhabited freshwater river island, cradling 15th-century monastic classical dance, theater, and pottery.",
    culture: "Sattriya classical dance, bamboo architecture, spiritual monastic guilds.",
    food: "Mishing Fish baked in banana leaf, Apong rice brew, Pitha cakes.",
    img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80",
    badge: "World's Largest River Island"
  },
  {
    id: "shillong",
    name: "Cherrapunji Living Root Bridges",
    state: "Meghalaya",
    region: "northeast",
    regionName: "North East",
    category: "nature",
    coords: [25.5788, 91.8933],
    altitude: "4,908 ft",
    bestSeason: "Sep – May",
    highlights: ["Double Decker Living Root Bridge", "Nohkalikai Falls", "Dawki Transparent River", "Mawlynnong Cleanest Village"],
    desc: "The wettest place on Earth, renowned for ancient bio-engineered living ficus root bridges spanning roaring rainforest canyons.",
    culture: "Khasi matrilineal traditions, sacred groves, community cleanliness code.",
    food: "Jadoh (spiced rice), Dohneiiong (pork with black sesame), Tungrymbai.",
    img: "assets/images/cherrapunji.png",
    badge: "Bio-Engineering Marvel"
  },
  {
    id: "loktak",
    name: "Loktak Floating Lake",
    state: "Manipur",
    region: "northeast",
    regionName: "North East",
    category: "nature",
    coords: [24.5500, 93.8000],
    altitude: "2,520 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Keibul Lamjao Floating Park", "Endangered Dancing Sangai Deer", "Circular Phumdi Islands"],
    desc: "The world's only floating national park, composed of circular floating biomass rings gently drifting on tranquil blue waters.",
    culture: "Meitei fisher folk life, water lily harvesting, indigenous lake stewardship.",
    food: "Eromba with fermented fish, Kangsoi vegetable stew, Singju salad.",
    img: "assets/images/loktaklake.png",
    badge: "Only Floating Park"
  },
  {
    id: "kohima",
    name: "Kohima & Dzukou Valley",
    state: "Nagaland",
    region: "northeast",
    regionName: "North East",
    category: "nature",
    coords: [25.6751, 94.1086],
    altitude: "4,738 – 8,045 ft",
    bestSeason: "Jun – Sep (Lilies) & Oct – Mar",
    highlights: ["Rolling Emerald Dzukou Valley", "Hornbill Festival Heritage Village", "War Memorial", "Khonoma Green Village"],
    desc: "Pristine high-altitude valley with rolling dwarf bamboo hills, endemic Dzukou lilies, and India's first green eco-village.",
    culture: "Angami tribal solidarity, indigenous wood carving, festive warrior dances.",
    food: "Smoked meat with Axone (fermented soya), Bamboo shoot pork, Galho rice.",
    img: "assets/images/kohima.png",
    badge: "Eco Valley Sanctuary"
  },
  {
    id: "aizawl",
    name: "Aizawl Cloud Ridges",
    state: "Mizoram",
    region: "northeast",
    regionName: "North East",
    category: "mountains",
    coords: [23.7271, 92.7176],
    altitude: "3,700 ft",
    bestSeason: "Oct – Apr",
    highlights: ["Durtlang Cloud Viewpoint", "Solomon's Temple", "Reiek Heritage Peak", "Tamdil Natural Lake"],
    desc: "Serene hillside capital built along narrow mountain crests, famous for orderly traffic, mountain mist, and vibrant church choirs.",
    culture: "Mizo Tlawmngaihna (community code of kindness), bamboo dance (Cheraw).",
    food: "Bai (steamed greens with pork & soda), Vawksa Rep (smoked pork), Sawhchiar.",
    img: "assets/images/aizawl.png",
    badge: "Cloud Ridge Capital"
  },
  {
    id: "agartala",
    name: "Agartala Ujjayanta Palace",
    state: "Tripura",
    region: "northeast",
    regionName: "North East",
    category: "heritage",
    coords: [23.8315, 91.2868],
    altitude: "42 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Neoclassical Ujjayanta Palace", "Neermahal Water Castle", "Unakoti Rock Carvings"],
    desc: "Royal seat of the Manikya dynasty featuring shimmering white palaces reflected in ornamental Mughal-style water channels.",
    culture: "Tripuri royal heritage, bamboo and cane artistry, classical music patronages.",
    food: "Mui Borok (fermented fish Berma), Chakhwi, Mosdeng Serma.",
    img: "assets/images/ujjayantapalace.png",
    badge: "Royal Water Palace"
  },
  {
    id: "darjeeling",
    name: "Darjeeling Tea Crest",
    state: "West Bengal",
    region: "northeast",
    regionName: "North East",
    category: "mountains",
    coords: [27.0410, 88.2663],
    altitude: "6,700 – 8,482 ft",
    bestSeason: "Mar – May & Oct – Dec",
    highlights: ["Himalayan Toy Train (UNESCO)", "Tiger Hill Kanchenjunga Sunrise", "Makaibari Organic Tea Estates"],
    desc: "The Queen of the Hills, renowned for heritage narrow-gauge steam trains and world-famous champagne orthodox black teas.",
    culture: "Tea estate worker cooperatives, colonial hill station legacy, Sherpa climbing history.",
    food: "Darjeeling Momos, Thukpa, Churpee soup, Fresh Single-Estate First Flush Tea.",
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=700&q=80",
    badge: "Queen of the Hills"
  },

  // ─── WEST & CENTRAL ───
  {
    id: "jaipur",
    name: "Jaipur Pink City",
    state: "Rajasthan",
    region: "west-central",
    regionName: "West & Central",
    category: "heritage",
    coords: [26.9124, 75.7873],
    altitude: "1,417 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Amber Fort Ramparts", "Hawa Mahal Palace of Winds", "Jantar Mantar Sundial", "City Palace"],
    desc: "UNESCO World Heritage royal capital with terracotta pink facades, monumental hilltop forts, and geometric astronomical observatories.",
    culture: "Rajput chivalric lore, block-printing, blue pottery, Kalbelia folk dance.",
    food: "Dal Baati Churma, Ker Sangri, Pyaaz Kachori, Ghevar.",
    img: "https://images.unsplash.com/photo-1600100397608-f010e42a981c?auto=format&fit=crop&w=700&q=80",
    badge: "UNESCO Pink City"
  },
  {
    id: "jaisalmer",
    name: "Jaisalmer Golden Fortress",
    state: "Rajasthan",
    region: "west-central",
    regionName: "West & Central",
    category: "heritage",
    coords: [26.9157, 70.9083],
    altitude: "738 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Sonar Qila Living Fort", "Sam Sand Dune Camel Safaris", "Patwon Ki Haveli", "Desert National Park"],
    desc: "Golden sandstone fortress rising majestically from the Thar Desert sands, alive with resident artisans, havelis, and desert musicians.",
    culture: "Manganiyar musical tradition, desert camel caravans, mirror embroidery.",
    food: "Gatte ki Sabzi, Laal Maas, Ker Sangri, Makhania Lassi.",
    img: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=80",
    badge: "Living Desert Fortress"
  },
  {
    id: "udaipur",
    name: "Udaipur City of Lakes",
    state: "Rajasthan",
    region: "west-central",
    regionName: "West & Central",
    category: "heritage",
    coords: [24.5854, 73.7125],
    altitude: "1,962 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Lake Pichola Boat Cruise", "City Palace Complex", "Jag Mandir Island", "Sajjangarh Monsoon Palace"],
    desc: "Romantic Venice of the East with ornate marble palaces reflected in shimmering blue waters under the Aravali ranges.",
    culture: "Mewari royal art, miniature paintings, puppet theater, lake conservation.",
    food: "Dal Baati, Banjara Gosht, Mirchi Bada, Mewari Kadhi.",
    img: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=700&q=80",
    badge: "Royal Lake Capital"
  },
  {
    id: "rannofkutch",
    name: "Rann of Kutch White Desert",
    state: "Gujarat",
    region: "west-central",
    regionName: "West & Central",
    category: "nature",
    coords: [23.7337, 69.8597],
    altitude: "30 ft",
    bestSeason: "Nov – Feb",
    highlights: ["Endless White Salt Marsh", "Full Moon Night Mirage", "Rogan Art of Nirona", "Wild Ass Sanctuary"],
    desc: "One of the largest seasonal salt deserts in the world, glowing supernatural silver under moonlit nights.",
    culture: "Kutchi master weavers, Rogan fabric painting, Rabari pastoral nomads.",
    food: "Kutchi Dabeli, Khichdi Kadhi, Bajra Rotla with white butter and jaggery.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80",
    badge: "White Salt Desert"
  },
  {
    id: "gir",
    name: "Gir Asiatic Lion Sanctuary",
    state: "Gujarat",
    region: "west-central",
    regionName: "West & Central",
    category: "nature",
    coords: [21.1243, 70.8242],
    altitude: "450 ft",
    bestSeason: "Dec – Mar",
    highlights: ["Asiatic Lion in the Wild", "Kamleshwar Reservoir", "Maldhari Tribe Coexistence"],
    desc: "The only place on Earth where the magnificent Asiatic lion roams free in protected dry deciduous teak forests.",
    culture: "Maldhari pastoralist co-existence with apex predators, forest folklore.",
    food: "Kathiyawadi Thali, Ringna No Oro (roasted eggplant), Sev Tameta Nu Shaak.",
    img: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=700&q=80",
    badge: "Asiatic Lion Domain"
  },
  {
    id: "khajuraho",
    name: "Khajuraho Sandstone Marvels",
    state: "Madhya Pradesh",
    region: "west-central",
    regionName: "West & Central",
    category: "heritage",
    coords: [24.8318, 79.9199],
    altitude: "930 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Kandariya Mahadeva Temple", "Intricate Chandela Sculptures", "Sound & Light Spectacle"],
    desc: "UNESCO World Heritage temple cluster celebrated globally for extraordinary sandstone craftsmanship and cosmic dance.",
    culture: "Chandela classical architecture, Khajuraho dance festival, Bundeli folk art.",
    food: "Bhutte Ka Kees, Dal Bafla, Poha Jalebi, Mawa Bati.",
    img: "assets/images/khajuraho.png",
    badge: "UNESCO Sandstone Jewel"
  },
  {
    id: "bastar",
    name: "Bastar Chitrakote Falls",
    state: "Chhattisgarh",
    region: "west-central",
    regionName: "West & Central",
    category: "nature",
    coords: [19.2018, 81.7014],
    altitude: "1,800 ft",
    bestSeason: "Jul – Feb",
    highlights: ["Niagara of India Horseshoe Drop", "Indravati River Canyons", "Bastar Dhokra Bronze Casting"],
    desc: "India's widest waterfall plunging 300 meters across a horseshoe granite rim into virgin tribal forest reserves.",
    culture: "Ancient Gond & Maria tribal customs, 4000-year lost-wax bronze metalcraft.",
    food: "Chila rice pancakes, Muthia dumplings, Mahua flower delicacies.",
    img: "assets/images/bastar.png",
    badge: "Niagara of India"
  },
  {
    id: "varanasi",
    name: "Varanasi Sacred Ghats",
    state: "Uttar Pradesh",
    region: "west-central",
    regionName: "West & Central",
    category: "heritage",
    coords: [25.3176, 82.9739],
    altitude: "260 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Dashashwamedh Evening Aarti", "Sunrise Boat Cruise", "Kashi Vishwanath Corridor", "Sarnath Deer Park"],
    desc: "One of the oldest continuously inhabited cities on Earth, where 84 stone ghats meet the sacred Ganges under temple bells.",
    culture: "Timeless spiritual traditions, Banarasi brocade silk weaving, classical Hindustani music.",
    food: "Banarasi Kachori Sabzi, Malaiyo winter froth, Tamatar Chaat, Banarasi Paan.",
    img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=700&q=80",
    badge: "Oldest Living City"
  },
  {
    id: "mumbai",
    name: "Mumbai Marine Promenade",
    state: "Maharashtra",
    region: "west-central",
    regionName: "West & Central",
    category: "coastal",
    coords: [18.9220, 72.8347],
    altitude: "46 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Gateway of India", "Marine Drive Queen's Necklace", "Elephanta Island Caves", "Kala Ghoda Art Precinct"],
    desc: "India's financial and cultural powerhouse, curving around the Arabian Sea with Victorian Gothic and Art Deco grandeur.",
    culture: "Dynamic metropolis energy, Bollywood cinema roots, Koli fishing community heritage.",
    food: "Vada Pav, Pav Bhaji, Bombay Duck fry, Coastal Koli fish curry.",
    img: "assets/images/mumbai.png",
    badge: "Arabian Sea Hub"
  },
  {
    id: "ajanta",
    name: "Ajanta & Ellora Monolithic Caves",
    state: "Maharashtra",
    region: "west-central",
    regionName: "West & Central",
    category: "heritage",
    coords: [20.5519, 75.7033],
    altitude: "1,800 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Kailash Temple Carved from Single Rock", "Ajanta Fresco Murals", "34 Rock-Cut Cave Monasteries"],
    desc: "The pinnacle of rock-cut architecture, where the colossal Kailash temple was carved top-down from a single basalt cliff.",
    culture: "Buddhist, Hindu, and Jain harmony, ancient mineral pigment frescoes.",
    food: "Misal Pav, Pithla Bhakri, Aurangabad Naan Qalia, Puran Poli.",
    img: "https://images.unsplash.com/photo-1600100397608-f010e42a981c?auto=format&fit=crop&w=700&q=80",
    badge: "Monolithic Wonder"
  },
  {
    id: "daman",
    name: "Moti Daman Coastal Fort",
    state: "Daman & Diu",
    region: "west-central",
    regionName: "West & Central",
    category: "coastal",
    coords: [20.3974, 72.8328],
    altitude: "16 ft",
    bestSeason: "Oct – Mar",
    highlights: ["16th-Century Portuguese Ramparts", "Jampore Golden Beach", "Church of Bom Jesus"],
    desc: "Historic coastal fort enclave overlooking the Arabian Sea, flanked by black sand beaches and Portuguese baroque churches.",
    culture: "Indo-Portuguese fusion culture, coastal maritime fortifications.",
    food: "Fresh Lobster Curry, Prawn Koliwada, Bebinca, Fish cutlets.",
    img: "assets/images/daman.png",
    badge: "Portuguese Seaside Fort"
  },
  {
    id: "hundru",
    name: "Hundru Falls Cascade",
    state: "Jharkhand",
    region: "west-central",
    regionName: "West & Central",
    category: "nature",
    coords: [23.4474, 85.6548],
    altitude: "2,140 ft",
    bestSeason: "Jul – Feb",
    highlights: ["320-ft Subarnarekha River Drop", "Carved Granite Rock Pools", "Plateau Forest Treks"],
    desc: "Spectacular 320-foot waterfall carving polished natural granite rock pools amidst the lush green Chota Nagpur Plateau.",
    culture: "Santhal tribal folklore, Dokra crafts, sacred sarna sal tree groves.",
    food: "Dhuska with Ghugni, Litti Chokha, Thekua, Bamboo shoot curry.",
    img: "assets/images/hundrufalls.png",
    badge: "Plateau Cascade"
  },
  {
    id: "sundarbans",
    name: "Sundarbans Mangrove Tiger Delta",
    state: "West Bengal",
    region: "west-central",
    regionName: "West & Central",
    category: "nature",
    coords: [21.9497, 89.1833],
    altitude: "10 ft",
    bestSeason: "Nov – Mar",
    highlights: ["Royal Bengal Tiger Boat Safari", "Tidal Mangrove Waterways", "Estuarine Crocodiles", "Sajnekhali Watchtower"],
    desc: "The world's largest coastal mangrove forest delta, accessible exclusively by silent electric boats through winding tidal channels.",
    culture: "Bonbibi mangrove goddess folklore, honey-gatherer courage, delta boat craftsmanship.",
    food: "Bhetki Macher Paturi, Chingri Malai Curry, Nolen Gur Sandesh.",
    img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80",
    badge: "UNESCO Mangrove Delta"
  },

  // ─── SOUTH & ISLANDS ───
  {
    id: "hampi",
    name: "Hampi UNESCO Boulder City",
    state: "Karnataka",
    region: "south-islands",
    regionName: "South & Islands",
    category: "heritage",
    coords: [15.3350, 76.4600],
    altitude: "1,530 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Stone Chariot & Vitthala Musical Pillars", "Virupaksha Temple", "Tungabhadra Coracle Rides", "Anjanadri Sunset"],
    desc: "Otherworldly landscape of golden giant boulders dotted with grand royal ruins of the 14th-century Vijayanagara Empire.",
    culture: "Vijayanagara classical architecture, coracle boating lore, rocky boulder climbing.",
    food: "Bisi Bele Bath, Davangere Benne Dosa, Mysore Pak, Filter Coffee.",
    img: "assets/images/hampi.png",
    badge: "UNESCO Boulder City"
  },
  {
    id: "hyderabad",
    name: "Hyderabad Charminar Heritage",
    state: "Telangana",
    region: "south-islands",
    regionName: "South & Islands",
    category: "heritage",
    coords: [17.3850, 78.4867],
    altitude: "1,778 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Monumental Charminar", "Golconda Acoustic Fortress", "Chowmahalla Royal Palace", "Laad Bazaar Pearls"],
    desc: "City of Pearls blending grand Qutb Shahi architecture, diamond fortress acoustics, and royal Nizami culinary traditions.",
    culture: "Nizami hospitality, Deccani art, Bidri silver inlay craftsmanship.",
    food: "Hyderabadi Dum Biryani, Mirchi ka Salan, Double ka Meetha, Irani Chai with Osmania Biscuits.",
    img: "assets/images/hyderabad.png",
    badge: "City of Pearls"
  },
  {
    id: "visakhapatnam",
    name: "Visakhapatnam Coastal Ghats",
    state: "Andhra Pradesh",
    region: "south-islands",
    regionName: "South & Islands",
    category: "coastal",
    coords: [17.6868, 83.2185],
    altitude: "148 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Kailasagiri Hilltop Bay Views", "Submarine Museum on the Beach", "Rushikonda Blue Flag Beach", "Araku Valley Handoff"],
    desc: "Dynamic port city where the Eastern Ghat mountains drop directly into the turquoise surf of the Bay of Bengal.",
    culture: "Andhra coastal maritime traditions, Kondapalli wooden toys, Buddhist Thotlakonda ruins.",
    food: "Royyala Vepudu (spicy prawn fry), Gongura Mamsam, Pesarattu with Allam Pachadi.",
    img: "assets/images/visakhapatnam.png",
    badge: "Coastal Ghat Jewel"
  },
  {
    id: "goa",
    name: "Goa Coast & Spice Trails",
    state: "Goa",
    region: "south-islands",
    regionName: "South & Islands",
    category: "coastal",
    coords: [15.2993, 74.1240],
    altitude: "Sea level",
    bestSeason: "Nov – Feb",
    highlights: ["Palolem Crescent Bay", "Old Goa UNESCO Basílicas", "Dudhsagar Jungle Waterfalls", "Fontainhas Latin Quarter"],
    desc: "Pristine sandy shores, fragrant spice estates, eco-kayaking through backwaters, and colorful Portuguese colonial villas.",
    culture: "Konkani-Portuguese synthesis, brass fado music, sustainable beach shacks.",
    food: "Goan Fish Curry Thali, Chicken Xacuti, Pork Vindaloo, Traditional Bebinca.",
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80",
    badge: "Coastal & Heritage"
  },
  {
    id: "munnar",
    name: "Munnar Nilgiri Highlands",
    state: "Kerala",
    region: "south-islands",
    regionName: "South & Islands",
    category: "mountains",
    coords: [10.0889, 77.0595],
    altitude: "5,200 – 8,842 ft",
    bestSeason: "Sep – May",
    highlights: ["Anamudi Peak (Highest South Peak)", "Eravikulam Nilgiri Tahr", "Mattupetty Dam", "Organic Tea Estates"],
    desc: "Undulating emerald carpets of mist-bathed tea hills and shola forests, sanctuary of the endangered Nilgiri Tahr.",
    culture: "Highland tea farming communities, indigenous Muthuvan tribal knowledge.",
    food: "Appam with Vegetable Stew, Puttu with Kadala Curry, Ela Sadya, Cardamom Tea.",
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80",
    badge: "Emerald Tea Crest"
  },
  {
    id: "alleppey",
    name: "Alleppey Backwaters & Vembanad",
    state: "Kerala",
    region: "south-islands",
    regionName: "South & Islands",
    category: "coastal",
    coords: [9.4981, 76.3388],
    altitude: "Sea level",
    bestSeason: "Oct – Mar",
    highlights: ["Solar Eco-Houseboats", "Vembanad Lake", "Kuttanad Below-Sea Level Farms", "Village Canoe Canals"],
    desc: "Tranquil green labyrinth of palm-fringed lagoons, lotus canals, and solar-powered traditional wooden houseboats.",
    culture: "Nehru Trophy snake boat races, Kathakali dance, coir rope making.",
    food: "Karimeen Pollichathu (pearl spot in banana leaf), Kerala Sadya, Kappa with Fish Curry.",
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80",
    badge: "Backwater Capital"
  },
  {
    id: "mahabalipuram",
    name: "Mahabalipuram Shore Temples",
    state: "Tamil Nadu",
    region: "south-islands",
    regionName: "South & Islands",
    category: "heritage",
    coords: [12.6269, 80.1928],
    altitude: "40 ft",
    bestSeason: "Oct – Mar",
    highlights: ["Shore Temple Against the Waves", "Arjuna's Penance Bas-Relief", "Five Rathas Monoliths"],
    desc: "7th-century Pallava coastal sanctuary featuring monolithic rock temples that have stood resilient against Bay of Bengal waves for 1,300 years.",
    culture: "Traditional stone sculptors' guild, Dravidian temple art, Bharatanatyam.",
    food: "Crisp Medu Vada, Masala Dosa, Sambar, Filter Coffee, Coastal Prawn Roast.",
    img: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=700&q=80",
    badge: "UNESCO Coastal Stone"
  },
  {
    id: "puducherry",
    name: "Pondicherry French Quarter",
    state: "Puducherry",
    region: "south-islands",
    regionName: "South & Islands",
    category: "coastal",
    coords: [11.9416, 79.8083],
    altitude: "10 ft",
    bestSeason: "Oct – Mar",
    highlights: ["White Town French Colonial Mansions", "Rock Beach Promenade", "Auroville Matrimandir", "Bicycle Heritage Tours"],
    desc: "Charming coastal enclave where mustard-yellow French colonial villas and bougainvillea lanes meet peaceful Bay of Bengal waves.",
    culture: "Franco-Tamil synthesis, yoga and integral philosophy, artisanal ceramic studios.",
    food: "Croissants, Quiche, Baguettes, Creole Curry, Filter Coffee.",
    img: "assets/images/whitetown.png",
    badge: "French Heritage Quarter"
  },
  {
    id: "swarajdeep",
    name: "Swaraj Dweep (Havelock)",
    state: "Andaman & Nicobar",
    region: "south-islands",
    regionName: "South & Islands",
    category: "coastal",
    coords: [11.9761, 92.9876],
    altitude: "30 ft",
    bestSeason: "Oct – May",
    highlights: ["Radhanagar Beach (Asia's Best)", "Elephant Beach Coral Reefs", "Bio-Luminescent Night Kayaking"],
    desc: "Virgin tropical island in the Bay of Bengal with powdery white sands, electric turquoise waters, and bioluminescent mangroves.",
    culture: "Island indigenous marine stewardship, scuba conservation trails.",
    food: "Grilled Lobster, Coconut Prawn Curry, Fresh Tender Coconut Water.",
    img: "assets/images/swarajdeep.png",
    badge: "Coral Island Atoll"
  },
  {
    id: "kavaratti",
    name: "Kavaratti Coral Lagoon",
    state: "Lakshadweep",
    region: "south-islands",
    regionName: "South & Islands",
    category: "coastal",
    coords: [10.5669, 72.6420],
    altitude: "10 ft",
    bestSeason: "Oct – Apr",
    highlights: ["Crystal Clear Coral Atoll", "Marine Aquarium Sanctuary", "Scuba Diving & Snorkeling Trails"],
    desc: "Pure white sand atoll surrounded by warm turquoise lagoons, teeming with vibrant coral reefs and protected sea turtles.",
    culture: "Lakshadweep maritime traditions, island coir crafts, zero-plastic eco regulations.",
    food: "Tuna Fish Curry, Rayereha, Kilanji rice crepes, Coconut sweets.",
    img: "assets/images/kavaratti.png",
    badge: "Eco Marine Sanctuary"
  }
];


// ═══════════════════════════════════════════════════════
//  MAP RUNTIME GLOBALS & CONSTANTS
// ═══════════════════════════════════════════════════════

const DEFAULT_MAP_CENTER = [22.8, 79.6];
const DEFAULT_MAP_ZOOM = 5;

let leafletMap = null;
let resetControlBtn = null;
let hotspotMarkersLayer = null;
let hotspotMarkersMap = {};
let stateGeoJsonLayer = null;

const stateColorPalette = {
  // Northern & Himalayan states (Warm Saffron / Coral / Terracotta)
  "Jammu and Kashmir": "#e76f51",
  "Himachal Pradesh": "#f4a261",
  "Punjab": "#ff9f1c",
  "Uttarakhand": "#ff7849",
  "Uttaranchal": "#ff7849",
  "Haryana": "#e9c46a",
  "Delhi": "#ffb703",
  "Chandigarh": "#ff9f1c",

  // Western & Central states (Golden Amber / Sunset / Rust)
  "Rajasthan": "#f39c12",
  "Gujarat": "#e67e22",
  "Madhya Pradesh": "#d35400",
  "Maharashtra": "#c0392b",
  "Goa": "#e74c3c",
  "Daman and Diu": "#e67e22",
  "Dadra and Nagar Haveli": "#e67e22",
  "Chhattisgarh": "#d97706",
  "Jharkhand": "#b45309",
  "Bihar": "#92400e",
  "Uttar Pradesh": "#ea580c",

  // North Eastern states (Lush Emerald / Mint / Jade / Forest)
  "Sikkim": "#2a9d8f",
  "Assam": "#06d6a0",
  "Arunachal Pradesh": "#1b9aaa",
  "Meghalaya": "#38b000",
  "Manipur": "#0096c7",
  "Mizoram": "#52b788",
  "Nagaland": "#40916c",
  "Tripura": "#74c69d",
  "West Bengal": "#16a34a",
  "Orissa": "#0d9488",

  // Southern & Island states (Ocean Azure / Sapphire / Marine Turquoise)
  "Karnataka": "#00b4d8",
  "Kerala": "#0077b6",
  "Tamil Nadu": "#023e8a",
  "Andhra Pradesh": "#48cae4",
  "Telangana": "#0096c7",
  "Puducherry": "#00b4d8",
  "Andaman and Nicobar": "#0077b6",
  "Lakshadweep": "#00b4d8"
};

function getStateStyle(feature) {
  const name = feature.properties.name || "";
  const color = stateColorPalette[name] || "#3a86ff";
  return {
    fillColor: color,
    weight: 1.8,
    opacity: 0.95,
    color: "#ffffff", // Crisp white administrative boundary
    dashArray: "3, 4",
    fillOpacity: 0.22 // Translucent vibrant tint
  };
}

function onEachStateFeature(feature, layer) {
  const stateName = feature.properties.name || "State";
  const stateHotspots = indiaHotspots.filter(h => 
    h.state.toLowerCase() === stateName.toLowerCase() ||
    stateName.toLowerCase().includes(h.state.toLowerCase())
  );

  layer.on({
    mouseover: function (e) {
      const target = e.target;
      target.setStyle({
        weight: 3.2,
        color: "#ffb703", // Radiant gold glow on hover
        dashArray: "",
        fillOpacity: 0.44
      });
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        target.bringToFront();
      }
      if (hotspotMarkersLayer) hotspotMarkersLayer.bringToFront();
    },
    mouseout: function (e) {
      if (stateGeoJsonLayer) {
        stateGeoJsonLayer.resetStyle(e.target);
      }
    },
    click: function (e) {
      leafletMap.fitBounds(e.target.getBounds(), {
        padding: [30, 30],
        maxZoom: 8
      });
      if (resetControlBtn) resetControlBtn.classList.add("visible");
      statePanel(stateName);
      toast(`Inspecting ${stateName} (${stateHotspots.length} featured corridors).`);
    }
  });

  layer.bindTooltip(`<b>${stateName}</b>${stateHotspots.length ? ` • <span style="color:#ffb703;">${stateHotspots.length} Hotspots</span>` : ''}`, {
    sticky: true,
    direction: "auto",
    className: "state-boundary-tooltip"
  });
}

async function loadStateBoundaries() {
  if (!leafletMap) return;
  try {
    const res = await fetch("assets/data/india_states.geojson");
    if (!res.ok) throw new Error("Status " + res.status);
    const geoData = await res.json();

    if (stateGeoJsonLayer) {
      leafletMap.removeLayer(stateGeoJsonLayer);
    }

    stateGeoJsonLayer = L.geoJSON(geoData, {
      style: getStateStyle,
      onEachFeature: onEachStateFeature
    }).addTo(leafletMap);

    // Keep markers above polygon fills
    if (hotspotMarkersLayer) {
      hotspotMarkersLayer.bringToFront();
    }
    console.log(`[Map] Rendered ${geoData.features.length} colorful state & administrative boundaries.`);
  } catch (err) {
    console.warn("[Map] Could not load state boundaries GeoJSON:", err.message);
  }
}

function getCategoryEmoji(cat) {
  const map = {
    mountains: "🏔️",
    heritage: "🏛️",
    nature: "🌿",
    coastal: "🏖️",
    culture: "🎭"
  };
  return map[cat] || "📍";
}

function createHotspotHoverCard(h) {
  return `
    <div class="map-hover-card-inner" data-hotspot-id="${h.id}">
      <div class="map-card-banner" style="background-image: url('${h.img}')">
        <div class="map-card-banner-top">
          <span class="map-card-badge ${h.category}">${getCategoryEmoji(h.category)} ${h.badge || h.category}</span>
          <span class="map-card-alt">${h.altitude}</span>
        </div>
      </div>
      <div class="map-card-content">
        <div class="map-card-header">
          <h4 class="map-card-title">${h.name}</h4>
          <div class="map-card-sub">📍 ${h.state} • ${h.regionName}</div>
        </div>
        <p class="map-card-desc">${h.desc}</p>
        <div class="map-card-tags">
          ${h.highlights.slice(0, 3).map(tag => `<span class="map-tag">${tag}</span>`).join("")}
        </div>
        <div class="map-card-footer">
          <div class="map-card-season">Best: <b>${h.bestSeason}</b></div>
          <div class="map-card-actions">
            <button class="map-btn-action detail" onclick="focusHotspot('${h.id}')" title="Inspect Full Dossier">Details →</button>
            <button class="map-btn-action plan" onclick="planHotspot('${h.name}')" title="Generate AI Itinerary">Plan Trip ✦</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function resetMapView() {
  if (!leafletMap) return;
  try {
    leafletMap.flyToBounds([[7.5, 68.0], [35.8, 97.5]], {
      padding: [25, 25],
      duration: 1.1
    });
  } catch (e) {
    leafletMap.flyTo(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, { duration: 1.0 });
  }
  if (resetControlBtn) resetControlBtn.classList.remove("visible");
  const panel = $("#statePanel");
  if (panel) {
    panel.innerHTML = `
      <p class="eyebrow">SELECT A REGION</p>
      <h3>Discover India</h3>
      <p>Hover over any pulse marker on the map to preview interactive cards, or click to inspect full regional telemetry and connect immediately to the Smart Itinerary Planner.</p>
    `;
  }
}

function focusHotspot(id) {
  const h = indiaHotspots.find(x => x.id === id || x.name.toLowerCase() === id.toLowerCase() || x.state.toLowerCase() === id.toLowerCase());
  if (!h) return;

  const marker = hotspotMarkersMap[h.id];

  if (leafletMap) {
    // Dismiss any active tooltip before flight to prevent visual jitter
    closeActiveTooltip(true);

    leafletMap.flyTo(h.coords, 8, { duration: 0.95 });
    if (resetControlBtn) resetControlBtn.classList.add("visible");

    // Once flight finishes, display card and auto-pan if needed so it is never cut off
    leafletMap.once('moveend', () => {
      if (marker) {
        displayHotspotCard(marker, h, true);
      }
    });
  }

  renderHotspotInPanel(h);

  // Mobile smooth view scroll if needed
  if (window.innerWidth < 900) {
    const panel = $("#statePanel");
    if (panel) panel.scrollIntoView({ behavior: "smooth" });
  }
}

function planHotspot(destinationName) {
  loadStateIntoPlanner(destinationName);
}

// Make accessible to inline HTML button onclicks in Leaflet tooltips
window.focusHotspot = focusHotspot;
let currentActivePanelTarget = null;

function renderHotspotInPanel(h) {
  currentActivePanelTarget = { type: 'hotspot', data: h };
  const panel = $("#statePanel");
  if (!panel) return;

  const lang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";
  const lblHighlights = lang === "hi" ? "मुख्य आकर्षण:" : lang === "bn" ? "প্রধান আকর্ষণ:" : "Highlights:";
  const lblOverview = lang === "hi" ? "अवलोकन:" : lang === "bn" ? "সংক্ষিপ্ত বিবরণ:" : "Overview:";
  const lblCulture = lang === "hi" ? "सजीव संस्कृति:" : lang === "bn" ? "জীবন্ত সংস্কৃতি:" : "Living Culture:";
  const lblFood = lang === "hi" ? "स्थानीय स्वाद:" : lang === "bn" ? "স্থানীয় স্বাদ:" : "Local Zero-Mile Flavors:";
  const btnPlanText = lang === "hi" ? `योजना बनाएं (${h.name}) →` : lang === "bn" ? `ভ্রমণ পরিকল্পনা (${h.name}) →` : `Plan Itinerary for ${h.name} →`;
  const btnResetText = lang === "hi" ? "↺ संपूर्ण मानचित्र" : lang === "bn" ? "↺ সমগ্র মানচিত্র" : "↺ Overview Map";

  panel.innerHTML = `
    <div class="state-panel-header-img" style="background-image: url('${h.img}')"></div>
    <p class="eyebrow">${(h.state || "INDIA").toUpperCase()} • ${(h.badge || "REGIONAL NODE").toUpperCase()}</p>
    <h3>${h.name}</h3>
    <div class="panel-pills">
      <span class="panel-pill">📍 ${h.state}</span>
      <span class="panel-pill">🏔️ ${h.altitude}</span>
      <span class="panel-pill">🗓️ ${h.bestSeason}</span>
      <span class="panel-pill">🌿 ${h.regionName}</span>
    </div>
    <p><b>${lblHighlights}</b> ${h.highlights.join(" • ")}</p>
    <p><b>${lblOverview}</b> ${h.desc}</p>
    <p><b>${lblCulture}</b> ${h.culture || "Traditional community homestays, local craft preservation, and sustainable cultural stewardship."}</p>
    <p><b>${lblFood}</b> ${h.food || "Authentic regional heritage cuisine crafted with locally grown organic seasonal ingredients."}</p>
    <div style="display:flex; gap:10px; margin-top:20px; flex-wrap:wrap;">
      <button class="btn primary" style="padding:9px 18px; font-size:13px;" onclick="loadStateIntoPlanner('${h.name}')">
        ${btnPlanText}
      </button>
      <button class="map-reset-btn" onclick="resetMapView()">${btnResetText}</button>
    </div>
  `;
}

function statePanel(name) {
  // Check if it's one of the rich hotspots
  const h = indiaHotspots.find(x => 
    x.id === name.toLowerCase() || 
    x.name.toLowerCase().includes(name.toLowerCase()) || 
    x.state.toLowerCase() === name.toLowerCase()
  );
  if (h) {
    renderHotspotInPanel(h);
    return;
  }

  // Fallback to legacy states dictionary
  const s = states[name];
  const panel = $("#statePanel");
  if (!s || !panel) return;

  currentActivePanelTarget = { type: 'state', data: name };
  const lang = (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en";
  const lblCap = lang === "hi" ? "राजधानी:" : lang === "bn" ? "রাজধানী:" : "Capital:";
  const lblAlt = lang === "hi" ? "ऊंचाई:" : lang === "bn" ? "উচ্চতা:" : "Altitude:";
  const lblSeason = lang === "hi" ? "मुख्य मौसम:" : lang === "bn" ? "প্রধান ঋতু:" : "Prime Season:";
  const lblHighlights = lang === "hi" ? "मुख्य आकर्षण:" : lang === "bn" ? "প্রধান আকর্ষণ:" : "Highlights:";
  const lblExp = lang === "hi" ? "प्रमुख अनुभव:" : lang === "bn" ? "বিশেষ অভিজ্ঞতা:" : "Signature Experiences:";
  const lblCulture = lang === "hi" ? "सजीव संस्कृति:" : lang === "bn" ? "জীবন্ত সংস্কৃতি:" : "Living Culture:";
  const lblFood = lang === "hi" ? "स्थानीय स्वाद:" : lang === "bn" ? "স্থানীয় খাদ্য:" : "Local Flavors:";
  const btnPlanText = lang === "hi" ? `योजना बनाएं (${name}) →` : lang === "bn" ? `ভ্রমণ পরিকল্পনা (${name}) →` : `Plan Itinerary for ${name} →`;
  const btnResetText = lang === "hi" ? "↺ संपूर्ण मानचित्र" : lang === "bn" ? "↺ সমগ্র মানচিত্র" : "↺ Overview Map";

  panel.innerHTML = `
    <p class="eyebrow">${name.toUpperCase()}</p>
    <h3>${name}</h3>
    <p><b>${lblCap}</b> ${s.capital} • <b>${lblAlt}</b> ${s.altitude || "Variable"}</p>
    <p><b>${lblSeason}</b> ${s.season}</p>
    <p><b>${lblHighlights}</b> ${s.top.join(" • ")}</p>
    <p><b>${lblExp}</b> ${s.exp}</p>
    <p><b>${lblCulture}</b> ${s.culture}</p>
    <p><b>${lblFood}</b> ${s.food}</p>
    <div style="display:flex; gap:10px; margin-top:20px; flex-wrap:wrap;">
      <button class="btn primary" style="padding:9px 18px; font-size:13px;" onclick="loadStateIntoPlanner('${name}')">
        ${btnPlanText}
      </button>
      <button class="map-reset-btn" onclick="resetMapView()">${btnResetText}</button>
    </div>
  `;
}

window.addEventListener("bharat-lang-changed", () => {
  if (currentActivePanelTarget) {
    if (currentActivePanelTarget.type === 'hotspot') {
      renderHotspotInPanel(currentActivePanelTarget.data);
    } else if (currentActivePanelTarget.type === 'state') {
      statePanel(currentActivePanelTarget.data);
    }
  }
});

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

function filterMapHotspots(category) {
  if (!leafletMap || !hotspotMarkersLayer) return;

  hotspotMarkersLayer.clearLayers();

  const filtered = category === "all"
    ? indiaHotspots
    : indiaHotspots.filter(h => h.category === category);

  filtered.forEach(h => {
    if (hotspotMarkersMap[h.id]) {
      hotspotMarkersLayer.addLayer(hotspotMarkersMap[h.id]);
    }
  });

  // Keep markers above state polygons
  if (hotspotMarkersLayer) hotspotMarkersLayer.bringToFront();

  const catNames = {
    all: "all Indian hotspots",
    mountains: "High Passes & Peaks",
    heritage: "UNESCO Heritage & Living Culture",
    nature: "Wildlife & Biospheres",
    coastal: "Coastal & Coral Islands"
  };

  toast(`Map filtered to ${catNames[category] || category} (${filtered.length} nodes).`);
}

// --- Hotspot Card Manager (Single-Active, Zero-Jitter, Auto-Pan Prevention) ---
let currentActiveMarker = null;
let cardDismissTimer = null;
let isPointerInsideCard = false;

function closeActiveTooltip(immediate = false) {
  clearTimeout(cardDismissTimer);
  cardDismissTimer = null;
  if (!currentActiveMarker) return;

  if (immediate) {
    currentActiveMarker.closeTooltip();
    currentActiveMarker = null;
    isPointerInsideCard = false;
  } else {
    cardDismissTimer = setTimeout(() => {
      if (!isPointerInsideCard && currentActiveMarker) {
        currentActiveMarker.closeTooltip();
        currentActiveMarker = null;
      }
    }, 170);
  }
}

function calculateOptimalPlacement(marker, h) {
  if (!leafletMap) return { dir: "top", offset: [0, -14] };
  const isMega = h.id === "ladakh" || h.id === "hanle" || h.id === "jaipur" || h.id === "varanasi" || h.id === "hampi";

  try {
    const pt = leafletMap.latLngToContainerPoint(h.coords);
    const sz = leafletMap.getSize();

    // Actual card bounding box footprint: 290px width, ~235px height
    const cardH = 235;
    const cardW = 290;

    const spaceTop = pt.y;
    const spaceBottom = sz.y - pt.y;
    const spaceLeft = pt.x;
    const spaceRight = sz.x - pt.x;

    // 1. If plenty of room on top, open top
    if (spaceTop >= cardH + 20) {
      return { dir: "top", offset: [0, isMega ? -16 : -13] };
    }
    // 2. If room on bottom, open bottom
    if (spaceBottom >= cardH + 20) {
      return { dir: "bottom", offset: [0, isMega ? 16 : 13] };
    }
    // 3. If vertical space is tight (zoomed in near top/bottom edge), check horizontal
    if (spaceRight >= cardW + 20) {
      return { dir: "right", offset: [isMega ? 16 : 13, 0] };
    }
    if (spaceLeft >= cardW + 20) {
      return { dir: "left", offset: [isMega ? -16 : -13, 0] };
    }

    // 4. Otherwise choose whichever direction has the maximum clearance
    const candidates = [
      { dir: "top", space: spaceTop, offset: [0, isMega ? -16 : -13] },
      { dir: "bottom", space: spaceBottom, offset: [0, isMega ? 16 : 13] },
      { dir: "right", space: spaceRight, offset: [isMega ? 16 : 13, 0] },
      { dir: "left", space: spaceLeft, offset: [isMega ? -16 : -13, 0] }
    ];
    candidates.sort((a, b) => b.space - a.space);
    return { dir: candidates[0].dir, offset: candidates[0].offset };
  } catch (e) {
    return { dir: "top", offset: [0, -14] };
  }
}

function ensureCardFullyInView(tooltipEl) {
  if (!leafletMap || !tooltipEl) return;
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const mapRect = mapEl.getBoundingClientRect();
  const cardRect = tooltipEl.getBoundingClientRect();
  const PADDING = 18;

  let panX = 0;
  let panY = 0;

  // Check top cutoff
  if (cardRect.top < mapRect.top + PADDING) {
    panY = cardRect.top - (mapRect.top + PADDING);
  } else if (cardRect.bottom > mapRect.bottom - PADDING) {
    // Check bottom cutoff
    panY = cardRect.bottom - (mapRect.bottom - PADDING);
  }

  // Check left cutoff
  if (cardRect.left < mapRect.left + PADDING) {
    panX = cardRect.left - (mapRect.left + PADDING);
  } else if (cardRect.right > mapRect.right - PADDING) {
    // Check right cutoff
    panX = cardRect.right - (mapRect.right - PADDING);
  }

  if (Math.abs(panX) > 2 || Math.abs(panY) > 2) {
    leafletMap.panBy([panX, panY], { animate: true, duration: 0.28 });
  }
}

function displayHotspotCard(marker, h, autoPan = true) {
  if (!marker) return;
  clearTimeout(cardDismissTimer);
  cardDismissTimer = null;

  // Mutual exclusion: Immediately close previous card so multiple cards never overlap or jitter
  if (currentActiveMarker && currentActiveMarker !== marker) {
    currentActiveMarker.closeTooltip();
  }

  currentActiveMarker = marker;

  const placement = calculateOptimalPlacement(marker, h);
  const tt = marker.getTooltip();
  if (tt) {
    tt.options.direction = placement.dir;
    tt.options.offset = placement.offset;
    if (tt._container) {
      tt._container.className = `leaflet-tooltip leaflet-zoom-animated leaflet-tooltip-${placement.dir} map-hover-card cat-${h.category}`;
    }
  }

  marker.openTooltip();
  renderHotspotInPanel(h);

  if (autoPan) {
    requestAnimationFrame(() => {
      const tooltipElement = marker.getTooltip() ? marker.getTooltip().getElement() : null;
      if (tooltipElement) {
        ensureCardFullyInView(tooltipElement);
      }
    });
  }
}

function initMap() {
  const mapContainer = document.getElementById("map");
  if (typeof L === "undefined" || !mapContainer) return;

  // Safe Leaflet cleanup to prevent "Map container is already initialized" error
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }
  mapContainer.innerHTML = "";

  leafletMap = L.map(mapContainer, {
    scrollWheelZoom: false,
    zoomControl: true,
    zoomSnap: 0.25,
    minZoom: 3.5,
    maxZoom: 14
  }).setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);

  // Dynamic CARTO Basemap API Configuration
  const getCartoApiKey = () => {
    const raw = (
      (typeof window !== "undefined" && window.CARTO_API_KEY) ||
      (typeof window !== "undefined" && window.ENV && window.ENV.CARTO_API_KEY) ||
      (typeof process !== "undefined" && process.env && process.env.CARTO_API_KEY) ||
      ""
    ).trim();
    return (raw && raw !== "YOUR_CARTO_API_KEY_HERE") ? raw : "";
  };

  let cartoApiKey = getCartoApiKey();

  const buildCartoTileUrl = (key) => {
    const baseUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    const cleanKey = (key || '').trim();
    if (cleanKey && cleanKey !== "YOUR_CARTO_API_KEY_HERE") {
      // CARTO Basemaps requires the 'key' query parameter to remove the watermark (also accepts 'api_key')
      return `${baseUrl}?key=${encodeURIComponent(cleanKey)}&api_key=${encodeURIComponent(cleanKey)}`;
    }
    return baseUrl;
  };

  // CartoDB Voyager Tile Layer: vivid colors, crisp country and state borders with dynamic API key parameters
  const voyagerTileLayer = L.tileLayer(buildCartoTileUrl(cartoApiKey), {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(leafletMap);

  const applyResolvedCartoKey = (resolvedKey) => {
    const clean = (resolvedKey || '').trim();
    if (clean && clean !== "YOUR_CARTO_API_KEY_HERE") {
      cartoApiKey = clean;
      if (typeof window !== "undefined") window.CARTO_API_KEY = clean;
      const targetUrl = buildCartoTileUrl(clean);
      voyagerTileLayer.setUrl(targetUrl);
      if (typeof voyagerTileLayer.redraw === "function") {
        voyagerTileLayer.redraw();
      }
    }
  };

  // Always attempt to sync latest CARTO_API_KEY from backend server or local .env
  if (typeof fetch === "function") {
    fetch('/api/config')
      .then(res => res.ok ? res.json() : null)
      .then(config => {
        if (config && config.CARTO_API_KEY) {
          applyResolvedCartoKey(config.CARTO_API_KEY);
        }
      })
      .catch(() => {
        // Fallback for static servers: read .env directly
        fetch('.env')
          .then(res => res.ok ? res.text() : null)
          .then(txt => {
            if (txt) {
              const m = txt.match(/CARTO_API_KEY\s*=\s*([^\r\n#]+)/);
              if (m && m[1]) {
                applyResolvedCartoKey(m[1].trim());
              }
            }
          })
          .catch(() => {});
      });
  }

  voyagerTileLayer.on('tileerror', function () {
    console.warn("[Map] Retrying tile fetch...");
  });

  // Reset View Control
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

  // State Border Toggle Control Button
  const BorderToggleControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function () {
      const container = L.DomUtil.create('div', 'leaflet-bar map-layer-toggles');
      const btn = L.DomUtil.create('button', 'map-toggle-btn active', container);
      btn.innerHTML = '🗺️ State Borders: <b>ON</b>';
      btn.title = 'Toggle Colorful State & Administrative Boundaries';
      L.DomEvent.disableClickPropagation(btn);
      btn.onclick = function () {
        if (stateGeoJsonLayer) {
          if (leafletMap.hasLayer(stateGeoJsonLayer)) {
            leafletMap.removeLayer(stateGeoJsonLayer);
            btn.innerHTML = '🗺️ State Borders: <b>OFF</b>';
            btn.classList.remove('active');
            toast('State boundaries hidden.');
          } else {
            leafletMap.addLayer(stateGeoJsonLayer);
            btn.innerHTML = '🗺️ State Borders: <b>ON</b>';
            btn.classList.add('active');
            if (hotspotMarkersLayer) hotspotMarkersLayer.bringToFront();
            toast('Colorful state boundaries enabled.');
          }
        }
      };
      return container;
    }
  });
  leafletMap.addControl(new BorderToggleControl());

  // Create hotspot markers layer
  hotspotMarkersLayer = L.layerGroup().addTo(leafletMap);
  hotspotMarkersMap = {};

  indiaHotspots.forEach(h => {
    const isMega = h.id === "ladakh" || h.id === "hanle" || h.id === "jaipur" || h.id === "varanasi" || h.id === "hampi";
    const customIcon = L.divIcon({
      className: "hotspot-marker-wrapper",
      html: `
        <div class="hotspot-pin cat-${h.category} ${isMega ? 'mega-hub' : ''}" data-id="${h.id}" title="${h.name}">
          <div class="hotspot-pulse"></div>
          <div class="hotspot-core"></div>
        </div>
      `,
      iconSize: [isMega ? 32 : 26, isMega ? 32 : 26],
      iconAnchor: [isMega ? 16 : 13, isMega ? 16 : 13]
    });

    const marker = L.marker(h.coords, { icon: customIcon });

    const initPlace = calculateOptimalPlacement(marker, h);
    const cardHtml = createHotspotHoverCard(h);
    marker.bindTooltip(cardHtml, {
      interactive: true,
      direction: initPlace.dir,
      offset: initPlace.offset,
      className: `map-hover-card cat-${h.category}`,
      opacity: 1
    });

    marker.on("mouseover", () => {
      displayHotspotCard(marker, h, true);
    });

    marker.on("mouseout", () => {
      closeActiveTooltip(false);
    });

    marker.on("tooltipopen", (e) => {
      const tooltipEl = e.tooltip.getElement();
      if (tooltipEl) {
        tooltipEl.addEventListener("mouseenter", () => {
          isPointerInsideCard = true;
          clearTimeout(cardDismissTimer);
        });
        tooltipEl.addEventListener("mouseleave", () => {
          isPointerInsideCard = false;
          closeActiveTooltip(false);
        });
      }
    });

    marker.on("click", (e) => {
      if (e && e.originalEvent) e.originalEvent.stopPropagation();
      focusHotspot(h.id);
    });

    hotspotMarkersMap[h.id] = marker;
    hotspotMarkersLayer.addLayer(marker);
  });

  // Load vivid state & country boundaries GeoJSON
  loadStateBoundaries();

  // Auto-frame India boundaries cleanly
  try {
    leafletMap.fitBounds([[7.5, 68.0], [35.8, 97.5]], { padding: [22, 22] });
  } catch (e) {}

  // Dismiss tooltip on zoom or drag start to avoid jitter & float misalignment
  leafletMap.on('zoomstart', () => {
    closeActiveTooltip(true);
  });

  leafletMap.on('movestart', () => {
    if (!isPointerInsideCard) {
      closeActiveTooltip(true);
    }
  });

  leafletMap.on('zoomend', () => {
    if (resetControlBtn) {
      if (leafletMap.getZoom() > DEFAULT_MAP_ZOOM) resetControlBtn.classList.add("visible");
      else resetControlBtn.classList.remove("visible");
    }
  });

  // Multiple invalidateSize calls to ensure clean rendering on initial load
  setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); }, 250);
  setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); }, 750);

  // Invalidate on intersection when scrolled into view
  const mapSectionEl = document.getElementById("mapSection");
  if (mapSectionEl && "IntersectionObserver" in window) {
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && leafletMap) {
          leafletMap.invalidateSize();
        }
      });
    }, { threshold: 0.1 });
    mapObserver.observe(mapSectionEl);
  }

  // Map Hotspot Category Filter Pills
  $$(".map-filter-pill").forEach(pill => {
    pill.onclick = () => {
      $$(".map-filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      filterMapHotspots(pill.dataset.mapFilter);
    };
  });

  // Keep window.leafletMap in sync
  window.leafletMap = leafletMap;
}


  // ═══════════════════════════════════════════════════════
  //  WINDOW EXPORTS FOR CROSS-FILE & INLINE HTML ACCESS
  // ═══════════════════════════════════════════════════════

  window.indiaHotspots = indiaHotspots;
  window.leafletMap = leafletMap;
  window.initMap = initMap;
  window.resetMapView = resetMapView;
  window.focusHotspot = focusHotspot;
  window.planHotspot = planHotspot;
  window.filterMapHotspots = filterMapHotspots;
  window.statePanel = statePanel;

  // Auto-initialize if DOM is ready, or on DOMContentLoaded
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initMap, 50);
  } else {
    document.addEventListener("DOMContentLoaded", initMap);
  }
})();
