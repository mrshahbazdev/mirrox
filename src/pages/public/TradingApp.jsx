import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Smartphone, ShieldCheck, Zap, 
    TrendingUp, BarChart2, CheckCircle2,
    ArrowRight, Globe, PlayCircle, Apple, QrCode
} from 'lucide-react';

const TradingApp = () => {
    const navigate = useNavigate();
    const steps = [
        {
            title: "Visit Firebase Distribution",
            desc: "Start by navigating to our official application distribution page on Firebase to access the secure beta environment.",
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=500"
        },
        {
            title: "Authorize Email",
            desc: "Register with your trading email to be added to our authorized user list for seamless app access and security.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500"
        },
        {
            title: "Accept Invitation",
            desc: "Look for an invitation link sent by Firebase to your inbox and accept it to proceed to the download phase.",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=500"
        },
        {
            title: "Configuration",
            desc: "Open your device settings and allow installations from unknown sources to install the tester application.",
            image: null
        },
        {
            title: "Download Tester",
            desc: "Download the App Tester and use the Firebase Distribution platform to get the Bulvera trading app.",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=500"
        },
        {
            title: "Launch & Trade",
            desc: "Follow the prompts to install the Bulvera app and begin your premium mobile trading experience.",
            image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=500"
        }
    ];

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>Bulvera <span style={{ color: 'var(--pub-red)' }}>Mobile</span></h1>
                    <p style={{ fontSize: '20px', marginTop: '24px' }}>Step-by-step guide to installing the Bulvera Firebase experience on your device.</p>
                </div>
            </section>

            {/* --- TIMELINE SECTION --- */}
            <div className="lp-section" style={{ padding: '160px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '160px' }}>
                    {steps.map((step, i) => (
                        <div key={i} style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                            gap: '80px', 
                            alignItems: 'center' 
                        }}>
                            {/* Image Side */}
                            <div style={{ order: i % 2 === 0 ? 1 : 2, position: 'relative' }}>
                                {step.image ? (
                                    <div style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '48px', boxShadow: '0 40px 100px rgba(0,0,0,0.06)' }}>
                                        <img 
                                            src={step.image} 
                                            alt={step.title} 
                                            style={{ 
                                                width: '100%', 
                                                borderRadius: '32px', 
                                                aspectRatio: '1',
                                                objectFit: 'cover',
                                                display: 'block'
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ 
                                        width: '100%', 
                                        aspectRatio: '1', 
                                        background: '#f8fafc', 
                                        borderRadius: '48px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: 'var(--pub-red)',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <Smartphone size={80} strokeWidth={1} />
                                    </div>
                                )}
                            </div>

                            {/* Content Side */}
                            <div className="lp-content-side" style={{ order: i % 2 === 0 ? 2 : 1 }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', padding: '10px 24px', borderRadius: '100px', fontSize: '12px', fontWeight: '900', marginBottom: '32px', letterSpacing: '0.1em' }}>
                                    PHASE 0{i + 1}
                                </div>
                                <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>
                                    {step.title}
                                </h2>
                                <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7' }}>
                                    {step.desc}
                                </p>
                                {i === 0 && (
                                    <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                                        <button className="lp-btn-primary" onClick={() => window.open('https://firebase.google.com/products/app-distribution')}>Go to Firebase</button>
                                        <div style={{ width: '56px', height: '56px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <section className="lp-cta-block" style={{ marginBottom: '120px' }}>
                <h2>Experience Premium Trading</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Start Now</button>
                </div>
            </section>

             <footer style={{ textAlign: 'center', padding: '0 24px 80px 24px' }}>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.8' }}>
                    RISK WARNING: TRADING CFDs INVOLVES SIGNIFICANT RISK TO YOUR INVESTED CAPITAL. ASSETS CAN GO DOWN AS WELL AS UP.
                </p>
            </footer>
        </div>
    );
};

export default TradingApp;
