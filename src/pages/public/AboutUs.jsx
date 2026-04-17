import React from 'react';
import { 
    Shield, Target, Users, Globe, Award, CheckCircle2, 
    ArrowRight, Heart, Zap, BadgeCheck, Star, ShieldCheck
} from 'lucide-react';

const AboutUs = () => {
    const navigate = (path) => { window.location.href = path; };

    const values = [
        {
            icon: <Heart size={24} />,
            title: "Client-Centered",
            desc: "The needs of our clients are the center of our services. We offer personal assistance and tools to ensure an effortless experience."
        },
        {
            icon: <Shield size={24} />,
            title: "Integrity",
            desc: "Transparency and honesty are at the heart of our operations. We maintain high ethical standards to build long-lasting trust."
        },
        {
            icon: <Zap size={24} />,
            title: "Innovation",
            desc: "We constantly seek ways to improve our platforms. We believe in the power of technology to transform trading."
        },
        {
            icon: <Target size={24} />,
            title: "Excellence",
            desc: "We equip our traders with extensive educational tools and resources to help them make informed decisions."
        }
    ];

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero" style={{ padding: '160px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>
                        <Globe size={14} style={{ color: 'var(--pub-red)' }} /> Leading Global Broker
                    </div>
                    <h1 style={{ fontSize: 'clamp(48px, 9vw, 90px)', lineHeight: '0.9', marginBottom: '32px' }}>
                        Your Global <br/> <span style={{ color: 'var(--pub-red)' }}>Trading</span> Partner
                    </h1>
                    <p style={{ margin: '0 auto', fontSize: '20px', maxWidth: '700px', color: '#94a3b8', lineHeight: '1.6' }}>
                        Empowering traders worldwide with innovation, transparency, and institutional-grade technology.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px', padding: '160px 24px' }}>
                
                {/* --- INTRO SECTION --- */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '100px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                         <div style={{ position: 'absolute', inset: '-20px', background: 'var(--pub-red)', opacity: 0.05, borderRadius: '64px', filter: 'blur(40px)', zIndex: 0 }}></div>
                         <div style={{ position: 'relative', borderRadius: '48px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                                alt="Bullvera Vision" 
                                style={{ width: '100%', display: 'block' }}
                            />
                         </div>
                         <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', background: 'white', padding: '32px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '100px' }}></div>
                                <span style={{ fontSize: '12px', fontWeight: '900', color: '#111', textTransform: 'uppercase' }}>Live Connectivity</span>
                            </div>
                            <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--pub-red)' }}>Institutional Grade</span>
                         </div>
                    </div>
                    <div className="lp-content-side">
                        <div style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', fontWeight: '900', fontSize: '10px', borderRadius: '100px', textTransform: 'uppercase', marginBottom: '32px', letterSpacing: '0.1em' }}>
                           Introducing Bullvera
                        </div>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Redefining the Standard of <span style={{ color: 'var(--pub-red)' }}>Trading</span></h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '24px' }}>
                            Bullvera is a leading online trading platform, offering access to over 160+ CFDs on various assets, including Forex, commodities, indices, and cryptocurrencies. 
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7' }}>
                            Founded on the principles of innovation and client satisfaction, Bullvera provides cutting-edge tools, educational resources, and exceptional support to help traders of all levels navigate the financial markets confidently.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '48px' }}>
                            <div>
                                <h4 style={{ color: 'var(--pub-red)', fontSize: '48px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-2px' }}>160+</h4>
                                <p style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Premium Assets</p>
                            </div>
                            <div>
                                <h4 style={{ color: '#111', fontSize: '48px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-2px' }}>24/5</h4>
                                <p style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Elite Support</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- VALUES SECTION --- */}
                <section>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>Our Core <span style={{ color: 'var(--pub-red)' }}>Principles</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>
                    <div className="lp-grid">
                        {values.map((val, i) => (
                            <div key={i} className="lp-card" style={{ textAlign: 'center' }}>
                                <div className="lp-icon-box" style={{ margin: '0 auto 32px auto' }}>
                                    {val.icon}
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#111', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{val.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- REGULATORY SECTION --- */}
                <section style={{ background: '#0b0e14', borderRadius: '64px', padding: '100px 80px', color: 'white', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'var(--pub-red)', opacity: 0.1, filter: 'blur(100px)', borderRadius: '100%' }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px', alignItems: 'center' }}>
                        <div>
                            <div style={{ width: '64px', height: '64px', background: 'var(--pub-red)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '32px' }}>
                                <ShieldCheck size={32} />
                            </div>
                            <h2 style={{ color: 'white', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1.1', marginBottom: '32px' }}>Regulatory <br/> <span style={{ color: 'var(--pub-red)' }}>Commitment</span></h2>
                            <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: '1.7' }}>
                                Regulated by the Mwali International Services Authority (MISA), Bullvera ensures adherence to the highest standards of financial security and transparency.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
                                {[
                                    { l: "License", v: "BFX2024064" },
                                    { l: "Registration", v: "HT00324037" },
                                    { l: "Jurisdiction", v: "Mwali - Comoros Union" }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '24px', height: '24px', background: 'rgba(255,77,94,0.1)', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pub-red)' }}>
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{item.l}: <span style={{ color: '#94a3b8' }}>{item.v}</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ padding: '64px', background: 'rgba(255,255,255,0.02)', borderRadius: '48px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--pub-red)', marginBottom: '32px' }}>
                                <Star size={24} />
                                <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Security Standard</span>
                            </div>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '24px', fontWeight: '900', color: 'white', marginBottom: '24px', lineHeight: '1.3' }}>Segregated Client Funds</h3>
                            <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.8' }}>
                                At Bullvera, client funds are kept in segregated accounts, completely separate from company operational funds. This ensures maximum security and absolute transparency, protecting your capital under all market conditions.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h2 style={{ textTransform: 'uppercase' }}>Ready to Start Your <span style={{ color: 'var(--pub-red)' }}>Journey</span>?</h2>
                    <p style={{ marginTop: '24px', color: 'var(--pub-text-muted)', fontSize: '18px' }}>Join thousands of traders globaly who trust Bullvera.</p>
                    <div style={{ marginTop: '64px' }}>
                        <button className="lp-btn-primary" style={{ padding: '24px 80px', background: 'white', color: 'var(--pub-red)' }} onClick={() => navigate('/register')}>Open Institutional Account</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
