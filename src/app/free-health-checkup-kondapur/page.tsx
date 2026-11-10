"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export default function FreeHealthCheckupKondapurPage() {
  // 1. Phone support hours logic (Store is open 24/7, phone lines 6:00 AM - 10:00 PM IST)
  const [isPhoneOpen, setIsPhoneOpen] = useState(true);

  useEffect(() => {
    const updatePhoneHours = () => {
      try {
        const hourStr = new Intl.DateTimeFormat("en-GB", {
          hour: "numeric",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date());
        const hour = parseInt(hourStr, 10) % 24;
        const open = hour >= 6 && hour < 22;
        setIsPhoneOpen(open);
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("after-hours", !open);
        }
      } catch (e) {
        const localHour = new Date().getHours();
        const open = localHour >= 6 && localHour < 22;
        setIsPhoneOpen(open);
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("after-hours", !open);
        }
      }
    };
    updatePhoneHours();
    const interval = setInterval(updatePhoneHours, 60000);
    return () => clearInterval(interval);
  }, []);

  // 2. Tracking parameters extraction (gclid, utm_source, utm_campaign)
  const [tracking, setTracking] = useState({
    gclid: "",
    utm_source: "",
    utm_campaign: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const gclid = params.get("gclid") || sessionStorage.getItem("airo_gclid") || "";
      const utm_source = params.get("utm_source") || sessionStorage.getItem("airo_utm_source") || "";
      const utm_campaign = params.get("utm_campaign") || sessionStorage.getItem("airo_utm_campaign") || "";

      if (gclid) sessionStorage.setItem("airo_gclid", gclid);
      if (utm_source) sessionStorage.setItem("airo_utm_source", utm_source);
      if (utm_campaign) sessionStorage.setItem("airo_utm_campaign", utm_campaign);

      setTracking({ gclid, utm_source, utm_campaign });
    } catch (e) {
      // storage disabled
    }
  }, []);

  // 3. Form state & validation
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    firstName: string;
    phone: string;
    bookingReference: string;
  } | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const normalisePhone = (raw: string) => {
    let digits = raw.replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
    return digits;
  };

  const validateName = () => {
    const trimmed = name.trim().replace(/\s+/g, " ");
    if (!trimmed) {
      setErrors((prev) => ({ ...prev, name: "Please enter your name." }));
      return false;
    }
    if (trimmed.length < 2) {
      setErrors((prev) => ({ ...prev, name: "Name looks too short." }));
      return false;
    }
    if (!/^[\p{L}\p{M} .'-]+$/u.test(trimmed)) {
      setErrors((prev) => ({ ...prev, name: "Please use letters only." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, name: undefined }));
    return true;
  };

  const validatePhone = () => {
    const raw = phone.trim();
    if (!raw) {
      setErrors((prev) => ({ ...prev, phone: "Please enter your phone number." }));
      return false;
    }
    const digits = normalisePhone(raw);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setErrors((prev) => ({ ...prev, phone: "Enter a valid 10-digit Indian mobile number." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: undefined }));
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const okName = validateName();
    const okPhone = validatePhone();

    if (!okName || !okPhone) {
      (okName ? phoneInputRef.current : nameInputRef.current)?.focus();
      return;
    }

    const digits = normalisePhone(phone);
    const trimmedName = name.trim().replace(/\s+/g, " ");

    // Bot detection check: pretend success, send nothing
    if (honeypot) {
      setSuccessData({
        firstName: trimmedName.split(" ")[0],
        phone: "+91 " + digits.slice(0, 5) + " " + digits.slice(5),
        bookingReference: "FCK-REF",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: trimmedName,
        phone: digits,
        store: "Kondapur",
        gclid: tracking.gclid,
        utm_source: tracking.utm_source,
        utm_campaign: tracking.utm_campaign,
        page: typeof window !== "undefined" ? window.location.href : "/free-health-checkup-kondapur",
        website: honeypot,
      };

      const res = await fetch("/api/funnel/free-checkup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to submit booking. Please call +91 90001 82121.");
      }

      setSuccessData({
        firstName: data.firstName || trimmedName.split(" ")[0],
        phone: data.phone || `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
        bookingReference: data.bookingReference || "FCK-CONFIRMED",
      });

      // DataLayer & gtag conversion events
      if (typeof window !== "undefined") {
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: "book_free_checkup",
            booking_ref: data.bookingReference,
            store: "Kondapur",
          });
        }
        if (typeof (window as any).gtag === "function") {
          (window as any).gtag("event", "generate_lead", {
            event_category: "Funnel",
            event_label: "Free Health Checkup Kondapur",
            booking_ref: data.bookingReference,
            store: "Kondapur",
          });
        }
      }
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        phone: "We couldn't send your booking. Please try again or call +91 90001 82121.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="funnel-page">
      {/* Google Tag Manager - Container: Airo Health Hub (GTM-WQTSLV2L) */}
      <Script
        id="gtm-funnel-script"
        src="https://www.googletagmanager.com/gtm.js?id=GTM-WQTSLV2L"
        strategy="afterInteractive"
      />
      <Script
        id="gtm-funnel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
        }}
      />
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-WQTSLV2L"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      {/* ============ HEADER ============ */}
      <header className="site-header">
        <div className="wrap header-inner">
          <Image
            className="logo"
            src="/funnel/airo-health-hub-logo-opt.png"
            alt="AIRO Health Hub"
            width={192}
            height={26}
            priority
          />
          <div className="header-meta">
            <span className="status">
              <span className="dot" aria-hidden="true" />
              Open now · 24/7
            </span>
            <a className="btn btn-primary btn-sm ah-show-flex" href="#book" data-track="cta_header">
              Book Free Checkup
            </a>
            <a className="btn btn-ghost btn-sm ah-hide-flex" href="tel:+919000182121" data-track="call_header">
              <svg className="ic-ring" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
              </svg>
              <span className="hide-xs">+91 90001 82121</span>
              <span className="show-xs">Call</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ============ HERO ============ */}
        <section className="hero">
          <div className="hero-bg" aria-hidden="true" />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="pill">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                100% free · No purchase needed
              </p>
              <h1>
                Nine vital checks.
                <br />
                About five minutes.
                <br />
                <em>Free</em> for your whole family.
              </h1>
              <p className="lede">
                Walk into AIRO Health Hub Kondapur, open 24/7, sit on the AIRO Praana Smart Chair and get your BP, ECG,
                blood sugar, SpO₂ and more checked on the spot. No cost, no purchase, no hidden charges.
              </p>

              <ul className="stats">
                <li className="stat stat-red">
                  <span className="stat-ic">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 4h6M10 2v2M14 2v2" />
                      <rect x="5" y="5" width="14" height="16" rx="2" />
                      <path d="M9 11l2 2 4-4M9 17h6" />
                    </svg>
                  </span>
                  <span>
                    <b>09</b>
                    <small>Health checks</small>
                  </span>
                </li>
                <li className="stat stat-teal">
                  <span className="stat-ic">
                    <svg className="ic-clock" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path className="hand" d="M12 12V7" />
                      <path d="M12 12l3 2" />
                    </svg>
                  </span>
                  <span>
                    <b>~5<i>min</i></b>
                    <small>Per person</small>
                  </span>
                </li>
                <li className="stat stat-amber">
                  <span className="stat-ic">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 5h10M7 9h10M13 19L7 13h2.5a4 4 0 0 0 0-8" />
                    </svg>
                  </span>
                  <span>
                    <b>₹0</b>
                    <small>Total cost</small>
                  </span>
                </li>
              </ul>
            </div>

            {/* Booking form */}
            <div className={`form-card ${successData ? "done" : ""}`} id="book">
              {!successData ? (
                <>
                  <div className="form-head">
                    <span className="form-badge">
                      <span className="dot" aria-hidden="true" />
                      Slots open today
                    </span>
                    <h2>Book your free checkup</h2>
                    <p>We'll call you back to confirm a time that suits you.</p>
                  </div>

                  <form id="booking-form" onSubmit={handleSubmit} noValidate>
                    <div className={`field ${errors.name ? "invalid" : ""}`}>
                      <label htmlFor="name">
                        Name <span aria-hidden="true">*</span>
                      </label>
                      <div className="input-wrap">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 21a8 8 0 0 1 16 0" />
                        </svg>
                        <input
                          ref={nameInputRef}
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          placeholder="Your full name"
                          required
                          minLength={2}
                          maxLength={60}
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) validateName();
                          }}
                          onBlur={validateName}
                        />
                      </div>
                      <p className="err" id="name-err" aria-live="polite">
                        {errors.name}
                      </p>
                    </div>

                    <div className={`field ${errors.phone ? "invalid" : ""}`}>
                      <label htmlFor="phone">
                        Phone number <span aria-hidden="true">*</span>
                      </label>
                      <div className="phone-wrap">
                        <span className="prefix">+91</span>
                        <input
                          ref={phoneInputRef}
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          placeholder="10-digit mobile number"
                          required
                          maxLength={14}
                          value={phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^\d+\s-]/g, "");
                            setPhone(val);
                            if (errors.phone) validatePhone();
                          }}
                          onBlur={validatePhone}
                        />
                      </div>
                      <p className="err" id="phone-err" aria-live="polite">
                        {errors.phone}
                      </p>
                    </div>

                    {/* Spam trap */}
                    <div className="hp" aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <input
                        id="website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <button
                      className={`btn btn-primary btn-block btn-shine ${isSubmitting ? "is-loading" : ""}`}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <span className="btn-label">{isSubmitting ? "Booking…" : "Book Free Checkup"}</span>
                      <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                      <span className="spinner" aria-hidden="true" />
                    </button>

                    <p className="fine">
                      By booking, you agree to be contacted by AIRO Health Hub about your checkup.{" "}
                      <Link href="/privacy-policy" target="_blank" rel="noopener">
                        Privacy policy
                      </Link>
                    </p>
                  </form>

                  <div className="form-alt">
                    <span className="ah-hide">Prefer to talk?</span>
                    <span className="ah-show">Phone lines open at 6 AM. Book above and we'll call you back.</span>
                    <a className="ah-hide" href="tel:+919000182121" data-track="call_form">
                      <svg className="ic-ring" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
                      </svg>
                      Call +91 90001 82121
                    </a>
                  </div>
                </>
              ) : (
                /* Success State */
                <div className="form-success" id="form-success" tabIndex={-1}>
                  <div className="tick" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </div>
                  <h2>You're booked in, {successData.firstName}.</h2>
                  <p>
                    Our team will call you shortly on <strong>{successData.phone}</strong> to confirm your slot{" "}
                    {isPhoneOpen ? (
                      <span>shortly</span>
                    ) : (
                      <span>after 6 AM, when our phone lines open</span>
                    )}
                    . You can also walk in any time, 24/7.
                  </p>
                  <a className="btn btn-ghost btn-block ah-hide-flex" href="tel:+919000182121" data-track="call_success">
                    Can't wait? Call +91 90001 82121
                  </a>
                </div>
              )}
            </div>

            {/* Hero visual */}
            <figure className="hero-visual">
              <Image
                src="/funnel/hero-doctor-bp.jpg"
                alt="AIRO Clinician measuring patient blood pressure"
                fill
                priority
                sizes="(max-width: 820px) 100vw, 55vw"
                className="hero-img"
              />
              <figcaption className="readout" aria-label="Sample readout">
                <div className="readout-top">
                  <span>Sample readout</span>
                  <span className="live">
                    <span className="dot" aria-hidden="true" />
                    AIRO Praana
                  </span>
                </div>
                <svg className="ecg" viewBox="0 0 300 48" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 26 H70 L80 26 L86 18 L92 26 L104 26 L110 4 L118 44 L124 26 L140 26 L150 20 L160 26 H300" />
                </svg>
                <div className="readout-grid">
                  <div>
                    <span>BP</span>
                    <b>118/76</b>
                    <i>mmHg</i>
                  </div>
                  <div>
                    <span>HR</span>
                    <b className="beat">72</b>
                    <i>bpm</i>
                  </div>
                  <div>
                    <span>SpO₂</span>
                    <b>98</b>
                    <i>%</i>
                  </div>
                </div>
              </figcaption>
              <span className="float-chip chip-a" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
                  <path d="M6 2v2M10 2v2M14 2v2" />
                </svg>
                No fasting needed
              </span>
            </figure>
          </div>
        </section>

        {/* ============ TICKER ============ */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            <span>Blood Pressure</span>
            <span>ECG</span>
            <span>Random Blood Sugar</span>
            <span>Heart Rate</span>
            <span>SpO₂</span>
            <span>Temperature</span>
            <span>Weight</span>
            <span>Respiratory Rate</span>
            <span>BMI</span>
            <span>100% Free</span>
            <span>Blood Pressure</span>
            <span>ECG</span>
            <span>Random Blood Sugar</span>
            <span>Heart Rate</span>
            <span>SpO₂</span>
            <span>Temperature</span>
            <span>Weight</span>
            <span>Respiratory Rate</span>
            <span>BMI</span>
            <span>100% Free</span>
          </div>
        </div>

        {/* ============ WHAT'S INCLUDED ============ */}
        <section className="section sec-included" id="included">
          <div className="wrap">
            <div className="section-head center">
              <p className="eyebrow">What's included</p>
              <h2>
                All nine checks. <em>All of them free.</em>
              </h2>
              <p className="sub">One sitting on the Smart Chair covers your key vital signs.</p>
            </div>
            <ol className="checks">
              <li className="check c-red">
                <span className="chip">
                  <svg className="ic ic-bp" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 16a8 8 0 1 1 16 0" />
                    <path d="M4 16h16" />
                    <path className="needle" d="M12 16l3.5-5" />
                    <circle cx="12" cy="16" r="1.4" className="fill" />
                  </svg>
                </span>
                <span className="idx">01</span>
                <strong>Blood Pressure</strong>
                <span className="unit">mmHg</span>
              </li>
              <li className="check c-rose">
                <span className="chip">
                  <svg className="ic ic-ecg" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="3" />
                    <path className="trace" d="M5 12h3l1.5-3 2.5 6 2-4 1 1h4" />
                  </svg>
                </span>
                <span className="idx">02</span>
                <strong>ECG</strong>
                <span className="unit">Heart rhythm</span>
              </li>
              <li className="check c-orange">
                <span className="chip">
                  <svg className="ic ic-drop" viewBox="0 0 24 24" aria-hidden="true">
                    <path className="drop" d="M12 3c3 4 6 7.4 6 11a6 6 0 0 1-12 0c0-3.6 3-7 6-11z" />
                    <path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5" />
                  </svg>
                </span>
                <span className="idx">03</span>
                <strong>Random Blood Sugar</strong>
                <span className="unit">RBS · mg/dL</span>
              </li>
              <li className="check c-red">
                <span className="chip">
                  <svg className="ic ic-heart" viewBox="0 0 24 24" aria-hidden="true">
                    <path className="heart" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
                  </svg>
                </span>
                <span className="idx">04</span>
                <strong>Heart Rate</strong>
                <span className="unit">bpm</span>
              </li>
              <li className="check c-sky">
                <span className="chip">
                  <svg className="ic ic-o2" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="ring" cx="12" cy="12" r="9" strokeDasharray="4 3" />
                    <text x="12" y="15.5" textAnchor="middle" fontSize="8.5" fontFamily="inherit" fontWeight="800">
                      O₂
                    </text>
                  </svg>
                </span>
                <span className="idx">05</span>
                <strong>Oxygen Saturation</strong>
                <span className="unit">SpO₂ · %</span>
              </li>
              <li className="check c-amber">
                <span className="chip">
                  <svg className="ic ic-temp" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0z" />
                    <path className="mercury" d="M12 17V9" />
                    <circle cx="12" cy="17" r="1.6" className="fill" />
                  </svg>
                </span>
                <span className="idx">06</span>
                <strong>Body Temperature</strong>
                <span className="unit">°F</span>
              </li>
              <li className="check c-teal">
                <span className="chip">
                  <svg className="ic ic-scale" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="4" />
                    <path d="M8 10a4 4 0 0 1 8 0" />
                    <path className="needle" d="M12 10l1.8-2.4" />
                  </svg>
                </span>
                <span className="idx">07</span>
                <strong>Weight</strong>
                <span className="unit">kg</span>
              </li>
              <li className="check c-green">
                <span className="chip">
                  <svg className="ic ic-lungs" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3v8" />
                    <g className="lungs">
                      <path d="M12 11c-1 1-2.2 1.5-3.2 1.5M12 11c1 1 2.2 1.5 3.2 1.5" />
                      <path d="M8.5 7C6 8 4 12 4 16.5 4 18.4 5 19 6.2 19 8 19 9 17.6 9 15.6V8.5c0-.9-.2-1.4-.5-1.5zM15.5 7C18 8 20 12 20 16.5c0 1.9-1 2.5-2.2 2.5-1.8 0-2.8-1.4-2.8-3.4V8.5c0-.9.2-1.4.5-1.5z" />
                    </g>
                  </svg>
                </span>
                <span className="idx">08</span>
                <strong>Respiratory Rate</strong>
                <span className="unit">breaths/min</span>
              </li>
              <li className="check c-violet">
                <span className="chip">
                  <svg className="ic ic-bars" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 21h18" />
                    <path className="bar b1" d="M6 18v-5" />
                    <path className="bar b2" d="M10 18V8" />
                    <path className="bar b3" d="M14 18v-7" />
                    <path className="bar b4" d="M18 18V5" />
                  </svg>
                </span>
                <span className="idx">09</span>
                <strong>BMI</strong>
                <span className="unit">kg/m²</span>
              </li>
            </ol>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className="section sec-how" id="how">
          <div className="wrap">
            <div className="section-head center">
              <p className="eyebrow">How it works</p>
              <h2>
                Three steps. <em>No waiting room.</em>
              </h2>
            </div>
            <ol className="steps">
              <li className="step">
                <span className="step-ic">
                  <svg className="ic ic-ring" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
                  </svg>
                  <em>1</em>
                </span>
                <h3>Book or walk in</h3>
                <p>
                  Leave your number above or call{" "}
                  <a href="tel:+919000182121" data-track="call_steps">
                    +91 90001 82121
                  </a>
                  . Walk-ins are welcome any time, 24/7. Phone lines are open 6 AM – 10 PM.
                </p>
              </li>
              <li className="step">
                <span className="step-ic">
                  <svg className="ic ic-chair" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 3h7a2 2 0 0 1 2 2v7H7z" />
                    <path d="M5 12h13v3H5z" />
                    <path d="M7 15v6M16 15v6" />
                    <path className="pulse" d="M9 7.5h1.2l.8-1.5 1 3 .8-1.5H14" />
                  </svg>
                  <em>2</em>
                </span>
                <h3>Sit on the Smart Chair</h3>
                <p>
                  The AIRO Praana Smart Chair takes your readings in about five minutes. No fasting or preparation needed.
                </p>
              </li>
              <li className="step">
                <span className="step-ic">
                  <svg className="ic ic-report" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 4h6M10 2v2M14 2v2" />
                    <rect x="5" y="4" width="14" height="17" rx="2" />
                    <path className="check-mark" d="M8.5 13l2.5 2.5 4.5-5" />
                  </svg>
                  <em>3</em>
                </span>
                <h3>Get your report</h3>
                <p>See your results on the spot, and bring the next family member in.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ============ FAMILY ============ */}
        <section className="section sec-family" id="family">
          <div className="wrap family-grid">
            <div className="family-photos">
              <Image
                className="ph-a"
                src="/funnel/doctor-family-consult.jpg"
                alt="A doctor consulting with family members"
                width={700}
                height={394}
                sizes="(max-width: 820px) 86vw, 45vw"
                loading="lazy"
              />
              <Image
                className="ph-b"
                src="/funnel/family-mother-daughter.jpg"
                alt="A daughter hugging and smiling with her mother"
                width={450}
                height={300}
                sizes="(max-width: 820px) 52vw, 25vw"
                loading="lazy"
              />
              <span className="float-chip chip-b" aria-hidden="true">
                <svg className="ic-heart-mini" viewBox="0 0 24 24">
                  <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
                </svg>
                Every member free
              </span>
            </div>
            <div className="family-copy">
              <p className="eyebrow">Made for families</p>
              <h2>
                Check on the people <em>who matter most.</em>
              </h2>
              <ul className="features">
                <li>
                  <span className="f-ic f-rose">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="9" cy="8" r="3.2" />
                      <path d="M3 20a6 6 0 0 1 12 0" />
                      <circle cx="17" cy="9" r="2.6" />
                      <path d="M15.5 14.2A5 5 0 0 1 21 19" />
                    </svg>
                  </span>
                  <div>
                    <b>Parents and seniors</b>
                    <p>A quick, comfortable way to keep an eye on BP, sugar and heart health.</p>
                  </div>
                </li>
                <li>
                  <span className="f-ic f-amber">
                    <svg className="ic-sun" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 18h18M7 18a5 5 0 0 1 10 0" />
                      <g className="rays">
                        <path d="M12 6v2M5.6 9.6l1.4 1.4M18.4 9.6L17 11M2.5 14h2M19.5 14h2" />
                      </g>
                    </svg>
                  </span>
                  <div>
                    <b>Any time, day or night</b>
                    <p>We're open 24/7. Drop in before work, after a late shift or on the weekend.</p>
                  </div>
                </li>
                <li>
                  <span className="f-ic f-teal">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </span>
                  <div>
                    <b>Everyone is free</b>
                    <p>Bring your spouse, parents and kids. Every member gets all nine checks at no cost.</p>
                  </div>
                </li>
                <li>
                  <span className="f-ic f-violet">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
                      <path d="M6 2v2M10 2v2M14 2v2" />
                    </svg>
                  </span>
                  <div>
                    <b>No fasting, no prep</b>
                    <p>Just walk in as you are.</p>
                  </div>
                </li>
              </ul>
              <a className="btn btn-primary btn-shine" href="#book" data-track="cta_family">
                Book Free Checkup
                <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ============ VISIT ============ */}
        <section className="section sec-visit" id="visit">
          <div className="wrap visit-grid">
            <div className="visit-copy">
              <p className="eyebrow">Visit us</p>
              <h2>
                AIRO Health Hub, <em>Kondapur.</em>
              </h2>
              <ul className="visit-list">
                <li>
                  <span className="v-ic">
                    <svg className="ic-pin" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z" />
                      <circle cx="12" cy="9.5" r="2.5" />
                    </svg>
                  </span>
                  <div>
                    <span className="v-label">Address</span>
                    <p>Shop No. 2, Ground &amp; 1st Floor, Vamsiram's Jyothi Granules, Sy. No. 199, Kondapur, Hyderabad – 500084</p>
                  </div>
                </li>
                <li>
                  <span className="v-ic">
                    <svg className="ic-clock" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path className="hand" d="M12 12V7" />
                      <path d="M12 12l3 2" />
                    </svg>
                  </span>
                  <div>
                    <span className="v-label">Hours</span>
                    <p>
                      Open 24 hours, 7 days a week<br />
                      <span className="v-sub">Phone support: 6:00 AM – 10:00 PM</span>
                    </p>
                  </div>
                </li>
                <li>
                  <span className="v-ic">
                    <svg className="ic-ring" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
                    </svg>
                  </span>
                  <div>
                    <span className="v-label">Phone · 6 AM – 10 PM</span>
                    <p>
                      <a href="tel:+919000182121" data-track="call_visit">
                        +91 90001 82121
                      </a>
                    </p>
                  </div>
                </li>
              </ul>
              <div className="btn-row">
                <a
                  className="btn btn-primary"
                  href="https://share.google/Va9o3ye90AybA4a7n"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="directions"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 11l18-8-8 18-2-8z" />
                  </svg>
                  Get Directions
                </a>
                <a className="btn btn-ghost ah-hide-flex" href="tel:+919000182121" data-track="call_visit_btn">
                  Call Now
                </a>
              </div>
            </div>
            <div className="map">
              <iframe
                title="Map to AIRO Health Hub Kondapur"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?cid=10914755810721232547&output=embed"
              />
            </div>
          </div>
        </section>

        {/* ============ FAQ + TERMS ============ */}
        <section className="section sec-faq" id="faq">
          <div className="wrap faq-grid">
            <div className="section-head">
              <p className="eyebrow">Questions</p>
              <h2>
                Good to <em>know.</em>
              </h2>
              <p className="terms">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span>
                  <b>Offer terms:</b> 100% free for every family member. No purchase, no membership, no hidden charges.
                </span>
              </p>
            </div>
            <div className="faq">
              <details open>
                <summary>
                  <span className="q-ic">?</span>Is it really free?
                </summary>
                <p>Yes. All nine checks are free for every family member, with no purchase needed.</p>
              </details>
              <details>
                <summary>
                  <span className="q-ic">?</span>Do I need to fast?
                </summary>
                <p>No. The checks, including Random Blood Sugar, don't need fasting.</p>
              </details>
              <details>
                <summary>
                  <span className="q-ic">?</span>How long does it take?
                </summary>
                <p>About five minutes per person.</p>
              </details>
              <details>
                <summary>
                  <span className="q-ic">?</span>Do I need an appointment?
                </summary>
                <p>
                  No. Walk in any time, day or night, as we're open 24/7. To book a slot, use the form or call +91 90001
                  82121 between 6 AM and 10 PM.
                </p>
              </details>
              <details>
                <summary>
                  <span className="q-ic">?</span>Can I bring my parents and kids?
                </summary>
                <p>Yes. Bring the whole family. Everyone is checked free.</p>
              </details>
            </div>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="cta-band">
          <svg className="cta-ecg" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 64 H260 L280 64 L292 48 L304 64 L330 64 L344 12 L360 112 L374 64 L410 64 L428 52 L446 64 H760 L780 64 L792 48 L804 64 L830 64 L844 12 L860 112 L874 64 L910 64 L928 52 L946 64 H1200" />
          </svg>
          <div className="wrap cta-inner">
            <div>
              <p className="cta-kicker">Open 24/7 · Calls 6 AM – 10 PM</p>
              <h2>
                Your family's numbers, <em>checked today.</em>
              </h2>
            </div>
            <div className="btn-row">
              <a className="btn btn-light btn-shine" href="#book" data-track="cta_final">
                Book Free Checkup
              </a>
              <a className="btn btn-outline-light ah-hide-flex" href="tel:+919000182121" data-track="call_final">
                <svg className="ic-ring" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
                </svg>
                Call +91 90001 82121
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="site-footer">
        <div className="wrap footer-inner">
          <Image
            className="logo"
            src="/funnel/airo-health-hub-logo-opt.png"
            alt="AIRO Health Hub"
            width={162}
            height={22}
            loading="lazy"
          />
          <p>
            Shop No. 2, Vamsiram's Jyothi Granules, Kondapur, Hyderabad – 500084 ·{" "}
            <a href="tel:+919000182121">+91 90001 82121</a> (calls 6 AM – 10 PM) · Open 24/7
          </p>
          <p className="legal">
            <Link href="/privacy-policy">Privacy Policy</Link> · <Link href="/terms">Terms</Link> · ©{" "}
            <span>{new Date().getFullYear()}</span> AIRO Health Hub
          </p>
        </div>
      </footer>

      {/* ============ MOBILE ACTION BAR ============ */}
      <nav className="mobile-bar" aria-label="Quick actions">
        <a className="btn btn-ghost ah-hide-flex" href="tel:+919000182121" data-track="call_sticky">
          <svg className="ic-ring" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
          </svg>
          Call
        </a>
        <a
          className="btn btn-ghost ah-show-flex"
          href="https://share.google/Va9o3ye90AybA4a7n"
          target="_blank"
          rel="noopener noreferrer"
          data-track="directions_sticky"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
          Directions
        </a>
        <a className="btn btn-primary" href="#book" data-track="cta_sticky">
          Book Free Checkup
        </a>
      </nav>
    </div>
  );
}
