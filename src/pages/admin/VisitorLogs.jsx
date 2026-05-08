import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTrading } from '../../context/TradingContext';

const VisitorLogs = () => {
  const navigate = useNavigate();
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
          navigate('/admin/login');
          return;
      }
      
      const res = await axios.get(`${apiUrl}/api/admin/visitors`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      setVisitors(res.data);
    } catch (err) {
      console.error('Failed to fetch visitors', err);
      if (err.response?.status === 401) navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, navigate]);

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
    <>
      <div className="visitor-logs-page">
        <div className="adm-page-header">
            <div>
                <h2 className="adm-page-title">
                    <i className="fa-solid fa-radar" /> Behavioral Analytics
                </h2>
                <div className="header-meta-row">
                    <p className="adm-page-sub">Real-time session mapping and systemic device diagnostics</p>
                    <div className={`live-indicator ${isLive ? 'active' : ''}`}>
                        <span className="pulse-dot" />
                        <span>{isLive ? 'TERMINAL LINKED' : 'SIGNAL DROPPED'}</span>
                    </div>
                </div>
            </div>
            <div className="adm-search-wrap visitor-search">
                <i className="fa-solid fa-satellite-dish" />
                <input 
                    type="text" 
                    placeholder="Search active transmissions..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="visitor-content-grid">
          <div className="visitor-list-pane adm-card">
            <div className="pane-header">
               <span>NETWORK TRANSMISSIONS</span>
               <span className="count-badge">{filteredVisitors.length} IDENTIFIED</span>
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

          <div className="visitor-journey-sidebar adm-card" ref={journeyRef}>
            {selectedVisitor ? (
              <div className="journey-wrap">
                 <div className="journey-header">
                   <div className="journey-title-block">
                      <i className="fa-solid fa-wave-square" />
                      <h3>Journey Metrics</h3>
                   </div>
                   <span className="v-pill">{selectedVisitor.city || 'Undetermined'} / {selectedVisitor.ip}</span>
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

          .header-meta-row { display: flex; align-items: center; gap: 16px; margin-top: 6px; }
          .live-indicator { 
             display: flex; align-items: center; gap: 8px; 
             background: rgba(100, 116, 139, 0.05); padding: 6px 14px; border-radius: 20px;
             font-size: 9px; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em;
             border: 1px solid var(--border);
          }
          .live-indicator.active { background: rgba(0, 204, 136, 0.08); color: var(--success); border-color: rgba(0, 204, 136, 0.2); }
          .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-dim); }
          .live-indicator.active .pulse-dot { background: var(--success); box-shadow: 0 0 10px var(--success); animation: pulseGlow 1.5s infinite; }
          @keyframes pulseGlow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.2); } }
          
          .live-pill {
            background: var(--success);
            color: #fff;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.05em;
            box-shadow: 0 0 15px rgba(0,204,136,0.3);
            animation: pulseGlow 2s infinite;
          }

          .adm-search-wrap.visitor-search { 
            position: relative; 
            max-width: 320px; 
            width: 100%;
            display: flex;
            align-items: center;
          }
          .adm-search-wrap.visitor-search i { 
            position: absolute; 
            left: 18px; 
            color: var(--brand-primary); 
            font-size: 14px; 
            pointer-events: none;
            z-index: 5;
          }
          .adm-search-wrap.visitor-search input { 
            width: 100%; 
            padding: 12px 18px 12px 48px; 
            background: rgba(0,0,0,0.1) !important; 
            border: 1px solid var(--border) !important; 
            border-radius: 14px !important; 
            color: var(--text-main) !important; 
            font-size: 13px !important;
            transition: all 0.2s;
            font-weight: 500;
          }
          .adm-search-wrap.visitor-search input:focus { border-color: var(--brand-primary) !important; background: var(--bg-card) !important; box-shadow: 0 0 0 4px rgba(255, 77, 94, 0.05); }

          .visitor-content-grid { display: grid; grid-template-columns: 1fr 400px; gap: 24px; min-height: 0; }

          .pane-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.02); }
          .pane-header span { font-size: 10px; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; }
          .count-badge { background: var(--bg-deep); padding: 4px 10px; border-radius: 8px; border: 1px solid var(--border); color: var(--brand-primary); font-weight: 900; }

          .visitor-table-wrap { flex: 1; overflow: auto; }
          .visitor-table { width: 100%; border-collapse: collapse; min-width: 600px; }
          .visitor-table th { position: sticky; top: 0; background: var(--bg-card); z-index: 10; padding: 16px 24px; text-align: left; font-size: 10px; font-weight: 900; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid var(--border); }
          .visitor-table td { padding: 18px 24px; border-bottom: 1px solid var(--border); cursor: pointer; transition: all 0.2s; }
          .visitor-table tr:hover td { background: var(--bg-hover); }
          .visitor-table tr.selected td { background: rgba(255, 77, 94, 0.05); }
          
          .visitor-id-cell { display: flex; align-items: center; gap: 14px; }
          .status-orb { width: 8px; height: 8px; border-radius: 50%; background: var(--border); flex-shrink: 0; transition: 0.3s; }
          .status-orb.online { background: var(--success); box-shadow: 0 0 12px var(--success); }
          .id-details strong { font-size: 14px; color: var(--text-main); display: block; margin-bottom: 2px; }
          .mono-vid { font-size: 10px; color: var(--text-dim); font-family: 'Space Mono', monospace; font-weight: 700; }

          .device-compact { display: flex; align-items: center; gap: 12px; color: var(--text-dim); }
          .device-compact i { font-size: 16px; color: var(--brand-primary); opacity: 0.7; }
          .device-compact span { font-size: 11px; font-weight: 700; }

          .country-tag { background: rgba(255, 77, 94, 0.08); color: var(--brand-primary); font-size: 10px; font-weight: 900; padding: 3px 8px; border-radius: 6px; display: block; width: fit-content; margin-bottom: 4px; border: 1px solid rgba(255, 77, 94, 0.1); }
          .ip-text { font-size: 10px; color: var(--text-dim); display: block; font-family: 'Space Mono', monospace; }
          
          .view-badge { background: var(--bg-deep); padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 900; color: var(--text-main); border: 1px solid var(--border); }
          .row-action-btn { width: 32px; height: 32px; border-radius: 8px; background: transparent; border: 1px solid transparent; color: var(--text-dim); cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
          .row-action-btn:hover { background: rgba(255, 77, 77, 0.1); color: var(--danger); border-color: rgba(255, 77, 77, 0.2); }

          .device-insights-card { margin: 0 24px 24px; padding: 20px; background: rgba(0,0,0,0.1); border-radius: 20px; border: 1px solid var(--border); }
          .insights-header { font-size: 9px; font-weight: 900; color: var(--text-dim); letter-spacing: 0.15em; margin-bottom: 16px; text-transform: uppercase; }
          .insights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .ins-item { display: flex; flex-direction: column; gap: 6px; }
          .ins-item label { font-size: 9px; color: var(--text-dim); display: flex; align-items: center; gap: 6px; font-weight: 800; text-transform: uppercase; }
          .ins-item span { font-size: 12px; font-weight: 800; color: var(--text-main); }

          .journey-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 24px; 
            padding: 24px 24px 0;
          }
          .journey-title-block { 
            display: flex; 
            align-items: center; 
            gap: 12px; 
            color: var(--brand-primary); 
          }
          .journey-title-block i { font-size: 20px; }
          .journey-title-block h3 { font-size: 16px; font-weight: 900; color: var(--text-main); margin: 0; text-transform: uppercase; letter-spacing: -0.2px; }
          
          .v-pill { 
            background: rgba(255, 77, 94, 0.08); 
            color: var(--brand-primary); 
            padding: 6px 14px; 
            border-radius: 20px; 
            font-size: 10px; 
            font-weight: 900; 
            letter-spacing: 0.05em;
            border: 1px solid rgba(255, 77, 94, 0.1);
          }

          .journey-empty-state { 
            flex: 1; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            text-align: center; 
            padding: 60px; 
          }
          .empty-visual { 
            position: relative; 
            width: 120px; 
            height: 120px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            margin-bottom: 32px; 
          }
          .empty-visual i.fa-satellite-dish { 
            font-size: 48px; 
            color: var(--brand-primary); 
            opacity: 0.9; 
            position: relative; 
            z-index: 2; 
          }
          .pulse-ring { 
            position: absolute; 
            width: 80px; 
            height: 80px; 
            border: 2px solid var(--brand-primary); 
            border-radius: 50%; 
            opacity: 0.2; 
            animation: ringPulse 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1); 
          }
          @keyframes ringPulse { 
            0% { transform: scale(0.6); opacity: 0.8; } 
            100% { transform: scale(2.2); opacity: 0; } 
          }
          
          .journey-empty-state h3 { font-size: 20px; margin-bottom: 12px; color: var(--text-main); font-weight: 900; }
          .journey-empty-state p { font-size: 14px; color: var(--text-dim); line-height: 1.7; max-width: 280px; margin: 0 auto; font-weight: 500; }

          .path-timeline { padding: 0 24px 24px; flex: 1; overflow-y: auto; }
          .path-entry { position: relative; padding-left: 32px; padding-bottom: 32px; border-left: 1px dashed var(--border); }
          .path-entry:last-child { border-left: none; padding-bottom: 0; }
          .path-node { position: absolute; left: -11px; top: 0; width: 20px; height: 20px; border-radius: 6px; background: var(--bg-deep); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--text-dim); z-index: 2; transition: 0.3s; }
          .path-entry:first-child .path-node { border-color: var(--brand-primary); color: var(--brand-primary); box-shadow: 0 0 15px rgba(255, 77, 94, 0.2); }
          .path-details { background: rgba(0,0,0,0.1); padding: 14px 18px; border-radius: 16px; border: 1px solid var(--border); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
          .active-path .path-details { border-color: var(--success); background: rgba(0, 204, 136, 0.03); box-shadow: 0 10px 20px rgba(0,204,136,0.05); }
          .path-entry:hover .path-details { transform: translateX(5px); border-color: var(--text-dim); }
          
          .path-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
          .path-text { font-size: 13px; font-weight: 800; word-break: break-all; color: var(--text-main); font-family: 'Space Mono', monospace; }
          .path-time-badge { font-size: 10px; font-weight: 900; color: var(--brand-primary); background: rgba(255, 77, 94, 0.08); padding: 3px 8px; border-radius: 6px; display: flex; align-items: center; gap: 6px; border: 1px solid rgba(255, 77, 94, 0.1); }
          .path-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
          .path-timestamp { font-size: 10px; color: var(--text-dim); font-weight: 700; }
          .live-tag { font-size: 9px; font-weight: 950; color: var(--success); letter-spacing: 0.1em; text-transform: uppercase; }

          @media (max-width: 1100px) {
            .visitor-content-grid { grid-template-columns: 1fr; gap: 24px; }
          }
        `}</style>
      </div>
    </>
  );
};

export default VisitorLogs;
