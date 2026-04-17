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

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="lp-hero">
                <div className="lp-hero-blur"></div>
                <div className="lp-hero-content relative z-10">
                    <h1>
                        Trade <span className="accent">CFDs</span> on Forex,<br className="hidden md:block"/>
                        Stocks, Indices,<br className="hidden md:block"/>
                        Commodities and More!
                    </h1>
                    <p>
                        Experience the gold standard of trading with Mirrox. 
                        Professional tools, institutional liquidity, and ultra-fast execution.
                    </p>
                    <div className="lp-btn-group">
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>
                            Get Started
                        </button>
                    </div>

                    {/* Hero Mockup */}
                    <div className="lp-hero-mockup group" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: '-4px', background: 'linear-gradient(to right, var(--pub-red), transparent)', borderRadius: '2rem', filter: 'blur(20px)', opacity: 0.2 }}></div>
                        <div style={{ position: 'relative', background: '#111', borderRadius: '2rem', border: '8px solid rgba(255,255,255,0.05)', overflow: 'hidden', padding: '8px' }}>
                             <img 
                                src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=1400" 
                                alt="Platform UI" 
                                style={{ width: '100%', height: 'auto', borderRadius: '1.5rem', opacity: 0.9 }}
                             />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ABOUT TRADING --- */}
            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="mockup-display" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ display: 'flex', marginLeft: '-40px' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" 
                                style={{ width: '260px', height: '540px', objectFit: 'cover', borderRadius: '3rem', border: '12px solid white', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', transform: 'rotate(-6deg)' }}
                                alt="Mobile App Left"
                            />
                            <img 
                                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600" 
                                style={{ width: '260px', height: '540px', objectFit: 'cover', borderRadius: '3rem', border: '12px solid white', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', transform: 'rotate(6deg)', marginTop: '60px', marginLeft: '-80px' }}
                                alt="Mobile App Right"
                            />
                        </div>
                    </div>
                    <div className="lp-content-side">
                        <div className="asset-tag" style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', fontWeight: '900', fontSize: '10px', borderRadius: '20px', textTransform: 'uppercase', marginBottom: '24px' }}>
                           Multi-Asset Excellence
                        </div>
                        <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.1', marginBottom: '24px' }}>We Are All About Trading</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
                            Experience an abundance of possibilities with Mirrox. Diversify your portfolio with access to over 160+ assets, including Forex, Commodities, and Crypto. 
                        </p>
                        <button className="lp-btn-primary" style={{ padding: '16px 32px' }}>
                            Open Account
                        </button>
                    </div>
                </section>

                {/* --- GLOBAL ACCESS --- */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <div className="asset-tag" style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', fontWeight: '900', fontSize: '10px', borderRadius: '20px', textTransform: 'uppercase', marginBottom: '24px' }}>
                           Global Markets
                        </div>
                        <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.1', marginBottom: '24px' }}>Global Access</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '24px' }}>
                            Trade from anywhere with Mirrox. Our web-based platform offers robust features, ensuring you never miss a trading opportunity.
                        </p>
                        <button className="lp-btn-primary" style={{ padding: '16px 32px' }}>
                            Start Trading
                        </button>
                    </div>
                    <div className="lp-visual-side" style={{ order: 1 }}>
                        <div style={{ background: 'white', borderRadius: '2rem', padding: '16px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                             <img 
                                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200" 
                                alt="Web Trading" 
                                style={{ width: '100%', borderRadius: '1.5rem' }}
                             />
                        </div>
                    </div>
                </section>
            </div>

            {/* --- MIRROX EDGE --- */}
            <section style={{ background: '#f8fafc', padding: '120px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-section-header">
                        <h2>The Mirrox Edge</h2>
                        <div className="accent-line"></div>
                    </div>

                    <div className="lp-grid">
                        {/* Edge Card 1 */}
                        <div className="lp-card">
                            <div className="lp-icon-box"><Zap size={28} /></div>
                            <h3>Effortless Trading</h3>
                            <p>One-click execution and intuitive design for professional performance.</p>
                            <div style={{ marginTop: '32px', padding: '24px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div style={{ background: '#22c55e', height: '40px', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Buy</div>
                                    <div style={{ background: '#ef4444', height: '40px', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Sell</div>
                                </div>
                            </div>
                        </div>

                        {/* Edge Card 2 */}
                        <div className="lp-card">
                            <div className="lp-icon-box"><Shield size={28} /></div>
                            <h3>Regulated & Secure</h3>
                            <p>Full compliance with international standards and segregated client funds.</p>
                            <div style={{ marginTop: '32px', padding: '24px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                <div style={{ height: '8px', width: '100%', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: '75%', background: 'var(--pub-red)' }}></div>
                                </div>
                                <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', marginTop: '12px', textAlign: 'center' }}>SECURITY SCORE: 98%</p>
                            </div>
                        </div>

                        {/* Edge Card 3 */}
                        <div className="lp-card" style={{ background: 'var(--pub-red)', border: 'none', color: 'white' }}>
                            <div className="lp-icon-box" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}><Headphones size={28} /></div>
                            <h3 style={{ color: 'white' }}>Expert Support</h3>
                            <p style={{ color: 'rgba(255,255,255,0.8)' }}>24/7 multilingual support from local industry veterans.</p>
                            <button className="lp-cta-white" style={{ marginTop: '32px', width: '100%', padding: '16px' }}>Contact Expert</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- INSTRUMENTS --- */}
            <section className="lp-section">
                <div className="lp-section-header">
                    <h2>Instruments</h2>
                    <p style={{ color: 'var(--pub-text-muted)', marginTop: '16px' }}>Trade world-leading assets with competitive spreads</p>
                </div>
                
                <div className="lp-table-wrapper">
                    <table className="lp-table">
                        <thead>
                            <tr>
                                <th>Asset</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marketAssets.map((asset, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className="asset-badge">{asset.symbol.slice(0,3)}</div>
                                            <span style={{ fontWeight: '800' }}>{asset.symbol}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>{asset.name}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>{asset.price}</span>
                                            <span style={{ fontSize: '10px', color: asset.up ? '#22c55e' : '#ef4444' }}>{asset.change}</span>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button style={{ padding: '8px 16px', borderRadius: '8px', background: '#0b0e14', color: 'white', border: 'none', fontSize: '11px', fontWeight: '900' }}>Trade</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2>Ready to Start?</h2>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Create Account</button>
                    <button style={{ background: 'transparent', border: '2px solid white', color: 'white', padding: '24px 64px', borderRadius: '24px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer' }}>Learn More</button>
                </div>
            </section>
        </div>
    );
};

export default HomePublic;

export default HomePublic;
