#!/bin/bash

# GitShip Demo GIF Creation Script
echo "🚀 GitShip Demo GIF Creation"
echo "============================"

# Create screenshots directory
mkdir -p screenshots

# Define the pages and their details
declare -A pages=(
    ["01-landing"]="/ - Landing Page with GitShip hero section"
    ["02-oauth-demo"]="/oauth-demo - OAuth authentication providers showcase" 
    ["03-templates"]="/templates - Modern framework templates gallery"
    ["04-ai-copilot"]="/ai-copilot - AI-powered development tools"
    ["05-guides"]="/guides - Step-by-step tutorials and guides"
    ["06-analytics"]="/analytics - Performance monitoring dashboard"
)

# Get the base URL (use Replit URL if available, otherwise localhost)
BASE_URL="${REPL_URL:-http://localhost:5000}"

echo "Base URL: $BASE_URL"
echo ""

# Display capture instructions
echo "📸 Manual Screenshot Instructions:"
echo "1. Open your browser to each URL below"
echo "2. Take full-page screenshots and save as PNG files"
echo "3. Save in ./screenshots/ directory with the exact filenames shown"
echo ""

for key in $(echo "${!pages[@]}" | tr ' ' '\n' | sort); do
    path_info="${pages[$key]}"
    path=$(echo "$path_info" | cut -d' ' -f1)
    description=$(echo "$path_info" | cut -d'-' -f2-)
    
    echo "Screenshot: ${key}.png"
    echo "URL: ${BASE_URL}${path}"
    echo "Description:${description}"
    echo ""
done

echo "🎬 After capturing all screenshots:"
echo "Run: ./create-gif.sh --make-gif"
echo ""

# Function to create GIF from screenshots
create_gif() {
    echo "Creating GIF from screenshots..."
    
    # Check if ImageMagick is available
    if command -v convert &> /dev/null; then
        echo "Using ImageMagick to create GIF..."
        cd screenshots
        convert -delay 250 -loop 0 -resize 1200x -quality 85 \
            01-landing.png 02-oauth-demo.png 03-templates.png \
            04-ai-copilot.png 05-guides.png 06-analytics.png \
            ../gitship-demo.gif
        cd ..
        
        if [ -f "gitship-demo.gif" ]; then
            echo "✅ GIF created successfully: gitship-demo.gif"
            
            # Get file size
            size=$(du -h gitship-demo.gif | cut -f1)
            echo "📊 File size: $size"
            
            echo ""
            echo "🔗 Add to your README.md:"
            echo "![GitShip Demo](./gitship-demo.gif)"
        else
            echo "❌ Failed to create GIF"
        fi
    else
        echo "⚠️  ImageMagick not found. Install it first:"
        echo "   Linux: sudo apt install imagemagick"
        echo "   macOS: brew install imagemagick"
        echo ""
        echo "Alternative: Use online tool like ezgif.com"
    fi
}

# Function to check if all screenshots exist
check_screenshots() {
    echo "🔍 Checking for screenshot files..."
    missing=0
    
    for key in $(echo "${!pages[@]}" | tr ' ' '\n' | sort); do
        file="screenshots/${key}.png"
        if [ -f "$file" ]; then
            echo "✅ Found: ${key}.png"
        else
            echo "❌ Missing: ${key}.png"
            missing=$((missing + 1))
        fi
    done
    
    if [ $missing -eq 0 ]; then
        echo "🎉 All screenshots found!"
        return 0
    else
        echo "⚠️  $missing screenshots missing"
        return 1
    fi
}

# Handle command line arguments
if [ "$1" = "--make-gif" ]; then
    if check_screenshots; then
        create_gif
    else
        echo "Please capture all screenshots first!"
        exit 1
    fi
elif [ "$1" = "--check" ]; then
    check_screenshots
elif [ "$1" = "--install-imagemagick" ]; then
    echo "Installing ImageMagick..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y imagemagick
    elif command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo "Please install ImageMagick manually for your system"
    fi
else
    echo "Usage:"
    echo "  ./create-gif.sh                 - Show screenshot instructions"
    echo "  ./create-gif.sh --check         - Check if all screenshots exist"
    echo "  ./create-gif.sh --make-gif      - Create GIF from screenshots"
    echo "  ./create-gif.sh --install-imagemagick - Install ImageMagick"
fi