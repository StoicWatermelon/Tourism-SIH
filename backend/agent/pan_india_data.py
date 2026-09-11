"""
Bharat Explore — Pan-India States & Union Territories Telemetry Dataset
Complete authoritative registry of all 28 States and 8 Union Territories for Smart India Hackathon (SIH 2026).
Provides verified airport hubs, rail alternatives, 24/7 emergency medical trauma centers,
tourist helplines, multilingual keywords (EN, HI, BN), and clustered attraction itineraries.
"""

from typing import Dict, Any, List

# ═══════════════════════════════════════════════════════════════════
# 1. COMPLETE LIST OF ALL 28 STATES & 8 UNION TERRITORIES (36 TOTAL)
# ═══════════════════════════════════════════════════════════════════

ALL_STATES_AND_UTS = [
    # ─── North East (8 States) ───
    {"name": "Assam", "type": "State", "region": "North East", "capital": "Dispur / Guwahati", "icon": "🦏", "best_season": "Nov – Apr"},
    {"name": "Meghalaya", "type": "State", "region": "North East", "capital": "Shillong", "icon": "🌧️", "best_season": "Sep – May"},
    {"name": "Arunachal Pradesh", "type": "State", "region": "North East", "capital": "Itanagar", "icon": "🏔️", "best_season": "Mar – Oct"},
    {"name": "Sikkim", "type": "State", "region": "North East", "capital": "Gangtok", "icon": "🌱", "best_season": "Mar – May & Oct – Dec"},
    {"name": "Nagaland", "type": "State", "region": "North East", "capital": "Kohima", "icon": "🪶", "best_season": "Oct – Mar"},
    {"name": "Manipur", "type": "State", "region": "North East", "capital": "Imphal", "icon": "🪷", "best_season": "Oct – Mar"},
    {"name": "Mizoram", "type": "State", "region": "North East", "capital": "Aizawl", "icon": "🎋", "best_season": "Oct – Apr"},
    {"name": "Tripura", "type": "State", "region": "North East", "capital": "Agartala", "icon": "🏛️", "best_season": "Oct – Mar"},

    # ─── North & Himalayas (5 States + 4 UTs) ───
    {"name": "Himachal Pradesh", "type": "State", "region": "North & Himalayas", "capital": "Shimla", "icon": "❄️", "best_season": "Year-Round"},
    {"name": "Uttarakhand", "type": "State", "region": "North & Himalayas", "capital": "Dehradun", "icon": "🧘", "best_season": "Sep – Jun"},
    {"name": "Punjab", "type": "State", "region": "North & Himalayas", "capital": "Chandigarh", "icon": "🌾", "best_season": "Oct – Mar"},
    {"name": "Haryana", "type": "State", "region": "North & Himalayas", "capital": "Chandigarh", "icon": "🏹", "best_season": "Oct – Mar"},
    {"name": "Uttar Pradesh", "type": "State", "region": "North & Himalayas", "capital": "Lucknow", "icon": "🛕", "best_season": "Oct – Mar"},
    {"name": "Jammu and Kashmir", "type": "Union Territory", "region": "North & Himalayas", "capital": "Srinagar / Jammu", "icon": "🛶", "best_season": "Apr – Oct & Dec – Feb"},
    {"name": "Ladakh", "type": "Union Territory", "region": "North & Himalayas", "capital": "Leh", "icon": "🌌", "best_season": "May – Sep"},
    {"name": "Delhi", "type": "Union Territory", "region": "North & Himalayas", "capital": "New Delhi", "icon": "🚩", "best_season": "Oct – Mar"},
    {"name": "Chandigarh", "type": "Union Territory", "region": "North & Himalayas", "capital": "Chandigarh", "icon": "🌳", "best_season": "Oct – Mar"},

    # ─── West & Central (5 States + 1 UT) ───
    {"name": "Rajasthan", "type": "State", "region": "West & Central", "capital": "Jaipur", "icon": "🏰", "best_season": "Oct – Mar"},
    {"name": "Gujarat", "type": "State", "region": "West & Central", "capital": "Gandhinagar", "icon": "🦁", "best_season": "Oct – Mar"},
    {"name": "Maharashtra", "type": "State", "region": "West & Central", "capital": "Mumbai", "icon": "🌊", "best_season": "Oct – Mar"},
    {"name": "Goa", "type": "State", "region": "West & Central", "capital": "Panaji", "icon": "🏖️", "best_season": "Nov – Feb"},
    {"name": "Madhya Pradesh", "type": "State", "region": "West & Central", "capital": "Bhopal", "icon": "🐅", "best_season": "Oct – Mar"},
    {"name": "Chhattisgarh", "type": "State", "region": "West & Central", "capital": "Raipur", "icon": "🌊", "best_season": "Jul – Feb"},
    {"name": "Dadra and Nagar Haveli and Daman and Diu", "type": "Union Territory", "region": "West & Central", "capital": "Daman", "icon": "⛵", "best_season": "Oct – Mar"},

    # ─── East (4 States) ───
    {"name": "West Bengal", "type": "State", "region": "East", "capital": "Kolkata", "icon": "🚋", "best_season": "Oct – Mar"},
    {"name": "Odisha", "type": "State", "region": "East", "capital": "Bhubaneswar", "icon": "☀️", "best_season": "Oct – Mar"},
    {"name": "Bihar", "type": "State", "region": "East", "capital": "Patna", "icon": "☸️", "best_season": "Oct – Mar"},
    {"name": "Jharkhand", "type": "State", "region": "East", "capital": "Ranchi", "icon": "🌲", "best_season": "Jul – Feb"},

    # ─── South & Islands (5 States + 3 UTs) ───
    {"name": "Kerala", "type": "State", "region": "South & Islands", "capital": "Thiruvananthapuram", "icon": "🌴", "best_season": "Sep – Mar"},
    {"name": "Tamil Nadu", "type": "State", "region": "South & Islands", "capital": "Chennai", "icon": "🛕", "best_season": "Oct – Mar"},
    {"name": "Karnataka", "type": "State", "region": "South & Islands", "capital": "Bengaluru", "icon": "🗿", "best_season": "Sep – Mar"},
    {"name": "Andhra Pradesh", "type": "State", "region": "South & Islands", "capital": "Amaravati", "icon": "🌅", "best_season": "Oct – Mar"},
    {"name": "Telangana", "type": "State", "region": "South & Islands", "capital": "Hyderabad", "icon": "💎", "best_season": "Oct – Mar"},
    {"name": "Puducherry", "type": "Union Territory", "region": "South & Islands", "capital": "Puducherry", "icon": "🥐", "best_season": "Oct – Mar"},
    {"name": "Andaman and Nicobar Islands", "type": "Union Territory", "region": "South & Islands", "capital": "Port Blair", "icon": "🏝️", "best_season": "Oct – May"},
    {"name": "Lakshadweep", "type": "Union Territory", "region": "South & Islands", "capital": "Kavaratti", "icon": "🪸", "best_season": "Oct – Apr"}
]

# ═══════════════════════════════════════════════════════════════════
# 2. MULTILINGUAL DESTINATION KEYWORD MAPPINGS (EN, HI, BN + CITIES)
# ═══════════════════════════════════════════════════════════════════

PAN_INDIA_DESTINATIONS_MAP = {
    # ─── North East ───
    "assam": ["assam", "guwahati", "kaziranga", "majuli", "dispur", "manas", "kamakhya", "जोरहाट", "काजीरंगा", "অসম", "গুয়াহাটি", "কাজিরাঙা", "মাজুলী"],
    "meghalaya": ["meghalaya", "shillong", "cherrapunji", "sohra", "dawki", "mawlynnong", "living root", "मेघालय", "शिलांग", "चेरापूंजी", "মেঘালয়", "শিলং", "চেরাপুঞ্জি", "ডাউকি"],
    "arunachal pradesh": ["arunachal", "tawang", "ziro", "itanagar", "sela pass", "bomdila", "अरुणाचल", "तवांग", "इटानगर", "জিরো", "অরুণাচল", "তাওয়াং"],
    "sikkim": ["sikkim", "gangtok", "gurudongmar", "pelling", "nathula", "tsomgo", "lachung", "सिक्किम", "गंगटोक", "पेल्लिंग", "সিকিম", "গ্যাংটক"],
    "nagaland": ["nagaland", "kohima", "dzukou", "hornbill", "dimapur", "khonoma", "नागालैंड", "कोहिमा", "নাগাল্যান্ড", "কোহিমা", "জুকো ভ্যালি"],
    "manipur": ["manipur", "imphal", "loktak", "phumdi", "keibul lamjao", "मणिपुर", "इम्फाल", "लोकटक", "মণিপুর", "ইম্ফল", "লোকটাক"],
    "mizoram": ["mizoram", "aizawl", "reiek", "champhai", "vantawng", "मिजोरम", "आइजोल", "মিজোরাম", "আইজল"],
    "tripura": ["tripura", "agartala", "ujjayanta", "neermahal", "unakoti", "त्रिपुरा", "अगरतला", "ত্রিপুরা", "আগরতলা"],

    # ─── High-Volume Iconic Travel Hubs ───
    "kashmir": ["kashmir", "srinagar", "gulmarg", "pahalgam", "sonamarg", "dal lake", "কাশ্মীর", "कश्मीर"],
    "jaipur": ["jaipur", "pink city", "amber fort", "जयपुर", "জয়পুর"],
    "varanasi": ["varanasi", "kashi", "banaras", "वाराणसी", "বারাণসী"],
    "kolkata": ["kolkata", "calcutta", "howrah", "কলকাতা", "कोलकाता"],

    # ─── North & Himalayas ───
    "himachal pradesh": ["himachal", "manali", "shimla", "dharamshala", "spiti", "kasol", "dalhousie", "kullu", "rohtang", "atal tunnel", "हिमाचल", "मनाली", "शिमला", "धर्मशाला", "হিমাচল", "মানালি", "শিমলা"],
    "uttarakhand": ["uttarakhand", "rishikesh", "haridwar", "dehradun", "mussoorie", "nainital", "auli", "kedarnath", "badrinath", "valley of flowers", "उत्तराखंड", "ऋषिकेश", "हरिद्वार", "নৈনিতাল", "উত্তরাখণ্ড", "ঋষিকেশ"],
    "punjab": ["punjab", "amritsar", "golden temple", "wagah", "chandigarh", "patiala", "पंजाब", "अमृतसर", "स्वर्ण मंदिर", "পাঞ্জাব", "অমৃতসর", "স্বর্ণ মন্দির"],
    "haryana": ["haryana", "kurukshetra", "panchkula", "sultanpur", "gurugram", "gurgaon", "हरियाणा", "कुरुक्षेत्र", "হরিয়ানা", "কুরুক্ষেত্র"],
    "uttar pradesh": ["uttar pradesh", "agra", "taj mahal", "lucknow", "ayodhya", "mathura", "vrindavan", "prayagraj", "उत्तर प्रदेश", "आगरा", "लखनऊ", "अयोध्या", "উত্তর প্রদেশ", "আগ্রা", "লখনউ"],
    "jammu and kashmir": ["jammu and kashmir", "jammu & kashmir", "j&k", "jammu", "katra", "vaishno devi"],
    "ladakh": ["ladakh", "leh", "pangong", "nubra", "khardung", "chang la", "zoji la", "turtuk", "hanle", "tso moriri", "zanskar", "लद्दाख", "लेह", "पैंगोंग", "লাদাখ", "লেহ", "প্যাংগং"],
    "delhi": ["delhi", "new delhi", "red fort", "qutub minar", "india gate", "chandni chowk", "दिल्ली", "नई दिल्ली", "দিল্লি", "নয়া দিল্লি"],
    "chandigarh": ["chandigarh", "rock garden", "sukhna lake", "चंडीगढ़", "চণ্ডীগড়"],

    # ─── West & Central ───
    "rajasthan": ["rajasthan", "udaipur", "jodhpur", "jaisalmer", "pushkar", "ranthambore", "राजस्थान", "उदयपुर", "जैसलमेर", "রাজস্থান", "উদয়পুর"],
    "gujarat": ["gujarat", "kutch", "rann of kutch", "gir", "ahmedabad", "somnath", "dwarka", "statue of unity", "गुजरात", "कच्छ", "अहमदाबाद", "গুজরাত", "কচ্ছ", "গির"],
    "maharashtra": ["maharashtra", "mumbai", "pune", "ajanta", "ellora", "lonavala", "mahabaleshwar", "alibaug", "shirdi", "gateway of india", "महाराष्ट्र", "मुंबई", "पुणे", "মহারাষ্ট্র", "মুম্বাই"],
    "goa": ["goa", "panaji", "calangute", "baga", "dudhsagar", "fontainhas", "south goa", "north goa", "गोवा", "पनाजी", "গোয়া", "পানাজি"],
    "madhya pradesh": ["madhya pradesh", "khajuraho", "bhopal", "indore", "kanha", "bandhavgarh", "ujjain", "gwalior", "pachmarhi", "मध्य प्रदेश", "खजुराहो", "भोपाल", "उज्जैन", "মধ্য প্রদেশ", "খাজুরাহো"],
    "chhattisgarh": ["chhattisgarh", "bastar", "chitrakote", "raipur", "sirpur", "छत्तीसगढ़", "बस्तर", "चित्रकूट", "ছত্তিশগড়", "বস্তার"],
    "dadra and nagar haveli and daman and diu": ["daman", "diu", "silvassa", "dadra", "दमण", "दीव", "দমন", "দিউ"],

    # ─── East ───
    "west bengal": ["west bengal", "kolkata", "calcutta", "darjeeling", "sundarbans", "howrah", "digha", "shantiniketan", "kalimpong", "पश्चिम बंगाल", "कोलकाता", "दार्जिलिंग", "সুন্দরবন", "পশ্চিমবঙ্গ", "কলকাতা", "দার্জিলিং", "সুন্দরবন"],
    "odisha": ["odisha", "orissa", "puri", "bhubaneswar", "konark", "sun temple", "chilika", "jagannath", "ओडिशा", "पुरी", "भुवनेश्वर", "कोणार्क", "ওড়িশা", "পুরী", "ভুবনেশ্বর", "কোণার্ক"],
    "bihar": ["bihar", "bodh gaya", "nalanda", "rajgir", "patna", "vaishali", "महाबोधि", "बिहार", "बोधगया", "नालंदा", "বিহার", "বোধগয়া", "নালন্দা"],
    "jharkhand": ["jharkhand", "ranchi", "hundru", "deoghar", "netarhat", "betla", "झारखंड", "रांची", "झাড়খণ্ড", "রাঁচি"],

    # ─── South & Islands ───
    "kerala": ["kerala", "alleppey", "alappuzha", "munnar", "kochi", "cochin", "wayanad", "varkala", "thekkady", "trivandrum", "কেরল", "केरल", "কোচি", "মুন্নার"],
    "tamil nadu": ["tamil nadu", "chennai", "madurai", "mahabalipuram", "ooty", "kodaikanal", "rameswaram", "kanyakumari", "coimbatore", "तंजावुर", "तमिलनाडु", "चेन्नई", "মাদুরাই", "তামিলনাড়ু", "চেন্নাই", "উটী"],
    "karnataka": ["karnataka", "bengaluru", "bangalore", "hampi", "coorg", "mysore", "mysuru", "gokarna", "chikmagalur", "kabini", "कर्नाटक", "बेंगलुरु", "हम्पी", "কর্কনাটক", "বেঙ্গালুরু", "হাম্পি", "কুর্গ"],
    "andhra pradesh": ["andhra pradesh", "visakhapatnam", "vizag", "tirupati", "araku", "vijayawada", "आंध्र प्रदेश", "तिरुपति", "विशाखापट्टनम", "অন্ধ্রপ্রদেশ", "তিরুপতি", "ভাইজ্যাগ"],
    "telangana": ["telangana", "hyderabad", "charminar", "golconda", "warangal", "ramappa", "तेलंगाना", "हैदराबाद", "তেলেঙ্গানা", "হায়দ্রাবাদ"],
    "puducherry": ["puducherry", "pondicherry", "auroville", "white town", "पुदुचेरी", "पांडिचेरी", "পুদুচেরি", "পন্ডিচেরি"],
    "andaman and nicobar islands": ["andaman", "nicobar", "port blair", "havelock", "swaraj dweep", "neil island", "radhanagar", "अंडमान", "पोर्ट ब्लेयर", "হেভলক", "আন্দামান", "পোর্ট ব্লেয়ার"],
    "lakshadweep": ["lakshadweep", "kavaratti", "agatti", "bangaram", "minicoy", "लक्षद्वीप", "কাবারত্তি", "লক্ষদ্বীপ"]
}

# ═══════════════════════════════════════════════════════════════════
# 3. VERIFIED AIRPORT HUBS & RAIL CONNECTIONS (ALL 36 STATES & UTS)
# ═══════════════════════════════════════════════════════════════════

AIRPORT_HUBS_ALL: Dict[str, Dict[str, Any]] = {
    # ─── North East ───
    "assam": {
        "primary": "Lokpriya Gopinath Bordoloi International Airport Guwahati (GAU)",
        "alternatives": ["Jorhat Airport (JRH)", "Dibrugarh Airport (DIB)", "Silchar (IXS)"],
        "rail_alternative": "Guwahati Junction (GHY) / Vande Bharat Express to New Jalpaiguri"
    },
    "meghalaya": {
        "primary": "Shillong Airport Umroi (SHL)",
        "alternatives": ["Guwahati International Airport (GAU) + Scenic 3-hr Highway Drive"],
        "rail_alternative": "Guwahati Railway Station (GHY) with shared luxury cabs to Shillong"
    },
    "arunachal pradesh": {
        "primary": "Donyi Polo Airport Itanagar (HGI)",
        "alternatives": ["Tezpur Airport (TEZ)", "Guwahati Airport (GAU) + Scenic Mountain Handoff", "Lilabari (IXI)"],
        "rail_alternative": "Naharlagun Railway Station (NHLN) Donyi Polo Express"
    },
    "sikkim": {
        "primary": "Pakyong Airport Gangtok (PYG)",
        "alternatives": ["Bagdogra International Airport (IXB) + Teesta River Highway Corridor"],
        "rail_alternative": "New Jalpaiguri (NJP) / Sivok-Rangpo Railway Project Link"
    },
    "nagaland": {
        "primary": "Dimapur Airport (DMU)",
        "alternatives": ["Guwahati Airport (GAU) + Jan Shatabdi Express to Dimapur"],
        "rail_alternative": "Dimapur Railway Station (DMU) / Kohima Zubza Rail Link"
    },
    "manipur": {
        "primary": "Bir Tikendrajit International Airport Imphal (IMF)",
        "alternatives": ["Dimapur Airport (DMU) + Mountain Transit to Imphal"],
        "rail_alternative": "Jiribam Railway Station / Tupul-Imphal Rail Line"
    },
    "mizoram": {
        "primary": "Lengpui Airport Aizawl (AJL)",
        "alternatives": ["Silchar Airport (IXS) + National Highway 306 scenic hill run"],
        "rail_alternative": "Bairabi Railway Station / Sairang-Aizawl Rail Link"
    },
    "tripura": {
        "primary": "Maharaja Bir Bikram Airport Agartala (IXA)",
        "alternatives": ["Silchar Airport (IXS)", "Kazi Nazrul Islam Airport Durgapur (RDP)"],
        "rail_alternative": "Agartala Railway Station (AGTL) Humsafar / Tejas Rajdhani Express"
    },

    # ─── North & Himalayas ───
    "himachal pradesh": {
        "primary": "Bhuntar / Kullu-Manali Airport (KUU)",
        "alternatives": ["Chandigarh International Airport (IXC) + 4-lane Highway", "Kangra-Gaggal Airport (DHM)", "Shimla (SLV)"],
        "rail_alternative": "Kalka Shimla UNESCO Toy Train or Chandigarh Vande Bharat"
    },
    "uttarakhand": {
        "primary": "Jolly Grant Airport Dehradun / Rishikesh (DED)",
        "alternatives": ["Pantnagar Airport (PGH)", "Indira Gandhi International Airport Delhi (DEL)"],
        "rail_alternative": "Dehradun / Haridwar / Yog Nagari Rishikesh (YNRK) Vande Bharat"
    },
    "punjab": {
        "primary": "Sri Guru Ram Dass Jee International Airport Amritsar (ATQ)",
        "alternatives": ["Shaheed Bhagat Singh International Airport Chandigarh (IXC)"],
        "rail_alternative": "Amritsar Junction (ASR) Shatabdi / Vande Bharat Express"
    },
    "haryana": {
        "primary": "Indira Gandhi International Airport Delhi (DEL)",
        "alternatives": ["Chandigarh International Airport (IXC)"],
        "rail_alternative": "Kurukshetra Junction (KKDE) / Ambala Cantt Vande Bharat"
    },
    "uttar pradesh": {
        "primary": "Lal Bahadur Shastri International Airport Varanasi (VNS)",
        "alternatives": ["Chaudhary Charan Singh Airport Lucknow (LKO)", "Prayagraj Airport (IXD)"],
        "rail_alternative": "Varanasi Junction (BSB) / Kashi Vande Bharat Express"
    },
    "jammu and kashmir": {
        "primary": "Sheikh ul-Alam International Airport Srinagar (SXR)",
        "alternatives": ["Jammu Airport (IXJ) + Banihal Vande Bharat Rail Link"],
        "rail_alternative": "Udhampur-Srinagar-Baramulla Rail Link (USBRL) Vande Bharat"
    },
    "ladakh": {
        "primary": "Kushok Bakula Rimpochee Airport Leh (IXL)",
        "alternatives": ["Srinagar Airport (SXR) + Scenic Acclimatization Road via Kargil", "Chandigarh + Manali Highway"],
        "rail_alternative": "Jammu Tawi (JAT) followed by mountain bus/taxi"
    },
    "delhi": {
        "primary": "Indira Gandhi International Airport (DEL)",
        "alternatives": ["Hindon Airport Ghaziabad (HDO)"],
        "rail_alternative": "New Delhi Railway Station (NDLS) / Hazrat Nizamuddin"
    },
    "chandigarh": {
        "primary": "Shaheed Bhagat Singh International Airport (IXC)",
        "alternatives": ["Delhi Indira Gandhi International Airport (DEL) (3 hrs by train)"],
        "rail_alternative": "Chandigarh Junction (CDG) Vande Bharat / Shatabdi Express"
    },

    # ─── West & Central ───
    "rajasthan": {
        "primary": "Jaipur International Airport (JAI)",
        "alternatives": ["Maharana Pratap Airport Udaipur (UDR)", "Jodhpur Airport (JDH)", "Jaisalmer (JSA)"],
        "rail_alternative": "Jaipur Junction (JP) / Ajmer Vande Bharat Express"
    },
    "gujarat": {
        "primary": "Sardar Vallabhbhai Patel International Airport Ahmedabad (AMD)",
        "alternatives": ["Surat Airport (STV)", "Vadodara (BDQ)", "Bhuj Airport (BHJ)"],
        "rail_alternative": "Ahmedabad Junction (ADI) Mumbai-Ahmedabad Vande Bharat"
    },
    "maharashtra": {
        "primary": "Chhatrapati Shivaji Maharaj International Airport Mumbai (BOM)",
        "alternatives": ["Pune International Airport (PNQ)", "Dr. Babasaheb Ambedkar Airport Nagpur (NAG)"],
        "rail_alternative": "CSMT Mumbai / Pune Junction Vande Bharat Express"
    },
    "goa": {
        "primary": "Manohar International Airport Mopa (GOX)",
        "alternatives": ["Dabolim Airport Goa (GOI)", "Belagavi Airport (IXG)"],
        "rail_alternative": "Madgaon Junction (MAO) Mumbai-Goa Tejas / Vande Bharat"
    },
    "madhya pradesh": {
        "primary": "Raja Bhoj Airport Bhopal (BHO)",
        "alternatives": ["Devi Ahilyabai Holkar Airport Indore (IDR)", "Khajuraho Airport (HJR)", "Jabalpur (JLR)"],
        "rail_alternative": "Bhopal Junction (BPL) / Rani Kamlapati Vande Bharat"
    },
    "chhattisgarh": {
        "primary": "Swami Vivekananda Airport Raipur (RPR)",
        "alternatives": ["Bilaspur Airport (PAB)", "Jagdalpur Airport Bastar (JGB)"],
        "rail_alternative": "Raipur Junction (R) / Bilaspur Vande Bharat Express"
    },
    "dadra and nagar haveli and daman and diu": {
        "primary": "Diu Airport (DIU)",
        "alternatives": ["Surat Airport (STV)", "Mumbai International Airport (BOM)"],
        "rail_alternative": "Vapi Railway Station (VAPI) Shatabdi / Vande Bharat"
    },

    # ─── East ───
    "west bengal": {
        "primary": "Netaji Subhash Chandra Bose International Airport Kolkata (CCU)",
        "alternatives": ["Bagdogra International Airport (IXB)", "Kazi Nazrul Islam Airport Durgapur (RDP)"],
        "rail_alternative": "Howrah (HWH) / Sealdah (SDAH) / Vande Bharat to New Jalpaiguri"
    },
    "odisha": {
        "primary": "Biju Patnaik International Airport Bhubaneswar (BBI)",
        "alternatives": ["Jharsuguda Veer Surendra Sai Airport (JRG)", "Visakhapatnam (VTZ)"],
        "rail_alternative": "Puri / Bhubaneswar (BBS) Vande Bharat Express"
    },
    "bihar": {
        "primary": "Jay Prakash Narayan International Airport Patna (PAT)",
        "alternatives": ["Gaya International Airport (GAY)", "Darbhanga Airport (DBR)"],
        "rail_alternative": "Patna Junction (PNBE) / Howrah Vande Bharat Express"
    },
    "jharkhand": {
        "primary": "Birsa Munda Airport Ranchi (IXR)",
        "alternatives": ["Deoghar International Airport (DGH)", "Jamshedpur (IXW)"],
        "rail_alternative": "Ranchi Junction (RNC) Vande Bharat Express to Patna / Howrah"
    },

    # ─── South & Islands ───
    "kerala": {
        "primary": "Cochin International Airport (COK)",
        "alternatives": ["Trivandrum International Airport (TRV)", "Calicut International Airport (CCJ)", "Kannur (CNN)"],
        "rail_alternative": "Ernakulam Junction (ERS) / Thiruvananthapuram Vande Bharat"
    },
    "tamil nadu": {
        "primary": "Chennai International Airport (MAA)",
        "alternatives": ["Madurai International Airport (IXM)", "Coimbatore (CJB)", "Tiruchirappalli (TRZ)"],
        "rail_alternative": "Chennai Central (MAS) / Madurai Vande Bharat Express"
    },
    "karnataka": {
        "primary": "Kempegowda International Airport Bengaluru (BLR)",
        "alternatives": ["Mangaluru International Airport (IXE)", "Hubballi Airport (HBX)", "Belagavi (IXG)"],
        "rail_alternative": "KSR Bengaluru (SBC) / Mysuru / Dharwad Vande Bharat Express"
    },
    "andhra pradesh": {
        "primary": "Visakhapatnam International Airport (VTZ)",
        "alternatives": ["Vijayawada International Airport (VGA)", "Tirupati Airport (TIR)"],
        "rail_alternative": "Visakhapatnam (VSKP) / Secunderabad Vande Bharat Express"
    },
    "telangana": {
        "primary": "Rajiv Gandhi International Airport Hyderabad (HYD)",
        "alternatives": ["Warangal Airport (WGC)"],
        "rail_alternative": "Secunderabad Junction (SC) Vande Bharat to Visakhapatnam / Tirupati"
    },
    "puducherry": {
        "primary": "Puducherry Airport (PNY)",
        "alternatives": ["Chennai International Airport (MAA) + Scenic East Coast Road Drive (2 hrs)"],
        "rail_alternative": "Puducherry Railway Station (PDY) Express corridor"
    },
    "andaman and nicobar islands": {
        "primary": "Veer Savarkar International Airport Port Blair (IXZ)",
        "alternatives": ["Inter-island high-speed Makruzz catamaran & government ferries"],
        "rail_alternative": "Not applicable (Air & Marine waterways only)"
    },
    "lakshadweep": {
        "primary": "Agatti Island Airport (AGX)",
        "alternatives": ["Inter-island Pawan Hans helicopter shuttle & sea ferries from Kochi (COK)"],
        "rail_alternative": "Not applicable (Air & Marine sea vessels only)"
    }
}

# ═══════════════════════════════════════════════════════════════════
# 4. COMPREHENSIVE 24/7 EMERGENCY HOSPITALS & SAFETY REGISTRIES
# ═══════════════════════════════════════════════════════════════════

EMERGENCY_REGISTRIES_ALL: Dict[str, Dict[str, Any]] = {
    # ─── North East ───
    "assam": {
        "hospital_primary": {"name": "Gauhati Medical College & Hospital (GMCH) / Apollo Guwahati", "type": "Apex State Referral & Super Specialty Trauma Care", "distance": "5 km from City Center", "address": "Bhangagarh, Guwahati, Assam 781032", "phone": "+91 361 252 9457 / 108"},
        "hospital_backup": {"name": "Kaziranga Civil Hospital Kohora", "type": "National Park Wildlife & Emergency Post", "distance": "Near Kohora Range Gate", "address": "Kohora, Kaziranga, Assam", "phone": "+91 3776 262 422"},
        "police": {"name": "Assam Tourist Police Assistance Desk", "phone": "112 / +91 361 254 0224"},
        "pharmacy": {"name": "Guwahati Central 24x7 Chemist", "phone": "+91 361 246 1230"},
        "weather_alert": "Lush monsoon showers June–September with high river levels. Ideal wildlife viewing is October through April."
    },
    "meghalaya": {
        "hospital_primary": {"name": "NEIGRIHMS (North Eastern Indira Gandhi Regional Institute)", "type": "Apex Central Autonomous Institute & 24x7 Trauma Center", "distance": "8 km from Police Bazar Shillong", "address": "Mawdiangdiang, Shillong, Meghalaya 793018", "phone": "+91 364 253 8011 / 108"},
        "hospital_backup": {"name": "Cherrapunji Community Health Centre (CHC)", "type": "Highland Emergency Care", "distance": "2 km from Sohra Market", "address": "Sohra, Cherrapunji, Meghalaya", "phone": "+91 3637 235 220"},
        "police": {"name": "Meghalaya Tourist Assistance Unit", "phone": "112 / +91 364 222 2214"},
        "pharmacy": {"name": "Police Bazar 24/7 Medicos Shillong", "phone": "+91 364 222 4110"},
        "weather_alert": "Rainiest region on earth. Carry windproof rain jackets and grip shoes for wet limestone root trails."
    },
    "arunachal pradesh": {
        "hospital_primary": {"name": "TRIHMS (Tomo Riba Institute of Health & Medical Sciences)", "type": "State Apex Medical College & Trauma Hospital", "distance": "12 km from Itanagar", "address": "Naharlagun, Papum Pare, Arunachal 791110", "phone": "+91 360 224 4256 / 108"},
        "hospital_backup": {"name": "District Hospital Tawang", "type": "High-Altitude Medical Station", "distance": "1.5 km from Tawang Monastery", "address": "Old Market, Tawang, Arunachal 790104", "phone": "+91 3794 222 214"},
        "police": {"name": "Arunachal Police Helpline & ILP Desk", "phone": "112 / +91 360 221 2233"},
        "pharmacy": {"name": "Tawang Town 24/7 Pharmacy", "phone": "+91 3794 224 110"},
        "weather_alert": "Inner Line Permit (ILP) is required for domestic travelers. Mountain passes like Sela (13,700 ft) require warm layers.",
        "high_altitude_medical": "Altitude sickness precautions advised when driving over Sela Pass into Tawang."
    },
    "sikkim": {
        "hospital_primary": {"name": "Sir Thutob Namgyal Memorial Hospital (STNM Sochagang)", "type": "Premier Multi-Specialty Government Trauma Center", "distance": "4 km from MG Marg Gangtok", "address": "Sochagang, Sichey, Gangtok, Sikkim 737101", "phone": "+91 3592 202 944 / 108"},
        "hospital_backup": {"name": "District Hospital Mangan (North Sikkim Base)", "type": "High-Altitude Medical Facility", "distance": "Gateway to Gurudongmar & Lachung", "address": "Mangan, North Sikkim", "phone": "+91 3592 234 220"},
        "police": {"name": "Sikkim Tourist Police Cell", "phone": "112 / +91 3592 221 152"},
        "pharmacy": {"name": "MG Marg 24x7 Government Pharmacy", "phone": "+91 3592 201 190"},
        "weather_alert": "India's first 100% organic state: single-use plastic bottles strictly banned. Hydrate with mountain spring refill stations."
    },
    "nagaland": {
        "hospital_primary": {"name": "Naga Hospital Authority Kohima (NHAK)", "type": "Premier State Referral Hospital & Emergency Unit", "distance": "1.2 km from Kohima Main Market", "address": "Hospital Colony, Kohima, Nagaland 797001", "phone": "+91 370 224 4022 / 108"},
        "hospital_backup": {"name": "District Hospital Dimapur", "type": "Railhead Trauma Care", "distance": "2 km from Dimapur Station", "address": "Circular Road, Dimapur", "phone": "+91 3862 232 210"},
        "police": {"name": "Nagaland Tourist Police Cell", "phone": "112 / +91 370 224 4430"},
        "pharmacy": {"name": "Kohima Main Road 24/7 Chemist", "phone": "+91 370 222 1890"},
        "weather_alert": "Dzukou Valley trek requires warm waterproof gear and sturdy trekking poles."
    },
    "manipur": {
        "hospital_primary": {"name": "Regional Institute of Medical Sciences (RIMS) Imphal", "type": "Central Apex Referral Hospital & Trauma Center", "distance": "2.5 km from Kangla Fort", "address": "Lamphelpat, Imphal, Manipur 795004", "phone": "+91 385 241 4625 / 108"},
        "hospital_backup": {"name": "Moirang Community Health Center", "type": "Loktak Lake Emergency Facility", "distance": "Near INA Memorial, Moirang", "address": "Moirang, Manipur", "phone": "+91 3879 231 220"},
        "police": {"name": "Manipur Tourist Assistance Cell", "phone": "112 / +91 385 245 0100"},
        "pharmacy": {"name": "Imphal Bazar 24/7 Pharmacy", "phone": "+91 385 244 5110"},
        "weather_alert": "Tranquil weather October to April. Floating homestays at Loktak follow strict zero-plastic regulations."
    },
    "mizoram": {
        "hospital_primary": {"name": "Civil Hospital Aizawl / Zoram Medical College (ZMC)", "type": "Apex State Multi-Specialty & Trauma Care", "distance": "3 km from City Center", "address": "Dawrpui, Aizawl, Mizoram 796001", "phone": "+91 389 232 2318 / 108"},
        "hospital_backup": {"name": "Champhai District Hospital", "type": "Eastern Ridge Emergency Care", "distance": "Champhai Border Town", "address": "Champhai, Mizoram", "phone": "+91 3831 234 210"},
        "police": {"name": "Mizoram Tourist Assistance Desk", "phone": "112 / +91 389 233 4455"},
        "pharmacy": {"name": "Aizawl Dawrpui 24/7 Chemist", "phone": "+91 389 231 1290"},
        "weather_alert": "Mountain roads are scenic and calm. Strict local civic decorum: no vehicle honking in Aizawl."
    },
    "tripura": {
        "hospital_primary": {"name": "AGMC & GBP Hospital Agartala", "type": "Apex State Medical College & Trauma Center", "distance": "3 km from Ujjayanta Palace", "address": "Kunjaban, Agartala, Tripura 799006", "phone": "+91 381 235 7005 / 108"},
        "hospital_backup": {"name": "Melaghar Sub-Divisional Hospital", "type": "Neermahal Lake Emergency Care", "distance": "Near Neermahal Water Palace", "address": "Melaghar, Tripura", "phone": "+91 381 252 210"},
        "police": {"name": "Tripura Tourist Police Helpline", "phone": "112 / +91 381 232 4433"},
        "pharmacy": {"name": "Agartala Banamalipur 24/7 Pharmacy", "phone": "+91 381 231 5590"},
        "weather_alert": "Pleasant tropical climate. Best time for boat palaces and rock carvings is October to March."
    },

    # ─── North & Himalayas ───
    "himachal pradesh": {
        "hospital_primary": {"name": "Indira Gandhi Medical College (IGMC) Shimla / RPGMC Tanda Kangra", "type": "Apex State Referral & 24x7 Mountain Trauma Center", "distance": "2.8 km from The Ridge Shimla", "address": "Ridge Road, Lakkar Bazar, Shimla 171001", "phone": "+91 177 280 4251 / 108"},
        "hospital_backup": {"name": "Lady Willingdon Hospital Manali & Civil Hospital Kaza Spiti", "type": "High-Altitude Valley Trauma Post", "distance": "Manali Mall Road & Spiti Valley", "address": "Manali, HP", "phone": "+91 1902 252 341"},
        "police": {"name": "Himachal Pradesh Tourist Police Assistance Cell", "phone": "112 / +91 177 262 1714"},
        "pharmacy": {"name": "Shimla Mall Road 24x7 Government Pharmacy", "phone": "+91 177 265 2410"},
        "weather_alert": "Winter brings heavy snow to high passes (Rohtang, Kunzum). Snow chains and 4x4 vehicles mandatory in winter."
    },
    "uttarakhand": {
        "hospital_primary": {"name": "AIIMS Rishikesh (Apex Trauma Centre) / Doon Medical College", "type": "Institute of National Importance 24x7 Level-1 Trauma Centre", "distance": "3.5 km from Laxman Jhula", "address": "Virbhadra Road, Rishikesh, Uttarakhand 249203", "phone": "+91 135 246 2929 / 108"},
        "hospital_backup": {"name": "Government Combined Hospital Kotdwar / Joshimath CHC", "type": "Himalayan Pilgrim Corridor Care", "distance": "Joshimath / Auli base", "address": "Joshimath, Chamoli, Uttarakhand", "phone": "+91 1389 222 140"},
        "police": {"name": "Uttarakhand Tourist Police & SDRF Helpline", "phone": "112 / +91 135 271 6201"},
        "pharmacy": {"name": "Triveni Ghat 24/7 Medicos Rishikesh", "phone": "+91 135 243 0080"},
        "weather_alert": "Pilgrim routes to Char Dham subject to seasonal road conditions. Rishikesh river rafting operational Oct–June."
    },
    "punjab": {
        "hospital_primary": {"name": "Guru Nanak Dev Hospital / Govt Medical College Amritsar", "type": "Premier Apex Medical Teaching Hospital & Trauma Center", "distance": "3.5 km from Golden Temple", "address": "Majitha Road, Amritsar, Punjab 143001", "phone": "+91 183 257 6821 / 108"},
        "hospital_backup": {"name": "Civil Hospital Amritsar", "type": "District Emergency Center", "distance": "Near Old Bus Stand", "address": "Amritsar, Punjab", "phone": "+91 183 255 4220"},
        "police": {"name": "Punjab Tourist Police Assistance Desk", "phone": "112 / +91 183 222 5544"},
        "pharmacy": {"name": "Hall Bazar 24/7 Pharmacy Amritsar", "phone": "+91 183 240 1190"},
        "weather_alert": "Crisp sunny winters (Nov–Feb) perfect for Golden Temple parikrama and Wagah border ceremony."
    },
    "haryana": {
        "hospital_primary": {"name": "Kalpana Chawla Govt Medical College Karnal / PGIMS Rohtak", "type": "Apex Government Super Specialty Trauma Center", "distance": "25 km from Kurukshetra Brahma Sarovar", "address": "Karnal, Haryana 132001", "phone": "+91 184 226 6377 / 108"},
        "hospital_backup": {"name": "LNJP Civil Hospital Kurukshetra", "type": "District Emergency Hospital", "distance": "2 km from Sacred Sarovar", "address": "Kurukshetra, Haryana", "phone": "+91 1744 220 120"},
        "police": {"name": "Haryana Tourist Police Helpline", "phone": "112 / +91 1744 222 100"},
        "pharmacy": {"name": "Kurukshetra Station Road 24/7 Chemist", "phone": "+91 1744 231 490"},
        "weather_alert": "Pleasant temperate winter from October through March."
    },
    "uttar pradesh": {
        "hospital_primary": {"name": "IMS BHU Sir Sunderlal Hospital / Trauma Centre Varanasi", "type": "Premier Central University Level-1 Trauma Hospital", "distance": "4.5 km from Dashashwamedh Ghat", "address": "Banaras Hindu University, Varanasi, UP 221005", "phone": "+91 542 236 9031 / 108"},
        "hospital_backup": {"name": "SN Medical College Agra / KGMU Trauma Lucknow", "type": "Apex Regional Referral", "distance": "Central Agra / Lucknow", "address": "Agra / Lucknow, UP", "phone": "+91 562 226 0353"},
        "police": {"name": "UP Tourist Police & Kashi Temple Cell", "phone": "112 / +91 542 250 1100"},
        "pharmacy": {"name": "BHU Gate 24/7 Medicos Varanasi", "phone": "+91 542 231 1230"},
        "weather_alert": "Ghat boat rides restricted during peak monsoon water swells in July–August. Pristine from October to March."
    },
    "jammu and kashmir": {
        "hospital_primary": {"name": "SMHS Hospital / SKIMS Medical College Srinagar", "type": "Apex State Referral & 24x7 Trauma Center", "distance": "3.8 km from Dal Lake Boulevard", "address": "Karan Nagar, Srinagar, J&K 190010", "phone": "+91 194 250 4114 / 108"},
        "hospital_backup": {"name": "Sub-District Hospital Tangmarg (Gulmarg Base)", "type": "Mountain Trauma & Hypothermia Station", "distance": "12 km below Gulmarg", "address": "Tangmarg, Baramulla, J&K", "phone": "+91 1954 254 220"},
        "police": {"name": "J&K Tourist Police Cell Srinagar", "phone": "112 / +91 194 245 2040"},
        "pharmacy": {"name": "Lal Chowk 24/7 Medical Hall", "phone": "+91 194 247 1180"},
        "weather_alert": "Winter snowfall (Dec–Feb) requires 4x4 vehicles with snow chains between Tangmarg and Gulmarg."
    },
    "ladakh": {
        "hospital_primary": {"name": "SNM District Hospital Leh (Sonam Norboo Memorial)", "type": "Specialized High-Altitude Medicine & Hyperbaric Oxygen Unit", "distance": "1.5 km from Leh Main Bazaar", "address": "Skara, Leh, Ladakh 194101", "phone": "+91 1982 252 012 / 108"},
        "hospital_backup": {"name": "Military Hospital (MH) Leh & Diskit Sub-District Hospital", "type": "Army Emergency High-Altitude Medical Care", "distance": "Diskit Village, Nubra Valley", "address": "Diskit, Nubra Valley, Ladakh", "phone": "+91 1980 220 022"},
        "police": {"name": "Leh Tourist Police Station", "phone": "112 / +91 1982 252 018"},
        "pharmacy": {"name": "Leh Main Market 24/7 Chemist & Oxygen Refill", "phone": "+91 1982 253 440"},
        "weather_alert": "Sub-zero night temperatures at high passes (Khardung La, Chang La). Mandatory Diamox and SpO2 monitoring.",
        "high_altitude_medical": "Mandatory 48-hour rest in Leh (11,500 ft) before ascending to passes. Keep SpO2 above 85%."
    },
    "delhi": {
        "hospital_primary": {"name": "AIIMS New Delhi / Safdarjung Hospital Apex Trauma", "type": "Premier National Level-1 Trauma & Emergency Centre", "distance": "8 km from Connaught Place", "address": "Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029", "phone": "+91 11 2658 8500 / 112"},
        "hospital_backup": {"name": "Dr. Ram Manohar Lohia (RML) Hospital", "type": "Central Emergency Care", "distance": "2 km from Central Secretariat", "address": "Baba Kharak Singh Marg, New Delhi", "phone": "+91 11 2336 5525"},
        "police": {"name": "Delhi Police Tourist Help Desk", "phone": "112 / +91 11 2336 6730"},
        "pharmacy": {"name": "Apollo 24/7 Pharmacy Connaught Place", "phone": "+91 11 2341 5590"},
        "weather_alert": "November through February offers pleasant sunny weather. Metro network offers fastest transit."
    },
    "chandigarh": {
        "hospital_primary": {"name": "PGIMER Chandigarh (Post Graduate Institute)", "type": "Apex National Medical Research & Level-1 Trauma", "distance": "3 km from Sector 17", "address": "Sector 12, Chandigarh 160012", "phone": "+91 172 274 7585 / 112"},
        "hospital_backup": {"name": "Government Medical College & Hospital (GMCH 32)", "type": "Super Specialty Care", "distance": "Sector 32, Chandigarh", "address": "Sector 32, Chandigarh", "phone": "+91 172 266 5253"},
        "police": {"name": "Chandigarh Tourist Police Help Desk", "phone": "112 / +91 172 274 0106"},
        "pharmacy": {"name": "Sector 17 24x7 Government Pharmacy", "phone": "+91 172 270 2190"},
        "weather_alert": "Clean, orderly green city. Ideal stopover before climbing to Shimla and Manali."
    },

    # ─── West & Central ───
    "rajasthan": {
        "hospital_primary": {"name": "SMS Hospital (Sawai Man Singh Hospital) Jaipur", "type": "Government Apex Multi-Specialty & Trauma Center", "distance": "2.5 km from City Palace", "address": "Jawahar Lal Nehru Marg, Jaipur, Rajasthan 302004", "phone": "+91 141 251 8224 / 108"},
        "hospital_backup": {"name": "MDM Hospital Jodhpur / MB Hospital Udaipur", "type": "Regional Trauma Care", "distance": "City Center Jodhpur / Udaipur", "address": "Jodhpur / Udaipur, Rajasthan", "phone": "+91 291 243 4374"},
        "police": {"name": "Rajasthan Tourist Assistance Force (TAF)", "phone": "1364 / 112"},
        "pharmacy": {"name": "Apollo 24/7 Pharmacy MI Road Jaipur", "phone": "+91 141 237 0090"},
        "weather_alert": "Arid climate. Summer peaks in May–June. Winter (Nov–Feb) brings crisp sunny days (18–24°C) and cool desert nights."
    },
    "gujarat": {
        "hospital_primary": {"name": "Civil Hospital Ahmedabad (Asia's Largest Hospital Complex)", "type": "Apex Government Multi-Specialty & Trauma Care", "distance": "4 km from Sabarmati Ashram", "address": "Asarwa, Ahmedabad, Gujarat 380016", "phone": "+91 79 2268 3721 / 108"},
        "hospital_backup": {"name": "GK General Hospital Bhuj (Kutch Base)", "type": "Desert District Emergency Care", "distance": "Bhuj City, Kutch", "address": "Bhuj, Kutch, Gujarat", "phone": "+91 2832 250 120"},
        "police": {"name": "Gujarat Tourist Police Assistance Cell", "phone": "112 / +91 79 2325 1900"},
        "pharmacy": {"name": "Ahmedabad SG Highway 24/7 Pharmacy", "phone": "+91 79 2685 1190"},
        "weather_alert": "Rann of Kutch white salt marsh is accessible during winter (Nov–Feb) during Rann Utsav."
    },
    "maharashtra": {
        "hospital_primary": {"name": "KEM Hospital / Lilavati Hospital Mumbai", "type": "Premier Government Level-1 Trauma Hospital & Super Specialty", "distance": "5 km from Marine Drive", "address": "Acharya Donde Marg, Parel, Mumbai 400012", "phone": "+91 22 2410 7000 / 112"},
        "hospital_backup": {"name": "Government Medical College & Hospital Aurangabad (Chhatrapati Sambhaji Nagar)", "type": "Ajanta-Ellora Base Hospital", "distance": "Central Aurangabad", "address": "Aurangabad, Maharashtra", "phone": "+91 240 240 2412"},
        "police": {"name": "Mumbai Tourist Police Assistance Booth Gateway of India", "phone": "112 / +91 22 2262 0111"},
        "pharmacy": {"name": "Wellness Forever 24/7 Pharmacy Marine Drive", "phone": "+91 22 2281 9910"},
        "weather_alert": "Coastal monsoon June to September. October through March offers pleasant breezy evenings."
    },
    "goa": {
        "hospital_primary": {"name": "Goa Medical College & Hospital (GMC Bambolim)", "type": "Premier State Trauma and Emergency Center", "distance": "6 km from Panaji", "address": "Bambolim, Goa 403202", "phone": "+91 832 245 8700 / 108"},
        "hospital_backup": {"name": "District Hospital Mapusa (North Goa)", "type": "Government Emergency Care", "distance": "7 km from Calangute / Baga", "address": "Mapusa, North Goa", "phone": "+91 832 226 2372"},
        "police": {"name": "Goa Tourist Police Assistance Desk", "phone": "112 / +91 832 242 8383"},
        "pharmacy": {"name": "Panaji Municipal 24/7 Chemist", "phone": "+91 832 222 5110"},
        "weather_alert": "Heavy rains and high tides during southwest monsoon (June–Sept). Beach swimming strictly prohibited under red flags."
    },
    "madhya pradesh": {
        "hospital_primary": {"name": "Hamidia Hospital (Gandhi Medical College) Bhopal / AIIMS Bhopal", "type": "Apex State Government Trauma & Super Specialty", "distance": "3 km from Upper Lake Bhopal", "address": "Royal Market, Bhopal, MP 462001", "phone": "+91 755 400 4000 / 108"},
        "hospital_backup": {"name": "Chhatarpur District Hospital (Khajuraho Base)", "type": "UNESCO Monument Emergency Post", "distance": "12 km from Temple Complex", "address": "Chhatarpur, MP", "phone": "+91 7682 241 220"},
        "police": {"name": "MP Tourism Police Help Desk", "phone": "112 / 1363"},
        "pharmacy": {"name": "Bhopal New Market 24/7 Pharmacy", "phone": "+91 755 255 1290"},
        "weather_alert": "National tiger reserves (Kanha, Bandhavgarh) open October through June; closed during monsoon."
    },
    "chhattisgarh": {
        "hospital_primary": {"name": "Dr. BR Ambedkar Memorial Hospital / AIIMS Raipur", "type": "Apex Government Super Specialty Trauma Center", "distance": "3.5 km from Raipur Station", "address": "Jail Road, Raipur, Chhattisgarh 492001", "phone": "+91 771 289 0001 / 108"},
        "hospital_backup": {"name": "Maharani Hospital Jagdalpur (Bastar Base)", "type": "Tribal District Emergency Care", "distance": "Near Chitrakote Falls corridor", "address": "Jagdalpur, Bastar, Chhattisgarh", "phone": "+91 7782 222 340"},
        "police": {"name": "Chhattisgarh Tourist Police Helpline", "phone": "112 / +91 771 222 1100"},
        "pharmacy": {"name": "Raipur Station Road 24/7 Chemist", "phone": "+91 771 242 1190"},
        "weather_alert": "Chitrakote Falls is at its roaring widest (Niagara of India) between July and October."
    },
    "dadra and nagar haveli and daman and diu": {
        "hospital_primary": {"name": "Government Hospital Daman / Shri Vinoba Bhave Civil Hospital Silvassa", "type": "UT Apex Emergency & Trauma Center", "distance": "1.5 km from Moti Daman Fort", "address": "Marwad, Daman 396210", "phone": "+91 260 225 4422 / 108"},
        "hospital_backup": {"name": "Diu Civil Hospital", "type": "Coastal Island Emergency Care", "distance": "Near Diu Fortress", "address": "Fort Road, Diu", "phone": "+91 2875 252 244"},
        "police": {"name": "Daman & Diu Police Assistance Cell", "phone": "112 / +91 260 225 0100"},
        "pharmacy": {"name": "Nani Daman 24/7 Medicos", "phone": "+91 260 225 1890"},
        "weather_alert": "Pleasant tropical sea breeze October through March."
    },

    # ─── East ───
    "west bengal": {
        "hospital_primary": {"name": "SSKM Hospital (IPGMER) / Calcutta Medical College", "type": "Premier Government Trauma Center & Apex Referral", "distance": "1.2 km from Victoria Memorial", "address": "244 AJC Bose Road, Bhowanipore, Kolkata 700020", "phone": "+91 33 2223 1589 / 108"},
        "hospital_backup": {"name": "Darjeeling District Hospital (Eden Hospital)", "type": "Hill Station Emergency Care", "distance": "1 km from Mall Road Darjeeling", "address": "Darjeeling, West Bengal", "phone": "+91 354 225 4218"},
        "police": {"name": "Kolkata Police Tourist Assistance Cell", "phone": "112 / +91 33 2214 3230"},
        "pharmacy": {"name": "Frank Ross 24/7 Pharmacy Park Street", "phone": "+91 33 2229 6554"},
        "weather_alert": "Pleasant, festive winter from October through February. Light woolens for December–January evenings in Kolkata."
    },
    "odisha": {
        "hospital_primary": {"name": "AIIMS Bhubaneswar / SCB Medical College Cuttack", "type": "National Apex Level-1 Trauma Hospital", "distance": "6 km from Lingaraj Temple", "address": "Sijua, Patrapada, Bhubaneswar 751019", "phone": "+91 674 247 6789 / 108"},
        "hospital_backup": {"name": "District Headquarters Hospital Puri", "type": "Jagannath Temple Corridor Emergency Post", "distance": "1.5 km from Jagannath Temple & Golden Beach", "address": "Grand Road, Puri, Odisha", "phone": "+91 6752 222 044"},
        "police": {"name": "Odisha Tourist Police Cell Puri & Bhubaneswar", "phone": "112 / +91 674 253 6767"},
        "pharmacy": {"name": "Master Canteen 24/7 Pharmacy Bhubaneswar", "phone": "+91 674 253 1190"},
        "weather_alert": "Golden Beach Puri is a certified Blue Flag eco-beach. Best weather from October to March."
    },
    "bihar": {
        "hospital_primary": {"name": "AIIMS Patna / PMCH (Patna Medical College & Hospital)", "type": "Apex Government Level-1 Trauma & Super Specialty", "distance": "8 km from Patna Junction", "address": "Phulwarisharif, Patna, Bihar 801507", "phone": "+91 612 245 1070 / 108"},
        "hospital_backup": {"name": "Anugrah Narayan Magadh Medical College Gaya", "type": "Bodh Gaya International Pilgrim Care", "distance": "12 km from Mahabodhi Temple", "address": "Gaya, Bihar", "phone": "+91 631 222 0450"},
        "police": {"name": "Bihar Tourist Police Helpline Bodh Gaya & Patna", "phone": "112 / +91 612 223 3456"},
        "pharmacy": {"name": "Bodh Gaya Temple Road 24/7 Chemist", "phone": "+91 631 220 0190"},
        "weather_alert": "UNESCO Mahabodhi Temple complex is peaceful and cool October through March."
    },
    "jharkhand": {
        "hospital_primary": {"name": "RIMS (Rajendra Institute of Medical Sciences) Ranchi", "type": "Premier Apex State Referral & Trauma Hospital", "distance": "4 km from Ranchi Station", "address": "Bariatu, Ranchi, Jharkhand 834009", "phone": "+91 651 254 1533 / 108"},
        "hospital_backup": {"name": "Sadar Hospital Deoghar", "type": "Baidyanath Dham Pilgrim Emergency Care", "distance": "2 km from Baidyanath Temple", "address": "Deoghar, Jharkhand", "phone": "+91 6432 232 210"},
        "police": {"name": "Jharkhand Tourist Police Assistance Desk", "phone": "112 / +91 651 249 0044"},
        "pharmacy": {"name": "Main Road Ranchi 24/7 Pharmacy", "phone": "+91 651 233 1180"},
        "weather_alert": "Waterfalls (Hundru, Jonha, Dassam) at peak splendor July through February."
    },

    # ─── South & Islands ───
    "kerala": {
        "hospital_primary": {"name": "General Hospital Ernakulam / Aster Medcity Kochi", "type": "NABH-Accredited Multi-Specialty & Government Trauma Center", "distance": "4.2 km from City Center / 22 km from Airport", "address": "Hospital Road, Marine Drive, Kochi, Kerala 682011", "phone": "+91 484 236 0015 / 108"},
        "hospital_backup": {"name": "Government Taluk Hospital Alleppey / Munnar General Hospital", "type": "District Emergency Care", "distance": "Within 5 km of tourist boating jetties", "address": "Hospital Road, Alappuzha, Kerala", "phone": "+91 477 225 1323"},
        "police": {"name": "Kerala Tourist Police / Control Room", "phone": "112 / +91 484 239 4770"},
        "pharmacy": {"name": "Neethi 24x7 Government Pharmacy Kochi", "phone": "+91 484 235 4890"},
        "weather_alert": "Coastal weather is tropical. Monsoons active June–August; September to March offers pristine sunny conditions."
    },
    "tamil nadu": {
        "hospital_primary": {"name": "Rajiv Gandhi Government General Hospital Chennai / Apollo Greams Road", "type": "Apex Multi-Specialty & Level-1 Government Trauma Center", "distance": "1 km from Chennai Central Station", "address": "EVR Periyar Salai, Park Town, Chennai 600003", "phone": "+91 44 2530 5000 / 108"},
        "hospital_backup": {"name": "Government Rajaji Hospital Madurai / Ooty Government Hospital", "type": "Regional Heritage & Hill Emergency Facility", "distance": "Central Madurai / Ooty Nilgiris", "address": "Madurai / Ooty, Tamil Nadu", "phone": "+91 452 253 2535"},
        "police": {"name": "Tamil Nadu Tourist Police Helpline", "phone": "112 / +91 44 2844 7788"},
        "pharmacy": {"name": "Apollo 24/7 Pharmacy Anna Salai Chennai", "phone": "+91 44 2829 0200"},
        "weather_alert": "Shore Temples and hill stations (Ooty, Kodaikanal) best visited October through March."
    },
    "karnataka": {
        "hospital_primary": {"name": "Victoria Hospital / Bowring & Lady Curzon Hospital Bengaluru", "type": "Apex Government Multi-Specialty & Trauma Center", "distance": "3 km from Majestic Station", "address": "Fort Road, Kalasipalyam, Bengaluru 560002", "phone": "+91 80 2670 1150 / 108"},
        "hospital_backup": {"name": "District Hospital Hospet (Hampi Base) / Madikeri Hospital Coorg", "type": "UNESCO Heritage & Plantation Emergency Post", "distance": "12 km from Hampi Bazaar", "address": "Hospet / Coorg, Karnataka", "phone": "+91 8394 222 140"},
        "police": {"name": "Karnataka Tourist Police Assistance Cell", "phone": "112 / +91 80 2221 2222"},
        "pharmacy": {"name": "Brigade Road 24/7 Chemist Bengaluru", "phone": "+91 80 2558 1190"},
        "weather_alert": "Pleasant weather year-round in Bengaluru; Hampi best explored October to March."
    },
    "andhra pradesh": {
        "hospital_primary": {"name": "King George Hospital (KGH) Visakhapatnam / SVIMS Tirupati", "type": "Premier State Referral & Super Specialty Trauma Hospital", "distance": "2.5 km from RK Beach Vizag", "address": "Maharanipeta, Visakhapatnam 530002", "phone": "+91 891 256 4891 / 108"},
        "hospital_backup": {"name": "Area Hospital Araku Valley", "type": "Eastern Ghats Hill Station Care", "distance": "Central Araku Valley", "address": "Araku, Alluri Sitharama Raju District", "phone": "+91 8936 249 220"},
        "police": {"name": "Andhra Pradesh Tourist Police Desk", "phone": "112 / +91 891 256 5454"},
        "pharmacy": {"name": "Vizag Beach Road 24/7 Pharmacy", "phone": "+91 891 270 1190"},
        "weather_alert": "Rushikonda Beach is Blue Flag certified with lifeguards. Winter is calm and sunny."
    },
    "telangana": {
        "hospital_primary": {"name": "Osmania General Hospital / NIMS (Nizam's Institute) Hyderabad", "type": "Premier State Super Specialty & Level-1 Trauma Hospital", "distance": "2 km from Charminar", "address": "Afzal Gunj, Hyderabad, Telangana 500012", "phone": "+91 40 2460 0121 / 108"},
        "hospital_backup": {"name": "MGM Hospital Warangal", "type": "Heritage Kakatiya Corridor Emergency Care", "distance": "Near Warangal Fort", "address": "Warangal, Telangana", "phone": "+91 870 244 5566"},
        "police": {"name": "Telangana Tourist Police Assistance Unit", "phone": "112 / +91 40 2785 2435"},
        "pharmacy": {"name": "Apollo 24/7 Pharmacy Banjara Hills Hyderabad", "phone": "+91 40 2360 7777"},
        "weather_alert": "Great culinary capital. October through March brings temperate pleasant weather."
    },
    "puducherry": {
        "hospital_primary": {"name": "JIPMER (Jawaharlal Institute of Postgraduate Medical Education)", "type": "Institute of National Importance Level-1 Apex Trauma Centre", "distance": "4 km from French Quarter Promenade", "address": "Dhanvantari Nagar, Gorimedu, Puducherry 605006", "phone": "+91 413 229 6000 / 108"},
        "hospital_backup": {"name": "Indira Gandhi Government General Hospital Puducherry", "type": "Colonial Quarter Emergency Care", "distance": "500m from Rock Beach", "address": "Victor Simonel Street, Puducherry", "phone": "+91 413 233 6050"},
        "police": {"name": "Puducherry Tourist Police Assistance Cell", "phone": "112 / +91 413 223 1300"},
        "pharmacy": {"name": "Mission Street 24/7 Pharmacy White Town", "phone": "+91 413 222 1890"},
        "weather_alert": "Bicycle-friendly French colonial promenade closed to motor traffic every evening (6pm–7:30am)."
    },
    "andaman and nicobar islands": {
        "hospital_primary": {"name": "GB Pant Hospital / ANIIMS Port Blair", "type": "UT Apex Referral & Super Specialty Hospital", "distance": "1.5 km from Cellular Jail", "address": "Atlanta Point, Port Blair, Andaman 744104", "phone": "+91 3192 232 102 / 108"},
        "hospital_backup": {"name": "Primary Health Centre (PHC) Havelock (Swaraj Dweep)", "type": "Island Emergency & Diving Medicine Post", "distance": "Village No. 3, Govind Nagar, Havelock", "address": "Swaraj Dweep, South Andaman", "phone": "+91 3192 282 205"},
        "police": {"name": "Andaman Tourist Police Assistance Cell", "phone": "112 / +91 3192 233 077"},
        "pharmacy": {"name": "Aberdeen Bazaar 24/7 Chemist Port Blair", "phone": "+91 3192 234 119"},
        "weather_alert": "Radhanagar Beach rated best in Asia. Scuba diving operational October to May. Tropical showers June–Sept."
    },
    "lakshadweep": {
        "hospital_primary": {"name": "Indira Gandhi Hospital Kavaratti / Rajiv Gandhi Specialty Agatti", "type": "UT Apex Government Island Hospital & Marine Medical Post", "distance": "Central Kavaratti Island", "address": "Kavaratti, Lakshadweep 682555", "phone": "+91 4896 262 234 / 108"},
        "hospital_backup": {"name": "Community Health Centre Bangaram / Minicoy", "type": "Coral Atoll Emergency Clinic", "distance": "Island Center", "address": "Agatti / Minicoy, Lakshadweep", "phone": "+91 4894 242 220"},
        "police": {"name": "Lakshadweep Island Police Helpline", "phone": "112 / +91 4896 262 258"},
        "pharmacy": {"name": "Agatti Airport Dispensary & Kavaratti Medicos", "phone": "+91 4894 242 110"},
        "weather_alert": "Strict eco-permit required for entry. High marine protection zone: touching coral reefs strictly prohibited."
    }
}

# ═══════════════════════════════════════════════════════════════════
# 5. AUTHENTIC REGIONAL FOOD SPECIALTIES FOR ALL 36 STATES & UTS
# ═══════════════════════════════════════════════════════════════════

REGIONAL_FOOD_SPECIALTIES: Dict[str, List[Dict[str, str]]] = {
    "assam": [
        {"name": "Masor Tenga", "desc": "Light sour freshwater fish curry prepared with elephant apple (ou tenga) and lemon."},
        {"name": "Duck Curry with Ash Gourd", "desc": "Tender duck meat slow-cooked with aromatic local ginger and whole black pepper."},
        {"name": "Assamese Pitha", "desc": "Sweet or savory rice cakes filled with grated coconut and roasted black sesame."}
    ],
    "meghalaya": [
        {"name": "Jadoh", "desc": "Fragrant Meghalaya red hill rice cooked with succulent meat, bay leaf, and wild ginger."},
        {"name": "Dohneiiong", "desc": "Tender pork cooked in a rich, velvety black sesame seed paste and mountain spices."},
        {"name": "Pukhlein", "desc": "Golden fried rice flour and jaggery snacks, best enjoyed with steaming piping-hot red tea."}
    ],
    "arunachal pradesh": [
        {"name": "Thukpa & Zan", "desc": "Warm whole-grain millet porridge and hearty noodle broth infused with mountain coriander."},
        {"name": "Pika Pila", "desc": "Traditional pickle made of fermented bamboo shoots, pork fat, and king chili (Bhut Jolokia)."},
        {"name": "Butter Tea (Gur Gur)", "desc": "Hand-churned tea with yak butter and Himalayan rock salt for sub-zero warmth."}
    ],
    "sikkim": [
        {"name": "Steamed Momos & Tingmo", "desc": "Piping hot handmade steamed dumplings served with fiery fermented chili dally dip."},
        {"name": "Gundruk & Sinki Soup", "desc": "Traditional fermented leafy mustard greens soup rich in natural enzymes."},
        {"name": "Sel Roti", "desc": "Crisp, ring-shaped sweet fried rice bread, festive Nepali-Sikkimese specialty."}
    ],
    "nagaland": [
        {"name": "Smoked Pork with Axone", "desc": "Tender oak-smoked pork cooked with fermented soybean paste (Axone) and Naga king chili."},
        {"name": "Galho Rice Porridge", "desc": "Comforting Naga khichdi made with local mountain herbs and indigenous vegetables."},
        {"name": "Zutho Rice Brew", "desc": "Traditional organic fermented rice drink with mild fruity aromas."}
    ],
    "manipur": [
        {"name": "Eromba", "desc": "Mashed boiled vegetables, potato, and king chili seasoned with fermented fish (Ngari)."},
        {"name": "Kangsoi", "desc": "Healthy clear vegetable stew flavored with fried fish slices and fresh garlic chives."},
        {"name": "Chak-hao Kheer", "desc": "Luxurious purple dessert made from indigenous Manipur black aromatic sticky rice."}
    ],
    "mizoram": [
        {"name": "Bai", "desc": "Light, wholesome stew of steamed local greens, pork, and bamboo shoots with natural soda."},
        {"name": "Vawksa Rep", "desc": "Dry smoked pork slices stir-fried with fragrant mountain ginger and mustard leaves."},
        {"name": "Sawhchiar", "desc": "Warm comforting rice and chicken porridge flavored with garlic and black peppercorns."}
    ],
    "tripura": [
        {"name": "Mui Borok", "desc": "Traditional Tripuri culinary cornerstone prepared with fermented fish (Berma)."},
        {"name": "Chakhwi", "desc": "Authentic bamboo shoot, pork, and jackfruit seed curry made with natural alkaline khar."},
        {"name": "Mosdeng Serma", "desc": "Spicy tomato and roasted fermented fish chutney with crushed green chilies."}
    ],
    "himachal pradesh": [
        {"name": "Himachali Dham", "desc": "Traditional festive feast served on leaf plates featuring Madra, Chana Khatta, and Meetha Bhaat."},
        {"name": "Siddu", "desc": "Steamed whole-wheat yeast dough bun stuffed with spiced poppy seeds or crushed walnut paste."},
        {"name": "Kullu Trout Fish", "desc": "Fresh Himalayan river trout pan-fried in mustard oil with local mountain herbs."}
    ],
    "uttarakhand": [
        {"name": "Kafuli & Chainsoo", "desc": "Nutritious slow-cooked spinach-fenugreek gravy and roasted black gram dal stew."},
        {"name": "Aloo ke Gutke", "desc": "Crispy boiled mountain potato cubes tossed in aromatic jambu herb and mustard oil."},
        {"name": "Jhangora Ki Kheer", "desc": "Sweet creamy dessert crafted from nutritious Himalayan barnyard millet."}
    ],
    "punjab": [
        {"name": "Amritsari Kulcha with Chole", "desc": "Crispy, flaky tandoori flatbread stuffed with spiced potato, served with buttery chickpeas."},
        {"name": "Sarson ka Saag & Makki Roti", "desc": "Classic winter mustard greens slow-cooked in handi, topped with freshly churned white butter."},
        {"name": "Creamy Patiala Lassi", "desc": "Thick chilled sweetened curd served in a tall brass tumbler with thick malai layer."}
    ],
    "haryana": [
        {"name": "Bajra Khichdi", "desc": "Hearty winter pearl millet and moong dal porridge served with pure desi cow ghee and jaggery."},
        {"name": "Hara Dhania Cholia", "desc": "Fresh tender green chickpeas cooked with roasted spices and fresh coriander paste."},
        {"name": "Kachri ki Sabzi", "desc": "Tangy wild desert cucumber vegetable preparation native to rural Haryana."}
    ],
    "uttar pradesh": [
        {"name": "Banarasi Kachori Sabzi & Jalebi", "desc": "Crisp urad dal kachori with spicy hing-infused potato curry, followed by crispy hot jalebis."},
        {"name": "Awadhi Dum Biryani", "desc": "Fragrant long-grain rice layered with saffron-infused meat slow-cooked in sealed clay handi."},
        {"name": "Malaiyo (Winter Special)", "desc": "Ethereal saffron milk froth served in clay kulhads, available only during winter dawns."}
    ],
    "jammu and kashmir": [
        {"name": "Wazwan Rogan Josh", "desc": "Royal Kashmiri banquet specialty cooked with Kashmiri red chilies (Maval) and aromatic saffron."},
        {"name": "Kashmiri Kahwa", "desc": "Green tea infused with whole cinnamon, cardamom, saffron strands, and slivered almonds."},
        {"name": "Modur Pulao", "desc": "Fragrant sweet rice delicacy cooked with milk, saffron, pure ghee, and roasted dry fruits."}
    ],
    "ladakh": [
        {"name": "Skyu & Thukpa", "desc": "Hand-kneaded whole wheat pasta discs and noodle broth slow-cooked with root mountain vegetables."},
        {"name": "Butter Tea (Gur Gur Cha)", "desc": "Churned yak butter and Himalayan rock salt tea that prevents high-altitude dehydration."},
        {"name": "Fresh Organic Apricot Jam & Tingmo", "desc": "Warm steamed twisted buns served with freshly harvested sweet Sham Valley apricot preserves."}
    ],
    "delhi": [
        {"name": "Chandni Chowk Parathas", "desc": "Deep-fried stuffed breads with fillings ranging from spiced potato and rabri to khoya."},
        {"name": "Old Delhi Butter Chicken & Nihari", "desc": "Velvety tomato-butter gravy and overnight slow-cooked stew from historic Matia Mahal alleys."},
        {"name": "Daulat ki Chaat", "desc": "Delicate, melt-in-mouth milk cloud dessert dusted with pistachios and edible silver vark."}
    ],
    "chandigarh": [
        {"name": "Sector 17 Chole Bhature", "desc": "Puffed golden bhaturas served with spiced pindi chickpeas and pickled green chilies."},
        {"name": "Tandoori Chicken Specialties", "desc": "Clay-oven roasted chicken marinated in hung curd, degi mirch, and mustard oil."},
        {"name": "Sukhna Lake Kulfi Falooda", "desc": "Creamy saffron kulfi topped with rose syrup and chilled cornstarch vermicelli."}
    ],
    "rajasthan": [
        {"name": "Dal Baati Churma", "desc": "Wood-fired wheat dough balls soaked in pure desi ghee, served with five-lentil dal and sweet churma."},
        {"name": "Ker Sangri", "desc": "Unique desert bean and wild berry vegetable stir-fry seasoned with dry red chilies and amchur."},
        {"name": "Rawat Pyaaz Kachori & Ghevar", "desc": "Flaky onion-stuffed crisp pastries and honeycomb-textured festive disc soaked in saffron syrup."}
    ],
    "gujarat": [
        {"name": "Gujarati Thali", "desc": "Harmonious sweet-savory platter with Dhokla, Thepla, Undhiyu, Kadi, and Shrikhand."},
        {"name": "Kutchi Dabeli", "desc": "Spicy potato burger studded with roasted peanuts, fresh pomegranate pearls, and sweet chutney."},
        {"name": "Kathiyawadi Ringna No Oro", "desc": "Smoky mashed eggplant prepared with garlic cloves and served with hot bajra rotla."}
    ],
    "maharashtra": [
        {"name": "Mumbai Vada Pav & Pav Bhaji", "desc": "Spiced golden potato fritter in soft pav with dry garlic chutney, and buttery mashed vegetable mash."},
        {"name": "Malvani / Koli Fish Curry", "desc": "Coastal coconut milk and kokum fish curry paired with steaming hot steamed rice."},
        {"name": "Puran Poli", "desc": "Sweet golden flatbread stuffed with fragrant jaggery-lentil paste and cardamom."}
    ],
    "goa": [
        {"name": "Goan Fish Curry Thali", "desc": "Fresh catch of the day cooked in ground coconut, tamarind, and Kashmiri chilies with rice."},
        {"name": "Chicken Xacuti & Pork Vindaloo", "desc": "Intricate toasted coconut gravy with 14 spices, and tangy garlic-vinegar slow braise."},
        {"name": "Bebinca", "desc": "Traditional multi-layered Indo-Portuguese pudding made with coconut milk and caramelized egg yolks."}
    ],
    "madhya pradesh": [
        {"name": "Bhutte Ka Kees", "desc": "Finely grated sweet corn simmered with milk, mustard seeds, green chilies, and fresh coconut."},
        {"name": "Dal Bafla", "desc": "Boiled and then ghee-roasted dough dumplings served with spicy dal and mint chutney."},
        {"name": "Indori Poha & Jalebi", "desc": "Steamed flattened rice seasoned with Jeeravan spice powder and served with crispy hot jalebi."}
    ],
    "chhattisgarh": [
        {"name": "Chila & Fara", "desc": "Savory rice batter crepes and steamed rice flour dumplings tossed in mustard seeds and curry leaves."},
        {"name": "Bastar Mahua Delicacies", "desc": "Natural forest Mahua flower pancakes and sweet jaggery laddoos."},
        {"name": "Dubki Kadhi", "desc": "Gram flour pakodas dropped into tangy spiced buttermilk gravy."}
    ],
    "dadra and nagar haveli and daman and diu": [
        {"name": "Daman Lobster & Prawn Curry", "desc": "Fresh Arabian Sea coastal shellfish cooked with coconut milk and local Portuguese herbs."},
        {"name": "Prawn Koliwada", "desc": "Crisp, spicy batter-fried tiger prawns served with mint chutney and lemon wedges."},
        {"name": "Diu Fruit Cocktail & Bebinca", "desc": "Tropical island sweets influenced by historic sea trade."}
    ],
    "west bengal": [
        {"name": "Kolkata Biryani with Aloo & Egg", "desc": "Aromatic saffron basmati rice slow-cooked with succulent meat, egg, and iconic slow-braised potato."},
        {"name": "Machher Jhol & Shorshe Ilish", "desc": "Tender freshwater fish curry with kalonji, or Hilsa fish steamed in potent mustard-poppy paste."},
        {"name": "Warm Rosogolla & Mishti Doi", "desc": "Spongy cottage cheese balls soaked in warm light syrup and creamy caramelized sweet curd."}
    ],
    "odisha": [
        {"name": "Chhena Poda", "desc": "India's original baked cottage cheese cake caramelized with cardamom and cashew nuts."},
        {"name": "Puri Mahaprasad Dalma", "desc": "Nutritious roasted toor dal slow-cooked in earthen pots with pumpkin, plantain, and ginger."},
        {"name": "Chilika Crab & Prawn Roast", "desc": "Fresh lagoon crab tossed in freshly pounded black pepper, onions, and curry leaves."}
    ],
    "bihar": [
        {"name": "Litti Chokha", "desc": "Charcoal-baked whole wheat balls stuffed with spiced sattu (roasted gram), dipped in pure ghee and served with charred eggplant mash."},
        {"name": "Champaran Ahuna Meat", "desc": "Succulent mutton slow-cooked in sealed clay earthen pots over wood embers with whole garlic bulbs."},
        {"name": "Thekua & Khaja", "desc": "Traditional crisp wheat-jaggery cookies and delicate multi-layered sweet pastry."}
    ],
    "jharkhand": [
        {"name": "Dhuska with Ghugni", "desc": "Deep-fried golden rice and lentil cakes served with spicy black chickpea curry."},
        {"name": "Bamboo Shoot & Rugra Curry", "desc": "Seasonal forest mushrooms (Rugra) and tender bamboo shoots cooked in rustic tribal spices."},
        {"name": "Arsa Roti", "desc": "Sweet crispy rice flour and jaggery bread garnished with white sesame seeds."}
    ],
    "kerala": [
        {"name": "Kerala Sadya on Plantain Leaf", "desc": "24-item pure vegetarian grand feast with Avial, Sambar, Olan, Thoran, Payasam, and red Matta rice."},
        {"name": "Karimeen Pollichathu", "desc": "Fresh pearl spot fish marinated in shallots and crushed black pepper, wrapped in banana leaf and pan-grilled."},
        {"name": "Appam with Vegetable Stew", "desc": "Lacy fermented rice hoppers with a soft spongy center, paired with creamy coconut milk vegetable stew."}
    ],
    "tamil nadu": [
        {"name": "Chettinad Chicken & Pepper Fry", "desc": "Fiery culinary masterpiece seasoned with freshly stone-ground kalpasi (star anise), coriander, and black pepper."},
        {"name": "Crisp Ghee Masala Dosa", "desc": "Golden fermented rice crepe smeared with red chutney and stuffed with spiced potato mash."},
        {"name": "Filter Coffee & Jigarthanda", "desc": "Freshly brewed chicory-coffee decoction with frothy boiled milk, and Madurai's chilled almond gum cooling drink."}
    ],
    "karnataka": [
        {"name": "Bisi Bele Bath & Benne Dosa", "desc": "Rich spiced rice, lentil, and vegetable medley with pure ghee, and crisp Davangere white butter dosa."},
        {"name": "Coorg Pandi Curry & Akki Roti", "desc": "Tender meat infused with indigenous black vinegar (Kachampuli), served with soft rice flatbreads."},
        {"name": "Mysore Pak", "desc": "Royal melt-in-mouth confection made of roasted gram flour, pure cow ghee, and sugar."}
    ],
    "andhra pradesh": [
        {"name": "Gongura Mamsam & Royyala Vepudu", "desc": "Tender meat simmered with tangy sorrel leaves (Gongura), and spicy coastal Andhra prawn fry."},
        {"name": "Pesarattu with Allam Pachadi", "desc": "Whole green gram dosa served with sweet-and-spicy ginger chutney and coconut relish."},
        {"name": "Pootharekulu & Tirupati Laddu", "desc": "Paper-thin rice starch sweet roll with powdered sugar and ghee, and sacred temple gram-ghee confection."}
    ],
    "telangana": [
        {"name": "Hyderabadi Dum Biryani", "desc": "World-famed layered basmati rice and marinated meat slow-cooked under dough seal with saffron."},
        {"name": "Mirchi ka Salan & Bagara Baingan", "desc": "Large green chili peppers cooked in a creamy peanut, sesame, and tamarind curry."},
        {"name": "Irani Chai with Osmania Biscuits", "desc": "Thick caramelized condensed tea served with salty-sweet buttery biscuits."}
    ],
    "puducherry": [
        {"name": "Creole Fish Curry", "desc": "Exquisite Franco-Tamil fusion curry cooked with coconut milk, fennel seeds, shallots, and fresh snapper."},
        {"name": "Baguette & Croissants", "desc": "Freshly baked artisan French sourdough breads and buttery croissants from White Town bakeries."},
        {"name": "Pondicherry Tamarind Duck Roast", "desc": "Slow-roasted coastal duck glazed with tart tamarind, honey, and whole black peppercorns."}
    ],
    "andaman and nicobar islands": [
        {"name": "Grilled Bay Lobster & Tiger Prawns", "desc": "Freshly caught island lobster basted with garlic butter and grilled over coconut husk charcoals."},
        {"name": "Andaman Fish Curry", "desc": "Subtle, aromatic coastal curry simmered with freshly grated coconut milk and lemon grass."},
        {"name": "Fresh Sweet Tender Coconut Water", "desc": "Electrolyte-rich water straight from lush island palms."}
    ],
    "lakshadweep": [
        {"name": "Tuna Rayereha", "desc": "Island specialty of succulent yellowfin tuna chunks simmered in spiced red coconut gravy."},
        {"name": "Kilanji & Mus Kavaab", "desc": "Ultra-thin rice crepes served with sweet coconut milk, and spiced skewered reef fish kababs."},
        {"name": "Kadalakka Halwa", "desc": "Traditional Lakshadweep sweet pudding made from Bengal gram, eggs, and coconut oil."}
    ]
}

# ═══════════════════════════════════════════════════════════════════
# 6. AUTHENTIC CURATED ATTRACTION CLUSTERS (FOR DYNAMIC ROUTING)
# ═══════════════════════════════════════════════════════════════════

ATTRACTION_CLUSTERS_PAN_INDIA: Dict[str, List[Dict[str, Any]]] = {
    "meghalaya": [
        {
            "theme": "Living Root Bridges & Cherrapunji Waterfalls",
            "area": "Nongriat & Sohra Rainforest Cluster",
            "activities": [
                {"time": "08:00 AM", "title": "Traditional Khasi Breakfast (Jadoh & Red Tea)", "cat": "Food", "loc": "Sohra Village Cafe", "dur": 45, "transit": 0, "cost": 150, "tip": "Nutritious red hill rice with mild ginger seasoning."},
                {"time": "09:00 AM", "title": "Trek to Nongriat Double Decker Living Root Bridge", "cat": "Nature", "loc": "Nongriat Rainforest", "dur": 240, "transit": 30, "cost": 100, "tip": "Over 3,000 steps carved through tropical canopy. Carry bamboo walking stick."},
                {"time": "01:30 PM", "title": "Natural Rainbow Falls Turquoise Pool Swim", "cat": "Nature", "loc": "Rainbow Falls Gorge", "dur": 75, "transit": 45, "cost": 50, "tip": "Crystal blue natural spring plunge pool below cascading waters."},
                {"time": "03:30 PM", "title": "Nohkalikai Falls Observation (India's tallest plunge)", "cat": "Nature", "loc": "Nohkalikai Cliff", "dur": 60, "transit": 45, "cost": 50, "tip": "Plunges 1,115 feet into a jade green pool below."},
                {"time": "05:00 PM", "title": "Mawsmai Limestone Cave Exploration", "cat": "Nature", "loc": "Mawsmai Cave", "dur": 60, "transit": 15, "cost": 50, "tip": "Lit natural stalactite and stalagmite formations."},
                {"time": "07:30 PM", "title": "Warm Homestay Dinner with Dohneiiong (Black Sesame Pork)", "cat": "Food", "loc": "Cherrapunji Eco Homestay", "dur": 60, "transit": 20, "cost": 350, "tip": "Authentic Khasi family home-cooked meal."}
            ]
        },
        {
            "theme": "Dawki Crystal River & Mawlynnong Cleanest Village",
            "area": "Indo-Bangladesh Border River Corridor",
            "activities": [
                {"time": "08:30 AM", "title": "Scenic Mountain Drive toward Southern Canyons", "cat": "Transit", "loc": "Pynursla Ridge", "dur": 90, "transit": 90, "cost": 0, "tip": "Views overlooking Bangladesh floodplains."},
                {"time": "10:30 AM", "title": "Transparent River Boat Ride on Umngot River Dawki", "cat": "Nature", "loc": "Dawki Boating Point", "dur": 90, "transit": 15, "cost": 600, "tip": "Water is so crystal clear boats appear to float on thin air."},
                {"time": "01:00 PM", "title": "Fresh River Fish & Khasi Salad Lunch", "cat": "Food", "loc": "Dawki Border Shack", "dur": 45, "transit": 10, "cost": 250, "tip": "Locally caught freshwater fish with shredded bamboo shoot."},
                {"time": "02:30 PM", "title": "Mawlynnong Village Walking Tour (Asia's Cleanest Village)", "cat": "Culture", "loc": "Mawlynnong", "dur": 90, "transit": 35, "cost": 50, "tip": "100% literacy, functional bamboo conical dustbins, and flower-lined lanes."},
                {"time": "04:30 PM", "title": "Riwai Single Living Root Bridge Stroll", "cat": "Nature", "loc": "Riwai Village", "dur": 60, "transit": 15, "cost": 40, "tip": "Easier 10-minute flat walk to an ancient living bridge."},
                {"time": "06:30 PM", "title": "Sky View Bamboo Treehouse Sunset", "cat": "Nature", "loc": "Mawlynnong Viewpoint", "dur": 45, "transit": 10, "cost": 30, "tip": "85-ft high bamboo tower offering horizon panorama."}
            ]
        }
    ],
    "assam": [
        {
            "theme": "Kaziranga Elephant Grasslands & One-Horned Rhinos",
            "area": "Kaziranga Central (Kohora) & Western (Bagori) Ranges",
            "activities": [
                {"time": "06:00 AM", "title": "Dawn Elephant Safari through Morning Mist", "cat": "Nature", "loc": "Kohora Range", "dur": 90, "transit": 15, "cost": 1200, "tip": "Get within meters of Greater One-Horned Rhinoceros grazing in tall elephant grass."},
                {"time": "08:30 AM", "title": "Assamese Luchi & Aloo Bhaji Breakfast", "cat": "Food", "loc": "Jungle Lodge Dining", "dur": 45, "transit": 15, "cost": 150, "tip": "Light puffed flatbreads with spiced local potatoes."},
                {"time": "10:00 AM", "title": "Kaziranga National Orchid & Biodiversity Park", "cat": "Nature", "loc": "Durgapur Village", "dur": 90, "transit": 20, "cost": 150, "tip": "Over 500 indigenous wild orchid species and traditional medicinal garden."},
                {"time": "01:00 PM", "title": "Traditional Assamese Thali with Masor Tenga", "cat": "Food", "loc": "Maihang Ethnic Restaurant", "dur": 60, "transit": 15, "cost": 350, "tip": "Served with Joha aromatic rice and tangy fish curry."},
                {"time": "02:30 PM", "title": "Afternoon 4x4 Jeep Safari across Bagori Range", "cat": "Nature", "loc": "Bagori Western Range", "dur": 150, "transit": 25, "cost": 900, "tip": "Prime zone for wild water buffaloes, swamp deer, and kingfishers."},
                {"time": "06:30 PM", "title": "Bihu Folk Dance & Traditional Dhol Performance", "cat": "Culture", "loc": "Orchid Park Amphitheatre", "dur": 60, "transit": 15, "cost": 100, "tip": "Vibrant folk rhythm celebrating harvest and river bounty."}
            ]
        }
    ],
    "sikkim": [
        {
            "theme": "Gangtok Ridge Heritage & Kanchenjunga Vistas",
            "area": "Gangtok & Rumtek Valley Cluster",
            "activities": [
                {"time": "08:00 AM", "title": "Tibetan Tingmo & Spiced Aloo Dum Breakfast", "cat": "Food", "loc": "MG Marg Bakery", "dur": 45, "transit": 0, "cost": 160, "tip": "Fluffy steamed bread paired with slow-cooked potato curry."},
                {"time": "09:15 AM", "title": "Rumtek Dharma Chakra Centre (Largest Monastery in Sikkim)", "cat": "Heritage", "loc": "Rumtek Valley", "dur": 120, "transit": 45, "cost": 50, "tip": "16th Karmapa seat with sacred golden stupa and ancient silk thangkas."},
                {"time": "12:30 PM", "title": "Steamed Chicken & Cheese Momos with Dalle Khursani", "cat": "Food", "loc": "Taste of Tibet MG Marg", "dur": 60, "transit": 40, "cost": 220, "tip": "Dalle paste is one of the world's hottest yet most aromatic chilies."},
                {"time": "02:00 PM", "title": "Namgyal Institute of Tibetology & Giant Chorten", "cat": "Culture", "loc": "Deorali", "dur": 75, "transit": 15, "cost": 50, "tip": "Global center for Mahayana Buddhist philosophy and rare manuscripts."},
                {"time": "03:45 PM", "title": "Gangtok Ropeway Cable Car Ride across Valley", "cat": "Transit", "loc": "Deorali Ropeway Station", "dur": 30, "transit": 10, "cost": 120, "tip": "Sweeping bird's-eye view of Gangtok ridge and snow peaks."},
                {"time": "05:00 PM", "title": "MG Marg Vehicle-Free Eco Boulevard Stroll", "cat": "Rest", "loc": "MG Marg", "dur": 90, "transit": 10, "cost": 0, "tip": "India's first litter-free, spit-free pedestrian street."}
            ]
        }
    ],
    "tamil nadu": [
        {
            "theme": "Mahabalipuram UNESCO Coastal Monoliths & Shoreline",
            "area": "Coromandel Coastal Heritage Corridor",
            "activities": [
                {"time": "08:00 AM", "title": "Hot Ghee Podi Idli & Filter Coffee", "cat": "Food", "loc": "East Coast Road Dining", "dur": 45, "transit": 0, "cost": 140, "tip": "Soft steamed rice cakes tossed in spiced gunpowder and ghee."},
                {"time": "09:00 AM", "title": "Shore Temple (7th Century Pallava Stone Marvel)", "cat": "Heritage", "loc": "Shore Temple Complex", "dur": 90, "transit": 15, "cost": 50, "tip": "Has withstood Bay of Bengal salt spray and tsunami waves for 1,300 years."},
                {"time": "11:00 AM", "title": "Arjuna's Penance (Descent of the Ganges) Bas-Relief", "cat": "Heritage", "loc": "Town Center", "dur": 60, "transit": 10, "cost": 0, "tip": "World's largest open-air stone relief featuring life-sized elephants."},
                {"time": "12:15 PM", "title": "Pancha Rathas (Five Monolithic Chariots)", "cat": "Heritage", "loc": "Five Rathas Site", "dur": 60, "transit": 10, "cost": 50, "tip": "Each chariot carved out of a single continuous pink granite boulder."},
                {"time": "01:30 PM", "title": "Traditional Banana Leaf Meals with Coastal Prawn Roast", "cat": "Food", "loc": "Moonrakers Seafood", "dur": 60, "transit": 15, "cost": 450, "tip": "Fresh morning catch fried with shallots and curry leaves."},
                {"time": "03:30 PM", "title": "Artisanal Stone Carvers Guild Workshop", "cat": "Culture", "loc": "Sculptors' Street", "dur": 75, "transit": 10, "cost": 0, "tip": "Centuries-old hereditary stone chiseling tradition."},
                {"time": "05:30 PM", "title": "Krishna's Butter Ball & Sunset Beach Reflection", "cat": "Nature", "loc": "Granite Hill Park", "dur": 60, "transit": 10, "cost": 0, "tip": "250-ton spherical boulder balancing defying gravity on 45-degree slope."}
            ]
        }
    ],
    "odisha": [
        {
            "theme": "Puri Jagannath Corridor & Blue Flag Golden Beach",
            "area": "Puri Coastal Pilgrim & Marine Cluster",
            "activities": [
                {"time": "08:00 AM", "title": "Puri Morning Chuda Upma & Sweet Malpua Breakfast", "cat": "Food", "loc": "Grand Road Puri", "dur": 45, "transit": 0, "cost": 120, "tip": "Traditional flattened rice seasoned with grated ginger and mustard."},
                {"time": "09:00 AM", "title": "Darshan of Shree Jagannath Temple & Anandabazar", "cat": "Culture", "loc": "Bada Danda", "dur": 150, "transit": 15, "cost": 0, "tip": "Historic 12th-century shrine. Observe ancient temple kitchen flag fluttering."},
                {"time": "12:00 PM", "title": "Puri Mahaprasad Feast (Abhada Dalma & Rice)", "cat": "Food", "loc": "Ananda Bazar Courtyard", "dur": 60, "transit": 10, "cost": 180, "tip": "Earthen pot cooked sacred vegetarian meal with plantain and pumpkin."},
                {"time": "02:00 PM", "title": "Raghurajpur Heritage Crafts Village Walk", "cat": "Culture", "loc": "Raghurajpur", "dur": 120, "transit": 25, "cost": 100, "tip": "Every villager is an artisan creating palm-leaf Pattachitra scrolls."},
                {"time": "05:00 PM", "title": "Golden Beach Sunset Stroll (Blue Flag Certified)", "cat": "Nature", "loc": "Puri Golden Beach", "dur": 90, "transit": 25, "cost": 20, "tip": "Certified clean shore with dedicated safety zones and sand art installations."},
                {"time": "07:30 PM", "title": "Fresh Baked Chhena Poda Tasting", "cat": "Food", "loc": "Puri Beach Market", "dur": 30, "transit": 10, "cost": 80, "tip": "Caramelized baked cottage cheese cake served warm."}
            ]
        }
    ],
    "andaman and nicobar islands": [
        {
            "theme": "Radhanagar World-Class Beach & Havelock Coral Reefs",
            "area": "Swaraj Dweep (Havelock Island) Cluster",
            "activities": [
                {"time": "08:00 AM", "title": "Fresh Coconut Water & Tropical Fruit Breakfast", "cat": "Food", "loc": "Govind Nagar Beach", "dur": 45, "transit": 0, "cost": 120, "tip": "Sweet tender coconut from surrounding island groves."},
                {"time": "09:00 AM", "title": "Boat Transfer to Elephant Beach Coral Sanctuary", "cat": "Transit", "loc": "Havelock Jetty", "dur": 30, "transit": 30, "cost": 400, "tip": "Speedboat ride over electric turquoise lagoon."},
                {"time": "10:00 AM", "title": "Guided Snorkeling / Sea Walk over Living Corals", "cat": "Nature", "loc": "Elephant Beach Reef", "dur": 120, "transit": 10, "cost": 1200, "tip": "Teeming with clownfish, sea turtles, and brain coral."},
                {"time": "01:00 PM", "title": "Grilled Island Tiger Prawns & Rice Lunch", "cat": "Food", "loc": "Beachside Eco Cafe", "dur": 60, "transit": 15, "cost": 550, "tip": "Locally sourced and marinated with lemon garlic butter."},
                {"time": "03:00 PM", "title": "Rest in Shaded Beach Hammock under Mahua Trees", "cat": "Rest", "loc": "Radhanagar Forest Edge", "dur": 60, "transit": 20, "cost": 0, "tip": "Gentle sea breeze recharge."},
                {"time": "04:30 PM", "title": "Radhanagar Beach Sunset (Ranked Best in Asia)", "cat": "Nature", "loc": "Radhanagar Beach No. 7", "dur": 120, "transit": 10, "cost": 0, "tip": "Powdery white sand curving into iridescent sunset waves."}
            ]
        }
    ]
}

def normalize_destination_name(query_dest: str) -> str:
    """
    Normalizes any city, hill station, or regional variation into the canonical Indian State or UT name.
    """
    import re
    q = (query_dest or "").strip().lower()
    for canonical_name, keywords in PAN_INDIA_DESTINATIONS_MAP.items():
        if any(re.search(r'\b' + re.escape(k) + r'\b', q) for k in keywords):
            return canonical_name
    return query_dest.strip().title()
