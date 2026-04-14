import React from 'react';
import { 
    Mail, MessageSquare, Phone, MapPin, Send, 
    Clock, Globe, Shield
} from 'lucide-react';

const ContactUs = () => {
    const contactMethods = [
        {
            icon: <Mail />,
            title: "Email Support",
            desc: "Detailed assistance via email",
            link: "support@mirrox.com",
            color: "blue"
        },
        {
            icon: <MessageSquare />,
            title: "Live Chat",
            desc: "Real-time customer support",
            link: "Open Chat",
            color: "green"
        },
        {
            icon: <Phone />,
            title: "Phone Call",
            desc: "Immediate voice assistance",
            link: "+1 (800) MIRROX",
            color: "red"
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none">Get in Touch</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 leading-relaxed max-w-2xl mx-auto uppercase tracking-wide">
                        Our expert team is available 24/5 to assist you with any questions or technical support.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid lg:grid-cols-3 gap-8 mb-24">
                    {contactMethods.map((method, i) => (
                        <div key={i} className="bg-gray-50 p-10 rounded-[3rem] border border-transparent hover:border-red-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#FF4D5E] shadow-sm group-hover:bg-[#FF4D5E] group-hover:text-white transition-colors mb-8">
                                {method.icon}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">{method.title}</h3>
                            <p className="text-gray-500 mb-8 font-medium">{method.desc}</p>
                            <p className="text-[#FF4D5E] font-black text-lg">{method.link}</p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    {/* Contact Form */}
                    <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border border-gray-100">
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4">Send a Message</h2>
                            <p className="text-gray-500 font-medium">Fill out the form below and we'll get back to you within 24 hours.</p>
                        </div>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Full Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#FF4D5E] transition-all outline-none font-medium text-gray-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#FF4D5E] transition-all outline-none font-medium text-gray-900" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Subject</label>
                                <select className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#FF4D5E] transition-all outline-none font-medium text-gray-900 appearance-none">
                                    <option>Technical Support</option>
                                    <option>Account Inquiry</option>
                                    <option>Partnerships</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Message</label>
                                <textarea rows="5" placeholder="How can we help you?" className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#FF4D5E] transition-all outline-none font-medium text-gray-900 resize-none"></textarea>
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <input type="checkbox" className="w-5 h-5 accent-[#FF4D5E] rounded" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">I agree to the Terms and Conditions</span>
                            </div>
                            <button className="w-full bg-[#FF4D5E] text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>

                    {/* Reach Section */}
                    <div className="space-y-12 py-10">
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-tight">Global Support<br/>Network</h2>
                            <p className="text-gray-500 text-lg leading-relaxed font-medium">
                                Our support infrastructure spans across multiple timezones to provide the fastest response times in the industry.
                            </p>
                        </div>
                        
                        <div className="space-y-8">
                            {[
                                { icon: <Clock />, title: "24/5 Availability", desc: "Our team is active from Monday morning to Friday night (UTC)." },
                                { icon: <Globe />, title: "Multilingual Support", desc: "Assistance available in over 10 languages." },
                                { icon: <Shield />, title: "Secure Communication", desc: "All data sent via our contact channels is encrypted." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#FF4D5E] shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">{item.title}</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-10">
                            <div className="p-10 bg-gray-900 rounded-[3rem] text-white space-y-6">
                                <div className="flex items-center gap-4 text-[#FF4D5E]">
                                    <MapPin size={24} />
                                    <span className="font-black uppercase tracking-widest text-xs">Headquarters</span>
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">Mwali International Services Authority (MISA)</h3>
                                <p className="text-gray-400 font-medium">Jurisdiction of the island of Mwali - Comoros Union. License: BFX2024064.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CTA Final */}
            <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-gray-50 py-24 px-10 text-center border border-gray-100">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Follow Our Social Channels</h2>
                    <div className="flex flex-wrap justify-center gap-10">
                        {['Twitter', 'LinkedIn', 'YouTube', 'Facebook'].map(social => (
                            <button key={social} className="text-gray-400 hover:text-[#FF4D5E] font-black uppercase tracking-widest text-sm transition-colors">{social}</button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUs;
