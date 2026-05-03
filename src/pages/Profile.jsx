import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';
import { useModal } from '../context/ModalContext';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Armenia','Australia','Austria','Azerbaijan',
  'Bahrain','Bangladesh','Belarus','Belgium','Bolivia','Bosnia and Herzegovina','Brazil','Bulgaria',
  'Cambodia','Cameroon','Canada','Chile','China','Colombia','Costa Rica','Croatia','Cuba','Cyprus',
  'Czech Republic','Denmark','Dominican Republic','Ecuador','Egypt','El Salvador','Estonia',
  'Ethiopia','Finland','France','Georgia','Germany','Ghana','Greece','Guatemala','Honduras',
  'Hong Kong','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy',
  'Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyzstan','Latvia','Lebanon',
  'Libya','Lithuania','Luxembourg','Malaysia','Maldives','Malta','Mexico','Moldova','Mongolia',
  'Montenegro','Morocco','Mozambique','Myanmar','Nepal','Netherlands','New Zealand','Nicaragua',
  'Nigeria','North Macedonia','Norway','Oman','Pakistan','Palestine','Panama','Paraguay','Peru',
  'Philippines','Poland','Portugal','Qatar','Romania','Russia','Saudi Arabia','Senegal','Serbia',
  'Singapore','Slovakia','Slovenia','Somalia','South Africa','South Korea','Spain','Sri Lanka',
  'Sudan','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Tunisia',
  'Turkey','Turkmenistan','UAE','Uganda','Ukraine','United Kingdom','United States','Uruguay',
  'Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
];

const Profile = () => {
  const { currentClientExtended } = useTrading();
  const { showAlert } = useModal();
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', lastName: '', contact: '', email: '',
    dateOfBirth: '', country: '', city: '', address: '', zipCode: ''
  });

  const [notifSettings, setNotifSettings] = useState({
    emails: false, sms: false, pushNotifications: false, calls: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const formInitialized = useRef(false);

  useEffect(() => {
    if (currentClientExtended && !formInitialized.current) {
      formInitialized.current = true;
      setForm({
        name: currentClientExtended.name || '',
        lastName: currentClientExtended.lastName || '',
        contact: currentClientExtended.contact || '',
        email: currentClientExtended.email || '',
        dateOfBirth: currentClientExtended.dateOfBirth || '',
        country: currentClientExtended.country || '',
        city: currentClientExtended.city || '',
        address: currentClientExtended.address || '',
        zipCode: currentClientExtended.zipCode || ''
      });
      setNotifSettings({
        emails: currentClientExtended.notificationSettings?.emails || false,
        sms: currentClientExtended.notificationSettings?.sms || false,
        pushNotifications: currentClientExtended.notificationSettings?.pushNotifications || false,
        calls: currentClientExtended.notificationSettings?.calls || false
      });
    }
  }, [currentClientExtended]);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleSaveProfile = async () => {
    if (!currentClientExtended?.id) return;
    setSaving(true);
    try {
      await axios.put(`${apiUrl}/api/clients/${currentClientExtended.id}/profile`, {
        name: form.name,
        lastName: form.lastName,
        contact: form.contact,
        dateOfBirth: form.dateOfBirth,
        country: form.country,
        city: form.city,
        address: form.address,
        zipCode: form.zipCode
      });
      showAlert('Profile updated successfully.', 'Success', 'success');
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to update profile.', 'Error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotif = async (key) => {
    if (!currentClientExtended?.id) return;
    const updated = { ...notifSettings, [key]: !notifSettings[key] };
    setNotifSettings(updated);
    try {
      await axios.put(`${apiUrl}/api/clients/${currentClientExtended.id}/notification-settings`, updated);
    } catch {
      setNotifSettings(notifSettings);
      showAlert('Failed to update notification settings.', 'Error', 'error');
    }
  };

  const handleChangePassword = async () => {
    if (!currentClientExtended?.id) return;
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert('Please fill in all password fields.', 'Missing Fields', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert('New password and confirmation do not match.', 'Mismatch', 'warning');
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 15) {
      showAlert('Password must be 8-15 characters.', 'Invalid Length', 'warning');
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${apiUrl}/api/clients/${currentClientExtended.id}/password`, {
        currentPassword, newPassword
      });
      showAlert('Password changed successfully.', 'Success', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to change password.', 'Error', 'error');
    } finally {
      setSaving(false);
    }
  };


  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'settings', label: 'Settings' },
    { id: 'password', label: 'Password' }
  ];

  return (
    <div className="profile-page-wrap">
      <div className="profile-modal-card">
        <h2 className="profile-modal-title">My profile</h2>

        <div className="profile-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`profile-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'personal' && (
          <div className="profile-tab-content">
            <div className="profile-field">
              <label>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="profile-field">
              <label>Last name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <div className="profile-field">
              <label>Phone number</label>
              <input
                type="text"
                value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value })}
              />
            </div>
            <div className="profile-field">
              <label>Email</label>
              <input type="email" value={form.email} disabled />
            </div>
            <div className="profile-field">
              <label>Date of birth</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="profile-field">
              <label>Country of residence</label>
              <select
                value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
              >
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="profile-field">
              <label>City</label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div className="profile-field">
              <label>Address</label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="profile-field">
              <label>Zip or Postal code</label>
              <input
                type="text"
                value={form.zipCode}
                onChange={e => setForm({ ...form, zipCode: e.target.value })}
              />
            </div>

            <button className="profile-btn primary full" onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="profile-tab-content">
            <p className="profile-settings-title">I want to receive news and promo via sms</p>
            {[
              { key: 'emails', label: 'Emails' },
              { key: 'sms', label: 'Sms' },
              { key: 'pushNotifications', label: 'Push-notifications' },
              { key: 'calls', label: 'Calls' }
            ].map(item => (
              <div className="profile-toggle-row" key={item.key}>
                <span>{item.label}</span>
                <button
                  className={`profile-toggle ${notifSettings[item.key] ? 'on' : ''}`}
                  onClick={() => handleToggleNotif(item.key)}
                >
                  <span className="profile-toggle-knob" />
                </button>
              </div>
            ))}
            <div className="profile-settings-info">
              <i className="fa-solid fa-circle-info"></i>
              <span>Don&apos;t worry! Your choice will not affect important service information.</span>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="profile-tab-content">
            <div className="profile-password-info">
              <i className="fa-solid fa-circle-info"></i>
              <span>Password will be changed for all your accounts</span>
            </div>
            <div className="profile-field">
              <label>Current Password</label>
              <div className="profile-input-with-icon">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Current Password"
                />
                <button type="button" className="profile-pw-toggle" onClick={() => setShowCurrentPw(!showCurrentPw)}>
                  {showCurrentPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="profile-field">
              <label>Password</label>
              <div className="profile-input-with-icon">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Password"
                />
                <button type="button" className="profile-pw-toggle" onClick={() => setShowNewPw(!showNewPw)}>
                  {showNewPw ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="profile-pw-hint">Lowercase; Uppercase; 8-15 characters; One digit; A special character.</p>
            </div>
            <div className="profile-field">
              <label>Confirm password</label>
              <div className="profile-input-with-icon">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm password"
                />
                <button type="button" className="profile-pw-toggle" onClick={() => setShowConfirmPw(!showConfirmPw)}>
                  {showConfirmPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button className="profile-btn primary full" onClick={handleChangePassword} disabled={saving}>
              {saving ? 'Saving...' : 'Save password'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .profile-page-wrap {
          grid-column: 1 / -1;
          height: 100%;
          overflow-y: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 16px;
          background: var(--bg-deep);
        }
        .profile-modal-card {
          width: 100%;
          max-width: 480px;
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border);
          padding: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
        }
        .profile-modal-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-main);
          text-align: center;
          margin-bottom: 24px;
        }
        .profile-tabs {
          display: flex;
          border-bottom: 1px solid var(--border);
          margin-bottom: 24px;
        }
        .profile-tab-btn {
          flex: 1;
          padding: 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-muted);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: 0.2s;
          font-family: inherit;
        }
        .profile-tab-btn:hover {
          color: var(--text-main);
        }
        .profile-tab-btn.active {
          color: var(--text-main);
          border-bottom-color: var(--accent);
        }
        .profile-tab-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .profile-field label {
          display: block;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 6px;
          font-weight: 500;
        }
        .profile-field input,
        .profile-field select {
          width: 100%;
          padding: 12px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-main);
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: 0.2s;
        }
        .profile-field input:focus,
        .profile-field select:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-muted);
        }
        .profile-field input:disabled {
          background: var(--bg-card-alt);
          color: var(--text-dim);
          cursor: default;
        }
        .profile-input-with-icon {
          position: relative;
        }
        .profile-input-with-icon input {
          width: 100%;
          padding-right: 40px;
        }
        .profile-field-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 14px;
        }
        .profile-pw-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }
        .profile-pw-toggle:hover {
          color: var(--accent);
        }
        .profile-pw-hint {
          margin-top: 8px;
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .profile-btn {
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: 0.2s;
        }
        .profile-btn.primary {
          background: var(--text-main);
          color: #fff;
        }
        .profile-btn.primary:hover {
          opacity: 0.9;
        }
        .profile-btn.primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .profile-btn.secondary {
          background: var(--bg-hover);
          color: var(--text-main);
        }
        .profile-btn.secondary:hover {
          background: var(--border);
        }
        .profile-btn.full {
          width: 100%;
          margin-top: 8px;
        }
        .profile-btn-row {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .profile-btn-row .profile-btn {
          flex: 1;
        }
        .profile-settings-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
        }
        .profile-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .profile-toggle-row span {
          font-size: 14px;
          color: var(--text-main);
        }
        .profile-toggle {
          position: relative;
          width: 44px;
          height: 24px;
          background: var(--bg-hover);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: 0.3s;
          padding: 0;
        }
        .profile-toggle.on {
          background: var(--accent);
          border-color: var(--accent);
        }
        .profile-toggle-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 18px;
          height: 18px;
          background: #fff;
          border-radius: 50%;
          transition: 0.3s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .profile-toggle.on .profile-toggle-knob {
          left: 22px;
        }
        .profile-settings-info {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 16px;
          background: var(--bg-card-alt);
          border-radius: 8px;
          margin-top: 8px;
        }
        .profile-settings-info i {
          color: var(--accent);
          font-size: 16px;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .profile-settings-info span {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .profile-password-info {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          background: var(--bg-card-alt);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .profile-password-info i {
          color: var(--accent);
          font-size: 16px;
          flex-shrink: 0;
        }
        .profile-password-info span {
          font-size: 13px;
          color: var(--text-muted);
        }

        @media (max-width: 1023px) {
          .profile-page-wrap {
            padding: 16px;
            align-items: flex-start;
          }
          .profile-modal-card {
            padding: 24px 16px;
            border-radius: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
