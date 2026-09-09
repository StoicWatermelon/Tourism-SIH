# 🇮🇳 Bharat Explore — SIH Tourism Prototype

A premium, vanilla HTML/CSS/JavaScript prototype for Smart India Hackathon's India Tourism domain.

## Run
No build step or server is required.

1. Extract the ZIP.
2. Open `index.html` in Chrome/Edge.
3. Internet access is recommended because the prototype uses remote photography and Google Fonts.

## Structure
- `index.html` — semantic application shell and sections
- `css/style.css` — responsive visual system, animations and layout
- `js/app.js` — data models, rendering, search, map interaction, itinerary engine, AI prototype, localStorage
- `assets/` — reserved for local assets

## Included SIH differentiators
- Ladakh-first cinematic experience
- India exploration categories
- Interactive state discovery interface
- Dynamic destination cards
- Smart itinerary builder
- Bharat AI local response prototype
- Responsible Traveller Score
- Local/community experience storytelling
- Food discovery
- Culture & heritage
- Global search
- Emotion-based discovery
- My Journey using localStorage
- English/Hindi-ready translation architecture
- Responsive/mobile navigation
- Accessibility basics and reduced dependency footprint

## Future production architecture
Frontend → REST/API layer → Python Flask/FastAPI → MySQL/MongoDB → AI/LLM + weather/map/tourism APIs.

The JavaScript data arrays are intentionally separated from rendering logic so they can later be replaced by API responses.
