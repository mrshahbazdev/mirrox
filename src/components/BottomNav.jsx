import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/app/dashboard" className={({ isActive }) => `m-nav-item ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-house-chimney"></i>
        <span>Home</span>
      </NavLink>

      <NavLink to="/app/explore" className={({ isActive }) => `m-nav-item ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-chart-line"></i>
        <span>Trade</span>
      </NavLink>

      <div className="m-nav-center">
        <button className="m-nav-plus" title="Quick Actions">
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <NavLink to="/app/finances" className={({ isActive }) => `m-nav-item ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-chart-pie"></i>
        <span>Finances</span>
      </NavLink>

      <NavLink to="/app/help" className={({ isActive }) => `m-nav-item ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-user-gear"></i>
        <span>Profile</span>
      </NavLink>

      <style>{`
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 1000;
          border-radius: 32px 32px 0 0;
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.4);
        }

        .m-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: #64748b;
          text-decoration: none;
          transition: 0.2s;
          flex: 1;
        }

        .m-nav-item i {
          font-size: 20px;
        }

        .m-nav-item span {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .m-nav-item.active {
          color: #6366f1;
        }

        .m-nav-center {
          position: relative;
          top: -24px;
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .m-nav-plus {
          width: 56px;
          height: 56px;
          background: #6366f1;
          border-radius: 50%;
          border: 4px solid #0f172a;
          color: white;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
          cursor: pointer;
          transition: transform 0.2s;
        }

        .m-nav-plus:active {
          transform: scale(0.9);
        }
      `}</style>
    </nav>
  );
};

export default BottomNav;
