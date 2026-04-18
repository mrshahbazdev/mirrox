import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

const StaffManager = ({ onAdminLogout }) => {
  const [admins, setAdmins] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // list, logs, system
  const [maintenance, setMaintenance] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('bullvera_admin_token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const socket = window.socket; 

  const [newAdmin, setNewAdmin] = useState({
    name: '', email: '', password: '', role: 'admin', team: 'General',
    permissions: { manageClients: true, manageFinance: true, manageTrading: true, manageSupport: true, manageSettings: false, manageStaff: false }
  });
  
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newIp, setNewIp] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [admRes, actRes, cfgRes] = await Promise.all([
        axios.get(`${API}/api/admins`, authHeader),
        axios.get(`${API}/api/admins/activities`, authHeader),
        axios.get(`${API}/api/config`, authHeader)
      ]);
      setAdmins(admRes.data);
      setActivities(actRes.data);
      
      // Safety check: handle config both as array (Mongoose find) or object
      let mModeVal = false;
      if (Array.isArray(cfgRes.data)) {
          const mModeObj = cfgRes.data.find(c => c.key === 'maintenance_mode');
          mModeVal = mModeObj ? (mModeObj.value === 'true' || mModeObj.value === true) : false;
      } else if (cfgRes.data && cfgRes.data.maintenance_mode !== undefined) {
          mModeVal = cfgRes.data.maintenance_mode;
      }
      setMaintenance(mModeVal);
    } catch (err) { console.error('Data fetch failed', err); }
    finally { setLoading(false); }
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    socket.emit('admin:broadcast', { message: broadcastMsg, type: 'warning' });
    setBroadcastMsg('');
    alert('Broadcast sent to all staff!');
  };

  const toggleMaintenance = async () => {
    const newVal = !maintenance;
    try {
      await axios.post(`${API}/api/admins/maintenance`, { status: newVal }, authHeader);
      setMaintenance(newVal);
    } catch (err) { alert('Failed to toggle maintenance'); }
  };

  const revokeSession = async (adminId, sessionId) => {
    try {
      await axios.delete(`${API}/api/admins/${adminId}/sessions/${sessionId}`, authHeader);
      socket.emit('admin:kick', { targetAdminId: adminId, sessionId });
      fetchData();
    } catch (err) { alert('Failed to revoke session'); }
  };

  const addIp = async (adminId) => {
    if (!newIp.trim()) return;
    const admin = admins.find(a => a._id === adminId);
    const ips = [...(admin.allowedIPs || []), newIp];
    try {
      await axios.put(`${API}/api/admins/${adminId}/allowed-ips`, { ips }, authHeader);
      setNewIp('');
      fetchData();
    } catch (err) { alert('Failed to update whitelist'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/admins`, newAdmin, authHeader);
      setShowAddModal(false);
      setNewAdmin({
        name: '', email: '', password: '', role: 'admin', team: 'General',
        permissions: { manageClients: true, manageFinance: true, manageTrading: true, manageSupport: true, manageSettings: false, manageStaff: false }
      });
      fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Failed to create admin'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will PERMANENTLY revoke all access for this official.')) return;
    try {
      await axios.delete(`${API}/api/admins/${id}`, authHeader);
      fetchData();
    } catch (err) { alert('Failed to delete admin'); }
  };

  const togglePermission = async (adminId, key, currentVal) => {
    const admin = admins.find(a => a._id === adminId);
    const newPerms = { ...admin.permissions, [key]: !currentVal };
    try {
      await axios.put(`${API}/api/admins/${adminId}/permissions`, newPerms, authHeader);
      fetchData();
    } catch (err) { alert('Failed to update permissions'); }
  };

  if (loading) return <AdminLayout onAdminLogout={onAdminLogout}><div className="adm-loader" style={{ textAlign: 'center', padding: '100px', color: 'var(--text-dim)', fontWeight: 700 }}>Deploying Command Center...</div></AdminLayout>;

  return (
    <AdminLayout onAdminLogout={onAdminLogout}>
      <div className="adm-page-header">
        <div>
          <h2 className="adm-page-title"><i className="fa-solid fa-tower-broadcast" /> Sovereign Command Center</h2>
          <p className="adm-page-sub">Elite multi-staff oversight and system hardening</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
            <button className={`adm-tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
                <i className="fa-solid fa-users" /> Staff
            </button>
            <button className={`adm-tab-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
                <i className="fa-solid fa-list-check" /> Audits
            </button>
            <button className={`adm-tab-btn ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>
                <i className="fa-solid fa-microchip" /> Control Panel
            </button>
            <button className="adm-create-btn" onClick={() => setShowAddModal(true)}>
                <i className="fa-solid fa-user-plus" /> New Official
            </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="staff-grid">
          {admins.map(admin => (
            <div key={admin._id} className="staff-card adm-card">
              <div className="staff-card-header">
                <div className="staff-avatar">
                   <i className="fa-solid fa-user-shield" />
                </div>
                <div className="staff-info">
                  <h4>{admin.name}</h4>
                  <p>{admin.email}</p>
                </div>
                <button className="expand-staff-btn" onClick={() => setSelectedAdmin(selectedAdmin?._id === admin._id ? null : admin)}>
                   <i className={`fa-solid fa-chevron-${selectedAdmin?._id === admin._id ? 'up' : 'down'}`} />
                </button>
              </div>
              <div className="staff-quick-stats">
                      <div className="stat-item">
                          <label>ROLE:</label>
                          <span className={`role-text ${admin.role}`} style={{ color: '#FF4D5E' }}>{admin.role.toUpperCase()}</span>
                      </div>
                      <div className="stat-item">
                          <label>SESSIONS:</label>
                          <span>{admin.activeSessions?.length || 0} Open</span>
                      </div>
                      <div className="stat-item">
                          <label>SECURITY:</label>
                          <span style={{ color: admin.twoFactorEnabled ? '#00cc88' : '#ef4444' }}>
                            {admin.twoFactorEnabled ? '2FA ON' : 'NO 2FA'}
                          </span>
                      </div>
                  </div>

              {selectedAdmin?._id === admin._id && (
                 <div className="staff-expanded-panel">
                    <div className="panel-section">
                        <h6>Active Sessions (KICK)</h6>
                        <div className="sessions-list">
                            {admin.activeSessions?.map(s => (
                                <div key={s.sessionId} className="session-row">
                                    <div className="session-meta">
                                        <code>{s.ip}</code>
                                        <small>{s.device.split(')')[0]})</small>
                                    </div>
                                    <button className="kick-btn" onClick={() => revokeSession(admin._id, s.sessionId)}>
                                        <i className="fa-solid fa-user-xmark" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="panel-section">
                        <h6>IP Whitelist</h6>
                        <div className="ip-list">
                            {admin.allowedIPs?.map(ip => (
                                <div key={ip} className="ip-badge">
                                    {ip} <i className="fa-solid fa-xmark" onClick={() => removeIp(admin._id, ip)} />
                                </div>
                            ))}
                        </div>
                        <div className="add-ip-box">
                            <input type="text" placeholder="Add IP Address" value={newIp} onChange={e => setNewIp(e.target.value)} />
                            <button onClick={() => addIp(admin._id)}>Add</button>
                        </div>
                    </div>

                    <div className="panel-section">
                        <h6>Permissions</h6>
                        <div className="perm-switches">
                            {Object.entries(admin.permissions || {}).map(([key, val]) => (
                                <div key={key} className={`perm-tag ${val ? 'active' : ''}`} onClick={() => admin.role !== 'super' && togglePermission(admin._id, key, val)}>
                                    {key.replace('manage', '')}
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
              )}

              {admin.role !== 'super' && (
                <button className="del-staff-btn" onClick={() => handleDelete(admin._id)}>
                  Terminate Account Access
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="audit-trail-container">
           {/* Same as before but with diff display logic improved */}
           <div className="audit-header">
            <span>ACTION</span>
            <span>ADMIN</span>
            <span>DESCRIPTION</span>
            <span>TIME</span>
          </div>
          {activities.map(act => (
            <div key={act._id} className="audit-row">
              <span className="act-type"><i className="fa-solid fa-circle-dot" /> {act.action}</span>
              <span className="act-user">{act.adminName}</span>
              <span className="act-desc">{act.details?.description || 'No data'}</span>
              <span className="act-time">{new Date(act.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'system' && (
        <div className="system-command-panel">
            <div className="control-box">
                <div className="control-header">
                    <i className="fa-solid fa-radio" />
                    <h4>Elite Staff Broadcaster</h4>
                </div>
                <p>Send a real-time system alert to all logged-in staff dashboards.</p>
                <form onSubmit={handleBroadcast} className="broadcast-form">
                    <textarea 
                        value={broadcastMsg} 
                        onChange={e => setBroadcastMsg(e.target.value)}
                        placeholder="Type urgent announcement here..." 
                    />
                    <button type="submit">Broadcast Alert <i className="fa-solid fa-paper-plane" /></button>
                </form>
            </div>

            <div className="control-box">
                <div className="control-header">
                    <i className="fa-solid fa-power-off" />
                    <h4>System Maintenance Mode</h4>
                </div>
                <p>Instantly block all users from accessing the platform. Only the admin team will retain access.</p>
                <div className="maintenance-toggle-area">
                    <div className={`m-toggle ${maintenance ? 'active' : ''}`} onClick={toggleMaintenance}>
                        <div className="m-handle" />
                    </div>
                    <span>Status: <strong>{maintenance ? 'PLATFORM LOCKDOWN' : 'OPERATIONAL'}</strong></span>
                </div>
            </div>
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

    </AdminLayout>
  );
};

const styles = `
  /* Tab Buttons */
  .adm-tab-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 18px; border-radius: 12px;
    background: var(--bg-card); border: 1px solid var(--border);
    color: var(--text-dim); font-size: 13px; font-weight: 700; cursor: pointer;
    transition: all 0.2s;
  }
  .adm-tab-btn:hover { background: var(--bg-hover); color: var(--text-main); }
  .adm-tab-btn.active {
    background: rgba(255, 77, 94, 0.08); border-color: var(--brand-primary);
    color: var(--brand-primary); box-shadow: 0 4px 15px rgba(255, 77, 94, 0.1);
  }

  .adm-create-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 18px; border-radius: 12px;
    background: linear-gradient(135deg, var(--brand-primary) 0%, #D43A4A 100%);
    border: none; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
    transition: all 0.2s; box-shadow: 0 4px 15px rgba(255, 77, 94, 0.2);
  }
  .adm-create-btn:hover { transform: translateY(-1px); filter: brightness(1.1); }

  .staff-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; margin-top: 24px; }
  .staff-card { 
    padding: 24px !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .staff-card:hover { 
    border-color: rgba(255, 77, 94, 0.3) !important; 
    transform: translateY(-4px);
  }
  .staff-card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .staff-avatar { 
    width: 52px; height: 52px; background: rgba(255, 77, 94, 0.08); 
    border-radius: 14px; display: flex; align-items: center; justify-content: center;
    font-size: 22px; color: var(--brand-primary); border: 1px solid rgba(255, 77, 94, 0.15);
  }
  .staff-info h4 { margin: 0; color: var(--text-main); font-size: 16px; font-weight: 800; letter-spacing: -0.01em; }
  .staff-info p { margin: 2px 0 0; color: var(--text-dim); font-size: 12px; font-weight: 600; }
  
  .expand-staff-btn { 
    margin-left: auto; width: 34px; height: 34px; border-radius: 10px; border: 1px solid var(--border); 
    background: var(--bg-hover); color: var(--text-dim); cursor: pointer; transition: all 0.2s;
  }
  .expand-staff-btn:hover { background: var(--brand-primary); color: #fff; border-color: var(--brand-primary); }

  .staff-quick-stats { 
    display: flex; flex-direction: column; gap: 12px; 
    padding: 18px; background: rgba(0,0,0,0.15); border-radius: 16px; margin-bottom: 20px;
    border: 1px solid var(--border);
  }
  .stat-item { display: flex; justify-content: space-between; align-items: center; }
  .stat-item label { font-size: 10px; font-weight: 800; color: var(--text-dim); letter-spacing: 0.06em; text-transform: uppercase; margin: 0; }
  .stat-item span { font-size: 12px; font-weight: 700; color: var(--text-main); }
  .role-text.super { color: var(--warning) !important; }
  .role-text.admin { color: var(--brand-primary) !important; }

  .staff-expanded-panel { 
    border-top: 1px solid var(--border); padding-top: 20px;
    animation: slideDown 0.3s ease-out;
  }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  
  .panel-section { margin-bottom: 24px; }
  .panel-section h6 { font-size: 11px; font-weight: 800; color: var(--text-dim); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.04em; }

  .sessions-list { display: flex; flex-direction: column; gap: 10px; }
  .session-row { 
    display: flex; align-items: center; justify-content: space-between; 
    background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border);
  }
  .session-meta { display: flex; flex-direction: column; gap: 2px; }
  .session-meta code { font-size: 13px; color: var(--brand-primary); font-weight: 800; font-family: 'Space Mono', monospace; }
  .session-meta small { font-size: 11px; color: var(--text-dim); font-weight: 600; }
  
  .kick-btn { 
    width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(255,77,77,0.2); 
    background: rgba(255,77,77,0.08); color: var(--danger); cursor: pointer; transition: all 0.2s;
  }
  .kick-btn:hover { background: var(--danger); color: #fff; transform: scale(1.05); }

  .ip-badge { 
    padding: 6px 14px; background: rgba(255, 77, 94, 0.08); border: 1px solid rgba(255, 77, 94, 0.2); 
    border-radius: 20px; color: var(--brand-primary); font-size: 11px; font-weight: 800; font-family: 'Space Mono', monospace;
    display: flex; align-items: center; gap: 10px;
  }
  .ip-badge i { cursor: pointer; color: var(--danger); font-size: 11px; opacity: 0.7; transition: 0.2s; }
  .ip-badge i:hover { opacity: 1; transform: scale(1.2); }

  .add-ip-box input { 
    flex: 1; background: var(--bg-hover); border: 1px solid var(--border); padding: 10px 16px; 
    border-radius: 10px; color: var(--text-main); font-size: 13px; font-weight: 600; outline: none; transition: 0.2s;
  }
  .add-ip-box input:focus { border-color: var(--brand-primary); background: var(--bg-card); }
  .add-ip-box button { 
    padding: 0 20px; background: var(--brand-primary); color: #fff; border: none; 
    border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; transition: 0.2s;
  }

  .perm-tag { 
    font-size: 10px; font-weight: 800; padding: 6px 14px; border-radius: 20px; 
    background: var(--bg-hover); color: var(--text-dim); border: 1px solid var(--border); cursor: pointer; transition: all 0.2s;
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .perm-tag.active { background: rgba(0,204,136,0.1); color: var(--success); border-color: rgba(0,204,136,0.3); }

  .del-staff-btn { 
    width: 100%; margin-top: 24px; padding: 14px; background: rgba(255,77,77,0.04); 
    border: 1px dashed rgba(255,77,77,0.3); color: var(--danger); border-radius: 16px; 
    font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.2s;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .del-staff-btn:hover { background: var(--danger); color: #fff; border-style: solid; box-shadow: 0 4px 15px rgba(255,77,77,0.2); }

  .audit-trail-container { 
    background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); 
    margin-top: 24px; overflow: hidden; backdrop-filter: blur(10px);
  }
  .audit-header { 
    display: grid; grid-template-columns: 200px 180px 1fr 200px; 
    padding: 20px 30px; background: rgba(255,255,255,0.03); border-bottom: 2px solid var(--border);
    font-size: 10px; font-weight: 900; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em;
  }
  .audit-row { 
    display: grid; grid-template-columns: 200px 180px 1fr 200px; 
    padding: 18px 30px; border-bottom: 1px solid var(--border); 
    align-items: center; transition: all 0.2s;
  }
  .audit-row:hover { background: var(--bg-hover); }
  .act-type { color: var(--text-main); font-size: 12px; font-weight: 800; display: flex; align-items: center; gap: 12px; }
  .act-type i { color: var(--brand-primary); font-size: 10px; }
  .act-user { color: var(--text-main); font-size: 13px; font-weight: 700; }
  .act-desc { color: var(--text-dim); font-size: 13px; font-weight: 500; }
  .act-time { color: var(--text-dim); font-size: 12px; font-weight: 600; font-family: 'Space Mono'; text-align: right; }

  .system-command-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
  .control-box { background: var(--bg-card); padding: 32px; border-radius: 24px; border: 1px solid var(--border); }
  .control-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .control-header i { color: var(--brand-primary); font-size: 24px; }
  .control-header h4 { margin: 0; color: var(--text-main); font-size: 18px; font-weight: 800; }
  .control-box p { color: var(--text-dim); font-size: 14px; margin-bottom: 28px; line-height: 1.6; font-weight: 500; }

  /* Maintenance Toggle */
  .maintenance-toggle-area { display: flex; align-items: center; gap: 20px; }
  .m-toggle {
    width: 60px; height: 32px; border-radius: 30px; background: var(--bg-hover);
    border: 2px solid var(--border); cursor: pointer; position: relative; transition: all 0.4s;
  }
  .m-toggle.active { background: var(--danger); border-color: var(--danger); }
  .m-handle {
    position: absolute; top: 4px; left: 4px; width: 20px; height: 20px;
    background: #fff; border-radius: 50%; transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
  .m-toggle.active .m-handle { left: 32px; }

  /* Broadcast Form */
  .broadcast-form textarea {
    width: 100%; min-height: 150px; background: var(--bg-hover); border: 1px solid var(--border);
    border-radius: 20px; padding: 20px; color: var(--text-main); margin-bottom: 20px;
    resize: none; outline: none; font-size: 14px; font-weight: 500; transition: 0.2s;
  }
  .broadcast-form textarea:focus { border-color: var(--brand-primary); background: var(--bg-card); }
  .broadcast-form button {
    width: 100%; padding: 16px; border-radius: 14px; border: none;
    background: linear-gradient(135deg, var(--warning) 0%, #d97706 100%);
    color: #fff; font-size: 14px; font-weight: 800; cursor: pointer; transition: 0.3s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .broadcast-form button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(245, 158, 11, 0.2); }

  /* Modal Overrides */
  .staff-modal { max-width: 650px !important; }
  .perm-check-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
  .form-group label { color: var(--text-dim) !important; font-weight: 800 !important; }
  .form-group input, .form-group select { background: var(--bg-hover) !important; border: 1px solid var(--border) !important; }
  .form-group input:focus { border-color: var(--brand-primary) !important; }
`;

const InjectStyles = () => <style>{styles}</style>;

export default (props) => (
  <>
    <InjectStyles />
    <StaffManager {...props} />
  </>
);
