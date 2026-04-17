import React, { useState } from 'react';
import { Plus, Minus, ArrowRight, UserPlus, Wallet, PlayCircle } from 'lucide-react';

const FAQ_DATA = {
    "Account Details": [
        { q: "How do I register for an account with Mirrox?", a: "To sign up with Mirrox, complete the registration form with your personal information. Your details will be securely stored and kept confidential." },
        { q: "What is the cost of opening an account with Mirrox?", a: "Opening an account with Mirrox is free of charge." },
        { q: "How do I verify My Mirrox trading account?", a: "To verify your Mirrox trading account, you need to submit: Valid Proof of ID (passport, ID card, or driver’s license) and a clear selfie, and Valid Proof of Residence (utility bill or bank statement issued within the last six months)." },
        { q: "How can I log in to My account?", a: "Click on the “Login” button at the top right of the Mirrox website and enter your username and password to access your account." },
        { q: "When can I start trading?", a: "You can start trading once your account is verified and you have deposited funds." }
    ],
    "Trading Accounts": [
        { q: "What types of trading accounts does Mirrox offer?", a: "Mirrox offers five different account types to suit various trading needs. Details are available on the Account Types page of our website." },
        { q: "What is the maximum leverage available at Mirrox?", a: "The maximum leverage available at Mirrox is 1:400 across all account types." },
        { q: "Does Mirrox offer a demo account?", a: "Yes, Mirrox offers a demo trading account with a virtual balance of 100,000 USD to practice trading in a risk-free environment." },
        { q: "Is My personal information secure with Mirrox?", a: "Mirrox uses advanced security technologies, including 128-bit SSL encryption, to protect your personal information." }
    ],
    "Deposits": [
        { q: "What is the minimum deposit amount?", a: "The minimum deposit is 250 USD or equivalent in other currencies." },
        { q: "How can I deposit funds into My account?", a: "You can deposit funds via credit/debit cards, wire transfers, and various alternative payment methods." },
        { q: "Does Mirrox charge any deposit fees?", a: "Mirrox does not charge any deposit fees. However, your payment provider may apply processing fees or exchange rate adjustments." }
    ],
    "Withdrawals": [
        { q: "How do I request a withdrawal?", a: "To request a withdrawal, log in to your account, go to the 'Withdrawal' section, enter the amount, and submit the request." },
        { q: "What is the minimum withdrawal amount?", a: "The minimum withdrawal amount is 10 USD for credit cards and 100 USD for wire transfers." },
        { q: "How long does it take to process a withdrawal?", a: "Withdrawals typically take 8 to 10 business days, depending on your bank’s processing time." }
    ],
    "Fees": [
        { q: "Are there any withdrawal fees?", a: "Withdrawal fees may apply depending on the method and circumstances. Refer to our General Fees for detailed information." },
        { q: "Is there an inactivity fee?", a: "Yes, a maintenance fee of 10 USD is charged monthly. Additional inactivity fees apply if the account remains unused for over a month." }
    ],
    "Legal & Compliance": [
        { q: "Is Mirrox a regulated broker?", a: "Yes, Mirrox is regulated by the Mwali International Services Authority (MISA). Our license number is BFX2024064." },
        { q: "Are My funds protected?", a: "Yes, client funds are held in segregated accounts to protect your investments." },
        { q: "What is the minimum age to trade with Mirrox?", a: "You must be at least 18 years old to open an account and trade with Mirrox." }
    ],
    "Trading": [
        { q: "Is negative balance protection provided?", a: "Yes, negative balance protection is provided to prevent you from losing more than your initial investment." },
        { q: "Can I trade on weekends?", a: "Major financial markets are closed on weekends, but Cryptocurrency trading remains available 24/7." },
        { q: "What is a pip?", a: "A pip (percentage in point) is the smallest price change in the value of a currency pair." }
    ],
    "General": [
        { q: "How can I contact customer support?", a: "Contact our support team via email, phone, or live chat for immediate assistance." },
        { q: "Do you provide educational resources for beginners?", a: "Yes, we provide extensive resources, including an Education Center, to help beginners get started." }
    ]
};

const Faq = () => {
    const [activeTab, setActiveTab] = useState("Account Details");
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1>Mirrox <span style={{ color: 'var(--pub-red)' }}>Help Center</span></h1>
                    <p style={{ margin: '0 auto', maxWidth: '800px' }}>
                        All the information you need to master your trading experience in one place.
                    </p>
                </div>
                
                {/* Horizontal Tabs Area */}
                <div style={{ marginTop: '64px', maxWidth: '1200px', margin: '64px auto 0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }} className="no-scrollbar">
                        {Object.keys(FAQ_DATA).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setOpenIndex(0); }}
                                style={{ 
                                    padding: '12px 24px', 
                                    borderRadius: '16px', 
                                    fontSize: '12px', 
                                    fontWeight: '900', 
                                    textTransform: 'uppercase', 
                                    whiteSpace: 'nowrap', 
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    background: activeTab === tab ? 'white' : 'transparent',
                                    color: activeTab === tab ? 'var(--pub-red)' : 'white'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: '80px' }}>
                {/* ACCORDION SECTION */}
                <section style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '48px', color: '#1a1a1a', textAlign: 'center' }}>
                        {activeTab}
                    </h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {FAQ_DATA[activeTab].map((item, idx) => (
                            <div 
                                key={idx} 
                                style={{ 
                                    borderRadius: '24px', 
                                    border: openIndex === idx ? '1px solid var(--pub-red)' : '1px solid #e2e8f0',
                                    background: 'white',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <button 
                                    onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                    style={{ 
                                        width: '100%', 
                                        textAlign: 'left', 
                                        padding: '24px 32px', 
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
                                        color: openIndex === idx ? 'var(--pub-red)' : '#1a1a1a'
                                    }}>
                                        {item.q}
                                    </span>
                                    <div style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        background: openIndex === idx ? 'var(--pub-red)' : '#f8fafc',
                                        color: openIndex === idx ? 'white' : '#94a3b8',
                                        borderRadius: '100px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s'
                                    }}>
                                        {openIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                                    </div>
                                </button>
                                
                                {openIndex === idx && (
                                    <div style={{ padding: '0 32px 32px 32px', color: 'var(--pub-text-muted)', fontSize: '16px', lineHeight: '1.6' }}>
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* HAVE MORE QUESTIONS SECTION */}
                <section>
                    <div style={{ background: 'var(--pub-red)', borderRadius: '48px', padding: '80px', display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1.1', marginBottom: '24px' }}>Have More Questions?</h2>
                            <p style={{ opacity: 0.8, fontSize: '18px', maxWidth: '600px', margin: '0 auto 48px auto' }}>Our support team is available 24/5. Get in touch with us anytime for dedicated assistance.</p>
                            <button className="lp-cta-white" style={{ padding: '20px 48px' }}>Get In Touch</button>
                        </div>
                        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '100%' }}></div>
                    </div>
                </section>

                {/* 3 EASY STEPS */}
                <section style={{ background: '#f8fafc', padding: '80px 48px', borderRadius: '48px', border: '1px solid #e2e8f0' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2>Open Account in 3 Steps</h2>
                        <p style={{ marginTop: '16px', color: '#94a3b8', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}>Join the Mirrox community today</p>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
                        {[
                            { s: "1", t: "Sign Up", d: "Fill out the registration form and submit verification documents." },
                            { s: "2", t: "Deposit", d: "Choose your payment method and fund your trading account." },
                            { s: "3", t: "Trade", d: "Begin your journey and explore endless financial opportunities." }
                        ].map((item, i)=>(
                            <div key={i} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '100px', background: 'white', color: 'var(--pub-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>{item.s}</div>
                                <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase' }}>{item.t}</h3>
                                <p style={{ color: 'var(--pub-text-muted)', lineHeight: '1.6' }}>{item.d}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* FINALE CTA */}
            <section className="lp-cta-block">
                <h2 style={{ textAlign: 'center' }}>Join Mirrox and Start Trading</h2>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="lp-cta-white">Get Started Now</button>
                </div>
            </section>
        </div>
    );
};

export default Faq;
