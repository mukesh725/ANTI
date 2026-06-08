# AIRO Health — Developer & Customization Guide

Welcome to the **AIRO Health** codebase! This guide is designed specifically for developers, designers, or anyone new to coding (freshers) who needs to understand how this website is built, where files are located, and how to change things easily.

---

## 1. What Have We Built?

AIRO Health is a premium, integrated wellness and longevity website. We redesigned the user interface to look elegant, clean, and luxurious (using a warm cream, deep forest green, and gold theme).

Features we have implemented:
1.  **Brand Redesigns**: Redesigned Homepage, sub-pages (Essentials, Pharmacy, Minute Clinic) focusing on preventive healthcare.
2.  **AIRO AI Assistant**: A global, floating, interactive chatbot widget that answers wellness questions, drives lead generation, and handles emergency redirections.
3.  **Contact Us Page**: A public page for users to submit wellness and clinical consult inquiries.
4.  **Admin Portal**: A private administrative portal containing real-time web telemetry analytics and a customer leads CRM data manager.

---

## 2. File Directory Map (Where is everything?)

Here is where each part of the website lives inside the folders:

### Page Layouts (Pages you see in the browser)
*   **Homepage (`/`)**: 
    *   File: `src/app/page.tsx`
    *   What it contains: Landing page with hero message, pillars, and diagnostic Health Chair scan blocks.
*   **AIRO Essentials Page (`/grocery`)**:
    *   File: `src/app/grocery/page.tsx`
    *   What it contains: Sourcing philosophy and 10 storytelling category cards (Produce, Proteins, Dairy, etc.).
*   **AIRO Pharmacy Page (`/pharmacy`)**:
    *   File: `src/app/pharmacy/page.tsx`
    *   What it contains: Longevity, compounding descriptions, and a waitlist form.
*   **AIRO Minute Clinic Page (`/minute-clinic`)**:
    *   File: `src/app/minute-clinic/page.tsx`
    *   What it contains: Primary medical services list, diagnostics, and appointments forms.
*   **Contact Us Page (`/contact`)**:
    *   File: `src/app/contact/page.tsx`
    *   What it contains: Location & support details, along with the interactive contact form.
*   **Admin Redirect Portal (`/admin`)**:
    *   File: `src/app/admin/page.tsx`
    *   What it contains: Auth router that redirects active sessions either to the Dashboard or to the Login page.
*   **Admin Login Page (`/admin/login`)**:
    *   File: `src/app/admin/login/page.tsx`
    *   What it contains: Secure credential submission gate (Username/Password) styled in dark branding.
*   **Admin Dashboard (`/admin/dashboard`)**:
    *   File: `src/app/admin/dashboard/page.tsx`
    *   What it contains: Telemetry graphs, geolocated visitors list, active session browsed path tracking, and leads table CRM.

### Common Components (Reused items)
*   **Global Navigation Header**:
    *   File: `src/components/GlobalHeader.tsx`
    *   What it contains: The top menu bar. Configured to display path-specific logos dynamically.
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
The CRM leads database and pageview analytics are stored directly inside the browser's `localStorage` (under key names `"airo_leads"` and `"airo_analytics"`).
*   **Why?**: This prevents database configuration failures in Vercel or local deployments. It allows the website to deploy instantly as a static/serverless build for free, with zero database servers to pay for or configure.
*   **Leads sources**: Data entries are pushed automatically whenever a user submits the public **Contact Form** or when they share an email/phone number inside the **AIRO Chatbot**.
*   **Resetting/Prepopulating**: If the database is empty, the Admin Dashboard automatically generates mock records (like Alexander Mercer, Genevieve Thorne, etc.) so that the console looks fully populated and professional out-of-the-box.

---

## 5. Beginner's Customization Guide (How to change things)

### A. How to Change Chatbot Dialogues or Keyword Rules
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
*   **To change how the chatbot responds to keywords (e.g. fatigue, weight loss)**:
    Scroll down to the `getAiraResponse` function. Inside, you will see `if` conditions checking user inputs:
    ```typescript
    // Example: If the user types 'tired' or 'sleep'
    if (input.includes("tired") || input.includes("sleep")) {
      return {
        text: "Your custom response text goes here...",
        chips: ["Option A", "Option B"] // Edit these buttons!
      };
    }
    ```

### B. How to Add, Edit, or Remove Navigation Links
Navigation is controlled in **`src/components/GlobalHeader.tsx`**.

*   **To edit the links shown in the top menu**:
    Look at the navigation links array:
    ```typescript
    const navLinks = [
      { href: "/grocery", label: "Essentials" },
      { href: "/pharmacy", label: "Pharmacy" },
      { href: "/minute-clinic", label: "MinuteClinic" },
      { href: "/contact", label: "Contact" }, // Edit this list!
    ];
    ```

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
