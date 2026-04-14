import React from 'react';
import { 
    FileText, Download, Shield, ExternalLink,
    CheckCircle2, ArrowRight, Lock, Globe
} from 'lucide-react';

const Legal = () => {
    const docs = [
        "CLIENT AGREEMENT", "PRIVACY POLICY", "BONUS TERMS", 
        "AML POLICY", "GENERAL FEES", "COMPLAINTS HANDLING PROCEDURE",
        "RISK DISCLOSURE", "MARGIN INFORMATION", "TERMS OF USE",
        "REFUND & CANCELLATION POLICY", "RENEWAL CERTIFICATE"
    ];

    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Mirrox Legal Documents</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                        Access all legal documents, trading terms, and regulatory information.
                    </p>
                </div>
            </section>

            {/* --- DOCUMENT GRID --- */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docs.map((doc, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:border-[#FF4D5E]/30 transition-all group flex flex-col items-start gap-6">
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#FF4D5E] group-hover:bg-[#FF4D5E] group-hover:text-white transition-all duration-500">
                                <FileText size={28} />
                            </div>
                            <div className="space-y-2 flex-grow">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight leading-tight">{doc}</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Official PDF Document</p>
                            </div>
                            <button className="w-full py-4 bg-gray-50 text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FF4D5E] hover:text-white transition-all flex items-center justify-center gap-2">
                                <Download size={14} /> View Document
                            </button>
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
                 <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><Shield size={16} className="text-gray-400"/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Capital Crest Ltd is regulated by the MISA — License Number BFX2024064.</p>
                 </div>
            </footer>
        </div>
    );
};

export default Legal;
