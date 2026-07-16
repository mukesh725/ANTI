# AIRO Infrastructure & Hosting Requirements

Based on the current Next.js application stack and your preferences, here is the recommended infrastructure setup for the AIRO website.

## 1. Hosting Options & Control

*   **Google Cloud Platform (GCP) (Recommended for unified ecosystem):** Since you are planning to use Google email services, keeping hosting on GCP can simplify vendor management and billing. GCP has a strong data center presence in India (Mumbai, Delhi) and you may be able to leverage startup credits or bundle deals.
*   **AWS (Existing Account, India Region):** The easiest path if you already have AWS infrastructure. Deploying an EC2 instance in the `ap-south-1` (Mumbai) or `ap-south-2` (Hyderabad) region ensures low latency for Indian operations while keeping administrative access unified.
*   **AWS (New Account):** Best if you need strict financial and legal separation for the Indian entity's expenses.

## 2. Operating System

*   **Ubuntu 22.04 LTS (or 24.04 LTS):** This is the most widely used Linux distribution for modern web applications. It has massive community support, is available as a standard image on both AWS and GCP, and makes installing modern web tools very straightforward.

## 3. Database

*   **MariaDB:** Since you have the most experience with it, this is the perfect choice. It is highly performant, fully open-source, and integrates seamlessly with Node.js applications. 

## 4. Component Checklist for the VPS

To run the Next.js application and MariaDB on a single small VPS (e.g., AWS `t3.micro` or `t3.small` / GCP `e2-micro` or `e2-small`) for testing, you will need the following stack installed:

1.  **Operating System:** Ubuntu 22.04 LTS
2.  **Database:** MariaDB Server
3.  **Application Runtime:** Node.js (v20 LTS recommended) - *Required to run the Next.js frontend/backend.*
4.  **Process Manager:** PM2 - *Ensures the Next.js application stays running in the background and restarts automatically if it crashes or the server reboots.*
5.  **Web Server / Reverse Proxy:** NGINX - *Used to route internet traffic (ports 80/443) securely to the Next.js application running on a local port (like 3000).*
6.  **Security/SSL:** Certbot (Let's Encrypt) - *For generating free SSL/TLS certificates for HTTPS once you attach a domain.*

### Pre-configured Marketplace Options
If you are looking at the AWS Marketplace or Google Cloud Marketplace to save time:
*   You can look for a **"Node.js with NGINX"** stack (often provided by Bitnami) and install MariaDB separately.
*   Alternatively, you can install a clean Ubuntu image and run a simple setup script to install NGINX, Node, and MariaDB. This is often cleaner than pre-packaged AMIs because it gives you exact control over the versions installed without unnecessary bloatware.
