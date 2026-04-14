import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart2, ShieldCheck, Zap, Coins, Globe, Cpu } from 'lucide-react';

const CryptocurrenciesCfds = () => {
    const cryptoData = [
        { symbol: "BTCUSD", name: "Bitcoin", spread: "2.5", category: "Majors" },
        { symbol: "ETHUSD", name: "Ethereum", spread: "1.2", category: "Majors" },
        { symbol: "XRPUSD", name: "Ripple", spread: "0.005", category: "Altcoins" },
        { symbol: "LTCUSD", name: "Litecoin", spread: "0.15", category: "Altcoins" },
        { symbol: "DOGEUSD", name: "Dogecoin", spread: "0.0001", category: "Altcoins" },
        { symbol: "ADAUSD", name: "Cardano", spread: "0.01", category: "Altcoins" },
        { symbol: "SOLUSD", name: "Solana", spread: "0.25", category: "Altcoins" },
        { symbol: "DOTUSD", name: "Polkadot", spread: "0.1", category: "Altcoins" },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-tight">Cryptocurrency CFDs <br/>Trading With Mirrox</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-90 leading-relaxed">
                        Tap into the world's most dynamic digital economy with professional tools and ultra-fast execution.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
                
                {/* SECTION 1: WHAT IS CRYPTO TRADING */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1518544830403-18196e81997d?auto=format&fit=crop&q=80&w=800" 
                            alt="Crypto Trading" 
                            className="rounded-3xl shadow-2xl border border-gray-100 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                    <Coins size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">BITCOIN</p>
                                    <p className="text-lg font-black text-gray-900">$64,500.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">What is Cryptocurrency CFDs Trading?</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Cryptocurrencies are decentralized digital currencies that use blockchain technology for secure, transparent transactions.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            CFD trading allows you to speculate on the price movements of major coins like Bitcoin and Ethereum without owning them, giving you the ability to profit from both bullish and bearish market trends.
                        </p>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Trade Crypto Now
                        </button>
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Benefits of Trading Cryptocurrency CFDs</h2>
                        <ul className="space-y-4">
                            {[
                                "Access to 20+ major and exotic digital coins",
                                "Lightning-fast execution on high-volatility moves",
                                "Zero commission on deposits and no hidden fees",
                                "24/7 market exposure to digital assets"
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-[#FF4D5E]">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-red-500/10">
                            View Offer
                        </button>
                    </div>
                    <div className="order-1 md:order-2">
                         <div className="w-full h-[400px] bg-gray-900 rounded-[2.5rem] p-1 border-[10px] border-gray-800 shadow-2xl relative overflow-hidden group">
                             <img src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                             <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-gradient-to-t from-gray-900 to-transparent">
                                 <Cpu size={48} className="text-[#FF4D5E] mb-4" />
                                 <h3 className="text-2xl font-black text-white">Advanced Crypto Platform</h3>
                                 <p className="text-gray-400 text-sm mt-2 max-w-xs">Professional charting and real-time execution for digital assets.</p>
                             </div>
                         </div>
                    </div>
                </section>

                {/* SECTION 3: HOW TO TRADE */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800" 
                            alt="Trading Process" 
                            className="rounded-3xl shadow-2xl border border-gray-100"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">How to Trade Cryptocurrencies CFDs with Mirrox</h2>
                        <div className="mt-8 space-y-10">
                            {[
                                { title: "Select Your Coin", desc: "Pick from a wide range of assets including BTC, ETH, and DOGE." },
                                { title: "Analyze & Execute", desc: "Use our analytical tools to decide when to buy or sell." },
                                { title: "Manage & Monitor", desc: "Set limits, monitor real-time data, and protect your capital." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex flex-shrink-0 items-center justify-center text-[#FF4D5E] font-black text-xl">
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

            {/* CRYPTO TABLE */}
            <section className="bg-gray-50 py-24 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight">Crypto CFDs Offered by Mirrox</h2>
                        <p className="text-gray-500 text-lg">Trade the digital future with competitive spreads and 24/7 access</p>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Digital Asset</th>
                                        <th className="px-8 py-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-6 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Spread From</th>
                                        <th className="px-8 py-6 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {cryptoData.map((coin, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 font-bold text-[10px] ring-4 ring-orange-50/50">
                                                        {coin.symbol.slice(0,3)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{coin.symbol}</p>
                                                        <p className="text-xs text-gray-400 font-bold">{coin.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-tight">{coin.category}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center font-bold text-gray-700">{coin.spread}</td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="px-4 py-2 bg-green-500 text-white text-[10px] font-black rounded-lg hover:bg-green-600 shadow shadow-green-500/10 uppercase tracking-widest">Buy</button>
                                                    <button className="px-4 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg hover:bg-red-600 shadow shadow-red-500/10 uppercase tracking-widest">Sell</button>
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

             {/* LEARN CRYPTO SECTION */}
             <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Learn Crypto CFDs Trading with Mirrox</h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            Education is essential for digital assets. Master market dynamics, anticipate price movements, and use effective risk management to protect your capital.
                        </p>
                        <button className="flex items-center gap-2 bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90">
                            Education Hub <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="flex-1">
                        <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-xl group">
                             <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                             <div className="absolute inset-0 flex items-center justify-center">
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

export default CryptocurrenciesCfds;
