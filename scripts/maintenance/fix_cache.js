const fs = require('fs');
let content = fs.readFileSync('src/lib/membershipCardGenerator.ts', 'utf8');

const updatedGetLogo = `
async function getLogoDataUrl(filename: string): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://airoessentials.com';
    let fetchUrl = filename.startsWith('http') ? filename : \`\${baseUrl}/\${filename.replace(/^\\/+/, '')}?v=\${Date.now()}\`;
    
    // Instant fallback for newly uploaded templates to GitHub before Vercel finishes deploying
    if (filename.includes('/uploads/')) {
      const filenameOnly = filename.split('/uploads/').pop();
      fetchUrl = \`https://raw.githubusercontent.com/mukesh725/ANTI/main/public/uploads/\${filenameOnly}?v=\${Date.now()}\`;
    }

    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      let mime = 'image/png';
      if (filename.endsWith('.svg')) mime = 'image/svg+xml';
      else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) mime = 'image/jpeg';

      return \`data:\${mime};base64,\${buffer.toString('base64')}\`;
    }
  } catch (e) {
    console.error(\`Logo read error for \${filename}:\`, e);
  }
  return filename.startsWith('http') ? filename : \`/\${filename.replace(/^\\/+/, '')}\`;
}
`;

content = content.replace(/async function getLogoDataUrl\([\s\S]*?return filename.startsWith\('http'\) \? filename : `\/\$\{filename.replace\(\/\^\\\\\/\\+\/, ''\)\}`;[\s\S]*?\}/, updatedGetLogo.trim());
fs.writeFileSync('src/lib/membershipCardGenerator.ts', content);
