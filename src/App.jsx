import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SalaryInput from './components/SalaryInput';
import Dashboard from './components/Dashboard';
import AIInsights from './components/AIInsights';
import SmartAIAssistant from './components/SmartAIAssistant';
import ExpenseReports from './components/ExpenseReports';
import ReceiptUpload from './components/ReceiptUpload';
import ExpenseChart from './components/ExpenseChart';
import Login from './components/Login';
import { authService } from './services/authService';
import { firebaseService } from './services/firebaseService';
import { demoService } from './services/demoService';
import { LogOut, User } from 'lucide-react';

// Local storage key for salary persistence
const SALARY_STORAGE_KEY = 'expense_tracker_salary';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [loading, setLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Set up authentication listener
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setAuthLoading(false);
      
      if (user) {
        loadData();
      } else {
        setLoading(false);
        setUseDemo(true);
      }
    });

    // Load salary from localStorage as fallback
    if (typeof window !== 'undefined') {
      const savedSalary = localStorage.getItem(SALARY_STORAGE_KEY);
      if (savedSalary) {
        const salary = parseFloat(savedSalary) || 0;
        setMonthlySalary(salary);
        console.log('Salary loaded from localStorage:', salary);
      }
    }

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setUseDemo(false);
    loadData();
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setExpenses([]);
      setUseDemo(true);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Check if Firebase is configured
      const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                              import.meta.env.VITE_FIREBASE_PROJECT_ID &&
                              import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key_here';
      
      console.log('Firebase config check:', hasFirebaseConfig);
      
      const service = hasFirebaseConfig ? firebaseService : demoService;
      
      if (!hasFirebaseConfig) {
        setUseDemo(true);
        console.log('Using demo mode - Firebase not configured');
      }
      
      // Test Firebase connection if configured
      if (hasFirebaseConfig) {
        try {
          console.log('Testing Firebase connection...');
          await service.getSettings(); // Test connection
          console.log('Firebase connection successful');
          setUseDemo(false);
        } catch (firebaseError) {
          console.error('Firebase connection failed:', firebaseError);
          console.log('Falling back to demo mode');
          setUseDemo(true);
        }
      }
      
      // Load data using the determined service
      const [expensesData, settingsData] = await Promise.all([
        service.getExpenses(),
        service.getSettings()
      ]);
      
      console.log('Data loaded:', { expenses: expensesData.length, salary: settingsData.monthlySalary });
      setExpenses(expensesData);
      setMonthlySalary(settingsData.monthlySalary || 0);
      
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to demo mode on error
      console.log('Error occurred, falling back to demo mode');
      setUseDemo(true);
      try {
        const [expensesData, settingsData] = await Promise.all([
          demoService.getExpenses(),
          demoService.getSettings()
        ]);
        setExpenses(expensesData);
        setMonthlySalary(settingsData.monthlySalary || 0);
      } catch (demoError) {
        console.error('Even demo mode failed:', demoError);
        // Set minimal fallback data
        setExpenses([]);
        setMonthlySalary(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    try {
      const service = useDemo ? demoService : firebaseService;
      console.log('Adding expense with service:', useDemo ? 'Demo' : 'Firebase');
      
      const newExpense = await service.addExpense(expense);
      setExpenses(prev => [...prev, newExpense]);
    } catch (error) {
      console.error('Error adding expense:', error);
      // Fallback: add to local state even if service fails
      const fallbackExpense = { ...expense, id: Date.now().toString() };
      setExpenses(prev => [...prev, fallbackExpense]);
    }
  };

  const handleReceiptProcessed = async (receiptData) => {
    // Handle receipt upload data
    await handleAddExpense(receiptData);
  };

  const handleApproveExpense = (expenseId) => {
    // Handle expense approval
    console.log('Expense approved:', expenseId);
  };

  const handleRejectExpense = (expenseId, reason) => {
    // Handle expense rejection
    console.log('Expense rejected:', expenseId, reason);
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const service = useDemo ? demoService : firebaseService;
      console.log('Deleting expense with service:', useDemo ? 'Demo' : 'Firebase');
      
      // Find the expense to get its details for the alert
      const expenseToDelete = expenses.find(exp => exp.id === expenseId);
      
      await service.deleteExpense(expenseId);
      console.log('Expense deleted successfully');
      
      // Update state directly instead of reloading
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
      
      // Show success alert
      if (expenseToDelete) {
        alert(`✅ Expense of ₹${parseFloat(expenseToDelete.amount || 0).toLocaleString('en-IN')} deleted successfully!`);
      } else {
        alert('✅ Expense deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      
      // If Firebase fails, try demo mode
      if (!useDemo) {
        console.log('Firebase failed, trying demo mode...');
        setUseDemo(true);
        try {
          await demoService.deleteExpense(expenseId);
          // Update state directly
          setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
          alert('✅ Expense deleted successfully!');
        } catch (demoError) {
          console.error('Demo mode also failed:', demoError);
          alert('Failed to delete expense. Please try again.');
        }
      } else {
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  const handleSalaryChange = async (newSalary) => {
    try {
      // Update state immediately for UI responsiveness
      setMonthlySalary(newSalary);
      
      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem(SALARY_STORAGE_KEY, newSalary.toString());
      }
      
      // Save to Firebase/database
      const service = useDemo ? demoService : firebaseService;
      console.log('Saving salary with service:', useDemo ? 'Demo' : 'Firebase');
      
      await service.saveSettings({ monthlySalary: newSalary });
      console.log('Salary saved successfully:', newSalary);
      
    } catch (error) {
      console.error('Error saving salary:', error);
      
      // If Firebase fails, try demo mode
      if (!useDemo) {
        console.log('Firebase failed, trying demo mode...');
        setUseDemo(true);
        try {
          await demoService.saveSettings({ monthlySalary: newSalary });
          console.log('Salary saved in demo mode:', newSalary);
        } catch (demoError) {
          console.error('Demo mode also failed:', demoError);
        }
      }
      
      // Still keep the local state even if Firebase fails
      if (typeof window !== 'undefined') {
        localStorage.setItem(SALARY_STORAGE_KEY, newSalary.toString());
      }
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="app" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <div className="spinner" style={{ marginBottom: '20px' }}></div>
          <h2>Loading...</h2>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Show loading screen while loading data
  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            Loading your financial data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h1>💰 AI Expense Tracker - India</h1>
            <p>Track expenses, manage your budget, and get AI-powered financial insights</p>
            {useDemo && (
              <div style={{
                marginTop: '16px',
                padding: '8px 16px',
                background: 'rgba(255, 193, 7, 0.2)',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#856404'
              }}>
                ⚠️ Running in Demo Mode - {import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key_here' ? 'Firebase connection failed, using demo data' : 'Configure Firebase to save data permanently'}
              </div>
            )}
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            background: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '14px',
              color: '#495057'
            }}>
              <User size={16} />
              <span>{user.displayName || user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#c82333';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#dc3545';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '24px',
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '16px'
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'receipts', label: 'Receipts', icon: '📸' },
            { id: 'reports', label: 'Reports', icon: '📈' },
            { id: 'ai', label: 'AI Assistant', icon: '🤖' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                padding: '8px 16px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #007bff' : '2px solid transparent'
              }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="dashboard">
              <SalaryInput 
                monthlySalary={monthlySalary} 
                onSalaryChange={handleSalaryChange} 
              />
              <ExpenseForm onAddExpense={handleAddExpense} />
            </div>

            <Dashboard 
              expenses={expenses} 
              monthlySalary={monthlySalary} 
            />

            <div className="dashboard">
              <ExpenseList 
                expenses={expenses} 
                onDeleteExpense={handleDeleteExpense} 
              />
              <ExpenseChart expenses={expenses} />
            </div>

            <AIInsights 
              expenses={expenses} 
              monthlySalary={monthlySalary} 
            />
          </div>
        )}

        {activeTab === 'receipts' && (
          <ReceiptUpload onReceiptProcessed={handleReceiptProcessed} />
        )}

        {activeTab === 'reports' && (
          <ExpenseReports expenses={expenses} monthlySalary={monthlySalary} />
        )}

        {activeTab === 'ai' && (
          <SmartAIAssistant 
            expenses={expenses} 
            monthlySalary={monthlySalary}
            previousMonthExpenses={[]} // TODO: Implement previous month comparison
          />
        )}
      </div>
    </div>
  );
}

export default App;
