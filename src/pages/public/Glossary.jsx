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

    const filteredTerms = activeLetter === 'A' ? glossaryTerms : [];

    return (
        <div className="lp-wrapper">
            {/* --- HERO SECTION --- */}
            <section className="pub-content-hero">
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1>Mirrox <span style={{ color: 'var(--pub-red)' }}>Glossary</span></h1>
                    <p style={{ margin: '0 auto', maxWidth: '800px' }}>
                        Master the language of the financial markets with precision definitions.
                    </p>
                </div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px', display: 'flex', flexDirection: 'column', gap: '80px' }}>
                {/* A-Z Navigation */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {alphabet.map(letter => (
                        <button 
                            key={letter}
                            onClick={() => setActiveLetter(letter)}
                            style={{ 
                                width: '48px', 
                                height: '48px', 
                                borderRadius: '12px', 
                                fontSize: '14px', 
                                fontWeight: '900', 
                                border: 'none', 
                                cursor: 'pointer', 
                                transition: 'all 0.3s',
                                background: activeLetter === letter ? 'var(--pub-red)' : '#f8fafc',
                                color: activeLetter === letter ? 'white' : '#94a3b8'
                            }}
                        >
                            {letter}
                        </button>
                    ))}
                </div>

                {/* Glossary Table */}
                <div style={{ background: 'white', borderRadius: '48px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '32px 48px', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', width: '30%' }}>Term</th>
                                    <th style={{ padding: '32px 48px', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Definition</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTerms.length > 0 ? filteredTerms.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.3s' }}>
                                        <td style={{ padding: '40px 48px', verticalAlign: 'top' }}>
                                            <span style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{item.term}</span>
                                        </td>
                                        <td style={{ padding: '40px 48px', color: 'var(--pub-text-muted)', lineHeight: '1.6', fontSize: '16px' }}>
                                            {item.def}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" style={{ padding: '120px 48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase' }}>
                                            No terms found for letter "{activeLetter}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                     <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1.8' }}>
                        NOTE: TRADING TERMINOLOGY MAY VARY ACROSS DIFFERENT REGIONS AND PLATFORMS.
                    </p>
                </div>
            </div>

            {/* --- FINAL CTA --- */}
            <section className="lp-cta-block">
                <h2 style={{ textAlign: 'center' }}>Join Mirrox and Start Trading</h2>
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button className="lp-cta-white">Start Now</button>
                </div>
            </section>
        </div>
    );
};
    );
};

export default Glossary;
