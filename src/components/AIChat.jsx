import React, { useState } from 'react';
import { Send, MessageCircle, Bot, User } from 'lucide-react';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

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
      // Check if API key is available
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key not configured');
      }
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful financial assistant for Indian users. Answer this question directly and practically: "${inputText}"`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        const aiMessage = {
          id: Date.now() + 1,
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response');
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message}. Please try again.`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <MessageCircle size={20} />
        Ask AI Anything
      </h2>
      
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
            <p>Ask me anything about finances, investments, or money management!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} style={{
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
                  marginBottom: '4px'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                    {message.text}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
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
            <div style={{ color: '#666' }}>AI is thinking...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about finance, investments, savings..."
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px'
          }}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading || !inputText.trim()}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default AIChat;
