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
import axios from 'axios';
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Finances from './pages/Finances';
import Help from './pages/Help';
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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => !!localStorage.getItem('mirrox_admin_token'));

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
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
        <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />
        <Route path="/explore" element={<Navigate to="/app/explore" replace />} />
        <Route path="/documents" element={<Navigate to="/app/documents" replace />} />
        <Route path="/finances" element={<Navigate to="/app/finances" replace />} />
        <Route path="/help" element={<Navigate to="/app/help" replace />} />

        {/* Protected Routes under Layout */}
        <Route 
          path="/app" 
          element={
            <ProtectedRoute clientId={clientId}>
              <Layout currentUser={currentClientExtended} onLogout={() => setClientId(null)} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard currentUser={currentClientExtended} />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="explore" element={<Explore />} />
          <Route path="documents" element={<Documents />} />
          <Route path="finances" element={<Finances />} />
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
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
