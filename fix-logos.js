const fs = require('fs');

const file = 'src/lib/membershipCardGenerator.ts';
let code = fs.readFileSync(file, 'utf8');

// Replace getLogoDataUrl
code = code.replace(
  /function getLogoDataUrl[\s\S]*?return `\/\$\{filename\}`;[\s\S]*?\}/,
  `async function getLogoDataUrl(filename: string): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://airoessentials.com';
    const res = await fetch(\`\${baseUrl}/\${filename}\`);
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return \`data:image/png;base64,\${buffer.toString('base64')}\`;
    }
  } catch (e) {
    console.error(\`Logo read error for \${filename}:\`, e);
  }
  return \`/\${filename}\`;
}`
);

// Update calls to getLogoDataUrl
code = code.replace(
  /const essentialsLogoUrl = getLogoDataUrl\('airo-essentials-logo\.png'\);/,
  "const essentialsLogoUrl = await getLogoDataUrl('airo-essentials-logo.png');"
);
code = code.replace(
  /const healthLogoUrl = getLogoDataUrl\('airo-health-logo\.png'\);/,
  "const healthLogoUrl = await getLogoDataUrl('airo-health-logo.png');"
);

fs.writeFileSync(file, code);
