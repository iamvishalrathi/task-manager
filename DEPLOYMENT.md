# 🚀 Deployment Guide for Task Manager

## Issue: Login Error on Deployed Site

### Root Cause
The login error occurs because MSW (Mock Service Worker) was only enabled in development. In production, there's no backend to handle authentication requests.

### ✅ Solution Applied

1. **Updated MSW Configuration**: Now works in both development and production
2. **Environment Variable Control**: Use `VITE_ENABLE_MSW=true` to enable MSW in production
3. **Service Worker File**: Automatically copied to dist folder during build

## 🔧 Deployment Instructions

### For Vercel:
1. **Environment Variables** (add in Vercel dashboard):
   ```
   VITE_ENABLE_MSW=true
   VITE_DEMO_MODE=true
   ```

2. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### For Netlify:
1. **Environment Variables** (add in Netlify dashboard):
   ```
   VITE_ENABLE_MSW=true
   VITE_DEMO_MODE=true
   ```

2. **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### For Manual Deployment:
1. **Build with MSW enabled**:
   ```bash
   VITE_ENABLE_MSW=true npm run build
   ```

2. **Serve the dist folder** with any static server

## 🧪 Testing the Fix

### Local Testing:
```bash
# Test production build locally
npm run build
npm run preview
```

### Production Testing:
1. Deploy with `VITE_ENABLE_MSW=true`
2. Open browser developer tools
3. Look for: `✅ MSW started successfully - API requests will be mocked`
4. Try logging in with demo credentials:
   - Username: `demo@example.com`
   - Password: `password`

## ⚠️ Important Notes

1. **Demo Purpose**: MSW in production is for demo/portfolio purposes only
2. **Real Production**: In real apps, you'd connect to actual backend APIs
3. **Service Worker**: The mockServiceWorker.js file must be served from the root
4. **HTTPS**: Some deployment platforms require HTTPS for service workers

## 🔍 Troubleshooting

### If login still fails:
1. Check browser console for MSW logs
2. Verify `VITE_ENABLE_MSW=true` is set
3. Ensure mockServiceWorker.js is accessible at `/mockServiceWorker.js`
4. Clear browser cache and service worker registration

### Common Issues:
- **Service Worker Registration**: Clear browser data if updating
- **CORS Issues**: MSW bypasses CORS in browser
- **Network Tab**: Should show intercepted requests with MSW comments

## 🎯 Demo Credentials

- **Username**: `demo@example.com` or `test@example.com`
- **Password**: `password` or `test123`

The application now works identically in development and production! 🎉
