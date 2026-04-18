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

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchVisitors = useCallback(async () => {
    try {
      const token = localStorage.getItem('bullvera_admin_token');
      if (!token) {
          onAdminLogout();
          return;
      }
      
      const res = await axios.get(`${apiUrl}/api/admin/visitors`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      setVisitors(res.data);
    } catch (err) {
      console.error('Failed to fetch visitors', err);
      if (err.response?.status === 401) onAdminLogout();
    } finally {
      setLoading(false);
    }
  }, [apiUrl, onAdminLogout]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  useEffect(() => {
    if (!socket) return;
    setIsLive(true);

    const handleVisitorUpdate = (updatedVisitor) => {
      const vWithStatus = { ...updatedVisitor, isOnline: true };
      setVisitors(prev => {
        const index = prev.findIndex(v => v.visitorId === vWithStatus.visitorId);
        if (index !== -1) {
          const newList = [...prev];
          newList.splice(index, 1);
          return [vWithStatus, ...newList];
        } else {
          return [vWithStatus, ...prev];
        }
      });

      setSelectedVisitor(prev => {
        if (prev?.visitorId === vWithStatus.visitorId) {
          return vWithStatus;
        }
        return prev;
      });
    };

    const handleVisitorOffline = ({ visitorId }) => {
       setVisitors(prev => prev.map(v => 
         v.visitorId === visitorId ? { ...v, isOnline: false, lastActive: new Date() } : v
       ));
       setSelectedVisitor(prev => {
         if (prev?.visitorId === visitorId) {
           return { ...prev, isOnline: false, lastActive: new Date() };
         }
         return prev;
       });
    };

    socket.on('admin:visitor_update', handleVisitorUpdate);
    socket.on('admin:visitor_offline', handleVisitorOffline);
    socket.on('connect', () => setIsLive(true));
    socket.on('disconnect', () => setIsLive(false));

    return () => {
      socket.off('admin:visitor_update', handleVisitorUpdate);
      socket.off('admin:visitor_offline', handleVisitorOffline);
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  const handleSelectVisitor = (v) => {
    setSelectedVisitor(v);
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

  const formatLastActive = (v) => {
    if (v.isOnline) return <span className="live-pill">LIVE</span>;
    const diff = Math.floor((new Date() - new Date(v.lastActive)) / 1000);
    if (diff < 30) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return new Date(v.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds < 5) return 'Active';
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
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

  const getBrowserIcon = (browser) => {
    const b = browser?.toLowerCase() || '';
    if (b.includes('chrome')) return 'fa-chrome';
    if (b.includes('safari')) return 'fa-safari';
    if (b.includes('firefox')) return 'fa-firefox';
    if (b.includes('edge')) return 'fa-edge';
    return 'fa-globe';
  };

  return (
    <AdminLayout onAdminLogout={onAdminLogout}>
      <div className="visitor-logs-page">
        <div className="adm-page-header">
            <div>
                <h2 className="adm-page-title">
                    <i className="fa-solid fa-shoe-prints" /> Visitor Journeys
                </h2>
                <div className="header-meta-row">
                    <p className="adm-page-sub">Live behavioral analytics and deep device mapping</p>
                    <div className={`live-indicator ${isLive ? 'active' : ''}`}>
                        <span className="pulse-dot" />
                        <span>{isLive ? 'SYSTEM CONNECTED' : 'OFFLINE'}</span>
                    </div>
                </div>
            </div>
            <div className="adm-search-wrap visitor-search">
                <i className="fa-solid fa-magnifying-glass" />
                <input 
                    type="text" 
                    placeholder="Search active sessions..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="visitor-content-grid">
          <div className="visitor-list-pane card-glass">
            <div className="pane-header">
               <span>NETWORK TRAFFIC</span>
               <span className="count-badge">{filteredVisitors.length} ACTIVE</span>
            </div>
            <div className="visitor-table-wrap">
              <table className="visitor-table">
                <thead>
                  <tr>
                    <th>VISITOR</th>
                    <th>ORIGIN</th>
                    <th className="hide-mobile">DEVICE / BROWSER</th>
                    <th>LAST ACTIVE</th>
                    <th>HITS</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="loading-state">Syncing live data...</td></tr>
                  ) : filteredVisitors.length === 0 ? (
                    <tr><td colSpan="6" className="empty-state">No visitors detected.</td></tr>
                  ) : (
                    filteredVisitors.map(v => {
                      const isActive = v.isOnline || (new Date() - new Date(v.lastActive)) < 30000;
                      return (
                        <tr key={v._id} className={`${selectedVisitor?._id === v._id ? 'selected' : ''} ${isActive ? 'is-active' : ''}`} onClick={() => handleSelectVisitor(v)}>
                          <td>
                            <div className="visitor-id-cell">
                              <div className={`status-orb ${isActive ? 'online' : ''}`} />
                              <div className="id-details">
                                <strong>{v.userId || 'Guest'}</strong>
                                <span className="mono-vid">{v.visitorId.slice(0, 10)}</span>
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
                             <div className="device-compact">
                                <i className={`fa-solid ${v.deviceType === 'Mobile' ? 'fa-mobile-screen' : v.deviceType === 'Tablet' ? 'fa-tablet-screen' : 'fa-desktop'}`} />
                                <i className={`fa-brands ${getBrowserIcon(v.browser)}`} />
                                <span>{v.os || 'Web'}</span>
                             </div>
                          </td>
                          <td>
                            <div className="time-cell">
                               <strong>{formatLastActive(v)}</strong>
                               <span>{new Date(v.lastActive).toLocaleDateString()}</span>
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
                 
                 <div className="device-insights-card">
                    <div className="insights-header">DEVICE INSIGHTS</div>
                    <div className="insights-grid">
                       <div className="ins-item">
                          <label><i className="fa-solid fa-expand" /> Resolution</label>
                          <span>{selectedVisitor.screenResolution || 'Unknown'}</span>
                       </div>
                       <div className="ins-item">
                          <label><i className="fa-solid fa-window-restore" /> Browser</label>
                          <span>{selectedVisitor.browser || 'Unknown'}</span>
                       </div>
                       <div className="ins-item">
                          <label><i className="fa-solid fa-microchip" /> OS</label>
                          <span>{selectedVisitor.os || 'Unknown'}</span>
                       </div>
                       <div className="ins-item">
                          <label><i className="fa-solid fa-language" /> Language</label>
                          <span>{selectedVisitor.language || 'Unknown'}</span>
                       </div>
                    </div>
                 </div>

                 <div className="path-timeline">
                    {[...selectedVisitor.pathHistory].reverse().map((step, idx) => {
                      const isCurrent = idx === 0 && (selectedVisitor.isOnline || (new Date() - new Date(selectedVisitor.lastActive)) < 30000);
                      return (
                        <div key={idx} className={`path-entry ${isCurrent ? 'active-path' : ''}`}>
                           <div className="path-node">
                              <i className={`fa-solid ${getPageIcon(step.path)}`} />
                           </div>
                           <div className="path-details">
                              <div className="path-row">
                                 <span className="path-text">{step.path}</span>
                                 <div className="path-time-badge">
                                    <i className="fa-regular fa-clock" />
                                    {formatDuration(step.duration || 0)}
                                 </div>
                              </div>
                              <div className="path-footer">
                                 <span className="path-timestamp">{new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                 {isCurrent && <span className="live-tag">LIVE NOW</span>}
                              </div>
                           </div>
                        </div>
                      );
                    })}
                 </div>
              </div>
            ) : (
              <div className="journey-empty-state">
                 <div className="empty-visual">
                    <div className="pulse-ring" />
                    <i className="fa-solid fa-satellite-dish" />
                 </div>
                 <h3>Select a Session</h3>
                 <p>Select any visitor session to analyze real-time stay-time and engagement across routes.</p>
              </div>
            )}
          </div>
        </div>

        <style>{`
          .visitor-logs-page { display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.4s ease; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

          /* Header Styling Fixes */
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
          
          .live-pill {
            background: #00cc88;
            color: #fff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 0.5px;
            box-shadow: 0 0 10px rgba(0,204,136,0.3);
            animation: pulseGlow 2s infinite;
          }

          /* SEARCH BAR UI */
          .adm-search-wrap.visitor-search { 
            position: relative; 
            max-width: 300px; 
            width: 100%;
            display: flex;
            align-items: center;
          }
          .adm-search-wrap.visitor-search i { 
            position: absolute; 
            left: 14px; 
            color: var(--text-dim); 
            font-size: 14px; 
            pointer-events: none;
            z-index: 5;
          }
          .adm-search-wrap.visitor-search input { 
            width: 100%; 
            padding: 10px 14px 10px 42px; 
            background: var(--bg-deep); 
            border: 1px solid var(--border); 
            border-radius: 12px; 
            color: var(--text-main); 
            font-size: 13px;
            transition: all 0.2s;
          }
          .adm-search-wrap.visitor-search input:focus { border-color: #FF4D5E; outline: none; box-shadow: 0 0 0 3px rgba(255, 77, 94, 0.1); }

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

          .device-compact { display: flex; align-items: center; gap: 10px; color: var(--text-dim); }
          .device-compact i { font-size: 15px; opacity: 0.8; }
          .device-compact span { font-size: 11px; font-weight: 600; }

          .country-tag { background: rgba(255, 77, 94, 0.05); color: #FF4D5E; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: block; width: fit-content; margin-bottom: 2px; }
          .ip-text { font-size: 10px; color: var(--text-dim); display: block; }
          
          .view-badge { background: var(--bg-deep); padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; color: #FF4D5E; border: 1px solid rgba(255, 77, 94, 0.1); }
          .row-action-btn { background: transparent; border: none; color: var(--text-dim); cursor: pointer; transition: 0.2s; }
          .row-action-btn:hover { color: #ef4444; }

          /* DEVICE INSIGHTS CARD */
          .device-insights-card { margin: 0 20px 24px; padding: 16px; background: var(--bg-deep); border-radius: 16px; border: 1px solid var(--border); }
          .insights-header { font-size: 9px; font-weight: 900; color: var(--text-dim); letter-spacing: 1px; margin-bottom: 12px; }
          .insights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .ins-item { display: flex; flex-direction: column; gap: 4px; }
          .ins-item label { font-size: 9px; color: var(--text-dim); display: flex; align-items: center; gap: 5px; }
          .ins-item span { font-size: 11px; font-weight: 700; color: var(--text-main); }

          /* JOURNEY HEADER PREMIUM FIX */
          .journey-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 24px; 
            padding: 0 4px;
          }
          .journey-title-block { 
            display: flex; 
            align-items: center; 
            gap: 12px; 
            color: #FF4D5E; 
          }
          .journey-title-block i { font-size: 18px; }
          .journey-title-block h3 { font-size: 16px; font-weight: 800; color: var(--text-main); margin: 0; }
          
          .v-pill { 
            background: rgba(255, 77, 94, 0.05); 
            color: #FF4D5E; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 10px; 
            font-weight: 800; 
            letter-spacing: 0.5px;
            border: 1px solid rgba(255, 77, 94, 0.1);
          }

          /* EMPTY STATE UI */
          .journey-empty-state { 
            flex: 1; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            text-align: center; 
            padding: 40px; 
          }
          .empty-visual { 
            position: relative; 
            width: 100px; 
            height: 100px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            margin-bottom: 24px; 
          }
          .empty-visual i.fa-satellite-dish { 
            font-size: 40px; 
            color: #FF4D5E; 
            opacity: 0.9; 
            position: relative; 
            z-index: 2; 
          }
          .pulse-ring { 
            position: absolute; 
            width: 60px; 
            height: 60px; 
            border: 2px solid #FF4D5E; 
            border-radius: 50%; 
            opacity: 0.2; 
            animation: ringPulse 2s infinite; 
          }
          @keyframes ringPulse { 
            0% { transform: scale(0.8); opacity: 0.6; } 
            100% { transform: scale(1.8); opacity: 0; } 
          }
          
          .journey-empty-state h3 { font-size: 18px; margin-bottom: 12px; color: var(--text-main); font-weight: 700; }
          .journey-empty-state p { font-size: 13px; color: var(--text-dim); line-height: 1.6; max-width: 260px; margin: 0 auto; }

          .path-timeline { padding: 0 20px 20px; flex: 1; overflow-y: auto; }
          .path-entry { position: relative; padding-left: 28px; padding-bottom: 24px; border-left: 2px solid var(--border); }
          .path-node { position: absolute; left: -12px; top: 0; width: 22px; height: 22px; border-radius: 50%; background: var(--bg-card); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-dim); }
          .path-entry:first-child .path-node { border-color: #FF4D5E; color: #FF4D5E; }
          .path-details { background: var(--bg-deep); padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border); transition: all 0.3s; }
          .active-path .path-details { border-color: #00cc88; box-shadow: 0 0 10px rgba(0,204,136,0.1); }
          
          .path-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
          .path-text { font-size: 12px; font-weight: 700; word-break: break-all; }
          .path-time-badge { font-size: 10px; font-weight: 800; color: #FF4D5E; background: rgba(255, 77, 94, 0.05); padding: 2px 6px; border-radius: 4px; display: flex; align-items: center; gap: 4px; }
          .path-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
          .path-timestamp { font-size: 10px; color: var(--text-dim); }
          .live-tag { font-size: 9px; font-weight: 900; color: #00cc88; letter-spacing: 0.5px; }

          @media (max-width: 1100px) {
            .visitor-content-grid { grid-template-columns: 1fr; gap: 24px; }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
};

export default VisitorLogs;
