export const demoGeminiService = {
  generateInsights: async (expenses, monthlySalary) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });
    
    const highestCategory = Object.entries(categoryTotals).reduce((a, b) => 
      categoryTotals[a[0]] > categoryTotals[b[0]] ? a : b
    );
    
    const percentageUsed = monthlySalary > 0 ? (totalExpenses / monthlySalary * 100).toFixed(1) : 0;
    
    // Generate demo insights based on actual data
    let insights = `💰 **Financial Analysis Summary**

**Spending Overview:**
• Total Expenses: ₹${totalExpenses.toFixed(2)}
• Budget Used: ${percentageUsed}%
• Remaining Balance: ₹${(monthlySalary - totalExpenses).toFixed(2)}

**Key Findings:**
• Your highest spending category is ${highestCategory[0]} at ₹${highestCategory[1].toFixed(2)}
• You have ${expenses.length} recorded expenses this month
`;

    if (percentageUsed > 90) {
      insights += `⚠️ **Warning:** You've used ${percentageUsed}% of your monthly budget!
`;
    } else if (percentageUsed > 75) {
      insights += `📊 **Note:** You've used ${percentageUsed}% of your budget. Keep monitoring.
`;
    } else {
      insights += `✅ **Good:** You're using ${percentageUsed}% of your budget - well within limits.
`;
    }

    insights += `
**💡 Recommendations:`
;

    if (highestCategory[0] === 'Food & Dining') {
      insights += `
• Consider home-cooked meals to reduce food expenses
• Try local Indian restaurants for better value
• Plan weekly meals and grocery shopping
• Look for discounts on food delivery apps`;
    } else if (highestCategory[0] === 'Transportation') {
      insights += `
• Use public transport (metro, buses) when possible
• Consider carpooling or bike-sharing
• Use apps like Ola/Uber during off-peak hours
• Maintain your vehicle for better fuel efficiency`;
    } else if (highestCategory[0] === 'Shopping') {
      insights += `
• Compare prices online before purchasing
• Look for sales and festive season discounts
• Consider second-hand options for certain items
• Use cashback credit cards wisely`;
    } else if (highestCategory[0] === 'Groceries') {
      insights += `
• Buy in bulk for non-perishable items
• Shop at local markets (mandi) for better prices
• Use loyalty programs and supermarket discounts
• Plan meals to avoid food wastage`;
    } else if (highestCategory[0] === 'Rent') {
      insights += `
• Consider sharing accommodation if possible
• Look for properties slightly away from prime locations
• Negotiate rent renewal terms
• Consider moving to a more affordable area`;
    } else if (highestCategory[0] === 'EMI & Loans') {
      insights += `
• Consider loan prepayment when possible
• Look for lower interest rate options
• Avoid taking multiple loans simultaneously
• Maintain good credit score for better rates`;
    } else if (highestCategory[0] === 'Bills & Utilities') {
      insights += `
• Use energy-efficient appliances
• Pay bills on time to avoid late fees
• Consider budget plans for utilities
• Use LED bulbs and unplug devices when not in use`;
    } else {
      insights += `
• Track your ${highestCategory[0]} expenses more closely
• Set specific budget limits for this category
• Look for alternatives to reduce spending
• Review necessity vs. luxury spending`;
    }

    if (monthlySalary > 0 && totalExpenses < monthlySalary * 0.8) {
      insights += `

**🎯 Savings Opportunity:**
• You could save ₹${(monthlySalary * 0.2 - totalExpenses).toFixed(2)} more this month
• Consider setting up automatic transfers to savings account
• Look into Fixed Deposits (FD) or Recurring Deposits (RD)
• Explore mutual funds (SIP) for long-term wealth creation`;
    }

    insights += `

**📈 Next Steps:**
• Continue tracking all expenses daily
• Review your budget weekly
• Set specific financial goals for next month
• Consider tax-saving investments (80C, 80D)`;

    return insights;
  }
};
