import React from 'react';
import { useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>Trade <span style={{ color: 'var(--pub-red)' }}>Commodities</span></h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '700px' }}>
                        Diversify your portfolio with institutional access to raw materials and global energy resources.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px', padding: '160px 24px' }}>
                
                {/* SECTION 1: WHAT IS COMMODITY TRADING */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-image-panel" style={{ background: 'white', padding: '24px', borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.06)' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1518544830403-18196e81997d?auto=format&fit=crop&q=80&w=1200" 
                            alt="Global Commodities" 
                            style={{ width: '100%', borderRadius: '32px', display: 'block' }}
                        />
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Inherent <span style={{ color: 'var(--pub-red)' }}>Value</span></h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' }}>
                            Commodities—energies, metals, and agricultural products—are the lifeblood of the global economy. They offer unique hedging opportunities against inflation.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                            With Bulvera, speculated on price movements without physical storage. Trade oil, gold, and gas with premium conditions.
                        </p>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>See All Markets</button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side" style={{ order: 2 }}>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Resource Edge</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                            {[
                                "Natural hedge against inflation",
                                "Seasonal volatility opportunities",
                                "Zero physical delivery logistics",
                                "High-leverage resource trading"
                            ].map((benefit, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#111', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <CheckCircle2 size={24} style={{ color: 'var(--pub-red)' }} />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Open Live Account</button>
                    </div>
                    <div style={{ order: 1, display: 'flex', justifyContent: 'center' }}>
                         <div className="lp-phone-mock" style={{ width: '100%', maxWidth: '340px', height: '640px', background: '#0b0e14', borderRadius: '48px', border: '10px solid #1e293b', boxShadow: '0 40px 100px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
                             <img 
                                src="https://images.unsplash.com/photo-1524311582025-635e68344f6f?auto=format&fit=crop&q=80&w=600" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} 
                                alt="Trading Interface" 
                             />
                             <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', transform: 'translateY(-50%)', textAlign: 'center', padding: '32px' }}>
                                 <Zap size={64} style={{ color: 'var(--pub-red)', margin: '0 auto 24px' }} />
                                 <div style={{ fontWeight: '900', color: 'white', fontSize: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Crude Oil</div>
                                 <div style={{ color: '#10b981', fontSize: '18px', fontWeight: '900', marginTop: '8px' }}>+2.45%</div>
                             </div>
                             <div style={{ position: 'absolute', bottom: '32px', left: '32px', right: '32px' }}>
                                 <button style={{ width: '100%', background: 'var(--pub-red)', color: 'white', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '900', textTransform: 'uppercase', fontSize: '11px', cursor: 'pointer' }} onClick={() => navigate('/register')}>Quick Trade</button>
                             </div>
                         </div>
                    </div>
                </section>
            </div>

            {/* COMMODITIES TABLE */}
            <section style={{ background: '#f8fafc', padding: '160px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Resource <span style={{ color: 'var(--pub-red)' }}>Inventory</span></h2>
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
                                {commodityPairs.map((pair, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', background: '#0b0e14', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '10px', color: 'white' }}>{pair.symbol.slice(0,2)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '900', color: '#111', fontSize: '15px' }}>{pair.symbol}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{pair.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '10px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '100px', fontWeight: '900', color: '#475569', textTransform: 'uppercase' }}>{pair.category}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#111' }}>{pair.spread}</td>
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
                <h2>Diversify with Physical World Assets</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Start Now</button>
                </div>
            </section>
        </div>
    );
};

export default Commodities;
