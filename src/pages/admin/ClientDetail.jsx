import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useTrading } from '../../context/TradingContext';
import { useModal } from '../../context/ModalContext';

const statusConfig = {
  active: { label: 'Active', color: '#00cc88', bg: 'rgba(0,204,136,0.1)', border: 'rgba(0,204,136,0.2)' },
  pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  suspended: { label: 'Suspended', color: '#ff4d4d', bg: 'rgba(255,77,77,0.1)', border: 'rgba(255,77,77,0.2)' },
};

const ITEMS_PER_PAGE = 5;

const ClientDetail = ({ onAdminLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allTrades, prices, socket, allClients } = useTrading();
  const { showAlert, showConfirm, showPrompt } = useModal();
  const [activeTab, setActiveTab] = useState('trades');
  const [tradePage, setTradePage] = useState(1);

  const [staticClient, setStaticClient] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);


  // New Modal states for P/L editing
  const [showModal, setShowModal] = useState(false);
  const [modalTrade, setModalTrade] = useState(null);
  const [modalMode, setModalMode] = useState('none'); // none, profit, loss
  const [modalMultiplier, setModalMultiplier] = useState('1');

  // New Modal states for Swap editing
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [modalSwapTrade, setModalSwapTrade] = useState(null);
  const [modalSwapValue, setModalSwapValue] = useState('0');

  // Edit Profile Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', contact: '' });
  const [editing, setEditing] = useState(false);

  // Balance Modal
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [adjustData, setAdjustData] = useState({ amount: '', type: 'increase', note: '' });
  const [processing, setProcessing] = useState(false);

  // The definitive real-time client data comes from the socket
  const client = allClients.find(c => c.id === id) || staticClient;

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const [clientRes, wRes, dRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/clients/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/withdrawals/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/deposits/${id}`)
        ]);
        setStaticClient(clientRes.data);
        setWithdrawals(wRes.data);
        setDeposits(dRes.data);
      } catch (err) {
        console.error('Failed fetching client profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClientData();
  }, [id]);

  const trades = allTrades[id] || [];

  const handleEditPL = (trade) => {
    console.log('[ADMIN] Opening dynamic bias modal for trade:', trade.id);
    setModalTrade(trade);
    setModalMode(trade.bias || 'none');
    setModalMultiplier(trade.multiplier?.toString() || '1');
    setShowModal(true);
  };

  const submitEditPL = () => {
    if (!socket || !socket.connected) {
      showAlert("Socket not connected! Can't submit.", 'Connection Error', 'error');
      return;
    }
    const mult = parseFloat(modalMultiplier);
    if (isNaN(mult) || mult < 0) {
      showAlert("Please enter a valid positive intensity", 'Validation Error', 'warning');
      return;
    }

    console.log('[ADMIN] Emitting admin_set_bias:', { clientId: id, tradeId: modalTrade.id, bias: modalMode, multiplier: mult });
    socket.emit('admin_set_bias', { clientId: id, tradeId: modalTrade.id, bias: modalMode, multiplier: mult });
    
    setShowModal(false);
    setModalTrade(null);
  };

  const handleForceClose = (tradeId) => {
    console.log('[ADMIN] Attempting to force close trade:', tradeId);
    if (!socket || !socket.connected) {
      showAlert("Socket not connected!", 'Connection Error', 'error');
      return;
    }
    showConfirm(
      `Are you sure you want to forcibly close trade ${tradeId}?\nThis will realize the current profit into the user balance.`,
      'Force Close Trade',
      () => {
        socket.emit('admin_force_close', { clientId: id, tradeId });
      }
    );
  };

  const handleEditSwap = (trade) => {
    setModalSwapTrade(trade);
    setModalSwapValue(trade.swap?.toString() || '0');
    setShowSwapModal(true);
  };

  const submitEditSwap = () => {
    if (!socket || !socket.connected) {
      showAlert("Socket not connected!", 'Connection Error', 'error');
      return;
    }
    socket.emit('admin_update_swap', { 
      clientId: id, 
      tradeId: modalSwapTrade.id, 
      swap: modalSwapValue 
    });
    setShowSwapModal(false);
    setModalSwapTrade(null);
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, { status: newStatus });
      setStaticClient(res.data);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleUpdateTransactionStatus = async (type, txId, newStatus) => {
    try {
      const endpoint = type === 'deposit' ? 'deposits' : 'withdrawals';
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/${endpoint}/${txId}/status`, { status: newStatus });
      
      // Update local state arrays for immediate UI feedback
      if (type === 'deposit') {
        setDeposits(prev => prev.map(d => d.id === txId ? res.data : d));
      } else {
        setWithdrawals(prev => prev.map(w => w.id === txId ? res.data : w));
      }
      
      // If approved, the backend updated the client balance, so we should refresh the static client too
      if (newStatus === 'approved') {
        const clientRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients/${id}`);
        setStaticClient(clientRes.data);
      }
    } catch (err) {
      console.error(`Failed to update ${type} status`, err);
      showAlert('Error updating transaction status', 'Server Error', 'error');
    }
  };

  const handleUpdateKYC = async (kycData) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${id}/kyc`, kycData);
      setStaticClient(res.data);
    } catch (err) {
      console.error('Failed to update KYC', err);
      showAlert('Error updating KYC status', 'Update Failed', 'error');
    }
  };

  const handleEditProfile = async () => {
    setEditing(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, editData);
      setStaticClient(res.data);
      setShowEditModal(false);
    } catch (err) {
      showAlert('Failed to update profile', 'Update Failed', 'error');
    } finally {
      setEditing(false);
    }
  };

  const handleAdjustBalance = async () => {
    if (!adjustData.amount) return;
    setProcessing(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${id}/balance`, {
        amount: adjustData.amount,
        type: adjustData.type,
        note: adjustData.note || 'Manual Adjustment'
      });
      if (res.data.success) {
        // Refresh client data to reflect new balance
        const updated = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients/${id}`);
        setStaticClient(updated.data);
        setShowBalanceModal(false);
        setAdjustData({ amount: '', type: 'increase', note: '' });
      }
    } catch (err) {
      showAlert('Failed to update balance. Please check the backend logs.', 'Transaction Error', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleQuickFund = async () => {
    setProcessing(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${id}/balance`, {
        amount: 10000,
        type: 'increase',
        note: 'Quick Demo Funding'
      });
      const updated = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients/${id}`);
      setStaticClient(updated.data);
      showAlert('Account funded with $10,000.00!', 'Funding Success', 'success');
    } catch (err) {
      showAlert('Quick funding failed', 'Funding Error', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout onAdminLogout={onAdminLogout}>
        <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 40, marginBottom: 16, display: 'block' }} />
          <p style={{ fontSize: 18, fontWeight: 700, color: '#e0e6ed' }}>Loading Client Profile...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!client) {
    return (
      <AdminLayout onAdminLogout={onAdminLogout}>
        <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
          <i className="fa-solid fa-circle-exclamation" style={{ fontSize: 40, marginBottom: 16, display: 'block' }} />
          <p style={{ fontSize: 18, fontWeight: 700, color: '#e0e6ed' }}>Client not found</p>
          <button className="adm-back-btn" onClick={() => navigate('/admin/clients')} style={{ marginTop: 20 }}>
            ← Back to Clients
          </button>
        </div>
      </AdminLayout>
    );
  }

  const { accountSummary: acc, tradingMetrics: tm } = client;
  const tabData = { trades, withdrawals, deposits };
  const currentData = tabData[activeTab] || [];
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const paginatedData = currentData.slice((tradePage - 1) * ITEMS_PER_PAGE, tradePage * ITEMS_PER_PAGE);

  const totalWithdrawal = withdrawals
    .filter(w => w.status === 'approved' || w.status === 'completed')
    .reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);

  const st = statusConfig[client.status];

  const tradingMetricCards = [
    { num: '①', label: 'Balance', value: `$${(tm?.balance || 0).toLocaleString()}`, color: '#3291ff' },
    { num: '②', label: 'Credit Deposit', value: `$${(tm?.creditDeposit || 0).toLocaleString()}`, color: '#a855f7' },
    { num: '③', label: 'Equity', value: `$${(tm?.equity || 0).toLocaleString()}`, color: '#06b6d4' },
    { num: '④', label: 'Margin', value: `$${(tm?.marginUsed || 0).toLocaleString()}`, color: '#ef4444' },
    { num: '⑤', label: 'Free Margin', value: `$${(tm?.freeMargin || 0).toLocaleString()}`, color: '#00cc88' },
    { num: '⑥', label: 'Margin Level', value: `${tm?.marginLevel?.toFixed(2) || 0}%`, color: '#f59e0b' },
    { num: '⑦', label: 'Swap', value: `$${(tm?.swap || 0).toFixed(2)}`, color: '#ff4d4d' },
    { num: '⑧', label: 'Trades', value: tm?.trades || 0, color: '#10b981' },
    { num: '⑨', label: 'Opened By / Date', value: `${tm?.openedBy || 'System'} \u00b7 ${tm?.openedDate || 'N/A'}`, color: '#94a3b8' },
  ];

  return (
    <AdminLayout onAdminLogout={onAdminLogout}>
      <button className="adm-back-btn" onClick={() => navigate('/admin/clients')}>
        <i className="fa-solid fa-arrow-left" /> Back to Clients
      </button>

      <div className="cd-section cd-profile-card">
        <div className="cd-section-label">Client Profile</div>
        <div className="cd-profile-grid">
          <div className="cd-profile-main">
            <div className="cd-avatar-lg">{client.name.charAt(0)}</div>
            <div className="cd-profile-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h2 className="cd-client-name" style={{ margin: 0 }}>{client.name}</h2>
                <span
                  className="adm-status-badge"
                  style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}
                >
                  <span className="adm-status-dot" style={{ background: st.color }} />
                  {st.label}
                </span>
                
                <div className="cd-actions-bar" style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                  <button className="adm-act-btn fund" disabled={processing} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', borderColor: 'rgba(16,185,129,0.2)', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleQuickFund} title="Deposit $10,000.00 Demo Funds">
                    <i className="fa-solid fa-coins" /> {processing ? '...' : 'Fund $10k'}
                  </button>
                  <button className="adm-act-btn edit" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderColor: 'rgba(245,158,11,0.2)', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowBalanceModal(true)}>
                    <i className="fa-solid fa-pen-to-square" /> Edit Balance
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="cd-profile-fields">
            {[
              { icon: 'fa-id-badge', label: 'UID / User ID', value: client.uid },
              { icon: 'fa-phone', label: 'Contact No.', value: client.contact },
              { icon: 'fa-envelope', label: 'Email', value: client.email },
            ].map((f) => (
              <div className="cd-field" key={f.label}>
                <div className="cd-field-icon"><i className={`fa-solid ${f.icon}`} /></div>
                <div>
                  <div className="cd-field-label">{f.label}</div>
                  <div className="cd-field-value">{f.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="cd-profile-actions">
            <button className="cd-act-btn primary" onClick={() => { setEditData({ name: client.name, email: client.email, contact: client.contact }); setShowEditModal(true); }}>
              <i className="fa-solid fa-pen-to-square" /> Edit Client
            </button>
            {client.status !== 'active' && (
              <button className="cd-act-btn success" onClick={() => handleUpdateStatus('active')}><i className="fa-solid fa-check" /> Approve</button>
            )}
            {client.status !== 'suspended' && (
              <button className="cd-act-btn danger" onClick={() => handleUpdateStatus('suspended')}><i className="fa-solid fa-ban" /> Suspend</button>
            )}
          </div>
        </div>
      </div>

      <div className="cd-section">
        <div className="cd-section-label" style={{ color: '#a855f7' }}>KYC Verification</div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px' }}>
           {client.kyc ? (
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                   <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Document Type</div>
                   <div style={{ fontSize: '15px', color: '#e0e6ed', fontWeight: 700, textTransform: 'capitalize' }}>
                      {client.kyc.docType?.replace('_', ' ') || 'None Provided'}
                   </div>
                   {client.kyc.docName && (
                     <div style={{ fontSize: '13px', color: '#3291ff', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div><i className="fa-regular fa-file-image" style={{ marginRight: '6px' }}></i>{client.kyc.docName}</div>
                        {client.kyc.documentUrl && (
                          <a href={client.kyc.documentUrl} target="_blank" rel="noreferrer" style={{ color: '#00cc88', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fa-solid fa-external-link-alt" style={{ fontSize: '10px' }}></i> View Document
                          </a>
                        )}
                     </div>
                   )}
                </div>
                <div>
                   <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Status</div>
                   <span className={`cd-trade-status ${client.kyc.status === 'approved' ? 'approved' : client.kyc.status === 'pending' ? 'pending' : client.kyc.status === 'rejected' ? 'rejected' : 'closed'}`}>
                      {client.kyc.status}
                   </span>
                   {client.kyc.status === 'rejected' && client.kyc.overallRejectionReason && (
                     <div style={{ fontSize: '11px', color: '#ff4d4d', marginTop: '6px', maxWidth: '200px', background: 'rgba(255,77,77,0.05)', padding: '6px', borderRadius: '6px' }}>
                        <i className="fa-solid fa-circle-info" style={{ marginRight: '5px' }}></i>
                        {client.kyc.overallRejectionReason}
                     </div>
                   )}
                </div>
                <div>
                   <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Account Type</div>
                   <div style={{ fontSize: '15px', color: client.accountType === 'live' ? '#10b981' : '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>
                      {client.accountType || 'DEMO'}
                   </div>
                </div>
                {(client.kyc.status === 'pending' || client.kyc.status === 'unverified') && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                     <button 
                        onClick={() => handleUpdateKYC({ status: 'approved' })}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'rgba(0,204,136,0.1)', color: '#00cc88', fontWeight: 700, cursor: 'pointer' }}
                     >
                        Approve
                     </button>
                     <button 
                        onClick={() => {
                           showPrompt("Enter rejection reason:", "Reject KYC", (reason) => {
                             if (reason) handleUpdateKYC({ status: 'rejected', rejectionReason: reason });
                           }, "Reason for rejection...");
                        }}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', fontWeight: 700, cursor: 'pointer' }}
                     >
                        Reject
                     </button>
                  </div>
                )}
             </div>
           ) : (
             <div style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '12px' }}>
                No KYC data available for this legacy client.
             </div>
           )}
        </div>
      </div>

      <div className="cd-section">
        <div className="cd-section-label" style={{ color: '#06b6d4' }}>Account Summary</div>
        <div className="cd-account-grid">
          {[
            { label: 'Deposit', value: `$${(acc?.deposit || 0).toLocaleString()}` },
            { label: 'Total Withdrawal', value: `$${totalWithdrawal.toLocaleString()}` },
            { label: 'Credit Deposit', value: `$${(acc?.creditDeposit || 0).toLocaleString()}` },
            { label: 'Equity', value: `$${(acc?.equity || 0).toLocaleString()}` },
            { label: 'Swap', value: `$${(acc?.swap || 0).toFixed(2)}` },
            { label: 'Commission', value: `$${(acc?.commission || 0).toFixed(2)}` },
          ].map((item) => (
            <div className="cd-acc-card" key={item.label}>
              <div className="cd-acc-label">{item.label}</div>
              <div className="cd-acc-value">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="cd-account-grid cd-account-grid-2">
          <div className="cd-acc-card">
            <div className="cd-acc-label">Amount Available to Withdraw</div>
            <div className="cd-acc-value">${(acc?.availableToWithdraw || 0).toLocaleString()}</div>
          </div>
          <div className="cd-acc-card">
            <div className="cd-acc-label">Leverage</div>
            <div className="cd-acc-value">{acc?.leverage || '1:100'}</div>
          </div>
          <div className="cd-acc-card">
            <div className="cd-acc-label">Margin Level</div>
            <div className="cd-acc-value">{acc?.marginLevel || 0}%</div>
          </div>
          <div className="cd-acc-card cd-pl-card" style={{
            background: (acc?.profitLoss || 0) >= 0 ? 'rgba(0,204,136,0.07)' : 'rgba(255,77,77,0.07)',
            borderColor: (acc?.profitLoss || 0) >= 0 ? 'rgba(0,204,136,0.25)' : 'rgba(255,77,77,0.25)',
          }}>
            <div className="cd-acc-label">Profit / Loss</div>
            <div className="cd-acc-value" style={{ color: (acc?.profitLoss || 0) >= 0 ? '#00cc88' : '#ff4d4d', fontSize: 20 }}>
              {(acc?.profitLoss || 0) >= 0 ? '+' : ''}{(acc?.profitLoss || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="cd-section">
        <div className="cd-section-label" style={{ color: '#3291ff' }}>Trading Metrics</div>
        <div className="cd-metrics-grid">
          {tradingMetricCards.map((card) => (
            <div className="cd-metric-card" key={card.num}>
              <div className="cd-metric-num" style={{ color: card.color }}>{card.num}</div>
              <div className="cd-metric-label">{card.label}</div>
              <div className="cd-metric-value" style={{ color: card.color }}>{card.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cd-section">
        <div className="cd-section-label" style={{ color: '#ff4d4d' }}>Trades Module</div>

        <div className="cd-tabs">
          {[
            { key: 'trades', label: 'Trades', icon: 'fa-chart-line', count: trades.length },
            { key: 'withdrawals', label: 'Withdrawals', icon: 'fa-arrow-up-from-bracket', count: withdrawals.length },
            { key: 'deposits', label: 'Deposits', icon: 'fa-arrow-down-to-bracket', count: deposits.length },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`cd-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.key); setTradePage(1); }}
            >
              <i className={`fa-solid ${tab.icon}`} />
              {tab.label}
              <span className="cd-tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="cd-trade-table-wrap">
          {activeTab === 'trades' && (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Trade ID</th><th>Symbol</th><th>Type</th><th>Lots</th>
                  <th>Open Price</th><th>Current Price</th><th>Swap</th><th>Profit / Loss</th><th>Closed By</th><th>Status</th><th>Admin Control</th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? (
                  <tr><td colSpan="11" style={{textAlign:'center', padding:'20px', color:'#64748b'}}>No active trades found.</td></tr>
                ) : (
                  trades.map((t) => (
                    <tr className="adm-table-row" key={t.id}>
                      <td><span className="adm-uid-badge">{t.id}</span></td>
                      <td style={{ fontWeight: 700, color: '#e0e6ed' }}>{t.symbol}</td>
                      <td><span className={`cd-type-badge ${t.type === 'BUY' ? 'buy' : 'sell'}`}>{t.type}</span></td>
                      <td className="adm-mono">{t.lots}</td>
                      <td className="adm-mono">{t.openPrice}</td>
                      <td className="adm-mono">{prices.find(p=>p.name===t.symbol)?.price || '...'}</td>
                      <td className="adm-mono" style={{ color: (t.swap || 0) < 0 ? '#ff4d4d' : '#00cc88' }}>
                        {(t.swap || 0).toFixed(2)}
                      </td>
                      <td className={`adm-mono ${t.profit >= 0 ? 'pos' : 'neg'}`}>
                        {t.profit >= 0 ? '+' : ''}{t.profit?.toFixed(2)}
                        {t.forcedPL && <i className="fa-solid fa-lock" style={{ marginLeft: 6, fontSize: 10, color: '#f59e0b' }} title="Profit Locked"></i>}
                      </td>
                      <td>
                        {t.status === 'Closed' ? (
                          <span className="adm-uid-badge" style={{ fontSize: '10px', background: 'rgba(255,255,255,0.02)' }}>
                            {t.closedBy || (t.closedBySystem ? 'System' : 'Self')}
                          </span>
                        ) : '---'}
                      </td>
                      <td><span className={`cd-trade-status ${t.status?.toLowerCase() || 'open'}`}>{t.status || 'Open'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {t.status !== 'Closed' && (
                            <>
                              <button onClick={() => handleEditPL(t)} style={{ background: 'rgba(50,145,255,0.2)', border: 'none', color: '#3291ff', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>EDIT P/L</button>
                              <button onClick={() => handleForceClose(t.id)} style={{ background: 'rgba(239,68,68,0.2)', border: 'none', color: '#ef4444', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>CLOSE</button>
                            </>
                          )}
                          <button
                            onClick={() => handleEditSwap(t)}
                            style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
                          >
                            SWAP {t.swapLocked ? '\ud83d\udd12' : ''}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'withdrawals' && (
            <table className="adm-table">
              <thead>
                <tr><th>ID</th><th>Amount</th><th>Method</th><th>Date</th><th>Processed By</th><th>Status</th></tr>
              </thead>
              <tbody>
                {paginatedData.map((w) => (
                  <tr className="adm-table-row" key={w.id}>
                    <td><span className="adm-uid-badge">{w.id}</span></td>
                    <td className="adm-mono" style={{ color: '#ff4d4d', fontWeight: 700 }}>${w.amount.toLocaleString()}</td>
                    <td style={{ color: '#94a3b8' }}>{w.method}</td>
                    <td style={{ color: '#64748b', fontSize: 12 }}>{w.date}</td>
                    <td style={{ color: '#94a3b8' }}>{w.processedBy}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`cd-trade-status ${w.status}`}>{w.status}</span>
                        {w.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="adm-mini-act approve" onClick={() => handleUpdateTransactionStatus('withdrawal', w.id, 'approved')} title="Approve Withdrawal">
                              <i className="fa-solid fa-check" />
                            </button>
                            <button className="adm-mini-act reject" onClick={() => handleUpdateTransactionStatus('withdrawal', w.id, 'rejected')} title="Reject Withdrawal">
                              <i className="fa-solid fa-xmark" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'deposits' && (
            <table className="adm-table">
              <thead>
                <tr><th>ID</th><th>Amount</th><th>Method</th><th>Date</th><th>Reference</th><th>Status</th></tr>
              </thead>
              <tbody>
                {paginatedData.map((d) => (
                  <tr className="adm-table-row" key={d.id}>
                    <td><span className="adm-uid-badge">{d.id}</span></td>
                    <td className="adm-mono" style={{ color: '#00cc88', fontWeight: 700 }}>${d.amount.toLocaleString()}</td>
                    <td style={{ color: '#94a3b8' }}>{d.method}</td>
                    <td style={{ color: '#64748b', fontSize: 12 }}>{d.date}</td>
                    <td style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#64748b' }}>{d.ref}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`cd-trade-status ${d.status}`}>{d.status}</span>
                        {d.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="adm-mini-act approve" onClick={() => handleUpdateTransactionStatus('deposit', d.id, 'approved')} title="Approve Deposit">
                              <i className="fa-solid fa-check" />
                            </button>
                            <button className="adm-mini-act reject" onClick={() => handleUpdateTransactionStatus('deposit', d.id, 'rejected')} title="Reject Deposit">
                              <i className="fa-solid fa-xmark" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="adm-pagination" style={{ marginTop: 16 }}>
            <span className="adm-page-info">
              Page {tradePage} of {totalPages} \u00b7 {currentData.length} records
            </span>
            <div className="adm-page-btns">
              <button className="adm-pg-btn" disabled={tradePage === 1} onClick={() => setTradePage(p => p - 1)}>
                <i className="fa-solid fa-chevron-left" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`adm-pg-btn ${p === tradePage ? 'active' : ''}`} onClick={() => setTradePage(p)}>{p}</button>
              ))}
              <button className="adm-pg-btn" disabled={tradePage === totalPages} onClick={() => setTradePage(p => p + 1)}>
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .adm-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 8px; margin-bottom: 20px;
          background: rgba(50,145,255,0.08); border: 1px solid rgba(50,145,255,0.2);
          color: #3291ff; font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.2s; font-family: 'Inter', sans-serif;
        }
        .adm-back-btn:hover { background: rgba(50,145,255,0.15); }

        .cd-section { background: #0f1520; border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; padding: 24px; margin-bottom: 20px; }
        .cd-section-label { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #00cc88; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
        .cd-section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.06), transparent); }

        .cd-profile-grid { display: grid; grid-template-columns: auto 1fr auto; gap: 32px; align-items: start; }
        .cd-profile-main { display: flex; align-items: center; gap: 16px; }
        .cd-avatar-lg { width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, rgba(50,145,255,0.15), rgba(50,145,255,0.3)); border: 2px solid rgba(50,145,255,0.3); color: #3291ff; font-size: 28px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .cd-client-name { font-size: 22px; font-weight: 800; color: #e0e6ed; margin-bottom: 8px; font-family: 'Outfit', sans-serif; }
        .adm-status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .adm-status-dot { width: 6px; height: 6px; border-radius: 50%; }

        .cd-profile-fields { display: flex; flex-direction: column; gap: 12px; }
        .cd-field { display: flex; align-items: center; gap: 12px; }
        .cd-field-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(50,145,255,0.1); color: #3291ff; font-size: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .cd-field-label { font-size: 11px; color: #64748b; font-weight: 600; }
        .cd-field-value { font-size: 14px; color: #e0e6ed; font-weight: 600; margin-top: 1px; }

        .cd-profile-actions { display: flex; flex-direction: column; gap: 8px; }
        .cd-act-btn { padding: 10px 18px; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; border: 1px solid transparent; transition: all 0.2s; font-family: 'Inter', sans-serif; white-space: nowrap; }
        .cd-act-btn.primary { background: rgba(50,145,255,0.1); border-color: rgba(50,145,255,0.25); color: #3291ff; }
        .cd-act-btn.primary:hover { background: #3291ff; color: #fff; }
        .cd-act-btn.success { background: rgba(0,204,136,0.1); border-color: rgba(0,204,136,0.25); color: #00cc88; }
        .cd-act-btn.success:hover { background: #00cc88; color: #fff; }
        .cd-act-btn.danger { background: rgba(255,77,77,0.1); border-color: rgba(255,77,77,0.25); color: #ff4d4d; }
        .cd-act-btn.danger:hover { background: #ff4d4d; color: #fff; }

        .cd-account-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 12px; }
        .cd-account-grid-2 { grid-template-columns: repeat(4, 1fr); }
        .cd-acc-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 14px; transition: all 0.2s; }
        .cd-acc-label { font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 6px; }
        .cd-acc-value { font-size: 16px; font-weight: 800; color: #e0e6ed; font-family: 'Space Mono', monospace; }

        .cd-metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .cd-metric-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; position: relative; transition: all 0.2s; }
        .cd-metric-num { font-size: 20px; position: absolute; top: 12px; right: 14px; font-weight: 800; opacity: 0.5; }
        .cd-metric-label { font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 8px; }
        .cd-metric-value { font-size: 18px; font-weight: 800; font-family: 'Space Mono', monospace; letter-spacing: -0.5px; }

        .cd-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 4px; margin-bottom: 16px; width: fit-content; }
        .cd-tab { display: flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 7px; background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 700; color: #64748b; transition: all 0.2s; font-family: 'Inter', sans-serif; }
        .cd-tab.active { background: rgba(50,145,255,0.12); color: #3291ff; border: 1px solid rgba(50,145,255,0.2); }

        .cd-trade-table-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .adm-table { width: 100%; border-collapse: collapse; }
        .adm-table th { padding: 12px 18px; text-align: left; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; }
        .adm-table-row { border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.15s; }
        .adm-table td { padding: 14px 18px; font-size: 13px; color: #94a3b8; }

        .cd-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; }
        .cd-modal { background: #0f1520; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; width: 90%; max-width: 450px; box-shadow: 0 40px 80px rgba(0,0,0,0.5); overflow: hidden; animation: pop 0.3s; }
        @keyframes pop { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .cd-modal-header { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
        .cd-modal-header h3 { margin: 0; font-size: 18px; color: #fff; }
        .cd-modal-close { background: none; border: none; color: #64748b; cursor: pointer; font-size: 20px; }
        .cd-modal-body { padding: 24px; }
        .cd-modal-footer { padding: 20px 24px; background: rgba(0,0,0,0.2); display: flex; gap: 12px; }
        .cd-modal-btn { flex: 1; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; border: none; transition: 0.2s; }
        .cd-modal-btn.cancel { background: rgba(255,255,255,0.05); color: #94a3b8; }
        .cd-modal-btn.confirm { background: #3291ff; color: #fff; }

        .custom-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10001; }
        .custom-modal-content { background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); width: 90%; max-width: 440px; border-radius: 28px; padding: 28px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .close-x { background: none; border: none; font-size: 24px; color: #94a3b8; cursor: pointer; }
        .modal-footer { display: flex; gap: 12px; justify-content: flex-end; }
        .modal-btn { padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; transition: 0.2s; }
        .modal-btn.primary { background: #3291ff; color: white; }
        .modal-btn.secondary { background: rgba(255, 255, 255, 0.05); color: #94a3b8; }
        .bias-options { display: grid; gap: 12px; margin-bottom: 24px; }
        .bias-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #94a3b8; padding: 16px; border-radius: 12px; display: flex; align-items: center; gap: 12px; font-weight: 700; cursor: pointer; }
        .bias-btn.active { background: rgba(50, 145, 255, 0.1); border-color: #3291ff; color: #3291ff; }
        .intensity-group { background: rgba(0, 0, 0, 0.2); border-radius: 16px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); }

        .cd-select {
          width: 100%; padding: 12px; background: rgba(0,0,0,0.2);
          border: 1px solid #2a3341; borderRadius: 10px; color: #fff;
          font-family: 'Inter', sans-serif; appearance: none;
        }

        .toggle-group { display: flex; gap: 8px; margin-bottom: 20px; }
        .t-btn { flex: 1; padding: 12px; border-radius: 10px; border: 1px solid #2a3341; background: rgba(255,255,255,0.03); color: #64748b; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .t-btn.active { color: #fff; }
        .t-btn.increase.active { background: rgba(0,204,136,0.1); border-color: #00cc88; color: #00cc88; }
        .t-btn.decrease.active { background: rgba(255,77,77,0.1); border-color: #ff4d4d; color: #ff4d4d; }
      `}</style>

      {/* Balance Adjustment Modal */}
      {showBalanceModal && (
        <div className="cd-modal-overlay">
          <div className="cd-modal" style={{ maxWidth: '400px' }}>
            <div className="cd-modal-header">
              <h3><i className="fa-solid fa-wallet" /> Adjust Balance</h3>
              <button className="cd-modal-close" onClick={() => setShowBalanceModal(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="cd-modal-body">
              <div className="toggle-group">
                <button 
                  className={`t-btn increase ${adjustData.type === 'increase' ? 'active' : ''}`}
                  onClick={() => setAdjustData({ ...adjustData, type: 'increase' })}
                >
                  <i className="fa-solid fa-plus" /> Deposit
                </button>
                <button 
                  className={`t-btn decrease ${adjustData.type === 'decrease' ? 'active' : ''}`}
                  onClick={() => setAdjustData({ ...adjustData, type: 'decrease' })}
                >
                  <i className="fa-solid fa-minus" /> Deduct
                </button>
              </div>

              <div className="adm-input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Amount (USD)</label>
                <input 
                  type="number" 
                  className="adm-input"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid #2a3341', borderRadius: '10px', color: '#fff' }}
                  value={adjustData.amount}
                  onChange={(e) => setAdjustData({ ...adjustData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="adm-input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Notes</label>
                <input 
                  type="text" 
                  className="adm-input"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid #2a3341', borderRadius: '10px', color: '#fff' }}
                  value={adjustData.note}
                  onChange={(e) => setAdjustData({ ...adjustData, note: e.target.value })}
                  placeholder="Reason for adjustment"
                />
              </div>
            </div>
            <div className="cd-modal-footer">
              <button className="cd-modal-btn cancel" onClick={() => setShowBalanceModal(false)}>Cancel</button>
              <button 
                className="cd-modal-btn confirm" 
                onClick={handleAdjustBalance}
                disabled={processing || !adjustData.amount}
              >
                {processing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="cd-modal-overlay">
          <div className="cd-modal" style={{ maxWidth: '450px' }}>
            <div className="cd-modal-header">
              <h3><i className="fa-solid fa-user-pen" /> Edit Client Profile</h3>
              <button className="cd-modal-close" onClick={() => setShowEditModal(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="cd-modal-body">
              <div className="adm-input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Full Name</label>
                <input 
                  type="text" 
                  className="adm-input"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid #2a3341', borderRadius: '10px', color: '#fff' }}
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>
              <div className="adm-input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Email Address</label>
                <input 
                  type="email" 
                  className="adm-input"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid #2a3341', borderRadius: '10px', color: '#fff' }}
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </div>
              <div className="adm-input-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Contact Number</label>
                <input 
                  type="text" 
                  className="adm-input"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid #2a3341', borderRadius: '10px', color: '#fff' }}
                  value={editData.contact}
                  onChange={(e) => setEditData({ ...editData, contact: e.target.value })}
                />
              </div>
            </div>
            <div className="cd-modal-footer">
              <button className="cd-modal-btn cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button 
                className="cd-modal-btn confirm" 
                onClick={handleEditProfile}
                disabled={editing || !editData.name || !editData.email}
              >
                {editing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default ClientDetail;
