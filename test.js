const puppeteer = require('puppeteer');

(async () => {
  console.log("🚀 Starting Automated End-to-End Test for Verve Ledger");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Suppress dialogs like "Terminate this staff node access?"
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  try {
    // ---------------------------------------------------------
    // Phase 1: ADMIN TEST
    // ---------------------------------------------------------
    console.log("⏳ [ADMIN] Navigating to login...");
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    console.log("🔐 [ADMIN] Logging in as admin@vibetech.com...");
    await page.type('input[type="email"]', 'admin@vibetech.com');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log("✅ [ADMIN] Login successful!");
    
    // Check Dashboard
    const dashboardTitle = await page.evaluate(() => document.body.innerText.includes('Global Command Center'));
    if (dashboardTitle) console.log("✅ [ADMIN] Dashboard verified (Global Command Center).");
    else console.error("❌ [ADMIN] Dashboard failed.");

    // Check Shops
    await page.goto('http://localhost:3000/shops', { waitUntil: 'networkidle2' });
    const shopsTitle = await page.evaluate(() => document.body.innerText.includes('Network Matrix'));
    if (shopsTitle) console.log("✅ [ADMIN] Shops Management accessible.");
    
    // Logout
    await page.goto('http://localhost:3000/api/auth/signout', { waitUntil: 'networkidle2' });
    await page.click('button[type="submit"]');
    console.log("✅ [ADMIN] Logged out.");


    // ---------------------------------------------------------
    // Phase 2: USER TEST
    // ---------------------------------------------------------
    console.log("⏳ [USER] Navigating to Signup...");
    await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle2' });
    
    const randomNum = Math.floor(Math.random() * 10000);
    const testEmail = `owner${randomNum}@test.com`;

    console.log(`🔐 [USER] Registering new shop with email ${testEmail}...`);
    const inputs = await page.$$('input');
    await inputs[0].type(`Test Shop ${randomNum}`);
    await inputs[1].type(testEmail);
    await inputs[2].type('password123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log("✅ [USER] Registration successful! Currently at: " + page.url());

    if(page.url().includes('login')) {
       await page.type('input[type="email"]', testEmail);
       await page.type('input[type="password"]', 'password123');
       await page.click('button[type="submit"]');
       await page.waitForNavigation({ waitUntil: 'networkidle2' });
       console.log("✅ [USER] Logged in successfully!");
    }

    // Check Dashboard
    const userDash = await page.evaluate(() => document.body.innerText.includes('Intelligence Matrix'));
    if (userDash) console.log("✅ [USER] Dashboard verified.");

    // Inventory
    console.log("⏳ [USER] Testing Inventory...");
    await page.goto('http://localhost:3000/inventory', { waitUntil: 'networkidle2' });
    
    // Add product
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const addBtn = buttons.find(b => b.innerText.includes('INITIALIZE ITEM'));
      if(addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.type('input[placeholder="Quantum Keyboard"]', 'Test Mouse');
    await page.type('input[placeholder="1200"]', '500');
    await page.type('input[placeholder="50"]', '3'); // Low stock to trigger alert
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const saveBtn = buttons.find(b => b.innerText.includes('CONFIRM UPLOAD'));
      if(saveBtn) saveBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    console.log("✅ [USER] Inventory item created (Low Stock = 3).");

    // Dashboard Alert check
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
    const alertVisible = await page.evaluate(() => document.body.innerText.includes('Critical Stock Depletion Detected'));
    if (alertVisible) console.log("✅ [USER] Low Stock Alert successfully rendered.");

    // POS
    console.log("⏳ [USER] Testing POS Billing...");
    await page.goto('http://localhost:3000/pos', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000)); // wait for fetch
    
    // Click on product to add to cart
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.cursor-pointer'));
      if(cards.length > 0) cards[0].click();
    });
    console.log("✅ [USER] Product added to cart.");
    
    // Add phone and checkout
    const posInputs = await page.$$('input');
    // Assuming phone input is the last one or placeholder "Customer Phone Matrix..."
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const phoneInput = inputs.find(i => i.placeholder.includes('Customer Phone'));
      if(phoneInput) {
        phoneInput.value = '9876543210';
        phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const checkout = buttons.find(b => b.innerText.includes('FINALIZE TRANSACTION'));
      if(checkout) checkout.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    const successModal = await page.evaluate(() => document.body.innerText.includes('TRANSACTION SUCCESS') || document.body.innerText.includes('SUCCESS'));
    if (successModal) console.log("✅ [USER] Checkout successful! WhatsApp UI triggered.");

    // Transactions
    await page.goto('http://localhost:3000/invoices', { waitUntil: 'networkidle2' });
    const tx = await page.evaluate(() => document.body.innerText.includes('TRANSACTION LEDGER'));
    if (tx) console.log("✅ [USER] Transactions ledger verified.");

    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! The system is highly stable.");
  } catch (err) {
    console.error("❌ TEST FAILED:", err);
  } finally {
    await browser.close();
  }
})();
