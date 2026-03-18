# 💰 AI-Powered Expense Tracker

A modern, intelligent expense tracking web application built with React, Firebase, and Google Gemini AI. Track your daily expenses, manage your budget, and get AI-powered financial insights.

## ✨ Features

- **Expense Tracking**: Add, view, and delete daily expenses with categories and notes
- **Budget Management**: Set monthly salary and track spending vs. budget
- **AI Insights**: Get personalized financial advice using Google Gemini API
- **Visual Analytics**: Interactive charts showing spending by category
- **Real-time Updates**: Firebase-powered real-time data synchronization
- **Modern UI**: Clean, responsive fintech-style design
- **Mobile Friendly**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, CSS
- **Backend**: Firebase Firestore
- **AI**: Google Gemini API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Firebase Hosting

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project
- Google Gemini API key

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Get your Firebase configuration

4. **Get Google Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

5. **Configure Environment Variables**
   
   Copy `.env` file and update with your credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

6. **Deploy Firebase Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

7. **Start Development Server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Usage

1. **Set Your Monthly Salary**: Enter your monthly income in the salary input card
2. **Add Expenses**: Record daily expenses with amount, category, and optional notes
3. **View Dashboard**: Monitor your spending, remaining balance, and budget usage
4. **Get AI Insights**: Click "Generate AI Insight" for personalized financial advice
5. **Analyze Spending**: View category-wise spending breakdown with interactive charts

## 🏗 Project Structure

```
expense-tracker/
├── src/
│   ├── components/           # React components
│   │   ├── ExpenseForm.jsx   # Add expense form
│   │   ├── ExpenseList.jsx   # Display expenses
│   │   ├── SalaryInput.jsx   # Salary input component
│   │   ├── Dashboard.jsx     # Financial overview
│   │   ├── AIInsights.jsx    # AI-powered insights
│   │   └── ExpenseChart.jsx  # Spending charts
│   ├── services/             # API services
│   │   ├── firebaseService.js # Firebase operations
│   │   └── geminiService.js  # Gemini AI integration
│   ├── firebase/             # Firebase configuration
│   │   └── config.js
│   ├── App.jsx              # Main application
│   └── App.css              # Styles
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes
└── .env                     # Environment variables
```

## 🔧 Firebase Configuration

### Firestore Security Rules
The application uses open rules for demo purposes. For production, consider implementing user authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /settings/{settingId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

## 🎨 Features in Detail

### Expense Management
- Add expenses with amount, category, date, and optional notes
- Delete expenses with confirmation
- View expenses sorted by date (newest first)
- 8 predefined categories: Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Education, Other

### Financial Dashboard
- Real-time calculation of total expenses
- Remaining salary calculation
- Percentage of salary used with visual progress bar
- Color-coded budget status (green/yellow/red)

### AI-Powered Insights
- Analyzes spending patterns
- Identifies overspending areas
- Provides savings strategies
- Highlights concerning trends
- Personalized recommendations based on your data

### Visual Analytics
- Interactive pie chart showing spending by category
- Top 3 spending categories highlighted
- Percentage breakdown of expenses
- Responsive chart design

## 🔒 Security Notes

- **Environment Variables**: Never commit `.env` file to version control
- **API Keys**: Keep Firebase and Gemini API keys secure
- **Firebase Rules**: Consider implementing user authentication for production
- **Data Validation**: Input validation implemented on frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check your Firebase configuration in `.env`
   - Ensure Firestore is enabled in Firebase Console
   - Verify Firestore rules allow read/write access

2. **Gemini API Error**
   - Verify your Gemini API key is correct
   - Check if you have API quota available
   - Ensure the API key is properly set in environment variables

3. **Build Error**
   - Run `npm install` to ensure all dependencies are installed
   - Check for any syntax errors in components
   - Verify all environment variables are set

### Getting Help

- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review [Google Gemini API Documentation](https://ai.google.dev/docs)
- Open an issue on GitHub for bug reports

---

Built with ❤️ using React, Firebase, and Google Gemini AI
