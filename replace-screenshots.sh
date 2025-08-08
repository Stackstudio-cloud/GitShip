#!/bin/bash

echo "🔄 GitShip Screenshot Replacement Guide"
echo "======================================"

# Your Replit URL
REPL_URL="${REPL_URL:-http://localhost:5000}"

echo "📍 Your GitShip is running at: $REPL_URL"
echo ""

echo "📸 To replace placeholder images with real screenshots:"
echo "1. Open your browser to your GitShip application"
echo "2. Take full-page screenshots of these pages:"
echo ""

pages=(
    "/:Landing Page with hero section"
    "/oauth-demo:OAuth authentication showcase"  
    "/templates:Modern framework templates"
    "/ai-copilot:AI-powered development tools"
    "/guides:Documentation and guides"
    "/analytics:Performance dashboard"
)

i=1
for page in "${pages[@]}"; do
    url_path=$(echo "$page" | cut -d: -f1)
    description=$(echo "$page" | cut -d: -f2)
    
    echo "   ${i}. ${REPL_URL}${url_path}"
    echo "      Save as: screenshots/$(printf "%02d" $i)-real.png"  
    echo "      ${description}"
    echo ""
    ((i++))
done

echo "3. After capturing all screenshots, run: ./replace-screenshots.sh --update-gif"
echo ""

# Function to update GIF with real screenshots
if [ "$1" = "--update-gif" ]; then
    echo "🔍 Checking for real screenshots..."
    
    missing=0
    for i in {1..6}; do
        file="screenshots/$(printf "%02d" $i)-real.png"
        if [ ! -f "$file" ]; then
            echo "❌ Missing: $file"
            missing=$((missing + 1))
        else
            echo "✅ Found: $file"
        fi
    done
    
    if [ $missing -eq 0 ]; then
        echo ""
        echo "🎬 Creating updated GIF with real screenshots..."
        convert -delay 250 -loop 0 -resize 1200x \
            screenshots/01-real.png \
            screenshots/02-real.png \
            screenshots/03-real.png \
            screenshots/04-real.png \
            screenshots/05-real.png \
            screenshots/06-real.png \
            gitship-demo.gif
        
        echo "✅ Updated gitship-demo.gif with real screenshots!"
        echo "📊 File size: $(du -h gitship-demo.gif | cut -f1)"
        echo ""
        echo "🚀 Your GitHub README is now ready with the real GitShip demo!"
    else
        echo "⚠️  Please capture all $missing missing screenshots first"
    fi

elif [ "$1" = "--quick-test" ]; then
    echo "🧪 Opening GitShip pages for quick testing..."
    echo "Copy these URLs to test your application:"
    for page in "${pages[@]}"; do
        url_path=$(echo "$page" | cut -d: -f1)
        echo "${REPL_URL}${url_path}"
    done
    
else
    echo "💡 Quick Commands:"
    echo "   ./replace-screenshots.sh --quick-test    # Test all page URLs"
    echo "   ./replace-screenshots.sh --update-gif    # Create GIF from real screenshots"
fi