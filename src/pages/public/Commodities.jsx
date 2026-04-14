import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap, Globe, Package } from 'lucide-react';

const Commodities = () => {
    const commodityPairs = [
        { symbol: "BRENT", name: "Brent Crude Oil", spread: "0.03", category: "Energy" },
        { symbol: "WTI", name: "Crude Oil (WTI)", spread: "0.03", category: "Energy" },
        { symbol: "NGAS", name: "Natural Gas", spread: "0.005", category: "Energy" },
        { symbol: "GOLD", name: "Gold (Commodity)", spread: "0.45", category: "Metals" },
        { symbol: "SILVER", name: "Silver (Commodity)", spread: "0.03", category: "Metals" },
        { symbol: "COPPER", name: "Copper", spread: "0.002", category: "Metals" },
        { symbol: "WHEAT", name: "Wheat", spread: "0.50", category: "Agriculture" },
        { symbol: "SUGAR", name: "Sugar", spread: "0.05", category: "Agriculture" },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Commodity Trading with Mirrox</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-90 leading-relaxed">
                        Diversify your portfolio with essential raw materials and energy resources from global markets.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
                
                {/* SECTION 1: WHAT IS COMMODITY TRADING */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1518544830403-18196e81997d?auto=format&fit=crop&q=80&w=800" 
                            alt="Commodities" 
                            className="rounded-3xl shadow-2xl border border-gray-100 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">BRENT OIL</p>
                                    <p className="text-lg font-black text-gray-900">$84.50</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">What is Commodity Trading?</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Commodities, such as energy, metals, and agricultural products, are the essential raw materials of the global economy. 
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            With Mirrox, you can trade CFDs on these commodities, allowing you to speculate on price movements without the need for physical storage or delivery, providing unique diversification opportunities.
                        </p>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                            Trade CFDs
                        </button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Benefits of Trading Commodity CFDs</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Diversify your risk by trading assets that often move independently from traditional stock markets.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Inherent protection against global inflation",
                                "Seasonal price trends and predictable cycles",
                                "High volatility for short-term opportunities",
                                "Competitive leverage and zero deposit commissions"
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-[#FF4D5E]">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Explore Assets
                        </button>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="w-full h-80 bg-gray-900 rounded-[2.5rem] border-[12px] border-gray-800 shadow-2xl relative overflow-hidden flex items-center justify-center text-white">
                             {/* Mockup layout placeholder */}
                             <div className="flex flex-col items-center gap-4">
                                 <Zap size={64} className="text-[#FF4D5E]" />
                                 <div className="text-center font-black">
                                     <p className="text-2xl tracking-tighter">NATURAL GAS</p>
                                     <p className="text-[#FF4D5E] text-sm">+2.45%</p>
                                 </div>
                                 <div className="flex gap-4 mt-4">
                                     <button className="bg-green-500 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">Buy</button>
                                     <button className="bg-red-500 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">Sell</button>
                                 </div>
                             </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: HOW TO TRADE */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1524311582025-635e68344f6f?auto=format&fit=crop&q=80&w=800" 
                            alt="Trading Tools" 
                            className="rounded-3xl shadow-2xl border border-gray-100"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">How to Trade Commodities with Mirrox</h2>
                        <div className="mt-8 space-y-10">
                            {[
                                { title: "Pick Your Commodity", desc: "Choose from Energy, Metals, or Agriculture based on market trends." },
                                { title: "Define Strategy", desc: "Set entry and exit points, risk parameters, and profit targets." },
                                { title: "Execute Instantly", desc: "Place your trade on our powerful platform with ultra-fast execution." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex flex-shrink-0 items-center justify-center text-gray-900 font-black text-xl">
                                        {i+1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{step.title}</h3>
                                        <p className="text-gray-500 font-medium leading-relaxed">{step.desc}</p>
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

            {/* COMMODITIES TABLE */}
            <section className="bg-gray-50 py-24 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Commodities Offered by Mirrox</h2>
                        <p className="text-gray-500 text-lg">Trade world-leading softs and energies with competitive execution</p>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Asset</th>
                                        <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-6 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Spread From</th>
                                        <th className="px-8 py-6 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {commodityPairs.map((pair, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#FF4D5E] font-bold text-[10px] ring-4 ring-red-50/50">
                                                        {pair.symbol.slice(0,3)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{pair.symbol}</p>
                                                        <p className="text-xs text-gray-400 font-bold">{pair.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-tight">{pair.category}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center font-bold text-gray-700">{pair.spread}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="px-4 py-2 bg-green-500 text-white text-[10px] font-black rounded-lg hover:bg-green-600 transition-shadow shadow-md shadow-green-500/10 uppercase tracking-widest">Buy</button>
                                                    <button className="px-4 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg hover:bg-red-600 transition-shadow shadow-md shadow-red-500/10 uppercase tracking-widest">Sell</button>
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

             {/* LEARN COMMODITIES SECTION */}
             <section className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Learn CFD Commodity Trading with Mirrox</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Our Education Center helps you reach your goals by providing market insights to navigate fluctuations and technical analysis tools for precise market timing.
                        </p>
                        <button className="flex items-center gap-2 bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                            Start Learning <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-gray-100">
                             <img src="https://images.unsplash.com/photo-1524311582025-635e68344f6f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-red-900/10 flex items-center justify-center">
                                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF4D5E] shadow-2xl hover:scale-110 transition-transform">
                                     <TrendingUp size={32} />
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINALE CTA BANNER */}
            <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-[#FF4D5E] py-24 px-10 text-center relative overflow-hidden group border border-red-400/20">
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

export default Commodities;
