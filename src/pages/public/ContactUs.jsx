import React from 'react';
import { 
    Mail, MessageSquare, Phone, MapPin, Send, 
    Clock, Globe, Shield
} from 'lucide-react';

const ContactUs = () => {
    const contactMethods = [
        {
            icon: <Mail size={32} />,
            title: "Email Support",
            desc: "Detailed assistance via email",
            link: "support@mirrox.com"
        },
        {
            icon: <MessageSquare size={32} />,
            title: "Live Chat",
            desc: "Real-time customer support",
            link: "Open Chat"
        },
        {
            icon: <Phone size={32} />,
            title: "Phone Call",
            desc: "Immediate voice assistance",
            link: "+1 (800) MIRROX"
        }
    ];

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1>Get in <span style={{ color: 'var(--pub-red)' }}>Touch</span></h1>
                    <p style={{ margin: '0 auto', maxWidth: '800px' }}>
                        Our expert team is available 24/5 to assist you with any questions or technical support.
                    </p>
                </div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: '120px' }}>
                {/* CONTACT METHODS GRID */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                    {contactMethods.map((method, i) => (
                        <div key={i} style={{ background: 'white', padding: '48px', borderRadius: '48px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '24px', transition: 'all 0.3s' }}>
                            <div style={{ width: '64px', height: '64px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {method.icon}
                            </div>
                            <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase' }}>{method.title}</h3>
                            <p style={{ color: 'var(--pub-text-muted)', fontSize: '15px', lineHeight: '1.6' }}>{method.desc}</p>
                            <p style={{ color: 'var(--pub-red)', fontWeight: '900', fontSize: '18px', marginTop: 'auto' }}>{method.link}</p>
                        </div>
                    ))}
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'start' }}>
                    {/* Contact Form */}
                    <div style={{ background: 'white', padding: '64px', borderRadius: '64px', boxShadow: '0 40px 100px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                        <div style={{ marginBottom: '48px' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '16px' }}>Send a Message</h2>
                            <p style={{ color: 'var(--pub-text-muted)' }}>Fill out the form below and we'll get back to you within 24 hours.</p>
                        </div>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Full Name</label>
                                    <input type="text" style={{ padding: '16px 24px', background: '#f8fafc', border: 'none', borderRadius: '16px' }} placeholder="John Doe" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Work Email</label>
                                    <input type="email" style={{ padding: '16px 24px', background: '#f8fafc', border: 'none', borderRadius: '16px' }} placeholder="john@company.com" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Topic</label>
                                <select style={{ padding: '16px 24px', background: '#f8fafc', border: 'none', borderRadius: '16px' }}>
                                    <option>Technical Support</option>
                                    <option>Account Inquiry</option>
                                    <option>Partnerships</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Message</label>
                                <textarea rows="5" style={{ padding: '16px 24px', background: '#f8fafc', border: 'none', borderRadius: '16px', resize: 'none' }} placeholder="How can we help?"></textarea>
                            </div>
                            <button className="lp-btn-primary" style={{ width: '100%', padding: '20px' }}>Send Request <Send size={18} /></button>
                        </form>
                    </div>

                    {/* Reach Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
                        <div>
                            <h2 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', lineHeight: '1.2' }}>Global Support Network</h2>
                            <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6' }}>
                                Our support infrastructure spans across multiple timezones to provide the fastest response times.
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            {[
                                { icon: <Clock size={24} />, title: "24/5 Availability", desc: "Our team is active from Monday morning to Friday night (UTC)." },
                                { icon: <Globe size={24} />, title: "Multilingual", desc: "Assistance available in over 10 languages." },
                                { icon: <Shield size={24} />, title: "Secure Data", desc: "All data sent via our contact channels is encrypted." }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '24px' }}>
                                    <div style={{ width: '56px', height: '56px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px' }}>{item.title}</h4>
                                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '14px', lineHeight: '1.6' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: '#0b0e14', padding: '64px', borderRadius: '48px', color: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--pub-red)', marginBottom: '24px' }}>
                                <MapPin size={24} />
                                <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Headquarters</span>
                            </div>
                            <h3 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1.2', marginBottom: '16px' }}>Mwali International Services Authority</h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: '500' }}>Jurisdiction of the island of Mwali - Comoros Union. License: BFX2024064.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Social Grid */}
            <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '40px' }}>Follow Our Channels</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '48px' }}>
                        {['Twitter', 'LinkedIn', 'YouTube', 'Facebook'].map(social => (
                            <button key={social} style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.3s' }}>{social}</button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUs;
