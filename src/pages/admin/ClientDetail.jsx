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
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button className="back-btn" onClick={() => navigate('/admin/clients')} title="Return to Clients List">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div>
            <h1>{client.name}</h1>
            <p className="uid-tag">
              <i className="fa-solid fa-fingerprint" style={{ marginRight: '6px', color: 'var(--brand-primary)' }} />
              UID: {client.id} &nbsp;•&nbsp; Registered {new Date(client.registeredAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Admin Presence Indicator */}
        {otherAdmins.length > 0 && (
          <div className="presence-indicator">
             <span>Active Staff</span>
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

      <div className="cd-section">
        <div className="cd-section-label">Identity Overview</div>
        <div className="cd-profile-grid">
          <div className="cd-profile-main">
            <div className="cd-avatar-lg">{client.name.charAt(0)}</div>
            <div className="cd-profile-info">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 850 }}>{client.name}</h2>
                  <span
                    className="adm-status-badge"
                    style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}
                  >
                    <span className="adm-status-dot" style={{ background: st.color }} />
                    {st.label}
                  </span>
                </div>
                
                <div className="cd-actions-bar" style={{ display: 'flex', gap: '10px' }}>
                  <button className="cd-act-btn success" style={{ width: 'auto' }} disabled={processing} onClick={handleQuickFund}>
                    <i className="fa-solid fa-bolt" /> {processing ? '...' : 'Quick Fund $10k'}
                  </button>
                  <button className="cd-act-btn primary" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', borderColor: 'var(--border)', boxShadow: 'none' }} onClick={() => setShowBalanceModal(true)}>
                    <i className="fa-solid fa-wallet" /> Edit Balance
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="cd-profile-fields">
            {[
              { icon: 'fa-user-lock', label: 'Internal UID', value: client.uid },
              { icon: 'fa-phone-flip', label: 'Primary Contact', value: client.contact },
              { icon: 'fa-envelope-open-text', label: 'Auth Email', value: client.email },
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
              <i className="fa-solid fa-user-gear" /> Modify Profile
            </button>
            <button className="cd-act-btn primary" style={{ background: 'rgba(139,92,246,0.1)', color: '#a855f7', borderColor: 'rgba(139,92,246,0.2)', boxShadow: 'none' }} onClick={handleResetPin}>
              <i className="fa-solid fa-shield-keyhole" /> Reset Security PIN
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              {client.status !== 'active' && (
                <button className="cd-act-btn success" style={{ flex: 1 }} onClick={() => handleUpdateStatus('active')}><i className="fa-solid fa-user-check" /> Restore</button>
              )}
              {client.status !== 'suspended' && (
                <button className="cd-act-btn danger" style={{ flex: 1 }} onClick={() => handleUpdateStatus('suspended')}><i className="fa-solid fa-user-slash" /> Suspend</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="cd-section">
        <div className="cd-section-label">Verification Hub</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          {[
            { id: 'poi', label: 'Proof of Identity', data: client?.kyc?.poi },
            { id: 'por', label: 'Proof of Residence', data: client?.kyc?.por },
            { id: 'selfie', label: 'Selfie with ID', data: client?.kyc?.selfie },
          ].map((item) => (
            <div key={item.id} className="adm-kyc-card" style={{ padding: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div className="cd-field-label" style={{ margin: 0 }}>{item.label}</div>
                  <span className={`cd-trade-status ${item.data?.status || 'none'}`}>
                     {item.data?.status || 'unsubmitted'}
                  </span>
               </div>

               {item.data?.url ? (
                 <>
                    <div style={{ background: '#000', height: '220px', borderRadius: '18px', overflow: 'hidden', marginBottom: '20px', border: '1px solid var(--border)', position: 'relative', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)' }}>
                       <img src={item.data.url} alt={item.id} style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s' }} className="kyc-img-preview" />
                       <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                          <a href={item.data.url} target="_blank" rel="noreferrer" className="adm-mini-act" title="External View">
                             <i className="fa-solid fa-arrow-up-right-from-square" />
                          </a>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                       {(item.data.status === 'pending' || item.data.status === 'rejected') && (
                         <button onClick={() => handleReviewKYC(item.id, 'approve')} className="cd-act-btn success" style={{ padding: '12px', fontSize: '11px', flex: 1 }}>
                            <i className="fa-solid fa-check-double" /> {item.data.status === 'rejected' ? 'Restore' : 'Approve'}
                         </button>
                       )}
                       {(item.data.status === 'pending' || item.data.status === 'approved') && (
                         <button onClick={async () => {
                            const reason = await showPrompt("Rejection Reason:", `Reject ${item.label}`, "Incomplete or blurry...");
                            if (reason) handleReviewKYC(item.id, 'reject', reason);
                         }} className="cd-act-btn danger" style={{ padding: '12px', fontSize: '11px', flex: 1, background: 'rgba(239,68,68,0.05)', color: '#ef4444' }}>
                            <i className="fa-solid fa-xmark" /> Reject
                         </button>
                       )}
                    </div>
                    {item.data.rejectionReason && (
                       <div style={{ marginTop: '16px', fontSize: '12px', color: '#ef4444', padding: '14px', background: 'rgba(239,68,68,0.05)', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.1)', lineHeight: 1.5 }}>
                          <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }} />
                          <span style={{ fontWeight: 600 }}>Rejected:</span> {item.data.rejectionReason}
                       </div>
                    )}
                 </>
               ) : (
                 <div style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '12px', border: '2px dashed var(--border)', borderRadius: '18px', gap: '16px', background: 'rgba(0,0,0,0.1)' }}>
                    <i className="fa-solid fa-file-shield" style={{ fontSize: '32px', opacity: 0.2 }} />
                    <span style={{ fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.5 }}>Awaiting Documents</span>
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>

      <div className="cd-section">
        <div className="cd-section-label">Institutional Asset Matrix</div>
        <div className="cd-account-grid">
           {[
            { label: 'Cumulative Deposits', value: `$${(acc?.deposit || 0).toLocaleString()}`, color: '#10b981', icon: 'fa-money-bill-transfer' },
            { label: 'Outbound Liquidity', value: `$${totalWithdrawal.toLocaleString()}`, color: '#ef4444', icon: 'fa-box-up' },
            { label: 'Settled Vault Balance', value: `$${(acc?.availableToWithdraw || 0).toLocaleString()}`, color: '#3b82f6', icon: 'fa-vault' },
           ].map(item => (
            <div className="cd-acc-card" key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div className="cd-acc-label">{item.label}</div>
                <i className={`fa-solid ${item.icon}`} style={{ color: item.color, opacity: 0.4, fontSize: '14px' }} />
              </div>
              <div className="cd-acc-value" style={{ color: item.color }}>{item.value}</div>
            </div>
           ))}
           <div className="cd-acc-card" style={{ 
              borderColor: (acc?.profitLoss || 0) >= 0 ? '#10b981' : '#ef4444', 
              background: (acc?.profitLoss || 0) >= 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)' 
           }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div className="cd-acc-label">Aggr. P/L Performance</div>
                <i className={`fa-solid ${(acc?.profitLoss || 0) >= 0 ? 'fa-chart-line-up' : 'fa-chart-line-down'}`} style={{ color: (acc?.profitLoss || 0) >= 0 ? '#10b981' : '#ef4444', opacity: 0.4 }} />
              </div>
              <div className="cd-acc-value" style={{ color: (acc?.profitLoss || 0) >= 0 ? '#10b981' : '#ef4444' }}>
                 {(acc?.profitLoss || 0) >= 0 ? '+' : ''}{(acc?.profitLoss || 0).toLocaleString()}
              </div>
           </div>
           
           <div className="cd-acc-card">
              <div className="cd-acc-label">Active Power</div>
              <div className="cd-acc-value">{acc?.leverage || '1:100'}</div>
           </div>
           <div className="cd-acc-card">
              <div className="cd-acc-label">Margin Health</div>
              <div className="cd-acc-value" style={{ color: (acc?.marginLevel || 0) < 100 ? '#ef4444' : '#10b981' }}>{acc?.marginLevel || 0}%</div>
           </div>
        </div>

        <div className="cd-metrics-grid">
          {tradingMetricCards.map((card) => (
            <div className="cd-metric-card" key={card.label}>
              <div className="cd-metric-icon" style={{ color: card.color }}>
                <i className={`fa-solid fa-${card.icon}`} />
              </div>
              <div className="cd-metric-label">{card.label}</div>
              <div className="cd-metric-value" style={{ color: card.color }}>{card.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cd-section">
        <div className="cd-section-label">Trades Engineering Module</div>

        <div className="cd-tabs">
          {[
            { key: 'trades', label: 'Active', icon: 'fa-chart-network', count: (allTrades[id] || []).filter(t => t.status !== 'Closed').length },
            { key: 'history', label: 'Archived', icon: 'fa-box-archive', count: (allTrades[id] || []).filter(t => t.status === 'Closed').length + historyTrades.length },
            { key: 'withdrawals', label: 'Debits', icon: 'fa-arrow-up-to-bracket', count: withdrawals.length },
            { key: 'deposits', label: 'Credits', icon: 'fa-arrow-down-to-bracket', count: deposits.length },
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
          <table className="adm-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {activeTab === 'trades' || activeTab === 'history' ? (
                <tr>
                  <th>Symbol</th>
                  <th>Type</th>
                  <th>Volume</th>
                  <th>Open Price</th>
                  <th>Current Price</th>
                  <th>TP / SL</th>
                  <th>Swap</th>
                  <th>Profit/Loss</th>
                  <th>Status</th>
                  <th>Operations</th>
                </tr>
              ) : activeTab === 'withdrawals' ? (
                <tr>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Address/Details</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              ) : (
                <tr>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Reference</th>
                  <th>Dated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              )}
            </thead>
            <tbody>
               {paginatedData.length > 0 ? (
                  paginatedData.map((t, idx) => (
                    <tr key={idx} className="adm-table-row">
                      {activeTab === 'trades' || activeTab === 'history' ? (
                        <>
                          <td style={{ fontWeight: 800 }}>{t.symbol}</td>
                          <td>
                            <span className={`cd-type-badge ${t.type.toLowerCase() === 'buy' ? 'buy' : 'sell'}`}>
                              {t.type}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{t.lots} lots</td>
                          <td style={{ opacity: 0.7 }}>${t.openPrice}</td>
                          <td style={{ fontWeight: 700 }}>
                             {prices.find(p=>p.symbol===t.symbol)?.price || '...'}
                          </td>
                          <td>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                               <span style={{ color: '#10b981' }}>TP: {t.takeProfit ? parseFloat(t.takeProfit).toFixed(5) : '—'}</span>
                               <span style={{ color: '#ef4444' }}>SL: {t.stopLoss ? parseFloat(t.stopLoss).toFixed(5) : '—'}</span>
                             </div>
                          </td>
                          <td style={{ 
                            color: (t.swap || 0) < 0 ? '#ef4444' : '#10b981',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700
                          }}>
                            {(t.swap || 0).toFixed(2)}
                          </td>
                          <td style={{ 
                            color: (t.profit >= 0) ? '#10b981' : '#ef4444',
                            fontWeight: 900,
                            fontFamily: 'var(--font-mono)'
                          }}>
                            {t.profit >= 0 ? '+' : ''}{t.profit?.toFixed(2)}
                            {t.bias === 'lock' && <i className="fa-solid fa-lock" style={{ marginLeft: 8, fontSize: 10, color: '#f59e0b' }} />}
                          </td>
                          <td>
                            <span className={`cd-trade-status ${t.status?.toLowerCase() || 'open'}`}>
                               {t.status || 'Open'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {t.status !== 'Closed' && (
                                <>
                                  <button className="adm-mini-act" onClick={() => handleEditPL(t)} title="Bias Control">
                                    <i className="fa-solid fa-wand-magic-sparkles" />
                                  </button>
                                  <button className="adm-mini-act reject" onClick={() => handleForceClose(t.id)} title="Force Close">
                                    <i className="fa-solid fa-rectangle-xmark" />
                                  </button>
                                  <button className="adm-mini-act" onClick={() => handleEditLimit(t)} title="Set Target Price" style={{ color: '#3b82f6' }}>
                                    <i className="fa-solid fa-crosshairs" />
                                  </button>
                                </>
                              )}
                              <button className="adm-mini-act" onClick={() => handleEditSwap(t)} title="Swap Control" style={{ color: '#f59e0b' }}>
                                <i className={`fa-solid ${t.swapLocked ? 'fa-lock' : 'fa-arrows-spin'}`} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : activeTab === 'withdrawals' ? (
                        <>
                          <td>{t.asset || 'USD'}</td>
                          <td style={{ color: '#ef4444', fontWeight: 900 }}>-${parseFloat(t.amount).toLocaleString()}</td>
                          <td>{t.method}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.6, fontSize: '11px' }}>
                             {t.address || t.accountDetails}
                          </td>
                          <td>{t.date}</td>
                          <td>
                            <span className={`cd-trade-status ${t.status}`}>
                               {t.status}
                            </span>
                          </td>
                          <td>
                            {t.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="adm-mini-act approve" onClick={() => handleUpdateTransactionStatus('withdrawal', t.id, 'approved')} title="Release Funds">
                                  <i className="fa-solid fa-check" />
                                </button>
                                <button className="adm-mini-act reject" onClick={() => handleUpdateTransactionStatus('withdrawal', t.id, 'rejected')} title="Block Withdrawal">
                                  <i className="fa-solid fa-xmark" />
                                </button>
                              </div>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{t.asset || 'USD'}</td>
                          <td style={{ color: '#10b981', fontWeight: 900 }}>+${parseFloat(t.amount).toLocaleString()}</td>
                          <td>{t.method}</td>
                          <td style={{ opacity: 0.6, fontSize: '11px' }}>{t.ref || 'DIRECT'}</td>
                          <td>{t.date}</td>
                          <td>
                            <span className={`cd-trade-status ${t.status}`}>
                               {t.status}
                            </span>
                          </td>
                          <td>
                            {t.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="adm-mini-act approve" onClick={() => handleUpdateTransactionStatus('deposit', t.id, 'approved')} title="Confirm Receipt">
                                  <i className="fa-solid fa-check" />
                                </button>
                                <button className="adm-mini-act reject" onClick={() => handleUpdateTransactionStatus('deposit', t.id, 'rejected')} title="Invalid/Fake">
                                  <i className="fa-solid fa-xmark" />
                                </button>
                              </div>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
               ) : (
                  <tr>
                    <td colSpan="9" style={{ padding: '60px', textAlign: 'center', opacity: 0.4 }}>
                       <i className="fa-solid fa-inbox" style={{ fontSize: '32px', marginBottom: '16px', display: 'block' }} />
                       No records found for this sector.
                    </td>
                  </tr>
               )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="adm-pagination" style={{ marginTop: '24px', padding: '0 8px' }}>
            <span className="adm-page-info">
              Displaying {tradePage} of {totalPages} &nbsp;•&nbsp; {currentData.length} records found
            </span>
            <div className="adm-page-btns">
              <button className="adm-pg-btn" disabled={tradePage === 1} onClick={() => setTradePage(p => p - 1)}>
                <i className="fa-solid fa-chevron-left" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, tradePage - 3), Math.min(totalPages, tradePage + 2)).map((p) => (
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
          <div className="cd-modal" style={{ maxWidth: '420px' }}>
            <div className="cd-modal-header">
              <h3>Target Price Calibration</h3>
              <button className="cd-modal-close" onClick={() => setShowLimitModal(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="cd-modal-body">
              <p className="cd-field-label" style={{ marginBottom: '20px', textTransform: 'none', fontWeight: 500, opacity: 0.7 }}>
                Set a specific market price target for {modalLimitTrade?.symbol}. 
                Clearing this field removes the active trigger.
              </p>
              
              <div className="adm-input-group">
                <label>Institutional Target Price</label>
                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-crosshairs" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-primary)', opacity: 0.5 }} />
                  <input
                    type="number"
                    step="0.00001"
                    className="adm-input"
                    style={{ paddingLeft: '48px' }}
                    value={modalLimitValue}
                    onChange={(e) => setModalLimitValue(e.target.value)}
                    placeholder="e.g. 1.09450"
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button className="cd-act-btn primary" onClick={submitEditLimit} style={{ flex: 1 }}>
                  Commit Target
                </button>
                <button className="cd-act-btn danger" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', borderColor: 'var(--border)', boxShadow: 'none', flex: 1 }} onClick={() => setShowLimitModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .client-detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding: 0 4px; }
        .client-detail-header h1 { font-family: var(--font-main); font-size: 32px; font-weight: 900; color: var(--text-main); margin: 0; letter-spacing: -1px; }
        .uid-tag { font-size: 13px; color: var(--text-muted); margin-top: 6px; font-weight: 500; font-family: var(--font-mono); }
        .back-btn { 
          width: 44px; height: 44px; border-radius: 14px; 
          border: 1px solid var(--border); background: var(--bg-card); 
          color: var(--text-dim); cursor: pointer; transition: all 0.3s; 
          display: flex; align-items: center; justify-content: center; 
          box-shadow: var(--shadow-sm);
        }
        .back-btn:hover { 
          background: var(--brand-primary); color: #fff; border-color: var(--brand-primary);
          transform: translateX(-4px); box-shadow: 0 0 20px rgba(255, 77, 94, 0.3);
        }

        .presence-indicator { 
          display: flex; align-items: center; gap: 14px; 
          background: rgba(16, 185, 129, 0.05); padding: 8px 16px; 
          border-radius: 30px; border: 1px solid rgba(16, 185, 129, 0.1); 
        }
        .presence-indicator span { font-size: 10px; font-weight: 900; color: #10b981; letter-spacing: 0.1em; text-transform: uppercase; }
        .presence-avatars { display: flex; margin-left: -4px; }
        .presence-badge { 
          width: 28px; height: 28px; border-radius: 50%; 
          background: #10b981; color: #fff; 
          display: flex; align-items: center; justify-content: center; 
          font-size: 11px; font-weight: 900; 
          border: 2px solid var(--bg-deep); margin-left: -8px; 
          transition: all 0.2s;
        }
        .presence-badge:hover { transform: translateY(-4px) scale(1.1); z-index: 10; }

        .sticky-note-card { 
          background: var(--bg-card); border: 1px solid var(--border); 
          border-radius: 20px; padding: 20px; margin-bottom: 32px; 
          display: flex; flex-direction: column; gap: 16px; 
          box-shadow: var(--shadow-sm); position: relative;
          overflow: hidden;
        }
        .sticky-note-card::before {
          content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
          background: var(--brand-primary); opacity: 0.5;
        }
        .sticky-label { display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 900; color: var(--brand-primary); letter-spacing: 1.5px; text-transform: uppercase; }
        .sticky-textarea { 
          background: rgba(0,0,0,0.2); border: 1px solid var(--border); 
          border-radius: 12px; padding: 16px;
          font-size: 14px; color: var(--text-main); line-height: 1.7; 
          min-height: 80px; resize: vertical; font-family: var(--font-main); 
          outline: none; transition: all 0.3s;
        }
        .sticky-textarea:focus { border-color: var(--brand-primary); background: rgba(255, 77, 94, 0.02); }
        .note-status-indicator { font-size: 10px; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 8px; opacity: 0.7; }

        .cd-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 32px; margin-bottom: 32px; position: relative; }
        .cd-section-label { 
          font-size: 11px; font-weight: 900; letter-spacing: 2px; 
          color: var(--brand-primary); text-transform: uppercase; 
          margin-bottom: 24px; display: flex; align-items: center; gap: 16px; 
        }
        .cd-section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }

        .cd-profile-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; align-items: start; }
        .cd-profile-main { display: flex; align-items: center; gap: 24px; }
        .cd-avatar-lg { 
          width: 90px; height: 90px; border-radius: 28px; 
          background: linear-gradient(135deg, rgba(255, 77, 94, 0.15), rgba(255, 77, 94, 0.05)); 
          border: 1px solid rgba(255, 77, 94, 0.3); color: var(--brand-primary); 
          font-size: 40px; font-weight: 900; display: flex; align-items: center; 
          justify-content: center; box-shadow: 0 10px 30px rgba(255, 77, 94, 0.15); 
        }
        
        .adm-status-badge { 
          display: inline-flex; align-items: center; gap: 8px; 
          padding: 6px 14px; border-radius: 30px; 
          font-size: 10px; font-weight: 900; 
          text-transform: uppercase; letter-spacing: 0.8px; 
        }
        .adm-status-dot { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 10px currentColor; }

        .cd-profile-fields { display: grid; gap: 12px; }
        .cd-field { 
          display: flex; align-items: center; gap: 16px; 
          background: rgba(0,0,0,0.2); padding: 14px 18px; 
          border-radius: 16px; border: 1px solid var(--border);
          transition: all 0.3s;
        }
        .cd-field:hover { border-color: var(--brand-primary); transform: translateX(4px); }
        .cd-field-icon { 
          width: 40px; height: 40px; border-radius: 12px; 
          border: 1px solid var(--border); background: var(--bg-deep); 
          color: var(--brand-primary); display: flex; align-items: center; 
          justify-content: center; font-size: 16px; 
        }
        .cd-field-label { font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .cd-field-value { font-size: 15px; font-weight: 700; color: var(--text-main); margin-top: 2px; }

        .cd-profile-actions { display: flex; flex-direction: column; gap: 12px; }
        .cd-act-btn { 
          width: 100%; padding: 14px 20px; border-radius: 14px; 
          font-size: 13px; font-weight: 800; cursor: pointer; 
          display: flex; align-items: center; justify-content: center; gap: 12px; 
          border: 1px solid transparent; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
          font-family: var(--font-main); text-transform: uppercase; letter-spacing: 0.5px;
        }
        .cd-act-btn.primary { background: var(--brand-primary); color: #fff; box-shadow: 0 8px 24px rgba(255, 77, 94, 0.3); }
        .cd-act-btn.primary:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(255, 77, 94, 0.45); }
        .cd-act-btn.success { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
        .cd-act-btn.success:hover { background: #10b981; color: #fff; transform: translateY(-3px); }
        .cd-act-btn.danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
        .cd-act-btn.danger:hover { background: #ef4444; color: #fff; transform: translateY(-3px); }

        .adm-kyc-card { 
          background: rgba(0,0,0,0.3) !important; 
          border: 1px solid var(--border) !important; 
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
          border-radius: 24px !important;
        }
        .adm-kyc-card:hover { 
          border-color: var(--brand-primary) !important; 
          transform: translateY(-8px); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .cd-account-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
        .cd-acc-card { 
          background: rgba(255,255,255,0.03); border: 1px solid var(--border); 
          border-radius: 20px; padding: 24px; transition: all 0.3s;
          display: flex; flex-direction: column; gap: 8px;
        }
        .cd-acc-card:hover { background: rgba(255,255,255,0.05); transform: translateY(-4px); border-color: rgba(255,255,255,0.1); }
        .cd-acc-label { font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .cd-acc-value { font-size: 24px; font-weight: 900; color: var(--text-main); font-family: var(--font-mono); letter-spacing: -0.5px; }
        
        .cd-metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .cd-metric-card { 
          background: rgba(0,0,0,0.25); border: 1px solid var(--border); 
          border-radius: 20px; padding: 24px; position: relative; 
          transition: all 0.3s;
        }
        .cd-metric-card:hover { border-color: var(--brand-primary); background: rgba(0,0,0,0.3); }
        .cd-metric-icon { 
          width: 36px; height: 36px; border-radius: 10px; 
          background: rgba(255,255,255,0.05); display: flex; align-items: center; 
          justify-content: center; margin-bottom: 16px; font-size: 16px; 
          border: 1px solid rgba(255,255,255,0.1);
        }
        .cd-metric-label { font-size: 10px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px; }
        .cd-metric-value { font-size: 20px; font-weight: 800; font-family: var(--font-mono); }

        .cd-tabs { 
          display: flex; gap: 10px; background: rgba(0,0,0,0.3); 
          padding: 8px; border-radius: 18px; border: 1px solid var(--border); 
          width: fit-content; margin-bottom: 32px; 
        }
        .cd-tab { 
          padding: 12px 24px; border-radius: 12px; border: none; 
          background: transparent; color: var(--text-dim); 
          font-size: 13px; font-weight: 800; cursor: pointer; 
          transition: all 0.3s; display: flex; align-items: center; gap: 12px; 
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .cd-tab.active { background: var(--brand-primary); color: #fff; box-shadow: 0 10px 25px rgba(255, 77, 94, 0.3); }
        .cd-tab-count { 
          background: rgba(255,255,255,0.1); padding: 2px 8px; 
          border-radius: 6px; font-size: 11px; font-weight: 900; 
          font-family: var(--font-mono);
        }
        .cd-tab.active .cd-tab-count { background: rgba(0,0,0,0.2); }

        .cd-trade-table-wrap { 
          border: 1px solid var(--border); border-radius: 20px; 
          overflow: hidden; background: rgba(0,0,0,0.2); 
          box-shadow: var(--shadow-lg);
        }
        .adm-table th { 
          background: rgba(0,0,0,0.3); padding: 20px 24px; 
          text-align: left; font-size: 10px; font-weight: 900; 
          color: var(--text-muted); text-transform: uppercase; 
          letter-spacing: 1.5px; border-bottom: 1px solid var(--border); 
        }
        .adm-table td { padding: 20px 24px; font-size: 14px; color: var(--text-main); border-bottom: 1px solid rgba(255,255,255,0.03); vertical-align: middle; }
        .adm-table-row:hover { background: rgba(255,255,255,0.03); }
        .adm-uid-badge { 
          background: rgba(255,255,255,0.05); padding: 5px 10px; 
          border-radius: 8px; font-family: var(--font-mono); 
          font-size: 12px; border: 1px solid var(--border); 
          color: var(--text-dim);
        }
        
        .cd-modal-overlay { 
          position: fixed; inset: 0; background: rgba(0,0,0,0.85); 
          backdrop-filter: blur(12px); display: flex; 
          align-items: center; justify-content: center; 
          z-index: 2000; animation: fadeIn 0.3s ease-out; 
        }
        .cd-modal { 
          background: var(--bg-card); border: 1px solid var(--border); 
          border-radius: 24px; width: 95%; max-width: 500px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6); 
          overflow: hidden; animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalPop { from { opacity: 0; transform: scale(0.9) translateY(30px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        
        .cd-modal-header { padding: 28px 32px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); }
        .cd-modal-header h3 { margin: 0; font-size: 22px; font-weight: 900; color: #fff; font-family: var(--font-main); display: flex; align-items: center; gap: 14px; }
        .cd-modal-header h3 i { color: var(--brand-primary); }
        .cd-modal-body { padding: 32px; }
        .cd-modal-footer { padding: 24px 32px; background: rgba(0,0,0,0.3); display: flex; gap: 16px; }
        .cd-modal-btn { 
          flex: 1; padding: 16px; border-radius: 14px; 
          font-weight: 800; cursor: pointer; border: none; 
          transition: all 0.3s; font-family: var(--font-main); 
          text-transform: uppercase; letter-spacing: 1px; font-size: 13px;
        }
        .cd-modal-btn.cancel { background: rgba(255,255,255,0.05); color: var(--text-muted); }
        .cd-modal-btn.cancel:hover { background: rgba(255,255,255,0.1); color: var(--text-main); }
        .cd-modal-btn.confirm { background: var(--brand-primary); color: #fff; box-shadow: 0 8px 24px rgba(255, 77, 94, 0.3); }
        .cd-modal-btn.confirm:hover { background: #ff5e6d; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(255, 77, 94, 0.4); }

        .adm-input { 
          width: 100%; padding: 16px 18px; 
          background: rgba(0,0,0,0.4); border: 1px solid var(--border); 
          border-radius: 14px; color: #fff; font-size: 16px; 
          transition: all 0.3s; font-family: var(--font-main);
        }
        .adm-input:focus { border-color: var(--brand-primary); outline: none; background: rgba(255,77,94,0.03); box-shadow: 0 0 0 4px rgba(255,77,94,0.1); }

        .bias-options { display: grid; gap: 12px; }
        .bias-btn { 
          background: rgba(255,255,255,0.03); border: 1px solid var(--border); 
          padding: 18px 24px; border-radius: 16px; color: var(--text-dim); 
          display: flex; align-items: center; gap: 16px; 
          font-weight: 800; cursor: pointer; transition: all 0.3s;
          font-family: var(--font-main);
        }
        .bias-btn:hover { background: rgba(255,255,255,0.06); transform: translateX(6px); border-color: var(--text-muted); }
        .bias-btn.active { background: rgba(255, 77, 94, 0.1); border-color: var(--brand-primary); color: #fff; }
        .bias-btn i { font-size: 20px; }

        .cd-type-badge { font-family: var(--font-mono); font-weight: 800; padding: 5px 10px; border-radius: 8px; font-size: 11px; }
        .cd-type-badge.buy { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
        .cd-type-badge.sell { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

        .cd-trade-status { 
          font-size: 10px; font-weight: 900; text-transform: uppercase; 
          letter-spacing: 1px; padding: 6px 14px; border-radius: 30px; 
        }
        .cd-trade-status.open { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .cd-trade-status.closed { background: rgba(255,255,255,0.08); color: var(--text-muted); }
        .cd-trade-status.pending { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .cd-trade-status.rejected { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
        .cd-trade-status.approved { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .cd-trade-status.verified { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }

        .adm-mini-act { 
          width: 36px; height: 36px; border-radius: 10px; 
          display: flex; align-items: center; justify-content: center; 
          cursor: pointer; border: 1px solid var(--border); 
          color: var(--text-muted); background: var(--bg-deep); 
          transition: all 0.3s;
        }
        .adm-mini-act:hover { border-color: var(--text-main); color: var(--text-main); transform: scale(1.1); }
        .adm-mini-act.approve:hover { background: #10b981; color: #fff; border-color: #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); }
        .adm-mini-act.reject:hover { background: #ef4444; color: #fff; border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.4); }

        .toggle-group { display: flex; gap: 12px; background: rgba(0,0,0,0.2); padding: 6px; border-radius: 16px; border: 1px solid var(--border); }
        .t-btn { 
          font-family: var(--font-main); font-weight: 800; border: none; 
          background: transparent; color: var(--text-muted); 
          padding: 14px; border-radius: 12px; cursor: pointer; 
          transition: all 0.3s; display: flex; align-items: center; 
          justify-content: center; gap: 10px; font-size: 13px; 
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .t-btn.increase.active { background: #10b981; color: #fff; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3); }
        .t-btn.decrease.active { background: #ef4444; color: #fff; box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3); }
      `}</style>

      {/* Balance Adjustment Modal */}
      {showBalanceModal && (
        <div className="cd-modal-overlay">
          <div className="cd-modal" style={{ maxWidth: '420px' }}>
            <div className="cd-modal-header">
              <h3>Balance Matrix Adjustment</h3>
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
                  <i className="fa-solid fa-circle-plus" /> Deposit
                </button>
                <button 
                  className={`t-btn decrease ${adjustData.type === 'decrease' ? 'active' : ''}`}
                  onClick={() => setAdjustData({ ...adjustData, type: 'decrease' })}
                  style={{ flex: 1 }}
                >
                  <i className="fa-solid fa-circle-minus" /> Withdraw
                </button>
              </div>

              <div className="adm-input-group" style={{ marginBottom: '20px' }}>
                <label>Transaction Amount (USD)</label>
                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-dollar-sign" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                  <input 
                    type="number" 
                    className="adm-input"
                    style={{ paddingLeft: '40px' }}
                    value={adjustData.amount}
                    onChange={(e) => setAdjustData({ ...adjustData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="adm-input-group">
                <label>Audit Log Entry</label>
                <input 
                  type="text" 
                  className="adm-input"
                  value={adjustData.note}
                  onChange={(e) => setAdjustData({ ...adjustData, note: e.target.value })}
                  placeholder="Reason for adjustment..."
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button 
                  className="cd-act-btn primary" 
                  onClick={handleAdjustBalance}
                  disabled={processing || !adjustData.amount}
                  style={{ flex: 1 }}
                >
                  {processing ? 'Processing...' : 'Post Transaction'}
                </button>
                <button className="cd-act-btn danger" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', borderColor: 'var(--border)', boxShadow: 'none', flex: 1 }} onClick={() => setShowBalanceModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="cd-modal-overlay">
          <div className="cd-modal" style={{ maxWidth: '420px' }}>
            <div className="cd-modal-header">
              <h3>Identity Calibration</h3>
              <button className="cd-modal-close" onClick={() => setShowEditModal(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="cd-modal-body">
              <div className="adm-input-group" style={{ marginBottom: '20px' }}>
                <label>Client Full Name</label>
                <input 
                  type="text" 
                  className="adm-input"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>
              <div className="adm-input-group" style={{ marginBottom: '20px' }}>
                <label>Primary Email Address</label>
                <input 
                  type="email" 
                  className="adm-input"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </div>
              <div className="adm-input-group">
                <label>Contact Phone Number</label>
                <input 
                  type="text" 
                  className="adm-input"
                  value={editData.contact}
                  onChange={(e) => setEditData({ ...editData, contact: e.target.value })}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button 
                  className="cd-act-btn primary" 
                  onClick={handleEditProfile}
                  disabled={editing || !editData.name || !editData.email}
                  style={{ flex: 1 }}
                >
                  {editing ? 'Saving...' : 'Update Identity'}
                </button>
                <button className="cd-act-btn danger" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', borderColor: 'var(--border)', boxShadow: 'none', flex: 1 }} onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Bias & Profit Modal */}
      {showModal && (
        <div className="cd-modal-overlay">
          <div className="cd-modal" style={{ maxWidth: '450px' }}>
            <div className="cd-modal-header">
              <h3>Strategic Bias Override</h3>
              <button className="cd-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <div className="cd-modal-body">
              <p className="cd-field-label" style={{ marginBottom: '24px', textTransform: 'none', fontWeight: 500, opacity: 0.7 }}>
                Calibrate market direction for Trade <span style={{ color: 'var(--brand-primary)', fontWeight: 800 }}>{modalTrade?.id}</span> ({modalTrade?.symbol}).
              </p>

              <div className="bias-options">
                <button className={`bias-btn ${modalMode === 'none' ? 'active' : ''}`} onClick={() => setModalMode('none')}>
                  <i className="fa-solid fa-arrows-left-right" /> <span>Neutral Market Flow</span>
                </button>
                <button className={`bias-btn ${modalMode === 'profit' ? 'active' : ''}`} onClick={() => setModalMode('profit')}>
                  <i className="fa-solid fa-arrow-up-right-dots" style={{ color: '#10b981' }} /> <span>Forced Profit Vector</span>
                </button>
                <button className={`bias-btn ${modalMode === 'loss' ? 'active' : ''}`} onClick={() => setModalMode('loss')}>
                  <i className="fa-solid fa-arrow-down-right-dots" style={{ color: '#ef4444' }} /> <span>Forced Loss Vector</span>
                </button>
                <button className={`bias-btn ${modalMode === 'lock' ? 'active' : ''}`} onClick={() => setModalMode('lock')}>
                   <i className="fa-solid fa-vault" style={{ color: 'var(--brand-primary)' }} /> <span>Static Value Lock</span>
                </button>
              </div>

              <div style={{ marginTop: '24px' }}>
                {modalMode === 'lock' ? (
                  <div className="adm-input-group">
                    <label>Settlement Value (USD)</label>
                    <input 
                       type="number"
                       step="0.01"
                       className="adm-input"
                       value={modalForcedPL}
                       onChange={(e) => setModalForcedPL(e.target.value)}
                       placeholder="e.g. 500.00"
                    />
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', opacity: 0.7 }}>
                      Positive for credit, negative for debit logic.
                    </p>
                  </div>
                ) : (
                  <div className="adm-input-group">
                    <label>Trend Impact Multiplier</label>
                    <input 
                       type="number"
                       step="0.1"
                       className="adm-input"
                       value={modalMultiplier}
                       onChange={(e) => setModalMultiplier(e.target.value)}
                       placeholder="1.0"
                       disabled={modalMode === 'none'}
                    />
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', opacity: 0.7 }}>
                      1.0 = standard variance. Increase to accelerate trend intensity.
                    </p>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button className="cd-act-btn primary" onClick={submitEditPL} style={{ flex: 1 }}>Commit Strategy</button>
                <button className="cd-act-btn danger" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', borderColor: 'var(--border)', boxShadow: 'none', flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSwapModal && (
        <div className="cd-modal-overlay">
          <div className="cd-modal" style={{ maxWidth: '420px' }}>
            <div className="cd-modal-header">
              <h3>Swap Vector Adjustment</h3>
              <button className="cd-modal-close" onClick={() => setShowSwapModal(false)}>&times;</button>
            </div>
            <div className="cd-modal-body">
              <p className="cd-field-label" style={{ marginBottom: '20px', textTransform: 'none', fontWeight: 500, opacity: 0.7 }}>
                Manually calibrate the swap accrual for Trade {modalSwapTrade?.id}.
              </p>
              
              <div className="adm-input-group">
                <label>Institutional Swap Value</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="adm-input"
                  value={modalSwapValue}
                  onChange={(e) => setModalSwapValue(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button className="cd-act-btn primary" onClick={submitEditSwap} style={{ flex: 1 }}>Commit Swap</button>
                <button className="cd-act-btn danger" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', borderColor: 'var(--border)', boxShadow: 'none', flex: 1 }} onClick={() => setShowSwapModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default ClientDetail;
