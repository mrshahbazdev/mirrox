import React from 'react';
import { Lock, ArrowRight, Globe, Shield, Zap, PlayCircle } from 'lucide-react';

const EconomicCalendar = () => {
    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden relative">
            
            {/* --- BLURRED BACKGROUND MOCKUP --- */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none filter blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-24 space-y-12">
                     <div className="h-24 bg-gray-100 rounded-3xl w-full animate-pulse"></div>
                     <div className="grid grid-cols-4 gap-6">
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(i=>(
                            <div key={i} className="h-40 bg-gray-50 rounded-2xl animate-pulse"></div>
                        ))}
                     </div>
                </div>
            </div>

            {/* --- LOCKED OVERLAY --- */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
                <div className="max-w-xl w-full bg-white/80 backdrop-blur-xl p-12 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-white text-center space-y-10 border-gray-100">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-[#FF4D5E] mx-auto shadow-inner">
                        <Lock size={40} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">Economic Calendar Is Locked</h1>
                        <p className="text-gray-500 font-medium leading-relaxed">Sign up or log in to access our exclusive Economic Calendar and stay ahead of market-moving events.</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-red-100">Login</button>
                        <button className="bg-white text-gray-900 border border-gray-200 px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">Create Account</button>
                    </div>
                </div>
            </div>

             {/* --- FINAL CTA --- */}
             <section className="px-6 py-24 relative z-10">
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

export default EconomicCalendar;
