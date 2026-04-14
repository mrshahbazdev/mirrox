import React, { useState } from 'react';
import { 
    Search, ArrowRight, BookOpen, Globe,
    Shield, Zap, PlayCircle, Smartphone
} from 'lucide-react';

const Glossary = () => {
    const [activeLetter, setActiveLetter] = useState('A');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const glossaryTerms = [
        { term: "Algorithmic Trading", def: "Automated trading using algorithms (known as 'bots') to execute trades at high speed." },
        { term: "Analysis (Technical/Fundamental)", def: "Technical uses historical price charts, while Fundamental analyzes economic indicators." },
        { term: "Appreciation", def: "An increase in the value of an asset. Essential for profit in long positions." },
        { term: "Arbitrage", def: "The practice of taking advantage of a price difference between two or more markets." },
        { term: "Ask Price", def: "The price at which a trader can buy an asset in the market." },
        { term: "Ask Spread", def: "The difference between the bid (buy) and ask (sell) prices, reflecting the cost of trading." },
        { term: "Asset", def: "Anything of value that can be traded, including currencies, stocks, indices, and commodities." },
        { term: "ATR (Average True Range)", def: "A technical indicator used to measure market volatility by averaging the range of price movements." },
        { term: "Aussie", def: "An informal name for the Australian Dollar (AUD)." },
        { term: "Automated Trading", def: "Trading systems that automatically generate and execute buy/sell orders based on pre-set rules." },
        { term: "Available", def: "The amount of funds available to open new positions after accounting for margin requirements." }
    ];

    // Filter logic placeholder (normally we'd filter by activeLetter)
    const filteredTerms = activeLetter === 'A' ? glossaryTerms : [];

    return (
        <div className="bg-white min-h-screen font-['Outfit'] overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="bg-[#FF4D5E] py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Mirrox Glossary</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                        Master the language of the financial markets with precision definitions.
                    </p>
                </div>
            </section>

            {/* --- FILTER & TABLE SECTION --- */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                
                {/* A-Z Navigation */}
                <div className="flex flex-wrap justify-center gap-2 mb-16">
                    {alphabet.map(letter => (
                        <button 
                            key={letter}
                            onClick={() => setActiveLetter(letter)}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-black text-xs transition-all ${activeLetter === letter ? 'bg-[#FF4D5E] text-white shadow-lg shadow-red-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>

                {/* Glossary Table */}
                <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 font-['Outfit']">
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest w-1/4">Term</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Definition</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 uppercase text-[10px] font-black">
                                {filteredTerms.length > 0 ? filteredTerms.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-10 py-8 align-top">
                                            <span className="text-gray-900 tracking-tight text-sm font-black">{item.term}</span>
                                        </td>
                                        <td className="px-10 py-8 text-gray-500 font-medium normal-case leading-relaxed text-sm">
                                            {item.def}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" className="px-10 py-24 text-center text-gray-400 uppercase tracking-widest font-black italic">
                                            No terms found for letter "{activeLetter}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-[#FF4D5E] py-24 px-10 text-center relative overflow-hidden group shadow-[0_45px_100_rgba(255,77,94,0.35)]">
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
                    NOTE: TRADING TERMINOLOGY MAY VARY ACROSS DIFFERENT REGIONS AND PLATFORMS.
                </p>
            </footer>
        </div>
    );
};

export default Glossary;
