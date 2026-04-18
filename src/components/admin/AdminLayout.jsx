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
  const [supportUnreadCount, setSupportUnreadCount] = useState(0);
  const [onlineVisitorCount, setOnlineVisitorCount] = useState(0);
  const [broadcast, setBroadcast] = useState(null);

  useEffect(() => {
    if (!socket) return;

    // Presence Sync
    socket.emit('admin:presence', { page: window.location.pathname });

    // Global Alert Listener
    socket.on('admin:global_alert', (data) => {
      setBroadcast(data);
      setTimeout(() => setBroadcast(null), 10000); // Auto-hide after 10s
    });

    // Forced Logout Listener (Session Revocation)
    socket.on('admin:force_logout', ({ adminId, sessionId }) => {
      const currentSessionId = localStorage.getItem('bullvera_admin_session_id');
      if (currentSessionId === sessionId) {
         alert('Your session has been revoked by a Super Admin.');
         onAdminLogout();
      }
    });

    return () => {
      socket.off('admin:global_alert');
      socket.off('admin:force_logout');
    };
  }, [socket, window.location.pathname, onAdminLogout]);

  const fetchAdminStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('bullvera_admin_token');
      if (!token) return;
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [clientRes, activeRes, depRes, withRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URL + '/api/clients', config),
        axios.get(import.meta.env.VITE_API_URL + '/api/active-traders', config),
        axios.get(import.meta.env.VITE_API_URL + '/api/deposits', config),
        axios.get(import.meta.env.VITE_API_URL + '/api/withdrawals', config)
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
      if (err.response?.status === 401) {
          onAdminLogout();
      }
    }
  }, [onAdminLogout]);

  useEffect(() => {
    fetchAdminStats();
    const interval = setInterval(fetchAdminStats, 10000);
    
    if (socket) {
      socket.on('finance_update', fetchAdminStats);

      // Support unread badge
      socket.on('chat:ticket_update', (data) => {
        if (data.unreadByAdmin > 0) {
          setSupportUnreadCount(prev => prev + 1);
        }
      });

      // Online visitor count
      socket.on('visitors:update', (visitors) => {
        setOnlineVisitorCount(visitors.length);
      });
    }

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('finance_update', fetchAdminStats);
        socket.off('chat:ticket_update');
        socket.off('visitors:update');
      }
    };
  }, [socket, fetchAdminStats]);

  const navItems = [
    { icon: 'fa-solid fa-users', path: '/admin/clients', label: 'Clients' },
    { icon: 'fa-solid fa-chart-line', path: '/admin/active-traders', label: 'Active Risk', badge: activeTraderCount, badgeColor: '#00cc88' },
    { icon: 'fa-solid fa-address-card', path: '/admin/verifications', label: 'Verifications', badge: pendingKycCount, badgeColor: '#ff4d4d' },
    { icon: 'fa-solid fa-coins', path: '/admin/symbols', label: 'Symbols' },
    { icon: 'fa-solid fa-chart-pie', path: '/admin/reports', label: 'Reports', badge: pendingFinanceCount, badgeColor: '#f59e0b' },
    { icon: 'fa-solid fa-comments', path: '/admin/support', label: 'Support', badge: supportUnreadCount, badgeColor: '#FF4D5E' },
    { icon: 'fa-solid fa-user-gear', path: '/admin/staff', label: 'Team' },
    { icon: 'fa-solid fa-shield-halved', path: '/admin/security', label: 'Security' },
    { icon: 'fa-solid fa-gears', path: '/admin/settings', label: 'Settings' },
    { icon: 'fa-solid fa-shoe-prints', path: '/admin/visitors', label: 'Visitors' },
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
                `adm-nav-item ${isActive || window.location.pathname.startsWith(item.path) ? 'active' : ''}`
              }
              title={item.label}
            >
              <div className="adm-active-bar" />
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
              <i className="fa-solid fa-shield-halved" style={{ color: '#FF4D5E' }} />
              <span>Bullvera Admin Panel</span>
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

        {/* Admin Broadcast Banner */}
      {broadcast && (
        <div className={`admin-broadcast-banner ${broadcast.type}`}>
           <i className="fa-solid fa-triangle-exclamation" />
           <div className="broadcast-content">
              <strong>SYSTEM BROADCAST FROM {broadcast.sender}:</strong>
              <span>{broadcast.message}</span>
           </div>
           <button onClick={() => setBroadcast(null)}><i className="fa-solid fa-xmark" /></button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="adm-content">
        {children}
      </main>

      <style>{`
        .admin-broadcast-banner {
          position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
          width: 90%; max-width: 800px; padding: 16px 24px;
          background: var(--glass); backdrop-filter: blur(10px);
          border: 1px solid #FF4D5E; border-radius: 16px; 
          display: flex; align-items: center; gap: 20px; z-index: 10000;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1), 0 0 30px rgba(255, 77, 94, 0.05);
          animation: bannerSlideIn 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }
        @keyframes bannerSlideIn { 
          from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        .admin-broadcast-banner.warning { border-color: #f59e0b; box-shadow: 0 20px 50px rgba(0,0,0,0.1), 0 0 30px rgba(245,158,11,0.05); }
        .admin-broadcast-banner i { font-size: 24px; color: #FF4D5E; }
        .admin-broadcast-banner.warning i { color: #f59e0b; }
        .broadcast-content { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .broadcast-content strong { font-size: 10px; font-weight: 800; color: var(--text-dim); letter-spacing: 1px; }
        .broadcast-content span { color: var(--text-main); font-size: 14px; font-weight: 600; }
        .admin-broadcast-banner button { background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 18px; transition: color 0.2s; }
        .admin-broadcast-banner button:hover { color: var(--text-main); }
      `}</style>
      </div>

      <style>{`
        :root {
          --brand-primary: #FF4D5E;
          --bg-deep: #0a0f18;
          --bg-card: rgba(15, 23, 42, 0.6);
          --bg-hover: rgba(255, 255, 255, 0.05);
          --border: rgba(255, 255, 255, 0.08);
          --glass: rgba(15, 23, 42, 0.6);
          --text-main: #f1f5f9;
          --text-dim: #94a3b8;
          --success: #00cc88;
          --warning: #f59e0b;
          --danger: #ff4d4d;
          --accent: #FF4D5E;
        }

        .adm-layout {
          display: flex;
          width: 100vw; height: 100vh;
          background: var(--bg-deep);
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          color: var(--text-main);
        }

        /* Sidebar */
        .adm-sidebar {
          width: 68px;
          background: var(--bg-card);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          align-items: center;
          padding: 16px 0;
          flex-shrink: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .adm-sidebar-logo {
          position: relative;
          color: var(--brand-primary); font-size: 22px;
          margin-bottom: 32px;
        }
        .adm-logo-badge {
          position: absolute; top: -6px; right: -10px;
          font-size: 7px; font-weight: 800; letter-spacing: 0.5px;
          background: var(--brand-primary); color: #fff;
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
          border-radius: 10px; color: var(--text-dim);
          cursor: pointer; transition: all 0.2s;
          text-decoration: none; background: none; border: none;
          font-size: 16px;
        }
        .adm-nav-item:hover, .adm-nav-item.active {
          background: rgba(255, 77, 94, 0.08);
          color: var(--brand-primary);
        }
        .adm-nav-item.active {
          background: rgba(255, 77, 94, 0.12) !important;
          box-shadow: 0 4px 12px rgba(255, 77, 94, 0.08);
        }
        .adm-active-bar {
          position: absolute; left: 0; top: 12px; bottom: 12px; width: 3px;
          background: var(--brand-primary); border-radius: 0 4px 4px 0;
          opacity: 0; transition: all 0.2s;
          box-shadow: 0 0 10px var(--brand-primary);
        }
        .adm-nav-item.active .adm-active-bar {
          opacity: 1;
        }
        .adm-nav-tooltip {
          position: absolute; left: 74px;
          background: #1e293b;
          border: 1px solid var(--border);
          color: var(--text-main); font-size: 12px; font-weight: 600;
          padding: 6px 12px; border-radius: 8px;
          white-space: nowrap; pointer-events: none;
          opacity: 0; transform: translateX(-4px);
          transition: all 0.15s;
          z-index: 200;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
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
          height: 64px; background: var(--bg-card);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; flex-shrink: 0;
          backdrop-filter: blur(10px);
        }

        .adm-header-left { display: flex; align-items: center; }
        .adm-header-title {
          display: flex; align-items: center; gap: 12px;
          font-size: 15px; font-weight: 800; color: var(--text-main);
          letter-spacing: 0.5px;
        }

        .adm-header-right { display: flex; align-items: center; gap: 24px; }

        .adm-header-stat {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: var(--text-dim);
          background: rgba(16, 185, 129, 0.05); padding: 6px 14px; border-radius: 20px;
          border: 1px solid rgba(16, 185, 129, 0.1);
        }
        .adm-stat-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--success);
          box-shadow: 0 0 10px var(--success);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }

        .adm-avatar {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255, 77, 94, 0.08);
          border: 1px solid rgba(255, 77, 94, 0.2);
          border-radius: 12px; padding: 8px 18px;
          font-size: 13px; font-weight: 700; color: var(--brand-primary);
        }

        /* Content Area */
        .adm-content {
          flex: 1; overflow-y: auto; padding: 32px;
          background: var(--bg-deep);
        }
        .adm-content::-webkit-scrollbar { width: 5px; }
        .adm-content::-webkit-scrollbar-track { background: transparent; }
        .adm-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

        /* Global Utility Components for Pages */
        .adm-page-header { 
          display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; 
          animation: fadeInDown 0.5s ease-out;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .adm-page-title { 
          font-size: 24px; font-weight: 800; color: var(--text-main); 
          display: flex; align-items: center; gap: 12px; letter-spacing: -0.02em;
        }
        .adm-page-title i { color: var(--brand-primary); }
        .adm-page-sub { font-size: 14px; color: var(--text-dim); margin-top: 6px; font-weight: 500; }

        .adm-card {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }

        .adm-table-wrap {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 20px; overflow: hidden; backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .adm-table { width: 100%; border-collapse: collapse; }
        .adm-table thead tr { background: rgba(255, 77, 94, 0.05); border-bottom: 1px solid var(--border); }
        .adm-table th { 
          padding: 16px 20px; text-align: left; font-size: 11px; font-weight: 800; 
          color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; 
        }
        .adm-table-row { border-bottom: 1px solid var(--border); transition: background 0.2s; cursor: pointer; }
        .adm-table-row:hover { background: var(--bg-hover); }
        .adm-table-row:last-child { border-bottom: none; }
        .adm-table td { padding: 16px 20px; font-size: 14px; color: var(--text-dim); vertical-align: middle; }

        .adm-badge {
          padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px;
        }
        .adm-badge.success { background: rgba(0,204,136,0.1); color: var(--success); border: 1px solid rgba(0,204,136,0.2); }
        .adm-badge.warning { background: rgba(245,158,11,0.1); color: var(--warning); border: 1px solid rgba(245,158,11,0.2); }
        .adm-badge.danger { background: rgba(255,77,77,0.1); color: var(--danger); border: 1px solid rgba(255,77,77,0.2); }

        .adm-btn {
          padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid transparent; font-family: 'Inter', sans-serif;
        }
        .adm-btn-primary { background: var(--brand-primary); color: #fff; box-shadow: 0 4px 15px rgba(255, 77, 94, 0.3); }
        .adm-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .adm-btn-secondary { background: var(--bg-hover); color: var(--text-main); border-color: var(--border); }
        .adm-btn-secondary:hover { background: rgba(255,255,255,0.08); }
      `}</style>

    </div>
  );
};

export default AdminLayout;
