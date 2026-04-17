import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

const Admin2FA = ({ onAdminLogout }) => {
  const [setupData, setSetupData] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [config, setConfig] = useState(null);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('bullvera_admin_token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchAdminStatus = async () => {
        try {
            const res = await axios.get(`${API}/api/admins/me`, authHeader);
            setConfig(res.data);
            if (res.data.twoFactorEnabled) {
                setSuccess(true);
            }
        } catch(err) {
            console.error('Failed to fetch admin security status', err);
        }
    };
    fetchAdminStatus();
  }, []);

  const handleDisable = async () => {
    if (!window.confirm('WARNING: Disabling 2FA will lower your account security. Proceed?')) return;
    setLoading(true);
    try {
        await axios.post(`${API}/api/admins/2fa/disable`, {}, authHeader);
        setSuccess(false);
        setSetupData(null);
        setConfig({ ...config, twoFactorEnabled: false });
        alert('2FA has been disabled.');
    } catch (err) {
        alert('Failed to disable 2FA');
    } finally {
        setLoading(false);
    }
  };

  const startSetup = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/admins/2fa/setup`, {}, authHeader);
      setSetupData(res.data);
    } catch (err) {
      setError('Failed to initialize 2FA setup');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/admins/2fa/enable`, {
        secret: setupData.secret,
        code: code
      }, authHeader);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout onAdminLogout={onAdminLogout}>
      <div className="adm-page-header">
        <div>
          <h2 className="adm-page-title"><i className="fa-solid fa-shield-halved" /> Security Center</h2>
          <p className="adm-page-sub">Enable Two-Factor Authentication for maximum account protection</p>
        </div>
      </div>

      <div className="two-factor-card">
        {!setupData ? (
          <div className="setup-intro">
            <div className="security-icon-big">
               <i className="fa-solid fa-user-lock" />
            </div>
            <h3>Protect Your Admin Account</h3>
            <p>Two-factor authentication adds an extra layer of security. Once enabled, you'll need to enter a 6-digit code from your phone whenever you log in.</p>
            <button className="setup-start-btn" onClick={startSetup} disabled={loading}>
                {loading ? <i className="fa-solid fa-circle-notch fa-spin" /> : 'Get Started'}
            </button>
          </div>
        ) : success ? (
          <div className="setup-success">
             <i className="fa-solid fa-circle-check" />
             <h3>Sovereign Protection Active</h3>
             <p>Your admin account is currently secured with two-factor authentication. You will be prompted for a 6-digit code during every login attempt from an unauthorized device.</p>
             <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="setup-start-btn" style={{ background: '#1a2230' }} onClick={() => window.location.reload()}>Refresh Status</button>
                <button className="setup-start-btn" style={{ background: '#ef4444' }} onClick={handleDisable}>Disable 2FA</button>
             </div>
          </div>
        ) : (
          <div className="setup-wizard">
            <div className="wizard-step">
               <span className="step-num">1</span>
               <p>Scan this QR code with your Google Authenticator or Authy app.</p>
               <div className="qr-container">
                  <img src={setupData.qr} alt="2FA QR Code" />
               </div>
               <div className="secret-manual">
                  <small>Secret Key: <code>{setupData.secret}</code></small>
               </div>
            </div>

            <div className="wizard-step">
               <span className="step-num">2</span>
               <p>Enter the 6-digit code from your app to verify.</p>
               <form onSubmit={handleVerify}>
                 <input 
                   type="text" 
                   value={code} 
                   onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0,6))}
                   placeholder="000 000"
                   className="otp-input"
                   required
                 />
                 {error && <p className="error-text">{error}</p>}
                 <button className="verify-setup-btn" disabled={loading || code.length !== 6}>
                    {loading ? <i className="fa-solid fa-spinner fa-spin" /> : 'Verify & Enable'}
                 </button>
               </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .two-factor-card {
          max-width: 600px; margin: 40px auto;
          background: #0f1520; border: 1px solid rgba(50,145,255,0.1);
          border-radius: 24px; padding: 48px; text-align: center;
        }
        .security-icon-big {
           font-size: 64px; color: #3291ff; margin-bottom: 24px;
           opacity: 0.8;
        }
        .setup-intro h3, .setup-success h3 { color: #fff; font-size: 22px; margin-bottom: 16px; }
        .setup-intro p, .setup-success p { color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 32px; }
        
        .setup-start-btn {
          background: #3291ff; color: #fff; border: none; padding: 14px 32px;
          border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;
        }
        .setup-start-btn:hover { background: #1a6fd4; transform: scale(1.02); }

        .setup-success i { font-size: 64px; color: #00cc88; margin-bottom: 24px; }

        .setup-wizard { display: flex; flex-direction: column; gap: 40px; }
        .wizard-step { text-align: left; background: #080c14; padding: 24px; border-radius: 16px; position: relative; }
        .step-num { 
          position: absolute; top: -15px; left: -15px; width: 30px; height: 30px; 
          background: #3291ff; color: #fff; border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; font-weight: 800;
        }
        .wizard-step p { font-size: 14px; color: #e2e8f0; margin-bottom: 20px; font-weight: 500; }
        .qr-container { background: #fff; padding: 12px; border-radius: 12px; width: fit-content; margin: 0 auto; }
        .secret-manual { text-align: center; margin-top: 12px; color: #475569; }
        .secret-manual code { color: #94a3b8; font-weight: 700; margin-left: 6px; }

        .otp-input {
          width: 100%; background: #0f1520; border: 1px solid #1a2230; padding: 16px;
          border-radius: 12px; color: #fff; font-size: 24px; text-align: center;
          letter-spacing: 8px; font-weight: 800; margin-bottom: 16px;
        }
        .verify-setup-btn {
          width: 100%; background: #00cc88; color: #fff; border: none; padding: 14px;
          border-radius: 12px; font-weight: 700; cursor: pointer;
        }
        .error-text { color: #ef4444; font-size: 12px; margin-bottom: 12px; text-align: center; }
      `}</style>
    </AdminLayout>
  );
};

export default Admin2FA;
