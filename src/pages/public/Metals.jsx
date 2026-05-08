import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap, Diamond, Globe } from 'lucide-react';

const Metals = () => {
    const metalData = [
        { symbol: "XAUUSD", name: "Gold / US Dollar", spread: "0.25", category: "Precious" },
        { symbol: "XAGUSD", name: "Silver / US Dollar", spread: "0.015", category: "Precious" },
        { symbol: "XPTUSD", name: "Platinum / US Dollar", spread: "1.5", category: "Precious" },
        { symbol: "XPDUSD", name: "Palladium / US Dollar", spread: "3.2", category: "Precious" },
        { symbol: "ALU", name: "Aluminum", spread: "0.5", category: "Industrial" },
        { symbol: "COPPER", name: "Copper", spread: "0.002", category: "Industrial" },
        { symbol: "NICKEL", name: "Nickel", spread: "2.5", category: "Industrial" },
        { symbol: "ZINC", name: "Zinc", spread: "1.0", category: "Industrial" },
    ];

    const navigate = useNavigate();

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>Trade Precious <span style={{ color: 'var(--pub-red)' }}>Metals</span></h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '750px' }}>
                        Invest in timeless value. Hedge against global instability with institutional access to gold, silver, and industrial metals.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px', padding: '160px 24px' }}>
                
                {/* SECTION 1: WHAT IS METAL TRADING */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.06)' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200" 
                            alt="Hard Assets" 
                            style={{ width: '100%', borderRadius: '32px', display: 'block' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Ancient <span style={{ color: 'var(--pub-red)' }}>Security</span></h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' }}>
                            Metals like Gold and Silver have served as hedges against inflation for millennia. They are the ultimate safe-haven assets in times of volatility.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                            Trade CFD contracts on precious and industrial metals. Benefit from deep liquidity and fast execution without physical delivery requirements.
                        </p>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Start Trading Metals</button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Metallic Core</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                            {[
                                "Gold & Silver as liquid safe-havens",
                                "Zero physical storage or insurance costs",
                                "Institutional-grade spreads on XAU/USD",
                                "High-leverage for capital efficiency"
                            ].map((benefit, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#111', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <CheckCircle2 size={24} style={{ color: 'var(--pub-red)' }} />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Launch Terminal</button>
                    </div>
                    <div style={{ order: 1 }}>
                        <div style={{ background: '#0b0e14', padding: '32px', borderRadius: '56px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                                alt="Chart Analysis" 
                                style={{ width: '100%', borderRadius: '32px', opacity: 0.8 }}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* METALS TABLE */}
            <section style={{ background: '#f8fafc', padding: '160px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Metal <span style={{ color: 'var(--pub-red)' }}>Inventory</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>

                    <div className="lp-table-wrapper" style={{ borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', background: 'white', padding: '24px' }}>
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '24px' }}>Metal Pair</th>
                                    <th>Category</th>
                                    <th style={{ textAlign: 'center' }}>Spread</th>
                                    <th style={{ textAlign: 'right', padding: '24px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metalData.map((metal, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', background: 'var(--pub-red-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '10px', color: 'var(--pub-red)' }}>{metal.symbol.slice(0,2)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '900', color: '#111', fontSize: '15px' }}>{metal.symbol}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{metal.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '100px', fontWeight: '900', color: '#475569', textTransform: 'uppercase' }}>{metal.category}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#111' }}>{metal.spread}</td>
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
                <h2>Invest in Stability Today</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Open Live Account</button>
                </div>
            </section>
        </div>
    );
};

export default Metals;
