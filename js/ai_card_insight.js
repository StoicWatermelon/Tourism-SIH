/**
 * ═════════════════════════════════════════════════════════════════════
 *  BHARAT EXPLORE — UNIVERSAL AI CARD ASSISTANCE & INTERNET INTEL
 *  Provides grounded AI internet research popovers when users click
 *  cards and items across subpages (explore, circuits, food, culture, etc.)
 *  EXCLUDED on landing page (index.html / home.html) as requested.
 * ═════════════════════════════════════════════════════════════════════
 */

(function () {
  "use strict";

  // 1. Strict Landing Page Exclusion
  function isLandingPage() {
    const path = (window.location.pathname || "").toLowerCase();
    const page = path.split("/").pop() || "";
    return (
      page === "" ||
      page === "index.html" ||
      page === "home.html" ||
      page === "index" ||
      page === "home" ||
      page === "overview"
    );
  }

  // If on landing page, exit immediately without adding assistance
  if (isLandingPage()) {
    return;
  }

  // 2. Ensure Modal DOM Exists
  function ensureModalDOM() {
    if (document.getElementById("aiCardModalBackdrop")) return;

    const modalHTML = `
      <div id="aiCardModalBackdrop" class="ai-card-modal-backdrop" aria-hidden="true">
        <div class="ai-card-modal-window" role="dialog" aria-modal="true" aria-labelledby="aiCardTitle">
          <div class="ai-card-modal-header">
            <div class="ai-card-modal-eyebrow">
              <span class="ai-live-dot"></span>
              <span>Bharat AI • Live Travel Intelligence</span>
            </div>
            <button class="ai-card-modal-close" id="aiCardModalCloseBtn" aria-label="Close dialog" title="Close">✕</button>
          </div>
          
          <div class="ai-card-modal-hero" id="aiCardHero">
            <div class="ai-card-modal-hero-overlay"></div>
            <div class="ai-card-modal-hero-content">
              <h2 class="ai-card-modal-title" id="aiCardTitle"></h2>
              <div class="ai-card-modal-location" id="aiCardLoc"></div>
            </div>
          </div>
          
          <div class="ai-card-modal-body" id="aiCardBody"></div>
          
          <div class="ai-card-modal-footer" id="aiCardFooter"></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Bind close events
    const backdrop = document.getElementById("aiCardModalBackdrop");
    const closeBtn = document.getElementById("aiCardModalCloseBtn");

    if (closeBtn) {
      closeBtn.addEventListener("click", closeAICardInsight);
    }
    if (backdrop) {
      backdrop.addEventListener("click", function (e) {
        if (e.target === backdrop) {
          closeAICardInsight();
        }
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && backdrop && backdrop.classList.contains("open")) {
        closeAICardInsight();
      }
    });
  }

  function closeAICardInsight() {
    const backdrop = document.getElementById("aiCardModalBackdrop");
    if (backdrop) {
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  // 3. Open AI Card Insight with Live Internet Search
  window.openAICardInsight = async function (cardData) {
    if (!cardData || !cardData.title) return;
    ensureModalDOM();

    const backdrop = document.getElementById("aiCardModalBackdrop");
    const titleEl = document.getElementById("aiCardTitle");
    const locEl = document.getElementById("aiCardLoc");
    const heroEl = document.getElementById("aiCardHero");
    const bodyEl = document.getElementById("aiCardBody");
    const footerEl = document.getElementById("aiCardFooter");

    if (!backdrop || !titleEl || !bodyEl) return;

    // Populate initial header info
    const title = cardData.title.trim();
    const loc = cardData.location || cardData.state || "India";
    const cat = cardData.category || "Destination";
    const img = cardData.img || "";

    titleEl.textContent = title;
    locEl.innerHTML = `<span>📍 ${loc}</span> • <span style="color:#74c69d;">${cat}</span>`;

    if (img && heroEl) {
      heroEl.style.backgroundImage = `url('${img}')`;
    } else if (heroEl) {
      heroEl.style.backgroundImage = `radial-gradient(circle at 60% 40%, #1c4e38 0%, #0c231a 80%)`;
    }

    // Shimmer Loading State
    bodyEl.innerHTML = `
      <div class="ai-card-shimmer">
        <div class="ai-card-grounded-badge">
          <span>🔍</span> Grounding live internet travel intelligence for "${title}"...
        </div>
        <div class="shimmer-line" style="width: 82%;"></div>
        <div class="shimmer-line" style="width: 96%;"></div>
        <div class="shimmer-line" style="width: 88%;"></div>
        <div class="shimmer-line" style="width: 65%;"></div>
      </div>
    `;

    footerEl.innerHTML = "";

    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Fetch live AI intelligence from backend endpoint
    try {
      const params = new URLSearchParams({
        query: title,
        category: cat,
        location: loc,
        desc: cardData.desc || "",
        lang: (window.i18n && typeof window.i18n.getLanguage === "function") ? window.i18n.getLanguage() : "en"
      });

      const baseUrl = (window.location.protocol === "file:" || !window.location.port)
        ? "http://127.0.0.1:8000"
        : "";
      const res = await fetch(`${baseUrl}/api/ai/card-insight?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      renderModalContent(data, cardData);
    } catch (err) {
      console.warn("AI card insight fetch error, using local card details:", err);
      const isCB = Boolean(
        cardData?.isCodeBreakerz ||
        (cardData?.category && cardData.category.toLowerCase().includes("innovation")) ||
        (cardData?.location && (cardData.location.includes("Techno Main") || cardData.location.includes("Code Breakerz") || cardData.location.includes("TMSL"))) ||
        window.location.pathname.toLowerCase().includes("codebreakerz")
      );

      if (isCB) {
        renderModalContent({
          title: title,
          category: cat,
          location: "Techno Main Salt Lake (TMSL), Kolkata",
          summary: "Techno Main Salt Lake (TMSL), the premier flagship engineering and technology institution of Techno India Group located in Salt Lake City (Sector V), Kolkata, West Bengal. Affiliated with MAKAUT and approved by AICTE, TMSL is renowned for engineering excellence, computer science, and innovation, serving as the proud institutional home and incubation hub for Team Code Breakerz in Smart India Hackathon (SIH 2026).",
          source_title: "Wikipedia: Techno Main Salt Lake (TMSL)",
          source_url: "https://en.wikipedia.org/wiki/Techno_India_Group",
          best_season: "Smart India Hackathon 2026 Innovation Cycle • Active Lab",
          transit_hub: "Techno Main Salt Lake Campus, Sector V, Bidhannagar, Kolkata 700091 • Salt Lake Sector V Metro",
          eco_tip: "Engineered at Techno Main Salt Lake (TMSL) to champion carbon-neutral travel, sustainable village homestays, and decentralized tourism across India.",
          highlights: [
            "Premier engineering and research institution situated in Kolkata's major IT and innovation hub (Sector V, Salt Lake City).",
            "Flagship campus of Techno India Group, fostering advanced research in artificial intelligence, cloud architecture, and high-altitude telemetry systems.",
            "Proud alma mater and innovation home of Team Code Breakerz, engineering the Bharat Explore sustainable tourism platform for SIH 2026."
          ],
          ai_perspective: "Techno Main Salt Lake (TMSL) is the proud innovation campus behind Team Code Breakerz, engineering intelligent pan-India travel companion systems and real-time high-altitude telemetry for Bharat Explore.",
          is_innovation: true,
          hide_actions: true
        }, cardData);
      } else {
        // Fallback display if network error
        renderModalContent({
          title: title,
          category: cat,
          location: loc,
          summary: cardData.desc || "Verified cultural and destination profile on Bharat Explore.",
          source_title: "Bharat Explore Field Knowledge Base",
          source_url: "https://en.wikivoyage.org/wiki/India",
          best_season: cardData.season || "October through May",
          transit_hub: "Nearest domestic airport / railhead connections",
          eco_tip: "Preserve local cultural integrity and support zero-single-use-plastic practices.",
          highlights: [
            "Authentic regional experience rooted in local heritage and nature.",
            "Direct community benefits supporting indigenous artisan families.",
            "Verified safety and sustainable travel guidelines."
          ],
          suggested_prompt: `Plan a trip to ${title}`
        }, cardData);
      }
    }
  };

  // 4. Render Content inside Modal
  function renderModalContent(data, rawCard) {
    const bodyEl = document.getElementById("aiCardBody");
    const footerEl = document.getElementById("aiCardFooter");
    if (!bodyEl || !footerEl) return;

    // AI Perspective Box (if returned)
    const perspectiveHtml = data.ai_perspective ? `
      <div class="ai-card-perspective-box">
        "${data.ai_perspective}"
      </div>
    ` : "";

    // Verified Source Citation Badge
    const sourceHtml = `
      <div class="ai-card-grounded-badge">
        <span>🌐</span> Grounded via <b>${data.source_title || "Wikivoyage"}</b> • 
        <a href="${data.source_url || '#'}" target="_blank" rel="noopener noreferrer">Source Guide ↗</a>
      </div>
    `;

    // Summary Text
    const summaryHtml = `
      <p class="ai-card-summary-text">${data.summary || rawCard.desc || ""}</p>
    `;

    // Fact Grid (Best Season & Transit Hub)
    const factGridHtml = `
      <div class="ai-card-fact-grid">
        <div class="ai-card-fact-item">
          <span class="fact-label">🗓️ Best Time / Readiness</span>
          <span class="fact-value">${data.best_season || "Year-round (Seasonal trails)"}</span>
        </div>
        <div class="ai-card-fact-item">
          <span class="fact-label">🚆 Gateway Hub & Transit</span>
          <span class="fact-value">${data.transit_hub || "Domestic airport / Express railhead"}</span>
        </div>
      </div>
    `;

    // Highlights List
    let highlightsHtml = "";
    if (data.highlights && data.highlights.length) {
      highlightsHtml = `
        <div>
          <span class="fact-label" style="margin-bottom:8px;">✦ Key Highlights &amp; Insights</span>
          <ul class="ai-card-highlights">
            ${data.highlights.map(h => `<li>${h}</li>`).join("")}
          </ul>
        </div>
      `;
    }

    // Eco Etiquette Advisory
    const ecoHtml = data.eco_tip ? `
      <div class="ai-card-eco-box">
        <span class="eco-icon">🌱</span>
        <p><b>Responsible Travel Tip:</b> ${data.eco_tip}</p>
      </div>
    ` : "";

    bodyEl.innerHTML = `
      ${sourceHtml}
      ${perspectiveHtml}
      ${summaryHtml}
      ${factGridHtml}
      ${highlightsHtml}
      ${ecoHtml}
    `;

    // Action Buttons: Hide buttons ONLY on CodeBreakerz cards, keeping all other cards unchanged
    const isCodeBreakerz = Boolean(
      data.is_innovation ||
      data.hide_actions ||
      rawCard?.isCodeBreakerz ||
      (data.category && data.category.toLowerCase().includes("innovation")) ||
      (rawCard?.category && rawCard.category.toLowerCase().includes("innovation")) ||
      (data.location && (data.location.includes("Techno Main") || data.location.includes("Code Breakerz") || data.location.includes("TMSL"))) ||
      (rawCard?.location && (rawCard.location.includes("Techno Main") || rawCard.location.includes("Code Breakerz") || rawCard.location.includes("TMSL"))) ||
      window.location.pathname.toLowerCase().includes("codebreakerz")
    );

    if (isCodeBreakerz) {
      footerEl.innerHTML = "";
      footerEl.style.display = "none";
    } else {
      footerEl.style.display = "";
      const plannerQuery = encodeURIComponent(data.suggested_prompt || `Plan a trip to ${data.title}`);
      const aiChatQuery = encodeURIComponent(`Tell me about ${data.title} and recommended travel tips`);

      footerEl.innerHTML = `
        <a href="planner.html?q=${plannerQuery}" class="ai-card-action-plan">
          <span>⚡</span> Plan Trip with Bharat AI
        </a>
        <a href="ai.html?q=${aiChatQuery}" class="ai-card-action-chat">
          <span>💬</span> Ask AI More
        </a>
        <button class="ai-card-action-save" id="aiCardSaveBtn">
          ♥ Bookmark
        </button>
      `;

      const saveBtn = document.getElementById("aiCardSaveBtn");
      if (saveBtn) {
        saveBtn.addEventListener("click", function () {
          if (typeof window.saveDestination === "function" && rawCard && rawCard.id) {
            window.saveDestination(rawCard.id);
          } else {
            let saved = JSON.parse(localStorage.getItem("bharatSaved") || "[]");
            const itemKey = data.title;
            if (!saved.includes(itemKey)) {
              saved.push(itemKey);
              localStorage.setItem("bharatSaved", JSON.stringify(saved));
              if (typeof window.toast === "function") window.toast(`Saved "${data.title}" to My Journey ♥`);
            } else {
              if (typeof window.toast === "function") window.toast(`"${data.title}" is already bookmarked ♥`);
            }
          }
          saveBtn.textContent = "✓ Saved";
          saveBtn.style.color = "#74c69d";
        });
      }
    }
  }

  // 5. Automatic Card Badge Injection & Delegated Click Handler
  function decorateCards() {
    const cardSelectors = [
      ".destination",
      ".circuit-card",
      ".food",
      ".culture-card",
      ".experience-grid article",
      ".feature-band article",
      ".result-card",
      ".saved-dest-card",
      ".field-kit-card",
      ".safety-dossier-card",
      ".field-pass-profile-card",
      ".planner-hotel-card",
      ".planner-flight-card",
      ".planner-day-card",
      ".itinerary-card",
      ".planner-emergency-card",
      ".planner-budget-card",
      ".card__frame"
    ];

    document.querySelectorAll(cardSelectors.join(",")).forEach(card => {
      // Avoid duplicate trigger badges
      if (!card.querySelector(".ai-card-trigger-pill")) {
        // Ensure relative positioning
        const pos = window.getComputedStyle(card).position;
        if (pos === "static") card.style.position = "relative";

        const badge = document.createElement("div");
        badge.className = "ai-card-trigger-pill";
        badge.innerHTML = `<span>✨</span> <span>AI Intel</span>`;
        card.appendChild(badge);
      }
    });

    // Culture interactive tags
    document.querySelectorAll(".culture-tags span").forEach(tag => {
      if (!tag.hasAttribute("data-ai-tagged")) {
        tag.setAttribute("data-ai-tagged", "true");
        tag.style.cursor = "pointer";
        tag.setAttribute("title", "Click for Bharat AI Live Internet Intel ✨");
      }
    });
  }

  // Delegated Click Interceptor
  document.addEventListener("click", function (e) {
    if (isLandingPage()) return;

    // Check if clicked inside modal
    if (e.target.closest(".ai-card-modal-window")) return;

    // 1. If clicked a specific functional action button, let that button handle its own event
    const button = e.target.closest("button, a");
    if (button) {
      if (
        button.hasAttribute("data-remove-id") ||
        button.hasAttribute("data-delete-trip") ||
        button.classList.contains("btn-remove-bookmark") ||
        button.classList.contains("btn-signout") ||
        button.classList.contains("download-pass-btn") ||
        (button.getAttribute("onclick") || "").includes("downloadOfflineFieldPassPDF") ||
        (button.getAttribute("onclick") || "").includes("saveDestination") ||
        (button.getAttribute("onclick") || "").includes("togglePlasticFree") ||
        (button.getAttribute("onclick") || "").includes("triggerEcoAction") ||
        (button.getAttribute("onclick") || "").includes("restartEcoGame") ||
        button.getAttribute("type") === "submit"
      ) {
        return; // Let native button action execute
      }

      const btnText = (button.textContent || "").toLowerCase();
      // If it's an "Explore", "Details", or AI button, open AI Card Insight
      if (
        btnText.includes("explore") ||
        btnText.includes("details") ||
        btnText.includes("ask ai") ||
        btnText.includes("intel") ||
        btnText.includes("ai ")
      ) {
        e.preventDefault();
        e.stopPropagation();
      } else if (button.getAttribute("href") && !button.getAttribute("href").startsWith("#") && !button.getAttribute("href").startsWith("javascript:")) {
        return; // Real navigation link
      }
    }

    // 2. Identify Card Clicked
    // A. Destination or Search Result Card
    const destCard = e.target.closest(".destination, .result-card");
    if (destCard) {
      const title = (destCard.querySelector("h3, h4")?.textContent || "").trim();
      if (title) {
        const loc = (destCard.querySelector(".eyebrow, .mini")?.textContent || "").trim();
        const desc = (destCard.querySelector(".dest-desc, p")?.textContent || "").trim();
        const bg = destCard.style.backgroundImage || "";
        const img = bg.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
        window.openAICardInsight({
          title,
          location: loc,
          desc,
          img,
          category: "Destination"
        });
        return;
      }
    }

    // B. Circuit Card
    const circuitCard = e.target.closest(".circuit-card");
    if (circuitCard) {
      const title = (circuitCard.querySelector("h3")?.textContent || "").trim();
      const tag = (circuitCard.querySelector(".circuit-tag")?.textContent || "").trim();
      const desc = (circuitCard.querySelector("p")?.textContent || "").trim();
      const bg = circuitCard.style.backgroundImage || "";
      const img = bg.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
      window.openAICardInsight({
        title,
        location: tag,
        desc,
        img,
        category: "Heritage Circuit"
      });
      return;
    }

    // C. Food / Cuisine Card
    const foodCard = e.target.closest(".food");
    if (foodCard) {
      const title = (foodCard.querySelector("h3")?.textContent || "").trim();
      const origin = (foodCard.querySelector(".eyebrow")?.textContent || "").trim();
      const desc = (foodCard.querySelector("p")?.textContent || "").trim();
      const bg = foodCard.style.backgroundImage || "";
      const img = bg.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
      window.openAICardInsight({
        title,
        location: origin,
        desc,
        img,
        category: "Indigenous Cuisine"
      });
      return;
    }

    // D. Culture Card
    const cultureCard = e.target.closest(".culture-card");
    if (cultureCard) {
      const title = (cultureCard.querySelector("h3")?.textContent || "").trim();
      const badge = (cultureCard.querySelector(".card-badge")?.textContent || "").trim();
      const desc = (cultureCard.querySelector("p")?.textContent || "").trim();
      window.openAICardInsight({
        title,
        location: badge || "Himalayan Living Tradition",
        desc,
        category: "Culture & Living Tradition"
      });
      return;
    }

    // E. Experience / Feature Card
    const expCard = e.target.closest(".experience-grid article, .feature-band article");
    if (expCard) {
      const title = (expCard.querySelector("h3")?.textContent || "").trim();
      const badge = (expCard.querySelector(".exp-badge")?.textContent || "").trim();
      const desc = (expCard.querySelector("p")?.textContent || "").trim();
      const bg = expCard.style.backgroundImage || "";
      const img = bg.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
      window.openAICardInsight({
        title,
        location: badge || "Community Experience",
        desc,
        img,
        category: "Sustainable Experience"
      });
      return;
    }

    // F. Field Kit & Safety Cards
    const fieldKit = e.target.closest(".field-kit-card");
    if (fieldKit) {
      const title = (fieldKit.querySelector("h3")?.textContent || "").trim();
      const desc = (fieldKit.querySelector(".kit-list, p")?.textContent || "").trim();
      window.openAICardInsight({
        title: title,
        category: "Safety & Emergency Protocol",
        location: "Ladakh & High Passes",
        desc: desc
      });
      return;
    }

    // G. Profile Saved Card or Custom Expedition Card
    const savedCard = e.target.closest(".saved-dest-card");
    if (savedCard) {
      const title = (savedCard.querySelector("h3")?.textContent || "").trim();
      const meta = (savedCard.querySelector(".saved-dest-meta p, p")?.textContent || "").trim();
      const img = savedCard.querySelector("img")?.src || "";
      window.openAICardInsight({
        title: title,
        category: "Saved Destination",
        location: meta.replace(/^📍\s*/, ""),
        desc: meta,
        img: img
      });
      return;
    }

    // H. High-Altitude Safety Dossier & Field Pass Card
    const safetyCard = e.target.closest(".safety-dossier-card, .field-pass-profile-card");
    if (safetyCard) {
      const title = (safetyCard.querySelector("h3, h4")?.textContent || "High-Altitude Safety Dossier").trim();
      const desc = (safetyCard.querySelector("p")?.textContent || "").trim();
      window.openAICardInsight({
        title: title,
        category: "Safety & Emergency Protocol",
        location: "Himalayas",
        desc: desc
      });
      return;
    }

    // I. Culture Topic Tag Click
    const cultureTag = e.target.closest(".culture-tags span");
    if (cultureTag) {
      const title = (cultureTag.textContent || "").trim();
      if (title) {
        window.openAICardInsight({
          title: title,
          category: "Culture & Living Tradition",
          location: "Himalayas & India",
          desc: `Cultural living tradition and regional heritage: ${title}`
        });
        return;
      }
    }

    // J. Planner Output Cards (Hotel, Flight, Itinerary)
    const plannerCard = e.target.closest(".planner-hotel-card, .planner-flight-card, .planner-day-card, .itinerary-card, .planner-emergency-card, .planner-budget-card");
    if (plannerCard) {
      const title = (plannerCard.querySelector("h3, h4, .hotel-name, strong")?.textContent || "").trim();
      const desc = (plannerCard.querySelector("p, .desc, .details")?.textContent || "").trim();
      if (title) {
        window.openAICardInsight({
          title: title,
          category: "Traveler Itinerary Insight",
          location: "India",
          desc: desc
        });
        return;
      }
    }

    // K. CodeBreakerz Innovation & Team Showcase
    const teamCard = e.target.closest(".card__frame, .card__inner, .card");
    if (teamCard && !teamCard.closest(".modal-layer")) {
      const title = (teamCard.querySelector(".card__name, h3")?.textContent || "").trim();
      const role = (teamCard.querySelector(".card__role")?.textContent || "").trim();
      const desc = (teamCard.querySelector(".card__desc")?.textContent || "").trim();
      if (title) {
        window.openAICardInsight({
          title: role ? `${title} (${role})` : title,
          category: "SIH 2026 Innovation Team",
          location: "Techno Main Salt Lake (TMSL)",
          desc: desc || "Smart India Hackathon 2026 Bharat Explore Developer",
          isCodeBreakerz: true
        });
        return;
      }
    }
  });

  // 6. Hook into window load & mutations for dynamically rendered grids
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      ensureModalDOM();
      decorateCards();
    });
  } else {
    ensureModalDOM();
    decorateCards();
  }

  // Periodic card decorator for asynchronously rendered grids (destinations, circuits, foods, profile)
  let decorateInterval = setInterval(decorateCards, 1200);
  setTimeout(() => clearInterval(decorateInterval), 12000);

})();
