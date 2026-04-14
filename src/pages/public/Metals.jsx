import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap, Diamond, Globe } from 'lucide-react';

const Metals = () => {
    const metalData = [
        { symbol: "XAUUSD", name: "Gold / US Dollar", spread: "0.25", category: "Precious" },
        { symbol: "XAGUSD", name: "Silver / US Dollar", spread: "0.015", category: "Precious" },
        { symbol: "XPTUSD", name: "Platinum / US Dollar", spread: "1.5", category: "Precious" },
        { symbol: "XPDUSD", name: "Palladium / US Dollar", spread: "3.2", category: "Precious" },
        { symbol: "ALU", name: "Aluminum", spread: "0.5", category: "Industrial" },
        { symbol: "COPPER", name: "Copper", spread: "0.002", category: "Industrial" },
        { symbol: "NICKEL", name: "Nickel", spread: "2.5", category: "Industrial" },
        { symbol: "ZINC", name: "Zinc", spread: "1.0", category: "Industrial" },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-tight">Metal Trading <br/>With Mirrox</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-90 leading-relaxed">
                        Hedge against inflation and diversify your portfolio with precious and industrial metals on a professional platform.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
                
                {/* SECTION 1: WHAT IS METAL TRADING */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" 
                            alt="Metal Trading" 
                            className="rounded-3xl shadow-2xl border border-gray-100 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600">
                                    <Diamond size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">GOLD (XAU)</p>
                                    <p className="text-lg font-black text-gray-900">$2,345.50</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">What is Metal Trading?</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Metal trading involves the buying and selling of precious metals like Gold and Silver, which have held value for thousands of years.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Mirrox provides CFD trading on these valuable commodities, offering you the opportunity to respond to global economic shifts and industrial demand with ultra-fast execution and no physical storage worries.
                        </p>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Trade Metals
                        </button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Benefits of Trading Metals CFDs</h2>
                        <ul className="space-y-4">
                            {[
                                "Gold & Silver as primary safe-haven assets",
                                "Professional-grade analytical tools and charts",
                                "Zero commissions and ultra-tight spreads",
                                "High leverage options for diverse market strategies"
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-[#FF4D5E]">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                            Learn More
                        </button>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="w-full h-80 bg-gray-900 rounded-[3rem] border-[12px] border-gray-800 shadow-2xl relative overflow-hidden flex items-center justify-center p-1">
                             <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-50" />
                             <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-transparent to-red-900/40">
                                 <TrendingUp size={64} className="text-white mb-4" />
                                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Real-Time Metal Charts</h3>
                             </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: HOW TO TRADE */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" 
                            alt="Trading Execution" 
                            className="rounded-3xl shadow-2xl border border-gray-100"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">How to Trade Metals with Mirrox</h2>
                        <div className="mt-8 space-y-10">
                            {[
                                { title: "Choose Your Metal", desc: "Select from Gold, Silver, Platinum, or industrial metals like Copper." },
                                { title: "Strategic Planning", desc: "Use indicators and market news to define your buy or sell signals." },
                                { title: "Instant Execution", desc: "Open your trade with precision on our secure and reliable platform." }
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

            {/* METALS TABLE */}
            <section className="bg-gray-50 py-24 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight">Metals Offered by Mirrox</h2>
                        <p className="text-gray-500 text-lg">Hedge your portfolio with precious metals at institutional-grade spreads</p>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Metal Pair</th>
                                        <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-6 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Spread From</th>
                                        <th className="px-8 py-6 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {metalData.map((metal, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 font-bold text-[10px] ring-4 ring-gray-100/50 group-hover:bg-[#FF4D5E] group-hover:text-white transition-all">
                                                        {metal.symbol.slice(0,3)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{metal.symbol}</p>
                                                        <p className="text-xs text-gray-400 font-bold">{metal.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-tight">{metal.category}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center font-bold text-gray-700">{metal.spread}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="px-4 py-2 bg-green-500 text-white text-[10px] font-black rounded-lg hover:bg-green-600 transition-shadow shadow shadow-green-500/10 uppercase tracking-widest">Buy</button>
                                                    <button className="px-4 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg hover:bg-red-600 transition-shadow shadow shadow-red-500/10 uppercase tracking-widest">Sell</button>
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

             {/* LEARN METALS SECTION */}
             <section className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Learn CFD Metal Trading with Mirrox</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Master the factors that influence precious metals. Our Education Center provides free resources for risk management and specialized trading tactics.
                        </p>
                        <button className="flex items-center gap-2 bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Join Learning Hub <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-2xl group">
                             <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                             <div className="absolute inset-0 bg-red-900/10 flex items-center justify-center">
                                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF4D5E] shadow-2xl hover:scale-110 transition-transform">
                                     <Globe size={32} />
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

export default Metals;
