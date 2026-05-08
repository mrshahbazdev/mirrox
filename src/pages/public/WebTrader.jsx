import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Monitor, Layout, BarChart, Headphones, Cpu, 
    Smartphone, Zap, CheckCircle2, ArrowRight
} from 'lucide-react';

const WebTrader = () => {
    const navigate = useNavigate();
    const features = [
        {
            icon: <Layout size={28} />,
            title: "Customizable Interface",
            desc: "Tailor your trading environment to your preferences with flexible interface options. Create a workspace that enhances efficiency."
        },
        {
            icon: <BarChart size={28} />,
            title: "Visual Analytics",
            desc: "Use detailed charts and a variety of analytical tools to make data-driven decisions and create more effective strategies."
        },
        {
            icon: <Headphones size={28} />,
            title: "Premium Support",
            desc: "Enjoy specialized customer support for any trading-related inquiries. Our skilled team is eager to assist you 24/7."
        },
        {
            icon: <Cpu size={28} />,
            title: "Algorithmic Precision",
            desc: "Get access to a range of trading tools, including real-time rate streaming, stop-loss choices, and extensive charting."
        }
    ];

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>Bulvera <span style={{ color: 'var(--pub-red)' }}>WebTrader</span></h1>
                    <p style={{ fontSize: '20px', marginTop: '24px' }}>Institutional-grade trading from any browser. No downloads required.</p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px', padding: '160px 24px' }}>
                
                {/* SECTION 1: WHAT IS WEBTRADER */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.08)' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=1200" 
                            alt="WebTrader Platform" 
                            style={{ width: '100%', borderRadius: '32px', display: 'block' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Browser-Based Power</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' }}>
                            The WebTrader platform is a state-of-the-art solution designed for seamless access to global markets. It combines robust security, real-time data, and advanced execution.
                        </p>
                        <button className="lp-btn-primary" onClick={() => navigate('/login')}>Launch Platform</button>
                    </div>
                </section>

                {/* SECTION 2: SUPERIOR EXPERIENCE */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Advanced Execution</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                            {["Advanced charting tools", "Instant price alerts", "One-click trading", "Zero-latency execution"].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#334155', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <CheckCircle2 size={24} style={{ color: 'var(--pub-red)' }} />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Start Trading</button>
                    </div>
                    <div style={{ order: 1, background: '#0b0e14', padding: '32px', borderRadius: '48px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200" 
                            alt="Market Analysis" 
                            style={{ width: '100%', borderRadius: '24px', opacity: 0.9 }}
                        />
                    </div>
                </section>

                {/* --- PLATFORM FEATURES --- */}
                <section>
                    <div className="lp-section-header">
                        <h2>Engineered for <span style={{ color: 'var(--pub-red)' }}>Success</span></h2>
                        <div className="accent-line"></div>
                    </div>

                    <div className="lp-grid">
                        {features.map((f, i) => (
                            <div key={i} className="lp-card">
                                <div className="lp-icon-box" style={{ color: 'var(--pub-red)' }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ textTransform: 'uppercase', fontSize: '20px' }}>{f.title}</h3>
                                <p style={{ fontSize: '15px' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block" style={{ marginBottom: '120px' }}>
                <h2>Ready for the Next Level?</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Join Bulvera Now</button>
                </div>
            </section>

             <footer style={{ textAlign: 'center', padding: '0 24px 80px 24px' }}>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.8' }}>
                    RISK WARNING: TRADING CFDs INVOLVES SIGNIFICANT RISK TO YOUR INVESTED CAPITAL. ASSETS CAN GO DOWN AS WELL AS UP. PLEASE TRADE RESPONSIBLY.
                </p>
            </footer>
        </div>
    );
};

export default WebTrader;
