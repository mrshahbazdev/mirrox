import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Zap, TrendingUp, BarChart, Globe, 
    ArrowRight, CheckCircle2, Shield, PlayCircle,
    Monitor, Layout, Smartphone, Headphones
} from 'lucide-react';

const TradingCentral = () => {
    const navigate = useNavigate();

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero" style={{ padding: '120px 24px', textAlign: 'left', minHeight: '60vh' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <h1 style={{ textAlign: 'left', maxWidth: '900px', fontSize: 'clamp(36px, 6vw, 72px)' }}>Bulvera <span style={{ color: 'var(--pub-red)' }}>Trading Central</span></h1>
                    <p style={{ maxWidth: '800px', textAlign: 'left', fontSize: '20px' }}>
                        Access world-class technical analysis and automated pattern recognition tools directly in your terminal.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Activate Now</button>
                    </div>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px', padding: '160px 24px' }}>
                
                {/* WHAT IS TRADING CENTRAL */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side">
                         <div style={{ display: 'inline-flex', padding: '8px 20px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', borderRadius: '100px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '32px', letterSpacing: '0.1em' }}>Premium Research Integration</div>
                         <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Institutional Intelligence</h2>
                         <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' }}>
                            Trading Central is the global leader in financial market research. Our partnership brings you professional-grade insights previously reserved for institutional traders.
                         </p>
                         <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '48px' }}>
                            Get real-time entry and exit points, technical sentiments, and automated chart pattern recognition across 8,000+ assets.
                         </p>
                         <button className="lp-btn-primary" onClick={() => navigate('/register')}>Explore Tools</button>
                    </div>
                    <div style={{ background: '#0b0e14', padding: '32px', borderRadius: '64px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200" 
                            style={{ width: '100%', borderRadius: '32px', opacity: 0.9 }}
                            alt="Trading Central Dashboard"
                        />
                    </div>
                </section>

                {/* ADVANCED SOLUTIONS */}
                <section>
                    <div className="lp-section-header" style={{ marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Precision <span style={{ color: 'var(--pub-red)' }}>Solutions</span></h2>
                        <div className="accent-line"></div>
                    </div>

                    <div className="lp-grid">
                        {[
                            { title: "Intraday Analysis", desc: "Leverage top-tier analysis and advanced pattern recognition tools to refine and enhance your strategies.", icon: <TrendingUp size={28} /> },
                            { title: "Economic Calendar", desc: "Stay informed with a customizable economic calendar featuring real-time analysis and historical indicators.", icon: <Globe size={28} /> },
                            { title: "Global Perspective", desc: "Our global reach provides market-leading research that empowers your decisions across multiple asset classes.", icon: <BarChart size={28} /> }
                         ].map((item, idx) => (
                            <div key={idx} className="lp-card">
                                <div className="lp-icon-box">
                                    {item.icon}
                                </div>
                                <h4 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '16px' }}>{item.title}</h4>
                                <p style={{ color: 'var(--pub-text-muted)', lineHeight: '1.6', fontSize: '15px' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* THE BULVERA EDGE GRID */}
                <section>
                    <div className="lp-section-header" style={{ marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>The Bulvera <span style={{ color: 'var(--pub-red)' }}>Advantage</span></h2>
                        <div className="accent-line"></div>
                    </div>
                    <div className="lp-grid">
                        <div style={{ background: 'white', padding: '48px', borderRadius: '48px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                             <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#111', textTransform: 'uppercase' }}>Unified Workspace</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {["Native Charts", "Direct Access", "One-Click", "Custom Views"].map((f,i)=>(
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b' }}>
                                        <CheckCircle2 size={14} style={{ color: 'var(--pub-red)' }} /> {f}
                                    </div>
                                ))}
                             </div>
                             <div style={{ background: '#f8fafc', borderRadius: '32px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                <Monitor size={48} style={{ color: '#cbd5e1' }}/>
                             </div>
                        </div>

                        <div style={{ background: 'white', padding: '48px', borderRadius: '48px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                             <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#111', textTransform: 'uppercase' }}>Regulated Standards</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {["Segregated", "Encrypted", "Verified", "Compliant"].map((f,i)=>(
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b' }}>
                                        <CheckCircle2 size={14} style={{ color: 'var(--pub-red)' }} /> {f}
                                    </div>
                                ))}
                             </div>
                              <div style={{ background: 'var(--pub-red-soft)', borderRadius: '32px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Shield size={48} style={{ color: 'var(--pub-red)' }}/>
                              </div>
                        </div>

                         <div style={{ background: 'var(--pub-red)', padding: '48px', borderRadius: '48px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 100px rgba(255, 77, 94, 0.3)' }}>
                             <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase' }}>Global Support</h3>
                                <p style={{ opacity: 0.9, lineHeight: '1.7', fontSize: '15px' }}>Experience professional account management and dedicated technical support available at all times.</p>
                                <button className="lp-cta-white" style={{ marginTop: 'auto', alignSelf: 'flex-start' }} onClick={() => navigate('/contact-us')}>Contact Agent</button>
                             </div>
                             <Headphones size={200} style={{ position: 'absolute', bottom: '-80px', right: '-40px', opacity: 0.15, pointerEvents: 'none' }} />
                        </div>
                    </div>
                </section>
            </div>

            {/* UPGRADE SKILLS SECTION */}
            <section style={{ background: '#f8fafc', padding: '160px 24px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-section-header" style={{ marginBottom: '80px', textAlign: 'center' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Instant <span style={{ color: 'var(--pub-red)' }}>Activation</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '64px' }}>
                         {[
                             { s: "01", t: "Registration", d: "Open your live trading account in minutes through our secure portal." },
                             { s: "02", t: "Funding", d: "Deposit via local or international payment gateways with zero delay." },
                             { s: "03", t: "Integration", d: "Access Trading Central widgets directly in your dashboard." }
                         ].map((item, i)=>(
                            <div key={i} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                                <div style={{ fontSize: '80px', fontWeight: '900', color: 'var(--pub-red)', opacity: 0.05, position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', lineHeight: '1' }}>{item.s}</div>
                                <h4 style={{ fontSize: '22px', fontWeight: '900', color: '#111', textTransform: 'uppercase', position: 'relative' }}>{item.t}</h4>
                                <p style={{ color: 'var(--pub-text-muted)', lineHeight: '1.7', fontSize: '16px' }}>{item.d}</p>
                            </div>
                         ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '100px' }}>
                         <button className="lp-btn-primary" style={{ padding: '20px 60px' }} onClick={() => navigate('/register')}>Create Your Account</button>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block" style={{ marginBottom: '120px' }}>
                <h2 style={{ textAlign: 'center' }}>Empower Your Trading with Institutional Insights</h2>
                <div style={{ marginTop: '60px', textAlign: 'center' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Get Started Now</button>
                </div>
            </section>

            <footer style={{ textAlign: 'center', padding: '0 24px 80px 24px' }}>
                <p style={{ maxWidth: '900px', margin: '0 auto', fontSize: '10px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '2' }}>
                    RISK DISCLAIMER: TRADING CENTRAL IS A THIRD-PARTY RESEARCH PROVIDER. BULVERA DOES NOT WARRANT THE ACCURACY OF EXTERNAL MARKET DATA. TRADING INVOLVES RISK.
                </p>
            </footer>
        </div>
    );
};

export default TradingCentral;
