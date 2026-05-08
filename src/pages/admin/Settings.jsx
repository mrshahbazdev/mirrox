import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Settings = () => {
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
      <>
        <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '100px', fontWeight: 600 }}>
          <i className="fa-solid fa-gear fa-spin" style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--brand-primary)' }}></i>
          <p>Synchronizing System Core...</p>
        </div>
      </>
    );
  }

  return (
    <>
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
            <i className="fa-solid fa-sliders" /> Platform Settings
          </h2>
          <p className="adm-page-sub">Global configuration and systemic parameters</p>
        </div>
      </div>

      <div style={{ maxWidth: '900px' }}>
        <form onSubmit={handleUpdate}>
          <div className="settings-section">
            <h3 className="section-title"><i className="fa-solid fa-wallet" /> Settlement Architecture</h3>
            <div className="setting-card adm-card">
              <label className="setting-label">USDT (TRC20) Master Vault</label>
              <input 
                type="text" 
                className="setting-input"
                value={configs.usdt_address || ''} 
                onChange={(e) => handleChange('usdt_address', e.target.value)}
                placeholder="TXXXXXXXXXXXXXXXXXXXXXX"
              />
              <p className="setting-help">Global destination for client cryptocurrency deposits.</p>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title"><i className="fa-solid fa-building-columns" /> Institutional Wiring</h3>
            <div className="setting-grid">
              <div className="setting-card adm-card">
                <label className="setting-label">Receiving Institution</label>
                <input 
                  type="text" 
                  className="setting-input"
                  value={configs.bank_name || ''} 
                  onChange={(e) => handleChange('bank_name', e.target.value)}
                />
              </div>
              <div className="setting-card adm-card">
                <label className="setting-label">Beneficiary Name</label>
                <input 
                  type="text" 
                  className="setting-input"
                  value={configs.account_name || ''} 
                  onChange={(e) => handleChange('account_name', e.target.value)}
                />
              </div>
            </div>
            <div className="setting-card adm-card" style={{ marginTop: '20px' }}>
              <label className="setting-label">International Bank Account Number (IBAN)</label>
              <input 
                type="text" 
                className="setting-input"
                value={configs.bank_iban || ''} 
                onChange={(e) => handleChange('bank_iban', e.target.value)}
              />
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title"><i className="fa-solid fa-shield-virus" /> System Thresholds</h3>
            <div className="setting-grid">
              <div className="setting-card adm-card">
                <label className="setting-label">Floor Deposit (USD)</label>
                <input 
                  type="number" 
                  className="setting-input"
                  value={configs.min_deposit || 0} 
                  onChange={(e) => handleChange('min_deposit', parseFloat(e.target.value))}
                />
              </div>
              <div className="setting-card adm-card">
                <label className="setting-label">Floor Withdrawal (USD)</label>
                <input 
                  type="number" 
                  className="setting-input"
                  value={configs.min_withdrawal || 0} 
                  onChange={(e) => handleChange('min_withdrawal', parseFloat(e.target.value))}
                />
              </div>
              <div className="setting-card adm-card">
                <label className="setting-label">Incentive Unit (USD)</label>
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
            <h3 className="section-title"><i className="fa-solid fa-comments" /> Support Persona</h3>
            <div className="setting-grid" style={{ marginBottom: '20px' }}>
              <div className="setting-card adm-card">
                <label className="setting-label">Entity Alias</label>
                <input 
                  type="text" 
                  className="setting-input"
                  value={configs.support_name || ''} 
                  onChange={(e) => handleChange('support_name', e.target.value)}
                  placeholder="Bulvera Intelligence"
                />
              </div>
              <div className="setting-card adm-card">
                <label className="setting-label">Visual Glyph (FontAwesome)</label>
                <input 
                  type="text" 
                  className="setting-input"
                  value={configs.support_icon || ''} 
                  onChange={(e) => handleChange('support_icon', e.target.value)}
                  placeholder="fa-solid fa-shield-halved"
                />
              </div>
            </div>

            <div className="setting-card adm-card" style={{ marginBottom: '20px' }}>
              <label className="setting-label">Tactical Support Avatar</label>
              <div className="avatar-upload-box">
                <div className="avatar-preview">
                  {configs.support_avatar ? (
                    <img src={configs.support_avatar} alt="Avatar" />
                  ) : (
                    <i className={configs.support_icon || 'fa-solid fa-user-shield'} />
                  )}
                </div>
                <div className="avatar-controls">
                  <p className="upload-tip">Optimized: 128x128 Squared Matrix</p>
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
                        showToast('Matrix integration failed', 'warn');
                      } finally {
                        setUploadingAvatar(false);
                      }
                    }} 
                  />
                  <div className="avatar-btn-group">
                    <button 
                      type="button"
                      className="adm-upload-btn" 
                      disabled={uploadingAvatar}
                      onClick={() => document.getElementById('support-avatar-input').click()}
                    >
                      {uploadingAvatar ? <i className="fa-solid fa-circle-notch fa-spin" /> : <><i className="fa-solid fa-arrow-up-from-bracket" /> Upload Material</>}
                    </button>
                    {configs.support_avatar && (
                      <button 
                         type="button"
                         className="adm-delete-btn" 
                         onClick={() => handleChange('support_avatar', '')}
                      >
                         <i className="fa-solid fa-trash" /> Purge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="setting-card adm-card" style={{ marginBottom: '20px' }}>
              <label className="setting-label">Acoustic Alerts</label>
              <div className="sound-setting-grid">
                {/* Admin Sound */}
                <div className="sound-item">
                  <p className="sound-title">Command Dashboard</p>
                  <div className="sound-meta">
                    <i className="fa-solid fa-tower-broadcast" />
                    <span>{configs.admin_notification_sound ? 'Tactical Sound Engaged' : 'Default Frequency'}</span>
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
                    } catch (err) { showToast('Sound uplink failed', 'warn'); } finally { setUploadingAdminSound(false); }
                  }} />
                  <div className="sound-controls">
                    <button type="button" className="adm-upload-btn" onClick={() => document.getElementById('admin-sound-input').click()} disabled={uploadingAdminSound}>
                      {uploadingAdminSound ? <i className="fa-solid fa-circle-notch fa-spin" /> : <><i className="fa-solid fa-upload" /> Uplink</>}
                    </button>
                    {configs.admin_notification_sound && (
                      <button type="button" className="adm-delete-btn" onClick={() => handleChange('admin_notification_sound', '')}>
                        <i className="fa-solid fa-trash" /> Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* User Sound */}
                <div className="sound-item">
                  <p className="sound-title">In-Field Chat Terminal</p>
                  <div className="sound-meta">
                    <i className="fa-solid fa-users-viewfinder" style={{ color: 'var(--success)' }} />
                    <span>{configs.user_notification_sound ? 'Tactical Sound Engaged' : 'Default Frequency'}</span>
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
                    } catch (err) { showToast('Sound uplink failed', 'warn'); } finally { setUploadingUserSound(false); }
                  }} />
                  <div className="sound-controls">
                    <button type="button" className="adm-upload-btn" onClick={() => document.getElementById('user-sound-input').click()} disabled={uploadingUserSound}>
                      {uploadingUserSound ? <i className="fa-solid fa-circle-notch fa-spin" /> : <><i className="fa-solid fa-upload" /> Uplink</>}
                    </button>
                    {configs.user_notification_sound && (
                      <button type="button" className="adm-delete-btn" onClick={() => handleChange('user_notification_sound', '')}>
                        <i className="fa-solid fa-trash" /> Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="setting-card adm-card">
              <label className="setting-label">Standard Operational Responses</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(() => {
                  try {
                    const replies = JSON.parse(configs.support_quick_replies || '[]');
                    return (
                      <>
                        {replies.map((r, i) => (
                          <div key={i} className="qr-template-row">
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
                              className="qr-delete-btn"
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
                          className="adm-add-qr-btn"
                          onClick={() => {
                            const newReplies = [...replies, "Initialize new tactical response..."];
                            handleChange('support_quick_replies', JSON.stringify(newReplies));
                          }}
                        >
                          <i className="fa-solid fa-plus" /> Append Directive
                        </button>
                      </>
                    );
                  } catch (e) {
                    return <p style={{ color: 'var(--danger)' }}>Matrix parsing error</p>;
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
        .settings-section { margin-bottom: 40px; }
        .section-title {
          font-size: 14px; font-weight: 900; color: var(--brand-primary);
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 24px;
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .setting-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;
        }
        .setting-card {
           padding: 24px !important;
        }
        .setting-label {
          display: block; font-size: 10px; font-weight: 900;
          color: var(--text-dim); text-transform: uppercase;
          margin-bottom: 12px; letter-spacing: 0.08em;
        }
        .setting-input {
          width: 100%; background: rgba(0,0,0,0.1) !important;
          border: 1px solid var(--border) !important; border-radius: 12px !important;
          padding: 14px 18px !important; color: var(--text-main) !important; font-size: 14px !important;
          outline: none; transition: all 0.2s;
          font-family: var(--font-main); font-weight: 500;
        }
        .setting-input:focus { border-color: var(--brand-primary) !important; background: var(--bg-card) !important; box-shadow: 0 0 0 4px rgba(255, 77, 94, 0.05); }
        .setting-help { font-size: 12px; color: var(--text-dim); margin-top: 12px; font-weight: 500; }

        .save-settings-btn {
          background: var(--brand-primary); color: #fff;
          border: none; border-radius: 14px;
          padding: 18px 40px; font-size: 15px; font-weight: 800;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
          display: flex; align-items: center; gap: 12px;
          box-shadow: 0 10px 25px rgba(255, 77, 94, 0.3);
        }
        .save-settings-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(255, 77, 94, 0.4); }
        .save-settings-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .avatar-upload-box { display: flex; align-items: center; gap: 24px; }
        .avatar-preview { 
           width: 64px; height: 64px; border-radius: 20px; background: rgba(0,0,0,0.2);
           display: flex; align-items: center; justify-content: center; overflow: hidden;
           border: 2px solid var(--brand-primary); box-shadow: 0 0 20px rgba(255, 77, 94, 0.1);
        }
        .avatar-preview img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-preview i { font-size: 24px; color: var(--brand-primary); }
        .avatar-controls { flex: 1; }
        .upload-tip { font-size: 11px; color: var(--text-dim); margin-bottom: 12px; font-weight: 600; }
        .avatar-btn-group, .sound-controls { display: flex; gap: 10px; }

        .adm-upload-btn, .adm-add-qr-btn {
          flex: 1; padding: 10px 16px; border-radius: 10px; border: 1px solid var(--border);
          background: var(--bg-hover); color: var(--text-main); font-size: 12px; font-weight: 800;
          cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .adm-upload-btn:hover, .adm-add-qr-btn:hover { background: rgba(255, 255, 255, 0.08); border-color: var(--brand-primary); color: var(--brand-primary); }

        .adm-delete-btn, .qr-delete-btn {
          padding: 10px 16px; border-radius: 10px; border: 1px solid rgba(255, 77, 77, 0.2);
          background: rgba(255, 77, 77, 0.05); color: var(--danger); font-size: 12px; font-weight: 800;
          cursor: pointer; transition: 0.2s;
        }
        .adm-delete-btn:hover, .qr-delete-btn:hover { background: var(--danger); color: #fff; }

        .sound-setting-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .sound-item { background: rgba(0,0,0,0.1); padding: 16px; border-radius: 16px; border: 1px solid var(--border); }
        .sound-title { font-size: 12px; font-weight: 800; color: var(--text-main); margin-bottom: 12px; }
        .sound-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .sound-meta i { color: var(--brand-primary); font-size: 14px; }
        .sound-meta span { font-size: 11px; color: var(--text-dim); font-weight: 600; }

        .qr-template-row { display: flex; gap: 10px; align-items: center; }

        .adm-toast {
          position: fixed; top: 32px; right: 32px; z-index: 9999;
          padding: 16px 28px; border-radius: 16px;
          display: flex; align-items: center; gap: 14px;
          font-size: 14px; font-weight: 700;
          backdrop-filter: blur(20px);
          animation: toastIn 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .adm-toast.success { background: rgba(0, 204, 136, 0.1); border: 1px solid var(--success); color: var(--success); }
        .adm-toast.warn { background: rgba(255, 77, 77, 0.1); border: 1px solid var(--danger); color: var(--danger); }

        @keyframes toastIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </>
  );
};

export default Settings;
