const fs = require('fs');
let content = fs.readFileSync('src/app/admin/membership/page.tsx', 'utf8');

// 1. Add CardTemplateManager import
if (!content.includes('import { CardTemplateManager }')) {
  content = content.replace(
    'import { db } from "@/lib/firebase";',
    'import { db } from "@/lib/firebase";\nimport { CardTemplateManager } from "@/components/admin/CardTemplateManager";'
  );
}

// 2. Add activeTab state
if (!content.includes("const [activeTab, setActiveTab] = useState<'members' | 'templates'>('members');")) {
  content = content.replace(
    'const [loading, setLoading] = useState(true);',
    'const [loading, setLoading] = useState(true);\n  const [activeTab, setActiveTab] = useState<\'members\' | \'templates\'>(\'members\');'
  );
}

// 3. Add Tab Toggle Buttons in header
const tabsToggle = `
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('members')}
          className={\`pb-3 px-1 text-sm font-bold border-b-2 transition-colors \${activeTab === 'members' ? 'border-[#006537] text-[#006537]' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}
        >
          Members List
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          className={\`pb-3 px-1 text-sm font-bold border-b-2 transition-colors \${activeTab === 'templates' ? 'border-[#006537] text-[#006537]' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}
        >
          Card Templates
        </button>
      </div>
      
      {activeTab === 'templates' ? (
        <CardTemplateManager />
      ) : (
      <>
`;

if (!content.includes("activeTab === 'templates'")) {
  content = content.replace(
    '{/* Main Table Card */}',
    tabsToggle + '\n\n      {/* Main Table Card */}'
  );
  
  // Close the fragment at the bottom
  content = content.replace(
    '    </div>\n  );\n}\n',
    '    </>\n    )}\n    </div>\n  );\n}\n'
  );
}

fs.writeFileSync('src/app/admin/membership/page.tsx', content);
