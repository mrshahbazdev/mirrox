import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap } from 'lucide-react';

const Forex = () => {
    const forexPairs = [
        { symbol: "EURUSD", name: "Euro / US Dollar", spread: "1.2", category: "Majors" },
        { symbol: "GBPUSD", name: "Great Britain Pound / US Dollar", spread: "1.5", category: "Majors" },
        { symbol: "USDJPY", name: "US Dollar / Japanese Yen", spread: "1.1", category: "Majors" },
        { symbol: "USDCAD", name: "US Dollar / Canadian Dollar", spread: "1.8", category: "Majors" },
        { symbol: "AUDUSD", name: "Australian Dollar / US Dollar", spread: "1.4", category: "Majors" },
        { symbol: "EURGBP", name: "Euro / Great Britain Pound", spread: "2.1", category: "Minors" },
        { symbol: "GBPCHF", name: "Great Britain Pound / Swiss Franc", spread: "2.5", category: "Minors" },
        { symbol: "AUDJPY", name: "Australian Dollar / Japanese Yen", spread: "2.3", category: "Minors" },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Forex Trading With Mirrox</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-90 leading-relaxed">
                        Navigate the world's most liquid market with professional tools and competitive spreads.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
                
                {/* SECTION 1: WHAT IS FOREX */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=800" 
                            alt="Forex Trading" 
                            className="rounded-3xl shadow-2xl border border-gray-100 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">EUR/USD</p>
                                    <p className="text-lg font-black">+1.24%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">What is Forex Trading?</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Forex trading, also known as currency trading, involves the exchange of currencies in the global market. It is the largest and most liquid financial market in the world, driven by geopolitical events and economic data.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            With Mirrox, you can trade Forex CFDs (Contracts for Difference) to participate in price movements across major, minor, and exotic pairs, 24 hours a day, 5 days a week.
                        </p>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                            Trade Now
                        </button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Benefits of Trading Forex CFDs</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Access over 45+ currency pairs with high leverage options up to 1:400 and professional analytical tools.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Competitive tight spreads starting from 0.0 pips",
                                "Zero commission on deposits",
                                "24/5 access to global markets",
                                "Lightning-fast execution with minimal slippage"
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-[#FF4D5E]">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                            View Offer
                        </button>
                    </div>
                    <div className="order-1 md:order-2 relative flex justify-center">
                         {/* Mobile Mockup Layout */}
                         <div className="w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-[12px] border-gray-800 shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20"></div>
                             <img src="https://images.unsplash.com/photo-1611224885990-ab73b391cd2a?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-80" />
                             <div className="absolute inset-0 flex flex-col justify-end p-6 space-y-4">
                                 <button className="w-full bg-[#22C55E] text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-green-500/20">BUY</button>
                                 <button className="w-full bg-[#EF4444] text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-red-500/20">SELL</button>
                             </div>
                         </div>
                    </div>
                </section>

                {/* SECTION 3: HOW TO TRADE */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" 
                            alt="Trading Tools" 
                            className="rounded-3xl shadow-2xl border border-gray-100"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">How to Trade Forex with Mirrox</h2>
                        <div className="space-y-10 mt-8">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 font-black shrink-0">1</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Choose Your Pair</h3>
                                    <p className="text-gray-500">Pick from over 45+ currency pairs including majors like EUR/USD or minors like GBP/JPY.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 font-black shrink-0">2</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Analyze & Strategy</h3>
                                    <p className="text-gray-500">Use our advanced analytical tools and real-time market data to plan your entry.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 font-black shrink-0">3</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Execute Trade</h3>
                                    <p className="text-gray-500">Securely fund your account and place your trade with zero hidden commissions.</p>
                                </div>
                            </div>
                        </div>
                        <button className="inline-block mt-8 bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Open Account
                        </button>
                    </div>
                </section>
            </div>

            {/* FOREX PAIRS TABLE */}
            <section className="bg-gray-50 py-24 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Forex Pairs Offered by Mirrox</h2>
                        <p className="text-gray-500 text-lg">Explore our competitive spreads across global currency pairs</p>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Instrument</th>
                                        <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-6 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Average Spread</th>
                                        <th className="px-8 py-6 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {forexPairs.map((pair, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-8 py-6 text-left">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#FF4D5E] font-bold text-xs ring-4 ring-red-50/50">
                                                        {pair.symbol.slice(0,3)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{pair.symbol}</p>
                                                        <p className="text-xs text-gray-400 font-bold">{pair.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-left">
                                                <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-tight">{pair.category}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center font-bold text-gray-700">{pair.spread}</td>
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
                        <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
                            <button className="text-[#FF4D5E] font-black text-xs uppercase tracking-widest flex items-center gap-2 mx-auto hover:gap-4 transition-all group">
                                View Full List <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* LEARN FOREX SECTION */}
            <section className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Learn CFD Forex Trading with Mirrox</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Education is essential in forex trading, and Mirrox offers a free Education Center to help you master the currency markets. Gain knowledge to make informed decisions, manage risks, and protect your capital.
                        </p>
                        <button className="flex items-center gap-2 bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Learn More <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        {/* Abstract Graphic View */}
                        <div className="relative w-full aspect-square flex items-center justify-center">
                           <div className="absolute inset-0 bg-[#FF4D5E]/5 rounded-full animate-pulse"></div>
                           <div className="absolute w-3/4 h-3/4 bg-[#FF4D5E]/10 rounded-full border border-[#FF4D5E]/20"></div>
                           <BarChart2 size={120} className="text-[#FF4D5E] relative z-10" />
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

export default Forex;
