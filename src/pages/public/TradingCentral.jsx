import React from 'react';
import { 
    Zap, TrendingUp, BarChart, Globe, 
    ArrowRight, CheckCircle2, Shield, PlayCircle,
    Monitor, Layout, Smartphone, Headphones
} from 'lucide-react';

const TradingCentral = () => {
    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden text-left">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start gap-6 text-left">
                    <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter text-left">Power Your Trading Decisions with Trading Central</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 max-w-4xl uppercase tracking-widest leading-relaxed text-left">
                        Access world-class technical analysis and automated pattern recognition tools.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-32 space-y-48">
                
                {/* WHAT IS TRADING CENTRAL */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10 text-left">
                         <div className="inline-block px-4 py-1.5 bg-red-50 text-[#FF4D5E] font-black text-[10px] rounded-full uppercase tracking-widest">Premium Insights</div>
                         <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-tight text-left">What is Trading Central?</h2>
                         <p className="text-gray-500 text-lg leading-relaxed text-left font-medium">
                            Trading Central is the global leader in financial market research and analysis. Our partnership brings you professional-grade insights that were previously reserved for institutional traders.
                         </p>
                         <p className="text-gray-500 leading-relaxed text-left">
                            Get real-time entry and exit points, technical sentiments, and automated chart pattern recognition across 8,000+ assets directly in your Mirrox portal.
                         </p>
                         <button className="bg-[#FF4D5E] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-red-100">
                            Explore New
                         </button>
                    </div>
                    <div className="relative group p-12 bg-gray-50 rounded-[4rem] overflow-hidden">
                        <img 
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800" 
                            className="relative rounded-[2rem] shadow-2xl border border-gray-100 transform group-hover:scale-105 transition-transform duration-700"
                            alt="Trading Central Visual"
                        />
                         <div className="absolute top-0 right-0 p-8 w-1/2 aspect-square bg-red-50/50 blur-3xl -z-10 animate-pulse"></div>
                    </div>
                </section>

                {/* ADVANCED SOLUTIONS */}
                <section className="space-y-20">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter text-center">Advanced Solutions by Trading Central</h2>
                        <p className="text-gray-400 font-medium uppercase tracking-widest text-[10px] text-center">Fuel your strategy with award-winning research</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Intraday Technical Analysis", desc: "Leverage top-tier analysis and advanced pattern recognition tools to refine and enhance your strategies." },
                            { title: "Extensive Financial Calendar", desc: "Stay informed with a customizable economic calendar featuring real-time analysis and historical indicators." },
                            { title: "Global Market Perspective", desc: "Our global reach provides market-leading research that empowers your decisions across multiple asset classes." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-100 hover:border-red-100 transition-all flex flex-col gap-8 group">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#FF4D5E] group-hover:bg-[#FF4D5E] group-hover:text-white transition-all duration-500">
                                    <TrendingUp size={32} />
                                </div>
                                <div className="space-y-4 flex-grow">
                                    <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-tight">{item.title}</h4>
                                    <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                                <button className="flex items-center gap-2 text-[#FF4D5E] font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all">Learn More <ArrowRight size={14}/></button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* THE MIRROX EDGE GRID (RE-USED COMPONENT) */}
                <section className="py-24 space-y-20">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter text-center leading-none">The Mirrox Edge</h2>
                        <p className="text-gray-400 font-medium uppercase tracking-widest text-[10px] text-center">Redefining online trading experience</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {/* Effortless Trading */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-8">
                             <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Effortless Trading</h3>
                             <ul className="space-y-3">
                                {["Intuitive UI", "Execution", "Navigation", "Customization"].map((f,i)=>(
                                    <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                                        <CheckCircle2 size={14} className="text-[#FF4D5E]" /> {f}
                                    </li>
                                ))}
                             </ul>
                             <div className="pt-8 bg-gray-50 rounded-2xl aspect-video flex items-center justify-center"><Monitor size={48} className="text-gray-200"/></div>
                        </div>
                        {/* Regulated & Secure */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-8">
                             <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Regulated & Secure</h3>
                             <ul className="space-y-3">
                                {["MWALI Regulation", "Segregated Funds", "256-bit Encryption", "SAS 70 Server"].map((f,i)=>(
                                    <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                                        <CheckCircle2 size={14} className="text-[#FF4D5E]" /> {f}
                                    </li>
                                ))}
                             </ul>
                              <div className="pt-8 bg-red-50 rounded-2xl aspect-video flex items-center justify-center"><Shield size={48} className="text-[#FF4D5E]"/></div>
                        </div>
                        {/* Support Block */}
                         <div className="bg-[#FF4D5E] p-10 rounded-[3rem] shadow-xl space-y-8 text-white group overflow-hidden relative">
                             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <h3 className="text-2xl font-black uppercase tracking-tight relative z-10">Dedicated Support</h3>
                             <p className="text-rose-100 font-medium relative z-10">Experience professional account management 24/7.</p>
                             <button className="bg-white text-[#FF4D5E] px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest relative z-10">Contact Support</button>
                             <div className="absolute -bottom-10 -right-10 opacity-20"><Headphones size={200}/></div>
                        </div>
                    </div>
                </section>
            </div>

            {/* UPGRADE SKILLS SECTION */}
            <section className="bg-gray-50 py-32">
                <div className="max-w-7xl mx-auto px-6 space-y-20">
                     <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight text-center leading-none">Ready to Upgrade Your Trading Skills?</h2>
                        <p className="text-gray-400 font-medium uppercase tracking-widest text-[10px] text-center">Commence in 3 easy steps</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                         {[
                             { s: "1", t: "Register", d: "Open your premiere account in minutes" },
                             { s: "2", t: "Add Funds", d: "Deposit via secure instant gateways" },
                             { s: "3", t: "Implement", d: "Use technical views to place trades" }
                         ].map((item, i)=>(
                            <div key={i} className="text-center space-y-6">
                                <div className="w-16 h-16 rounded-full border border-red-100 flex items-center justify-center text-[#FF4D5E] font-black text-xl mx-auto">{item.s}</div>
                                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{item.t}</h4>
                                <p className="text-gray-500 font-medium">{item.d}</p>
                            </div>
                         ))}
                    </div>
                    <div className="text-center pt-8">
                         <button className="bg-[#FF4D5E] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">Open Account</button>
                    </div>
                </div>
            </section>

             {/* --- FINAL CTA --- */}
             <section className="px-6 py-24 bg-white">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-[#FF4D5E] py-24 px-10 text-center relative overflow-hidden group shadow-[0_45px_100px_rgba(255,77,94,0.35)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                    <div className="relative z-10 space-y-10 text-center">
                        <h2 className="text-4xl md:text-8xl font-black text-white leading-tight tracking-tighter uppercase whitespace-pre-line text-center font-['Outfit']">Join Mirrox and{"\n"}Start Trading</h2>
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

export default TradingCentral;
