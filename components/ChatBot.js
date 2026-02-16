import { useState, useRef, useEffect } from 'react';
import botIcon from '../assets/bot.png';
import { fetchTasks } from '../utils/api';
import ReactMarkdown from 'react-markdown';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: 'Hi! I am your SmartPlanner assistant. How can I help you today?' }] }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const messagesEndRef = useRef(null);
    const chatRef = useRef(null);

    // Track user session and reset/load history
    useEffect(() => {
        const userId = sessionStorage.getItem('userId') || 'guest';
        if (userId !== currentUserId) {
            const savedHistory = sessionStorage.getItem(`chatHistory_${userId}`);
            if (savedHistory) {
                setMessages(JSON.parse(savedHistory));
            } else {
                setMessages([
                    { role: 'model', parts: [{ text: 'Hi! I am your SmartPlanner assistant. How can I help you today?' }] }
                ]);
            }
            setCurrentUserId(userId);
        }
    }, [isOpen]); // Check session whenever chat is opened or page reloads

    // Save history to sessionStorage with user-specific key
    useEffect(() => {
        if (currentUserId) {
            sessionStorage.setItem(`chatHistory_${currentUserId}`, JSON.stringify(messages));
        }
    }, [messages, currentUserId]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        if (userId && isOpen) {
            fetchTasks(userId)
                .then(data => {
                    if (Array.isArray(data)) setTasks(data);
                })
                .catch(err => console.error("ChatBot task fetch error:", err));
        }
    }, [isOpen, currentUserId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input;
        const currentPage = window.location.pathname;
        const today = new Date().toISOString().split('T')[0];
        const upcomingTasks = tasks.filter(task => task.deadline >= today);

        setInput('');
        setMessages(prev => [...prev, { role: 'user', parts: [{ text: userMessage }] }]);
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.slice(1),
                    tasks: upcomingTasks,
                    context: {
                        page: currentPage,
                        isLoggedIn: !!sessionStorage.getItem('userId'),
                        currentDate: today
                    }
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.details || data.error || `Server error (${response.status})`;
                setMessages(prev => [...prev, { role: 'model', parts: [{ text: `⚠️ ${errorMessage}` }] }]);
                setLoading(false);
                return;
            }

            if (data.text) {
                setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.text }] }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Sorry, I encountered an error. Please try again.' }] }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: `Error: ${error.message}` }] }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={chatRef} style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: "'Inter', sans-serif" }}>
            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'var(--card-bg)',
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    marginBottom: '20px',
                    border: '1px solid var(--border)',
                    transition: 'all 0.3s ease'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1.2rem',
                        background: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <img src={botIcon.src || botIcon} alt="Bot" style={{ width: '30px', height: '30px' }} />
                        <span style={{ fontWeight: '600' }}>AI Assistant</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'var(--bg)',
                                color: msg.role === 'user' ? 'white' : 'var(--text)',
                                padding: '0.8rem 1rem',
                                borderRadius: msg.role === 'user' ? '15px 15px 2px 15px' : '15px 15px 15px 2px',
                                maxWidth: '80%',
                                fontSize: '0.9rem',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                border: msg.role === 'model' ? '1px solid var(--border)' : 'none'
                            }}>
                                {msg.role === 'model' ? (
                                    <ReactMarkdown components={{
                                        p: ({ node, ...props }) => <p style={{ margin: 0 }} {...props} />,
                                        ul: ({ node, ...props }) => <ul style={{ margin: '5px 0', paddingLeft: '20px' }} {...props} />,
                                        ol: ({ node, ...props }) => <ol style={{ margin: '5px 0', paddingLeft: '20px' }} {...props} />,
                                        li: ({ node, ...props }) => <li style={{ margin: '2px 0' }} {...props} />
                                    }}>
                                        {msg.parts[0].text}
                                    </ReactMarkdown>
                                ) : (
                                    msg.parts[0].text
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--bg)', padding: '0.8rem 1rem', borderRadius: '15px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                padding: '0.6rem 1rem',
                                borderRadius: '25px',
                                border: '1px solid var(--border)',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                        <button type="submit" style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            ➤
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    float: 'right',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <img
                    src={botIcon.src || botIcon}
                    alt="AI Bot"
                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                />
            </button>
        </div>
    );
}
