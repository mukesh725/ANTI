const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  await page.goto('http://localhost:3000/membership', { waitUntil: 'networkidle0' });
  
  // Enter mobile
  await page.waitForSelector('input[type="tel"]');
  await page.type('input[type="tel"]', '9876543210');
  await page.click('button:has-text("Send OTP")');

  // Wait for OTP screen
  await page.waitForSelector('input[inputmode="numeric"]');
  // Type OTP
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press((i + 1).toString()); // type 123456
  }
  
  // Wait for Verify OTP button if auto-submit doesn't trigger immediately
  await new Promise(r => setTimeout(r, 1000));
  // if button is enabled, click it
  const verifyBtn = await page.$('button:has-text("Verify OTP")');
  if (verifyBtn) {
    const disabled = await page.evaluate(el => el.disabled, verifyBtn);
    if (!disabled) await verifyBtn.click();
  }

  // Wait for Account details
  await page.waitForSelector('input[name="firstName"]', { timeout: 5000 });
  await page.type('input[name="firstName"]', 'John');
  await page.type('input[name="email"]', 'john@example.com');
  
  await page.click('button:has-text("Save & Continue")');

  // Wait for the error or next screen
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})();
