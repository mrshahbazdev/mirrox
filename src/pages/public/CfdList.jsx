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
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Mirrox CFD Specification</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                        Find the full range of CFD instruments and enhance your trading experience.
                    </p>
                </div>
            </section>

            {/* --- DATA MATRIX SECTION --- */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                
                {/* Tab Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#FF4D5E] text-white shadow-xl shadow-red-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between">
                     <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search instruments..." className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#FF4D5E] outline-none font-medium transition-all" />
                     </div>
                     <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 rounded-xl text-xs font-black uppercase text-gray-500 hover:bg-gray-100"><Filter size={16} /> Filter</button>
                        <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 rounded-xl text-xs font-black uppercase text-gray-500 hover:bg-gray-100"><TrendingUp size={16} /> Performance</button>
                     </div>
                </div>

                {/* Specification Table */}
                <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest">Asset / Symbol</th>
                                    <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Min. Spread</th>
                                    <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Commission</th>
                                    <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Leverage</th>
                                    <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Trading Hours</th>
                                    <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {currentData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#FF4D5E]/10 flex items-center justify-center text-[#FF4D5E] font-black text-[10px] group-hover:bg-[#FF4D5E] group-hover:text-white transition-colors">
                                                    {item.symbol.slice(0,3)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-lg tracking-tight uppercase">{item.symbol}</p>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-center font-black text-gray-900">{item.spread}</td>
                                        <td className="px-10 py-6 text-center font-black text-gray-900">{item.commission}</td>
                                        <td className="px-10 py-6 text-center font-black text-gray-900">{item.leverage}</td>
                                        <td className="px-10 py-6 text-center">
                                            <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-tight">{item.hours}</span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FF4D5E] transition-colors">
                                                Trade
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* --- THE MIRROX EDGE --- */}
            <section className="bg-gray-50 py-32 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                             <div className="inline-block px-4 py-1.5 bg-red-50 text-[#FF4D5E] font-black text-[10px] rounded-full uppercase tracking-widest">Industry Leader</div>
                             <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-tight">The Mirrox Edge</h2>
                             <p className="text-gray-500 text-lg font-medium leading-relaxed">
                                Experience the future of online trading with Mirrox. Our platform is designed to offer you a seamless and powerful experience across all global financial markets.
                             </p>
                             <div className="grid grid-cols-2 gap-8 pt-4">
                                 {[
                                     { icon: <Zap />, title: "One-Click", desc: "Execute trades in milliseconds." },
                                     { icon: <Monitor />, title: "Intuitive UI", desc: "User-friendly and powerful navigation." },
                                     { icon: <Globe />, title: "Global Access", desc: "160+ assets at your fingertips." },
                                     { icon: <Shield />, title: "Regulated", desc: "MWALI licensed & secure funds." }
                                 ].map((edge, i) => (
                                     <div key={i} className="space-y-2">
                                         <div className="text-[#FF4D5E] mb-4">{edge.icon}</div>
                                         <h4 className="text-sm font-black uppercase tracking-tight text-gray-900">{edge.title}</h4>
                                         <p className="text-xs text-gray-400 font-medium leading-relaxed">{edge.desc}</p>
                                     </div>
                                 ))}
                             </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-10 bg-gradient-to-tr from-red-100 to-transparent rounded-full blur-[100px] opacity-20"></div>
                            <div className="relative bg-white p-4 rounded-[4rem] shadow-2xl border border-gray-100 transform rotate-3">
                                 <img 
                                    src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=800" 
                                    className="rounded-[3.5rem] w-full"
                                    alt="Platform Showcase"
                                 />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- EDUCATION CENTER --- */}
            <section className="py-32 max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 space-y-6">
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter">Want to Know More?</h2>
                    <p className="text-gray-500 text-lg font-medium uppercase tracking-widest">Explore Our Education Center</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                         { title: "Introduction Courses", desc: "Learn the basics of financial markets and CFD trading foundations." },
                         { title: "Trading Strategies", desc: "Develop professional-grade strategies and technical setups." },
                         { title: "Advanced Lessons", desc: "Deepen your knowledge with complex analysis and risk modeling." }
                    ].map((course, i) => (
                        <div key={i} className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 space-y-8 group hover:-translate-y-4 transition-all duration-500">
                             <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#FF4D5E] group-hover:bg-[#FF4D5E] group-hover:text-white transition-colors duration-500">
                                <PlayCircle size={32} />
                             </div>
                             <div className="space-y-4">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{course.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{course.desc}</p>
                             </div>
                             <button className="flex items-center gap-2 text-[#FF4D5E] font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                Start Learning <ArrowRight size={14} />
                             </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="px-6 py-32">
                <div className="max-w-6xl mx-auto rounded-[4rem] bg-[#FF4D5E] py-32 px-10 text-center relative overflow-hidden group shadow-[0_45px_100px_rgba(255,77,94,0.35)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                    <div className="relative z-10 space-y-12">
                        <h2 className="text-4xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase whitespace-pre-line text-center">Join Mirrox and{"\n"}Start Trading</h2>
                        <div className="flex flex-col md:flex-row justify-center gap-6 text-center">
                            <button className="bg-white text-[#FF4D5E] px-16 py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform text-center mx-auto">
                                Open Account
                            </button>
                        </div>
                    </div>
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
