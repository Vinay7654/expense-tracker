import React from 'react';
import { Trash2, Calendar, Tag } from 'lucide-react';

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  const formatDate = (date) => {
    if (!date) return 'Invalid Date';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid Date';
      return dateObj.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatAmount = (amount) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (expenses.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">
          <Calendar size={20} />
          Recent Expenses
        </h2>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
          <p>No expenses recorded yet.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
            Start by adding your first expense above!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">
        <Calendar size={20} />
        Recent Expenses
      </h2>
      <div className="expense-list">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            <div className="expense-details">
              <div className="expense-category">
                <Tag size={14} style={{ marginRight: '6px' }} />
                {expense.category}
              </div>
              {expense.note && (
                <div className="expense-note">{expense.note}</div>
              )}
              <div className="expense-date">{formatDate(expense.date)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="expense-amount">
                {formatAmount(expense.amount)}
              </span>
              <button
                className="btn btn-danger"
                onClick={() => onDeleteExpense(expense.id)}
                style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
