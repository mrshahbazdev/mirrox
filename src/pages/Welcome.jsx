import React from 'react';
import { useNavigate } from 'react-router-dom';

const MarketTicker = () => {
  const [offset, setOffset] = React.useState(0);
  const items = [
    { s: 'EURUSD', p: '1.0945', c: '+0.12%' },
    { s: 'GBPUSD', p: '1.2655', c: '-0.05%' },
    { s: 'XAUUSD', p: '2342.10', c: '+1.45%' },
    { s: 'BTCUSD', p: '68421.5', c: '+4.20%' },
    { s: 'ETHUSD', p: '3521.8', c: '+2.11%' },
    { s: 'US30', p: '39124.5', c: '+0.88%' },
    { s: 'NAS100', p: '18412.2', c: '+1.15%' },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => (prev + 1) % 1000);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="market-ticker-bar">
      <div className="ticker-track" style={{ transform: `translateX(-${offset}px)` }}>
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="ticker-item">
            <span className="t-symbol">{item.s}</span>
            <span className="t-price">{item.p}</span>
            <span className={`t-change ${item.c.startsWith('+') ? 'pos' : 'neg'}`}>{item.c}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      <MarketTicker />
      <nav className="landing-nav">
        <div className="nav-logo">
          <i className="fa-solid fa-layer-group" />
          <span>Bullvera.</span>
        </div>
        <div className="nav-actions">
          <button className="nav-btn-login" onClick={() => navigate('/login')}>Log In</button>
          <button className="nav-btn-signup" onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </nav>

      <main className="landing-main">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-background-glow"></div>
          <div className="hero-content">
            <h1 className="hero-title">
              Trade the Future with <br />
              <span className="text-gradient">Bullvera Intelligence</span>
            </h1>
            <p className="hero-subtitle">
              Experience lightning-fast execution, zero-spread accounts, and a premium trading dashboard engineered for professional traders.
            </p>
            <div className="hero-cta-group">
              <button className="cta-primary" onClick={() => navigate('/register')}>
                Start Trading Now <i className="fa-solid fa-arrow-right" />
              </button>
              <button className="cta-secondary" onClick={() => navigate('/explore')}>
                Explore Markets
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-value">500+</div>
                <div className="stat-label">Trading Instruments</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-value">0.0ms</div>
                <div className="stat-label">Execution Speed</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Expert Support</div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="glass-card mockup-card">
              <div className="mockup-header">
                <div>EUR/USD</div>
                <div className="text-green">+1.24%</div>
              </div>
              <div className="mockup-body">
                <div className="mockup-chart-line"></div>
                <div className="mockup-price">1.09452</div>
              </div>
            </div>
            <div className="glass-card mockup-card floating-card">
              <div className="mockup-header">
                <div><i className="fa-brands fa-bitcoin" style={{color: '#f59e0b'}} /> BTC/USD</div>
                <div className="text-green">+5.80%</div>
              </div>
              <div className="mockup-body">
                <div className="mockup-price">69,888.50</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <h2 className="section-title">Why Choose Bullvera?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><i className="fa-solid fa-bolt" /></div>
              <h3>Ultra-Fast Execution</h3>
              <p>Trades executed in milliseconds ensuring you never miss a market movement.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fa-solid fa-shield-halved" /></div>
              <h3>Bank-Grade Security</h3>
              <p>Your funds are protected with industry-leading encryption and segregated accounts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fa-solid fa-chart-line" /></div>
              <h3>Advanced Analytics</h3>
              <p>Get deep insights into your trading performance with our comprehensive dashboard.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="nav-logo">
            <i className="fa-solid fa-layer-group" />
            <span>Bullvera.</span>
          </div>
          <p>&copy; 2026 Bullvera Trading platform. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .landing-wrapper {
          height: 100vh;
          overflow-y: auto;
          background: #0a0e17;
          color: #e0e6ed;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        /* Nav */
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 64px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-logo {
          font-size: 24px;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nav-logo i { color: #3291ff; }

        /* Ticker */
        .market-ticker-bar {
          background: #000; height: 32px; border-bottom: 1px solid rgba(255,255,255,0.05);
          overflow: hidden; display: flex; align-items: center; position: relative;
        }
        .ticker-track { display: flex; white-space: nowrap; transition: transform 0.05s linear; }
        .ticker-item {
          display: flex; align-items: center; gap: 10px; margin-right: 40px;
          font-size: 11px; font-weight: 800; text-transform: uppercase;
        }
        .t-symbol { color: #94a3b8; }
        .t-price { color: #fff; font-family: 'Space Mono', monospace; }
        .t-change.pos { color: #00cc88; }
        .t-change.neg { color: #ef4444; }

        .nav-actions { display: flex; gap: 16px; }
        .nav-btn-login {
          background: transparent; border: none; color: #e0e6ed;
          font-weight: 600; font-size: 15px; cursor: pointer;
          transition: color 0.2s;
        }
        .nav-btn-login:hover { color: #fff; }
        .nav-btn-signup {
          background: #3291ff; color: #fff; border: none;
          padding: 10px 24px; border-radius: 8px; font-weight: 700;
          font-size: 15px; cursor: pointer; transition: all 0.2s;
        }
        .nav-btn-signup:hover {
          background: #257ae6; transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(50, 145, 255, 0.3);
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
          background: radial-gradient(circle, rgba(50,145,255,0.15) 0%, rgba(10,14,23,0) 70%);
          top: -100px; left: -100px; z-index: 0; pointer-events: none;
        }
        .hero-content { position: relative; z-index: 1; }
        .hero-title {
          font-size: 64px; font-family: 'Outfit', sans-serif;
          font-weight: 900; line-height: 1.1; margin-bottom: 24px;
          color: #fff;
        }
        .text-gradient {
          background: linear-gradient(135deg, #3291ff, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 18px; color: #94a3b8; line-height: 1.6;
          margin-bottom: 40px; max-width: 500px;
        }
        .hero-cta-group { display: flex; gap: 20px; margin-bottom: 60px; }
        .cta-primary {
          background: linear-gradient(135deg, #3291ff, #257ae6);
          color: #fff; border: none; padding: 16px 32px;
          border-radius: 12px; font-weight: 700; font-size: 16px;
          cursor: pointer; display: flex; align-items: center; gap: 12px;
          transition: all 0.2s; box-shadow: 0 8px 24px rgba(50,145,255,0.3);
        }
        .cta-primary:hover {
          transform: translateY(-2px); box-shadow: 0 12px 32px rgba(50,145,255,0.4);
        }
        .cta-secondary {
          background: rgba(255,255,255,0.05); color: #fff;
          border: 1px solid rgba(255,255,255,0.1); padding: 16px 32px;
          border-radius: 12px; font-weight: 700; font-size: 16px;
          cursor: pointer; transition: all 0.2s;
        }
        .cta-secondary:hover { background: rgba(255,255,255,0.1); }
        
        .hero-stats {
          display: flex; gap: 32px; align-items: center;
          background: rgba(255,255,255,0.02); padding: 24px 32px;
          border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);
          width: fit-content;
        }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-value { font-size: 24px; font-weight: 800; color: #fff; font-family: 'Space Mono', monospace; }
        .stat-label { font-size: 13px; color: #64748b; font-weight: 600; }
        .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }

        /* Visuals */
        .hero-visual {
          position: relative; height: 500px;
          background: radial-gradient(circle at center, rgba(50,145,255,0.1) 0%, transparent 60%);
        }
        .glass-card {
          background: rgba(15, 21, 32, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.4);
        }
        .mockup-card { width: 280px; position: absolute; top: 100px; right: 80px; }
        .floating-card { width: 240px; top: 280px; right: 280px; animation: float 6s ease-in-out infinite; }
        @keyframes float {
          0% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(-2deg); }
        }
        .mockup-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 15px; margin-bottom: 24px; }
        .text-green { color: #00cc88; }
        .mockup-price { font-size: 32px; font-weight: 800; font-family: 'Space Mono', monospace; color: #fff; }
        .mockup-chart-line {
          height: 60px; margin-bottom: 20px;
          background: linear-gradient(90deg, transparent, rgba(0,204,136,0.2) 30%, #00cc88 100%);
          mask-image: linear-gradient(to bottom, black 20%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 20%, transparent 100%);
          border-top: 2px solid #00cc88; border-radius: 20px 20px 0 0;
        }

        /* Features */
        .features-section { padding: 100px 64px; max-width: 1400px; margin: 0 auto; text-align: center; }
        .section-title { font-size: 40px; font-weight: 800; margin-bottom: 64px; font-family: 'Outfit'; color: #fff;}
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;
        }
        .feature-card {
          background: #0f1520; padding: 40px; border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.05); text-align: center;
          transition: all 0.3s;
        }
        .feature-card:hover { transform: translateY(-5px); border-color: rgba(50,145,255,0.3); }
        .feature-icon {
          width: 64px; height: 64px; background: rgba(50,145,255,0.1);
          color: #3291ff; font-size: 24px; display: flex; align-items: center; justify-content: center;
          border-radius: 16px; margin: 0 auto 24px;
        }
        .feature-card h3 { font-size: 20px; font-weight: 800; margin-bottom: 16px; color: #fff; }
        .feature-card p { color: #94a3b8; line-height: 1.6; font-size: 15px; }

        /* Footer */
        .landing-footer {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 40px 64px; text-align: center;
        }
        .footer-content {
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .footer-content p { color: #64748b; font-size: 14px; }
      `}</style>
    </div>
  );
};

export default Welcome;
