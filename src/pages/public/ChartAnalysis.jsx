import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Shield, Zap, BarChart3, TrendingUp } from 'lucide-react';

const ChartAnalysis = () => {
    const navigate = useNavigate();

    return (
        <div className="lp-wrapper">
            
            {/* --- BLURRED BACKGROUND MOCKUP --- */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.1, pointerEvents: 'none', filter: 'blur(10px)', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
                     <div style={{ height: '80px', background: '#e2e8f0', borderRadius: '24px', width: '100%' }}></div>
                     <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                        <div style={{ height: '600px', background: '#f1f5f9', borderRadius: '48px' }}></div>
                        <div style={{ height: '600px', background: '#f8fafc', borderRadius: '48px' }}></div>
                     </div>
                </div>
            </div>

            {/* --- LOCKED OVERLAY --- */}
            <div style={{ position: 'relative', zIndex: 10, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
                <div style={{ maxWidth: '560px', width: '100%', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(32px)', padding: '64px', borderRadius: '64px', border: '1px solid white', boxShadow: '0 40px 100px rgba(0,0,0,0.06)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={{ width: '96px', height: '96px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                        <Lock size={40} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#111', textTransform: 'uppercase', letterSpacing: '-1px', lineHeight: '1.1' }}>Analysis <span style={{ color: 'var(--pub-red)' }}>Locked</span></h1>
                        <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6', fontWeight: '500' }}>Please sign up or log in to unlock access to our professional real-time chart analysis tools and expert insights.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="lp-btn-primary" style={{ padding: '16px 40px' }} onClick={() => navigate('/login')}>Login</button>
                        <button style={{ padding: '16px 40px', borderRadius: '16px', background: 'white', border: '1px solid #e2e8f0', color: '#111', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => navigate('/register')}>Create Account</button>
                    </div>
                </div>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block" style={{ marginTop: '0' }}>
                <h2 style={{ textAlign: 'center' }}>Ready to Unlock Full Potential?</h2>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Join Bulvera Now</button>
                </div>
            </section>
        </div>
    );
};

export default ChartAnalysis;
