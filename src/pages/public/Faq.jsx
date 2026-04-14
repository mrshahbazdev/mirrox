import React, { useState } from 'react';
import { Plus, Minus, ArrowRight, UserPlus, Wallet, PlayCircle } from 'lucide-react';

const FAQ_DATA = {
    "Account Details": [
        { q: "How do I register for an account with Mirrox?", a: "To sign up with Mirrox, complete the registration form with your personal information. Your details will be securely stored and kept confidential." },
        { q: "What is the cost of opening an account with Mirrox?", a: "Opening an account with Mirrox is free of charge." },
        { q: "How do I verify My Mirrox trading account?", a: "To verify your Mirrox trading account, you need to submit: Valid Proof of ID (passport, ID card, or driver’s license) and a clear selfie, and Valid Proof of Residence (utility bill or bank statement issued within the last six months)." },
        { q: "How can I log in to My account?", a: "Click on the “Login” button at the top right of the Mirrox website and enter your username and password to access your account." },
        { q: "When can I start trading?", a: "You can start trading once your account is verified and you have deposited funds." }
    ],
    "Trading Accounts": [
        { q: "What types of trading accounts does Mirrox offer?", a: "Mirrox offers five different account types to suit various trading needs. Details are available on the Account Types page of our website." },
        { q: "What is the maximum leverage available at Mirrox?", a: "The maximum leverage available at Mirrox is 1:400 across all account types." },
        { q: "Does Mirrox offer a demo account?", a: "Yes, Mirrox offers a demo trading account with a virtual balance of 100,000 USD to practice trading in a risk-free environment." },
        { q: "Is My personal information secure with Mirrox?", a: "Mirrox uses advanced security technologies, including 128-bit SSL encryption, to protect your personal information." }
    ],
    "Deposits": [
        { q: "What is the minimum deposit amount?", a: "The minimum deposit is 250 USD or equivalent in other currencies." },
        { q: "How can I deposit funds into My account?", a: "You can deposit funds via credit/debit cards, wire transfers, and various alternative payment methods." },
        { q: "Does Mirrox charge any deposit fees?", a: "Mirrox does not charge any deposit fees. However, your payment provider may apply processing fees or exchange rate adjustments." }
    ],
    "Withdrawals": [
        { q: "How do I request a withdrawal?", a: "To request a withdrawal, log in to your account, go to the 'Withdrawal' section, enter the amount, and submit the request." },
        { q: "What is the minimum withdrawal amount?", a: "The minimum withdrawal amount is 10 USD for credit cards and 100 USD for wire transfers." },
        { q: "How long does it take to process a withdrawal?", a: "Withdrawals typically take 8 to 10 business days, depending on your bank’s processing time." }
    ],
    "Fees": [
        { q: "Are there any withdrawal fees?", a: "Withdrawal fees may apply depending on the method and circumstances. Refer to our General Fees for detailed information." },
        { q: "Is there an inactivity fee?", a: "Yes, a maintenance fee of 10 USD is charged monthly. Additional inactivity fees apply if the account remains unused for over a month." }
    ],
    "Legal & Compliance": [
        { q: "Is Mirrox a regulated broker?", a: "Yes, Mirrox is regulated by the Mwali International Services Authority (MISA). Our license number is BFX2024064." },
        { q: "Are My funds protected?", a: "Yes, client funds are held in segregated accounts to protect your investments." },
        { q: "What is the minimum age to trade with Mirrox?", a: "You must be at least 18 years old to open an account and trade with Mirrox." }
    ],
    "Trading": [
        { q: "Is negative balance protection provided?", a: "Yes, negative balance protection is provided to prevent you from losing more than your initial investment." },
        { q: "Can I trade on weekends?", a: "Major financial markets are closed on weekends, but Cryptocurrency trading remains available 24/7." },
        { q: "What is a pip?", a: "A pip (percentage in point) is the smallest price change in the value of a currency pair." }
    ],
    "General": [
        { q: "How can I contact customer support?", a: "Contact our support team via email, phone, or live chat for immediate assistance." },
        { q: "Do you provide educational resources for beginners?", a: "Yes, we provide extensive resources, including an Education Center, to help beginners get started." }
    ]
};

const Faq = () => {
    const [activeTab, setActiveTab] = useState("Account Details");
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="bg-white min-h-screen">
            {/* HERO SECTION */}
            <section className="bg-[#FF4D5E] py-24 md:py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Mirrox Help Center</h1>
                    <p className="text-rose-100 text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-90">
                        All Your Trading Information in One Place. Find answers to your most common questions.
                    </p>
                </div>
                
                {/* Horizontal Tabs Area */}
                <div className="relative z-20 mt-16 max-w-6xl mx-auto">
                    <div className="flex overflow-x-auto no-scrollbar gap-2 justify-start md:justify-center p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                        {Object.keys(FAQ_DATA).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setOpenIndex(0); }}
                                className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                                    activeTab === tab 
                                    ? "bg-white text-[#FF4D5E] shadow-xl" 
                                    : "text-white hover:bg-white/10"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ACCORDION SECTION */}
            <section className="max-w-4xl mx-auto px-6 py-24">
                <h2 className="text-3xl font-black text-gray-900 mb-12 flex items-center gap-4">
                    {activeTab}
                </h2>
                
                <div className="space-y-4">
                    {FAQ_DATA[activeTab].map((item, idx) => (
                        <div 
                            key={idx} 
                            className={`border rounded-2xl transition-all duration-300 ${
                                openIndex === idx ? "border-[#FF4D5E] bg-red-50/10 shadow-sm" : "border-gray-100 hover:border-gray-200"
                            }`}
                        >
                            <button 
                                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                className="w-full text-left px-8 py-6 flex items-center justify-between group"
                            >
                                <span className={`font-bold text-lg md:text-xl transition-colors ${openIndex === idx ? "text-[#FF4D5E]" : "text-gray-900"}`}>
                                    {item.q}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === idx ? "bg-[#FF4D5E] text-white rotate-180" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"}`}>
                                    {openIndex === idx ? <Minus size={18} /> : <Plus size={18} />}
                                </div>
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? "max-height-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                <div className="px-8 pb-8 text-gray-600 text-lg leading-relaxed">
                                    {item.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* HAVE MORE QUESTIONS SECTION */}
            <section className="px-6 pb-24">
                <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#FF4D5E] to-[#FF6B6B] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row items-center">
                    <div className="flex-1 p-12 md:p-20 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Have More Questions?</h2>
                        <p className="text-rose-100 text-lg mb-10 opacity-90">Our support team is here for you 24/7. Get in touch with us anytime.</p>
                        <button className="bg-white text-[#FF4D5E] px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">
                            Get In Touch
                        </button>
                    </div>
                    {/* Visual UI Mockup Placeholder */}
                    <div className="flex-1 p-8 hidden md:block">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 transform rotate-3 scale-110">
                            <div className="space-y-4">
                                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                                <div className="h-4 bg-white/20 rounded w-1/2"></div>
                                <div className="grid grid-cols-3 gap-4 mt-8">
                                    <div className="h-20 bg-white/10 rounded-xl border border-white/10"></div>
                                    <div className="h-20 bg-white/10 rounded-xl border border-white/10"></div>
                                    <div className="h-20 bg-white/10 rounded-xl border border-white/10"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3 EASY STEPS */}
            <section className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Open Your Account in 3 Easy Steps</h2>
                    <p className="text-gray-500 text-lg mb-20">Get started with Mirrox today!</p>
                    
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center group">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#FF4D5E] text-2xl font-black shadow-lg border border-gray-100 mb-8 group-hover:bg-[#FF4D5E] group-hover:text-white transition-all">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-4">Sign Up</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Fill out the registration form and submit verification documents.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-center group">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#FF4D5E] text-2xl font-black shadow-lg border border-gray-100 mb-8 group-hover:bg-[#FF4D5E] group-hover:text-white transition-all">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-4">Make a Deposit</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Choose your payment method and fund your trading account.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-center group">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#FF4D5E] text-2xl font-black shadow-lg border border-gray-100 mb-8 group-hover:bg-[#FF4D5E] group-hover:text-white transition-all">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-4">Start Trading</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Begin your journey and explore endless financial opportunities.</p>
                        </div>
                    </div>
                    
                    <button className="mt-20 bg-[#FF4D5E] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
                        Open Account
                    </button>
                </div>
            </section>

            {/* FINALE CTA BANNER */}
            <section className="px-6 py-24">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-[#FF4D5E] py-24 px-10 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl md:text-7xl font-black text-white leading-tight">Join Mirrox and<br/>Start Trading</h2>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <button className="bg-white text-[#FF4D5E] px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Get Started Now</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Faq;
