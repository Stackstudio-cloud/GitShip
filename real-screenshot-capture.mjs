import { JSDOM } from 'jsdom';
import * as htmlToImage from 'html-to-image';
import { writeFileSync, mkdirSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Setup JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.navigator = dom.window.navigator;

const BASE_URL = 'http://localhost:5000';

const pages = [
  { path: '/', name: 'landing' },
  { path: '/oauth-demo', name: 'oauth-demo' },
  { path: '/templates', name: 'templates' },
  { path: '/ai-copilot', name: 'ai-copilot' },
  { path: '/guides', name: 'guides' },
  { path: '/analytics', name: 'analytics' }
];

async function captureRealScreenshots() {
  console.log('Capturing real GitShip screenshots...');
  
  try {
    mkdirSync('real_screenshots', { recursive: true });
  } catch (e) {}

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const url = `${BASE_URL}${page.path}`;
    
    console.log(`Capturing ${i + 1}/6: ${page.name}`);
    
    try {
      // Fetch the HTML content
      const response = await fetch(url);
      const html = await response.text();
      
      // Create a DOM element with the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      tempDiv.style.width = '1200px';
      tempDiv.style.height = '800px';
      tempDiv.style.overflow = 'hidden';
      
      document.body.appendChild(tempDiv);
      
      // Convert to image
      const dataUrl = await htmlToImage.toPng(tempDiv, {
        width: 1200,
        height: 800,
        style: {
          backgroundColor: '#0f172a'
        }
      });
      
      // Convert data URL to buffer and save
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      const filename = `real_screenshots/${String(i + 1).padStart(2, '0')}-${page.name}.png`;
      writeFileSync(filename, buffer);
      
      console.log(`✓ Saved: ${filename}`);
      
      // Clean up
      document.body.removeChild(tempDiv);
      
    } catch (error) {
      console.log(`✗ Error capturing ${page.name}: ${error.message}`);
      
      // Create fallback image using ImageMagick
      const fallbackCmd = `convert -size 1200x800 xc:"#0f172a" -fill "#f97316" -pointsize 64 -gravity center -annotate +0-100 "GitShip" -fill "#ffffff" -pointsize 32 -annotate +0-20 "${page.name}" -fill "#9ca3af" -pointsize 24 -annotate +0+40 "${url}" real_screenshots/${String(i + 1).padStart(2, '0')}-${page.name}.png`;
      
      try {
        await execAsync(fallbackCmd);
        console.log(`✓ Created fallback for: ${page.name}`);
      } catch (fallbackError) {
        console.log(`✗ Fallback failed for ${page.name}`);
      }
    }
  }
  
  // Create GIF from all screenshots
  console.log('Creating GIF from screenshots...');
  
  try {
    await execAsync(`convert -delay 250 -loop 0 real_screenshots/*.png gitship-demo.gif`);
    
    const { stdout } = await execAsync('du -h gitship-demo.gif');
    const size = stdout.trim().split('\t')[0];
    
    console.log(`✅ Created: gitship-demo.gif (${size})`);
    console.log('Ready for GitHub README!');
    
  } catch (error) {
    console.log(`GIF creation error: ${error.message}`);
  }
}

captureRealScreenshots();