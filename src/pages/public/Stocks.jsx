import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap, Laptop, PlayCircle } from 'lucide-react';

const Stocks = () => {
    const stockData = [
        { symbol: "AAPL", name: "Apple Inc.", spread: "0.2", category: "Tech" },
        { symbol: "AMZN", name: "Amazon.com Inc.", spread: "0.5", category: "Retail" },
        { symbol: "GOOGL", name: "Alphabet Inc.", spread: "0.4", category: "Tech" },
        { symbol: "MSFT", name: "Microsoft Corp.", spread: "0.3", category: "Tech" },
        { symbol: "META", name: "Meta Platforms Inc.", spread: "0.6", category: "Social" },
        { symbol: "TSLA", name: "Tesla Inc.", spread: "0.8", category: "Auto" },
        { symbol: "NVDA", name: "NVIDIA Corp.", spread: "0.5", category: "Tech" },
        { symbol: "NFLX", name: "Netflix Inc.", spread: "0.7", category: "Media" },
    ];

    return (
const Stocks = () => {
    const stockData = [
        { symbol: "AAPL", name: "Apple Inc.", spread: "0.2", category: "Tech" },
        { symbol: "AMZN", name: "Amazon.com Inc.", spread: "0.5", category: "Retail" },
        { symbol: "GOOGL", name: "Alphabet Inc.", spread: "0.4", category: "Tech" },
        { symbol: "MSFT", name: "Microsoft Corp.", spread: "0.3", category: "Tech" },
        { symbol: "META", name: "Meta Platforms Inc.", spread: "0.6", category: "Social" },
        { symbol: "TSLA", name: "Tesla Inc.", spread: "0.8", category: "Auto" },
        { symbol: "NVDA", name: "NVIDIA Corp.", spread: "0.5", category: "Tech" },
        { symbol: "NFLX", name: "Netflix Inc.", spread: "0.7", category: "Media" },
    ];

    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>Trade Global <span style={{ color: 'var(--pub-red)' }}>Stocks</span></h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '750px' }}>
                        Invest in the world's most innovative companies with institutional technology and elite trading conditions.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px', padding: '160px 24px' }}>
                
                {/* SECTION 1: WHAT IS STOCK TRADING? */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.06)' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=1200" 
                            alt="Equity Markets" 
                            style={{ width: '100%', borderRadius: '32px', display: 'block' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Corporate <span style={{ color: 'var(--pub-red)' }}>Growth</span></h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' }}>
                            Shares represent partial ownership in a corporation. Buying stocks allows you to align your capital with the success of global industry leaders.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                            Trade CFDs on blue-chip stocks like Apple, Tesla, and Amazon. Benefit from price fluctuations with high-leverage and short-selling capabilities.
                        </p>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Launch Workspace</button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Equity Advantages</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                            {[
                                "No deposit commissions",
                                "Competitive leverage up to 1:20",
                                "Direct access to 150+ stocks",
                                "Real-time earnings data integration"
                            ].map((benefit, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#111', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <CheckCircle2 size={24} style={{ color: 'var(--pub-red)' }} />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Start Investing</button>
                    </div>
                    <div style={{ order: 1 }}>
                        <div style={{ background: '#0b0e14', padding: '32px', borderRadius: '56px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                                alt="Trading Stats" 
                                style={{ width: '100%', borderRadius: '32px', opacity: 0.8 }}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* STOCKS TABLE SECTION */}
            <section style={{ background: '#f8fafc', padding: '160px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Equity <span style={{ color: 'var(--pub-red)' }}>Listings</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>

                    <div className="lp-table-wrapper" style={{ borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', background: 'white', padding: '24px' }}>
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '24px' }}>Company</th>
                                    <th>Industry</th>
                                    <th style={{ textAlign: 'center' }}>Spread</th>
                                    <th style={{ textAlign: 'right', padding: '24px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockData.map((stock, i) => (
                                    <tr key={i}>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', background: 'var(--pub-red-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '10px', color: 'var(--pub-red)' }}>{stock.symbol.slice(0,1)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '900', color: '#111', fontSize: '15px' }}>{stock.symbol}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{stock.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '100px', fontWeight: '900', color: '#475569', textTransform: 'uppercase' }}>{stock.category}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#111' }}>{stock.spread}</td>
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
                <h2>Build Your Global Stock Portfolio</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Start Now</button>
                </div>
            </section>
        </div>
    );
};
    );
};

export default Stocks;
