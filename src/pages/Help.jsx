import React from 'react';

const Help = () => {
  return (
    <div style={{
      gridColumn: '1 / -1',
      height: '100%',
      overflowY: 'auto',
      padding: '32px 24px',
      background: 'var(--bg-deep)',
      color: '#e0e6ed'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(50,145,255,0.1)',
            color: '#3291ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', margin: '0 auto 20px auto'
          }}>
            <i className="fa-solid fa-headset"></i>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif' }}>Help & Support Center</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '12px', lineHeight: '1.6' }}>
            We're here to help you navigate the platform and answer any questions you might have.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', marginBottom: '40px' }}>
          
          {/* Card 1 */}
          <div className="card glass animate-fade" style={{ background: 'linear-gradient(145deg, rgba(50,145,255,0.1), rgba(0,0,0,0.2))', border: '1px solid rgba(50,145,255,0.2)', padding: '32px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-envelope" style={{ color: '#3291ff' }}></i> Direct Email Support
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              Our dedicated account managers and technical support team aim to reply within 1-2 hours during market open times.
            </p>
            <a href="mailto:support@mirrox.com" style={{ display: 'inline-block', background: '#3291ff', color: '#fff', padding: '12px 20px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, transition: 'all 0.2s' }}>
              Email support@mirrox.com
            </a>
          </div>

          {/* Card 2 */}
          <div className="card glass animate-fade" style={{ animationDelay: '0.1s', background: 'linear-gradient(145deg, rgba(0,204,136,0.1), rgba(0,0,0,0.2))', border: '1px solid rgba(0,204,136,0.2)', padding: '32px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-brands fa-whatsapp" style={{ color: '#00cc88' }}></i> Live Chat & WhatsApp
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              Have an urgent request regarding deposits, withdrawals, or an active margin call? Reach out instantly.
            </p>
            <button style={{ background: '#00cc88', border: 'none', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
              Start Live Chat
            </button>
          </div>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 20px 0', fontFamily: 'Outfit, sans-serif' }}>Frequently Asked Questions</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animationDelay: '0.2s' }} className="animate-fade">
          <div className="card glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: '#e0e6ed' }}>How long do withdrawals take to process?</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
              Crypto and Bank Transfer withdrawals are usually reviewed and processed within 24 hours. Depending on the payment provider, it may take an additional 1-3 business days to reflect in your account.
            </p>
          </div>
          <div className="card glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: '#e0e6ed' }}>What is "Free Margin"?</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
              Free Margin is the amount in your account available for opening new positions. It is calculated by subtracting your Used Margin from your current Equity. If this drops below 0, you cannot open new trades.
            </p>
          </div>
          <div className="card glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: '#e0e6ed' }}>What happens during a Margin Call?</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
              If your Margin Level drops below 50%, the system will automatically begin closing your open positions, starting with the least profitable one, to protect your account balance from negative equity.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Help;
