import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap, Globe, Package } from 'lucide-react';

const Commodities = () => {
    const commodityPairs = [
        { symbol: "BRENT", name: "Brent Crude Oil", spread: "0.03", category: "Energy" },
        { symbol: "WTI", name: "Crude Oil (WTI)", spread: "0.03", category: "Energy" },
        { symbol: "NGAS", name: "Natural Gas", spread: "0.005", category: "Energy" },
        { symbol: "GOLD", name: "Gold (Commodity)", spread: "0.45", category: "Metals" },
        { symbol: "SILVER", name: "Silver (Commodity)", spread: "0.03", category: "Metals" },
        { symbol: "COPPER", name: "Copper", spread: "0.002", category: "Metals" },
        { symbol: "WHEAT", name: "Wheat", spread: "0.50", category: "Agriculture" },
        { symbol: "SUGAR", name: "Sugar", spread: "0.05", category: "Agriculture" },
    ];

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero">
                <div className="relative z-10">
                    <h1>Commodity Trading with Mirrox</h1>
                    <p>
                        Diversify your portfolio with essential raw materials and energy resources from global markets.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
                
                {/* SECTION 1: WHAT IS COMMODITY TRADING */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1518544830403-18196e81997d?auto=format&fit=crop&q=80&w=800" 
                            alt="Commodities" 
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>What is Commodity Trading?</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
                            Commodities, such as energy, metals, and agricultural products, are the essential raw materials of the global economy. 
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                            With Mirrox, you can trade CFDs on these commodities, allowing you to speculate on price movements without the need for physical storage or delivery, providing unique diversification opportunities.
                        </p>
                        <button className="lp-btn-primary">Trade CFDs</button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>Benefits of Commodity CFDs</h2>
                        <ul className="lp-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                            {[
                                "Inherent protection against global inflation",
                                "Seasonal price trends and predictable cycles",
                                "High volatility for short-term opportunities",
                                "Competitive leverage and zero deposit commissions"
                            ].map((benefit, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', color: '#475569', fontWeight: '600' }}>
                                    <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', marginTop: '2px' }} />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="lp-btn-primary">Explore Assets</button>
                    </div>
                    <div style={{ order: 1, display: 'flex', justifyContent: 'center' }}>
                         <div style={{ width: '280px', height: '560px', background: '#0b0e14', borderRadius: '3rem', border: '12px solid #1e293b', boxShadow: '0 30px 60px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden' }}>
                             <img src="https://images.unsplash.com/photo-1524311582025-635e68344f6f?auto=format&fit=crop&q=80&w=600" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                             <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', transform: 'translateY(-50%)', textAlign: 'center', padding: '24px' }}>
                                 <Zap size={48} style={{ color: 'var(--pub-red)', margin: '0 auto 16px' }} />
                                 <div style={{ fontWeight: '900', color: 'white', fontSize: '20px' }}>NATURAL GAS</div>
                                 <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: '800' }}>+2.45%</div>
                             </div>
                         </div>
                    </div>
                </section>
            </div>

            {/* COMMODITIES TABLE */}
            <section style={{ background: '#f8fafc', padding: '120px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-section-header">
                        <h2>Commodities Offered</h2>
                        <p style={{ color: 'var(--pub-text-muted)', marginTop: '16px' }}>Trade world-leading softs and energies with competitive execution</p>
                    </div>

                    <div className="lp-table-wrapper">
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th>Type</th>
                                    <th style={{ textAlign: 'center' }}>Spread From</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commodityPairs.map((pair, idx) => (
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

export default Commodities;
