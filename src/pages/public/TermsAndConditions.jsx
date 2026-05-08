import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';

const TermsAndConditions = () => {
    const navigate = useNavigate();

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '160px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>
                        <FileText size={14} style={{ color: 'var(--pub-red)' }} /> Legal Agreement
                    </div>
                    <h1 style={{ fontSize: 'clamp(48px, 9vw, 90px)', lineHeight: '0.9', marginBottom: '32px' }}>
                        Terms & <span style={{ color: 'var(--pub-red)' }}>Conditions</span>
                    </h1>
                    <p style={{ margin: '0 auto', fontSize: '20px', maxWidth: '750px', color: '#94a3b8', lineHeight: '1.6' }}>
                        Please read these terms carefully before registering an account on our platform.
                    </p>
                </div>
            </section>

            <div className="lp-section" style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: '80px' }}>

                {/* Welcome */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: '#111' }}>
                        <div style={{ width: '64px', height: '64px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={32} />
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '900', textTransform: 'uppercase', margin: 0, letterSpacing: '-1.5px' }}>Terms and Conditions for <span style={{ color: 'var(--pub-red)' }}>Bulvera</span></h2>
                    </div>
                    <p style={{ color: '#475569', fontSize: '18px', lineHeight: '1.8', fontWeight: '500' }}>
                        Welcome to Bulvera. By registering an account on our website, you agree to be bound by the following Terms and Conditions. Please read them carefully before proceeding with your registration.
                    </p>
                </section>

                {/* Section 1 */}
                <section style={{ background: '#f8fafc', padding: '64px', borderRadius: '48px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#111', textTransform: 'uppercase', marginBottom: '24px' }}>1. Acceptance of Terms</h3>
                    <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.8' }}>
                        By creating an account, you confirm that you have read, understood, and agreed to these Terms and Conditions, as well as our Privacy Policy. If you do not agree to these terms, you must not use our services.
                    </p>
                </section>

                {/* Section 2 */}
                <section style={{ background: '#f8fafc', padding: '64px', borderRadius: '48px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#111', textTransform: 'uppercase', marginBottom: '24px' }}>2. Eligibility</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#475569', fontSize: '16px', lineHeight: '1.8' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', flexShrink: 0, marginTop: '4px' }} />
                            <p style={{ margin: 0 }}>You must be at least 18 years of age or the legal age of majority in your jurisdiction to register.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', flexShrink: 0, marginTop: '4px' }} />
                            <p style={{ margin: 0 }}>You represent that all information provided during registration is accurate, current, and complete.</p>
                        </div>
                    </div>
                </section>

                {/* Section 3 */}
                <section style={{ background: '#f8fafc', padding: '64px', borderRadius: '48px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#111', textTransform: 'uppercase', marginBottom: '24px' }}>3. Nature of Services</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#475569', fontSize: '16px', lineHeight: '1.8' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', flexShrink: 0, marginTop: '4px' }} />
                            <p style={{ margin: 0 }}>Bulvera provides a platform for foreign exchange (Forex) trading services.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', flexShrink: 0, marginTop: '4px' }} />
                            <p style={{ margin: 0 }}>We do not provide personalized investment advice; all trading decisions are made solely by the user.</p>
                        </div>
                    </div>
                </section>

                {/* Section 4 */}
                <section style={{ background: 'var(--pub-red)', padding: '64px', borderRadius: '48px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 100px rgba(255,77,94,0.3)' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px' }}>4. Risk Disclosure</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '16px', lineHeight: '1.8' }}>
                        <p style={{ margin: 0 }}><strong>High Risk:</strong> Forex trading carries a high level of risk and may not be suitable for all investors.</p>
                        <p style={{ margin: 0 }}><strong>Loss of Funds:</strong> You acknowledge that you may lose some or all of your deposited capital.</p>
                        <p style={{ margin: 0 }}><strong>Responsibility:</strong> You are responsible for managing your own risk and understanding the mechanics of the market.</p>
                    </div>
                </section>

                {/* Section 5 */}
                <section style={{ background: '#f8fafc', padding: '64px', borderRadius: '48px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#111', textTransform: 'uppercase', marginBottom: '24px' }}>5. Account Security</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#475569', fontSize: '16px', lineHeight: '1.8' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', flexShrink: 0, marginTop: '4px' }} />
                            <p style={{ margin: 0 }}>You are responsible for maintaining the confidentiality of your login credentials.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', flexShrink: 0, marginTop: '4px' }} />
                            <p style={{ margin: 0 }}>Any activity occurring under your account is your sole responsibility.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', flexShrink: 0, marginTop: '4px' }} />
                            <p style={{ margin: 0 }}>You must notify Bulvera immediately of any unauthorized use of your account.</p>
                        </div>
                    </div>
                </section>

                {/* Section 6 */}
                <section style={{ background: '#0b0e14', padding: '64px', borderRadius: '48px', color: 'white', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px' }}>6. Prohibited Activities</h3>
                    <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>Users agree not to:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#94a3b8', fontSize: '16px', lineHeight: '1.8' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', flexShrink: 0, marginTop: '4px' }} />
                            <p style={{ margin: 0 }}>Use the platform for any illegal or fraudulent activities, including money laundering.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', flexShrink: 0, marginTop: '4px' }} />
                            <p style={{ margin: 0 }}>Attempt to interfere with the technical operation of the website or its security features.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <CheckCircle2 size={20} style={{ color: 'var(--pub-red)', flexShrink: 0, marginTop: '4px' }} />
                            <p style={{ margin: 0 }}>Use automated systems (bots) to execute trades unless explicitly permitted via our API terms.</p>
                        </div>
                    </div>
                </section>

                {/* Section 7 */}
                <section style={{ background: '#f8fafc', padding: '64px', borderRadius: '48px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#111', textTransform: 'uppercase', marginBottom: '24px' }}>7. Limitation of Liability</h3>
                    <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.8' }}>
                        Bulvera shall not be liable for any financial losses, technical interruptions, or data breaches resulting from factors beyond our reasonable control.
                    </p>
                </section>

                {/* Section 8 */}
                <section style={{ background: '#f8fafc', padding: '64px', borderRadius: '48px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#111', textTransform: 'uppercase', marginBottom: '24px' }}>8. Amendments</h3>
                    <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.8' }}>
                        We reserve the right to modify these terms at any time. Continued use of the platform after changes are posted constitutes your acceptance of the new terms.
                    </p>
                </section>

                {/* Acknowledgment */}
                <section style={{ textAlign: 'center', padding: '64px', background: 'var(--pub-red-soft)', borderRadius: '48px', border: '1px solid rgba(255,77,94,0.1)' }}>
                    <p style={{ color: '#111', fontSize: '18px', lineHeight: '1.8', fontWeight: '600', maxWidth: '700px', margin: '0 auto' }}>
                        By clicking &quot;Register&quot; or &quot;Sign Up,&quot; you acknowledge that you have read these Terms and Conditions and agree to abide by them.
                    </p>
                </section>
            </div>

            {/* FINAL CTA */}
            <section className="lp-cta-block">
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h2 style={{ textTransform: 'uppercase' }}>Ready to Start <span style={{ color: 'var(--pub-red)' }}>Trading</span>?</h2>
                    <p style={{ marginTop: '24px', color: 'var(--pub-text-muted)', fontSize: '18px' }}>Join Bulvera and experience the gold standard of trading.</p>
                    <div style={{ marginTop: '64px' }}>
                        <button className="lp-btn-primary" style={{ padding: '24px 80px', background: 'white', color: 'var(--pub-red)' }} onClick={() => navigate('/register')}>Create Account</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsAndConditions;
