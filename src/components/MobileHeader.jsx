import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';

const MobileHeader = ({ currentUser }) => {
  const { currentClientExtended } = useTrading();
  const user = currentClientExtended || currentUser;
  const displayName = user?.name || 'Trader';
  
  const [showNotifs, setShowNotifs] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([]);

  useEffect(() => {
    setLocalNotifications(user?.notifications || []);
  }, [user?.notifications]);

  const unreadCount = localNotifications.filter(n => !n.read).length;

  const markAsRead = async (notifId) => {
     try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${user.id}/notifications/${notifId}/read`);
        setLocalNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
     } catch (err) {
        console.error('Failed to mark notification as read', err);
     }
  };

  return (
    <header className="mobile-header">
      <div className="m-header-user">
        <div className="m-avatar">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} 
            alt="User Avatar" 
          />
        </div>
        <div className="m-user-info">
          <p className="m-welcome">Welcome back,</p>
          <h2 className="m-name">{displayName}</h2>
        </div>
      </div>

      <div className="m-header-actions">
        <button className="m-action-btn">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <button className="m-action-btn" onClick={() => setShowNotifs(true)}>
          <i className="fa-solid fa-bell"></i>
          {unreadCount > 0 && <span className="m-notif-dot"></span>}
        </button>
      </div>

      {showNotifs && (
        <div className="mobile-notif-overlay">
          <div className="notif-overlay-header">
            <h2>Notifications</h2>
            <button className="close-notif-btn" onClick={() => setShowNotifs(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="notif-overlay-body no-scrollbar">
            {localNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-40">
                <i className="fa-solid fa-bell-slash text-4xl mb-4"></i>
                <p className="text-sm font-bold">No notifications yet</p>
              </div>
            ) : (
              [...localNotifications].reverse().map(n => (
                <div 
                  key={n.id} 
                  className={`mobile-notif-item ${!n.read ? 'unread' : ''}`}
                  onClick={() => !n.read && markAsRead(n.id)}
                >
                  <div className={`m-notif-icon ${n.type || 'info'}`}>
                    <i className={
                      n.type === 'success' ? 'fa-solid fa-check' : 
                      n.type === 'alert' ? 'fa-solid fa-triangle-exclamation' : 
                      'fa-solid fa-info'
                    }></i>
                  </div>
                  <div className="m-notif-content">
                    <p className="m-notif-message">{n.message}</p>
                    <span className="m-notif-time">{new Date(n.date).toLocaleString()}</span>
                  </div>
                  {!n.read && <div className="m-unread-indicator"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
