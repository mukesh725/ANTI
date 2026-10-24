# AIRO ONE - SEO, AIO & GEO Implementation Documentation

## 1. Overview
This document outlines the current state and future implementation strategies for Search Engine Optimization (SEO), Artificial Intelligence Optimization (AIO), and Generative Engine Optimization (GEO) across the AIRO ONE dual-domain platform (AIRO Essentials & AIRO Health Hub).

## 2. Where Can They Be Implemented?

### **Front-End (Next.js Application)**
The vast majority of SEO, AIO, and GEO must be implemented on the **Front-End**.
- **Metadata API:** Setting dynamic `<title>`, `<meta name="description">`, and OpenGraph tags in `layout.tsx` and individual `page.tsx` files.
- **Semantic HTML:** Using proper `<article>`, `<section>`, `<h1>`, and `<h2>` tags so AI web crawlers understand the page structure.
- **Structured Data (JSON-LD):** Injecting Schema.org JSON scripts into the DOM. This is the **most critical** factor for AIO and GEO, as it feeds structured entities (like `MedicalClinic`, `Product`, `Pharmacy`) directly to AI models like ChatGPT, Gemini, and Google SGE.

### **Back-End (Firebase / Server)**
- **Dynamic Sitemaps:** The server must dynamically generate `sitemap.xml` by pulling active products or clinics from the database.
- **Content Delivery:** Fast server response times (TTFB) directly impact SEO rankings.

---

## 3. Current Implementation Status

### ✅ **SEO (Search Engine Optimization) - IMPLEMENTED**
Standard SEO is already well-implemented across the platform.
- **Location:** `src/app/layout.tsx`
- **Features Active:**
  - Dynamic dual-domain title and description generation (switches automatically between AIRO Essentials and AIRO Health Hub).
  - OpenGraph (OG) and Twitter card metadata for social media sharing.
  - Canonical URLs to prevent duplicate content penalties.
- **Crawling Files:** 
  - `src/app/sitemap.ts` is implemented and dynamically categorizes routes based on the domain.
  - `src/app/robots.ts` is implemented and blocks AI/Search bots from sensitive routes like `/admin/` and `/ecommerce/checkout`.

### ❌ **AIO (AI Optimization) & GEO (Generative Engine Optimization) - NOT FULLY IMPLEMENTED**
Currently, the platform relies only on basic text for AI context.
- **Missing Component:** The platform does **not** currently have Structured Data / JSON-LD schemas injected into the pages.
- **Why it matters:** Generative AI engines (like Perplexity, Google AI Overviews, and ChatGPT) heavily prioritize websites that explicitly define their entities via JSON-LD. For a health hub, lacking `MedicalClinic` and `Physician` schema means AI engines will struggle to confidently recommend AIRO Health Hub in generative answers.

---

## 4. Next Steps for AIO & GEO Implementation
To fully optimize for AI engines, the following should be added to the front-end codebase:
1. **LocalBusiness & MedicalClinic Schema:** Add JSON-LD to the Health Hub homepage detailing the services, location, and opening hours.
2. **Product Schema:** Add JSON-LD to the E-Commerce pages (Bakery, Grocery) to feed pricing and availability to AI shopping assistants.
3. **FAQ Schema:** Add structured FAQs so AI models can directly quote AIRO's answers in AI Overviews.
