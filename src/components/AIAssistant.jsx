import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_PERSONA } from '../data/aiPersona';
import { useLanguage } from '../context/LanguageContext';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { lang } = useLanguage();

  // Initialize Gemini Chat Session
  const chatSessionRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) return; // Will handle error visually in chat

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash",
          systemInstruction: AI_PERSONA
        });

        chatSessionRef.current = model.startChat({
          history: [],
        });
      } catch (err) {
        console.error("Failed to initialize Gemini:", err);
      }
    };

    initChat();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    await sendMessageToGemini(userText);
  };

  const sendMessageToGemini = async (userText) => {
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: lang === 'ZH' 
            ? '无法连接。请在项目根目录创建 `.env.local` 文件并添加 `VITE_GEMINI_API_KEY=your_key` 来激活我的灵魂。'
            : 'Connection failed. Please add `VITE_GEMINI_API_KEY=your_key` to `.env.local` in the project root to activate my soul.'
        }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      if (!chatSessionRef.current) {
        throw new Error("Chat not initialized");
      }
      const result = await chatSessionRef.current.sendMessage(userText);
      const responseText = result.response.text();
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: lang === 'ZH' ? '抱歉，我的思维网络出现了短暂的波动，请稍后再试。' : 'Apologies, my neural network experienced a temporary fluctuation. Please try again.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '6rem', right: '2rem', zIndex: 9999 }}>
      <AnimatePresence>
        {!isOpen && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {/* Tooltip Bubble */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                position: 'absolute',
                right: '100%',
                marginRight: '1rem',
                whiteSpace: 'nowrap',
                backgroundColor: '#fff',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#333',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)',
                pointerEvents: 'none'
              }}
            >
              {lang === 'ZH' ? '向我提问关于道一的一切' : 'Ask me everything about daoyi'}
              {/* Little triangle arrow pointing right */}
              <div style={{
                content: '""',
                position: 'absolute',
                top: '50%',
                right: '-5px',
                transform: 'translateY(-50%)',
                borderWidth: '5px 0 5px 6px',
                borderStyle: 'solid',
                borderColor: 'transparent transparent transparent #fff',
              }} />
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#111',
              boxShadow: '0 0 20px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            {/* Glowing Pulse Effect */}
            <motion.div 
              animate={{ 
                boxShadow: ['0 0 0 0px rgba(0,0,0,0.2)', '0 0 0 15px rgba(0,0,0,0)']
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
              }}
            />
            {/* Inner Core */}
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#fff' }} />
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              width: '350px',
              height: '500px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: '1rem', 
              borderBottom: '1px solid rgba(0,0,0,0.05)', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#111' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {lang === 'ZH' ? '数字分身' : 'AI Shadow Clone'}
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' }}
              >×</button>
            </div>

            {/* Chat History */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '2rem' }}>
                  <div style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {lang === 'ZH' 
                      ? '你好，我是道一的智能分身。关于他的转行经历或设计哲学，你想了解什么？' 
                      : 'Hello, I am Daoyi\'s AI clone. What would you like to know about his background or design philosophy?'}
                  </div>
                  
                  {/* Preset Questions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                    {[
                      lang === 'ZH' ? '✨ 你的设计理念是什么？' : '✨ What is your design philosophy?',
                      lang === 'ZH' ? '🚀 为什么从城规转行做产品经理？' : '🚀 Why transition from Urban Planning to PM?',
                      lang === 'ZH' ? '💻 你在空间数据科学方面做了什么？' : '💻 Tell me about your spatial data science work.'
                    ].map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessageToGemini(q)}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: '1px solid #eee',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          fontSize: '0.85rem',
                          color: '#333',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#eaeaea'; e.currentTarget.style.borderColor = '#ddd'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.borderColor = '#eee'; }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div key={idx} style={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.role === 'user' ? '#111' : '#f5f5f5',
                  color: msg.role === 'user' ? '#fff' : '#111',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '2px' : '12px',
                  maxWidth: '85%',
                  fontSize: '0.9rem',
                  lineHeight: 1.5
                }}>
                  {msg.text}
                </div>
              ))}
              
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', color: '#888', fontSize: '0.8rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }}>●</motion.span>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>●</motion.span>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}>●</motion.span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={lang === 'ZH' ? '与分身对话...' : 'Chat with clone...'}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid #ddd',
                    outline: 'none',
                    fontSize: '0.9rem',
                    backgroundColor: '#f9f9f9'
                  }}
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  style={{
                    backgroundColor: input.trim() && !isTyping ? '#111' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: input.trim() && !isTyping ? 'pointer' : 'default',
                    transition: 'background-color 0.2s'
                  }}
                >
                  ↑
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
