import React from 'react';
import { 
    CheckCircle2, ArrowRight, Shield, Zap, TrendingUp, 
    Globe, Wallet, BadgeCheck, Users, Headphones, Check
} from 'lucide-react';

const TradingAccounts = () => {
    const tableData = [
        { label: "Base currency", values: ["USD", "USD", "USD", "USD", "USD"] },
        { label: "CFDs", values: ["160+", "160+", "160+", "160+", "160+"] },
        { label: "Margin Call", values: ["100%", "100%", "100%", "100%", "100%"] },
        { label: "Stop out", values: ["35%", "35%", "35%", "35%", "35%"] },
        { label: "Swap Discount", values: ["Basic", "Medium", "High", "Variable", "Variable"] },
        { label: "Free Support", values: [true, true, true, true, true] },
        { label: "Free Education", values: [true, true, true, true, true] },
        { label: "Spread Starting From", values: ["3.8", "2.8", "1.8", "1.4", "0.0"] },
        { label: "Improved Spread Promotion", values: [true, true, true, true, true] },
    ];

    const accountNames = ["Classic", "Silver", "Gold", "Platinum", "VIP"];

    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter">Mirrox Trading Accounts</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 uppercase tracking-widest">
                        Your Trading Journey Begins Here
                    </p>
                </div>
            </section>

            {/* --- COMPARISON TABLE --- */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-8 py-8 text-xs font-black text-gray-400 uppercase tracking-widest">Account Features</th>
                                    {accountNames.map((name, i) => (
                                        <th key={i} className="px-8 py-8 text-center text-xs font-black text-gray-900 uppercase tracking-widest">{name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {tableData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-5 text-sm font-black text-gray-700 uppercase tracking-tight">{row.label}</td>
                                        {row.values.map((val, i) => (
                                            <td key={i} className="px-8 py-5 text-center text-sm font-bold text-[#FF4D5E]">
                                                {typeof val === 'boolean' ? (
                                                    <Check size={18} className="mx-auto text-green-500" />
                                                ) : val}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                    {accountNames.map((name, i) => (
                        <button key={i} className="py-4 border-2 border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-[#FF4D5E] hover:text-[#FF4D5E] transition-all">
                            Open {name}
                        </button>
                    ))}
                </div>
            </section>

            {/* --- PROMOTIONAL BLOCK --- */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 bg-[#FF4D5E] rounded-[3rem] overflow-hidden shadow-2xl items-center">
                    <div className="p-16 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter uppercase whitespace-pre-line text-left">Find Your Perfect{"\n"}Trading Account</h2>
                        <p className="text-rose-100 text-lg font-medium opacity-90 leading-relaxed text-left">
                            Make your accounts today and take advantage of our tailored features and professional support.
                        </p>
                        <div className="pt-4 text-left">
                            <button className="bg-white text-[#FF4D5E] px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                                Contact Us
                            </button>
                        </div>
                    </div>
                    <div className="p-10 bg-white/5 h-full flex items-center justify-center">
                         <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md transform rotate-2">
                             <div className="space-y-6">
                                 <div className="flex gap-2">
                                     <div className="px-4 py-1.5 bg-red-100 text-[#FF4D5E] text-[10px] font-black rounded-lg">Classic</div>
                                     <div className="px-4 py-1.5 bg-gray-100 text-gray-400 text-[10px] font-black rounded-lg">Silver</div>
                                     <div className="px-4 py-1.5 bg-gray-100 text-gray-400 text-[10px] font-black rounded-lg">Gold</div>
                                 </div>
                                 <div className="space-y-4">
                                     {[
                                         {l: "Base Currency", v: "USD"},
                                         {l: "Improved Spreads", v: "Yes"},
                                         {l: "Swap Discount", v: "Medium"},
                                         {l: "Stop Out", v: "35%"}
                                     ].map((item, i) => (
                                         <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-4">
                                             <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.l}</span>
                                             <span className="text-xs font-black text-gray-900">{item.v}</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* --- 3 EASY STEPS --- */}
            <section className="py-24 max-w-5xl mx-auto px-6 text-center">
                <div className="space-y-4 mb-20 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter text-center">Open Your Account in 3 Easy Steps</h2>
                    <p className="text-gray-400 font-medium uppercase tracking-widest text-xs  text-center">Get started with Mirrox today!</p>
                </div>

                <div className="grid md:grid-cols-3 gap-16 relative  text-center">
                    {[
                        { title: "Sign Up", desc: "Fill out the registration form and submit verification documents." },
                        { title: "Make a Deposit", desc: "Choose your payment method and fund your account." },
                        { title: "Start Trading", desc: "Begin your trading journey and explore endless opportunities." }
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-white border-2 border-red-50 rounded-full flex items-center justify-center text-[#FF4D5E] font-black text-xl shadow-lg ring-8 ring-red-50">
                                {i + 1}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{step.title}</h3>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="bg-[#FF4D5E] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
                        Open Account
                    </button>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-[#FF4D5E] py-24 px-10 text-center relative overflow-hidden group shadow-[0_40px_100px_rgba(255,77,94,0.3)]">
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

export default TradingAccounts;
