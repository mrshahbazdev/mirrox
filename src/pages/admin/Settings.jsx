import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

const Settings = ({ onAdminLogout }) => {
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/config');
        setConfigs(res.data);
      } catch (err) {
        showToast('Failed to load configuration', 'warn');
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(import.meta.env.VITE_API_URL + '/api/config', configs, {
         headers: { Authorization: `Bearer ${localStorage.getItem('mirrox_admin_token')}` }
      });
      showToast('Settings saved successfully');
    } catch (err) {
      showToast('Failed to save settings', 'warn');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, val) => {
    setConfigs(prev => ({ ...prev, [key]: val }));
  };

  if (loading) {
    return (
      <AdminLayout onAdminLogout={onAdminLogout}>
        <div style={{ color: '#64748b', textAlign: 'center', padding: '100px' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '16px' }}></i>
          <p>Loading System Configuration...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout onAdminLogout={onAdminLogout}>
      {/* Toast */}
      {toast && (
        <div className={`adm-toast ${toast.type}`}>
          <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`} />
          {toast.msg}
        </div>
      )}

      <div className="adm-page-header">
        <div>
          <h2 className="adm-page-title">
            <i className="fa-solid fa-gears" /> Platform Settings
          </h2>
          <p className="adm-page-sub">Configure global parameters and payment details</p>
        </div>
      </div>

      <div style={{ maxWidth: '800px' }}>
        <form onSubmit={handleUpdate}>
          <div className="settings-section">
            <h3 className="section-title"><i className="fa-solid fa-wallet" /> Cryptocurrency Instructions</h3>
            <div className="setting-card">
              <label className="setting-label">USDT (TRC20) Wallet Address</label>
              <input 
                type="text" 
                className="setting-input"
                value={configs.usdt_address || ''} 
                onChange={(e) => handleChange('usdt_address', e.target.value)}
                placeholder="TXXXXXXXXXXXXXXXXXXXXXX"
              />
              <p className="setting-help">This address will be displayed to users for crypto deposits.</p>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title"><i className="fa-solid fa-building-columns" /> Bank Transfer Details</h3>
            <div className="setting-grid">
              <div className="setting-card">
                <label className="setting-label">Bank Name</label>
                <input 
                  type="text" 
                  className="setting-input"
                  value={configs.bank_name || ''} 
                  onChange={(e) => handleChange('bank_name', e.target.value)}
                />
              </div>
              <div className="setting-card">
                <label className="setting-label">Account Holder Name</label>
                <input 
                  type="text" 
                  className="setting-input"
                  value={configs.account_name || ''} 
                  onChange={(e) => handleChange('account_name', e.target.value)}
                />
              </div>
            </div>
            <div className="setting-card" style={{ marginTop: '16px' }}>
              <label className="setting-label">IBAN / Account Number</label>
              <input 
                type="text" 
                className="setting-input"
                value={configs.bank_iban || ''} 
                onChange={(e) => handleChange('bank_iban', e.target.value)}
              />
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title"><i className="fa-solid fa-gauge-high" /> Global Constraints</h3>
            <div className="setting-grid">
              <div className="setting-card">
                <label className="setting-label">Min. Deposit (USD)</label>
                <input 
                  type="number" 
                  className="setting-input"
                  value={configs.min_deposit || 0} 
                  onChange={(e) => handleChange('min_deposit', parseFloat(e.target.value))}
                />
              </div>
              <div className="setting-card">
                <label className="setting-label">Min. Withdrawal (USD)</label>
                <input 
                  type="number" 
                  className="setting-input"
                  value={configs.min_withdrawal || 0} 
                  onChange={(e) => handleChange('min_withdrawal', parseFloat(e.target.value))}
                />
              </div>
              <div className="setting-card">
                <label className="setting-label">Referral Bonus (USD)</label>
                <input 
                  type="number" 
                  className="setting-input"
                  value={configs.referral_bonus || 0} 
                  onChange={(e) => handleChange('referral_bonus', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title"><i className="fa-solid fa-headset" /> Support Chat Customization</h3>
            <div className="setting-grid">
              <div className="setting-card">
                <label className="setting-label">Support Display Name</label>
                <input 
                  type="text" 
                  className="setting-input"
                  value={configs.support_name || ''} 
                  onChange={(e) => handleChange('support_name', e.target.value)}
                  placeholder="Mirrox Support"
                />
              </div>
              <div className="setting-card">
                <label className="setting-label">Support Icon (FontAwesome)</label>
                <input 
                  type="text" 
                  className="setting-input"
                  value={configs.support_icon || ''} 
                  onChange={(e) => handleChange('support_icon', e.target.value)}
                  placeholder="fa-solid fa-headset"
                />
                <p className="setting-help">Example: fa-solid fa-headset, fa-solid fa-robot</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
             <button type="submit" className="save-settings-btn" disabled={saving}>
                {saving ? (
                   <><i className="fa-solid fa-circle-notch fa-spin" /> Saving Changes...</>
                ) : (
                   <><i className="fa-solid fa-floppy-disk" /> Save Configuration</>
                )}
             </button>
          </div>
        </form>
      </div>

      <style>{`
        .settings-section { margin-bottom: 32px; }
        .section-title {
          font-size: 15px; font-weight: 800; color: #3291ff;
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 16px;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .setting-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }
        .setting-card {
          background: #0f1520;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px; padding: 20px;
        }
        .setting-label {
          display: block; font-size: 11px; font-weight: 800;
          color: #64748b; text-transform: uppercase;
          margin-bottom: 8px; letter-spacing: 0.5px;
        }
        .setting-input {
          width: 100%; background: #080c14;
          border: 1px solid #1e293b; border-radius: 8px;
          padding: 12px 14px; color: #fff; font-size: 14px;
          outline: none; transition: border-color 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .setting-input:focus { border-color: #3291ff; }
        .setting-help { font-size: 12px; color: #4a5568; margin-top: 8px; }

        .save-settings-btn {
          background: #3291ff; color: #fff;
          border: none; border-radius: 12px;
          padding: 16px 32px; font-size: 15px; font-weight: 800;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 4px 14px rgba(50, 145, 255, 0.2);
        }
        .save-settings-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
        .save-settings-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .adm-toast {
          position: fixed; top: 24px; right: 24px; z-index: 9999;
          padding: 12px 20px; border-radius: 10px;
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 600;
          animation: toastIn 0.3s ease;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .adm-toast.success { background: #0f2a1e; border: 1px solid #00cc88; color: #00cc88; }
        .adm-toast.warn { background: #2a1a0a; border: 1px solid #f59e0b; color: #f59e0b; }
      `}</style>
    </AdminLayout>
  );
};

export default Settings;
