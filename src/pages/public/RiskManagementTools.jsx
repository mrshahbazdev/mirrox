import React from 'react';
import { 
    Shield, ShieldAlert, ShieldCheck, 
    ArrowRight, CheckCircle2, TrendingDown,
    Activity, Anchor, PieChart
} from 'lucide-react';

const RiskManagementTools = () => {
    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-white pt-32 pb-16 px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-6 text-center">
                    <h1 className="text-4xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none text-center">What are Risk Management Tools?</h1>
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto uppercase tracking-widest leading-relaxed text-center">
                        Protect your capital and minimize exposure with professional strategies.
                    </p>
                </div>
            </section>

            {/* --- TOP IMAGE --- */}
            <section className="px-6 mb-32">
                <div className="max-w-6xl mx-auto rounded-[3.5rem] overflow-hidden shadow-2xl border border-gray-100 h-[600px]">
                    <img 
                        src="https://images.unsplash.com/photo-1551288049-bbbda5402bd7?auto=format&fit=crop&q=80&w=1200" 
                        alt="Risk Management Visualization" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-6 space-y-48">
                
                {/* SECTION 1: STRATEGIES */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-tight">Understanding Risk Management Strategies</h2>
                        <ul className="space-y-6">
                            {[
                                { t: "Stop-Loss Orders", d: "Automatically close trades at a set price to prevent catastrophic losses." },
                                { t: "Position Sizing", d: "Limit each trade to a specific percentage of your total equity." },
                                { t: "Diversification", d: "Spread risk across multiple assets and sectors." },
                                { t: "Hedging", d: "Offset potential losses with contrasting positions in related markets." }
                            ].map((s, i)=>(
                                <li key={i} className="flex gap-4 items-start group">
                                    <div className="w-6 h-6 rounded-full bg-red-100 text-[#FF4D5E] flex items-center justify-center shrink-0 mt-1 font-black text-[10px] group-hover:bg-[#FF4D5E] group-hover:text-white transition-all">{i+1}</div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{s.t}</h4>
                                        <p className="text-gray-400 font-medium leading-relaxed text-sm">{s.d}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative p-12 bg-gray-50 rounded-[4rem] group overflow-hidden">
                         <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 flex flex-col items-center gap-6 transform group-hover:rotate-2 transition-transform duration-700">
                             <Shield size={80} className="text-[#FF4D5E] opacity-10 absolute -top-10 -right-10" />
                             <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-[#FF4D5E]">
                                <ShieldCheck size={40} />
                             </div>
                             <div className="space-y-3 w-full">
                                <div className="w-full h-2 bg-gray-50 rounded-full"></div>
                                <div className="w-3/4 h-2 bg-red-100 rounded-full"></div>
                                <div className="w-1/2 h-2 bg-red-500 rounded-full"></div>
                             </div>
                         </div>
                    </div>
                </section>

                {/* SECTION 2: WHY YOU NEED THEM */}
                <section className="space-y-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter text-center">Why You Need Risk Management Tools</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                         {[
                             { title: "Capital Protection", desc: "Preserve your trading longevity by ensuring no single event wipes out your account." },
                             { title: "Emotional Stability", desc: "Automated orders take the fear out of trading, keeping you disciplined and focused." },
                             { title: "Strategic Growth", desc: "Manageable risks allow for consistent, long-term portfolio growth without overexposure." }
                         ].map((item, i) => (
                             <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl hover:border-red-100 transition-all group flex flex-col items-center text-center gap-6">
                                 <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#FF4D5E] group-hover:bg-[#FF4D5E] group-hover:text-white transition-all">
                                     <Activity size={32} />
                                 </div>
                                 <div className="space-y-2">
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">{item.title}</h4>
                                    <p className="text-gray-500 font-medium leading-relaxed text-sm">{item.desc}</p>
                                 </div>
                             </div>
                         ))}
                    </div>
                </section>

                 {/* SECTION 3: HOW TO UTILIZE */}
                 <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative p-12 bg-gray-900 rounded-[4rem] group overflow-hidden order-2 md:order-1">
                         <img 
                            src="https://images.unsplash.com/photo-1543286386-713bcd549651?auto=format&fit=crop&q=80&w=800" 
                            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-[2000ms]"
                            alt="Market Data"
                         />
                         <div className="relative z-10 text-white space-y-4">
                            <h3 className="text-2xl font-black uppercase tracking-tight">Real-Time Risk Analysis</h3>
                            <button className="bg-[#FF4D5E] px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl">Open Tools</button>
                         </div>
                    </div>
                    <div className="space-y-8 order-1 md:order-2">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-tight">How to Utilize Mirrox's Risk Management Tools?</h2>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium">
                            Our platform integrates standard tools like trailing stops and take-profit orders directly into the execution terminal.
                        </p>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            Combined with our negative balance protection and tiered leverage options, you have full control over your risk profiles.
                        </p>
                    </div>
                </section>

                {/* SECTION 4: MONITORING */}
                <section className="pb-32 space-y-12">
                     <div className="p-16 bg-red-50/30 rounded-[3rem] border border-red-50/50 space-y-8 text-center">
                        <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Continuous Monitoring and Adjustment</h3>
                        <p className="text-gray-500 text-lg leading-relaxed max-w-4xl mx-auto font-medium">
                            Effective risk management is not a 'set and forget' process. Market conditions change, and so should your strategy. Mirrox provides the analytical tools to monitor your positions 24/7 and adjust your risk parameters dynamically as market volatility scales.
                        </p>
                     </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="px-6 py-24 bg-gray-50">
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
        </div>
    );
};

export default RiskManagementTools;
