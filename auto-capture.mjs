#!/usr/bin/env node

/**
 * Automated Screenshot Capture for GitShip Demo GIF
 * Uses Puppeteer to automatically capture screenshots of all main pages
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const BASE_URL = process.env.REPL_URL || 'http://localhost:5000';

const pages = [
  {
    name: 'Landing Page',
    path: '/',
    filename: '01-landing.png',
    waitFor: 'h1',
    description: 'GitShip hero section and main features'
  },
  {
    name: 'OAuth Demo',
    path: '/oauth-demo',
    filename: '02-oauth-demo.png', 
    waitFor: '[data-provider]',
    description: 'Multi-provider OAuth authentication showcase'
  },
  {
    name: 'Templates',
    path: '/templates',
    filename: '03-templates.png',
    waitFor: '.template-card, [data-template]',
    description: 'Modern framework templates gallery'
  },
  {
    name: 'AI Copilot',
    path: '/ai-copilot',
    filename: '04-ai-copilot.png',
    waitFor: '.ai-feature, [data-ai]',
    description: 'AI-powered development tools demonstration'
  },
  {
    name: 'Guides',
    path: '/guides',
    filename: '05-guides.png',
    waitFor: '.guide-card, .guides-grid',
    description: 'Documentation and tutorial guides'
  },
  {
    name: 'Analytics',
    path: '/analytics',
    filename: '06-analytics.png',
    waitFor: '.analytics-chart, .metrics-card',
    description: 'Performance monitoring dashboard'
  }
];

async function captureScreenshots() {
  console.log('🚀 Starting automated screenshot capture for GitShip');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('');

  // Ensure screenshots directory exists
  try {
    await fs.mkdir('./screenshots', { recursive: true });
  } catch (err) {
    // Directory already exists
  }

  let browser;
  
  try {
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 1
    });

    console.log('📸 Capturing screenshots...');
    
    for (const pageConfig of pages) {
      try {
        const url = `${BASE_URL}${pageConfig.path}`;
        console.log(`  → ${pageConfig.name}: ${url}`);
        
        // Navigate to the page
        await page.goto(url, { 
          waitUntil: 'networkidle2',
          timeout: 10000 
        });

        // Wait a bit for animations and dynamic content
        await page.waitForTimeout(2000);

        // Try to wait for specific elements (optional, fallback to timeout)
        try {
          await page.waitForSelector(pageConfig.waitFor, { timeout: 3000 });
        } catch (err) {
          console.log(`    ⚠️ Selector "${pageConfig.waitFor}" not found, proceeding anyway`);
        }

        // Additional wait for any animations or dynamic loading
        await page.waitForTimeout(1000);

        // Take full page screenshot
        const screenshotPath = `./screenshots/${pageConfig.filename}`;
        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
          type: 'png'
        });

        console.log(`    ✅ Saved: ${pageConfig.filename}`);
        
      } catch (error) {
        console.log(`    ❌ Failed to capture ${pageConfig.name}: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Browser launch failed:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  console.log('');
  console.log('📊 Screenshot capture complete!');
}

async function createGif() {
  console.log('🎬 Creating GIF from screenshots...');
  
  try {
    // Check if ImageMagick is available
    await execAsync('convert --version');
    
    // Create the GIF
    const command = `cd screenshots && convert -delay 250 -loop 0 -resize 1200x -quality 85 ${pages.map(p => p.filename).join(' ')} ../gitship-demo.gif`;
    await execAsync(command);
    
    // Check file size
    const { stdout: sizeOutput } = await execAsync('du -h gitship-demo.gif');
    const fileSize = sizeOutput.split('\t')[0];
    
    console.log('✅ GIF created successfully!');
    console.log(`📊 File: gitship-demo.gif (${fileSize})`);
    console.log('');
    console.log('🔗 Add to your README.md:');
    console.log('![GitShip Demo](./gitship-demo.gif)');
    
  } catch (error) {
    console.error('❌ GIF creation failed:', error.message);
    console.log('💡 Alternative: Upload screenshots to ezgif.com manually');
  }
}

async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case '--capture':
      await captureScreenshots();
      break;
      
    case '--gif': 
      await createGif();
      break;
      
    case '--all':
      await captureScreenshots();
      await createGif();
      break;
      
    default:
      console.log('🚀 GitShip Automated Screenshot & GIF Creator');
      console.log('===========================================');
      console.log('');
      console.log('Usage:');
      console.log('  node auto-capture.mjs --capture    - Capture all screenshots automatically');
      console.log('  node auto-capture.mjs --gif        - Create GIF from existing screenshots');
      console.log('  node auto-capture.mjs --all        - Capture screenshots and create GIF');
      console.log('');
      console.log('Pages to capture:');
      pages.forEach((page, index) => {
        console.log(`  ${index + 1}. ${page.name} (${BASE_URL}${page.path})`);
      });
      break;
  }
}

main().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});