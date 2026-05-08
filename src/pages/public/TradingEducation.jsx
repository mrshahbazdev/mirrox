import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BookOpen, CheckCircle2, ArrowRight,
    TrendingUp, BarChart2, Zap, Target,
    PlayCircle
} from 'lucide-react';

const TradingEducation = () => {
    const navigate = useNavigate();

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>What are <span style={{ color: 'var(--pub-red)' }}>CFDs</span>?</h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '700px' }}>
                        Master the fundamentals of Contracts for Difference and market dynamics with our professional guides.
                    </p>
                </div>
            </section>

            {/* --- TOP IMAGE --- */}
            <section style={{ padding: '0 24px', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', borderRadius: '48px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img 
                        src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=1400" 
                        alt="Trading Markets" 
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                </div>
            </section>

            <div className="lp-section" style={{ display: 'flex', flexDirection: 'column', gap: '160px', padding: '160px 24px' }}>
                
                {/* SECTION 1: STRATEGIES */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Understanding CFD Strategies</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '24px' }}>
                            Developing a robust strategy is the key to consistent trading. Whether you're a day trader or a long-term swing trader, our tools help you analyze market trends with precision.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7' }}>
                            Understanding how to read volume, momentum, and key support/resistance levels allows you to place trades with confidence.
                        </p>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '48px', border: '1px solid #e2e8f0' }}>
                         <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" 
                            alt="Analysis Visualization" 
                            style={{ width: '100%', borderRadius: '32px', display: 'block' }}
                         />
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', textAlign: 'center', textTransform: 'uppercase' }}>The Benefits of <span style={{ color: 'var(--pub-red)' }}>CFDs</span></h2>
                    <div className="lp-grid">
                        {[
                            { t: "Leverage", d: "Trade larger positions with a smaller initial capital outlay." },
                            { t: "Diversification", d: "Access Forex, Commodities, Indices, and Crypto from one single account." },
                            { t: "Short Selling", d: "Profit from falling markets as easily as from rising markets." },
                            { t: "Flexibility", d: "No fixed contract sizes or expiration dates on most cash CFDs." }
                        ].map((b, i) => (
                            <div key={i} className="lp-card">
                                <div className="lp-icon-box">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h4 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '12px', textTransform: 'uppercase' }}>{b.t}</h4>
                                <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{b.d}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ position: 'relative' }}>
                         <div style={{ background: '#0b0e14', height: '480px', borderRadius: '48px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <img 
                                src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=1200" 
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} 
                                alt="Market Motion"
                             />
                             <div style={{ position: 'relative', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
                                <div style={{ width: '80px', height: '80px', background: 'var(--pub-red)', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', transition: 'transform 0.3s' }}>
                                    <PlayCircle size={40} />
                                </div>
                                <p style={{ color: 'white', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '12px' }}>Video: Why Trade CFDs?</p>
                             </div>
                         </div>
                    </div>
                </section>

                {/* SECTION 3: IMPORTANCE OF GOALS */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div style={{ background: 'var(--pub-red-soft)', padding: '48px', borderRadius: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <div style={{ background: 'white', width: '100%', aspectRatio: '1', borderRadius: '32px', boxShadow: '0 40px 80px rgba(255, 77, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative' }}>
                            <Target size={120} style={{ color: 'var(--pub-red)', opacity: 0.05, position: 'absolute', top: '40px', right: '40px' }} />
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ height: '16px', width: '80%', background: 'var(--pub-red)', borderRadius: '100px' }}></div>
                                <div style={{ height: '16px', width: '60%', background: '#ff7c8a', borderRadius: '100px' }}></div>
                                <div style={{ height: '16px', width: '40%', background: '#ffabb4', borderRadius: '100px' }}></div>
                            </div>
                         </div>
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Setting Your Goals</h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '24px' }}>
                           Without a clear destination, it’s impossible to plan your route. Setting realistic financial goals helps you remain disciplined during market volatility.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                            At Bulvera, we provide the tools to track your progress and adjust your strategies dynamically as you grow.
                        </p>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', color: 'var(--pub-red)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', fontSize: '13px' }} onClick={() => navigate('/register')}>
                            Start Goal Setting <ArrowRight size={18}/>
                        </button>
                    </div>
                </section>

                {/* SECTION 4: WHY BULVERA */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '80px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', textTransform: 'uppercase' }}>Why Trade with <span style={{ color: 'var(--pub-red)' }}>Bulvera</span>?</h2>
                    <div className="lp-grid">
                         {[
                             { t: "Deep Liquidity", d: "Trade major pairs and commodities with razor-sharp execution." },
                             { t: "Expert Insight", d: "Daily market analysis directly into your terminal." },
                             { t: "Regulated Peace", d: "Trade with confidence on a MISA-regulated platform." }
                         ].map((item, i)=>(
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <span style={{ fontSize: '80px', fontWeight: '900', color: 'var(--pub-red)', opacity: 0.1, fontStyle: 'italic', lineHeight: '1' }}>0{i+1}</span>
                                <h4 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase' }}>{item.t}</h4>
                                <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6' }}>{item.d}</p>
                            </div>
                         ))}
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2>Ready to Start?</h2>
                <div style={{ marginTop: '60px' }}>
                    <button className="lp-btn-primary" style={{ padding: '20px 60px', background: 'white', color: 'var(--pub-red)' }} onClick={() => navigate('/register')}>Join Bulvera Today</button>
                </div>
            </section>
        </div>
    );
};

export default TradingEducation;
