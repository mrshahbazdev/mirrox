import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useTrading } from '../../context/TradingContext';
import { useModal } from '../../context/ModalContext';

const statusConfig = {
  active: { label: 'Active', color: 'var(--success)', bg: 'rgba(0,204,136,0.1)', border: 'rgba(0,204,136,0.2)' },
  pending: { label: 'Pending', color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  suspended: { label: 'Suspended', color: 'var(--danger)', bg: 'rgba(255,77,77,0.1)', border: 'rgba(255,77,77,0.2)' },
};

const ITEMS_PER_PAGE = 5;

const ClientDetail = ({ onAdminLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allTrades, prices, socket, allClients } = useTrading();
  const { showAlert, showConfirm, showPrompt } = useModal();
  
  const adminToken = localStorage.getItem('bullvera_admin_token');
  const authHeader = { headers: { Authorization: `Bearer ${adminToken}` } };

  const [activeTab, setActiveTab] = useState('trades');
  const [tradePage, setTradePage] = useState(1);

  const [staticClient, setStaticClient] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyTrades, setHistoryTrades] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [otherAdmins, setOtherAdmins] = useState([]);

  useEffect(() => {
    const socket = window.socket;
    if (socket) {
      socket.emit('admin:presence', { page: window.location.pathname });
      socket.on('admin:presence_update', (list) => {
        // Filter to only show admins on THIS page, excluding self
        const currentPath = window.location.pathname;
        const others = list.filter(a => a.page === currentPath && a.socketId !== socket.id);
        setOtherAdmins(others);
      });
    }
    return () => {
      if (socket) socket.off('admin:presence_update');
    };
  }, [id]);

  // New Modal states for P/L editing
  const [showModal, setShowModal] = useState(false);
  const [modalTrade, setModalTrade] = useState(null);
  const [modalMode, setModalMode] = useState('none'); // none, profit, loss, lock
  const [modalMultiplier, setModalMultiplier] = useState('1');
  const [modalForcedPL, setModalForcedPL] = useState('0');

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

  // New Modal states for Limit (Selected Price)
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [modalLimitTrade, setModalLimitTrade] = useState(null);
  const [modalLimitValue, setModalLimitValue] = useState('');

  // The definitive real-time client data comes from the socket
  const client = allClients.find(c => c.id === id) || staticClient;

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const [clientRes, wRes, dRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, authHeader),
          axios.get(`${import.meta.env.VITE_API_URL}/api/withdrawals/${id}`, authHeader),
          axios.get(`${import.meta.env.VITE_API_URL}/api/deposits/${id}`, authHeader)
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

  // Fetch History Trades when History tab is selected
  useEffect(() => {
    if (activeTab === 'history' && id) {
      const fetchHistory = async () => {
        try {
          setLoadingHistory(true);
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/trades/${id}/history`, authHeader);
          setHistoryTrades(res.data);
        } catch (err) {
          console.error('Failed to fetch trade history', err);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [activeTab, id]);

  const trades = allTrades[id] || [];

  const handleEditPL = (trade) => {
    console.log('[ADMIN] Opening dynamic bias modal for trade:', trade.id);
    setModalTrade(trade);
    setModalMode(trade.bias || 'none');
    setModalMultiplier(trade.multiplier?.toString() || '1');
    setShowModal(true);
  };

  const submitEditPL = () => {
    if (modalMode === 'lock') {
      const forced = parseFloat(modalForcedPL);
      if (isNaN(forced)) {
        showAlert("Please enter a valid amount", 'Validation Error', 'warning');
        return;
      }
      console.log('[ADMIN] Emitting admin_set_pl:', { clientId: id, tradeId: modalTrade.id, forcedProfit: forced });
      socket.emit('admin_set_pl', { clientId: id, tradeId: modalTrade.id, forcedProfit: forced });
    } else {
      const mult = parseFloat(modalMultiplier);
      if (isNaN(mult) || mult < 0) {
        showAlert("Please enter a valid positive intensity", 'Validation Error', 'warning');
        return;
      }
      console.log('[ADMIN] Emitting admin_set_bias:', { clientId: id, tradeId: modalTrade.id, bias: modalMode, multiplier: mult });
      socket.emit('admin_set_bias', { clientId: id, tradeId: modalTrade.id, bias: modalMode, multiplier: mult });
    }
    
    setShowModal(false);
    setModalTrade(null);
  };

  const handleForceClose = async (tradeId) => {
    console.log('[ADMIN] Attempting to force close trade:', tradeId);
    if (!socket || !socket.connected) {
      showAlert("Socket not connected!", 'Connection Error', 'error');
      return;
    }
    
    const confirmed = await showConfirm(
      `Are you sure you want to forcibly close trade ${tradeId}?\nThis will realize the current profit into the user balance.`,
      'Force Close Trade'
    );

    if (confirmed) {
      socket.emit('admin_force_close', { clientId: id, tradeId });
    }
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

  const handleEditLimit = (trade) => {
    setModalLimitTrade(trade);
    setModalLimitValue(trade.selectedPrice?.toString() || '');
    setShowLimitModal(true);
  };

  const submitEditLimit = () => {
    if (!socket || !socket.connected) {
      showAlert("Socket not connected!", "Connection Error", "error");
      return;
    }
    socket.emit('admin_set_selected_price', {
      clientId: id,
      tradeId: modalLimitTrade.id,
      selectedPrice: modalLimitValue
    });
    setShowLimitModal(false);
    setModalLimitTrade(null);
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, { status: newStatus }, authHeader);
      setStaticClient(res.data);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleUpdateTransactionStatus = async (type, txId, newStatus) => {
    try {
      let reason = null;
      if (newStatus === 'rejected') {
        reason = await showPrompt(`Please enter a reason for rejecting this ${type}:`, `Reject ${type.charAt(0).toUpperCase() + type.slice(1)}`);
        if (reason === null) return; // Cancelled
      }

      const endpoint = type === 'deposit' ? 'deposits' : 'withdrawals';
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/${endpoint}/${txId}/status`, { 
        status: newStatus,
        reason: reason
      }, authHeader);
      
      // Update local state arrays for immediate UI feedback
      if (type === 'deposit') {
        setDeposits(prev => prev.map(d => d.id === txId ? res.data : d));
      } else {
        setWithdrawals(prev => prev.map(w => w.id === txId ? res.data : w));
      }
      
      showAlert(`${type.charAt(0).toUpperCase() + type.slice(1)} ${newStatus} successfully`, 'Success', 'success');

      // If approved, the backend updated the client balance, so we should refresh the static client too
      if (newStatus === 'approved') {
        const clientRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, authHeader);
        setStaticClient(clientRes.data);
      }
    } catch (err) {
      console.error(`Failed to update ${type} status`, err);
      showAlert('Error updating transaction status', 'Server Error', 'error');
    }
  };

  const handleReviewKYC = async (category, action, reason = null) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${id}/kyc/review`, {
        category,
        action,
        rejectionReason: reason
      }, authHeader);
      
      // Update local state to show change instantly
      setStaticClient(prev => ({
        ...prev,
        kyc: res.data.kyc,
        accountType: res.data.kyc.status === 'verified' ? 'live' : (prev ? prev.accountType : 'demo')
      }));
      
      showAlert(`Document ${action === 'approve' ? 'approved' : 'rejected'} successfully`, 'KYC Updated', 'success');
    } catch (err) {
      console.error('Failed to review KYC', err);
      showAlert('Error updating KYC document status', 'Update Failed', 'error');
    }
  };

  const handleUpdateKYC = async (kycData) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${id}/kyc`, kycData, authHeader);
      setStaticClient(res.data);
    } catch (err) {
      console.error('Failed to update KYC', err);
      showAlert('Error updating KYC status', 'Update Failed', 'error');
    }
  };

  const handleResetPin = async () => {
    const newPin = await showPrompt("Enter new 4-digit PIN for client:", "Reset Withdrawal PIN", "e.g. 1234");
    if (!newPin) return; // Cancelled
    
    if (newPin.length !== 4) return showAlert("PIN must be 4 digits", "Error", "error");
    
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${id}/pin`, { pin: newPin }, authHeader);
      showAlert("Withdrawal PIN updated successfully", "Success", "success");
    } catch (err) {
      showAlert("Failed to reset PIN", "Error", "error");
    }
  };

  const handleEditProfile = async () => {
    setEditing(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, editData, authHeader);
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
      }, authHeader);
      if (res.data.success) {
        // Refresh client data to reflect new balance
        const updated = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, authHeader);
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
      }, authHeader);
      const updated = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, authHeader);
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

  // Optimized Trades List with Merged History
  const tradesList = (() => {
    const activeForClient = allTrades[id] || [];
    if (activeTab === 'trades') {
      return activeForClient.filter(t => t.status !== 'Closed');
    }
    if (activeTab === 'history') {
      const closedFromMemory = activeForClient.filter(t => t.status === 'Closed');
      const combined = [...closedFromMemory, ...historyTrades];
      // Deduplicate by ID
      return Array.from(new Map(combined.map(item => [item.id, item])).values())
        .sort((a, b) => (new Date(b.closeTime || 0)) - (new Date(a.closeTime || 0)));
    }
    return [];
  })();

  const tabData = { 
    trades: tradesList, 
    history: tradesList,
    withdrawals, 
    deposits 
  };
  const currentData = tabData[activeTab] || [];
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const paginatedData = currentData.slice((tradePage - 1) * ITEMS_PER_PAGE, tradePage * ITEMS_PER_PAGE);

  const totalWithdrawal = withdrawals
    .filter(w => w.status === 'approved' || w.status === 'completed')
    .reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);

  const st = statusConfig[client.status];

  const tradingMetricCards = [
    { num: '①', label: 'Balance', value: `$${(tm?.balance || 0).toLocaleString()}`, color: 'var(--brand-primary)', icon: 'wallet' },
    { num: '②', label: 'Equity', value: `$${(tm?.equity || 0).toLocaleString()}`, color: 'var(--info)', icon: 'chart-pie' },
    { num: '③', label: 'Credit Deposit', value: `$${(tm?.creditDeposit || 0).toLocaleString()}`, color: 'var(--success)', icon: 'money-bill-trend-up' },
    { num: '④', label: 'Margin Level', value: `${tm?.marginLevel?.toFixed(2) || 0}%`, color: 'var(--warning)', icon: 'gauge-high' },
    { num: '⑤', label: 'Margin Used', value: `$${(tm?.marginUsed || 0).toLocaleString()}`, color: 'var(--danger)', icon: 'lock' },
    { num: '⑥', label: 'Free Margin', value: `$${(tm?.freeMargin || 0).toLocaleString()}`, color: 'var(--success)', icon: 'unlock' },
    { num: '⑦', label: 'Swap', value: `$${(tm?.swap || 0).toFixed(2)}`, color: 'var(--brand-primary)', icon: 'arrows-spin' },
    { num: '⑧', label: 'Trades', value: tm?.trades || 0, color: 'var(--text-main)', icon: 'briefcase' },
    { num: '⑨', label: 'Started', value: `${tm?.openedDate || 'N/A'}`, color: 'var(--text-dim)', icon: 'calendar-day' },
  ];

  return (
    <AdminLayout onAdminLogout={onAdminLogout}>
      <div className="client-detail-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="back-btn" onClick={() => navigate('/admin/clients')}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h1>{client.name}</h1>
            <p className="uid-tag">UID: {client.id} • Registered {new Date(client.registeredAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        {/* Admin Presence Indicator */}
        {otherAdmins.length > 0 && (
          <div className="presence-indicator">
             <span>Currently viewing:</span>
             <div className="presence-avatars">
                {otherAdmins.map(adm => (
                   <div key={adm.id} className="presence-badge" title={`${adm.name} (${adm.role})`}>
                      {adm.name.charAt(0)}
                   </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Admin Sticky Note (Internal Only) */}
      <div className="sticky-note-card">
        <div className="sticky-label">
          <i className="fa-solid fa-note-sticky" />
          Sovereign Internal Memo
        </div>
        <textarea 
          className="sticky-textarea"
          placeholder="Type an internal note about this client here... (Admins only)"
          defaultValue={client.adminNote || ''}
          onBlur={async (e) => {
            const note = e.target.value;
            if (note === (client.adminNote || '')) return;
            try {
              const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, { adminNote: note }, authHeader);
              setStaticClient(res.data);
              // Show a temporary "Saved" indicator if needed, but the UI is clean
            } catch (err) {
              console.error('Failed to save admin note');
            }
          }}
        />
        <div className="note-status-indicator">
          <i className="fa-solid fa-lock" /> CONFIDENTIAL STAFF ACCESS
        </div>
      </div>

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
                  <button className="cd-act-btn success" disabled={processing} onClick={handleQuickFund} title="Deposit $10,000.00 Demo Funds">
                    <i className="fa-solid fa-coins" /> {processing ? '...' : 'Fund $10k'}
                  </button>
                  <button className="cd-act-btn primary" style={{ opacity: 0.8 }} onClick={() => setShowBalanceModal(true)}>
                    <i className="fa-solid fa-pen-to-square" /> Edit Balance
                  </button>
                  <button className="cd-act-btn primary" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', borderColor: 'rgba(168,85,247,0.2)' }} onClick={handleResetPin}>
                    <i className="fa-solid fa-key" /> Reset PIN
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
        <div className="cd-section-label">Verification Center (KYC Documents)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '8px' }}>
          
          {[
            { id: 'poi', label: 'Proof of Identity', data: client?.kyc?.poi },
            { id: 'por', label: 'Proof of Residence', data: client?.kyc?.por },
            { id: 'selfie', label: 'Selfie with ID', data: client?.kyc?.selfie },
          ].map((item) => (
            <div key={item.id} className="adm-kyc-card" style={{ padding: '24px', borderRadius: '20px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{item.label}</div>
                  <span className={`cd-trade-status ${item.data?.status || 'none'}`}>
                     {item.data?.status || 'Not Submitted'}
                  </span>
               </div>

               {item.data?.url ? (
                 <>
                    <div style={{ background: '#000', height: '200px', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px', border: '1px solid var(--border)', position: 'relative' }}>
                       <img src={item.data.url} alt={item.id} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                       <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                          <a href={item.data.url} target="_blank" rel="noreferrer" className="adm-mini-act" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
                             <i className="fa-solid fa-expand" />
                          </a>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                       {(item.data.status === 'pending' || item.data.status === 'rejected') && (
                         <button onClick={() => handleReviewKYC(item.id, 'approve')} className="cd-act-btn success" style={{ padding: '8px', fontSize: '11px', flex: 1 }}>
                            <i className="fa-solid fa-check" /> Approve
                         </button>
                       )}
                       {(item.data.status === 'pending' || item.data.status === 'approved') && (
                         <button onClick={async () => {
                            const reason = await showPrompt("Enter rejection reason:", `Reject ${item.label}`, "Incomplete or blurry...");
                            if (reason) handleReviewKYC(item.id, 'reject', reason);
                         }} className="cd-act-btn danger" style={{ padding: '8px', fontSize: '11px', flex: 1 }}>
                            <i className="fa-solid fa-xmark" /> Reject
                         </button>
                       )}
                    </div>
                    {item.data.rejectionReason && (
                       <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--danger)', padding: '10px', background: 'rgba(255,77,77,0.05)', borderRadius: '10px', borderLeft: '3px solid var(--danger)' }}>
                          <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }} /> {item.data.rejectionReason}
                       </div>
                    )}
                 </>
               ) : (
                 <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '12px', border: '2px dashed var(--border)', borderRadius: '14px', gap: '12px' }}>
                    <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '24px', opacity: 0.3 }} />
                    Waiting for submission
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>

      <div className="cd-section">
        <div className="cd-section-label">Account Metrics & Trading Power</div>
        <div className="cd-account-grid">
           {[
            { label: 'Total Deposit', value: `$${(acc?.deposit || 0).toLocaleString()}`, color: 'var(--success)' },
            { label: 'Total Withdrawn', value: `$${totalWithdrawal.toLocaleString()}`, color: 'var(--danger)' },
            { label: 'Available Funds', value: `$${(acc?.availableToWithdraw || 0).toLocaleString()}`, color: 'var(--info)' },
           ].map(item => (
            <div className="cd-acc-card" key={item.label}>
              <div className="cd-acc-label">{item.label}</div>
              <div className="cd-acc-value" style={{ color: item.color }}>{item.value}</div>
            </div>
           ))}
           <div className="cd-acc-card" style={{ borderColor: (acc?.profitLoss || 0) >= 0 ? 'var(--success)' : 'var(--danger)', background: (acc?.profitLoss || 0) >= 0 ? 'rgba(0,204,136,0.05)' : 'rgba(255,77,77,0.05)' }}>
              <div className="cd-acc-label">P/L Performance</div>
              <div className="cd-acc-value" style={{ color: (acc?.profitLoss || 0) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                {(acc?.profitLoss || 0) >= 0 ? '+' : ''}{(acc?.profitLoss || 0).toLocaleString()}
              </div>
           </div>
           <div className="cd-acc-card">
              <div className="cd-acc-label">Active Power</div>
              <div className="cd-acc-value">{acc?.leverage || '1:100'}</div>
           </div>
           <div className="cd-acc-card">
              <div className="cd-acc-label">Margin Health</div>
              <div className="cd-acc-value" style={{ color: (acc?.marginLevel || 0) < 100 ? 'var(--danger)' : 'var(--success)' }}>{acc?.marginLevel || 0}%</div>
           </div>
        </div>

        <div className="cd-metrics-grid">
          {tradingMetricCards.map((card) => (
            <div className="cd-metric-card" key={card.label}>
              <div className="cd-metric-num">{card.num}</div>
              <div className="cd-metric-icon"><i className={`fa-solid fa-${card.icon}`} style={{ color: card.color }} /></div>
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
            { key: 'trades', label: 'Trades', icon: 'fa-chart-line', count: (allTrades[id] || []).filter(t => t.status !== 'Closed').length },
            { key: 'history', label: 'History', icon: 'fa-clock-rotate-left', count: (allTrades[id] || []).filter(t => t.status === 'Closed').length + historyTrades.length },
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
          {(activeTab === 'trades' || activeTab === 'history') && (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Trade ID</th><th>Symbol</th><th>Type</th><th>Lots</th>
                  <th>Open Price</th><th>Current Price</th><th>Target / Close Price</th><th>Swap</th><th>Profit / Loss</th><th>Closed By</th><th>Status</th><th>Admin Control</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr><td colSpan="12" style={{textAlign:'center', padding:'20px', color:'#64748b'}}>No records found in this category.</td></tr>
                ) : (
                  paginatedData.map((t) => (
                    <tr className="adm-table-row" key={t.id}>
                      <td><span className="adm-uid-badge">{t.id}</span></td>
                      <td style={{ fontWeight: 700, color: '#e0e6ed' }}>{t.symbol}</td>
                      <td><span className={`cd-type-badge ${t.type === 'BUY' ? 'buy' : 'sell'}`}>{t.type}</span></td>
                      <td className="adm-mono">{t.lots}</td>
                      <td className="adm-mono">{t.openPrice}</td>
                      <td className="adm-mono">{prices.find(p=>p.symbol===t.symbol)?.price || '...'}</td>
                      <td className="adm-mono" style={{ color: (t.status === 'Closed' || t.selectedPrice) ? '#FF4D5E' : '#64748b' }}>
                        {(() => {
                           const precision = prices.find(p=>p.symbol===t.symbol)?.precision || 2;
                           if (t.status === 'Closed') {
                              return t.closePrice ? parseFloat(t.closePrice).toFixed(precision) : '---';
                           }
                           return t.selectedPrice ? parseFloat(t.selectedPrice).toFixed(precision) : '---';
                        })()}
                      </td>
                      <td className="adm-mono" style={{ color: (t.swap || 0) < 0 ? '#ff4d4d' : '#00cc88' }}>
                        {(t.swap || 0).toFixed(2)}
                      </td>
                      <td className={`adm-mono ${t.profit >= 0 ? 'pos' : 'neg'}`}>
                        {t.profit >= 0 ? '+' : ''}{t.profit?.toFixed(2)}
                        {t.bias === 'lock' && <i className="fa-solid fa-lock" style={{ marginLeft: 6, fontSize: 10, color: '#f59e0b' }} title="Profit Locked"></i>}
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
                              <button onClick={() => handleEditPL(t)} className="adm-mini-act" style={{ color: 'var(--brand-primary)', borderColor: 'rgba(255, 77, 94, 0.3)', width: 'auto', padding: '0 12px', fontSize: '10px' }}>EDIT P/L</button>
                              <button onClick={() => handleForceClose(t.id)} className="adm-mini-act reject" style={{ width: 'auto', padding: '0 12px', fontSize: '10px' }}>CLOSE</button>
                              <button onClick={() => handleEditLimit(t)} className="adm-mini-act" style={{ color: 'var(--info)', borderColor: 'rgba(6, 182, 212, 0.3)', width: 'auto', padding: '0 12px', fontSize: '10px' }}>SEL PRICE</button>
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

      {/* Limit / Selected Price Modal */}
      {showLimitModal && (
        <div className="cd-modal-overlay">
          <div className="cd-modal" style={{ maxWidth: '400px' }}>
            <div className="cd-modal-header">
              <h3><i className="fa-solid fa-crosshairs" /> Set Limit Price</h3>
              <button className="cd-modal-close" onClick={() => setShowLimitModal(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="cd-modal-body">
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>
                Set a target market price. The trade will automatically close when this price is reached. 
                Leave empty to clear the limit.
              </p>
              
              <div className="adm-input-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Target Market Price ({modalLimitTrade?.symbol})
                </label>
                <input 
                  type="number" 
                  step="0.00001"
                  className="adm-input"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid #2a3341', borderRadius: '10px', color: '#fff' }}
                  value={modalLimitValue}
                  onChange={(e) => setModalLimitValue(e.target.value)}
                  placeholder="e.g. 1.09450"
                  autoFocus
                />
              </div>
            </div>
            <div className="cd-modal-footer">
              <button className="cd-modal-btn cancel" onClick={() => setShowLimitModal(false)}>Cancel</button>
              <button 
                className="cd-modal-btn confirm" 
                onClick={submitEditLimit}
              >
                Save Target
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        :root {
          --brand-primary: #FF4D5E;
          --bg-deep: #0a0f18;
          --bg-card: rgba(15, 23, 42, 0.6);
          --border: rgba(255, 255, 255, 0.08);
          --text-main: #e2e8f0;
          --text-dim: #94a3b8;
          --success: #00cc88;
          --warning: #f59e0b;
          --danger: #ff4d4d;
          --info: #06b6d4;
          --card-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .client-detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 0 4px; }
        .client-detail-header h1 { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800; color: #fff; margin: 0; }
        .uid-tag { font-size: 13px; color: var(--text-dim); margin-top: 4px; }
        .back-btn { width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-main); cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .back-btn:hover { background: var(--brand-primary); color: #fff; border-color: var(--brand-primary); }

        .presence-indicator { display: flex; align-items: center; gap: 12px; background: rgba(0, 204, 136, 0.05); padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(0, 204, 136, 0.2); }
        .presence-indicator span { font-size: 10px; font-weight: 800; color: var(--success); letter-spacing: 0.5px; }
        .presence-avatars { display: flex; margin-left: -4px; }
        .presence-badge { width: 24px; height: 24px; border-radius: 50%; background: var(--success); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; border: 2px solid var(--bg-deep); margin-left: -6px; pointer-events: auto; }

        .sticky-note-card { background: rgba(255, 77, 94, 0.03); border: 1px solid rgba(255, 77, 94, 0.1); border-radius: 16px; padding: 16px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 12px; }
        .sticky-label { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 900; color: var(--brand-primary); letter-spacing: 1px; }
        .sticky-textarea { background: transparent; border: none; font-size: 14px; color: var(--text-main); line-height: 1.6; min-height: 60px; resize: vertical; font-family: 'Inter', sans-serif; outline: none; }
        .note-status-indicator { font-size: 9px; font-weight: 800; color: var(--text-dim); display: flex; align-items: center; gap: 6px; }

        .cd-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 24px; margin-bottom: 24px; backdrop-filter: blur(10px); }
        .cd-section-label { font-size: 10px; font-weight: 900; letter-spacing: 1.5px; color: var(--brand-primary); text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
        .cd-section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }

        .cd-profile-grid { display: grid; grid-template-columns: 1fr auto auto; gap: 40px; align-items: start; }
        .cd-avatar-lg { width: 80px; height: 80px; border-radius: 24px; background: linear-gradient(135deg, rgba(255, 77, 94, 0.1), rgba(255, 77, 94, 0.2)); border: 2px solid var(--brand-primary); color: var(--brand-primary); font-size: 36px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(255, 77, 94, 0.2); }
        
        .adm-status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 30px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
        .adm-status-dot { width: 6px; height: 6px; border-radius: 50%; }

        .cd-profile-fields { display: grid; gap: 16px; }
        .cd-field { display: flex; align-items: center; gap: 16px; background: rgba(0,0,0,0.15); padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.03); }
        .cd-field-icon { width: 36px; height: 36px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-card); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .cd-field-label { font-size: 10px; font-weight: 800; color: var(--text-dim); text-transform: uppercase; }
        .cd-field-value { font-size: 14px; font-weight: 700; color: #fff; margin-top: 2px; }

        .cd-profile-actions { display: flex; flex-direction: column; gap: 10px; }
        .cd-act-btn { width: 100%; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; border: 1px solid transparent; transition: all 0.2s; font-family: 'Inter', sans-serif; }
        .cd-act-btn.primary { background: var(--brand-primary); color: #fff; box-shadow: 0 4px 12px rgba(255, 77, 94, 0.3); }
        .cd-act-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(255, 77, 94, 0.4); }
        .cd-act-btn.success { background: rgba(0, 204, 136, 0.1); color: var(--success); border-color: rgba(0, 204, 136, 0.2); }
        .cd-act-btn.success:hover { background: var(--success); color: #fff; }
        .cd-act-btn.danger { background: rgba(255, 77, 77, 0.1); color: var(--danger); border-color: rgba(255, 77, 77, 0.2); }
        .cd-act-btn.danger:hover { background: var(--danger); color: #fff; }

        .adm-kyc-card { background: rgba(0,0,0,0.2) !important; border: 2px solid var(--border) !important; transition: all 0.2s; }
        .adm-kyc-card:hover { border-color: var(--brand-primary) !important; transform: translateY(-2px); }
        .adm-mini-act { transition: all 0.2s; }
        .adm-mini-act:hover { transform: scale(1.02); }

        .cd-account-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px; }
        .cd-acc-card { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: all 0.2s; }
        .cd-acc-card:hover { background: rgba(255,255,255,0.04); transform: translateY(-4px); }
        .cd-acc-label { font-size: 10px; font-weight: 800; color: var(--text-dim); text-transform: uppercase; margin-bottom: 8px; }
        .cd-acc-value { font-size: 20px; font-weight: 800; color: #fff; font-family: 'Space Mono', monospace; }
        
        .cd-metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .cd-metric-card { background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 16px; padding: 20px; position: relative; }
        .cd-metric-num { position: absolute; top: 18px; right: 20px; font-size: 20px; opacity: 0.1; font-weight: 900; display: none; }
        .cd-metric-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; font-size: 14px; }
        .cd-metric-label { font-size: 10px; font-weight: 800; color: var(--text-dim); text-transform: uppercase; margin-bottom: 4px; }
        .cd-metric-value { font-size: 18px; font-weight: 800; font-family: 'Space Mono', monospace; }

        .cd-tabs { display: flex; gap: 8px; background: rgba(0,0,0,0.2); padding: 6px; border-radius: 14px; border: 1px solid var(--border); width: fit-content; margin-bottom: 24px; }
        .cd-tab { padding: 10px 20px; border-radius: 10px; border: none; background: transparent; color: var(--text-dim); font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 10px; }
        .cd-tab.active { background: var(--brand-primary); color: #fff; box-shadow: 0 4px 12px rgba(255, 77, 94, 0.2); }
        .cd-tab-count { background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 6px; font-size: 10px; }
        .cd-tab.active .cd-tab-count { background: rgba(0,0,0,0.15); }

        .cd-trade-table-wrap { border: 1px solid var(--border); border-radius: 16px; overflow: hidden; background: rgba(0,0,0,0.1); }
        .adm-table th { background: rgba(0,0,0,0.2); padding: 16px 20px; text-align: left; font-size: 10px; font-weight: 900; color: var(--text-dim); text-transform: uppercase; border-bottom: 1px solid var(--border); }
        .adm-table td { padding: 16px 20px; font-size: 13px; color: var(--text-main); border-bottom: 1px solid rgba(255,255,255,0.02); }
        .adm-table-row:hover { background: rgba(255,255,255,0.02); }
        .adm-uid-badge { background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 6px; font-family: 'Space Mono', monospace; font-size: 11px; border: 1px solid var(--border); }
        
        .cd-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 2000; animation: fadeIn 0.3s; }
        .cd-modal { background: #0f172a; border: 1px solid var(--border); border-radius: 24px; width: 90%; box-shadow: 0 32px 64px rgba(0,0,0,0.5); overflow: hidden; animation: pop 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pop { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        
        .cd-modal-header { padding: 24px 30px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .cd-modal-header h3 { margin: 0; font-size: 20px; font-weight: 800; color: #fff; font-family: 'Outfit', sans-serif; display: flex; align-items: center; gap: 12px; }
        .cd-modal-header h3 i { color: var(--brand-primary); }
        .cd-modal-body { padding: 30px; }
        .cd-modal-footer { padding: 24px 30px; background: rgba(0,0,0,0.2); display: flex; gap: 12px; }
        .cd-modal-btn { flex: 1; padding: 14px; border-radius: 12px; font-weight: 800; cursor: pointer; border: none; transition: 0.2s; font-family: 'Inter', sans-serif; }
        .cd-modal-btn.cancel { background: rgba(255,255,255,0.05); color: var(--text-dim); }
        .cd-modal-btn.confirm { background: var(--brand-primary); color: #fff; box-shadow: 0 4px 12px rgba(255, 77, 94, 0.3); }

        .adm-input { width: 100%; padding: 14px 16px; background: rgba(0,0,0,0.25); border: 2px solid var(--border); border-radius: 12px; color: #fff; font-size: 15px; transition: 0.2s; }
        .adm-input:focus { border-color: var(--brand-primary); outline: none; background: rgba(0,0,0,0.3); }

        .bias-options { display: grid; gap: 10px; }
        .bias-btn { background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 16px; border-radius: 14px; color: var(--text-dim); display: flex; align-items: center; gap: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .bias-btn:hover { background: rgba(255,255,255,0.05); }
        .bias-btn.active { background: rgba(255, 77, 94, 0.1); border-color: var(--brand-primary); color: #fff; }
        .bias-btn i { font-size: 18px; }

        .cd-type-badge { font-family: 'Space Mono', monospace; font-weight: 800; padding: 4px 8px; border-radius: 6px; font-size: 11px; }
        .cd-type-badge.buy { background: rgba(0, 204, 136, 0.1); color: var(--success); }
        .cd-type-badge.sell { background: rgba(255, 77, 77, 0.1); color: var(--danger); }

        .cd-trade-status { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 30px; }
        .cd-trade-status.open { background: rgba(0, 204, 136, 0.1); color: var(--success); }
        .cd-trade-status.closed { background: rgba(255,255,255,0.05); color: var(--text-dim); }
        .cd-trade-status.pending { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .cd-trade-status.rejected { background: rgba(255, 77, 77, 0.1); color: var(--danger); }
        .cd-trade-status.approved { background: rgba(0, 204, 136, 0.1); color: var(--success); }
        .cd-trade-status.verified { background: rgba(0, 204, 136, 0.1); color: var(--success); }

        .adm-mini-act { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid var(--border); color: var(--text-dim); background: var(--bg-card); }
        .adm-mini-act.approve:hover { background: var(--success); color: #fff; border-color: var(--success); }
        .adm-mini-act.reject:hover { background: var(--danger); color: #fff; border-color: var(--danger); }

        .t-btn { font-family: 'Inter', sans-serif; font-weight: 800; border: none; background: rgba(255,255,255,0.03); color: var(--text-dim); padding: 12px; border-radius: 12px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; }
        .t-btn.increase.active { background: var(--success); color: #fff; box-shadow: 0 4px 10px rgba(0, 204, 136, 0.2); }
        .t-btn.decrease.active { background: var(--danger); color: #fff; box-shadow: 0 4px 10px rgba(255, 77, 77, 0.2); }
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
              <div className="toggle-group" style={{ marginBottom: '24px' }}>
                <button 
                  className={`t-btn increase ${adjustData.type === 'increase' ? 'active' : ''}`}
                  onClick={() => setAdjustData({ ...adjustData, type: 'increase' })}
                  style={{ flex: 1 }}
                >
                  <i className="fa-solid fa-plus-circle" /> Increase
                </button>
                <button 
                  className={`t-btn decrease ${adjustData.type === 'decrease' ? 'active' : ''}`}
                  onClick={() => setAdjustData({ ...adjustData, type: 'decrease' })}
                  style={{ flex: 1 }}
                >
                  <i className="fa-solid fa-minus-circle" /> Decrease
                </button>
              </div>

              <div className="adm-input-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>Amount (USD)</label>
                <input 
                  type="number" 
                  className="adm-input"
                  value={adjustData.amount}
                  onChange={(e) => setAdjustData({ ...adjustData, amount: e.target.value })}
                  placeholder="0.00"
                  autoFocus
                />
              </div>

              <div className="adm-input-group">
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>Internal Note</label>
                <input 
                  type="text" 
                  className="adm-input"
                  value={adjustData.note}
                  onChange={(e) => setAdjustData({ ...adjustData, note: e.target.value })}
                  placeholder="Audit reason..."
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

      {/* Dynamic Bias & Profit Modal */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content animate-pop">
            <div className="modal-header">
              <h3 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-chart-line" style={{ color: '#FF4D5E' }} /> Trade Bias Control
              </h3>
              <button className="close-x" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <div className="modal-body">
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                Set the price trend for Trade <span style={{ color: '#fff' }}>{modalTrade?.id}</span> ({modalTrade?.symbol})
              </p>

              <div className="bias-options">
                <button className={`bias-btn ${modalMode === 'none' ? 'active' : ''}`} onClick={() => setModalMode('none')}>
                  <i className="fa-solid fa-arrows-left-right" /> Neutral (Market Flow)
                </button>
                <button className={`bias-btn ${modalMode === 'profit' ? 'active' : ''}`} onClick={() => setModalMode('profit')}>
                  <i className="fa-solid fa-arrow-up" style={{ color: '#00cc88' }} /> Forced Profit (Green)
                </button>
                <button className={`bias-btn ${modalMode === 'loss' ? 'active' : ''}`} onClick={() => setModalMode('loss')}>
                  <i className="fa-solid fa-arrow-down" style={{ color: '#ff4d4d' }} /> Forced Loss (Red)
                </button>
                <button className={`bias-btn ${modalMode === 'lock' ? 'active' : ''}`} onClick={() => setModalMode('lock')}>
                   <i className="fa-solid fa-lock" style={{ color: '#FF4D5E' }} /> Fixed Profit Lock
                </button>
              </div>

              {modalMode === 'lock' ? (
                <div className="intensity-group">
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Fixed Profit/Loss Amount (USD)
                  </label>
                  <input 
                     type="number"
                     step="0.01"
                     className="adm-input"
                     style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid #2a3341', borderRadius: '10px', color: '#fff' }}
                     value={modalForcedPL}
                     onChange={(e) => setModalForcedPL(e.target.value)}
                     placeholder="e.g. 500.50"
                  />
                  <p style={{ fontSize: '10px', color: '#475569', marginTop: '8px' }}>
                    Positive for profit (e.g. 150), negative for loss (e.g. -150).
                  </p>
                </div>
              ) : (
                <div className="intensity-group">
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Trend Intensity / Multiplier
                  </label>
                  <input 
                     type="number"
                     step="0.1"
                     className="adm-input"
                     style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid #2a3341', borderRadius: '10px', color: '#fff' }}
                     value={modalMultiplier}
                     onChange={(e) => setModalMultiplier(e.target.value)}
                     placeholder="1.0"
                     disabled={modalMode === 'none'}
                  />
                  <p style={{ fontSize: '10px', color: '#475569', marginTop: '8px' }}>
                    1.0 is normal market speed. Higher values accelerate profit/loss.
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ marginTop: '24px' }}>
              <button className="modal-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-btn primary" onClick={submitEditPL}>Update Bias</button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default ClientDetail;
