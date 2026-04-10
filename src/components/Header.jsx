import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';

const Header = ({ currentUser }) => {
  const { activeTrades, currentClientExtended } = useTrading();
  const [showNotifs, setShowNotifs] = useState(false);
  
  // Use real-time synchronized data if available, fallback to static props
  const realTimeClient = currentClientExtended || currentUser;
  const floatingPL = realTimeClient?.accountSummary?.profitLoss || activeTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const totalEquity = realTimeClient?.tradingMetrics?.equity || 0;
  const balance = realTimeClient?.tradingMetrics?.balance || 0;

  const notifications = realTimeClient?.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (notifId) => {
     try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${realTimeClient.id}/notifications/${notifId}/read`);
        // The contextual auto-fetch or socket update will clear it shortly.
     } catch (err) {
        console.error('Failed to mark notification as read', err);
     }
  };

  return (
    <header className="header glass">
      <div className="header-left">
        <div className="logo-group">
          <i className="fa-solid fa-cube" style={{ color: 'var(--accent)', fontSize: '22px' }}></i>
          <span className="mirrox-logo">mirrox</span>
        </div>
      </div>

      <div className="header-center">
        <nav className="header-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `header-tab ${isActive ? 'active' : ''}`}>
            Trade
          </NavLink>
        </nav>
      </div>

      <div className="header-right">
        <div className="header-stats">
          <div className="stat-pill balance-pill">
            <span className="pill-label">Balance</span>
            <span className="pill-value">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="stat-pill equity-pill">
            <span className="pill-label">Equity</span>
            <span className={`pill-value ${floatingPL >= 0 ? "up" : "down"}`}>
              ${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="account-selector">
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>LIVE</span>
            <span style={{ color: 'var(--text-main)', opacity: 0.8 }}>{realTimeClient?.uid || 'MRX-0000'}</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: 'var(--text-muted)' }}></i>
          </div>
        </div>

        <div className="divider-v"></div>

        <div className="header-tools">
          <i className="fa-solid fa-cloud" title="Connection status"></i>
          
          <div style={{ position: 'relative' }}>
             <div onClick={() => setShowNotifs(!showNotifs)} style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
                <i className="fa-solid fa-bell" title="Notifications"></i>
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
             </div>
             
             {showNotifs && (
               <div className="notif-dropdown glass">
                  <div className="notif-header">
                     <h4 style={{ margin: 0, fontSize: '14px' }}>Notifications</h4>
                     <button onClick={() => setShowNotifs(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
                  </div>
                  <div className="notif-body">
                     {notifications.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                           No new notifications
                        </div>
                     ) : (
                        [...notifications].reverse().map(n => (
                           <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => !n.read && markAsRead(n.id)}>
                              <div className={`notif-icon ${n.type}`}><i className={n.type === 'success' ? 'fa-solid fa-check' : n.type === 'alert' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-info'}></i></div>
                              <div className="notif-content">
                                 <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.4', color: !n.read ? '#fff' : '#94a3b8' }}>{n.message}</p>
                                 <span style={{ fontSize: '10px', color: '#64748b' }}>{new Date(n.date).toLocaleString()}</span>
                              </div>
                              {!n.read && <div className="unread-dot"></div>}
                           </div>
                        ))
                     )}
                  </div>
               </div>
             )}
          </div>
        </div>
        
        <div className="user-profile">
          <div className="avatar">
            {realTimeClient?.name ? realTimeClient.name.charAt(0).toUpperCase() : <i className="fa-solid fa-user" style={{ fontSize: '14px', color: 'var(--text-dim)' }}></i>}
          </div>
          <i className="fa-solid fa-bars" style={{ color: 'var(--text-muted)' }}></i>
        </div>
      </div>

      <style>{`
        .header-stats { display: flex; align-items: center; gap: 16px; }
        .stat-pill { display: flex; flex-direction: column; align-items: flex-end; min-width: 100px; }
        .pill-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
        .pill-value { font-size: 14px; font-weight: 800; color: white; }
        .pill-value.up { color: #00cc88; }
        .pill-value.down { color: #ff4d4d; }
        
        .account-selector {
          background: rgba(255,255,255,0.05);
          padding: 8px 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
        }

        .notif-badge { position: absolute; top: -4px; right: -4px; background: #ef4444; color: white; font-size: 9px; font-weight: 800; padding: 2px 5px; border-radius: 10px; border: 2px solid var(--bg-deep); }
        .notif-dropdown { position: absolute; top: 40px; right: 0; width: 320px; background: #0f1520; border: 1px solid #1e293b; border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,0.5); z-index: 100; overflow: hidden; animation: scaleIn 0.2s ease; }
        .notif-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #1e293b; background: rgba(255,255,255,0.02); }
        .notif-body { max-height: 400px; overflow-y: auto; }
        .notif-item { display: flex; gap: 12px; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.02); cursor: pointer; transition: background 0.2s; align-items: flex-start; }
        .notif-item:hover { background: rgba(255,255,255,0.03); }
        .notif-item.unread { background: rgba(50,145,255,0.03); }
        
        .notif-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
        .notif-icon.info { background: rgba(50,145,255,0.1); color: #3291ff; }
        .notif-icon.success { background: rgba(0,204,136,0.1); color: #00cc88; }
        .notif-icon.alert { background: rgba(239,68,68,0.1); color: #ef4444; }
        
        .notif-content { flex: 1; }
        .unread-dot { width: 8px; height: 8px; background: #3291ff; border-radius: 50%; margin-top: 4px; box-shadow: 0 0 8px #3291ff; }
      `}</style>
    </header>
  );
};

export default Header;
