import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    MessageCircle, Mail, MapPin, Phone, 
    CheckCircle2, AlertTriangle, Send, Shield, Info,
    User, Globe, Clock
} from 'lucide-react';

const ComplaintInfo = () => {
    const navigate = useNavigate();
    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start gap-6">
                    <h1 style={{ textAlign: 'left' }}>Client Complaint <span style={{ color: 'var(--pub-red)' }}>Procedure</span></h1>
                    <p style={{ maxWidth: '900px', textAlign: 'left' }}>
                        We aim to resolve any issues promptly. This guide outlines how to submit and track your feedback for a fair resolution.
                    </p>
                </div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: '120px' }}>
                
                {/* Step 1: Submitting */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side">
                         <div style={{ width: '56px', height: '56px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900', marginBottom: '32px' }}>1</div>
                         <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px', textTransform: 'uppercase' }}>Submitting your Complaint</h2>
                         <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
                            To ensure a quick response, please submit your feedback through our official complaint form or via email. Include your account details and a clear description of the issue.
                         </p>
                         <button className="lp-btn-primary" onClick={() => navigate('/contact-us')}>Process My Complaint <Send size={18} /></button>
                    </div>
                    <div style={{ position: 'relative', background: '#f8fafc', borderRadius: '48px', padding: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', width: '100%', maxWidth: '300px' }}>
                             <div style={{ display: 'flex', gap: '16px', items: 'center', marginBottom: '24px' }}>
                                <div style={{ width: '40px', height: '40px', background: '#fff1f2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pub-red)' }}><AlertTriangle size={20}/></div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ width: '80px', height: '8px', background: '#f1f5f9', borderRadius: '4px' }}></div>
                                    <div style={{ width: '40px', height: '8px', background: '#f8fafc', borderRadius: '4px' }}></div>
                                </div>
                             </div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ width: '100%', height: '10px', background: '#f8fafc', borderRadius: '4px' }}></div>
                                <div style={{ width: '100%', height: '10px', background: '#f8fafc', borderRadius: '4px' }}></div>
                                <div style={{ width: '60%', height: '10px', background: '#f8fafc', borderRadius: '4px' }}></div>
                             </div>
                        </div>
                    </div>
                </section>

                {/* Step 2: Acknowledging */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div style={{ order: 2, position: 'relative', background: '#0b0e14', borderRadius: '48px', padding: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                             <div style={{ width: '64px', height: '64px', background: 'var(--pub-red)', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Send size={32}/></div>
                             <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ width: '100px', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', margin: '0 auto' }}></div>
                                <div style={{ width: '60px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', margin: '0 auto' }}></div>
                             </div>
                        </div>
                    </div>
                    <div className="lp-content-side" style={{ order: 1 }}>
                        <div style={{ width: '56px', height: '56px', background: '#f1f5f9', color: '#1a1a1a', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900', marginBottom: '32px' }}>2</div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px', textTransform: 'uppercase' }}>Acknowledging your Complaint</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6' }}>
                            Once submitted, we will acknowledge receipt of your complaint within 24-48 hours. You will receive a unique tracking ID for follow-ups and further communication.
                        </p>
                    </div>
                </section>

                {/* Step 3: Handling */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side">
                        <div style={{ width: '56px', height: '56px', background: '#e0f2fe', color: '#0369a1', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '900', marginBottom: '32px' }}>3</div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px', textTransform: 'uppercase' }}>Handling of your Complaint</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6' }}>
                            Our compliance team will investigate the matter thoroughly and provide a final response within 7 business days. We strive for fair and transparent resolutions.
                        </p>
                    </div>
                    <div style={{ position: 'relative', background: '#f0f9ff', borderRadius: '48px', padding: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                         <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid #bae6fd', width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                             <div style={{ width: '56px', height: '56px', background: '#e0f2fe', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1', marginBottom: '24px' }}><CheckCircle2 size={32}/></div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                                <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '4px' }}></div>
                                <div style={{ width: '80%', height: '10px', background: '#f8fafc', borderRadius: '4px' }}></div>
                             </div>
                         </div>
                    </div>
                </section>

                {/* --- CONTACT GRID --- */}
                <section>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2>A. Contact Details for Complaints</h2>
                        <p style={{ marginTop: '16px', color: '#94a3b8', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}>Reach our compliance team directly</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {[
                            { icon: <User size={24}/>, title: "Manager", val: "Complaints Officer" },
                            { icon: <Mail size={24}/>, title: "Email", val: "complaints@bullvera.com" },
                            { icon: <MapPin size={24}/>, title: "Reg Office", val: "P.B. 1257 Bonovo Road, Comoros" },
                            { icon: <Phone size={24}/>, title: "Phone No", val: "+1 (800) BULVERA" }
                        ].map((c, i) => (
                            <div key={i} style={{ background: 'white', padding: '48px', borderRadius: '48px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px', transition: 'all 0.3s' }}>
                                <div style={{ width: '56px', height: '56px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {c.icon}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <h4 style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c.title}</h4>
                                    <p style={{ fontSize: '15px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase' }}>{c.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- MISA TABLE --- */}
                <section>
                     <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2>B. Contact Details of the MISA</h2>
                    </div>
                    <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '24px 40px', background: '#f8fafc', width: '30%', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Website</td>
                                    <td style={{ padding: '24px 40px', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', color: '#1a1a1a' }}>mwaliregistrar.com</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '24px 40px', background: '#f8fafc', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Contact Email</td>
                                    <td style={{ padding: '24px 40px', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', color: '#1a1a1a' }}>contact@mwaliregistrar.com</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '24px 40px', background: '#f8fafc', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Address</td>
                                    <td style={{ padding: '24px 40px', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', color: '#1a1a1a', lineHeight: '1.6' }}>Mwali International Services Authority, P.B. 1257 Bonovo Road, Fomboni, Comoros Union.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2 style={{ textAlign: 'center' }}>Join Bulvera and Start Trading</h2>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Start Now</button>
                </div>
            </section>
        </div>
    );
};

export default ComplaintInfo;
