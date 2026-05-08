import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset(prev => (prev < -2000 ? 0 : prev - 1));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const marketData = [
    { s: 'EUR/USD', p: '1.0921', c: '+0.04%', pos: true },
    { s: 'GBP/USD', p: '1.2645', c: '-0.12%', pos: false },
    { s: 'BTC/USD', p: '64,210.50', c: '+1.45%', pos: true },
    { s: 'GOLD', p: '2,154.20', c: '+0.65%', pos: true },
    { s: 'USD/JPY', p: '148.42', c: '-0.08%', pos: false },
    { s: 'ETH/USD', p: '3,450.12', c: '+2.10%', pos: true },
    { s: 'NAS100', p: '18,210.40', c: '+0.85%', pos: true },
  ];

  return (
    <div className="landing-wrapper no-scrollbar">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <i className="fa-solid fa-gem"></i>
          <span>Bulvera</span>
        </div>
        <div className="nav-actions">
          <button className="nav-btn-login" onClick={() => navigate('/login')}>Sign In</button>
          <button className="nav-btn-signup" onClick={() => navigate('/signup')}>Open Account</button>
        </div>
      </nav>

      {/* Market Ticker */}
      <div className="market-ticker-bar">
        <div className="ticker-track" style={{ transform: `translateX(${tickerOffset}px)` }}>
          {[...marketData, ...marketData, ...marketData].map((item, i) => (
            <div key={i} className="ticker-item">
              <span className="t-symbol">{item.s}</span>
              <span className="t-price">{item.p}</span>
              <span className={`t-change ${item.pos ? 'pos' : 'neg'}`}>{item.c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-glow"></div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            The World's Most <br /> 
            <span className="text-gradient">Powerful</span> Trading Engine.
          </h1>
          <p className="hero-subtitle">
            Experience lightning-fast execution, deep liquidity, and institutional-grade analytical tools on Bulvera's award-winning trading platform.
          </p>

          <div className="hero-cta-group">
            <button className="cta-primary" onClick={() => navigate('/signup')}>
              Get Started Now <i className="fa-solid fa-arrow-right"></i>
            </button>
            <button className="cta-secondary" onClick={() => navigate('/explore')}>
              Explore Assets
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">500+</span>
              <span className="stat-label">Tradable Assets</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">0.0ms</span>
              <span className="stat-label">Execution Speed</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Expert Support</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass-card mockup-card animate-slide-up">
            <div className="mockup-header">
              <span>BTC/USD</span>
              <span className="text-green">+4.2%</span>
            </div>
            <div className="mockup-price">$64,210.50</div>
            <div className="mockup-chart-line"></div>
            <div className="btn-mockup">Trade Asset</div>
          </div>

          <div className="glass-card floating-card">
            <div className="mockup-header">
              <span>PORTFOLIO</span>
            </div>
            <div className="mockup-price" style={{ fontSize: '24px' }}>$124,500.00</div>
            <div style={{ marginTop: '12px', color: 'var(--success)', fontWeight: '700', fontSize: '12px' }}>
              <i className="fa-solid fa-arrow-trend-up"></i> +$12,400.00 today
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-title">Institutional Features. <br /> Built For Everyone.</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-bolt"></i></div>
            <h3>Fast Execution</h3>
            <p>Our hybrid ordering engine processes trades in under 1ms, ensuring you get the best market price every time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-shield-halved"></i></div>
            <h3>Ultra Secure</h3>
            <p>Multi-layer encryption and cold storage solutions keep your funds and personal data protected around the clock.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-chart-line"></i></div>
            <h3>Advanced Analytics</h3>
            <p>Access professional-grade charting, technical indicators, and real-time sentiment analysis out of the box.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="nav-logo" style={{ opacity: 0.5 }}>
            <i className="fa-solid fa-gem"></i>
            <span>Bulvera</span>
          </div>
          <p>© 2026 Bulvera Finance. Global Markets, Simplified.</p>
        </div>
      </footer>

      <style>{`
        .landing-wrapper {
          height: 100vh;
          overflow-y: auto;
          background: var(--bg-deep);
          color: var(--text-main);
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        /* Nav */
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 64px;
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(10px);
          background: var(--glass);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-logo {
          font-size: 24px;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav-logo i { color: var(--accent); }

        /* Ticker */
        .market-ticker-bar {
          background: var(--bg-card); height: 32px; border-bottom: 1px solid var(--border);
          overflow: hidden; display: flex; align-items: center; position: relative;
        }
        .ticker-track { display: flex; white-space: nowrap; transition: transform 0.05s linear; }
        .ticker-item {
          display: flex; align-items: center; gap: 10px; margin-right: 40px;
          font-size: 11px; font-weight: 800; text-transform: uppercase;
        }
        .t-symbol { color: var(--text-muted); }
        .t-price { color: var(--text-main); font-family: 'Space Mono', monospace; }
        .t-change.pos { color: var(--success); }
        .t-change.neg { color: var(--danger); }

        .nav-actions { display: flex; gap: 16px; }
        .nav-btn-login {
          background: transparent; border: none; color: var(--text-muted);
          font-weight: 600; font-size: 15px; cursor: pointer;
          transition: color 0.2s;
        }
        .nav-btn-login:hover { color: var(--text-main); }
        .nav-btn-signup {
          background: var(--accent); color: white; border: none;
          padding: 10px 24px; border-radius: 8px; font-weight: 700;
          font-size: 15px; cursor: pointer; transition: all 0.2s;
        }
        .nav-btn-signup:hover {
          background: var(--accent-hover); transform: translateY(-1px);
          box-shadow: 0 4px 12px var(--accent-muted);
        }

        /* Hero */
        .hero-section {
          padding: 100px 64px 80px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 64px;
          align-items: center;
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
        }
        .hero-background-glow {
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, var(--accent-muted) 0%, transparent 70%);
          top: -100px; left: -100px; z-index: 0; pointer-events: none;
        }
        .hero-content { position: relative; z-index: 1; }
        .hero-title {
          font-size: 64px; font-family: 'Outfit', sans-serif;
          font-weight: 900; line-height: 1.1; margin-bottom: 24px;
          color: var(--text-main);
        }
        .text-gradient {
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 18px; color: var(--text-dim); line-height: 1.6;
          margin-bottom: 40px; max-width: 500px;
        }
        .hero-cta-group { display: flex; gap: 20px; margin-bottom: 60px; }
        .cta-primary {
          background: var(--accent);
          color: #fff; border: none; padding: 16px 32px;
          border-radius: 12px; font-weight: 700; font-size: 16px;
          cursor: pointer; display: flex; align-items: center; gap: 12px;
          transition: all 0.2s; box-shadow: 0 8px 24px var(--accent-muted);
        }
        .cta-primary:hover {
          transform: translateY(-2px); box-shadow: 0 12px 32px var(--accent-muted);
        }
        .cta-secondary {
          background: var(--bg-hover); color: var(--text-main);
          border: 1px solid var(--border); padding: 16px 32px;
          border-radius: 12px; font-weight: 700; font-size: 16px;
          cursor: pointer; transition: all 0.2s;
        }
        .cta-secondary:hover { background: var(--border); }
        
        .hero-stats {
          display: flex; gap: 32px; align-items: center;
          background: var(--bg-card); padding: 24px 32px;
          border-radius: 16px; border: 1px solid var(--border);
          width: fit-content;
        }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-value { font-size: 24px; font-weight: 800; color: var(--text-main); font-family: 'Space Mono', monospace; }
        .stat-label { font-size: 13px; color: var(--text-muted); font-weight: 600; }
        .stat-divider { width: 1px; height: 40px; background: var(--border); }

        /* Visuals */
        .hero-visual {
          position: relative; height: 500px;
          background: radial-gradient(circle at center, var(--accent-muted) 0%, transparent 60%);
        }
        .glass-card {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.06);
        }
        .mockup-card { width: 280px; position: absolute; top: 100px; right: 80px; }
        .floating-card { width: 240px; top: 280px; right: 280px; animation: float 6s ease-in-out infinite; }
        @keyframes float {
          0% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(-2deg); }
        }
        .mockup-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 15px; margin-bottom: 24px; }
        .text-green { color: var(--success); }
        .mockup-price { font-size: 32px; font-weight: 800; font-family: 'Space Mono', monospace; color: var(--text-main); }
        .mockup-chart-line {
          height: 60px; margin-bottom: 20px;
          background: linear-gradient(90deg, transparent, var(--success-muted) 30%, var(--success) 100%);
          mask-image: linear-gradient(to bottom, black 20%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 20%, transparent 100%);
          border-top: 2px solid var(--success); border-radius: 20px 20px 0 0;
        }
        .btn-mockup {
          background: var(--accent); color: white; padding: 12px; border-radius: 8px;
          text-align: center; font-weight: 700; font-size: 13px;
        }

        /* Features */
        .features-section { padding: 100px 64px; max-width: 1400px; margin: 0 auto; text-align: center; }
        .section-title { font-size: 40px; font-weight: 800; margin-bottom: 64px; font-family: 'Outfit'; color: var(--text-main);}
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;
        }
        .feature-card {
          background: var(--bg-card); padding: 40px; border-radius: 24px;
          border: 1px solid var(--border); text-align: center;
          transition: all 0.3s;
        }
        .feature-card:hover { transform: translateY(-5px); border-color: var(--accent); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
        .feature-icon {
          width: 64px; height: 64px; background: var(--accent-muted);
          color: var(--accent); font-size: 24px; display: flex; align-items: center; justify-content: center;
          border-radius: 16px; margin: 0 auto 24px;
        }
        .feature-card h3 { font-size: 20px; font-weight: 800; margin-bottom: 16px; color: var(--text-main); }
        .feature-card p { color: var(--text-muted); line-height: 1.6; font-size: 15px; }

        /* Footer */
        .landing-footer {
          border-top: 1px solid var(--border);
          padding: 40px 64px; text-align: center;
        }
        .footer-content {
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .footer-content p { color: var(--text-muted); font-size: 14px; }

        @media (max-width: 1024px) {
          .hero-section { grid-template-columns: 1fr; text-align: center; padding: 60px 24px; }
          .hero-title { font-size: 48px; }
          .hero-subtitle { margin: 0 auto 40px; }
          .hero-cta-group { justify-content: center; }
          .hero-stats { margin: 0 auto; }
          .hero-visual { display: none; }
          .features-grid { grid-template-columns: 1fr; }
          .landing-nav { padding: 24px; }
        }
      `}</style>
    </div>
  );
};

export default Welcome;
