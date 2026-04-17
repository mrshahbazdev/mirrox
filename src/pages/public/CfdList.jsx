import React, { useState } from 'react';
import { 
    CheckCircle2, ArrowRight, Shield, Zap, TrendingUp, 
    Globe, Wallet, BadgeCheck, Users, Headphones, BarChart,
    Search, Filter, ChevronRight, FileText, PlayCircle
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

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1>Mirrox CFD Specification</h1>
                    <p>
                        Find the full range of CFD instruments and enhance your trading experience.
                    </p>
                </div>
            </section>

            {/* --- DATA MATRIX SECTION --- */}
            <section style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    
                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '64px' }}>
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{ 
                                    padding: '16px 40px', 
                                    borderRadius: '16px', 
                                    border: 'none', 
                                    fontSize: '12px', 
                                    fontWeight: '900', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.1em',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    background: activeTab === tab.id ? 'var(--pub-red)' : '#f8fafc',
                                    color: activeTab === tab.id ? 'white' : '#94a3b8',
                                    boxShadow: activeTab === tab.id ? '0 10px 20px rgba(255,77,94,0.2)' : 'none'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search & Filter Bar */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px', alignItems: 'center', justifyContent: 'space-between' }}>
                         <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
                            <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                            <input 
                                type="text" 
                                placeholder="Search instruments..." 
                                style={{ width: '100%', padding: '16px 24px 16px 56px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', fontWeight: '500', outline: 'none' }} 
                            />
                         </div>
                         <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{ padding: '16px 24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b', cursor: 'pointer' }}>Filter</button>
                            <button style={{ padding: '16px 24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b', cursor: 'pointer' }}>Performance</button>
                         </div>
                    </div>

                    {/* Specification Table */}
                    <div className="lp-table-wrapper">
                        <table className="lp-table">
                            <thead>
                                <tr>
                                    <th>Asset / Symbol</th>
                                    <th style={{ textAlign: 'center' }}>Min. Spread</th>
                                    <th style={{ textAlign: 'center' }}>Commission</th>
                                    <th style={{ textAlign: 'center' }}>Leverage</th>
                                    <th style={{ textAlign: 'center' }}>Trading Hours</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div className="asset-badge" style={{ background: '#fff1f2', color: 'var(--pub-red)' }}>
                                                    {item.symbol.slice(0,3)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '900', color: '#1a1a1a', fontSize: '16px' }}>{item.symbol}</div>
                                                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>{item.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: '800', color: '#1a1a1a' }}>{item.spread}</td>
                                        <td style={{ textAlign: 'center', fontWeight: '800', color: '#1a1a1a' }}>{item.commission}</td>
                                        <td style={{ textAlign: 'center', fontWeight: '800', color: '#1a1a1a' }}>{item.leverage}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#16a34a', borderRadius: '8px', fontSize: '10px', fontWeight: '900' }}>{item.hours}</span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button style={{ padding: '8px 24px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer' }}>Trade</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* --- THE MIRROX EDGE --- */}
            <section style={{ background: '#f8fafc', padding: '120px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', alignItems: 'center' }}>
                        <div className="lp-content-side">
                             <div style={{ display: 'inline-block', padding: '6px 16px', background: '#fff1f2', color: 'var(--pub-red)', borderRadius: '100px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px' }}>Industry Leader</div>
                             <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.2', marginBottom: '24px' }}>The Mirrox Edge</h2>
                             <p style={{ color: 'var(--pub-text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' }}>
                                Experience the future of online trading with Mirrox. Our platform is designed to offer you a seamless and powerful experience across all global financial markets.
                             </p>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                 {[
                                     { icon: <Zap size={24} />, title: "One-Click", desc: "Execute trades in milliseconds." },
                                     { icon: <Monitor size={24} />, title: "Intuitive UI", desc: "User-friendly and powerful navigation." },
                                     { icon: <Globe size={24} />, title: "Global Access", desc: "160+ assets at your fingertips." },
                                     { icon: <Shield size={24} />, title: "Regulated", desc: "MWALI licensed & secure funds." }
                                 ].map((edge, i) => (
                                     <div key={i}>
                                         <div style={{ color: 'var(--pub-red)', marginBottom: '16px' }}>{edge.icon}</div>
                                         <h4 style={{ fontSize: '14px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase', marginBottom: '8px' }}>{edge.title}</h4>
                                         <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4', fontWeight: '600' }}>{edge.desc}</p>
                                     </div>
                                 ))}
                             </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                             <img 
                                src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=800" 
                                style={{ width: '100%', borderRadius: '48px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}
                                alt="Platform Showcase"
                             />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2 style={{ textAlign: 'center' }}>Join Mirrox and Start Trading</h2>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="lp-cta-white">Open Account</button>
                </div>
            </section>

            <footer className="text-center pb-16 px-6">
                <p className="max-w-4xl mx-auto text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-80 decoration-dotted underline underline-offset-4">
                    NOTE: TRADING CFDs INVOLVES SIGNIFICANT RISK AND MAY NOT BE SUITABLE FOR ALL INVESTORS.
                </p>
            </footer>
        </div>
    );
};

const Monitor = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
);

export default CfdList;
