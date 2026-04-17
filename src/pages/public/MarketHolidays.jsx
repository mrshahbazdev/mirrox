import React from 'react';
import { 
    Calendar, Globe, Shield, Zap, ArrowRight,
    Search, Filter, Info, Clock, CheckCircle2
} from 'lucide-react';

const MarketHolidays = () => {
    const holidayData = [
        { symbol: "BTCUSD", country: "Global", dates: ["Normal", "Normal", "Normal", "Normal", "Normal", "Normal"] },
        { symbol: "GER40", country: "Germany", dates: ["Closed", "Normal", "Special", "Closed", "Normal", "Normal"] },
        { symbol: "US500", country: "USA", dates: ["Closed", "Normal", "Normal", "Closed", "Special", "Normal"] },
        { symbol: "UK100", country: "UK", dates: ["Closed", "Normal", "Normal", "Closed", "Normal", "Normal"] },
        { symbol: "JAP225", country: "Japan", dates: ["Closed", "Special", "Normal", "Normal", "Normal", "Normal"] },
        { symbol: "Gold", country: "Metal", dates: ["Special", "Normal", "Normal", "Special", "Normal", "Normal"] },
        { symbol: "Silver", country: "Metal", dates: ["Special", "Normal", "Normal", "Special", "Normal", "Normal"] },
        { symbol: "Brent", country: "Energy", dates: ["Normal", "Normal", "Normal", "Special", "Normal", "Normal"] },
    ];

    const holidayDates = ["Jan 01", "Apr 18", "Apr 21", "May 01", "Dec 25", "Dec 26"];
    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>Market <span style={{ color: 'var(--pub-red)' }}>Holidays</span></h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '750px' }}>
                        Global financial centers never sleep, but they do take breaks. Track international exchange holidays and adjusted liquidity windows.
                    </p>
                </div>
            </section>

            {/* HOLIDAY GRID */}
            <section style={{ padding: '160px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginBottom: '80px', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                         <div className="lp-section-header">
                            <h2 style={{ textTransform: 'uppercase' }}>Trading <span style={{ color: 'var(--pub-red)' }}>Calendar</span> 24/25</h2>
                            <div className="accent-line" style={{ marginTop: '24px' }}></div>
                         </div>
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', background: 'white', padding: '12px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                            <div style={{ padding: '8px 16px', background: '#ecfdf5', color: '#059669', borderRadius: '12px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Normal</div>
                            <div style={{ padding: '8px 16px', background: '#fff1f2', color: '#e11d48', borderRadius: '12px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Closed</div>
                            <div style={{ padding: '8px 16px', background: '#eff6ff', color: '#2563eb', borderRadius: '12px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Special</div>
                         </div>
                    </div>

                    <div className="lp-table-wrapper" style={{ borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.06)', background: 'white', padding: '24px', overflow: 'hidden' }}>
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '24px' }}>Institutional Asset</th>
                                    <th>Region</th>
                                    {holidayDates.map((date, i) => (
                                        <th key={i} style={{ textAlign: 'center' }}>{date}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {holidayData.map((row, idx) => (
                                    <tr key={idx}>
                                        <td style={{ fontWeight: '900', color: '#111', textTransform: 'uppercase', padding: '24px', fontSize: '14px' }}>{row.symbol}</td>
                                        <td style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.country}</td>
                                        {row.dates.map((status, i) => (
                                            <td key={i} style={{ textAlign: 'center' }}>
                                                <span style={{ 
                                                    padding: '6px 14px', 
                                                    borderRadius: '100px', 
                                                    fontSize: '9px', 
                                                    fontWeight: '900', 
                                                    textTransform: 'uppercase',
                                                    background: status === 'Normal' ? '#ecfdf5' : status === 'Closed' ? '#fff1f2' : '#eff6ff',
                                                    color: status === 'Normal' ? '#059669' : status === 'Closed' ? '#e11d48' : '#2563eb'
                                                }}>
                                                    {status}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '80px', padding: '56px', background: '#0b0e14', borderRadius: '64px', border: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '40px', alignItems: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pub-red)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Info size={40} />
                        </div>
                        <div style={{ flex: '1' }}>
                             <h4 style={{ fontSize: '14px', fontWeight: '900', color: 'white', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>Institutional Protocol</h4>
                             <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.7', fontWeight: '500' }}>
                                Market liquidity and execution spreads are subject to volatility during holiday cycles. 
                                Mirrox provides these schedules as benchmark data; however, regional settlement conditions may fluctuate. 
                                Verify real-time terminal hours for precise operational planning.
                             </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="lp-cta-block" style={{ marginBottom: '160px' }}>
                <h2>Execute with Global Precision</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Launch Terminal</button>
                </div>
            </section>

             <footer style={{ textAlign: 'center', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: '2' }}>
                    Disclaimer: Market schedules are subject to liquidity provider adjustments and exchange discretion.
                </p>
            </footer>
        </div>
    );
};

export default MarketHolidays;
