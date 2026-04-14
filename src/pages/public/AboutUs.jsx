import React from 'react';
import { 
    Shield, Target, Users, Globe, Award, CheckCircle2, 
    ArrowRight, Heart, Zap, BadgeCheck
} from 'lucide-react';

const AboutUs = () => {
    const values = [
        {
            icon: <Heart />,
            title: "Client-Centered",
            desc: "The needs of our clients are the center of our services. We offer personal assistance and tools to ensure an effortless experience."
        },
        {
            icon: <Shield />,
            title: "Integrity",
            desc: "Transparency and honesty are at the heart of our operations. We maintain high ethical standards to build long-lasting trust."
        },
        {
            icon: <Zap />,
            title: "Innovation",
            desc: "We constantly seek ways to improve our platforms. We believe in the power of technology to transform trading."
        },
        {
            icon: <Target />,
            title: "Excellence",
            desc: "We equip our traders with extensive educational tools and resources to help them make informed decisions."
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Your Global Trading Partner</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 leading-relaxed max-w-2xl mx-auto">
                        Empowering traders worldwide with innovation, transparency, and institutional-grade technology.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-32 space-y-32">
                {/* --- INTRO SECTION --- */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-red-50 rounded-3xl -rotate-2"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                            alt="Mirrox Vision" 
                            className="relative rounded-2xl shadow-2xl border border-gray-100"
                        />
                    </div>
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-red-50 text-[#FF4D5E] font-black text-[10px] rounded-full uppercase tracking-widest">Introducing Mirrox</div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tighter uppercase">Redefining the<br/>Standard of Trading</h2>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium">
                            Mirrox is a leading online trading platform, offering access to over 160+ CFDs on various assets, including Forex, commodities, and more. 
                        </p>
                        <p className="text-gray-500">
                            Founded on the principles of innovation and client satisfaction, Mirrox provides cutting-edge tools, educational resources, and exceptional support to help traders of all levels navigate the financial markets confidently.
                        </p>
                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div>
                                <h4 className="text-3xl font-black text-[#FF4D5E]">160+</h4>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tradeable Assets</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-[#FF4D5E]">24/5</h4>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Expert Support</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- VALUES SECTION --- */}
                <section>
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">Our Core Principles</h2>
                        <div className="w-24 h-2 bg-[#FF4D5E] mx-auto mt-6 rounded-full"></div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((val, i) => (
                            <div key={i} className="bg-gray-50 p-10 rounded-[2.5rem] space-y-6 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-gray-100 group">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#FF4D5E] shadow-sm group-hover:bg-[#FF4D5E] group-hover:text-white transition-colors">
                                    {val.icon}
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{val.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- REGULATORY SECTION --- */}
                <section className="bg-gray-900 rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF4D5E] opacity-[0.05] rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="w-16 h-16 bg-[#FF4D5E] rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,77,94,0.3)]">
                                <Award size={32} />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">Regulatory Commitment<br/>& Security</h2>
                            <div className="space-y-6 text-gray-400 font-medium leading-relaxed">
                                <p>
                                    Regulated by the Mwali International Services Authority (MISA), Mirrox ensures adherence to the highest standards of financial security and transparency.
                                </p>
                                <div className="space-y-3 pt-4">
                                    <p className="flex items-center gap-3 text-white text-sm"><CheckCircle2 size={18} className="text-[#FF4D5E]" /> License: BFX2024064</p>
                                    <p className="flex items-center gap-3 text-white text-sm"><CheckCircle2 size={18} className="text-[#FF4D5E]" /> Registration: HT00324037</p>
                                    <p className="flex items-center gap-3 text-white text-sm"><CheckCircle2 size={18} className="text-[#FF4D5E]" /> Jurisdiction: Mwali - Comoros Union</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8 backdrop-blur-sm">
                            <h3 className="text-2xl font-black uppercase tracking-tight">Segregated Client Funds</h3>
                            <p className="text-gray-400 font-medium leading-relaxed">
                                At Mirrox, client funds are kept in segregated accounts, separate from company funds. This ensures added security and trust, protecting our clients' investments at all times.
                            </p>
                            <div className="pt-4">
                                <button className="bg-white text-gray-900 px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-100">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="px-6 pb-24 text-center">
                <div className="max-w-4xl mx-auto space-y-12">
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-tight">Start Your Journey with<br/>a Trusted Partner</h2>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <button className="bg-[#FF4D5E] text-white px-16 py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Open Account</button>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-60">Join 100,000+ traders around the globe</p>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
