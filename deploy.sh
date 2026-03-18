#!/bin/bash

# AI Expense Tracker Deployment Script

echo "🚀 Starting AI Expense Tracker Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build for production
echo "🔨 Building for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files created in: dist/"
    
    # Check if dist folder exists
    if [ -d "dist" ]; then
        echo "📊 Build size:"
        du -sh dist/
        
        echo ""
        echo "🌐 Ready for deployment!"
        echo ""
        echo "Choose your hosting platform:"
        echo "1. Netlify:   netlify deploy --prod --dir=dist"
        echo "2. Vercel:    vercel --prod"
        echo "3. Firebase:    firebase deploy --only hosting"
        echo "4. GitHub:    Push dist/ to gh-pages branch"
        echo ""
        echo "📝 Don't forget to:"
        echo "   - Set production environment variables"
        echo "   - Configure domain settings"
        echo "   - Test on staging first"
    else
        echo "❌ Build failed!"
        exit 1
    fi
else
    echo "❌ Build directory not found!"
    exit 1
fi
