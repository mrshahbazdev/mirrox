import React, { useState } from 'react';
import { 
    Plus, Minus, ArrowRight, UserPlus, Wallet, PlayCircle,
    Search, HelpCircle, MessageSquare, ShieldCheck, Zap
} from 'lucide-react';

const FAQ_DATA = {
    "Account Details": [
        { q: "How do I register for an account with Bullvera?", a: "To sign up with Bullvera, complete the simplified registration form with your institutional or personal details. Your identity is protected by 256-bit encryption throughout the process." },
        { q: "What is the cost of opening an account with Bullvera?", a: "Account initialization with Bullvera is free of charge, providing immediate access to our global liquidity network." },
        { q: "How do I verify My Bullvera trading account?", a: "To verify your account, submit a valid Government-issued ID and a Proof of Residence (utility bill or bank statement) via our secure document portal." },
        { q: "How can I log in to My account?", a: "Access the 'Login' gateway at the top right of the terminal and authenticate using your secure credentials." },
        { q: "When can I start trading?", a: "You can execute initial trades immediately following account verification and successful capitalization." }
    ],
    "Trading Accounts": [
        { q: "What types of trading accounts does Bullvera offer?", a: "Bullvera offers five distinct account tiers—from Classic to VIP—tailored to various levels of market expertise and volume requirements." },
        { q: "What is the maximum leverage available at Bullvera?", a: "We provide institutional-grade leverage of up to 1:400 across all verified account types." },
        { q: "Does Bullvera offer a demo account?", a: "Yes, we provide an elite practice environment with a 100,000 USD virtual balance to refine institutional strategies." },
        { q: "Is My personal information secure with Bullvera?", a: "Bullvera utilizes multi-layered security protocols, including SSL encryption and segregated data silos, to protect client integrity." }
    ],
    "Deposits": [
        { q: "What is the minimum deposit amount?", a: "The standard initialization deposit is 250 USD or currency equivalent." },
        { q: "How can I deposit funds into My account?", a: "Capitalization is available via global credit/debit networks, institutional wire transfers, and verified e-gateways." },
        { q: "Does Bullvera charge any deposit fees?", a: "Bullvera does not apply capitalization fees. Please note that external payment providers may apply independent processing margins." }
    ],
    "Withdrawals": [
        { q: "How do I request a withdrawal?", a: "Initiate a disbursement request via the 'Financial Operations' section of your secure terminal." },
        { q: "What is the minimum withdrawal amount?", a: "Minimum disbursement is 10 USD for card networks and 100 USD for institutional wire transfers." },
        { q: "How long does it take to process a withdrawal?", a: "Standard processing time is 8 to 10 business days, optimized for global security and compliance checks." }
    ],
    "Fees": [
        { q: "Are there any withdrawal fees?", a: "Disbursement fees may apply depending on the method and volume. Detailed structures are available in our General Fees schedule." },
        { q: "Is there an inactivity fee?", a: "A nominal maintenance fee of 10 USD is applied to accounts that remain dormant without active trades for over 30 days." }
    ],
    "Legal & Compliance": [
        { q: "Is Bullvera a regulated broker?", a: "Yes, Bullvera is regulated by the Mwali International Services Authority (MISA). License: BFX2024064." },
        { q: "Are My funds protected?", a: "Client capital is held in strictly segregated institutional accounts, ensuring total fund sovereignty." },
        { q: "What is the minimum age to trade with Bullvera?", a: "All account holders must be 18 years of age or older to satisfy global compliance standards." }
    ],
    "Trading": [
        { q: "Is negative balance protection provided?", a: "Yes, institutional-grade negative balance protection is a standard feature on all Bullvera accounts." },
        { q: "Can I trade on weekends?", a: "While traditional markets close, Cryptocurrency execution remains available 24/7 on the Bullvera terminal." },
        { q: "What is a pip?", a: "A pip (Percentage in Point) is the standardized unit of price movement in financial asset evaluation." }
    ],
    "General": [
        { q: "How can I contact customer support?", a: "Reach our Elite Support Network via live chat, secure email, or direct priority phone access." },
        { q: "Do you provide educational resources for beginners?", a: "Yes, we provide an extensive Knowledge Base and Institutional Training Center for all account tiers." }
    ]
};

const Faq = () => {
    const [activeTab, setActiveTab] = useState("Account Details");
    const [openIndex, setOpenIndex] = useState(0);
    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '160px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>
                        <HelpCircle size={14} style={{ color: 'var(--pub-red)' }} /> Knowledge Repository
                    </div>
                    <h1 style={{ fontSize: 'clamp(48px, 9vw, 90px)', lineHeight: '0.9', marginBottom: '32px' }}>
                        Bullvera <span style={{ color: 'var(--pub-red)' }}>Help Center</span>
                    </h1>
                    <p style={{ margin: '0 auto', fontSize: '20px', maxWidth: '750px', color: '#94a3b8', lineHeight: '1.6' }}>
                        The centralized nexus for all institutional inquiries and platform expertise.
                    </p>
                </div>
                
                {/* Horizontal Navigation Area */}
                <div style={{ marginTop: '80px', maxWidth: '1200px', margin: '80px auto 0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', scrollbarWidth: 'none' }} className="no-scrollbar">
                        {Object.keys(FAQ_DATA).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setOpenIndex(0); }}
                                style={{ 
                                    padding: '16px 32px', 
                                    borderRadius: '20px', 
                                    fontSize: '11px', 
                                    fontWeight: '900', 
                                    textTransform: 'uppercase', 
                                    whiteSpace: 'nowrap', 
                                    border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    background: activeTab === tab ? 'white' : 'transparent',
                                    color: activeTab === tab ? 'var(--pub-red)' : '#94a3b8',
                                    letterSpacing: '0.1em'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '120px', padding: '120px 24px' }}>
                {/* ACCORDION SECTION */}
                <section style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <h2 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--pub-red)', marginBottom: '16px' }}>Category Results</h2>
                        <h3 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '900', color: '#111', textTransform: 'uppercase', letterSpacing: '-1px' }}>{activeTab}</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {FAQ_DATA[activeTab].map((item, idx) => (
                            <div 
                                key={idx} 
                                style={{ 
                                    borderRadius: '32px', 
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    boxShadow: openIndex === idx ? '0 30px 60px rgba(0,0,0,0.08)' : '0 10px 30px rgba(0,0,0,0.02)'
                                }}
                            >
                                <button 
                                    onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                    style={{ 
                                        width: '100%', 
                                        textAlign: 'left', 
                                        padding: '32px 40px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between', 
                                        background: 'none', 
                                        border: 'none', 
                                        cursor: 'pointer' 
                                    }}
                                >
                                    <span style={{ 
                                        fontSize: '18px', 
                                        fontWeight: '900', 
                                        textTransform: 'uppercase', 
                                        transition: 'color 0.3s',
                                        color: openIndex === idx ? 'var(--pub-red)' : '#111',
                                        letterSpacing: '-0.5px'
                                    }}>
                                        {item.q}
                                    </span>
                                    <div style={{ 
                                        width: '48px', 
                                        height: '48px', 
                                        background: openIndex === idx ? 'var(--pub-red)' : '#f8fafc',
                                        color: openIndex === idx ? 'white' : '#111',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0)'
                                    }}>
                                        {openIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                                    </div>
                                </button>
                                
                                {openIndex === idx && (
                                    <div style={{ padding: '0 40px 40px 40px', color: '#64748b', fontSize: '16px', lineHeight: '1.8', animation: 'fadeIn 0.5s ease out' }}>
                                        <div style={{ height: '1px', background: '#f1f5f9', marginBottom: '32px' }}></div>
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* SEARCH CTA */}
                <section>
                    <div style={{ background: '#0b0e14', borderRadius: '64px', padding: '100px 80px', display: 'flex', flexDirection: 'column', gap: '40px', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'var(--pub-red)', opacity: 0.1, filter: 'blur(100px)', borderRadius: '100%' }}></div>
                        
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <div style={{ width: '80px', height: '80px', background: 'var(--pub-red)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 40px auto' }}>
                                <MessageSquare size={40} />
                            </div>
                            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1.1', marginBottom: '32px', letterSpacing: '-2px' }}>Still Have <span style={{ color: 'var(--pub-red)' }}>Questions</span>?</h2>
                            <p style={{ opacity: 0.6, fontSize: '20px', maxWidth: '650px', margin: '0 auto 64px auto', lineHeight: '1.6' }}>Our elite support nodes are synchronized 24/5 to provide immediate resolution for any inquiries.</p>
                            <button className="lp-btn-primary" style={{ padding: '24px 80px', background: 'white', color: 'var(--pub-red)' }} onClick={() => navigate('/contact-us')}>Open Dynamic Ticket</button>
                        </div>
                    </div>
                </section>

                {/* 3 EASY STEPS */}
                <section style={{ background: '#f8fafc', padding: '100px 64px', borderRadius: '64px', border: '1px solid #e2e8f0' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#94a3b8', marginBottom: '16px' }}>Onboarding Protocol</h2>
                        <h3 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '900', color: '#111', textTransform: 'uppercase', letterSpacing: '-1px' }}>Institutional Deployment in <span style={{ color: 'var(--pub-red)' }}>3 Steps</span></h3>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '64px' }}>
                        {[
                            { s: "01", t: "Registration", d: "Complete our institutional-grade secure onboarding form." },
                            { s: "02", t: "Capitalization", d: "Deploy your initial trade capital via our verified global gateways." },
                            { s: "03", t: "Execution", d: "Launch your terminal and begin executing across 160+ assets." }
                        ].map((item, i)=>(
                            <div key={i} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ fontSize: '80px', fontWeight: '900', color: 'var(--pub-red)', opacity: 0.1, fontStyle: 'italic', lineHeight: '1', marginBottom: '-40px' }}>{item.s}</div>
                                <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#111', textTransform: 'uppercase', letterSpacing: '-1px', position: 'relative' }}>{item.t}</h3>
                                <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '15px' }}>{item.d}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* FINAL CTA */}
            <section className="lp-cta-block">
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h2 style={{ textTransform: 'uppercase' }}>Initialize Your <span style={{ color: 'var(--pub-red)' }}>Trading Node</span> Today</h2>
                    <p style={{ marginTop: '24px', color: 'var(--pub-text-muted)', fontSize: '18px' }}>Join the global benchmark for institutional trading.</p>
                    <div style={{ marginTop: '64px' }}>
                        <button className="lp-btn-primary" style={{ padding: '24px 80px', background: 'white', color: 'var(--pub-red)' }} onClick={() => navigate('/register')}>Launch Terminal</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Faq;
