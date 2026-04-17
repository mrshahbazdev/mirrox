import { 
    CheckCircle2, ArrowRight, Shield, Zap, TrendingUp, 
    Globe, Wallet, BadgeCheck, Users, Headphones, BarChart,
    Search, Filter, ChevronRight, FileText, PlayCircle, Monitor
} from 'lucide-react';

const CfdList = () => {
    const [activeTab, setActiveTab] = useState('forex');

    const tabs = [
        { id: 'forex', label: 'Forex' },
        { id: 'indices', label: 'Indices' },
        { id: 'commodities', label: 'Commodities' },
        { id: 'stocks', label: 'Stocks' },
        { id: 'crypto', label: 'Crypto' }
    ];

    const cfdData = {
        forex: [
            { symbol: "EURUSD", name: "Euro / US Dollar", spread: "0.2", commission: "0", leverage: "1:500", hours: "24/5" },
            { symbol: "GBPUSD", name: "Great Britain Pound / US Dollar", spread: "0.5", commission: "0", leverage: "1:500", hours: "24/5" },
            { symbol: "USDJPY", name: "US Dollar / Japanese Yen", spread: "0.4", commission: "0", leverage: "1:500", hours: "24/5" },
            { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", spread: "0.6", commission: "0", leverage: "1:500", hours: "24/5" },
            { symbol: "USDCAD", name: "US Dollar / Canadian Dollar", spread: "0.7", commission: "0", leverage: "1:500", hours: "24/5" },
        ],
        indices: [
            { symbol: "US500", name: "S&P 500 Index", spread: "0.5", commission: "0", leverage: "1:400", hours: "24/5" },
            { symbol: "US30", name: "Wall Street 30", spread: "1.2", commission: "0", leverage: "1:400", hours: "24/5" },
            { symbol: "USTEC", name: "US Tech 100", spread: "0.8", commission: "0", leverage: "1:400", hours: "24/5" },
            { symbol: "GER40", name: "Germany 40", spread: "1.0", commission: "0", leverage: "1:400", hours: "24/5" },
        ],
        crypto: [
            { symbol: "BTCUSD", name: "Bitcoin / USD", spread: "15.0", commission: "0", leverage: "1:20", hours: "24/7" },
            { symbol: "ETHUSD", name: "Ethereum / USD", spread: "2.0", commission: "0", leverage: "1:20", hours: "24/7" },
            { symbol: "LTCUSD", name: "Litecoin / USD", spread: "0.5", commission: "0", leverage: "1:20", hours: "24/7" },
        ]
    };

    const currentData = cfdData[activeTab] || cfdData['forex'];
    const navigate = (path) => { window.location.href = path; };

    return (
        <div className="lp-wrapper">
            {/* HERO SECTION */}
            <section className="pub-content-hero" style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)' }}>CFD <span style={{ color: 'var(--pub-red)' }}>Specifications</span></h1>
                    <p style={{ margin: '24px auto 0', fontSize: '20px', maxWidth: '750px' }}>
                        The full matrix of institutional financial instruments. Detailed transparency on spreads, leverage, and trading schedules.
                    </p>
                </div>
            </section>

            {/* DATA MATRIX SECTION */}
            <section style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    
                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '80px' }}>
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{ 
                                    padding: '16px 32px', 
                                    borderRadius: '100px', 
                                    border: '1px solid #e2e8f0', 
                                    fontSize: '11px', 
                                    fontWeight: '900', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.1em',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    background: activeTab === tab.id ? '#0b0e14' : 'transparent',
                                    color: activeTab === tab.id ? 'white' : '#64748b',
                                    boxShadow: activeTab === tab.id ? '0 20px 40px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search & Filter Bar */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', marginBottom: '40px', alignItems: 'center' }}>
                         <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                            <input 
                                type="text" 
                                placeholder="Filter institutional instruments..." 
                                style={{ width: '100%', padding: '20px 24px 20px 64px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', fontWeight: '600', outline: 'none', fontSize: '15px', color: '#111', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }} 
                            />
                         </div>
                         <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{ padding: '18px 24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Filter size={14} /> Filter
                            </button>
                         </div>
                    </div>

                    {/* Specification Table */}
                    <div className="lp-table-wrapper" style={{ borderRadius: '48px', border: '1px solid #e2e8f0', boxShadow: '0 40px 100px rgba(0,0,0,0.05)', background: 'white', padding: '16px', overflow: 'hidden' }}>
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '24px' }}>Asset / Symbol</th>
                                    <th style={{ textAlign: 'center' }}>Min. Spread</th>
                                    <th style={{ textAlign: 'center' }}>Commission</th>
                                    <th style={{ textAlign: 'center' }}>Leverage</th>
                                    <th style={{ textAlign: 'center' }}>Schedules</th>
                                    <th style={{ textAlign: 'right', padding: '24px' }}>Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '40px', height: '40px', background: 'var(--pub-red-soft)', color: 'var(--pub-red)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '10px' }}>
                                                    {item.symbol.slice(0,3)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '900', color: '#111', fontSize: '15px' }}>{item.symbol}</div>
                                                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>{item.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#111' }}>{item.spread}</td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#111' }}>{item.commission}</td>
                                        <td style={{ textAlign: 'center', fontWeight: '900', color: '#111' }}>{item.leverage}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{ padding: '6px 14px', background: '#ecfdf5', color: '#059669', borderRadius: '100px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>{item.hours}</span>
                                        </td>
                                        <td style={{ textAlign: 'right', padding: '24px' }}>
                                            <button className="lp-btn-primary" style={{ padding: '10px 24px', fontSize: '10px' }} onClick={() => navigate('/register')}>Trade</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* THE MIRROX EDGE */}
            <section style={{ background: '#f8fafc', padding: '160px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px', alignItems: 'center' }}>
                        <div className="lp-content-side">
                             <div className="accent-label" style={{ background: 'var(--pub-red-soft)', color: 'var(--pub-red)', padding: '8px 20px', borderRadius: '100px', display: 'inline-block', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '32px' }}>Institutional Grade</div>
                             <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#111', lineHeight: '1.1', marginBottom: '32px', textTransform: 'uppercase' }}>The <span style={{ color: 'var(--pub-red)' }}>Mirrox</span> Edge</h2>
                             <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '48px' }}>
                                Experience a paradigm shift in financial execution. Our platform is architected for institutional speed and retail accessibility.
                             </p>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                 {[
                                     { icon: <Zap size={24} />, title: "30ms Speed", desc: "Ultra-low latency execution." },
                                     { icon: <Monitor size={24} />, title: "Elite UI", desc: "Professional workspace design." },
                                     { icon: <Globe size={24} />, title: "160+ Assets", desc: "Universal liquidity access." },
                                     { icon: <Shield size={24} />, title: "Regulated", desc: "MWALI licensed security." }
                                 ].map((edge, i) => (
                                     <div key={i}>
                                         <div style={{ color: 'var(--pub-red)', marginBottom: '16px' }}>{edge.icon}</div>
                                         <h4 style={{ fontSize: '13px', fontWeight: '900', color: '#111', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>{edge.title}</h4>
                                         <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', fontWeight: '500' }}>{edge.desc}</p>
                                     </div>
                                 ))}
                             </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                             <div style={{ background: 'white', padding: '24px', borderRadius: '56px', boxShadow: '0 40px 100px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
                                 <img 
                                    src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=1200" 
                                    style={{ width: '100%', borderRadius: '40px', display: 'block' }}
                                    alt="Elite Platform"
                                 />
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="lp-cta-block" style={{ marginBottom: '160px' }}>
                <h2>Deploy Your Capital with Mirrox</h2>
                <div style={{ marginTop: '48px' }}>
                    <button className="lp-cta-white" onClick={() => navigate('/register')}>Launch Terminal</button>
                </div>
            </section>

            <footer style={{ textAlign: 'center', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: '2' }}>
                    Risk Warning: Trading derivative instruments carries significant risk. Capital is at risk.
                </p>
            </footer>
        </div>
    );
};

export default CfdList;
