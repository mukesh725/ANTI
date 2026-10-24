const fs = require('fs');
const path = require('path');
const http = require('http');

async function sync() {
  const rawData = fs.readFileSync(path.join(__dirname, 'src/data/cms.json'), 'utf8');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/cms/update',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(rawData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Response:', res.statusCode, data);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    console.log('Make sure your Next.js dev server is running on port 3000!');
  });

  req.write(rawData);
  req.end();
}

sync();
