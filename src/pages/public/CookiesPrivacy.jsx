import React from 'react';
import { 
    Shield, Lock, Eye, FileText, CheckCircle2, 
    ArrowRight, Mail, Globe, Scale, ShieldCheck,
    LockKeyhole, FileCheck, Info
} from 'lucide-react';

const CookiesPrivacy = () => {
    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero" style={{ padding: '160px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>
                        <ShieldCheck size={14} style={{ color: 'var(--pub-red)' }} /> Global Data Sovereignty
                    </div>
                    <h1 style={{ fontSize: 'clamp(48px, 9vw, 90px)', lineHeight: '0.9', marginBottom: '32px' }}>
                        Privacy & <span style={{ color: 'var(--pub-red)' }}>Cookies</span>
                    </h1>
                    <p style={{ margin: '0 auto', fontSize: '20px', maxWidth: '750px', color: '#94a3b8', lineHeight: '1.6' }}>
                        Our commitment to protecting institutional data integrity and maintaining total transparency across all global operations.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ maxWidth: '1000px', margin: '0 auto', padding: '160px 24px', display: 'flex', flexDirection: 'column', gap: '120px' }}>
                
                {/* Introduction */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: '#111' }}>
                        <div style={{ width: '64px', height: '64px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={32} />
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '900', textTransform: 'uppercase', margin: 0, letterSpacing: '-1.5px' }}>Data <span style={{ color: 'var(--pub-red)' }}>Governance</span></h2>
                    </div>
                    <div style={{ color: '#475569', fontSize: '18px', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <p style={{ fontWeight: '500' }}>
                           Capital Crest Ltd, operating under the trading name <span style={{ color: '#111', fontWeight: '900' }}>Bullvera</span>, is a limited liability entity registered under Comoros Union (Reg: HT00324037) and authorized by the Mwali International Services Authority.
                        </p>
                        <p>
                            We understand the critical importance of maintaining the confidentiality and privacy of personal information. This Policy defines the high-level protocols we employ to manage and protect the data assets entrusted to us by our institutional partners and individual clients.
                        </p>
                    </div>
                </section>

                {/* Collection */}
                <section style={{ background: '#f8fafc', padding: '80px', borderRadius: '64px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', color: '#111' }}>Strategic Data Acquisition</h2>
                        <div className="accent-line" style={{ width: '40px', background: 'var(--pub-red)' }}></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: '#64748b', lineHeight: '1.7' }}>
                        <p style={{ fontSize: '16px' }}>
                            To initialize an institutional account, clients must submit an application packet. This process involves the disclosure of specific data points necessary for regulatory compliance and risk assessment.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                            {[
                                { t: "Secured Portals", d: "Web and App Interfaces" },
                                { t: "Compliance Forms", d: "Onboarding Documentation" },
                                { t: "Support Channels", d: "Direct Communication" },
                                { t: "Verified Sources", d: "Public Registrar Data" }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ color: 'var(--pub-red)' }}><CheckCircle2 size={18} /></div>
                                    <h4 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#111', margin: 0 }}>{item.t}</h4>
                                    <p style={{ fontSize: '11px', fontWeight: '500', margin: 0 }}>{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Disclosure */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', color: '#111' }}>Protocol for Disclosure</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
                        <div style={{ padding: '48px', background: 'var(--pub-red-soft)', borderRadius: '48px', border: '1px solid rgba(255,77,94,0.1)' }}>
                            <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pub-red)', marginBottom: '24px' }}><Scale size={20}/></div>
                            <h4 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--pub-red)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>Regulatory Mandate</h4>
                            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>Data may be disclosed to the extent required by applicable laws, rules, and global financial regulations governing our operations.</p>
                        </div>
                        <div style={{ padding: '48px', background: '#0b0e14', borderRadius: '48px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '24px' }}><LockKeyhole size={20}/></div>
                            <h4 style={{ fontSize: '14px', fontWeight: '900', color: 'white', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>Corporate Continuity</h4>
                            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>Strategic disclosure to potential successors in title or audited third-party consultants acting under strict confidentiality frameworks.</p>
                        </div>
                    </div>
                </section>

                {/* Retention */}
                <section style={{ background: 'var(--pub-red)', padding: '100px 80px', borderRadius: '64px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 100px rgba(255,77,94,0.3)' }}>
                     <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                            <FileCheck size={24} />
                            <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Retention Cycle</span>
                        </div>
                        <h3 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1.2' }}>We are mandated to retain operational records for a period of <span style={{ color: '#0b0e14' }}>seven (7) years</span> post-termination.</h3>
                        <p style={{ opacity: 0.8, fontSize: '16px', margin: 0 }}>This ensures absolute auditability and compliance with MISA regulatory standards.</p>
                     </div>
                     <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', padding: '32px', opacity: 0.1 }}>
                        <Lock size={300} />
                     </div>
                </section>

                {/* Contact */}
                <section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '120px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    <h2 style={{ fontSize: '40px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-2px' }}>Inquiries & <span style={{ color: 'var(--pub-red)' }}>Assistance</span></h2>
                    <p style={{ color: '#64748b', fontSize: '18px', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
                        For any questions regarding our Governance Policy, or to request data access modifications, please contact our Compliance Node.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px' }}>
                         <button className="lp-btn-primary" style={{ padding: '24px 64px' }} onClick={() => navigate('/contact-us')}><Mail size={18} style={{ marginRight: '12px' }}/> Compliance Contact</button>
                         <button style={{ padding: '24px 64px', background: '#0b0e14', color: 'white', borderRadius: '24px', border: 'none', fontWeight: '900', fontSize: '13px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => navigate('/legal')}><Scale size={18} /> Legal Gateway</button>
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h2 style={{ textTransform: 'uppercase' }}>Experience Secured <span style={{ color: 'var(--pub-red)' }}>Execution</span></h2>
                    <p style={{ marginTop: '24px', color: 'var(--pub-text-muted)', fontSize: '18px' }}>Join the global benchmark for institutional trading.</p>
                    <div style={{ marginTop: '64px' }}>
                        <button className="lp-btn-primary" style={{ padding: '24px 80px', background: 'white', color: 'var(--pub-red)' }} onClick={() => navigate('/register')}>Join Bullvera Today</button>
                    </div>
                </div>
            </section>

            <div style={{ textAlign: 'center', padding: '100px 24px' }}>
                 <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: '2', borderTop: '1px solid #f1f5f9', paddingTop: '48px' }}>
                    <Info size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', color: 'var(--pub-red)' }} />
                    BULLVERA IS FULLY COMMITTED TO GLOBAL DATA PROTECTION STANDARDS. YOUR ASSETS ARE SECURED BY ELITE CRYPTOGRAPHIC PROTOCOLS.
                </p>
            </div>
        </div>
    );
};

export default CookiesPrivacy;
