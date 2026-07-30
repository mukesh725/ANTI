# Project Rules & Customizations

## Dual-Domain Build & SSO Deployment Protocol
Whenever a build or deployment is requested:
1. Run `npm run build` to verify Next.js compilation across both domain routes.
2. Execute `npx -y vercel --prod` to deploy the unified codebase simultaneously to both live domains:
   - **AIRO Essentials**: `https://airoessentials.com` (and `www.airoessentials.com`)
   - **AIRO Health**: `https://airohealthhub.com` (and `airohealth-test.vercel.app`)
3. Both sites share the exact same unified Firebase Firestore database and Single Sign-On (SSO) customer authentication system.
