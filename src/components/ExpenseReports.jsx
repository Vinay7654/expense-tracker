import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, TrendingDown, Receipt, CreditCard } from 'lucide-react';

const ExpenseReports = ({ expenses, monthlySalary }) => {
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState('current');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const generateReport = () => {
    const filteredExpenses = filterExpenses();
    const reportData = calculateReportData(filteredExpenses);
    
    switch(reportType) {
      case 'monthly':
        return {
          type: 'Monthly Summary',
          summary: reportData.summary,
          insights: reportData.insights,
          monthlyStats: calculateMonthlyStats(filteredExpenses)
        };
        
      case 'detailed':
        return {
          type: 'Detailed Analysis',
          transactions: filteredExpenses,
          summary: reportData.summary,
          dailyBreakdown: calculateDailyBreakdown(filteredExpenses),
          insights: reportData.insights
        };
        
      case 'category':
        return {
          type: 'Category Breakdown',
          categories: reportData.categories,
          summary: reportData.summary,
          categoryInsights: generateCategoryInsights(reportData.categories),
          topExpenses: getTopExpenses(filteredExpenses)
        };
        
      case 'trend':
        return {
          type: 'Trend Analysis',
          trends: reportData.trends,
          summary: reportData.summary,
          weeklyComparison: calculateWeeklyComparison(filteredExpenses),
          trendInsights: generateTrendInsights(reportData.trends)
        };
        
      default:
        return {
          type: 'Summary',
          summary: reportData.summary,
          categories: reportData.categories,
          trends: reportData.trends,
          insights: reportData.insights
        };
    }
  };

  const calculateMonthlyStats = (expenses) => {
    const stats = {};
    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      if (!stats[month]) {
        stats[month] = { total: 0, count: 0 };
      }
      stats[month].total += parseFloat(expense.amount || 0);
      stats[month].count += 1;
    });
    return stats;
  };

  const calculateDailyBreakdown = (expenses) => {
    const daily = {};
    expenses.forEach(expense => {
      const date = expense.date;
      if (!daily[date]) {
        daily[date] = { total: 0, count: 0, expenses: [] };
      }
      daily[date].total += parseFloat(expense.amount || 0);
      daily[date].count += 1;
      daily[date].expenses.push(expense);
    });
    return daily;
  };

  const generateCategoryInsights = (categories) => {
    const insights = [];
    const sorted = Object.entries(categories).sort((a, b) => b[1].amount - a[1].amount);
    
    if (sorted.length > 0) {
      const topCategory = sorted[0];
      insights.push({ 
        type: 'info', 
        text: `${topCategory[0]} is your highest expense category (₹${topCategory[1].amount.toLocaleString('en-IN')})` 
      });
    }
    
    const lowCategories = sorted.filter(([_, data]) => data.amount < 1000);
    if (lowCategories.length > 0) {
      insights.push({ 
        type: 'success', 
        text: `${lowCategories.length} categories have spending under ₹1,000` 
      });
    }
    
    return insights;
  };

  const getTopExpenses = (expenses) => {
    return expenses
      .sort((a, b) => parseFloat(b.amount || 0) - parseFloat(a.amount || 0))
      .slice(0, 10);
  };

  const calculateWeeklyComparison = (expenses) => {
    const weeklyData = {};
    expenses.forEach(expense => {
      const week = getWeek(new Date(expense.date));
      if (!weeklyData[week]) weeklyData[week] = 0;
      weeklyData[week] += parseFloat(expense.amount || 0);
    });
    
    const weeks = Object.keys(weeklyData).sort();
    if (weeks.length < 2) return {};
    
    const currentWeek = weeklyData[weeks[weeks.length - 1]];
    const previousWeek = weeklyData[weeks[weeks.length - 2]];
    const change = ((currentWeek - previousWeek) / previousWeek * 100).toFixed(1);
    
    return {
      current: currentWeek,
      previous: previousWeek,
      change: parseFloat(change),
      trend: change > 0 ? 'increasing' : 'decreasing'
    };
  };

  const generateTrendInsights = (trends) => {
    const insights = [];
    if (trends.length < 2) return insights;
    
    const recent = trends.slice(-3);
    const avgRecent = recent.reduce((sum, t) => sum + t.amount, 0) / recent.length;
    const older = trends.slice(-6, -3);
    
    if (older.length > 0) {
      const avgOlder = older.reduce((sum, t) => sum + t.amount, 0) / older.length;
      const change = ((avgRecent - avgOlder) / avgOlder * 100).toFixed(1);
      
      if (change > 10) {
        insights.push({ type: 'warning', text: `Spending increased by ${change}% recently` });
      } else if (change < -10) {
        insights.push({ type: 'success', text: `Spending decreased by ${Math.abs(change)}% recently` });
      } else {
        insights.push({ type: 'info', text: `Spending remained stable (${change}% change)` });
      }
    }
    
    return insights;
  };

  const filterExpenses = () => {
    return expenses.filter(expense => {
      if (categoryFilter !== 'all' && expense.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  };

  const calculateReportData = (filteredExpenses) => {
    const total = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const categories = {};
    
    filteredExpenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = { amount: 0, count: 0 };
      }
      categories[expense.category].amount += parseFloat(expense.amount || 0);
      categories[expense.category].count += 1;
    });

    const insights = [];
    if (monthlySalary > 0) {
      const percentage = ((total / monthlySalary) * 100).toFixed(1);
      if (percentage > 50) {
        insights.push({ type: 'warning', text: `Spending is ${percentage}% of salary - review budget` });
      }
    }

    return {
      summary: { total, count: filteredExpenses.length, average: total / filteredExpenses.length },
      categories,
      trends: calculateTrends(filteredExpenses),
      insights
    };
  };

  const calculateTrends = (filteredExpenses) => {
    // Simple trend calculation
    const sortedExpenses = filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    const weeklyData = {};
    
    sortedExpenses.forEach(expense => {
      const week = getWeek(new Date(expense.date));
      if (!weeklyData[week]) weeklyData[week] = 0;
      weeklyData[week] += parseFloat(expense.amount || 0);
    });

    return Object.entries(weeklyData).map(([week, amount]) => ({ week, amount }));
  };

  const getWeek = (date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek);
  };

  const exportToCSV = () => {
    const report = generateReport();
    let csv = 'Date,Category,Amount,Note\n';
    
    filterExpenses().forEach(expense => {
      csv += `${expense.date},${expense.category},${expense.amount},"${expense.note || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const report = generateReport();
    const data = {
      generated: new Date().toISOString(),
      reportType,
      dateRange,
      ...report
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const report = generateReport();

  return (
    <div className="card" style={{ 
      background: '#ffffff',
      color: '#2c3e50',
      border: '1px solid #e1e8ed',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
      borderRadius: '12px'
    }}>
      <h2 className="card-title" style={{ 
        color: '#2c3e50', 
        fontSize: '24px',
        fontWeight: '700',
        borderBottom: '2px solid #3498db',
        paddingBottom: '12px',
        marginBottom: '24px'
      }}>
        <FileText size={24} style={{ color: '#3498db' }} />
        📊 Expense Reports
      </h2>

      {/* Report Controls */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px',
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#495057',
            fontSize: '14px'
          }}>📋 Report Type</label>
          <select 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              color: '#495057',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          >
            <option value="monthly">📅 Monthly Summary</option>
            <option value="detailed">📈 Detailed Analysis</option>
            <option value="category">🏷️ Category Breakdown</option>
            <option value="trend">📊 Trend Analysis</option>
          </select>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#495057',
            fontSize: '14px'
          }}>📅 Date Range</label>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              color: '#495057',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          >
            <option value="current">🗓️ This Month</option>
            <option value="last">📅 Last Month</option>
            <option value="quarter">📊 This Quarter</option>
            <option value="year">🗓️ This Year</option>
            <option value="all">📚 All Time</option>
          </select>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#495057',
            fontSize: '14px'
          }}>🏷️ Category Filter</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              color: '#495057',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          >
            <option value="all">📊 All Categories</option>
            <option value="Food & Dining">🍔 Food & Dining</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Transport">🚗 Transport</option>
            <option value="Entertainment">🎬 Entertainment</option>
            <option value="Bills & Utilities">💡 Bills & Utilities</option>
            <option value="Healthcare">🏥 Healthcare</option>
          </select>
        </div>
      </div>

      {/* Export Options */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={exportToCSV} 
          style={{
            padding: '12px 24px',
            background: '#3498db',
            border: 'none',
            borderRadius: '6px',
            color: '#ffffff',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(52, 152, 219, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#2980b9';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(52, 152, 219, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#3498db';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(52, 152, 219, 0.3)';
          }}
        >
          <Download size={16} />
          📄 Export CSV
        </button>
        <button 
          onClick={exportToJSON} 
          style={{
            padding: '12px 24px',
            background: '#27ae60',
            border: 'none',
            borderRadius: '6px',
            color: '#ffffff',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(39, 174, 96, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#229954';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(39, 174, 96, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#27ae60';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(39, 174, 96, 0.3)';
          }}
        >
          <FileText size={16} />
          📋 Export JSON
        </button>
      </div>

      {/* Dynamic Report Content */}
      {reportType === 'monthly' && (
        <MonthlyReport report={report} />
      )}
      
      {reportType === 'detailed' && (
        <DetailedReport report={report} />
      )}
      
      {reportType === 'category' && (
        <CategoryReport report={report} />
      )}
      
      {reportType === 'trend' && (
        <TrendReport report={report} />
      )}
    </div>
  );
};

// Monthly Report Component
const MonthlyReport = ({ report }) => (
  <>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: '16px', 
      marginBottom: '24px' 
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #e9ecef',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <Receipt size={20} style={{ color: '#e74c3c' }} />
          <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '600' }}>💰 Total Expenses</span>
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
          ₹{report.summary.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </div>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #e9ecef',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <CreditCard size={20} style={{ color: '#3498db' }} />
          <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '600' }}>📝 Transactions</span>
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
          {report.summary.count}
        </div>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #e9ecef',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <TrendingUp size={20} style={{ color: '#f39c12' }} />
          <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '600' }}>📈 Average</span>
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
          ₹{report.summary.average.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </div>
      </div>
    </div>

    {report.insights.length > 0 && (
      <div>
        <h3 style={{ marginBottom: '16px', color: '#2c3e50', fontSize: '20px', fontWeight: '700', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
          💡 Key Insights
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {report.insights.map((insight, index) => (
            <div key={index} style={{
              padding: '16px',
              background: insight.type === 'warning' ? '#fff3cd' : '#d4edda',
              borderRadius: '8px',
              border: `1px solid ${insight.type === 'warning' ? '#ffeaa7' : '#c3e6cb'}`,
              color: insight.type === 'warning' ? '#856404' : '#155724',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>
                {insight.type === 'warning' ? '⚠️' : '✅'}
              </span>
              {insight.text}
            </div>
          ))}
        </div>
      </div>
    )}
  </>
);

// Detailed Report Component
const DetailedReport = ({ report }) => (
  <>
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px', color: '#2c3e50', fontSize: '20px', fontWeight: '700', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
        📅 Daily Breakdown
      </h3>
      <div style={{ display: 'grid', gap: '12px' }}>
        {Object.entries(report.dailyBreakdown).map(([date, data]) => (
          <div key={date} style={{
            background: '#ffffff',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <div>
              <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '16px' }}>
                {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                {data.count} transactions
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700', color: '#2c3e50', fontSize: '18px' }}>
                ₹{data.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px', color: '#2c3e50', fontSize: '20px', fontWeight: '700', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
        📝 Recent Transactions
      </h3>
      <div style={{ display: 'grid', gap: '8px' }}>
        {report.transactions.slice(0, 10).map((expense, index) => (
          <div key={index} style={{
            background: '#ffffff',
            borderRadius: '6px',
            padding: '12px',
            border: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px'
          }}>
            <div>
              <span style={{ fontWeight: '600', color: '#2c3e50' }}>{expense.category}</span>
              <span style={{ color: '#6c757d', marginLeft: '8px' }}>{expense.note}</span>
            </div>
            <div style={{ fontWeight: '700', color: '#e74c3c' }}>
              ₹{parseFloat(expense.amount).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

// Category Report Component
const CategoryReport = ({ report }) => (
  <>
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px', color: '#2c3e50', fontSize: '20px', fontWeight: '700', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
        🏷️ Category Breakdown
      </h3>
      <div style={{ display: 'grid', gap: '12px' }}>
        {Object.entries(report.categories).map(([category, data]) => (
          <div key={category} style={{
            background: '#ffffff',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                border: '1px solid #e9ecef'
              }}>
                {category.includes('Food') ? '🍔' : 
                 category.includes('Shopping') ? '🛍️' : 
                 category.includes('Transport') ? '🚗' : 
                 category.includes('Bills') ? '💡' : '📊'}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '16px' }}>{category}</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>{data.count} transactions</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700', color: '#2c3e50', fontSize: '18px' }}>
                ₹{data.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#6c757d',
                background: '#f8f9fa',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                border: '1px solid #e9ecef'
              }}>
                {((data.amount / report.summary.total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {report.topExpenses?.length > 0 && (
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#2c3e50', fontSize: '20px', fontWeight: '700', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
          🏆 Top Expenses
        </h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          {report.topExpenses.map((expense, index) => (
            <div key={index} style={{
              background: '#ffffff',
              borderRadius: '6px',
              padding: '12px',
              border: '1px solid #e9ecef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px'
            }}>
              <div>
                <span style={{ fontWeight: '600', color: '#2c3e50' }}>{expense.category}</span>
                <span style={{ color: '#6c757d', marginLeft: '8px' }}>{expense.note}</span>
              </div>
              <div style={{ fontWeight: '700', color: '#e74c3c' }}>
                ₹{parseFloat(expense.amount).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {report.categoryInsights?.length > 0 && (
      <div>
        <h3 style={{ marginBottom: '16px', color: '#2c3e50', fontSize: '20px', fontWeight: '700', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
          💡 Category Insights
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {report.categoryInsights.map((insight, index) => (
            <div key={index} style={{
              padding: '16px',
              background: insight.type === 'warning' ? '#fff3cd' : insight.type === 'success' ? '#d4edda' : '#d1ecf1',
              borderRadius: '8px',
              border: `1px solid ${insight.type === 'warning' ? '#ffeaa7' : insight.type === 'success' ? '#c3e6cb' : '#bee5eb'}`,
              color: insight.type === 'warning' ? '#856404' : insight.type === 'success' ? '#155724' : '#0c5460',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>
                {insight.type === 'warning' ? '⚠️' : insight.type === 'success' ? '✅' : 'ℹ️'}
              </span>
              {insight.text}
            </div>
          ))}
        </div>
      </div>
    )}
  </>
);

// Trend Report Component
const TrendReport = ({ report }) => (
  <>
    {report.weeklyComparison && Object.keys(report.weeklyComparison).length > 0 && (
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#2c3e50', fontSize: '20px', fontWeight: '700', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
          📊 Weekly Comparison
        </h3>
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Previous Week</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50' }}>
                ₹{report.weeklyComparison.previous.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Current Week</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50' }}>
                ₹{report.weeklyComparison.current.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Change</div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: report.weeklyComparison.change > 0 ? '#e74c3c' : '#27ae60' 
              }}>
                {report.weeklyComparison.change > 0 ? '+' : ''}{report.weeklyComparison.change}%
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {report.trends?.length > 0 && (
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: '#2c3e50', fontSize: '20px', fontWeight: '700', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
          📈 Weekly Trends
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {report.trends.map((trend, index) => (
            <div key={index} style={{
              background: '#ffffff',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #e9ecef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
              <div>
                <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '16px' }}>
                  Week {trend.week}
                </div>
              </div>
              <div style={{ fontWeight: '700', color: '#2c3e50', fontSize: '18px' }}>
                ₹{trend.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {report.trendInsights?.length > 0 && (
      <div>
        <h3 style={{ marginBottom: '16px', color: '#2c3e50', fontSize: '20px', fontWeight: '700', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
          💡 Trend Insights
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {report.trendInsights.map((insight, index) => (
            <div key={index} style={{
              padding: '16px',
              background: insight.type === 'warning' ? '#fff3cd' : insight.type === 'success' ? '#d4edda' : '#d1ecf1',
              borderRadius: '8px',
              border: `1px solid ${insight.type === 'warning' ? '#ffeaa7' : insight.type === 'success' ? '#c3e6cb' : '#bee5eb'}`,
              color: insight.type === 'warning' ? '#856404' : insight.type === 'success' ? '#155724' : '#0c5460',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>
                {insight.type === 'warning' ? '⚠️' : insight.type === 'success' ? '✅' : 'ℹ️'}
              </span>
              {insight.text}
            </div>
          ))}
        </div>
      </div>
    )}
  </>
);

export default ExpenseReports;
