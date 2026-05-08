import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Globe, Shield, Zap, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EconomicCalendar = () => {
    const navigate = useNavigate();
    return (
        <div className="lp-wrapper">
            
            {/* --- BLURRED BACKGROUND MOCKUP --- */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.1, pointerEvents: 'none', filter: 'blur(12px)', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px' }}>
                     <div style={{ height: '100px', background: '#cbd5e1', borderRadius: '32px', width: '100%', marginBottom: '48px' }}></div>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} style={{ height: '160px', background: '#e2e8f0', borderRadius: '32px' }}></div>
                        ))}
                     </div>
                </div>
            </div>

            {/* --- LOCKED OVERLAY --- */}
            <div style={{ position: 'relative', zIndex: 10, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
                <div style={{ maxWidth: '560px', width: '100%', padding: '64px', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(32px)', borderRadius: '64px', border: '1px solid white', boxShadow: '0 40px 120px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                    <div style={{ width: '96px', height: '96px', background: 'var(--pub-red-soft)', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pub-red)', margin: '0 auto 40px auto' }}>
                        <Lock size={40} />
                    </div>
                    <div style={{ marginBottom: '48px' }}>
                        <h1 style={{ fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: '900', color: '#111', textTransform: 'uppercase', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>Calendar <span style={{ color: 'var(--pub-red)' }}>Locked</span></h1>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', fontWeight: '500' }}>Sign up or log in to access our real-time economic calendar and professional sentiment analysis.</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                        <button className="lp-btn-primary" style={{ padding: '16px 40px' }} onClick={() => navigate('/login')}>Login</button>
                        <button style={{ padding: '16px 40px', borderRadius: '16px', background: 'white', border: '1px solid #e2e8f0', color: '#111', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => navigate('/register')}>Join Now</button>
                    </div>
                </div>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block" style={{ marginBottom: '120px' }}>
                <h2 style={{ textAlign: 'center' }}>Start Trading with the Best Tools</h2>
                <div style={{ marginTop: '48px', textAlign: 'center' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Create Free Account</button>
                </div>
            </section>

             <footer style={{ textAlign: 'center', padding: '0 24px 80px 24px' }}>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.8' }}>
                    NOTICE: THE ECONOMIC CALENDAR IS PROVIDED FOR INFORMATIONAL PURPOSES ONLY. BULVERA IS NOT RESPONSIBLE FOR ANY TRADING LOSSES.
                </p>
            </footer>
        </div>
    );
};

export default EconomicCalendar;
