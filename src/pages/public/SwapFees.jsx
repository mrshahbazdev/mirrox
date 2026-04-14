import React, { useState } from 'react';
import { 
    Info, Calculator, BarChart, TrendingUp, ArrowRight,
    Zap, Monitor, Globe, Shield, PlayCircle, Smartphone
} from 'lucide-react';

const SwapFees = () => {
    const [activeTab, setActiveTab] = useState('forex');

    const tabs = [
        { id: 'forex', label: 'Forex' },
        { id: 'indices', label: 'Indices' },
        { id: 'commodities', label: 'Commodities' },
        { id: 'crypto', label: 'Crypto' }
    ];

    const swapData = {
        forex: [
            { asset: "EURUSD", long: "-6.50", short: "1.20" },
            { asset: "GBPUSD", long: "-8.20", short: "1.50" },
            { asset: "USDJPY", long: "1.80", short: "-7.40" },
            { asset: "AUDUSD", long: "-4.20", short: "0.80" },
            { asset: "USDCAD", long: "-3.50", short: "0.50" },
        ],
        indices: [
            { asset: "US500", long: "-12.50", short: "-8.20" },
            { asset: "US30", long: "-15.00", short: "-10.50" },
            { asset: "GER40", long: "-10.00", short: "-6.00" },
        ],
        crypto: [
            { asset: "BTCUSD", long: "-25.00", short: "-25.00" },
            { asset: "ETHUSD", long: "-15.00", short: "-15.00" },
        ]
    };

    const currentData = swapData[activeTab] || swapData['forex'];

    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Swap Rates at Mirrox</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                        Understanding overnight charges for strategic position management.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-32 space-y-48">
                
                {/* SECTION 1: WHAT ARE SWAP FEES */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-red-50 rounded-[3rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=800" 
                            alt="Swap Explained" 
                            className="relative rounded-[2rem] shadow-2xl border border-gray-100"
                        />
                    </div>
                    <div className="space-y-8">
                         <div className="inline-block px-4 py-1.5 bg-red-50 text-[#FF4D5E] font-black text-[10px] rounded-full uppercase tracking-widest">Trading Basics</div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight uppercase tracking-tighter">What Are Swap Fees?</h2>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed">
                           Swap fees, also known as rollover fees, are interest charges or credits applied to positions held overnight.
                        </p>
                        <p className="text-gray-500 leading-relaxed">
                            These fees reflect the interest rate differential between two assets and are a standard part of professional trading. 
                            At Mirrox, we provide transparent rates to help you manage your long-term strategies.
                        </p>
                    </div>
                </section>

                {/* SECTION 2: CALCULATIONS */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1 space-y-8">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight uppercase tracking-tighter">Calculations & Examples</h2>
                        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-4">
                            <p className="text-xs font-black text-[#FF4D5E] uppercase tracking-widest">Formula</p>
                            <p className="text-2xl font-black text-gray-900 tracking-tight">Swap = Lots × Size × Point × Rate</p>
                        </div>
                        <p className="text-gray-500 leading-relaxed">
                            Keep in mind that bank holidays can affect the number of days a position is rolled forward. 
                            Positions held overnight on Wednesdays typically incur a 3-day swap to cover the weekend.
                        </p>
                    </div>
                    <div className="order-1 md:order-2 relative group">
                        <div className="absolute -inset-4 bg-gray-50 rounded-[3rem] rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                            alt="Calculation Visual" 
                            className="relative rounded-[2rem] shadow-2xl border border-gray-100"
                        />
                    </div>
                </section>

                {/* --- SWAP MATRIX --- */}
                <section>
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter">Swap Rate Matrix</h2>
                        <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Real-time overnight rollover rates</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
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

                    <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest">Asset</th>
                                        <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Long Swap</th>
                                        <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Short Swap</th>
                                        <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest text-right">3rd Day</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {currentData.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#FF4D5E] group-hover:bg-[#FF4D5E] group-hover:text-white transition-colors">
                                                        <BarChart size={18} />
                                                    </div>
                                                    <span className="font-black text-gray-900 tracking-widest uppercase">{item.asset}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-center font-black text-red-500">{item.long}</td>
                                            <td className="px-10 py-6 text-center font-black text-green-500">{item.short}</td>
                                            <td className="px-10 py-6 text-right font-black text-gray-400 uppercase tracking-tight">Wednesday</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-[#FF4D5E] py-24 px-10 text-center relative overflow-hidden group shadow-[0_45px_100px_rgba(255,77,94,0.35)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl md:text-8xl font-black text-white leading-tight tracking-tighter uppercase whitespace-pre-line text-center">Join Mirrox and{"\n"}Start Trading</h2>
                        <div className="flex flex-col md:flex-row justify-center gap-6 text-center">
                            <button className="bg-white text-[#FF4D5E] px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform text-center mx-auto">
                                Start Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="text-center pb-16 px-6">
                <p className="max-w-4xl mx-auto text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-80 decoration-dotted underline underline-offset-4">
                    NOTE: SWAP RATES ARE SUBJECT TO MARKET VOLATILITY AND LIQUIDITY PROVIDER ADJUSTMENTS.
                </p>
            </footer>
        </div>
    );
};

export default SwapFees;
