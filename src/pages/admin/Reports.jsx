import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import { useTrading } from '../../context/TradingContext';
import { useModal } from '../../context/ModalContext';

const MINI_CHART_BARS = [40, 60, 45, 75, 55, 80, 65, 90, 70, 95, 72, 88];

const MiniBar = ({ value, max, color }) => (
  <div style={{
    width: 14, background: `${color}22`, borderRadius: 3,
    display: 'flex', alignItems: 'flex-end', height: 48,
  }}>
    <div style={{
      width: '100%', background: color, borderRadius: 3,
      height: `${(value / max) * 100}%`,
      transition: 'height 0.5s ease',
    }} />
  </div>
);

const Reports = () => {
  const { socket } = useTrading();
  const { showAlert } = useModal();
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ clients: [], deposits: [], withdrawals: [], allTrades: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = React.useCallback(async () => {
    try {
        const [clientsRes, depsRes, widsRes, tradesRes] = await Promise.all([
          axios.get(import.meta.env.VITE_API_URL + '/api/clients'),
          axios.get(import.meta.env.VITE_API_URL + '/api/deposits'),
          axios.get(import.meta.env.VITE_API_URL + '/api/withdrawals'),
          axios.get(import.meta.env.VITE_API_URL + '/api/active-traders') // For trade presence
        ]);
        const clientsData = clientsRes.data;

        // Fetch recent global history and combine with current presence
        const [historyRes, tradersRes] = await Promise.all([
          axios.get(import.meta.env.VITE_API_URL + '/api/trades/history/all'),
          axios.get(import.meta.env.VITE_API_URL + '/api/active-traders')
        ]);
        
        // Map history to include client names (could be optimized but good for now)
        const historyData = historyRes.data.map(t => ({
          ...t,
          clientName: clientsData.find(c => c.id === t.clientId)?.name || 'Deleted Client'
        }));

        setData({ 
          clients: clientsData, 
          deposits: depsRes.data, 
          withdrawals: widsRes.data, 
          allTrades: historyData 
        });
      } catch (err) {
        console.error('Failed to load reports data', err);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchData();

    if (socket) {
      socket.on('finance_update', fetchData);
      return () => {
        socket.off('finance_update', fetchData);
      };
    }
  }, [socket, fetchData]);

  const handleFinanceAction = async (type, id, action) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/${type}/${id}/status`, { status: action });
      fetchData();
    } catch (err) {
      showAlert(`Failed to ${action} ${type}`, 'Process Error', 'error');
    }
  };

  if (loading) {
    return (
      <>
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-dim)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 40, marginBottom: 16, display: 'block', color: 'var(--brand-primary)' }} />
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Compiling Reports...</p>
        </div>
      </>
    );
  }

  const mockClients = data.clients;
  const allDeposits = data.deposits;
  const allWithdrawals = data.withdrawals;
  const allTrades = data.allTrades;

  const totalDeposits = allDeposits.filter((d) => d.status === 'approved').reduce((s, d) => s + d.amount, 0);
  const totalWithdrawals = allWithdrawals.filter((w) => w.status === 'approved').reduce((s, w) => s + w.amount, 0);
  const totalPL = mockClients.reduce((s, c) => s + (c.accountSummary?.profitLoss || 0), 0);
  const totalEquity = mockClients.reduce((s, c) => s + (c.accountSummary?.equity || 0), 0);
  const activeTraderCount = new Set(allTrades.filter(t => t.status === 'Open').map(t => t.clientId)).size;

  const kpiCards = [
    {
      label: 'Active Traders', value: activeTraderCount.toString(),
      icon: 'fa-chart-line', color: 'var(--success)',
      sub: 'Clients with open positions',
    },
    {
      label: 'Total Deposits', value: `$${totalDeposits.toLocaleString()}`,
      icon: 'fa-download', color: 'var(--brand-primary)',
      sub: `${allDeposits.filter(d => d.status === 'approved').length} approved transactions`,
    },
    {
      label: 'Total Withdrawals', value: `$${totalWithdrawals.toLocaleString()}`,
      icon: 'fa-upload', color: 'var(--danger)',
      sub: `${allWithdrawals.filter(w => w.status === 'approved').length} processed`,
    },
    {
      label: 'Net P / L', value: (totalPL >= 0 ? '+' : '') + `$${totalPL.toLocaleString()}`,
      icon: 'fa-scale-unbalanced', color: totalPL >= 0 ? 'var(--success)' : 'var(--danger)',
      sub: 'Platform wide profitability',
    },
    {
      label: 'Total Equity', value: `$${totalEquity.toLocaleString()}`,
      icon: 'fa-landmark', color: '#a855f7',
      sub: `${mockClients.length} managed client accounts`,
    },
  ];

  const statusBreakdown = [
    { label: 'Active', count: mockClients.filter(c=>c.status==='active').length, color: 'var(--success)' },
    { label: 'Pending', count: mockClients.filter(c=>c.status==='pending').length, color: 'var(--warning)' },
    { label: 'Suspended', count: mockClients.filter(c=>c.status==='suspended').length, color: 'var(--danger)' },
  ];

  const topClients = [...mockClients]
    .sort((a, b) => b.accountSummary.deposit - a.accountSummary.deposit)
    .slice(0, 5);

  const recentTrades = allTrades.slice(0, 8);
  
  const pendingWithdrawals = allWithdrawals.filter(w => w.status === 'pending').map(w => ({
    ...w,
    clientName: mockClients.find(c => c.id === w.clientId)?.name || 'Unknown'
  }));

  const pendingDeposits = allDeposits.filter(d => d.status === 'pending').map(d => ({
    ...d,
    clientName: mockClients.find(c => c.id === d.clientId)?.name || 'Unknown'
  }));

  return (
    <>
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <h2 className="adm-page-title">
            <i className="fa-solid fa-chart-pie" /> Reports & Analytics
          </h2>
          <p className="adm-page-sub">Platform-wide financial overview and transaction reports</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="rpt-live-badge">
            <span className="adm-stat-dot" style={{ width: 6, height: 6 }} />
            Live Data
          </div>
          <button className="adm-export-btn">
            <i className="fa-solid fa-file-csv" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="rpt-kpi-grid">
        {kpiCards.map((k) => (
          <div className="rpt-kpi-card" key={k.label}>
            <div className="rpt-kpi-top">
              <div className="rpt-kpi-icon" style={{ color: k.color, background: `${k.color}15` }}>
                <i className={`fa-solid ${k.icon}`} />
              </div>
              <div className="rpt-mini-chart">
                {MINI_CHART_BARS.map((b, i) => (
                  <MiniBar key={i} value={b} max={100} color={k.color} />
                ))}
              </div>
            </div>
            <div className="rpt-kpi-value" style={{ color: k.color }}>{k.value}</div>
            <div className="rpt-kpi-label">{k.label}</div>
            <div className="rpt-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="rpt-two-col">
        {/* Client Status Breakdown */}
        <div className="rpt-panel adm-card">
          <div className="rpt-panel-header">
            <span><i className="fa-solid fa-users" style={{ color: 'var(--brand-primary)', marginRight: 8 }} />Client Status</span>
          </div>
          <div className="rpt-status-list">
            {statusBreakdown.map((s) => {
              const pct = Math.round((s.count / mockClients.length) * 100);
              return (
                <div className="rpt-status-row" key={s.label}>
                  <div className="rpt-status-info">
                    <span className="rpt-status-dot" style={{ background: s.color }} />
                    <span className="rpt-status-name">{s.label}</span>
                    <span className="rpt-status-count">{s.count} clients</span>
                  </div>
                  <div className="rpt-bar-wrap">
                    <div className="rpt-bar-track">
                      <div className="rpt-bar-fill" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                    <span className="rpt-bar-pct" style={{ color: s.color }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deposit vs Withdrawal */}
          <div className="rpt-dw-compare">
            <div className="rpt-dw-row">
              <span style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Total Deposits</span>
              <span style={{ color: 'var(--success)', fontWeight: 800, fontFamily: 'Space Mono', fontSize: 14 }}>
                +${totalDeposits.toLocaleString()}
              </span>
            </div>
            <div className="rpt-dw-row">
              <span style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Total Withdrawals</span>
              <span style={{ color: 'var(--danger)', fontWeight: 800, fontFamily: 'Space Mono', fontSize: 14 }}>
                -${totalWithdrawals.toLocaleString()}
              </span>
            </div>
            <div className="rpt-divider" />
            <div className="rpt-dw-row">
              <span style={{ color: 'var(--text-main)', fontSize: 13, fontWeight: 800 }}>NET BALANCE</span>
              <span style={{
                color: (totalDeposits - totalWithdrawals) >= 0 ? 'var(--success)' : 'var(--danger)',
                fontWeight: 800, fontFamily: 'Space Mono', fontSize: 16
              }}>
                ${(totalDeposits - totalWithdrawals).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Top Clients by Deposit */}
        <div className="rpt-panel adm-card">
          <div className="rpt-panel-header">
            <span><i className="fa-solid fa-trophy" style={{ color: 'var(--warning)', marginRight: 8 }} />Top Clients by Deposit</span>
          </div>
          <table className="rpt-mini-table">
            <thead>
              <tr>
                <th>#</th><th>Client</th><th>Deposit</th><th>P / L</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((c, i) => {
                const pl = c.accountSummary.profitLoss || 0;
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--warning)', fontWeight: 800, fontSize: 16 }}>
                      {medals[i] || `${i + 1}.`}
                    </td>
                    <td>
                      <div className="rpt-client-mini">
                        <div className="rpt-mini-avatar">{c.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: 13 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{c.uid}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'Space Mono', fontSize: 13, color: 'var(--text-main)', fontWeight: 700 }}>
                      ${c.accountSummary.deposit.toLocaleString()}
                    </td>
                    <td style={{ fontFamily: 'Space Mono', fontSize: 13, fontWeight: 700, color: pl >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {pl >= 0 ? '+' : ''}{pl.toFixed(0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Actions Row */}
      <div className="rpt-two-col">
        {/* Pending Withdrawals */}
        <div className="rpt-panel adm-card">
          <div className="rpt-panel-header">
            <span>
              <i className="fa-solid fa-clock" style={{ color: 'var(--warning)', marginRight: 8 }} />
              Pending Withdrawals
            </span>
            <span className="rpt-count-badge" style={{ background: 'rgba(245,158,11,0.08)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.2)' }}>
              {pendingWithdrawals.length}
            </span>
          </div>
          {pendingWithdrawals.length === 0 ? (
            <div className="rpt-empty">No pending withdrawals</div>
          ) : (
            <table className="rpt-mini-table">
              <thead><tr><th>Client</th><th>Amount</th><th>Method</th><th>Date</th><th style={{textAlign: 'right'}}>Action</th></tr></thead>
              <tbody>
                {pendingWithdrawals.map((w) => (
                  <tr key={w.id}>
                    <td style={{ color: 'var(--text-main)', fontSize: 13, fontWeight: 600 }}>{w.clientName}</td>
                    <td style={{ fontFamily: 'Space Mono', color: 'var(--danger)', fontWeight: 800 }}>${parseFloat(w.amount).toLocaleString()}</td>
                    <td style={{ color: 'var(--text-dim)', fontSize: 12 }}>{w.method}</td>
                    <td style={{ color: 'var(--text-dim)', fontSize: 12 }}>{w.date}</td>
                    <td style={{ textAlign: 'right' }}>
                       <div className="finance-actions">
                         <button className="fin-action-btn approve" onClick={() => handleFinanceAction('withdrawals', w.id, 'approved')} title="Approve Payout">
                           <i className="fa-solid fa-check" />
                         </button>
                         <button className="fin-action-btn reject" onClick={() => handleFinanceAction('withdrawals', w.id, 'rejected')} title="Reject">
                           <i className="fa-solid fa-xmark" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pending Deposits */}
        <div className="rpt-panel adm-card">
          <div className="rpt-panel-header">
            <span>
              <i className="fa-solid fa-hourglass" style={{ color: 'var(--brand-primary)', marginRight: 8 }} />
              Pending Deposits
            </span>
            <span className="rpt-count-badge" style={{ background: 'rgba(255, 77, 94, 0.08)', color: 'var(--brand-primary)', border: '1px solid rgba(255, 77, 94, 0.2)' }}>
              {pendingDeposits.length}
            </span>
          </div>
          {pendingDeposits.length === 0 ? (
            <div className="rpt-empty">No pending deposits</div>
          ) : (
            <table className="rpt-mini-table">
              <thead><tr><th>Client</th><th>Amount</th><th>Method</th><th>Ref</th><th style={{textAlign: 'right'}}>Action</th></tr></thead>
              <tbody>
                {pendingDeposits.map((d) => (
                  <tr key={d.id}>
                    <td style={{ color: 'var(--text-main)', fontSize: 13, fontWeight: 600 }}>{d.clientName}</td>
                    <td style={{ fontFamily: 'Space Mono', color: 'var(--success)', fontWeight: 800 }}>${parseFloat(d.amount).toLocaleString()}</td>
                    <td style={{ color: 'var(--text-dim)', fontSize: 12 }}>{d.method}</td>
                    <td style={{ fontFamily: 'Space Mono', color: 'var(--text-dim)', fontSize: 11 }}>{d.ref}</td>
                    <td style={{ textAlign: 'right' }}>
                       <div className="finance-actions">
                         <button className="fin-action-btn approve" onClick={() => handleFinanceAction('deposits', d.id, 'approved')} title="Approve & Credit">
                           <i className="fa-solid fa-check" />
                         </button>
                         <button className="fin-action-btn reject" onClick={() => handleFinanceAction('deposits', d.id, 'rejected')} title="Reject">
                           <i className="fa-solid fa-xmark" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Trades Log */}
      <div className="rpt-panel" style={{ marginBottom: 0 }}>
        <div className="rpt-panel-header">
          <span><i className="fa-solid fa-list-ul" style={{ color: '#a855f7', marginRight: 8 }} />Recent Trades Log</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="adm-table rpt-mini-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Trade ID</th><th>Client</th><th>Symbol</th><th>Type</th>
                <th>Lots</th><th>Open Price</th><th>Target / Close Price</th><th>Profit</th><th>Closed By</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((t) => (
                <tr className="adm-table-row" key={`${t.clientId}-${t.id}`}>
                  <td><span className="adm-uid-badge">{t.id}</span></td>
                  <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>{t.clientName}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.symbol}</td>
                  <td>
                    <span className={`cd-type-badge ${t.type === 'BUY' ? 'buy' : 'sell'}`}>{t.type}</span>
                  </td>
                  <td className="adm-mono">{t.lots}</td>
                  <td className="adm-mono">{t.openPrice}</td>
                  <td className="adm-mono" style={{ color: (t.status === 'Closed' || t.selectedPrice) ? 'var(--brand-primary)' : 'var(--text-dim)' }}>
                    {(() => {
                        if (t.status === 'Closed') return t.closePrice ? parseFloat(t.closePrice).toFixed(2) : '---';
                        return t.selectedPrice ? parseFloat(t.selectedPrice).toFixed(2) : '---';
                    })()}
                  </td>
                  <td className={`adm-mono ${t.profit >= 0 ? 'pos' : 'neg'}`}>
                    {t.profit >= 0 ? '+' : ''}{t.profit?.toFixed(2)}
                  </td>
                  <td>
                    {t.status === 'Closed' ? (
                      <span className="adm-uid-badge" style={{ fontSize: '10px', background: 'rgba(255,255,255,0.02)' }}>
                        {t.closedBy || 'Self'}
                      </span>
                    ) : '---'}
                  </td>
                  <td>
                    <span className={`cd-trade-status ${t.status?.toLowerCase()}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .rpt-live-badge {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 12px;
          background: rgba(0,204,136,0.08); border: 1px solid rgba(0,204,136,0.2);
          color: var(--success); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .adm-stat-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--success); box-shadow: 0 0 10px var(--success);
          display: inline-block; animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .adm-export-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 12px;
          background: rgba(255, 77, 94, 0.08); border: 1px solid rgba(255, 77, 94, 0.2);
          color: var(--brand-primary); font-size: 13px; font-weight: 700; cursor: pointer;
          transition: all 0.2s; font-family: 'Inter', sans-serif;
        }
        .adm-export-btn:hover { background: var(--brand-primary); color: #fff; transform: translateY(-1px); }

        /* KPI Cards */
        .rpt-kpi-grid {
          display: grid; grid-template-columns: repeat(5, 1fr);
          gap: 16px; margin-bottom: 24px;
        }
        .rpt-kpi-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 20px; padding: 24px;
          transition: all 0.25s; cursor: default; backdrop-filter: blur(10px);
        }
        .rpt-kpi-card:hover { border-color: rgba(255, 77, 94, 0.3); transform: translateY(-4px); background: rgba(255,255,255,0.03); }
        .rpt-kpi-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .rpt-kpi-icon {
          width: 48px; height: 48px; border-radius: 14px; font-size: 20px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .rpt-mini-chart { display: flex; align-items: flex-end; gap: 3px; height: 48px; opacity: 0.6; }
        .rpt-kpi-value { font-size: 24px; font-weight: 800; font-family: 'Space Mono', monospace; letter-spacing: -1px; margin-bottom: 6px; }
        .rpt-kpi-label { font-size: 13px; font-weight: 700; color: var(--text-dim); margin-bottom: 4px; }
        .rpt-kpi-sub { font-size: 11px; color: var(--text-dim); opacity: 0.7; }

        /* Two column */
        .rpt-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }

        /* Panel */
        .rpt-panel {
          padding: 24px; margin-bottom: 0;
        }
        .rpt-panel-header {
          font-size: 14px; font-weight: 800; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;
        }
        .rpt-count-badge {
          font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px;
        }

        /* Status list */
        .rpt-status-list { display: flex; flex-direction: column; gap: 18px; margin-bottom: 24px; }
        .rpt-status-row { display: flex; flex-direction: column; gap: 8px; }
        .rpt-status-info { display: flex; align-items: center; gap: 10px; }
        .rpt-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .rpt-status-name { font-size: 13px; font-weight: 700; color: var(--text-main); flex: 1; }
        .rpt-status-count { font-size: 11px; color: var(--text-dim); font-weight: 700; }
        .rpt-bar-wrap { display: flex; align-items: center; gap: 12px; }
        .rpt-bar-track {
          flex: 1; height: 6px; background: rgba(255,255,255,0.05);
          border-radius: 4px; overflow: hidden;
        }
        .rpt-bar-fill { height: 100%; border-radius: 4px; transition: width 0.8s ease; }
        .rpt-bar-pct { font-size: 12px; font-weight: 800; width: 36px; text-align: right; }

        /* Deposit/Withdraw compare */
        .rpt-dw-compare {
          border-top: 1px solid var(--border);
          padding-top: 20px; display: flex; flex-direction: column; gap: 12px;
        }
        .rpt-dw-row { display: flex; justify-content: space-between; align-items: center; }
        .rpt-divider { height: 1px; background: var(--border); opacity: 0.5; }

        /* Mini table */
        .rpt-mini-table { width: 100%; border-collapse: collapse; }
        .rpt-mini-table th {
          text-align: left; font-size: 10px; font-weight: 800;
          color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em;
          padding-bottom: 14px; border-bottom: 1px solid var(--border);
        }
        .rpt-mini-table td {
          padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.03);
          color: var(--text-dim); font-size: 13px;
        }
        .rpt-mini-table tr:last-child td { border-bottom: none; }

        .rpt-client-mini { display: flex; align-items: center; gap: 10px; }
        .rpt-mini-avatar {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(255, 77, 94, 0.08); border: 1px solid rgba(255, 77, 94, 0.2);
          color: var(--brand-primary); font-size: 13px; font-weight: 800;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .rpt-empty { color: var(--text-dim); font-size: 13px; text-align: center; padding: 32px; opacity: 0.6; font-style: italic; }
        
        .finance-actions { display: flex; gap: 8px; justify-content: flex-end; }
        .fin-action-btn {
          width: 30px; height: 30px; border-radius: 8px; border: none; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; font-size: 13px;
        }
        .fin-action-btn.approve { background: rgba(0,204,136,0.1); color: var(--success); border: 1px solid rgba(0,204,136,0.2); }
        .fin-action-btn.approve:hover { background: var(--success); color: #fff; }
        .fin-action-btn.reject { background: rgba(255,77,77,0.1); color: var(--danger); border: 1px solid rgba(255,77,77,0.2); }
        .fin-action-btn.reject:hover { background: var(--danger); color: #fff; }

        .adm-uid-badge {
          padding: 3px 8px; border-radius: 6px;
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          font-size: 11px; font-weight: 700; color: var(--text-dim); font-family: 'Space Mono', monospace;
        }
        .adm-mono { font-family: 'Space Mono', monospace; }
        .pos { color: var(--success) !important; font-weight: 700; }
        .neg { color: var(--danger) !important; font-weight: 700; }
        .cd-type-badge { padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
        .cd-type-badge.buy { background: rgba(0,204,136,0.1); color: var(--success); }
        .cd-type-badge.sell { background: rgba(255,77,77,0.1); color: var(--danger); }
        .cd-trade-status { padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
        .cd-trade-status.open { background: rgba(255, 77, 94, 0.08); color: var(--brand-primary); }
        .cd-trade-status.closed { background: rgba(255,255,255,0.05); color: var(--text-dim); }
      `}</style>
    </>
  );
};

export default Reports;
