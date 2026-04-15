import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ currentUser, onLogout }) => {
  const navItems = [
    { icon: 'fa-solid fa-chart-line', path: '/app/dashboard', label: 'Trading Accounts' },
    { icon: 'fa-solid fa-compass', path: '/app/explore', label: 'Explore Markets' },
    { icon: 'fa-solid fa-wallet', path: '/app/finances', label: 'Finances' },
    { icon: 'fa-solid fa-file-lines', path: '/app/documents', label: 'Documents' },
    { icon: 'fa-solid fa-handshake', path: '/app/affiliate', label: 'Affiliate Program' },
  ];

  return (
    <aside className="dash-sidebar glass">
      <div className="sidebar-logo">
        <i className="fa-solid fa-cube"></i>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <NavLink 
            key={index}
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive || window.location.pathname.startsWith(item.path) ? 'active' : ''}`}
            data-tooltip={item.label}
          >
            <div className="active-indicator-bar" />
            <i className={item.icon}></i>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
         <NavLink to="/app/help" className="nav-item" data-tooltip="Help">
            <i className="fa-solid fa-circle-question"></i>
         </NavLink>
         <button onClick={onLogout} className="nav-item" data-tooltip="Logout" style={{background: 'none', border: 'none', color: 'inherit', cursor: 'pointer'}}>
            <i className="fa-solid fa-right-from-bracket"></i>
         </button>
      </div>
      <style>{`
        .nav-item.active {
          background: rgba(50,145,255,0.1) !important;
          color: #3291ff !important;
        }
        .active-indicator-bar {
          position: absolute; left: 0; top: 10px; bottom: 10px; width: 3px;
          background: #3291ff; border-radius: 0 4px 4px 0;
          opacity: 0; transition: 0.2s;
          box-shadow: 0 0 10px rgba(50,145,255,0.5);
        }
        .nav-item.active .active-indicator-bar {
          opacity: 1;
        }
        .admin-shortcut { color: #a855f7 !important; }
        .admin-shortcut:hover {
          background-color: rgba(168,85,247,0.12) !important;
          color: #c084fc !important;
          box-shadow: 0 0 12px rgba(168,85,247,0.2);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
