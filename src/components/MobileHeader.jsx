import React from 'react';
import { useTrading } from '../context/TradingContext';

const MobileHeader = ({ currentUser }) => {
  const { currentClientExtended } = useTrading();
  const user = currentClientExtended || currentUser;
  const displayName = user?.name || 'Trader';
  
  return (
    <header className="mobile-header">
      <div className="m-header-user">
        <div className="m-avatar">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} 
            alt="User Avatar" 
          />
        </div>
        <div className="m-user-info">
          <p className="m-welcome">Welcome back,</p>
          <h2 className="m-name">{displayName}</h2>
        </div>
      </div>

      <div className="m-header-actions">
        <button className="m-action-btn">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <button className="m-action-btn relative">
          <i className="fa-solid fa-bell"></i>
          <span className="m-notif-dot"></span>
        </button>
      </div>

      <style>{`
        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 20px 16px 20px;
          background: #0f172a;
          position: sticky;
          top: 0;
          z-index: 900;
        }

        .m-header-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .m-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #6366f1;
          border: 2px solid rgba(99, 102, 241, 0.3);
          overflow: hidden;
        }

        .m-user-info .m-welcome {
          font-size: 10px;
          color: #94a3b8;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .m-user-info .m-name {
          font-size: 14px;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .m-header-actions {
          display: flex;
          gap: 12px;
        }

        .m-action-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .m-notif-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid #1e293b;
        }
      `}</style>
    </header>
  );
};

export default MobileHeader;
