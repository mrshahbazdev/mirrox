import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';

const Analytics = () => {
  const { currentClientExtended } = useTrading();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentClientExtended?.id) return;
      try {
        const res = await axios.get(`http://localhost:3000/api/clients/${currentClientExtended.id}/analytics`);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [currentClientExtended?.id]);

  if (loading) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '16px' }}></i>
        <p>Crunching Performance Data...</p>
      </div>
    );
  }

  const s = stats || {};

  return (
    <div className="analytics-container animate-fade">
      {/* ROI / Performance Section */}
      <div className="performance-card glass">
        <div className="perf-header">
          <div className="roi-badge">
            <i className={`fa-solid ${parseFloat(s.roi) >= 0 ? 'fa-chart-line' : 'fa-chart-area'}`} style={{ color: parseFloat(s.roi) >= 0 ? '#00cc88' : '#ef4444' }}></i>
            <div className="roi-text">
              <h3 style={{ color: parseFloat(s.roi) >= 0 ? '#00cc88' : '#ef4444' }}>
                ROI: {parseFloat(s.roi) >= 0 ? '+' : ''}{s.roi}%
              </h3>
              <p>Overall Performance Index</p>
            </div>
          </div>
          <div className="period-pill-nav">
             <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginRight: '8px' }}>History:</span>
             <span className="adm-uid-badge" style={{ background: 'rgba(50,145,255,0.1)', color: '#3291ff', border: 'none' }}>Live Account History</span>
          </div>
        </div>

        <div className="perf-chart-placeholder">
          <div className="perf-grid-bg"></div>
          {parseFloat(s.roi) === 0 ? (
            <div className="perf-empty">
              <i className="fa-solid fa-database"></i>
              <span>No historical trades for trend analysis</span>
            </div>
          ) : (
             <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifycontent: 'center' }}>
                <div style={{ width: '80%', height: '2px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                   <div style={{ position: 'absolute', left: 0, top: '-10px', width: '10px', height: '10px', borderRadius: '50%', background: '#3291ff' }}></div>
                   <div style={{ position: 'absolute', right: 0, top: '-40px', width: '10px', height: '10px', borderRadius: '50%', background: s.roi >= 0 ? '#00cc88' : '#ef4444' }}></div>
                   <svg style={{ position: 'absolute', top: -50, left: 0, width: '100%', height: 100 }}>
                      <path d={`M 0 50 Q 50 ${s.roi >= 0 ? 10 : 90} 100 50`} fill="none" stroke={s.roi >= 0 ? '#00cc88' : '#ef4444'} strokeWidth="3" strokeDasharray="300" strokeDashoffset="0" style={{ transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                   </svg>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="analytics-grid">
        <div className="metric-card-premium glass">
          <div className="m-premium-header">
            <i className="fa-solid fa-trophy" style={{ color: '#f59e0b' }}></i>
            <h4>Trade Stats</h4>
          </div>
          <div className="m-premium-body">
            <div className="m-premium-row">
              <span className="label">Average Win</span>
              <span className="value pos">{parseFloat(s.avgWin).toFixed(2)} <small>USD</small></span>
            </div>
            <div className="m-premium-row">
              <span className="label">Average Loss</span>
              <span className="value neg">{parseFloat(s.avgLoss).toFixed(2)} <small>USD</small></span>
            </div>
          </div>
          <div className="m-premium-footer">
            <span className="label">Profit Factor</span>
            <span className="value prominent" style={{ color: parseFloat(s.profitFactor) >= 1 ? '#00cc88' : '#f59e0b' }}>{s.profitFactor}</span>
          </div>
        </div>

        <div className="metric-card-premium glass">
          <div className="m-premium-header">
            <i className="fa-solid fa-list-check" style={{ color: '#3291ff' }}></i>
            <h4>Distribution</h4>
          </div>
          <div className="m-premium-body">
            <div className="m-premium-row">
              <span className="label">Total Life Trades</span>
              <span className="value" style={{ fontFamily: 'Space Mono' }}>{s.totalTrades}</span>
            </div>
            <div className="distribution-block" style={{ marginTop: '12px' }}>
              <div className="dist-labels">
                <span>{s.buyCount} Buys ({Math.round(s.buyPercent)}%)</span>
                <span>{s.sellCount} Sells ({Math.round(s.sellPercent)}%)</span>
              </div>
              <div className="dist-bar" style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <div className="fill buy" style={{width: `${s.buyPercent}%`, background: '#10b981', height: '100%', transition: 'width 1s ease' }}></div>
                <div className="fill sell" style={{width: `${s.sellPercent}%`, background: '#ef4444', height: '100%', transition: 'width 1s ease' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card-premium glass">
          <div className="m-premium-header">
            <i className="fa-solid fa-bullseye" style={{ color: '#a855f7' }}></i>
            <h4>Win Strategy</h4>
          </div>
          <div className="m-premium-centered">
            <div className="progress-ring-container">
              <svg viewBox="0 0 36 36" className="circular-progress">
                <path className="circle-track" stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle-fill" stroke="#a855f7" strokeWidth="3" strokeDasharray={`${s.winRate}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={{ transition: 'stroke-dasharray 1.5s ease' }} />
                <text x="18" y="20.35" className="circle-text" fill="#fff" fontSize="8" fontWeight="800" textAnchor="middle">{Math.round(s.winRate)}%</text>
              </svg>
            </div>
            <p className="sub-text" style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '8px' }}>Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
