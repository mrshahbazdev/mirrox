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
        <NavLink to="/app/finances" className={({ isActive }) => `m-nav-plus ${isActive ? 'active' : ''}`} title="My Wallet">
          <i className="fa-solid fa-plus"></i>
        </NavLink>
      </div>

      <NavLink to="/app/finances" className={({ isActive }) => `m-nav-item ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-chart-pie"></i>
        <span>Finances</span>
      </NavLink>

      <NavLink to="/app/help" className={({ isActive }) => `m-nav-item ${isActive ? 'active' : ''}`}>
        <i className="fa-solid fa-user-gear"></i>
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
