# GitShip Screenshots & GIF Creation Guide

This document outlines the process for creating animated GIFs from GitShip screenshots for the README.

## Required Screenshots

### 1. OAuth Demo Page (`/oauth-demo`)
- **Capture**: Full page showing all authentication providers
- **Focus**: Interactive provider cards with hover animations
- **Duration**: 3-4 seconds showing hover effects and connections

### 2. Dashboard (`/dashboard` or `/`)
- **Capture**: Main dashboard with project overview
- **Focus**: Navigation, project cards, and statistics
- **Duration**: 3-4 seconds scrolling through features

### 3. AI Copilot (`/ai-copilot`)
- **Capture**: AI analysis in action with code input and results
- **Focus**: Real-time analysis, scoring system, and insights
- **Duration**: 4-5 seconds showing analysis process

### 4. Templates Gallery (`/templates`)
- **Capture**: Template browsing with filtering and categories
- **Focus**: Template cards, category filtering, and search
- **Duration**: 3-4 seconds showing template exploration

## GIF Creation Process

### Tools Needed
- **Screen Recording**: OBS Studio, QuickTime, or similar
- **GIF Conversion**: FFmpeg, Gifski, or online converters
- **Optimization**: ImageOptim or similar

### Recording Settings
- **Resolution**: 1200x800 (maintains clarity while being GitHub-friendly)
- **Frame Rate**: 15-20 FPS (smooth but not excessive)
- **Duration**: 3-5 seconds per feature
- **File Size**: Target under 5MB per GIF

### Conversion Commands

```bash
# Using FFmpeg to create optimized GIFs
ffmpeg -i input.mp4 -vf "fps=15,scale=1200:-1:flags=lanczos,palettegen" palette.png
ffmpeg -i input.mp4 -i palette.png -vf "fps=15,scale=1200:-1:flags=lanczos,paletteuse" output.gif

# Optimize GIF size
gifsicle -O3 --lossy=80 -o optimized.gif input.gif
```

## GitHub Upload Process

1. Create GIFs for each feature
2. Upload to GitHub repository assets
3. Update README.md with correct asset URLs
4. Test all links to ensure they work

## File Naming Convention
- `oauth-demo-preview.gif`
- `dashboard-preview.gif`
- `ai-copilot-preview.gif`
- `templates-preview.gif`

## Demo URL Testing

Ensure all demo links work:
- Main Demo: https://bf3b7ef6-2392-4831-b5b9-fb66487d1eaf-00-1i5maa9yxi5y9.spock.replit.dev/
- OAuth Demo: https://bf3b7ef6-2392-4831-b5b9-fb66487d1eaf-00-1i5maa9yxi5y9.spock.replit.dev/oauth-demo
- Templates: https://bf3b7ef6-2392-4831-b5b9-fb66487d1eaf-00-1i5maa9yxi5y9.spock.replit.dev/templates
- AI Copilot: https://bf3b7ef6-2392-4831-b5b9-fb66487d1eaf-00-1i5maa9yxi5y9.spock.replit.dev/ai-copilot