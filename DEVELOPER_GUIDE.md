# AIRO Health — Developer & Customization Guide

Welcome to the **AIRO Health** codebase! This guide is designed specifically for developers, designers, or anyone new to coding (freshers) who needs to understand how this website is built, where files are located, and how to change things easily.

---

## 1. What Have We Built?

AIRO Health is a premium, integrated wellness and longevity website. We redesigned the user interface to look elegant, clean, and luxurious (using a warm cream, deep forest green, and gold theme).

We also integrated a custom **AIRO AI Assistant** widget that floats in the bottom right corner of every page to answer wellness questions, guide users through service options, and route medical emergencies safely.

---

## 2. File Directory Map (Where is everything?)

Here is where each part of the website lives inside the folders:

### Page Layouts (Pages you see in the browser)
*   **Homepage (`/`)**: 
    *   File: `src/app/page.tsx`
    *   What it contains: The main landing page with the hero message (*"The Future of Preventive Healthcare"*), the three pillars (Essentials, Pharmacy, Clinic), the Health Scan Chair feature, and the "Coming Soon" gateways.
*   **AIRO Essentials (Grocery) Page (`/grocery`)**:
    *   File: `src/app/grocery/page.tsx`
    *   What it contains: The organic food philosophy section, value pillars, and 10 storytelling category cards (produce, proteins, dairy, etc.) with hover effects.
*   **AIRO Pharmacy Page (`/pharmacy`)**:
    *   File: `src/app/pharmacy/page.tsx`
    *   What it contains: Longevity details, compounding pharmacy information, and the prescription waitlist.
*   **AIRO Minute Clinic Page (`/minute-clinic`)**:
    *   File: `src/app/minute-clinic/page.tsx`
    *   What it contains: Healthcare services list, diagnostics info, and booking forms.

### Common Components (Reused items)
*   **Global Navigation Header**:
    *   File: `src/components/GlobalHeader.tsx`
    *   What it contains: The top menu bar. It manages the logo switching logic (e.g. showing the green Essentials logo on the grocery page, and the red/black Health logo on the clinic/pharmacy pages).
*   **AIRO AI Assistant Chatbot**:
    *   File: `src/components/AiraChatbot.tsx`
    *   What it contains: The floating chat window. Inside this file is all the chatbot text logic, user inquiry parsing (tiredness, weight loss, vitamins), chips, and emergency protocols.
*   **Site Shell Wrapper**:
    *   File: `src/components/ClientLayoutWrapper.tsx`
    *   What it contains: Renders the preloader transition, the global header, the pages, and attaches the floating chatbot globally.

### Image & Logo Assets
*   Folder: `public/`
    *   `public/airo-essentials-logo.png` (Green logo used for the Essentials page navbar).
    *   `public/airo-health-logo.png` (Red/Black logo used for Pharmacy & Clinic navbars).
    *   `public/health-scan-chair.png` (Modern render of the diagnostic chair).

---

## 3. How to Run the Project Locally

To test the website on your own computer, you need to open your terminal/command prompt and run these commands:

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

## 4. Beginner's Customization Guide (How to change things)

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
*   **To change the bottom medical disclaimer**:
    Look near line 365 for the `<p className="text-[10px] ...">` tag and simply edit the text inside.

---

### B. How to Add, Edit, or Remove Navigation Links
Navigation is controlled in **`src/components/GlobalHeader.tsx`**.

*   **To edit the links shown in the top menu**:
    Look at the navigation links array:
    ```typescript
    const navLinks = [
      { href: "/grocery", label: "Essentials" },
      { href: "/pharmacy", label: "Pharmacy" },
      { href: "/minute-clinic", label: "Minute Clinic" },
    ];
    ```
    *   To add a link, add a new line inside this list, e.g.: `{ href: "/about", label: "About Us" }`.
    *   To remove a link, simply delete its line.

---

### C. How to Change Website Colors & Styling
This project uses **Tailwind CSS** for styling. Styling is written directly inside the `className` attribute of HTML elements.

Key color codes used for AIRO's premium branding:
*   **Deep Forest Green**: `#0B2114` (written as `bg-[#0B2114]` for backgrounds or `text-[#0B2114]` for text).
*   **Warm Luxury Cream**: `#FAF8F5` (written as `bg-[#FAF8F5]`).
*   **Text/Borders Grey-Cream**: `#E6DFD5` (written as `border-[#E6DFD5]`).

**Example: Tweaking a Button's look**
```tsx
// This creates a button with white background, green text, and a thin border:
<button className="bg-white border border-[#E6DFD5] text-[#0B2114] hover:bg-[#0B2114] hover:text-white">
  My Button
</button>
```
*   Change `bg-white` to `bg-[#0B2114]` to make the button dark green.
*   Change `text-[#0B2114]` to `text-white` to make the text white.

---

### D. How to Swap Images or Logos
1.  Place your new image file inside the **`public/`** folder (e.g., `public/new-hero.jpg`).
2.  In the code file (like `src/app/page.tsx`), search for `<img` or `url(` where the old image was referenced.
3.  Change the image source path to point to your new file:
    ```tsx
    <img src="/new-hero.jpg" alt="Description" />
    ```

---

## 5. Deployment (Going Live)

This project is configured with **Vercel** for automated deployment.
Whenever you push your code changes to the remote Git repository (`main` branch), Vercel automatically:
1.  Downloads the updated code.
2.  Runs the build command (`npm run build`).
3.  Deploys the update online within 1-2 minutes!
