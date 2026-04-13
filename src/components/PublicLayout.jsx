import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

const PublicLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Map open dropdowns by a key
    const [openDropdowns, setOpenDropdowns] = useState({
        platforms: false,
        markets: false,
        info: false,
        tools: false,
        support: false,
        company: false,
        legal: false,
    });

    const toggleDropdown = (key) => {
        setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Auto-open dropdown if its path is active on mount
    useEffect(() => {
        const path = location.pathname;
        if (['/web-trader', '/trading-app'].includes(path)) setOpenDropdowns(p => ({...p, platforms: true}));
        if (['/forex', '/commodities', '/indices', '/stocks', '/cryptocurrencies-cfds', '/metals'].includes(path)) setOpenDropdowns(p => ({...p, markets: true}));
        if (['/cfd-list', '/cfd-expiries', '/swap-fees', '/market-holidays'].includes(path)) setOpenDropdowns(p => ({...p, info: true}));
        if (['/education', '/economic-calendar', '/trading-central', '/chart-analysis', '/glossary', '/trading-education', '/risk-management-tools'].includes(path)) setOpenDropdowns(p => ({...p, tools: true}));
        if (['/faq', '/contact-us'].includes(path)) setOpenDropdowns(p => ({...p, support: true}));
        if (['/about-us', '/become-a-partner'].includes(path)) setOpenDropdowns(p => ({...p, company: true}));
        if (['/legal', '/complaint-info', '/cookies-privacy'].includes(path)) setOpenDropdowns(p => ({...p, legal: true}));
        
        // Close mobile sidebar on navigation
        if (sidebarOpen) {
            setSidebarOpen(false);
        }
    }, [location.pathname]);

    // Active link styles helper
    const getNavLinkClass = ({ isActive }) => isActive ? 'submenu-item active' : 'submenu-item';
    const getSingleLinkClass = ({ isActive }) => isActive ? 'single-link active red-text mb-1' : 'single-link mb-1';

    return (
        <div className="bg-gray-50 min-h-screen text-[#1a1a1a] font-['Plus_Jakarta_Sans'] antialiased">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-6 h-6 bg-[#FF4D5E] flex items-center justify-center rounded-sm">
                        <span className="text-white font-bold text-[10px]">BV</span>
                    </div>
                    <span className="font-bold text-lg tracking-tighter">BULLVERA</span>
                </div>
                <button onClick={toggleSidebar} className="p-2 text-[#FF4D5E]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>

            <div className="flex">
                {/* Sidebar */}
                <aside id="sidebar" className={`sidebar fixed top-0 bottom-0 left-0 w-[280px] bg-gray-50 border-r z-50 flex flex-col overflow-y-auto md:translate-x-0 ${sidebarOpen ? 'active' : ''}`}>
                    <div className="p-8 hidden md:block bg-white cursor-pointer" onClick={() => navigate('/')}>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#FF4D5E] flex items-center justify-center rounded-sm">
                                <span className="text-white font-bold text-[12px]">BV</span>
                            </div>
                            <span className="font-bold text-xl tracking-tighter">BULLVERA</span>
                        </div>
                    </div>

                    <nav className="flex-1 pt-16 md:pt-2">
                        <NavLink to="/" className={getSingleLinkClass}>Home</NavLink>

                        {/* Platforms Dropdown */}
                        <div className={`sidebar-group has-submenu ${openDropdowns.platforms ? 'open' : ''}`}>
                            <div className="sidebar-item-header" onClick={() => toggleDropdown('platforms')}>
                                <span>Platforms</span>
                                <div className="arrow"></div>
                            </div>
                            <div className="submenu">
                                <NavLink to="/web-trader" className={getNavLinkClass}>Web Trader</NavLink>
                                <NavLink to="/trading-app" className={getNavLinkClass}>Trading App</NavLink>
                            </div>
                        </div>

                        {/* Markets Dropdown */}
                        <div className={`sidebar-group has-submenu ${openDropdowns.markets ? 'open' : ''}`}>
                            <div className="sidebar-item-header" onClick={() => toggleDropdown('markets')}>
                                <span>Markets</span>
                                <div className="arrow"></div>
                            </div>
                            <div className="submenu">
                                <NavLink to="/forex" className={getNavLinkClass}>Forex</NavLink>
                                <NavLink to="/commodities" className={getNavLinkClass}>Commodities</NavLink>
                                <NavLink to="/indices" className={getNavLinkClass}>Indices</NavLink>
                                <NavLink to="/stocks" className={getNavLinkClass}>Stocks</NavLink>
                                <NavLink to="/cryptocurrencies-cfds" className={getNavLinkClass}>Cryptocurrencies CFDs</NavLink>
                                <NavLink to="/metals" className={getNavLinkClass}>Metals</NavLink>
                            </div>
                        </div>

                        <NavLink to="/trading-accounts" className={getSingleLinkClass}>Trading Accounts</NavLink>

                        {/* Trading Info Dropdown */}
                        <div className={`sidebar-group has-submenu ${openDropdowns.info ? 'open' : ''}`}>
                            <div className="sidebar-item-header" onClick={() => toggleDropdown('info')}>
                                <span>Trading Info</span>
                                <div className="arrow"></div>
                            </div>
                            <div className="submenu">
                                <NavLink to="/cfd-list" className={getNavLinkClass}>CFD List</NavLink>
                                <NavLink to="/cfd-expiries" className={getNavLinkClass}>CFD Expiries</NavLink>
                                <NavLink to="/swap-fees" className={getNavLinkClass}>Swap Fees</NavLink>
                                <NavLink to="/market-holidays" className={getNavLinkClass}>Market Holidays</NavLink>
                            </div>
                        </div>

                        {/* Trading Tools Dropdown */}
                        <div className={`sidebar-group has-submenu ${openDropdowns.tools ? 'open' : ''}`}>
                            <div className="sidebar-item-header" onClick={() => toggleDropdown('tools')}>
                                <span>Trading Tools</span>
                                <div className="arrow"></div>
                            </div>
                            <div className="submenu">
                                <NavLink to="/education" className={getNavLinkClass}>Education</NavLink>
                                <NavLink to="/economic-calendar" className={getNavLinkClass}>Economic Calendar</NavLink>
                                <NavLink to="/trading-central" className={getNavLinkClass}>Trading Central</NavLink>
                                <NavLink to="/chart-analysis" className={getNavLinkClass}>Chart Analysis</NavLink>
                                <NavLink to="/glossary" className={getNavLinkClass}>Glossary</NavLink>
                                <NavLink to="/trading-education" className={getNavLinkClass}>Trading Education</NavLink>
                                <NavLink to="/risk-management-tools" className={getNavLinkClass}>Risk Management Tools</NavLink>
                            </div>
                        </div>

                        {/* Support Dropdown */}
                        <div className={`sidebar-group has-submenu ${openDropdowns.support ? 'open' : ''}`}>
                            <div className="sidebar-item-header" onClick={() => toggleDropdown('support')}>
                                <span>Support</span>
                                <div className="arrow"></div>
                            </div>
                            <div className="submenu">
                                <NavLink to="/faq" className={getNavLinkClass}>FAQ</NavLink>
                                <NavLink to="/contact-us" className={getNavLinkClass}>Contact Us</NavLink>
                            </div>
                        </div>

                        {/* Company Dropdown */}
                        <div className={`sidebar-group has-submenu ${openDropdowns.company ? 'open' : ''}`}>
                            <div className="sidebar-item-header" onClick={() => toggleDropdown('company')}>
                                <span>Company</span>
                                <div className="arrow"></div>
                            </div>
                            <div className="submenu">
                                <NavLink to="/about-us" className={getNavLinkClass}>About Us</NavLink>
                                <NavLink to="/become-a-partner" className={getNavLinkClass}>Become a Partner</NavLink>
                            </div>
                        </div>

                        {/* Legal Dropdown */}
                        <div className={`sidebar-group has-submenu ${openDropdowns.legal ? 'open' : ''}`}>
                            <div className="sidebar-item-header" onClick={() => toggleDropdown('legal')}>
                                <span>Legal</span>
                                <div className="arrow"></div>
                            </div>
                            <div className="submenu">
                                <NavLink to="/legal" className={getNavLinkClass}>Legal</NavLink>
                                <NavLink to="/complaint-info" className={getNavLinkClass}>Complaint Info</NavLink>
                                <NavLink to="/cookies-privacy" className={getNavLinkClass}>Cookies & Privacy</NavLink>
                            </div>
                        </div>
                    </nav>

                    {/* Registration Footer Area */}
                    <div className="p-6 bg-white border-t">
                        <button 
                            onClick={() => navigate('/register')}
                            className="w-full bg-[#FF4D5E] text-white py-4 rounded-lg text-sm font-bold uppercase tracking-widest shadow-lg shadow-red-100 hover:opacity-90 transition-all">
                            Registration
                        </button>
                        <div className="text-center mt-4">
                            <p className="text-xs text-gray-500">Already have an account? <span onClick={() => navigate('/login')} className="text-[#FF4D5E] font-bold cursor-pointer">Login</span></p>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="main-content flex-1 md:ml-[280px] pt-16 md:pt-0">
                    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                        <Outlet />
                    </div>

                    {/* Default Footer */}
                    <footer className="bg-white border-t border-gray-200 py-16">
                        <div className="max-w-4xl mx-auto px-8">
                            <div className="text-[12px] text-gray-600 leading-relaxed mb-8 bg-gray-50 p-6 rounded-xl">
                                <h5 className="font-bold text-gray-900 mb-2 uppercase">Risk Warning</h5>
                                Trading financial instruments involves significant risk. You should ensure you fully understand the risks and seek advice if necessary. Bullvera Group © 2026.
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default PublicLayout;
