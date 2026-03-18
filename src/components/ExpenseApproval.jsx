import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, DollarSign, Calendar, MessageSquare, Filter } from 'lucide-react';

const ExpenseApproval = ({ expenses, onApprove, onReject }) => {
  const [pendingExpenses, setPendingExpenses] = useState([
    {
      id: 1,
      amount: 2500,
      category: 'Business Travel',
      description: 'Flight to Mumbai for client meeting',
      date: '2024-03-18',
      submittedBy: 'John Doe',
      submittedAt: '2024-03-18 10:30 AM',
      status: 'pending',
      receipt: true,
      priority: 'high'
    },
    {
      id: 2,
      amount: 800,
      category: 'Meals',
      description: 'Team lunch with client',
      date: '2024-03-17',
      submittedBy: 'Jane Smith',
      submittedAt: '2024-03-17 2:15 PM',
      status: 'pending',
      receipt: true,
      priority: 'medium'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredExpenses = pendingExpenses.filter(expense => {
    const statusMatch = filterStatus === 'all' || expense.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || expense.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const handleApprove = (expenseId) => {
    setPendingExpenses(prev => 
      prev.map(exp => 
        exp.id === expenseId 
          ? { ...exp, status: 'approved', approvedAt: new Date().toISOString() }
          : exp
      )
    );
    if (onApprove) onApprove(expenseId);
  };

  const handleReject = (expenseId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setPendingExpenses(prev => 
      prev.map(exp => 
        exp.id === expenseId 
          ? { ...exp, status: 'rejected', rejectedAt: new Date().toISOString(), rejectionReason }
          : exp
      )
    );
    if (onReject) onReject(expenseId, rejectionReason);
    setSelectedExpense(null);
    setRejectionReason('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} style={{ color: '#28a745' }} />;
      case 'rejected':
        return <XCircle size={16} style={{ color: '#dc3545' }} />;
      case 'pending':
        return <Clock size={16} style={{ color: '#ffc107' }} />;
      default:
        return <Clock size={16} style={{ color: '#6c757d' }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const stats = {
    total: pendingExpenses.length,
    pending: pendingExpenses.filter(exp => exp.status === 'pending').length,
    approved: pendingExpenses.filter(exp => exp.status === 'approved').length,
    rejected: pendingExpenses.filter(exp => exp.status === 'rejected').length,
    totalAmount: pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <CheckCircle size={20} />
        Expense Approval
      </h2>

      {/* Stats Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} />
            <span style={{ fontSize: '12px', color: '#666' }}>Pending</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>
            {stats.pending}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} />
            <span style={{ fontSize: '12px', color: '#666' }}>Approved</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
            {stats.approved}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={16} />
            <span style={{ fontSize: '12px', color: '#666' }}>Rejected</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc3545' }}>
            {stats.rejected}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={16} />
            <span style={{ fontSize: '12px', color: '#666' }}>Total Amount</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            ₹{stats.totalAmount.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Status</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-control"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Priority</label>
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className="form-control"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Expense List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredExpenses.map((expense) => (
          <div key={expense.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: expense.status === 'pending' ? '#fff3cd' : '#f8f9fa'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {getStatusIcon(expense.status)}
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    ₹{expense.amount.toLocaleString('en-IN')}
                  </span>
                  <span 
                    style={{ 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      backgroundColor: getPriorityColor(expense.priority),
                      color: 'white'
                    }}
                  >
                    {expense.priority.toUpperCase()}
                  </span>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <strong>{expense.category}</strong> - {expense.description}
                </div>
                
                <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#666' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {expense.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} />
                    {expense.submittedBy}
                  </div>
                  {expense.receipt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} />
                      Receipt
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status-specific content */}
            {expense.status === 'rejected' && expense.rejectionReason && (
              <div style={{
                padding: '12px',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '6px',
                marginBottom: '12px',
                fontSize: '14px'
              }}>
                <strong>Rejection Reason:</strong> {expense.rejectionReason}
              </div>
            )}

            {/* Action buttons */}
            {expense.status === 'pending' && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => handleApprove(expense.id)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button 
                  onClick={() => {
                    setSelectedExpense(expense);
                    setRejectionReason('');
                  }}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rejection Modal */}
      {selectedExpense && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ marginBottom: '16px' }}>Reject Expense</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Expense:</strong> {selectedExpense.category} - ₹{selectedExpense.amount.toLocaleString('en-IN')}
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Reason for Rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this expense..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setSelectedExpense(null);
                  setRejectionReason('');
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleReject(selectedExpense.id)}
                className="btn btn-primary"
                style={{ backgroundColor: '#dc3545', border: 'none' }}
              >
                Reject Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredExpenses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
          <Filter size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>No expenses found matching your filters</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseApproval;
