import puppeteer from 'puppeteer';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const pages = [
  { path: '/', name: 'landing', delay: 3000 },
  { path: '/oauth-demo', name: 'oauth', delay: 3000 },
  { path: '/templates', name: 'templates', delay: 2500 },
  { path: '/ai-copilot', name: 'ai-copilot', delay: 2500 },
  { path: '/guides', name: 'guides', delay: 2000 },
  { path: '/analytics', name: 'analytics', delay: 2000 }
];

const BASE_URL = 'http://localhost:5000';

console.log('📸 Creating GitShip demo GIF...');

const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security'
  ]
});

const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 800 });

// Create screenshots directory
await execAsync('mkdir -p screenshots');

console.log('Capturing screenshots...');
for (let i = 0; i < pages.length; i++) {
  const pageConfig = pages[i];
  const url = `${BASE_URL}${pageConfig.path}`;
  
  console.log(`  ${i + 1}/6: ${url}`);
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
  await page.waitForTimeout(pageConfig.delay);
  
  await page.screenshot({
    path: `screenshots/${String(i + 1).padStart(2, '0')}-${pageConfig.name}.png`,
    fullPage: true
  });
}

await browser.close();

console.log('🎬 Creating GIF...');
await execAsync(`
  cd screenshots && 
  convert -delay 250 -loop 0 -resize 1200x -quality 85 \
    01-landing.png 02-oauth.png 03-templates.png \
    04-ai-copilot.png 05-guides.png 06-analytics.png \
    ../gitship-demo.gif
`);

const stats = await execAsync('du -h gitship-demo.gif');
console.log(`✅ Created: gitship-demo.gif (${stats.stdout.trim().split('\t')[0]})`);
console.log('🚀 Ready for your GitHub README!');