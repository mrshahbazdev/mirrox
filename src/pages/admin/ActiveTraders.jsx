import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

const ActiveTraders = ({ onAdminLogout }) => {
  const [data, setData] = useState({ count: 0, clients: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    const fetchActiveTraders = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/active-traders');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load active traders', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActiveTraders();
    interval = setInterval(fetchActiveTraders, 5000); // Poll every 5s for live updates
    return () => clearInterval(interval);
  }, []);

  if (loading) {
     return (
       <AdminLayout onAdminLogout={onAdminLogout}>
         <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-dim)' }}>
           <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 40, marginBottom: 16, display: 'block', color: 'var(--brand-primary)' }} />
           <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Scanning Market Risks...</p>
         </div>
       </AdminLayout>
     );
  }

  return (
    <AdminLayout onAdminLogout={onAdminLogout}>
      <div className="adm-page-header">
        <div>
          <h2 className="adm-page-title">
            <i className="fa-solid fa-chart-line" /> Active Traders
          </h2>
          <p className="adm-page-sub">Live monitoring of clients with currently open market positions</p>
        </div>
        <div className="adm-live-pulse-badge">
          <span className="dot pulse" /> LIVE TRACKING
        </div>
      </div>

      <div className="risk-overview-cards">
        <div className="risk-card">
          <div className="risk-icon users"><i className="fa-solid fa-users-viewfinder" /></div>
          <div>
            <div className="risk-label">Active Traders</div>
            <div className="risk-value">{data.count}</div>
          </div>
        </div>
        <div className="risk-card">
          <div className="risk-icon docs"><i className="fa-solid fa-layer-group" /></div>
          <div>
            <div className="risk-label">Total Open Trades</div>
            <div className="risk-value">
              {data.clients.reduce((acc, c) => acc + c.openTradeCount, 0)}
            </div>
          </div>
        </div>
        <div className="risk-card">
          <div className="risk-icon money"><i className="fa-solid fa-scale-unbalanced" /></div>
          <div>
            <div className="risk-label">Total Volume (Lots)</div>
            <div className="risk-value">
              {data.clients.reduce((acc, c) => acc + parseFloat(c.totalLots || 0), 0)?.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="adm-table-wrap">
        {data.clients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-dim)' }}>
             <i className="fa-solid fa-mug-hot" style={{ fontSize: 40, opacity: 0.3, marginBottom: 10 }} />
             <p>No open trades at the moment. The market is quiet.</p>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Trader</th>
                <th>Open Trades</th>
                <th>Vol (Lots)</th>
                <th>Live Balance</th>
                <th>Live Equity</th>
                <th>Floating P/L</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.clients.map(c => {
                const isProfit = parseFloat(c.floatingPL) >= 0;
                return (
                  <tr className="adm-table-row" key={c.id}>
                    <td>
                      <div className="trader-name-cell">
                        <div className="trader-avatar">{c.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#e0e6ed', fontSize: 14 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'Space Mono' }}>{c.uid}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="trade-count-badge">{c.openTradeCount}</div>
                    </td>
                    <td className="adm-mono">{c.totalLots}</td>
                    <td className="adm-mono">${c.balance.toLocaleString()}</td>
                    <td className="adm-mono" style={{ color: '#e0e6ed', fontWeight: 600 }}>${c.equity.toLocaleString()}</td>
                    <td className={`adm-mono ${isProfit ? 'pos' : 'neg'}`}>
                      {isProfit ? '+' : ''}{c.floatingPL}
                    </td>
                    <td>
                      <button 
                         className="adm-act-btn view" 
                         title="View Profile Details"
                         onClick={() => navigate(`/admin/client/${c.id}`)}
                      >
                        <i className="fa-solid fa-eye" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .adm-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .adm-page-title { font-size: 22px; font-weight: 800; color: #e0e6ed; display: flex; align-items: center; gap: 10px; }
        .adm-page-title i { color: #FF4D5E; }
        .adm-page-sub { font-size: 13px; color: #64748b; margin-top: 4px; }
        
        .adm-live-pulse-badge {
          display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800;
          color: var(--success); background: rgba(0,204,136,0.1); padding: 6px 14px; border-radius: 20px;
          border: 1px solid rgba(0,204,136,0.2); letter-spacing: 0.5px;
        }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success); }
        .dot.pulse { animation: pulseGreen 2s infinite; }
        @keyframes pulseGreen { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .risk-overview-cards {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;
        }
        .risk-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 20px; padding: 24px; display: flex; align-items: center; gap: 16px;
          backdrop-filter: blur(10px);
        }
        .risk-icon {
          width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .risk-icon.users { background: rgba(255, 77, 94, 0.08); color: var(--brand-primary); }
        .risk-icon.docs { background: rgba(168,85,247,0.08); color: #a855f7; }
        .risk-icon.money { background: rgba(245,158,11,0.08); color: var(--warning); }
        .risk-label { font-size: 12px; font-weight: 700; color: var(--text-dim); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        .risk-value { font-size: 24px; font-weight: 800; color: var(--text-main); font-family: 'Space Mono', monospace; }

        .trader-name-cell { display: flex; align-items: center; gap: 12px; }
        .trader-avatar {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255, 77, 94, 0.08); border: 1px solid rgba(255, 77, 94, 0.2);
          display: flex; align-items: center; justify-content: center;
          color: var(--brand-primary); font-size: 14px; font-weight: 800; text-transform: uppercase;
        }
        
        .trade-count-badge {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 4px 10px; background: rgba(168,85,247,0.1); color: #a855f7;
          border-radius: 20px; font-weight: 800; font-family: 'Space Mono', monospace; font-size: 12px;
        }

        .adm-mono { font-family: 'Space Mono', monospace; }
        .pos { color: var(--success) !important; font-weight: 700; }
        .neg { color: var(--danger) !important; font-weight: 700; }

        .adm-act-btn {
          width: 30px; height: 30px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid transparent; cursor: pointer; font-size: 12px; transition: all 0.2s;
        }
        .adm-act-btn.view { background: rgba(255, 77, 94, 0.1); color: var(--brand-primary); border-color: rgba(255, 77, 94, 0.2); }
        .adm-act-btn.view:hover { background: var(--brand-primary); color: #fff; }
      `}</style>
    </AdminLayout>
  );
};

export default ActiveTraders;
