import React from 'react';
import { 
    Shield, Lock, Eye, FileText, CheckCircle2, 
    ArrowRight, Mail, Globe, Scale
} from 'lucide-react';

const CookiesPrivacy = () => {
    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1>Privacy & <span style={{ color: 'var(--pub-red)' }}>Cookies</span></h1>
                    <p style={{ margin: '0 auto', maxWidth: '800px' }}>
                        Our commitment to protecting your personal data and maintaining transparency across all services.
                    </p>
                </div>
            </section>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: '80px' }}>
                
                {/* Introduction */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--pub-red)' }}>
                        <Shield size={32} />
                        <h2 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', color: '#1a1a1a' }}>Introduction</h2>
                    </div>
                    <div style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <p>
                            Capital Crest Ltd operating under the trading name Mirrox, is a limited liability company registered with the registrar of International Business Companies in Comoros Union, with registration number HT00324037 and is authorised by the Mwali International Services Authority.
                        </p>
                        <p>
                            We understand the importance of maintaining the confidentiality and privacy of personal information that we hold about our clients and other third parties. This Policy outlines how we manage and protect the personal information you give us.
                        </p>
                    </div>
                </section>

                {/* Collection */}
                <section style={{ background: '#f8fafc', padding: '64px', borderRadius: '48px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>Information Collection</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--pub-text-muted)', lineHeight: '1.6' }}>
                        <p>
                            In order to open an account with us, you must first complete and submit an application form to us. By doing so, you disclose personal information in order to enable us to assess your application.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            {[
                                "Websites and apps",
                                "Account forms",
                                "Customer support",
                                "Public sources"
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8' }}>
                                    <CheckCircle2 size={16} style={{ color: 'var(--pub-red)' }} /> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Disclosure */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>Information Disclosure</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        <div style={{ padding: '40px', background: '#fff1f2', borderRadius: '24px', border: '1px solid #fee2e2' }}>
                            <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--pub-red)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>Internal Usage</p>
                            <p style={{ color: 'var(--pub-text-muted)', fontSize: '15px', lineHeight: '1.6' }}>To the extent required pursuant to any applicable laws, rules and/or regulations governing our operations.</p>
                        </div>
                        <div style={{ padding: '40px', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                            <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>External Disclosure</p>
                            <p style={{ color: 'var(--pub-text-muted)', fontSize: '15px', lineHeight: '1.6' }}>To potential successors in title to our business or third-party consultants acting on our behalf.</p>
                        </div>
                    </div>
                </section>

                {/* Retention */}
                <section style={{ background: '#0b0e14', padding: '64px', borderRadius: '48px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                     <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <p style={{ fontSize: '10px', fontWeight: '900', uppercase: 'true', textTransform: 'uppercase', color: 'var(--pub-red)', letterSpacing: '0.1em' }}>Regulatory Compliance</p>
                        <h3 style={{ fontSize: '24px', fontWeight: '900', fontStyle: 'italic', lineHeight: '1.4' }}>"We are required to retain records for a period of seven (7) years after our business relationship ends."</h3>
                     </div>
                     <div style={{ position: 'absolute', top: '0', right: '0', padding: '32px', opacity: 0.1 }}>
                        <Lock size={120} />
                     </div>
                </section>

                {/* Contact */}
                <section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '80px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase' }}>How to contact us</h2>
                    <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                        If you have any questions regarding this Policy, or wish to access or change your information.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
                         <button className="lp-btn-primary" style={{ padding: '16px 40px' }}><Mail size={18} /> Support</button>
                         <button style={{ padding: '16px 40px', background: '#0b0e14', color: 'white', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}><Scale size={18} /> Legal Inquiry</button>
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2 style={{ textAlign: 'center' }}>Join Mirrox and Start Trading</h2>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="lp-cta-white">Start Now</button>
                </div>
            </section>

            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                 <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.8', borderTop: '1px dotted #e2e8f0', paddingTop: '32px' }}>
                    MIRROX IS FULLY COMMITTED TO THE PROTECTION OF YOUR DATA ACCORDING TO GLOBAL STANDARDS.
                </p>
            </div>
        </div>
    );
};
    );
};

export default CookiesPrivacy;
