# BHARAT EXPLORE — COMPREHENSIVE PLATFORM FEATURE GUIDE
**Smart India Hackathon (SIH 2026) Official Platform**  
*Next-Generation High-Altitude Intelligence, Decentralized Heritage Corridors & Sustainable Tourism Engine*

---

## 1. Executive Summary & System Architecture

### 1.1 Project Overview & Vision
**Bharat Explore** is an AI-driven, eco-conscious tourism intelligence and expedition platform engineered for **Smart India Hackathon (SIH 2026)**. The platform solves the critical challenges of mass over-tourism, fragile Himalayan ecosystem degradation, altitude sickness risks, and leakage of tourism revenue away from indigenous communities.

By combining real-time high-pass telemetry, Acute Mountain Sickness (AMS) acclimatization safety audits, gamified leave-no-trace incentives, decentralized 3D heritage corridors, and an offline-resilient field pass generator, Bharat Explore provides an end-to-end sustainable travel solution for both Himalayan passes and pan-India cultural circuits.

---

### 1.2 Workspace Directory Structure
```
Bharat_Explore_SIH_Tourism/
├── index.html                        # Root entry redirector / overview landing page
├── FEATURE_GUIDE.md                  # Comprehensive platform feature guide (this document)
├── README.md                         # Project documentation and hackathon brief
├── start.bat                         # Automated 1-click startup launcher (FastAPI + frontend)
├── requirements.txt                  # Python dependencies (FastAPI, ReportLab, Supabase, etc.)
│
├── html/                             # Multi-page presentation views
│   ├── home.html                     # Primary cinematic home landing page
│   ├── index.html                    # Unified explorer experience (all-in-one showcase)
│   ├── explore.html                  # Curated destination directory & decongestion explorer
│   ├── circuits.html                 # 20 Pan-India 3D regional heritage & ecological portals
│   ├── map.html                      # Interactive 36-state Leaflet GIS discovery map
│   ├── planner.html                  # Pass-audited smart itinerary planner
│   ├── ai.html                       # Bharat AI conversational streaming assistant
│   ├── responsible.html              # Leave-no-trace code & gamified eco-travel center
│   ├── culture.html                  # Sacred living traditions, geometry & deep archives
│   ├── food.html                     # High-altitude cuisine & zero-mile food supply chain
│   ├── login.html                    # Traveler sign-in console with demo auto-fill
│   ├── register.html                 # 2-step onboarding wizard with travel personas
│   ├── profile.html                  # Traveler dossier, saved circuits & safety card
│   └── CodeBreakerz.html             # SIH 2026 team showcase & project architecture
│
├── js/                               # Modular Vanilla JavaScript engines
│   ├── app.js                        # Core application state, renderers, drawer, search, tilt
│   ├── ai.js                         # Bharat AI chat stream, markdown parser & itinerary engine
│   ├── map.js                        # Leaflet GIS engine, 44 hotspots, bounds & tooltip placement
│   ├── game.js                       # The Great Himalayan Eco-Expedition quest engine & Web Audio SFX
│   ├── auth.js                       # Authentication service, session management, router guards
│   ├── field_pass.js                 # Dual-engine offline field pass generator (Vector PDF)
│   ├── i18n.js                       # Trilingual localization engine (English, Hindi, Bengali)
│   └── jspdf.umd.min.js              # Client-side vector PDF generation library
│
├── css/                              # Modular Vanilla CSS architecture
│   ├── style.css                     # Global design tokens, typography, glassmorphism, responsive grid
│   ├── ai.css                        # AI streaming chat, suggestions, orb animations, itinerary styles
│   ├── map.css                       # Leaflet custom pins, hover cards, category filters, side panel
│   └── auth.css                      # Split-screen auth consoles, stepper wizard, profile dossier
│
├── backend/                          # FastAPI microservice backend
│   ├── server.py                     # REST API endpoints, JWT auth, AI proxy, telemetry, routing
│   ├── field_pass_pdf.py             # ReportLab vector PDF generator (high-res official pass)
│   ├── supabase_client.py            # Supabase Cloud PostgreSQL & auth client
│   ├── test_supabase.py              # Supabase connection & schema verification test
│   └── data/                         # Local cached datasets (destinations, passes)
│
├── assets/                           # Static assets & media
│   ├── images/                       # High-resolution photographic assets, badges, favicons
│   │   ├── favicon.png               # Brand icon & institutional seal
│   │   ├── hero.jpg, leh.jpg, etc.   # Destination visual assets
│   └── audio/                        # Audio guides and ambient sounds
│
└── scratch/                          # Verification and dataset generation scripts
```

---

### 1.3 Dual-Execution Architecture
The platform is engineered with a **Zero-Failure Dual Execution Model**:
1. **100% Client-Side Static Execution**: Any static web server (VS Code Live Server, Python `http.server`, GitHub Pages, or direct file open) runs the full application. Data sets (destinations, 44 hotspots, circuits, foods, fallback AI heuristics, client-side vector jsPDF generation) are self-contained in vanilla JS.
2. **Full-Stack Production Mode with FastAPI**: When `server.py` is running (`http://127.0.0.1:8000`), the frontend automatically detects the API, syncs with Supabase cloud database, streams live AI responses via Gemini 3.1 Flash Lite, downloads backend ReportLab vector PDFs, and synchronizes cross-device traveler profiles.

---

## 2. Routing & Navigation Architecture

### 2.1 Multi-Page Routing Model
Bharat Explore utilizes a multi-page navigation architecture (MPA) providing dedicated, SEO-optimized HTML pages for each core user flow, combined with client-side off-canvas drawers and modal state machines for persistent workflows.

| URL Route (Clean) | Direct HTML File | Primary Purpose | Key Components Loaded |
| :--- | :--- | :--- | :--- |
| `/` or `/home` | `html/home.html` | Cinematic Landing Page | Ambient hero, telemetry strip, 3D portals, map preview, AI teaser, game |
| `/overview` | `html/index.html` | Unified Explorer Showcase | All-in-one single-page discovery view with full vertical scrolling |
| `/explore` | `html/explore.html` | Destination & Decongestion Directory | 12 curated circuits, offbeat/altitude filters, community revenue badges |
| `/circuits` | `html/circuits.html` | 3D Regional Heritage Portals | 20 pan-India cultural corridors with 3D mouse-tracking perspective tilt |
| `/map` | `html/map.html` | 36-State Interactive Map | Full-canvas Leaflet.js GIS map, 44 hotspots, state boundary GeoJSON |
| `/planner` | `html/planner.html` | Pass-Audited Itinerary Planner | 5-parameter route builder, altitude safety audit, timeline view |
| `/ai` | `html/ai.html` | Bharat AI Specialist Console | Real-time conversational AI, destination classifier, speech synthesis |
| `/responsible` | `html/responsible.html`| Leave-No-Trace Code & Eco Center | 7 ethical principles, gamified score engine, plastic pledge modal |
| `/culture` | `html/culture.html` | Sacred Living Traditions | Deep archives of prayer flags, Cham dances, solar architecture, pashmina |
| `/food` | `html/food.html` | High-Altitude & Zero-Mile Cuisine | Indigenous Himalayan grains, farm-to-table cooperative direct links |
| `/login` | `html/login.html` | Traveler Sign-In Console | Split-screen login, 1-click hackathon demo fill, password toggle |
| `/register` | `html/register.html` | 2-Step Onboarding Stepper | Identity credentials, travel persona cards, guest session migration |
| `/profile` | `html/profile.html` | Traveler Dossier & Dashboard | 4-tab console: saved circuits, custom expeditions, safety card, settings |
| `/team` or `/codebreakerz` | `html/CodeBreakerz.html`| SIH 2026 Team Showcase | Team Code Breakerz bios, problem statement, project tech stack |

---

### 2.2 Client-Side Route Guards & State Handoff
Managed inside `js/auth.js`:
- **Guest-Only Guard (`guardPage("guest-only")`)**: Applied on `/login` and `/register`. If a valid JWT token (`bharat_auth_token`) exists in `localStorage`, travelers are redirected to `/profile` or the `?redirect=` target.
- **Auth-Required Guard (`guardPage("auth-required")`)**: Applied on `/profile`. Unauthenticated visitors are redirected to `/login?redirect=/profile`.
- **Guest Session Migration**: Bookmarks saved in guest mode (`bharatSaved` in `localStorage` and guest session ID `bharatSessionId`) are automatically merged into the traveler's permanent cloud account upon registration or login.
- **State-to-Planner Deep Link**: Selecting any region or destination from the map or circuits triggers `loadStateIntoPlanner(stateName)` or navigates to `planner.html?state=...`, pre-filling the itinerary generator.

---

## 3. Core Design System & UI/UX Engine

### 3.1 Visual Tokens & Color Palette
Defined in `css/style.css` (`:root`):
- **Deep Forest Obsidian**: `--deep: #071711`, `--forest-dark: #0c231a`, `--forest-card: #123024` — provides an immersive, high-altitude atmospheric dark theme.
- **Organic Parchment Cream**: `--paper: #f4efe4`, `--paper-warm: #eae2d0`, `--cream: #faf7f0` — used for editorial daytime sections.
- **Himalayan Emerald & Mint**: `--accent: #2d6a4f`, `--accent-light: #40916c`, `--green-mint: #74c69d`, `--emerald-pop: #52b788` — symbolizes living biodiversity and conservation.
- **Solar Gold Accent**: `--gold-pop: #e9c46a`, `--gold-glow: rgba(233, 196, 106, 0.28)` — represents sacred Buddhist monasteries and solar energy.
- **Depth & Shadows**: Smooth multi-stop box shadows (`--depth-sm`, `--depth-md`, `--depth-lg`, `--depth-glow`) creating tactile elevation.

### 3.2 Typography & Aesthetics
- **Display Typography**: `Playfair Display` (serif) for classical editorial headers and cultural gravitas.
- **Interface Typography**: `DM Sans` (sans-serif) for clean readability, telemetry data, and navigation.
- **Code & Tech Branding**: `Space Grotesk` (on team showcase).
- **Glassmorphism**: Backdrop blur filters (`backdrop-filter: blur(20px)`), frosted borders (`rgba(116, 198, 157, 0.2)`), and ambient depth meshes.

### 3.3 Dynamic Micro-Animations & 3D Tilt Engine
- **Scroll Reveal (`initScrollReveal()`)**: `IntersectionObserver` dynamically observes section heads, grids, and score cards, fading them upward with smooth cubic-bezier easing.
- **Ambient Canvas Particles (`initAmbientParticles()`)**: High-altitude floating snow/dust particles rendered on a background HTML5 `<canvas>` element.
- **3D Perspective Tilt (`addCard3D()` & `initExperienceCard3D()`)**: Calculates cursor offset relative to card centers and transforms elements along X and Y axes (`transform: perspective(1000px) rotateX(...) rotateY(...) scale3d(1.02, 1.02, 1.02)`), with glare lighting overlay.

---

## 4. Global Navigation & Common Header/Footer Capabilities

### 4.1 Institutional Glassmorphic Navbar
- **Feature Name**: Institutional Unsticky Glassmorphic Navbar
- **User Action**: Scrolls page, clicks brand logo, navigates pages, toggles mobile hamburger drawer.
- **Technical Implementation**:
  - Element: `<header class="nav" id="navbar">`
  - CSS: `.nav`, `.nav.scrolled`, `.nav-toggle`, `css/style.css` (lines 84–160)
  - JS: `window.addEventListener("scroll")` toggles `.scrolled` state. `.nav-toggle.onclick` toggles `.nav.open`.
  - File Locations: All HTML files, `css/style.css`, `js/app.js`

### 4.2 Global Fuzzy Search Modal
- **Feature Name**: Global Destination & Heritage Search
- **User Action**: Clicks search button (`#searchBtn` or `#globalSearchBtn`), presses `Enter` in search field, or types in `#modalSearch`.
- **Technical Implementation**:
  - Element: `<div class="modal search-modal" id="searchModal">`, `<input id="modalSearch">`, `<div id="searchResults">`
  - JS Function: `search(q)` in `js/app.js` (lines 1380–1412)
  - Logic: Filters `activeDestinations` across name, location, type, category, description, and state. Renders matching cards with direct "Explore" and "♥ Save" actions.
  - File Locations: All HTML files, `css/style.css`, `js/app.js`

### 4.3 Trilingual Localization (i18n) Engine
- **Feature Name**: Instant Trilingual Language Switcher (EN / HI / BN)
- **User Action**: Selects language dropdown (`#language`) in navigation.
- **Technical Implementation**:
  - Element: `<select id="language">`
  - Attributes: `data-i18n` (text), `data-i18n-title` (tooltip), `data-i18n-placeholder` (inputs)
  - JS Engine: `window.i18n.setLanguage(lang)` in `js/i18n.js`
  - Event: Broadcasts custom event `bharat-lang-changed`. Re-renders dynamic destination grids, categories, circuits, and food listings in Hindi (हिन्दी) or Bengali (বাংলা).
  - File Locations: All HTML files, `js/i18n.js`, `js/app.js`

### 4.4 Saved Journey Counter & Sliding Off-Canvas Drawer
- **Feature Name**: My Journey Bookmarks Drawer
- **User Action**: Clicks heart icon (`#savedBtn`) in navbar. Clicks "Remove" or "Clear All Journey".
- **Technical Implementation**:
  - Element: `<aside class="journey-drawer" id="journeyDrawer">`, `<span id="navSavedCount">`
  - JS Functions: `saveDestination(id)`, `removeSavedDestination(id)`, `renderJourneyDrawer()`, `updateSavedCount()` in `js/app.js` (lines 1192–1250)
  - Backend Sync: `syncSavedToBackend(savedIds)` synchronizes bookmarks with `/api/journey/save` or `/api/user/save`.
  - File Locations: All HTML files, `css/style.css`, `js/app.js`

### 4.5 Dynamic Authentication Status & Navbar Profile Pill
- **Feature Name**: Dynamic Navbar Auth State Synchronizer
- **User Action**: Views navigation bar when logged in vs logged out. Clicks user avatar/sign-in button.
- **Technical Implementation**:
  - Element: `<button id="navAuthBtn" class="nav-auth-btn">`
  - JS Function: `AuthService.updateNavAuthState()` in `js/auth.js`
  - Logic: If logged in, displays traveler's avatar (e.g., 🏔️) and first name; clicking routes directly to `profile.html`. If guest, displays "Sign In"; clicking routes to `login.html`.
  - Event: Listens to custom event `bharat:auth-changed`.
  - File Locations: All HTML files, `css/auth.css`, `js/auth.js`

### 4.6 Offline Field Kit Quick Launch Modal
- **Feature Name**: Offline Travel Field Kit Quick Launcher
- **User Action**: Clicks "🛡️ Offline Pass" (`#fieldKitQuickBtn` or footer link `#footerFieldKitLink`).
- **Technical Implementation**:
  - Element: `<div class="modal" id="fieldKitModal">`
  - Triggers: Opens official high-altitude emergency pass downloader with AMS protocols, hyperbaric oxygen rescue network contacts, and 100% offline access.
  - File Locations: All HTML files, `css/style.css`, `js/app.js`, `js/field_pass.js`

### 4.7 Institutional Footer & Telemetry Status Pill
- **Feature Name**: Pan-India Institutional Footer
- **User Action**: Explores sitemap, emergency contacts, pass telemetry status, and hackathon credits.
- **Technical Implementation**:
  - Element: `<footer class="site-footer" id="siteFooter">`
  - Telemetry Pill: `<div class="footer-status-pill">` displays live indicator dot with "Expedition Telemetry Online • 6 Passes Monitored".
  - File Locations: All HTML files, `css/style.css`

---

## 5. Page-by-Page Deep Audit & Feature Catalog

```
================================================================================
PAGE 1: CINEMATIC LANDING PAGE (html/home.html & html/index.html)
================================================================================
```

### 5.1 Atmospheric 3D Video Hero
- **Feature Name**: Cinematic Atmospheric Hero with Live Altitude Baseline
- **User Action**: Lands on homepage; views ambient depth video mesh, altitude statistics, and CTA triggers.
- **Technical Implementation**:
  - HTML: `<section class="hero">`, `<video class="hero-bg-video">`, `<div class="hero-stats">`
  - CSS: `.hero`, `.ambient-depth-mesh`, `.hero-badge` in `css/style.css`
  - Data: Live altitude baseline (`11,500+ ft`), 12+ sacred monasteries, 6 monitored passes.
  - File Locations: `html/home.html`, `html/index.html`, `css/style.css`

### 5.2 Live High-Pass Telemetry Ribbon
- **Feature Name**: Live Himalayan Mountain Pass Telemetry Strip
- **User Action**: Inspects real-time road conditions, altitudes, temperatures, and caution advisories for 6 critical Himalayan passes.
- **Technical Implementation**:
  - HTML: `<div class="hero-telemetry-ribbon">`, `<div class="telemetry-item">`
  - JS: `fetchPassesFromAPI()` in `js/app.js` (lines 788–825)
  - API Fetched: `GET /api/passes` (Backend endpoint returning Khardung La, Chang La, Zoji La, Baralacha La, Rohtang, Tanglang La conditions).
  - Fallback: Hardcoded high-altitude sensor data if backend is offline.
  - File Locations: `html/home.html`, `css/style.css`, `js/app.js`

### 5.3 Emotion-Driven Journey Discoverer
- **Feature Name**: Emotion-Driven Quick Journey Selector
- **User Action**: Clicks emotion pills: "☁ Peaceful Retreats", "⚡ High Adventure", "◈ Living Culture", "◌ Pure Nature", "✦ Sacred Trails", "🍛 Zero-Mile Food".
- **Technical Implementation**:
  - HTML: `<div class="emotion-row">`, `<button data-emotion="...">`
  - JS: Click listener in `js/app.js` (lines 1648–1662) maps emotion to category, calls `renderResults(category)`, and scrolls smoothly to `#explore`.
  - File Locations: `html/home.html`, `html/index.html`, `js/app.js`

### 5.4 Pan-India 3D Regional Portals
- **Feature Name**: 20 Pan-India Regional Heritage Portals
- **User Action**: Filters portals by region (North, North East, West & Central, South & Islands). Hovers over cards for 3D perspective depth; clicks to inspect state.
- **Technical Implementation**:
  - HTML: `<section class="circuits" id="circuits">`, `<div class="circuit-grid" id="circuitGrid">`
  - JS: `renderCircuits(region)` and `addCard3D()` in `js/app.js` (lines 949–980, 1121–1165)
  - Interaction: `selectCircuit(stateName)` focuses Leaflet map on target state coordinates or navigates to planner.
  - File Locations: `html/home.html`, `html/circuits.html`, `css/style.css`, `js/app.js`

### 5.5 Leaflet.js State Discovery Map Preview
- **Feature Name**: Spatial Discovery Map with Hotspot Pulse Markers
- **User Action**: Pans, zooms, and clicks on interactive pulse nodes across Indian states; views popups and detailed side panel.
- **Technical Implementation**:
  - HTML: `<section class="map-section" id="mapSection">`, `<div id="map">`, `<aside class="map-panel" id="mapPanel">`
  - CSS: `css/map.css`
  - JS: `initMap()`, `filterMapHotspots()` in `js/map.js`
  - GIS Stack: Leaflet 1.9.4 with CartoDB Voyager raster tiles and GeoJSON boundaries.
  - File Locations: `html/home.html`, `html/map.html`, `css/map.css`, `js/map.js`

### 5.6 Himalayan Decongestion Engine & Destination Directory
- **Feature Name**: Smart Decongestion Policy & Footfall Filter Engine
- **User Action**: Toggles filters: "All Circuits", "🌱 Offbeat & Low-Footfall Gems", "🏔 High-Altitude (14,000+ ft)", "🏘 Community Homestays". Clicks "Explore" or "♥ Save".
- **Technical Implementation**:
  - HTML: `<div class="filter-bar">`, `<div class="destination-grid" id="destinationGrid">`
  - JS: `renderDestinations()` in `js/app.js` (lines 991–1075)
  - Business Logic: Flags offbeat destinations (Hanle, Turtuk, Sham Valley, Spiti) with `isOffbeat: true` and highlights "Eco-Dispersion Gem" badges and local community revenue percentage (80%–95%).
  - API Sync: `fetchDestinationsFromAPI()` syncs with `GET /api/destinations`.
  - File Locations: `html/home.html`, `html/explore.html`, `css/style.css`, `js/app.js`

### 5.7 The Great Himalayan Eco-Expedition Interactive Game
- **Feature Name**: Gamified High-Altitude Expedition Quest Engine
- **User Action**: Plays through a 5-stage interactive decision-making journey (Leh Acclimatization, Khardung La Waste, Pangong Camping, Turtuk Souvenirs, Hanle Stargazing). Chooses between responsible and reckless actions.
- **Technical Implementation**:
  - HTML: `<section class="section game-section" id="gameSection">`, `<div class="game-hud" id="gameHud">`, `<div class="game-stage-card" id="gameStageCard">`
  - JS: `js/game.js` (815 lines)
  - Audio Synthesis: Custom `SoundFx` class utilizing Web Audio API (`AudioContext`) to generate sine, triangle, and sawtooth tones (good, caution, fanfare) without external audio files.
  - Metrics Tracked: Oxygen SpO2 Level (starts at 92%), Eco-Stewardship Points, Community Revenue Generated.
  - Reward: Generates an official digital Eco-Passport completion certificate with custom seal.
  - File Locations: `html/home.html`, `html/index.html`, `css/style.css`, `js/game.js`

### 5.8 Gamified Responsible Tourism Score & Circular SVG Ring
- **Feature Name**: Gamified Responsible Tourism Score Engine
- **User Action**: Pledges plastic-free travel, books solar homestays, offsets carbon, or completes game stages; observes real-time score counter and SVG progress ring animation.
- **Technical Implementation**:
  - HTML: `<div class="score-card">`, `<span id="score">`, `<svg class="score-ring">`, `<circle id="scoreRingFill">`
  - JS: `animateScore(targetScore)` and `updateResponsibleScore(delta, message)` in `js/app.js` (lines 1292–1342)
  - SVG Math: Dynamic stroke-dashoffset animation calculated from circumference ($2 \pi r \approx 408$).
  - Storage: Saved to `localStorage.getItem("bharatScore")`.
  - Rewards: Unlocks verified eco-pass badges and discount tokens at 90+ score.
  - File Locations: `html/home.html`, `html/responsible.html`, `css/style.css`, `js/app.js`

---

```
================================================================================
PAGE 2: DESTINATION & DECONGESTION DIRECTORY (html/explore.html)
================================================================================
```

### 5.9 Curated Sustainable Circuits Explorer
- **Feature Name**: High-Altitude Sustainable Circuits Directory
- **User Action**: Browses 12 verified circuits, examines altitude tags, difficulty levels, seasonal advisories, and community benefit rates.
- **Technical Implementation**:
  - HTML: `<div class="destination-grid" id="destinationGrid">`
  - JS: `renderDestinations()` in `js/app.js`
  - Data Structure: Array of destination objects in `js/app.js` (lines 8–510) containing `altitude`, `ecoBadges`, `communityBenefit`, `isOffbeat`, `difficulty`.
  - File Locations: `html/explore.html`, `css/style.css`, `js/app.js`

### 5.10 Destination Detail Modal & Trip Plan Handoff
- **Feature Name**: Comprehensive Destination Dossier Modal
- **User Action**: Clicks "Explore" on any destination card; views full dossier, altitude cautions, eco-protocols, and clicks "Plan Itinerary for this Location".
- **Technical Implementation**:
  - HTML: `<div class="modal" id="destModal">`, `<div class="modal-body" id="modalBody">`
  - JS: `showDestination(id)` in `js/app.js` (lines 1184–1190)
  - Action Handoff: Pre-configures planner parameters and opens planner view.
  - File Locations: `html/explore.html`, `css/style.css`, `js/app.js`

---

```
================================================================================
PAGE 3: 3D REGIONAL HERITAGE PORTALS (html/circuits.html)
================================================================================
```

### 5.11 Pan-India Regional Circuit Filter Pills
- **Feature Name**: Pan-India Regional Circuit Filter System
- **User Action**: Toggles region pills: "All India (20)", "North & Himalayas", "North East", "West & Central", "South & Islands".
- **Technical Implementation**:
  - HTML: `<div class="circuit-filter-bar">`, `<button class="circuit-pill" data-region="...">`
  - JS: Click listener in `js/app.js` (lines 1460–1466) invokes `renderCircuits(region)`.
  - File Locations: `html/circuits.html`, `css/style.css`, `js/app.js`

### 5.12 3D Perspective Heritage Corridors
- **Feature Name**: Mouse-Tracking 3D Heritage Corridor Cards
- **User Action**: Moves cursor over 20 pan-India corridor cards (e.g., Zanskar Gorge, Spiti Valley, Kaziranga, Hampi, Konkan Coast).
- **Technical Implementation**:
  - HTML: `<div class="circuit-grid" id="circuitGrid">`
  - JS: `addCard3D()` applies dynamic rotation (`rotateX`, `rotateY`) and adds highlight glare.
  - File Locations: `html/circuits.html`, `css/style.css`, `js/app.js`

---

```
================================================================================
PAGE 4: INTERACTIVE STATE MAP & SPATIAL ENGINE (html/map.html)
================================================================================
```

### 5.13 Full-Canvas Leaflet GIS Mapping
- **Feature Name**: Full-Canvas GIS Map with Custom CartoDB Voyager Tiles
- **User Action**: Interacts with full-screen interactive map of India; toggles zoom, drags canvas, inspects states.
- **Technical Implementation**:
  - HTML: `<div id="map" class="full-page-map">`
  - JS: `initMap()` in `js/map.js` (lines 1356–1420)
  - Tile Engine: CartoDB Voyager tiles with dynamic API key parameter injection.
  - GeoJSON Layer: Loads Indian state boundaries with interactive hover outlines and state click zoom.
  - File Locations: `html/map.html`, `css/map.css`, `js/map.js`

### 5.14 44-Hotspot Telemetry Nodes & Category Filtering
- **Feature Name**: 44 Curated Pan-India Telemetry Nodes
- **User Action**: Filters map markers by: "🏔️ High Passes & Peaks (11)", "🏛️ Heritage & Culture (13)", "🌿 Wildlife & Biospheres (12)", "🏖️ Coastal & Islands (8)".
- **Technical Implementation**:
  - HTML: `<div class="map-filter-bar">`, `<button class="map-filter-pill" data-map-filter="...">`
  - JS: `filterMapHotspots(category)` in `js/map.js` (lines 1450–1485)
  - Markers: Custom Leaflet `L.divIcon` with pulsing CSS animations (`.hotspot-pin`, `.pulse-ring`).
  - File Locations: `html/map.html`, `css/map.css`, `js/map.js`

### 5.15 Optimal Collision-Aware Tooltip Placement
- **Feature Name**: Collision-Aware Dynamic Tooltip Placement Engine
- **User Action**: Hovers or clicks markers near screen borders; card automatically flips direction without being clipped by the viewport.
- **Technical Implementation**:
  - JS Function: `calculateOptimalPlacement(marker, hotspot)` and `ensureCardFullyInView(tooltipEl)` in `js/map.js` (lines 1240–1312)
  - Algorithm: Evaluates pixel clearances across Top, Bottom, Left, and Right bounds. Automatically applies smooth pan offset (`leafletMap.panBy()`) if card exceeds boundaries.
  - Mutual Exclusion: Enforces single-active tooltip rule (`closeActiveTooltip()`).
  - File Locations: `html/map.html`, `css/map.css`, `js/map.js`

### 5.16 Slide-Out Regional Inspector Panel
- **Feature Name**: Slide-Out Regional Inspector Panel
- **User Action**: Clicks any hotspot; side panel opens with detailed cultural heritage, zero-mile foods, season, altitude, and action buttons.
- **Technical Implementation**:
  - HTML: `<aside class="map-panel" id="mapPanel">`
  - JS: `renderHotspotInPanel(hotspot)` in `js/map.js` (lines 1200–1235)
  - Actions: "Plan Itinerary with Bharat AI" pre-fills planner; "♥ Save to Journey" bookmarks node.
  - File Locations: `html/map.html`, `css/map.css`, `js/map.js`

---

```
================================================================================
PAGE 5: SMART SAFETY-AUDITED ITINERARY PLANNER (html/planner.html)
================================================================================
```

### 5.17 Multi-Parameter Expedition Customization Form
- **Feature Name**: Expedition Customization Form Console
- **User Action**: Fills out 5 expedition parameters: Destination/State, Expedition Duration (1–15 Days), Budget Tier (Budget, Moderate, Luxury), Travel Persona (Eco, Trekker, Culture, Adventurer, Family), and Special Interest Focus.
- **Technical Implementation**:
  - HTML: `<form id="plannerForm" class="planner-form">`
  - Inputs: `#planDest`, `#planDays`, `#planBudget`, `#planStyle`, `#planInterest`
  - Validation: Enforces day limits, cleans text inputs, sanitizes queries.
  - File Locations: `html/planner.html`, `css/ai.css`, `js/ai.js`

### 5.18 Automated Himalayan Pass Telemetry & AMS Acclimatization Safety Audit
- **Feature Name**: Pass Telemetry & Altitude Hypoxia Safety Audit Engine
- **User Action**: Clicks "Generate Safety-Audited Itinerary →"; observes safety analysis badges and timeline.
- **Technical Implementation**:
  - JS Function: `itinerary(e)` in `js/ai.js` (lines 478–690)
  - Safety Audit Algorithm:
    1. **Altitude Analysis**: Compares destination altitude against the 11,500 ft AMS threshold.
    2. **Mandatory 48-Hour Rest**: If altitude exceeds 11,500 ft (e.g. Ladakh, Spiti), automatically enforces Days 1 & 2 for physical rest and SpO2 monitoring in Leh/Jispa before permitting ascent.
    3. **Mountain Pass Audit**: Interrogates live telemetry for passes on the route (Khardung La, Chang La, Zoji La). Flags closures, snow chain mandates, or caution warnings.
  - File Locations: `html/planner.html`, `css/ai.css`, `js/ai.js`

### 5.19 Interactive Day-by-Day Expedition Timeline
- **Feature Name**: Interactive Day-by-Day Expedition Timeline
- **User Action**: Inspects daily itineraries, route telemetry tags, altitude profiles, and local guide notes.
- **Technical Implementation**:
  - HTML: `<div class="timeline" id="itineraryTimeline">`, `<div class="timeline-item">`
  - Dynamic Rendering: Builds step nodes with day badges, pass telemetry chips (`PASS: OPEN` / `PASS: CAUTION`), and community benefit advisories.
  - Trilingual Support: Renders day schedules natively in English, Hindi, or Bengali based on active locale.
  - File Locations: `html/planner.html`, `css/ai.css`, `js/ai.js`

### 5.20 Instant Vector PDF Expedition Export
- **Feature Name**: 1-Click Vector PDF Expedition Pass Exporter
- **User Action**: Clicks "📥 Download Official Field Pass & Safety Guide (PDF)" button below generated itinerary.
- **Technical Implementation**:
  - HTML: `<button class="auth-btn-primary download-pass-btn">`
  - JS: `downloadOfflineFieldPassPDF()` in `js/field_pass.js`
  - Output: Generates official high-resolution vector PDF combining itinerary, traveler identity, high-pass status, and medical directory.
  - File Locations: `html/planner.html`, `js/field_pass.js`

---

```
================================================================================
PAGE 6: BHARAT AI SPECIALIST CONSOLE (html/ai.html)
================================================================================
```

### 5.21 Gemini-Powered Streaming Chatbot
- **Feature Name**: Bharat AI Conversational Assistant
- **User Action**: Types travel questions in chat input, presses enter, or clicks suggestion buttons.
- **Technical Implementation**:
  - HTML: `<div class="chat-messages" id="messages">`, `<form id="chatForm">`, `<input id="chatInput">`
  - JS: `askAI(q)` in `js/ai.js` (lines 267–470)
  - Backend API: `POST /api/chat` passing `{ message: q, history: chatHistory, lang: targetLang }` to Google Gemini 3.1 Flash Lite.
  - Streaming Support: Reads streaming chunks via `ReadableStreamDefaultReader` or processes complete responses.
  - File Locations: `html/ai.html`, `css/ai.css`, `js/ai.js`, `backend/server.py`

### 5.22 Destination & Subtopic Natural Language Classifier
- **Feature Name**: Conversational Intent & Entity Classifier
- **User Action**: Mentions destinations (Kolkata, Jaipur, Kerala, Ladakh, Goa, Varanasi) or topics (food, packing, budget, safety, passes, AMS, permits, decongestion) in English, Hindi, or Bengali.
- **Technical Implementation**:
  - JS Functions: `detectDestination(text)` and `detectSubtopic(text)` in `js/ai.js` (lines 28–50)
  - Multilingual Regex/Keyword Matching: Matches terms like `কলকাতা`, `कोलकाता`, `बिरयानी`, `ams`, `khardung la`.
  - File Locations: `html/ai.html`, `js/ai.js`

### 5.23 Enhanced Markdown Renderer & Syntax Formatter
- **Feature Name**: Client-Side Markdown Rich Text Formatter
- **User Action**: Views formatted AI responses with bold highlights, subheadings, lists, and spacing.
- **Technical Implementation**:
  - JS Function: `renderMarkdown(text)` in `js/ai.js` (lines 56–84)
  - Transforms: Converts `###`, `##`, `**bold**`, `*italic*`, bullet characters (`•`, `-`, `*`), and linebreaks into clean HTML DOM nodes with custom styling.
  - File Locations: `html/ai.html`, `css/ai.css`, `js/ai.js`

### 5.24 Offline Heuristic Fallback Knowledge Engine
- **Feature Name**: Structured Multilingual Heuristic Fallback Engine
- **User Action**: Uses Bharat AI while offline or without a backend server running.
- **Technical Implementation**:
  - JS: `DESTINATION_FALLBACKS` dataset in `js/ai.js` (lines 89–234)
  - Content: Rich, verified dossiers covering Kolkata heritage, Jaipur highlights, Kerala backwaters, and Himalayan AMS protocols across English, Hindi, and Bengali.
  - File Locations: `html/ai.html`, `js/ai.js`

### 5.25 Contextual Quick Suggestion Buttons
- **Feature Name**: 1-Click Contextual Suggestion Pills
- **User Action**: Clicks pills: "Kolkata Heritage", "Jaipur Highlights", "48-Hr Acclimatization", "Khardung La Status", "Leave-No-Trace Code".
- **Technical Implementation**:
  - HTML: `<div class="ai-suggestions">`, `<button data-question="...">`
  - JS: Triggers `askAI(button.dataset.question)` immediately.
  - File Locations: `html/ai.html`, `css/ai.css`, `js/ai.js`

---

```
================================================================================
PAGE 7: RESPONSIBLE TRAVEL & LEAVE-NO-TRACE CODE (html/responsible.html)
================================================================================
```

### 5.26 7 Himalayan Leave-No-Trace Principles
- **Feature Name**: 7 Himalayan Ethical Travel Principles
- **User Action**: Reads interactive principles covering zero-single-use plastics, water stream sanctity, sacred stone etiquette, homestay energy conservation, and wildlife buffer zones.
- **Technical Implementation**:
  - HTML: `<section class="section">`, `<div class="responsible-principles-grid">`
  - CSS: `css/style.css`
  - Visual Badges: Custom icons, advisory protocols, and legal penalty warnings.
  - File Locations: `html/responsible.html`, `css/style.css`

### 5.27 Interactive Plastic-Free Travel Pledge
- **Feature Name**: Interactive Plastic-Free Traveler Covenant
- **User Action**: Clicks "Pledge Plastic-Free Travel" button (`#pledgePassBtn`); receives immediate +10 points to Responsible Score.
- **Technical Implementation**:
  - HTML: `<button class="btn primary" id="pledgePassBtn">`
  - JS: `pledgeEcoPass()` and `togglePlasticFree(btn)` in `js/app.js` (lines 1360–1375)
  - State: Sets `localStorage.setItem("bharatPlasticPledged", "true")` and triggers celebratory toast notification.
  - File Locations: `html/responsible.html`, `css/style.css`, `js/app.js`

### 5.28 Verified Solar Homestays & Community Guild Directory
- **Feature Name**: Community Solar Homestay & Co-Op Directory
- **User Action**: Inspects verified rural homestays in Sham Valley, Turtuk, and Hanle, observing passive solar heating and organic farm-to-table guarantees.
- **Technical Implementation**:
  - HTML: `<div class="homestay-cards-grid">`
  - Badges: "100% Solar Heated", "Zero Single-Use Plastics", "85%+ Direct Co-op Margin".
  - File Locations: `html/responsible.html`, `css/style.css`

---

```
================================================================================
PAGE 8: SACRED LIVING TRADITIONS & CULTURE (html/culture.html)
================================================================================
```

### 5.29 Deep Cultural Archives & Living Traditions Chronicles
- **Feature Name**: Sacred Geometry & Monastic Philosophy Deep Archives
- **User Action**: Explores four primary pillars:
  1. *Lung-ta (Wind Horse Prayer Flags)*: Cosmic 5-color symbolism (Sky, Air, Fire, Water, Earth).
  2. *Sacred Cham Masked Dances*: Monastic victory of compassion over ignorance.
  3. *Mud-Brick Passive Solar Architecture*: Ancient thermal mass construction for -25°C winters.
  4. *Changpa Pashmina Nomads*: Pastoral life on the 15,000 ft Changthang plateau.
- **Technical Implementation**:
  - HTML: `<section class="culture" id="culture">`, `<div class="culture-deepdive-grid">`
  - Action Handoff: Button `#cultureBtn` triggers `askAI("Tell me about Buddhist culture...")` and navigates to AI assistant.
  - File Locations: `html/culture.html`, `css/style.css`, `js/app.js`

---

```
================================================================================
PAGE 9: HIGH-ALTITUDE & ZERO-MILE FOOD (html/food.html)
================================================================================
```

### 5.30 Curated High-Altitude Cuisine Showcase
- **Feature Name**: Indigenous Himalayan Superfoods Directory
- **User Action**: Browses 6 traditional dishes (Tsampa Porridge, Skyu Root Stew, Seabuckthorn Elixir, Gur Gur Butter Tea, Chhurpi Yak Cheese, Thukpa).
- **Technical Implementation**:
  - HTML: `<div class="food-grid" id="foodGrid">`
  - JS: `renderFood()` in `js/app.js` (lines 1087–1120)
  - Data Structure: Array `foods` in `js/app.js` (lines 626–720) with nutritional metrics, ingredients, and community cooperative links.
  - File Locations: `html/food.html`, `css/style.css`, `js/app.js`

### 5.31 Local Economy Direct-Link Banner
- **Feature Name**: Farm-to-Table & Zero Food Miles Direct-Link
- **User Action**: Clicks "Support Local Kitchen" button on any recipe card; receives responsible score boost and adds producer stop to saved journey.
- **Technical Implementation**:
  - HTML: `<div class="economy-direct-banner">`, `<button onclick="supportLocalFood(...)">`
  - JS: `supportLocalFood(event, foodName)` in `js/app.js` (lines 1082–1086)
  - Feedback: Triggers toast: `"Support logged for indigenous food! (+5 pts)"`.
  - File Locations: `html/food.html`, `css/style.css`, `js/app.js`

---

```
================================================================================
PAGE 10: TRAVELER SIGN IN CONSOLE (html/login.html)
================================================================================
```

### 5.32 Split-Screen Authentication Console
- **Feature Name**: Split-Screen Traveler Sign-In Interface
- **User Action**: Enters email and password, toggles session persistence checkbox, submits login.
- **Technical Implementation**:
  - HTML: `<main class="login-split-container">`, `<form id="standaloneLoginForm">`
  - Inputs: `#loginEmail`, `#loginPassword`, `#rememberSession`
  - CSS: `css/auth.css`
  - Guard: `AuthService.guardPage("guest-only")` redirects already logged-in users.
  - File Locations: `html/login.html`, `css/auth.css`, `js/auth.js`

### 5.33 1-Click SIH Hackathon Demo Auto-Fill
- **Feature Name**: 1-Click Hackathon Presentation Auto-Fill
- **User Action**: Clicks "1-Click Fill" button (`#btnQuickDemoFill`).
- **Technical Implementation**:
  - HTML: `<button type="button" id="btnQuickDemoFill">`
  - JS: Event listener in `js/auth.js` automatically populates:
    - Email: `demo@bharatexplore.org`
    - Password: `Himalaya@2026`
  - File Locations: `html/login.html`, `js/auth.js`

### 5.34 Interactive Password Visibility Toggle
- **Feature Name**: Password Masking & Visibility Toggle
- **User Action**: Clicks the eye icon (`#togglePasswordBtn`) inside the password field.
- **Technical Implementation**:
  - HTML: `<button type="button" class="toggle-password-btn" id="togglePasswordBtn">👁️</button>`
  - JS: Switches `input.type` between `"password"` and `"text"`.
  - File Locations: `html/login.html`, `css/auth.css`, `js/auth.js`

---

```
================================================================================
PAGE 11: STEPPER REGISTRATION WIZARD (html/register.html)
================================================================================
```

### 5.35 Two-Stage Animated Stepper Wizard
- **Feature Name**: Multi-Step Onboarding Stepper Wizard
- **User Action**: Moves between Step 1 (Credentials) and Step 2 (Travel Persona) with next/back buttons. Progress track animates smoothly.
- **Technical Implementation**:
  - HTML: `<div class="stepper-container">`, `<div class="step-node active" data-step="1">`, `<div class="step-node" data-step="2">`
  - JS: `setRegisterStep(stepNum)` in `js/auth.js`
  - Validation: Validates Step 1 required fields (Full Name, Email, Password $\ge$ 6 characters) before enabling progression to Step 2.
  - File Locations: `html/register.html`, `css/auth.css`, `js/auth.js`

### 5.36 Interactive Travel Persona Selector
- **Feature Name**: Interactive Travel Persona Selector
- **User Action**: Clicks one of 5 visual persona cards:
  1. 🌿 **Eco-Explorer** (Default): Zero single-use plastics, solar homestays.
  2. 🏔️ **High-Altitude Trekker**: High passes, alpine lakes, AMS pacing.
  3. 🏛️ **Cultural Pilgrim**: Ancient monasteries, sacred corridors, crafts.
  4. 🏍️ **Overland Adventurer**: Remote expedition routes, rugged terrain.
  5. 👨‍👩‍👧 **Family Leisure**: Gentle pacing, heritage gardens, comfortable stays.
- **Technical Implementation**:
  - HTML: `<div class="persona-cards-grid">`, `<div class="persona-card selected" data-style="...">`
  - JS: Click listener in `js/auth.js` updates hidden input `#selectedTravelStyle`.
  - Integration: Sets user's default exploration ethos across planner and AI recommendations.
  - File Locations: `html/register.html`, `css/auth.css`, `js/auth.js`

---

```
================================================================================
PAGE 12: TRAVELER DOSSIER & DASHBOARD (html/profile.html)
================================================================================
```

### 5.37 Verified Traveler Dossier Hero Banner
- **Feature Name**: Verified Traveler Dossier & Altitude Safety Profile
- **User Action**: Inspects personal avatar, verified traveler badge, registered travel style chip, home city, and AMS safety status.
- **Technical Implementation**:
  - HTML: `<section class="profile-dossier-hero">`, `<div id="dashUserAvatar">`, `<span id="dashUserName">`
  - JS: Populated from `AuthService.getUser()` in `js/auth.js`.
  - Guard: Protected by `AuthService.guardPage("auth-required")`.
  - File Locations: `html/profile.html`, `css/auth.css`, `js/auth.js`

### 5.38 4-Tab Console Navigation
- **Feature Name**: 4-Tab Dashboard Console
- **User Action**: Switches between tabs: "♥ Saved Circuits", "🧭 Custom Expeditions", "🛡️ High-Altitude Safety Card", "⚙️ Account & Security".
- **Technical Implementation**:
  - HTML: `<nav class="dashboard-tabs-bar">`, `<button class="dash-tab-btn" data-tab="...">`
  - JS: Tab switching logic in `js/auth.js` toggles `.active` classes across buttons and `.dash-tab-pane` sections.
  - File Locations: `html/profile.html`, `css/auth.css`, `js/auth.js`

### 5.39 Cloud-Synchronized Saved Circuits (Tab 1)
- **Feature Name**: Cloud-Synchronized Saved Circuits Grid
- **User Action**: Views bookmarked destinations; clicks to view details or remove; displays rich empty state if empty.
- **Technical Implementation**:
  - HTML: `<section class="dash-tab-pane" id="tabPane-saved">`, `<div id="savedCircuitsGrid">`
  - JS: `renderProfileSavedCircuits()` in `js/auth.js` fetches saved destinations from `/api/user/saved` and merges with local cache.
  - File Locations: `html/profile.html`, `css/auth.css`, `js/auth.js`

### 5.40 Custom Expedition Builder & Multi-Day Manager (Tab 2)
- **Feature Name**: Custom Multi-Day Expedition Manager
- **User Action**: Fills out title, duration, style, and special safety notes to create a new custom trip. Views active itineraries with delete option.
- **Technical Implementation**:
  - HTML: `<form id="dashCreateTripForm">`, `<div id="userTripsList">`
  - API Integration: `POST /api/user/trips` and `GET /api/user/trips`
  - Schema: `{ title, duration_days, travel_style, notes }`
  - File Locations: `html/profile.html`, `css/auth.css`, `js/auth.js`

### 5.41 Registered Emergency Safety & AMS Medical Dossier (Tab 3)
- **Feature Name**: High-Altitude Emergency Safety Card & Pass Downloader
- **User Action**: Inspects registered emergency contact, medical altitude allergies, Diamox protocols, and triggers official PDF safety guide download.
- **Technical Implementation**:
  - HTML: `<section class="dash-tab-pane" id="tabPane-safety">`, `<span id="dashEmergencyVal">`, `<span id="dashMedicalVal">`
  - Download Button: `#profileDownloadPassBtn` executes `downloadOfflineFieldPassPDF()`
  - File Locations: `html/profile.html`, `css/auth.css`, `js/auth.js`, `js/field_pass.js`

### 5.42 Account Profile & Password Management (Tab 4)
- **Feature Name**: Profile Info & Password Security Console
- **User Action**: Updates full name, mobile number, home city, preferred style, emergency contact, or changes account password.
- **Technical Implementation**:
  - HTML: `<form id="dashProfileEditForm">`, `<form id="dashPasswordForm">`
  - APIs: `PUT /api/auth/profile` and `POST /api/auth/change-password`
  - Alert Feedback: In-place alert notifications (`#dashProfileAlert`, `#dashPasswordAlert`).
  - File Locations: `html/profile.html`, `css/auth.css`, `js/auth.js`

---

```
================================================================================
PAGE 13: OFFLINE EMERGENCY TRAVEL PASS & FIELD KIT GENERATOR
================================================================================
```

### 5.43 Dual-Engine Vector PDF Pass Generator
- **Feature Name**: Dual-Engine Offline Field Pass & Safety Guidelines Generator
- **User Action**: Clicks download button from navbar, profile, planner, or footer. File downloads instantly (`Bharat_Explore_Field_Pass_BE-HIM-2026-XXXXXX.pdf`).
- **Technical Implementation**:
  - Primary Engine (Online): Calls `GET /api/passes/download-field-pass-pdf` to obtain ReportLab vector PDF from FastAPI backend.
  - Fallback Engine (100% Offline): If offline or backend unreachable, executes `generateClientSidePDF()` using `jspdf.umd.min.js`.
  - Content Rendered:
    - Institutional header and emblem
    - Unique cryptographic pass ID (`BE-HIM-2026-XXXXXX`)
    - Traveler identity, home city, emergency contact, medical notes
    - Mountain Passes Hazard Matrix (Khardung La, Chang La, Zoji La, Baralacha La, Rohtang, Tanglang La)
    - Hypoxia & AMS/HAPE/HACE emergency response protocols
    - 24/7 Hyperbaric Oxygen Rescue Directory (SNM Hospital Leh, Army Medical Units, Sonamarg)
    - Leave-No-Trace Ecological Covenant
  - File Locations: All HTML files, `js/field_pass.js`, `js/jspdf.umd.min.js`, `backend/field_pass_pdf.py`

---

```
================================================================================
PAGE 14: TEAM CODE BREAKERZ SHOWCASE (html/CodeBreakerz.html)
================================================================================
```

### 5.44 SIH 2026 Team Showcase & Project Architecture
- **Feature Name**: Team Code Breakerz Presentation Page
- **User Action**: Explores team roster, leadership roles, SIH 2026 problem statement details, project technology pillars, and architectural diagrams.
- **Technical Implementation**:
  - HTML: `html/CodeBreakerz.html` (899 lines)
  - Animation Stack: GSAP 3.12.5 & ScrollTrigger for kinetic typography and card entrance physics.
  - Ambient Visuals: Radial blur orbs (`.orb--a`, `.orb--b`, `.orb--c`, `.orb--d`) and fractal SVG noise grain overlay.
  - File Locations: `html/CodeBreakerz.html`

---

## 6. Backend REST API & Microservice Catalog

When running `backend/server.py` (`uvicorn backend.server:app --port 8000`), the platform provides 28 production-grade REST endpoints:

| Method | Endpoint Path | Auth Required | Description & Data Contract |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/config` | No | Returns public app configuration and environment flags |
| `GET` | `/api/health` | No | Health check returning status `"ok"` and active database provider |
| `POST` | `/api/auth/register` | No | Registers traveler account, returns JWT token, migrates guest session |
| `POST` | `/api/auth/login` | No | Authenticates traveler credentials and returns JWT bearer token |
| `GET` | `/api/auth/me` | Yes (Bearer) | Returns authenticated user profile and travel preferences |
| `PUT` | `/api/auth/profile` | Yes (Bearer) | Updates traveler profile, contact info, and medical notes |
| `POST` | `/api/auth/change-password` | Yes (Bearer) | Verifies current password and updates to new password |
| `GET` | `/api/user/saved` | Yes (Bearer) | Retrieves user's bookmarked destinations from Supabase database |
| `POST` | `/api/user/save` | Yes (Bearer) | Adds or removes a destination ID from user's bookmarks |
| `GET` | `/api/user/trips` | Yes (Bearer) | Fetches user's custom expedition itineraries |
| `POST` | `/api/user/trips` | Yes (Bearer) | Creates a new custom multi-day expedition plan |
| `DELETE`| `/api/user/trips/{id}` | Yes (Bearer) | Deletes a custom expedition by ID |
| `POST` | `/api/admin/seed-tables` | Yes (Admin) | Seeds Supabase tables with initial destinations and schema |
| `GET` | `/api/destinations` | No | Returns list of curated sustainable destinations with eco-metadata |
| `GET` | `/api/destinations/{id}` | No | Returns detailed dossier for a single destination |
| `GET` | `/api/passes` | No | Returns real-time telemetry for 6 monitored Himalayan passes |
| `GET` | `/api/passes/download-safety-guidelines-pdf` | No | Downloads ReportLab official PDF safety guidelines |
| `GET` | `/api/passes/download-field-pass-pdf` | Optional | Downloads official high-res vector field pass with traveler details |
| `POST` | `/api/journey/save` | Optional | Saves guest or user journey session with destination IDs |
| `GET` | `/api/journey/{session_id}` | No | Retrieves saved journey for a guest session |
| `POST` | `/api/chat` | No | AI chat streaming endpoint proxying Google Gemini 3.1 Flash Lite |
| `GET` | `/` or `/home` | No | Serves `html/home.html` |
| `GET` | `/explore` | No | Serves `html/explore.html` |
| `GET` | `/circuits` | No | Serves `html/circuits.html` |
| `GET` | `/map` | No | Serves `html/map.html` |
| `GET` | `/planner` | No | Serves `html/planner.html` |
| `GET` | `/ai` | No | Serves `html/ai.html` |
| `GET` | `/responsible`, `/culture`, etc. | No | Clean URL routing to respective HTML files |

---

## 7. Feature vs. File Traceability Matrix

| Functional Feature Area | Primary HTML Files | Stylesheet (CSS) | Client Logic (JS) | Backend Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| **Global Shell & Header** | All `.html` files | `css/style.css` | `js/app.js`, `js/auth.js` | `/api/auth/me` |
| **Trilingual i18n Engine** | All `.html` files | `css/style.css` | `js/i18n.js` | — |
| **Global Fuzzy Search** | All `.html` files | `css/style.css` | `js/app.js` | `/api/destinations` |
| **Saved Journey Drawer** | All `.html` files | `css/style.css` | `js/app.js`, `js/auth.js` | `/api/journey/save`, `/api/user/saved` |
| **Atmospheric Video Hero** | `html/home.html`, `html/index.html` | `css/style.css` | `js/app.js` | `/api/passes` |
| **Himalayan Decongestion**| `html/home.html`, `html/explore.html`| `css/style.css` | `js/app.js` | `/api/destinations` |
| **3D Portals & Tilt Engine** | `html/home.html`, `html/circuits.html`| `css/style.css` | `js/app.js` | — |
| **Leaflet GIS Map Engine**| `html/home.html`, `html/map.html` | `css/map.css` | `js/map.js` | `india_states.geojson` |
| **Itinerary Planner Engine**| `html/home.html`, `html/planner.html`| `css/ai.css` | `js/ai.js`, `js/field_pass.js` | `/api/passes`, `/api/planner` |
| **Bharat AI Chat Stream** | `html/home.html`, `html/ai.html` | `css/ai.css` | `js/ai.js` | `/api/chat` (Gemini Flash Lite) |
| **Himalayan Quest Game** | `html/home.html`, `html/index.html` | `css/style.css` | `js/game.js` | Web Audio API Synthesizer |
| **Responsible Eco-Score** | `html/home.html`, `html/responsible.html` | `css/style.css` | `js/app.js` | LocalStorage + User Session |
| **Living Traditions Archive**| `html/culture.html` | `css/style.css` | `js/app.js`, `js/ai.js` | — |
| **Zero-Mile Cuisine System**| `html/food.html` | `css/style.css` | `js/app.js` | `/api/destinations` |
| **Traveler Authentication** | `html/login.html`, `html/register.html` | `css/auth.css` | `js/auth.js` | `/api/auth/register`, `/api/auth/login` |
| **Traveler Dossier Dashboard**| `html/profile.html` | `css/auth.css` | `js/auth.js`, `js/field_pass.js` | `/api/auth/profile`, `/api/user/trips` |
| **Offline Vector Field Pass**| `html/profile.html`, `html/planner.html`, Modals | `css/auth.css`, `css/style.css` | `js/field_pass.js`, `js/jspdf.umd.min.js` | `/api/passes/download-field-pass-pdf` |
| **Team Showcase** | `html/CodeBreakerz.html` | Inline Styles | GSAP 3.12.5 + ScrollTrigger | — |

---

## 8. Summary of Technical Excellence & Hackathon Readiness

1. **Zero External CSS/JS Framework Overhead**: Built with pure, modern Vanilla JavaScript (ES6+), Vanilla CSS variables and glassmorphic filters, ensuring maximum performance, zero npm build step requirements, and instant load times.
2. **True Offline Resilience**: Implements an offline-first architecture with self-contained client datasets, local heuristic AI fallbacks, and client-side vector PDF generation (`jspdf.umd.min.js`), vital for high-altitude expeditions with zero cellular connectivity.
3. **Institutional Polish for SIH 2026**: Fully addresses the hackathon's mandate with real-time pass telemetry, automated AMS safety pacing, 80%+ local economy direct revenue prioritization, and decentralized tourism dispersal beyond crowded hotspots.
