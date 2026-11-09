/* AIRO Health Hub – Free Family Health Checkup (Kondapur)
 * Booking form handling, validation and click tracking.
 *
 * ---------------------------------------------------------------------------
 *  SETUP (developer): fill in CONFIG below.
 *
 *  endpoint        URL that receives each booking as a POST request.
 *                  Currently: the Google Apps Script web-app URL that saves
 *                  bookings to the "AIRO Free Checkup Bookings" Google Sheet
 *                  (script: google-sheet-setup/Code.gs).
 *                  Body is JSON: { name, phone, gclid, utm_source, utm_campaign,
 *                  page, store, website, submitted_at }.
 *  whatsappNumber  Used ONLY if endpoint is empty: the booking opens WhatsApp
 *                  to this number with the visitor's details pre-filled.
 *  adsSendTo       Google Ads conversion "send_to" value (e.g. "AW-123/AbC"),
 *                  fired on every successful booking. Requires the Google tag.
 * ---------------------------------------------------------------------------
 */
const CONFIG = {
  endpoint: "",
  whatsappNumber: "919000182121",
  adsSendTo: "",
};

(function () {
  "use strict";

  const form = document.getElementById("booking-form");
  const card = document.getElementById("book");
  const success = document.getElementById("form-success");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const submitBtn = form.querySelector('button[type="submit"]');

  /* ---------- Phone support hours ----------
   * The store is open 24/7, but phone lines are answered 6 AM – 10 PM (IST).
   * Outside those hours the page swaps Call buttons for booking / directions. */
  const PHONE_OPEN_HOUR = 6;   // 6 AM
  const PHONE_CLOSE_HOUR = 22; // 10 PM
  function updatePhoneHours() {
    let hour;
    try {
      hour = parseInt(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()), 10) % 24;
    } catch (e) { hour = new Date().getHours(); }
    const closed = hour < PHONE_OPEN_HOUR || hour >= PHONE_CLOSE_HOUR;
    document.documentElement.classList.toggle("after-hours", closed);
  }
  updatePhoneHours();
  window.setInterval(updatePhoneHours, 60 * 1000);

  /* ---------- Tracking params (gclid / utm) ---------- */
  const params = new URLSearchParams(window.location.search);
  const store = (() => { try { return window.sessionStorage; } catch (e) { return null; } })();
  ["gclid", "utm_source", "utm_campaign"].forEach((key) => {
    let value = params.get(key) || "";
    try {
      if (value && store) store.setItem("airo_" + key, value);
      if (!value && store) value = store.getItem("airo_" + key) || "";
    } catch (e) { /* storage blocked: ignore */ }
    if (form.elements[key]) form.elements[key].value = value;
  });
  form.elements.page.value = window.location.origin + window.location.pathname;

  /* ---------- Helpers ---------- */
  function track(event, data) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: event }, data || {}));
  }

  function normalisePhone(raw) {
    let digits = String(raw).replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
    return digits;
  }

  function setError(input, message) {
    const field = input.closest(".field");
    const err = document.getElementById(input.id + "-err");
    field.classList.toggle("invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    err.textContent = message || "";
  }

  function validateName() {
    const v = nameInput.value.trim().replace(/\s+/g, " ");
    if (!v) return setError(nameInput, "Please enter your name."), false;
    if (v.length < 2) return setError(nameInput, "Name looks too short."), false;
    if (!/^[\p{L}\p{M} .'-]+$/u.test(v)) return setError(nameInput, "Please use letters only."), false;
    setError(nameInput, "");
    return true;
  }

  function validatePhone() {
    const raw = phoneInput.value.trim();
    if (!raw) return setError(phoneInput, "Please enter your phone number."), false;
    const digits = normalisePhone(raw);
    if (!/^[6-9]\d{9}$/.test(digits)) return setError(phoneInput, "Enter a valid 10-digit Indian mobile number."), false;
    setError(phoneInput, "");
    return true;
  }

  // Live re-validation once a field has been touched
  nameInput.addEventListener("blur", () => { if (nameInput.value) validateName(); });
  phoneInput.addEventListener("blur", () => { if (phoneInput.value) validatePhone(); });
  nameInput.addEventListener("input", () => { if (nameInput.closest(".field").classList.contains("invalid")) validateName(); });
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/[^\d+\s-]/g, "");
    if (phoneInput.closest(".field").classList.contains("invalid")) validatePhone();
  });

  function setLoading(on) {
    submitBtn.disabled = on;
    submitBtn.classList.toggle("is-loading", on);
    submitBtn.querySelector(".btn-label").textContent = on ? "Booking…" : "Book Free Checkup";
  }

  function showSuccess(name, phone) {
    document.getElementById("success-name").textContent = name.split(" ")[0];
    document.getElementById("success-phone").textContent = "+91 " + phone.slice(0, 5) + " " + phone.slice(5);
    card.classList.add("done");
    success.hidden = false;
    success.focus({ preventScroll: true });
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function conversion(phone) {
    track("book_free_checkup", { lead_phone_last4: phone.slice(-4) });
    if (CONFIG.adsSendTo && typeof window.gtag === "function") {
      window.gtag("event", "conversion", { send_to: CONFIG.adsSendTo });
    }
  }

  /* ---------- Submit ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const okName = validateName();
    const okPhone = validatePhone();
    if (!okName || !okPhone) {
      (okName ? phoneInput : nameInput).focus();
      return;
    }

    const name = nameInput.value.trim().replace(/\s+/g, " ");
    const phone = normalisePhone(phoneInput.value);
    const payload = {
      name: name,
      phone: "+91" + phone,
      gclid: form.elements.gclid.value,
      utm_source: form.elements.utm_source.value,
      utm_campaign: form.elements.utm_campaign.value,
      page: form.elements.page.value,
      store: form.elements.store.value,
      website: form.elements.website.value, // spam trap, should stay empty
      submitted_at: new Date().toISOString(),
    };

    // Bots fill the hidden field: pretend success, send nothing
    if (payload.website) { showSuccess(name, phone); return; }

    // No backend configured: hand the booking to WhatsApp (opens synchronously so it isn't blocked).
    if (!CONFIG.endpoint) {
      const text = "Hi AIRO Health Hub, I'd like to book a Free Family Health Checkup at Kondapur.\nName: " + name + "\nPhone: +91 " + phone;
      window.open("https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      conversion(phone);
      showSuccess(name, phone);
      return;
    }

    setLoading(true);
    try {
      const isAppsScript = /script\.google\.com/.test(CONFIG.endpoint);
      const res = await fetch(CONFIG.endpoint, isAppsScript
        ? { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) }
        : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!isAppsScript && !res.ok) throw new Error("HTTP " + res.status);
      conversion(phone);
      showSuccess(name, phone);
    } catch (err) {
      setError(phoneInput, "We couldn't send your booking. Please try again or call +91 90001 82121.");
      track("booking_error", { message: String(err && err.message) });
    } finally {
      setLoading(false);
    }
  });

  /* ---------- Click tracking for calls / CTAs ---------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]");
    if (!el) return;
    const isCall = (el.getAttribute("href") || "").startsWith("tel:");
    track(isCall ? "call_click" : "cta_click", { location: el.dataset.track });
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Scroll reveal + start icon animations when visible ---------- */
  // Uses a simple position check (works everywhere, including background tabs),
  // plus a safety timer so content can never stay hidden.
  let pending = Array.from(document.querySelectorAll("[data-reveal]"));
  function reveal(el) { el.classList.add("in-view"); }
  function checkReveal() {
    const limit = window.innerHeight * 0.92;
    pending = pending.filter((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < limit) { reveal(el); return false; }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => { ticking = false; checkReveal(); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  checkReveal();
  // Safety net: crawlers (incl. Google Ads review), hidden tabs and very tall screens see everything
  const isBot = /bot|crawl|spider|google|lighthouse|headless/i.test(navigator.userAgent);
  if (isBot || document.visibilityState === "hidden") { pending.forEach(reveal); pending = []; }
  document.addEventListener("visibilitychange", checkReveal);
  window.setTimeout(() => {
    if (document.visibilityState === "hidden" || window.scrollY === 0 && document.body.scrollHeight <= window.innerHeight * 1.2) {
      pending.forEach(reveal); pending = [];
    }
  }, 2500);
})();
