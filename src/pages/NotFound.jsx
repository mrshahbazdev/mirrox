import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #0f172a, #020617)',
      color: '#e0e6ed',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        fontSize: '120px',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #FF4D5E 0%, #ff7582 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '20px',
        lineHeight: 1
      }}>
        404
      </div>
      <h2 style={{ fontSize: '32px', marginBottom: '16px', fontWeight: 800 }}>Page Not Found</h2>
      <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '32px', maxWidth: '400px' }}>
        The trading route you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      
      <Link 
        to="/" 
        style={{
          padding: '16px 32px',
          background: 'rgba(255,77,94,0.1)',
          border: '1px solid rgba(255,77,94,0.3)',
          borderRadius: '12px',
          color: '#FF4D5E',
          textDecoration: 'none',
          fontWeight: 700,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <i className="fa-solid fa-arrow-left"></i> Return to Terminal
      </Link>
    </div>
  );
};

export default NotFound;
