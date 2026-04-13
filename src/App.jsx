import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Explore from './pages/Explore';
import Documents from './pages/Documents';
import Login from './pages/Login';
import AdminLogin from './pages/admin/AdminLogin';
import ClientsList from './pages/admin/ClientsList';
import ClientDetail from './pages/admin/ClientDetail';
import SymbolsManager from './pages/admin/SymbolsManager';
import Reports from './pages/admin/Reports';
import Verifications from './pages/admin/Verifications';
import ActiveTraders from './pages/admin/ActiveTraders';
import Settings from './pages/admin/Settings';
import SupportChat from './pages/admin/SupportChat';
import StaffManager from './pages/admin/StaffManager';
import Admin2FA from './pages/admin/Admin2FA';
import axios from 'axios';
import Register from './pages/Register';
import Finances from './pages/Finances';
import Affiliate from './pages/Affiliate';
import Help from './pages/Help';
import NotFound from './pages/NotFound';

import PublicLayout from './components/PublicLayout';
import HomePublic from './pages/public/HomePublic';
import WebTrader from './pages/public/WebTrader';
import TradingApp from './pages/public/TradingApp';
import Forex from './pages/public/Forex';
import Commodities from './pages/public/Commodities';
import Indices from './pages/public/Indices';
import Stocks from './pages/public/Stocks';
import CryptocurrenciesCfds from './pages/public/CryptocurrenciesCfds';
import Metals from './pages/public/Metals';
import TradingAccounts from './pages/public/TradingAccounts';
import CfdList from './pages/public/CfdList';
import CfdExpiries from './pages/public/CfdExpiries';
import SwapFees from './pages/public/SwapFees';
import MarketHolidays from './pages/public/MarketHolidays';
import Education from './pages/public/Education';
import EconomicCalendar from './pages/public/EconomicCalendar';
import TradingCentral from './pages/public/TradingCentral';
import ChartAnalysis from './pages/public/ChartAnalysis';
import Glossary from './pages/public/Glossary';
import TradingEducation from './pages/public/TradingEducation';
import RiskManagementTools from './pages/public/RiskManagementTools';
import Faq from './pages/public/Faq';
import ContactUs from './pages/public/ContactUs';
import AboutUs from './pages/public/AboutUs';
import BecomeAPartner from './pages/public/BecomeAPartner';
import Legal from './pages/public/Legal';
import ComplaintInfo from './pages/public/ComplaintInfo';
import CookiesPrivacy from './pages/public/CookiesPrivacy';
import GlobalModal from './components/GlobalModal';
import LiveChat from './components/LiveChat';
import { useTrading } from './context/TradingContext';

// Client auth wrapper
const ProtectedRoute = ({ children, clientId }) => {
  if (!clientId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin auth wrapper
const AdminRoute = ({ children, isAdminLoggedIn }) => {
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  const { clientId, setClientId, currentClientExtended } = useTrading();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('mirrox_admin_token'));
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [checkingMaintenance, setCheckingMaintenance] = useState(true);

  // Maintenance Check
  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/config/public`);
        setMaintenanceMode(res.data.maintenance_mode);
      } catch (err) { console.error('Maintenance check failed'); }
      finally { setCheckingMaintenance(false); }
    };
    checkStatus();
    // Poll every 1 min for real-time toggle
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const MaintenanceScreen = () => (
    <div className="maintenance-wrap" style={{ 
      height: '100vh', width: '100%', background: '#080c14', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '20px', color: '#fff'
    }}>
      <div className="m-icon" style={{ fontSize: '80px', color: '#3291ff', marginBottom: '24px', opacity: 0.8 }}>
         <i className="fa-solid fa-screwdriver-wrench fa-bounce" />
      </div>
      <h1 style={{ fontSize: '32px', marginBottom: '16px', fontWeight: 800 }}>Platform Upgrading</h1>
      <p style={{ maxWidth: '500px', color: '#64748b', lineHeight: 1.6, fontSize: '16px' }}>
        We are currently performing scheduled maintenance to enhance your trading experience. 
        Mirrox will be back online shortly. Thank you for your patience.
      </p>
      <div style={{ marginTop: '40px', padding: '12px 24px', background: 'rgba(50,145,255,0.1)', borderRadius: '12px', border: '1px solid rgba(50,145,255,0.2)' }}>
         <span style={{ fontSize: '12px', letterSpacing: '1px', fontWeight: 700, color: '#3291ff' }}>ESTIMATED UPTIME: 15 MINUTES</span>
      </div>
    </div>
  );

  if (checkingMaintenance) return null; // Wait for initial check

  // Guard: If maintenance is ON and user is NOT admin and NOT on admin login path
  const isUserPath = window.location.pathname.startsWith('/app') || ['/', '/login', '/register'].includes(window.location.pathname);
  if (maintenanceMode && !isAdminLoggedIn && isUserPath && !window.location.pathname.includes('/admin')) {
      return <MaintenanceScreen />;
  }

  return (
    <BrowserRouter>
      <GlobalModal />
      <Routes>
        {/* Public Routes with Template */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePublic />} />
          <Route path="/web-trader" element={<WebTrader />} />
          <Route path="/trading-app" element={<TradingApp />} />
          <Route path="/forex" element={<Forex />} />
          <Route path="/commodities" element={<Commodities />} />
          <Route path="/indices" element={<Indices />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/cryptocurrencies-cfds" element={<CryptocurrenciesCfds />} />
          <Route path="/metals" element={<Metals />} />
          <Route path="/trading-accounts" element={<TradingAccounts />} />
          <Route path="/cfd-list" element={<CfdList />} />
          <Route path="/cfd-expiries" element={<CfdExpiries />} />
          <Route path="/swap-fees" element={<SwapFees />} />
          <Route path="/market-holidays" element={<MarketHolidays />} />
          <Route path="/education" element={<Education />} />
          <Route path="/economic-calendar" element={<EconomicCalendar />} />
          <Route path="/trading-central" element={<TradingCentral />} />
          <Route path="/chart-analysis" element={<ChartAnalysis />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/trading-education" element={<TradingEducation />} />
          <Route path="/risk-management-tools" element={<RiskManagementTools />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/become-a-partner" element={<BecomeAPartner />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/complaint-info" element={<ComplaintInfo />} />
          <Route path="/cookies-privacy" element={<CookiesPrivacy />} />
        </Route>
        <Route 
          path="/login" 
          element={clientId ? <Navigate to="/app/dashboard" replace /> : <Login onLogin={() => {}} />} 
        />
        <Route 
          path="/register" 
          element={clientId ? <Navigate to="/app/dashboard" replace /> : <Register onRegister={() => {}} />} 
        />

        {/* Global Redirects for direct URL hits */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/explore" element={<Navigate to="/app/explore" replace />} />
        <Route path="/documents" element={<Navigate to="/app/documents" replace />} />
        <Route path="/finances" element={<Navigate to="/app/finances" replace />} />
        <Route path="/help" element={<Navigate to="/app/help" replace />} />

        {/* Protected Routes under Layout */}
        <Route 
          path="/app" 
          element={
            <ProtectedRoute clientId={clientId}>
              <>
                <Layout currentUser={currentClientExtended} onLogout={() => setClientId(null)} />
                <LiveChat currentUser={currentClientExtended} />
              </>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard currentUser={currentClientExtended} />} />
          <Route path="explore" element={<Explore />} />
          <Route path="documents" element={<Documents />} />
          <Route path="finances" element={<Finances />} />
          <Route path="affiliate" element={<Affiliate />} />
          <Route path="help" element={<Help />} />
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={
            isAdminLoggedIn
              ? <Navigate to="/admin/clients" replace />
              : <AdminLogin onAdminLogin={(token) => { 
                  localStorage.setItem('mirrox_admin_token', token);
                  setIsAdminLoggedIn(true); 
                  setClientId('admin', token); 
                }} />
          }
        />
        <Route
          path="/admin/clients"
          element={
            <AdminRoute isAdminLoggedIn={isAdminLoggedIn}>
              <ClientsList onAdminLogout={() => { localStorage.removeItem('mirrox_admin_token'); setIsAdminLoggedIn(false); }} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/client/:id"
          element={
            <AdminRoute isAdminLoggedIn={isAdminLoggedIn}>
              <ClientDetail onAdminLogout={() => { localStorage.removeItem('mirrox_admin_token'); setIsAdminLoggedIn(false); }} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/symbols"
          element={
            <AdminRoute isAdminLoggedIn={isAdminLoggedIn}>
              <SymbolsManager onAdminLogout={() => { localStorage.removeItem('mirrox_admin_token'); setIsAdminLoggedIn(false); }} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute isAdminLoggedIn={isAdminLoggedIn}>
              <Reports onAdminLogout={() => { localStorage.removeItem('mirrox_admin_token'); setIsAdminLoggedIn(false); }} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/verifications"
          element={
            <AdminRoute isAdminLoggedIn={isAdminLoggedIn}>
              <Verifications onAdminLogout={() => { localStorage.removeItem('mirrox_admin_token'); setIsAdminLoggedIn(false); }} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/active-traders"
          element={
            <AdminRoute isAdminLoggedIn={isAdminLoggedIn}>
              <ActiveTraders onAdminLogout={() => { localStorage.removeItem('mirrox_admin_token'); setIsAdminLoggedIn(false); }} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute isAdminLoggedIn={isAdminLoggedIn}>
              <Settings onAdminLogout={() => { localStorage.removeItem('mirrox_admin_token'); setIsAdminLoggedIn(false); }} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <AdminRoute isAdminLoggedIn={isAdminLoggedIn}>
              <StaffManager onAdminLogout={() => { localStorage.removeItem('mirrox_admin_token'); setIsAdminLoggedIn(false); }} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/security"
          element={
            <AdminRoute isAdminLoggedIn={isAdminLoggedIn}>
              <Admin2FA onAdminLogout={() => { localStorage.removeItem('mirrox_admin_token'); setIsAdminLoggedIn(false); }} />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/support"
          element={
            <AdminRoute isAdminLoggedIn={isAdminLoggedIn}>
              <SupportChat onAdminLogout={() => { localStorage.removeItem('mirrox_admin_token'); setIsAdminLoggedIn(false); }} />
            </AdminRoute>
          }
        />
        
        {/* Global 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
