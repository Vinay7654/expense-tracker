#!/bin/bash

echo "🔥 Firebase Setup Script"
echo "======================"

# Check if Firebase CLI is available
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not found in PATH"
    echo "Try: npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI found"

# Try to login
echo "🔐 Trying to login to Firebase..."
firebase login --no-localhost

# Try to deploy rules
echo "📜 Deploying Firestore rules..."
firebase deploy --only firestore:rules

echo "✅ Setup complete!"
echo "🚀 Now test your app at http://localhost:5174"
