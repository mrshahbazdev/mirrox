import React from 'react';
import { 
    Download, Mail, ShieldCheck, ArrowRight, Smartphone, 
    CheckCircle2, Globe, QrCode
} from 'lucide-react';

const TradingApp = () => {
    const steps = [
        {
            title: "Visit application page on Firebase",
            desc: "Start by navigating to our official application distribution page on Firebase.",
            side: "left",
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=500"
        },
        {
            title: "Sign up with your email",
            desc: "Register with your trading email to be added to our authorized user list for app access.",
            side: "right",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500"
        },
        {
            title: "Check your email for invitation",
            desc: "Look for an invitation link sent by Firebase to your inbox and accept it to proceed.",
            side: "left",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=500"
        },
        {
            title: "Enable unknown sources",
            desc: "Open your device settings and allow installations from unknown sources to install the tester.",
            side: "right",
            image: null
        },
        {
            title: "Download App Tester",
            desc: "Accept the invitation, download App Tester, and use Firebase Distribution to get the Mirrox app.",
            side: "left",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=500"
        },
        {
            title: "Install & Start Trading",
            desc: "Follow the prompts to install the Mirrox app and begin your premium trading experience.",
            side: "right",
            image: "https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=500"
        }
    ];

    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">How to Install the<br/>Firebase Test App</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto uppercase tracking-widest">
                        Follow our step-by-step guide to get started with the Mirrox mobile experience.
                    </p>
                </div>
            </section>

            {/* --- TIMELINE SECTION --- */}
            <div className="max-w-7xl mx-auto px-6 py-32 relative">
                
                {/* Vertical Timeline Line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-32 bottom-32 w-0.5 bg-red-100 hidden md:block"></div>

                <div className="space-y-24 md:space-y-48">
                    {steps.map((step, i) => (
                        <div key={i} className="relative group">
                            {/* Step Number Circle */}
                            <div className="absolute left-1/2 -translate-x-1/2 -top-12 md:top-1/2 md:-translate-y-1/2 w-16 h-16 bg-white border-4 border-red-50 rounded-full flex items-center justify-center text-[#FF4D5E] font-black text-xl z-10 shadow-xl group-hover:scale-110 transition-transform">
                                {i + 1}
                            </div>

                            <div className={`grid md:grid-cols-2 gap-12 md:gap-32 items-center ${step.side === 'right' ? 'md:rtl' : ''}`}>
                                {/* Content Side */}
                                <div className={`space-y-8 ${step.side === 'right' ? 'md:ltr text-left' : 'text-right'}`}>
                                    <div className={`inline-block px-4 py-1.5 bg-red-50 text-[#FF4D5E] font-black text-[10px] rounded-full uppercase tracking-widest ${step.side === 'right' ? '' : 'ml-auto'}`}>
                                        Step {i + 1}
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                                        {step.title}
                                    </h2>
                                    <p className="text-gray-500 text-lg font-medium leading-relaxed">
                                        {step.desc}
                                    </p>
                                    {i === 0 && (
                                        <div className="flex gap-4 pt-4 justify-end">
                                            <button className="bg-[#FF4D5E] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-red-100">
                                                Visit Firebase
                                            </button>
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                                <QrCode size={20} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Image Side */}
                                <div className={`relative ${step.image ? '' : 'min-h-[200px] md:min-h-0'}`}>
                                    {step.image ? (
                                        <div className="relative">
                                            <div className={`absolute -inset-4 bg-gray-50 rounded-[3rem] ${i % 2 === 0 ? 'rotate-3' : '-rotate-3'} group-hover:rotate-0 transition-transform duration-500`}></div>
                                            <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl border border-gray-100">
                                                <img 
                                                    src={step.image} 
                                                    alt={step.title} 
                                                    className="w-full h-auto rounded-[2.5rem] object-cover aspect-[9/16]"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-[#FF4D5E] animate-pulse">
                                                <Smartphone size={40} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-[#FF4D5E] py-24 px-10 text-center relative overflow-hidden group shadow-[0_40px_100px_rgba(255,77,94,0.3)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl md:text-8xl font-black text-white leading-tight tracking-tighter uppercase whitespace-pre-line">Join Mirrox and{"\n"}Start Trading</h2>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <button className="bg-white text-[#FF4D5E] px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform group">
                                Open Account <ArrowRight size={16} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

             <footer className="text-center pb-16 px-6">
                <p className="max-w-4xl mx-auto text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-80 decoration-dotted underline underline-offset-4">
                    RISK WARNING: TRADING CFDs INVOLVES SIGNIFICANT RISK TO YOUR INVESTED CAPITAL.
                </p>
            </footer>
        </div>
    );
};

export default TradingApp;
