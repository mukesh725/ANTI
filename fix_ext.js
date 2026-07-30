const fs = require('fs');
let content = fs.readFileSync('src/lib/membershipCardGenerator.ts', 'utf8');

content = content.replace(/'templates\/gold\.png'/g, "'templates/gold.jpg'");
content = content.replace(/'templates\/silver\.png'/g, "'templates/silver.jpg'");
content = content.replace(/'templates\/black\.png'/g, "'templates/black.jpg'");

fs.writeFileSync('src/lib/membershipCardGenerator.ts', content);
