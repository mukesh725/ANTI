# AIRO ONE - End-to-End Operational Structure

This document explains exactly how the entire AIRO ONE ecosystem works from a structural and operational perspective. It breaks down how a customer interacts with the platform, how data moves through the system, and how admins manage the backend.

---

## 1. The Core Concept: Dual-Domains, One Ecosystem
While customers see two different websites, structurally, everything runs from the exact same engine.
*   **AIRO Essentials (`airoessentials.com`)**: The retail side. Includes organic grocery, bakery, superfoods, and e-commerce shopping.
*   **AIRO Health Hub (`airohealthhub.com`)**: The clinical side. Includes Minute Clinic, Free Health Chair Scans, Pharmacy, and Telehealth.

**The Glue (SSO Membership):** 
Both domains are connected by a single **Membership / SSO (Single Sign-On) system**. A user who registers for an AIRO Membership while buying groceries can use that exact same account to book a health scan or order pharmacy compounds. Their data is unified.

---

## 2. Customer Flow: AIRO Health Hub (Clinical Side)

### A. Booking a Free Health Checkup
1.  **Discovery**: Customer visits `airohealthhub.com` and clicks "Book a Health Scan".
2.  **Intake**: They fill out their personal details (Name, Age, Mobile) and select a physical location (e.g., Kondapur, Kompally).
3.  **Scheduling**: They pick a date and time slot. 
4.  **Database Routing**: The system checks Firebase (`healthBookingLocks`) to ensure no double-booking occurs, then saves their appointment to the `healthBookings` database collection.
5.  **Confirmation**: The user receives a booking reference (e.g., `SCN-XXXXXX`) and an email.

### B. Booking a Minute Clinic Service (Paid / specialized)
1.  **Selection**: Customer selects a specific service (e.g., Flu Vaccine, Vitamin IV).
2.  **Consents**: They must agree to specific medical consents (telehealth, treatment).
3.  **Database Routing**: This data is saved to a separate database collection called `minute_clinic_bookings` because it contains strict medical compliance data.

---

## 3. Customer Flow: AIRO Essentials (Retail Side)

### A. E-Commerce (Grocery / Bakery)
1.  **Browsing**: Customer visits `airoessentials.com/grocery` or `/bakery`.
2.  **Cart Management**: Items are added to a local shopping cart.
3.  **Checkout & Auth**: To checkout, the user must log in. The system sends an OTP (One Time Password) to their email or phone.
4.  **Order Processing**: Once paid, the order is processed. Loyalty points are automatically credited to their unified AIRO Membership profile.

---

## 4. Admin & Staff Operational Flow (The Backend)

The Admin Portal (`/admin/dashboard`) is the central command center where your staff operates both the retail and clinical sides of the business.

### A. Managing the Clinics (Patient Flow)
When a patient walks into the physical Kondapur or Kompally clinic:
1.  **Lookup**: The receptionist logs into the Admin Portal and looks up the patient's phone number or `SCN` reference.
2.  **Check-In**: They click **"Check In"**. The system starts a "Wait Time" timer.
3.  **Consultation**: When the doctor is ready, staff clicks **"Start Consult"**. The status updates in the database.
4.  **Completion**: Once the scan/visit is done, staff clicks **"Complete"**.

*Note: The admin panel dynamically pulls from the `healthBookings` database in real-time, meaning the screen updates instantly when a patient books online.*

### B. Managing Locations & Postponements
*   If a clinic opening is delayed, admins don't need to manually delete customer bookings. The system uses a **Location Manager** to mark a clinic as "Postponed." 
*   **Result**: The database keeps the customer's exact original booking time safe, but the UI automatically masks it as "Postponed (Date TBD)" so customers aren't confused.

---

## 5. Technical Infrastructure (How data moves)

1.  **Next.js (The Brain)**: Handles all the routing. It decides what a user sees based on the URL they typed in.
2.  **Firebase Firestore (The Memory)**: The NoSQL database where all information lives. It is split into logical buckets:
    *   `healthBookings` (Intakes)
    *   `minute_clinic_bookings` (Clinical services)
    *   `users` / `memberships` (Global customer accounts)
    *   `cms` (Content like Hero Images and text)
3.  **Vercel (The Engine)**: The hosting provider. Whenever code is updated, Vercel instantly deploys the new code to both `airoessentials.com` and `airohealthhub.com` at the exact same time.
