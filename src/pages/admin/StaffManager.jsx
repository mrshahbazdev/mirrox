import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

const StaffManager = ({ onAdminLogout }) => {
  const [admins, setAdmins] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // list, logs
  const [newAdmin, setNewAdmin] = useState({
    name: '', email: '', password: '', role: 'admin', team: 'General',
    permissions: {
      manageClients: true, manageFinance: true, manageTrading: true,
      manageSupport: true, manageSettings: false, manageStaff: false
    }
  });

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('mirrox_admin_token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [admRes, actRes] = await Promise.all([
        axios.get(`${API}/api/admins`, authHeader),
        axios.get(`${API}/api/admins/activities`, authHeader)
      ]);
      setAdmins(admRes.data);
      setActivities(actRes.data);
    } catch (err) {
      console.error('Failed to fetch staff data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/admins`, newAdmin, authHeader);
      setShowAddModal(false);
      fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Creation failed'); }
  };

  const togglePermission = async (adminId, key, currentVal) => {
    const admin = admins.find(a => a._id === adminId);
    const newPerms = { ...admin.permissions, [key]: !currentVal };
    try {
      await axios.put(`${API}/api/admins/${adminId}/permissions`, newPerms, authHeader);
      fetchData();
    } catch (err) { alert('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await axios.delete(`${API}/api/admins/${id}`, authHeader);
      fetchData();
    } catch (err) { alert('Deletion failed'); }
  };

  if (loading) return <AdminLayout onAdminLogout={onAdminLogout}><div className="adm-loader">Loading Command Center...</div></AdminLayout>;

  return (
    <AdminLayout onAdminLogout={onAdminLogout}>
      <div className="adm-page-header">
        <div>
          <h2 className="adm-page-title"><i className="fa-solid fa-user-shield" /> Staff Command Center</h2>
          <p className="adm-page-sub">Sovereign control over team access and security audits</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
            <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
                <i className="fa-solid fa-users-gear" /> Team List
            </button>
            <button className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
                <i className="fa-solid fa-clock-rotate-left" /> Audit Trail
            </button>
            <button className="create-admin-btn" onClick={() => setShowAddModal(true)}>
                <i className="fa-solid fa-plus" /> New Staff
            </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="staff-grid">
          {admins.map(admin => (
            <div key={admin._id} className="staff-card">
              <div className="staff-card-header">
                <div className="staff-avatar">
                   <i className="fa-solid fa-user-tie" />
                   {admin.status === 'active' && <span className="online-dot" />}
                </div>
                <div className="staff-info">
                  <h4>{admin.name}</h4>
                  <p>{admin.email}</p>
                </div>
                <div className={`role-badge ${admin.role}`}>
                  {admin.role.toUpperCase()}
                </div>
              </div>

              <div className="staff-meta">
                <span><i className="fa-solid fa-users" /> {admin.team} Team</span>
                <span><i className="fa-solid fa-shield-halved" /> {admin.twoFactorEnabled ? '2FA Active' : 'No 2FA'}</span>
              </div>

              <div className="permissions-zone">
                <p className="zone-label">Access Permissions</p>
                <div className="perm-switches">
                  {Object.entries(admin.permissions || {}).map(([key, val]) => (
                    <div key={key} className={`perm-tag ${val ? 'active' : ''}`} onClick={() => admin.role !== 'super' && togglePermission(admin._id, key, val)}>
                      {key.replace('manage', '')}
                      {val ? <i className="fa-solid fa-check" /> : <i className="fa-solid fa-lock" />}
                    </div>
                  ))}
                </div>
              </div>

              {admin.role !== 'super' && (
                <button className="del-staff-btn" onClick={() => handleDelete(admin._id)}>
                  <i className="fa-solid fa-user-minus" /> Remove Staff Member
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="audit-trail-container">
          <div className="audit-header">
            <span>ACTIVITY</span>
            <span>STAFF</span>
            <span>TARGET</span>
            <span>CHANGE</span>
            <span>TIME</span>
          </div>
          {activities.map(act => (
            <div key={act._id} className="audit-row">
              <span className="act-type">
                <i className={`fa-solid ${act.action.includes('CREATE') ? 'fa-plus' : act.action.includes('DELETE') ? 'fa-trash' : 'fa-pen'}`} />
                {act.action}
              </span>
              <span className="act-user">{act.adminName}</span>
              <span className="act-target">{act.resourceType}: {act.resourceId?.slice(-6)}</span>
              <span className="act-diff">
                 {act.details?.description}
                 {act.details?.newValue && (
                    <div className="diff-popover">
                        <pre>Old: {JSON.stringify(act.details.oldValue, null, 2)}</pre>
                        <i className="fa-solid fa-arrow-down" />
                        <pre>New: {JSON.stringify(act.details.newValue, null, 2)}</pre>
                    </div>
                 )}
              </span>
              <span className="act-time">{new Date(act.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-content staff-modal">
            <div className="adm-modal-header">
              <h3>Register New Staff Account</h3>
              <button onClick={() => setShowAddModal(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Initial Password</label>
                  <input type="password" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Department / Team</label>
                  <select value={newAdmin.team} onChange={e => setNewAdmin({...newAdmin, team: e.target.value})}>
                    <option value="General">General</option>
                    <option value="Support">Support</option>
                    <option value="Finance">Finance</option>
                    <option value="Risk">Risk Management</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>

              <div className="perm-selector-box">
                <label>Initial Permission Set</label>
                <div className="perm-check-grid">
                  {Object.keys(newAdmin.permissions).map(key => (
                    <label key={key} className="perm-check">
                      <input type="checkbox" checked={newAdmin.permissions[key]} onChange={e => setNewAdmin({
                        ...newAdmin, 
                        permissions: { ...newAdmin.permissions, [key]: e.target.checked }
                      })} />
                      <span>{key.replace('manage', '')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="confirm-create-btn">Create Official Account</button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .staff-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-top: 24px; }
        .staff-card { 
          background: #0f1520; border: 1px solid rgba(50,145,255,0.1); 
          border-radius: 20px; padding: 24px; transition: all 0.3s;
        }
        .staff-card:hover { border-color: rgba(50,145,255,0.3); transform: translateY(-4px); }
        .staff-card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .staff-avatar { 
          width: 56px; height: 56px; background: #1a2230; 
          border-radius: 16px; display: flex; align-items: center; justify-content: center;
          font-size: 24px; color: #3291ff; position: relative;
        }
        .online-dot { 
          position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px; 
          background: #00cc88; border: 2px solid #0f1520; border-radius: 50%; 
        }
        .staff-info h4 { margin: 0; color: #fff; font-size: 16px; font-weight: 700; }
        .staff-info p { margin: 2px 0 0; color: #64748b; font-size: 12px; }
        .role-badge { margin-left: auto; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
        .role-badge.super { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
        .role-badge.admin { background: rgba(50, 145, 255, 0.1); color: #3291ff; border: 1px solid rgba(50, 145, 255, 0.2); }
        
        .staff-meta { display: flex; gap: 16px; margin-bottom: 20px; }
        .staff-meta span { font-size: 11px; color: #94a3b8; display: flex; align-items: center; gap: 6px; }

        .permissions-zone { background: rgba(0,0,0,0.2); border-radius: 12px; padding: 12px; }
        .zone-label { font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 12px; }
        .perm-switches { display: flex; flex-wrap: wrap; gap: 8px; }
        .perm-tag { 
          font-size: 10px; font-weight: 700; padding: 6px 10px; border-radius: 8px; 
          background: #151b27; color: #475569; border: 1px solid transparent; 
          cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;
        }
        .perm-tag.active { background: rgba(0,204,136,0.1); color: #00cc88; border-color: rgba(0,204,136,0.2); }
        .perm-tag:hover:not(.active) { border-color: #334155; }

        .del-staff-btn { 
          width: 100%; margin-top: 20px; padding: 10px; background: rgba(239, 68, 68, 0.05); 
          border: 1px solid rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 12px; 
          font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s;
        }
        .del-staff-btn:hover { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; }

        /* Audit Trail Styles */
        .audit-trail-container { background: #0f1520; border-radius: 20px; border: 1px solid rgba(50,145,255,0.1); overflow: hidden; margin-top: 24px; }
        .audit-header { 
          display: grid; grid-template-columns: 180px 150px 150px 1fr 180px; 
          padding: 16px 24px; background: rgba(50,145,255,0.05); 
          font-size: 10px; font-weight: 800; color: #64748b; letter-spacing: 1px;
        }
        .audit-row { 
          display: grid; grid-template-columns: 180px 150px 150px 1fr 180px; 
          padding: 16px 24px; border-bottom: 1px solid rgba(50,145,255,0.05); align-items: center; transition: all 0.2s;
        }
        .audit-row:hover { background: rgba(50,145,255,0.02); }
        .act-type { color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
        .act-type i { color: #3291ff; width: 24px; height: 24px; background: rgba(50,145,255,0.1); border-radius: 6px; display: flex; align-items: center; justify-content: center; }
        .act-user { color: #e2e8f0; font-size: 12px; font-weight: 600; }
        .act-target { color: #64748b; font-size: 11px; font-family: monospace; }
        .act-diff { color: #94a3b8; font-size: 12px; position: relative; }
        .act-time { color: #64748b; font-size: 11px; text-align: right; }

        /* Modal Styles */
        .staff-modal { width: 600px; padding: 32px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        .form-group label { display: block; font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
        .form-group input, .form-group select { 
          width: 100%; padding: 12px; background: #080c14; border: 1px solid #1a2230; 
          border-radius: 10px; color: #fff; font-size: 14px; 
        }
        .perm-selector-box { background: #080c14; padding: 20px; border-radius: 12px; border: 1px solid #1a2230; }
        .perm-check-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 12px; }
        .perm-check { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .perm-check span { font-size: 11px; color: #94a3b8; font-weight: 600; }
        .confirm-create-btn { 
          width: 100%; margin-top: 24px; padding: 14px; background: #3291ff; color: #fff; 
          border: none; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer;
        }

        .tab-btn { 
          background: rgba(50,145,255,0.05); border: 1px solid rgba(50,145,255,0.1); 
          color: #64748b; padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;
        }
        .tab-btn.active { background: #3291ff; color: #fff; border-color: #3291ff; }
        .create-admin-btn { 
          background: #00cc88; color: #fff; border: none; 
          padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; gap: 8px; margin-left: 12px;
        }
      `}</style>
    </AdminLayout>
  );
};

export default StaffManager;
