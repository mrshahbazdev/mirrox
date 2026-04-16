import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { useModal } from '../context/ModalContext';

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
      <div className="mobile-profile no-scrollbar pb-10">
        {/* Profile Header */}
        <header className="flex items-center justify-between px-2 pt-6 pb-4">
            <h1 className="text-2xl font-black text-white">Profile</h1>
            <button className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700/50">
                <i className="fa-solid fa-gear text-slate-400"></i>
            </button>
        </header>

        {/* User Identity */}
        <section className="py-6 flex flex-col items-center">
            <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500">
                    <div className="w-full h-full rounded-full bg-slate-900 border-4 border-[#0F172A] overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentClientExtended?.name}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-[#0F172A] rounded-full"></div>
            </div>
            <h2 className="text-xl font-black text-white">{currentClientExtended?.name}</h2>
            <p className="text-slate-400 text-xs mt-1 font-bold">Account ID: MRX-{currentClientExtended?.id}</p>
            <div className="flex space-x-2 mt-3">
                <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black border border-indigo-500/20 uppercase tracking-widest">Demo Mode</span>
                <span className="px-4 py-1.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black border border-slate-700/50 uppercase tracking-widest">Level 4</span>
            </div>
        </section>

        {/* Verification Alert */}
        <section className="py-2">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-5 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
                </div>
                <div className="flex-1">
                    <p className="text-xs font-black text-amber-500 uppercase tracking-tight">Verify Identity</p>
                    <p className="text-[10px] text-slate-300 leading-tight mt-1">Unlock real trading and withdrawals by verifying your ID.</p>
                </div>
                <button className="bg-amber-500 text-slate-900 text-[10px] font-black px-4 py-2.5 rounded-xl whitespace-nowrap active:scale-95 transition-all">VERIFY</button>
            </div>
        </section>

        {/* Management Menu */}
        <section className="py-4 space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Management</h3>
            
            <div className="space-y-3">
              {[
                { label: 'Trading History', icon: 'fa-clock-rotate-left', color: 'indigo' },
                { label: 'Payment Methods', icon: 'fa-wallet', color: 'emerald' },
                { label: 'Security & 2FA', icon: 'fa-shield-halved', color: 'purple' },
                { label: 'Support Center', icon: 'fa-headset', color: 'blue' },
              ].map(item => (
                <button key={item.label} className="w-full flex items-center justify-between glass-card p-4 rounded-3xl active:scale-[0.98] transition-all border border-white/5">
                  <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400`}>
                          <i className={`fa-solid ${item.icon}`}></i>
                      </div>
                      <span className="text-sm font-bold text-white">{item.label}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-700 text-xs"></i>
                </button>
              ))}
            </div>

            <button className="w-full flex items-center justify-center space-x-2 py-8 text-rose-500 font-black text-sm uppercase tracking-widest">
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Sign Out Account</span>
            </button>
        </section>

        <style>{`
          .mobile-profile {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .glass-card {
            background: rgba(30, 41, 59, 0.4);
            backdrop-filter: blur(12px);
          }
        `}</style>
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

        <div className="help-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          
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

          <div className="card glass animate-fade" style={{ animationDelay: '0.1s', background: 'linear-gradient(145deg, rgba(0,204,136,0.1), rgba(0,0,0,0.2))', border: '1px solid rgba(0,204,136,0.2)', padding: '32px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-brands fa-whatsapp" style={{ color: '#00cc88' }}></i> Live Chat & WhatsApp
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              Have an urgent request regarding deposits, withdrawals, or an active margin call? Reach out instantly.
            </p>
            <button
              style={{ background: '#00cc88', border: 'none', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => document.getElementById('live-chat-bubble')?.click()}
            >
              <i className="fa-solid fa-message" style={{ marginRight: 8 }} />
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
