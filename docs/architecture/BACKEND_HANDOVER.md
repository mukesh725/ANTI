# AIRO Web Ecosystem - Backend Handover & Developer Guide

This document is a complete handover guide for developers taking over or scaling the AIRO Essentials and AIRO Health backend infrastructure.

## 1. Architecture Overview
The application uses a serverless architecture built on **Next.js 14 (App Router)** and **Firebase**.

- **Frontend & API Routes**: Next.js App Router (`/src/app` and `/src/app/api`) deployed on Vercel.
- **Database**: Firebase Firestore (NoSQL).
- **Authentication**: Firebase Auth (for consumers) + Custom Role-based Auth (for admin dashboard).
- **Storage**: Firebase Storage (used for CMS uploads like product images).

## 2. Firebase Database Structure (Firestore)
The application relies on several core Firestore collections. Below is the exact schema breakdown:

### E-Commerce & Core
* `products`: Stores product listings for Pharmacy, Bakery, Essentials, etc.
* `orders`: E-commerce orders placed through the checkout system.
* `leads` & `waitlist_leads`: Contact form submissions and waitlist entries.
* `analytics_events`: Stores custom analytics and page views.

### Health & Bookings
* `healthBookings`: Stores all clinic/health check appointments. 
  - **Structure**: `{ date: string, timeSlot: string, name: string, email: string, phone: string, status: string, ... }`
  - The API securely checks for existing `timeSlot` strings to prevent double-booking.

### Membership (AIRO Care365 / AIRO ONE)
* `Members` / `users`: Core user accounts.
* `memberships`: Active membership subscriptions linked to users.
* `membershipPlans`: Configuration for available plans (e.g., ONE Select, Care365).
* `membershipPayments` & `membershipTransactions`: Logs of Razorpay transactions and statuses.

### Admin Dashboard
* `admin_users`: Custom admin accounts with Role-Based Access Control (RBAC).
  - **Roles**: Super Admin, Support Manager, Health Intakes Manager, etc.
  - Access is gated at the component level based on the `role` field.

## 3. Serverless API Endpoints (`/src/app/api`)
Next.js serverless functions act as the secure backend, preventing direct database exposure for sensitive operations.

* **`/api/bookings/*`**: 
  - `available-slots`: Dynamically generates 24/7 time slots and filters out already booked slots.
  - `create`: Secures appointment creation and sends confirmation emails.
  - `send-email-otp` / `verify-email-otp`: OTP verification for booking identity.
* **`/api/membership/*`**: 
  - Handles Razorpay payment initialization, verification, and automated ID generation for new members.
  - `dashboard` / `stats`: Aggregates data for the Admin Dashboard.
* **`/api/cms/*`**: 
  - Handles file uploads to Firebase Storage and database updates for the E-Commerce CMS.

## 4. Transferring the Project to a New Environment
Currently, the Firebase configuration is hardcoded in `src/lib/firebase.ts` for ease of local development. To securely transfer this to another team or environment:

1. Create a `.env.local` file in the root directory.
2. Add your Firebase keys:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
3. Update `/src/lib/firebase.ts` to use these environment variables (`process.env.NEXT_PUBLIC_FIREBASE_API_KEY`).
4. Ensure the same variables are added to the **Vercel Environment Variables** panel under Project Settings.

## 5. Security & Permissions (Firestore Rules)
If transferring to a new Firebase project, ensure you apply the following base Firestore rules to prevent unauthorized access while allowing the Next.js API routes to operate via Admin/Client SDKs:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Lock down by default
    match /{document=**} {
      allow read, write: if false; 
    }
    
    // Allow public read for products
    match /products/{productId} {
      allow read: if true;
    }
    
    // Auth-based access for user profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // (Note: Serverless API routes bypass these rules, so operations 
    // like creating bookings are handled securely via the backend API)
  }
}
```

## 6. Deployment
The unified codebase serves both `airoessentials.com` and `airohealthhub.com`. 
- **Build Command**: `npm run build`
- **Deploy Command**: `npx vercel --prod`
- Both domains are aliased to the same Vercel production deployment. Environment variables dictate any routing nuances if needed.
