import React from 'react';
import { 
    Monitor, Layout, BarChart, Headphones, Cpu, 
    Smartphone, Zap, CheckCircle2, ArrowRight
} from 'lucide-react';

const WebTrader = () => {
    const features = [
        {
            icon: <Layout className="text-[#FF4D5E]" size={24} />,
            title: "Customizable Interface",
            desc: "Tailor your trading environment to your preferences with flexible interface options. Create a workspace that enhances efficiency."
        },
        {
            icon: <BarChart className="text-[#FF4D5E]" size={24} />,
            title: "Precise Visual Analytics",
            desc: "Use detailed charts and a variety of analytical tools to make data-driven decisions and create more effective strategies."
        },
        {
            icon: <Headphones className="text-[#FF4D5E]" size={24} />,
            title: "Strong Support",
            desc: "Enjoy specialized customer support for any trading-related inquiries. Our skilled team is eager to assist and ensure effectiveness."
        },
        {
            icon: <Cpu className="text-[#FF4D5E]" size={24} />,
            title: "Extensive Trading Tools",
            desc: "Get access to a range of trading tools, including real-time rate streaming, stop-loss/take-profit choices, and extensive charting."
        }
    ];

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10">
                    <h1>Mirrox Trading Platform</h1>
                    <p>
                        Versatile Trading Solutions for Modern Investors
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
                
                {/* SECTION 1: WHAT IS WEBTRADER */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=800" 
                            alt="WebTrader Platform" 
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>What is the WebTrader Platform?</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
                            The WebTrader platform is a browser-based trading solution designed for easy access to financial markets. It combines robust security, real-time data, and user-friendly features.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                            Whether you are a beginner or an experienced trader, our platform provides the tools needed to succeed in the fast-paced world of digital finance.
                        </p>
                        <button className="lp-btn-primary">Trade Online</button>
                    </div>
                </section>

                {/* SECTION 2: SUPERIOR EXPERIENCE */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>Superior WebTrader Experience</h2>
                        <ul className="lp-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                            {["Advanced charting tools", "Instant price alerts", "One-click trading", "Real-time execution"].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#475569', fontWeight: '600' }}>
                                    <CheckCircle2 size={20} style={{ color: 'var(--pub-red)' }} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="lp-btn-primary">Start Trading</button>
                    </div>
                    <div style={{ order: 1 }}>
                        <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" 
                            alt="Superior Experience" 
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                </section>

                {/* --- PLATFORM FEATURES --- */}
                <section>
                    <div className="lp-section-header">
                        <h2>Platform Features</h2>
                        <p style={{ color: 'var(--pub-text-muted)', marginTop: '16px' }}>Traders of all levels can benefit from the extensive resources provided by our exceptional platforms.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        {features.map((f, i) => (
                            <div key={i} style={{ padding: '48px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                                <div style={{ width: '64px', height: '64px', background: '#fff1f2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '24px', color: 'var(--pub-red)' }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a', marginBottom: '16px' }}>{f.title}</h3>
                                <p style={{ color: 'var(--pub-text-muted)', lineHeight: '1.6' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2>Join Mirrox and Start Trading</h2>
                <div style={{ marginTop: '32px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Get Started Now</button>
                </div>
            </section>

             <footer style={{ textAlign: 'center', paddingBottom: '64px' }}>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    RISK WARNING: TRADING CFDs INVOLVES SIGNIFICANT RISK TO YOUR INVESTED CAPITAL.
                </p>
            </footer>
        </div>
    );
};

export default WebTrader;
