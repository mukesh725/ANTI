const fs = require('fs');

let content = fs.readFileSync('src/lib/membershipCardGenerator.ts', 'utf8');

if (!content.includes('import { db }')) {
  content = content.replace(
    'import { generateMemberQRCode } from \'./qrCode\';',
    'import { generateMemberQRCode } from \'./qrCode\';\nimport { db } from \'./firebase\';\nimport { doc, getDoc } from \'firebase/firestore\';'
  );
}

const functionSignatureReplace = `
export async function generateDigitalMembershipCard(
  member: Partial<MemberRecord>,
  qrCodeDataUrl?: string,
  templates?: { Select?: string; Preferred?: string; Signature?: string }
): Promise<string> {
`;
content = content.replace(/export async function generateDigitalMembershipCard\([\s\S]*?\): Promise<string> \{/, functionSignatureReplace.trim() + " {");

const dbFetchLogic = `
  if (!templates) {
    try {
      const docRef = doc(db, 'global_settings', 'card_templates');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        templates = docSnap.data();
      }
    } catch (e) {
      console.error('Failed to fetch card templates', e);
    }
  }
`;

content = content.replace('const memberName =', dbFetchLogic + '\n  const memberName =');

// Base64 template urls
const templateBase64Logic = `
  // Base64 logo data URLs
  const airoOneLogoUrl = await getLogoDataUrl('airo-one-logo.png');
  const essentialsLogoUrl = await getLogoDataUrl('airo-essentials-logo.png');
  const healthLogoUrl = await getLogoDataUrl('airo-health-logo.png');

  let activeTemplateUrl = '';
  if (isSignature && templates?.Signature) {
    activeTemplateUrl = await getLogoDataUrl(templates.Signature.replace(process.env.NEXT_PUBLIC_BASE_URL || 'https://airoessentials.com/', ''));
  } else if (isPreferred && templates?.Preferred) {
    activeTemplateUrl = await getLogoDataUrl(templates.Preferred.replace(process.env.NEXT_PUBLIC_BASE_URL || 'https://airoessentials.com/', ''));
  } else if (isSelect && templates?.Select) {
    activeTemplateUrl = await getLogoDataUrl(templates.Select.replace(process.env.NEXT_PUBLIC_BASE_URL || 'https://airoessentials.com/', ''));
  }
`;

content = content.replace(/\/\/ Base64 logo data URLs[\s\S]*?const healthLogoUrl = await getLogoDataUrl\('airo-health-logo.png'\);/, templateBase64Logic);

// Now update SVG to use activeTemplateUrl if available
const svgReplace = `
      <!-- Outer Background Card -->
      \${activeTemplateUrl ? 
        \`<image href="\${activeTemplateUrl}" x="20" y="20" width="860" height="880" preserveAspectRatio="xMidYMid slice" style="clip-path: inset(0px round 44px);" />\` 
        : 
        \`<rect x="20" y="20" width="860" height="880" rx="44" fill="\${outerBgFill}" stroke="\${outerStroke}" stroke-width="2" />\`
      }
`;

content = content.replace(/<!-- Outer Background Card -->[\s\S]*?<image href="\$\{airoOneLogoUrl\}"/, svgReplace + '\n      <!-- Top Branding: AIRO 1 Custom Logo -->\n      <image href="${airoOneLogoUrl}"');

// Wait! clip-path in SVG needs to be a <clipPath> in <defs>, otherwise inline style="clip-path:..." might not work well across all SVG renderers.
// Let's create a standard clipPath just in case!
const clipPathDef = `
      <defs>
        <clipPath id="cardClip">
          <rect x="20" y="20" width="860" height="880" rx="44" />
        </clipPath>
        <style>
`;
content = content.replace(/<defs>\s*<style>/, clipPathDef);

const safeSvgReplace = `
      <!-- Outer Background Card -->
      \${activeTemplateUrl ? 
        \`<image href="\${activeTemplateUrl}" x="20" y="20" width="860" height="880" preserveAspectRatio="xMidYMid slice" clip-path="url(#cardClip)" />\` 
        : 
        \`<rect x="20" y="20" width="860" height="880" rx="44" fill="\${outerBgFill}" stroke="\${outerStroke}" stroke-width="2" />\`
      }
`;

content = content.replace(/<!-- Outer Background Card -->[\s\S]*?<!-- Top Branding: AIRO 1 Custom Logo -->/, safeSvgReplace + '\n      <!-- Top Branding: AIRO 1 Custom Logo -->');

fs.writeFileSync('src/lib/membershipCardGenerator.ts', content);
