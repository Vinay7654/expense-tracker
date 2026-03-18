import React, { useState, useEffect } from 'react';
import { IndianRupee, Wallet } from 'lucide-react';

const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

const SalaryInput = ({ monthlySalary, onSalaryChange }) => {
  const [salary, setSalary] = useState(monthlySalary.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    setSalary(monthlySalary.toString());
  }, [monthlySalary]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSalary(value);
    
    const numValue = parseFloat(value) || 0;
    
    // Validation: prevent 0 and negative salaries
    if (numValue <= 0) {
      setError('Salary must be greater than 0');
      onSalaryChange(0); // Reset to 0
      return;
    }
    
    // Validation: minimum reasonable salary (₹1000)
    if (numValue < 1000) {
      setError('Minimum salary is ₹1,000');
      onSalaryChange(0); // Reset to 0
      return;
    }
    
    // Validation: maximum reasonable salary (₹10,00,000)
    if (numValue > 1000000) {
      setError('Maximum salary is ₹10,00,000');
      onSalaryChange(0); // Reset to 0
      return;
    }
    
    // Clear error if valid
    setError('');
    onSalaryChange(numValue);
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <Wallet size={20} />
        Monthly Salary
      </h2>
      <div className="form-group">
        <label htmlFor="salary">Enter your monthly salary (₹)</label>
        <div style={{ position: 'relative' }}>
          <span 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#666',
              fontSize: '16px',
              fontWeight: 'bold'
            }} 
          >
            ₹
          </span>
          <input
            type="number"
            id="salary"
            value={salary}
            onChange={handleChange}
            placeholder="1000.00"
            min="1000"
            max="1000000"
            step="100"
            style={{ 
              paddingLeft: '40px',
              borderColor: error ? '#e74c3c' : '#ddd',
              borderWidth: error ? '2px' : '1px'
            }}
          />
        </div>
        {error && (
          <span style={{ 
            color: '#e74c3c', 
            fontSize: '12px', 
            marginTop: '4px',
            display: 'block',
            fontWeight: '500'
          }}>
            {error}
          </span>
        )}
      </div>
      {monthlySalary > 0 ? (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '4px' }}>
            Monthly Budget
          </div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#28a745' 
          }}>
            ₹{monthlySalary.toLocaleString('en-IN')}
          </div>
        </div>
      ) : (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          background: '#fff3cd', 
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ffeaa7'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#856404', marginBottom: '4px' }}>
            Set your monthly salary to track your budget
          </div>
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            color: '#856404' 
          }}>
            Not set yet
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryInput;
