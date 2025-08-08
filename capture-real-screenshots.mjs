import puppeteer from 'puppeteer';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const BASE_URL = 'http://localhost:5000';

const pages = [
  { path: '/', name: 'landing', waitTime: 3000 },
  { path: '/oauth-demo', name: 'oauth-demo', waitTime: 3000 },
  { path: '/templates', name: 'templates', waitTime: 2500 },
  { path: '/ai-copilot', name: 'ai-copilot', waitTime: 2500 },
  { path: '/guides', name: 'guides', waitTime: 2000 },
  { path: '/analytics', name: 'analytics', waitTime: 2000 }
];

async function captureScreenshots() {
  console.log('Taking real screenshots of GitShip pages...');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions'
      ],
      executablePath: '/usr/bin/chromium-browser'
    });

    const page = await browser.newPage();
    
    // Set a good viewport size
    await page.setViewport({
      width: 1200,
      height: 900,
      deviceScaleFactor: 1
    });

    // Create screenshots directory
    await execAsync('mkdir -p screenshots');

    for (let i = 0; i < pages.length; i++) {
      const pageConfig = pages[i];
      const url = `${BASE_URL}${pageConfig.path}`;
      
      console.log(`Capturing ${i + 1}/6: ${pageConfig.name}`);
      
      try {
        await page.goto(url, { 
          waitUntil: 'networkidle0', 
          timeout: 15000 
        });
        
        // Wait for page content to load
        await page.waitForTimeout(pageConfig.waitTime);
        
        // Take screenshot
        await page.screenshot({
          path: `screenshots/${String(i + 1).padStart(2, '0')}-${pageConfig.name}.png`,
          fullPage: true,
          type: 'png'
        });
        
        console.log(`✓ Captured: ${pageConfig.name}.png`);
        
      } catch (error) {
        console.log(`⚠ Error capturing ${pageConfig.name}: ${error.message}`);
      }
    }

  } catch (error) {
    console.log(`Browser launch failed: ${error.message}`);
    console.log('Trying alternative approach...');
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return true;
}

async function createGif() {
  console.log('Creating GIF from screenshots...');
  
  try {
    await execAsync(`
      convert -delay 250 -loop 0 -resize 1200x -quality 90 \
        screenshots/01-landing.png \
        screenshots/02-oauth-demo.png \
        screenshots/03-templates.png \
        screenshots/04-ai-copilot.png \
        screenshots/05-guides.png \
        screenshots/06-analytics.png \
        gitship-demo.gif
    `);
    
    const { stdout } = await execAsync('du -h gitship-demo.gif');
    const size = stdout.trim().split('\t')[0];
    
    console.log(`✓ Created gitship-demo.gif (${size})`);
    return true;
    
  } catch (error) {
    console.log(`GIF creation failed: ${error.message}`);
    return false;
  }
}

// Main execution
const success = await captureScreenshots();
if (success) {
  await createGif();
  console.log('🎉 GitShip demo GIF ready for GitHub README!');
} else {
  console.log('Screenshot capture failed, keeping previous version');
}