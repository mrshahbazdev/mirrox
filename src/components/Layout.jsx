import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ currentUser, onLogout }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />
      <Header currentUser={currentUser} />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
