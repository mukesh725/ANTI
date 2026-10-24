# AIRO ONE - Site Architecture Documentation

## 1. System Overview
**AIRO ONE** is a unified Next.js web application engineered to serve two distinct business verticals from a single codebase, leveraging Next.js Middleware and dual-domain routing:
- **AIRO Essentials (`airoessentials.com`):** Premium Organic Grocery, Bakery, Ice Cream, and E-commerce.
- **AIRO Health Hub (`airohealthhub.com`):** Clinical Services, Minute Clinic, Health Scans, Pharmacy, and Telehealth.

## 2. Core Technologies
- **Framework:** Next.js 14 (App Router `src/app/`)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Framer Motion
- **Database / Backend:** Firebase (Firestore & Firebase Auth)
- **Deployment:** Vercel

## 3. Directory Structure

```text
src/
├── app/                  # Next.js App Router (All Pages & API Routes)
│   ├── (essentials)      # Core routes for AIRO Essentials
│   │   ├── grocery/
│   │   ├── bakery/
│   │   ├── ice-cream/
│   │   └── ecommerce/
│   ├── (health)          # Core routes for AIRO Health Hub
│   │   ├── minute-clinic/
│   │   ├── health-chair/
│   │   ├── book-health-scan/
│   │   └── pharmacy/
│   ├── admin/            # Universal Admin Dashboard
│   ├── api/              # Serverless API Routes (Bookings, CMS, Membership)
│   ├── globals.css       # Global styling & Tailwind directives
│   └── layout.tsx        # Root layout (handles dual-domain SEO & metadata)
├── components/           # Reusable React Components
│   ├── admin/            # Admin UI components (LocationsManager, BookingsManager)
│   ├── booking/          # Clinical booking flows
│   ├── shared/           # Cross-domain components (Buttons, Inputs)
│   └── ui/               # Base UI elements
├── lib/                  # Utilities and Services
│   ├── firebase.ts       # Firebase initialization & config
│   ├── cms.ts            # Content Management System utilities
│   └── utils.ts          # General helper functions
└── public/               # Static assets (Images, Icons, Fonts)
```

## 4. Key Routing Architecture

### Dual-Domain Resolution
The site intelligently resolves the user's intent based on the domain they visit. The `layout.tsx` file intercepts the `host` header to serve the correct metadata and SEO information. 

### Serverless APIs (`/api/`)
The platform uses Next.js serverless functions to securely interact with external services and the database:
- `/api/bookings/*`: Handles creating, looking up, and updating health & clinic bookings.
- `/api/membership/*`: Handles SSO membership logic, OTP generation, and payment verification.
- `/api/cms/*`: Handles dynamic content updates.

## 5. Database Architecture (Firebase Firestore)

The application relies on a NoSQL document structure via Firebase Firestore. Key collections include:

### `healthBookings`
- **Purpose:** Stores bookings for Free Health Intakes and general clinic appointments.
- **Fields:** `firstName`, `lastName`, `email`, `mobile`, `date`, `timeSlot`, `status`, `location`, `bookingReference`.

### `minute_clinic_bookings`
- **Purpose:** Stores detailed clinical bookings for specific paid services and vaccines.
- **Fields:** Includes detailed `consents`, `careOption`, `service`, `dob`, and `address`.

### `users` / `memberships`
- **Purpose:** Stores global SSO credentials for customers, granting them unified access across grocery e-commerce and clinical records.
- **Fields:** `memberId`, `email`, `phone`, `tier`, `loyaltyPoints`.

## 6. Authentication & Security
- **Customers:** Handled via Firebase Auth (Email/OTP based login) for both E-Commerce checkouts and Membership dashboards.
- **Admin Portal:** Protected routes under `/admin` require elevated permissions to view patient PII (Personally Identifiable Information) and manage bookings.

## 7. Build & Deployment Architecture
- **Vercel Edge Network:** The application is deployed to Vercel, which automatically provisions Edge Functions for Middleware and Serverless Functions for the API routes.
- **Static vs Dynamic:** Product pages (e.g., Grocery) and Marketing pages (e.g., About, Press) are statically generated (SSG) for maximum performance, while Admin and Booking portals are Server-Side Rendered (SSR) or dynamically fetched client-side.
