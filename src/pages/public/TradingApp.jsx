import React from 'react';
import { 
    Download, Mail, ShieldCheck, ArrowRight, Smartphone, 
    CheckCircle2, Globe, QrCode
} from 'lucide-react';

const TradingApp = () => {
    const steps = [
        {
            title: "Visit application page on Firebase",
            desc: "Start by navigating to our official application distribution page on Firebase.",
            side: "left",
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=500"
        },
        {
            title: "Sign up with your email",
            desc: "Register with your trading email to be added to our authorized user list for app access.",
            side: "right",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500"
        },
        {
            title: "Check your email for invitation",
            desc: "Look for an invitation link sent by Firebase to your inbox and accept it to proceed.",
            side: "left",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=500"
        },
        {
            title: "Enable unknown sources",
            desc: "Open your device settings and allow installations from unknown sources to install the tester.",
            side: "right",
            image: null
        },
        {
            title: "Download App Tester",
            desc: "Accept the invitation, download App Tester, and use Firebase Distribution to get the Mirrox app.",
            side: "left",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=500"
        },
        {
            title: "Install & Start Trading",
            desc: "Follow the prompts to install the Mirrox app and begin your premium trading experience.",
            side: "right",
            image: "https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=500"
        }
    ];

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1>How to Install the Firebase Test App</h1>
                    <p>
                        Follow our step-by-step guide to get started with the Mirrox mobile experience.
                    </p>
                </div>
            </section>

            {/* --- TIMELINE SECTION --- */}
            <div className="lp-section">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '120px' }}>
                    {steps.map((step, i) => (
                        <div key={i} style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                            gap: '64px', 
                            alignItems: 'center' 
                        }}>
                            {/* Image Side (Left for even index, Right for odd) */}
                            <div style={{ 
                                order: step.side === 'right' ? 2 : 1,
                                position: 'relative'
                            }}>
                                {step.image ? (
                                    <img 
                                        src={step.image} 
                                        alt={step.title} 
                                        style={{ 
                                            width: '100%', 
                                            borderRadius: '32px', 
                                            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                            aspectRatio: '9/16',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <div style={{ 
                                        width: '100%', 
                                        aspectRatio: '9/16', 
                                        background: '#f1f5f9', 
                                        borderRadius: '32px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: 'var(--pub-red)'
                                    }}>
                                        <Smartphone size={64} />
                                    </div>
                                )}
                            </div>

                            {/* Content Side */}
                            <div className="lp-content-side" style={{ order: step.side === 'right' ? 1 : 2 }}>
                                <div style={{ display: 'inline-block', background: '#fff1f2', color: 'var(--pub-red)', padding: '6px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: '900', marginBottom: '24px', letterSpacing: '0.1em' }}>
                                    STEP {i + 1}
                                </div>
                                <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>
                                    {step.title}
                                </h2>
                                <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '32px' }}>
                                    {step.desc}
                                </p>
                                {i === 0 && (
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <button className="lp-btn-primary">Visit Firebase</button>
                                        <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <QrCode size={24} style={{ color: '#94a3b8' }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2>Join Mirrox and Start Trading</h2>
                <div style={{ marginTop: '32px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Get Started Now</button>
                </div>
            </section>

             <footer style={{ textAlign: 'center', paddingBottom: '64px' }}>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    RISK WARNING: TRADING CFDs INVOLVES SIGNIFICANT RISK TO YOUR INVESTED CAPITAL.
                </p>
            </footer>
        </div>
    );
};

export default TradingApp;
