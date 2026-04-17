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

    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>Trade <span style={{ color: 'var(--pub-red)' }}>Crypto</span> CFDs</h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '750px' }}>
                        Access the world's most dynamic digital economy with institutional-grade execution and 24/7 market exposure.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px', padding: '160px 24px' }}>
                
                {/* SECTION 1: WHAT IS CRYPTO TRADING */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.06)' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1518544830403-18196e81997d?auto=format&fit=crop&q=80&w=1200" 
                            alt="Digital Assets" 
                            style={{ width: '100%', borderRadius: '32px', display: 'block' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Digital <span style={{ color: 'var(--pub-red)' }}>Evolution</span></h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' }}>
                            Cryptocurrencies are decentralized financial instruments powered by blockchain technology. They represent a paradigm shift in global finance.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                            With Mirrox, trade these assets as CFDs. Profit from volatility in Bitcoin, Ethereum, and Solana without the need for a crypto wallet or cold storage.
                        </p>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Trade Now</button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Crypto Advantage</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                            {[
                                "Institutional liquidity on major coins",
                                "Continuous 24/7 trading availability",
                                "Zero hidden commissions on deposits",
                                "Secure, regulated trading environment"
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
                                src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=1200" 
                                alt="Network Analysis" 
                                style={{ width: '100%', borderRadius: '32px', opacity: 0.8 }}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* CRYPTO TABLE */}
            <section style={{ background: '#f8fafc', padding: '160px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Available <span style={{ color: 'var(--pub-red)' }}>Assets</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>

                    <div className="lp-table-wrapper" style={{ borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', background: 'white', padding: '24px' }}>
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '24px' }}>Asset</th>
                                    <th>Category</th>
                                    <th style={{ textAlign: 'center' }}>Spread</th>
                                    <th style={{ textAlign: 'right', padding: '24px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cryptoData.map((coin, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', background: '#fff7ed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '10px', color: '#f97316' }}>{coin.symbol.slice(0,3)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '900', color: '#111', fontSize: '15px' }}>{coin.symbol}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{coin.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '100px', fontWeight: '900', color: '#475569', textTransform: 'uppercase' }}>{coin.category}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#111' }}>{coin.spread}</td>
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
                <h2>Join the Financial Revolution</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Sign Up Now</button>
                </div>
            </section>
        </div>
    );
};
    );
};

export default CryptocurrenciesCfds;
