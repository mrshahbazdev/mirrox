import React from 'react';
import { 
    Shield, Lock, Eye, FileText, CheckCircle2, 
    ArrowRight, Mail, Globe, Scale
} from 'lucide-react';

const CookiesPrivacy = () => {
    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none">Privacy & Cookies Policy</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                        Our commitment to protecting your personal data and transparency.
                    </p>
                </div>
            </section>

            {/* --- CONTENT SECTION --- */}
            <div className="max-w-4xl mx-auto px-6 py-32 space-y-24">
                
                {/* Introduction */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4 text-[#FF4D5E]">
                        <Shield size={32} />
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">Introduction</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-500 font-medium leading-relaxed space-y-6">
                        <p>
                            Capital Crest Ltd operating under the trading name Mirrox, is a limited liability company registered with the registrar of International Business Companies in Comoros Union, with registration number HT00324037 and is authorised by the Mwali International Services Authority.
                        </p>
                        <p>
                            We understand the importance of maintaining the confidentiality and privacy of personal information that we hold about our clients and other third parties. This Policy outlines how we manage and protect the personal information you give us.
                        </p>
                    </div>
                </section>

                {/* Collection */}
                <section className="space-y-8 p-10 bg-gray-50 rounded-[3rem] border border-gray-100">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">Collection and processing of personal information</h2>
                    <div className="space-y-6 text-gray-500 font-medium leading-relaxed">
                        <p>
                            In order to open an account with us, you must first complete and submit an application form to us by completing the required information. By doing so, you are requested to disclose personal information in order to enable the Company to assess your application and comply with relevant regulations.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Websites and mobile applications",
                                "Account opening and demo sign-up forms",
                                "Customer service communications",
                                "Publicly available sources"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-black uppercase text-gray-400">
                                    <CheckCircle2 size={16} className="text-[#FF4D5E]" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Cookies */}
                <section className="space-y-8">
                     <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">How we use cookies</h2>
                     <p className="text-gray-500 font-medium leading-relaxed">
                        When you use our website, we will use cookies to distinguish you from other users. This helps us to provide you with a more relevant and effective experience when you browse our website and allows us to improve the site generally.
                     </p>
                </section>

                {/* Disclosure */}
                <section className="space-y-8">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">Disclosure of the personal information</h2>
                    <div className="grid md:grid-cols-2 gap-8 text-gray-500 font-medium leading-relaxed">
                        <div className="p-8 bg-red-50/50 rounded-2xl border border-red-100">
                            <p className="text-xs font-black text-[#FF4D5E] uppercase tracking-widest mb-4">Internal Usage</p>
                            To the extent that it is required to do so pursuant to any applicable laws, rules and/or regulations.
                        </div>
                        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">External Disclosure</p>
                            To potential successors in title to our business or third-party consultants acting on our behalf.
                        </div>
                    </div>
                </section>

                {/* Storage & Retention */}
                <section className="space-y-8">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">Storage and retention period</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Safeguarding the privacy of your information is of utmost importance to us. We will hold personal information for as long as we have a business relationship with you, in a combination of secure computer storage facilities and paper-based files.
                    </p>
                    <div className="bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Lock size={120} />
                         </div>
                         <div className="space-y-4 relative z-10">
                            <p className="text-xs font-black uppercase tracking-widest text-[#FF4D5E]">Regulatory Compliance</p>
                            <p className="text-lg font-bold italic">"We are subject to anti-money laundering laws which require us to retain records for a period of seven (7) years after our business relationship ends."</p>
                         </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="space-y-8 border-t border-gray-100 pt-24 text-center">
                    <h2 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">How to contact us</h2>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        If you have any questions regarding this Policy, wish to access or change your information, or if you have any questions about security.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                         <button className="flex items-center justify-center gap-3 bg-[#FF4D5E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 shadow-xl shadow-red-100">
                            <Mail size={18} /> Email Support
                         </button>
                         <button className="flex items-center justify-center gap-3 bg-gray-900 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">
                            <Scale size={18} /> Legal Inquiry
                         </button>
                    </div>
                </section>

            </div>

            {/* --- FINAL CTA --- */}
            <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-[#FF4D5E] py-24 px-10 text-center relative overflow-hidden group shadow-[0_45px_100px_rgba(255,77,94,0.35)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl md:text-8xl font-black text-white leading-tight tracking-tighter uppercase whitespace-pre-line text-center font-['Outfit']">Join Mirrox and{"\n"}Start Trading</h2>
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
                    MIRROX IS FULLY COMMITTED TO THE PROTECTION OF YOUR DATA ACCORDING TO GLOBAL STANDARDS.
                </p>
            </footer>
        </div>
    );
};

export default CookiesPrivacy;
