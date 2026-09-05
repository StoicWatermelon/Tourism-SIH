/**
 * Bharat Explore - Offline Field Pass PDF Generator
 * Built for Smart India Hackathon (SIH 2026)
 * Dual-engine: Attempts backend ReportLab high-res vector generation;
 * falls back to 100% offline client-side jsPDF vector generation if offline.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FieldPassService = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function getActiveTravelerData(overrideData) {
    let user = null;
    try {
      if (typeof window !== 'undefined' && window.AuthService && typeof window.AuthService.getUser === 'function') {
        user = window.AuthService.getUser();
      } else if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('bharat_auth_user');
        if (raw) user = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[FieldPass] Could not read user profile:', e);
    }

    const data = Object.assign({}, user || {}, overrideData || {});
    const fullName = data.full_name || data.fullName || 'Authorized Expedition Traveler';
    const email = data.email || 'offline-traveler@bharatexplore.org';
    const homeCity = data.home_city || data.homeCity || 'India';
    const travelStyle = data.travel_style || data.travelStyle || 'High-Altitude Eco-Explorer';
    const emergencyContact = data.emergency_contact || data.emergencyContact || '+91-9876543210 (Base Station)';
    const medicalNotes = data.medical_notes || data.medicalNotes || 'No known altitude allergies. Standard Diamox protocol.';
    
    let passId = data.pass_id || data.passId;
    if (!passId) {
      const rawSeed = email || fullName || 'guest';
      let hash = 0;
      for (let i = 0; i < rawSeed.length; i++) {
        hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
        hash |= 0;
      }
      passId = `BE-HIM-2026-${Math.abs(hash) % 900000 + 100000}`;
    }

    return {
      fullName,
      email,
      homeCity,
      travelStyle,
      emergencyContact,
      medicalNotes,
      passId
    };
  }

  function showToast(msg) {
    if (typeof window !== 'undefined') {
      if (typeof window.toast === 'function') {
        window.toast(msg);
      } else {
        const toastEl = document.getElementById('toast');
        if (toastEl) {
          toastEl.textContent = msg;
          toastEl.classList.add('visible');
          setTimeout(() => toastEl.classList.remove('visible'), 3500);
        }
      }
    }
  }

  /**
   * Generates the offline vector Field Pass PDF using client-side jsPDF
   */
  function generateClientSidePDF(travelerData, saveFilename) {
    const jsPDFClass = (typeof window !== 'undefined' && window.jspdf && window.jspdf.jsPDF)
      || (typeof window !== 'undefined' && window.jsPDF)
      || (typeof jspdf !== 'undefined' && jspdf.jsPDF)
      || (typeof jsPDF !== 'undefined' && jsPDF);

    if (!jsPDFClass) {
      throw new Error('jsPDF library not available in global scope.');
    }

    const doc = new jsPDFClass({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const primaryEmerald = [15, 81, 68];   // #0f5144
    const deepEmerald = [6, 35, 29];       // #06231d
    const goldAccent = [217, 119, 6];      // #d97706
    const textDark = [15, 23, 42];         // #0f172a
    const textMuted = [71, 85, 105];       // #475569
    const alertRed = [185, 28, 28];        // #b91c1c
    const successGreen = [21, 128, 61];    // #15803d
    const borderSlate = [203, 213, 225];   // #cbd5e1

    // Page Frame & Hairline Borders
    doc.setDrawColor(deepEmerald[0], deepEmerald[1], deepEmerald[2]);
    doc.setLineWidth(1.4);
    doc.rect(26, 20, 543, 705);

    doc.setDrawColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
    doc.setLineWidth(0.6);
    doc.rect(29, 23, 537, 699);

    // 1. Header Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
    doc.setLineWidth(1.2);
    doc.rect(36, 30, 523, 54, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(deepEmerald[0], deepEmerald[1], deepEmerald[2]);
    doc.text('BHARAT EXPLORE • SMART INDIA HACKATHON 2026', 297.5, 43, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.0);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('MINISTRY OF TOURISM • SUSTAINABLE HIMALAYAN EXPEDITION CELL', 297.5, 53, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(deepEmerald[0], deepEmerald[1], deepEmerald[2]);
    doc.text('HIGH-ALTITUDE TRAVEL SAFETY & DANGER PROTOCOLS', 297.5, 68, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('OFFICIAL EMERGENCY GUIDELINES • AMS & HYPOXIA HAZARDS • MOUNTAIN PASS ADVISORIES • 24/7 RESCUE DIRECTORY', 297.5, 78, { align: 'center' });

    // 2. Metadata Ribbon Bar
    const now = new Date();
    const dateStr = now.toUTCString().replace('GMT', 'UTC').slice(5, 22);

    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.setLineWidth(0.8);
    doc.rect(36, 90, 523, 20, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Doc ID:', 44, 103);
    doc.setFont('helvetica', 'normal');
    doc.text('BE-HIM-SAFETY-2026', 76, 103);

    doc.setFont('helvetica', 'bold');
    doc.text('Issued:', 180, 103);
    doc.setFont('helvetica', 'normal');
    doc.text(dateStr, 214, 103);

    doc.setFont('helvetica', 'bold');
    doc.text('Scope:', 330, 103);
    doc.setFont('helvetica', 'normal');
    doc.text('Ladakh, Spiti & High Passes', 362, 103);

    doc.setFont('helvetica', 'bold');
    doc.text('Status:', 472, 103);
    doc.setTextColor(successGreen[0], successGreen[1], successGreen[2]);
    doc.text('MANDATORY GUIDE', 506, 103);

    // 3. Section 1: Critical Altitude Dangers & Hypoxia Emergency Protocols
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
    doc.text('1. CRITICAL ALTITUDE DANGERS & HYPOXIA EMERGENCY PROTOCOLS', 36, 122);

    const medY = 126;
    const medH = 116;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
    doc.setLineWidth(0.8);
    doc.rect(36, medY, 523, medH, 'FD');

    // Medical Table Header Bar
    doc.setFillColor(deepEmerald[0], deepEmerald[1], deepEmerald[2]);
    doc.rect(36, medY, 523, 16, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(255, 255, 255);
    doc.text('Hazard / Condition', 42, medY + 11);
    doc.text('Critical Danger Symptoms', 156, medY + 11);
    doc.text('Immediate Emergency Action Protocol', 336, medY + 11);

    // Medical Table Horizontal & Vertical Lines
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(36, medY + 41, 559, medY + 41);
    doc.line(36, medY + 66, 559, medY + 66);
    doc.line(36, medY + 91, 559, medY + 91);
    doc.line(152, medY + 16, 152, medY + medH);
    doc.line(332, medY + 16, 332, medY + medH);

    // Row 1: AMS
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.0);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Acute Mountain Sickness (AMS)', 42, medY + 26);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(alertRed[0], alertRed[1], alertRed[2]);
    doc.text('Mild to Moderate (> 10,000 ft)', 42, medY + 35);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Throbbing frontal headache, nausea, anorexia, dizziness,', 156, medY + 26);
    doc.text('fatigue, insomnia. Common above 10,000 ft (Leh, Kargil).', 156, medY + 35);

    doc.setFont('helvetica', 'bold');
    doc.text('STOP ASCENT IMMEDIATELY.', 336, medY + 26);
    doc.setFont('helvetica', 'normal');
    doc.text('Rest 24-48h at same elevation. Hydrate 4-5L + ORS.', 445, medY + 26);
    doc.text('If symptoms worsen or persist > 24 hrs, descend 2,000 ft immediately.', 336, medY + 35);

    // Row 2: HAPE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.0);
    doc.setTextColor(alertRed[0], alertRed[1], alertRed[2]);
    doc.text('HAPE (Pulmonary Edema)', 42, medY + 51);
    doc.setFontSize(6.2);
    doc.text('LIFE THREATENING HAZARD', 42, medY + 60);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Severe breathlessness at rest, persistent cough with pink', 156, medY + 51);
    doc.text('frothy sputum, chest rattling, SpO2 < 65%, rapid pulse > 110.', 156, medY + 60);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(alertRed[0], alertRed[1], alertRed[2]);
    doc.text('DESCEND IMMEDIATELY (MINIMUM 2,000-3,000 FT).', 336, medY + 51);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Administer 4-6 L/min oxygen. Evacuate to hyperbaric chamber (SNM Hospital).', 336, medY + 60);

    // Row 3: HACE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.0);
    doc.setTextColor(alertRed[0], alertRed[1], alertRed[2]);
    doc.text('HACE (Cerebral Edema)', 42, medY + 76);
    doc.setFontSize(6.2);
    doc.text('CRITICAL MEDICAL EMERGENCY', 42, medY + 85);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Severe loss of coordination (ataxia / cannot walk straight),', 156, medY + 76);
    doc.text('acute confusion, slurred speech, hallucinations, coma risk.', 156, medY + 85);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(alertRed[0], alertRed[1], alertRed[2]);
    doc.text('IMMEDIATE EMERGENCY EVACUATION & DESCENT.', 336, medY + 76);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Supplemental oxygen + emergency Dexamethasone. Immediate helicopter rescue.', 336, medY + 85);

    // Row 4: Frostbite & Hypothermia
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.0);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Frostbite & Hypothermia', 42, medY + 101);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.text('Severe Thermal Hazard', 42, medY + 110);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Numbness, white waxy skin on extremities, uncontrollable', 156, medY + 101);
    doc.text('shivering, slurred speech, core temperature dropping < 35°C.', 156, medY + 110);

    doc.text('Rewarm slowly with body heat or warm water (38-40°C). Never rub frostbitten skin.', 336, medY + 101);
    doc.text('Replace wet clothing with dry windproof layers. Drink warm sweetened fluids; NO alcohol.', 336, medY + 110);

    // 4. Section 2: Mountain Pass Road Hazards & Convoy Clearance Advisories
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
    doc.text('2. MOUNTAIN PASS ROAD HAZARDS & CONVOY CLEARANCE ADVISORIES', 36, 252);

    const tblY = 256;
    const tblH = 108;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
    doc.setLineWidth(0.8);
    doc.rect(36, tblY, 523, tblH, 'FD');

    // Table Header Bar
    doc.setFillColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
    doc.rect(36, tblY, 523, 16, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(255, 255, 255);
    doc.text('Mountain Pass', 42, tblY + 11);
    doc.text('Altitude', 125, tblY + 11);
    doc.text('Terrain Hazards & Danger Factors', 205, tblY + 11);
    doc.text('Field Protocol & Vehicle Safety Rules', 355, tblY + 11);

    const passes = [
      { name: 'Khardung La', alt: '17,982 ft (5,480m)', hazard: 'Extreme Hypoxia, Sudden Blizzards, Black Ice.', rule: 'Snow chains mandatory past South Pullu. Max 15-min summit stop.' },
      { name: 'Chang La', alt: '17,590 ft (5,360m)', hazard: 'Extreme Wind Chill (-20°C), Avalanche Chutes.', rule: 'Indian Army 24/7 post offers emergency O2. Descend if SpO2 < 75%.' },
      { name: 'Rohtang Pass', alt: '13,058 ft (3,980m)', hazard: 'Dense Fog, Slippery Slopes, Rockfall risk.', rule: 'NGT Eco-Green permit mandatory. Maintain 30m convoy distance.' },
      { name: 'Zoji La', alt: '11,575 ft (3,528m)', hazard: 'Single-lane Cliffs, Heavy Snow Drifts, Slush.', rule: 'One-way convoy timing enforced. 4x4 low-range engagement mandatory.' },
      { name: 'Baralacha La', alt: '16,043 ft (4,890m)', hazard: 'Complete Isolation, Freezing Waters, No Network.', rule: 'Cross glacial streams (Paggal Nallah) before 11 AM. Min 2-car convoy.' }
    ];

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);

    passes.forEach((p, idx) => {
      const rowY = tblY + 16 + (idx * 18.4);
      doc.line(36, rowY, 559, rowY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.0);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(p.name, 42, rowY + 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.text(p.alt, 125, rowY + 12);

      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text(p.hazard, 205, rowY + 12);

      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(p.rule, 355, rowY + 12);
    });

    // 5. Section 3: 24/7 High-Altitude Oxygen Rescue & Disaster Directory
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
    doc.text('3. 24/7 HIGH-ALTITUDE OXYGEN RESCUE & DISASTER DIRECTORY', 36, 375);

    const sosY = 379;
    const cardW = 256;
    const cardH = 74;

    // Card 1: Medical Facilities
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(248, 113, 113);
    doc.setLineWidth(0.8);
    doc.rect(36, sosY, cardW, cardH, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.4);
    doc.setTextColor(alertRed[0], alertRed[1], alertRed[2]);
    doc.text('🏥 SNM District Hospital, Leh (Altitude Trauma Base)', 42, sosY + 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Primary 24/7 multi-place hyperbaric oxygen chambers & trauma unit.', 42, sosY + 23);
    doc.setFont('helvetica', 'bold');
    doc.text('Emergency Hotline: +91-1982-252014 | Ambulance: 102 / 108', 42, sosY + 33);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.4);
    doc.setTextColor(alertRed[0], alertRed[1], alertRed[2]);
    doc.text('🏔️ Tangtse Emergency Clinic (Pangong Corridor)', 42, sosY + 48);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Emergency SpO2 stabilization unit before Chang La descent.', 42, sosY + 57);
    doc.setFont('helvetica', 'bold');
    doc.text('Medical Officer Base: Tangtse Main Bazaar (Army Assistance Point)', 42, sosY + 66);

    // Card 2: Rescue & Evacuation
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(248, 113, 113);
    doc.setLineWidth(0.8);
    doc.rect(303, sosY, cardW, cardH, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.4);
    doc.setTextColor(alertRed[0], alertRed[1], alertRed[2]);
    doc.text('🚑 Diskit Sub-District Hospital (Nubra Valley)', 311, sosY + 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('High-flow portable oxygen concentrators & 4x4 snow rescue ambulance.', 311, sosY + 23);
    doc.setFont('helvetica', 'bold');
    doc.text('Diskit Emergency Desk: +91-1982-220022', 311, sosY + 33);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.4);
    doc.setTextColor(alertRed[0], alertRed[1], alertRed[2]);
    doc.text('🚜 BRO Highway Rescue & HIMANK (Project Beacon)', 311, sosY + 48);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Heavy snow clearing, avalanche rescue & vehicle recovery.', 311, sosY + 57);
    doc.setFont('helvetica', 'bold');
    doc.text('Disaster Control Helpline: 1077 | Pan-India Police/SOS: 112', 311, sosY + 66);

    // 6. Section 4: Inner Line Permit (ILP) Checkpoints & Border Transit Rules
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
    doc.text('4. INNER LINE PERMIT (ILP) CHECKPOINTS & BORDER TRANSIT RULES', 36, 464);

    const ilpY = 468;
    const ilpH = 68;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
    doc.setLineWidth(0.8);
    doc.rect(36, ilpY, 523, ilpH, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('• Mandatory Hardcopies:', 44, ilpY + 13);
    doc.setFont('helvetica', 'normal');
    doc.text('Carry at least 4 physical printouts of LAHDC Inner Line Permit and government photo ID (Aadhaar / Passport). Checkposts will stamp and retain physical slips at South Pullu, North Pullu, Khardung La & Tsaga La.', 145, ilpY + 13);

    doc.setFont('helvetica', 'bold');
    doc.text('• Zero-Signal Strategy:', 44, ilpY + 28);
    doc.setFont('helvetica', 'normal');
    doc.text('Changthang, Hanle, Nyoma, and Chushul have zero cellular signals. Register transit at ITBP checkposts. Use BSNL satellite booths located in major settlements for distress calls.', 145, ilpY + 28);

    doc.setFont('helvetica', 'bold');
    doc.text('• Border Regulations:', 44, ilpY + 43);
    doc.setFont('helvetica', 'normal');
    doc.text('Zero civilian movement permitted beyond designated permit points. Photography and drone operations are strictly prohibited near military camps, radar bases, and border zones (LAC).', 145, ilpY + 43);

    doc.setFont('helvetica', 'bold');
    doc.text('• High-Altitude Golden Rule:', 44, ilpY + 58);
    doc.setFont('helvetica', 'normal');
    doc.text('Never ascend with headache, nausea, or shortness of breath. Descend immediately to Leh (11,500 ft) if SpO2 drops below 75%.', 145, ilpY + 58);

    // 7. Section 5: Mandatory Survival Gear & Himalayan Leave-No-Trace Code
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
    doc.text('5. MANDATORY SURVIVAL GEAR & HIMALAYAN LEAVE-NO-TRACE CODE', 36, 547);

    const rulesY = 551;
    const rulesH = 54;
    doc.setFillColor(254, 251, 235);
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.8);
    doc.rect(36, rulesY, 523, rulesH, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('• Mandatory Survival Gear:', 44, rulesY + 14);
    doc.setFont('helvetica', 'normal');
    doc.text('Portable SpO2 Pulse Oximeter, 2.2L oxygen canister, First-aid kit with Diamox (Acetazolamide) and ORS, sub-zero sleeping bag (-10°C), thermal flask with warm water, 2 spare tires, tow strap, snow chains, jump cables, and high-calorie energy bars.', 145, rulesY + 14);

    doc.setFont('helvetica', 'bold');
    doc.text('• Leave-No-Trace Policy:', 44, rulesY + 34);
    doc.setFont('helvetica', 'normal');
    doc.text('Disposable plastic bottles are completely prohibited across Ladakh. Refill at Dzomsa water stations. No detergents or washing allowed within 100m of glacial streams or lakes (Pangong Tso, Tso Moriri). Always walk clockwise around stupas.', 145, rulesY + 34);

    // 8. Section 6: Official Verification Seal & Field Clearance
    const fY = 616;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(primaryEmerald[0], primaryEmerald[1], primaryEmerald[2]);
    doc.setLineWidth(1.0);
    doc.rect(36, fY, 320, 56, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.0);
    doc.setTextColor(deepEmerald[0], deepEmerald[1], deepEmerald[2]);
    doc.text('OFFICIAL EMERGENCY CLEARANCE & GUIDELINES', 44, fY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('Authorized by Ministry of Tourism & Smart India Hackathon 2026 Core.', 44, fY + 25);
    doc.text('Valid across all high-altitude trans-Himalayan circuits and border checkposts.', 44, fY + 35);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('CodeBreakerz Initiative • 100% Offline Emergency Safety Standard', 44, fY + 46);

    // Verification Block on Right
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
    doc.setLineWidth(0.8);
    doc.rect(366, fY, 193, 56, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text('DISASTER MANAGEMENT & MOUNTAIN RESCUE CELL', 372, fY + 14);

    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.6);
    doc.line(372, fY + 35, 549, fY + 35);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('Disaster Management & Mountain Rescue Cell Desk', 372, fY + 44);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(successGreen[0], successGreen[1], successGreen[2]);
    doc.text('STATUS: MANDATORY SAFETY ADVISORY CLEARANCE', 372, fY + 52);

    // 9. Document Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('Bharat Explore • Smart India Hackathon (SIH 2026) • Himalayan Travel Safety & Danger Guidelines • 100% Offline Reference', 297.5, 690, { align: 'center' });

    // Save and download
    const filename = saveFilename || 'Bharat_Explore_Himalayan_Safety_Guidelines.pdf';
    doc.save(filename);
    return true;
  }

  /**
   * Main Public Function: Downloads the Himalayan Safety & Danger Guidelines PDF.
   * Tries backend ReportLab vector generator first; seamlessly falls back to client-side jsPDF.
   */
  async function downloadOfflineFieldPassPDF(overrideData, triggerBtn) {
    const traveler = getActiveTravelerData(overrideData);
    const filename = 'Bharat_Explore_Himalayan_Safety_Guidelines.pdf';

    let originalHtml = '';
    if (triggerBtn) {
      originalHtml = triggerBtn.innerHTML;
      triggerBtn.disabled = true;
      triggerBtn.innerHTML = '<span class="field-pass-spinner"></span> Generating Guidelines...';
    }

    showToast('Generating official Himalayan Safety & Danger Guidelines PDF...');

    let downloadedViaBackend = false;

    // 1. Attempt backend download if available
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const endpoint = `/api/passes/download-safety-guidelines-pdf`;
      
      const headers = {};
      if (typeof window !== 'undefined' && window.AuthService && typeof window.AuthService.getToken === 'function') {
        const token = window.AuthService.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
      }

      let response = await fetch(endpoint, {
        method: 'GET',
        headers: headers,
        signal: controller.signal
      });

      // If alias not found, try legacy endpoint
      if (!response.ok && response.status === 404) {
        response = await fetch('/api/passes/download-field-pass-pdf', {
          method: 'GET',
          headers: headers
        });
      }

      clearTimeout(timeoutId);

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/pdf')) {
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 2500);
          downloadedViaBackend = true;
          showToast('✓ Official Safety & Danger Guidelines PDF downloaded successfully!');
        }
      }
    } catch (err) {
      console.warn('[FieldPass] Backend fetch did not complete, switching to client vector engine:', err.message || err);
    }

    // 2. If backend was not reached or returned error, generate via local client-side jsPDF
    if (!downloadedViaBackend) {
      try {
        generateClientSidePDF(traveler, filename);
        showToast('✓ Offline Safety & Danger Guidelines PDF generated and downloaded!');
      } catch (clientErr) {
        console.error('[FieldPass] Client PDF generation error:', clientErr);
        showToast('⚠️ Could not generate PDF. Please try printing via browser.');
      }
    }

    if (triggerBtn) {
      triggerBtn.disabled = false;
      triggerBtn.innerHTML = originalHtml;
    }
  }

  // Export functions globally
  if (typeof window !== 'undefined') {
    window.downloadOfflineFieldPassPDF = downloadOfflineFieldPassPDF;
    window.generateFieldPassClientPDF = generateClientSidePDF;
  }

  return {
    downloadOfflineFieldPassPDF,
    generateClientSidePDF,
    getActiveTravelerData
  };
}));
