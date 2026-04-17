import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

const Settings = ({ onAdminLogout }) => {
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingAdminSound, setUploadingAdminSound] = useState(false);
  const [uploadingUserSound, setUploadingUserSound] = useState(false);
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
         headers: { Authorization: `Bearer ${localStorage.getItem('bullvera_admin_token')}` }
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
            <div className="setting-grid" style={{ marginBottom: '16px' }}>
              <div className="setting-card">
                <label className="setting-label">Support Display Name</label>
                <input 
                  type="text" 
                  className="setting-input"
                  value={configs.support_name || ''} 
                  onChange={(e) => handleChange('support_name', e.target.value)}
                  placeholder="Bullvera Support"
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
              </div>
            </div>

            <div className="setting-card" style={{ marginBottom: '16px' }}>
              <label className="setting-label">Support Team Avatar (Custom Image)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-card-alt)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid var(--accent)' }}>
                  {configs.support_avatar ? (
                    <img src={configs.support_avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <i className={configs.support_icon || 'fa-solid fa-headset'} style={{ fontSize: '20px', color: 'var(--accent)' }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Recommended size: 100x100 (Square)</p>
                  <input 
                    type="file" 
                    id="support-avatar-input" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploadingAvatar(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await axios.post(`${API}/api/upload`, formData, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        handleChange('support_avatar', res.data.url);
                      } catch (err) {
                        alert('Upload failed');
                      } finally {
                        setUploadingAvatar(false);
                      }
                    }} 
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="qr-add-btn" 
                      style={{ padding: '6px 12px', fontSize: '12px' }} 
                      disabled={uploadingAvatar}
                      onClick={() => document.getElementById('support-avatar-input').click()}
                    >
                      {uploadingAvatar ? <i className="fa-solid fa-spinner fa-spin" /> : <><i className="fa-solid fa-upload" /> Upload Image</>}
                    </button>
                    {configs.support_avatar && (
                      <button 
                         className="qr-add-btn" 
                         style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }} 
                         onClick={() => handleChange('support_avatar', '')}
                      >
                         <i className="fa-solid fa-trash" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="setting-card" style={{ marginBottom: '16px' }}>
              <label className="setting-label">Chat Notification Sounds</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Admin Sound */}
                <div style={{ background: 'var(--bg-card-alt)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, marginBottom: '8px' }}>Admin Dashboard Sound</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <i className="fa-solid fa-bell" style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {configs.admin_notification_sound ? 'Custom Sound Set' : 'Default Beep'}
                    </span>
                  </div>
                  <input type="file" id="admin-sound-input" accept="audio/*" style={{ display: 'none' }} onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setUploadingAdminSound(true);
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      const res = await axios.post(`${API}/api/upload`, formData);
                      handleChange('admin_notification_sound', res.data.url);
                    } catch (err) { alert('Upload failed'); } finally { setUploadingAdminSound(false); }
                  }} />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" className="qr-add-btn" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => document.getElementById('admin-sound-input').click()} disabled={uploadingAdminSound}>
                      {uploadingAdminSound ? <i className="fa-solid fa-spinner fa-spin" /> : <><i className="fa-solid fa-upload" /> Upload</>}
                    </button>
                    {configs.admin_notification_sound && (
                      <button type="button" className="qr-add-btn" style={{ padding: '4px 8px', fontSize: '11px', color: '#ef4444' }} onClick={() => handleChange('admin_notification_sound', '')}>
                        <i className="fa-solid fa-rotate-left" /> Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* User Sound */}
                <div style={{ background: 'var(--bg-card-alt)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, marginBottom: '8px' }}>User Chat-box Sound</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <i className="fa-solid fa-volume-high" style={{ color: 'var(--success)' }} />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {configs.user_notification_sound ? 'Custom Sound Set' : 'Default Ping'}
                    </span>
                  </div>
                  <input type="file" id="user-sound-input" accept="audio/*" style={{ display: 'none' }} onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setUploadingUserSound(true);
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      const res = await axios.post(`${API}/api/upload`, formData);
                      handleChange('user_notification_sound', res.data.url);
                    } catch (err) { alert('Upload failed'); } finally { setUploadingUserSound(false); }
                  }} />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" className="qr-add-btn" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => document.getElementById('user-sound-input').click()} disabled={uploadingUserSound}>
                      {uploadingUserSound ? <i className="fa-solid fa-spinner fa-spin" /> : <><i className="fa-solid fa-upload" /> Upload</>}
                    </button>
                    {configs.user_notification_sound && (
                      <button type="button" className="qr-add-btn" style={{ padding: '4px 8px', fontSize: '11px', color: '#ef4444' }} onClick={() => handleChange('user_notification_sound', '')}>
                        <i className="fa-solid fa-rotate-left" /> Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="setting-card">
              <label className="setting-label">Quick Response Templates</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(() => {
                  try {
                    const replies = JSON.parse(configs.support_quick_replies || '[]');
                    return (
                      <>
                        {replies.map((r, i) => (
                          <div key={i} style={{ display: 'flex', gap: '8px' }}>
                            <input 
                              type="text" 
                              className="setting-input" 
                              value={r} 
                              onChange={(e) => {
                                const newReplies = [...replies];
                                newReplies[i] = e.target.value;
                                handleChange('support_quick_replies', JSON.stringify(newReplies));
                              }}
                            />
                            <button 
                              type="button" 
                              style={{ background: '#2d1a1a', border: '1px solid #7c2d2d', color: '#f87171', borderRadius: '8px', padding: '0 12px', cursor: 'pointer' }}
                              onClick={() => {
                                const newReplies = replies.filter((_, idx) => idx !== i);
                                handleChange('support_quick_replies', JSON.stringify(newReplies));
                              }}
                            >
                              <i className="fa-solid fa-trash-can" />
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          className="qr-add-btn"
                          onClick={() => {
                            const newReplies = [...replies, "New Quick Reply..."];
                            handleChange('support_quick_replies', JSON.stringify(newReplies));
                          }}
                        >
                          <i className="fa-solid fa-plus" /> Add Template
                        </button>
                      </>
                    );
                  } catch (e) {
                    return <p style={{ color: '#ef4444' }}>Error parsing quick replies</p>;
                  }
                })()}
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

        .qr-add-btn {
          background: rgba(50, 145, 255, 0.1); color: #3291ff;
          border: 1px dashed #3291ff; border-radius: 8px;
          padding: 10px; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 8px;
        }
        .qr-add-btn:hover { background: rgba(50, 145, 255, 0.15); }
      `}</style>
    </AdminLayout>
  );
};

export default Settings;
