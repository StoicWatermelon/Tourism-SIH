"""
Official Himalayan Travel Safety & Danger Guidelines PDF Generator.
Bharat Explore (Smart India Hackathon 2026).
Generates an official, publication-quality printable and downloadable PDF
detailing altitude dangers (AMS/HAPE/HACE), mountain pass hazards,
24/7 oxygen and trauma rescue centers, ILP checkpoint rules, and survival essentials.
Not personalized to an individual traveler — purely an official field safety reference guide.
"""

import io
import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

def generate_field_pass_pdf(traveler_data: dict = None) -> bytes:
    """
    Builds a high-fidelity vector PDF for the Himalayan Safety & Danger Guidelines
    and returns raw PDF bytes. Fits neatly on a single high-density A4 sheet.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=32,
        rightMargin=32,
        topMargin=28,
        bottomMargin=28
    )

    # Color Palette - Aligned with Bharat Explore Branding
    EMERALD_DEEP = colors.HexColor("#06231d")
    EMERALD_PRIMARY = colors.HexColor("#0f5144")
    GOLD_ACCENT = colors.HexColor("#d97706")
    GOLD_LIGHT = colors.HexColor("#fef3c7")
    BG_LIGHT = colors.HexColor("#f8fafc")
    INK_TEXT = colors.HexColor("#0f172a")
    MUTED_TEXT = colors.HexColor("#475569")
    BORDER_COLOR = colors.HexColor("#cbd5e1")
    DANGER_RED = colors.HexColor("#b91c1c")
    DANGER_BG = colors.HexColor("#fef2f2")
    WARNING_BG = colors.HexColor("#fffbeb")

    styles = getSampleStyleSheet()

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13.5,
        leading=16,
        textColor=EMERALD_DEEP,
        alignment=TA_CENTER
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=MUTED_TEXT,
        alignment=TA_CENTER
    )

    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=EMERALD_PRIMARY
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=INK_TEXT
    )

    body_bold = ParagraphStyle(
        'BodyDarkBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=INK_TEXT
    )

    danger_bold = ParagraphStyle(
        'DangerBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=DANGER_RED
    )

    muted_style = ParagraphStyle(
        'BodyMuted',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=6.8,
        leading=8.5,
        textColor=MUTED_TEXT
    )

    story = []

    # 1. Header Banner Box
    banner_data = [
        [
            Paragraph("<b>BHARAT EXPLORE • SMART INDIA HACKATHON 2026</b><br/>"
                      "<font size='6.8' color='#475569'>MINISTRY OF TOURISM • SUSTAINABLE HIMALAYAN EXPEDITION CELL</font>", subtitle_style)
        ],
        [
            Paragraph("HIGH-ALTITUDE TRAVEL SAFETY & DANGER PROTOCOLS", title_style)
        ],
        [
            Paragraph("OFFICIAL EMERGENCY GUIDELINES • AMS & HYPOXIA HAZARDS • MOUNTAIN PASS ADVISORIES • 24/7 RESCUE DIRECTORY", subtitle_style)
        ]
    ]
    banner_table = Table(banner_data, colWidths=[531])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1.2, EMERALD_PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 6))

    # 2. Metadata Ribbon Bar
    now_str = datetime.datetime.now(datetime.timezone.utc).strftime("%d %b %Y, %H:%M UTC")
    meta_cells = [
        [
            Paragraph("<b>Doc ID:</b> <code>BE-HIM-SAFETY-2026</code>", body_style),
            Paragraph(f"<b>Issued:</b> {now_str}", body_style),
            Paragraph("<b>Scope:</b> Ladakh, Spiti & High Passes", body_style),
            Paragraph("<b>Elevation:</b> <font color='#b91c1c'><b>10,000–18,380 ft</b></font>", body_style),
            Paragraph("<b>Status:</b> <font color='#15803d'><b>MANDATORY GUIDE</b></font>", body_style),
        ]
    ]
    meta_table = Table(meta_cells, colWidths=[125, 115, 120, 85, 86])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), GOLD_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.8, GOLD_ACCENT),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 7))

    # 3. Section 1: Altitude Dangers, Hypoxia & Emergency Medical Protocols
    story.append(Paragraph("1. CRITICAL ALTITUDE DANGERS & HYPOXIA EMERGENCY PROTOCOLS", h2_style))
    story.append(Spacer(1, 2))

    medical_rows = [
        [
            Paragraph("<b>Hazard / Condition</b>", body_bold),
            Paragraph("<b>Critical Danger Symptoms</b>", body_bold),
            Paragraph("<b>Immediate Emergency Action Protocol</b>", body_bold)
        ],
        [
            Paragraph("<b>Acute Mountain Sickness (AMS)</b><br/><font color='#b91c1c'>Mild to Moderate</font>", body_style),
            Paragraph("Throbbing frontal headache, nausea, loss of appetite, dizziness, fatigue, insomnia. Common above 10,000 ft (Leh, Kargil).", body_style),
            Paragraph("<b>STOP ASCENT IMMEDIATELY.</b> Rest 24–48 hours at same elevation. Hydrate with 4–5L water + ORS. If symptoms worsen or persist > 24 hrs, descend 2,000 ft immediately.", body_style)
        ],
        [
            Paragraph("<b>HAPE (High Altitude Pulmonary Edema)</b><br/><font color='#b91c1c'><b>LIFE THREATENING</b></font>", danger_bold),
            Paragraph("Extreme breathlessness at rest, persistent cough with pink frothy sputum, gurgling/rattling in chest, cyanosis (blue lips/fingers), SpO2 &lt; 65%, rapid pulse &gt; 110 bpm.", body_style),
            Paragraph("<b>DESCEND IMMEDIATELY (MINIMUM 2,000–3,000 FT).</b> Administer 4–6 L/min supplemental oxygen. Keep victim upright and warm. Evacuate to nearest hyperbaric chamber (SNM Hospital Leh).", danger_bold)
        ],
        [
            Paragraph("<b>HACE (High Altitude Cerebral Edema)</b><br/><font color='#b91c1c'><b>MEDICAL EMERGENCY</b></font>", danger_bold),
            Paragraph("Severe loss of physical coordination (ataxia / unable to walk straight line), confusion, slurred speech, hallucinations, irrational behavior, progressing to coma.", body_style),
            Paragraph("<b>IMMEDIATE EMERGENCY EVACUATION & DESCENT.</b> Administer oxygen and emergency Dexamethasone if medical officer present. Immediate helicopter rescue call to Army/Disaster cell.", danger_bold)
        ],
        [
            Paragraph("<b>Frostbite & Hypothermia</b><br/><font color='#d97706'>Severe Thermal Hazard</font>", body_style),
            Paragraph("Numbness, white waxy skin on fingers/toes/nose, uncontrollable shivering, slurred speech, core temperature dropping below 35°C (95°F).", body_style),
            Paragraph("Rewarm slowly with body heat or warm water (38–40°C). Never rub frostbitten skin. Replace wet layers with dry windproof clothing. Drink warm sweetened fluids; NO alcohol.", body_style)
        ]
    ]
    med_table = Table(medical_rows, colWidths=[120, 205, 206])
    med_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), EMERALD_DEEP),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 0.8, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(med_table)
    story.append(Spacer(1, 7))

    # 4. Section 2: Mountain Pass Road Hazards & High-Altitude Advisories
    story.append(Paragraph("2. MOUNTAIN PASS ROAD HAZARDS & CONVOY CLEARANCE ADVISORIES", h2_style))
    story.append(Spacer(1, 2))

    pass_headers = [
        Paragraph("<b>Mountain Pass</b>", body_bold),
        Paragraph("<b>Altitude</b>", body_bold),
        Paragraph("<b>Terrain Hazards & Danger Factors</b>", body_bold),
        Paragraph("<b>Field Protocol & Vehicle Safety Rules</b>", body_bold)
    ]
    pass_rows = [
        pass_headers,
        [
            Paragraph("<b>Khardung La</b>", body_style),
            Paragraph("17,982 ft (5,480m)", body_style),
            Paragraph("Extreme Hypoxia, Sudden Blizzards, Black Ice, Steep Drop-offs.", muted_style),
            Paragraph("<b>Snow chains mandatory</b> past South Pullu. <b>Maximum 15-minute summit stop</b> to prevent rapid cerebral edema. Keep engine running in sub-zero idle.", body_style)
        ],
        [
            Paragraph("<b>Chang La</b>", body_style),
            Paragraph("17,590 ft (5,360m)", body_style),
            Paragraph("Extreme Wind Chill (-20°C), Avalanche Chutes, Icy Hairpins.", muted_style),
            Paragraph("Carry calibrated SpO2 oximeter. Indian Army 24/7 medical post at summit offers emergency oxygen. Descend towards Tangtse if SpO2 drops below 75%.", body_style)
        ],
        [
            Paragraph("<b>Rohtang Pass</b>", body_style),
            Paragraph("13,058 ft (3,980m)", body_style),
            Paragraph("Dense Fog, Slippery Mud Slopes, Rockfall during monsoon.", muted_style),
            Paragraph("NGT Eco-Green permit mandatory. Maintain 30m convoy distance. Avoid transit after sunset due to falling rocks. Electric vehicles given uphill priority.", body_style)
        ],
        [
            Paragraph("<b>Zoji La</b>", body_style),
            Paragraph("11,575 ft (3,528m)", body_style),
            Paragraph("Single-lane Unpaved Cliffs, Heavy Snow Drifts, Mud Slides.", muted_style),
            Paragraph("Strict one-way convoy timing enforced: Kargil to Srinagar morning, reverse afternoon. 4x4 low-range engagement mandatory in slush and ice.", body_style)
        ],
        [
            Paragraph("<b>Baralacha La</b>", body_style),
            Paragraph("16,043 ft (4,890m)", body_style),
            Paragraph("Complete Isolation, Freezing Waters, Zero Network.", muted_style),
            Paragraph("Cross glacier streams (Paggal Nallah) <b>before 11:00 AM</b> before snow melt swells. Never travel solo; travel in minimum 2-vehicle convoy.", body_style)
        ]
    ]
    passes_table = Table(pass_rows, colWidths=[85, 80, 150, 216])
    passes_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), EMERALD_PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 0.8, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(passes_table)
    story.append(Spacer(1, 7))

    # 5. Section 3: 24/7 Emergency Rescue, Hyperbaric Oxygen & Disaster Matrix
    story.append(Paragraph("3. 24/7 HIGH-ALTITUDE OXYGEN RESCUE & DISASTER DIRECTORY", h2_style))
    story.append(Spacer(1, 2))

    sos_data = [
        [
            Paragraph("<b>🏥 SNM District Hospital, Leh (Altitude Trauma Base):</b><br/>"
                      "Primary altitude trauma center with 24/7 multi-place hyperbaric oxygen chambers.<br/>"
                      "<b>Emergency Hotline: <code>+91-1982-252014</code> | Ambulance: <code>102</code> / <code>108</code></b>", body_style),
            Paragraph("<b>🚑 Diskit Sub-District Hospital (Nubra Valley):</b><br/>"
                      "Equipped with high-flow portable oxygen concentrators & 4x4 snow rescue ambulance.<br/>"
                      "<b>Diskit Emergency Desk: <code>+91-1982-220022</code></b>", body_style)
        ],
        [
            Paragraph("<b>🏔️ Tangtse Emergency Clinic (Pangong Corridor):</b><br/>"
                      "Emergency SpO2 stabilization unit located before Pangong Lake and Chang La descent.<br/>"
                      "<b>Medical Officer Base: Tangtse Main Bazaar (Army Assistance Point)</b>", body_style),
            Paragraph("<b>🚜 BRO HIMANK & Project Beacon Highway Rescue:</b><br/>"
                      "Heavy snow clearing, avalanche rescue, vehicle recovery, and landslide clearing.<br/>"
                      "<b>Disaster Control Helpline: <code>1077</code> | Pan-India Police/SOS: <code>112</code></b>", body_style)
        ]
    ]
    sos_table = Table(sos_data, colWidths=[265, 266])
    sos_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), DANGER_BG),
        ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor("#f87171")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#fecaca")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(sos_table)
    story.append(Spacer(1, 7))

    # 6. Section 4: Inner Line Permit (ILP) Checkpoints & Restricted Border Rules
    story.append(Paragraph("4. INNER LINE PERMIT (ILP) CHECKPOINTS & BORDER TRANSIT RULES", h2_style))
    story.append(Spacer(1, 2))

    protocol_text = (
        "<b>• Mandatory Physical Hardcopies:</b> Carry at least 4 physical printouts of your official LAHDC Inner Line Permit receipt and government photo ID (Aadhaar / Passport). Checkposts will stamp and retain physical slips at South Pullu, North Pullu, Khardung La, and Tsaga La.<br/>"
        "<b>• Zero-Signal Communication Strategy:</b> Changthang, Hanle, Nyoma, and Chushul have zero cellular signals. Register transit at ITBP checkposts. Use BSNL satellite booths located in major settlements for distress calls.<br/>"
        "<b>• Restricted Border Regulations:</b> Zero civilian movement permitted beyond designated permit points. Photography and drone operations are strictly prohibited near military camps, radar bases, and border zones (LAC)."
    )
    protocol_box = Table([[Paragraph(protocol_text, body_style)]], colWidths=[531])
    protocol_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.8, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(protocol_box)
    story.append(Spacer(1, 7))

    # 7. Section 5: Mandatory Vehicle Kit & Leave-No-Trace Ecological Code
    story.append(Paragraph("5. MANDATORY SURVIVAL GEAR & HIMALAYAN LEAVE-NO-TRACE CODE", h2_style))
    story.append(Spacer(1, 2))

    rules_text = (
        "<b>• Mandatory On-Board Survival Gear:</b> Portable SpO2 Pulse Oximeter, 2.2L oxygen can, First-aid kit with Diamox (Acetazolamide) and ORS, sub-zero sleeping bag (-10°C), thermal flask with warm water, 2 spare tires, tow strap, snow chains, jump cables, and high-calorie energy bars.<br/>"
        "<b>• Zero Single-Use Plastic Policy:</b> Disposable plastic bottles are completely prohibited across Ladakh. Refill at Dzomsa water stations. No detergents or washing allowed within 100m of glacial streams or lakes (Pangong Tso, Tso Moriri). Always walk clockwise around Buddhist chortens."
    )
    rules_box = Table([[Paragraph(rules_text, body_style)]], colWidths=[531])
    rules_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), WARNING_BG),
        ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor("#f59e0b")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(rules_box)
    story.append(Spacer(1, 8))

    # 8. Verification Seal & Official Safety Clearance Footer
    footer_data = [
        [
            Paragraph("<b>OFFICIAL EMERGENCY CLEARANCE & GUIDELINES</b><br/>"
                      "Authorized by Ministry of Tourism & Smart India Hackathon 2026 Core.<br/>"
                      "Valid across all high-altitude trans-Himalayan circuits and border checkposts.<br/>"
                      "<font size='6.2' color='#64748b'>CodeBreakerz Initiative • 100% Offline Emergency Safety Standard</font>", muted_style),
            Paragraph("<b>FIELD VERIFICATION DESK / EMERGENCY CELL</b><br/><br/>"
                      "____________________________________<br/>"
                      "<font size='6.8' color='#475569'>Disaster Management & Mountain Rescue Cell</font>", muted_style)
        ]
    ]
    footer_table = Table(footer_data, colWidths=[330, 201])
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(footer_table)

    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
