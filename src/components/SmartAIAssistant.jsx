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
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
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
        You are ChatGPT 5.2, a friendly and insightful financial AI assistant for Indian users. 
        Be conversational, ask meaningful questions, and provide actionable advice.
        
        User asked: "${inputText}"
        
        Guidelines:
        - Use **bold** for important terms and key insights
        - Ask thoughtful follow-up questions
        - Be conversational and engaging
        - Provide specific Indian market context
        - Keep responses meaningful but concise (3-5 sentences)
        - Use emojis naturally for engagement
        - Act like a knowledgeable financial advisor
        
        Example response style:
        "**Mutual funds** are excellent for beginners! 🌟 Have you considered starting with an index fund? They typically offer **12-15% returns** and are perfect for long-term wealth building. What's your current investment experience?"
      ` : `
        You are ChatGPT 5.2, a concise financial AI assistant. Provide direct, actionable insights.
        
        User asked: "${inputText}"
        
        Guidelines:
        - Use **bold** for key numbers and important terms
        - Keep responses to 2-4 sentences maximum
        - Include one thoughtful question
        - Focus on actionable advice for Indian users
        - Use relevant emojis sparingly
        
        Example response style:
        "**Index funds** are your best bet! 📈 They offer **12% average returns** with minimal risk. Have you thought about starting a monthly SIP?"
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
    <div className="card smart-ai-assistant">
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
            <p style={{ fontSize: '16px' }}>Ask me anything</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="chat-message" style={{
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
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
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}
                  dangerouslySetInnerHTML={{ 
                    __html: message.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #007bff; font-weight: 600;">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em style="color: #666;">$1</em>')
                  }} />
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
              <Sparkles size={16} className="typing-indicator" />
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
          placeholder={mode === 'explain' ? "Ask me anything about finance, investing, or money management..." : "Quick financial advice - ask me anything! 💰"}
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
    </div>
  );
};

export default SmartAIAssistant;
