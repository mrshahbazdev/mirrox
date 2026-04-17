import React from 'react';
import { 
    Shield, Target, Users, Globe, Award, CheckCircle2, 
    ArrowRight, Heart, Zap, BadgeCheck
} from 'lucide-react';

const AboutUs = () => {
    const values = [
        {
            icon: <Heart />,
            title: "Client-Centered",
            desc: "The needs of our clients are the center of our services. We offer personal assistance and tools to ensure an effortless experience."
        },
        {
            icon: <Shield />,
            title: "Integrity",
            desc: "Transparency and honesty are at the heart of our operations. We maintain high ethical standards to build long-lasting trust."
        },
        {
            icon: <Zap />,
            title: "Innovation",
            desc: "We constantly seek ways to improve our platforms. We believe in the power of technology to transform trading."
        },
        {
            icon: <Target />,
            title: "Excellence",
            desc: "We equip our traders with extensive educational tools and resources to help them make informed decisions."
        }
    ];

    return (
        <div className="pub-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1>Your Global Trading Partner</h1>
                    <p>
                        Empowering traders worldwide with innovation, transparency, and institutional-grade technology.
                    </p>
                </div>
            </section>

            <div className="pub-page-container">
                {/* --- INTRO SECTION --- */}
                <section className="pub-article" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                            alt="Mirrox Vision" 
                            style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                    <div>
                        <div className="asset-tag" style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', fontWeight: '900', fontSize: '10px', borderRadius: '20px', textTransform: 'uppercase', marginBottom: '24px' }}>
                           Introducing Mirrox
                        </div>
                        <h2 style={{ marginTop: 0 }}>Redefining the Standard of Trading</h2>
                        <p>
                            Mirrox is a leading online trading platform, offering access to over 160+ CFDs on various assets, including Forex, commodities, and more. 
                        </p>
                        <p>
                            Founded on the principles of innovation and client satisfaction, Mirrox provides cutting-edge tools, educational resources, and exceptional support to help traders of all levels navigate the financial markets confidently.
                        </p>
                        <div className="pub-info-grid" style={{ margin: '32px 0 0 0' }}>
                            <div>
                                <h4 style={{ color: 'var(--pub-red)', fontSize: '32px', fontWeight: '900', marginBottom: '4px' }}>160+</h4>
                                <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>Tradeable Assets</p>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--pub-red)', fontSize: '32px', fontWeight: '900', marginBottom: '4px' }}>24/5</h4>
                                <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>Expert Support</p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '80px 0' }} />

                {/* --- VALUES SECTION --- */}
                <section>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{ textTransform: 'uppercase', tracking: '-1px' }}>Our Core Principles</h2>
                    </div>
                    <div className="pub-info-grid">
                        {values.map((val, i) => (
                            <div key={i} className="pub-info-card" style={{ textAlign: 'center' }}>
                                <div style={{ width: '56px', height: '56px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: 'var(--pub-red)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                    {val.icon}
                                </div>
                                <h4 style={{ textTransform: 'uppercase', fontSize: '16px' }}>{val.title}</h4>
                                <p style={{ fontSize: '14px', margin: 0 }}>{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- REGULATORY SECTION --- */}
                <section style={{ background: '#0b0e14', borderRadius: '32px', padding: '64px', color: 'white', marginTop: '80px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', z-10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
                        <div className="space-y-8">
                            <div style={{ width: '64px', height: '64px', background: 'var(--pub-red)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '24px' }}>
                                <Award size={32} />
                            </div>
                            <h2 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 40px)', textTransform: 'uppercase', marginTop: 0 }}>Regulatory Commitment & Security</h2>
                            <div style={{ color: '#94a3b8', fontSize: '16px' }}>
                                <p>
                                    Regulated by the Mwali International Services Authority (MISA), Mirrox ensures adherence to the highest standards of financial security and transparency.
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, marginTop: '24px' }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontSize: '14px', marginBottom: '12px' }}><CheckCircle2 size={18} style={{ color: 'var(--pub-red)' }} /> License: BFX2024064</li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontSize: '14px', marginBottom: '12px' }}><CheckCircle2 size={18} style={{ color: 'var(--pub-red)' }} /> Registration: HT00324037</li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontSize: '14px', marginBottom: '12px' }}><CheckCircle2 size={18} style={{ color: 'var(--pub-red)' }} /> Jurisdiction: Mwali - Comoros Union</li>
                                </ul>
                            </div>
                        </div>
                        <div style={{ padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '20px', fontWeight: '900', marginBottom: '16px' }}>Segregated Client Funds</h3>
                            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>
                                At Mirrox, client funds are kept in segregated accounts, separate from company funds. This ensures added security and trust, protecting our clients' investments at all times.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section style={{ padding: '80px 24px', textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '32px' }}>Start Your Journey Today</h2>
                <button className="lp-btn-primary" style={{ padding: '20px 64px' }}>Open Account</button>
            </section>
        </div>
    );
};

export default AboutUs;
