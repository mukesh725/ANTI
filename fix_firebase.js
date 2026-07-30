const fs = require('fs');
let content = fs.readFileSync('src/lib/firebase.ts', 'utf8');

if (!content.includes('getStorage')) {
    content = content.replace('import { getAuth } from "firebase/auth";', 'import { getAuth } from "firebase/auth";\nimport { getStorage } from "firebase/storage";');
    content = content.replace('const auth = getAuth(app);', 'const auth = getAuth(app);\n\n// Initialize Storage\nconst storage = getStorage(app);');
    content = content.replace('export { db, auth, app };', 'export { db, auth, storage, app };');
    fs.writeFileSync('src/lib/firebase.ts', content);
    console.log('Firebase storage exported successfully.');
} else {
    console.log('Firebase storage already exported.');
}
