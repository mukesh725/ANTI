# AIRO Platform

Welcome to the **AIRO Platform** repository. This codebase powers both the **AIRO Health** and **AIRO Essentials** websites. 

It is a premium e-commerce and wellness platform built with Next.js, featuring dynamic multi-domain routing, an integrated e-commerce shop, a built-in AI assistant, and a private admin dashboard.

## 📖 Developer Guide

For a complete walkthrough of the project structure, routing, where to find files, and how to customize the platform, please read our dedicated developer guide:

👉 **[Read the Developer & Customization Guide (DEVELOPER_GUIDE.md)](./DEVELOPER_GUIDE.md)**

## 🚀 Quick Start

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** React Context (Cart, Auth, Products)

## 🌐 Environments

- **AIRO Essentials:** The default retail and grocery experience.
- **AIRO Health:** Accessible via the `/health` route (or when deployed under a `health.*` domain). Offers clinical features, pharmacy, and membership details.
- **Admin Portal:** Accessible via `/admin` for tracking telemetry, leads, and managing e-commerce settings. Default login is `admin` / `airohealthadmin2026`.

## 📦 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com). Pushing to the `main` branch will automatically trigger a production build.
