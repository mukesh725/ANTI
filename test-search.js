const { searchSynonyms } = require('./src/lib/searchSynonyms');

const query = "fever";
const normalizedQuery = query.toLowerCase().trim();

const keywords = new Set();
keywords.add(normalizedQuery);

const words = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
words.forEach(w => keywords.add(w));

for (const [key, syns] of Object.entries(searchSynonyms)) {
  if (normalizedQuery === key || words.includes(key)) {
    syns.forEach(s => keywords.add(s));
  }
}

for (const [key, syns] of Object.entries(searchSynonyms)) {
  if (normalizedQuery.includes(key) && normalizedQuery !== key) {
    syns.forEach(s => keywords.add(s));
  }
}

console.log("KEYWORDS:", Array.from(keywords));
