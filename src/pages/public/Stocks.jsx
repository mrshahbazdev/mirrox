import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap, Laptop, PlayCircle } from 'lucide-react';

const Stocks = () => {
    const stockData = [
        { symbol: "AAPL", name: "Apple Inc.", spread: "0.2", category: "Tech" },
        { symbol: "AMZN", name: "Amazon.com Inc.", spread: "0.5", category: "Retail" },
        { symbol: "GOOGL", name: "Alphabet Inc.", spread: "0.4", category: "Tech" },
        { symbol: "MSFT", name: "Microsoft Corp.", spread: "0.3", category: "Tech" },
        { symbol: "META", name: "Meta Platforms Inc.", spread: "0.6", category: "Social" },
        { symbol: "TSLA", name: "Tesla Inc.", spread: "0.8", category: "Auto" },
        { symbol: "NVDA", name: "NVIDIA Corp.", spread: "0.5", category: "Tech" },
        { symbol: "NFLX", name: "Netflix Inc.", spread: "0.7", category: "Media" },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Stock Trading with Mirrox</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-90 leading-relaxed">
                        Trade CFDs on the world's most innovative companies with low barriers to entry and professional tools.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
                
                {/* SECTION 1: WHAT IS STOCK TRADING? */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=800" 
                            alt="Stock Market" 
                            className="rounded-3xl shadow-2xl border border-gray-100 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">What is Stock Trading?</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Shares represent ownership in a company and allow you to participate in its growth and success. 
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            CFD Stock trading enables you to speculate on the price movements of global stocks like Apple, Tesla, and Amazon without owning the actual shares, allowing for leverage and short-selling opportunities.
                        </p>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Trade Stocks
                        </button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Benefits of Trading Stock CFDs</h2>
                        <p className="text-gray-600 text-lg mb-8 font-medium">Enjoy a seamless experience with advanced tools tailored for modern investors.</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: "Effortless Trading", desc: "User-friendly interface with one-click trading." },
                                { title: "No Commission", desc: "Transparent pricing with zero commission on deposits." },
                                { title: "Global Access", desc: "Trade over 150+ popular stocks worldwide." },
                                { title: "Advanced Insights", desc: "Real-time price alerts and market charts." }
                            ].map((benefit, i) => (
                                <li key={i} className="space-y-2">
                                    <div className="flex items-center gap-2 text-[#FF4D5E]">
                                        <CheckCircle2 size={18} />
                                        <span className="font-bold text-gray-900">{benefit.title}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium pl-7">{benefit.desc}</p>
                                </li>
                            ))}
                        </ul>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all mt-8">
                            Start Now
                        </button>
                    </div>
                    <div className="order-1 md:order-2">
                        <img 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                            alt="Trading Dashboard" 
                            className="rounded-3xl shadow-2xl border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                </section>

                {/* SECTION 3: HOW TO TRADE */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800" 
                            alt="Stock Analysis" 
                            className="rounded-3xl shadow-2xl border border-gray-100"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">How to Trade Stocks with Mirrox</h2>
                        <div className="mt-8 space-y-10">
                            {[
                                { title: "Choose Your Stock", desc: "Select from a wide range of global shares based on market performance." },
                                { title: "Analyze & Decide", desc: "Use technical indicators and news to decide whether to buy or sell." },
                                { title: "Place Your Trade", desc: "Set your parameters, including stop-loss and take-profit, and execute." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-[#FF4D5E] rounded-2xl flex flex-shrink-0 items-center justify-center text-white font-black text-xl shadow-lg shadow-red-500/20">
                                        {i+1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{step.title}</h3>
                                        <p className="text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-8 bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                            Open Account
                        </button>
                    </div>
                </section>
            </div>

            {/* STOCKS TABLE SECTION */}
            <section className="bg-gray-50 py-24 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Stocks Offered by Mirrox</h2>
                        <p className="text-gray-500 text-lg font-medium">Access over 150+ global stocks with lightning-fast execution</p>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Company</th>
                                        <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Industry</th>
                                        <th className="px-8 py-6 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Spread From</th>
                                        <th className="px-8 py-6 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {stockData.map((stock, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 font-bold text-xs ring-4 ring-gray-100/50 group-hover:bg-[#FF4D5E] group-hover:text-white transition-all">
                                                        {stock.symbol.slice(0, 1)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 leading-tight">{stock.symbol}</p>
                                                        <p className="text-xs text-gray-400 font-bold">{stock.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-tighter">{stock.category}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center font-bold text-gray-700">{stock.spread}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="px-5 py-2.5 bg-green-500 text-white text-[10px] font-black rounded-lg hover:bg-green-600 shadow-lg shadow-green-500/10 uppercase tracking-widest">Buy</button>
                                                    <button className="px-5 py-2.5 bg-red-500 text-white text-[10px] font-black rounded-lg hover:bg-red-600 shadow-lg shadow-red-500/10 uppercase tracking-widest">Sell</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
                            <button className="text-[#FF4D5E] font-black text-xs uppercase tracking-widest flex items-center gap-2 mx-auto group">
                                View Full Stock List <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

             {/* LEARN STOCKS SECTION */}
             <section className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Learn CFD Stock Trading with Mirrox</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Education is crucial to build confidence and enhance performance. Learn about market dynamics, advanced tools, and best practices to keep your strategies relevant and effective.
                        </p>
                        <button className="flex items-center gap-3 bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Education Center <ArrowRight size={18} />
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl">
                             <img src="https://images.unsplash.com/photo-1611224885990-ab73b391cd2a?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#FF4D5E] cursor-pointer hover:scale-110 transition-transform shadow-2xl">
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

export default Stocks;
