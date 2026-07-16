# AIRO Essentials: Production Launch Checklist

Assuming the core hosting (VPS) and database (MariaDB) are sorted, and given that this is an **E-commerce & Grocery platform**, here is the checklist of what else you will need to take the platform fully live:

## 1. Domain & DNS Management
*   **Domain Name:** A registered domain name (e.g., `airoessentials.com`).
*   **DNS Provider / CDN:** I highly recommend putting **Cloudflare** (the free tier is fantastic) in front of your domain. It provides DNS management, a Global CDN (makes the site load faster), and protects against DDoS attacks.

## 2. Payment Gateway Integration
To accept money from customers, you need a payment processor integrated into the app.
*   **For US Operations:** **Stripe** or **PayPal** are the industry standards.
*   **For Indian Operations:** **Razorpay**, **Cashfree**, or **PayU** are excellent choices because they support UPI, local wallets, and domestic cards.

## 3. Media & Image Storage (Crucial for E-commerce)
You should *not* store product images on the same hard drive as your VPS or inside your MariaDB database. It will quickly consume all your server space and slow down the site.
*   **Solution:** Use an Object Storage service like **AWS S3** or **Google Cloud Storage**.
*   **Alternative:** **Cloudinary** is an excellent service designed specifically for hosting and optimizing images for e-commerce websites.

## 4. Transactional Emails
Your app needs a way to send automated emails (e.g., "Welcome to AIRO", "Order Confirmation", "Password Reset").
*   **Service:** You cannot reliably send these from a basic VPS (they will go to spam). You need an SMTP provider like **Amazon SES** (very cheap), **SendGrid**, or **Resend**.

## 5. SMS Gateway (Optional but Recommended)
If you plan on having users log in with their phone numbers (OTP) or want to send SMS delivery updates (very common for grocery apps in India).
*   **Service:** **Twilio**, **MessageBird**, or **Msg91** (highly popular in India).

## 6. Security & SSL
*   **SSL Certificate:** Ensures your site is `https://` secure. This is mandatory for processing payments. If you use Cloudflare, they provide one for free. Otherwise, we can set up **Let's Encrypt** on your server.

## 7. Legal & Compliance Pages
Payment gateways will *refuse* to approve your account until these pages are visible on your live website:
*   Terms and Conditions
*   Privacy Policy
*   Refund & Cancellation Policy
*   Shipping & Delivery Policy
*   Contact Us (with a physical business address and support email)

## 8. Code Deployment Strategy (CI/CD)
*   Instead of manually copying code to the server every time we make a change, we should set up **GitHub Actions** (or similar). This way, whenever code is updated on the main branch, it automatically deploys to the server safely without downtime.

---
### Next Steps
Do any of these jump out as something you already have (like a registered domain)? If you are ready, our next immediate focus should likely be deciding on the **Payment Gateway** and **Image Storage**, as those need to be tied into the code.
