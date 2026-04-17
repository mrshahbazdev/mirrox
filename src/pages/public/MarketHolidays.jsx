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

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1>Market Holidays at Mirrox</h1>
                    <p>
                        Stay informed about global trading breaks and adjusted hours.
                    </p>
                </div>
            </section>

            {/* --- HOLIDAY GRID --- */}
            <section style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '48px', alignItems: 'center', justifyContent: 'space-between' }}>
                         <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase', marginBottom: '8px' }}>Trading Calendar 2024-25</h2>
                            <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Global Market Hours & Special Schedules</p>
                         </div>
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ padding: '8px 16px', background: '#f0fdf4', color: '#16a34a', borderRadius: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', border: '1px solid #dcfce7' }}>Normal Hours</div>
                            <div style={{ padding: '8px 16px', background: '#fff1f2', color: '#ef4444', borderRadius: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', border: '1px solid #fee2e2' }}>Closed</div>
                            <div style={{ padding: '8px 16px', background: '#eff6ff', color: '#3b82f6', borderRadius: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', border: '1px solid #dbeafe' }}>Special</div>
                         </div>
                    </div>

                    <div className="lp-table-wrapper">
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Country</th>
                                    {holidayDates.map((date, i) => (
                                        <th key={i} style={{ textAlign: 'center' }}>{date}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {holidayData.map((row, idx) => (
                                    <tr key={idx}>
                                        <td style={{ fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase' }}>{row.symbol}</td>
                                        <td style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>{row.country}</td>
                                        {row.dates.map((status, i) => (
                                            <td key={i} style={{ textAlign: 'center' }}>
                                                <span style={{ 
                                                    padding: '4px 12px', 
                                                    borderRadius: '8px', 
                                                    fontSize: '9px', 
                                                    fontWeight: '900', 
                                                    textTransform: 'uppercase',
                                                    background: status === 'Normal' ? '#f0fdf4' : status === 'Closed' ? '#fff1f2' : '#eff6ff',
                                                    color: status === 'Normal' ? '#16a34a' : status === 'Closed' ? '#ef4444' : '#3b82f6'
                                                }}>
                                                    {status === 'Normal' ? 'Normal' : status}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '48px', padding: '32px', background: '#eff6ff', borderRadius: '32px', border: '1px solid #dbeafe', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                        <div style={{ width: '48px', height: '48px', background: 'white', border: '1px solid #dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                            <Info size={24} />
                        </div>
                        <div style={{ flex: '1' }}>
                             <h4 style={{ fontSize: '12px', fontWeight: '900', color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '8px' }}>Important Note</h4>
                             <p style={{ fontSize: '14px', color: '#3b82f6', lineHeight: '1.6', fontWeight: '600' }}>
                                Market liquidity and spreads can be significantly impacted during holiday periods. 
                                Mirrox provides these dates for informational purposes; however, local market conditions may vary. 
                                Always check your trading terminal for real-time schedule updates.
                             </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2 style={{ textAlign: 'center' }}>Join Mirrox and Start Trading</h2>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Start Now</button>
                </div>
            </section>

             <footer style={{ textAlign: 'center', paddingBottom: '64px' }}>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', color: '#94a3b8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    NOTE: MARKET HOLIDAYS MAY VARY BASED ON REGIONAL LIQUIDITY PROVIDERS.
                </p>
            </footer>
        </div>
    );
};

export default MarketHolidays;
