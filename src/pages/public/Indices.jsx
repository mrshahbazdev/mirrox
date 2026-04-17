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
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero">
                <div className="relative z-10">
                    <h1>Indices Trading with Mirrox</h1>
                    <p>
                        Access the world's leading equity markets and trade on the performance of entire economies.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
                
                {/* SECTION 1: WHAT IS INDEX TRADING */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" 
                            alt="Index Trading" 
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>What is Index Trading?</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
                            Indices represent a collection of stocks that track the performance of a specific market segment or economy. 
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                            In CFD trading, you can trade these indices without owning the underlying stocks, allowing you to profit from both rising and falling markets with high flexibility.
                        </p>
                        <button className="lp-btn-primary">Trade CFDs</button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>Benefits of Index CFDs</h2>
                        <ul className="lp-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                            {[
                                "Diversification through a single trade",
                                "Competitive leverage up to 1:400",
                                "Global market access 24/5",
                                "No commission on deposits and low spreads"
                            ].map((benefit, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', color: '#475569', fontWeight: '600' }}>
                                    <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', marginTop: '2px' }} />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="lp-btn-primary">Explore CFDs</button>
                    </div>
                    <div style={{ order: 1 }}>
                        <img 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                            alt="Analytical Charts" 
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                </section>
            </div>

            {/* INDICES TABLE */}
            <section style={{ background: '#f8fafc', padding: '120px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-section-header">
                        <h2>Indices Offered</h2>
                        <p style={{ color: 'var(--pub-text-muted)', marginTop: '16px' }}>Trade on the move with competitive spreads on global indices</p>
                    </div>

                    <div className="lp-table-wrapper">
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>Region</th>
                                    <th style={{ textAlign: 'center' }}>Spread From</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {indicesData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="asset-badge">{item.symbol.slice(0,3)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '800' }}>{item.symbol}</div>
                                                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>{item.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '20px', fontWeight: '900' }}>{item.category}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '800', color: '#475569' }}>{item.spread}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--pub-red)', color: 'white', border: 'none', fontSize: '11px', fontWeight: '900' }}>TRADE</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FINALE CTA BANNER */}
            <section className="lp-cta-block">
                <h2>Join Mirrox and Start Trading</h2>
                <div style={{ marginTop: '32px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Get Started Now</button>
                </div>
            </section>
        </div>
    );
};

export default Indices;
