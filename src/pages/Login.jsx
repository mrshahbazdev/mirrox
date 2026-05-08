import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTrading } from '../context/TradingContext';
import { useModal } from '../context/ModalContext';

const Login = ({ onLogin }) => {
  const { setClientId } = useTrading();
  const { showAlert } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [hasToken, setHasToken] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/login', { email, password });
      
      if (res.data.role === 'admin') {
         setError('Admin needs to login via /admin/login');
      } else {
         setClientId(res.data.client.id, res.data.token);
         onLogin(res.data.client);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetMessage('');
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/forgot-password', { email });
      setResetMessage(res.data.message);
      setHasToken(true);
    } catch(err) {
      setError(err.response?.data?.error || 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/reset-password', { token: resetToken, newPassword: password });
      showAlert('Password Reset Successful. You can now log in.', 'Success', 'success');
      setResetMode(false);
      setHasToken(false);
      setPassword('');
    } catch(err) {
      setError(err.response?.data?.error || 'Failed to reset password. Token may be invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade">
        <div className="auth-logo-area">
          <i className="fa-solid fa-cube main-logo"></i>
          <h1>Bulvera</h1>
          <p>{resetMode ? 'Recover your account.' : 'The Future of Trade, Simplified.'}</p>
        </div>
        
        {resetMode ? (
          (!hasToken ? (
            <form onSubmit={handleResetRequest} className="auth-form animate-fade">
              <div className="auth-input-field">
                <i className="fa-solid fa-envelope auth-field-icon"></i>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  required
                />
              </div>
              {error && <div className="auth-error animate-fade">{error}</div>}
              {resetMessage && <div style={{color: 'var(--success)', fontSize: '13px', margin: '8px 0'}} className="animate-fade">{resetMessage}</div>}
              
              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Send Reset Link'}
              </button>
              <button type="button" className="auth-btn-secondary" style={{marginTop: '12px'}} onClick={() => { setResetMode(false); setHasToken(false); }}>
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleApplyReset} className="auth-form animate-fade">
              <div className="auth-input-field">
                <i className="fa-solid fa-key auth-field-icon"></i>
                <input 
                  type="text" 
                  placeholder="Paste Reset Token..."
                  value={resetToken}
                  onChange={(e) => { setResetToken(e.target.value); setError(''); }}
                  required
                />
              </div>
              <div className="auth-input-field">
                <i className="fa-solid fa-lock auth-field-icon"></i>
                <input 
                  type="password" 
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  required
                />
              </div>
              {error && <div className="auth-error animate-fade">{error}</div>}
              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? 'Validating...' : 'Set New Password'}
              </button>
              <button type="button" className="auth-btn-secondary" style={{marginTop: '12px'}} onClick={() => { setResetMode(false); setHasToken(false); }}>
                Cancel
              </button>
            </form>
          ))
        ) : (
          <form onSubmit={handleSubmit} className="auth-form animate-fade">
            <div className="auth-input-field">
              <i className="fa-solid fa-envelope auth-field-icon"></i>
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
              />
            </div>
            <div className="auth-input-field">
              <i className="fa-solid fa-lock auth-field-icon"></i>
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
              />
            </div>
            
            {error && <div className="auth-error animate-fade">{error}</div>}

            <div className="auth-utils">
              <label className="auth-checkbox-wrap">
                <input type="checkbox" />
                <span>Keep me signed in</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); setResetMode(true); }}>Forgot password?</a>
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In to Terminal'} <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>
        )}

        <p className="auth-footer-link">
          New to Bulvera? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
