import { BookOpen, PlayCircle, ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Education = () => {
    const navigate = useNavigate();

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>Bulvera <span style={{ color: 'var(--pub-red)' }}>Education</span> Center</h1>
                    <p style={{ fontSize: '20px', marginTop: '24px' }}>Master the financial markets with our curated professional learning resources.</p>
                </div>
            </section>

            {/* --- EDUCATION GRID --- */}
            <section className="lp-section" style={{ padding: '160px 24px' }}>
                <div className="lp-section-header" style={{ marginBottom: '80px', textAlign: 'center' }}>
                    <h2 style={{ textTransform: 'uppercase' }}>Empower Your <span style={{ color: 'var(--pub-red)' }}>Strategy</span></h2>
                    <div className="accent-line" style={{ margin: '24px auto' }}></div>
                </div>

                <div className="lp-grid">
                    {[
                        { title: "Introduction to CFDs", desc: "Understand the fundamentals of trading contracts for difference and market dynamics.", icon: <BookOpen size={28} /> },
                        { title: "Technical Analysis", desc: "Learn to read charts, patterns, and master professional technical indicators.", icon: <Zap size={28} /> },
                        { title: "Risk Management", desc: "Essential techniques to protect your capital and manage market volatility.", icon: <Shield size={28} /> },
                        { title: "Global Markets", desc: "Deep dive into Forex, Stocks, Indices, and Commodities with expert insight.", icon: <Globe size={28} /> }
                    ].map((course, i) => (
                        <div key={i} className="lp-card">
                            <div className="lp-icon-box">
                                {course.icon}
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '16px' }}>{course.title}</h3>
                            <p style={{ color: 'var(--pub-text-muted)', lineHeight: '1.6', fontSize: '15px', marginBottom: '32px' }}>{course.desc}</p>
                            <button className="lp-btn-primary" style={{ padding: '12px 24px', fontSize: '11px' }} onClick={() => navigate('/register')}>
                                Start Course
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- VIDEO TUTORIALS --- */}
            <section style={{ background: '#0b0e14', padding: '160px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                         <div className="lp-content-side">
                             <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(255,77,94,0.1)', color: 'var(--pub-red)', borderRadius: '100px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '32px', letterSpacing: '0.1em' }}>Video Library</div>
                             <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: 'white', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Watch & Learn</h2>
                             <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', lineHeight: '1.7', marginBottom: '48px' }}>
                                Get access to high-definition video tutorials led by industry experts. From platform walkthroughs to live market analysis sessions.
                             </p>
                             <button className="lp-cta-white" style={{ alignSelf: 'flex-start' }} onClick={() => navigate('/register')}>Enter Library</button>
                         </div>
                         <div style={{ position: 'relative', borderRadius: '64px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200" 
                                style={{ width: '100%', opacity: 0.4, display: 'block' }}
                                alt="Expert Video Session"
                            />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '96px', height: '96px', background: 'white', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pub-red)', cursor: 'pointer', transition: 'transform 0.3s' }}>
                                    <PlayCircle size={48} />
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* --- IMPORTANT INFO --- */}
            <section className="lp-section" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'white', padding: '64px', borderRadius: '64px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#111', textTransform: 'uppercase', marginBottom: '40px' }}>Global Compliance</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--pub-text-muted)', lineHeight: '1.8', fontSize: '16px' }}>
                        <p>Education is the foundation of disciplined trading. Bulvera provides the resources, but success depends on strategy and risk management.</p>
                        <p>Our platform adheres to strict regulatory standards. Please verify your eligibility in your jurisdiction before trading with real funds.</p>
                        <div style={{ height: '1px', background: '#e2e8f0', margin: '16px 0' }}></div>
                        <p style={{ color: 'var(--pub-red)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '14px' }}>HIGH RISK WARNING: CFDs ARE COMPLEX INSTRUMENTS AND COME WITH A HIGH RISK OF LOSING MONEY RAPIDLY DUE TO LEVERAGE.</p>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block" style={{ marginBottom: '120px' }}>
                <h2 style={{ textAlign: 'center' }}>Ready to Begin Your Journey?</h2>
                <div style={{ marginTop: '60px', textAlign: 'center' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Join Bulvera University</button>
                </div>
            </section>
        </div>
    );
};

export default Education;
