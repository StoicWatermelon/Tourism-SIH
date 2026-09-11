# Scratch script to test the gazetteer expansion data before applying
COOCHBEHAR_ENTRY = {
    "name": "Coochbehar",
    "state": "West Bengal",
    "terrain": "royal_heritage",
    "aliases": ["coochbehar", "cooch behar", "coochbihar", "koch bihar", "kochbihar", "কোচবিহার", "कूचबिहार"],
    "gateway_airport": "Cooch Behar Airport (COH - Regional) / Bagdogra International Airport (IXB - 145 km) / Rupsi Airport (RUP - 65 km)",
    "gateway_rail": "New Cooch Behar Junction (NCB) / Cooch Behar (COB) — Vande Bharat Express & Rajdhani connectivity",
    "local_transit_desc": "Eco-friendly battery e-rickshaws (Totos), local cycle-rickshaws, and private shared cabs",
    "permit_info": "ASI entry ticket for Cooch Behar Royal Victor Jubilee Palace; Forest permit for Rasikbil Bird Sanctuary",
    "emergency_hospital": "Cooch Behar Government Medical College & Hospital (Apex 24/7 Trauma Care, Ph: 03582-222222) / MJN Hospital",
    "culinary_specialties": [
        {"name": "Shorshe Ilish & Bhetki Paturi with steamed Gobindobhog rice", "price": 280},
        {"name": "Royal Chhanar Jilapi, Bhapa Sandesh & Rasgulla", "price": 80},
        {"name": "Traditional Koch-Rajbongshi Sidol fish chutney & crispy Bora", "price": 140}
    ],
    "hotels": [
        {"name": "Hotel Royal Palace & Heritage Suites", "category": "Heritage Comfort Stay", "price": 2400, "rating": 4.7, "location": "Near Cooch Behar Palace, Coochbehar"},
        {"name": "Rasikbil Eco Forest Lodge & Lake Homestay", "category": "Eco Wetland Lodge", "price": 1600, "rating": 4.6, "location": "Rasikbil Sanctuary, Coochbehar"},
        {"name": "The Maharaja Heritage Inn", "category": "Classic Heritage Hotel", "price": 3200, "rating": 4.8, "location": "Sagar Dighi Square, Coochbehar"}
    ],
    "clusters": [
        {
            "theme": "Royal Koch Dynasty Heritage & Sacred Shrines",
            "area": "Victor Jubilee Palace & Central Heritage Corridor",
            "activities": [
                {"time": "08:30 AM", "title": "Traditional Koch Breakfast of Radhaballabhi & Chhanar Jilapi", "loc": "Bhavani Ganj Market", "cat": "Food", "dur": 45, "transit": 0, "cost": 90, "tip": "Fresh fluffy lentil-stuffed pooris with aromatic Chhanar Jilapi sweets."},
                {"time": "09:30 AM", "title": "Cooch Behar Royal Palace (Victor Jubilee Palace)", "loc": "Victor Jubilee Palace Complex", "cat": "Heritage", "dur": 150, "transit": 10, "cost": 50, "tip": "Modeled after Buckingham Palace in 1887 under Maharaja Nripendra Narayan; marvel at the terracotta classical Italian Renaissance facade."},
                {"time": "12:15 PM", "title": "Historic Madan Mohan Bari Darshan", "loc": "Madan Mohan Square", "cat": "Heritage", "dur": 60, "transit": 10, "cost": 0, "tip": "1889 royal temple dedicated to Lord Madan Mohan (Krishna), celebrated for the grand annual Ras Mela festival."},
                {"time": "01:30 PM", "title": "Authentic Koch-Rajbongshi & Bengali Thali Lunch", "loc": "Sagar Dighi Court", "cat": "Food", "dur": 60, "transit": 10, "cost": 250, "tip": "Savor Shorshe Ilish, Moong Dal, Jhuri Aloo Bhaja, and seasonal Koch delicacies."},
                {"time": "03:00 PM", "title": "Sagar Dighi Heritage Lake & Promenade Walk", "loc": "Sagar Dighi", "cat": "Nature", "dur": 75, "transit": 5, "cost": 0, "tip": "Expansive 19th-century royal square lake bordered by heritage red-brick administrative buildings."},
                {"time": "04:30 PM", "title": "Baneswar Shiva Temple & Sacred Turtle Pond", "loc": "Baneswar (10 km)", "cat": "Heritage", "dur": 90, "transit": 20, "cost": 0, "tip": "Ancient temple pond sanctifying rare endangered Black Softshell Turtles locally known as Mohan."},
                {"time": "06:30 PM", "title": "Evening Illuminated Palace Gardens & Shitalpati Craft Walk", "loc": "Palace Grounds", "cat": "Rest", "dur": 60, "transit": 15, "cost": 0, "tip": "Browse authentic handwoven Shitalpati cane mats crafted by indigenous rural artisans."}
            ]
        },
        {
            "theme": "Wildlife Sanctuaries & Ancient Kamtapur Ruins",
            "area": "Rasikbil Wetland & Gosanimari Archaeological Corridor",
            "activities": [
                {"time": "07:00 AM", "title": "Scenic Rural Drive to Rasikbil Wetland Sanctuary", "loc": "Rasikbil Road", "cat": "Transit", "dur": 60, "transit": 45, "cost": 0, "tip": "Serene drive through Dooars tea gardens and rural riverbanks."},
                {"time": "08:15 AM", "title": "Birdwatching & Eco-Boating on Rasikbil Wetland Lake", "loc": "Rasikbil Bird Sanctuary", "cat": "Nature", "dur": 120, "transit": 0, "cost": 120, "tip": "Spot migratory waterfowl, whistling ducks, storks, and kingfishers on the 175-hectare lake."},
                {"time": "10:30 AM", "title": "Rasikbil Deer Park & Python Rehabilitation Centre", "loc": "Rasikbil Eco Park", "cat": "Nature", "dur": 60, "transit": 5, "cost": 30, "tip": "Conservation centre for spotted deer, tortoises, and rescued marsh pythons."},
                {"time": "12:30 PM", "title": "Village Eco-Homestay Fresh Fish & Rice Lunch", "loc": "Rasikbil Forest Village", "cat": "Food", "dur": 60, "transit": 10, "cost": 180, "tip": "Zero-mile pond fish curry prepared with freshly ground mustard and native herbs."},
                {"time": "02:30 PM", "title": "Gosanimari Archaeological Excavation & Rajpat Mound", "loc": "Gosanimari (Dinhata)", "cat": "Heritage", "dur": 90, "transit": 25, "cost": 0, "tip": "Ancient capital of the Kamtapur Kingdom (11th-15th century) featuring historic ramparts and stone artifacts."},
                {"time": "04:30 PM", "title": "Kameshwari Temple & Sacred Kamteshwari Shrine", "loc": "Gosanimari", "cat": "Heritage", "dur": 45, "transit": 10, "cost": 0, "tip": "Historic shrine rebuilt by Maharaja Pran Narayan in 1665 AD."},
                {"time": "05:45 PM", "title": "Torsa River Embankment Golden Hour Sunset", "loc": "Torsa River Ghat", "cat": "Rest", "dur": 60, "transit": 20, "cost": 0, "tip": "Watch fishermen cast their nets across the golden waters of the Torsa River."}
            ]
        }
    ]
}

THANE_ENTRY = {
    "name": "Thane",
    "state": "Maharashtra",
    "terrain": "lake_city_nature",
    "aliases": ["thane", "thana", "ठाणे", "city of lakes", "yeoor", "upvan"],
    "gateway_airport": "Chhatrapati Shivaji Maharaj International Airport Mumbai (BOM - 24 km via Eastern Express Highway)",
    "gateway_rail": "Thane Railway Station (TNA) — Historic terminus of India's 1st passenger train (1853), Central & Trans-Harbour hub",
    "local_transit_desc": "Thane Municipal Transport (TMT) AC electric buses, autorickshaws, and Mumbai Suburban local trains",
    "permit_info": "Yeoor Hills / Sanjay Gandhi National Park buffer zone nature entry ticket",
    "emergency_hospital": "Jupiter Hospital Apex Multi-Specialty & 24/7 Trauma Care (Eastern Express Highway, Ph: 022-21725555) / Bethany Hospital",
    "culinary_specialties": [
        {"name": "Legendary Mamledar Misal Pav (Spicy sprout curry with fresh pav & farsan)", "price": 95},
        {"name": "Crispy Kothimbir Vadi & Multi-Grain Thalipeeth with homemade white butter", "price": 130},
        {"name": "Authentic Agri-Koli Coastal Seafood Thali (Surmai fry, Tisrya masala & Bhakri)", "price": 320}
    ],
    "hotels": [
        {"name": "The Byke Suraj Plaza Pure Veg & Eco Stay", "category": "Green City Hotel", "price": 2800, "rating": 4.6, "location": "Ghodbunder Road, Thane"},
        {"name": "Yeoor Hills Jungle Lodge & Eco Cottages", "category": "Forest Eco Retreat", "price": 2500, "rating": 4.7, "location": "Yeoor Hills, Thane"},
        {"name": "Fortune Park LakeCity (ITC Hotel Member)", "category": "Lakefront Premium Stay", "price": 4600, "rating": 4.8, "location": "Eastern Express Highway, Thane"}
    ],
    "clusters": [
        {
            "theme": "City of Lakes & Ancient Shilahara Heritage",
            "area": "Masunda Lake & Historic Old Thane Core",
            "activities": [
                {"time": "07:30 AM", "title": "Morning Stroll & Pedal Boating at Masunda Lake (Talao Pali)", "loc": "Talao Pali Lake Promenade", "cat": "Nature", "dur": 60, "transit": 0, "cost": 50, "tip": "Thane's most iconic lake; enjoy the cool morning breeze and lakeside gardens."},
                {"time": "08:45 AM", "title": "Legendary Mamledar Misal Pav Breakfast", "loc": "Naupada / Station Road", "cat": "Food", "dur": 45, "transit": 10, "cost": 95, "tip": "Savor Maharashtra's world-famous spicy sprout curry topped with crispy farsan and lime."},
                {"time": "10:00 AM", "title": "Historic Kopineshwar Mandir Darshan", "loc": "Jambli Naka, Old Thane", "cat": "Heritage", "dur": 60, "transit": 10, "cost": 0, "tip": "Built in 810 AD by the Shilahara dynasty; houses the largest Shivalinga in Maharashtra."},
                {"time": "11:30 AM", "title": "St. John the Baptist Church Heritage Visit", "loc": "Masunda Lake North Bank", "cat": "Heritage", "dur": 45, "transit": 5, "cost": 0, "tip": "Historic church established by the Portuguese in 1582, famed for its carved wooden altars."},
                {"time": "01:00 PM", "title": "Authentic Agri-Koli Seafood / Maharashtrian Thali Lunch", "loc": "Panch Pakhadi", "cat": "Food", "dur": 60, "transit": 10, "cost": 300, "tip": "Try authentic fresh fish fry or jowar bhakri with pitla and kothimbir vadi."},
                {"time": "03:30 PM", "title": "Upvan Lake Sunset Promenade & Sanskriti Arts Walk", "loc": "Upvan Lake Foothills", "cat": "Nature", "dur": 90, "transit": 15, "cost": 0, "tip": "Picturesque lake nestled directly against the green backdrop of the Yeoor Hills."},
                {"time": "06:00 PM", "title": "Talao Pali Evening Street Food & Falooda Trail", "loc": "Talao Pali Street", "cat": "Food", "dur": 60, "transit": 15, "cost": 120, "tip": "Try famous Kulfi falooda, pani puri, and roasted corn along the promenade."}
            ]
        },
        {
            "theme": "Yeoor Hills Rainforest & Sanjay Gandhi National Park",
            "area": "Yeoor Hills & Ghodbunder Green Corridor",
            "activities": [
                {"time": "06:30 AM", "title": "Morning Rainforest Trail & Birdwatching in Yeoor Hills", "loc": "Yeoor Hills Nature Gate", "cat": "Adventure", "dur": 120, "transit": 20, "cost": 50, "tip": "Buffer sanctuary of Sanjay Gandhi National Park housing hornbills, parakeets, and peacocks."},
                {"time": "08:45 AM", "title": "Traditional Maharashtrian Hilltop Breakfast", "loc": "Yeoor Village Hilltop", "cat": "Food", "dur": 45, "transit": 5, "cost": 110, "tip": "Warm Thalipeeth with white butter, fresh poha, and hot cutting chai."},
                {"time": "10:00 AM", "title": "Yeoor Eco-Butterfly Garden & Adivasi Craft Center", "loc": "Patonapada Tribal Village", "cat": "Nature", "dur": 75, "transit": 10, "cost": 25, "tip": "Indigenous community nursery and traditional Warli and bamboo folk crafts."},
                {"time": "12:30 PM", "title": "Farm-Fresh Forest Homestay Maharashtrian Lunch", "loc": "Yeoor Eco Cottages", "cat": "Food", "dur": 60, "transit": 10, "cost": 220, "tip": "Wholesome rural meals cooked over clay chulhas with local seasonal produce."},
                {"time": "02:30 PM", "title": "Gaimukh Waterfront & Nagla Block Estuary Excursion", "loc": "Ghodbunder Creek / Gaimukh", "cat": "Nature", "dur": 90, "transit": 25, "cost": 0, "tip": "Scenic waterfront promenade overlooking the historic Portuguese Ghodbunder Fort and Ulhas river estuary."},
                {"time": "04:30 PM", "title": "Ghodbunder Fort Exploration", "loc": "Ghodbunder Hilltop", "cat": "Heritage", "dur": 60, "transit": 10, "cost": 0, "tip": "Historic 16th-century Portuguese and Maratha horse-trade fort overlooking the creek."},
                {"time": "06:00 PM", "title": "Sunset Viewpoint at Yeoor Ridge Overlooking Thane", "loc": "Yeoor Ridge Top", "cat": "Rest", "dur": 60, "transit": 20, "cost": 0, "tip": "Spectacular panoramic sunset over the forested slopes and glittering lake city skyline."}
            ]
        }
    ]
}

print("Validated schema for Coochbehar and Thane entries.")
