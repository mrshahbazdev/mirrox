import React from 'react';
import { Shield, Zap, Headphones, ArrowRight, BookOpen, BarChart2, Globe, Cpu, Clock, Smartphone } from 'lucide-react';

const HomePublic = () => {
    return (
        <div className="bg-white">
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[#0b0e14]">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF4D5E] opacity-10 rounded-full blur-[120px]"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tighter mb-6">
                        Trade <span className="text-[#FF4D5E]">CFDs</span> on Forex,<br className="hidden md:block" /> 
                        Stocks, Indices,<br className="hidden md:block" /> 
                        Commodities and More!
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        Count on Mirrox for a secure and seamless trading experience. Join thousands of traders worldwide.
                    </p>
                    <button className="bg-[#FF4D5E] text-white px-10 py-5 rounded-xl font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-500/20 hover:scale-105 transition-transform">
                        Get Started
                    </button>
                    
                    {/* Laptop Mockup Placeholder */}
                    <div className="mt-16 relative">
                        <img 
                            src="https://images.unsplash.com/photo-1611974715853-268fd9f3906d?auto=format&fit=crop&q=80&w=1200" 
                            alt="Trading Platform" 
                            className="w-full max-w-5xl mx-auto rounded-xl border border-white/5 shadow-2xl shadow-blue-500/10"
                        />
                    </div>
                </div>
                
                {/* Floating Coin Icons (Optional Visual bits) */}
                <div className="absolute top-20 right-[15%] w-10 h-10 bg-yellow-500/10 rounded-full border border-yellow-500/20 flex items-center justify-center animate-bounce">
                    <span className="text-yellow-500 font-bold text-xs font-mono">BTC</span>
                </div>
                <div className="absolute bottom-40 left-[10%] w-12 h-12 bg-blue-500/10 rounded-full border border-blue-500/20 flex items-center justify-center animate-pulse">
                    <span className="text-blue-500 font-bold text-xs font-mono">ETH</span>
                </div>
            </section>

            {/* SHOWCASE SECTIONS */}
            <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
                
                {/* Section 1: All About Trading (App) */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative order-2 md:order-1">
                        <div className="flex justify-center -space-x-12">
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" alt="Mobile App 1" className="w-[280px] h-[580px] object-cover rounded-[3rem] border-[10px] border-white shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500" />
                            <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600" alt="Mobile App 2" className="w-[280px] h-[580px] object-cover rounded-[3rem] border-[10px] border-white shadow-2xl transform rotate-3 mt-12 hover:rotate-0 transition-transform duration-500" />
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">We Are All About Trading</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Experience an abundance of possibilities with Mirrox. Diversify your portfolio with access to over 160+ assets, including Forex, Commodities, and Crypto. Our platform has advanced tools and extensive resources to support your journey.
                        </p>
                        <button className="bg-[#FF4D5E] text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90">
                            Open Account
                        </button>
                    </div>
                </section>

                {/* Section 2: Global Access (Web) */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">Global Access</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Trade from anywhere with Mirrox. Our web-based platform offers robust features, ensuring you never miss a trading opportunity. Access the financial markets on any device with a seamless experience.
                        </p>
                        <button className="bg-[#FF4D5E] text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90">
                            Start Trading
                        </button>
                    </div>
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200" 
                            alt="Web Platform" 
                            className="rounded-2xl shadow-2xl border border-gray-100"
                        />
                    </div>
                </section>
            </div>

            {/* THE MIRROX EDGE */}
            <section className="bg-gray-50 py-24 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-black mb-16">The Mirrox Edge</h2>
                    <div className="grid md:grid-cols-3 gap-12 text-left">
                        {/* Edge Item 1 */}
                        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-[#FF4D5E] mb-8 group-hover:scale-110 transition-transform">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Effortless Trading</h3>
                            <ul className="space-y-3 text-gray-600 font-medium">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E]"></div> Intuitive Interface</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E]"></div> One-Click Trading</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E]"></div> Seamless Navigation</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E]"></div> Custom Experience</li>
                            </ul>
                        </div>
                        {/* Edge Item 2 */}
                        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-[#FF4D5E] mb-8 group-hover:scale-110 transition-transform">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Regulated & Secure</h3>
                            <ul className="space-y-3 text-gray-600 font-medium">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E]"></div> MWALI Regulation</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E]"></div> Segregated Funds</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E]"></div> Advanced Encryption</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E]"></div> SAS 70 Certified</li>
                            </ul>
                        </div>
                        {/* Edge Item 3 */}
                        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow group">
                            <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-[#FF4D5E] mb-8 group-hover:scale-110 transition-transform">
                                <Headphones size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Dedicated Support</h3>
                            <ul className="space-y-3 text-gray-600 font-medium">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E]"></div> 24/7 Multilingual</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E]"></div> Exceptional Service</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E]"></div> Prompt Resolution</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4D5E]"></div> Personalized Support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRADING INSTRUMENTS */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-black text-center mb-16">Mirrox Trading Instruments</h2>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Asset</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Price</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm md:text-base">
                            {[
                                { name: 'EUR/USD', price: '1.0942', change: '+0.12%' },
                                { name: 'Gold (XAU)', price: '2,154.20', change: '-4.15%' },
                                { name: 'S&P 500', price: '5,123.32', change: '+1.56%' },
                                { name: 'Bitcoin', price: '68,230', change: '+2.41%' }
                            ].map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-6 font-bold">{item.name}</td>
                                    <td className="px-6 py-6 font-mono font-medium">{item.price} <span className={item.change.startsWith('+') ? 'text-green-500 ml-2' : 'text-red-500 ml-2'}>{item.change}</span></td>
                                    <td className="px-6 py-6 text-right space-x-2">
                                        <button className="bg-green-500 text-white px-5 py-2 rounded-lg font-bold text-xs uppercase">Buy</button>
                                        <button className="bg-red-500 text-white px-5 py-2 rounded-lg font-bold text-xs uppercase">Sell</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* EDUCATION CENTER */}
            <section className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                        <div className="text-left">
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">Explore Our<br/>Education Center</h2>
                            <p className="text-gray-600 text-lg max-w-md">Learn at your own pace with our structured courses and training materials.</p>
                        </div>
                        <button className="flex items-center gap-2 text-[#FF4D5E] font-bold uppercase text-sm tracking-widest hover:translate-x-2 transition-transform">
                            View All <ArrowRight size={18} />
                        </button>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Course 1 */}
                        <div className="bg-white rounded-2xl h-[450px] overflow-hidden flex flex-col group shadow-sm border border-gray-100">
                            <div className="h-1/2 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" alt="Intro" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-[#FF4D5E] mb-2">
                                    <BookOpen size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Basic</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4">Introduction Courses</h3>
                                <p className="text-gray-500 text-sm mb-auto">Learn the absolute basics of trading and financial markets from scratch.</p>
                                <button className="mt-6 border-2 border-gray-100 text-gray-900 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">Learn More</button>
                            </div>
                        </div>
                        {/* Course 2 */}
                        <div className="bg-white rounded-2xl h-[450px] overflow-hidden flex flex-col group shadow-sm border border-gray-100">
                            <div className="h-1/2 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" alt="Strategies" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-[#FF4D5E] mb-2">
                                    <BarChart2 size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Advanced</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4">Trading Strategies</h3>
                                <p className="text-gray-500 text-sm mb-auto">Develop robust strategies to manage risks and improve consistency.</p>
                                <button className="mt-6 border-2 border-gray-100 text-gray-900 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">Learn More</button>
                            </div>
                        </div>
                        {/* Course 3 */}
                        <div className="bg-white rounded-2xl h-[450px] overflow-hidden flex flex-col group shadow-sm border border-gray-100">
                            <div className="h-1/2 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" alt="Advanced" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-[#FF4D5E] mb-2">
                                    <Cpu size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Expert</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4">Advanced Lessons</h3>
                                <p className="text-gray-500 text-sm mb-auto">Deepen your knowledge with complex analysis and institutional tactics.</p>
                                <button className="mt-6 border-2 border-gray-100 text-gray-900 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">Learn More</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* EXPERT TOOLS */}
            <section className="py-24 bg-[#0b0e14] text-white overflow-hidden relative">
                {/* Visual Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF4D5E] opacity-5 rounded-full blur-[100px]"></div>
                
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black mb-6">Optimize Your Trades with Expert Tools</h2>
                    <p className="text-gray-400 text-lg mb-20 max-w-2xl mx-auto">Leverage advanced chart analysis, stay updated with our economic calendar, and managed risks effectively.</p>
                    
                    {/* Visual Tool Network (Simplification of the Graph) */}
                    <div className="relative flex flex-col items-center">
                        {/* Logo Hub */}
                        <div className="w-32 h-32 bg-[#FF4D5E] rounded-full flex items-center justify-center p-6 shadow-[0_0_50px_rgba(255,77,94,0.3)] mb-20">
                            <span className="text-white font-black text-3xl italic tracking-tighter">M</span>
                        </div>
                        
                        {/* Branches */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FF4D5E] shadow-xl hover:bg-[#FF4D5E] hover:text-white transition-colors cursor-pointer"><Globe /></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Education</span>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FF4D5E] shadow-xl hover:bg-[#FF4D5E] hover:text-white transition-colors cursor-pointer"><Clock /></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Economic Calendar</span>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FF4D5E] shadow-xl hover:bg-[#FF4D5E] hover:text-white transition-colors cursor-pointer"><BarChart2 /></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Trading Central</span>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FF4D5E] shadow-xl hover:bg-[#FF4D5E] hover:text-white transition-colors cursor-pointer"><Smartphone /></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Mobile Charts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ACCOUNT TIERS */}
            <section className="py-24 bg-white max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">Tailored Trading Accounts</h2>
                    <p className="text-gray-600 text-lg">Discover the perfect trading account tailored to your needs.</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-900">
                                <th className="py-6 font-black text-xl">Account Feature</th>
                                <th className="py-6 px-4 text-center text-[#FF4D5E] font-black text-xl">Micro</th>
                                <th className="py-6 px-4 text-center font-black text-xl text-gray-400">Pro</th>
                                <th className="py-6 px-4 text-center font-black text-xl text-gray-400">VIP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { feat: 'Minimum Deposit', micro: '$100', pro: '$2,500', vip: '$25,000' },
                                { feat: 'Spreads', micro: 'Variable', pro: 'Raw', vip: 'Zero' },
                                { feat: 'Leverage', micro: 'Up to 1:500', pro: 'Up to 1:400', vip: 'Custom' },
                                { feat: 'Expert Support', micro: '24/5', pro: '24/7 Priority', vip: 'Personal Manager' }
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-6 font-bold text-gray-700">{row.feat}</td>
                                    <td className="py-6 px-4 text-center font-mono font-bold text-[#FF4D5E] bg-red-50/20">{row.micro}</td>
                                    <td className="py-6 px-4 text-center text-gray-400">{row.pro}</td>
                                    <td className="py-6 px-4 text-center text-gray-400">{row.vip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* FINAL CTA BANNER */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto rounded-[3rem] bg-[#FF4D5E] py-24 px-10 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl md:text-7xl font-black text-white leading-tight">Join Mirrox and<br/>Start Trading Today</h2>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <button className="bg-white text-[#FF4D5E] px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Get Started Now</button>
                            <button className="bg-transparent border-2 border-white/30 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 hover:border-white transition-all">Support Center</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePublic;
