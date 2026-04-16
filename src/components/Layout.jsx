import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';

const Layout = ({ currentUser, onLogout }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`dashboard-layout ${isMobile ? 'is-mobile' : ''}`}>
      {!isMobile ? (
        <>
          <Sidebar currentUser={currentUser} onLogout={onLogout} />
          <Header currentUser={currentUser} />
        </>
      ) : (
        <MobileHeader currentUser={currentUser} />
      )}

      <main className="dashboard-content">
        <Outlet />
      </main>

      {isMobile && <BottomNav />}

      <style>{`
        .dashboard-layout.is-mobile {
           display: block;
           height: auto;
           min-height: 100vh;
           background: #0f172a;
        }
        .is-mobile .dashboard-content {
           margin-left: 0 !important;
           padding: 0 20px 100px 20px !important;
           width: 100% !important;
        }
      `}</style>
    </div>
  );
};

export default Layout;
