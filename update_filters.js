const fs = require('fs');

let content = fs.readFileSync('src/lib/membershipCardGenerator.ts', 'utf8');

const replacement = `
        <!-- Logo Color Filters -->
        <filter id="blackLogo" x="-10%" y="-10%" width="120%" height="120%">
          <feFlood flood-color="#18181b" result="color" />
          <feComposite in="color" in2="SourceAlpha" operator="in" />
        </filter>
        <filter id="darkBrownLogo" x="-10%" y="-10%" width="120%" height="120%">
          <feFlood flood-color="#4a3b1a" result="color" />
          <feComposite in="color" in2="SourceAlpha" operator="in" />
        </filter>
`;

const regex = /<!-- Logo Color Filters for images with white background -->[\s\S]*?<\/filter>/;
content = content.replace(regex, replacement.trim());
fs.writeFileSync('src/lib/membershipCardGenerator.ts', content);
