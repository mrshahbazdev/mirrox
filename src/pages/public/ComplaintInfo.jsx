import React from 'react';
import { 
    MessageCircle, Mail, MapPin, Phone, 
    CheckCircle2, AlertTriangle, Send, Shield, Info,
    User, Globe, Clock
} from 'lucide-react';

const ComplaintInfo = () => {
    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden text-left">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start gap-6">
                    <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">Client Complaint Procedure</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 max-w-4xl uppercase tracking-widest leading-relaxed text-left">
                        We aim to resolve any issues promptly. This guide outlines how to submit and track your feedback.
                    </p>
                </div>
            </section>

            {/* --- PROCESS STEPS --- */}
            <div className="max-w-7xl mx-auto px-6 py-32 space-y-48">
                
                {/* Step 1: Submitting */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                         <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-[#FF4D5E] font-black text-2xl">1</div>
                         <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Submitting your Complaint</h2>
                         <p className="text-gray-500 text-lg leading-relaxed">
                            To ensure a quick response, please submit your feedback through our official complaint form or via email. Include your account details and a clear description of the issue.
                         </p>
                         <button className="bg-[#FF4D5E] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-red-100">
                            Process My Complaint Now
                         </button>
                    </div>
                    <div className="relative p-12 bg-red-50/50 rounded-[4rem] flex items-center justify-center overflow-hidden group">
                        <div className="relative bg-white p-10 rounded-2xl shadow-2xl border border-red-100 w-full max-w-sm transform group-hover:-rotate-3 transition-transform duration-700">
                             <div className="flex gap-4 items-center mb-6">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-[#FF4D5E]"><AlertTriangle size={20}/></div>
                                <div className="space-y-1">
                                    <div className="w-24 h-2 bg-gray-100 rounded"></div>
                                    <div className="w-16 h-2 bg-gray-50 rounded"></div>
                                </div>
                             </div>
                             <div className="space-y-3">
                                <div className="w-full h-3 bg-gray-50 rounded"></div>
                                <div className="w-full h-3 bg-gray-50 rounded"></div>
                                <div className="w-2/3 h-3 bg-gray-50 rounded"></div>
                             </div>
                        </div>
                    </div>
                </section>

                {/* Step 2: Acknowledging */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1 relative p-12 bg-gray-50 rounded-[4rem] flex items-center justify-center group overflow-hidden">
                        <div className="relative bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm flex flex-col items-center gap-6 transform group-hover:rotate-3 transition-transform duration-700">
                             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500"><Send size={40}/></div>
                             <div className="text-center space-y-2">
                                <div className="w-32 h-3 bg-gray-100 rounded mx-auto"></div>
                                <div className="w-24 h-2 bg-gray-100 rounded mx-auto"></div>
                             </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-10">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 font-black text-2xl">2</div>
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Acknowledging your Complaint</h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Once submitted, we will acknowledge receipt of your complaint within 24-48 hours. You will receive a unique tracking ID for follow-ups and further communication.
                        </p>
                    </div>
                </section>

                {/* Step 3: Handling */}
                <section className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-2xl">3</div>
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Handling of your Complaint</h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Our compliance team will investigate the matter thoroughly and provide a final response within 7 business days. We strive for fair and transparent resolutions.
                        </p>
                    </div>
                    <div className="relative p-12 bg-blue-50/50 rounded-[4rem] flex items-center justify-center overflow-hidden group">
                         <div className="relative bg-white p-10 rounded-2xl shadow-2xl border border-blue-100 w-full max-w-sm transform group-hover:scale-105 transition-transform duration-700 flex flex-col items-center">
                             <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6"><CheckCircle2 size={32}/></div>
                             <div className="space-y-3 w-full">
                                <div className="w-full h-3 bg-gray-100 rounded"></div>
                                <div className="w-4/5 h-3 bg-gray-50 rounded"></div>
                             </div>
                         </div>
                    </div>
                </section>

                {/* --- CONTACT GRID --- */}
                <section className="pt-24 space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight leading-none">A. Contact Details for Complaints</h2>
                        <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Reach our compliance team directly</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <User/>, title: "Manager", val: "Complaints Officer" },
                            { icon: <Mail/>, title: "Email", val: "complaints@mirrox.com" },
                            { icon: <MapPin/>, title: "Reg Office Address", val: "P.B. 1257 Bonovo Road, Comoros" },
                            { icon: <Phone/>, title: "Phone No", val: "+1 (800) MIRROX" }
                        ].map((c, i) => (
                            <div key={i} className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-xl space-y-6 flex flex-col items-center text-center group hover:bg-[#FF4D5E] transition-all duration-500">
                                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-[#FF4D5E] group-hover:bg-white group-hover:text-[#FF4D5E]">
                                    {c.icon}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-red-100">{c.title}</h4>
                                    <p className="text-sm font-black text-gray-900 group-hover:text-white">{c.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- MISA TABLE --- */}
                <section className="pt-24 space-y-12">
                     <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight leading-none text-center">B. Contact Details of the MISA</h2>
                    </div>
                    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-2xl">
                        <table className="w-full text-left uppercase text-[10px] font-black">
                            <tbody className="divide-y divide-gray-50">
                                <tr>
                                    <td className="px-10 py-6 text-gray-400 bg-gray-50 w-1/3">Website</td>
                                    <td className="px-10 py-6 text-gray-900 tracking-widest italic">mwaliregistrar.com</td>
                                </tr>
                                <tr>
                                    <td className="px-10 py-6 text-gray-400 bg-gray-50">Contact Email</td>
                                    <td className="px-10 py-6 text-gray-900 tracking-widest italic">contact@mwaliregistrar.com</td>
                                </tr>
                                <tr>
                                    <td className="px-10 py-6 text-gray-400 bg-gray-50">Physical Address</td>
                                    <td className="px-10 py-6 text-gray-900 leading-relaxed italic">Mwali International Services Authority, P.B. 1257 Bonovo Road, Fomboni, Comoros.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="px-6 py-24 bg-gray-50">
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

export default ComplaintInfo;
