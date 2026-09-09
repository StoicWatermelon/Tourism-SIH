/**
 * Bharat Explore — The Great Himalayan Eco-Expedition
 * Interactive Tourism Game Engine (Smart India Hackathon SIH 2026)
 * Replaces legacy coupon tokens with an authentic educational adventure gamifying:
 * 1. High-altitude AMS acclimatization pacing (Safety)
 * 2. Glacial eco-stewardship & zero single-use plastic (Conservation)
 * 3. Direct village cooperative economic revenue (Sustainable Tourism)
 */

(function () {
  'use strict';

  // Sound Synthesizer using Web Audio API (Zero external audio files needed)
  class SoundFx {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }
    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.ctx = new AudioContext();
      }
    }
    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
      if (!this.enabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio policy or unsupported
      }
    }
    good() {
      this.playTone(523.25, 'triangle', 0.1, 0.12);
      setTimeout(() => this.playTone(659.25, 'triangle', 0.15, 0.12), 100);
      setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.15), 200);
    }
    caution() {
      this.playTone(330, 'sawtooth', 0.18, 0.08);
      setTimeout(() => this.playTone(260, 'sawtooth', 0.25, 0.08), 160);
    }
    fanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, idx) => {
        setTimeout(() => this.playTone(n, 'triangle', 0.3, 0.15), idx * 120);
      });
    }
  }

  const sfx = new SoundFx();

  // 5 Authentic Himalayan Expedition Stages & Scenarios
  const STAGES = [
    {
      id: "stage1",
      location: "Leh Old Town",
      altitude: "11,500 ft (3,500 m)",
      region: "Indus Valley, Ladakh",
      img: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1200&q=85",
      title: {
        en: "Stage 1: The 48-Hour Acclimatization Crucible",
        hi: "चरण 1: 48-घंटे का अनिवार्य ऊंचाई अनुकूलन",
        bn: "পর্যায় ১: বাধ্যতামূলক ৪৮ ঘণ্টার উচ্চতা অভিযোজন পরীক্ষা"
      },
      desc: {
        en: "Your flight touches down at Kushok Bakula Rimpochee Airport into thin 11,500 ft air. Your phone buzzes with tour operators urging you to drive immediately up to 17,582 ft Khardung La. How does your expedition spend its first 48 hours?",
        hi: "आपकी उड़ान 11,500 फीट की पतली हवा में लेह हवाई अड्डे पर उतरती है। टूर ऑपरेटर आपको तुरंत 17,582 फीट ऊंचे खारदुंग ला चलने के लिए कहते हैं। आपका अभियान अपने पहले 48 घंटे कैसे बिताएगा?",
        bn: "আপনার বিমান ১১,৫০০ ফুট উচ্চতার পাতলা বাতাসের লেহ বিমানবন্দরে পৌঁছাল। বাইরে বেরোতেই চালকরা সরাসরি ১৭,৫৮২ ফুট উঁচু খারদুং লা গিরিপথে যাওয়ার প্রলোভন দিচ্ছে। আপনার দল প্রথম ৪৮ ঘণ্টা কী করবে?"
      },
      choices: [
        {
          id: "rush",
          type: "danger",
          icon: "⚡",
          text: {
            en: "Rush straight to Khardung La today to save time for sightseeing.",
            hi: "समय बचाने के लिए आज ही सीधे खारदुंग ला दर्रे के लिए निकलें।",
            bn: "সময় বাঁচাতে আজই দ্রুত গাড়ি ভাড়া করে খারদুং লা গিরিপথে চলে যান।"
          },
          deltas: { oxygen: -35, eco: -10, community: 0 },
          feedback: {
            en: "Severe AMS alert! Blood oxygen plunges to 72%. Your team suffers debilitating acute mountain sickness and misses 2 full days under medical oxygen in Leh Hospital.",
            hi: "गंभीर AMS चेतावनी! रक्त में ऑक्सीजन घटकर 72% रह गई। गंभीर सिरदर्द और उल्टी के कारण लेह अस्पताल में 2 दिन ऑक्सीजन पर बिताने पड़े।",
            bn: "মারাত্মক এএমএস সতর্কতা! রক্তে অক্সিজেনের মাত্রা ৭২%-এ নেমে এসেছে। দলের সদস্যরা অসুস্থ হয়ে লেহ হাসপাতালে চিকিৎসাধীন থাকতে বাধ্য হলো।"
          },
          lesson: {
            en: "Himalayan Rule: Ascending >9,000 ft in 24h without 48h rest causes Acute Mountain Sickness (AMS) in over 60% of unacclimatized travelers.",
            hi: "हिमालयी नियम: 48 घंटे आराम किए बिना 9,000 फीट से ऊपर जाने पर 60% से अधिक यात्रियों को तीव्र पर्वतीय बीमारी (AMS) हो जाती है।",
            bn: "হিমালয়ান নিয়ম: ৪৮ ঘণ্টা বিশ্রাম ছাড়া ৯,০০০ ফুটের বেশি উপরে উঠলে ৬০%-এর বেশি পর্যটক উচ্চতাজনিত রোগে (AMS) আক্রান্ত হন।"
          }
        },
        {
          id: "hotel",
          type: "neutral",
          icon: "🏨",
          text: {
            en: "Stay inside an air-conditioned corporate hotel all day ordering fast food.",
            hi: "पूरा दिन कॉर्पोरेट होटल के कमरे में रहकर फास्ट फूड ऑर्डर करें।",
            bn: "পুরো দিন বিলাসবহুল হোটেলের ঘরে আবদ্ধ থেকে ফাস্ট ফুড খান।"
          },
          deltas: { oxygen: +10, eco: 0, community: +400 },
          feedback: {
            en: "Safe acclimatization, but massive power consumption from space heaters and zero revenue for local Ladakhi smallholders.",
            hi: "सुरक्षित अनुकूलन हुआ, लेकिन हीटरों से अत्यधिक बिजली की खपत हुई और स्थानीय लद्दाखी किसानों को कोई सीधा लाभ नहीं मिला।",
            bn: "অভিযোজন নিরাপদ হলেও অতিরিক্ত হিটার ব্যবহারে বিদ্যুৎ অপচয় হলো এবং স্থানীয় মানুষদের কোনো অর্থনৈতিক সাহায্য হলো না।"
          },
          lesson: {
            en: "Responsible tourism balances bodily safety with positive local community impact.",
            hi: "जिम्मेदार पर्यटन शरीर की सुरक्षा के साथ स्थानीय समुदाय के सकारात्मक सहयोग का संतुलन बनाता है।",
            bn: "দায়িত্বশীল পর্যটনের মূল লক্ষ্য শারীরিক নিরাপত্তার পাশাপাশি স্থানীয় অর্থনীতিকে সমৃদ্ধ করা।"
          }
        },
        {
          id: "eco_walk",
          type: "best",
          icon: "🌿",
          text: {
            en: "Rest 48h, sip warm seabuckthorn tea, and take a slow heritage stroll through Leh's mud-brick bakeries.",
            hi: "48 घंटे आराम करें, सीबकथॉर्न चाय पिएं और लेह ओल्ड टाउन की पारंपरिक बेकरियों में धीमी चहलकदमी करें।",
            bn: "৪৮ ঘণ্টা বিশ্রাম নিন, স্থানীয় সি-বাকথর্ন চা খান এবং লেহ শহরের ঐতিহ্যবাহী মাটির রুটিঘরে ঘুরে দেখুন।"
          },
          deltas: { oxygen: +25, eco: +20, community: +1800 },
          feedback: {
            en: "Perfect adaptation! SpO2 stabilizes at 93%. You supported 3 multigenerational Ladakhi bakeries and learned traditional mud-brick thermal architecture.",
            hi: "उत्कृष्ट अनुकूलन! SpO2 93% पर स्थिर हो गया। आपने 3 स्थानीय बेकरियों को सहयोग दिया और पारंपरिक मिट्टी की वास्तुकला को समझा।",
            bn: "চমৎকার অভিযোজন! রক্তে অক্সিজেন ৯৩% এ পৌঁছেছে। আপনি ৩টি ঐতিহ্যবাহী মাটির রুটিঘরকে সাহায্য করলেন এবং পরিবেশবান্ধব মাটির বাড়ি সম্পর্কে জানলেন।"
          },
          lesson: {
            en: "Slow tourism allows natural red-blood-cell acclimatization while directly injecting capital into heritage preservation.",
            hi: "धीमा पर्यटन लाल रक्त कोशिकाओं के प्राकृतिक अनुकूलन में मदद करता है और विरासत संरक्षण को सीधा समर्थन देता है।",
            bn: "ধীরগতির পর্যটন রক্তের লোহিত কণিকাকে উচ্চতার সাথে খাপ খাইয়ে নিতে সাহায্য করে এবং ঐতিহ্য রক্ষায় অর্থ পৌঁছে দেয়।"
          }
        }
      ]
    },
    {
      id: "stage2",
      location: "Sham Valley & Alchi",
      altitude: "10,200 ft (3,100 m)",
      region: "Lower Ladakh Apricot Corridor",
      img: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=85",
      title: {
        en: "Stage 2: The Glacial Stream & Water Bottle Test",
        hi: "चरण 2: ग्लेशियर जलधारा और प्लास्टिक-मुक्त परीक्षा",
        bn: "পর্যায় ২: হিমবাহের স্বচ্ছ জলধারা ও প্লাস্টিকমুক্ত থাকার পরীক্ষা"
      },
      desc: {
        en: "Your expedition reaches the tranquil apricot groves of Sham Valley. It is midday and dehydration sets in. A roadside stall sells single-use plastic bottles, while a village Dzomsa refill cooperative is 200m away. What do you do?",
        hi: "आपका अभियान शाम घाटी के शांत खुबानी के बगीचों में पहुंचता है। दोपहर में प्यास लगती है। एक स्टाल एकल-उपयोग प्लास्टिक की बोतलें बेच रहा है, जबकि 200 मीटर दूर जोम्सा सामुदायिक रिफिल स्टेशन है। आप क्या करेंगे?",
        bn: "আপনার দল শাম উপত্যকার শান্ত এপ্রিকট বাগানে পৌঁছাল। তীব্র তৃষ্ণা পেয়েছে। রাস্তার ধারের দোকানে প্লাস্টিকের বোতল বিক্রি হচ্ছে, আর ২০০ মিটার দূরে গ্রামের জোমসা সৌর জল শোধনাগার। আপনি কী করবেন?"
      },
      choices: [
        {
          id: "single_use",
          type: "danger",
          icon: "🗑️",
          text: {
            en: "Buy a pack of 6 single-use plastic water bottles and discard them along the scenic gorge.",
            hi: "6 प्लास्टिक पानी की बोतलें खरीदें और उन्हें सुंदर घाटी के किनारे फेंक दें।",
            bn: "৬টি প্লাস্টিকের বোতল কিনে ফেলুন এবং পাহাড়ি গিরিখাতে ফেলে দিন।"
          },
          deltas: { oxygen: +5, eco: -30, community: +100 },
          feedback: {
            en: "Eco Disaster! Single-use plastic bottles take 450+ years to degrade in sub-zero Himalayan cold, poisoning alpine pastures grazed by pashmina goats.",
            hi: "पर्यावरणीय आपदा! शून्य से नीचे के तापमान में प्लास्टिक को नष्ट होने में 450+ वर्ष लगते हैं, जिससे पश्मीना बकरियों के चरागाह विषैले हो जाते हैं।",
            bn: "ভয়াবহ পরিবেশ দূষণ! শূন্য ডিগ্রি শীতে এই প্লাস্টিক নষ্ট হতে ৪৫০ বছর লাগবে, যা পশমিনা ছাগলের চারণভূমিকে বিষাক্ত করে তুলবে।"
          },
          lesson: {
            en: "Ladakh generates 30,000+ plastic bottles daily in peak season. Refill stations are essential to preserve the mountain biome.",
            hi: "लद्दाख में सीजन के दौरान प्रतिदिन 30,000+ प्लास्टिक बोतलें फेंक दी जाती हैं। रिफिल स्टेशन ही एकमात्र स्थायी समाधान हैं।",
            bn: "পর্যটন মৌসুমে লাদাখে প্রতিদিন ৩০,০০০ এর বেশি প্লাস্টিকের বোতল ফেলা হয়। পাহাড় রক্ষায় নিজস্ব রিফিল বোতল ব্যবহার অপরিহার্য।"
          }
        },
        {
          id: "soda",
          type: "neutral",
          icon: "🥤",
          text: {
            en: "Drink sugary packaged sodas from a tourist convenience store.",
            hi: "टूरिस्ट दुकान से पैक्ड मीठा सोडा पिएं।",
            bn: "দোকান থেকে প্যাকেটজাত কোল্ড ড্রিঙ্কস কিনে খান।"
          },
          deltas: { oxygen: -10, eco: -10, community: +200 },
          feedback: {
            en: "High altitude dehydrates you faster; excessive sugar worsens altitude headaches and generates unrecyclable aluminum cans.",
            hi: "अधिक ऊंचाई पर शरीर जल्दी सूखता है; चीनी सिरदर्द को बढ़ाती है और गैर-पुनर्चक्रण योग्य कचरा पैदा करती है।",
            bn: "উচ্চতায় শরীরে জলের অভাব দ্রুত ঘটে; অতিরিক্ত চিনিযুক্ত পানীয় মাথা যন্ত্রণা বাড়ায় এবং পাহাড়ি আবর্জনা সৃষ্টি করে।"
          },
          lesson: {
            en: "Electrolytes and pure boiled glacial water are 3x more effective than sodas at high altitudes.",
            hi: "अधिक ऊंचाई पर सोडे की तुलना में उबला हुआ शुद्ध पानी और इलेक्ट्रोलाइट्स 3 गुना अधिक प्रभावी होते हैं।",
            bn: "উচ্চ হিমালয়ে কোল্ড ড্রিঙ্কসের চেয়ে হালকা গরম ফুটানো জল ও ওআরএস ৩ গুণ বেশি কার্যকর।"
          }
        },
        {
          id: "dzomsa",
          type: "best",
          icon: "💧",
          text: {
            en: "Refill insulated copper flasks at the Dzomsa solar station & lunch on organic farm Skyu stew.",
            hi: "जोम्सा सोलर स्टेशन पर अपनी फ्लास्क भरें और जैविक खेत का पारंपरिक स्क्यू स्टू खाएं।",
            bn: "জোমসা সৌর কেন্দ্রে ফ্লাস্কে জল ভরে নিন এবং জৈব খামারের খাঁটি পাহাড়ি স্কিউ স্টু দিয়ে লাঞ্চ করুন।"
          },
          deltas: { oxygen: +20, eco: +30, community: +1600 },
          feedback: {
            en: "Eco-Mastery! You saved 6 plastic bottles from mountain landfills and supported a 100% women-run agricultural cooperative in Sham Valley.",
            hi: "पर्यावरण में शानदार योगदान! आपने 6 प्लास्टिक बोतलों को लैंडफिल में जाने से बचाया और महिला स्वयं सहायता समूह को सीधा सहारा दिया।",
            bn: "অপূর্ব সিদ্ধান্ত! আপনি ৬টি প্লাস্টিক বোতল পাহাড়ে ফেলা থেকে বাঁচালেন এবং ১০০% নারী পরিচালিত কৃষি সমবায়কে সাহায্য করলেন।"
          },
          lesson: {
            en: "Zero single-use plastic is Ladakh's official environmental charter. Dzomsa refill hubs keep Himalayan meltwater pristine.",
            hi: "एकल-उपयोग प्लास्टिक से मुक्ति लद्दाख का आधिकारिक संकल्प है। जोम्सा हब ग्लेशियर के पानी को शुद्ध रखते हैं।",
            bn: "একক ব্যবহার্য প্লাস্টিক মুক্ত রাখা লাদাখের প্রধান পরিবেশ নীতি। রিফিল স্টেশন পাহাড়ি ঝরনার জলকে খাঁটি রাখে।"
          }
        }
      ]
    },
    {
      id: "stage3",
      location: "Khardung La Pass",
      altitude: "17,582 ft (5,359 m)",
      region: "Ladakh Range, Gateway to Nubra & Siachen",
      img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85",
      title: {
        en: "Stage 3: The 17,582 ft Snow-Chain & High Pass Rule",
        hi: "चरण 3: 17,582 फीट का बर्फीला दर्रा और सुरक्षा नियम",
        bn: "পর্যায় ৩: ১৭,৫৮২ ফুটের বরফাবৃত গিরিপথ ও কঠোর সুরক্ষা নিয়ম"
      },
      desc: {
        en: "Ascending Khardung La, thick snowflakes fall and the road turns into treacherous black ice. An army convoy flags vehicles. The thin air contains only 50% sea-level oxygen. How do you cross the col?",
        hi: "खारदुंग ला चढ़ते समय तेज बर्फबारी शुरू हो जाती है और सड़क पर काली बर्फ (ब्लैक आइस) जम जाती है। सेना का काफिला वाहनों को सतर्क करता है। हवा में केवल 50% ऑक्सीजन है। आप कैसे आगे बढ़ेंगे?",
        bn: "খারদুং লা ওঠার সময় তীব্র তুষারপাত শুরু হলো এবং রাস্তায় পিচ্ছিল বরফ জমে গেল। ভারতীয় সেনার কনভয় সতর্ক করছে। বাতাসে অক্সিজেনের পরিমাণ নেমে এসেছে মাত্র ৫০%-এ। কীভাবে গিরিপথ অতিক্রম করবেন?"
      },
      choices: [
        {
          id: "speed_pass",
          type: "danger",
          icon: "🏎️",
          text: {
            en: "Ignore tire chains, speed up to overtake trucks, and spend 1 hour posing on the summit ridge.",
            hi: "स्नो-चेन को नजरअंदाज करें, तेजी से ओवरटेक करें और शिखर पर 1 घंटा सेल्फी लें।",
            bn: "চেইনের তোয়াক্কা না করে দ্রুত গাড়ি চালিয়ে অন্যান্য গাড়িকে ওভারটেক করুন এবং চূড়ায় ১ ঘণ্টা ধরে সেলফি তুলুন।"
          },
          deltas: { oxygen: -30, eco: -15, community: 0 },
          feedback: {
            en: "Critical danger! Your vehicle spins out on black ice, blocking an army medical ambulance. Lingering 1h at 17,582 ft causes High-Altitude Pulmonary Edema (HAPE) symptoms.",
            hi: "अत्यंत खतरनाक! वाहन ब्लैक आइस पर फिसल गया और सेना की एम्बुलेंस का रास्ता रुक गया। 1 घंटा रुकने से फेफड़ों में पानी (HAPE) भरने का खतरा पैदा हो गया।",
            bn: "ভয়াবহ বিপদ! পিচ্ছিল বরফে গাড়ি পিছলে গিয়ে সেনার অ্যাম্বুলেন্স আটকে দিল। ১৭,৫৮২ ফুটে ১ ঘণ্টা থাকায় তীব্র শ্বাসকষ্ট (HAPE) শুরু হলো।"
          },
          lesson: {
            en: "Pass protocol: Limit stoppage at high passes to under 15 minutes. Tire chains and low gear are mandatory on Himalayan ice.",
            hi: "दर्रा नियम: ऊंचे दर्रों पर रुकने का समय 15 मिनट से कम रखें। बर्फ पर स्नो-चेन और लो-गियर अनिवार्य हैं।",
            bn: "গিরিপথ নিয়ম: উচ্চ গিরিপথে ১৫ মিনিটের বেশি দাঁড়ানো নিষিদ্ধ। বরফে গাড়ির চাকায় চেইন পরা বাধ্যতামূলক।"
          }
        },
        {
          id: "plastic_flags",
          type: "neutral",
          icon: "🚩",
          text: {
            en: "Tie cheap nylon synthetic prayer flags bought from a souvenir shop and wait 40 mins.",
            hi: "सॉवेनियर दुकान से नायलॉन के सिंथेटिक झंडे खरीदकर बांधें और 40 मिनट रुकें।",
            bn: "দোকান থেকে নাইলনের কৃত্রিম প্রার্থনা পতাকা কিনে পাহাড়ে বাঁধুন এবং ৪০ মিনিট অপেক্ষা করুন।"
          },
          deltas: { oxygen: -10, eco: -15, community: +300 },
          feedback: {
            en: "Synthetic flags do not decompose; they shred into microplastics that choke high-altitude streams and birds.",
            hi: "सिंथेटिक झंडे सड़ते नहीं हैं; वे माइक्रोप्लास्टिक बनकर अल्पाइन धाराओं और पक्षियों को नुकसान पहुंचाते हैं।",
            bn: "নাইলনের পতাকা নষ্ট হয় না; এগুলো ভেঙে মাইক্রোপ্লাস্টিক তৈরি করে যা পাহাড়ি জলধারা ও পাখিদের ক্ষতি করে।"
          },
          lesson: {
            en: "Authentic prayer flags must be made from 100% natural cotton and plant-based dyes.",
            hi: "पारंपरिक लद्दाखी प्रार्थना ध्वज 100% प्राकृतिक सूती कपड़े और वनस्पति रंगों से बने होने चाहिए।",
            bn: "প্রকৃত বৌদ্ধ প্রার্থনা পতাকা ১০০% সুতি কাপড় এবং প্রাকৃতিক রঙ দিয়ে তৈরি হতে হয়।"
          }
        },
        {
          id: "safe_pass",
          type: "best",
          icon: "🏔️",
          text: {
            en: "Equip 4x4 snow chains, keep summit stay to 12 minutes, and tie biodegradable cotton prayer flags.",
            hi: "4x4 स्नो-चेन लगाएं, शिखर पर केवल 12 मिनट रुकें और जैविक सूती प्रार्थना ध्वज बांधें।",
            bn: "গাড়ির চাকায় বরফের চেইন লাগান, চূড়ায় মাত্র ১২ মিনিট অবস্থান করুন এবং পরিবেশবান্ধব সুতির পতাকা বাঁধুন।"
          },
          deltas: { oxygen: +15, eco: +25, community: +1200 },
          feedback: {
            en: "Masterful transit! You cleared the pass safely without symptoms, honored Ladakhi Buddhist sacred traditions, and kept the BRO highway clear.",
            hi: "शानदार यात्रा! आप बिना किसी लक्षण के सुरक्षित रूप से दर्रा पार कर गए और लद्दाखी बौद्ध परंपरा का पूरा सम्मान किया।",
            bn: "অনবদ্য দায়িত্বশীল যাত্রা! কোনো শারীরিক সমস্যা ছাড়াই নিরাপদে গিরিপথ পার হলেন এবং প্রাচীন বৌদ্ধ ঐতিহ্যকে মর্যাদা দিলেন।"
          },
          lesson: {
            en: "BRO Highway Safety Rule: Respecting the 15-minute summit limit prevents cerebral and pulmonary edema while ensuring fluid transit.",
            hi: "सीमा सड़क संगठन (BRO) नियम: 15 मिनट की सीमा का पालन करने से HAPE और HACE जैसी जानलेवा बीमारियों से बचाव होता है।",
            bn: "বর্ডার রোডস অর্গানাইজেশন (BRO) নিয়ম: ১৫ মিনিটের সময়সীমা মেনে চললে প্রাণঘাতী ফুসফুসের সমস্যা এড়ানো যায়।"
          }
        }
      ]
    },
    {
      id: "stage4",
      location: "Nubra & Turtuk Border Hamlet",
      altitude: "9,800 ft (2,987 m)",
      region: "Shyok River, Baltistan Border",
      img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
      title: {
        en: "Stage 4: Overcrowded Hotspot vs Offbeat Village Decongestion",
        hi: "चरण 4: भीड़भाड़ वाला हॉटस्पॉट बनाम ऑफबीट गांव विस्तार",
        bn: "পর্যায় ৪: অতিরিক্ত ভিড় বনাম শান্ত অফবিট সীমান্ত গ্রাম অন্বেষণ"
      },
      desc: {
        en: "In Nubra Valley, 250 diesel SUVs are idling in a massive traffic jam at Hunder Sand Dunes for quad-bike rides. 40 km further west lies Turtuk, a peaceful Balti village with heirloom apricot orchards. Where does your expedition stay?",
        hi: "नुब्रा घाटी के हुंडर रेत के टीलों पर क्वाड-बाइक के लिए 250 डीजल एसयूवी का लंबा जाम लगा है। 40 किमी आगे शांत तुरतुक गांव है जहां बाल्टी संस्कृति और खुबानी के बाग हैं। आप कहां रुकेंगे?",
        bn: "নুব্রা উপত্যকার হুন্ডার বালিয়াড়িতে কোয়াড-বাইকিংয়ের জন্য ২৫০টি ডিজেল গাড়ির ভয়াবহ যানজট। সেখান থেকে ৪০ কিমি দূরে শান্ত বাল্টি সীমান্ত গ্রাম তুরতুক। আপনার দল কোথায় সময় কাটাবে?"
      },
      choices: [
        {
          id: "quad_jam",
          type: "danger",
          icon: "🚜",
          text: {
            en: "Join the 3-hour diesel traffic jam at Hunder to ride quad-bikes over fragile desert dunes.",
            hi: "हुंडर के रेत के टीलों पर क्वाड-बाइक चलाने के लिए 3 घंटे के लंबे ट्रैफिक जाम में खड़े रहें।",
            bn: "কোয়াড-বাইক চালাতে ৩ ঘণ্টার ডিজেল ধোঁয়ার যানজটে দাঁড়িয়ে হুন্ডার বালিয়াড়িতে যান।"
          },
          deltas: { oxygen: -10, eco: -25, community: +300 },
          feedback: {
            en: "Congestion penalty! Heavy off-road vehicles crush ancient sand dunes, disturb double-humped Bactrian camel grazing habitats, and exhaust toxic emissions.",
            hi: "अत्यधिक भीड़ का दुष्प्रभाव! वाहनों के शोर और धुएं ने नाजुक रेत के टीलों को नष्ट कर दिया और दुर्लभ बैक्ट्रियन ऊंटों के आवास को नुकसान पहुंचाया।",
            bn: "যানজট ও পরিবেশ ক্ষতি! ভারী গাড়ির চাকায় প্রাচীন বালিয়াড়ি ধ্বংস হলো এবং বিরল ব্যাক্ট্রিয়ান উটের প্রাকৃতিক চারণভূমি ক্ষতিগ্রস্ত হলো।"
          },
          lesson: {
            en: "Decongestion principle: Concentrating all tourists in one 2-km corridor destroys micro-ecosystems while creating economic scarcity in neighboring hamlets.",
            hi: "भीड़-नियंत्रण सिद्धांत: केवल एक जगह भीड़ बढ़ाने से पर्यावरण नष्ट होता है और पास के गांवों को पर्यटन का कोई लाभ नहीं मिलता।",
            bn: "ভিড় নিয়ন্ত্রণের মূলনীতি: একটি মাত্র জায়গায় সব পর্যটক ভিড় করলে প্রকৃতি ধ্বংস হয় এবং পাশের গ্রামগুলো পর্যটন থেকে বঞ্চিত হয়।"
          }
        },
        {
          id: "drive_through",
          type: "neutral",
          icon: "📸",
          text: {
            en: "Drive into Turtuk for 15 minutes, snap quick photos of villagers, and drive straight back without buying anything.",
            hi: "तुरतुक में 15 मिनट रुकें, ग्रामीणों की तस्वीरें लें और बिना कुछ खरीदे तुरंत लौट आएं।",
            bn: "তুরতুকে ১৫ মিনিটের জন্য গিয়ে গ্রামবাসীদের ছবি তুলে কোনো কিছু না কিনে ফিরে আসুন।"
          },
          deltas: { oxygen: 0, eco: 0, community: 0 },
          feedback: {
            en: "Voyeuristic tourism without community benefit: invasive photography without consent harms local dignity and provides zero income for village preservation.",
            hi: "बिना सहमति के तस्वीरें खींचना स्थानीय संस्कृति का अनादर है और इससे गांव के विकास में कोई आर्थिक सहयोग नहीं मिलता।",
            bn: "অনুমতি ছাড়া ছবি তোলা স্থানীয় আত্মমর্যাদাকে আঘাত করে এবং গ্রামের কোনো কল্যাণেই আসে না।"
          },
          lesson: {
            en: "Ethical tourism prioritizes meaningful human exchange and consent over transactional selfie-taking.",
            hi: "नैतिक पर्यटन केवल सेल्फी लेने के बजाय स्थानीय लोगों के साथ सम्मानजनक संवाद को प्राथमिकता देता है।",
            bn: "নৈতিক পর্যটন হলো সেলফি তোলার চেয়ে স্থানীয় সংস্কৃতির সাথে শ্রদ্ধাপূর্ণ মেলামেশা।"
          }
        },
        {
          id: "turtuk_homestay",
          type: "best",
          icon: "🏡",
          text: {
            en: "Stay 2 nights in a family-run Balti homestay in Turtuk, learn stone masonry, and buy organic dried apricots directly from the women's collective.",
            hi: "तुरतुक में बाल्टी परिवार के होमस्टे में 2 रातें बिताएं, पत्थर की वास्तुकला समझें और महिला समूह से सूखे खुबानी खरीदें।",
            bn: "তুরতুকে একটি পরিবারের হোমস্টেতে ২ দিন থাকুন, পাথরের প্রাচীন স্থাপত্য দেখুন এবং নারীদের সমবায় থেকে শুকনো এপ্রিকট কিনুন।"
          },
          deltas: { oxygen: +20, eco: +25, community: +3200 },
          feedback: {
            en: "Triumph of Dispersion! You directly supported 14 remote family members near the border, preserved 500-year-old Balti woodcraft heritage, and relieved pressure on Hunder.",
            hi: "सफल विकेंद्रीकरण! आपने सीमावर्ती गांव के 14 परिवारजनों को सीधा रोजगार दिया और 500 साल पुरानी बाल्टी संस्कृति के संरक्षण में योगदान दिया।",
            bn: "অতুলনীয় সাফল্য! আপনি সীমান্তের প্রত্যন্ত ১৪ জন গ্রামীণ মানুষকে সরাসরি আর্থিক সাহায্য করলেন এবং ৫০০ বছরের প্রাচীন বাল্টি শিল্পকে রক্ষা করলেন।"
          },
          lesson: {
            en: "Secondary corridor dispersion redistributes 85%+ of tourism spend directly to grassroots families while eliminating carbon congestion at saturated hotspots.",
            hi: "ऑफबीट गलियारों में यात्रा करने से 85%+ पर्यटन खर्च सीधे स्थानीय परिवारों तक पहुंचता है और प्रदूषण कम होता है।",
            bn: "অফবিট রুটে ভ্রমণ করলে পর্যটন ব্যয়ের ৮৫%+ সরাসরি প্রত্যন্ত পরিবারের হাতে পৌঁছায় এবং মূল পর্যটন কেন্দ্রের ওপর চাপ কমে।"
          }
        }
      ]
    },
    {
      id: "stage5",
      location: "Hanle Dark Sky Reserve",
      altitude: "14,900 ft (4,540 m)",
      region: "Changthang Plateau, World-Class Astro-Tourism Site",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
      title: {
        en: "Stage 5: The Cosmic Stargazing & Light Pollution Test",
        hi: "चरण 5: खगोलीय डार्क स्काई और प्रकाश-प्रदूषण परीक्षा",
        bn: "পর্যায় ৫: মহাজাগতিক ডার্ক স্কাই স্যাঙ্কচুয়ারি ও আলো-দূষণ পরীক্ষা"
      },
      desc: {
        en: "Midnight in Hanle, India's first certified International Dark Sky Reserve at 14,900 ft. The Milky Way blazes in absolute clarity above the Indian Astronomical Observatory. How does your expedition conduct night sky observations?",
        hi: "14,900 फीट पर भारत के पहले प्रमाणित डार्क स्काई रिजर्व हानले में आधी रात का समय है। खगोलीय वेधशाला के ऊपर मिल्की वे अद्भुत चमक के साथ दिखाई दे रही है। आपका दल रात में अवलोकन कैसे करेगा?",
        bn: "১৪,৯০০ ফুট উচ্চতায় ভারতের প্রথম আন্তর্জাতিক ডার্ক স্কাই রিজার্ভ হানলেতে মাঝরাত। ইন্ডিয়ান অ্যাস্ট্রোনমিক্যাল অবজারভেটরির ওপর খালি চোখেই জ্বলজ্বল করছে ছায়াপথ। কীভাবে তারা পর্যবেক্ষণ করবেন?"
      },
      choices: [
        {
          id: "floodlights",
          type: "danger",
          icon: "💡",
          text: {
            en: "Keep car high-beams on, use powerful white LED floodlights for night portraits, and play loud music.",
            hi: "कार की हाई-बीम हेडलाइट्स जलाए रखें, सफेद एलईडी फ्लडलाइट से फोटो खींचें और तेज संगीत बजाएं।",
            bn: "গাড়ির হেডলাইট ও সাদা এলইডি ফ্লাশলাইট জ্বালিয়ে উচ্চশব্দে গান বাজিয়ে সেলফি তুলুন।"
          },
          deltas: { oxygen: -10, eco: -30, community: 0 },
          feedback: {
            en: "Disaster for science! White light pollution blinds the 2-meter Himalayan Chandra Telescope, ruins night data for astrophysicists, and disturbs nocturnal Tibetan gazelles.",
            hi: "विज्ञान के लिए भारी क्षति! सफेद रोशनी ने हिमालयन चंद्र टेलीस्कोप के डेटा को खराब कर दिया और दुर्लभ वन्यजीवों को डरा दिया।",
            bn: "বিজ্ঞানের চরম ক্ষতি! সাদা আলোর দূষণে ২-মিটার হিমালয়ান চন্দ্র টেলিস্কোপের মহাকাশ গবেষণা বিঘ্নিত হলো এবং বিরল বন্যপ্রাণী ভয় পেল।"
          },
          lesson: {
            en: "Dark sky protocols strictly prohibit unshielded white artificial lighting. Only red light preserves human rhodopsin and optical observatory sensors.",
            hi: "डार्क स्काई प्रोटोकॉल सफेद रोशनी पर पूर्ण प्रतिबंध लगाता है। केवल लाल बत्ती ही आंखों की संवेदनशीलता और टेलीस्कोप को सुरक्षित रखती है।",
            bn: "ডার্ক স্কাই রিজার্ভে সাদা আলো জ্বালানো কঠোরভাবে নিষিদ্ধ। কেবল লাল আলোই চোখের দৃষ্টি ও দূরবীক্ষণ যন্ত্রের জন্য উপযোগী।"
          }
        },
        {
          id: "smartphone_flash",
          type: "neutral",
          icon: "📱",
          text: {
            en: "Use smartphone screen brightness at 100% and flash lights directly at fellow observers.",
            hi: "स्मार्टफोन की ब्राइटनेस 100% रखें और अन्य लोगों के चेहरों पर मोबाइल फ्लैशलाइट चमकाएं।",
            bn: "স্মার্টফোনের স্ক্রিনের ১০০% ব্রাইটনেস ও ফ্ল্যাশলাইট জ্বালিয়ে অন্যদের চোখের দিকে ফেলুন।"
          },
          deltas: { oxygen: 0, eco: -10, community: +200 },
          feedback: {
            en: "Mild disruption: Smartphone flashes reset the 30-minute dark adaptation required by human eyes to see faint galactic nebulae.",
            hi: "सामान्य बाधा: मोबाइल फ्लैश के कारण लोगों की आंखों का 30 मिनट का प्राकृतिक डार्क-अडॉप्टेशन रीसेट हो गया।",
            bn: "চোখের প্রাকৃতিক অভিযোজন নষ্ট হলো: মানুষের চোখের অন্ধকারের সাথে মানিয়ে নিতে ৩০ মিনিট সময় লাগে, যা মোবাইল ফ্ল্যাশে নষ্ট হলো।"
          },
          lesson: {
            en: "Hanle's pristine skies allow observing the Andromeda galaxy with naked eyes only if full dark adaptation is preserved.",
            hi: "हानले के स्वच्छ आकाश में एंड्रोमेडा आकाशगंगा को नग्न आंखों से केवल तभी देखा जा सकता है जब अंधेरे का अनुशासन बना रहे।",
            bn: "হানলের স্বচ্ছ আকাশে খালি চোখেই অ্যান্ড্রোমিডা ছায়াপথ দেখা যায় যদি আলোর শৃঙ্খলা পুরোপুরি বজায় রাখা হয়।"
          }
        },
        {
          id: "astro_guide",
          type: "best",
          icon: "🔭",
          text: {
            en: "Use low-lumen red headlamps, stay in a village Astro-Stay, and hire a trained local Hanle woman Astro-Guide with a Dobsonian telescope.",
            hi: "धीमी लाल बत्ती का उपयोग करें, ग्रामीण एस्ट्रो-स्टे में ठहरें और स्थानीय प्रशिक्षित महिला एस्ट्रो-गाइड से टेलीस्कोप द्वारा दर्शन करें।",
            bn: "লাল হেডল্যাম্প ব্যবহার করুন, গ্রামের অ্যাস্ট্রো-স্টেতে থাকুন এবং স্থানীয় প্রশিক্ষিত নারী অ্যাস্ট্রো-গাইডকে সাথে নিয়ে টেলিস্কোপে আকাশ দেখুন।"
          },
          deltas: { oxygen: +15, eco: +30, community: +2800 },
          feedback: {
            en: "Cosmic Perfection! You witnessed Saturn's rings and globular clusters with zero light pollution while directly funding women-led astro-tourism livelihoods in Changthang!",
            hi: "अद्भुत खगोलीय अनुभव! आपने शून्य प्रकाश प्रदूषण के साथ शनि के छल्ले देखे और चांगथांग की महिलाओं के एस्ट्रो-टूरिज्म को सीधा संबल दिया।",
            bn: "মহাজাগতিক শ্রেষ্ঠত্ব! শূন্য আলো-দূষণে শনির বলয় ও দূরবর্তী নীহারিকা দর্শন করলেন এবং চাংথাং মালভূমির নারীদের স্বনির্ভরতা বাড়ালেন।"
          },
          lesson: {
            en: "Hanle's Astro-Stay initiative is a globally celebrated model uniting elite scientific research with grassroots tribal economic empowerment.",
            hi: "हानले का एस्ट्रो-स्टे मॉडल वैज्ञानिक अनुसंधान और आदिवासी महिलाओं के आर्थिक सशक्तिकरण का विश्व-स्तरीय उदाहरण है।",
            bn: "হানলের অ্যাস্ট্রো-স্টে উদ্যোগ হলো বৈজ্ঞানিক গবেষণা ও উপজাতীয় নারীদের আত্মমর্যাদার এক ঐতিহাসিক মেলবন্ধন।"
          }
        }
      ]
    }
  ];

  // Helper to shuffle choices randomly
  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Game State
  let gameState = {
    active: false,
    stageIndex: 0,
    oxygen: 80,
    eco: 75,
    community: 500,
    history: []
  };

  let currentStageChoices = [];

  function loadStage(idx) {
    gameState.stageIndex = idx;
    if (STAGES[idx]) {
      currentStageChoices = shuffleArray(STAGES[idx].choices);
    } else {
      currentStageChoices = [];
    }
  }

  function getLang() {
    return (window.i18n && typeof window.i18n.getLanguage === 'function') ? window.i18n.getLanguage() : 'en';
  }

  function initGame() {
    gameState = {
      active: true,
      stageIndex: 0,
      oxygen: 80,
      eco: 75,
      community: 500,
      history: []
    };
    loadStage(0);
    renderGameView();
  }

  function restartGame() {
    sfx.playTone(440, 'sine', 0.1);
    initGame();
  }

  function renderGameView() {
    const container = document.getElementById('ecoExpeditionGame');
    if (!container) return;

    const lang = getLang();

    if (gameState.stageIndex >= STAGES.length) {
      renderVictoryScreen(container, lang);
      return;
    }

    const stage = STAGES[gameState.stageIndex];
    const stageNum = gameState.stageIndex + 1;
    const totalStages = STAGES.length;

    // Ensure choices are randomized for current stage
    if (!currentStageChoices || currentStageChoices.length === 0) {
      currentStageChoices = shuffleArray(stage.choices);
    }

    // Localized labels
    const tHudOxygen = lang === 'hi' ? '🫁 ऑक्सीजन व AMS सुरक्षा' : lang === 'bn' ? '🫁 অক্সিজেন ও উচ্চতা নিরাপত্তা' : '🫁 Oxygen & AMS Safety';
    const tHudEco = lang === 'hi' ? '🌿 पर्यावरण-संरक्षण स्कोर' : lang === 'bn' ? '🌿 পরিবেশ রক্ষা স্কোর' : '🌿 Eco-Stewardship';
    const tHudImpact = lang === 'hi' ? '🤝 स्थानीय ग्रामीण आय' : lang === 'bn' ? '🤝 গ্রামীণ সমবায় আয়' : '🤝 Community Revenue Impact';
    const tStageBadge = lang === 'hi' ? `पड़ाव ${stageNum}/${totalStages}` : lang === 'bn' ? `পর্যায় ${stageNum}/${totalStages}` : `Checkpoint ${stageNum} of ${totalStages}`;
    const letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = `
      <div class="game-hud">
        <div class="hud-stat">
          <div class="hud-stat-header">
            <span>${tHudOxygen}</span>
            <strong id="hudO2Val">${gameState.oxygen}%</strong>
          </div>
          <div class="hud-bar-track">
            <div class="hud-bar-fill ${gameState.oxygen < 50 ? 'danger' : gameState.oxygen < 75 ? 'warn' : 'good'}" style="width: ${Math.min(100, Math.max(5, gameState.oxygen))}%;"></div>
          </div>
        </div>

        <div class="hud-stat">
          <div class="hud-stat-header">
            <span>${tHudEco}</span>
            <strong id="hudEcoVal">${gameState.eco}%</strong>
          </div>
          <div class="hud-bar-track">
            <div class="hud-bar-fill ${gameState.eco < 50 ? 'danger' : gameState.eco < 75 ? 'warn' : 'good'}" style="width: ${Math.min(100, Math.max(5, gameState.eco))}%;"></div>
          </div>
        </div>

        <div class="hud-stat">
          <div class="hud-stat-header">
            <span>${tHudImpact}</span>
            <strong id="hudCommVal" class="gold">₹${gameState.community.toLocaleString('en-IN')}</strong>
          </div>
          <div class="hud-bar-track">
            <div class="hud-bar-fill gold" style="width: ${Math.min(100, Math.max(10, (gameState.community / 7500) * 100))}%;"></div>
          </div>
        </div>
      </div>

      <div class="game-stage-grid">
        <div class="game-stage-left">
          <div class="game-stage-banner-compact" style="background-image: linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.92) 100%), url('${stage.img}');">
            <div class="game-stage-meta">
              <span class="game-pill checkpoint">${tStageBadge}</span>
              <span class="game-pill altitude">🏔️ ${stage.altitude}</span>
              <span class="game-pill region">📍 ${stage.location}</span>
            </div>
            <h3 class="game-stage-title-compact">${stage.title[lang] || stage.title.en}</h3>
          </div>
          <p class="game-scenario-text-compact">${stage.desc[lang] || stage.desc.en}</p>
        </div>

        <div class="game-stage-right">
          <div class="game-choices-header">
            <span>${lang === 'hi' ? '👇 अपने अभियान का निर्णय चुनें:' : lang === 'bn' ? '👇 আপনার দলের পদক্ষেপ বেছে নিন:' : '👇 Choose your expedition\'s next move:'}</span>
          </div>

          <div class="game-choices-grid">
            ${currentStageChoices.map((c, idx) => `
              <button class="game-choice-btn" onclick="window.makeGameChoice(${idx})">
                <span class="choice-badge">${letters[idx]}</span>
                <span class="choice-text">${c.text[lang] || c.text.en}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  window.makeGameChoice = function (choiceIndex) {
    const stage = STAGES[gameState.stageIndex];
    if (!stage) return;
    const choice = currentStageChoices[choiceIndex];
    if (!choice) return;

    // Apply sound
    if (choice.type === 'best') sfx.good();
    else if (choice.type === 'danger') sfx.caution();
    else sfx.playTone(400, 'sine', 0.12);

    // Apply deltas
    gameState.oxygen = Math.min(100, Math.max(10, gameState.oxygen + choice.deltas.oxygen));
    gameState.eco = Math.min(100, Math.max(10, gameState.eco + choice.deltas.eco));
    gameState.community = Math.max(0, gameState.community + choice.deltas.community);
    gameState.history.push({ stageId: stage.id, choiceId: choice.id, type: choice.type });

    // Show interactive consequence modal
    showConsequenceModal(stage, choice);
  };

  function showConsequenceModal(stage, choice) {
    const modal = document.getElementById('gameConsequenceModal');
    if (!modal) {
      loadStage(gameState.stageIndex + 1);
      renderGameView();
      return;
    }

    const lang = getLang();
    const titleEl = modal.querySelector('.consequence-title');
    const iconEl = modal.querySelector('.consequence-icon');
    const feedbackEl = modal.querySelector('.consequence-feedback');
    const lessonEl = modal.querySelector('.consequence-lesson');
    const statDeltasEl = modal.querySelector('.consequence-deltas');
    const nextBtn = modal.querySelector('#consequenceNextBtn');

    const isGood = choice.type === 'best';
    const isBad = choice.type === 'danger';

    if (iconEl) iconEl.textContent = isGood ? '🌟' : isBad ? '⚠️' : '⚖️';
    if (titleEl) {
      titleEl.textContent = isGood
        ? (lang === 'hi' ? 'उत्कृष्ट पर्यावरण व सुरक्षा निर्णय!' : lang === 'bn' ? 'চমৎকার পরিবেশবান্ধব পদক্ষেপ!' : 'Outstanding Responsible Choice!')
        : isBad
        ? (lang === 'hi' ? 'अति-पर्यटन व स्वास्थ्य जोखिम चेतावनी!' : lang === 'bn' ? 'स्वास्थ्य ও পরিবেশ ঝুঁকি সতর্কতা!' : 'High-Risk Overtourism Consequence!')
        : (lang === 'hi' ? 'सावधानीपूर्वक लिया गया कदम' : lang === 'bn' ? 'সতর্কতামূলক পদক্ষেপ' : 'Cautious Average Decision');
      titleEl.className = `consequence-title ${choice.type}`;
    }

    if (feedbackEl) feedbackEl.textContent = choice.feedback[lang] || choice.feedback.en;
    if (lessonEl) {
      const takeawayLabel = lang === 'hi' ? '💡 स्थायी पर्यटन सीख: ' : lang === 'bn' ? '💡 টেকসই পর্যটন शिक्षा: ' : '💡 Responsible Travel Insight: ';
      lessonEl.innerHTML = `<strong>${takeawayLabel}</strong>${choice.lesson[lang] || choice.lesson.en}`;
    }

    if (statDeltasEl) {
      const o2Sign = choice.deltas.oxygen >= 0 ? `+${choice.deltas.oxygen}` : `${choice.deltas.oxygen}`;
      const ecoSign = choice.deltas.eco >= 0 ? `+${choice.deltas.eco}` : `${choice.deltas.eco}`;
      const commSign = choice.deltas.community >= 0 ? `+₹${choice.deltas.community}` : `₹${choice.deltas.community}`;

      statDeltasEl.innerHTML = `
        <span class="stat-pill ${choice.deltas.oxygen >= 0 ? 'pos' : 'neg'}">🫁 ${o2Sign}% O₂</span>
        <span class="stat-pill ${choice.deltas.eco >= 0 ? 'pos' : 'neg'}">🌿 ${ecoSign}% Eco</span>
        <span class="stat-pill ${choice.deltas.community > 0 ? 'pos' : 'neutral'}">🤝 ${commSign}</span>
      `;
    }

    if (nextBtn) {
      const isFinal = gameState.stageIndex + 1 >= STAGES.length;
      nextBtn.textContent = isFinal
        ? (lang === 'hi' ? 'अभियान का अंतिम प्रमाणपत्र देखें →' : lang === 'bn' ? 'চূড়ান্ত সার্টিফিকেট দেখুন →' : 'View Final Expedition Certificate →')
        : (lang === 'hi' ? 'अगले पड़ाव की ओर बढ़ें →' : lang === 'bn' ? 'পরবর্তী পর্যায়ে যান →' : 'Proceed to Next Checkpoint →');
      nextBtn.onclick = () => {
        modal.classList.remove('open');
        loadStage(gameState.stageIndex + 1);
        renderGameView();
      };
    }

    modal.classList.add('open');
  }

  function renderVictoryScreen(container, lang) {
    sfx.fanfare();

    const overallScore = Math.round((gameState.oxygen * 0.4) + (gameState.eco * 0.4) + Math.min(20, (gameState.community / 7000) * 20));

    let tier = 'bronze';
    let tierTitle = {
      en: 'High-Pass Novice Explorer',
      hi: 'उच्च-हिमालयी शिक्षार्थी यात्री',
      bn: 'উচ্চ হিমালয় শিক্ষানবিস পর্যটক'
    };
    let tierBadge = '🥉';

    if (overallScore >= 85) {
      tier = 'gold';
      tierTitle = {
        en: 'Supreme Himalayan Guardian & Eco-Champion',
        hi: 'सर्वोच्च हिमालयी संरक्षक एवं पर्यावरण रत्न',
        bn: 'সর্বোচ্চ হিমালয় অভিভাবক ও ইকো-চ্যাম্পিয়ন'
      };
      tierBadge = '🏔️ 🥇';
    } else if (overallScore >= 70) {
      tier = 'silver';
      tierTitle = {
        en: 'Certified Alpine Trailblazer',
        hi: 'प्रमाणित अल्पाइन पथप्रदर्शक',
        bn: 'প্রত্যয়িত আলপাইন পথপ্রদর্শক'
      };
      tierBadge = '🥈';
    }

    const certDate = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'bn' ? 'bn-IN' : 'en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const certId = 'BHARAT-ECO-' + Math.floor(100000 + Math.random() * 900000);

    container.innerHTML = `
      <div class="game-victory-card ${tier}">
        <div class="victory-header">
          <span class="victory-stamp">${tierBadge}</span>
          <p class="eyebrow">${lang === 'hi' ? 'अभियान पूर्ण • आधिकारिक पर्यावरण पासपोर्ट' : lang === 'bn' ? 'অভিযান সম্পন্ন • অফিসিয়াল ইকো-পাসপোর্ট' : 'EXPEDITION COMPLETE • OFFICIAL ECO-PASSPORT'}</p>
          <h2>${tierTitle[lang] || tierTitle.en}</h2>
          <div class="victory-score-pill">
            <span>${lang === 'hi' ? 'समग्र स्थिरता स्कोर:' : lang === 'bn' ? 'সার্বিক স্থায়িত্ব স্কোর:' : 'Overall Sustainability Score:'}</span>
            <strong>${overallScore} / 100</strong>
          </div>
        </div>

        <div class="victory-impact-grid">
          <div class="impact-box">
            <span class="impact-val">🫁 ${gameState.oxygen}%</span>
            <span class="impact-lbl">${lang === 'hi' ? 'ऑक्सीजन व अनुकूलन स्वास्थ्य' : lang === 'bn' ? 'অক্সিজেন ও অভিযোজন স্বাস্থ্য' : 'Acclimatization Safety'}</span>
          </div>
          <div class="impact-box">
            <span class="impact-val">🌿 ${gameState.eco}%</span>
            <span class="impact-lbl">${lang === 'hi' ? 'ग्लेशियर संरक्षण व शून्य-प्लास्टिक' : lang === 'bn' ? 'হিমবাহ রক্ষা ও শূন্য-প্লাস্টিক' : 'Zero-Waste Stewardship'}</span>
          </div>
          <div class="impact-box">
            <span class="impact-val">🤝 ₹${gameState.community.toLocaleString('en-IN')}</span>
            <span class="impact-lbl">${lang === 'hi' ? 'दूरदराज के ग्रामीणों को सीधा योगदान' : lang === 'bn' ? 'প্রত্যন্ত গ্রামে সরাসরি অর্থনৈতিক সাহায্য' : 'Direct Village Cooperative Revenue'}</span>
          </div>
        </div>

        <div class="victory-certificate">
          <div class="cert-row">
            <span>${lang === 'hi' ? 'प्रमाणपत्र आईडी:' : lang === 'bn' ? 'সার্টিফিকেট आईडी:' : 'Certificate ID:'} <code>${certId}</code></span>
            <span>${lang === 'hi' ? 'सत्यापन तिथि:' : lang === 'bn' ? 'যাচাইকরণের तारीख:' : 'Verified Date:'} ${certDate}</span>
          </div>
          <p class="cert-desc">
            ${lang === 'hi'
              ? 'यह प्रमाणित करता है कि आपने लद्दाख और उच्च हिमालयी मार्गों में अनिवार्य 48 घंटे के अनुकूलन, शून्य प्लास्टिक नीति, ऑफबीट गलियारा विस्तार और डार्क स्काई संरक्षण का सफलतापूर्वक पालन किया है।'
              : lang === 'bn'
              ? 'এই ডিজিটাল পাসপোর্ট প্রমাণ করে যে আপনি লাদাখের সংবেদনশীল বাস্তুতন্ত্রে বাধ্যতামূলক ৪৮ ঘণ্টার অভিযোজন, একক প্লাস্টিক বর্জন, বিকল্প অফবিট গ্রাম ভ্রমণ ও ডার্ক স্কাই সুরক্ষা নীতি নিষ্ঠার সাথে মেনে চলেছেন।'
              : 'This digital passport certifies that you have successfully practiced 48h altitude pacing, zero single-use plastic, offbeat corridor dispersion, and sacred Himalayan heritage stewardship across Ladakh.'
            }
          </p>
        </div>

        <div class="victory-actions">
          <button class="btn primary" onclick="window.restartEcoGame()">
            ${lang === 'hi' ? '↺ नया अभियान शुरू करें (वैकल्पिक मार्ग)' : lang === 'bn' ? '↺ নতুন অভিযান शुरू করুন (বিকল্প রুট)' : '↺ Play Again (Explore Alternative Paths)'}
          </button>
          <a href="#planner" class="btn light">
            ${lang === 'hi' ? 'मार्ग अनुसार यात्रा योजना बनाएं →' : lang === 'bn' ? 'এই রুটে ভ্রমণ পরিকল্পনা করুন →' : 'Plan Real Itinerary for This Route →'}
          </a>
        </div>
      </div>
    `;
  }

  window.restartEcoGame = restartGame;

  // React to language switches across the platform
  window.addEventListener('bharat-lang-changed', () => {
    if (document.getElementById('ecoExpeditionGame')) {
      renderGameView();
    }
  });

  // Auto-init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('ecoExpeditionGame')) {
      initGame();
    }
  });

})();
