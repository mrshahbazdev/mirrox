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

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1>Swap Rates at Mirrox</h1>
                    <p>
                        Understanding overnight charges for strategic position management.
                    </p>
                </div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: '120px' }}>
                
                {/* SECTION 1: WHAT ARE SWAP FEES */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=800" 
                            alt="Swap Explained" 
                            style={{ width: '100%', borderRadius: '48px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                    <div className="lp-content-side">
                         <div style={{ display: 'inline-block', padding: '6px 16px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '100px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px' }}>Trading Basics</div>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>What Are Swap Fees?</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
                           Swap fees, also known as rollover fees, are interest charges or credits applied to positions held overnight.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', lineHeight: '1.6' }}>
                            These fees reflect the interest rate differential between two assets and are a standard part of professional trading. 
                            At Mirrox, we provide transparent rates to help you manage your long-term strategies.
                        </p>
                    </div>
                </section>

                {/* SECTION 2: CALCULATIONS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>Calculations & Examples</h2>
                        <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
                            <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--pub-red)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>Formula</p>
                            <p style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-0.02em' }}>Swap = Lots × Size × Point × Rate</p>
                        </div>
                        <p style={{ color: 'var(--pub-text-muted)', lineHeight: '1.6' }}>
                            Keep in mind that bank holidays can affect the number of days a position is rolled forward. 
                            Positions held overnight on Wednesdays typically incur a 3-day swap to cover the weekend.
                        </p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                            alt="Calculation Visual" 
                            style={{ width: '100%', borderRadius: '48px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                </section>

                {/* --- SWAP MATRIX --- */}
                <section>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <h2 style={{ fontSize: '48px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase' }}>Swap Rate Matrix</h2>
                        <p style={{ marginTop: '16px', color: '#94a3b8', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}>Real-time overnight rollover rates</p>
                    </div>

                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '48px' }}>
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{ 
                                    padding: '16px 40px', 
                                    borderRadius: '16px', 
                                    border: 'none', 
                                    fontSize: '12px', 
                                    fontWeight: '900', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.1em',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    background: activeTab === tab.id ? 'var(--pub-red)' : '#f8fafc',
                                    color: activeTab === tab.id ? 'white' : '#94a3b8',
                                    boxShadow: activeTab === tab.id ? '0 10px 20px rgba(255,77,94,0.2)' : 'none'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="lp-table-wrapper">
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th style={{ textAlign: 'center' }}>Long Swap</th>
                                    <th style={{ textAlign: 'center' }}>Short Swap</th>
                                    <th style={{ textAlign: 'right' }}>3rd Day</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <BarChart size={18} />
                                                </div>
                                                <span style={{ fontWeight: '900', color: '#1a1a1a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item.asset}</span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#ef4444' }}>{item.long}</td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#22c55e' }}>{item.short}</td>
                                        <td style={{ textAlign: 'right', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px' }}>Wednesday</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2 style={{ textAlign: 'center' }}>Join Mirrox and Start Trading</h2>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Start Now</button>
                </div>
            </section>

             <footer style={{ textAlign: 'center', paddingBottom: '64px' }}>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    NOTE: SWAP RATES ARE SUBJECT TO MARKET VOLATILITY AND LIQUIDITY PROVIDER ADJUSTMENTS.
                </p>
            </footer>
        </div>
    );
};

export default SwapFees;
