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

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1>Mirrox Trading Accounts</h1>
                    <p>
                        Your Trading Journey Begins Here
                    </p>
                </div>
            </section>

            {/* --- COMPARISON TABLE --- */}
            <section style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-table-wrapper">
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '250px' }}>Account Features</th>
                                    {accountNames.map((name, i) => (
                                        <th key={i} style={{ textAlign: 'center' }}>{name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, idx) => (
                                    <tr key={idx}>
                                        <td style={{ fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase', fontSize: '12px' }}>{row.label}</td>
                                        {row.values.map((val, i) => (
                                            <td key={i} style={{ textAlign: 'center', fontWeight: '800', color: 'var(--pub-red)' }}>
                                                {typeof val === 'boolean' ? (
                                                    <Check size={20} style={{ color: '#22c55e', margin: '0 auto' }} />
                                                ) : val}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '48px' }}>
                        {accountNames.map((name, i) => (
                            <button key={i} style={{ padding: '16px', border: '2px solid #fee2e2', borderRadius: '12px', background: 'transparent', color: '#94a3b8', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}>
                                Open {name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PROMOTIONAL BLOCK --- */}
            <section style={{ padding: '0 24px 120px 24px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', background: 'var(--pub-red)', borderRadius: '48px', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    <div style={{ padding: '80px 64px' }}>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: 'white', lineHeight: '1.2', marginBottom: '24px', textTransform: 'uppercase' }}>Find Your Perfect Trading Account</h2>
                        <p style={{ color: '#fed7aa', fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
                            Make your accounts today and take advantage of our tailored features and professional support.
                        </p>
                        <button className="lp-cta-white">Contact Us</button>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.05)', padding: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <div style={{ background: 'white', padding: '40px', borderRadius: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }}>
                             <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                                 <div style={{ padding: '6px 16px', background: '#fee2e2', color: 'var(--pub-red)', borderRadius: '8px', fontSize: '10px', fontWeight: '900' }}>Classic</div>
                                 <div style={{ padding: '6px 16px', background: '#f8fafc', color: '#94a3b8', borderRadius: '8px', fontSize: '10px', fontWeight: '900' }}>Silver</div>
                             </div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                 {[
                                     {l: "Base Currency", v: "USD"},
                                     {l: "Improved Spreads", v: "Yes"},
                                     {l: "Swap Discount", v: "Medium"},
                                     {l: "Stop Out", v: "35%"}
                                 ].map((item, i) => (
                                     <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                                         <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase' }}>{item.l}</span>
                                         <span style={{ fontSize: '12px', color: '#1a1a1a', fontWeight: '900' }}>{item.v}</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* --- 3 EASY STEPS --- */}
            <section style={{ padding: '0 24px 120px 24px', textAlign: 'center' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div className="lp-section-header">
                        <h2>Open Your Account in 3 Easy Steps</h2>
                        <p style={{ marginTop: '16px', color: '#94a3b8', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}>Get started with Mirrox today!</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', marginTop: '64px' }}>
                        {[
                            { title: "Sign Up", desc: "Fill out the registration form and submit verification documents." },
                            { title: "Make a Deposit", desc: "Choose your payment method and fund your account." },
                            { title: "Start Trading", desc: "Begin your trading journey and explore endless opportunities." }
                        ].map((step, i) => (
                            <div key={i} style={{ padding: '40px', background: 'white', border: '1px solid #f1f5f9', borderRadius: '32px' }}>
                                <div style={{ width: '64px', height: '64px', background: '#fff1f2', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', fontSize: '24px', fontWeight: '900', color: 'var(--pub-red)' }}>
                                    {i + 1}
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a1a', marginBottom: '16px', textTransform: 'uppercase' }}>{step.title}</h3>
                                <p style={{ color: 'var(--pub-text-muted)', lineHeight: '1.6', fontSize: '14px' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '64px' }}>
                        <button className="lp-btn-primary">Open Account</button>
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
        </div>
    );
};

export default TradingAccounts;
