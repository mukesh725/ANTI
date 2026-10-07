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
    const localPath = path.join(process.cwd(), 'public', filename.replace(/^\/+/, ''));
    if (fs.existsSync(localPath)) {
      const buffer = fs.readFileSync(localPath);
      let mime = 'image/png';
      if (filename.endsWith('.svg')) mime = 'image/svg+xml';
      else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) mime = 'image/jpeg';
      return `data:${mime};base64,${buffer.toString('base64')}`;
    }
  } catch (e) {
    // continue to fetch fallback
  }

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

  // Format plan title e.g. "Preferred Member", "Signature Member", "Select Member", "Infinite Member"
  let rawPlan = member.membershipPlan || 'Preferred';
  if (!rawPlan.toLowerCase().includes('member')) {
    if (rawPlan.toLowerCase().includes('infinite')) rawPlan = 'Infinite Member';
    else if (rawPlan.toLowerCase().includes('signature')) rawPlan = 'Signature Member';
    else if (rawPlan.toLowerCase().includes('preferred')) rawPlan = 'Preferred Member';
    else if (rawPlan.toLowerCase().includes('select')) rawPlan = 'Select Member';
    else rawPlan = `${rawPlan} Member`;
  }
  const displayPlanTitle = rawPlan;

  const isInfinite = displayPlanTitle.includes('Infinite');
  const isSignature = displayPlanTitle.includes('Signature');
  const isPreferred = displayPlanTitle.includes('Preferred');
  const isSelect = displayPlanTitle.includes('Select') || (!isInfinite && !isSignature && !isPreferred);

  // Base64 logo data URLs
  const airoOneLogoUrl = await getLogoDataUrl('airo-one-logo.png');
  const essentialsLogoUrl = await getLogoDataUrl('airo-essentials-logo.png');
  const healthLogoUrl = await getLogoDataUrl('airo-health-logo.png');

  let activeTemplateUrl = '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://airoessentials.com';
  let templateFileName = '';
  if (isInfinite) {
    templateFileName = 'infinite.jpg';
  } else if (isSignature) {
    templateFileName = 'signature.jpg';
  } else if (isPreferred) {
    templateFileName = 'preferred.jpg';
  } else if (isSelect) {
    templateFileName = 'select.jpg';
  }

  // 1. Try local filesystem read first (instant, 0ms, reliable across server and edge)
  if (templateFileName) {
    try {
      const localTemplatePath = path.join(process.cwd(), 'public', 'templates', templateFileName);
      if (fs.existsSync(localTemplatePath)) {
        const buffer = fs.readFileSync(localTemplatePath);
        activeTemplateUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      }
    } catch (e) {
      console.warn('Local template read failed, falling back to fetch', e);
    }
  }

  // 2. Fallback to network fetch if local file not found or if custom remote template was provided
  if (!activeTemplateUrl && templateFileName) {
    const templatePath = (templates as any)?.[rawPlan.split(' ')[0]] || `${baseUrl}/templates/${templateFileName}`;
    try {
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

  if (isInfinite) {
    outerBgFill = 'url(#infOuterGrad)';
    innerBgFill = 'url(#infInnerGrad)';
    outerStroke = '#10b981';
    innerStroke = '#34d399';
    textColor = activeTemplateUrl ? '#1e293b' : '#6ee7b7';
    textNameColor = activeTemplateUrl ? '#0f172a' : '#ffffff';
  } else if (isSignature) {
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

  // Calculate dynamic typography based on name length to strictly prevent any overlap with QR code
  const rawNameLen = memberName.length;
  const isAllUpper = memberName === memberName.toUpperCase() && /[A-Z]/.test(memberName);
  const glyphFactor = isAllUpper ? 0.69 : 0.58;
  const maxAvailableWidth = 350;

  let nameFontSize = 30;
  if (rawNameLen <= 14) {
    nameFontSize = isAllUpper ? 28 : 30;
  } else if (rawNameLen <= 18) {
    nameFontSize = isAllUpper ? 24 : 26;
  } else if (rawNameLen <= 22) {
    nameFontSize = isAllUpper ? 21 : 23;
  } else if (rawNameLen <= 27) {
    nameFontSize = isAllUpper ? 18.5 : 20;
  } else if (rawNameLen <= 33) {
    nameFontSize = isAllUpper ? 16 : 17.5;
  } else {
    nameFontSize = Math.max(13, Math.floor(maxAvailableWidth / (rawNameLen * glyphFactor)));
  }

  // Proportionally scale plan title so member name is always the dominant element
  let planFontSize = 24;
  if (nameFontSize <= 16) planFontSize = 14;
  else if (nameFontSize <= 19) planFontSize = 16;
  else if (nameFontSize <= 23) planFontSize = 18;
  else if (nameFontSize <= 27) planFontSize = 20;
  else planFontSize = 22;

  // Strict boundary clamp ensuring text can never exceed maxAvailableWidth (350px)
  const estimatedWidth = rawNameLen * nameFontSize * glyphFactor;
  const nameTextLengthAttr = (estimatedWidth > maxAvailableWidth || rawNameLen > 28)
    ? `textLength="${maxAvailableWidth}" lengthAdjust="spacingAndGlyphs"`
    : '';

  const planTextLengthAttr = (displayPlanTitle.length > 24)
    ? `textLength="${maxAvailableWidth}" lengthAdjust="spacingAndGlyphs"`
    : '';

  const escapeXml = (str: string) =>
    str.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });

  // Dynamic Dimensions
  const svgWidth = 900;
  const svgHeight = 920;
  const cardWidth = 860;
  const cardHeight = 880;

  // SVG graphic matching the exact card design
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
      
      <defs>
        <clipPath id="cardClip">
          <rect x="20" y="20" width="${cardWidth}" height="${cardHeight}" rx="44" />
        </clipPath>
        <style>
          .member-name { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 500; font-size: ${nameFontSize}px; fill: ${textNameColor}; }
          .member-plan { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 400; font-size: ${planFontSize}px; fill: ${textColor}; }
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
        <linearGradient id="infOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#064e3b" />
          <stop offset="100%" stop-color="#022c22" />
        </linearGradient>
        <linearGradient id="infInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#064e3b" />
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
        <text x="0" y="0" class="member-name" ${nameTextLengthAttr}>${escapeXml(memberName)}</text>
        <text x="0" y="38" class="member-plan" ${planTextLengthAttr}>${escapeXml(displayPlanTitle)}</text>
        <g transform="translate(0, 100)">
          <text x="0" y="0" class="lbl">One ID</text>
          <text x="0" y="28" class="val">${escapeXml(displayId)}</text>
          <text x="170" y="0" class="lbl">Valid Until</text>
          <text x="170" y="28" class="val">${escapeXml(formattedExpiry)}</text>
        </g>
      </g>

      <!-- QR Code Container -->
      <g transform="translate(570, 590)">
        <text x="70" y="-20" class="scan-lbl" text-anchor="middle">SCAN</text>
        <image href="${qrCodeDataUrl}" x="-10" y="-10" width="160" height="160" />
      </g>

    </svg>
  `.trim();

  // Convert SVG string to base64 Data URL
  const base64Svg = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${base64Svg}`;
}
