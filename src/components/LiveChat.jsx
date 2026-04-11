import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTrading } from '../context/TradingContext';

const API = import.meta.env.VITE_API_URL;

const QUICK_REPLIES = [
  "I need help with a deposit",
  "I have a withdrawal issue",
  "I need help with my account",
  "I have a trading question",
];

// Legacy EMOJIS array removed in favor of emoji-picker-react library

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(ts) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function LiveChat({ currentUser }) {
  const { socket } = useTrading();
  const [isOpen, setIsOpen] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminTyping, setAdminTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [chatStatus, setChatStatus] = useState('open');
  const [connecting, setConnecting] = useState(false);
  const [systemConfig, setSystemConfig] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  const playDing = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch(e){}
  }, []);

  useEffect(() => {
    if (unreadCount > 0) {
      const orig = document.title;
      const interval = setInterval(() => {
        document.title = document.title === orig ? `💬 (${unreadCount}) Message` : orig;
      }, 1500);
      return () => { clearInterval(interval); document.title = orig; };
    }
  }, [unreadCount]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, adminTyping]);

  useEffect(() => {
    axios.get(`${API}/api/config`).then(r => setSystemConfig(r.data)).catch(() => {});
  }, []);

  // Load existing ticket on mount
  useEffect(() => {
    if (!currentUser?.id) return;
    axios.get(`${API}/api/support/my-ticket`)
      .then(r => {
        if (r.data) {
          setTicket(r.data);
          setMessages(r.data.messages || []);
          setChatStatus(r.data.status || 'open');
          setUnreadCount(r.data.unreadByClient || 0);
        }
      })
      .catch(() => {});
  }, [currentUser]);

  // Emit user visit event when user connects
  useEffect(() => {
    if (!socket || !currentUser?.id) return;
    socket.emit('user:visit', {
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientUid: currentUser.uid,
      page: window.location.pathname
    });

    // Track page changes
    const onUnload = () => socket.emit('user:leave', { clientId: currentUser.id });
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [socket, currentUser]);

  // Socket events
  useEffect(() => {
    if (!socket || !ticket) return;

    socket.emit('chat:join', { ticketId: ticket.id });

    const onMessage = (data) => {
      if (data.ticketId !== ticket.id) return;
      // Only add messages from ADMIN — user messages are added optimistically
      if (data.message.senderRole === 'admin') {
        setMessages(prev => [...prev, data.message]);
        if (!isOpenRef.current) {
          setUnreadCount(c => c + 1);
          playDing();
        } else {
          // If open, notify admin that we read it immediately
          const token = localStorage.getItem('mirrox_token');
          const clientHeader = { headers: { Authorization: `Bearer ${token}` } };
          axios.put(`${API}/api/support/tickets/${ticket.id}/read-client`, {}, clientHeader).catch(() => {});
        }
      }
    };

    const onTyping = ({ role, isTyping }) => {
      // Only show indicator for admin typing — NOT admin's text
      if (role === 'admin') setAdminTyping(isTyping);
    };

    const onClosed = () => setChatStatus('closed');
    const onReopened = () => setChatStatus('open');
    const onBlocked = () => setChatStatus('blocked');
    const onRead = ({ readBy }) => {
      if (readBy === 'admin') {
        setMessages(prev => prev.map(m => m.senderRole === 'user' ? { ...m, read: true } : m));
      }
    };
    const onDeleted = ({ timestamp }) => {
      setMessages(prev => prev.filter(m => m.timestamp !== timestamp));
    };

    socket.on('chat:message', onMessage);
    socket.on('chat:typing', onTyping);
    socket.on('chat:ticket_closed', onClosed);
    socket.on('chat:ticket_reopened', onReopened);
    socket.on('chat:ticket_blocked', onBlocked);
    socket.on('chat:messages_read', onRead);
    socket.on('chat:message_deleted', onDeleted);

    return () => {
      socket.off('chat:message', onMessage);
      socket.off('chat:typing', onTyping);
      socket.off('chat:ticket_closed', onClosed);
      socket.off('chat:ticket_reopened', onReopened);
      socket.off('chat:ticket_blocked', onBlocked);
      socket.off('chat:messages_read', onRead);
      socket.off('chat:message_deleted', onDeleted);
    };
  }, [socket, ticket, playDing]);

  // Mark read when opened
  useEffect(() => {
    if (isOpen && ticket) {
      setUnreadCount(0);
      axios.put(`${API}/api/support/tickets/${ticket.id}/read-client`).catch(() => {});
    }
  }, [isOpen, ticket]);

  const openChat = async () => {
    setIsOpen(true);
    if (!ticket) {
      setConnecting(true);
      try {
        const r = await axios.post(`${API}/api/support/tickets`);
        setTicket(r.data);
        setMessages(r.data.messages || []);
        setChatStatus(r.data.status || 'open');
        if (socket) socket.emit('chat:join', { ticketId: r.data.id });
      } catch (e) {
        console.error('Failed to open ticket');
      } finally {
        setConnecting(false);
      }
    }
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const startNewChat = async () => {
    if (socket && ticket) {
      socket.emit('chat:leave', { ticketId: ticket.id });
    }
    setTicket(null);
    setMessages([]);
    setChatStatus('open');
    setConnecting(true);
    try {
      const r = await axios.post(`${API}/api/support/tickets`);
      setTicket(r.data);
      setMessages(r.data.messages || []);
      setChatStatus(r.data.status || 'open');
      if (socket) socket.emit('chat:join', { ticketId: r.data.id });
    } catch (e) {
      console.error('Failed to create new ticket');
    } finally {
      setConnecting(false);
    }
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const sendMessage = (text, attachmentUrl = null) => {
    const msg = text || input.trim();
    if ((!msg && !attachmentUrl) || !ticket || chatStatus === 'closed' || chatStatus === 'blocked') return;
    setInput('');
    setShowEmoji(false);

    const optimistic = {
      senderId: currentUser?.id,
      senderRole: 'user',
      senderName: currentUser?.name,
      text: msg,
      attachment: attachmentUrl,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, optimistic]);

    if (socket) {
      socket.emit('chat:message', { ticketId: ticket.id, text: msg, attachment: attachmentUrl });
      socket.emit('chat:typing_text', { ticketId: ticket.id, text: '' });
      socket.emit('chat:typing', { ticketId: ticket.id, isTyping: false });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setConnecting(true); // Re-using state as an uploading indicator spinner
      const res = await axios.post(`${API}/api/upload`, formData);
      sendMessage('', res.data.url);
    } catch (err) {
      console.error('File upload failed');
    } finally {
      setConnecting(false);
    }
  };

  const submitRating = async (stars) => {
    try {
      const token = localStorage.getItem('mirrox_token');
      const clientHeader = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(`${API}/api/support/tickets/${ticket.id}/rate`, { rating: stars }, clientHeader);
      setTicket(res.data);
    } catch (e) {
       console.error('Failed to submit rating', e);
    }
  };

  const selectCategory = async (cat) => {
    if (!ticket) return;
    try {
      const token = localStorage.getItem('mirrox_token');
      const clientHeader = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API}/api/support/tickets/${ticket.id}/category`, { category: cat }, clientHeader);
      setTicket(prev => ({ ...prev, category: cat }));
      sendMessage(`I need help with: ${cat}`);
    } catch (e) {}
  };

  const handleTyping = (e) => {
    const val = e.target.value;
    setInput(val);
    if (socket && ticket) {
      // Send real-time text to admin
      socket.emit('chat:typing_text', { ticketId: ticket.id, text: val });
      // Send typing indicator
      socket.emit('chat:typing', { ticketId: ticket.id, isTyping: !!val });
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        socket.emit('chat:typing', { ticketId: ticket.id, isTyping: false });
        socket.emit('chat:typing_text', { ticketId: ticket.id, text: '' });
      }, 3000);
    }
  };

  const onEmojiClick = (emojiData) => {
    const val = input + emojiData.emoji;
    setInput(val);
    if (socket && ticket) {
      socket.emit('chat:typing_text', { ticketId: ticket.id, text: val });
      socket.emit('chat:typing', { ticketId: ticket.id, isTyping: true });
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        socket.emit('chat:typing', { ticketId: ticket.id, isTyping: false });
        socket.emit('chat:typing_text', { ticketId: ticket.id, text: '' });
      }, 3000);
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.timestamp);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  const supportName = systemConfig.support_name || 'Mirrox Support';
  const supportIcon = systemConfig.support_icon || 'fa-solid fa-headset';

  const downloadTranscript = () => {
    if (!messages.length) return;
    const text = messages.map(m => `[${formatTime(m.timestamp)}] ${m.senderRole === 'user' ? 'You' : supportName}: ${m.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Support_Chat_${ticket?.id || 'Transcript'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Floating Bubble */}
      <button
        id="live-chat-bubble"
        className={`chat-bubble ${isOpen ? 'active' : ''}`}
        onClick={() => isOpen ? setIsOpen(false) : openChat()}
        aria-label="Live Chat Support"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-message'}`} />
        {unreadCount > 0 && !isOpen && (
          <span className="chat-bubble-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {/* Chat Panel */}
      <div className={`chat-panel ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chat-panel-header">
          <div className="chat-header-info">
            <div className="chat-avatar-wrap">
              <div className="chat-avatar support-avatar">
                {systemConfig.support_avatar ? (
                  <img src={systemConfig.support_avatar} alt="Support" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <i className={supportIcon} />
                )}
              </div>
              <span className="chat-online-dot" />
            </div>
            <div>
              <div className="chat-header-name">{supportName}</div>
              <div className="chat-header-sub">
                {chatStatus === 'closed' ? (
                  <span style={{ color: '#ff4d4d' }}>Chat Closed</span>
                ) : chatStatus === 'blocked' ? (
                  <span style={{ color: '#ff4d4d' }}>Chat Blocked</span>
                ) : adminTyping ? (
                  <span style={{ color: 'var(--success)' }}>Typing...</span>
                ) : (
                  <span>Online · Typically replies fast</span>
                )}
              </div>
            </div>
          </div>
          <div className="chat-header-actions">
            {ticket && <span className="chat-ticket-id" style={{ marginRight: '8px' }}>{ticket.id}</span>}
            <button className="chat-minimize-btn" title="Download Chat History" onClick={downloadTranscript}>
              <i className="fa-solid fa-download" />
            </button>
            <button className="chat-minimize-btn" onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-chevron-down" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="chat-messages-area">
          {connecting && (
            <div className="chat-connecting">
              <div className="chat-spinner" />
              <span>Connecting to support...</span>
            </div>
          )}

          {!connecting && messages.length === 0 && (
            <div className="chat-welcome">
              <div className="chat-welcome-icon">
                {systemConfig.support_avatar ? (
                  <img src={systemConfig.support_avatar} alt="Support" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', border: '3px solid var(--accent)' }} />
                ) : (
                  <i className={supportIcon} />
                )}
              </div>
              <h4>Welcome to {supportName}</h4>
              <p>How can we help you today? Please select a category:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
                <button className="quick-reply-btn" onClick={() => selectCategory('Deposit/Withdrawal')}><i className="fa-solid fa-wallet" /> Finance</button>
                <button className="quick-reply-btn" onClick={() => selectCategory('Technical Support')}><i className="fa-solid fa-gears" /> Technical</button>
                <button className="quick-reply-btn" onClick={() => selectCategory('Account Issues')}><i className="fa-solid fa-user-shield" /> Account</button>
                <button className="quick-reply-btn" onClick={() => selectCategory('General Inquiry')}><i className="fa-solid fa-circle-info" /> General</button>
              </div>
            </div>
          )}

          {!connecting && messages.length > 0 && !ticket?.category && (
             <div className="chat-welcome" style={{ padding: '10px', background: 'var(--bg-hover)', borderRadius: '12px', marginBottom: '20px' }}>
                <p style={{ fontSize: '12px', marginBottom: '8px', fontWeight: 700 }}>Select a category to help us route your request:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                   {['Finance', 'Technical', 'Account', 'General'].map(c => (
                      <button key={c} className="quick-reply-btn" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => selectCategory(c)}>{c}</button>
                   ))}
                </div>
             </div>
          )}

          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="chat-date-divider"><span>{date}</span></div>
              {msgs.map((msg, i) => {
                const isUser = msg.senderRole === 'user';
                return (
                  <div key={i} className={`chat-msg-row ${isUser ? 'user' : 'admin'}`}>
                    {!isUser && (
                      <div className="chat-msg-avatar">
                        {systemConfig.support_avatar ? (
                          <img src={systemConfig.support_avatar} alt="S" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <i className={supportIcon} />
                        )}
                      </div>
                    )}
                    <div className="chat-msg-bubble-wrap">
                      <div className={`chat-msg-bubble ${isUser ? 'user' : 'admin'}`}>
                        {msg.attachment && (
                          <img src={msg.attachment} alt="Attachment" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: msg.text ? '8px' : '0' }} />
                        )}
                        {msg.text}
                      </div>
                      <div className="chat-msg-meta">
                        {formatTime(msg.timestamp)}
                        {isUser && (
                          <i className={`fa-solid fa-check${msg.read ? '-double' : ''} chat-read-icon`}
                            style={{ color: msg.read ? '#3291ff' : '#64748b' }} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Admin typing — only dots indicator, no text */}
          {adminTyping && (
            <div className="chat-msg-row admin">
              <div className="chat-msg-avatar">
                {systemConfig.support_avatar ? (
                  <img src={systemConfig.support_avatar} alt="S" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <i className={supportIcon} />
                )}
              </div>
              <div className="chat-typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Closed Banner */}
        {chatStatus === 'closed' && (
          <div className="chat-closed-banner" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!ticket?.rating ? (
              <div style={{ textAlign: 'center', background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>Rate this conversation</h4>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <i key={star} className="fa-solid fa-star csat-star" onClick={() => submitRating(star)} 
                       onMouseEnter={(e) => { e.target.style.color = '#fbbf24'; }} 
                       onMouseLeave={(e) => { e.target.style.color = 'var(--text-muted)'; }} />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <i className="fa-solid fa-check-circle" style={{ color: 'var(--success)' }} /> You rated this chat {ticket.rating} stars.
              </div>
            )}
            <div><i className="fa-solid fa-lock" /> This chat has been closed by support.</div>
            <button onClick={startNewChat} style={{
              background: '#3291ff', color: '#fff', border: 'none', borderRadius: '6px', 
              padding: '8px 12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}>
              <i className="fa-solid fa-plus"></i> Start New Conversation
            </button>
          </div>
        )}
        {chatStatus === 'blocked' && (
          <div className="chat-closed-banner" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <i className="fa-solid fa-ban" /> You have been blocked from support chat.
          </div>
        )}

        {/* Input Area */}
        {chatStatus === 'open' && (
          <div className="chat-input-area">
            {showEmoji && (
              <div className="chat-emoji-container">
                <EmojiPicker 
                  theme={Theme.DARK}
                  onEmojiClick={onEmojiClick}
                  width="100%"
                  height={320}
                  skinTonesDisabled
                  searchPlaceHolder="Search emojis..."
                />
              </div>
            )}
            {/* Quick Replies Tray inside chat */}
            {messages.length > 0 && (
              <div className="chat-quick-replies-tray">
                {(() => {
                  try {
                    const replies = JSON.parse(systemConfig.support_quick_replies || '[]');
                    return (replies.length > 0 ? replies : QUICK_REPLIES).map((qr, i) => (
                      <button key={i} className="chat-qr-pill" onClick={() => sendMessage(qr)}>
                        {qr}
                      </button>
                    ));
                  } catch (e) {
                    return QUICK_REPLIES.map((qr, i) => (
                      <button key={i} className="chat-qr-pill" onClick={() => sendMessage(qr)}>
                        {qr}
                      </button>
                    ));
                  }
                })()}
              </div>
            )}

            <div className="chat-input-row">
              <input type="file" id="chat-file-upload" style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
              <button className="chat-tool-btn" onClick={() => document.getElementById('chat-file-upload').click()} title="Attach Image">
                <i className="fa-solid fa-paperclip" />
              </button>
              <button className="chat-tool-btn" onClick={() => setShowEmoji(!showEmoji)} title="Emojis">
                <i className="fa-regular fa-face-smile" />
              </button>
              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Type your message..."
                value={input}
                onChange={handleTyping}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={!ticket || connecting}
              />
              <button
                className="chat-send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() || !ticket}
              >
                <i className="fa-solid fa-paper-plane" />
              </button>
            </div>
            <div className="chat-input-hint">Press Enter to send · Shift+Enter for new line</div>
          </div>
        )}
      </div>
    </>
  );
}
