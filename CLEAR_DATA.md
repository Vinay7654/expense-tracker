# 🧹 Data Reset Instructions

If you're seeing negative balance or old data, you might need to clear your Firebase data:

## 🔧 Option 1: Clear Firebase Data (Recommended)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: "expense-tracker-4b2b8"
3. **Go to Firestore Database**
4. **Delete collections**:
   - Click on "expenses" collection → Delete collection
   - Click on "settings" collection → Delete collection

## 🔧 Option 2: Test Fresh (No action needed)

The app now handles these cases better:
- ✅ Salary starts at 0 (no negative balance)
- ✅ Better error handling for settings
- ✅ Clear "Not Set" messages when no salary
- ✅ Salary persists correctly after reload

## 🎯 What's Fixed:

### Before:
- ❌ Negative balance when salary not set
- ❌ Salary didn't persist after reload
- ❌ Confusing "₹0" displays

### After:
- ✅ Shows "Not Set" when salary is 0
- ✅ Salary saves and loads correctly
- ✅ Better visual indicators
- ✅ No negative balance confusion

## 🚀 Test Steps:

1. **Set your salary** (e.g., ₹50000)
2. **Add some expenses**
3. **Reload the page** - salary should persist
4. **Check dashboard** - should show correct calculations

---

**Your app should now work perfectly!** 🎉
