# 🔥 Firebase Setup Guide

You provided the config, but need to create the actual Firebase project first!

## 📋 Step-by-Step Setup:

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** 
3. Enter project name: `expense-tracker-4b2b8`
4. Continue through setup steps
5. Click **"Create project"**

### 2. Enable Firestore Database
1. In your new project, go to **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Choose **"Start in test mode"** (allows read/write for now)
4. Select a location (choose closest to you - likely "asia-south1")
5. Click **"Enable"**

### 3. Get Your Configuration
1. Go to **Project Settings** (⚙️ icon in left menu)
2. Under **"Your apps"**, click the **web app icon** (</>)
3. Copy the configuration details
4. **Your config should match what you provided:**
   ```
   apiKey: "AIzaSyCsoJAwj33dNq88HChLDf1jD-ntJs06sUs",
   authDomain: "expense-tracker-4b2b8.firebaseapp.com",
   projectId: "expense-tracker-4b2b8",
   storageBucket: "expense-tracker-4b2b8.firebasestorage.app",
   messagingSenderId: "993384078693",
   appId: "1:993384078693:web:6b07a44ae15a7cac59558c"
   ```

### 4. Deploy Firestore Rules
1. Open terminal in your project folder
2. Run: `firebase deploy --only firestore:rules`
3. This will deploy the security rules

## 🚀 After Setup:

### Test Your App:
1. **Open** `http://localhost:5174`
2. **Set your salary** (e.g., ₹50,000)
3. **Add expenses**
4. **Reload page** - data should persist

### Verify Firebase Working:
- No more "Demo Mode" warning
- Data saves to Firebase
- Data loads after page refresh

## 🔧 If You Get Errors:

### "Project not found":
- Make sure project name matches exactly: `expense-tracker-4b2b8`
- Check you're logged into correct Google account

### "Firestore not enabled":
- Go to Firestore Database in Firebase Console
- Click "Create database"

### "Permission denied":
- Make sure Firestore rules allow read/write
- Deploy the rules: `firebase deploy --only firestore:rules`

## 🎯 Quick Checklist:

- [ ] Firebase project created
- [ ] Firestore Database enabled  
- [ ] Project ID matches: `expense-tracker-4b2b8`
- [ ] Firestore rules deployed
- [ ] App shows no "Demo Mode" warning
- [ ] Data persists after refresh

---

**Once you complete these steps, your app will work perfectly!** 🎉

## 💡 Alternative: Use Demo Mode

If you don't want to set up Firebase right now, the app will continue working in demo mode with all features functional, but data won't persist after refresh.
