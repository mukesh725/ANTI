const fs = require('fs');
let content = fs.readFileSync('src/lib/membershipCardGenerator.ts', 'utf8');

const updatedLogic = `
  let activeTemplateUrl = '';
  if (isSignature) {
    activeTemplateUrl = await getLogoDataUrl(templates?.Signature ? templates.Signature.replace(process.env.NEXT_PUBLIC_BASE_URL || 'https://airoessentials.com/', '') : 'templates/gold.png');
  } else if (isPreferred) {
    activeTemplateUrl = await getLogoDataUrl(templates?.Preferred ? templates.Preferred.replace(process.env.NEXT_PUBLIC_BASE_URL || 'https://airoessentials.com/', '') : 'templates/silver.png');
  } else if (isSelect) {
    activeTemplateUrl = await getLogoDataUrl(templates?.Select ? templates.Select.replace(process.env.NEXT_PUBLIC_BASE_URL || 'https://airoessentials.com/', '') : 'templates/black.png');
  }
`;

content = content.replace(/let activeTemplateUrl = '';[\s\S]*?\} else if \(isSelect && templates\?\.Select\) \{[\s\S]*?\}/, updatedLogic.trim());

fs.writeFileSync('src/lib/membershipCardGenerator.ts', content);
