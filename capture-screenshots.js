#!/usr/bin/env node
/**
 * GitShip Screenshot Capture Helper
 * This script helps organize the screenshot capture process for the GitHub README gif
 */

const pages = [
  {
    name: "Landing Page",
    path: "/",
    filename: "01-landing.png",
    description: "Hero section with GitShip branding and 'Deploy with Confidence' messaging"
  },
  {
    name: "OAuth Demo",
    path: "/oauth-demo", 
    filename: "02-oauth-demo.png",
    description: "Multi-provider authentication showcase (Replit, GitHub, Google, Twitter, Apple, Email)"
  },
  {
    name: "Templates",
    path: "/templates",
    filename: "03-templates.png", 
    description: "Modern framework templates with one-click deployment options"
  },
  {
    name: "AI Copilot",
    path: "/ai-copilot",
    filename: "04-ai-copilot.png",
    description: "AI-powered development tools and code analysis features"
  },
  {
    name: "Guides",
    path: "/guides",
    filename: "05-guides.png",
    description: "Step-by-step tutorials and documentation"
  },
  {
    name: "Analytics",
    path: "/analytics", 
    filename: "06-analytics.png",
    description: "Performance monitoring and deployment metrics dashboard"
  }
];

const baseUrl = process.env.REPL_URL || "http://localhost:5000";

console.log("🚀 GitShip Screenshot Capture Guide");
console.log("=====================================\n");

console.log(`Base URL: ${baseUrl}\n`);

pages.forEach((page, index) => {
  const url = `${baseUrl}${page.path}`;
  console.log(`${index + 1}. ${page.name}`);
  console.log(`   URL: ${url}`);
  console.log(`   File: ${page.filename}`);  
  console.log(`   Features: ${page.description}`);
  console.log("");
});

console.log("📸 Screenshot Instructions:");
console.log("1. Open each URL in your browser");
console.log("2. Wait for page to fully load and animations to complete");
console.log("3. Take full-page screenshot and save with the suggested filename");
console.log("4. Use consistent window size (1200px+ width recommended)");
console.log("");

console.log("🎬 Creating the GIF:");
console.log("Option 1 - Online: Upload to ezgif.com/maker");
console.log("Option 2 - ImageMagick: convert -delay 200 -loop 0 *.png gitship-demo.gif");
console.log("Option 3 - FFmpeg: ffmpeg -framerate 0.5 -i %02d-*.png gitship-demo.gif");
console.log("");

console.log("📋 For GitHub README:");
console.log("![GitShip Demo](./assets/gitship-demo.gif)");

// If running with --urls flag, just output URLs for easy copying
if (process.argv.includes('--urls')) {
  console.log("\n🔗 URLs only:");
  pages.forEach(page => {
    console.log(`${baseUrl}${page.path}`);
  });
}

// If running with --check flag, test if server is responding  
if (process.argv.includes('--check')) {
  console.log("\n🔍 Checking server status...");
  
  const http = require('http');
  
  const checkUrl = (url) => {
    return new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        resolve({ status: res.statusCode, url });
      });
      req.on('error', (err) => {
        reject({ error: err.message, url });
      });
      req.setTimeout(5000, () => {
        req.destroy();
        reject({ error: 'Timeout', url });
      });
    });
  };

  Promise.all(pages.map(page => 
    checkUrl(`${baseUrl}${page.path}`)
      .then(result => ({ ...page, ...result }))
      .catch(error => ({ ...page, ...error }))
  )).then(results => {
    results.forEach(result => {
      const status = result.status === 200 ? '✅' : result.error ? '❌' : '⚠️';
      console.log(`${status} ${result.name}: ${result.status || result.error}`);
    });
  });
}