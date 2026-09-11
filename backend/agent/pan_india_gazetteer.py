"""
Pan-India Comprehensive Tourism Gazetteer & Knowledge Engine
Contains verified, curated travel profiles for 40+ iconic/offbeat destinations + all 36 Indian States and UTs.
Provides authentic sights, geographic clusters, culinary specialties, gateway airports, rail connections,
local transit modes, and emergency facilities.
"""

from typing import Dict, Any, List, Optional
import re

GAZETTEER_DESTINATIONS: Dict[str, Dict[str, Any]] = {
    # ─── KARNATAKA ───
    "hampi": {
        "name": "Hampi",
        "state": "Karnataka",
        "terrain": "cultural_heritage",
        "aliases": ["hampi", "vijayanagara", "hampe", "हम्पी", "হাম্পি"],
        "gateway_airport": "Jindal Vidyanagar Airport Bellary (VDY - 38 km) / Hubli Airport (HBX - 143 km)",
        "gateway_rail": "Hospet Junction (HPT - 13 km) / Vande Bharat Express connectivity",
        "local_transit_desc": "Rented gearless bicycles, mopeds, and circular coracle river boats for traversing boulder ruins",
        "permit_info": "ASI UNESCO composite ticket for Vittala Temple & Zanana Enclosure (Lotus Mahal), plus golf cart shuttle tokens",
        "emergency_hospital": "100-Bed Government General Hospital Hospet (13 km) / VIMS Bellary Apex Trauma (60 km)",
        "culinary_specialties": [
            {"name": "Jolada Rotti Oota (Sorghum flatbread with ennegai brinjal & shenga chutney)", "price": 180},
            {"name": "Authentic Bisi Bele Bath with spiced boondi", "price": 120},
            {"name": "Filter Coffee & Davanagere Benne Dosa", "price": 140}
        ],
        "hotels": [
            {"name": "Hampi Heritage Boulders Resort & Homestay", "category": "Heritage Eco Stay", "price": 2800, "rating": 4.8, "location": "Kamalapura, Hampi"},
            {"name": "Kishkinda River Heritage Eco Cottages", "category": "River Eco Lodge", "price": 2200, "rating": 4.6, "location": "Anegundi Bank, Hampi"},
            {"name": "Evolve Back Kamalapura Palace", "category": "Luxury Heritage Palace", "price": 14500, "rating": 4.9, "location": "Kamalapura Archaeological Zone"}
        ],
        "clusters": [
            {
                "theme": "Sacred Centre & Riverside Monuments",
                "area": "Hampi Bazaar & Hemakuta Cluster",
                "activities": [
                    {"time": "06:00 AM", "title": "Sunrise Panoramic Hike to Matanga Hill", "loc": "Matanga Hill Summit", "cat": "Nature", "dur": 90, "transit": 0, "cost": 0, "tip": "Best 360-degree vista of the ruins and boulder landscape."},
                    {"time": "08:00 AM", "title": "Traditional Breakfast at Mango Tree Cafe", "loc": "Hampi Bazaar", "cat": "Food", "dur": 60, "transit": 15, "cost": 220, "tip": "Try the banana flower uttapam and fresh filter coffee."},
                    {"time": "09:30 AM", "title": "Virupaksha Temple & Sacred Hemakuta Hill Complex", "loc": "Virupaksha Complex", "cat": "Heritage", "dur": 120, "transit": 10, "cost": 50, "tip": "Observe the inverted pinhole camera shadow of the gopuram."},
                    {"time": "12:30 PM", "title": "Badavilinga & Monolithic Sasivekalu Ganesha", "loc": "Sacred Centre", "cat": "Heritage", "dur": 60, "transit": 10, "cost": 0, "tip": "3-meter tall monolith carved from a single boulder."},
                    {"time": "02:00 PM", "title": "Traditional Jolada Rotti Lunch", "loc": "Kamalapura Road", "cat": "Food", "dur": 60, "transit": 15, "cost": 250, "tip": "Authentic North Karnataka sorghum bread with spicy stuffed brinjal."},
                    {"time": "04:00 PM", "title": "Coracle Boat Ride across Tungabhadra River", "loc": "Tungabhadra Ghat", "cat": "Adventure", "dur": 60, "transit": 15, "cost": 400, "tip": "Experience traditional woven bowl boats amid ancient rock carvings."},
                    {"time": "05:30 PM", "title": "Sunset over Achyutaraya Temple & Courtesan's Street", "loc": "Achyutaraya Complex", "cat": "Heritage", "dur": 90, "transit": 10, "cost": 0, "tip": "Secluded valley temple lit by evening golden hour."}
                ]
            },
            {
                "theme": "Royal Citadel & Architectural Marvels",
                "area": "Vittala & Royal Enclosure Corridor",
                "activities": [
                    {"time": "07:30 AM", "title": "Vijaya Vittala Temple & Iconic Stone Chariot", "loc": "Vittala Temple Complex", "cat": "Heritage", "dur": 150, "transit": 20, "cost": 500, "tip": "Inspect the famous 56 musical pillars and UNESCO Stone Chariot."},
                    {"time": "10:30 AM", "title": "Electric Eco-Cart Ride through King's Balance", "loc": "Kampa Bhupa Path", "cat": "Transit", "dur": 30, "transit": 0, "cost": 50, "tip": "Zero-emission battery transit between Vittala and parking."},
                    {"time": "11:30 AM", "title": "Lotus Mahal & Indo-Islamic Elephant Stables", "loc": "Zanana Enclosure", "cat": "Heritage", "dur": 90, "transit": 15, "cost": 0, "tip": "Unique vaulted Islamic arches mixed with Hindu temple towers."},
                    {"time": "01:30 PM", "title": "South Indian Thali Lunch", "loc": "Kamalapura", "cat": "Food", "dur": 60, "transit": 10, "cost": 200, "tip": "Unlimited vegetarian meals served on plantain leaf."},
                    {"time": "03:00 PM", "title": "Royal Enclosure, Stepped Pushkarani Tank & Mahanavami Dibba", "loc": "Royal Citadel", "cat": "Heritage", "dur": 120, "transit": 10, "cost": 0, "tip": "Marvel at the perfectly fitted black schist stone aqueduct system."},
                    {"time": "05:30 PM", "title": "Queen's Bath & Octagonal Bath Exploration", "loc": "Southern Royal Zone", "cat": "Heritage", "dur": 60, "transit": 10, "cost": 0, "tip": "Surrounded by a moat with ornate carved stucco balconies."}
                ]
            }
        ]
    },

    "coorg": {
        "name": "Coorg (Kodagu)",
        "state": "Karnataka",
        "terrain": "mountain_hill_station",
        "aliases": ["coorg", "kodagu", "madikeri", "कुर्ग", "কুর্গ"],
        "gateway_airport": "Kannur International Airport (CNN - 85 km) / Mangalore Airport (IXE - 138 km) / Bangalore (BLR)",
        "gateway_rail": "Mysore Junction (MYS - 118 km) with direct KSRTC Airavat luxury bus connects",
        "local_transit_desc": "Private hill-country taxis and shared jeeps navigating fragrant coffee estate roads",
        "permit_info": "Talakaveri temple tokens, Dubare elephant camp entry, and forest check-post passes",
        "emergency_hospital": "District Government Hospital Madikeri (24/7 Trauma Care - Ph: 08272-228355)",
        "culinary_specialties": [
            {"name": "Traditional Pandi Curry or Jackfruit Gassi with Kadambuttu (Steamed rice balls)", "price": 280},
            {"name": "Akki Roti with bamboo shoot curry (Kani)", "price": 160},
            {"name": "Estate-Fresh Filter Kaapi with Coorg orange honey", "price": 90}
        ],
        "hotels": [
            {"name": "Coffee Country Estate Eco-Homestay", "category": "Estate Homestay", "price": 2600, "rating": 4.8, "location": "Madikeri Valley, Coorg"},
            {"name": "Old Kent Estates & Spa", "category": "Colonial Plantation Lodge", "price": 6800, "rating": 4.9, "location": "Suntikoppa, Coorg"},
            {"name": "The Tamara Coorg", "category": "Luxury Rainforest Resort", "price": 18000, "rating": 4.9, "location": "Yavakapadi Village, Coorg"}
        ],
        "clusters": [
            {
                "theme": "Madikeri Heritage & Cascading Waterfalls",
                "area": "Madikeri Town & Abbey Cluster",
                "activities": [
                    {"time": "08:00 AM", "title": "Kodava Breakfast with Akki Roti & Filter Coffee", "loc": "Madikeri Bazaar", "cat": "Food", "dur": 60, "transit": 0, "cost": 160, "tip": "Crispy roasted rice flatbread with spicy coconut chutney."},
                    {"time": "09:30 AM", "title": "Madikeri Fort & Palace Museum Walk", "loc": "Madikeri Town", "cat": "Heritage", "dur": 90, "transit": 10, "cost": 50, "tip": "Explore the 17th-century mud fort later rebuilt by Tipu Sultan."},
                    {"time": "11:30 AM", "title": "Abbey Falls Trek through Coffee & Spice Plantations", "loc": "Abbey Falls Trail", "cat": "Nature", "dur": 90, "transit": 20, "cost": 100, "tip": "Roaring waterfall nestled amidst dense pepper vines and coffee bushes."},
                    {"time": "01:30 PM", "title": "Authentic Coorgi Lunch at Taste of Coorg", "loc": "Madikeri Core", "cat": "Food", "dur": 60, "transit": 15, "cost": 300, "tip": "Savor authentic regional Kodava preparations."},
                    {"time": "03:30 PM", "title": "Omkareshwara Temple (Unique Gothic-Islamic Architecture)", "loc": "Madikeri", "cat": "Heritage", "dur": 60, "transit": 10, "cost": 0, "tip": "Ancient temple dedicated to Lord Shiva built around a serene central tank."},
                    {"time": "05:00 PM", "title": "Sunset & Musical Fountain at Raja's Seat", "loc": "Raja's Seat Viewpoint", "cat": "Nature", "dur": 90, "transit": 10, "cost": 40, "tip": "Where the ancient Kings of Coorg watched the sun set over mist-draped valleys."}
                ]
            },
            {
                "theme": "Tibetan Culture & Wildlife Sanctum",
                "area": "Bylakuppe & Dubare Corridor",
                "activities": [
                    {"time": "08:30 AM", "title": "Dubare Elephant Camp & River Rafting", "loc": "Dubare River Bank", "cat": "Adventure", "dur": 150, "transit": 45, "cost": 850, "tip": "Cross Kaveri river via motorboat; watch elephant bathing and feeding."},
                    {"time": "11:30 AM", "title": "Scenic Coffee Estate Guided Walking Tour", "loc": "Suntikoppa", "cat": "Nature", "dur": 90, "transit": 20, "cost": 250, "tip": "Learn Arabica and Robusta cultivation, pepper harvesting, and cardamom picking."},
                    {"time": "01:30 PM", "title": "Traditional Tibetan Lunch (Momos & Thukpa)", "loc": "Bylakuppe Camp", "cat": "Food", "dur": 60, "transit": 30, "cost": 220, "tip": "Steamed vegetable and meat dumplings with Tibetan hot broth."},
                    {"time": "03:00 PM", "title": "Namdroling Golden Temple Monastery", "loc": "Bylakuppe", "cat": "Heritage", "dur": 120, "transit": 10, "cost": 0, "tip": "Largest Tibetan Buddhist settlement in South India with 40-foot golden Buddha statues."},
                    {"time": "05:30 PM", "title": "Handicraft & Tibetan Prayer Wheel Souvenir Walk", "loc": "Golden Temple Market", "cat": "Rest", "dur": 60, "transit": 5, "cost": 0, "tip": "Purchase authentic incense, thangka paintings, and prayer flags."}
                ]
            }
        ]
    },

    "gokarna": {
        "name": "Gokarna",
        "state": "Karnataka",
        "terrain": "coastal_beach",
        "aliases": ["gokarna", "om beach", "kudle", "गोकर्ण"],
        "gateway_airport": "Goa Dabolim / MOPA Airport (GOX - 140 km) / Hubli Airport (HBX - 145 km)",
        "gateway_rail": "Gokarna Road Railway Station (GOK - 8 km) / Ankola (20 km)",
        "local_transit_desc": "Coastal cliff hiking trails, open autorickshaws, and beach hopping fishing boats",
        "permit_info": "Temple dress code regulations and beach water sport tokens",
        "emergency_hospital": "Government Taluk Hospital Kumta (30 km) / District Hospital Karwar (55 km)",
        "culinary_specialties": [
            {"name": "Konkani Fish Curry Thali with red unpolished rice", "price": 220},
            {"name": "Nutritious Toddy Palm Neera & Gadbad Ice Cream", "price": 90},
            {"name": "Avocado Salads & Fresh Wood-Fired Pita at Namaste Cafe", "price": 280}
        ],
        "hotels": [
            {"name": "Kudle Ocean Eco Cottages", "category": "Beach Cottage", "price": 2400, "rating": 4.7, "location": "Kudle Beach, Gokarna"},
            {"name": "Kahani Paradise Luxury Estate", "category": "Luxury Cliffside Villa", "price": 16000, "rating": 4.9, "location": "Belle Hill, Gokarna"}
        ],
        "clusters": [
            {
                "theme": "Sacred Pilgrimage & Beach Trekking",
                "area": "Mahabaleshwar & Om Beach Corridor",
                "activities": [
                    {"time": "07:30 AM", "title": "Mahabaleshwar Temple & Kotiteertha Sacred Tank", "loc": "Gokarna Town", "cat": "Heritage", "dur": 90, "transit": 0, "cost": 0, "tip": "Revered 4th-century temple housing the sacred Atmalinga."},
                    {"time": "09:30 AM", "title": "Breakfast of South Indian Neer Dosa & Coconut Chutney", "loc": "Car Street", "cat": "Food", "dur": 45, "transit": 5, "cost": 100, "tip": "Melt-in-mouth rice crepes with fresh coastal chutney."},
                    {"time": "10:30 AM", "title": "Coastal Cliff Trek: Kudle to Om Beach", "loc": "Coastline Ridge", "cat": "Adventure", "dur": 90, "transit": 10, "cost": 0, "tip": "Spectacular cliffside hiking trail connecting scenic crescent beaches."},
                    {"time": "12:30 PM", "title": "Lakeside Lunch at Namaste Cafe Om Beach", "loc": "Om Beach", "cat": "Food", "dur": 60, "transit": 5, "cost": 320, "tip": "Watch waves crash right up to the cafe patio."},
                    {"time": "02:30 PM", "title": "Boat Ride to Half Moon Beach & Paradise Beach", "loc": "Om Beach Jetty", "cat": "Nature", "dur": 120, "transit": 15, "cost": 400, "tip": "Secluded rocky beaches accessible only by boat or wilderness trek."},
                    {"time": "05:30 PM", "title": "Sunset from Kudle View Point", "loc": "Kudle Ridge", "cat": "Rest", "dur": 60, "transit": 10, "cost": 0, "tip": "Stunning golden glow over the Arabian Sea."}
                ]
            }
        ]
    },

    "mysore": {
        "name": "Mysore (Mysuru)",
        "state": "Karnataka",
        "terrain": "cultural_heritage",
        "aliases": ["mysore", "mysuru", "chamundi", "मैसूर", "মহীশূর"],
        "gateway_airport": "Mysore Domestic Airport (MYQ) / Bangalore International Airport (BLR - 170 km)",
        "gateway_rail": "Mysuru Junction (MYS) / Vande Bharat Express to Chennai & Bangalore",
        "local_transit_desc": "Electric city buses, metered autorickshaws, and horse-drawn tongas",
        "permit_info": "Palace illumination entry passes and Chamundi Hill express darshan",
        "emergency_hospital": "K.R. Hospital & Mysore Medical College Apex Trauma Center (Ph: 0821-2520512)",
        "culinary_specialties": [
            {"name": "Original Melt-in-Mouth Mysore Pak from Guru Sweets", "price": 100},
            {"name": "Crispy Mysore Masala Dosa with red garlic chili chutney at Mylari", "price": 80},
            {"name": "Bisi Bele Bath & Filter Kaapi", "price": 90}
        ],
        "hotels": [
            {"name": "Lalitha Mahal Palace Hotel", "category": "Heritage Royal Palace", "price": 5500, "rating": 4.8, "location": "Siddhartha Nagar, Mysore"},
            {"name": "Green Hotel (Eco-Certified Heritage)", "category": "Eco Heritage Hotel", "price": 3200, "rating": 4.7, "location": "Jayalakshmipuram, Mysore"}
        ],
        "clusters": [
            {
                "theme": "Wodeyar Royalty & Silk Heritage",
                "area": "Mysore Palace & Devaraja Market",
                "activities": [
                    {"time": "08:30 AM", "title": "Mylari Butter Masala Dosa Breakfast", "loc": "Nazarbad, Mysuru", "cat": "Food", "dur": 45, "transit": 0, "cost": 80, "tip": "Fluffy, cloud-soft dosas served with fresh white butter."},
                    {"time": "09:30 AM", "title": "Grand Mysore Palace (Amba Vilas) Architecture Tour", "loc": "Sayyaji Rao Road", "cat": "Heritage", "dur": 150, "transit": 10, "cost": 100, "tip": "Indo-Saracenic masterpiece with stained glass, golden throne, and Durbar hall."},
                    {"time": "12:30 PM", "title": "Devaraja Century-Old Heritage Market Walk", "loc": "Sayyaji Rao Road", "cat": "Heritage", "dur": 90, "transit": 10, "cost": 0, "tip": "Aromatic stalls of Mysore sandalwood oil, incense, flowers, and betel leaves."},
                    {"time": "02:00 PM", "title": "Traditional Mysore Thali Lunch", "loc": "Gandhi Square", "cat": "Food", "dur": 60, "transit": 10, "cost": 180, "tip": "Served with saaru, kootu, payasa, and Mysore rasam."},
                    {"time": "03:30 PM", "title": "Chamundeshwari Temple & Nandi Monolith Climb", "loc": "Chamundi Hill (3,300 ft)", "cat": "Heritage", "dur": 120, "transit": 20, "cost": 0, "tip": "Visit the 16-foot monolithic granite Nandi Bull midway up the hill."},
                    {"time": "07:00 PM", "title": "Mysore Palace 100,000 Golden Bulb Illumination", "loc": "Palace Grounds", "cat": "Heritage", "dur": 60, "transit": 15, "cost": 50, "tip": "Breathtaking visual spectacle accompanied by police band symphony."}
                ]
            }
        ]
    },

    # ─── RAJASTHAN ───
    "udaipur": {
        "name": "Udaipur",
        "state": "Rajasthan",
        "terrain": "cultural_heritage",
        "aliases": ["udaipur", "lake city", "mewar", "उदयपुर", "উদয়পুর"],
        "gateway_airport": "Maharana Pratap Airport Udaipur (UDR - 22 km)",
        "gateway_rail": "Udaipur City Railway Station (UDZ) / Vande Bharat Express to Jaipur & Delhi",
        "local_transit_desc": "Electric autos for old-city lanes, solar boat cruises across Lake Pichola, and point-to-point heritage cabs",
        "permit_info": "City Palace museum composite tickets, Lake Pichola boat tokens, and Bagore Ki Haveli evening cultural pass",
        "emergency_hospital": "Maharana Bhupal Government Hospital & Apex Multi-Specialty Trauma Center Udaipur (Ph: 0294-2453501)",
        "culinary_specialties": [
            {"name": "Traditional Mewari Dal Baati Churma with pure ghee", "price": 300},
            {"name": "Pyaaz Kachori & Jalebi at Jagdish Chowk", "price": 90},
            {"name": "Ker Sangri with bajra roti", "price": 280}
        ],
        "hotels": [
            {"name": "Lake Pichola Heritage Haveli & Rooftop", "category": "Heritage Boutique", "price": 3200, "rating": 4.8, "location": "Lal Ghat, Udaipur"},
            {"name": "Fateh Garh Heritage Palace & Sanctuary", "category": "Hilltop Heritage Resort", "price": 7500, "rating": 4.9, "location": "Sisarma, Udaipur"}
        ],
        "clusters": [
            {
                "theme": "Palaces of Lake Pichola & Old City Citadel",
                "area": "City Palace & Lal Ghat Cluster",
                "activities": [
                    {"time": "08:30 AM", "title": "Breakfast of Pyaaz Kachori & Masala Chai", "loc": "Jagdish Chowk", "cat": "Food", "dur": 45, "transit": 0, "cost": 90, "tip": "Iconic crunchy onion kachoris fresh from traditional halwai kadhais."},
                    {"time": "09:30 AM", "title": "Guided Tour of Grand City Palace Complex", "loc": "City Palace Udaipur", "cat": "Heritage", "dur": 150, "transit": 10, "cost": 400, "tip": "Marvel at Sheesh Mahal, peacock mosaic courtyard, and silver royal carriage."},
                    {"time": "12:15 PM", "title": "Jagdish Temple (1651 AD Indo-Aryan Stone Architecture)", "loc": "Jagdish Mandir", "cat": "Heritage", "dur": 45, "transit": 5, "cost": 0, "tip": "Intricately carved 79-foot high spire with sculpted stone elephants."},
                    {"time": "01:30 PM", "title": "Authentic Mewari Dal Baati Churma Feast", "loc": "Old City Courtyard", "cat": "Food", "dur": 75, "transit": 10, "cost": 320, "tip": "Baatis crushed by hand and soaked in spiced ghee with 5-lentil dal."},
                    {"time": "03:30 PM", "title": "Lake Pichola Sunset Boat Cruise to Jag Mandir Palace", "loc": "Rameshwar Ghat", "cat": "Adventure", "dur": 90, "transit": 15, "cost": 650, "tip": "Unbeatable views of the sun dipping behind the Aravalli hills reflecting on water."},
                    {"time": "06:30 PM", "title": "Dharohar Folk Dance & Puppet Show at Bagore Ki Haveli", "loc": "Gangaur Ghat", "cat": "Heritage", "dur": 75, "transit": 10, "cost": 150, "tip": "Electrifying Rajasthani Chari, Terah Taal, and Bhavai pot-balancing performance."}
                ]
            }
        ]
    },

    "jodhpur": {
        "name": "Jodhpur",
        "state": "Rajasthan",
        "terrain": "cultural_heritage",
        "aliases": ["jodhpur", "blue city", "sun city", "mehrangarh", "जोधपुर"],
        "gateway_airport": "Jodhpur Airport (JDH - 5 km)",
        "gateway_rail": "Jodhpur Junction (JU) / Direct Superfast connects across India",
        "local_transit_desc": "Blue city heritage e-rickshaws, zip-lining across fort battlements, and local taxis",
        "permit_info": "Mehrangarh Fort audio guide composite pass and Flying Fox zipline ticket",
        "emergency_hospital": "AIIMS Jodhpur Apex Multi-Specialty Trauma Hospital (Ph: 0291-2740741)",
        "culinary_specialties": [
            {"name": "Mawa Kachori & Shahi Samosa at Janta Sweet Home", "price": 100},
            {"name": "Mirchi Bada & Makhaniya Lassi at Clock Tower", "price": 80},
            {"name": "Traditional Marwari Ker Sangri & Bajre Ki Roti", "price": 260}
        ],
        "hotels": [
            {"name": "Pal Haveli Heritage Hotel", "category": "Heritage Haveli", "price": 3500, "rating": 4.8, "location": "Gulab Sagar, Jodhpur"},
            {"name": "Umaid Bhawan Palace Jodhpur", "category": "Ultra Luxury Art Deco Palace", "price": 42000, "rating": 5.0, "location": "Circuit House Road"}
        ],
        "clusters": [
            {
                "theme": "Mehrangarh Citadel & Blue City Brahmin Quarters",
                "area": "Mehrangarh & Navchokiya Cluster",
                "activities": [
                    {"time": "08:30 AM", "title": "Mirchi Bada & Makhaniya Lassi Breakfast", "loc": "Clock Tower Bazaar", "cat": "Food", "dur": 45, "transit": 0, "cost": 90, "tip": "Famous potato-stuffed green chilies deep fried in spiced gram flour."},
                    {"time": "09:30 AM", "title": "Mehrangarh Fort (Perched 410 ft above city)", "loc": "Mehrangarh Citadel", "cat": "Heritage", "dur": 150, "transit": 15, "cost": 200, "tip": "One of India's largest and most formidable forts with cannonball battle scars."},
                    {"time": "12:30 PM", "title": "Flying Fox Zip-Line across Fort Chasm & Desert Lakes", "loc": "Mehrangarh Battlements", "cat": "Adventure", "dur": 90, "transit": 0, "cost": 1400, "tip": "Six aerial zip lines gliding above medieval ramparts and Rao Jodha Park."},
                    {"time": "02:30 PM", "title": "Traditional Marwari Thali Lunch", "loc": "Sadar Market", "cat": "Food", "dur": 60, "transit": 10, "cost": 250, "tip": "Gatte ki sabzi, ker sangri, and warm bajra roti."},
                    {"time": "04:00 PM", "title": "Jaswant Thada (The White Marble Taj Mahal of Marwar)", "loc": "Mehrangarh Ridge", "cat": "Heritage", "dur": 60, "transit": 10, "cost": 50, "tip": "Ornate cenotaph built with translucent Makrana marble sheets."},
                    {"time": "05:30 PM", "title": "Blue City Walking Tour through Navchokiya Alleyways", "loc": "Navchokiya", "cat": "Heritage", "dur": 90, "transit": 15, "cost": 0, "tip": "Walk through indigo-blue painted houses that naturally deflect desert heat."}
                ]
            }
        ]
    },

    "jaisalmer": {
        "name": "Jaisalmer",
        "state": "Rajasthan",
        "terrain": "cultural_heritage",
        "aliases": ["jaisalmer", "golden city", "thar desert", "जैसलमेर"],
        "gateway_airport": "Jaisalmer Airport (JSA) / Jodhpur Airport (JDH - 280 km)",
        "gateway_rail": "Jaisalmer Railway Station (JSM) with direct desert express connects",
        "local_transit_desc": "Desert camel safaris, 4x4 dune-bashing gypsies, and walking through living fort bastions",
        "permit_info": "Desert National Park permit and Sam sand dunes camel safari ticket",
        "emergency_hospital": "Jawahar Government District Hospital Jaisalmer (Ph: 02992-252343)",
        "culinary_specialties": [
            {"name": "Authentic Desert Ker Sangri with Bajra Roti & White Butter", "price": 280},
            {"name": "Ghotua Ladoo from Dhanraj Ranmal Bhatia (300-year-old shop)", "price": 120},
            {"name": "Kadhi Pakoda & Pyaz Kachori", "price": 100}
        ],
        "hotels": [
            {"name": "Fort Heritage Living Haveli", "category": "Fort Living Stay", "price": 2800, "rating": 4.8, "location": "Inside Golden Fort Bastion"},
            {"name": "Suryagarh Luxury Desert Fortress", "category": "Luxury Desert Palace", "price": 18000, "rating": 4.9, "location": "Kahala Phata, Sam Road"}
        ],
        "clusters": [
            {
                "theme": "Sonar Qila (Living Golden Fort) & Patwon Ki Haveli",
                "area": "Jaisalmer Fort & Sam Dunes",
                "activities": [
                    {"time": "08:30 AM", "title": "Breakfast with Pyaaz Kachori & Masala Tea", "loc": "Gopa Chowk", "cat": "Food", "dur": 45, "transit": 0, "cost": 80, "tip": "Enjoy fresh kachori under the imposing yellow sandstone fort gate."},
                    {"time": "09:30 AM", "title": "Sonar Qila (Only Living Fort in India with 4,000 Residents)", "loc": "Jaisalmer Fort", "cat": "Heritage", "dur": 150, "transit": 5, "cost": 100, "tip": "Built in 1156 AD without mortar, featuring 7 ornate Jain temples."},
                    {"time": "12:30 PM", "title": "Patwon Ki Haveli (Intricate Filigree Stone Jharokhas)", "loc": "Old City Lanes", "cat": "Heritage", "dur": 75, "transit": 10, "cost": 100, "tip": "Cluster of 5 grand merchant havelis with lace-like yellow sandstone carvings."},
                    {"time": "02:00 PM", "title": "Traditional Rajasthani Thali Lunch", "loc": "Fort View Terrace", "cat": "Food", "dur": 60, "transit": 10, "cost": 260, "tip": "Overlooking the desert plain."},
                    {"time": "03:30 PM", "title": "Drive to Sam Sand Dunes & Camel Caravan Safari", "loc": "Thar Desert, Sam Dunes", "cat": "Adventure", "dur": 120, "transit": 45, "cost": 650, "tip": "Glide across rolling desert dunes towards the dramatic sunset horizon."},
                    {"time": "07:30 PM", "title": "Kalbeliya Desert Folk Dance & Campfire Dinner", "loc": "Desert Camp Dunes", "cat": "Heritage", "dur": 120, "transit": 0, "cost": 500, "tip": "Hypnotic snake-dance rhythms, Manganiyar music, and starlit buffet."}
                ]
            }
        ]
    },

    # ─── HIMALAYAS & HILL STATIONS ───
    "darjeeling": {
        "name": "Darjeeling",
        "state": "West Bengal",
        "terrain": "mountain_hill_station",
        "aliases": ["darjeeling", "queen of the hills", "दार्जिलिंग", "দার্জিলিং"],
        "gateway_airport": "Bagdogra International Airport (IXB - 68 km, 2.5-hr mountain scenic drive)",
        "gateway_rail": "New Jalpaiguri Junction (NJP - 72 km) / Darjeeling Himalayan Railway (DHR UNESCO Toy Train)",
        "local_transit_desc": "UNESCO DHR Toy Train, shared 4WD Tata Sumos, and charming hillside pedestrian walking promenades",
        "permit_info": "Tiger Hill sunrise entry tokens, HMI zoo composite tickets, and DHR joyride heritage reservation",
        "emergency_hospital": "District Sadar Hospital Darjeeling (Ph: 0354-2254218) / North Bengal Medical College Siliguri",
        "culinary_specialties": [
            {"name": "Steamed Darjeeling Pork/Chicken/Veg Momos with fiery dalle paste", "price": 140},
            {"name": "Piping hot Thukpa noodle soup with wild mountain herbs", "price": 160},
            {"name": "First Flush Muscatel Darjeeling Tea at Glenary's Bakery", "price": 180}
        ],
        "hotels": [
            {"name": "Cedar Inn Boutique Himalayan Lodge", "category": "Mountain View Lodge", "price": 3400, "rating": 4.7, "location": "Jalapahar, Darjeeling"},
            {"name": "Glenburn Tea Estate Planter's Bungalow", "category": "Heritage Tea Estate", "price": 12500, "rating": 4.9, "location": "Glenburn Tea Estate"}
        ],
        "clusters": [
            {
                "theme": "Tiger Hill Golden Sunrise & Toy Train Heritage",
                "area": "Tiger Hill & Ghoom Ridge",
                "activities": [
                    {"time": "04:30 AM", "title": "Tiger Hill Sunrise over Mount Kanchenjunga (8,586 m)", "loc": "Tiger Hill Observation Deck", "cat": "Nature", "dur": 120, "transit": 45, "cost": 150, "tip": "Watch the dawn sun turn the world's 3rd highest mountain golden pink."},
                    {"time": "07:30 AM", "title": "Batasia Loop & Gorkha War Memorial", "loc": "Batasia Loop, Ghoom", "cat": "Heritage", "dur": 60, "transit": 15, "cost": 50, "tip": "Watch the toy train loop 360 degrees around landscaped alpine flower gardens."},
                    {"time": "08:45 AM", "title": "Yiga Choeling Ghoom Monastery", "loc": "Ghoom", "cat": "Heritage", "dur": 60, "transit": 10, "cost": 0, "tip": "Oldest Tibetan monastery housing a 15-foot Maitreya Buddha."},
                    {"time": "10:30 AM", "title": "Breakfast at Glenary's Bakery", "loc": "Nehru Road, Mall", "cat": "Food", "dur": 60, "transit": 20, "cost": 280, "tip": "Legendary British-era bakery overlooking snow peaks."},
                    {"time": "12:00 PM", "title": "UNESCO Darjeeling Himalayan Railway Joyride to Ghoom & Back", "loc": "Darjeeling Station", "cat": "Adventure", "dur": 120, "transit": 10, "cost": 1000, "tip": "Heritage steam-engine puffing through pine forests and mountain ridges."},
                    {"time": "03:00 PM", "title": "Lunch of Authentic Steamed Momos & Thukpa", "loc": "Chowrasta Mall", "cat": "Food", "dur": 60, "transit": 10, "cost": 220, "tip": "Served with spicy pickled radish and hot broth."},
                    {"time": "04:30 PM", "title": "Chowrasta Mall Road Leisure Walk & Sunset View", "loc": "The Mall, Darjeeling", "cat": "Rest", "dur": 90, "transit": 0, "cost": 0, "tip": "Vehicle-free open square with panoramic valley benches."}
                ]
            }
        ]
    },

    "rishikesh": {
        "name": "Rishikesh",
        "state": "Uttarakhand",
        "terrain": "mountain_hill_station",
        "aliases": ["rishikesh", "yoga capital", "ऋषिकेश", "ঋষিকেশ"],
        "gateway_airport": "Dehradun Jolly Grant Airport (DED - 21 km)",
        "gateway_rail": "Yog Nagari Rishikesh (YNRK) / Haridwar Junction (HW - 25 km)",
        "local_transit_desc": "Electric autos, shared vikrams, pedestrian suspension bridge crossings, and river rafting expeditions",
        "permit_info": "Ganga river rafting safety permits and Beatles Ashram tickets",
        "emergency_hospital": "AIIMS Rishikesh Apex Multi-Specialty Trauma Center (24/7 Level-1 Trauma - Ph: 0135-2462940)",
        "culinary_specialties": [
            {"name": "Organic Ayurvedic Kitchari & Sattvic Herbal Thali", "price": 220},
            {"name": "Aloo Poori & Jalebi at Chotiwala Restaurant Swargashram", "price": 150},
            {"name": "Fresh Ginger Lemon Honey Tea & Wood-Fired Pizza in Tapovan", "price": 280}
        ],
        "hotels": [
            {"name": "Ganga Kinare - A Riverside Boutique Hotel", "category": "Riverside Heritage", "price": 4200, "rating": 4.8, "location": "Veerbhadra Road, Rishikesh"},
            {"name": "Zostel Rishikesh Eco-Hostel & Cottages", "category": "Budget Adventure Stay", "price": 1400, "rating": 4.7, "location": "Tapovan, Rishikesh"}
        ],
        "clusters": [
            {
                "theme": "Sacred Ghats & Ganga Evening Aarti",
                "area": "Ram Jhula & Triveni Ghat Corridor",
                "activities": [
                    {"time": "06:30 AM", "title": "Morning Sunrise Pranayama & Yoga on Ganga River Beach", "loc": "Nim Beach / Tapovan Ghat", "cat": "Rest", "dur": 90, "transit": 0, "cost": 0, "tip": "Feel the brisk Himalayan mountain breeze along pristine turquoise river waters."},
                    {"time": "08:30 AM", "title": "Healthy Organic Breakfast Bowl & Cold-Pressed Juice", "loc": "Tapovan Cafe", "cat": "Food", "dur": 60, "transit": 10, "cost": 220, "tip": "Sprouted muesli, fresh papaya, and herbal tea."},
                    {"time": "10:00 AM", "title": "Ram Jhula & Iconic Geeta Bhawan Murals", "loc": "Ram Jhula Suspension Bridge", "cat": "Heritage", "dur": 90, "transit": 15, "cost": 0, "tip": "Cross the suspension footbridge; feed holy fish at the ghat steps."},
                    {"time": "12:00 PM", "title": "Beatles Ashram (Chaurasi Kutia) Ruins & Graffiti Gallery", "loc": "Swargashram Forest Edge", "cat": "Heritage", "dur": 120, "transit": 15, "cost": 150, "tip": "Where the Beatles wrote the White Album in 1968 under Maharishi Mahesh Yogi."},
                    {"time": "02:30 PM", "title": "Traditional Garhwali Thali Lunch", "loc": "Swargashram", "cat": "Food", "dur": 60, "transit": 15, "cost": 240, "tip": "Kafuli spinach gravy, chainsoo dal, and mandua roti."},
                    {"time": "05:30 PM", "title": "Grand Maha Aarti at Triveni Ghat (Diyas on the River)", "loc": "Triveni Ghat", "cat": "Heritage", "dur": 90, "transit": 20, "cost": 0, "tip": "Mesmerizing brass lamps, vedic chants, and floating marigold diyas on the Ganga."}
                ]
            }
        ]
    },

    "manali": {
        "name": "Manali",
        "state": "Himachal Pradesh",
        "terrain": "mountain_hill_station",
        "aliases": ["manali", "solang", "old manali", "मनाली"],
        "gateway_airport": "Kullu-Manali Airport Bhuntar (KUU - 50 km) / Chandigarh Airport (IXC - 310 km)",
        "gateway_rail": "Chandigarh Railway Station (CDG) / Vande Bharat with mountain road connection",
        "local_transit_desc": "Local mountain cabs, shared sumos to Solang/Atal Tunnel, and gearless scooters",
        "permit_info": "Rohtang Pass green permit (National Green Tribunal pass) and Atal Tunnel toll clearance",
        "emergency_hospital": "Civil Hospital Manali / Lady Willingdon Hospital (Ph: 01902-252315)",
        "culinary_specialties": [
            {"name": "Himachali Siddu with melted pure desi ghee & walnut chutney", "price": 140},
            {"name": "Trout Fish Tandoori freshly caught from the Tirthan/Beas river", "price": 450},
            {"name": "Piping hot Thukpa and apple crumble in Old Manali", "price": 180}
        ],
        "hotels": [
            {"name": "Old Manali Riverside Eco-Cottages", "category": "Mountain View Lodge", "price": 2600, "rating": 4.8, "location": "Old Manali Village"},
            {"name": "The Himalayan Castle Resort", "category": "Luxury Heritage Castle", "price": 14000, "rating": 4.9, "location": "Hadimba Road, Manali"}
        ],
        "clusters": [
            {
                "theme": "Cedar Forest Temples & Old Manali Vibe",
                "area": "Hadimba & Old Manali Village",
                "activities": [
                    {"time": "08:30 AM", "title": "Breakfast of Fresh Siddu & Herbal Honey Tea", "loc": "Old Manali Cafe", "cat": "Food", "dur": 60, "transit": 0, "cost": 180, "tip": "Steamed fermented wheat bun filled with walnut, poppy seed, and spices."},
                    {"time": "09:45 AM", "title": "Hadimba Devi Temple in Ancient Deodar Forest", "loc": "Dhungri Van Vihar", "cat": "Heritage", "dur": 90, "transit": 10, "cost": 0, "tip": "1553 AD pagoda-style wooden temple with exquisitely carved wooden doorway."},
                    {"time": "11:30 AM", "title": "Manu Temple Walk through Traditional Apple Orchards", "loc": "Old Manali Village", "cat": "Heritage", "dur": 75, "transit": 10, "cost": 0, "tip": "Historic shrine dedicated to Sage Manu, progenitor of human race in Hindu lore."},
                    {"time": "01:00 PM", "title": "Trout Fish or Himachali Dham Lunch", "loc": "Beas Riverfront Cafe", "cat": "Food", "dur": 60, "transit": 10, "cost": 380, "tip": "Pan-seared local trout seasoned with mountain rosemary and garlic butter."},
                    {"time": "02:30 PM", "title": "Vashisht Natural Sulfur Hot Springs & Stone Bath", "loc": "Vashisht Village", "cat": "Nature", "dur": 90, "transit": 15, "cost": 0, "tip": "Rejuvenating thermal mineral water spring high above the Beas river gorge."},
                    {"time": "04:30 PM", "title": "Jogini Waterfall Trek through Pine Canopy", "loc": "Jogini Falls Trail", "cat": "Adventure", "dur": 120, "transit": 10, "cost": 0, "tip": "Gentle 3 km nature hike to a spectacular 160-foot waterfall cascading over rock cliffs."}
                ]
            }
        ]
    },

    "spiti": {
        "name": "Spiti Valley",
        "state": "Himachal Pradesh",
        "terrain": "high_altitude_mountain",
        "aliases": ["spiti", "kaza", "kibber", "key monastery", "chandratal", "स्पीति"],
        "gateway_airport": "Bhuntar Airport Kullu (KUU - 245 km) / Chandigarh (IXC - 450 km)",
        "gateway_rail": "Shimla (narrow gauge) or Chandigarh (broad gauge) with 4x4 road transfer via Kinnaur/Manali",
        "local_transit_desc": "Certified 4x4 high-clearance mountain SUVs navigating rugged Kunzum Pass & river crossings",
        "permit_info": "Inner Line Permits for foreign nationals (via Reckong Peo/Kaza), wildlife conservation fee",
        "emergency_hospital": "Community Health Centre Kaza (Altitude 12,500 ft - Ph: 01906-222218)",
        "culinary_specialties": [
            {"name": "Spitian Seabuckthorn Tea (Rich in Vitamin C for altitude resilience)", "price": 80},
            {"name": "Barley Tsampa with Butter Tea and Steamed Tingmo bread", "price": 140},
            {"name": "Yak Cheese Momos and Warm Thukpa Noodle Stew", "price": 160}
        ],
        "hotels": [
            {"name": "Kaza Himalayan Homestay & Astrostay", "category": "Eco Mountain Homestay", "price": 1800, "rating": 4.8, "location": "Kaza, Spiti Valley"},
            {"name": "Grand Dewachen Hotel", "category": "Boutique High-Altitude Hotel", "price": 4500, "rating": 4.7, "location": "Rangrik Village, Spiti"}
        ],
        "clusters": [
            {
                "theme": "Key Monastery & Highest Inhabited Villages",
                "area": "Kaza & Kibber Ridge",
                "activities": [
                    {"time": "08:00 AM", "title": "Spitian Tsampa & Warm Butter Tea Breakfast", "loc": "Kaza Main Market", "cat": "Food", "dur": 60, "transit": 0, "cost": 140, "tip": "Roasted barley flour mixed with warm butter tea - the high-energy fuel of Spitian monks."},
                    {"time": "09:30 AM", "title": "Key Monastery (1,000-Year-Old Cliffside Fort-Monastery)", "loc": "Key Village (13,668 ft)", "cat": "Heritage", "dur": 150, "transit": 30, "cost": 0, "tip": "Fortress-like tiered monastery housing rare thangka paintings, ancient murals, and butter lamps."},
                    {"time": "12:30 PM", "title": "Kibber Village & Wildlife Sanctuary (Snow Leopard Habitat)", "loc": "Kibber (14,200 ft)", "cat": "Nature", "dur": 90, "transit": 20, "cost": 0, "tip": "One of the highest continuously inhabited villages in the world."},
                    {"time": "02:30 PM", "title": "Traditional Spitian Lunch with Tingmo & Stew", "loc": "Hikkim Village", "cat": "Food", "dur": 60, "transit": 30, "cost": 220, "tip": "Steamed flower-shaped Tibetan bread served with potato and mushroom stew."},
                    {"time": "04:00 PM", "title": "Send a Postcard from World's Highest Post Office", "loc": "Hikkim (14,567 ft)", "cat": "Heritage", "dur": 60, "transit": 0, "cost": 50, "tip": "Stamp and mail physical postcards bearing the world's highest post office seal to loved ones."},
                    {"time": "05:30 PM", "title": "Komic Village (World's Highest Motor-Road Connected Settlement)", "loc": "Komic (15,027 ft)", "cat": "Nature", "dur": 60, "transit": 15, "cost": 0, "tip": "Perched on wind-sculpted barren ridges beneath crystal clear sapphire skies."}
                ]
            }
        ]
    },

    "amritsar": {
        "name": "Amritsar",
        "state": "Punjab",
        "terrain": "cultural_heritage",
        "aliases": ["amritsar", "golden temple", "ambarsar", "अमृतसर", "অমৃতসর"],
        "gateway_airport": "Sri Guru Ram Dass Jee International Airport Amritsar (ATQ - 11 km)",
        "gateway_rail": "Amritsar Junction (ASR) / Vande Bharat Express to New Delhi",
        "local_transit_desc": "Free Golden Temple e-rickshaws, eco-buses, and guided Wagah border taxis",
        "permit_info": "Free entry to Golden Temple; Wagah Border VIP viewing gate pass",
        "emergency_hospital": "Guru Nanak Dev Government Medical College & Hospital Amritsar (Ph: 0183-2573200)",
        "culinary_specialties": [
            {"name": "Amritsari Kulcha with spicy chole and tamarind-onion chutney", "price": 120},
            {"name": "Holy Langar Meal at Sri Harmandir Sahib", "price": 0},
            {"name": "Thick Sweet Malai Lassi at Ahuja Lassi Bar", "price": 80}
        ],
        "hotels": [
            {"name": "Hyatt Regency Amritsar", "category": "Luxury City Hotel", "price": 5500, "rating": 4.8, "location": "MBM Farms, Amritsar"},
            {"name": "Aura Heritage Homestay", "category": "Heritage Homestay", "price": 2200, "rating": 4.7, "location": "Near Golden Temple"}
        ],
        "clusters": [
            {
                "theme": "Spiritual Divinity & Independence Memorials",
                "area": "Golden Temple & Heritage Street",
                "activities": [
                    {"time": "05:00 AM", "title": "Palki Sahib Ceremony at Sri Harmandir Sahib", "loc": "Golden Temple Sanctum", "cat": "Heritage", "dur": 120, "transit": 0, "cost": 0, "tip": "Golden sanctum shimmering over the nectar pool amidst dawn gurbani kirtan."},
                    {"time": "07:30 AM", "title": "Langar Seva (Volunteering in the Community Kitchen)", "loc": "Guru Ram Das Langar Hall", "cat": "Rest", "dur": 60, "transit": 5, "cost": 0, "tip": "Experience unconditional community service serving 100,000 pilgrims daily."},
                    {"time": "09:00 AM", "title": "World-Famous Amritsari Kulcha Breakfast", "loc": "Heritage Street", "cat": "Food", "dur": 60, "transit": 10, "cost": 120, "tip": "Flaky potato-paneer stuffed bread baked crisp in traditional clay tandoors."},
                    {"time": "10:30 AM", "title": "Jallianwala Bagh Memorial & Bullet Marks Wall", "loc": "Jallianwala Bagh", "cat": "Heritage", "dur": 90, "transit": 5, "cost": 0, "tip": "Pay solemn respects at the Amar Jawan Jyoti and historic Martyrs' Well."},
                    {"time": "12:30 PM", "title": "Partition Museum (World's First Museum of Partition)", "loc": "Town Hall", "cat": "Heritage", "dur": 100, "transit": 10, "cost": 20, "tip": "Deeply moving personal oral histories, letters, and refugee artifacts."},
                    {"time": "02:30 PM", "title": "Drive to Wagah Border & Seat Allocation", "loc": "GT Road to Attari", "cat": "Transit", "dur": 60, "transit": 45, "cost": 350, "tip": "Arrive early by 3:30 PM to secure prime front-row stands."},
                    {"time": "04:30 PM", "title": "Wagah Border Beating Retreat & Flag-Lowering Ceremony", "loc": "Attari-Wagah Border", "cat": "Heritage", "dur": 120, "transit": 0, "cost": 0, "tip": "High-octane drills, goose-stepping BSF sentries, and patriotic fervor."}
                ]
            }
        ]
    },

    "varanasi": {
        "name": "Varanasi",
        "state": "Uttar Pradesh",
        "terrain": "cultural_heritage",
        "aliases": ["varanasi", "kashi", "banaras", "वाराणसी", "বারাণসী"],
        "gateway_airport": "Lal Bahadur Shastri International Airport Varanasi (VNS - 24 km)",
        "gateway_rail": "Varanasi Junction (BSB) / Banaras (BSBS) / Vande Bharat Express",
        "local_transit_desc": "Hand-rowed wooden sunrise boats on the Ganga, electric e-rickshaws, and labyrinthine alleyway walks",
        "permit_info": "Kashi Vishwanath Corridor express darshan tokens and Sarnath archaeological museum ticket",
        "emergency_hospital": "Sir Sunderlal Hospital, IMS Banaras Hindu University (BHU) Apex Trauma Center (Ph: 0542-2369291)",
        "culinary_specialties": [
            {"name": "Banarasi Kachori Sabzi & Jalebi at Ram Bhandar Thatheri Bazaar", "price": 70},
            {"name": "Creamy Blue Lassi or Malaiyo (Saffron winter milk foam)", "price": 80},
            {"name": "Traditional Banarasi Paan with sweet gulkand and spices", "price": 50}
        ],
        "hotels": [
            {"name": "BrijRama Palace Heritage Hotel", "category": "Heritage Ghat Palace", "price": 16500, "rating": 4.9, "location": "Darbhanga Ghat, Varanasi"},
            {"name": "Ganga View Heritage Homestay", "category": "Riverside Homestay", "price": 2400, "rating": 4.8, "location": "Assi Ghat, Varanasi"}
        ],
        "clusters": [
            {
                "theme": "Dawn Boat Crossing, Ancient Ghats & Evening Ganga Aarti",
                "area": "Assi to Dashashwamedh Ghats",
                "activities": [
                    {"time": "05:30 AM", "title": "Subah-e-Banaras Dawn Boat Cruise on the River Ganga", "loc": "Assi Ghat to Manikarnika", "cat": "Nature", "dur": 120, "transit": 0, "cost": 450, "tip": "Watch holy sunrise baths, yoga routines, and hundreds of years of uninterrupted morning devotion."},
                    {"time": "08:00 AM", "title": "Banarasi Kachori Sabzi & Jalebi Breakfast", "loc": "Kachori Gali", "cat": "Food", "dur": 60, "transit": 15, "cost": 80, "tip": "Freshly fried puris served with spiced chickpea and potato curry."},
                    {"time": "09:30 AM", "title": "Kashi Vishwanath Temple & Ganga Corridor Pilgrimage", "loc": "Vishwanath Gali", "cat": "Heritage", "dur": 120, "transit": 10, "cost": 0, "tip": "One of the 12 sacred Jyotirlingas, newly connected directly to the holy riverfront."},
                    {"time": "12:30 PM", "title": "Heritage Silk Weaving Cooperative Walk in Madanpura", "loc": "Madanpura Weavers Quarter", "cat": "Heritage", "dur": 90, "transit": 15, "cost": 0, "tip": "Observe master weavers interlacing pure gold zari threads on traditional pit looms."},
                    {"time": "02:30 PM", "title": "Banarasi Thali Lunch at Baati Chokha", "loc": "Teliyabag", "cat": "Food", "dur": 60, "transit": 15, "cost": 240, "tip": "Wheat balls roasted on cow-dung cake embers served with roasted brinjal chokha."},
                    {"time": "04:00 PM", "title": "Sarnath Deer Park & Dhamek Stupa Excursion (Where Buddha First Preached)", "loc": "Sarnath (10 km)", "cat": "Heritage", "dur": 120, "transit": 25, "cost": 40, "tip": "Ancient 5th-century cylindrical stupa marking the birthplace of Buddhism."},
                    {"time": "06:30 PM", "title": "Grand Maha Ganga Aarti from a River Boat", "loc": "Dashashwamedh Ghat", "cat": "Heritage", "dur": 75, "transit": 25, "cost": 300, "tip": "Seven young priests moving tiered brass fire lamps in perfect synchronization."}
                ]
            }
        ]
    },

    "pondicherry": {
        "name": "Pondicherry (Puducherry)",
        "state": "Puducherry",
        "terrain": "coastal_beach",
        "aliases": ["pondicherry", "puducherry", "pondy", "auroville", "पांडिचेरी", "পন্ডিচেরি"],
        "gateway_airport": "Chennai International Airport (MAA - 135 km) / Puducherry Airport (PNY)",
        "gateway_rail": "Puducherry Railway Station (PDY) / Villupuram Junction (VM - 38 km)",
        "local_transit_desc": "Vintage bicycles, electric scooters, and breezy coastal autorickshaws along French colonial boulevards",
        "permit_info": "Auroville Matrimandir inner meditation chamber pass and Chunnambar boat token",
        "emergency_hospital": "JIPMER 24/7 Apex Trauma Center (Ph: 0413-2296000)",
        "culinary_specialties": [
            {"name": "Franco-Tamil Crepes with salted caramel and espresso", "price": 220},
            {"name": "Seafood Bouillabaisse or Meen Kuzhambu (Tangy fish curry)", "price": 340},
            {"name": "Fresh Sourdough Baguettes & Croissants at Baker Street", "price": 180}
        ],
        "hotels": [
            {"name": "Villa Shanti Heritage French Quarter", "category": "Heritage Boutique", "price": 4500, "rating": 4.8, "location": "Suffren Street, White Town"},
            {"name": "Auroville Bamboo Eco-Homestay", "category": "Eco Homestay", "price": 1900, "rating": 4.7, "location": "Kottakarai, Auroville"}
        ],
        "clusters": [
            {
                "theme": "French Quarter & Spiritual Auroville",
                "area": "White Town & Auroville Corridor",
                "activities": [
                    {"time": "07:30 AM", "title": "Promenade Beach Walk by French War Memorial", "loc": "Goubert Avenue", "cat": "Nature", "dur": 60, "transit": 0, "cost": 0, "tip": "Traffic-free morning coastal ocean promenade facing the Bay of Bengal."},
                    {"time": "08:45 AM", "title": "French Bakery Breakfast at Baker Street", "loc": "Bussy Street, White Town", "cat": "Food", "dur": 60, "transit": 10, "cost": 240, "tip": "Flaky butter croissants, quiches, and pain au chocolat."},
                    {"time": "10:00 AM", "title": "Sri Aurobindo Ashram Tranquility & Meditation", "loc": "Rue de la Marine", "cat": "Heritage", "dur": 60, "transit": 10, "cost": 0, "tip": "Floral samadhi courtyard preserved in meditative absolute quiet."},
                    {"time": "11:30 AM", "title": "Heritage Cycle Tour of Mustard Yellow French Villas", "loc": "White Town French Quarter", "cat": "Adventure", "dur": 90, "transit": 0, "cost": 150, "tip": "Pedal past colonial arched balconies and cobbled street signboards in French."},
                    {"time": "01:30 PM", "title": "Franco-Tamil Fusion Lunch at Cafe des Arts", "loc": "Suffren Street", "cat": "Food", "dur": 75, "transit": 10, "cost": 350, "tip": "Enjoy savory galettes, baguettes, and fresh iced hibiscus tea."},
                    {"time": "03:30 PM", "title": "Auroville Matrimandir (Golden Geodesic Dome Viewing)", "loc": "Auroville Universal City", "cat": "Heritage", "dur": 120, "transit": 25, "cost": 0, "tip": "Marvel at the giant golden sphere surrounded by 12 petal gardens."}
                ]
            }
        ]
    },

    "kodaikanal": {
        "name": "Kodaikanal",
        "state": "Tamil Nadu",
        "terrain": "mountain_hill_station",
        "aliases": ["kodaikanal", "kodai", "princess of hill stations", "कोडाइकनाल"],
        "gateway_airport": "Madurai Airport (IXM - 120 km) / Coimbatore Airport (CJB - 175 km)",
        "gateway_rail": "Kodai Road Railway Station (KQN - 80 km) with hill taxi connects",
        "local_transit_desc": "Local hill taxis, tandem bicycles around Kodai lake, and pine forest hiking trails",
        "permit_info": "Berijam lake forest entry permit and Pillar rocks viewpoint pass",
        "emergency_hospital": "Van Allen Hospital & Kodaikanal Government Hospital (Ph: 04542-241273)",
        "culinary_specialties": [
            {"name": "Homemade Handcrafted Kodaikanal Dark Chocolates", "price": 120},
            {"name": "Hot Steaming Masala Chai with freshly fried chili bhajis at Coaker's Walk", "price": 50},
            {"name": "Chettinad Pepper Chicken / Mushroom Roast with Appam", "price": 240}
        ],
        "hotels": [
            {"name": "The Carlton Kodaikanal (Colonial Lakefront)", "category": "Luxury Lake Resort", "price": 8500, "rating": 4.8, "location": "Lake Road, Kodaikanal"},
            {"name": "Pine Tree Mist Eco-Homestay", "category": "Eco Mountain Homestay", "price": 2200, "rating": 4.7, "location": "Fern Hill, Kodaikanal"}
        ],
        "clusters": [
            {
                "theme": "Misty Lakes, Pine Forests & Cloud-Walk Ridges",
                "area": "Kodai Lake & Pillar Rocks Corridor",
                "activities": [
                    {"time": "08:00 AM", "title": "Morning Lakeside Bicycle Ride & Boat Row", "loc": "Kodai Star-Shaped Lake", "cat": "Nature", "dur": 90, "transit": 0, "cost": 250, "tip": "Artificial 1863 lake shrouded in early morning drifting fog."},
                    {"time": "09:45 AM", "title": "Breakfast of South Indian Pongal & Filter Coffee", "loc": "Seven Roads Junction", "cat": "Food", "dur": 45, "transit": 10, "cost": 110, "tip": "Ghee-laden ven pongal with sambar and medu vada."},
                    {"time": "10:45 AM", "title": "Coaker's Walk (Panoramic Cloud-Edge Pedestrian Walk)", "loc": "Coaker's Walk Trail", "cat": "Nature", "dur": 60, "transit": 10, "cost": 30, "tip": "Breathtaking valley drops; look out for the rare Brocken Spectre phenomenon."},
                    {"time": "12:00 PM", "title": "Pillar Rocks (Three 400-ft Vertical Granite Boulders)", "loc": "Pillar Rocks Point", "cat": "Nature", "dur": 60, "transit": 15, "cost": 20, "tip": "Dramatic granite pillars vanishing and reappearing in swift mist."},
                    {"time": "01:30 PM", "title": "Lunch of Spicy Chettinad Pepper Curry", "loc": "Observatory Road", "cat": "Food", "dur": 60, "transit": 10, "cost": 280, "tip": "Fresh black pepper and coconut based gravy served with flaky parottas."},
                    {"time": "03:00 PM", "title": "Pine Forest Wilderness Trail & Guna Caves (Devil's Kitchen)", "loc": "Pine Forest", "cat": "Adventure", "dur": 90, "transit": 15, "cost": 20, "tip": "Dense plantation of British-planted pine trees with sunlight filtering through moss."},
                    {"time": "05:00 PM", "title": "Bryant Park Botanical Walk & Homemade Chocolate Shopping", "loc": "Bryant Park", "cat": "Rest", "dur": 75, "transit": 10, "cost": 50, "tip": "Sample fresh almond and chili chocolates made by local hill chocolatiers."}
                ]
            }
        ]
    },

    "khajuraho": {
        "name": "Khajuraho",
        "state": "Madhya Pradesh",
        "terrain": "cultural_heritage",
        "aliases": ["khajuraho", "kandariya", "खजुराहो"],
        "gateway_airport": "Khajuraho Airport (HJR - 5 km)",
        "gateway_rail": "Khajuraho Railway Station (KURJ) / Mahoba (63 km) / Vande Bharat connectivity",
        "local_transit_desc": "Eco-bicycles for touring the flat temple perimeter, e-rickshaws, and guided heritage walks",
        "permit_info": "ASI UNESCO Western Group composite ticket and evening sound & light show pass",
        "emergency_hospital": "Civil Hospital Khajuraho / District Hospital Chhatarpur (45 km - Ph: 07682-241250)",
        "culinary_specialties": [
            {"name": "Bundelkhandi Thali with Kadhi, Kodo Millet & Desi Ghee", "price": 220},
            {"name": "Khajuraho Special Jaleba & Samosa", "price": 70},
            {"name": "Bafla with spicy lentil gravy and mawa ladoo", "price": 200}
        ],
        "hotels": [
            {"name": "The Lalit Temple View Khajuraho", "category": "Luxury Temple View", "price": 6800, "rating": 4.8, "location": "Opposite Circuit House"},
            {"name": "Hotel Surya Heritage & Garden", "category": "Heritage Budget Hotel", "price": 1800, "rating": 4.6, "location": "Jain Temple Road"}
        ],
        "clusters": [
            {
                "theme": "UNESCO Temple Sculptures & Canyon Falls",
                "area": "Western Group & Raneh Falls",
                "activities": [
                    {"time": "08:00 AM", "title": "Breakfast of Poha Jalebi & Masala Tea", "loc": "Sevagram Bazaar", "cat": "Food", "dur": 45, "transit": 0, "cost": 70, "tip": "Crisp sweet jalebis with spicy poha."},
                    {"time": "09:00 AM", "title": "Western Group of Temples (Kandariya Mahadeva & Lakshmana)", "loc": "Western Group Complex", "cat": "Heritage", "dur": 180, "transit": 5, "cost": 500, "tip": "The pinnacle of Chandela dynasty architecture; 800+ sandstone sculptures depicting every aspect of life."},
                    {"time": "12:30 PM", "title": "Eastern Group of Jain Temples (Parsvanatha & Adinatha)", "loc": "Eastern Enclosure", "cat": "Heritage", "dur": 75, "transit": 10, "cost": 0, "tip": "Finely carved stone figurines and sacred Jain Tirthankara icons."},
                    {"time": "02:00 PM", "title": "Authentic Bundelkhandi Lunch", "loc": "Temple Road", "cat": "Food", "dur": 60, "transit": 10, "cost": 220, "tip": "Millet roti, wild berry chutney, and fragrant dal."},
                    {"time": "03:30 PM", "title": "Raneh Falls & Ken River Canyon (Pure Granite Crystalline Gorge)", "loc": "Ken River Sanctuary (20 km)", "cat": "Nature", "dur": 120, "transit": 30, "cost": 150, "tip": "Multicoloured pure crystalline granite canyon formed by volcanic basalt formations."},
                    {"time": "06:30 PM", "title": "UNESCO Sound and Light Show narrated by Amitabh Bachchan", "loc": "Western Group Lawns", "cat": "Heritage", "dur": 60, "transit": 25, "cost": 250, "tip": "Historic illuminated chronicle of the 1,000-year Chandela warrior kings."}
                ]
            }
        ]
    },

    "pachmarhi": {
        "name": "Pachmarhi",
        "state": "Madhya Pradesh",
        "terrain": "hilly",
        "aliases": ["pachmarhi", "satpura", "bee falls", "dhoopgarh", "पचमढ़ी"],
        "gateway_airport": "Raja Bhoj Airport Bhopal (BHO - 200 km) / Jabalpur Airport (JLR - 250 km)",
        "gateway_rail": "Pipariya Railway Station (PPI - 47 km) on Mumbai-Howrah mainline",
        "local_transit_desc": "Open 4x4 forest Gypsies authorized for Satpura National Park, rented scooters, and walking trails",
        "permit_info": "Satpura Tiger Reserve & Dhoopgarh sunset entry permit from MP Tourism",
        "emergency_hospital": "Pachmarhi Cantonment General Hospital / Community Health Centre Pipariya (Ph: 07576-222010)",
        "culinary_specialties": [
            {"name": "Traditional MP Dal Bafla with Churma & Ghee", "price": 200},
            {"name": "Wild Berry (Jamun & Mahua) Forest Honey & Herbal Teas", "price": 120},
            {"name": "Bhutte ka Kees (Spiced grated corn) & Poha Jalebi", "price": 90}
        ],
        "hotels": [
            {"name": "MPT Glen View Resort", "category": "Colonial Forest Resort", "price": 3800, "rating": 4.7, "location": "Near Golf Course, Pachmarhi"},
            {"name": "Satpura Wilderness Eco-Cottages", "category": "Eco Nature Lodge", "price": 2400, "rating": 4.6, "location": "Pipariya Road, Pachmarhi"}
        ],
        "clusters": [
            {
                "theme": "Canyon Waterfalls & Prehistoric Cave Trails",
                "area": "Bee Falls & Jata Shankar Corridor",
                "activities": [
                    {"time": "08:00 AM", "title": "Breakfast of Bhutte ka Kees & Masala Chai", "loc": "Pachmarhi Cantt Bazaar", "cat": "Food", "dur": 45, "transit": 0, "cost": 90, "tip": "Fresh local specialty prepared with grated corn, milk, and mustard tempering."},
                    {"time": "09:00 AM", "title": "Jata Shankar Sacred Limestone Cave & Natural Stalagmites", "loc": "Jata Shankar Gorge", "cat": "Heritage", "dur": 90, "transit": 10, "cost": 0, "tip": "Deep ravine cave resembling the matted hair of Lord Shiva with fresh spring streams."},
                    {"time": "11:00 AM", "title": "Bee Falls (Jamuna Prapat) Cascade Descent", "loc": "Bee Falls Chasm", "cat": "Nature", "dur": 120, "transit": 15, "cost": 60, "tip": "Famous 150-ft perennial waterfall cascading through dense sal forests; pristine natural bathing pool."},
                    {"time": "01:30 PM", "title": "Traditional Malwa & Bundelkhandi Lunch", "loc": "Subhash Chowk", "cat": "Food", "dur": 60, "transit": 15, "cost": 220, "tip": "Dal bafla, roasted tomato bharta, and warm jalebis."},
                    {"time": "03:00 PM", "title": "Pandava Caves & Apsara Vihar (Fairy Pool)", "loc": "Pandava Hills", "cat": "Heritage", "dur": 90, "transit": 10, "cost": 30, "tip": "Ancient rock-cut Buddhist caves dating to 9th century AD overlooking lush ravines."},
                    {"time": "05:00 PM", "title": "Dhoopgarh Sunset (Highest Peak in Central India - 4,429 ft)", "loc": "Dhoopgarh Viewpoint", "cat": "Nature", "dur": 90, "transit": 25, "cost": 50, "tip": "Glorious 360-degree sunset across the misty forested ridges of the Satpura Range."}
                ]
            }
        ]
    },

    "puri": {
        "name": "Puri",
        "state": "Odisha",
        "terrain": "cultural_heritage",
        "aliases": ["puri", "jagannath", "konark", "chilika", "पुरी", "পুরী"],
        "gateway_airport": "Biju Patnaik International Airport Bhubaneswar (BBI - 60 km, 1-hr highway expressway)",
        "gateway_rail": "Puri Railway Station (PURI) / Vande Bharat Express to Howrah & Rourkela",
        "local_transit_desc": "Blue Flag beach cycle rentals, shared auto-rickshaws, and Chilika lake eco-boats",
        "permit_info": "Chilika dolphin boating permit and Konark Sun Temple entry pass",
        "emergency_hospital": "District Headquarters Hospital Puri (Ph: 06752-222026) / AIIMS Bhubaneswar",
        "culinary_specialties": [
            {"name": "Holy Mahaprasad (Chhappan Bhog) from Jagannath Temple Ananda Bazar", "price": 150},
            {"name": "Authentic Odia Dalma with steamed arua rice & ghee", "price": 160},
            {"name": "Puri Khaja (Crispy layered sweet pastry) & Fresh Chhena Poda", "price": 90}
        ],
        "hotels": [
            {"name": "Mayfair Heritage Luxury Beach Resort", "category": "Luxury Beachfront", "price": 6500, "rating": 4.8, "location": "Chakratirtha Road, Puri"},
            {"name": "Puri Blue Flag Eco-Homestay", "category": "Eco Coastal Stay", "price": 2100, "rating": 4.7, "location": "Golden Beach, Puri"}
        ],
        "clusters": [
            {
                "theme": "Sacred Jagannath Shrine & Golden Beach Pacing",
                "area": "Grand Road & Golden Beach",
                "activities": [
                    {"time": "06:30 AM", "title": "Sunrise Walk on Blue Flag Certified Golden Beach", "loc": "Puri Golden Beach", "cat": "Nature", "dur": 75, "transit": 0, "cost": 20, "tip": "One of India's few internationally certified clean Blue Flag beaches."},
                    {"time": "08:00 AM", "title": "Breakfast of Puri Chana Tarkari & Hot Jalebi", "loc": "Badadanda (Grand Road)", "cat": "Food", "dur": 45, "transit": 10, "cost": 80, "tip": "Fresh fried puris with cumin-rich white chickpea curry."},
                    {"time": "09:00 AM", "title": "Shree Jagannath Temple Darshan & Megalithic Walls", "loc": "Bada Danda", "cat": "Heritage", "dur": 120, "transit": 5, "cost": 0, "tip": "One of the 4 holy Char Dham sites with mysterious wind-defying flag."},
                    {"time": "11:30 AM", "title": "Ananda Bazar: Savor Sacred Temple Mahaprasad", "loc": "Ananda Bazar Court", "cat": "Food", "dur": 60, "transit": 0, "cost": 150, "tip": "Cooked in 7 earthen pots stacked vertically over firewood."},
                    {"time": "01:00 PM", "title": "Raghurajpur Heritage Pattachitra Crafts Village", "loc": "Raghurajpur (14 km)", "cat": "Heritage", "dur": 120, "transit": 25, "cost": 0, "tip": "Village where every household preserves ancient palm-leaf engraving and scroll painting."},
                    {"time": "03:30 PM", "title": "UNESCO Konark Sun Temple (The Black Pagoda)", "loc": "Konark (35 km)", "cat": "Heritage", "dur": 120, "transit": 40, "cost": 40, "tip": "Giant 13th-century chariot of Sun God carved with 24 sun-dial wheels."},
                    {"time": "06:00 PM", "title": "Sunset at Chandrabhaga Beach", "loc": "Chandrabhaga", "cat": "Rest", "dur": 60, "transit": 5, "cost": 0, "tip": "Quiet pristine sandy beach where river Chandrabhaga meets the Bay of Bengal."}
                ]
            }
        ]
    },

    "coochbehar": {
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
                    {"time": "09:30 AM", "title": "Cooch Behar Royal Palace (Victor Jubilee Palace)", "loc": "Victor Jubilee Palace Complex", "cat": "Heritage", "dur": 150, "transit": 10, "cost": 50, "tip": "Modeled after Buckingham Palace in 1887 under Maharaja Nripendra Narayan; marvel at the classical Italian Renaissance facade."},
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
    },

    "thane": {
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
    },

    "pune": {
        "name": "Pune",
        "state": "Maharashtra",
        "terrain": "cultural_heritage",
        "aliases": ["pune", "poona", "पुणे"],
        "gateway_airport": "Pune International Airport (PNQ - Lohegaon)",
        "gateway_rail": "Pune Junction (PUNE) / Deccan Queen & Vande Bharat Express",
        "local_transit_desc": "Pune Metro Rail, PMPML air-conditioned buses, and autorickshaws",
        "permit_info": "ASI ticket for Aga Khan Palace & Shaniwar Wada",
        "emergency_hospital": "Jehangir Hospital / Ruby Hall Clinic Apex Trauma (Ph: 020-66455100)",
        "culinary_specialties": [
            {"name": "Kattar Puneri Misal Pav & Chitale Bandhu Bakarwadi", "price": 110},
            {"name": "Traditional Pithla Bhakri with fiery Thecha", "price": 140},
            {"name": "Sujata Mastani thick mango-icecream shake", "price": 120}
        ],
        "hotels": [
            {"name": "Hotel Shreyas Heritage Traditional Stay", "category": "Heritage Culture Stay", "price": 2600, "rating": 4.7, "location": "Deccan Gymkhana, Pune"},
            {"name": "Conrad Pune Luxury", "category": "Luxury City Hotel", "price": 8500, "rating": 4.9, "location": "Mangaldas Road, Pune"}
        ],
        "clusters": [
            {
                "theme": "Maratha Empire Legacy & Gandhi Memorial",
                "area": "Shaniwar Wada & Aga Khan Palace",
                "activities": [
                    {"time": "08:00 AM", "title": "Puneri Misal Pav Breakfast at KataKirr", "loc": "Karve Road", "cat": "Food", "dur": 45, "transit": 0, "cost": 110, "tip": "Classic fiery Maharashtrian misal served with fresh pav and curd."},
                    {"time": "09:15 AM", "title": "Historic Shaniwar Wada Peshwa Fort Ruins", "loc": "Bajirao Road", "cat": "Heritage", "dur": 90, "transit": 15, "cost": 25, "tip": "18th-century seat of the Peshwa rulers of the Maratha Empire with majestic Delhi Darwaza."},
                    {"time": "11:15 AM", "title": "Aga Khan Palace & Mahatma Gandhi Memorial", "loc": "Nagar Road", "cat": "Heritage", "dur": 90, "transit": 25, "cost": 25, "tip": "Historic Italian arches where Mahatma Gandhi and Kasturba Gandhi were interned in 1942."},
                    {"time": "01:15 PM", "title": "Authentic Maharashtrian Thali Lunch", "loc": "Deccan Gymkhana", "cat": "Food", "dur": 60, "transit": 20, "cost": 280, "tip": "Unlimited pure vegetarian meal with Puran Poli, Varan Bhaat, and Kothimbir Vadi."},
                    {"time": "03:30 PM", "title": "Sinhagad Fort Historic Hilltop Excursion", "loc": "Sinhagad Summit (30 km)", "cat": "Adventure", "dur": 120, "transit": 45, "cost": 50, "tip": "Tanaji Malusare's heroic battle fort offering panoramic views of Khadakwasla reservoir."},
                    {"time": "06:00 PM", "title": "Savor Sujata Mastani Drink at FC Road", "loc": "Fergusson College Road", "cat": "Food", "dur": 45, "transit": 30, "cost": 120, "tip": "Pune's signature dessert beverage blending fruit milk shake topped with ice cream."}
                ]
            }
        ]
    },
    "murshidabad": {
        "name": "Murshidabad",
        "state": "West Bengal",
        "terrain": "cultural_heritage",
        "aliases": ["murshidabad", "mursidabad", "মুর্শিদাবাদ", "মর্শিদাবাদ", "मुर्शिदाबाद", "hazarduari"],
        "gateway_airport": "Netaji Subhash Chandra Bose International Airport Kolkata (CCU - 200 km)",
        "gateway_rail": "Murshidabad Railway Station / Hazarduari Express from Sealdah (SDAH)",
        "local_transit_desc": "Electric battery Toto e-rickshaws, traditional horse-drawn tangas, and river country boats across Bhagirathi",
        "permit_info": "Standard ASI entry ticket for Hazarduari Palace Museum; open daily except Fridays",
        "emergency_hospital": "Murshidabad Medical College & Hospital (Apex 24/7 Trauma Care, Berhampore, Ph: 03482-252233)",
        "culinary_specialties": [
            {"name": "Murshidabadi Chhanabora (Caramelized cottage cheese fried dark and dipped in cardamom syrup)", "price": 120},
            {"name": "Traditional Nawabi Shahi Dum Biryani", "price": 280},
            {"name": "Radhaballabhi & Chholar Dal breakfast", "price": 90}
        ],
        "hotels": [
            {"name": "Hotel Manjusha Heritage River View", "category": "Heritage Riverside Stay", "price": 2400, "rating": 4.7, "location": "Killa Nizamat, Murshidabad"},
            {"name": "The Cossimbazar Palace Rajbari Heritage Stay", "category": "Aristocratic Palace Heritage", "price": 4500, "rating": 4.8, "location": "Cossimbazar, Murshidabad"}
        ],
        "clusters": [
            {
                "theme": "Nawabi Grandeur & Killa Nizamat Heritage",
                "area": "Hazarduari Palace & Imambara Corridor",
                "activities": [
                    {"time": "08:30 AM", "title": "Traditional Radhaballabhi & Chhanabora Breakfast", "loc": "Chawk Bazaar", "cat": "Food", "dur": 60, "transit": 0, "cost": 120, "tip": "Freshly fried dark Chhanabora sweet paired with savory dal."},
                    {"time": "09:30 AM", "title": "Hazarduari Palace (Palace of 1000 Doors) Museum", "loc": "Killa Nizamat", "cat": "Heritage", "dur": 150, "transit": 15, "cost": 50, "tip": "Inspect the 1837 Italian marble palace with its legendary Armoury and Nawab library."},
                    {"time": "12:15 PM", "title": "Nizamat Imambara & Historic Clock Tower", "loc": "Imambara Complex", "cat": "Heritage", "dur": 75, "transit": 10, "cost": 0, "tip": "India's largest Shia congregation hall situated directly opposite Hazarduari."},
                    {"time": "01:45 PM", "title": "Authentic Nawabi Rice & Murshidabadi Fish Thali", "loc": "Bhagirathi Riverside", "cat": "Food", "dur": 60, "transit": 15, "cost": 280, "tip": "Fresh Katla fish cooked in mild poppy seed postor gravy."},
                    {"time": "03:30 PM", "title": "Katra Mosque & Jahan Kosha Cannon", "loc": "Topkhana", "cat": "Heritage", "dur": 90, "transit": 20, "cost": 25, "tip": "Nawab Murshid Quli Khan's 1723 domed tomb mosque with the giant 11-foot cannon."},
                    {"time": "05:30 PM", "title": "Sunset Cruise on Bhagirathi River by Country Boat", "loc": "Lalbagh Ghat", "cat": "Nature", "dur": 60, "transit": 15, "cost": 250, "tip": "Serene evening water breeze reflecting the floodlit palaces."}
                ]
            },
            {
                "theme": "Aristocratic Rajbaris, Silk Weaving & Motijheel Ecology",
                "area": "Kathgola, Nashipur & Cossimbazar Corridor",
                "activities": [
                    {"time": "08:00 AM", "title": "Traditional Kochur Torkari & Luchi Breakfast", "loc": "Lalbagh Bazaar", "cat": "Food", "dur": 45, "transit": 0, "cost": 90, "tip": "Hot puffed deep-fried wheat breads served with spiced colocasia potato curry."},
                    {"time": "09:00 AM", "title": "Kathgola Gardens & Adinath Jain Temple", "loc": "Kathgola Palace Complex", "cat": "Heritage", "dur": 105, "transit": 15, "cost": 40, "tip": "Splendid marble palace set in ornate Italian gardens with a historic Adinath temple."},
                    {"time": "11:00 AM", "title": "Nashipur Rajbari & Old Palace Grounds", "loc": "Nashipur", "cat": "Heritage", "dur": 75, "transit": 10, "cost": 30, "tip": "Miniature replica of Hazarduari Palace built by Raja Debi Singha."},
                    {"time": "12:45 PM", "title": "Authentic Postor Bora & Bengali Fish Thali", "loc": "Berhampore Highway Dining", "cat": "Food", "dur": 60, "transit": 15, "cost": 240, "tip": "Crispy poppy-seed fritters paired with mustard hilsa or rohu fish curry."},
                    {"time": "02:15 PM", "title": "Murshidabad Pure Mulberry Silk Weaving Handloom Walk", "loc": "Islampur Silk Cluster", "cat": "Culture", "dur": 90, "transit": 20, "cost": 0, "tip": "Watch master weavers create intricate Baluchari and Swarnachari silk sarees on wooden looms."},
                    {"time": "04:15 PM", "title": "Motijheel (Pearl Lake) Eco-Park & Light & Sound Show", "loc": "Motijheel Complex", "cat": "Nature", "dur": 105, "transit": 15, "cost": 50, "tip": "Historic oxbow horseshoe lake where Ghaseti Begum lived, now a tranquil green birding sanctuary."}
                ]
            }
        ]
    },
    "kolhapur": {
        "name": "Kolhapur",
        "state": "Maharashtra",
        "terrain": "cultural_heritage",
        "aliases": ["kolhapur", "कोल्हापुर", "কোলাপুর", "panhala", "rankala"],
        "gateway_airport": "Chhatrapati Rajaram Maharaj Airport Kolhapur (KLH) / Pune Airport (PNQ - 235 km)",
        "gateway_rail": "Chhatrapati Shahu Maharaj Terminus Kolhapur (KOP)",
        "local_transit_desc": "City auto-rickshaws, municipal KMT buses, and shared tourist cabs to Panhala Fort",
        "permit_info": "Free entry to temples; nominal state archaeology ticket for Panhala Fort monuments",
        "emergency_hospital": "Chhatrapati Pramila Raje (CPR) Government Hospital (Apex 24/7 Trauma Care, Ph: 0231-2641555)",
        "culinary_specialties": [
            {"name": "Authentic Kolhapuri Misal Pav with fiery kat/rassa", "price": 100},
            {"name": "Tambda & Pandhra Rassa with Jowar Bhakri", "price": 280},
            {"name": "Traditional Kolhapuri Bhel & Kandi Pedha", "price": 90}
        ],
        "hotels": [
            {"name": "Hotel Sayaji Kolhapur", "category": "Premium Business & Heritage Hotel", "price": 4200, "rating": 4.8, "location": "Old Pune-Bangalore Highway, Kolhapur"},
            {"name": "Veer Shivaji Heritage Homestay", "category": "Traditional Maratha Homestay", "price": 1800, "rating": 4.6, "location": "Near Rankala Lake, Kolhapur"}
        ],
        "clusters": [
            {
                "theme": "Sacred Mahalakshmi & Maratha Royal Heritage",
                "area": "Bhavani Mandap & New Palace Corridor",
                "activities": [
                    {"time": "07:30 AM", "title": "Historic Shri Ambabai (Mahalakshmi) Temple Darshan", "loc": "Mahalakshmi Complex", "cat": "Heritage", "dur": 90, "transit": 0, "cost": 0, "tip": "7th-century Chalukya architectural marvel; one of the 51 sacred Shakti Peethas."},
                    {"time": "09:15 AM", "title": "Iconic Phadtare Misal Pav Breakfast", "loc": "Udyam Nagar", "cat": "Food", "dur": 45, "transit": 15, "cost": 100, "tip": "Mild or fiery rassa served with fresh soft pav and diced onions."},
                    {"time": "10:30 AM", "title": "Chhatrapati Shahu Maharaj New Palace Museum", "loc": "New Palace Grounds", "cat": "Heritage", "dur": 120, "transit": 15, "cost": 60, "tip": "Black polished stone palace housing authentic Maratha armory, royal throne, and letters."},
                    {"time": "01:00 PM", "title": "Authentic Kolhapuri Thali Lunch", "loc": "Deval Club Road", "cat": "Food", "dur": 60, "transit": 15, "cost": 280, "tip": "Savor Pithla Bhakri or traditional Tambda and Pandhra Rassa."},
                    {"time": "03:00 PM", "title": "Scenic Excursion to Panhala Hill Fort (20 km)", "loc": "Panhala Fort", "cat": "Adventure", "dur": 150, "transit": 35, "cost": 50, "tip": "Largest Deccan fort; explore Sajja Kothi, Ambarkhana granaries, and Teen Darwaza."},
                    {"time": "06:00 PM", "title": "Evening Walk & Sunset at Rankala Lake Promenade", "loc": "Rankala Lake", "cat": "Rest", "dur": 60, "transit": 30, "cost": 0, "tip": "Historic lake with view of Shalini Palace; enjoy local bhel puri and cool breezes."}
                ]
            }
        ]
    },
    "nashik": {
        "name": "Nashik",
        "state": "Maharashtra",
        "terrain": "spiritual_heritage",
        "aliases": ["nashik", "nasik", "नासिक", "नाशिक", "trimbakeshwar", "sula"],
        "gateway_airport": "Nashik Airport Ozar (ISK - 20 km) / Mumbai International (BOM - 165 km)",
        "gateway_rail": "Nashik Road Railway Station (NK) with direct Vande Bharat Express connectivity",
        "local_transit_desc": "City auto-rickshaws, Citilinc AC city buses, and shared taxis to Trimbakeshwar",
        "permit_info": "Free entry to temples; VIP pass available online for Trimbakeshwar Jyotirlinga darshan",
        "emergency_hospital": "Nashik District Civil Hospital & Apollo Hospitals (Apex 24/7 Trauma Care, Ph: 0253-2572038)",
        "culinary_specialties": [
            {"name": "Sadhana Chulivarchi Misal cooked on wood-fire", "price": 120},
            {"name": "Khandeshi Shev Bhaji with Hot Jowar Bhakri", "price": 160},
            {"name": "Fresh Vineyard Table Grapes & Modak", "price": 90}
        ],
        "hotels": [
            {"name": "The Source at Sula Vineyards", "category": "Luxury Vineyard Resort", "price": 8500, "rating": 4.9, "location": "Gangapur Dam, Nashik"},
            {"name": "Hotel Panchavati Yatri Heritage", "category": "Central Pilgrim & Heritage Stay", "price": 2200, "rating": 4.6, "location": "Vakil Wadi, Nashik"}
        ],
        "clusters": [
            {
                "theme": "Sacred Godavari Ghats & Panchavati Ramayana Trail",
                "area": "Panchavati & Ramkund Heritage Zone",
                "activities": [
                    {"time": "07:30 AM", "title": "Holy Dip & Aarti at Ramkund on Sacred Godavari River", "loc": "Ramkund Ghat", "cat": "Heritage", "dur": 60, "transit": 0, "cost": 0, "tip": "Kumbh Mela sacred ghat where Lord Rama performed rituals during exile."},
                    {"time": "08:45 AM", "title": "Sadhana Woodfire Chulivarchi Misal Breakfast", "loc": "Gangapur Road", "cat": "Food", "dur": 60, "transit": 20, "cost": 120, "tip": "Served with jalebi, papad, and fresh thick buttermilk."},
                    {"time": "10:15 AM", "title": "Kalaram Temple & Sita Gufa Cave Exploration", "loc": "Panchavati", "cat": "Heritage", "dur": 90, "transit": 15, "cost": 0, "tip": "Spectacular black stone temple and the five sacred banyan trees of Panchavati."},
                    {"time": "01:00 PM", "title": "Traditional Maharashtrian Thali Lunch", "loc": "College Road", "cat": "Food", "dur": 60, "transit": 15, "cost": 240, "tip": "Authentic regional lunch featuring Shev Bhaji, Varan Bhaat, and seasonal sweets."},
                    {"time": "02:45 PM", "title": "Pandavleni Buddhist Caves & Ancient Water Cisterns", "loc": "Pandavleni Hill", "cat": "Heritage", "dur": 120, "transit": 20, "cost": 25, "tip": "24 Hinayana rock-cut caves carved into the hillside dating from 2nd century BC."},
                    {"time": "05:15 PM", "title": "Sunset & Wine Trail Tour at Sula Vineyards", "loc": "Govardhan Village", "cat": "Nature", "dur": 90, "transit": 20, "cost": 400, "tip": "Stroll through manicured vineyards overlooking the serene Gangapur reservoir."}
                ]
            }
        ]
    },
    "agra": {
        "name": "Agra",
        "state": "Uttar Pradesh",
        "terrain": "monumental_heritage",
        "aliases": ["agra", "taj mahal", "आगरा", "আগ্রা", "fatehpur sikri"],
        "gateway_airport": "Agra Airport Kheria (AGR) / Delhi International Airport (DEL - 200 km)",
        "gateway_rail": "Agra Cantt (AGC) / Gatimaan Express (100 mins from Delhi Hazrat Nizamuddin)",
        "local_transit_desc": "Electric battery golf carts, CNG auto-rickshaws, and prepaid tourist cabs",
        "permit_info": "ASI ticket for Taj Mahal & Agra Fort; Taj Mahal is strictly CLOSED on Fridays",
        "emergency_hospital": "S.N. Medical College & Hospital (Apex Government 24/7 Trauma Care, Ph: 0562-2260353)",
        "culinary_specialties": [
            {"name": "Agra Petha (Kesar, Angoori, and Chocolate)", "price": 140},
            {"name": "Bedmi Puri & Spicy Dubki Aloo breakfast", "price": 90},
            {"name": "Mughlai Paneer Pasanda & Roomali Roti", "price": 260}
        ],
        "hotels": [
            {"name": "ITC Mughal Luxury Collection", "category": "5-Star Heritage Luxury", "price": 8500, "rating": 4.9, "location": "Fatehabad Road, Agra"},
            {"name": "Coral Tree Eco Homestay", "category": "Certified Green Homestay", "price": 2400, "rating": 4.8, "location": "Near Taj East Gate, Agra"}
        ],
        "clusters": [
            {
                "theme": "UNESCO Mughal Marvels & Yamuna Riverfront",
                "area": "Taj Mahal & Agra Fort Corridor",
                "activities": [
                    {"time": "06:00 AM", "title": "Sunrise Spectacle at the Taj Mahal (UNESCO)", "loc": "Taj Mahal East Gate", "cat": "Heritage", "dur": 150, "transit": 0, "cost": 50, "tip": "Arrive at dawn for ethereal soft morning light and fewest crowds."},
                    {"time": "09:00 AM", "title": "Traditional Bedmi Puri & Jalebi Breakfast", "loc": "Kinari Bazaar", "cat": "Food", "dur": 45, "transit": 15, "cost": 100, "tip": "Hot puffed urad dal puris with spiced potato curry."},
                    {"time": "10:15 AM", "title": "Agra Fort (Red Sandstone Citadel & Jahangiri Mahal)", "loc": "Agra Fort Complex", "cat": "Heritage", "dur": 120, "transit": 15, "cost": 50, "tip": "Explore Diwan-i-Khas, Sheesh Mahal, and Shah Jahan's octagonal prison tower (Musamman Burj)."},
                    {"time": "01:00 PM", "title": "Authentic Mughlai Culinary Lunch", "loc": "Fatehabad Road", "cat": "Food", "dur": 60, "transit": 15, "cost": 320, "tip": "Rich saffron korma, paneer tikka, and soft sheermal flatbread."},
                    {"time": "02:45 PM", "title": "Itmad-ud-Daulah (The Baby Taj) & Marble Inlay Walk", "loc": "Yamuna River Bank", "cat": "Heritage", "dur": 90, "transit": 20, "cost": 30, "tip": "Exquisite pietra dura inlay marble work predating the Taj Mahal."},
                    {"time": "05:00 PM", "title": "Sunset View of Taj Mahal from Mehtab Bagh Gardens", "loc": "Mehtab Bagh", "cat": "Nature", "dur": 90, "transit": 20, "cost": 25, "tip": "Charbagh garden complex across the river reflecting the sunset glow on the white marble."}
                ]
            }
        ]
    },
    "shimla": {
        "name": "Shimla",
        "state": "Himachal Pradesh",
        "terrain": "himalayan_hill_station",
        "aliases": ["shimla", "simla", "शिमला", "শিমলা", "kufri", "mall road"],
        "gateway_airport": "Shimla Airport Jubbarhatti (SLV - 22 km) / Chandigarh International (IXC - 120 km)",
        "gateway_rail": "Kalka-Shimla UNESCO Mountain Heritage Toy Train / Shimla Railway Station",
        "local_transit_desc": "Strictly pedestrianized Mall Road (No vehicles allowed); HP Tourism electric golf carts & shared taxis",
        "permit_info": "No special permits required for Indian or foreign nationals",
        "emergency_hospital": "Indira Gandhi Medical College & Hospital (IGMC Shimla, Apex Trauma Center, Ph: 0177-2804251)",
        "culinary_specialties": [
            {"name": "Pahadi Chana Madra & Rice", "price": 180},
            {"name": "Warm Steamed Siddu with Pure Desi Ghee", "price": 120},
            {"name": "Traditional Tudkiya Bhath & Plum Wine Cake", "price": 160}
        ],
        "hotels": [
            {"name": "The Oberoi Cecil Heritage", "category": "Luxury Colonial Heritage", "price": 11500, "rating": 4.9, "location": "Chaura Maidan, Shimla"},
            {"name": "Pineview Eco Homestay & Heritage Cottage", "category": "Pine Forest Eco Homestay", "price": 2400, "rating": 4.7, "location": "Jakhoo Hill, Shimla"}
        ],
        "clusters": [
            {
                "theme": "Colonial Mall Road, The Ridge & Jakhoo Hill",
                "area": "The Ridge & Jakhoo Peak Corridor",
                "activities": [
                    {"time": "08:00 AM", "title": "Traditional Pahadi Breakfast of Siddu & Ghee", "loc": "Mall Road Cafe", "cat": "Food", "dur": 60, "transit": 0, "cost": 140, "tip": "Steamed walnut-poppy seed yeast bread dipped in hot melted ghee."},
                    {"time": "09:15 AM", "title": "Historic Christ Church & The Ridge Promenade Walk", "loc": "The Ridge", "cat": "Heritage", "dur": 75, "transit": 10, "cost": 0, "tip": "North India's second oldest church with neo-Gothic stained glass windows."},
                    {"time": "10:45 AM", "title": "Jakhoo Ropeway Cable Car to Hanuman Temple Summit", "loc": "Jakhoo Hill (8,050 ft)", "cat": "Adventure", "dur": 90, "transit": 15, "cost": 500, "tip": "Highest peak in Shimla with giant 108-foot Hanuman statue and Himalayan panorama."},
                    {"time": "01:00 PM", "title": "Himachali Dham Thali Lunch", "loc": "Lakkar Bazaar", "cat": "Food", "dur": 60, "transit": 15, "cost": 260, "tip": "Traditional celebratory feast of Chana Madra, Khatta, and Meetha Bhaat."},
                    {"time": "02:45 PM", "title": "Viceregal Lodge (Indian Institute of Advanced Study)", "loc": "Observatory Hill", "cat": "Heritage", "dur": 120, "transit": 20, "cost": 100, "tip": "Majestic Scottish baronial castle where historic Indian independence pacts were drawn."},
                    {"time": "05:30 PM", "title": "Sunset Stroll & Wooden Toy Souvenirs at Lakkar Bazaar", "loc": "Lakkar Bazaar", "cat": "Rest", "dur": 60, "transit": 15, "cost": 0, "tip": "Support local artisans carving walnut and deodar wood artifacts."}
                ]
            }
        ]
    },
    "alleppey": {
        "name": "Alleppey",
        "state": "Kerala",
        "terrain": "backwaters_lagoon",
        "aliases": ["alleppey", "alappuzha", "आलप्पुझा", "আলেপ্পি", "vembanad"],
        "gateway_airport": "Cochin International Airport (COK - 85 km) / Trivandrum International (TRV - 150 km)",
        "gateway_rail": "Alappuzha Railway Station (ALLP) with direct coastal express trains",
        "local_transit_desc": "Government SWTD public passenger water ferries, rented canoes, and solar e-boats",
        "permit_info": "Verify DTPC Green Palm eco-certification on all houseboats",
        "emergency_hospital": "Government T.D. Medical College Hospital (Apex 24/7 Trauma Care, Vandanam, Ph: 0477-2282015)",
        "culinary_specialties": [
            {"name": "Karimeen Pollichathu (Pearl spot fish wrapped in banana leaf)", "price": 350},
            {"name": "Kuttanad Backwater Duck Roast & Rice Appam", "price": 280},
            {"name": "Steamed Puttu & Kadala Curry with Coconut", "price": 90}
        ],
        "hotels": [
            {"name": "Kanoos Luxury Backwater Eco Houseboat", "category": "Solar-Electric Certified Houseboat", "price": 9500, "rating": 4.9, "location": "Punnamada Jetty, Alleppey"},
            {"name": "Marari Green Village Eco Homestay", "category": "Coastal Village Homestay", "price": 2200, "rating": 4.7, "location": "Mararikulam, Alleppey"}
        ],
        "clusters": [
            {
                "theme": "Vembanad Backwaters, Canal Villages & Paddy Trails",
                "area": "Punnamada Lake & Kuttanad Waterway Corridor",
                "activities": [
                    {"time": "07:30 AM", "title": "Traditional Appam & Stew Breakfast by the Canal", "loc": "Finishing Point Jetty", "cat": "Food", "dur": 45, "transit": 0, "cost": 120, "tip": "Fresh fermented rice hoppers with fragrant coconut milk vegetable stew."},
                    {"time": "08:30 AM", "title": "Morning Village Canoe Cruise through Narrow Canals", "loc": "Kainakary Waterways", "cat": "Nature", "dur": 120, "transit": 15, "cost": 400, "tip": "Glide silently through rural waterways beneath swaying coconut palms."},
                    {"time": "11:00 AM", "title": "Kuttanad Below-Sea-Level Farming Exploration", "loc": "Kuttanad Delta", "cat": "Culture", "dur": 90, "transit": 20, "cost": 0, "tip": "One of the few places in the world where farming is practiced 4 to 10 ft below sea level."},
                    {"time": "01:00 PM", "title": "Authentic Sadya & Grilled Karimeen Lunch", "loc": "Canalside Toddy Shop Dining", "cat": "Food", "dur": 60, "transit": 15, "cost": 320, "tip": "Fresh pearl spot fish marinated in spices, wrapped in plantain leaf and pan-roasted."},
                    {"time": "03:00 PM", "title": "Alappuzha Historic Lighthouse & Teak Pier Beach Walk", "loc": "Alappuzha Beach", "cat": "Heritage", "dur": 90, "transit": 20, "cost": 40, "tip": "Climb the 1862 spiral staircase for 360-degree views of the Arabian Sea."},
                    {"time": "05:30 PM", "title": "Sunset Cruise on Vembanad Lake by Public Solar Ferry", "loc": "Vembanad Waters", "cat": "Rest", "dur": 75, "transit": 15, "cost": 50, "tip": "Zero-emission solar boat with panoramic views of migratory birds returning to roost."}
                ]
            }
        ]
    },
    "munnar": {
        "name": "Munnar",
        "state": "Kerala",
        "terrain": "highland_tea_valley",
        "aliases": ["munnar", "मुन्नार", "মুন্নার", "eravikulam", "mattupetty"],
        "gateway_airport": "Cochin International Airport (COK - 110 km) / Madurai Airport (IXM - 140 km)",
        "gateway_rail": "Aluva Railway Station (AWY - 110 km) or Ernakulam Junction (ERS)",
        "local_transit_desc": "Local mountain jeeps, auto-rickshaws, and eco-buses inside National Parks",
        "permit_info": "Online advance booking recommended for Eravikulam National Park (Rajamalai safari)",
        "emergency_hospital": "Tata Tea General Hospital (Apex 24/7 Highland Emergency, Nullatanni, Ph: 04865-230457)",
        "culinary_specialties": [
            {"name": "Organic Highland Green/Black Tea with Cardamom", "price": 40},
            {"name": "Lacy Appam with Coconut Milk Stew", "price": 110},
            {"name": "Kerala Malabar Parotta with Pepper Roast", "price": 180}
        ],
        "hotels": [
            {"name": "Windermere Estate Heritage Plantation", "category": "Boutique Tea Plantation Retreat", "price": 8200, "rating": 4.9, "location": "Pothamedu, Munnar"},
            {"name": "Olive Brook Eco Homestay", "category": "Cardamom Valley Eco Homestay", "price": 2600, "rating": 4.7, "location": "Pothamedu Viewpoint Road, Munnar"}
        ],
        "clusters": [
            {
                "theme": "Tea Plantations, Eravikulam Wildlife & Anamudi Views",
                "area": "Rajamalai & Mattupetty Corridor",
                "activities": [
                    {"time": "07:30 AM", "title": "Puttu & Kadala Breakfast with Fresh Cardamom Tea", "loc": "Munnar Town Bazaar", "cat": "Food", "dur": 45, "transit": 0, "cost": 100, "tip": "Fragrant high-grown orthodox tea paired with steamed rice cylinders."},
                    {"time": "08:30 AM", "title": "Eravikulam National Park (Home of Nilgiri Tahr)", "loc": "Rajamalai Sanctuary", "cat": "Nature", "dur": 150, "transit": 20, "cost": 200, "tip": "Observe the endangered mountain goat and view South India's highest summit, Anamudi (8,842 ft)."},
                    {"time": "11:30 AM", "title": "KDHP Tea Museum & Artisan Factory Tour", "loc": "Nullatanni Estate", "cat": "Heritage", "dur": 90, "transit": 15, "cost": 125, "tip": "Witness orthodox CTC tea processing demonstration and professional tea tasting session."},
                    {"time": "01:30 PM", "title": "Traditional Kerala Meal on Plantain Leaf", "loc": "Old Munnar", "cat": "Food", "dur": 60, "transit": 10, "cost": 200, "tip": "Avial, sambar, thoran, and fresh buttermilk served with red rice."},
                    {"time": "03:00 PM", "title": "Mattupetty Dam & Eco-Boating over Mountain Reservoir", "loc": "Mattupetty Dam", "cat": "Adventure", "dur": 90, "transit": 25, "cost": 300, "tip": "Surrounded by rolling tea gardens and Shola forests; watch for wild elephants at water edge."},
                    {"time": "05:00 PM", "title": "Echo Point & Kundala Lake Sunset Walk", "loc": "Echo Point", "cat": "Nature", "dur": 75, "transit": 15, "cost": 0, "tip": "Natural acoustic echo phenomenon amid serene pine and eucalyptus hills."}
                ]
            }
        ]
    }
}

def find_indian_destination(query: str) -> Optional[Dict[str, Any]]:
    """
    Looks up a destination in the comprehensive gazetteer by exact name, alias, or regex match.
    """
    q = (query or "").strip().lower()
    
    # 1. Exact or Alias lookup
    for key, data in GAZETTEER_DESTINATIONS.items():
        if q == key or q == data["name"].lower():
            return data
        for alias in data.get("aliases", []):
            if re.search(r'\b' + re.escape(alias.lower()) + r'\b', q):
                return data

    return None

def get_all_gazetteer_destinations() -> List[Dict[str, str]]:
    """Returns a list of all curated destinations with state and terrain for autocomplete."""
    res = []
    for key, data in sorted(GAZETTEER_DESTINATIONS.items(), key=lambda x: x[1]["name"]):
        res.append({
            "key": key,
            "name": data["name"],
            "state": data["state"],
            "terrain": data["terrain"]
        })
    return res
