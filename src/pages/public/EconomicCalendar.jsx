import React from 'react';
import { Lock, ArrowRight, Globe, Shield, Zap, PlayCircle } from 'lucide-react';

const EconomicCalendar = () => {
    return (
        <div className="lp-wrapper">
            
            {/* --- BLURRED BACKGROUND MOCKUP --- */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.1, pointerEvents: 'none', filter: 'blur(8px)', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px' }}>
                     <div style={{ height: '100px', background: '#e2e8f0', borderRadius: '32px', width: '100%', marginBottom: '48px' }}></div>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {[...Array(12)].map((_, i) => (
                            <div key={i} style={{ height: '160px', background: '#f1f5f9', borderRadius: '24px' }}></div>
                        ))}
                     </div>
                </div>
            </div>

            {/* --- LOCKED OVERLAY --- */}
            <div style={{ position: 'relative', zIndex: 10, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
                <div style={{ maxWidth: '600px', width: '100%', padding: '64px', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '56px', border: '1px solid white', boxShadow: '0 40px 100px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <div style={{ width: '96px', height: '96px', background: '#fff1f2', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pub-red)', margin: '0 auto 40px auto' }}>
                        <Lock size={40} />
                    </div>
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: 'clamp(32px, 5vw, 40px)', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase', lineHeight: '1.1', marginBottom: '24px' }}>Economic Calendar Is Locked</h1>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '16px', lineHeight: '1.6' }}>Sign up or log in to access our exclusive Economic Calendar and stay ahead of market-moving events.</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                        <button className="lp-btn-primary" onClick={() => navigate('/login')}>Login</button>
                        <button className="lp-btn-secondary" onClick={() => navigate('/register')}>Create Account</button>
                    </div>
                </div>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2 style={{ textAlign: 'center' }}>Join Mirrox and Start Trading</h2>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Start Now</button>
                </div>
            </section>
        </div>
    );
};

export default EconomicCalendar;
