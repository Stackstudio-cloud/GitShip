// Simple workflow to capture and create GIF
// This will be used after manual screenshot capture

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function createGifFromScreenshots() {
  console.log('Creating GIF from captured screenshots...');
  
  // List available screenshots
  try {
    const { stdout } = await execAsync('ls -la screenshots/');
    console.log('Available screenshots:\n', stdout);
    
    // Create GIF from any PNG files in screenshots directory
    await execAsync(`
      cd screenshots && 
      convert -delay 300 -loop 0 -resize 1200x -quality 90 \
        *.png ../gitship-demo.gif 2>/dev/null || 
      convert -delay 300 -loop 0 *.png ../gitship-demo.gif
    `);
    
    const { stdout: size } = await execAsync('du -h gitship-demo.gif');
    console.log(`Created: gitship-demo.gif (${size.trim().split('\t')[0]})`);
    
  } catch (error) {
    console.log('Error:', error.message);
  }
}

// Run if called directly
if (process.argv[2] === '--create-gif') {
  createGifFromScreenshots();
}