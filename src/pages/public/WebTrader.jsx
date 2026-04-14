import React from 'react';
import { 
    Monitor, Layout, BarChart, Headphones, Cpu, 
    Smartphone, Zap, CheckCircle2, ArrowRight
} from 'lucide-react';

const WebTrader = () => {
    const features = [
        {
            icon: <Layout className="text-[#FF4D5E]" size={24} />,
            title: "Customizable Interface",
            desc: "Tailor your trading environment to your preferences with flexible interface options. Create a workspace that enhances efficiency."
        },
        {
            icon: <BarChart className="text-[#FF4D5E]" size={24} />,
            title: "Precise Visual Analytics",
            desc: "Use detailed charts and a variety of analytical tools to make data-driven decisions and create more effective strategies."
        },
        {
            icon: <Headphones className="text-[#FF4D5E]" size={24} />,
            title: "Strong Support",
            desc: "Enjoy specialized customer support for any trading-related inquiries. Our skilled team is eager to assist and ensure effectiveness."
        },
        {
            icon: <Cpu className="text-[#FF4D5E]" size={24} />,
            title: "Extensive Trading Tools",
            desc: "Get access to a range of trading tools, including real-time rate streaming, stop-loss/take-profit choices, and extensive charting."
        }
    ];

    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Mirrox Trading Platform</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto uppercase tracking-widest">
                        Versatile Trading Solutions for Modern Investors
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-32 space-y-48">
                
                {/* SECTION 1: WHAT IS WEBTRADER */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-red-50 rounded-[3rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=800" 
                            alt="WebTrader Platform" 
                            className="relative rounded-[2rem] shadow-2xl border border-gray-100"
                        />
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight uppercase tracking-tighter">What is the WebTrader<br/>Trading Platform?</h2>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed">
                            The WebTrader platform is a browser-based trading solution designed for easy access to financial markets. It combines robust security, real-time data, and user-friendly features.
                        </p>
                        <p className="text-gray-500 leading-relaxed">
                            Whether you are a beginner or an experienced trader, our platform provides the tools needed to succeed in the fast-paced world of digital finance.
                        </p>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 shadow-lg shadow-red-100">
                            Trade Online
                        </button>
                    </div>
                </section>

                {/* SECTION 2: SUPERIOR EXPERIENCE */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1 space-y-8 text-right md:text-left">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight uppercase tracking-tighter">Superior WebTrader<br/>Experience</h2>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed">
                            Our WebTrader platform offers a powerful interface with high-speed access to global markets. 
                        </p>
                        <ul className="space-y-4 inline-block text-left">
                            {["Advanced charting tools", "Instant price alerts", "One-click trading", "Real-time execution"].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 font-bold text-gray-700 uppercase tracking-tight text-xs">
                                    <CheckCircle2 size={16} className="text-[#FF4D5E]" /> {item}
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4">
                            <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 shadow-lg shadow-red-100">
                                Start Trading
                            </button>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 relative group">
                        <div className="absolute -inset-4 bg-gray-50 rounded-[3rem] rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" 
                            alt="Superior Experience" 
                            className="relative rounded-[2rem] shadow-2xl border border-gray-100"
                        />
                    </div>
                </section>

                {/* SECTION 3: CONNECT FROM ANYWHERE */}
                <section className="grid md:grid-cols-2 gap-20 items-center text-center md:text-left">
                    <div className="relative group">
                        <div className="flex justify-center -space-x-12">
                             <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500" 
                                className="w-[260px] h-[520px] object-cover rounded-[3rem] border-[10px] border-white shadow-2xl transform -rotate-6 group-hover:-rotate-3 transition-transform"
                                alt="App View"
                             />
                             <img 
                                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=500" 
                                className="w-[260px] h-[520px] object-cover rounded-[3rem] border-[10px] border-white shadow-2xl transform rotate-6 mt-12 group-hover:rotate-3 transition-transform"
                                alt="Mobile UI"
                             />
                        </div>
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight uppercase tracking-tighter">Connect from<br/>Anywhere</h2>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed">
                            Stay connected to the financial markets with real-time data feeds, market analysis tools, and personalized trading insights.
                        </p>
                        <p className="text-gray-500 leading-relaxed">
                             Manage your trades from any location with internet access, supported by expert guidance along your trading journey.
                        </p>
                        <button className="bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 shadow-lg shadow-red-100">
                            Trade with WebTrader
                        </button>
                    </div>
                </section>

                {/* --- PLATFORM FEATURES --- */}
                <section>
                    <div className="text-center mb-24 max-w-2xl mx-auto space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none">Platform Features</h2>
                        <p className="text-gray-500 font-medium">Traders of all levels can benefit from the extensive resources provided by our exceptional platforms.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 hover:border-[#FF4D5E]/20 transition-all duration-500 group flex gap-8">
                                <div className="shrink-0 w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center group-hover:bg-[#FF4D5E] group-hover:text-white transition-colors duration-500">
                                    {f.icon}
                                </div>
                                <div className="space-y-4">
                                     <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{f.title}</h3>
                                     <p className="text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-[#FF4D5E] py-24 px-10 text-center relative overflow-hidden group shadow-[0_40px_100px_rgba(255,77,94,0.3)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl md:text-8xl font-black text-white leading-tight tracking-tighter uppercase whitespace-pre-line">Join Mirrox and{"\n"}Start Trading</h2>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <button className="bg-white text-[#FF4D5E] px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform group">
                                Start Now <ArrowRight size={16} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
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

export default WebTrader;
