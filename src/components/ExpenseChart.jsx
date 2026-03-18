import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';

const ExpenseChart = ({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">
          <BarChart3 size={20} />
          Spending by Category
        </h2>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px', 
          color: '#666' 
        }}>
          <p>No data to display yet.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
            Add expenses to see your spending breakdown.
          </p>
        </div>
      </div>
    );
  }

  // Calculate category totals
  const categoryTotals = {};
  expenses.forEach(expense => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });

  // Prepare data for chart
  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    value: amount,
    percentage: ((amount / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(1)
  }));

  // Sort by amount (descending)
  chartData.sort((a, b) => b.value - a.value);

  // Color palette
  const COLORS = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#fa709a', '#fee140', '#30cfd0', '#a8edea'
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e1e5e9',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 600 }}>
            {data.name}
          </p>
          <p style={{ margin: '4px 0 0', color: '#666' }}>
            ₹{data.value.toFixed(2)} ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (parseFloat(percentage) < 5) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <BarChart3 size={20} />
        Spending by Category
      </h2>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ fontSize: '12px' }}>
                  {value} (₹{entry.payload.value.toFixed(2)})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '16px' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: '#666' }}>
          Top Spending Categories:
        </h4>
        {chartData.slice(0, 3).map((category, index) => (
          <div 
            key={category.name}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              marginBottom: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div 
                style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: COLORS[index % COLORS.length],
                  borderRadius: '50%',
                  marginRight: '8px'
                }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                {index + 1}. {category.name}
              </span>
            </div>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              ₹{category.value.toFixed(2)} ({category.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;
