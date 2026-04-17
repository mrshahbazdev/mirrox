import { BookOpen, PlayCircle, ArrowRight, Zap, Globe, Shield } from 'lucide-react';

const Education = () => {
    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1>Mirrox Education Center</h1>
                    <p>
                        Master the Markets with Professional Learning Resources
                    </p>
                </div>
            </section>

            {/* --- EDUCATION GRID --- */}
            <section style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2>Empower Your Trading Strategy</h2>
                        <p style={{ marginTop: '16px', color: '#94a3b8', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}>Comprehensive guides from beginner to advanced</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                        {[
                            { title: "Introduction to CFDs", desc: "Understand the fundamentals of trading contracts for difference.", icon: <BookOpen size={32} /> },
                            { title: "Technical Analysis", desc: "Learn to read charts, patterns, and master technical indicators.", icon: <Zap size={32} /> },
                            { title: "Risk Management", desc: "Essential techniques to protect your capital and manage volatility.", icon: <Shield size={32} /> },
                            { title: "Global Markets", desc: "Deep dive into Forex, Stocks, Indices, and Commodities.", icon: <Globe size={32} /> }
                        ].map((course, i) => (
                            <div key={i} style={{ padding: '48px', background: 'white', borderRadius: '40px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '24px', transition: 'all 0.3s' }}>
                                <div style={{ color: 'var(--pub-red)' }}>{course.icon}</div>
                                <div>
                                    <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase', marginBottom: '16px' }}>{course.title}</h3>
                                    <p style={{ color: 'var(--pub-text-muted)', lineHeight: '1.6', fontSize: '16px' }}>{course.desc}</p>
                                </div>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--pub-red)', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer', marginTop: 'auto' }}>
                                    Start Learning <ArrowRight size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- VIDEO TUTORIALS --- */}
            <section style={{ background: '#0b0e14', padding: '120px 24px', color: 'white' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                         <div className="lp-content-side">
                             <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255,77,94,0.1)', color: 'var(--pub-red)', borderRadius: '100px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px' }}>Video Library</div>
                             <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: 'white', lineHeight: '1.2', marginBottom: '24px' }}>Watch and Learn Anywhere</h2>
                             <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
                                Get access to high-quality video tutorials led by industry experts. From platform walkthroughs to live market analysis.
                             </p>
                             <button className="lp-cta-white">Access Library</button>
                         </div>
                         <div style={{ position: 'relative', borderRadius: '48px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800" 
                                style={{ width: '100%', opacity: 0.6 }}
                                alt="Video Tutorial"
                            />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pub-red)', cursor: 'pointer' }}>
                                    <PlayCircle size={40} />
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* --- IMPORTANT INFO --- */}
            <section style={{ padding: '80px 24px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#f8fafc', padding: '64px', borderRadius: '48px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase', marginBottom: '32px' }}>Important Information</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--pub-text-muted)', lineHeight: '1.6' }}>
                        <p>Join Mirrox and start trading to make every trade count.</p>
                        <p>This website uses cookies, please check our Cookies Policy for more information.</p>
                        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />
                        <p style={{ color: '#ef4444', fontWeight: '700' }}>Please note that Mirrox does not accept traders from certain jurisdictions. Verify your eligibility before registration.</p>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2 style={{ textAlign: 'center' }}>Elevate Your Trading Knowledge</h2>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="lp-cta-white">Open Free Account</button>
                </div>
            </section>
        </div>
    );
};

export default Education;
