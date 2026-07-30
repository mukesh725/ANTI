const fs = require('fs');

let content = fs.readFileSync('src/lib/membershipCardGenerator.ts', 'utf8');

// Remove filters from the string entirely to clean up
content = content.replace(/<!-- Logo Color Filters -->[\s\S]*?<!-- Gradients -->/, '<!-- Gradients -->');
content = content.replace(/<filter id="darkBrownLogo"[\s\S]*?<!-- Gradients -->/, '<!-- Gradients -->');
content = content.replace(/<filter id="darkBrownLogo">[\s\S]*?<!-- Gradients -->/, '<!-- Gradients -->');


// Remove the logoFilter, top branding text, and revert image y coordinate
const svgReplacement = `
      <!-- Outer Background Card -->
      <rect x="20" y="20" width="860" height="880" rx="44" fill="\${outerBgFill}" stroke="\${outerStroke}" stroke-width="2" />

      <!-- Top Branding: AIRO 1 Custom Logo -->
      <image href="\${airoOneLogoUrl}" x="150" y="70" width="600" height="180" preserveAspectRatio="xMidYMid meet" />

      <!-- Inner Digital Membership Card -->
`;

content = content.replace(/<!-- Outer Background Card -->[\s\S]*?<!-- Inner Digital Membership Card -->/, svgReplacement.trim() + '\n\n      <!-- Inner Digital Membership Card -->');

fs.writeFileSync('src/lib/membershipCardGenerator.ts', content);
