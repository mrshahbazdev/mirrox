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
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero">
                <div className="relative z-10">
                    <h1>Stock Trading with Mirrox</h1>
                    <p>
                        Trade CFDs on the world's most innovative companies with low barriers to entry and professional tools.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
                
                {/* SECTION 1: WHAT IS STOCK TRADING? */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=800" 
                            alt="Stock Market" 
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>What is Stock Trading?</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
                            Shares represent ownership in a company and allow you to participate in its growth and success. 
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                            CFD Stock trading enables you to speculate on the price movements of global stocks like Apple, Tesla, and Amazon without owning the actual shares, allowing for leverage and short-selling opportunities.
                        </p>
                        <button className="lp-btn-primary">Trade Stocks</button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>Benefits of Stock CFDs</h2>
                        <ul className="lp-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                            {[
                                "No commission on deposits and low spreads",
                                "Competitive leverage up to 1:20",
                                "Global access to 150+ stocks",
                                "Real-time execution and advanced insights"
                            ].map((benefit, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', color: '#475569', fontWeight: '600' }}>
                                    <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', marginTop: '2px' }} />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="lp-btn-primary">Start Trading</button>
                    </div>
                    <div style={{ order: 1 }}>
                        <img 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                            alt="Trading Dashboard" 
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                </section>
            </div>

            {/* STOCKS TABLE SECTION */}
            <section style={{ background: '#f8fafc', padding: '120px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-section-header">
                        <h2>Stocks Offered</h2>
                        <p style={{ color: 'var(--pub-text-muted)', marginTop: '16px' }}>Access over 150+ global stocks with lightning-fast execution</p>
                    </div>

                    <div className="lp-table-wrapper">
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Industry</th>
                                    <th style={{ textAlign: 'center' }}>Spread From</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockData.map((stock, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="asset-badge">{stock.symbol.slice(0, 1)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '800' }}>{stock.symbol}</div>
                                                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>{stock.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '20px', fontWeight: '900' }}>{stock.category}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '800', color: '#475569' }}>{stock.spread}</td>
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

export default Stocks;
