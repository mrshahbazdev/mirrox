import React, { useState } from 'react';
import axios from 'axios';
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
    <div className="login-container">
      <div className="login-card glass animate-fade">
        <div className="logo-area">
          <i className="fa-solid fa-cube main-logo"></i>
          <h1>mirrox</h1>
          <p>{resetMode ? 'Recover your account.' : 'The Future of Trade, Simplified.'}</p>
        </div>
        
        {resetMode ? (
          (!hasToken ? (
            <form onSubmit={handleResetRequest} className="login-form animate-fade">
              <div className="input-field">
                <i className="fa-solid fa-envelope field-icon"></i>
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
              {error && <div className="error-text animate-fade">{error}</div>}
              {resetMessage && <div style={{color: '#00cc88', fontSize: '13px', margin: '8px 0'}} className="animate-fade">{resetMessage}</div>}
              
              <button type="submit" className="btn-primary login-cta" disabled={loading}>
                {loading ? 'Processing...' : 'Send Reset Link'}
              </button>
              <button type="button" className="btn-secondary" style={{marginTop: '12px'}} onClick={() => { setResetMode(false); setHasToken(false); }}>
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleApplyReset} className="login-form animate-fade">
              <div className="input-field">
                <i className="fa-solid fa-key field-icon"></i>
                <input 
                  type="text" 
                  placeholder="Paste Reset Token..."
                  value={resetToken}
                  onChange={(e) => { setResetToken(e.target.value); setError(''); }}
                  required
                />
              </div>
              <div className="input-field">
                <i className="fa-solid fa-lock field-icon"></i>
                <input 
                  type="password" 
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  required
                />
              </div>
              {error && <div className="error-text animate-fade">{error}</div>}
              <button type="submit" className="btn-primary login-cta" disabled={loading}>
                {loading ? 'Validating...' : 'Set New Password'}
              </button>
              <button type="button" className="btn-secondary" style={{marginTop: '12px'}} onClick={() => { setResetMode(false); setHasToken(false); }}>
                Cancel
              </button>
            </form>
          ))
        ) : (
          <form onSubmit={handleSubmit} className="login-form animate-fade">
            <div className="input-field">
            <i className="fa-solid fa-envelope field-icon"></i>
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
          <div className="input-field">
            <i className="fa-solid fa-lock field-icon"></i>
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
          
          {error && <div className="error-text animate-fade">{error}</div>}

          <div className="form-utils">
            <label className="checkbox-wrap">
              <input type="checkbox" />
              <span>Keep me signed in</span>
            </label>
            <a href="#" onClick={(e) => { e.preventDefault(); setResetMode(true); }}>Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary login-cta" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In to Terminal'} <i className="fa-solid fa-arrow-right"></i>
          </button>

          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => {
              setEmail('admin@mirrox.com');
              setPassword('admin');
              setError('');
            }}
            style={{marginTop: '12px', opacity: 0.8}}
          >
            Use Demo Admin (Fails here)
          </button>
        </form>
        )}

        <div className="social-login">
          <span className="divider-text">Or continue with</span>
          <div className="social-btns">
            <button className="soc-btn"><i className="fa-brands fa-google"></i></button>
            <button className="soc-btn"><i className="fa-brands fa-apple"></i></button>
            <button className="soc-btn"><i className="fa-brands fa-facebook-f"></i></button>
          </div>
        </div>

        <p className="signup-link">
          New to Mirrox? <a href="/register">Create account</a>
        </p>
      </div>

      <style>{`
        .login-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top right, #0f172a, #020617);
          position: fixed;
          top: 0;
          left: 0;
          z-index: 2000;
        }
        .login-card {
          width: 440px;
          padding: 48px;
          text-align: center;
        }
        .main-logo {
          font-size: 48px;
          color: var(--accent-color);
          margin-bottom: 20px;
          filter: drop-shadow(0 0 15px rgba(0, 210, 255, 0.4));
        }
        .logo-area h1 {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -2px;
          margin-bottom: 8px;
        }
        .logo-area p {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 40px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .input-field {
          position: relative;
        }
        .field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .input-field input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s;
        }
        .input-field input:focus {
          border-color: var(--accent-color);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.1);
        }
        .form-utils {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          margin: 8px 0;
        }
        .checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .form-utils a {
          color: var(--accent-color);
          font-weight: 600;
        }
        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .btn-primary {
          background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 210, 255, 0.5);
          filter: brightness(1.1);
        }
        .btn-primary:active {
          transform: translateY(1px);
        }
        .animate-fade {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-cta {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 12px;
        }
        .social-login {
          margin-top: 32px;
          position: relative;
        }
        .divider-text {
          font-size: 12px;
          color: var(--text-muted);
          background: none;
          padding: 0 10px;
          position: relative;
          z-index: 1;
        }
        .social-btns {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 20px;
        }
        .soc-btn {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--surface-hover);
          border: 1px solid var(--border-color);
          font-size: 20px;
          color: var(--text-primary);
          transition: all 0.2s;
        }
        .soc-btn:hover {
          background: var(--surface-color);
          border-color: var(--accent-color);
          transform: translateY(-2px);
        }
        .signup-link {
          margin-top: 32px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .signup-link a {
          color: var(--accent-color);
          font-weight: 600;
        }
        .error-text {
          color: #ff4d4d;
          font-size: 13px;
          text-align: left;
          margin-top: -8px;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default Login;
