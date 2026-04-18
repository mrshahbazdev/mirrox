import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { useModal } from '../context/ModalContext';
import { Link } from 'react-router-dom';

const Help = () => {
  const { currentClientExtended } = useTrading();
  const tm = currentClientExtended?.tradingMetrics || {};
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="mobile-help-page no-scrollbar">
        {/* Profile Header */}
        <header className="help-header-v2">
            <h1>Profile</h1>
            <button className="header-icon-btn">
                <i className="fa-solid fa-gear"></i>
            </button>
        </header>

        {/* User Identity */}
        <section className="help-identity-card">
            <div className="avatar-wrapper">
                <div className="avatar-ring">
                    <div className="avatar-inner">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentClientExtended?.name}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="avatar-status"></div>
            </div>
            <h2 className="user-name-label">{currentClientExtended?.name}</h2>
            <p className="user-id-sub">Account ID: BLV-{currentClientExtended?.id}</p>
            <div className="badge-flex">
                <span className="help-badge primary">Demo Mode</span>
                <span className="help-badge secondary">Level 4</span>
            </div>
        </section>

        {/* Verification Alert */}
        <section className="px-2">
            <div className="verification-banner">
                <div className="banner-icon">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div className="banner-content">
                    <p className="banner-title">Verify Identity</p>
                    <p className="banner-desc">Unlock real trading and withdrawals by verifying your ID.</p>
                </div>
                <Link to="/app/documents" className="banner-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', color: '#fff' }}>VERIFY</Link>
            </div>
        </section>

        {/* Management Menu */}
        <section className="menu-section">
            <h3 className="menu-label">Management</h3>
            
            <div className="menu-list">
              {[
                { label: 'Trading History', icon: 'fa-clock-rotate-left', color: 'var(--accent)', bg: 'var(--accent-muted)' },
                { label: 'Payment Methods', icon: 'fa-wallet', color: 'var(--success)', bg: 'var(--success-muted)' },
                { label: 'Security & 2FA', icon: 'fa-shield-halved', color: 'var(--warning)', bg: 'var(--warning-muted)' },
                { label: 'Support Center', icon: 'fa-headset', color: 'var(--accent)', bg: 'var(--accent-muted)' },
              ].map(item => (
                <button key={item.label} className="menu-item-card">
                  <div className="item-left">
                      <div className="item-icon-box" style={{ backgroundColor: item.bg, color: item.color }}>
                          <i className={`fa-solid ${item.icon}`}></i>
                      </div>
                      <span className="item-label">{item.label}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[var(--text-dim)] text-xs"></i>
                </button>
              ))}
            </div>

            <button className="signout-btn">
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Sign Out Account</span>
            </button>
        </section>
      </div>
    );
  }

  // Desktop View
  return (
    <div style={{
      gridColumn: '1 / -1',
      height: '100%',
      overflowY: 'auto',
      padding: '32px 24px',
      background: 'var(--bg-deep)',
      color: 'var(--text-main)'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px', background: 'var(--accent-muted)',
            color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', margin: '0 auto 20px auto'
          }}>
            <i className="fa-solid fa-headset"></i>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif' }}>Help & Support Center</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '12px', lineHeight: '1.6' }}>
            We're here to help you navigate the platform and answer any questions you might have.
          </p>
        </header>

        <div className="help-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          
          <div className="card glass animate-fade" style={{ background: 'linear-gradient(145deg, var(--accent-muted), transparent)', border: '1px solid var(--border)', padding: '32px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
              <i className="fa-solid fa-envelope" style={{ color: 'var(--accent)' }}></i> Direct Email Support
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              Our dedicated account managers and technical support team aim to reply within 1-2 hours during market open times.
            </p>
            <a href="mailto:support@bullvera.com" style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', padding: '12px 20px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, transition: 'all 0.2s' }}>
              Email support@bullvera.com
            </a>
          </div>

          <div className="card glass animate-fade" style={{ animationDelay: '0.1s', background: 'linear-gradient(145deg, var(--success-muted), transparent)', border: '1px solid var(--border)', padding: '32px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
              <i className="fa-brands fa-whatsapp" style={{ color: 'var(--success)' }}></i> Live Chat & WhatsApp
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              Have an urgent request regarding deposits, withdrawals, or an active margin call? Reach out instantly.
            </p>
            <button
              style={{ background: 'var(--success)', border: 'none', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => document.getElementById('live-chat-bubble')?.click()}
            >
              <i className="fa-solid fa-message" style={{ marginRight: 8 }} />
              Start Live Chat
            </button>
          </div>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 20px 0', fontFamily: 'Outfit, sans-serif' }}>Frequently Asked Questions</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animationDelay: '0.2s' }} className="animate-fade">
          <div className="card glass" style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>How long do withdrawals take to process?</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Crypto and Bank Transfer withdrawals are usually reviewed and processed within 24 hours. Depending on the payment provider, it may take an additional 1-3 business days to reflect in your account.
            </p>
          </div>
          <div className="card glass" style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>What is "Free Margin"?</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Free Margin is the amount in your account available for opening new positions. It is calculated by subtracting your Used Margin from your current Equity. If this drops below 0, you cannot open new trades.
            </p>
          </div>
          <div className="card glass" style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>What happens during a Margin Call?</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              If your Margin Level drops below 50%, the system will automatically begin closing your open positions, starting with the least profitable one, to protect your account balance from negative equity.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Help;
