import sys
from pathlib import Path
base_dir = Path(__file__).resolve().parent.parent
if str(base_dir) not in sys.path:
    sys.path.insert(0, str(base_dir))
import json
from scratch.build_destinations_dataset import place_images

destinations_list = []

# First, keep the high altitude Ladakh entries but with guaranteed local images as fallbacks!
ladakh_fallbacks = {
    "pangong": "assets/images/gulmarg.png",
    "hanle": "assets/images/Auli.png",
    "turtuk": "assets/images/bomdila.png",
    "sham": "assets/images/dharamshala.png",
    "nubra": "assets/images/jaisalmer.png",
    "khardung": "assets/images/Auli.png",
    "tsomoriri": "assets/images/chilika.png",
    "leh": "assets/images/srinagar.jpg",
    "shanti": "assets/images/tawang.png",
    "hemis": "assets/images/bomdila.png",
    "zanskar": "assets/images/Auli.png",
    "spiti": "assets/images/dharamshala.png"
}

# 1. Ladakh & Himalayan key nodes
destinations_list.append({
    "id": "pangong",
    "name": "Pangong Tso Lake",
    "location": "Ladakh",
    "state": "Ladakh",
    "category": "mountains",
    "emotion": "peace",
    "best_season": "May–Sep",
    "difficulty": "Easy",
    "type": "Alpine Lake",
    "budget": 5000,
    "altitude": "14,270 ft",
    "isOffbeat": False,
    "footfall": "High Footfall Hotspot",
    "communityBenefit": "82% Direct Community Revenue",
    "ecoBadges": ["Plastic-Free / Reusable Flask Mandatory", "Glacier Stream Protection"],
    "img": "assets/images/gulmarg.png",
    "desc": "A dramatic 134 km saline lake at 14,270 ft shifting from turquoise to deep cobalt. High visitor congestion requires strict zero-plastic protocols."
})
destinations_list.append({
    "id": "hanle",
    "name": "Hanle Dark Sky Reserve",
    "location": "Ladakh",
    "state": "Ladakh",
    "category": "nature",
    "emotion": "peace",
    "best_season": "May–Oct",
    "difficulty": "Moderate",
    "type": "Dark Sky Reserve",
    "budget": 5500,
    "altitude": "14,900 ft",
    "isOffbeat": True,
    "footfall": "Eco-Dispersion Gem",
    "communityBenefit": "95% Direct Community Revenue",
    "ecoBadges": ["Dark Sky Protected", "Zero Light Pollution", "Village Astrostays"],
    "img": "assets/images/Auli.png",
    "desc": "India's first certified Dark Sky Sanctuary offering pristine naked-eye Milky Way observation and village-run astrostays."
})
destinations_list.append({
    "id": "turtuk",
    "name": "Turtuk Border Village",
    "location": "Ladakh",
    "state": "Ladakh",
    "category": "culture",
    "emotion": "culture",
    "best_season": "Apr–Oct",
    "difficulty": "Easy",
    "type": "Heritage Village",
    "budget": 4000,
    "altitude": "9,800 ft",
    "isOffbeat": True,
    "footfall": "Eco-Dispersion Gem",
    "communityBenefit": "90% Direct Community Revenue",
    "ecoBadges": ["Eco-Dispersion Gem", "Organic Apricot Orchards", "Balti Living Museum"],
    "img": "assets/images/bomdila.png",
    "desc": "Northernmost village of India nestled in apricot groves, celebrating unique Balti culture, stone architecture, and women's cooperatives."
})
destinations_list.append({
    "id": "sham",
    "name": "Sham Valley Eco Corridor",
    "location": "Ladakh",
    "state": "Ladakh",
    "category": "villages",
    "emotion": "peace",
    "best_season": "Year-Round",
    "difficulty": "Easy",
    "type": "Eco Valley",
    "budget": 3500,
    "altitude": "10,200 ft",
    "isOffbeat": True,
    "footfall": "Eco-Dispersion Gem",
    "communityBenefit": "92% Direct Community Revenue",
    "ecoBadges": ["Acclimatization Priority", "Solar Heated Homestays", "Low-Carbon Route"],
    "img": "assets/images/dharamshala.png",
    "desc": "The gentle 'Baby Trek' corridor, ideal for safe low-altitude acclimatization while supporting smallholder apricot orchards and village homestays."
})
destinations_list.append({
    "id": "nubra",
    "name": "Nubra Valley & Diskit",
    "location": "Ladakh",
    "state": "Ladakh",
    "category": "mountains",
    "emotion": "adventure",
    "best_season": "May–Sep",
    "difficulty": "Moderate",
    "type": "Cold Desert",
    "budget": 6500,
    "altitude": "10,000 ft",
    "isOffbeat": False,
    "footfall": "High Footfall Hotspot",
    "communityBenefit": "85% Direct Community Revenue",
    "ecoBadges": ["Plastic-Free / Reusable Flask Mandatory", "Bactrian Camel Welfare"],
    "img": "assets/images/jaisalmer.png",
    "desc": "High-altitude desert valley featuring white sand dunes, Bactrian double-humped camels, and Diskit Gompa overlooking the Shyok River."
})
destinations_list.append({
    "id": "khardung",
    "name": "Khardung La Pass",
    "location": "Ladakh",
    "state": "Ladakh",
    "category": "adventure",
    "emotion": "adventure",
    "best_season": "May–Oct",
    "difficulty": "Moderate",
    "type": "Mountain Pass",
    "budget": 2500,
    "altitude": "17,582 ft",
    "isOffbeat": False,
    "footfall": "High Traffic Pass",
    "communityBenefit": "80% Direct Community Revenue",
    "ecoBadges": ["Acclimatization Priority", "Strict 15-Min Stay Limit", "4x4 Certified Route"],
    "img": "assets/images/Auli.png",
    "desc": "Legendary Himalayan pass connecting Leh to Nubra and Siachen. High altitude requires acclimatization priority and brief stops."
})
destinations_list.append({
    "id": "tsomoriri",
    "name": "Tso Moriri Lake Sanctuary",
    "location": "Ladakh",
    "state": "Ladakh",
    "category": "nature",
    "emotion": "peace",
    "best_season": "May–Sep",
    "difficulty": "Moderate",
    "type": "Alpine Wetland",
    "budget": 7000,
    "altitude": "14,836 ft",
    "isOffbeat": True,
    "footfall": "Fragile Wetland Sanctuary",
    "communityBenefit": "93% Direct Community Revenue",
    "ecoBadges": ["Ramsar Wetland Site", "Black-Necked Crane Habitat", "Zero-Waste Camping"],
    "img": "assets/images/chilika.png",
    "desc": "Spectacular high-altitude brackish lake surrounded by snow-capped peaks. Breeding ground for rare migratory black-necked cranes."
})
destinations_list.append({
    "id": "leh",
    "name": "Leh Old Town Heritage Core",
    "location": "Ladakh",
    "state": "Ladakh",
    "category": "culture",
    "emotion": "culture",
    "best_season": "Year-Round",
    "difficulty": "Easy",
    "type": "Heritage Town",
    "budget": 4500,
    "altitude": "11,500 ft",
    "isOffbeat": False,
    "footfall": "Urban Cultural Hub",
    "communityBenefit": "88% Direct Community Revenue",
    "ecoBadges": ["Heritage Conservation", "Clay Brick Architecture", "Local Artisan Guilds"],
    "img": "assets/images/srinagar.jpg",
    "desc": "Historic mountain crossroads with 17th-century mud-brick Leh Palace, organic bakeries, Tibetan antique markets, and Jama Masjid."
})
destinations_list.append({
    "id": "shanti",
    "name": "Shanti Stupa Hilltop",
    "location": "Leh",
    "state": "Ladakh",
    "category": "spirituality",
    "emotion": "peace",
    "best_season": "Year-Round",
    "difficulty": "Easy",
    "type": "Peace Stupa",
    "budget": 1000,
    "altitude": "11,841 ft",
    "isOffbeat": False,
    "footfall": "Sunset Sanctuary",
    "communityBenefit": "95% Direct Community Revenue",
    "ecoBadges": ["Silent Zone", "Solar Powered Lighting", "Peace Meditation"],
    "img": "assets/images/tawang.png",
    "desc": "White-domed Buddhist stupa atop a steep ridge at Chanspa, offering 360-degree views of Leh valley and majestic Zanskar ranges."
})
destinations_list.append({
    "id": "hemis",
    "name": "Hemis Monastic Sanctuary",
    "location": "Ladakh",
    "state": "Ladakh",
    "category": "culture",
    "emotion": "culture",
    "best_season": "Jun–Oct",
    "difficulty": "Easy",
    "type": "Living Monastery",
    "budget": 3000,
    "altitude": "11,975 ft",
    "isOffbeat": True,
    "footfall": "Cultural Heritage Jewel",
    "communityBenefit": "94% Direct Community Revenue",
    "ecoBadges": ["Sacred Monastic Protocol", "Cham Dance Preservation", "Ancient Thangkas"],
    "img": "assets/images/bomdila.png",
    "desc": "Largest and wealthiest monastery in Ladakh, famous for the annual Hemis Tsechu festival celebrating Guru Padmasambhava with sacred Cham dances."
})
destinations_list.append({
    "id": "zanskar",
    "name": "Zanskar Deep Gorges",
    "location": "Ladakh",
    "state": "Ladakh",
    "category": "adventure",
    "emotion": "adventure",
    "best_season": "Jun–Sep",
    "difficulty": "Challenging",
    "type": "Alpine Gorges",
    "budget": 8500,
    "altitude": "13,154 ft",
    "isOffbeat": True,
    "footfall": "Remote Wilderness",
    "communityBenefit": "96% Direct Community Revenue",
    "ecoBadges": ["Remote Homestay Guild", "High Himalayan Passes", "Leave-No-Trace Trek"],
    "img": "assets/images/Auli.png",
    "desc": "One of the most isolated valleys in the Himalayas, home to cliffside Phuktal Monastery, deep roaring gorges, and legendary frozen river trails."
})
destinations_list.append({
    "id": "spiti",
    "name": "Spiti Valley Middle Land",
    "location": "Himachal Pradesh",
    "state": "Himachal Pradesh",
    "category": "mountains",
    "emotion": "adventure",
    "best_season": "Jun–Oct",
    "difficulty": "Moderate",
    "type": "Cold Desert",
    "budget": 6000,
    "altitude": "12,500 ft",
    "isOffbeat": True,
    "footfall": "Eco-Dispersion Gem",
    "communityBenefit": "92% Direct Community Revenue",
    "ecoBadges": ["Fossil Village Protection", "High Altitude Solar Stays", "Key Monastery Heritage"],
    "img": "assets/images/dharamshala.png",
    "desc": "High-altitude desert bordering Tibet, famous for Key cliffside gompa, Langza marine fossils, and the world's highest post office at Hikkim."
})

# 2. Add all 51 destinations from place_images
for k, v in place_images.items():
    name, location, state, cat, emotion, best_season, diff, d_type, budget, alt, is_off, footfall, com_ben, badges, img_file, desc = v
    destinations_list.append({
        "id": k,
        "name": name,
        "location": location,
        "state": state,
        "category": cat,
        "emotion": emotion,
        "best_season": best_season,
        "bestSeason": best_season,
        "difficulty": diff,
        "type": d_type,
        "budget": budget,
        "altitude": alt,
        "isOffbeat": is_off,
        "footfall": footfall,
        "communityBenefit": com_ben,
        "ecoBadges": badges,
        "img": f"assets/images/{img_file}",
        "desc": desc
    })

print(f"Combined total destinations: {len(destinations_list)}")
with open(r"c:\Users\Arya\Downloads\Bharat_Explore_SIH_Tourism\scratch\generated_destinations.json", "w", encoding="utf-8") as f:
    json.dump(destinations_list, f, indent=2, ensure_ascii=False)
print("Saved generated_destinations.json")
