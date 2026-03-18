import React, { useState } from 'react';
import { Plus, IndianRupee } from 'lucide-react';

const ExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    amount: '',
    category: 'Food & Dining',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 
    'Healthcare', 'Education', 'Entertainment', 'Groceries', 'Rent',
    'EMI & Loans', 'Investments', 'Savings', 'Family & Personal', 'Other'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Validate amount
    if (!expense.amount || expense.amount.trim() === '') {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(expense.amount) || parseFloat(expense.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else if (parseFloat(expense.amount) > 1000000) {
      newErrors.amount = 'Amount seems too high (max: ₹10,00,000)';
    }
    
    // Validate category
    if (!expense.category || expense.category === '') {
      newErrors.category = 'Category is required';
    }
    
    // Validate date
    if (!expense.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(expense.date);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }
    
    // Validate note (optional but reasonable length)
    if (expense.note && expense.note.length > 200) {
      newErrors.note = 'Note must be less than 200 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onAddExpense({
      ...expense,
      amount: parseFloat(expense.amount)
    });
    
    // Show success alert
    alert(`✅ Expense of ₹${parseFloat(expense.amount).toLocaleString('en-IN')} added successfully!`);
    
    // Reset form
    setExpense({
      amount: '',
      category: 'Food & Dining',
      note: '',
      date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <Plus size={20} />
        Add Expense
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            max="1000000"
            placeholder="0.00"
            required
            className={errors.amount ? 'error' : ''}
          />
          {errors.amount && (
            <span className="error-message">{errors.amount}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={expense.category}
            onChange={handleChange}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="note">Note (optional)</label>
          <textarea
            id="note"
            name="note"
            value={expense.note}
            onChange={handleChange}
            placeholder="Add a note about this expense..."
            maxLength="200"
            rows="3"
            className={errors.note ? 'error' : ''}
          />
          {errors.note && (
            <span className="error-message">{errors.note}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            required
            className={errors.date ? 'error' : ''}
          />
          {errors.date && (
            <span className="error-message">{errors.date}</span>
          )}
        </div>
        
        <button type="submit" className="btn btn-primary btn-block">
          <IndianRupee size={16} />
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
