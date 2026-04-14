import React from 'react';
import { 
    Calendar, Globe, Shield, Zap, ArrowRight,
    Search, Filter, Info, Clock, CheckCircle2
} from 'lucide-react';

const MarketHolidays = () => {
    const holidayData = [
        { symbol: "BTCUSD", country: "Global", dates: ["Normal", "Normal", "Normal", "Normal", "Normal", "Normal"] },
        { symbol: "GER40", country: "Germany", dates: ["Closed", "Normal", "Special", "Closed", "Normal", "Normal"] },
        { symbol: "US500", country: "USA", dates: ["Closed", "Normal", "Normal", "Closed", "Special", "Normal"] },
        { symbol: "UK100", country: "UK", dates: ["Closed", "Normal", "Normal", "Closed", "Normal", "Normal"] },
        { symbol: "JAP225", country: "Japan", dates: ["Closed", "Special", "Normal", "Normal", "Normal", "Normal"] },
        { symbol: "Gold", country: "Metal", dates: ["Special", "Normal", "Normal", "Special", "Normal", "Normal"] },
        { symbol: "Silver", country: "Metal", dates: ["Special", "Normal", "Normal", "Special", "Normal", "Normal"] },
        { symbol: "Brent", country: "Energy", dates: ["Normal", "Normal", "Normal", "Special", "Normal", "Normal"] },
    ];

    const holidayDates = ["Jan 01", "Apr 18", "Apr 21", "May 01", "Dec 25", "Dec 26"];

    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Market Holidays at Mirrox</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed text-center">
                        Stay informed about global trading breaks and adjusted hours.
                    </p>
                </div>
            </section>

            {/* --- HOLIDAY GRID --- */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                
                <div className="flex flex-col md:flex-row gap-8 mb-12 items-center justify-between">
                     <div className="space-y-2">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Trading Calendar 2024-25</h2>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Global Market Hours & Special Schedules</p>
                     </div>
                     <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase">
                            <CheckCircle2 size={12}/> Normal Hours
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase">
                            <Clock size={12}/> Closed
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">
                            <Info size={12}/> Special
                        </div>
                     </div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Symbol</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Country</th>
                                    {holidayDates.map((date, i) => (
                                        <th key={i} className="px-6 py-8 text-[10px] font-black text-gray-900 uppercase tracking-widest text-center">{date}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {holidayData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="font-black text-gray-900 tracking-tight text-sm uppercase">{row.symbol}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{row.country}</span>
                                        </td>
                                        {row.dates.map((status, i) => (
                                            <td key={i} className="px-6 py-5 text-center">
                                                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight ${
                                                    status === 'Normal' ? 'bg-green-50 text-green-600' :
                                                    status === 'Closed' ? 'bg-red-50 text-red-600' :
                                                    'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {status === 'Normal' ? 'Normal Hours' : status}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex gap-6 items-start">
                    <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                        <Info size={24} />
                    </div>
                    <div className="space-y-2 text-left">
                         <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight text-left">Important Note</h4>
                         <p className="text-blue-700/70 text-sm font-medium leading-relaxed text-left">
                            Market liquidity and spreads can be significantly impacted during holiday periods. 
                            Mirrox provides these dates for informational purposes; however, local market conditions may vary. 
                            Always check your trading terminal for real-time schedule updates.
                         </p>
                    </div>
                </div>
            </section>

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
                    NOTE: MARKET HOLIDAYS MAY VARY BASED ON REGIONAL LIQUIDITY PROVIDERS.
                </p>
            </footer>
        </div>
    );
};

export default MarketHolidays;
