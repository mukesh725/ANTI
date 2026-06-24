const fs = require('fs');
const path = require('path');

const files = [
  'src/app/admin/dashboard/page.tsx',
  'src/components/CmsEditor.tsx',
  'src/components/EcomManager.tsx',
  'src/components/admin/ProductManager.tsx'
];

const replacements = [
  { from: /bg-\[#07120F\]/g, to: 'bg-[#F4F7F6]' }, // Light pastel greenish-grey bg
  { from: /bg-\[#0B2114\]/g, to: 'bg-white' }, // White cards
  { from: /text-\[#FAF8F5\]/g, to: 'text-gray-800' },
  { from: /text-\[#D4AF37\]/g, to: 'text-emerald-600' }, // Pastel green accent
  { from: /border-\[#1A3324\]/g, to: 'border-emerald-100' },
  { from: /border-\[#0B2114\]/g, to: 'border-gray-200' },
  { from: /font-serif/g, to: 'font-sans font-medium' },
  { from: /text-white/g, to: 'text-gray-900' },
  { from: /text-\[#0B2114\]/g, to: 'text-gray-800' },
  { from: /bg-\[#FAF8F5\]/g, to: 'bg-white' },
  { from: /text-gray-400/g, to: 'text-gray-500' },
  { from: /text-gray-300/g, to: 'text-gray-600' },
  { from: /shadow-\[0_0_15px_rgba\(212,175,55,0\.3\)\]/g, to: 'shadow-sm' },
  { from: /shadow-\[0_0_50px_rgba\(212,175,55,0\.15\)\]/g, to: 'shadow-lg' },
  { from: /shadow-\[0_0_30px_rgba\(0,0,0,0\.5\)\]/g, to: 'shadow-md' },
  { from: /shadow-2xl/g, to: 'shadow-md' },
  { from: /shadow-xl/g, to: 'shadow-sm' },
  { from: /from-\[#1A3324\]/g, to: 'from-emerald-50' },
  { from: /to-\[#0B2114\]/g, to: 'to-white' },
  { from: /text-emerald-400/g, to: 'text-emerald-600' },
  { from: /bg-emerald-400/g, to: 'bg-emerald-500' },
  { from: /border-\[#234531\]/g, to: 'border-emerald-100' },
  { from: /focus:ring-\[#D4AF37\]\/50/g, to: 'focus:ring-emerald-200' },
  { from: /bg-black\/80/g, to: 'bg-gray-900/40' },
  { from: /bg-\[#1A3324\]/g, to: 'bg-emerald-50' }
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(r => {
      content = content.replace(r.from, r.to);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
