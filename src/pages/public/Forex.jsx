import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap } from 'lucide-react';

const Forex = () => {
    const forexPairs = [
        { symbol: "EURUSD", name: "Euro / US Dollar", spread: "1.2", category: "Majors" },
        { symbol: "GBPUSD", name: "Great Britain Pound / US Dollar", spread: "1.5", category: "Majors" },
        { symbol: "USDJPY", name: "US Dollar / Japanese Yen", spread: "1.1", category: "Majors" },
        { symbol: "USDCAD", name: "US Dollar / Canadian Dollar", spread: "1.8", category: "Majors" },
        { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", spread: "1.4", category: "Majors" },
        { symbol: "EURGBP", name: "Euro / Great Britain Pound", spread: "2.1", category: "Minors" },
        { symbol: "GBPCHF", name: "Great Britain Pound / Swiss Franc", spread: "2.5", category: "Minors" },
        { symbol: "AUDJPY", name: "Australian Dollar / Japanese Yen", spread: "2.3", category: "Minors" },
    ];

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero">
                <div className="relative z-10">
                    <h1>Forex Trading With Mirrox</h1>
                    <p>
                        Navigate the world's most liquid market with professional tools and competitive spreads.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
                
                {/* SECTION 1: WHAT IS FOREX */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=800" 
                            alt="Forex Trading" 
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>What is Forex Trading?</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
                            Forex trading, also known as currency trading, involves the exchange of currencies in the global market. It is the largest and most liquid financial market in the world, driven by geopolitical events and economic data.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                            With Mirrox, you can trade Forex CFDs (Contracts for Difference) to participate in price movements across major, minor, and exotic pairs, 24 hours a day, 5 days a week.
                        </p>
                        <button className="lp-btn-primary">Trade Now</button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>Benefits of Trading Forex CFDs</h2>
                        <ul className="lp-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                            {[
                                "Competitive tight spreads starting from 0.0 pips",
                                "Zero commission on deposits",
                                "24/5 access to global markets",
                                "Lightning-fast execution with minimal slippage"
                            ].map((benefit, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', color: '#475569', fontWeight: '600' }}>
                                    <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', marginTop: '2px' }} />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="lp-btn-primary">View Offer</button>
                    </div>
                    <div style={{ order: 1, display: 'flex', justifyContent: 'center' }}>
                         <div style={{ width: '280px', height: '560px', background: '#0b0e14', borderRadius: '3rem', border: '12px solid #1e293b', boxShadow: '0 30px 60px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden' }}>
                             <img src="https://images.unsplash.com/photo-1611224885990-ab73b391cd2a?auto=format&fit=crop&q=80&w=600" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                             <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '24px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                 <button style={{ width: '100%', background: '#22C55E', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900' }}>BUY</button>
                                 <button style={{ width: '100%', background: '#EF4444', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900' }}>SELL</button>
                             </div>
                         </div>
                    </div>
                </section>
            </div>

            {/* FOREX PAIRS TABLE */}
            <section style={{ background: '#f8fafc', padding: '120px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-section-header">
                        <h2>Forex Pairs Offering</h2>
                        <p style={{ color: 'var(--pub-text-muted)', marginTop: '16px' }}>Explore our competitive spreads across global pairs</p>
                    </div>

                    <div className="lp-table-wrapper">
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th>Instrument</th>
                                    <th>Type</th>
                                    <th style={{ textAlign: 'center' }}>Avg Spread</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {forexPairs.map((pair, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="asset-badge">{pair.symbol.slice(0,3)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '800' }}>{pair.symbol}</div>
                                                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>{pair.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '20px', fontWeight: '900' }}>{pair.category}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '800', color: '#475569' }}>{pair.spread}</td>
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

export default Forex;
