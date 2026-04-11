import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';

const API = import.meta.env.VITE_API_URL;

const QUICK_REPLIES = [
  "I need help with a deposit",
  "I have a withdrawal issue",
  "I need help with my account",
  "I have a trading question",
];

const EMOJIS = ['👋', '😊', '🙏', '👍', '❓', '💰', '📈', '✅'];

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

    socket.on('chat:message', onMessage);
    socket.on('chat:typing', onTyping);
    socket.on('chat:ticket_closed', onClosed);
    socket.on('chat:ticket_reopened', onReopened);
    socket.on('chat:ticket_blocked', onBlocked);

    return () => {
      socket.off('chat:message', onMessage);
      socket.off('chat:typing', onTyping);
      socket.off('chat:ticket_closed', onClosed);
      socket.off('chat:ticket_reopened', onReopened);
      socket.off('chat:ticket_blocked', onBlocked);
    };
  }, [socket, ticket]);

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

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg || !ticket || chatStatus === 'closed' || chatStatus === 'blocked') return;
    setInput('');
    setShowEmoji(false);

    // Optimistic — add immediately for user, do NOT add again when socket echoes back
    const optimistic = {
      senderId: currentUser?.id,
      senderRole: 'user',
      senderName: currentUser?.name,
      text: msg,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, optimistic]);

    if (socket) {
      socket.emit('chat:message', { ticketId: ticket.id, text: msg });
      // Stop typing text stream to admin
      socket.emit('chat:typing_text', { ticketId: ticket.id, text: '' });
      socket.emit('chat:typing', { ticketId: ticket.id, isTyping: false });
    }
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

  const addEmoji = (emoji) => {
    const val = input + emoji;
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
                <i className={supportIcon} />
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
            {ticket && <span className="chat-ticket-id">{ticket.id}</span>}
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
                <i className={supportIcon} />
              </div>
              <h4>Welcome to {supportName}</h4>
              <p>Our team is ready to help you. Ask us anything!</p>
              <div className="quick-replies">
                {QUICK_REPLIES.map((qr, i) => (
                  <button key={i} className="quick-reply-btn" onClick={() => sendMessage(qr)}>
                    {qr}
                  </button>
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
                        <i className={supportIcon} />
                      </div>
                    )}
                    <div className="chat-msg-bubble-wrap">
                      <div className={`chat-msg-bubble ${isUser ? 'user' : 'admin'}`}>
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
                <i className={supportIcon} />
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
          <div className="chat-closed-banner">
            <i className="fa-solid fa-lock" /> This chat has been closed by support.
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
              <div className="chat-emoji-picker">
                {EMOJIS.map(emoji => (
                  <button key={emoji} type="button" className="chat-emoji-btn"
                    onClick={() => addEmoji(emoji)}>
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            <div className="chat-input-row">
              <button type="button" className="chat-tool-btn" onClick={() => setShowEmoji(s => !s)}>
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
