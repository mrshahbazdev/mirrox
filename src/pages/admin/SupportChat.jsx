import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import EmojiPicker, { Theme } from 'emoji-picker-react';

const API = import.meta.env.VITE_API_URL;

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatRelative(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
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

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

const QUICK_RESPONSES = [
  "Thank you for reaching out! How can I assist you today?",
  "I understand the issue. Let me look into this for you.",
  "Your request has been processed successfully.",
  "Please allow 24 hours for processing.",
  "Could you please provide more details?",
];

export default function SupportChat({ onAdminLogout }) {
  const [socket, setSocket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [userTyping, setUserTyping] = useState(false);
  const [userTypingText, setUserTypingText] = useState(''); // real-time text from user
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [onlineVisitors, setOnlineVisitors] = useState([]); // live visitors
  const [showVisitors, setShowVisitors] = useState(false);
  const [newMsgTicketIds, setNewMsgTicketIds] = useState(new Set()); // for sidebar notification
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const selectedTicketRef = useRef(null);
  const adminToken = localStorage.getItem('mirrox_admin_token');
  const authHeader = { headers: { Authorization: `Bearer ${adminToken}` } };

  useEffect(() => { selectedTicketRef.current = selectedTicket; }, [selectedTicket]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, userTyping, userTypingText]);

  // Init socket
  useEffect(() => {
    const s = io(API, { auth: { token: adminToken } });
    setSocket(s);

    s.on('chat:message', (data) => {
      // Update ticket list
      setTickets(prev => prev.map(t =>
        t.id === data.ticketId
          ? {
              ...t,
              lastMessage: data.message.text,
              lastMessageAt: data.message.timestamp,
              unreadByAdmin: data.message.senderRole === 'user'
                ? (selectedTicketRef.current?.id === data.ticketId ? t.unreadByAdmin : (t.unreadByAdmin || 0) + 1)
                : t.unreadByAdmin
            }
          : t
      ));

      // Add message to view only if from USER (admin already added optimistically)
      if (selectedTicketRef.current?.id === data.ticketId && data.message.senderRole === 'user') {
        setMessages(m => [...m, data.message]);
        setUserTypingText(''); // clear typing preview
      }

      // Badge notification for new user messages
      if (data.message.senderRole === 'user' && selectedTicketRef.current?.id !== data.ticketId) {
        setNewMsgTicketIds(prev => new Set([...prev, data.ticketId]));
      }
    });

    s.on('chat:ticket_update', (data) => {
      setTickets(prev => {
        const exists = prev.find(t => t.id === data.ticketId);
        if (exists) {
          return prev.map(t => t.id === data.ticketId ? { ...t, ...data } : t);
        }
        return [{ id: data.ticketId, ...data, status: 'open' }, ...prev];
      });
    });

    // User typing indicator
    s.on('chat:typing', ({ role, isTyping }) => {
      if (role === 'user') setUserTyping(isTyping);
    });

    // Real-time text from user as they type
    s.on('chat:typing_text', ({ ticketId, text }) => {
      if (selectedTicketRef.current?.id === ticketId) {
        setUserTypingText(text);
        setUserTyping(!!text);
      }
    });

    s.on('chat:ticket_closed', ({ ticketId }) => {
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'closed' } : t));
      setSelectedTicket(prev => prev?.id === ticketId ? { ...prev, status: 'closed' } : prev);
    });

    s.on('chat:ticket_reopened', ({ ticketId }) => {
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'open' } : t));
      setSelectedTicket(prev => prev?.id === ticketId ? { ...prev, status: 'open' } : prev);
    });

    s.on('chat:ticket_blocked', ({ ticketId }) => {
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'blocked' } : t));
      setSelectedTicket(prev => prev?.id === ticketId ? { ...prev, status: 'blocked' } : prev);
    });

    s.on('chat:message_deleted', ({ ticketId, timestamp }) => {
      if (selectedTicketRef.current?.id === ticketId) {
        setMessages(prev => prev.filter(m => m.timestamp !== timestamp));
      }
    });

    s.on('chat:messages_read', ({ ticketId, readBy }) => {
      if (readBy === 'user') {
        if (selectedTicketRef.current?.id === ticketId) {
          setMessages(prev => prev.map(m => m.senderRole === 'admin' ? { ...m, read: true } : m));
        }
      }
    });

    // Online visitors
    s.on('visitors:update', (visitors) => {
      setOnlineVisitors(visitors);
    });

    return () => s.disconnect();
  }, [adminToken]);

  // Fetch all tickets
  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/api/support/tickets`, authHeader)
      .then(r => setTickets(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Recalculate total unread
  useEffect(() => {
    const unread = tickets.reduce((sum, t) => sum + (t.unreadByAdmin || 0), 0);
    setTotalUnread(unread);
  }, [tickets]);

  const selectTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setMessages(ticket.messages || []);
    setUserTyping(false);
    setUserTypingText('');
    setNewMsgTicketIds(prev => { const n = new Set(prev); n.delete(ticket.id); return n; });

    if (socket) socket.emit('chat:join', { ticketId: ticket.id });

    try {
      const r = await axios.get(`${API}/api/support/tickets/${ticket.id}`, authHeader);
      setMessages(r.data.messages || []);
      setSelectedTicket(r.data);
    } catch {}

    try {
      await axios.put(`${API}/api/support/tickets/${ticket.id}/read-admin`, {}, authHeader);
      setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, unreadByAdmin: 0 } : t));
    } catch {}

    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const sendMessage = (text, attachmentUrl = null) => {
    const msg = text || input.trim();
    if ((!msg && !attachmentUrl) || !selectedTicket) return;
    setInput('');
    setShowQuickReplies(false);

    if (socket) {
      socket.emit('chat:message', { ticketId: selectedTicket.id, text: msg, attachment: attachmentUrl });
    }

    const optimistic = {
      senderId: 'admin',
      senderRole: 'admin',
      senderName: 'Support Team',
      text: msg,
      attachment: attachmentUrl,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, optimistic]);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API}/api/upload`, formData, authHeader);
      sendMessage('', res.data.url);
    } catch (err) {
      console.error('File upload failed');
    }
  };

  const deleteMessage = (timestamp) => {
    if (!selectedTicket || !socket) return;
    socket.emit('chat:delete_message', { ticketId: selectedTicket.id, timestamp });
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (socket && selectedTicket) {
      socket.emit('chat:typing', { ticketId: selectedTicket.id, isTyping: true });
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        socket.emit('chat:typing', { ticketId: selectedTicket.id, isTyping: false });
      }, 1500);
    }
  };

  const onAdminEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const saveAdminNote = async (note) => {
    if (!selectedTicket) return;
    try {
      await axios.put(`${API}/api/support/tickets/${selectedTicket.id}/admin-note`, { note }, authHeader);
      setSelectedTicket(prev => ({ ...prev, adminNote: note }));
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, adminNote: note } : t));
    } catch {}
  };

  const closeTicket = () => {
    if (!selectedTicket) return;
    if (socket) socket.emit('chat:close_ticket', { ticketId: selectedTicket.id });
    setSelectedTicket(prev => ({ ...prev, status: 'closed' }));
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'closed' } : t));
  };

  const reopenTicket = () => {
    if (!selectedTicket) return;
    if (socket) socket.emit('chat:reopen_ticket', { ticketId: selectedTicket.id });
    setSelectedTicket(prev => ({ ...prev, status: 'open' }));
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'open' } : t));
  };

  const blockTicket = () => {
    if (!selectedTicket) return;
    setShowBlockModal(true);
  };

  const confirmBlock = () => {
    if (socket && selectedTicket) {
      socket.emit('chat:block_ticket', { ticketId: selectedTicket.id });
      setSelectedTicket(prev => ({ ...prev, status: 'blocked' }));
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'blocked' } : t));
    }
    setShowBlockModal(false);
  };

  const filteredTickets = tickets.filter(t => {
    const matchFilter = filter === 'all' || t.status === filter;
    const matchSearch = !search || t.clientName?.toLowerCase().includes(search.toLowerCase())
      || t.clientUid?.toLowerCase().includes(search.toLowerCase())
      || t.id?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.timestamp);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className={`support-chat-layout ${selectedTicket ? 'has-open-ticket' : ''}`}>
      {/* LEFT — Ticket List */}
      <div className="support-inbox">
        <div className="support-inbox-header">
          <div className="support-inbox-title-row">
            <h2 className="support-inbox-title">
              <i className="fa-solid fa-comments" /> Support Inbox
            </h2>
            {totalUnread > 0 && <span className="support-unread-badge">{totalUnread}</span>}
          </div>

          {/* Online Visitors Toggle */}
          <button
            className={`visitors-toggle-btn ${showVisitors ? 'active' : ''}`}
            onClick={() => setShowVisitors(s => !s)}
          >
            <span className="visitors-live-dot" />
            <span>{onlineVisitors.length} Online</span>
            <i className={`fa-solid fa-chevron-${showVisitors ? 'up' : 'down'}`} />
          </button>

          {showVisitors && (
            <div className="visitors-panel">
              <div className="visitors-panel-title">
                <i className="fa-solid fa-eye" /> Live Visitors
              </div>
              {onlineVisitors.length === 0 ? (
                <div className="visitors-empty">No users online right now</div>
              ) : (
                onlineVisitors.map(v => (
                  <div key={v.clientId} className="visitor-row">
                    <div className="visitor-dot" />
                    <div className="visitor-info">
                      <div className="visitor-name">{v.clientName}</div>
                      <div className="visitor-meta">{v.clientUid} · {v.page}</div>
                    </div>
                    <div className="visitor-time">{formatDuration(v.duration)}s</div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="support-search-wrap">
            <i className="fa-solid fa-magnifying-glass support-search-icon" />
            <input
              type="text"
              className="support-search-input"
              placeholder="Search client or ticket ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="support-filter-tabs">
            {['all', 'open', 'closed'].map(f => (
              <button
                key={f}
                className={`support-filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'closed' && (
                  <span className="support-tab-count">
                    {f === 'all' ? tickets.length : tickets.filter(t => t.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="support-ticket-list">
          {loading && (
            <div className="support-empty-state">
              <div className="chat-spinner" style={{ margin: '40px auto' }} />
            </div>
          )}
          {!loading && filteredTickets.length === 0 && (
            <div className="support-empty-state">
              <i className="fa-regular fa-comment-dots" />
              <p>No tickets found</p>
            </div>
          )}
          {filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              id={`ticket-${ticket.id}`}
              className={`support-ticket-item ${selectedTicket?.id === ticket.id ? 'active' : ''} ${(ticket.unreadByAdmin > 0 || newMsgTicketIds.has(ticket.id)) ? 'unread' : ''}`}
              onClick={() => selectTicket(ticket)}
            >
              <div className="ticket-item-avatar">
                {ticket.clientName?.[0]?.toUpperCase() || 'C'}
              </div>
              <div className="ticket-item-body">
                <div className="ticket-item-top">
                  <span className="ticket-item-name">{ticket.clientName || 'Unknown'}</span>
                  <span className="ticket-item-time">{formatRelative(ticket.lastMessageAt || ticket.createdAt)}</span>
                </div>
                <div className="ticket-item-sub">
                  <span className="ticket-item-uid">{ticket.clientUid}</span>
                  {ticket.category && <span className="ticket-category-tag">{ticket.category}</span>}
                  <span className={`ticket-status-dot ${ticket.status}`} />
                </div>
                <div className="ticket-item-preview">
                  {ticket.messages?.[ticket.messages.length - 1]?.text || 'No messages yet'}
                </div>
              </div>
              {(ticket.unreadByAdmin > 0 || newMsgTicketIds.has(ticket.id)) && (
                <span className="ticket-unread-count">{ticket.unreadByAdmin || '!'}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Conversation */}
      <div className="support-conversation">
        {!selectedTicket ? (
          <div className="support-no-selection">
            <i className="fa-regular fa-comments" />
            <h3>Select a conversation</h3>
            <p>Choose a ticket from the inbox to start replying</p>
          </div>
        ) : (
          <>
            {/* Convo Header */}
            <div className="support-convo-header">
              <div className="support-convo-client-info">
                <button className="mobile-convo-back-btn" onClick={() => setSelectedTicket(null)}>
                  <i className="fa-solid fa-chevron-left" />
                </button>
                <div className="convo-avatar">
                  {selectedTicket.clientName?.[0]?.toUpperCase() || 'C'}
                </div>
                <div>
                  <div className="convo-client-name">{selectedTicket.clientName}</div>
                  <div className="convo-client-meta">
                    {selectedTicket.clientUid} · <span className="convo-ticket-id">{selectedTicket.id}</span>
                    {userTyping && <span style={{ color: 'var(--success)', marginLeft: 8 }}>· Typing...</span>}
                  </div>
                </div>
              </div>
              <div className="support-convo-actions">
                <span className={`convo-status-badge ${selectedTicket.status}`}>
                  <span className={`ticket-status-dot ${selectedTicket.status}`} />
                  {selectedTicket.status === 'open' ? 'Open' : selectedTicket.status === 'blocked' ? 'Blocked' : 'Closed'}
                </span>
                {selectedTicket.status === 'open' ? (
                  <>
                    <button className="btn-close-ticket" onClick={closeTicket}>
                      <i className="fa-solid fa-circle-xmark" /> Close
                    </button>
                    <button className="btn-close-ticket" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={blockTicket}>
                      <i className="fa-solid fa-ban" /> Block User
                    </button>
                  </>
                ) : (
                  <button className="btn-reopen-ticket" onClick={reopenTicket}>
                    <i className="fa-solid fa-rotate-left" /> Unblock & Reopen
                  </button>
                )}
              </div>
            </div>

            {/* Admin Internal Memo */}
            <div className="admin-memo-strip">
              <i className="fa-solid fa-note-sticky" />
              <input 
                type="text" 
                placeholder="Add a private note/memo for this ticket..."
                defaultValue={selectedTicket.adminNote || ''}
                onBlur={(e) => saveAdminNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
              />
            </div>

            {/* Messages */}
            <div className="support-messages-area">
              {messages.length === 0 && (
                <div className="support-no-messages">
                  <i className="fa-regular fa-paper-plane" />
                  <p>No messages yet. Send the first reply!</p>
                </div>
              )}

              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="chat-date-divider"><span>{date}</span></div>
                  {msgs.map((msg, i) => {
                    const isAdmin = msg.senderRole === 'admin';
                    return (
                      <div key={i} className={`support-msg-row ${isAdmin ? 'admin' : 'user'}`}>
                        {!isAdmin && (
                          <div className="support-msg-avatar">
                            {selectedTicket.clientName?.[0]?.toUpperCase() || 'C'}
                          </div>
                        )}
                        <div className="support-msg-bubble-wrap">
                          <div className={`chat-msg-bubble ${isAdmin ? 'admin' : 'user'}`}>
                            {msg.attachment && (
                              <img src={msg.attachment} alt="Attachment" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: msg.text ? '8px' : '0' }} />
                            )}
                            {msg.text}
                          </div>
                          <div className="chat-msg-meta">
                            {isAdmin ? 'You' : msg.senderName} · {formatTime(msg.timestamp)}
                            {isAdmin && (
                              <>
                                <i className={`fa-solid fa-check${msg.read ? '-double' : ''} chat-read-icon`}
                                  style={{ color: msg.read ? '#3291ff' : '#64748b' }} />
                                <span style={{ marginLeft: 8, cursor: 'pointer', color: '#ff4d4d' }} onClick={() => deleteMessage(msg.timestamp)} title="Unsend Message">
                                  <i className="fa-solid fa-trash-can" />
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {isAdmin && <div className="support-msg-avatar admin-bubble-avatar">
                          <i className="fa-solid fa-headset" />
                        </div>}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Real-time typing text preview from user */}
              {userTypingText && (
                <div className="support-msg-row user">
                  <div className="support-msg-avatar">
                    {selectedTicket.clientName?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div className="support-msg-bubble-wrap">
                    <div className="chat-msg-bubble user typing-preview">
                      {userTypingText}
                      <span className="typing-cursor" />
                    </div>
                    <div className="chat-msg-meta" style={{ color: 'var(--success)' }}>
                      <i className="fa-solid fa-keyboard" style={{ marginRight: 4 }} />
                      typing...
                    </div>
                  </div>
                </div>
              )}

              {/* Typing indicator (dots) — shown only when typing but no text yet */}
              {userTyping && !userTypingText && (
                <div className="support-msg-row user">
                  <div className="support-msg-avatar">
                    {selectedTicket.clientName?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div className="chat-typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {selectedTicket.status === 'open' ? (
              <div className="support-input-area">
                {showQuickReplies && (
                  <div className="quick-responses-panel">
                    <div className="qr-header"><i className="fa-solid fa-bolt" /> Quick Responses</div>
                    {QUICK_RESPONSES.map((qr, i) => (
                      <button key={i} className="qr-item" onClick={() => sendMessage(qr)}>
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
                <div className="support-input-row">
                  <input type="file" id="admin-chat-file" style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
                  <button
                    className="chat-tool-btn"
                    onClick={() => document.getElementById('admin-chat-file').click()}
                    title="Attach Image"
                  >
                    <i className="fa-solid fa-paperclip" />
                  </button>
                  <button
                    className="chat-tool-btn"
                    onClick={() => setShowEmoji(!showEmoji)}
                    title="Emojis"
                  >
                    <i className="fa-regular fa-face-smile" />
                  </button>
                  <button
                    className="chat-tool-btn"
                    onClick={() => setShowQuickReplies(s => !s)}
                    title="Quick Responses"
                  >
                    <i className="fa-solid fa-bolt" />
                  </button>
                  {showEmoji && (
                    <div className="support-emoji-container">
                      <EmojiPicker 
                        theme={Theme.DARK}
                        onEmojiClick={onAdminEmojiClick}
                        width={300}
                        height={400}
                        skinTonesDisabled
                      />
                    </div>
                  )}
                  <textarea
                    ref={inputRef}
                    className="chat-input"
                    placeholder="Type your reply..."
                    value={input}
                    onChange={handleTyping}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <button
                    className="chat-send-btn"
                    onClick={() => sendMessage()}
                    disabled={!input.trim()}
                  >
                    <i className="fa-solid fa-paper-plane" />
                  </button>
                </div>
                <div className="chat-input-hint">Enter to send · Shift+Enter for new line</div>
              </div>
            ) : (
              <div className="support-closed-input-placeholder">
                {selectedTicket.status === 'blocked' ? (
                  <><i className="fa-solid fa-ban" style={{ color: '#ef4444' }} /> User is blocked from chat.</>
                ) : (
                  <><i className="fa-solid fa-lock" /> This ticket is closed.</>
                )}
                <button className="btn-reopen-ticket inline" onClick={reopenTicket}>Reopen to Reply</button>
              </div>
            )}
          </>
        )}
      </div>
      {/* Block Confirmation Modal */}
      {showBlockModal && (
        <div className="support-modal-overlay">
          <div className="support-modal-card">
            <div className="support-modal-header">
              <i className="fa-solid fa-ban" style={{ color: '#ef4444' }} />
              <h4>Block User Access</h4>
            </div>
            <div className="support-modal-body">
              <p>Are you sure you want to block <strong>{selectedTicket?.clientName}</strong>? They will no longer be able to send messages, but they can still see their chat history.</p>
            </div>
            <div className="support-modal-footer">
              <button className="support-modal-btn cancel" onClick={() => setShowBlockModal(false)}>Cancel</button>
              <button className="support-modal-btn confirm-block" onClick={confirmBlock}>Yes, Block User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
