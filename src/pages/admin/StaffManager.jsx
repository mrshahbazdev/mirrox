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
  const token = localStorage.getItem('mirrox_admin_token');
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

  if (loading) return <AdminLayout onAdminLogout={onAdminLogout}><div className="adm-loader">Accessing Command Center...</div></AdminLayout>;

  return (
    <AdminLayout onAdminLogout={onAdminLogout}>
      <div className="adm-page-header">
        <div>
          <h2 className="adm-page-title"><i className="fa-solid fa-tower-broadcast" /> Sovereign Command Center</h2>
          <p className="adm-page-sub">Elite multi-staff oversight and system hardening</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
            <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
                <i className="fa-solid fa-users" /> Staff
            </button>
            <button className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
                <i className="fa-solid fa-list-check" /> Audits
            </button>
            <button className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>
                <i className="fa-solid fa-microchip" /> Control Panel
            </button>
            <button className="create-admin-btn" onClick={() => setShowAddModal(true)}>
                <i className="fa-solid fa-user-plus" /> New Official
            </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="staff-grid">
          {admins.map(admin => (
            <div key={admin._id} className="staff-card">
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
                          <span className={`role-text ${admin.role}`}>{admin.role.toUpperCase()}</span>
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

export default StaffManager;
