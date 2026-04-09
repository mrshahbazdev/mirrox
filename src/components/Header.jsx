import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTrading } from '../context/TradingContext';

const Header = ({ currentUser }) => {
  const { activeTrades, currentClientExtended } = useTrading();
  
  // Use real-time synchronized data if available, fallback to static props
  const realTimeClient = currentClientExtended || currentUser;
  const floatingPL = realTimeClient?.accountSummary?.profitLoss || activeTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const totalEquity = realTimeClient?.tradingMetrics?.equity || 0;
  const balance = realTimeClient?.tradingMetrics?.balance || 0;

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
          <NavLink to="/analytics" className={({ isActive }) => `header-tab ${isActive ? 'active' : ''}`}>
            Analytics
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => `header-tab ${isActive ? 'active' : ''}`}>
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
          <i className="fa-solid fa-bell" title="Notifications"></i>
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
      `}</style>
    </header>
  );
};

export default Header;
