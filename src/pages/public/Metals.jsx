import React from 'react';
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

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero">
                <div className="relative z-10">
                    <h1>Metal Trading With Mirrox</h1>
                    <p>
                        Hedge against inflation and diversify your portfolio with precious and industrial metals on a professional platform.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
                
                {/* SECTION 1: WHAT IS METAL TRADING */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" 
                            alt="Metal Trading" 
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>What is Metal Trading?</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
                            Metal trading involves the buying and selling of precious metals like Gold and Silver, which have held value for thousands of years.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                            Mirrox provides CFD trading on these valuable commodities, offering you the opportunity to respond to global economic shifts and industrial demand with ultra-fast execution and no physical storage worries.
                        </p>
                        <button className="lp-btn-primary">Trade Metals</button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>Benefits of Metal CFDs</h2>
                        <ul className="lp-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                            {[
                                "Gold & Silver as primary safe-haven assets",
                                "Professional-grade analytical tools and charts",
                                "Zero commissions and ultra-tight spreads",
                                "High leverage options for diverse market strategies"
                            ].map((benefit, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', color: '#475569', fontWeight: '600' }}>
                                    <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', marginTop: '2px' }} />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="lp-btn-primary">Learn More</button>
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

            {/* METALS TABLE */}
            <section style={{ background: '#f8fafc', padding: '120px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-section-header">
                        <h2>Metals Offered</h2>
                        <p style={{ color: 'var(--pub-text-muted)', marginTop: '16px' }}>Hedge your portfolio with precious metals at institutional-grade spreads</p>
                    </div>

                    <div className="lp-table-wrapper">
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th>Metal Pair</th>
                                    <th>Type</th>
                                    <th style={{ textAlign: 'center' }}>Spread From</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metalData.map((metal, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="asset-badge">{metal.symbol.slice(0,3)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '800' }}>{metal.symbol}</div>
                                                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>{metal.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '20px', fontWeight: '900' }}>{metal.category}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '800', color: '#475569' }}>{metal.spread}</td>
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

export default Metals;
