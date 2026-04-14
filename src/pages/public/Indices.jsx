import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap } from 'lucide-react';

const Indices = () => {
    const indicesData = [
        { symbol: "US500", name: "S&P 500 Index", spread: "0.5", category: "USA" },
        { symbol: "US30", name: "Wall Street 30 (Dow Jones)", spread: "1.2", category: "USA" },
        { symbol: "USTEC", name: "US Tech 100 (Nasdaq)", spread: "0.8", category: "USA" },
        { symbol: "GER40", name: "Germany 40 (DAX)", spread: "1.0", category: "Europe" },
        { symbol: "UK100", name: "UK 100 (FTSE)", spread: "0.9", category: "Europe" },
        { symbol: "JPN225", name: "Japan 225 (Nikkei)", spread: "1.5", category: "Asia" },
        { symbol: "F40", name: "France 40 (CAC)", spread: "1.1", category: "Europe" },
        { symbol: "ESP35", name: "Spain 35 (IBEX)", spread: "2.0", category: "Europe" },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Indices Trading with Mirrox</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-90 leading-relaxed">
                        Access the world's leading equity markets and trade on the performance of entire economies.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
                
                {/* SECTION 1: WHAT IS INDEX TRADING */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" 
                            alt="Index Trading" 
                            className="rounded-3xl shadow-2xl border border-gray-100 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">What is Index Trading?</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Indices represent a collection of stocks that track the performance of a specific market segment or economy. 
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            In CFD trading, you can trade these indices without owning the underlying stocks, allowing you to profit from both rising and falling markets with high flexibility.
                        </p>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Trade CFDs
                        </button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Benefits of Trading Index CFDs</h2>
                        <ul className="space-y-4">
                            {[
                                "Diversification through a single trade",
                                "Competitive leverage up to 1:400",
                                "Global market access 24/5",
                                "No commission on deposits and low spreads"
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-[#FF4D5E]">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Explore CFDs
                        </button>
                    </div>
                    <div className="order-1 md:order-2">
                        <img 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                            alt="Analytical Charts" 
                            className="rounded-3xl shadow-2xl border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                </section>

                {/* SECTION 3: HOW TO TRADE */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800" 
                            alt="Platform View" 
                            className="rounded-3xl shadow-2xl border border-gray-100"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">How to Trade Indices with Mirrox</h2>
                        <div className="space-y-8 mt-8">
                            {[
                                { title: "Select Index", desc: "Choose your target market based on global economic analysis." },
                                { title: "Set Parameters", desc: "Define your position size, stop-loss, and take-profit levels." },
                                { title: "Execute & Monitor", desc: "Open your trade and use our tools to track performance in real-time." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 font-black shrink-0">{i+1}</div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                                        <p className="text-gray-500">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-8 bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Open Account
                        </button>
                    </div>
                </section>
            </div>

            {/* INDICES TABLE */}
            <section className="bg-gray-50 py-24 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Indices Offered by Mirrox</h2>
                        <p className="text-gray-500 text-lg">Trade on the move with competitive spreads on global indices</p>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Index</th>
                                        <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Region</th>
                                        <th className="px-8 py-6 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Spread From</th>
                                        <th className="px-8 py-6 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {indicesData.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-8 py-6 text-left">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#FF4D5E]/10 flex items-center justify-center text-[#FF4D5E] font-black text-[10px]">
                                                        {item.symbol.slice(0,3)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{item.symbol}</p>
                                                        <p className="text-xs text-gray-400 font-bold">{item.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-left">
                                                <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-tight">{item.category}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center font-bold text-gray-700">{item.spread}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="px-4 py-2 bg-green-500 text-white text-[10px] font-black rounded-lg hover:bg-green-600 transition-colors uppercase tracking-widest">Buy</button>
                                                    <button className="px-4 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg hover:bg-red-600 transition-colors uppercase tracking-widest">Sell</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* LEARN INDICES SECTION */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Learn CFD Index Trading with Mirrox</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Our Education Center provides risk management strategies, trading tactics, and market analysis to help you navigate the global indices market. 
                        </p>
                        <button className="flex items-center gap-2 bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Learn More <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="flex-1">
                         <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-gray-100 border border-gray-100">
                             <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-[#FF4D5E]/20 flex items-center justify-center">
                                 <div className="w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center text-[#FF4D5E] cursor-pointer hover:scale-110 transition-transform">
                                     <PlayCircle size={48} />
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </section>

             {/* FINALE CTA BANNER */}
             <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-[#FF4D5E] py-24 px-10 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl md:text-7xl font-black text-white leading-tight">Join Mirrox and<br/>Start Trading</h2>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <button className="bg-white text-[#FF4D5E] px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Get Started Now</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Indices;
