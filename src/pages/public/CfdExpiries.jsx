import React from 'react';
import { 
    Calendar, Shield, Zap, Headphones, CheckCircle2, 
    ArrowRight, PlayCircle, BarChart, Globe, Layout, Monitor
} from 'lucide-react';

const CfdExpiries = () => {
    const expiryData = [
        { asset: "BRENT", name: "Brent Crude Oil", month: "JAN 2025", final: "2024-12-31" },
        { asset: "WTI", name: "West Texas Intermediate", month: "JAN 2025", final: "2024-12-31" },
        { asset: "NGAS", name: "Natural Gas", month: "FEB 2025", final: "2025-01-15" },
        { asset: "COFFEE", name: "US Coffee C", month: "MAR 2025", final: "2025-02-20" },
    ];

    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Future Expiry Dates at Mirrox</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                        Master your trade management with precision contract tracking.
                    </p>
                </div>
            </section>

            {/* --- EXPIRY MATRIX --- */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest">Asset</th>
                                    <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Product Name</th>
                                    <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Expiry Month</th>
                                    <th className="px-10 py-8 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Final Expiry</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 uppercase text-xs font-black">
                                {expiryData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#FF4D5E] group-hover:bg-[#FF4D5E] group-hover:text-white transition-colors">
                                                    <Calendar size={18} />
                                                </div>
                                                <span className="text-gray-900 tracking-widest">{item.asset}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-center text-gray-500">{item.name}</td>
                                        <td className="px-10 py-6 text-center text-[#FF4D5E]">{item.month}</td>
                                        <td className="px-10 py-6 text-right text-gray-900">{item.final}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* --- THE MIRROX EDGE --- */}
            <section className="py-32 bg-gray-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">The Mirrox Edge</h2>
                        <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Seamless performance across all financial markets</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Effortless Trading */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-8 flex flex-col">
                             <div className="space-y-4">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Effortless Trading</h3>
                                <ul className="space-y-3">
                                    {["Intuitive UI", "One-Click Execution", "Seamless Navigation", "Customizable View"].map((f,i)=>(
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                                            <CheckCircle2 size={14} className="text-[#FF4D5E]" /> {f}
                                        </li>
                                    ))}
                                </ul>
                             </div>
                             <div className="mt-auto pt-8">
                                <div className="bg-gray-50 rounded-2xl p-4 border border-red-50 aspect-video flex items-center justify-center">
                                    <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden">
                                        <div className="w-2/3 h-full bg-[#FF4D5E]"></div>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Regulated & Secure */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-8 flex flex-col">
                             <div className="space-y-4">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Regulated & Secure</h3>
                                <ul className="space-y-3">
                                    {["MWALI Regulation", "Segregated Funds", "256-bit Encryption", "SAS 70 Data Center"].map((f,i)=>(
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                                            <CheckCircle2 size={14} className="text-[#FF4D5E]" /> {f}
                                        </li>
                                    ))}
                                </ul>
                             </div>
                             <div className="mt-auto pt-8">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="h-12 bg-red-50 rounded-lg"></div>
                                    <div className="h-12 bg-gray-50 rounded-lg"></div>
                                    <div className="h-12 bg-gray-50 rounded-xl"></div>
                                    <div className="h-12 bg-[#FF4D5E] rounded-xl flex items-center justify-center text-white"><Shield size={20}/></div>
                                </div>
                             </div>
                        </div>

                        {/* Dedicated Support */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-8 flex flex-col">
                             <div className="space-y-4">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Dedicated Support</h3>
                                <ul className="space-y-3">
                                    {["24/7 Availability", "Multilingual Team", "Personal Manager", "Expert Analysis"].map((f,i)=>(
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                                            <CheckCircle2 size={14} className="text-[#FF4D5E]" /> {f}
                                        </li>
                                    ))}
                                </ul>
                             </div>
                             <div className="mt-auto pt-8 relative overflow-hidden group">
                                <img 
                                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400" 
                                    className="rounded-2xl transform group-hover:scale-110 transition-transform duration-700"
                                    alt="Support Hub"
                                />
                                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center pointer-events-none">
                                     <button className="bg-white text-[#FF4D5E] px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-2xl">Contact Us</button>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- EDUCATION CENTER --- */}
            <section className="py-32 max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">Explore Our Education Center</h2>
                    <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Learn at your own pace with structured materials</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                     {[
                         { title: "Introduction Courses", desc: "Learn the basics of financial markets and CFD contract cycles." },
                         { title: "Trading Strategies", desc: "Develop professional-grade strategies for contract expiration management." },
                         { title: "Advanced Lessons", desc: "Deepen your knowledge with complex analysis and hedging techniques." }
                     ].map((course, i) => (
                        <div key={i} className="space-y-8 group">
                             <div className="aspect-video bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 relative shadow-lg group-hover:shadow-2xl transition-all duration-500">
                                 <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={course.title}/>
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF4D5E] shadow-2xl group-hover:scale-110 transition-transform">
                                        <PlayCircle size={32}/>
                                    </div>
                                 </div>
                             </div>
                             <div className="space-y-3">
                                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{course.title}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed">{course.desc}</p>
                                <button className="flex items-center gap-2 text-[#FF4D5E] font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">Start Now <ArrowRight size={14}/></button>
                             </div>
                        </div>
                     ))}
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
                    DISCLAIMER: CFD TRADING INVOLVES SIGNIFICANT RISK TO YOUR CAPITAL.
                </p>
            </footer>
        </div>
    );
};

export default CfdExpiries;
