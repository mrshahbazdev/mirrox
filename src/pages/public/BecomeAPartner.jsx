import React from 'react';
import { 
    Users, Briefcase, BarChart, Rocket, DollarSign, 
    Gift, Headphones, ShieldCheck, ArrowRight, UserPlus
} from 'lucide-react';

const BecomeAPartner = () => {
    const partnershipBenefits = [
        { icon: <ShieldCheck />, title: "Regulated Broker", desc: "Partner with a licensed and trusted global entity." },
        { icon: <Gift />, title: "Custom Promotions", desc: "Access high-converting creative materials for your audience." },
        { icon: <BarChart />, title: "Advanced Analytics", desc: "Real-time tracking of your referrals and earnings." },
        { icon: <Headphones />, title: "24/7 PM Support", desc: "Dedicated managers to help grow your network." }
    ];

    const plans = [
        {
            name: "Conversion Program",
            focus: "Performance Based",
            desc: "Earn fixed commissions for every verified trader you refer to Mirrox.",
            features: ["Tiered CPA structure", "Instant payouts", "Marketing kits"],
            cta: "Get Started"
        },
        {
            name: "Valued Partner",
            focus: "Volume Based",
            desc: "Customized rewards for high-volume partners and specialized affiliates.",
            features: ["Custom revenue sharing", "White-label options", "VIP support"],
            cta: "Contact Manager"
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* --- HERO SECTION --- */}
            <section className="bg-gray-950 py-32 px-6 text-center relative overflow-hidden text-white">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF4D5E] opacity-[0.08] rounded-full blur-[120px] pointer-events-none"></div>
                <div className="relative z-10 max-w-5xl mx-auto space-y-8">
                    <div className="inline-block px-4 py-1.5 bg-[#FF4D5E]/10 text-[#FF4D5E] font-black text-[10px] rounded-full uppercase tracking-widest">Growth Opportunities</div>
                    <h1 className="text-4xl md:text-8xl font-black leading-[1.1] tracking-tighter uppercase">Partner with<br/>the Best in<br/><span className="text-[#FF4D5E]">Trading</span></h1>
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto uppercase tracking-wide opacity-80 decoration-red-500/20 underline underline-offset-8">
                        The Mirrox Affiliate Program offers a unique opportunity to expand your network, boost your revenue, and reach your financial goals.
                    </p>
                    <div className="pt-8">
                        <button className="bg-[#FF4D5E] text-white px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(255,77,94,0.3)] hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
                           Join Program <UserPlus size={18} />
                        </button>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-32 space-y-32">
                {/* --- WHY PARTNER --- */}
                <section>
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter">Why Partner with Mirrox?</h2>
                        <p className="text-gray-500 mt-6 text-lg max-w-2xl mx-auto font-medium">Join an ecosystem designed for success, featuring top-notch security and industry-leading conversions.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {partnershipBenefits.map((item, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 hover:border-[#FF4D5E]/20 transition-all duration-500 group">
                                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#FF4D5E] shadow-sm mb-6 group-hover:bg-[#FF4D5E] group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- PLANS SECTION --- */}
                <section className="bg-gray-50 rounded-[4rem] p-10 md:p-20 overflow-hidden relative">
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FF4D5E]/5 rounded-full blur-[80px]"></div>
                    <div className="relative z-10">
                        <div className="max-w-3xl mb-16">
                            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-6 leading-tight text-glow">Flexible Earnings For Every Partner</h2>
                            <p className="text-gray-500 text-lg font-medium">Choose the plan that best fits your strategy and start maximizing your potential with our tailored programs.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {plans.map((plan, i) => (
                                <div key={i} className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 space-y-8 group hover:-translate-y-2 transition-transform duration-500">
                                    <div className="space-y-4">
                                        <div className="text-[#FF4D5E] mb-2"><Briefcase size={32} /></div>
                                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{plan.name}</h3>
                                        <div className="inline-block px-3 py-1 bg-red-50 text-[#FF4D5E] text-[10px] font-black rounded-lg uppercase tracking-widest">{plan.focus}</div>
                                    </div>
                                    <p className="text-gray-500 font-medium leading-relaxed">{plan.desc}</p>
                                    <ul className="space-y-3">
                                        {plan.features.map((f, j) => (
                                            <li key={j} className="flex items-center gap-2 text-xs font-black uppercase tracking-tight text-gray-400 group-hover:text-gray-900 transition-colors">
                                                <Rocket size={14} className="text-[#FF4D5E]" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full py-5 rounded-2xl border-2 border-gray-900 text-gray-900 font-black text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                                        {plan.cta}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- MARKETING SECTION --- */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-red-50 text-[#FF4D5E] font-black text-[10px] rounded-full uppercase tracking-widest">Marketing Simplicity</div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-[1.1]">Everything You Need to Succeed</h2>
                        <p className="text-gray-500 text-lg leading-relaxed font-medium">
                            Promoting Mirrox is easier with our professional marketing resources. Access banners, email templates, and creative assets designed to engage and convert.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {["Ready-to-use Banners", "High-Converting Landings", "Email Swipe Copies", "Multi-Asset Creative"].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-900 font-black text-sm uppercase tracking-wide">
                                    <DollarSign size={18} className="text-[#FF4D5E]" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="bg-gray-900 rounded-[3rem] p-10 shadow-2xl overflow-hidden group">
                             <div className="grid grid-cols-2 gap-4 opacity-40 group-hover:opacity-60 transition-opacity">
                                <div className="h-48 bg-white/5 rounded-2xl animate-pulse"></div>
                                <div className="h-48 bg-[#FF4D5E]/20 rounded-2xl"></div>
                                <div className="h-48 bg-white/10 rounded-2xl"></div>
                                <div className="h-48 bg-white/5 rounded-2xl animate-pulse"></div>
                             </div>
                             <div className="absolute inset-0 flex items-center justify-center p-10 text-center">
                                <div className="space-y-4">
                                    <h4 className="text-white text-2xl font-black uppercase">Creative Hub</h4>
                                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Access our full asset suite</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA FORM --- */}
            <section className="bg-[#FF4D5E] py-32 px-6 text-white text-center">
                <div className="max-w-4xl mx-auto space-y-12">
                     <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-tight">Ready to Become a<br/>Mirrox Partner?</h2>
                     <p className="text-rose-100 text-lg font-medium opacity-80 uppercase tracking-widest">Your dedicated manager is waiting to assist you.</p>
                     
                     <div className="bg-white p-10 md:p-16 rounded-[4rem] text-gray-900 shadow-2xl text-left max-w-2xl mx-auto">
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                                <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#FF4D5E] outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Work Email</label>
                                <input type="email" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#FF4D5E] outline-none" />
                            </div>
                            <button className="w-full bg-[#FF4D5E] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-102 transition-transform">
                                Submit Application
                            </button>
                        </form>
                     </div>
                </div>
            </section>
        </div>
    );
};

export default BecomeAPartner;
