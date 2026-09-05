/**
 * Bharat Explore - Authentication, Routing & Traveler Profile Service
 * Built for Smart India Hackathon (SIH 2026)
 * Handles client authentication, auth guards, clean URL routing,
 * multi-step onboarding wizard, and traveler dossier operations.
 */

(function () {
  "use strict";

  const API_BASE = window.location.origin.includes("127.0.0.1") || window.location.origin.includes("localhost")
    ? ""
    : "http://127.0.0.1:8000";

  const TOKEN_KEY = "bharat_auth_token";
  const USER_KEY = "bharat_auth_user";

  const AuthService = {
    // --- Token & User State Management ---

    getToken() {
      return localStorage.getItem(TOKEN_KEY) || "";
    },

    getUser() {
      try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    isAuthenticated() {
      const token = this.getToken();
      return Boolean(token && token.length > 20);
    },

    setSession(token, user) {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent("bharat:auth-changed", { detail: { isAuthenticated: true, user } }));
    },

    clearSession() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new CustomEvent("bharat:auth-changed", { detail: { isAuthenticated: false, user: null } }));
    },

    getAuthHeaders() {
      const headers = { "Content-Type": "application/json" };
      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      return headers;
    },

    getRedirectUrl(defaultUrl = "/") {
      const params = new URLSearchParams(window.location.search);
      return params.get("redirect") || defaultUrl;
    },

    // --- Authentication Guards ---

    guardPage(pageType) {
      const authenticated = this.isAuthenticated();
      if (pageType === "guest-only" && authenticated) {
        // Already logged in, redirect away from login/register
        const dest = this.getRedirectUrl("/profile");
        window.location.href = dest;
        return false;
      }
      if (pageType === "auth-required" && !authenticated) {
        // Not logged in, redirect to login with return path
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        return false;
      }
      return true;
    },

    // --- API Calls ---

    async register(formData) {
      const guestSessionId = localStorage.getItem("bharatSessionId") || "";
      const payload = {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone || "",
        avatar: formData.avatar || "🏔️",
        travel_style: formData.travel_style || "Eco-Explorer",
        home_city: formData.home_city || "",
        emergency_contact: formData.emergency_contact || "",
        medical_notes: formData.medical_notes || "",
        guest_session_id: guestSessionId
      };

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Registration failed. Please check your details.");
      }

      this.setSession(data.token, data.user);
      return data;
    },

    async login(email, password) {
      const guestSessionId = localStorage.getItem("bharatSessionId") || "";
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          guest_session_id: guestSessionId
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Invalid email or password.");
      }

      this.setSession(data.token, data.user);
      return data;
    },

    logout(redirectUrl = "/login") {
      this.clearSession();
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },

    async getProfile() {
      if (!this.isAuthenticated()) return null;
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: this.getAuthHeaders()
      });
      if (res.status === 401) {
        this.clearSession();
        return null;
      }
      const data = await res.json();
      if (data && data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }
      return data;
    },

    async updateProfile(profileData) {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to update profile.");
      }
      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent("bharat:auth-changed", { detail: { isAuthenticated: true, user: data.user } }));
      }
      return data;
    },

    async changePassword(currentPassword, newPassword) {
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to change password.");
      }
      return data;
    },

    async getSavedDestinations() {
      if (!this.isAuthenticated()) return null;
      const res = await fetch(`${API_BASE}/api/user/saved`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    },

    async saveUserDestinations(destinationIds, notes = "", travelStyle = "") {
      if (!this.isAuthenticated()) return null;
      const res = await fetch(`${API_BASE}/api/user/save`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          destination_ids: destinationIds,
          notes,
          travel_style: travelStyle
        })
      });
      if (!res.ok) return null;
      return await res.json();
    },

    async removeSavedDestination(destId) {
      const saved = await this.getSavedDestinations();
      if (!saved) return;
      const remainingIds = (saved.destination_ids || []).filter(id => id !== destId);
      return await this.saveUserDestinations(remainingIds, saved.notes, saved.travel_style);
    },

    async getUserTrips() {
      if (!this.isAuthenticated()) return [];
      const res = await fetch(`${API_BASE}/api/user/trips`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.trips || [];
    },

    async createUserTrip(tripData) {
      const res = await fetch(`${API_BASE}/api/user/trips`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(tripData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to create trip.");
      }
      return data;
    },

    async deleteUserTrip(tripId) {
      const res = await fetch(`${API_BASE}/api/user/trips/${tripId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders()
      });
      if (!res.ok) {
        throw new Error("Failed to delete trip.");
      }
      return await res.json();
    }
  };

  // --- Page Controllers ---

  const PageControllers = {
    // 1. Standalone Login Page
    initLogin() {
      if (!AuthService.guardPage("guest-only")) return;

      const form = document.getElementById("standaloneLoginForm");
      const alertEl = document.getElementById("loginAlert");
      const quickFillBtn = document.getElementById("btnQuickDemoFill");
      const togglePwdBtn = document.getElementById("togglePasswordBtn");
      const pwdInput = document.getElementById("loginPassword");

      // Password visibility toggle
      if (togglePwdBtn && pwdInput) {
        togglePwdBtn.addEventListener("click", () => {
          const isPwd = pwdInput.type === "password";
          pwdInput.type = isPwd ? "text" : "password";
          togglePwdBtn.textContent = isPwd ? "🙈" : "👁️";
        });
      }

      // Quick test fill for SIH Hackathon presentations
      if (quickFillBtn) {
        quickFillBtn.addEventListener("click", () => {
          const emailInput = document.getElementById("loginEmail");
          if (emailInput) emailInput.value = "explorer.arya@example.com";
          if (pwdInput) pwdInput.value = "SecurePassword123!";
        });
      }

      if (form) {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const email = document.getElementById("loginEmail").value.trim();
          const password = pwdInput ? pwdInput.value : "";
          const submitBtn = form.querySelector("button[type='submit']");
          const originalBtnHtml = submitBtn.innerHTML;

          try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Authenticating...</span>`;
            this.clearAlert(alertEl);

            const res = await AuthService.login(email, password);
            this.showAlert(alertEl, `✓ Welcome back, ${res.user.fullName}! Redirecting...`, "success");

            setTimeout(() => {
              window.location.href = AuthService.getRedirectUrl("/profile");
            }, 600);
          } catch (err) {
            this.showAlert(alertEl, err.message || "Failed to sign in.", "error");
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }
        });
      }
    },

    // 2. Standalone Multi-Step Register Page
    initRegister() {
      if (!AuthService.guardPage("guest-only")) return;

      let currentStep = 1;
      const totalSteps = 3;
      const form = document.getElementById("stepperRegisterForm");
      const alertEl = document.getElementById("registerAlert");
      const trackProgress = document.getElementById("stepperTrackProgress");

      const updateStepperUI = (step) => {
        document.querySelectorAll(".reg-step-view").forEach(v => {
          v.classList.toggle("active", parseInt(v.dataset.step, 10) === step);
        });

        document.querySelectorAll(".step-node").forEach(node => {
          const nodeStep = parseInt(node.dataset.step, 10);
          node.classList.toggle("active", nodeStep === step);
          node.classList.toggle("completed", nodeStep < step);
        });

        if (trackProgress) {
          const pct = ((step - 1) / (totalSteps - 1)) * 100;
          trackProgress.style.width = `${pct}%`;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      // Persona cards selection (Step 2)
      const personaCards = document.querySelectorAll(".persona-card");
      const hiddenStyleInput = document.getElementById("selectedTravelStyle");
      personaCards.forEach(card => {
        card.addEventListener("click", () => {
          personaCards.forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          if (hiddenStyleInput) {
            hiddenStyleInput.value = card.dataset.style;
          }
        });
      });

      // Next / Back buttons
      document.querySelectorAll("[data-action='next-step']").forEach(btn => {
        btn.addEventListener("click", () => {
          // Validate current step
          if (currentStep === 1) {
            const name = document.getElementById("regFullName").value.trim();
            const email = document.getElementById("regEmail").value.trim();
            const pwd = document.getElementById("regPassword").value;

            if (!name) {
              this.showAlert(alertEl, "Please enter your full name.", "error");
              return;
            }
            if (!email || !email.includes("@") || !email.includes(".")) {
              this.showAlert(alertEl, "Please enter a valid email address.", "error");
              return;
            }
            if (!pwd || pwd.length < 6) {
              this.showAlert(alertEl, "Password must be at least 6 characters long.", "error");
              return;
            }
            this.clearAlert(alertEl);
          }

          if (currentStep < totalSteps) {
            currentStep++;
            updateStepperUI(currentStep);
          }
        });
      });

      document.querySelectorAll("[data-action='prev-step']").forEach(btn => {
        btn.addEventListener("click", () => {
          if (currentStep > 1) {
            currentStep--;
            updateStepperUI(currentStep);
          }
        });
      });

      // Final submission
      if (form) {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const submitBtn = document.getElementById("btnCompleteRegistration");
          const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";

          const formData = {
            full_name: document.getElementById("regFullName").value.trim(),
            email: document.getElementById("regEmail").value.trim(),
            password: document.getElementById("regPassword").value,
            phone: document.getElementById("regPhone") ? document.getElementById("regPhone").value.trim() : "",
            travel_style: hiddenStyleInput ? hiddenStyleInput.value : "Eco-Explorer",
            home_city: document.getElementById("regHomeCity") ? document.getElementById("regHomeCity").value.trim() : "",
            emergency_contact: document.getElementById("regEmergency") ? document.getElementById("regEmergency").value.trim() : "",
            medical_notes: document.getElementById("regMedical") ? document.getElementById("regMedical").value.trim() : ""
          };

          try {
            if (submitBtn) {
              submitBtn.disabled = true;
              submitBtn.innerHTML = `<span>Creating Traveler Profile...</span>`;
            }
            this.clearAlert(alertEl);

            const res = await AuthService.register(formData);
            this.showAlert(alertEl, `✓ Welcome to Bharat Explore, ${res.user.fullName}!`, "success");

            setTimeout(() => {
              window.location.href = AuthService.getRedirectUrl("/profile");
            }, 700);
          } catch (err) {
            this.showAlert(alertEl, err.message || "Registration failed.", "error");
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnHtml;
            }
          }
        });
      }
    },

    // 3. Standalone Profile Dashboard Page
    async initProfile() {
      if (!AuthService.guardPage("auth-required")) return;

      const profileData = await AuthService.getProfile();
      if (!profileData || !profileData.user) {
        AuthService.logout("/login");
        return;
      }

      const user = profileData.user;
      this.renderProfileHero(user, profileData);
      this.renderProfileStats(profileData);
      this.loadSavedCircuits();
      this.loadUserTrips();
      this.bindProfileTabs();
      this.bindProfileForms(user);
    },

    renderProfileHero(user, profileData) {
      const nameEl = document.getElementById("dashUserName");
      const emailEl = document.getElementById("dashUserEmail");
      const avatarEl = document.getElementById("dashUserAvatar");
      const styleEl = document.getElementById("dashTravelStyle");
      const cityEl = document.getElementById("dashUserCity");

      if (nameEl) nameEl.textContent = user.fullName;
      if (emailEl) emailEl.textContent = user.email;
      if (avatarEl) avatarEl.textContent = user.avatar || "🏔️";
      if (styleEl) styleEl.textContent = user.travelStyle || "Eco-Explorer";
      if (cityEl) cityEl.textContent = user.homeCity || "India";

      const signoutBtn = document.getElementById("btnProfileSignout");
      if (signoutBtn) {
        signoutBtn.addEventListener("click", () => AuthService.logout("/login"));
      }
    },

    renderProfileStats(profileData) {
      const savedCountEl = document.getElementById("statSavedCount");
      const tripsCountEl = document.getElementById("statTripsCount");
      if (savedCountEl) savedCountEl.textContent = profileData.saved_count || 0;
      if (tripsCountEl) tripsCountEl.textContent = profileData.trips_count || 0;
    },

    async loadSavedCircuits() {
      const grid = document.getElementById("savedCircuitsGrid");
      const emptyState = document.getElementById("savedEmptyState");
      if (!grid) return;

      const data = await AuthService.getSavedDestinations();
      const destinations = data && Array.isArray(data.destinations) ? data.destinations : [];

      if (!destinations.length) {
        if (emptyState) emptyState.style.display = "block";
        grid.style.display = "none";
        return;
      }

      if (emptyState) emptyState.style.display = "none";
      grid.style.display = "grid";

      grid.innerHTML = destinations.map(d => `
        <div class="saved-dest-card">
          <img class="saved-dest-img" src="${d.img}" alt="${d.name}" loading="lazy">
          <div class="saved-dest-body">
            <div class="saved-dest-meta">
              <h3>${d.name}</h3>
              <p>📍 ${d.location}, ${d.state} • ${d.difficulty || "Moderate"}</p>
            </div>
            <div class="saved-dest-footer">
              <span class="dest-budget-tag">₹${d.budget || 3000}/day</span>
              <button class="btn-remove-bookmark" data-remove-id="${d.id}" title="Remove bookmark">✕ Remove</button>
            </div>
          </div>
        </div>
      `).join("");

      grid.querySelectorAll("[data-remove-id]").forEach(btn => {
        btn.addEventListener("click", async () => {
          const destId = btn.dataset.removeId;
          await AuthService.removeSavedDestination(destId);
          // Also remove from localStorage for app.js sync
          let localSaved = JSON.parse(localStorage.getItem("bharatSaved") || "[]");
          localSaved = localSaved.filter(id => id !== destId);
          localStorage.setItem("bharatSaved", JSON.stringify(localSaved));
          this.loadSavedCircuits();
          // Update stats
          const profile = await AuthService.getProfile();
          if (profile) this.renderProfileStats(profile);
        });
      });
    },

    async loadUserTrips() {
      const container = document.getElementById("userTripsList");
      const emptyState = document.getElementById("tripsEmptyState");
      if (!container) return;

      const trips = await AuthService.getUserTrips();
      if (!trips.length) {
        if (emptyState) emptyState.style.display = "block";
        container.style.display = "none";
        return;
      }

      if (emptyState) emptyState.style.display = "none";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "16px";

      container.innerHTML = trips.map(t => `
        <div class="saved-dest-card" style="padding: 20px; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
          <div>
            <h3 style="color: #fff; font-size: 17px; margin-bottom: 4px;">${t.title}</h3>
            <p style="color: rgba(255,255,255,0.7); font-size: 13px;">
              ⏱️ ${t.durationDays} Days • Style: <strong>${t.travelStyle}</strong> • Created: ${t.createdAt ? t.createdAt.split("T")[0] : "Recent"}
            </p>
            ${t.notes ? `<p style="color: #bbf2ea; font-size: 12px; margin-top: 6px;">Notes: ${t.notes}</p>` : ""}
          </div>
          <button class="btn-signout" data-delete-trip="${t.id}" style="padding: 6px 14px; font-size: 12px;">Delete Plan</button>
        </div>
      `).join("");

      container.querySelectorAll("[data-delete-trip]").forEach(btn => {
        btn.addEventListener("click", async () => {
          if (confirm("Are you sure you want to delete this expedition plan?")) {
            await AuthService.deleteUserTrip(btn.dataset.deleteTrip);
            this.loadUserTrips();
            const profile = await AuthService.getProfile();
            if (profile) this.renderProfileStats(profile);
          }
        });
      });
    },

    bindProfileTabs() {
      const tabBtns = document.querySelectorAll(".dash-tab-btn");
      const tabPanes = document.querySelectorAll(".dash-tab-pane");

      tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          const tabKey = btn.dataset.tab;
          tabBtns.forEach(b => b.classList.toggle("active", b.dataset.tab === tabKey));
          tabPanes.forEach(p => p.classList.toggle("active", p.id === `tabPane-${tabKey}`));
        });
      });
    },

    bindProfileForms(user) {
      // Safety card details
      const emergencyEl = document.getElementById("dashEmergencyVal");
      const medicalEl = document.getElementById("dashMedicalVal");
      if (emergencyEl) emergencyEl.textContent = user.emergencyContact || "Not configured yet";
      if (medicalEl) medicalEl.textContent = user.medicalNotes || "No altitude sickness notes recorded";

      // Edit inputs
      const editName = document.getElementById("editProfileName");
      const editPhone = document.getElementById("editProfilePhone");
      const editCity = document.getElementById("editProfileCity");
      const editStyle = document.getElementById("editProfileStyle");
      const editEmergency = document.getElementById("editProfileEmergency");
      const editMedical = document.getElementById("editProfileMedical");

      if (editName) editName.value = user.fullName || "";
      if (editPhone) editPhone.value = user.phone || "";
      if (editCity) editCity.value = user.homeCity || "";
      if (editStyle) editStyle.value = user.travelStyle || "Eco-Explorer";
      if (editEmergency) editEmergency.value = user.emergencyContact || "";
      if (editMedical) editMedical.value = user.medicalNotes || "";

      // Save Profile Form
      const form = document.getElementById("dashProfileEditForm");
      const alertEl = document.getElementById("dashProfileAlert");
      if (form) {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const submitBtn = form.querySelector("button[type='submit']");
          const originalBtnHtml = submitBtn.innerHTML;

          try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Saving...</span>`;
            this.clearAlert(alertEl);

            const res = await AuthService.updateProfile({
              full_name: editName.value.trim(),
              phone: editPhone.value.trim(),
              home_city: editCity.value.trim(),
              travel_style: editStyle.value,
              emergency_contact: editEmergency.value.trim(),
              medical_notes: editMedical.value.trim()
            });

            this.showAlert(alertEl, "✓ Profile updated successfully!", "success");
            const refreshed = await AuthService.getProfile();
            if (refreshed) {
              this.renderProfileHero(refreshed.user, refreshed);
              if (emergencyEl) emergencyEl.textContent = refreshed.user.emergencyContact || "Not configured yet";
              if (medicalEl) medicalEl.textContent = refreshed.user.medicalNotes || "No altitude sickness notes recorded";
            }
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          } catch (err) {
            this.showAlert(alertEl, err.message || "Failed to update profile.", "error");
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }
        });
      }

      // Create Custom Trip Form
      const tripForm = document.getElementById("dashCreateTripForm");
      const tripAlert = document.getElementById("dashTripAlert");
      if (tripForm) {
        tripForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const title = document.getElementById("tripTitle").value.trim();
          const duration = parseInt(document.getElementById("tripDuration").value, 10) || 5;
          const style = document.getElementById("tripStyle").value;
          const notes = document.getElementById("tripNotes").value.trim();

          try {
            this.clearAlert(tripAlert);
            await AuthService.createUserTrip({
              title,
              duration_days: duration,
              travel_style: style,
              notes,
              destination_ids: []
            });
            this.showAlert(tripAlert, `✓ Custom expedition "${title}" saved!`, "success");
            tripForm.reset();
            this.loadUserTrips();
            const profile = await AuthService.getProfile();
            if (profile) this.renderProfileStats(profile);
          } catch (err) {
            this.showAlert(tripAlert, err.message || "Failed to create trip.", "error");
          }
        });
      }

      // Change Password Form
      const pwForm = document.getElementById("dashPasswordForm");
      const pwAlert = document.getElementById("dashPasswordAlert");
      if (pwForm) {
        pwForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const currentPw = document.getElementById("pwCurrent").value;
          const newPw = document.getElementById("pwNew").value;
          try {
            this.clearAlert(pwAlert);
            await AuthService.changePassword(currentPw, newPw);
            this.showAlert(pwAlert, "✓ Password changed successfully!", "success");
            pwForm.reset();
          } catch (err) {
            this.showAlert(pwAlert, err.message || "Failed to change password.", "error");
          }
        });
      }
    },

    // Navbar controller for index.html
    initNavbar() {
      const authBtn = document.getElementById("navAuthBtn");
      if (!authBtn) return;

      const render = () => {
        const user = AuthService.getUser();
        if (AuthService.isAuthenticated() && user) {
          authBtn.classList.add("logged-in");
          authBtn.innerHTML = `
            <span class="user-chip-avatar">${user.avatar || "🏔️"}</span>
            <span class="user-chip-name">${user.fullName ? user.fullName.split(" ")[0] : "Traveler"}</span>
          `;
          authBtn.setAttribute("title", `Traveler Profile (${user.fullName})`);
          authBtn.onclick = () => { window.location.href = "/profile"; };
        } else {
          authBtn.classList.remove("logged-in");
          authBtn.innerHTML = `
            <span class="auth-icon">👤</span>
            <span class="auth-label">Sign In</span>
          `;
          authBtn.setAttribute("title", "Sign In to Bharat Explore");
          authBtn.onclick = () => { window.location.href = "/login"; };
        }
      };

      render();
      window.addEventListener("bharat:auth-changed", render);

      // Verify token on home page load
      if (AuthService.isAuthenticated()) {
        AuthService.getProfile().then(profile => {
          if (profile) {
            render();
            const badge = document.getElementById("navSavedCount");
            if (badge && profile.saved_count !== undefined) {
              badge.textContent = profile.saved_count;
            }
          }
        }).catch(() => {});
      }
    },

    showAlert(el, msg, type = "error") {
      if (!el) return;
      el.textContent = msg;
      el.className = `auth-page-alert ${type}`;
    },

    clearAlert(el) {
      if (!el) return;
      el.textContent = "";
      el.className = "auth-page-alert";
    }
  };

  // Expose globally
  window.BharatAuth = AuthService;
  window.BharatPageControllers = PageControllers;

  // Auto-detect page and initialize
  document.addEventListener("DOMContentLoaded", () => {
    const bodyId = document.body.id;
    if (bodyId === "page-login") {
      PageControllers.initLogin();
    } else if (bodyId === "page-register") {
      PageControllers.initRegister();
    } else if (bodyId === "page-profile") {
      PageControllers.initProfile();
    } else {
      PageControllers.initNavbar();
    }
  });
})();
