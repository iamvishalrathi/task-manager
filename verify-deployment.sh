#!/bin/bash

# Deployment Verification Script
echo "🔍 Verifying Task Manager Deployment Configuration..."

# Check if MSW service worker exists
if [ -f "public/mockServiceWorker.js" ]; then
    echo "✅ MSW Service Worker found in public/"
else
    echo "❌ MSW Service Worker missing from public/"
    exit 1
fi

# Check if environment file exists
if [ -f ".env.production" ]; then
    echo "✅ Production environment file found"
else
    echo "⚠️  Production environment file not found"
fi

# Build the project
echo "📦 Building project..."
npm run build

# Check if MSW service worker is copied to dist
if [ -f "dist/mockServiceWorker.js" ]; then
    echo "✅ MSW Service Worker copied to dist/"
else
    echo "❌ MSW Service Worker missing from dist/"
    exit 1
fi

# Check bundle size
BUNDLE_SIZE=$(du -sh dist | cut -f1)
echo "📊 Bundle size: $BUNDLE_SIZE"

echo ""
echo "🎉 Deployment verification complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set VITE_ENABLE_MSW=true in your deployment platform"
echo "2. Deploy the dist/ folder"
echo "3. Test login with demo@example.com / password"
echo ""
echo "🔗 Demo credentials:"
echo "   Username: demo@example.com"
echo "   Password: password"
