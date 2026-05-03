import React from 'react';
import { 
    Users, Briefcase, BarChart, Rocket, DollarSign, 
    Gift, Headphones, ShieldCheck, ArrowRight, UserPlus,
    CheckCircle2, Globe, TrendingUp, Zap
} from 'lucide-react';

const BecomeAPartner = () => {
    const navigate = (path) => { window.location.href = path; };

    const partnershipBenefits = [
        { icon: <ShieldCheck size={32} />, title: "Regulated Broker", desc: "Partner with a licensed and trusted global entity recognized for excellence." },
        { icon: <Gift size={32} />, title: "Custom Promotions", desc: "Access high-converting creative materials and tailored marketing funnels." },
        { icon: <BarChart size={32} />, title: "Advanced Analytics", desc: "Real-time tracking of your referrals and earnings with granular reporting." },
        { icon: <Headphones size={32} />, title: "24/7 Support", desc: "Dedicated partner managers to help optimize your growth strategy." }
    ];

    const plans = [
        {
            name: "Conversion Program",
            focus: "Performance Based",
            desc: "Earn high-ticket fixed commissions for every verified institutional trader you refer.",
            features: ["Tiered CPA structure", "Instant monthly payouts", "Premium marketing kits"],
            cta: "Get Started Now"
        },
        {
            name: "Valued Partner",
            focus: "Volume Based",
            desc: "Customized rewards for high-volume partners and specialized financial affiliates.",
            features: ["Custom revenue sharing", "White-label options", "Priority VIP support"],
            cta: "Contact Manager"
        }
    ];

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero" style={{ padding: '160px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>
                        <Globe size={14} style={{ color: 'var(--pub-red)' }} /> Global Affiliate Network
                    </div>
                    <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', lineHeight: '0.9', marginBottom: '32px' }}>
                        Partner with the <br/> <span style={{ color: 'var(--pub-red)' }}>Best in Trading</span>
                    </h1>
                    <p style={{ margin: '0 auto', fontSize: '20px', maxWidth: '750px', color: '#94a3b8', lineHeight: '1.6' }}>
                        The Bullvera Affiliate Program offers a elite opportunity to expand your network, boost your revenue, and scale your financial goals.
                    </p>
                    <div style={{ marginTop: '48px' }}>
                        <button className="lp-btn-primary" style={{ padding: '24px 64px' }} onClick={() => navigate('/register')}>Join Program <UserPlus size={18} style={{ marginLeft: '12px' }}/></button>
                    </div>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px', padding: '0 24px 160px 24px' }}>
                {/* --- WHY PARTNER --- */}
                <section>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Why Partner with <span style={{ color: 'var(--pub-red)' }}>Bullvera</span>?</h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>
                    <div className="lp-grid">
                        {partnershipBenefits.map((item, i) => (
                            <div key={i} className="lp-card">
                                <div className="lp-icon-box" style={{ marginBottom: '32px' }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#111', marginBottom: '16px', textTransform: 'uppercase' }}>{item.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- PLANS SECTION --- */}
                <section style={{ background: '#f8fafc', padding: '100px 64px', borderRadius: '64px', border: '1px solid #e2e8f0' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Elite <span style={{ color: 'var(--pub-red)' }}>Earnings</span></h2>
                        <p style={{ marginTop: '24px', color: '#94a3b8', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Tailored Compensation Models</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
                        {plans.map((plan, i) => (
                            <div key={i} style={{ padding: '64px', background: 'white', borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '40px', transition: 'transform 0.3s ease' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ color: 'var(--pub-red)', marginBottom: '12px' }}><Briefcase size={48} /></div>
                                    <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#111', textTransform: 'uppercase', letterSpacing: '-1.5px', lineHeight: '1' }}>{plan.name}</h3>
                                    <div style={{ display: 'inline-block', padding: '8px 16px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', borderRadius: '100px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', width: 'fit-content' }}>{plan.focus}</div>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.7' }}>{plan.desc}</p>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {plan.features.map((f, j) => (
                                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#111' }}>
                                            <div style={{ width: '20px', height: '20px', background: 'var(--pub-red-soft)', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pub-red)' }}>
                                                <Rocket size={12} />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className="lp-btn-primary" style={{ width: '100%', marginTop: '24px' }} onClick={() => navigate('/register')}>{plan.cta}</button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- MARKETING SECTION --- */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '100px', alignItems: 'center' }}>
                    <div className="lp-content-side">
                        <div style={{ display: 'inline-block', padding: '8px 20px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', borderRadius: '100px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '32px', letterSpacing: '0.1em' }}>Strategic Advantage</div>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Professional <span style={{ color: 'var(--pub-red)' }}>Assets</span></h2>
                        <p style={{ color: '#64748b', fontSize: '18px', lineHeight: '1.8', marginBottom: '40px' }}>
                            Accelerate your performance with our institutional marketing suite. Access high-resolution creative assets and real-time tracking dashboards.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            {["Global Banners", "Landing Pages", "Email Funnels", "Social Creative", "API Solutions", "White Labels"].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#111', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <Zap size={18} style={{ color: 'var(--pub-red)' }} /> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ background: '#0b0e14', borderRadius: '64px', padding: '80px', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', opacity: 0.15 }}>
                            <div style={{ height: '180px', background: 'white', borderRadius: '32px' }}></div>
                            <div style={{ height: '180px', background: 'var(--pub-red)', borderRadius: '32px' }}></div>
                            <div style={{ height: '180px', background: 'white', borderRadius: '32px' }}></div>
                            <div style={{ height: '180px', background: 'white', borderRadius: '32px' }}></div>
                         </div>
                         <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', zIndex: 10 }}>
                            <div style={{ width: '80px', height: '80px', background: 'var(--pub-red)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '24px', boxShadow: '0 20px 40px rgba(255,77,94,0.4)' }}>
                                <Rocket size={40} />
                            </div>
                            <h4 style={{ color: 'white', fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '-1px' }}>Portal Access</h4>
                            <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Instant Creative Hub</p>
                         </div>
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA FORM --- */}
            <section style={{ background: '#0b0e14', padding: '160px 24px', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'var(--pub-red)', opacity: 0.05, filter: 'blur(100px)', borderRadius: '100%' }}></div>
                
                <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                    <div style={{ marginBottom: '80px' }}>
                        <h2 style={{ fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: '900', textTransform: 'uppercase', lineHeight: '0.9', marginBottom: '32px' }}>Request <br/> <span style={{ color: 'var(--pub-red)' }}>Partnership</span></h2>
                        <p style={{ opacity: 0.6, fontSize: '20px', maxWidth: '600px', margin: '0 auto', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.1em' }}>Your Institutional Account Manager will contact you shortly.</p>
                    </div>
                    
                    <div style={{ maxWidth: '650px', margin: '0 auto', background: 'white', padding: '80px 64px', borderRadius: '64px', textAlign: 'left', color: '#111', boxShadow: '0 60px 120px rgba(0,0,0,0.5)' }}>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Institutional Contact</label>
                                <input type="text" style={{ padding: '24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', outline: 'none', fontWeight: '900', fontSize: '16px' }} placeholder="Full Name" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Work Identifier</label>
                                <input type="email" style={{ padding: '24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', outline: 'none', fontWeight: '900', fontSize: '16px' }} placeholder="professional@email.com" />
                            </div>
                            <button className="lp-btn-primary" style={{ width: '100%', padding: '24px', fontSize: '14px' }} type="submit" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Launch Application <ArrowRight size={18} style={{ marginLeft: '12px' }}/></button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BecomeAPartner;
