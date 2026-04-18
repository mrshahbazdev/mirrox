import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = ({ onAdminLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [adminId, setAdminId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/login', {
        email: username.includes('@') ? username : 'admin@bullvera.com',
        password: password
      });

      if (res.data.require2FA) {
        setRequire2FA(true);
        setAdminId(res.data.id);
        setLoading(false);
        return;
      }

      if (res.data.role) {
        localStorage.setItem('bullvera_admin_session_id', res.data.sessionId);
        onAdminLogin(res.data.token);
        navigate('/admin/clients');
      } else {
        setError('Forbidden: This area requires admin privileges.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/verify-2fa', {
        id: adminId,
        code: otpCode
      });
      localStorage.setItem('bullvera_admin_session_id', res.data.sessionId);
      onAdminLogin(res.data.token);
      navigate('/admin/clients');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid 2FA code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login-wrap">
      <div className="adm-login-bg">
        <div className="adm-grid-lines" />
        <div className="adm-glow-orb orb1" />
        <div className="adm-glow-orb orb2" />
      </div>

      <div className="adm-login-card">
        <div className="adm-login-badge">
          <i className="fa-solid fa-shield-halved" />
          <span>ADMIN ACCESS</span>
        </div>

        <div className="adm-login-logo">
          <i className="fa-solid fa-cube" />
          <h1>bullvera</h1>
          <p>Backend Control Panel</p>
        </div>

        {!require2FA ? (
          <form onSubmit={handleSubmit} className="adm-login-form">
            <div className="adm-input-wrap">
              <i className="fa-solid fa-user adm-inp-icon" />
              <input
                type="text"
                placeholder="Admin Username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                required
                autoComplete="off"
              />
            </div>

            <div className="adm-input-wrap">
              <i className="fa-solid fa-lock adm-inp-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
              />
            </div>

            {error && (
              <div className="adm-error-msg">
                <i className="fa-solid fa-circle-exclamation" />
                {error}
              </div>
            )}

            <button type="submit" className="adm-login-btn" disabled={loading}>
              {loading ? (
                <><i className="fa-solid fa-circle-notch fa-spin" /> Authenticating...</>
              ) : (
                <><i className="fa-solid fa-shield" /> Enter Dashboard</>
              )}
            </button>

            <button
              type="button"
              className="adm-demo-btn"
              onClick={() => { setUsername('admin@bullvera.com'); setPassword('admin'); setError(''); }}
            >
              <i className="fa-solid fa-wand-magic-sparkles" /> Fill Demo Credentials
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FAVerify} className="adm-login-form">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>Two-Factor Authentication</p>
              <p style={{ color: '#64748b', fontSize: '12px' }}>Enter the 6-digit code from your authenticator app.</p>
            </div>

            <div className="adm-input-wrap">
              <i className="fa-solid fa-key adm-inp-icon" />
              <input
                type="text"
                placeholder="000 000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                autoFocus
                style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '18px' }}
              />
            </div>

            {error && (
              <div className="adm-error-msg">
                <i className="fa-solid fa-circle-exclamation" />
                {error}
              </div>
            )}

            <button type="submit" className="adm-login-btn" disabled={loading || otpCode.length !== 6}>
              {loading ? (
                <><i className="fa-solid fa-circle-notch fa-spin" /> Verifying...</>
              ) : (
                <><i className="fa-solid fa-lock-open" /> Verify & Login</>
              )}
            </button>
            <button type="button" className="adm-demo-btn" onClick={() => setRequire2FA(false)}>
              <i className="fa-solid fa-arrow-left" /> Back to Login
            </button>
          </form>
        )}

        <div className="adm-login-footer">
          <i className="fa-solid fa-circle-dot" style={{ color: '#00cc88' }} />
          &nbsp; Secure connection established
        </div>
      </div>

      <style>{`
        .adm-login-wrap {
          width: 100vw; height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-deep);
          position: fixed; top: 0; left: 0; z-index: 9999;
          font-family: 'Inter', sans-serif;
        }
        .adm-login-bg { position: absolute; inset: 0; overflow: hidden; }
        .adm-grid-lines {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255, 77, 94, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 77, 94, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .adm-glow-orb {
          position: absolute; border-radius: 50%;
          filter: blur(100px); opacity: 0.06;
        }
        .orb1 { width: 600px; height: 600px; background: #FF4D5E; top: -200px; right: -200px; }
        .orb2 { width: 400px; height: 400px; background: #a855f7; bottom: -150px; left: -150px; }

        .adm-login-card {
          position: relative; z-index: 1;
          width: 420px; padding: 48px 40px;
          background: var(--glass);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 77, 94, 0.1);
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.03);
          animation: adminFadeIn 0.6s ease-out;
        }
        @keyframes adminFadeIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .adm-login-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 20px;
          background: rgba(255, 77, 94, 0.06);
          border: 1px solid rgba(255, 77, 94, 0.15);
          font-size: 11px; font-weight: 700;
          color: #FF4D5E; letter-spacing: 1.5px;
          text-transform: uppercase; margin-bottom: 28px;
        }

        .adm-login-logo { text-align: center; margin-bottom: 36px; }
        .adm-login-logo i {
          font-size: 40px; color: #FF4D5E;
          filter: drop-shadow(0 0 20px rgba(255, 77, 94, 0.2));
          display: block; margin-bottom: 12px;
        }
        .adm-login-logo h1 {
          font-size: 32px; font-weight: 800;
          letter-spacing: -1.5px; color: var(--text-main);
          font-family: 'Outfit', sans-serif;
        }
        .adm-login-logo p { font-size: 13px; color: var(--text-dim); margin-top: 4px; }

        .adm-login-form { display: flex; flex-direction: column; gap: 14px; }

        .adm-input-wrap {
          position: relative;
          background: var(--bg-hover);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: all 0.2s;
        }
        .adm-input-wrap:focus-within {
          border-color: rgba(255, 77, 94, 0.5);
          background: rgba(255, 77, 94, 0.03);
          box-shadow: 0 0 0 3px rgba(255, 77, 94, 0.08);
        }
        .adm-inp-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted); font-size: 14px;
        }
        .adm-input-wrap input {
          width: 100%; padding: 14px 14px 14px 44px;
          background: transparent; border: none;
          color: var(--text-main); font-size: 14px;
          font-family: 'Inter', sans-serif; outline: none;
        }
        .adm-input-wrap input::placeholder { color: var(--text-muted); }

        .adm-error-msg {
          display: flex; align-items: center; gap: 8px;
          color: #ff4d4d; font-size: 12px; font-weight: 500;
          background: rgba(255,77,77,0.05);
          border: 1px solid rgba(255,77,77,0.15);
          border-radius: 8px; padding: 10px 14px;
        }

        .adm-login-btn {
          padding: 14px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #FF4D5E 0%, #D43A4A 100%);
          color: #fff; font-size: 15px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 10px; margin-top: 6px;
          transition: all 0.25s; font-family: 'Inter', sans-serif;
          box-shadow: 0 4px 20px rgba(255, 77, 94, 0.3);
        }
        .adm-login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(255, 77, 94, 0.45);
        }
        .adm-login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .adm-demo-btn {
          padding: 11px; border-radius: 10px;
          background: var(--bg-card-alt);
          border: 1px solid var(--border);
          color: var(--text-dim); font-size: 13px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s; font-family: 'Inter', sans-serif;
        }
        .adm-demo-btn:hover { background: var(--bg-hover); color: var(--text-main); }

        .adm-login-footer {
          margin-top: 28px; text-align: center;
          font-size: 12px; color: var(--text-muted);
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
