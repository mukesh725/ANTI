# AIRO Health & AIRO Essentials — Developer & Customization Guide

Welcome to the **AIRO** codebase! This guide is designed specifically for developers, designers, or anyone new to coding (freshers) who needs to understand how this website is built, where files are located, and how to change things easily.

---

## 1. What Have We Built?

The AIRO platform is a premium, integrated wellness and longevity e-commerce website. We designed the user interface to look elegant, clean, and luxurious (using a warm cream, deep forest green, and gold theme). The architecture supports multi-domain logic, serving distinct experiences for "AIRO Health" and "AIRO Essentials" from the same codebase.

Features we have implemented:
1.  **Multi-Domain Experience**: Dynamic routing and styling that adapts based on the visitor's domain (Health vs. Essentials).
2.  **E-Commerce Engine**: Fully integrated shop with smart cart drawer, product listings, user authentication, and checkout flows.
3.  **AIRO AI Assistant**: A global, floating, interactive chatbot widget that answers wellness questions, drives lead generation, and handles emergency redirections.
4.  **Admin Portal**: A private administrative portal containing real-time web telemetry analytics, a customer leads CRM data manager, and an e-commerce order manager.

---

## 2. File Directory Map (Where is everything?)

Here is where each part of the website lives inside the folders:

### Page Layouts (Pages you see in the browser)
*   **AIRO Essentials Homepage (`/`)**: 
    *   File: `src/app/page.tsx`
*   **AIRO Health Homepage (`/health`)**:
    *   File: `src/app/health/page.tsx`
*   **AIRO Essentials Shop (`/grocery`)**:
    *   File: `src/app/grocery/page.tsx`
*   **AIRO Pharmacy Page (`/pharmacy`)**:
    *   File: `src/app/pharmacy/page.tsx`
*   **AIRO Minute Clinic Page (`/minute-clinic`)**:
    *   File: `src/app/minute-clinic/page.tsx`
*   **AIRO Praana (Health Chair) Page (`/health-chair`)**:
    *   File: `src/app/health-chair/page.tsx`
*   **Membership (`/membership`) & About (`/about`)**:
    *   Files: `src/app/membership/page.tsx`, `src/app/about/page.tsx`
*   **E-Commerce Portal (`/ecommerce/*`)**:
    *   Files: `src/app/ecommerce/login/page.tsx`, `src/app/ecommerce/account/page.tsx`
*   **Contact Us Page (`/contact`)**:
    *   File: `src/app/contact/page.tsx`
*   **Admin Dashboard (`/admin/dashboard`)**:
    *   File: `src/app/admin/dashboard/page.tsx`
    *   What it contains: Telemetry graphs, geolocated visitors list, active session tracking, e-commerce manager, and leads table CRM.

### Common Components (Reused items)
*   **Global Navigation Header**:
    *   File: `src/components/GlobalHeader.tsx`
    *   What it contains: The top menu bar. Configured to display path-specific logos and navigate based on domain context dynamically.
*   **Smart Cart Drawer**:
    *   File: `src/modules/retail/shared/components/SmartCartDrawer.tsx`
    *   What it contains: The sliding side-drawer for e-commerce cart management.
*   **Lead Capture Popup**:
    *   File: `src/components/LeadCapturePopup.tsx`
    *   What it contains: Global newsletter/lead generation popover.
*   **Language Translate Widget**:
    *   File: `src/components/LanguageTranslateWidget.tsx`
    *   What it contains: UI control to toggle site translations.
*   **AIRO AI Assistant Chatbot**:
    *   File: `src/components/AiraChatbot.tsx`
    *   What it contains: The floating assistant UI. Parses conversational inputs (fatigue, weight loss, vitamins) and stores captured emails/phone numbers automatically.
*   **Site Shell Wrapper**:
    *   File: `src/components/ClientLayoutWrapper.tsx`
    *   What it contains: Preloader, global header/assistant mounts, and the router tracking engine that logs page views and visitor geolocation details.

---

## 3. How to Run the Project Locally

To test the website on your own computer, open your terminal/command prompt and run these commands:

1.  **Install dependencies** (Downloads all code libraries used by the site):
    ```bash
    npm install
    ```
2.  **Start the development server** (Runs the website locally):
    ```bash
    npm run dev
    ```
    *   Once running, open your web browser and go to: `http://localhost:3000`
    *   Any changes you save in the code files will automatically refresh in the browser!
3.  **Build the website** (Checks for code errors and packages it for production):
    ```bash
    npm run build
    ```

---

## 4. Administrative Credentials & Database Structure

### Login Details
To access the admin console, navigate to `/admin` in your browser.
*   **URL**: `http://localhost:3000/admin` (or your deployed Vercel domain + `/admin`)
*   **Default Username**: `admin`
*   **Default Password**: `airohealthadmin2026`

### How Data Storage Works
The CRM leads database, e-commerce products/cart state, and pageview analytics are managed directly inside the browser's `localStorage` and React Context providers (`useCart`, `useAuth`, `useProducts`).
*   **Why?**: This prevents database configuration failures in Vercel or local deployments. It allows the website to deploy instantly as a static/serverless build for free, with zero database servers to pay for or configure.
*   **Leads sources**: Data entries are pushed automatically whenever a user submits the public **Contact Form**, interacts with the **Lead Capture Popup**, or when they share an email/phone number inside the **AIRO Chatbot**.

---

## 5. Beginner's Customization Guide (How to change things)

### A. How to Add, Edit, or Remove Navigation Links
Navigation is controlled dynamically in **`src/components/GlobalHeader.tsx`**. The header detects the domain the user is on (`isHealthDomain`) and serves distinct link lists.

*   **To edit the links shown in the top menu**:
    Look at the navigation link arrays at the top of the file:
    ```typescript
    const allLinks = [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/grocery", label: "Essentials" },
      // Edit or add default links here!
    ];

    const healthLinks = [
      { href: "/health", label: "Health Home" },
      { href: "/pharmacy", label: "Pharmacy" },
      // Edit or add health domain specific links here!
    ];
    ```

### B. How to Change Chatbot Dialogues or Keyword Rules
All chatbot logic is located inside **`src/components/AiraChatbot.tsx`**.

*   **To change the initial greeting message**:
    Find the `INITIAL_MESSAGES` block near the top of the file:
    ```typescript
    const INITIAL_MESSAGES: Message[] = [
      {
        id: "welcome",
        sender: "bot",
        text: "Welcome to AIRO Health. I'm AIRO, your personal health..." // Edit this text!
      }
    ];
    ```
*   **To change how the chatbot responds to keywords**:
    Scroll down to the `getAiraResponse` function. Inside, you will see `if` conditions checking user inputs.

### C. How to Change Website Colors & Styling
This project uses **Tailwind CSS** for styling. Styling is written directly inside the `className` attribute of HTML elements.

Key color codes used for AIRO's premium branding:
*   **Deep Forest Green**: `#0B2114` (written as `bg-[#0B2114]` for backgrounds or `text-[#0B2114]` for text).
*   **Warm Luxury Cream**: `#FAF8F5` (written as `bg-[#FAF8F5]`).
*   **Text/Borders Grey-Cream**: `#E6DFD5` (written as `border-[#E6DFD5]`).

---

## 6. Deployment (Going Live)

This project is configured with **Vercel** for automated deployment.
Whenever you push your code changes to the remote Git repository (`main` branch), Vercel automatically:
1.  Downloads the updated code.
2.  Runs the build command (`npm run build`).
3.  Deploys the update online within 1-2 minutes!
