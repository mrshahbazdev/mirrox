import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { useTrading } from '../../context/TradingContext';
import AdminLayout from '../../components/admin/AdminLayout';

const VisitorLogs = ({ onAdminLogout }) => {
  const { socket } = useTrading();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLive, setIsLive] = useState(false);
  const journeyRef = useRef(null);

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

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  useEffect(() => {
    if (!socket) return;
    setIsLive(true);

    const handleVisitorUpdate = (updatedVisitor) => {
      setVisitors(prev => {
        const index = prev.findIndex(v => v.visitorId === updatedVisitor.visitorId);
        if (index !== -1) {
          const newList = [...prev];
          newList.splice(index, 1);
          return [updatedVisitor, ...newList];
        } else {
          return [updatedVisitor, ...prev];
        }
      });

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

  const handleSelectVisitor = (v) => {
    setSelectedVisitor(v);
    // Auto-scroll on mobile
    if (window.innerWidth < 1100 && journeyRef.current) {
        setTimeout(() => {
            journeyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  };

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
    <AdminLayout onAdminLogout={onAdminLogout}>
      <div className="visitor-logs-page">
        {/* Harmonized Page Header */}
        <div className="adm-page-header">
            <div>
                <h2 className="adm-page-title">
                    <i className="fa-solid fa-shoe-prints" /> Visitor Journeys
                </h2>
                <div className="header-meta-row">
                    <p className="adm-page-sub">Real-time behavior analytics and navigation map</p>
                    <div className={`live-indicator ${isLive ? 'active' : ''}`}>
                        <span className="pulse-dot" />
                        <span>{isLive ? 'LIVE' : 'DISCONNECTED'}</span>
                    </div>
                </div>
            </div>
            <div className="adm-search-wrap visitor-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input 
                    type="text" 
                    placeholder="Search sessions..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="visitor-content-grid">
          {/* Main List Column */}
          <div className="visitor-list-pane card-glass">
            <div className="pane-header">
               <span>PLATFORM TRAFFIC</span>
               <span className="count-badge">{filteredVisitors.length} SESSIONS</span>
            </div>
            <div className="visitor-table-wrap">
              <table className="visitor-table">
                <thead>
                  <tr>
                    <th>VISITOR</th>
                    <th>ORIGIN</th>
                    <th className="hide-mobile">SYSTEM</th>
                    <th>LAST ACTIVE</th>
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
                      const isActive = (new Date() - new Date(v.lastActive)) < 120000;
                      return (
                        <tr key={v._id} className={`${selectedVisitor?._id === v._id ? 'selected' : ''} ${isActive ? 'is-active' : ''}`} onClick={() => handleSelectVisitor(v)}>
                          <td>
                            <div className="visitor-id-cell">
                              <div className={`status-orb ${isActive ? 'online' : ''}`} />
                              <div className="id-details">
                                <strong>{v.userId || 'Guest'}</strong>
                                <span className="mono-vid">{v.visitorId.slice(0, 8)}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="location-cell">
                              <span className="country-tag">{v.country}</span>
                              <span className="ip-text">{v.ip}</span>
                            </div>
                          </td>
                          <td className="ua-cell hide-mobile">
                             {v.userAgent?.includes('Windows') ? <i className="fa-brands fa-windows" /> : 
                              v.userAgent?.includes('Mac') ? <i className="fa-brands fa-apple" /> : 
                              <i className="fa-solid fa-mobile-screen-button" />}
                             <span>{v.userAgent?.split('(')[1]?.split(';')[0]?.slice(0, 10) || 'Web'}</span>
                          </td>
                          <td>
                            <div className="time-cell">
                               <strong>{new Date(v.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
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

          {/* Journey Detail Column / Sidebar */}
          <div className="visitor-journey-sidebar card-glass" ref={journeyRef}>
            {selectedVisitor ? (
              <div className="journey-wrap">
                 <div className="journey-header">
                   <div className="journey-title-block">
                      <i className="fa-solid fa-route" />
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
                               <span className="path-time">{new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                 <p>Analyze real-time navigation flow and intent by selecting a visitor session.</p>
              </div>
            )}
          </div>
        </div>

        <style>{`
          .visitor-logs-page { display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.4s ease; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

          /* Header Styling */
          .header-meta-row { display: flex; align-items: center; gap: 16px; margin-top: 4px; }
          .live-indicator { 
             display: flex; align-items: center; gap: 8px; 
             background: rgba(100, 116, 139, 0.05); padding: 4px 10px; border-radius: 6px;
             font-size: 9px; font-weight: 800; color: var(--text-dim); letter-spacing: 1px;
             border: 1px solid var(--border);
          }
          .live-indicator.active { background: rgba(0, 204, 136, 0.08); color: #00cc88; border-color: rgba(0, 204, 136, 0.2); }
          .pulse-dot { width: 5px; height: 5px; border-radius: 50%; background: #64748b; }
          .live-indicator.active .pulse-dot { background: #00cc88; box-shadow: 0 0 10px #00cc88; animation: pulseGlow 1.5s infinite; }
          @keyframes pulseGlow { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

          .visitor-search { max-width: 300px; }

          /* Main Content Grid */
          .visitor-content-grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; min-height: 0; }
          .card-glass { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; display: flex; flex-direction: column; overflow: hidden; }

          .pane-header { padding: 16px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.02); }
          .pane-header span { font-size: 10px; font-weight: 800; color: var(--text-dim); letter-spacing: 1px; }
          .count-badge { background: var(--bg-deep); padding: 2px 8px; border-radius: 6px; border: 1px solid var(--border); }

          .visitor-table-wrap { flex: 1; overflow-x: auto; overflow-y: auto; }
          .visitor-table { width: 100%; border-collapse: collapse; min-width: 600px; }
          .visitor-table th { position: sticky; top: 0; background: var(--bg-card); z-index: 10; padding: 14px 24px; text-align: left; font-size: 10px; font-weight: 800; color: var(--text-dim); border-bottom: 1px solid var(--border); }
          .visitor-table td { padding: 16px 24px; border-bottom: 1px solid var(--border); cursor: pointer; transition: all 0.2s; }
          
          .visitor-id-cell { display: flex; align-items: center; gap: 12px; }
          .status-orb { width: 7px; height: 7px; border-radius: 50%; background: var(--border); flex-shrink: 0; }
          .status-orb.online { background: #00cc88; box-shadow: 0 0 10px rgba(0,204,136,0.3); }
          .id-details strong { font-size: 13px; color: var(--text-main); display: block; }
          .mono-vid { font-size: 10px; color: var(--text-dim); font-family: 'JetBrains Mono', monospace; }

          .country-tag { background: rgba(255, 77, 94, 0.05); color: #FF4D5E; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: block; width: fit-content; margin-bottom: 2px; }
          .ip-text { font-size: 10px; color: var(--text-dim); display: block; }
          .ua-cell { color: var(--text-dim); font-size: 11px; }
          
          .view-badge { background: var(--bg-deep); padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; color: #FF4D5E; border: 1px solid rgba(255, 77, 94, 0.1); }
          .row-action-btn { background: transparent; border: none; color: var(--text-dim); cursor: pointer; transition: 0.2s; }
          .row-action-btn:hover { color: #ef4444; }

          /* Sidebar Customizations */
          .journey-wrap { padding: 20px; }
          .journey-header { margin-bottom: 20px; }
          .journey-title-block { display: flex; align-items: center; gap: 10px; color: #FF4D5E; margin-bottom: 8px; }
          .path-timeline { padding-top: 10px; }
          .path-entry { position: relative; padding-left: 28px; padding-bottom: 24px; border-left: 2px solid var(--border); }
          .path-node { position: absolute; left: -12px; top: 0; width: 22px; height: 22px; border-radius: 50%; background: var(--bg-card); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-dim); }
          .path-entry:first-child .path-node { border-color: #FF4D5E; color: #FF4D5E; }
          .path-details { background: var(--bg-deep); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border); }
          .path-text { font-size: 12px; font-weight: 700; display: block; }
          .path-time { font-size: 9px; color: var(--text-dim); }

          /* Responsive Breakpoints */
          @media (max-width: 1100px) {
            .visitor-content-grid { grid-template-columns: 1fr; gap: 24px; }
            .visitor-journey-sidebar { min-height: 400px; }
          }

          @media (max-width: 768px) {
            .adm-page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
            .visitor-search { max-width: 100%; width: 100%; }
            .hide-mobile { display: none; }
            .visitor-table { min-width: 500px; }
            .visitor-table td, .visitor-table th { padding: 12px 16px; }
          }

          @media (max-width: 480px) {
            .time-cell span { display: none; }
            .visitor-id-cell strong { font-size: 12px; }
            .country-tag { font-size: 9px; }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
};

export default VisitorLogs;
