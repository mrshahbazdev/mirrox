import React from 'react';
import { 
    Calendar, Shield, Zap, Headphones, CheckCircle2, 
    ArrowRight, PlayCircle, BarChart, Globe, Layout, Monitor
} from 'lucide-react';

const CfdExpiries = () => {
    const expiryData = [
        { asset: "BRENT", name: "Brent Crude Oil", month: "JAN 2025", final: "2024-12-31" },
        { asset: "WTI", name: "West Texas Intermediate", month: "JAN 2025", final: "2024-12-31" },
        { asset: "NGAS", name: "Natural Gas", month: "FEB 2025", final: "2025-01-15" },
        { asset: "COFFEE", name: "US Coffee C", month: "MAR 2025", final: "2025-02-20" },
    ];

    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>Future <span style={{ color: 'var(--pub-red)' }}>Expiries</span></h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '750px' }}>
                        Strategic timing is essential. Monitor upcoming contract rollover dates and final expiry events with institutional precision.
                    </p>
                </div>
            </section>

            {/* EXPIRY MATRIX */}
            <section style={{ padding: '160px 24px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Contract <span style={{ color: 'var(--pub-red)' }}>Lifecycle</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>

                    <div className="lp-table-wrapper" style={{ borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.05)', background: 'white', padding: '24px', overflow: 'hidden' }}>
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '24px' }}>Asset Identifier</th>
                                    <th style={{ textAlign: 'center' }}>Product Name</th>
                                    <th style={{ textAlign: 'center' }}>Cycle Month</th>
                                    <th style={{ textAlign: 'right', padding: '24px' }}>Final Expiry</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '12px' }}>
                                {expiryData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Calendar size={18} />
                                                </div>
                                                <span style={{ fontWeight: '900', color: '#111', fontSize: '15px' }}>{item.asset}</span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>{item.name}</td>
                                        <td style={{ textAlign: 'center', color: 'var(--pub-red)', fontWeight: '900', textTransform: 'uppercase' }}>{item.month}</td>
                                        <td style={{ textAlign: 'right', color: '#111', fontWeight: '900', padding: '24px' }}>{item.final}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* THE MIRROX EDGE GRID */}
            <section style={{ background: '#f8fafc', padding: '160px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '100px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Institutional <span style={{ color: 'var(--pub-red)' }}>Advantages</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
                        {/* Effortless Trading */}
                        <div className="lp-feature-card" style={{ padding: '64px 48px', background: 'white', borderRadius: '56px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.03)' }}>
                             <div style={{ color: 'var(--pub-red)', marginBottom: '32px' }}><Layout size={32} /></div>
                             <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#111', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Elite Platform</h3>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {["One-Click Execution", "Institutional Liquidty", "Advanced Workspace", "Dynamic Charts"].map((f,i)=>(
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>
                                        <CheckCircle2 size={20} style={{ color: 'var(--pub-red)' }} /> {f}
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* Regulated & Secure */}
                        <div className="lp-feature-card" style={{ padding: '64px 48px', background: 'white', borderRadius: '56px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.03)' }}>
                             <div style={{ color: 'var(--pub-red)', marginBottom: '32px' }}><Shield size={32} /></div>
                             <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#111', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hardened Security</h3>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {["MWALI Regulation", "Tier-1 Capital", "Encrypted Protocols", "Client Fund Safety"].map((f,i)=>(
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>
                                        <CheckCircle2 size={20} style={{ color: 'var(--pub-red)' }} /> {f}
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* Dedicated Support */}
                        <div className="lp-feature-card" style={{ padding: '64px 48px', background: 'white', borderRadius: '56px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.03)' }}>
                             <div style={{ color: 'var(--pub-red)', marginBottom: '32px' }}><Headphones size={32} /></div>
                             <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#111', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expert Support</h3>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {["Dedicated Managers", "24/7 Global Desk", "Market Analysis", "Strategic Insights"].map((f,i)=>(
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>
                                        <CheckCircle2 size={20} style={{ color: 'var(--pub-red)' }} /> {f}
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="lp-cta-block" style={{ marginBottom: '160px' }}>
                <h2>Ready for Your Next Operation?</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Launch Live Account</button>
                </div>
            </section>

             <footer style={{ textAlign: 'center', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: '2' }}>
                    Risk Disclosure: Contract for Differences (CFDs) are complex instruments and come with high risk.
                </p>
            </footer>
        </div>
    );
};

export default CfdExpiries;
