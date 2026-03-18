import React, { useState } from 'react';
import { Brain, Sparkles, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { demoGeminiService } from '../services/demoGeminiService';

const AIInsights = ({ expenses, monthlySalary }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);

  const generateInsights = async () => {
    if (expenses.length === 0) {
      setInsights([{ emoji: '📝', text: 'Add expenses first for insights' }]);
      return;
    }

    // Rate limiting - wait 30 seconds between requests
    const now = Date.now();
    if (now - lastRequestTime < 30000) {
      setRateLimited(true);
      setInsights([{ emoji: '⏱️', text: 'Please wait 30 seconds before generating insights again' }]);
      setLoading(false);
      setTimeout(() => setRateLimited(false), 30000);
      return;
    }

    setLastRequestTime(now);
    setLoading(true);
    setInsights([]);
    
    try {
      const hasGeminiConfig = import.meta.env.VITE_GEMINI_API_KEY && 
                              import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here';
      
      const service = hasGeminiConfig ? geminiService : demoGeminiService;
      
      console.log('Generating insights with service:', hasGeminiConfig ? 'Gemini' : 'Demo');
      const aiInsights = await service.generateInsights(expenses, monthlySalary);
      
      // Try to parse as JSON (strict format)
      try {
        const parsedInsights = JSON.parse(aiInsights);
        if (Array.isArray(parsedInsights)) {
          setInsights(parsedInsights);
        } else {
          setInsights([{ emoji: '❌', text: 'Invalid response format' }]);
        }
      } catch (parseError) {
        // If not JSON, display as single insight
        setInsights([{ emoji: '💡', text: aiInsights.trim() }]);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      
      // Check if it's a quota error and fallback to demo
      if (error.message.includes('quota') || error.message.includes('limit')) {
        setInsights([
          { emoji: '💡', text: 'Food expenses seem high - consider cooking at home' },
          { emoji: '💰', text: 'Try to save at least 20% of your income' },
          { emoji: '📊', text: 'Track your spending to identify waste' }
        ]);
      } else {
        setInsights([{ emoji: '❌', text: 'Could not generate insights' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card ai-insights">
      <h2 className="card-title">
        <Brain size={20} />
        AI Financial Advisor
      </h2>
      
      <button
        className="btn btn-primary btn-block"
        onClick={generateInsights}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="spinner" />
            Generating Insights...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Generate AI Insight
          </>
        )}
      </button>

      {insights.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(76, 175, 80, 0.05) 100%)', 
          borderRadius: '12px',
          border: '1px solid rgba(33, 150, 243, 0.2)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{ 
            marginBottom: '12px', 
            color: '#1976d2',
            fontSize: '1.1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={18} />
            AI Financial Insights
          </h3>
          <div className="insights-content">
            {insights.map((insight, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ fontSize: '20px' }}>{insight.emoji}</span>
                <span style={{ 
                  flex: 1,
                  fontSize: '14px',
                  fontWeight: '500',
                  lineHeight: '1.4'
                }} dangerouslySetInnerHTML={{ 
                  __html: insight.text
                    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #dc3545; font-weight: 600;">$1</strong>')
                }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {expenses.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          Start tracking expenses to unlock AI-powered financial insights
        </div>
      )}
    </div>
  );
};

export default AIInsights;
