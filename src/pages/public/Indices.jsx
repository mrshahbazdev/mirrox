import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap, PlayCircle } from 'lucide-react';

const Indices = () => {
    const indicesData = [
        { symbol: "US500", name: "S&P 500 Index", spread: "0.5", category: "USA" },
        { symbol: "US30", name: "Wall Street 30 (Dow Jones)", spread: "1.2", category: "USA" },
        { symbol: "USTEC", name: "US Tech 100 (Nasdaq)", spread: "0.8", category: "USA" },
        { symbol: "GER40", name: "Germany 40 (DAX)", spread: "1.0", category: "Europe" },
        { symbol: "UK100", name: "UK 100 (FTSE)", spread: "0.9", category: "Europe" },
        { symbol: "JPN225", name: "Japan 225 (Nikkei)", spread: "1.5", category: "Asia" },
        { symbol: "F40", name: "France 40 (CAC)", spread: "1.1", category: "Europe" },
        { symbol: "ESP35", name: "Spain 35 (IBEX)", spread: "2.0", category: "Europe" },
    ];

    return (
const Indices = () => {
    const indicesData = [
        { symbol: "US500", name: "S&P 500 Index", spread: "0.5", category: "USA" },
        { symbol: "US30", name: "Wall Street 30 (Dow Jones)", spread: "1.2", category: "USA" },
        { symbol: "USTEC", name: "US Tech 100 (Nasdaq)", spread: "0.8", category: "USA" },
        { symbol: "GER40", name: "Germany 40 (DAX)", spread: "1.0", category: "Europe" },
        { symbol: "UK100", name: "UK 100 (FTSE)", spread: "0.9", category: "Europe" },
        { symbol: "JPN225", name: "Japan 225 (Nikkei)", spread: "1.5", category: "Asia" },
        { symbol: "F40", name: "France 40 (CAC)", spread: "1.1", category: "Europe" },
        { symbol: "ESP35", name: "Spain 35 (IBEX)", spread: "2.0", category: "Europe" },
    ];

    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>Trade <span style={{ color: 'var(--pub-red)' }}>Indices</span></h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '750px' }}>
                        Access the world's leading equity benchmarks and trade on the performance of global economies.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px', padding: '160px 24px' }}>
                
                {/* SECTION 1: WHAT IS INDEX TRADING */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.06)' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200" 
                            alt="Market Performance" 
                            style={{ width: '100%', borderRadius: '32px', display: 'block' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Macro <span style={{ color: 'var(--pub-red)' }}>Power</span></h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' }}>
                            Stock indices track the performance of a specific sector or a country's entire economy. They provide a high-level view of market health and stability.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                            With Mirrox, trade global benchmarks like the S&P 500, DAX, and Nikkei with institutional-grade liquidity and no requotes.
                        </p>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>View Index List</button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Global Benchmarks</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                            {[
                                "Diversification in a single position",
                                "Deep liquidity on major indices",
                                "Zero commissions and tight spreads",
                                "High-speed order execution"
                            ].map((benefit, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#111', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <CheckCircle2 size={24} style={{ color: 'var(--pub-red)' }} />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Explore Markets</button>
                    </div>
                    <div style={{ order: 1 }}>
                        <div style={{ background: '#0b0e14', padding: '32px', borderRadius: '56px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                                alt="Analytical Data" 
                                style={{ width: '100%', borderRadius: '32px', opacity: 0.8 }}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* INDICES TABLE */}
            <section style={{ background: '#f8fafc', padding: '160px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Banchmark <span style={{ color: 'var(--pub-red)' }}>Listings</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>

                    <div className="lp-table-wrapper" style={{ borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', background: 'white', padding: '24px' }}>
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '24px' }}>Benchmark</th>
                                    <th>Region</th>
                                    <th style={{ textAlign: 'center' }}>Spread</th>
                                    <th style={{ textAlign: 'right', padding: '24px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {indicesData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', background: 'var(--pub-red-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '10px', color: 'var(--pub-red)' }}>{item.symbol.slice(0,2)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '900', color: '#111', fontSize: '15px' }}>{item.symbol}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{item.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '100px', fontWeight: '900', color: '#475569', textTransform: 'uppercase' }}>{item.category}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#111' }}>{item.spread}</td>
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
                <h2>Amplify Your Market Reach</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Sign Up Now</button>
                </div>
            </section>
        </div>
    );
};
    );
};

export default Indices;
