import React from 'react';
import { 
    CheckCircle2, ArrowRight, Shield, Zap, TrendingUp, 
    Globe, Wallet, BadgeCheck, Users, Headphones, Check
} from 'lucide-react';

const TradingAccounts = () => {
    const tableData = [
        { label: "Base currency", values: ["USD", "USD", "USD", "USD", "USD"] },
        { label: "CFDs", values: ["160+", "160+", "160+", "160+", "160+"] },
        { label: "Margin Call", values: ["100%", "100%", "100%", "100%", "100%"] },
        { label: "Stop out", values: ["35%", "35%", "35%", "35%", "35%"] },
        { label: "Swap Discount", values: ["Basic", "Medium", "High", "Variable", "Variable"] },
        { label: "Free Support", values: [true, true, true, true, true] },
        { label: "Free Education", values: [true, true, true, true, true] },
        { label: "Spread Starting From", values: ["3.8", "2.8", "1.8", "1.4", "0.0"] },
        { label: "Improved Spread Promotion", values: [true, true, true, true, true] },
    ];

    const accountNames = ["Classic", "Silver", "Gold", "Platinum", "VIP"];
    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>Trade <span style={{ color: 'var(--pub-red)' }}>Elite</span> Accounts</h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '750px' }}>
                        Precision tools for every level of expertise. Choose the tier that aligns with your institutional goals.
                    </p>
                </div>
            </section>

            {/* COMPARISON TABLE */}
            <section style={{ padding: '160px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Account <span style={{ color: 'var(--pub-red)' }}>Specifications</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>

                    <div className="lp-table-wrapper" style={{ borderRadius: '48px', boxShadow: '0 40px 100px rgba(0,0,0,0.06)', background: 'white', padding: '32px', border: '1px solid #e2e8f0' }}>
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '250px', padding: '24px' }}>Benchmark Features</th>
                                    {accountNames.map((name, i) => (
                                        <th key={i} style={{ textAlign: 'center', padding: '24px', color: '#111', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, idx) => (
                                    <tr key={idx}>
                                        <td style={{ fontWeight: '900', color: '#475569', textTransform: 'uppercase', fontSize: '11px', padding: '24px', letterSpacing: '0.05em' }}>{row.label}</td>
                                        {row.values.map((val, i) => (
                                            <td key={i} style={{ textAlign: 'center', fontWeight: '900', color: '#111', padding: '24px' }}>
                                                {typeof val === 'boolean' ? (
                                                    <BadgeCheck size={22} style={{ color: '#10b981', margin: '0 auto' }} />
                                                ) : val}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* PROMOTIONAL GRID */}
            <section style={{ padding: '0 24px 160px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', background: '#0b0e14', borderRadius: '64px', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ padding: '100px 80px' }}>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: 'white', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Institutional <span style={{ color: 'var(--pub-red)' }}>Grade</span></h2>
                        <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: '1.7', marginBottom: '48px' }}>
                            Scale your trading operations with tailored financial structures and elite-tier support.
                        </p>
                        <button className="lp-btn-primary" onClick={() => navigate('/register')}>Apply for VIP</button>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <div style={{ background: 'white', padding: '48px', borderRadius: '48px', width: '100%', maxWidth: '440px', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}>
                             <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                                 <div style={{ padding: '8px 20px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', borderRadius: '100px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>Platinum Tier</div>
                                 <div style={{ padding: '8px 20px', background: '#f8fafc', color: '#94a3b8', borderRadius: '100px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>Institutional</div>
                             </div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                 {[
                                     {l: "Execution Speed", v: "< 30ms"},
                                     {l: "Swap Coverage", v: "Premium"},
                                     {l: "Account Manager", v: "Dedicated"},
                                     {l: "Signal Access", v: "Priority"}
                                 ].map((item, i) => (
                                     <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                                         <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase' }}>{item.l}</span>
                                         <span style={{ fontSize: '14px', color: '#111', fontWeight: '900' }}>{item.v}</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* 3 STEPS GUIDE */}
            <section style={{ padding: '0 24px 160px 24px', textAlign: 'center' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div className="lp-section-header" style={{ marginBottom: '100px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Seamless <span style={{ color: 'var(--pub-red)' }}>Integration</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px' }}>
                        {[
                            { title: "Registration", desc: "Complete our institutional-grade onboarding and secure verification." },
                            { title: "Capitalization", desc: "Fund your account via our globally distributed gateway nodes." },
                            { title: "Operation", desc: "Deploy your strategies across 160+ live financial instruments." }
                        ].map((step, i) => (
                            <div key={i} style={{ padding: '56px 40px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '48px', transition: 'transform 0.3s ease' }}>
                                <div style={{ width: '80px', height: '80px', background: 'var(--pub-red-soft)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px auto', fontSize: '28px', fontWeight: '900', color: 'var(--pub-red)' }}>
                                    0{i + 1}
                                </div>
                                <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#111', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{step.title}</h3>
                                <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '15px', fontWeight: '500' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '80px' }}>
                        <button className="lp-btn-primary" style={{ padding: '20px 48px' }} onClick={() => navigate('/register')}>Launch Account</button>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="lp-cta-block" style={{ marginBottom: '120px' }}>
                <h2>Ready to Access Global Markets?</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Get Started Now</button>
                </div>
            </section>
        </div>
    );
};

export default TradingAccounts;
