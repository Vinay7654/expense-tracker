// Demo service for testing without Firebase
let demoExpenses = [
  {
    id: '1',
    amount: 850,
    category: 'Food & Dining',
    note: 'Family dinner at restaurant',
    date: '2024-03-15',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    amount: 1500,
    category: 'Groceries',
    note: 'Monthly grocery shopping',
    date: '2024-03-14',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    amount: 3500,
    category: 'Rent',
    note: 'Monthly rent payment',
    date: '2024-03-13',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    amount: 200,
    category: 'Transportation',
    note: 'Auto rickshaw fare',
    date: '2024-03-12',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    amount: 1200,
    category: 'Shopping',
    note: 'New clothes and shoes',
    date: '2024-03-11',
    createdAt: new Date().toISOString()
  }
];

let demoSettings = { monthlySalary: 0 }; // Start with 0 to match real Firebase

export const demoService = {
  addExpense: async (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      date: expense.date || new Date().toISOString().split('T')[0]
    };
    demoExpenses.unshift(newExpense);
    return newExpense;
  },

  getExpenses: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...demoExpenses];
  },

  deleteExpense: async (expenseId) => {
    demoExpenses = demoExpenses.filter(expense => expense.id !== expenseId);
  },

  updateExpense: async (expenseId, expense) => {
    const index = demoExpenses.findIndex(expense => expense.id === expenseId);
    if (index !== -1) {
      demoExpenses[index] = {
        ...demoExpenses[index],
        ...expense,
        date: expense.date || new Date().toISOString().split('T')[0]
      };
    }
  },

  saveSettings: async (settings) => {
    demoSettings = { ...demoSettings, ...settings };
  },

  getSettings: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...demoSettings };
  }
};
