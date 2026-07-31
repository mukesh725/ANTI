import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import QRCode from 'qrcode';
import { MemberRecord } from '@/types/membership';
import fs from 'fs';
import path from 'path';

/**
 * Generate high quality QR code data URL (PNG)
 */
export async function generateMemberQRCode(textOrUrl: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(textOrUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#00000000', // transparent
      },
    });
    return qrDataUrl;
  } catch (err) {
    console.error('Error generating QR Code:', err);
    throw err;
  }
}

/**
 * Helper to retrieve base64 data-URL for public logo files when running server-side
 */
async function getLogoDataUrl(filename: string): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://airoessentials.com';
    let fetchUrl = filename.startsWith('http') ? filename : `${baseUrl}/${filename.replace(/^\/+/, '')}`;

    // Instant fallback for newly uploaded templates to GitHub before Vercel finishes deploying
    if (filename.includes('/uploads/')) {
      const filenameOnly = filename.split('/uploads/').pop();
      fetchUrl = `https://raw.githubusercontent.com/mukesh725/ANTI/main/public/uploads/${filenameOnly}`;
    }

    const timestamp = new Date().getTime();
    const fetchUrlWithCacheBust = fetchUrl.includes('?') ? `${fetchUrl}&v=${timestamp}` : `${fetchUrl}?v=${timestamp}`;
    const res = await fetch(fetchUrlWithCacheBust, { cache: 'no-store' });
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let mime = 'image/png';
      if (filename.endsWith('.svg')) mime = 'image/svg+xml';
      else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) mime = 'image/jpeg';

      return `data:${mime};base64,${buffer.toString('base64')}`;
    }
  } catch (e) {
    console.error(`Logo read error for ${filename}:`, e);
  }
  return filename.startsWith('http') ? filename : `/${filename.replace(/^\/+/, '')}`;
}

/**
 * Generate Digital Membership Card matching exact Apple / AIRO ① customer design layout
 */
export async function generateDigitalMembershipCard(
  member: Partial<MemberRecord>,
  qrCodeDataUrl?: string,
  templates?: { Select?: string; Preferred?: string; Signature?: string }
): Promise<string> {

  if (!templates) {
    /*
    try {
      const docRef = doc(db, 'global_settings', 'card_templates');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        templates = docSnap.data();
      }
    } catch (e) {
      console.error('Failed to fetch card templates', e);
    }
    */
  }

  const memberName = `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Valued Member';
  const memberId = member.memberId || 'AIRO-1000001';
  const displayId = memberId.replace('-', '');

  if (!qrCodeDataUrl) {
    qrCodeDataUrl = await generateMemberQRCode(`https://airoessentials.com/member/${memberId}`);
  }

  // Format plan title e.g. "Preferred Member", "Signature Member", "Select Member"
  let rawPlan = member.membershipPlan || 'Preferred';
  if (!rawPlan.toLowerCase().includes('member')) {
    if (rawPlan.toLowerCase().includes('signature')) rawPlan = 'Signature Member';
    else if (rawPlan.toLowerCase().includes('preferred')) rawPlan = 'Preferred Member';
    else if (rawPlan.toLowerCase().includes('select')) rawPlan = 'Select Member';
    else rawPlan = `${rawPlan} Member`;
  }
  const displayPlanTitle = rawPlan;

  const isSignature = displayPlanTitle.includes('Signature');
  const isPreferred = displayPlanTitle.includes('Preferred');
  const isSelect = displayPlanTitle.includes('Select') || (!isSignature && !isPreferred);

  // Base64 logo data URLs
  const airoOneLogoUrl = await getLogoDataUrl('airo-one-logo.png');
  const essentialsLogoUrl = await getLogoDataUrl('airo-essentials-logo.png');
  const healthLogoUrl = await getLogoDataUrl('airo-health-logo.png');

  let activeTemplateUrl = '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://airoessentials.com';
  let templatePath = '';
  if (isSignature) {
    templatePath = `${baseUrl}/templates/signature.png`;
  } else if (isPreferred) {
    templatePath = `${baseUrl}/templates/preferred.png`;
  } else if (isSelect) {
    templatePath = `${baseUrl}/templates/select.jpg`;
  }

  // Fetch the template image and convert it to a Base64 data URL so it renders inside the SVG
  if (templatePath) {
    try {
      // Add a timestamp to completely bypass CDN/Next.js edge caching
      const timestamp = new Date().getTime();
      const response = await fetch(`${templatePath}?v=${timestamp}`, { cache: 'no-store' });
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        activeTemplateUrl = `data:${contentType};base64,${base64}`;
      }
    } catch (e) {
      console.error('Failed to fetch template image as base64', e);
    }
  }

  let outerBgFill = 'url(#selectOuterGrad)';
  let innerBgFill = 'url(#selectInnerGrad)';
  let outerStroke = 'rgba(255,255,255,0.2)';
  let innerStroke = '#f0f0f0';
  let logoFilter = 'none';
  let textColor = activeTemplateUrl ? '#1e293b' : '#ffffff';
  let textNameColor = activeTemplateUrl ? '#0f172a' : '#ffffff';

  if (isSignature) {
    outerBgFill = 'url(#sigOuterGrad)';
    innerBgFill = 'url(#sigInnerGrad)';
    outerStroke = '#ca8a04';
    innerStroke = '#eab308';
    logoFilter = 'url(#darkBrownLogo)';
    textColor = '#4a3b1a';
    textNameColor = '#29200e';
  } else if (isPreferred) {
    outerBgFill = 'url(#prefOuterGrad)';
    innerBgFill = 'url(#prefInnerGrad)';
    outerStroke = 'rgba(255,255,255,0.8)';
    innerStroke = '#d1d5db';
    logoFilter = 'url(#blackLogo)';
    textColor = '#3f3f46';
    textNameColor = '#18181b';
  }

  // Format valid until date e.g. "July 28 2027"
  const expiryDateObj = member.expiryDate ? new Date(member.expiryDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const formattedExpiry = expiryDateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).replace(',', '');

  // Dynamic Dimensions
  const svgWidth = 900;
  const svgHeight = 920;
  const cardWidth = 860;
  const cardHeight = 880;
  const textTranslateY = 560;
  const qrTranslateY = 560;

  // SVG graphic matching the exact card design
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
      
      <defs>
        <clipPath id="cardClip">
          <rect x="20" y="20" width="${cardWidth}" height="${cardHeight}" rx="44" />
        </clipPath>
        <style>
          .member-name { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 500; font-size: 32px; fill: ${textNameColor}; }
          .member-plan { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 400; font-size: 24px; fill: ${textColor}; }
          .lbl { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500; font-size: 16px; fill: ${textColor}; }
          .val { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 500; font-size: 20px; fill: ${textNameColor}; }
          .scan-lbl { font-family: 'Times New Roman', 'Georgia', serif; font-weight: 700; font-size: 13px; fill: ${textNameColor}; letter-spacing: 1px; }
        </style>
        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.12"/>
        </filter>
        <linearGradient id="selectOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#f3f4f6" />
        </linearGradient>
        <linearGradient id="selectInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
        <linearGradient id="prefOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e5e7eb" />
          <stop offset="50%" stop-color="#d1d5db" />
          <stop offset="100%" stop-color="#9ca3af" />
        </linearGradient>
        <linearGradient id="prefInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f9fafb" />
          <stop offset="100%" stop-color="#e5e7eb" />
        </linearGradient>
        <linearGradient id="sigOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde047" />
          <stop offset="30%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>
        <linearGradient id="sigInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
      </defs>

      <!-- Outer Background Card -->
      ${activeTemplateUrl ?
      `<image href="${activeTemplateUrl}" x="20" y="20" width="${cardWidth}" height="${cardHeight}" preserveAspectRatio="xMidYMin slice" clip-path="url(#cardClip)" />`
      :
      `<rect x="20" y="20" width="${cardWidth}" height="${cardHeight}" rx="44" fill="${outerBgFill}" stroke="${outerStroke}" stroke-width="2" />`
    }

      <!-- Top Branding -->
      ${activeTemplateUrl ? '' : `<image href="${airoOneLogoUrl}" x="150" y="70" width="600" height="180" preserveAspectRatio="xMidYMid meet" />`}

      <!-- Inner Digital Membership Card -->
      ${activeTemplateUrl ?
      ''
      :
      `<rect x="75" y="280" width="750" height="550" rx="36" fill="${innerBgFill}" filter="url(#cardShadow)" stroke="${innerStroke}" stroke-width="1.5" />`
    }

      <!-- Inner Logos -->
      ${activeTemplateUrl ? '' : `
      <image href="${essentialsLogoUrl}" x="120" y="320" width="300" height="90" preserveAspectRatio="xMidYMid meet" />
      <image href="${healthLogoUrl}" x="480" y="320" width="300" height="90" preserveAspectRatio="xMidYMid meet" />
      `}

      <!-- Member Details -->
      <g transform="translate(180, 590)">
        <text x="0" y="0" class="member-name">${memberName}</text>
        <text x="0" y="38" class="member-plan">${displayPlanTitle}</text>
        <g transform="translate(0, 100)">
          <text x="0" y="0" class="lbl">One ID</text>
          <text x="0" y="28" class="val">${displayId}</text>
          <text x="170" y="0" class="lbl">Valid Until</text>
          <text x="170" y="28" class="val">${formattedExpiry}</text>
        </g>
      </g>

      <!-- QR Code Container -->
      <g transform="translate(570, 590)">
        <text x="70" y="-10" class="scan-lbl" text-anchor="middle">SCAN</text>
        <image href="${qrCodeDataUrl}" x="-10" y="-10" width="160" height="160" />
      </g>

    </svg>
  `.trim();

  // Convert SVG string to base64 Data URL
  const base64Svg = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${base64Svg}`;
}
