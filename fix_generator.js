const fs = require('fs');
let content = fs.readFileSync('src/lib/membershipCardGenerator.ts', 'utf8');

// Add imports
if (!content.includes("import { db }")) {
  content = `import { db } from '@/lib/firebase';\nimport { doc, getDoc } from 'firebase/firestore';\n` + content;
}

// Fix double brace
content = content.replace('): Promise<string> { {', '): Promise<string> {');

fs.writeFileSync('src/lib/membershipCardGenerator.ts', content);
