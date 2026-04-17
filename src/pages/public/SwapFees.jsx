import React, { useState } from 'react';
import { 
    Info, Calculator, BarChart, TrendingUp, ArrowRight,
    Zap, Monitor, Globe, Shield, PlayCircle, Smartphone
} from 'lucide-react';

const SwapFees = () => {
    const [activeTab, setActiveTab] = useState('forex');

    const tabs = [
        { id: 'forex', label: 'Forex' },
        { id: 'indices', label: 'Indices' },
        { id: 'commodities', label: 'Commodities' },
        { id: 'crypto', label: 'Crypto' }
    ];

    const swapData = {
        forex: [
            { asset: "EURUSD", long: "-6.50", short: "1.20" },
            { asset: "GBPUSD", long: "-8.20", short: "1.50" },
            { asset: "USDJPY", long: "1.80", short: "-7.40" },
            { asset: "AUDUSD", long: "-4.20", short: "0.80" },
            { asset: "USDCAD", long: "-3.50", short: "0.50" },
        ],
        indices: [
            { asset: "US500", long: "-12.50", short: "-8.20" },
            { asset: "US30", long: "-15.00", short: "-10.50" },
            { asset: "GER40", long: "-10.00", short: "-6.00" },
        ],
        crypto: [
            { asset: "BTCUSD", long: "-25.00", short: "-25.00" },
            { asset: "ETHUSD", long: "-15.00", short: "-15.00" },
        ]
    };

    const currentData = swapData[activeTab] || swapData['forex'];
    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>Swap <span style={{ color: 'var(--pub-red)' }}>Transparency</span></h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '750px' }}>
                        Sophisticated position management. Access real-time institutional rollover rates for global financial instruments.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '160px 24px', display: 'flex', flexDirection: 'column', gap: '160px' }}>
                
                {/* SECTION 1: WHAT ARE SWAP FEES */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '56px', boxShadow: '0 40px 100px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=1200" 
                            alt="Swap Framework" 
                            style={{ width: '100%', borderRadius: '40px', display: 'block' }}
                        />
                    </div>
                    <div className="lp-content-side">
                         <div className="accent-label" style={{ background: 'var(--pub-red-soft)', color: 'var(--pub-red)', padding: '8px 20px', borderRadius: '100px', display: 'inline-block', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '32px' }}>Operational Insights</div>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Overnight <span style={{ color: 'var(--pub-red)' }}>Dynamics</span></h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' }}>
                           Swap fees reflect the interest rate differential between currency components. They are credited or debited for positions maintained past the daily settlement time.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7' }}>
                            At Mirrox, we deploy institutional-grade transparency. Monitor your rollover costs to optimize long-duration strategic exposure.
                        </p>
                    </div>
                </section>

                {/* SECTION 2: CALCULATIONS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '40px', textTransform: 'uppercase' }}>Precision <span style={{ color: 'var(--pub-red)' }}>Formula</span></h2>
                        <div style={{ background: '#0b0e14', padding: '48px', borderRadius: '48px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '48px', boxShadow: '0 40px 80px rgba(0,0,0,0.2)' }}>
                            <p style={{ fontSize: '11px', fontWeight: '900', color: 'var(--pub-red)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.2em' }}>Algorithmic Calculation</p>
                            <p style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: '900', color: 'white', letterSpacing: '0.05em', fontStyle: 'italic' }}>Swap = (Lots × Contact Size) × Point × Rate</p>
                        </div>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7' }}>
                            Rollover cycles are impacted by global bank holidays. Triple-swap adjustments typically occur on Wednesdays to account for standard settlement lag over weekends.
                        </p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div style={{ background: 'white', padding: '24px', borderRadius: '56px', boxShadow: '0 40px 100px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                                alt="Metric Visualization" 
                                style={{ width: '100%', borderRadius: '40px', display: 'block' }}
                            />
                        </div>
                    </div>
                </section>

                {/* SWAP MATRIX */}
                <section>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Swap Rate <span style={{ color: 'var(--pub-red)' }}>Index</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>

                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '64px' }}>
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{ 
                                    padding: '16px 36px', 
                                    borderRadius: '100px', 
                                    border: '1px solid #e2e8f0', 
                                    fontSize: '11px', 
                                    fontWeight: '900', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.1em',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    background: activeTab === tab.id ? '#0b0e14' : 'white',
                                    color: activeTab === tab.id ? 'white' : '#64748b',
                                    boxShadow: activeTab === tab.id ? '0 20px 40px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="lp-table-wrapper" style={{ borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.05)', background: 'white', padding: '24px', overflow: 'hidden' }}>
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '24px' }}>Institutional Asset</th>
                                    <th style={{ textAlign: 'center' }}>Long Adjustment</th>
                                    <th style={{ textAlign: 'center' }}>Short Adjustment</th>
                                    <th style={{ textAlign: 'right', padding: '24px' }}>3-Day Rollover</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <BarChart size={20} />
                                                </div>
                                                <span style={{ fontWeight: '900', color: '#111', fontSize: '15px' }}>{item.asset}</span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#ef4444' }}>{item.long}</td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#10b981' }}>{item.short}</td>
                                        <td style={{ textAlign: 'right', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', fontSize: '11px', padding: '24px' }}>WEDNESDAY Cycle</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* FINAL CTA */}
            <section className="lp-cta-block" style={{ marginBottom: '160px' }}>
                <h2>Ready to Execute? Start with Mirrox</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Activate Terminal</button>
                </div>
            </section>

             <footer style={{ textAlign: 'center', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: '2' }}>
                    Note: Swap rates are calculated based on bank liquidity and subject to periodic adjustments.
                </p>
            </footer>
        </div>
    );
};

export default SwapFees;
