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

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1>Future Expiry Dates at Mirrox</h1>
                    <p>
                        Master your trade management with precision contract tracking.
                    </p>
                </div>
            </section>

            {/* --- EXPIRY MATRIX --- */}
            <section style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-table-wrapper">
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th style={{ textAlign: 'center' }}>Product Name</th>
                                    <th style={{ textAlign: 'center' }}>Expiry Month</th>
                                    <th style={{ textAlign: 'right' }}>Final Expiry</th>
                                </tr>
                            </thead>
                            <tbody style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: '900' }}>
                                {expiryData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Calendar size={18} />
                                                </div>
                                                <span style={{ color: '#1a1a1a', letterSpacing: '0.05em' }}>{item.asset}</span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', color: '#64748b' }}>{item.name}</td>
                                        <td style={{ textAlign: 'center', color: 'var(--pub-red)' }}>{item.month}</td>
                                        <td style={{ textAlign: 'right', color: '#1a1a1a' }}>{item.final}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* --- THE MIRROX EDGE --- */}
            <section style={{ background: '#f8fafc', padding: '120px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-section-header">
                        <h2>The Mirrox Edge</h2>
                        <p style={{ marginTop: '16px', color: '#94a3b8', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}>Seamless performance across all financial markets</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginTop: '64px' }}>
                        {/* Effortless Trading */}
                        <div style={{ padding: '48px', background: 'white', borderRadius: '40px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                             <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a', marginBottom: '32px', textTransform: 'uppercase' }}>Effortless Trading</h3>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {["Intuitive UI", "One-Click Execution", "Seamless Navigation", "Customizable View"].map((f,i)=>(
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--pub-red)' }} /> {f}
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* Regulated & Secure */}
                        <div style={{ padding: '48px', background: 'white', borderRadius: '40px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                             <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a', marginBottom: '32px', textTransform: 'uppercase' }}>Regulated & Secure</h3>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {["MWALI Regulation", "Segregated Funds", "256-bit Encryption", "SAS 70 Data Center"].map((f,i)=>(
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--pub-red)' }} /> {f}
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* Dedicated Support */}
                        <div style={{ padding: '48px', background: 'white', borderRadius: '40px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                             <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a', marginBottom: '32px', textTransform: 'uppercase' }}>Dedicated Support</h3>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {["24/7 Availability", "Multilingual Team", "Personal Manager", "Expert Analysis"].map((f,i)=>(
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--pub-red)' }} /> {f}
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2 style={{ textAlign: 'center' }}>Join Mirrox and Start Trading</h2>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Start Now</button>
                </div>
            </section>

             <footer style={{ textAlign: 'center', paddingBottom: '64px' }}>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    DISCLAIMER: CFD TRADING INVOLVES SIGNIFICANT RISK TO YOUR CAPITAL.
                </p>
            </footer>
        </div>
    );
};

export default CfdExpiries;
