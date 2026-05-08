import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Admin2FA = () => {
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
    <>
      <div className="adm-page-header">
        <div>
          <h2 className="adm-page-title"><i className="fa-solid fa-shield-halved" /> Security Architecture</h2>
          <p className="adm-page-sub">Dual-factor cryptographic synchronization and access hardening</p>
        </div>
      </div>

      <div className="two-factor-card adm-card">
        {!setupData && !success ? (
          <div className="setup-intro">
            <div className="security-icon-big">
               <i className="fa-solid fa-user-shield" />
            </div>
            <h3>Account Hardening Required</h3>
            <p>Deploy a secondary cryptographic layer to secure your administrative terminal. Once synchronized, all access attempts will require a time-based authentication token.</p>
            <button className="setup-start-btn" onClick={startSetup} disabled={loading}>
                {loading ? <i className="fa-solid fa-circle-notch fa-spin" /> : <><i className="fa-solid fa-bolt" /> Initialize Setup</>}
            </button>
          </div>
        ) : success ? (
          <div className="setup-success">
             <i className="fa-solid fa-circle-check" />
             <h3>Protection Matrix Active</h3>
             <p>Your administrative terminal is currently protected by a Sovereign-grade cryptographic layer. Access is strictly governed by time-based token validation.</p>
             <div className="success-controls">
                <button className="setup-secondary-btn" onClick={() => { setConfig(null); setSuccess(false); setSetupData(null); const fetchStatus = async () => { try { const res = await axios.get(`${API}/api/admins/me`, authHeader); setConfig(res.data); if (res.data.twoFactorEnabled) setSuccess(true); } catch(err) { console.error('Failed to sync status', err); } }; fetchStatus(); }}>Sync Status</button>
                <button className="setup-danger-btn" onClick={handleDisable} disabled={loading}>
                   {loading ? <i className="fa-solid fa-circle-notch fa-spin" /> : 'Revoke Protection'}
                </button>
             </div>
          </div>
        ) : (
          <div className="setup-wizard">
            <div className="wizard-step">
               <span className="step-num">Step 1</span>
               <p>Scan the cryptographic matrix using your authorized authenticator app.</p>
               <div className="qr-wrap">
                  <div className="qr-container">
                     <img src={setupData.qr} alt="2FA QR Code" />
                  </div>
               </div>
               <div className="secret-manual">
                  <small>Manual Link Pattern: <code>{setupData.secret}</code></small>
               </div>
            </div>

            <div className="wizard-step">
               <span className="step-num">Step 2</span>
               <p>Submit the 6-digit synchronization token to finalize deployment.</p>
               <form onSubmit={handleVerify}>
                 <input 
                   type="text" 
                   value={code} 
                   onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0,6))}
                   placeholder="000 000"
                   className="otp-input"
                   required
                 />
                 {error && <p className="error-text"><i className="fa-solid fa-triangle-exclamation" /> {error}</p>}
                 <button className="verify-setup-btn" disabled={loading || code.length !== 6}>
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin" /> : 'Deploy Protocol'}
                 </button>
               </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .two-factor-card {
          max-width: 650px; margin: 40px auto;
          text-align: center; padding: 60px !important;
        }
        .security-icon-big {
           font-size: 80px; color: var(--brand-primary); margin-bottom: 32px;
           text-shadow: 0 0 40px rgba(255, 77, 94, 0.2);
           animation: float 3s ease-in-out infinite;
        }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .setup-intro h3, .setup-success h3 { color: var(--text-main); font-size: 24px; font-weight: 800; margin-bottom: 20px; letter-spacing: -0.5px; }
        .setup-intro p, .setup-success p { color: var(--text-dim); font-size: 14px; line-height: 1.7; margin-bottom: 40px; font-weight: 500; }
        
        .setup-start-btn {
          background: linear-gradient(135deg, var(--brand-primary) 0%, #D43A4A 100%); 
          color: #fff; border: none; padding: 16px 40px;
          border-radius: 14px; font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.3s;
          box-shadow: 0 10px 25px rgba(255, 77, 94, 0.3);
          display: inline-flex; align-items: center; gap: 12px;
        }
        .setup-start-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(255, 77, 94, 0.4); }

        .setup-success i { font-size: 80px; color: var(--success); margin-bottom: 32px; text-shadow: 0 0 40px rgba(0, 204, 136, 0.2); }
        .success-controls { display: flex; gap: 16px; justify-content: center; }
        
        .setup-secondary-btn {
           background: var(--bg-hover); color: var(--text-main); border: 1px solid var(--border);
           padding: 14px 28px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s;
        }
        .setup-secondary-btn:hover { background: rgba(255,255,255,0.05); }

        .setup-danger-btn {
           background: rgba(255, 77, 77, 0.08); color: var(--danger); border: 1px solid rgba(255, 77, 77, 0.2);
           padding: 14px 28px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s;
        }
        .setup-danger-btn:hover { background: var(--danger); color: #fff; }

        .setup-wizard { display: flex; flex-direction: column; gap: 40px; }
        .wizard-step { text-align: left; background: rgba(0,0,0,0.2); padding: 32px; border-radius: 20px; position: relative; border: 1px solid var(--border); }
        .step-num { 
          position: absolute; top: -14px; left: 24px; padding: 4px 16px;
          background: var(--brand-primary); color: #fff; border-radius: 20px; 
          font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;
          box-shadow: 0 4px 12px rgba(255, 77, 94, 0.3);
        }
        .wizard-step p { font-size: 14px; color: var(--text-main); margin-bottom: 24px; font-weight: 600; line-height: 1.6; }
        .qr-wrap { display: flex; justify-content: center; margin-bottom: 20px; }
        .qr-container { background: #fff; padding: 16px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .qr-container img { width: 100%; max-width: 200px; display: block; }
        
        .secret-manual { text-align: center; color: var(--text-dim); }
        .secret-manual code { color: var(--brand-primary); font-weight: 800; margin-left: 8px; font-family: 'Space Mono', monospace; font-size: 13px; }

        .otp-input {
          width: 100%; background: var(--bg-deep) !important; border: 1px solid var(--border) !important; padding: 20px;
          border-radius: 16px; color: var(--text-main) !important; font-size: 32px !important; text-align: center;
          letter-spacing: 12px; font-weight: 800; margin-bottom: 24px; outline: none; transition: 0.2s;
          font-family: 'Space Mono', monospace;
        }
        .otp-input:focus { border-color: var(--brand-primary) !important; box-shadow: 0 0 0 4px rgba(255, 77, 94, 0.05); }
        
        .verify-setup-btn {
          width: 100%; background: linear-gradient(135deg, var(--success) 0%, #059669 100%); 
          color: #fff; border: none; padding: 18px;
          border-radius: 16px; font-weight: 800; font-size: 15px; cursor: pointer; transition: 0.3s;
          box-shadow: 0 10px 25px rgba(0, 204, 136, 0.2);
        }
        .verify-setup-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(0, 204, 136, 0.3); }
        .verify-setup-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .error-text { color: var(--danger); font-size: 13px; font-weight: 700; margin-bottom: 16px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; }
      `}</style>
    </>
  );
};

export default Admin2FA;
