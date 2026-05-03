import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap } from 'lucide-react';

const Forex = () => {
    const forexPairs = [
        { symbol: "EURUSD", name: "Euro / US Dollar", spread: "0.2", category: "Majors" },
        { symbol: "GBPUSD", name: "Great Britain Pound / US Dollar", spread: "0.5", category: "Majors" },
        { symbol: "USDJPY", name: "US Dollar / Japanese Yen", spread: "0.4", category: "Majors" },
        { symbol: "USDCAD", name: "US Dollar / Canadian Dollar", spread: "0.6", category: "Majors" },
        { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", spread: "0.4", category: "Majors" },
        { symbol: "EURGBP", name: "Euro / Great Britain Pound", spread: "0.8", category: "Minors" },
        { symbol: "GBPCHF", name: "Great Britain Pound / Swiss Franc", spread: "1.2", category: "Minors" },
        { symbol: "AUDJPY", name: "Australian Dollar / Japanese Yen", spread: "1.1", category: "Minors" },
    ];

    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>Trade <span style={{ color: 'var(--pub-red)' }}>Forex</span> with Bullvera</h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '700px' }}>
                        Navigate the world's largest market with deep liquidity, institutional spreads, and elite execution.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px', padding: '160px 24px' }}>
                
                {/* SECTION 1: WHAT IS FOREX */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.06)' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=1200" 
                            alt="Forex Markets" 
                            style={{ width: '100%', borderRadius: '32px', display: 'block' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>The Core of Capital</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' }}>
                            Forex trading involves the simultaneous buying of one currency and selling of another. It is the most liquid financial market globally, operating 24 hours a day.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                            With Bullvera, you gain direct access to price movements across major, minor, and exotic pairs with razor-sharp execution.
                        </p>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Launch Terminal</button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Why Trade with Us?</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                            {[
                                "Competitive spreads from 0.0 pips",
                                "Zero commissions on major accounts",
                                "24/5 Direct Market Access (DMA)",
                                "Ultra-low latency infrastructure"
                            ].map((benefit, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#111', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <CheckCircle2 size={24} style={{ color: 'var(--pub-red)' }} />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Start Trading</button>
                    </div>
                    <div style={{ order: 1, display: 'flex', justifyContent: 'center' }}>
                         <div style={{ width: '100%', maxWidth: '340px', height: '640px', background: '#0b0e14', borderRadius: '48px', border: '10px solid #1e293b', boxShadow: '0 40px 100px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
                             <img 
                                src="https://images.unsplash.com/photo-1611224885990-ab73b391cd2a?auto=format&fit=crop&q=80&w=600" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
                                alt="Mobile App"
                             />
                             <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '32px', background: 'linear-gradient(to top, #0b0e14, transparent)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                 <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => navigate('/register')}>BUY EUR/USD</button>
                                 <button style={{ background: '#ef4444', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => navigate('/register')}>SELL EUR/USD</button>
                             </div>
                         </div>
                    </div>
                </section>
            </div>

            {/* FOREX PAIRS TABLE */}
            <section style={{ background: '#f8fafc', padding: '160px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Market <span style={{ color: 'var(--pub-red)' }}>Listings</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>

                    <div className="lp-table-wrapper" style={{ borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', background: 'white', padding: '24px' }}>
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '24px' }}>Instrument</th>
                                    <th>Category</th>
                                    <th style={{ textAlign: 'center' }}>Spread (Avg)</th>
                                    <th style={{ textAlign: 'right', padding: '24px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {forexPairs.map((pair, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', background: 'var(--pub-red-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '12px', color: 'var(--pub-red)' }}>{pair.symbol.slice(0,2)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '900', color: '#111', fontSize: '15px' }}>{pair.symbol}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{pair.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '100px', fontWeight: '900', color: '#475569', textTransform: 'uppercase' }}>{pair.category}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#111' }}>{pair.spread}</td>
                                        <td style={{ textAlign: 'right', padding: '24px' }}>
                                            <button className="lp-btn-primary" style={{ padding: '10px 24px', fontSize: '10px' }} onClick={() => navigate('/register')}>TRADE</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FINALE CTA BANNER */}
            <section className="lp-cta-block" style={{ marginBottom: '120px' }}>
                <h2>Start Your Trading Journey</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Open Live Account</button>
                </div>
            </section>
        </div>
    );
};

export default Forex;
