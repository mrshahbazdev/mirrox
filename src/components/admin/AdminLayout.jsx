import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTrading } from '../../context/TradingContext';

const AdminLayout = ({ children, onAdminLogout }) => {
  const navigate = useNavigate();
  const { socket } = useTrading();

  const handleLogout = () => {
    onAdminLogout();
    navigate('/admin/login');
  };

  const [pendingKycCount, setPendingKycCount] = useState(0);
  const [activeTraderCount, setActiveTraderCount] = useState(0);
  const [pendingFinanceCount, setPendingFinanceCount] = useState(0);

  const fetchAdminStats = useCallback(async () => {
    try {
      const [clientRes, activeRes, depRes, withRes] = await Promise.all([
        axios.get('http://localhost:3000/api/clients'),
        axios.get('http://localhost:3000/api/active-traders'),
        axios.get('http://localhost:3000/api/deposits'),
        axios.get('http://localhost:3000/api/withdrawals')
      ]);
      
      const count = clientRes.data.filter(c => c.kyc && c.kyc.status === 'pending').length;
      setPendingKycCount(count);
      setActiveTraderCount(activeRes.data.count || 0);

      const pendingFinances = 
        depRes.data.filter(d => d.status === 'pending').length + 
        withRes.data.filter(w => w.status === 'pending').length;
      setPendingFinanceCount(pendingFinances);
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
    }
  }, []);

  useEffect(() => {
    fetchAdminStats();
    const interval = setInterval(fetchAdminStats, 10000);
    
    if (socket) {
      socket.on('finance_update', fetchAdminStats);
    }

    return () => {
      clearInterval(interval);
      if (socket) socket.off('finance_update', fetchAdminStats);
    };
  }, [socket, fetchAdminStats]);

  const navItems = [
    { icon: 'fa-solid fa-users', path: '/admin/clients', label: 'Clients' },
    { icon: 'fa-solid fa-chart-line', path: '/admin/active-traders', label: 'Active Risk', badge: activeTraderCount, badgeColor: '#00cc88' },
    { icon: 'fa-solid fa-address-card', path: '/admin/verifications', label: 'Verifications', badge: pendingKycCount, badgeColor: '#ff4d4d' },
    { icon: 'fa-solid fa-coins', path: '/admin/symbols', label: 'Symbols' },
    { icon: 'fa-solid fa-chart-pie', path: '/admin/reports', label: 'Reports', badge: pendingFinanceCount, badgeColor: '#f59e0b' },
  ];

  return (
    <div className="adm-layout">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <i className="fa-solid fa-cube" />
          <span className="adm-logo-badge">ADM</span>
        </div>

        <nav className="adm-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `adm-nav-item ${isActive ? 'active' : ''}`
              }
              title={item.label}
            >
              <i className={item.icon} />
              {item.badge > 0 && (
                <span className="adm-nav-badge" style={{ background: item.badgeColor, boxShadow: `0 0 10px ${item.badgeColor}66` }}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
              <span className="adm-nav-tooltip">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <NavLink to="/" className="adm-nav-item" title="Back to Trading">
            <i className="fa-solid fa-arrow-left" />
            <span className="adm-nav-tooltip">Back to Trading</span>
          </NavLink>
          <button className="adm-nav-item adm-logout-btn" onClick={handleLogout} title="Logout">
            <i className="fa-solid fa-right-from-bracket" />
            <span className="adm-nav-tooltip">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="adm-main">
        {/* Top Header */}
        <header className="adm-header">
          <div className="adm-header-left">
            <div className="adm-header-title">
              <i className="fa-solid fa-shield-halved" style={{ color: '#3291ff' }} />
              <span>Mirrox Admin Panel</span>
            </div>
          </div>
          <div className="adm-header-right">
            <div className="adm-header-stat">
              <span className="adm-stat-dot active" />
              <span>System Online</span>
            </div>
            <div className="adm-avatar">
              <i className="fa-solid fa-user-shield" />
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="adm-content">
          {children}
        </main>
      </div>

      <style>{`
        .adm-layout {
          display: flex;
          width: 100vw; height: 100vh;
          background: #080c14;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        /* Sidebar */
        .adm-sidebar {
          width: 68px;
          background: #0f1520;
          border-right: 1px solid rgba(50,145,255,0.1);
          display: flex; flex-direction: column;
          align-items: center;
          padding: 16px 0;
          flex-shrink: 0;
          z-index: 100;
        }

        .adm-sidebar-logo {
          position: relative;
          color: #3291ff; font-size: 22px;
          margin-bottom: 32px;
        }
        .adm-logo-badge {
          position: absolute; top: -6px; right: -10px;
          font-size: 7px; font-weight: 800; letter-spacing: 0.5px;
          background: #3291ff; color: #fff;
          padding: 1px 4px; border-radius: 4px;
        }

        .adm-sidebar-nav {
          display: flex; flex-direction: column; gap: 6px; flex: 1;
        }
        .adm-sidebar-footer {
          display: flex; flex-direction: column; gap: 6px;
        }

        .adm-nav-item {
          position: relative;
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 10px; color: #4a5568;
          cursor: pointer; transition: all 0.2s;
          text-decoration: none; background: none; border: none;
          font-size: 16px;
        }
        .adm-nav-item:hover, .adm-nav-item.active {
          background: rgba(50,145,255,0.1);
          color: #3291ff;
        }
        .adm-nav-item.active {
          box-shadow: 0 0 15px rgba(50,145,255,0.15);
          border: 1px solid rgba(50,145,255,0.2);
        }
        .adm-nav-tooltip {
          position: absolute; left: 58px;
          background: #1c222d;
          border: 1px solid #2a3341;
          color: #e0e6ed; font-size: 12px; font-weight: 600;
          padding: 6px 12px; border-radius: 8px;
          white-space: nowrap; pointer-events: none;
          opacity: 0; transform: translateX(-4px);
          transition: all 0.15s;
          z-index: 200;
        }
        .adm-nav-item:hover .adm-nav-tooltip {
          opacity: 1; transform: translateX(0);
        }
        .adm-nav-badge {
          position: absolute;
          top: -2px; right: -2px;
          color: #fff;
          font-size: 9px; font-weight: 800;
          min-width: 16px; height: 16px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
        }
        .adm-logout-btn { cursor: pointer; }

        /* Header */
        .adm-main {
          flex: 1; display: flex; flex-direction: column; overflow: hidden;
        }

        .adm-header {
          height: 56px; background: #0f1520;
          border-bottom: 1px solid rgba(50,145,255,0.1);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px; flex-shrink: 0;
        }

        .adm-header-left { display: flex; align-items: center; }
        .adm-header-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 15px; font-weight: 700; color: #e0e6ed;
        }

        .adm-header-right { display: flex; align-items: center; gap: 20px; }

        .adm-header-stat {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #64748b;
        }
        .adm-stat-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #00cc88;
          box-shadow: 0 0 6px #00cc88;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .adm-avatar {
          display: flex; align-items: center; gap: 8px;
          background: rgba(50,145,255,0.1);
          border: 1px solid rgba(50,145,255,0.2);
          border-radius: 8px; padding: 6px 14px;
          font-size: 13px; font-weight: 600; color: #3291ff;
        }

        /* Content Area */
        .adm-content {
          flex: 1; overflow-y: auto; padding: 28px;
          background: #080c14;
        }
        .adm-content::-webkit-scrollbar { width: 4px; }
        .adm-content::-webkit-scrollbar-track { background: transparent; }
        .adm-content::-webkit-scrollbar-thumb { background: #2a3341; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
