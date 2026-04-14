import React from 'react';
import { 
    BookOpen, CheckCircle2, ArrowRight,
    TrendingUp, BarChart2, Zap, Target,
    PlayCircle
} from 'lucide-react';

const TradingEducation = () => {
    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-white pt-32 pb-16 px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none">What are CFDs?</h1>
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                        Master the fundamentals of Contracts for Difference and market dynamics.
                    </p>
                </div>
            </section>

            {/* --- TOP IMAGE --- */}
            <section className="px-6 mb-32">
                <div className="max-w-6xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100">
                    <img 
                        src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=1200" 
                        alt="Candlestick Chart" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-6 space-y-48">
                
                {/* SECTION 1: STRATEGIES */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-tight">Understanding CFD Trading Strategies</h2>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium">
                            Developing a robust strategy is the key to consistent trading. Whether you're a day trader or a long-term swing trader, our tools help you analyze market trends with precision.
                        </p>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            Understanding how to read volume, momentum, and key support/resistance levels allows you to place trades with confidence.
                        </p>
                    </div>
                    <div className="relative p-8 bg-gray-50 rounded-[3rem] group overflow-hidden">
                         <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600" 
                            alt="Trader Visualization" 
                            className="relative rounded-[2rem] shadow-xl transform group-hover:scale-105 transition-transform duration-700"
                         />
                    </div>
                </section>

                {/* SECTION 2: BENEFITS */}
                <section className="space-y-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter text-center">The Benefits of CFDs</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        {[
                            { t: "Leverage", d: "Trade larger positions with a smaller initial capital outlay." },
                            { t: "Diversification", d: "Access Forex, Commodities, Indices, and Crypto from one single account." },
                            { t: "Short Selling", d: "Profit from falling markets as easily as from rising markets." },
                            { t: "Flexibility", d: "No fixed contract sizes or expiration dates on most cash CFDs." }
                        ].map((b, i) => (
                            <div key={i} className="flex gap-6 items-start group">
                                <div className="shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-[#FF4D5E] group-hover:bg-[#FF4D5E] group-hover:text-white transition-all">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">{b.t}</h4>
                                    <p className="text-gray-500 font-medium leading-relaxed">{b.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-16">
                         <div className="bg-gray-900 h-96 rounded-[3rem] relative overflow-hidden flex items-center justify-center group">
                             <img src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-1000" alt="Market Motion"/>
                             <div className="relative text-center space-y-6">
                                <div className="w-20 h-20 bg-[#FF4D5E] rounded-full flex items-center justify-center text-white mx-auto shadow-2xl scale-110">
                                    <PlayCircle size={40} />
                                </div>
                                <p className="text-white font-black uppercase tracking-widest text-xs">Watch: Why Trade CFDs?</p>
                             </div>
                         </div>
                    </div>
                </section>

                {/* SECTION 3: IMPORTANCE OF GOALS */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative p-12 bg-red-50/50 rounded-[4rem] flex items-center justify-center group overflow-hidden">
                         <div className="relative w-full aspect-square bg-white rounded-3xl shadow-2xl flex items-center justify-center p-12 border border-red-50">
                            <Target size={120} className="text-[#FF4D5E] opacity-20 absolute top-10 right-10" />
                            <div className="w-full h-full relative z-10 flex flex-col items-center justify-center gap-6">
                                <div className="w-2/3 h-4 bg-red-500 rounded-full"></div>
                                <div className="w-1/2 h-4 bg-red-400 rounded-full"></div>
                                <div className="w-1/3 h-4 bg-red-300 rounded-full"></div>
                            </div>
                         </div>
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-tight">The Importance of Setting Trading Goals</h2>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium">
                           Without a clear destination, it’s impossible to plan your route. Setting realistic financial goals helps you remain disciplined during market volatility.
                        </p>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            At Mirrox, we provide the tools to track your progress and adjust your strategies dynamically as you grow.
                        </p>
                        <button className="flex items-center gap-3 text-[#FF4D5E] font-black text-xs uppercase tracking-widest hover:gap-6 transition-all">Start Goal Setting <ArrowRight size={16}/></button>
                    </div>
                </section>

                {/* SECTION 4: WHY MIRROX */}
                <section className="pb-32 space-y-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">Why Trade CFDs with Mirrox?</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                         {[
                             { t: "Deep Liquidity", d: "Trade major pairs and commodities with razor-sharp execution." },
                             { t: "Expert Insight", d: "Daily market analysis directly into your terminal." },
                             { t: "Regulated Peace", d: "Trade with confidence on a MISA-regulated platform." }
                         ].map((item, i)=>(
                            <div key={i} className="space-y-4">
                                <span className="text-[#FF4D5E] font-black text-6xl opacity-20 italic font-serif leading-none">0{i+1}</span>
                                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">{item.t}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed">{item.d}</p>
                            </div>
                         ))}
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
        </div>
    );
};

export default TradingEducation;
