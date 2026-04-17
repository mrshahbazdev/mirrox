import React from 'react';
import { 
    Shield, ShieldAlert, ShieldCheck, 
    ArrowRight, CheckCircle2, TrendingDown,
    Activity, Anchor, PieChart
} from 'lucide-react';

const RiskManagementTools = () => {
    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>Defensive <span style={{ color: 'var(--pub-red)' }}>Protocols</span></h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '750px' }}>
                        Strategic capital preservation. Deploy institutional-grade safeguards to mitigate exposure and optimize risk-adjusted performance.
                    </p>
                </div>
            </section>

            {/* HERO IMAGE */}
            <section style={{ padding: '0 24px', marginTop: '-80px', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', borderRadius: '64px', overflow: 'hidden', height: 'clamp(300px, 50vh, 600px)', boxShadow: '0 60px 120px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img 
                        src="https://images.unsplash.com/photo-1551288049-bbbda5402bd7?auto=format&fit=crop&q=80&w=1600" 
                        alt="Security Infrastructure" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </section>

            <div className="lp-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '160px 24px', display: 'flex', flexDirection: 'column', gap: '160px' }}>
                
                {/* SECTION 1: STRATEGIES */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div className="lp-content-side">
                        <div className="accent-label" style={{ background: 'var(--pub-red-soft)', color: 'var(--pub-red)', padding: '8px 20px', borderRadius: '100px', display: 'inline-block', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '32px' }}>Operational Safety</div>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '40px', textTransform: 'uppercase' }}>Hardened <span style={{ color: 'var(--pub-red)' }}>Strategies</span></h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            {[
                                { t: "Stop-Loss Architecture", d: "Automated exit protocols that terminate positions at predefined price points to enforce discipline." },
                                { t: "Calculated Sizing", d: "Algorithmically determined position limits based on real-time equity and volatility parameters." },
                                { t: "Asset Diversification", d: "Systematic risk distribution across non-correlated global markets and instrument classes." },
                                { t: "Strategic Hedging", d: "Contrasting exposure models designed to neutralize delta and protect during extreme events." }
                            ].map((s, i)=>(
                                <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '36px', height: '36px', background: '#0b0e14', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px', fontWeight: '900' }}>{i+1}</div>
                                    <div style={{ flex: '1' }}>
                                        <h4 style={{ fontSize: '16px', fontWeight: '900', color: '#111', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>{s.t}</h4>
                                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '15px', lineHeight: '1.7' }}>{s.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ position: 'relative', background: '#f8fafc', padding: '80px', borderRadius: '64px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <div style={{ position: 'relative', background: 'white', borderRadius: '48px', padding: '64px', width: '100%', maxWidth: '400px', boxShadow: '0 40px 100px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                             <Shield size={80} style={{ color: 'var(--pub-red)', opacity: 0.03, position: 'absolute', top: '32px', right: '32px' }} />
                             <div style={{ width: '100px', height: '100px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px auto' }}>
                                <ShieldCheck size={48} />
                             </div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '100px', width: '100%' }}></div>
                                <div style={{ height: '10px', background: '#fee2e2', borderRadius: '100px', width: '80%', margin: '0 auto' }}></div>
                                <div style={{ height: '10px', background: 'var(--pub-red)', borderRadius: '100px', width: '60%', margin: '0 auto' }}></div>
                             </div>
                             <h4 style={{ marginTop: '40px', fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Protocol Status: Active</h4>
                         </div>
                    </div>
                </section>

                {/* SECTION 2: WHY YOU NEED THEM */}
                <section>
                    <div className="lp-section-header" style={{ textAlign: 'center', marginBottom: '100px' }}>
                        <h2 style={{ textTransform: 'uppercase' }}>The Core of <span style={{ color: 'var(--pub-red)' }}>Permanence</span></h2>
                        <div className="accent-line" style={{ margin: '24px auto' }}></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
                         {[
                             { title: "Capital Fortress", desc: "Our infrastructure ensures no single market anomaly can compromise your long-term liquidity.", icon: <Anchor size={40} /> },
                             { title: "Psychological Edge", desc: "Remove heuristic biases with automated execution boundaries that maintain operational poise.", icon: <Activity size={40} /> },
                             { title: "Exponential Growth", desc: "Sustainable scaling is only possible through rigorous control of detrimental drawdowns.", icon: <PieChart size={40} /> }
                         ].map((item, i) => (
                             <div key={i} style={{ background: 'white', padding: '64px 48px', borderRadius: '56px', border: '1px solid #e2e8f0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '32px', transition: 'all 0.4s ease', boxShadow: '0 20px 60px rgba(0,0,0,0.02)' }}>
                                 <div style={{ width: '80px', height: '80px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                     {item.icon}
                                 </div>
                                 <div>
                                    <h4 style={{ fontSize: '22px', fontWeight: '900', color: '#111', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.05em' }}>{item.title}</h4>
                                    <p style={{ color: 'var(--pub-text-muted)', fontSize: '16px', lineHeight: '1.7' }}>{item.desc}</p>
                                 </div>
                             </div>
                         ))}
                    </div>
                </section>

                 {/* SECTION 3: HOW TO UTILIZE */}
                 <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', background: '#0b0e14', height: '500px', borderRadius: '64px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}>
                         <img 
                            src="https://images.unsplash.com/photo-1543286386-713bcd549651?auto=format&fit=crop&q=80&w=1200" 
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
                            alt="Institutional Intel"
                         />
                         <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '48px' }}>
                            <h3 style={{ color: 'white', fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '32px', letterSpacing: '0.1em' }}>Institutional Console</h3>
                            <button className="lp-cta-white" onClick={() => navigate('/register')}>Access Terminal</button>
                         </div>
                    </div>
                    <div className="lp-content-side">
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>Native <span style={{ color: 'var(--pub-red)' }}>Integration</span></h2>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' }}>
                            The Mirrox terminal embeds trailing stops and take-profit mechanisms directly into the trade-lifecycle, ensuring zero-latency protection.
                        </p>
                        <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7' }}>
                            Coupled with Negative Balance Protection and Dynamic Margin scaling, our environment provides the ultimate safety net for elite operations.
                        </p>
                    </div>
                </section>

                {/* SECTION 4: MONITORING */}
                <section>
                     <div style={{ padding: '80px 56px', background: '#0b0e14', borderRadius: '64px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                        <h3 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '900', color: 'white', textTransform: 'uppercase', marginBottom: '32px', letterSpacing: '0.05em' }}>Perpetual <span style={{ color: 'var(--pub-red)' }}>Vigilance</span></h3>
                        <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: '1.8', maxWidth: '1000px', margin: '0 auto', fontWeight: '500' }}>
                            Risk management is an iterative science. Mirrox delivers the analytical telemetry required to monitor exposures 24/7, enabling you to calibrate risk parameters as global market volatility evolves.
                        </p>
                     </div>
                </section>
            </div>

            {/* FINAL CTA */}
            <section className="lp-cta-block" style={{ marginBottom: '160px' }}>
                <h2>Commit to Excellence. Start Trading.</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Launch Live Account</button>
                </div>
            </section>
        </div>
    );
};

export default RiskManagementTools;
