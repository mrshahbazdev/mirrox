import React from 'react';
import { 
    Shield, Zap, Headphones, ArrowRight, BookOpen, BarChart2, 
    Globe, Cpu, Clock, Smartphone, CheckCircle2, TrendingUp, 
    Coins, Wallet, Terminal, Search, Activity
} from 'lucide-react';

const HomePublic = () => {
    const marketAssets = [
        { symbol: "EURUSD", name: "Euro / US Dollar", price: "1.0842", change: "+0.15%", up: true },
        { symbol: "XAUUSD", name: "Gold / US Dollar", price: "2,354.20", change: "-0.45%", up: false },
        { symbol: "BTCUSD", name: "Bitcoin / US Dollar", price: "64,230.50", change: "+2.41%", up: true },
        { symbol: "US500", name: "S&P 500 Index", price: "5,123.32", change: "+1.22%", up: true },
    ];

    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="lp-hero">
                <div className="lp-hero-blur"></div>
                <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                    <h1>
                        Trade <span className="accent">CFDs</span> on Forex,<br />
                        Stocks, Indices,<br />
                        Commodities and More!
                    </h1>
                    <p>
                        Experience the gold standard of trading with Mirrox. 
                        Professional tools, institutional liquidity, and ultra-fast execution.
                    </p>
                    <div className="lp-btn-group">
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>
                            Get Started Now
                        </button>
                    </div>

                    {/* Hero Mockup */}
                    <div style={{ maxWidth: '1000px', margin: '40px auto 0', position: 'relative', padding: '0 20px' }}>
                        <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(circle, var(--pub-red), transparent)', opacity: 0.1, filter: 'blur(60px)' }}></div>
                        <div style={{ position: 'relative', background: 'rgba(255,255,255,0.05)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', padding: '12px', backdropFilter: 'blur(20px)' }}>
                             <img 
                                src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=1400" 
                                alt="Mirrox Trading Interface" 
                                style={{ width: '100%', height: 'auto', borderRadius: '24px', opacity: 0.95, display: 'block' }}
                             />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ABOUT TRADING --- */}
            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px' }}>
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ display: 'flex', position: 'relative', height: '600px', width: '100%', maxWidth: '400px', justifyContent: 'center' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" 
                                style={{ width: '220px', height: '480px', objectFit: 'cover', borderRadius: '40px', border: '8px solid white', boxShadow: '0 40px 80px rgba(0,0,0,0.15)', transform: 'rotate(-5deg)', position: 'absolute', left: '0', top: '20px', zIndex: 2 }}
                                alt="Mobile App Left"
                            />
                            <img 
                                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600" 
                                style={{ width: '220px', height: '480px', objectFit: 'cover', borderRadius: '40px', border: '8px solid white', boxShadow: '0 40px 80px rgba(0,0,0,0.15)', transform: 'rotate(5deg)', position: 'absolute', right: '0', bottom: '20px', zIndex: 1 }}
                                alt="Mobile App Right"
                            />
                        </div>
                    </div>
                    <div className="lp-content-side">
                        <div style={{ display: 'inline-block', padding: '8px 20px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', fontWeight: '900', fontSize: '11px', borderRadius: '100px', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.1em' }}>
                           Multi-Asset Excellence
                        </div>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>We Are All About Trading</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '19px', lineHeight: '1.7', marginBottom: '40px' }}>
                            Experience an abundance of possibilities with Mirrox. Diversify your portfolio with access to over 160+ assets, including Forex, Commodities, Indices and Cryptocurrencies.
                        </p>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>
                            Create Free Account
                        </button>
                    </div>
                </section>

                {/* --- GLOBAL ACCESS --- */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <div style={{ display: 'inline-block', padding: '8px 20px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', fontWeight: '900', fontSize: '11px', borderRadius: '100px', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.1em' }}>
                           Global Reach
                        </div>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Trade Anywhere</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '19px', lineHeight: '1.7', marginBottom: '40px' }}>
                            Our high-performance web platform provides institutional-grade tools on any device. Execute trades with zero latency and advanced charting capabilities.
                        </p>
                        <button className="lp-btn-primary" onClick={() => navigate('/trading')}>
                            Launch Web Trader
                        </button>
                    </div>
                    <div style={{ order: 1 }}>
                        <div style={{ background: 'white', borderRadius: '48px', padding: '24px', boxShadow: '0 60px 120px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', position: 'relative' }}>
                             <img 
                                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200" 
                                alt="Mirrox Web Dashboard" 
                                style={{ width: '100%', borderRadius: '32px', display: 'block' }}
                             />
                        </div>
                    </div>
                </section>
            </div>

            {/* --- MIRROX EDGE --- */}
            <section style={{ background: '#f8fafc', padding: '160px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-section-header">
                        <h2>The Mirrox <span style={{ color: 'var(--pub-red)' }}>Edge</span></h2>
                        <div className="accent-line"></div>
                    </div>

                    <div className="lp-grid">
                        <div className="lp-card">
                            <div className="lp-icon-box"><Zap size={28} /></div>
                            <h3 style={{ textTransform: 'uppercase' }}>Effortless Trading</h3>
                            <p>One-click execution and intuitive design engineered for high-frequency professional performance.</p>
                            <div style={{ marginTop: '40px', padding: '32px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div style={{ background: '#10b981', height: '48px', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Buy</div>
                                    <div style={{ background: '#ef4444', height: '48px', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sell</div>
                                </div>
                            </div>
                        </div>

                        <div className="lp-card">
                            <div className="lp-icon-box"><Shield size={28} /></div>
                            <h3 style={{ textTransform: 'uppercase' }}>Regulated Security</h3>
                            <p>Full compliance with global financial standards and negative balance protection for all clients.</p>
                            <div style={{ marginTop: '40px', padding: '32px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                <div style={{ height: '12px', width: '100%', background: '#e2e8f0', borderRadius: '100px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: '92%', background: 'var(--pub-red)' }}></div>
                                </div>
                                <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', marginTop: '16px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>System Integrity: 99.9%</p>
                            </div>
                        </div>

                        <div className="lp-card" style={{ background: '#0b0e14', border: 'none', color: 'white' }}>
                            <div className="lp-icon-box" style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}><Headphones size={28} /></div>
                            <h3 style={{ color: 'white', textTransform: 'uppercase' }}>Expert Support</h3>
                            <p style={{ color: '#94a3b8' }}>Dedicated account managers and 24/7 multilingual support from local industry veterans.</p>
                            <button className="lp-cta-white" style={{ marginTop: '40px', width: '100%', padding: '20px' }}>Contact Specialist</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- INSTRUMENTS --- */}
            <section className="lp-section">
                <div className="lp-section-header">
                    <h2>Market <span style={{ color: 'var(--pub-red)' }}>Watch</span></h2>
                    <p style={{ color: 'var(--pub-text-muted)', marginTop: '20px', fontSize: '18px', fontWeight: '500' }}>Trade global benchmarks with competitive spreads and deep liquidity.</p>
                </div>
                
                <div className="lp-table-wrapper">
                    <table className="lp-table">
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Name</th>
                                <th>Last Price</th>
                                <th style={{ textAlign: 'right' }}>Trading</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marketAssets.map((asset, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div className="asset-badge">{asset.symbol.slice(0,3)}</div>
                                            <span style={{ fontWeight: '900', fontSize: '16px', color: '#111' }}>{asset.symbol}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>{asset.name}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontWeight: '900', color: '#111' }}>{asset.price}</span>
                                            <span style={{ fontSize: '11px', fontWeight: '900', color: asset.up ? '#10b981' : '#ef4444' }}>{asset.change}</span>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button style={{ padding: '12px 24px', borderRadius: '12px', background: '#0b0e14', color: 'white', border: 'none', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer' }}>Trade Now</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block" style={{ marginBottom: '120px' }}>
                <h2 style={{ lineHeight: '1' }}>Start Your Trading<br/>Journey Today</h2>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '60px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Get Started</button>
                    <button style={{ background: 'transparent', border: '2px solid white', color: 'white', padding: '24px 64px', borderRadius: '24px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', fontSize: '14px' }}>View Markets</button>
                </div>
            </section>
        </div>
    );
};

export default HomePublic;
