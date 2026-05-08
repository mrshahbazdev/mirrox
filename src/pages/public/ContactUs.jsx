import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Mail, MessageSquare, Phone, MapPin, Send, 
    Clock, Globe, Shield, ShieldCheck, Headphones,
    CheckCircle2, ArrowRight
} from 'lucide-react';

const ContactUs = () => {
    const navigate = useNavigate();

    const contactMethods = [
        {
            icon: <Mail size={32} />,
            title: "Email Support",
            desc: "Institutional assistance for detailed technical inquiries.",
            link: "support@bullvera.com"
        },
        {
            icon: <MessageSquare size={32} />,
            title: "Live Terminal",
            desc: "Real-time support directly from our trading experts.",
            link: "Launch Live Chat"
        },
        {
            icon: <Phone size={32} />,
            title: "Direct Access",
            desc: "Immediate voice priority for high-volume accounts.",
            link: "+1 (800) BULVERA"
        }
    ];

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero" style={{ padding: '160px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>
                        <Headphones size={14} style={{ color: 'var(--pub-red)' }} /> Elite Support Network
                    </div>
                    <h1 style={{ fontSize: 'clamp(48px, 9vw, 90px)', lineHeight: '0.9', marginBottom: '32px' }}>
                        Get in <span style={{ color: 'var(--pub-red)' }}>Touch</span>
                    </h1>
                    <p style={{ margin: '0 auto', fontSize: '20px', maxWidth: '750px', color: '#94a3b8', lineHeight: '1.6' }}>
                        Our institutional support team is available 24/5 to provide precision assistance and technical resolution.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px', padding: '0 24px 160px 24px' }}>
                
                {/* CONTACT METHODS GRID */}
                <section>
                    <div className="lp-grid">
                        {contactMethods.map((method, i) => (
                            <div key={i} className="lp-card" style={{ textAlign: 'center' }}>
                                <div className="lp-icon-box" style={{ margin: '0 auto 32px auto' }}>
                                    {method.icon}
                                </div>
                                <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#111', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{method.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>{method.desc}</p>
                                <p style={{ color: 'var(--pub-red)', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{method.link}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '100px', alignItems: 'start' }}>
                    {/* Contact Form */}
                    <div style={{ background: 'white', padding: '80px 64px', borderRadius: '64px', boxShadow: '0 40px 100px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                        <div style={{ marginBottom: '56px' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '-1.5px' }}>Direct <span style={{ color: 'var(--pub-red)' }}>Inquiry</span></h2>
                            <p style={{ color: '#64748b', fontSize: '16px' }}>Submit your request below for immediate compliance review.</p>
                        </div>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Full Identity</label>
                                    <input type="text" style={{ padding: '20px 24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', outline: 'none', fontWeight: '900' }} placeholder="John Doe" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Work Domain</label>
                                    <input type="email" style={{ padding: '20px 24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', outline: 'none', fontWeight: '900' }} placeholder="email@company.com" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Inquiry Category</label>
                                <select style={{ padding: '20px 24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', outline: 'none', fontWeight: '900', appearance: 'none' }}>
                                    <option>Technical Execution Support</option>
                                    <option>Account Verification</option>
                                    <option>Institutional Partnerships</option>
                                    <option>Financial Operations</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Message Payload</label>
                                <textarea rows="5" style={{ padding: '20px 24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', outline: 'none', fontWeight: '900', resize: 'none' }} placeholder="Detail your request..."></textarea>
                            </div>
                            <button className="lp-btn-primary" style={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>Transmit Request <Send size={18} /></button>
                        </form>
                    </div>

                    {/* Reach Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
                        <div>
                            <h2 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', lineHeight: '1.1', letterSpacing: '-1px' }}>Global <span style={{ color: 'var(--pub-red)' }}>Infrastructure</span></h2>
                            <p style={{ color: '#64748b', fontSize: '18px', lineHeight: '1.7' }}>
                                Our support infrastructure is distributed across global nodes to ensure zero-latency response for all institutional clients.
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                            {[
                                { icon: <Clock size={24} />, title: "24/5 Operational Window", desc: "Active coverage from market open in Sydney to close in New York." },
                                { icon: <Globe size={24} />, title: "Multilingual Nodes", desc: "Support available in major financial corridors including EMEA and APAC." },
                                { icon: <Shield size={24} />, title: "Secure Transmission", desc: "All communication channels are protected by 256-bit AES encryption." }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '24px' }}>
                                    <div style={{ width: '64px', height: '64px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px', color: '#111' }}>{item.title}</h4>
                                        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: '#0b0e14', padding: '64px', borderRadius: '48px', color: 'white', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--pub-red)', opacity: 0.1, filter: 'blur(60px)', borderRadius: '100%' }}></div>
                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--pub-red)', marginBottom: '32px' }}>
                                    <MapPin size={24} />
                                    <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Global Headquarters</span>
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1.2', marginBottom: '16px' }}>Mwali International Services Authority</h3>
                                <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500', lineHeight: '1.6', margin: 0 }}>
                                    Jurisdiction of the island of Mwali - Comoros Union. <br/>
                                    License: BFX2024064. <br/>
                                    P.B. 1257 Bonovo Road, Fomboni.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Social Grid */}
            <section style={{ padding: '100px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '48px', letterSpacing: '0.3em', color: '#94a3b8' }}>Connect Globally</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '60px' }}>
                        {['Twitter / X', 'LinkedIn', 'YouTube', 'Facebook / Meta'].map(social => (
                            <button key={social} style={{ background: 'none', border: 'none', color: '#111', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s', letterSpacing: '0.1em' }} onMouseOver={(e) => e.target.style.color = 'var(--pub-red)'} onMouseOut={(e) => e.target.style.color = '#111'}>{social}</button>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h2 style={{ textTransform: 'uppercase' }}>Ready to Experience <span style={{ color: 'var(--pub-red)' }}>Precision</span> Support?</h2>
                    <p style={{ marginTop: '24px', color: 'var(--pub-text-muted)', fontSize: '18px' }}>Join the institutional revolution today.</p>
                    <div style={{ marginTop: '64px' }}>
                        <button className="lp-btn-primary" style={{ padding: '24px 80px', background: 'white', color: 'var(--pub-red)' }} onClick={() => navigate('/register')}>Start Institutional Account</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUs;
