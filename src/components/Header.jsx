import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';

const Header = ({ currentUser }) => {
  const { activeTrades, currentClientExtended, prices } = useTrading();
  const [showNotifs, setShowNotifs] = useState(false);
  
  // Use real-time synchronized data if available, fallback to static props
  const realTimeClient = currentClientExtended || currentUser;

  // Compute real-time floating P/L from live prices
  const computeLiveProfit = () => {
    const openTrades = activeTrades.filter(t => t.status === 'Open');
    if (openTrades.length === 0) return 0;
    return openTrades.reduce((sum, t) => {
      const p = prices.find(it => it.symbol === t.symbol);
      if (!p) return sum + (t.profit || 0);
      const currentPrice = parseFloat(p.price) || 0;
      const openPrice = t.openPrice || 0;
      const contractSize = p.category === 'Metals' ? 100 : 100000;
      const lots = t.lots || 0.01;
      const diff = t.type === 'BUY'
        ? (currentPrice - openPrice) * lots * contractSize
        : (openPrice - currentPrice) * lots * contractSize;
      return sum + diff;
    }, 0);
  };
  const floatingPL = computeLiveProfit();

  const balance = realTimeClient?.tradingMetrics?.balance || 0;
  const totalEquity = balance + floatingPL;
  const margin = realTimeClient?.tradingMetrics?.marginUsed || 0;
  const freeMargin = totalEquity - margin;
  const marginLevel = margin > 0 ? (totalEquity / margin) * 100 : 0;

  const [localNotifications, setLocalNotifications] = useState([]);

  useEffect(() => {
    setLocalNotifications(realTimeClient?.notifications || []);
  }, [realTimeClient?.notifications]);

  const unreadCount = localNotifications.filter(n => !n.read).length;

  const getMarginLevelColor = (level) => {
    if (level === 0) return 'var(--text-muted)';
    if (level < 100) return 'var(--danger)';
    if (level < 300) return 'var(--warning)';
    return 'var(--success)';
  };

  const markAsRead = async (notifId) => {
     try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${realTimeClient.id}/notifications/${notifId}/read`);
        setLocalNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
     } catch (err) {
        console.error('Failed to mark notification as read', err);
     }
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-group">
          <i className="fa-solid fa-cube" style={{ color: 'var(--accent)', fontSize: '22px' }}></i>
          <span className="Bullvera-logo" style={{ color: 'var(--text-main)' }}>Bullvera</span>
        </div>
      </div>

      <div className="header-center">
        <nav className="header-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `header-tab ${isActive ? 'active' : ''}`}>
            Trade
          </NavLink>
          <NavLink to="/app/analytics" className={({ isActive }) => `header-tab ${isActive ? 'active' : ''}`}>
            Analytics
          </NavLink>
          <NavLink to="/app/explore" className={({ isActive }) => `header-tab ${isActive ? 'active' : ''}`}>
            Explore
          </NavLink>
        </nav>
      </div>

      <div className="header-right">
        <div className="header-stats">
          <div className="stat-pill balance-pill">
            <span className="pill-label">Balance</span>
            <span className="pill-value">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="stat-pill profit-pill">
            <span className="pill-label">Profit</span>
            <span className={`pill-value ${floatingPL >= 0 ? "up" : "down"}`}>
              {floatingPL >= 0 ? '+' : ''}${floatingPL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="stat-pill equity-pill">
            <span className="pill-label">Equity</span>
            <span className={`pill-value ${floatingPL >= 0 ? "up" : "down"}`}>
              ${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="stat-pill free-margin-pill">
            <span className="pill-label">Free Margin</span>
            <span className="pill-value">${freeMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="stat-pill margin-level-pill">
            <span className="pill-label">Margin Level</span>
            <span className="pill-value" style={{ color: getMarginLevelColor(marginLevel) }}>
              {marginLevel > 0 ? `${marginLevel.toFixed(2)}%` : '0.00%'}
            </span>
          </div>

          <div className="account-selector">
            <span style={{ color: realTimeClient?.accountType === 'live' ? 'var(--accent)' : 'var(--warning)', fontWeight: 700 }}>
              {realTimeClient?.accountType === 'live' ? 'LIVE' : 'DEMO'}
            </span>
            <span style={{ color: 'var(--text-main)', opacity: 0.8 }}>{realTimeClient?.uid || 'BLV-0000'}</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: 'var(--text-muted)' }}></i>
          </div>
        </div>



        <div className="header-tools">
          <div style={{ position: 'relative' }}>
             <div onClick={() => setShowNotifs(!showNotifs)} style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-hover)' }}>
                <i className="fa-solid fa-bell" title="Notifications" style={{ color: 'var(--text-dim)' }}></i>
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
             </div>
             
             {showNotifs && (
               <div className="notif-dropdown">
                  <div className="notif-header">
                     <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)' }}>Notifications</h4>
                     <button onClick={() => setShowNotifs(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
                  </div>
                  <div className="notif-body">
                     {localNotifications.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                           No new notifications
                        </div>
                     ) : (
                        [...localNotifications].reverse().map(n => (
                           <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => !n.read && markAsRead(n.id)}>
                              <div className={`notif-icon ${n.type}`}><i className={n.type === 'success' ? 'fa-solid fa-check' : n.type === 'alert' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-info'}></i></div>
                              <div className="notif-content">
                                 <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.4', color: !n.read ? 'var(--text-main)' : 'var(--text-dim)' }}>{n.message}</p>
                                 <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{new Date(n.date).toLocaleString()}</span>
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
        
        <Link to="/app/profile" className="user-profile" style={{ textDecoration: 'none' }}>
          <div className="avatar" style={{ background: 'var(--bg-hover)', color: 'var(--text-main)' }}>
            {realTimeClient?.name ? realTimeClient.name.charAt(0).toUpperCase() : <i className="fa-solid fa-user" style={{ fontSize: '14px', color: 'var(--text-dim)' }}></i>}
          </div>
        </Link>
      </div>

      <style>{`
        .header-stats { display: flex; align-items: center; gap: 12px; }
        .stat-pill { display: flex; flex-direction: column; align-items: flex-end; min-width: 80px; }
        .pill-label { font-size: 9px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; opacity: 0.8; }
        .pill-value { font-size: 13px; font-weight: 800; color: var(--text-main); white-space: nowrap; }
        .pill-value.up { color: var(--success); }
        .pill-value.down { color: var(--danger); }
        
        .account-selector {
          background: var(--bg-hover);
          padding: 8px 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--border);
          cursor: pointer;
        }

        .notif-badge { position: absolute; top: -4px; right: -4px; background: var(--danger); color: white; font-size: 9px; font-weight: 800; padding: 2px 5px; border-radius: 10px; border: 2px solid var(--bg-deep); }
        .notif-dropdown { position: absolute; top: 40px; right: 0; width: 320px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,0.1); z-index: 100; overflow: hidden; animation: scaleIn 0.2s ease; }
        .notif-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--border); background: var(--bg-card-alt); }
        .notif-body { max-height: 400px; overflow-y: auto; }
        .notif-item { display: flex; gap: 12px; padding: 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s; align-items: flex-start; }
        .notif-item:hover { background: var(--bg-hover); }
        .notif-item.unread { background: rgba(255, 77, 94, 0.03); }
        
        .notif-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
        .notif-icon.info { background: var(--accent-muted); color: var(--accent); }
        .notif-icon.success { background: var(--success-muted); color: var(--success); }
        .notif-icon.alert { background: var(--danger-muted); color: var(--danger); }
        
        .notif-content { flex: 1; }
        .unread-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; margin-top: 4px; box-shadow: 0 0 8px var(--accent-muted); }

        @media (max-width: 900px) {
           .header-center { display: none; }
        }

        @media (max-width: 768px) {
           .header-stats { gap: 8px; }
           .stat-pill { min-width: auto; }
           .Bullvera-logo { display: none; }
        }

        @media (max-width: 600px) {
           .header { padding: 0 12px; height: 60px; }
           .pill-label { display: none; }
           .pill-value { font-size: 11px; }
           .account-selector span:last-of-type { display: none; }
           .account-selector { padding: 6px 10px; gap: 4px; }
        }

        @media (max-width: 480px) {
           .free-margin-pill, .margin-level-pill { display: none; }
           .header-stats { gap: 12px; }
        }
      `}</style>
    </header>
  );
};

export default Header;
