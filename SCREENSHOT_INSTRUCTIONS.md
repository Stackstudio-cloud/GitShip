# Get Real GitShip Screenshots - Simple Method

Your GitShip is running at: http://localhost:5000

## Quick Screenshot Method

1. **Open your browser** to http://localhost:5000
2. **Take full-page screenshots** of these 6 pages:
   - `/` (Landing page)
   - `/oauth-demo` (OAuth providers)
   - `/templates` (Template gallery)  
   - `/ai-copilot` (AI features)
   - `/guides` (Documentation)
   - `/analytics` (Dashboard)

3. **Save them as PNG files** in the `screenshots/` folder:
   - `01-landing.png`
   - `02-oauth-demo.png`
   - `03-templates.png`
   - `04-ai-copilot.png`
   - `05-guides.png`
   - `06-analytics.png`

4. **Run this command** to create the GIF:
   ```bash
   convert -delay 250 -loop 0 screenshots/*.png gitship-demo.gif
   ```

## Browser Screenshot Tips

**Chrome/Edge:**
- F12 → Device Toolbar → Capture full size screenshot

**Firefox:** 
- F12 → Take screenshot → Save full page

**Safari:**
- Develop → Web Inspector → Take screenshot

## Alternative: Use Browser Extension
- Install "Full Page Screen Capture" or "FireShot"
- Navigate to each GitShip page
- Click extension → Take full page screenshot
- Save with the correct filename

The real GitShip interface will then be properly showcased in your GitHub README!