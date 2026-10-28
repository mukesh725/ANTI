# AIRO Ecosystem — Design System Specification (`DESIGN.md`)

Welcome to the unified design system for the **AIRO Ecosystem** (encompassing **AIRO Essentials**, **AIRO Health Hub**, and **AIRO ONE™ Membership**).

---

## 1. Brand Hierarchy & Multi-Domain Architecture

AIRO operates as a unified, dual-domain ecosystem sharing a single database, Single Sign-On (SSO), and design token architecture.

| Brand Entity | Primary Domain | Core Philosophy | Signature Accent |
| :--- | :--- | :--- | :--- |
| **AIRO Master Brand** | `airo.life` / Corporate | Preventative Wellness & Longevity | **Royal Navy** (`#25225E`) |
| **AIRO Essentials** | `airoessentials.com` | Organic Grocery, Bakery, Clean Eating | **Forest Green** (`#173A2B` / `#006537`) |
| **AIRO Health Hub** | `airohealthhub.com` | Clinical Diagnostics, Longevity, Compounding Pharmacy | **Clinical Brick** (`#8C2F2F`) & Navy |
| **AIRO ONE™** | Ecosystem-wide | Integrated Health & Pharmacy Membership | **AIRO Green** (`#006537`) & **Warm Cream** |

---

## 2. Color Palette & Design Tokens

### A. Brand Colors (RGB Channel Tokens)
Defined in `src/app/globals.css` and integrated via `tailwind.config.ts`:

#### Master Brand — Navy
- **Default Navy (`--navy`)**: `rgb(37, 34, 94)` / `#25225E`
- **Dark Navy (`--navy-dark`)**: `rgb(25, 23, 66)` / `#191742`
- **Soft Navy (`--navy-soft`)**: `rgb(58, 54, 128)` / `#3A3680`
- **Tint Navy (`--navy-tint`)**: `rgb(233, 232, 240)` / `#E9E8F0`

#### Sub-Brand: AIRO Essentials — Forest & Sage
- **Forest Green (`--forest`)**: `rgb(23, 58, 43)` / `#173A2B`
- **Primary AIRO Green**: `#006537`
- **Dark Forest (`--forest-dark`)**: `rgb(11, 36, 26)` / `#0B241A`
- **Sage Background (`--sage`)**: `rgb(232, 240, 234)` / `#E8F0EA`
- **Gold Accent (`--gold`)**: `rgb(185, 138, 52)` / `#B98A34`
- **Gold Soft (`--gold-soft`)**: `rgb(212, 175, 106)` / `#D4AF6A`
- **Gold Tint (`--gold-tint`)**: `rgb(247, 237, 216)` / `#F7EDD8`

#### Sub-Brand: AIRO Health Hub — Brick & Crimson
- **Clinical Brick (`--brick`)**: `rgb(140, 47, 47)` / `#8C2F2F`
- **Dark Brick (`--brick-dark`)**: `rgb(92, 31, 31)` / `#5C1F1F`
- **Brick Tint (`--brick-tint`)**: `rgb(245, 230, 228)` / `#F5E6E4`
- **Emergency Crimson (`--sig-red`)**: `rgb(179, 38, 30)` / `#D02029` (Used for AIRO Care365™ & Ambulance)

#### Warm Cream Palette (Membership & Mockup Cards)
- **Cream Base**: `#FDFCF9`
- **Cream Warm Middle**: `#FAF6EE`
- **Cream Deeper Tint**: `#F5EFE4`
- **Cream Outer Border**: `#E8E2D5`
- **Cream Inner Frame Border**: `#E7DFD1`
- **Cream Text Color**: `#292524` (Rich Stone)

#### Neutral Canvas
- **Linen Background (`--linen`)**: `rgb(247, 246, 241)` / `#F7F6F1`
- **Pure Paper (`--paper`)**: `rgb(255, 255, 255)` / `#FFFFFF`
- **Ink / Typography (`--ink`)**: `rgb(26, 30, 27)` / `#1A1E1B`
- **Moss Gray (`--moss`)**: `rgb(118, 127, 118)` / `#767F76`
- **Hairline Divider (`--hairline`)**: `rgb(235, 232, 223)` / `#EBE8DF`

---

## 3. Typography Scale & Hierarchy

### Web Application (`ANTI` / Next.js)
- **Headings & Hero Display (`font-serif`)**:
  ```css
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  letter-spacing: -0.04em;
  line-height: 1.08;
  ```
- **Body & UI Elements (`font-sans`)**:
  ```css
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.55;
  ```

### Static Front-End (`airooone front end`)
- **Primary Body Font**: `Plus Jakarta Sans`, sans-serif (Weights: `400`, `500`, `600`, `700`, `800`)
- **Accent & Titles Font**: `Outfit`, sans-serif (Weights: `600`, `700`, `800`)

### Type Sizing Tokens
- **Hero Title**: `clamp(32px, 5vw, 56px)` — `font-extrabold tracking-tight`
- **Section Heading (H2)**: `clamp(24px, 3.5vw, 36px)` — `font-bold tracking-tight`
- **Card Title (H3)**: `20px` to `24px` — `font-semibold`
- **Body Text**: `14px` (Small) / `16px` (Standard) — `text-gray-600`
- **Micro Badge / Metadata**: `11px` to `12px` — `uppercase font-bold tracking-widest`

---

## 4. Spacing, Elevation & Corner Radii

### Border Radius Scale
- **Pill Badges & Buttons**: `rounded-full` (`border-radius: 9999px;`)
- **Feature & Plan Cards**: `rounded-2xl` (`16px`) to `rounded-3xl` (`24px`)
- **Showcase Mockup & Device Containers**: `rounded-[1.75rem]` (`28px`) on mobile, `rounded-[2.5rem]` (`40px`) on desktop
- **Outer Page Sections**: `rounded-[2.5rem]` (`40px`)

### Shadows & Elevation
- **Card Shadow (Rest)**: `box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);`
- **Floating Pill / Button**: `box-shadow: 0 4px 14px rgba(0, 101, 55, 0.25);`
- **Device Mockup / Leaflet Showcase**: `box-shadow: 0 20px 40px -10px rgba(120, 113, 108, 0.18);`
- **Modal Dialog**: `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);`

---

## 5. Signature Components

### 1. Pill Badges
Used for statuses, tags, and category labels.
```html
<span class="inline-block bg-emerald-50 text-[#006537] border border-emerald-200/60 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
  Official Membership Leaflet
</span>
```

### 2. Primary Action Buttons
Pill-shaped, weighted green button with subtle hover lift and drop shadow.
```html
<button class="px-8 py-4 rounded-full bg-[#006537] hover:bg-[#004e2a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
  For More Information ↗
</button>
```

### 3. Segmented Billing Cycle Toggle
Permits switching between Quarterly and Annual views with immediate visual feedback.
```html
<div class="inline-flex bg-gray-100 p-1.5 rounded-full border border-gray-200">
  <button class="bg-[#006537] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-sm">Quarterly</button>
  <button class="text-gray-600 px-6 py-2.5 rounded-full text-xs font-semibold">Annual</button>
</div>
```

### 4. Leaflet Document Showcase Card
- **Device-Style Frame**: Cream gradient (`#FDFCF9` → `#F5EFE4`) with a `3px` solid `#E8E2D5` border.
- **Inner Frame**: Clean white sheet with a `1px` inner border and crisp aspect ratio (`1313 / 1688`).
- **Outside Navigation**: Circular navigation buttons flanking the card on desktop (`hidden sm:flex`), positioned cleanly inside the bottom bar on mobile (`flex sm:hidden`) to maximize readability.

---

## 6. Accessibility & Responsive Best Practices

1. **Color Contrast**: All primary text maintains a minimum contrast ratio of `7:1` against white and cream canvases (WCAG AAA).
2. **Tap Targets**: All touchable elements (arrows, dots, pill buttons) are sized at least `44px × 44px` or maintain adequate padding for mobile touch accuracy.
3. **Responsive Scaling**:
   - **Mobile (< 640px)**: Leaflet viewer card takes 100% width with minimal padding; navigation arrows sit at the bottom.
   - **Tablet (640px – 1024px)**: Flanking outside arrows appear; cards center neatly.
   - **Desktop (≥ 1024px)**: Two-column split layout (Left: title & CTA, Right: framed showcase card with outside flanking arrows).
