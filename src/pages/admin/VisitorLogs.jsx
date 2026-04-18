import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useTrading } from '../../context/TradingContext';

const VisitorLogs = ({ onAdminLogout }) => {
  const { socket } = useTrading();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLive, setIsLive] = useState(false);

  const adminToken = localStorage.getItem('bullvera_admin_token');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const authHeader = useMemo(() => ({ headers: { Authorization: `Bearer ${adminToken}` } }), [adminToken]);

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/visitors`, authHeader);
      setVisitors(res.data);
    } catch (err) {
      console.error('Failed to fetch visitors', err);
      if (err.response?.status === 401) onAdminLogout();
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authHeader, onAdminLogout]);

  // Initial Fetch
  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  // Socket Listener for Real-Time Updates
  useEffect(() => {
    if (!socket) return;

    setIsLive(true);

    const handleVisitorUpdate = (updatedVisitor) => {
      setVisitors(prev => {
        const index = prev.findIndex(v => v.visitorId === updatedVisitor.visitorId);
        if (index !== -1) {
          // Update existing visitor and move to top
          const newList = [...prev];
          newList.splice(index, 1);
          return [updatedVisitor, ...newList];
        } else {
          // Add new visitor to top
          return [updatedVisitor, ...prev];
        }
      });

      // Update selected visitor if it's the one that changed
      setSelectedVisitor(prev => {
        if (prev?.visitorId === updatedVisitor.visitorId) {
          return updatedVisitor;
        }
        return prev;
      });
    };

    socket.on('admin:visitor_update', handleVisitorUpdate);
    socket.on('connect', () => setIsLive(true));
    socket.on('disconnect', () => setIsLive(false));

    return () => {
      socket.off('admin:visitor_update', handleVisitorUpdate);
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  const deleteLog = async (id) => {
    if (!window.confirm('Clear this visitor session?')) return;
    try {
      await axios.delete(`${apiUrl}/api/admin/visitors/${id}`, authHeader);
      setVisitors(prev => prev.filter(v => v._id !== id));
      if (selectedVisitor?._id === id) setSelectedVisitor(null);
    } catch (err) { alert('Failed to delete log'); }
  };

  const filteredVisitors = visitors.filter(v => 
    v.ip?.includes(searchTerm) || 
    v.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.visitorId?.includes(searchTerm) ||
    (v.userId && v.userId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPageIcon = (path) => {
    if (path === '/') return 'fa-house';
    if (path.includes('dashboard')) return 'fa-gauge';
    if (path.includes('finances')) return 'fa-wallet';
    if (path.includes('explore')) return 'fa-chart-column';
    if (path.includes('register')) return 'fa-user-plus';
    if (path.includes('login')) return 'fa-right-to-bracket';
    if (path.includes('support')) return 'fa-headset';
    return 'fa-file-lines';
  };

  return (
    <div className="visitor-logs-page">
      <div className="adm-page-header">
        <div className="header-content">
          <div className="title-row">
            <h1>Visitor Journeys</h1>
            <div className={`live-indicator ${isLive ? 'active' : ''}`}>
               <span className="pulse-dot" />
               <span>{isLive ? 'LIVE MONITORING' : 'CONNECTING...'}</span>
            </div>
          </div>
          <p>Instantly track every movement across the platform with 0ms latency.</p>
        </div>
        <div className="header-actions">
           <div className="search-box">
             <i className="fa-solid fa-magnifying-glass" />
             <input 
              type="text" 
              placeholder="Filter by IP, User, or Country..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>
      </div>

      <div className="visitor-content-grid">
        <div className="visitor-list-pane card-glass">
          <div className="pane-header">
             <span>ACTIVE & RECENT SESSIONS</span>
             <span className="count-badge">{filteredVisitors.length}</span>
          </div>
          <div className="visitor-table-wrap">
            <table className="visitor-table">
              <thead>
                <tr>
                  <th>VISITOR</th>
                  <th>ORIGIN</th>
                  <th>SYSTEM</th>
                  <th>LAST ACTIVITY</th>
                  <th>HITS</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="loading-state">Syncing history...</td></tr>
                ) : filteredVisitors.length === 0 ? (
                  <tr><td colSpan="6" className="empty-state">No visitors found matching filter.</td></tr>
                ) : (
                  filteredVisitors.map(v => {
                    const isActive = (new Date() - new Date(v.lastActive)) < 120000; // Active in last 2 mins
                    return (
                      <tr key={v._id} className={`${selectedVisitor?._id === v._id ? 'selected' : ''} ${isActive ? 'is-active' : ''}`} onClick={() => setSelectedVisitor(v)}>
                        <td>
                          <div className="visitor-id-cell">
                            <div className={`status-orb ${isActive ? 'online' : ''}`} />
                            <div className="id-details">
                              <strong>{v.userId || 'Anonymous Guest'}</strong>
                              <span>{v.visitorId.slice(0, 12)}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="location-cell">
                            <span className="country-tag">
                               <i className="fa-solid fa-earth-americas" />
                               {v.country}
                            </span>
                            <span className="ip-text">{v.ip}</span>
                          </div>
                        </td>
                        <td className="ua-cell">
                           {v.userAgent?.includes('Windows') ? <i className="fa-brands fa-windows" /> : 
                            v.userAgent?.includes('Mac') ? <i className="fa-brands fa-apple" /> : 
                            <i className="fa-solid fa-mobile-screen-button" />}
                           <span>{v.userAgent?.split('(')[1]?.split(';')[0]?.slice(0, 15) || 'Web'}</span>
                        </td>
                        <td>
                          <div className="time-cell">
                             <strong>{new Date(v.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</strong>
                             <span>{new Date(v.lastActive).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </td>
                        <td><span className="view-badge">{(v.pathHistory?.length || 0)}</span></td>
                        <td onClick={e => e.stopPropagation()}>
                           <button onClick={() => deleteLog(v._id)} className="row-action-btn"><i className="fa-solid fa-trash-can" /></button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="visitor-journey-sidebar card-glass">
          {selectedVisitor ? (
            <div className="journey-wrap">
               <div className="journey-header">
                 <div className="journey-title-block">
                    <i className="fa-solid fa-shoe-prints" />
                    <h3>Journey Flow</h3>
                 </div>
                 <span className="v-pill">{selectedVisitor.city || 'Global'} / {selectedVisitor.ip}</span>
               </div>
               
               <div className="journey-stats-bar">
                  <div className="j-stat">
                     <label>First Visit</label>
                     <span>{new Date(selectedVisitor.firstSeen).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="j-stat">
                     <label>Referrer</label>
                     <span>{selectedVisitor.referrer}</span>
                  </div>
               </div>

               <div className="path-timeline">
                  {[...selectedVisitor.pathHistory].reverse().map((step, idx) => (
                    <div key={idx} className="path-entry">
                       <div className="path-node">
                          <i className={`fa-solid ${getPageIcon(step.path)}`} />
                       </div>
                       <div className="path-details">
                          <div className="path-row">
                             <span className="path-text">{step.path}</span>
                             <span className="path-time">{new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                          </div>
                          {idx === 0 && <div className="path-status">Currently Viewing</div>}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ) : (
            <div className="journey-empty-state">
               <div className="empty-visual">
                  <div className="pulse-ring" />
                  <i className="fa-solid fa-satellite-dish" />
               </div>
               <h3>Select a Session</h3>
               <p>Select any visitor from the list to visualize their real-time navigation flow and intent.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .visitor-logs-page { height: 100%; display: flex; flex-direction: column; gap: 24px; }
        
        .title-row { display: flex; align-items: center; gap: 16px; margin-bottom: 4px; }
        .live-indicator { 
           display: flex; align-items: center; gap: 8px; 
           background: rgba(100, 116, 139, 0.1); padding: 4px 12px; border-radius: 20px;
           font-size: 10px; font-weight: 800; color: var(--text-dim); letter-spacing: 0.5px;
           border: 1px solid var(--border); transition: all 0.3s;
        }
        .live-indicator.active { background: rgba(0, 204, 136, 0.08); color: #00cc88; border-color: rgba(0, 204, 136, 0.2); }
        .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: #64748b; }
        .live-indicator.active .pulse-dot { background: #00cc88; box-shadow: 0 0 8px #00cc88; animation: pulseGlow 1.5s infinite; }
        @keyframes pulseGlow { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }

        .visitor-content-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; flex: 1; min-height: 0; }
        .card-glass { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.02); }

        .pane-header { padding: 16px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.02); }
        .pane-header span { font-size: 11px; font-weight: 800; color: var(--text-dim); letter-spacing: 1px; }
        .count-badge { background: var(--bg-deep); padding: 2px 10px; border-radius: 10px; border: 1px solid var(--border); }

        .visitor-table-wrap { flex: 1; overflow-y: auto; }
        .visitor-table { width: 100%; border-collapse: collapse; }
        .visitor-table th { position: sticky; top: 0; background: var(--bg-card); z-index: 10; padding: 14px 24px; text-align: left; font-size: 10px; font-weight: 800; color: var(--text-dim); border-bottom: 1px solid var(--border); }
        .visitor-table td { padding: 18px 24px; border-bottom: 1px dashed var(--border); cursor: pointer; transition: all 0.2s; }
        .visitor-table tr:hover td { background: rgba(255, 77, 94, 0.02); }
        .visitor-table tr.selected td { background: rgba(255, 77, 94, 0.04); border-bottom-style: solid; }

        .visitor-id-cell { display: flex; align-items: center; gap: 14px; }
        .status-orb { width: 8px; height: 8px; border-radius: 50%; background: var(--border); border: 2px solid var(--bg-card); }
        .status-orb.online { background: #00cc88; box-shadow: 0 0 10px rgba(0,204,136,0.3); }
        .id-details { display: flex; flex-direction: column; }
        .id-details strong { font-size: 14px; color: var(--text-main); }
        .id-details span { font-size: 11px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; }

        .country-tag { display: flex; align-items: center; gap: 6px; background: rgba(255, 77, 94, 0.05); color: #FF4D5E; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; width: fit-content; margin-bottom: 4px; }
        .ip-text { font-size: 11px; color: var(--text-dim); }

        .ua-cell { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--text-dim); }
        .ua-cell i { font-size: 16px; color: var(--text-main); opacity: 0.7; }

        .time-cell { display: flex; flex-direction: column; }
        .time-cell strong { font-size: 13px; color: var(--text-main); }
        .time-cell span { font-size: 10px; color: var(--text-dim); }

        .view-badge { background: var(--bg-deep); padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 800; color: #FF4D5E; border: 1px solid rgba(255, 77, 94, 0.1); }
        .row-action-btn { width: 32px; height: 32px; border-radius: 8px; border: none; background: transparent; color: var(--text-dim); transition: all 0.2s; cursor: pointer; }
        .row-action-btn:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        /* Journey Sidebar */
        .journey-wrap { height: 100%; display: flex; flex-direction: column; padding: 24px; }
        .journey-header { margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px; }
        .journey-title-block { display: flex; align-items: center; gap: 12px; color: #FF4D5E; }
        .v-pill { background: var(--bg-deep); padding: 4px 12px; border-radius: 6px; font-size: 11px; color: var(--text-dim); font-family: monospace; border: 1px solid var(--border); width: fit-content; }
        
        .journey-stats-bar { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; background: var(--bg-deep); padding: 12px; border-radius: 12px; border: 1px solid var(--border); }
        .j-stat { display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
        .j-stat label { font-size: 10px; color: var(--text-dim); font-weight: 800; text-transform: uppercase; }
        .j-stat span { font-size: 12px; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .path-timeline { flex: 1; overflow-y: auto; padding-left: 14px; display: flex; flex-direction: column; }
        .path-entry { position: relative; padding-left: 32px; padding-bottom: 28px; border-left: 2px solid var(--border); }
        .path-entry:last-child { border-left-color: transparent; }
        .path-node { position: absolute; left: -14px; top: 0; width: 26px; height: 26px; border-radius: 50%; background: var(--bg-card); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-dim); font-size: 11px; transition: all 0.3s; }
        .path-entry:first-child .path-node { border-color: #FF4D5E; color: #FF4D5E; box-shadow: 0 0 15px rgba(255, 77, 94, 0.2); }
        .path-details { background: var(--bg-deep); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border); }
        .path-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .path-text { font-size: 13px; font-weight: 700; color: var(--text-main); font-family: monospace; }
        .path-time { font-size: 10px; font-weight: 600; color: var(--text-dim); }
        .path-status { margin-top: 4px; font-size: 10px; font-weight: 800; color: #00cc88; text-transform: uppercase; }

        .journey-empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; color: var(--text-dim); }
        .empty-visual { position: relative; margin-bottom: 24px; }
        .empty-visual i { font-size: 48px; position: relative; z-index: 2; opacity: 0.2; }
        .pulse-ring { position: absolute; top: -20px; left: -20px; width: 88px; height: 88px; border: 2px solid #FF4D5E; border-radius: 50%; opacity: 0.1; animation: ringPulse 2s infinite; }
        @keyframes ringPulse { 0% { transform: scale(0.8); opacity: 0.2; } 100% { transform: scale(1.3); opacity: 0; } }

        .loading-state, .empty-state { text-align: center; padding: 60px; color: var(--text-dim); font-size: 14px; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default VisitorLogs;
