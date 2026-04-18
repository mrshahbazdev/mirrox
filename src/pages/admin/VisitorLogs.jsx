import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VisitorLogs = ({ onAdminLogout }) => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const adminToken = localStorage.getItem('bullvera_admin_token');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const authHeader = { headers: { Authorization: `Bearer ${adminToken}` } };

  const fetchVisitors = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/visitors`, authHeader);
      setVisitors(res.data);
    } catch (err) {
      console.error('Failed to fetch visitors', err);
      if (err.response?.status === 401) onAdminLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 15000); // Live updates every 15s
    return () => clearInterval(interval);
  }, []);

  const deleteLog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this visitor log?')) return;
    try {
      await axios.delete(`${apiUrl}/api/admin/visitors/${id}`, authHeader);
      setVisitors(visitors.filter(v => v._id !== id));
      if (selectedVisitor?._id === id) setSelectedVisitor(null);
    } catch (err) { alert('Failed to delete log'); }
  };

  const filteredVisitors = visitors.filter(v => 
    v.ip?.includes(searchTerm) || 
    v.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.visitorId?.includes(searchTerm) ||
    v.userId?.includes(searchTerm)
  );

  return (
    <div className="visitor-logs-page">
      <div className="adm-page-header">
        <div className="header-content">
          <h1>Visitor Journeys</h1>
          <p>Real-time analytics and geographical history of all platform visits.</p>
        </div>
        <div className="header-actions">
           <button onClick={fetchVisitors} className="refresh-btn"><i className="fa-solid fa-sync" /></button>
           <div className="search-box">
             <i className="fa-solid fa-magnifying-glass" />
             <input 
              type="text" 
              placeholder="Search by IP, UID, or Country..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>
      </div>

      <div className="visitor-content-grid">
        <div className="visitor-list-card card-glass">
          <table className="visitor-table">
            <thead>
              <tr>
                <th>Visitor / User</th>
                <th>Location</th>
                <th>Device / OS</th>
                <th>Last Active</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="loading-state">Loading visitor data...</td></tr>
              ) : filteredVisitors.length === 0 ? (
                <tr><td colSpan="6" className="empty-state">No visitors found matching your search.</td></tr>
              ) : (
                filteredVisitors.map(v => (
                  <tr key={v._id} className={selectedVisitor?._id === v._id ? 'active' : ''} onClick={() => setSelectedVisitor(v)}>
                    <td>
                      <div className="visitor-id-cell">
                        <i className={`fa-solid ${v.userId ? 'fa-user-check' : 'fa-user-secret'}`} />
                        <div>
                          <strong>{v.userId || 'Guest'}</strong>
                          <span>{v.visitorId.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="location-cell">
                        <span className="country-tag">{v.country}</span>
                        <span>{v.city} · {v.ip}</span>
                      </div>
                    </td>
                    <td className="ua-cell" title={v.userAgent}>
                       {v.userAgent?.includes('Windows') ? <i className="fa-brands fa-windows" /> : 
                        v.userAgent?.includes('Mac') ? <i className="fa-brands fa-apple" /> : 
                        v.userAgent?.includes('Android') ? <i className="fa-brands fa-android" /> : 
                        <i className="fa-solid fa-mobile-screen-button" />}
                       <span>{v.userAgent?.split(')')[0].split('(')[1]?.slice(0, 20) || 'Unknown'}</span>
                    </td>
                    <td>
                      <div className="time-cell">
                        {new Date(v.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <span>{new Date(v.lastActive).toLocaleDateString([], { month: 'short', day: '2-digit' })}</span>
                      </div>
                    </td>
                    <td><span className="view-badge">{v.pathHistory?.length || 0}</span></td>
                    <td onClick={e => e.stopPropagation()}>
                       <button onClick={() => deleteLog(v._id)} className="delete-btn"><i className="fa-solid fa-trash-can" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="visitor-journey-sidebar card-glass">
          {selectedVisitor ? (
            <div className="journey-wrap">
               <div className="journey-header">
                 <h3>Journey Timeline</h3>
                 <span className="visitor-tag">{selectedVisitor.ip}</span>
               </div>
               <div className="journey-stats">
                  <div className="stat-item">
                     <span>First Seen</span>
                     <strong>{new Date(selectedVisitor.firstSeen).toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</strong>
                  </div>
                  <div className="stat-item">
                     <span>Referrer</span>
                     <strong>{selectedVisitor.referrer}</strong>
                  </div>
               </div>
               <div className="timeline">
                  {[...selectedVisitor.pathHistory].reverse().map((step, idx) => (
                    <div key={idx} className="timeline-item">
                       <div className="timeline-marker" />
                       <div className="timeline-content">
                          <span className="path">{step.path}</span>
                          <span className="time">{new Date(step.timestamp).toLocaleTimeString()}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ) : (
            <div className="journey-empty">
               <i className="fa-solid fa-shoe-prints" />
               <p>Select a visitor to view their navigation history.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .visitor-logs-page { padding: 0; }
        .visitor-content-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; height: calc(100vh - 160px); }
        .card-glass { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
        
        /* Table Styling */
        .visitor-table { width: 100%; border-collapse: collapse; text-align: left; }
        .visitor-table th { padding: 16px 20px; font-size: 11px; font-weight: 800; color: var(--text-dim); text-transform: uppercase; border-bottom: 1px solid var(--border); }
        .visitor-table td { padding: 16px 20px; font-size: 13px; color: var(--text-main); border-bottom: 1px solid var(--border); transition: background 0.2s; cursor: pointer; }
        .visitor-table tr:hover td { background: rgba(255, 77, 94, 0.03); }
        .visitor-table tr.active td { background: rgba(255, 77, 94, 0.05); }

        .visitor-id-cell { display: flex; align-items: center; gap: 12px; }
        .visitor-id-cell i { font-size: 18px; color: #FF4D5E; }
        .visitor-id-cell strong { display: block; font-size: 14px; }
        .visitor-id-cell span { font-size: 11px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; }

        .location-cell { display: flex; flex-direction: column; gap: 4px; }
        .country-tag { background: rgba(50, 145, 255, 0.1); color: #3291ff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; width: fit-content; }
        .location-cell span:last-child { font-size: 11px; color: var(--text-dim); }

        .ua-cell { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--text-dim); }
        .ua-cell i { font-size: 14px; color: var(--text-main); }

        .time-cell { display: flex; flex-direction: column; }
        .time-cell span { font-size: 11px; color: var(--text-dim); }

        .view-badge { background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .delete-btn { background: none; border: none; color: var(--text-dim); cursor: pointer; transition: color 0.2s; }
        .delete-btn:hover { color: #ef4444; }

        /* Timeline Styling */
        .journey-wrap { padding: 24px; display: flex; flex-direction: column; height: 100%; }
        .journey-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
        .visitor-tag { font-size: 11px; font-family: monospace; color: var(--text-dim); }
        .journey-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-item span { font-size: 10px; color: var(--text-dim); font-weight: 700; text-transform: uppercase; }
        .stat-item strong { font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .timeline { flex: 1; overflow-y: auto; padding-left: 10px; }
        .timeline-item { position: relative; padding-left: 20px; padding-bottom: 16px; border-left: 2px solid var(--border); }
        .timeline-item:last-child { border-left-color: transparent; }
        .timeline-marker { position: absolute; left: -6px; top: 4px; width: 10px; height: 10px; background: #FF4D5E; border-radius: 50%; border: 2px solid var(--bg-card); }
        .timeline-content { display: flex; flex-direction: column; gap: 2px; }
        .path { font-size: 13px; font-weight: 700; color: var(--text-main); }
        .time { font-size: 10px; color: var(--text-dim); }

        .journey-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justifyContent: center; color: var(--text-dim); text-align: center; padding: 40px; }
        .journey-empty i { font-size: 48px; margin-bottom: 16px; opacity: 0.2; }
        
        .loading-state, .empty-state { text-align: center; padding: 40px; color: var(--text-dim); }
      `}</style>
    </div>
  );
};

export default VisitorLogs;
