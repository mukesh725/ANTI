const fs = require('fs');

let page = fs.readFileSync('src/app/admin/membership/page.tsx', 'utf8');

if (!page.includes('Card Templates')) {
  const tabsInsert = `          <button 
            onClick={() => setActiveTab('Settings')}
            className={\`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors \${activeTab === 'Settings' ? 'bg-[#006537] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}\`}
          >
            Settings
          </button>
        </div>`;
  
  page = page.replace('</div>\n\n      {/* Main Content */}'); // Need to find where to add tabs
  // Wait, let's just create a separate component or add it carefully.
}
