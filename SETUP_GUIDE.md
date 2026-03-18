# 🔧 Setup Guide for AI Expense Tracker

Your app is now running in **Demo Mode**! This means you can test all features without configuring Firebase or Gemini API. However, to save data permanently and use real AI insights, follow these steps:

## 🚀 Current Status: ✅ Working in Demo Mode

The app is currently running at `http://localhost:5174` with:
- ✅ Demo data (3 sample expenses)
- ✅ Demo AI insights (smart financial advice)
- ✅ All features working (add/delete expenses, charts, dashboard)
- ⚠️ Data resets when you refresh the page

## 🔥 To Enable Full Features (Optional)

### 1. Set Up Firebase (for permanent data storage)

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name: "expense-tracker"
   - Continue through setup steps

2. **Enable Firestore Database**
   - In your Firebase project, go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode" (for now)
   - Select a location (choose closest to you)

3. **Get Firebase Configuration**
   - Go to Project Settings (⚙️ icon)
   - Under "Your apps", click the web app icon (</>)
   - Copy the configuration details

4. **Update .env file**
   Replace the placeholder values in `.env` with your actual Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Deploy Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

### 2. Set Up Google Gemini API (for real AI insights)

1. **Get Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Create API Key"
   - Copy the generated key

2. **Update .env file**
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key
   ```

### 3. Restart the App

After updating the `.env` file, restart the development server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

The app will automatically detect your configuration and switch from demo mode to full mode!

## 🎯 What You Get With Full Setup

**Demo Mode (Current):**
- ✅ All features working
- ✅ Sample data to test
- ✅ Demo AI insights
- ⚠️ Data resets on refresh

**Full Mode (After Setup):**
- ✅ All demo features
- ✅ Permanent data storage in Firebase
- ✅ Real AI insights from Google Gemini
- ✅ Data persists across sessions
- ✅ Real-time synchronization

## 🆘 Troubleshooting

### If Still Stuck on Loading:

1. **Check Browser Console**
   - Open browser dev tools (F12)
   - Look at Console tab for errors
   - Common errors: Firebase config issues, network problems

2. **Verify Environment Variables**
   - Make sure `.env` file is in the project root
   - Check for typos in variable names
   - Ensure values don't contain quotes

3. **Firebase Connection Issues**
   - Verify Firestore is enabled in Firebase Console
   - Check that Firestore rules allow read/write access
   - Ensure project ID matches exactly

4. **Gemini API Issues**
   - Verify API key is correct
   - Check if you have API quota available
   - Ensure no spaces in the API key

### Quick Fix: Reset to Demo Mode

If you encounter issues, you can always reset to demo mode by:
```bash
# Reset .env to demo values
cp .env.example .env
# Or manually set all values to placeholder text
```

## 🎉 Next Steps

1. **Test Demo Mode**: Play with all features currently available
2. **Optional Setup**: Configure Firebase and Gemini when ready
3. **Deploy**: Use `npm run deploy` to deploy to Firebase Hosting

## 💡 Pro Tips

- Start with demo mode to understand the app
- Configure Firebase first if you want data persistence
- Gemini API is optional - demo insights are quite smart!
- Always keep your API keys secure (never commit .env to git)

---

**Your app is ready to use!** 🚀 Open `http://localhost:5174` to start tracking expenses!
