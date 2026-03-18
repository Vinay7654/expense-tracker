import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, AlertTriangle, TrendingUp, TrendingDown, Brain, Sparkles, Zap } from 'lucide-react';
import './SmartAIAssistant.css';

const SmartAIAssistant = ({ expenses, monthlySalary, previousMonthExpenses = [] }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [mode, setMode] = useState('summary'); // 'summary' or 'explain'
  const [proactiveInsights, setProactiveInsights] = useState([]);
  const [showTyping, setShowTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-proactive insights analysis
  useEffect(() => {
    generateProactiveInsights();
  }, [expenses, monthlySalary]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateProactiveInsights = () => {
    if (!expenses.length || !monthlySalary) return;

    const insights = [];
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(expense.amount || 0), 0);
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += parseFloat(expense.amount || 0);
    });

    // Check for overspending (>30%)
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      const percentage = ((amount / monthlySalary) * 100).toFixed(0);
      if (percentage > 30) {
        let emoji = '💸';
        let categoryEmoji = '🍔';
        if (category.includes('Food')) categoryEmoji = '🍔';
        else if (category.includes('Shopping')) categoryEmoji = '🛍️';
        else if (category.includes('Transport')) categoryEmoji = '🚗';
        
        insights.push({
          type: 'overspending',
          text: `${category.replace(' & Dining', '')} spending crossed ${percentage}% ${categoryEmoji} 💸 — overspending alert ⚠️`,
          severity: 'high',
          action: 'Fix overspending'
        });
      }
    });

    // Check savings rate
    const savingsRate = ((monthlySalary - totalExpenses) / monthlySalary * 100).toFixed(0);
    if (savingsRate < 20) {
      insights.push({
        type: 'low_savings',
        text: `Savings dropped to ${savingsRate}% 💰 — below safe level ⚠️`,
        severity: 'medium',
        action: 'Improve savings'
      });
    }

    // Check for unusual spikes (vs previous month)
    if (previousMonthExpenses.length > 0) {
      const prevTotal = previousMonthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
      const currentTotal = totalExpenses;
      const spikePercentage = ((currentTotal - prevTotal) / prevTotal * 100).toFixed(0);
      
      if (Math.abs(spikePercentage) > 40) {
        insights.push({
          type: 'spike',
          text: `Spending up ${Math.abs(spikePercentage)}% vs last month 📊 💸 — check unusual expenses`,
          severity: 'medium',
          action: 'Review expenses'
        });
      }
    }

    setProactiveInsights(insights);
  };

  const simulateStreamingResponse = async (finalText) => {
    setIsStreaming(true);
    setShowTyping(true);
    
    const words = finalText.split(' ');
    let accumulatedText = '';
    
    for (let i = 0; i < words.length; i++) {
      accumulatedText += (i > 0 ? ' ' : '') + words[i];
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].sender === 'ai' && newMessages[newMessages.length - 1].isStreaming) {
          newMessages[newMessages.length - 1].text = accumulatedText;
        } else {
          newMessages.push({
            id: Date.now(),
            text: accumulatedText,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            isStreaming: true
          });
        }
        return newMessages;
      });
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }
    
    setIsStreaming(false);
    setShowTyping(false);
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0 && newMessages[newMessages.length - 1].isStreaming) {
        newMessages[newMessages.length - 1].isStreaming = false;
      }
      return newMessages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || isStreaming) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('AI not configured');
      }

      const isExplainMode = inputText.toLowerCase().includes('why') || 
                           inputText.toLowerCase().includes('how') || 
                           inputText.toLowerCase().includes('explain');

      const prompt = isExplainMode ? `
        Explain this financial topic in detail: "${inputText}"
        Use emojis 💸 💰 📊 ⚠️
        Be analytical and structured
        No filler text
        Direct answers only
      ` : `
        Analyze this request about Indian finance: "${inputText}"
        Respond in 2-4 lines maximum
        Use emojis 💸 💰 📊
        Be direct and analytical
        No questions or filler
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) throw new Error('API failed');
      
      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      await simulateStreamingResponse(aiResponse);
      
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message}`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    const actionText = {
      'Fix overspending': 'How to reduce overspending immediately?',
      'Improve savings': 'Best ways to increase savings rate?',
      'Review expenses': 'Where am I wasting money most?'
    };
    
    setInputText(actionText[action] || '');
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={20} />
          Smart AI Assistant
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setMode('summary')}
            className={`btn ${mode === 'summary' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '14px' }}
          >
            Summary
          </button>
          <button
            onClick={() => setMode('explain')}
            className={`btn ${mode === 'explain' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '14px' }}
          >
            Explain
          </button>
        </div>
      </div>

      {/* Proactive Insights */}
      {proactiveInsights.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Zap size={16} style={{ color: '#ff6b6b' }} />
            <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>Auto Insights Detected</span>
          </div>
          {proactiveInsights.map((insight, index) => (
            <div key={index} style={{
              backgroundColor: insight.severity === 'high' ? '#ffe0e0' : '#fff3cd',
              border: `1px solid ${insight.severity === 'high' ? '#ff6b6b' : '#ffc107'}`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ flex: 1 }}>{insight.text}</span>
              <button
                onClick={() => handleQuickAction(insight.action)}
                className="btn btn-primary"
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                {insight.action}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Chat Interface */}
      <div className="chat-container" style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #e0e0e0', 
        borderRadius: '8px', 
        padding: '16px', 
        marginBottom: '16px',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
            <Bot size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>Ask anything about finance, investments, or money management!</p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>
              Mode: <strong>{mode === 'summary' ? 'Summary (2-4 lines)' : 'Explain (detailed)'}</strong>
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} style={{
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: message.isStreaming ? 'pulse 1s infinite' : 'none'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: message.sender === 'user' ? '#007bff' : '#28a745',
                color: 'white',
                flexShrink: 0
              }}>
                {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#e8f5e8',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  position: 'relative'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                    {message.text}
                    {message.isStreaming && <span style={{ animation: 'blink 1s infinite' }}>...</span>}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
        
        {showTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#28a745',
              color: 'white'
            }}>
              <Bot size={16} />
            </div>
            <div style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Analyzing your data 📊</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={mode === 'explain' ? "Ask why/how/explain anything..." : "Ask anything about finance..."}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          disabled={isLoading || isStreaming}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading || isStreaming || !inputText.trim()}
        >
          <Send size={16} />
        </button>
      </form>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default SmartAIAssistant;
