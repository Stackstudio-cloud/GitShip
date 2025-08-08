import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync } from 'fs';

const execAsync = promisify(exec);

// Create simple colored placeholder images with page information
const pages = [
  { name: 'landing', color: '#f97316', title: 'GitShip Landing', subtitle: 'Deploy with Confidence' },
  { name: 'oauth', color: '#8b5cf6', title: 'OAuth Demo', subtitle: 'Multi-Provider Auth' },
  { name: 'templates', color: '#06b6d4', title: 'Templates', subtitle: 'React, Next.js, Vue' },
  { name: 'ai-copilot', color: '#10b981', title: 'AI Copilot', subtitle: 'Intelligent Tools' },
  { name: 'guides', color: '#f59e0b', title: 'Guides', subtitle: 'Documentation' },
  { name: 'analytics', color: '#ef4444', title: 'Analytics', subtitle: 'Performance Monitoring' }
];

console.log('Creating GitShip demo GIF with visual page representations...');

// Create screenshots directory
await execAsync('mkdir -p screenshots');

// Create representative images for each page
for (let i = 0; i < pages.length; i++) {
  const page = pages[i];
  const filename = `screenshots/${String(i + 1).padStart(2, '0')}-${page.name}.png`;
  
  // Create a representative image using ImageMagick
  const cmd = `convert -size 1200x800 xc:"#0f172a" \
    -fill "${page.color}" -draw "rectangle 50,50 1150,150" \
    -fill "#ffffff" -pointsize 72 -font DejaVu-Sans-Bold -gravity center \
    -draw "text 0,-250 'GitShip'" \
    -pointsize 48 -draw "text 0,-150 '${page.title}'" \
    -pointsize 32 -fill "#9ca3af" -draw "text 0,-80 '${page.subtitle}'" \
    -pointsize 24 -fill "${page.color}" -draw "text 0,200 'https://gitship.pro${i === 0 ? '' : '/' + page.name}'" \
    "${filename}"`;
  
  try {
    await execAsync(cmd);
    console.log(`Created: ${filename}`);
  } catch (error) {
    // Fallback: create simple solid color image
    const fallbackCmd = `convert -size 1200x800 xc:"${page.color}" "${filename}"`;
    await execAsync(fallbackCmd);
    console.log(`Created fallback: ${filename}`);
  }
}

// Create the GIF
console.log('Creating GIF...');
try {
  await execAsync(`convert -delay 200 -loop 0 screenshots/*.png gitship-demo.gif`);
  
  // Get file size
  const { stdout } = await execAsync('du -h gitship-demo.gif');
  const size = stdout.trim().split('\t')[0];
  
  console.log(`Successfully created: gitship-demo.gif (${size})`);
  console.log('Ready for your GitHub README!');
  
} catch (error) {
  console.error('Error creating GIF:', error.message);
}