import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with error handling
let genAI;
try {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('Gemini API key not configured');
  } else {
    console.log('Initializing Gemini with API key:', apiKey.substring(0, 10) + '...');
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Gemini AI initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error);
  console.error('Error details:', error.message);
}

export const geminiService = {
  // Generate AI insights based on expenses
  generateInsights: async (expenses, monthlySalary) => {
    try {
      // Check if Gemini is properly initialized
      if (!genAI) {
        console.log('Gemini AI not available, using fallback');
        return '🤖 AI insights are not available. Please configure your Gemini API key in the .env file.\n\n💡 For now, here are some general tips:\n• Track your expenses regularly\n• Set a monthly budget and stick to it\n• Save at least 20% of your income\n• Review your spending patterns weekly';
      }

      // Validate inputs
      if (!expenses || expenses.length === 0) {
        return '📝 Add some expenses first to get personalized financial insights!';
      }

      console.log('Initializing Gemini model...');
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash'
      });
      
      console.log('Gemini model created successfully');
      
      // Calculate total expenses and categorize
      const totalExpenses = expenses.reduce((sum, expense) => {
        const amount = parseFloat(expense.amount) || 0;
        return sum + amount;
      }, 0);
      
      const categoryTotals = {};
      
      expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
          categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += parseFloat(expense.amount) || 0;
      });
      
      // Find highest spending category
      const highestCategory = Object.entries(categoryTotals).reduce((a, b) => 
        categoryTotals[a[0]] > categoryTotals[b[0]] ? a : b
      );
      
      const percentageUsed = monthlySalary > 0 ? (totalExpenses / monthlySalary * 100).toFixed(1) : 0;
      const remainingBalance = monthlySalary - totalExpenses;
      
      const prompt = `
        You are a strict financial decision engine inside an expense tracker app for Indian users.

Your job is NOT to explain — your job is to force better financial decisions instantly.

CORE OBJECTIVE
Analyze user data (salary, expenses, categories)
Detect overspending, risk, and savings issues
Output immediate, high-impact actions
Keep response extremely short and scannable

INPUT DATA
Monthly Salary: ₹${monthlySalary.toLocaleString('en-IN')}
Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}
Remaining Balance: ₹${remainingBalance.toLocaleString('en-IN')}
Salary Used: ${percentageUsed}%

Category Spending:
${Object.entries(categoryTotals).map(([category, amount]) => {
  const percent = monthlySalary > 0 ? ((amount / monthlySalary) * 100).toFixed(1) : 0;
  let emoji = '🍔';
  if (category.includes('Food')) emoji = '🍔';
  else if (category.includes('Shopping')) emoji = '🛍️';
  else if (category.includes('Transport')) emoji = '🚗';
  else if (category.includes('Bills')) emoji = '🏠';
  else emoji = '📊';
  
  return `${category}: ${percent}% ${emoji}`;
}).join('\n')}

OUTPUT FORMAT (STRICT — NO DEVIATION)
[
  { "emoji": "💸", "text": "Salary used **68%** - cut immediately" },
  { "emoji": "🍔", "text": "Food spending **11.8%** - acceptable" },
  { "emoji": "�", "text": "Pause all non-essential spending now" },
  { "emoji": "💰", "text": "Increase savings to **20%+** urgently" }
]

NON-NEGOTIABLE RULES
- Max 4 insights only
- Each line ≤ 12 words
- No paragraphs
- No explanations
- No steps
- No questions
- No conversational tone
- No extra fields
- No text outside JSON

FORMATTING RULES
- Use bold (**) only for percentages and key numbers
- No ***, no markdown clutter
- Must be clean for UI rendering

EMOJI SYSTEM
💸 → overspending
💰 → good / savings
⚠️ → warning
🛑 → immediate action
📊 → trend/data
🍔 🛍️ 🚗 🏠 → categories

DECISION LOGIC (MANDATORY)
- 30% category → 💸 overspending
- 20–30% → ⚠️ warning
- <20% → 💰 good
- Savings <20% → ⚠️ critical
- Salary used >60% → 💸 danger
- Sudden spike → ⚠️ alert

PRIORITY SYSTEM (CRITICAL)
1. Biggest problem 💸
2. Category issue 🍔/🛍️
3. Immediate action 🛑
4. Savings guidance 💰

TONE
- Strict
- Direct
- Slightly aggressive
- No emotional softness
      `;
      
      console.log('Sending request to Gemini AI...');
      
      // Add timeout and retry logic
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        const result = await model.generateContent(prompt);
        clearTimeout(timeoutId);
        const response = await result.response;
        let text = response.text();
        
        // Clean the response - remove markdown code blocks if present
        text = text.replace(/```json\s*|\s*```/g, '').trim();
        
        console.log('Gemini AI response received:', text);
        return text;
      } catch (apiError) {
        clearTimeout(timeoutId);
        throw apiError;
      }
      
    } catch (error) {
      console.error('Error generating insights:', error);
      
      // Provide specific error messages based on error type
      if (error.name === 'AbortError') {
        return '⏱️ AI request timed out. Please try again.';
      } else if (error.message.includes('API_KEY') || error.message.includes('api key')) {
        return '🔑 Invalid Gemini API key. Please check your .env file configuration:\n\n1. Go to https://makersuite.google.com/app/apikey\n2. Create a new API key\n3. Add it to your .env file as VITE_GEMINI_API_KEY=your_key_here';
      } else if (error.message.includes('gen-lang-client')) {
        return '🤖 Gemini API client error. This usually means:\n• API key is not activated yet (wait 2-3 minutes)\n• API key permissions are incorrect\n• Need to create a new API key\n\n💡 Try creating a fresh API key from Google AI Studio.';
      } else if (error.message.includes('quota') || error.message.includes('limit') || error.message.includes('rate')) {
        return '📊 API quota exceeded. Please try again later or check your Gemini API usage.';
      } else if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('ENOTFOUND')) {
        return '🌐 Network error. Please check your internet connection and try again.\n\n💡 If problem persists, app will work perfectly with demo AI insights based on your actual spending data.';
      } else if (error.message.includes('model') || error.message.includes('generative')) {
        return '🤖 AI model error. Please try again or contact support.';
      } else {
        console.log('Full error details:', error);
        return `❌ Unable to generate insights: ${error.message}.\n\n💡 The app will continue to work perfectly with all other features. Try again later!`;
      }
    }
  }
};
