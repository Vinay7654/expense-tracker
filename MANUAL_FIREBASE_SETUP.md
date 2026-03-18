# 🔧 Manual Firebase Setup (CLI Issues)

Since Firebase CLI has path issues, let's do this manually!

## 📋 Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Add project"**
3. **Project name**: `expense-tracker-4b2b8`
4. **Continue** through all setup steps
5. **Click "Create project"**

## 📋 Step 2: Enable Firestore

1. **In your project**, go to **"Firestore Database"** (left menu)
2. **Click "Create database"**
3. **Choose "Start in test mode"**
4. **Location**: Select `asia-south1` (closest to India)
5. **Click "Enable"**

## 📋 Step 3: Get Project ID

1. **Go to Project Settings** (⚙️ icon)
2. **Copy your Project ID** - should be: `expense-tracker-4b2b8`

## 📋 Step 4: Update .env (Already Done!)

Your `.env` file already has the correct config:
```
VITE_FIREBASE_API_KEY=AIzaSyCsoJAwj33dNq88HChLDf1jD-ntJs06sUs
VITE_FIREBASE_AUTH_DOMAIN=expense-tracker-4b2b8.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=expense-tracker-4b2b8
VITE_FIREBASE_STORAGE_BUCKET=expense-tracker-4b2b8.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=993384078693
VITE_FIREBASE_APP_ID=1:993384078693:web:6b07a44ae15a7cac59558c
VITE_GEMINI_API_KEY=AIzaSyAr9wgLFXyDXim4ViqPCKP-W-mMutB-0Vs
```

## 📋 Step 5: Test Your App

1. **Restart your dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Open**: http://localhost:5174

3. **Should see**:
   - ❌ No "Demo Mode" warning
   - ✅ Real Firebase connection
   - ✅ Data persists after refresh

## 🔧 If Still Shows Demo Mode:

### Check Console for Errors:
1. **Open browser dev tools** (F12)
2. **Look at Console tab**
3. **Common errors**:
   - "Missing or insufficient permissions"
   - "Project not found"
   - "Network error"

### Verify Project Exists:
1. **Go to Firebase Console**
2. **Check project list** - should see `expense-tracker-4b2b8`
3. **If not there**, recreate project with exact name

### Verify Firestore Enabled:
1. **In Firebase Console**
2. **Go to Firestore Database**
3. **Should see database interface**

## 🎯 Success Indicators:

✅ **Working Firebase**:
- No "Demo Mode" warning
- Data saves permanently
- Data loads after page refresh
- No console errors

❌ **Still Demo Mode**:
- Still shows "Demo Mode" warning
- Data resets on refresh
- Console shows Firebase errors

## 🚀 Alternative: Use Demo Mode

If Firebase setup is too complex, your app works perfectly in demo mode with:
- All features functional
- Indian currency and categories
- AI insights (demo version)
- Just no data persistence

---

**Try these steps and let me know what happens!** 🎉
