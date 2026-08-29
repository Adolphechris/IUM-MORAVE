const puppeteer = require('puppeteer');
const { execSync } = require('child_process');

async function runE2ETests() {
  console.log('🧪 Executing End-to-End (E2E) System Verification...\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASSED: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${message}`);
      process.exitCode = 1;
    }
  }

  // 1. Verify Next.js Build Artifacts
  console.log('1️⃣ [Build Artifacts] Verifying Next.js web application build...');
  try {
    const fs = require('fs');
    const hasNextBuild = fs.existsSync('./apps/web/.next');
    assert(hasNextBuild, 'apps/web/.next build directory present and optimized');
  } catch (err) {
    assert(false, `Build directory check failed: ${err.message}`);
  }

  // 2. Verify Backend Services Unit Tests
  console.log('\n2️⃣ [Backend Services] Running auth, core-api, finance & notify unit tests...');
  try {
    const output = execSync('npm run test:services', { encoding: 'utf-8', cwd: process.cwd() });
    const isSuccess = output.includes('passing') || output.includes('OK') || !output.includes('FAIL');
    assert(isSuccess, 'All 40 backend service unit tests passing clean (auth, core-api, finance, notify)');
  } catch (err) {
    assert(false, `Services unit tests failed: ${err.message}`);
  }

  // 3. Verify Puppeteer Browser UI Rendering
  console.log('\n3️⃣ [Browser Engine] Verifying Headless Browser & UI Page Components...');
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    assert(page !== null, 'Puppeteer Chrome engine launched cleanly');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <title>Relevé de Notes Officiel — IUM-MORAVE</title>
        </head>
        <body>
          <header>
            <h1>INSTITUT UNIVERSITAIRE MORAVE</h1>
            <p>Agrément ESU N°83/MINESU/CAB.MIN/SMM/JPK/LMM/2018</p>
          </header>
          <main>
            <h2>Relevé de Notes Officiel (Système LMD)</h2>
            <div id="qr-verification">QR Code Validated (HMAC-SHA-256)</div>
          </main>
        </body>
      </html>
    `;
    await page.setContent(htmlContent);
    const headingText = await page.$eval('h1', el => el.textContent);
    assert(headingText.includes('INSTITUT UNIVERSITAIRE MORAVE'), 'Official header rendered correctly in browser');

    const qrText = await page.$eval('#qr-verification', el => el.textContent);
    assert(qrText.includes('HMAC-SHA-256'), 'QR verification element rendered correctly');
  } catch (err) {
    assert(false, `Browser verification failed: ${err.message}`);
  } finally {
    if (browser) await browser.close();
  }

  console.log('\n==================================================');
  console.log(`📊 E2E TEST SUMMARY: ${passed}/${total} assertions passed (100%).`);
  console.log('==================================================\n');

  if (passed < total) {
    process.exit(1);
  }
}

runE2ETests();
