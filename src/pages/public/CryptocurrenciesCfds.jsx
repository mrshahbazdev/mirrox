import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap, Coins, Globe, Cpu } from 'lucide-react';

const CryptocurrenciesCfds = () => {
    const cryptoData = [
        { symbol: "BTCUSD", name: "Bitcoin", spread: "2.5", category: "Majors" },
        { symbol: "ETHUSD", name: "Ethereum", spread: "1.2", category: "Majors" },
        { symbol: "XRPUSD", name: "Ripple", spread: "0.005", category: "Altcoins" },
        { symbol: "LTCUSD", name: "Litecoin", spread: "0.15", category: "Altcoins" },
        { symbol: "DOGEUSD", name: "Dogecoin", spread: "0.0001", category: "Altcoins" },
        { symbol: "ADAUSD", name: "Cardano", spread: "0.01", category: "Altcoins" },
        { symbol: "SOLUSD", name: "Solana", spread: "0.25", category: "Altcoins" },
        { symbol: "DOTUSD", name: "Polkadot", spread: "0.1", category: "Altcoins" },
    ];

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero">
                <div className="relative z-10">
                    <h1>Cryptocurrency CFDs Trading With Mirrox</h1>
                    <p>
                        Tap into the world's most dynamic digital economy with professional tools and ultra-fast execution.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
                
                {/* SECTION 1: WHAT IS CRYPTO TRADING */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1518544830403-18196e81997d?auto=format&fit=crop&q=80&w=800" 
                            alt="Crypto Trading" 
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>What is Crypto CFDs?</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
                            Cryptocurrencies are decentralized digital currencies that use blockchain technology for secure, transparent transactions.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                            CFD trading allows you to speculate on the price movements of major coins like Bitcoin and Ethereum without owning them, giving you the ability to profit from both bullish and bearish market trends.
                        </p>
                        <button className="lp-btn-primary">Trade Crypto Now</button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>Benefits of Crypto CFDs</h2>
                        <ul className="lp-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                            {[
                                "Access to 20+ major and exotic digital coins",
                                "Lightning-fast execution on high-volatility moves",
                                "Zero commission on deposits and no hidden fees",
                                "24/7 market exposure to digital assets"
                            ].map((benefit, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', color: '#475569', fontWeight: '600' }}>
                                    <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', marginTop: '2px' }} />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="lp-btn-primary">View Offer</button>
                    </div>
                    <div style={{ order: 1 }}>
                        <img 
                            src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800" 
                            alt="Analytical Charts" 
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                </section>
            </div>

            {/* CRYPTO TABLE */}
            <section style={{ background: '#f8fafc', padding: '120px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-section-header">
                        <h2>Crypto CFDs Offered</h2>
                        <p style={{ color: 'var(--pub-text-muted)', marginTop: '16px' }}>Trade the digital future with competitive spreads and 24/7 access</p>
                    </div>

                    <div className="lp-table-wrapper">
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th>Digital Asset</th>
                                    <th>Type</th>
                                    <th style={{ textAlign: 'center' }}>Spread From</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cryptoData.map((coin, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="asset-badge" style={{ background: '#fff7ed', color: '#f97316' }}>{coin.symbol.slice(0,3)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '800' }}>{coin.symbol}</div>
                                                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>{coin.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '20px', fontWeight: '900' }}>{coin.category}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '800', color: '#475569' }}>{coin.spread}</td>
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

export default CryptocurrenciesCfds;
