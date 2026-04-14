import React from 'react';
import { 
    Shield, Zap, Headphones, ArrowRight, BookOpen, BarChart2, 
    Globe, Cpu, Clock, Smartphone, CheckCircle2, TrendingUp, 
    Coins, Wallet, Terminal, Search, Activity
} from 'lucide-react';

const HomePublic = () => {
    const marketAssets = [
        { symbol: "EURUSD", name: "Euro / US Dollar", price: "1.0842", change: "+0.15%", up: true },
        { symbol: "XAUUSD", name: "Gold / US Dollar", price: "2,354.20", change: "-0.45%", up: false },
        { symbol: "BTCUSD", name: "Bitcoin / US Dollar", price: "64,230.50", change: "+2.41%", up: true },
        { symbol: "US500", name: "S&P 500 Index", price: "5,123.32", change: "+1.22%", up: true },
    ];

    return (
        <div className="bg-white overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen bg-[#0b0e14] pt-32 pb-24 px-6 overflow-hidden flex flex-col items-center">
                {/* Visual Background Elements */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FF4D5E] opacity-[0.08] rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
                        Trade <span className="text-[#FF4D5E]">CFDs</span> on Forex,<br className="hidden md:block"/>
                        Stocks, Indices,<br className="hidden md:block"/>
                        Commodities and More!
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed opacity-80">
                        Experience the gold standard of trading with Mirrox. 
                        Professional tools, institutional liquidity, and ultra-fast execution.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-24">
                        <button className="bg-[#FF4D5E] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(255,77,94,0.3)] hover:scale-105 transition-transform">
                            Get Started
                        </button>
                    </div>

                    {/* Hero Mockup */}
                    <div className="relative max-w-5xl mx-auto group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF4D5E] to-transparent rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-gray-900 rounded-[2rem] border-[8px] border-white/5 shadow-2xl overflow-hidden p-2">
                             <img 
                                src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=1400" 
                                alt="Platform UI" 
                                className="w-full h-auto rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                             />
                        </div>
                        
                        {/* Floating Coins */}
                        <div className="absolute -top-10 left-[10%] animate-bounce duration-[3000ms] hidden lg:block">
                            <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-orange-400 shadow-2xl">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                        <div className="absolute top-20 -right-12 animate-pulse hidden lg:block">
                            <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-blue-400 shadow-2xl">
                                <Activity size={28} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ABOUT TRADING --- */}
            <div className="max-w-7xl mx-auto px-6 py-32 space-y-48">
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative group">
                        {/* Double Phone Mockup Style */}
                        <div className="flex justify-center -space-x-16">
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" 
                                className="w-[280px] h-[580px] object-cover rounded-[3rem] border-[12px] border-white shadow-2xl transform -rotate-6 group-hover:-rotate-3 transition-transform duration-700 hover:z-20"
                                alt="Mobile App Left"
                            />
                            <img 
                                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600" 
                                className="w-[280px] h-[580px] object-cover rounded-[3rem] border-[12px] border-white shadow-2xl transform rotate-6 mt-16 group-hover:rotate-3 transition-transform duration-700"
                                alt="Mobile App Right"
                            />
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-red-50 text-[#FF4D5E] font-black text-[10px] rounded-full uppercase tracking-widest mb-2">
                           Multi-Asset Excellence
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1]">We Are All About Trading</h2>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium">
                            Experience an abundance of possibilities with Mirrox. Diversify your portfolio with access to over 160+ assets, including Forex, Commodities, and Crypto. 
                        </p>
                        <p className="text-gray-500">
                             Our platform features industry-standard risk management tools and extensive resources to support every step of your journey.
                        </p>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Open Account
                        </button>
                    </div>
                </section>

                {/* --- GLOBAL ACCESS --- */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1 space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-red-50 text-[#FF4D5E] font-black text-[10px] rounded-full uppercase tracking-widest mb-2">
                           Global Markets
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1]">Global Access</h2>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium">
                            Trade from anywhere with Mirrox. Our web-based platform offers robust features, ensuring you never miss a trading opportunity.
                        </p>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Start Trading
                        </button>
                    </div>
                    <div className="order-1 md:order-2 relative">
                        <div className="relative bg-white rounded-3xl p-4 shadow-2xl border border-gray-100 group">
                             <img 
                                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200" 
                                alt="Web Trading" 
                                className="rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                             />
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF4D5E] shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                                <TrendingUp size={32} />
                             </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* --- MIRROX EDGE --- */}
            <section className="bg-gray-50 py-32 border-y border-gray-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter">The Mirrox Edge</h2>
                        <div className="w-24 h-2 bg-[#FF4D5E] mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Edge Card 1: Effortless Trading */}
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-10 group">
                            <div className="space-y-4">
                                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#FF4D5E]">
                                    <Zap size={28} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">Effortless Trading</h3>
                                <div className="space-y-2 text-gray-500 font-bold text-sm uppercase">
                                    <p className="flex items-center gap-2"><CheckCircle2 size={14} /> Intuitive Interface</p>
                                    <p className="flex items-center gap-2"><CheckCircle2 size={14} /> One-Click Trading</p>
                                </div>
                            </div>
                            {/* Mock UI Element */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 group-hover:bg-red-50/30 transition-colors">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-xs font-black text-gray-400">ORDER TICKET</span>
                                    <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded">NEW</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-500 h-12 rounded-xl flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-green-500/20">Buy</div>
                                    <div className="bg-red-500 h-12 rounded-xl flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-red-500/20">Sell</div>
                                </div>
                            </div>
                        </div>

                        {/* Edge Card 2: Regulated & Secure */}
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-10 group">
                            <div className="space-y-4">
                                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#FF4D5E]">
                                    <Shield size={28} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">Regulated & Secure</h3>
                                <div className="space-y-2 text-gray-500 font-bold text-sm uppercase">
                                    <p className="flex items-center gap-2"><CheckCircle2 size={14} /> MWALI Regulation</p>
                                    <p className="flex items-center gap-2"><CheckCircle2 size={14} /> Segregated Funds</p>
                                </div>
                            </div>
                            {/* Mock UI Element */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 group-hover:bg-red-50/30 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"><Wallet size={18} className="text-gray-400" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400">BALANCE</p>
                                        <p className="text-lg font-black text-gray-900">$24,450.00</p>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#FF4D5E] w-3/4"></div>
                                </div>
                            </div>
                        </div>

                        {/* Edge Card 3: Support & Visual */}
                        <div className="relative bg-[#FF4D5E] rounded-[2.5rem] shadow-xl overflow-hidden group">
                           <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                                alt="Support Visual"
                           />
                           <div className="relative z-10 p-10 flex flex-col justify-between h-full">
                               <div className="space-y-4 text-white">
                                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <Headphones size={28} />
                                    </div>
                                    <h3 className="text-2xl font-black">Dedicated Support</h3>
                                    <p className="text-sm font-medium opacity-80 leading-relaxed uppercase tracking-wider">Multilingual experts 24/7</p>
                               </div>
                               <button className="bg-white text-[#FF4D5E] px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform mt-8">
                                   Trade Now
                               </button>
                           </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- INSTRUMENTS --- */}
            <section className="py-32 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase">Mirrox Trading Instruments</h2>
                    <p className="text-gray-500 mt-4 text-lg">Trade world-leading assets with competitive execution</p>
                </div>
                
                <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Asset</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Category</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Live Price</th>
                                    <th className="px-8 py-6 text-right text-xs font-black uppercase tracking-widest text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-medium">
                                {marketAssets.map((asset, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#FF4D5E] font-black text-[10px] ring-4 ring-red-50/50">
                                                    {asset.symbol.slice(0,3)}
                                                </div>
                                                <span className="font-black text-gray-900">{asset.symbol}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase">{asset.name}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-gray-900">{asset.price}</span>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${asset.up ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                                    {asset.change}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="px-4 py-2 bg-green-500 text-white text-[10px] font-black rounded-lg hover:shadow-lg shadow-green-500/20 uppercase tracking-widest">Buy</button>
                                                <button className="px-4 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg hover:shadow-lg shadow-red-500/20 uppercase tracking-widest">Sell</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* --- EDUCATION --- */}
            <section className="bg-gray-50 py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">Explore Our<br/>Education Center</h2>
                            <p className="text-gray-500 text-lg max-w-md font-medium">Master the art of trading with our curated curriculum and strategy guides.</p>
                        </div>
                        <button className="flex items-center gap-3 bg-white text-[#FF4D5E] px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all">
                            Browse All <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Introduction Courses", label: "Basic", icon: <BookOpen />, img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600" },
                            { title: "Trading Strategies", label: "Advanced", icon: <BarChart2 />, img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600" },
                            { title: "Expert Market Analysis", label: "Professional", icon: <Cpu />, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" }
                        ].map((course, i) => (
                            <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden flex flex-col group shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-500">
                                <div className="h-64 overflow-hidden relative">
                                    <img src={course.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.title} />
                                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#FF4D5E] text-white text-[10px] font-black rounded-full uppercase tracking-widest">{course.label}</div>
                                </div>
                                <div className="p-10 flex-1 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="text-[#FF4D5E]">{course.icon}</div>
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight">{course.title}</h3>
                                    </div>
                                    <button className="mt-10 w-full py-4 rounded-xl border-2 border-gray-50 font-black text-xs uppercase tracking-widest text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors">Start Learning</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- EXPERT TOOLS --- */}
            <section className="bg-[#0b0e14] py-40 text-white relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF4D5E] opacity-[0.05] rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">Optimize Your Trades with<br/>Expert Tools</h2>
                    <p className="text-gray-400 text-lg mb-24 max-w-2xl mx-auto font-medium">Connect to institutional-grade infrastructure and advanced analytical engines.</p>

                    {/* Central Hub Visualization */}
                    <div className="relative flex justify-center py-20">
                         {/* Centered Logo */}
                         <div className="relative z-20 w-32 h-32 bg-[#FF4D5E] rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(255,77,94,0.4)] ring-[16px] ring-[#FF4D5E]/10 animate-pulse">
                             <span className="text-4xl font-black italic tracking-tighter">M</span>
                         </div>

                         {/* Lines & Icons (Simulated CSS/Tailwind Spacing) */}
                         <div className="absolute inset-0 flex items-center justify-center">
                              {/* Top Hub */}
                              <div className="absolute -top-12 flex flex-col items-center gap-4 group">
                                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-[#FF4D5E] hover:bg-[#FF4D5E] hover:text-white transition-all cursor-pointer"><Terminal size={24} /></div>
                                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Web-Trader</span>
                              </div>
                              {/* Bottom Hub */}
                              <div className="absolute -bottom-12 flex flex-col items-center gap-4 group">
                                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-[#FF4D5E] hover:bg-[#FF4D5E] hover:text-white transition-all cursor-pointer"><Globe size={24} /></div>
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Reach</span>
                              </div>
                              {/* Left Hubs */}
                              <div className="absolute -left-20 md:-left-40 flex flex-col items-center gap-4 group">
                                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-[#FF4D5E] hover:bg-[#FF4D5E] hover:text-white transition-all cursor-pointer"><Activity size={24} /></div>
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Analysis</span>
                              </div>
                              {/* Right Hubs */}
                              <div className="absolute -right-20 md:-right-40 flex flex-col items-center gap-4 group">
                                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-[#FF4D5E] hover:bg-[#FF4D5E] hover:text-white transition-all cursor-pointer"><Search size={24} /></div>
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning</span>
                              </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* --- ACCOUNTS --- */}
            <section className="py-32 bg-white max-w-7xl mx-auto px-6">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none">Tailored Trading Accounts</h2>
                    <p className="text-gray-500 text-lg font-medium">Precision engineered for every level of trader.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-0 border border-gray-100 rounded-[3rem] overflow-hidden shadow-2xl">
                    {[
                        { name: "Micro", price: "100", features: ["1:500 Leverage", "0.9 Pips", "24/5 Support", "Web Trader"], accent: false },
                        { name: "Pro", price: "2,500", features: ["1:400 Leverage", "0.1 Pips", "24/7 Priority", "Trading Central"], accent: true },
                        { name: "VIP", price: "25,000", features: ["Custom Leverage", "Zero Spreads", "Personal Manager", "VIP Tools"], accent: false },
                    ].map((tier, i) => (
                        <div key={i} className={`p-16 text-center space-y-10 ${tier.accent ? 'bg-[#FF4D5E] text-white' : 'bg-white text-gray-900 border-x border-gray-50'}`}>
                            <div className="space-y-4">
                                <h3 className={`text-2xl font-black uppercase tracking-widest ${tier.accent ? 'text-white' : 'text-[#FF4D5E]'}`}>{tier.name}</h3>
                                <div className="flex justify-center items-end">
                                     <span className="text-sm font-black mb-6 mr-1">$</span>
                                     <span className="text-6xl font-black tracking-tighter">{tier.price}</span>
                                     <span className="text-sm font-black mb-2 ml-1 opacity-50 uppercase tracking-widest">Min</span>
                                </div>
                            </div>
                            <ul className="space-y-4 text-xs font-black uppercase tracking-widest opacity-80">
                                {tier.features.map((f, j) => <li key={j}>{f}</li>)}
                            </ul>
                            <button className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${tier.accent ? 'bg-white text-[#FF4D5E] hover:scale-105' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                                Select Plan
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto rounded-[4rem] bg-[#FF4D5E] py-32 px-10 text-center relative overflow-hidden group shadow-[0_40px_100px_rgba(255,77,94,0.3)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
                    <div className="relative z-10 space-y-12">
                        <h2 className="text-4xl md:text-8xl font-black text-white leading-tight tracking-tighter uppercase">Join Mirrox and<br/>Start Trading</h2>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <button className="bg-white text-[#FF4D5E] px-16 py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Get Started Now</button>
                            <button className="bg-transparent border-2 border-white/30 text-white px-16 py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-white/10 hover:border-white transition-all">Support Center</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePublic;
