const fs = require('fs');
const buffer = fs.readFileSync('public/airo-one-logo.png');
// PNG header is 8 bytes, then chunks.
// Just to check if we can parse it, let's use a quick jimp or canvas script.
