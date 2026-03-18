import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, PieChart } from 'lucide-react';

const Dashboard = ({ expenses, monthlySalary }) => {
  // Ensure expenses.amount is properly parsed as number
  const totalExpenses = expenses.reduce((sum, expense) => {
    const amount = parseFloat(expense.amount) || 0;
    return sum + amount;
  }, 0);
  
  const remainingSalary = monthlySalary - totalExpenses;
  const percentageUsed = monthlySalary > 0 ? (totalExpenses / monthlySalary * 100) : 0;
  const isOverspending = remainingSalary < 0 && monthlySalary > 0;
  const overspendingAmount = Math.abs(remainingSalary);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getProgressColor = () => {
    if (percentageUsed <= 50) return '#28a745';
    if (percentageUsed <= 75) return '#ffc107';
    if (percentageUsed <= 90) return '#fd7e14';
    return '#dc3545';
  };

  const getProgressWidth = () => {
    return Math.min(percentageUsed, 100);
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <PieChart size={20} />
        Dashboard
      </h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value" style={{ color: '#dc3545' }}>
            {formatAmount(totalExpenses)}
          </div>
          <TrendingUp size={16} style={{ color: '#dc3545', marginTop: '4px' }} />
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Remaining Balance</div>
          <div className="stat-value" style={{ 
            color: monthlySalary === 0 ? '#666' : isOverspending ? '#dc3545' : '#28a745' 
          }}>
            {monthlySalary === 0 ? 'Not Set' : isOverspending 
              ? `-₹${overspendingAmount.toLocaleString('en-IN')}` 
              : `₹${remainingSalary.toLocaleString('en-IN')}`
            }
          </div>
          {monthlySalary === 0 ? null : isOverspending ? (
            <div style={{ marginTop: '8px' }}>
              <TrendingDown size={16} style={{ color: '#dc3545' }} />
              <span style={{ color: '#dc3545', fontSize: '0.8rem', marginLeft: '4px' }}>
                Over budget by ₹{overspendingAmount.toLocaleString('en-IN')}
              </span>
            </div>
          ) : (
            <TrendingUp size={16} style={{ color: '#28a745', marginTop: '4px' }} />
          )}
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Salary Used</div>
          <div className="stat-value" style={{ color: monthlySalary === 0 ? '#666' : getProgressColor() }}>
            {monthlySalary === 0 ? '0%' : `${percentageUsed.toFixed(1)}%`}
          </div>
          {monthlySalary === 0 ? null : (
            <IndianRupee size={16} style={{ color: getProgressColor(), marginTop: '4px' }} />
          )}
        </div>
      </div>

      {monthlySalary > 0 && (
        <div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${getProgressWidth()}%`,
                backgroundColor: getProgressColor()
              }}
            />
          </div>
          <div className="progress-text">
            {isOverspending 
              ? `⚠️ Over budget by ₹${overspendingAmount.toLocaleString('en-IN')}! Reduce spending immediately.`
              : percentageUsed <= 50 
              ? '✅ Great! You\'re within budget.'
              : percentageUsed <= 75 
              ? '🟡 Good, but watch your spending.'
              : percentageUsed <= 90
              ? '🟠 Warning: High spending detected.'
              : '🔴 Critical: Approaching budget limit!'
            }
          </div>
        </div>
      )}

      {monthlySalary === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          Set your monthly salary to see your financial overview
        </div>
      )}
    </div>
  );
};

export default Dashboard;
