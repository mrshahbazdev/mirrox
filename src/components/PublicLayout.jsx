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
        <div className="pub-layout">
            {/* Mobile Header */}
            <header className="pub-mobile-header md:hidden">
                <div className="logo-wrap" onClick={() => navigate('/')}>
                    <div className="pub-logo-box">BV</div>
                    <span className="pub-logo-text">BULLVERA</span>
                </div>
                <button onClick={toggleSidebar} className="pub-menu-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </header>

            <div className={`pub-sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>

            <div className="flex">
                {/* Fixed Left Sidebar */}
                <aside className={`pub-sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="pub-sidebar-logo hidden md:flex" onClick={() => navigate('/')}>
                        <div className="pub-logo-box">BV</div>
                        <span className="pub-logo-text">BULLVERA</span>
                    </div>

                    <nav className="pub-nav">
                        <NavLink to="/" className={getSingleLinkClass}>Home</NavLink>

                        {/* Platforms Dropdown */}
                        <div className={`sidebar-group ${openDropdowns.platforms ? 'open' : ''}`}>
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
                        <div className={`sidebar-group ${openDropdowns.markets ? 'open' : ''}`}>
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
                        <div className={`sidebar-group ${openDropdowns.info ? 'open' : ''}`}>
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
                        <div className={`sidebar-group ${openDropdowns.tools ? 'open' : ''}`}>
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
                        <div className={`sidebar-group ${openDropdowns.support ? 'open' : ''}`}>
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
                        <div className={`sidebar-group ${openDropdowns.company ? 'open' : ''}`}>
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
                        <div className={`sidebar-group ${openDropdowns.legal ? 'open' : ''}`}>
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
                    <div className="pub-sidebar-footer">
                        <button 
                            onClick={() => navigate('/register')}
                            className="pub-reg-btn">
                            Registration
                        </button>
                        <div className="pub-login-hint">
                            <p>Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="pub-main flex-1">
                    <Outlet />

                    {/* Default Footer */}
                    <footer className="pub-footer">
                        <div className="pub-footer-container">
                            <div className="risk-warning">
                                <h5>Risk Warning</h5>
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
