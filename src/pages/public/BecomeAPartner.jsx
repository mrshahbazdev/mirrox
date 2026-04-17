import React from 'react';
import { 
    Users, Briefcase, BarChart, Rocket, DollarSign, 
    Gift, Headphones, ShieldCheck, ArrowRight, UserPlus
} from 'lucide-react';

const BecomeAPartner = () => {
    const navigate = (path) => { window.location.href = path; };

    const partnershipBenefits = [
        { icon: <ShieldCheck size={32} />, title: "Regulated Broker", desc: "Partner with a licensed and trusted global entity." },
        { icon: <Gift size={32} />, title: "Custom Promotions", desc: "Access high-converting creative materials for your audience." },
        { icon: <BarChart size={32} />, title: "Advanced Analytics", desc: "Real-time tracking of your referrals and earnings." },
        { icon: <Headphones size={32} />, title: "24/7 PM Support", desc: "Dedicated managers to help grow your network." }
    ];

    const plans = [
        {
            name: "Conversion Program",
            focus: "Performance Based",
            desc: "Earn fixed commissions for every verified trader you refer to Mirrox.",
            features: ["Tiered CPA structure", "Instant payouts", "Marketing kits"],
            cta: "Get Started"
        },
        {
            name: "Valued Partner",
            focus: "Volume Based",
            desc: "Customized rewards for high-volume partners and specialized affiliates.",
            features: ["Custom revenue sharing", "White-label options", "VIP support"],
            cta: "Contact Manager"
        }
    ];

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-5xl mx-auto space-y-8">
                    <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255,77,94,0.1)', color: 'var(--pub-red)', borderRadius: '100px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px' }}>Growth Opportunities</div>
                    <h1>Partner with the Best in <span style={{ color: 'var(--pub-red)' }}>Trading</span></h1>
                    <p style={{ maxWidth: '800px', margin: '0 auto', opacity: 0.8 }}>
                        The Mirrox Affiliate Program offers a unique opportunity to expand your network, boost your revenue, and reach your financial goals.
                    </p>
                    <div style={{ marginTop: '40px' }}>
                        <button className="lp-btn-primary" style={{ padding: '20px 48px' }} onClick={() => navigate('/register')}>Join Program <UserPlus size={18} /></button>
                    </div>
                </div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: '120px' }}>
                {/* --- WHY PARTNER --- */}
                <section>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>Why Partner with Mirrox?</h2>
                        <p style={{ marginTop: '16px', color: '#94a3b8', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}>Join an ecosystem designed for success</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                        {partnershipBenefits.map((item, i) => (
                            <div key={i} style={{ padding: '48px', background: 'white', borderRadius: '40px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '24px', transition: 'all 0.3s' }}>
                                <div style={{ width: '64px', height: '64px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase' }}>{item.title}</h3>
                                <p style={{ color: 'var(--pub-text-muted)', lineHeight: '1.6', fontSize: '14px' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- PLANS SECTION --- */}
                <section style={{ background: '#f8fafc', padding: '80px 48px', borderRadius: '64px', border: '1px solid #e2e8f0' }}>
                    <div className="lp-section-header" style={{ marginBottom: '64px' }}>
                        <h2>Flexible Earnings</h2>
                        <p style={{ marginTop: '16px', color: '#94a3b8', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}>Choose your path to professional success</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                        {plans.map((plan, i) => (
                            <div key={i} style={{ padding: '64px', background: 'white', borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ color: 'var(--pub-red)' }}><Briefcase size={40} /></div>
                                    <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{plan.name}</h3>
                                    <div style={{ display: 'inline-block', padding: '6px 12px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', width: 'fit-content' }}>{plan.focus}</div>
                                </div>
                                <p style={{ color: 'var(--pub-text-muted)', fontSize: '16px', lineHeight: '1.6' }}>{plan.desc}</p>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {plan.features.map((f, j) => (
                                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8' }}>
                                            <Rocket size={16} style={{ color: 'var(--pub-red)' }} /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className="lp-btn-primary" style={{ width: '100%', marginTop: 'auto' }}>{plan.cta}</button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- MARKETING SECTION --- */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side">
                        <div style={{ display: 'inline-block', padding: '6px 16px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '100px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px' }}>Marketing Simplicity</div>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>Everything to Succeed</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
                            Promoting Mirrox is easier with our professional marketing resources. Access banners, email templates, and creative assets designed to engage.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {["Banners", "Landings", "Email Swipe", "Creative"].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1a1a1a', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}>
                                    <DollarSign size={18} style={{ color: 'var(--pub-red)' }} /> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ background: '#0b0e14', borderRadius: '48px', padding: '64px', position: 'relative', overflow: 'hidden' }}>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', opacity: 0.2 }}>
                            <div style={{ height: '160px', background: 'white', borderRadius: '24px' }}></div>
                            <div style={{ height: '160px', background: 'var(--pub-red)', borderRadius: '24px' }}></div>
                            <div style={{ height: '160px', background: 'white', borderRadius: '24px' }}></div>
                            <div style={{ height: '160px', background: 'white', borderRadius: '24px' }}></div>
                         </div>
                         <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                            <h4 style={{ color: 'white', fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px' }}>Creative Hub</h4>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Access Full Suite</p>
                         </div>
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA FORM --- */}
            <section style={{ background: 'var(--pub-red)', padding: '120px 24px', textAlign: 'center', color: 'white' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1', marginBottom: '24px' }}>Ready to Become<br/>a Partner?</h2>
                    <p style={{ opacity: 0.8, fontSize: '18px', marginBottom: '64px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your dedicated manager is waiting to assist you.</p>
                    
                    <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '64px', borderRadius: '48px', textAlign: 'left', color: '#1a1a1a', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Full Name</label>
                                <input type="text" style={{ padding: '16px 24px', background: '#f8fafc', border: 'none', borderRadius: '16px', outline: 'none' }} placeholder="John Doe" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Work Email</label>
                                <input type="email" style={{ padding: '16px 24px', background: '#f8fafc', border: 'none', borderRadius: '16px', outline: 'none' }} placeholder="john@company.com" />
                            </div>
                            <button className="lp-btn-primary" style={{ width: '100%', padding: '20px' }}>Submit Application</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BecomeAPartner;
