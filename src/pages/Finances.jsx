import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';
import { useModal } from '../context/ModalContext';

const Finances = () => {
  const { currentClientExtended, socket } = useTrading();
  const { showAlert } = useModal();
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deposit'); // deposit, withdrawal, history

  // Form states
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [txHash, setTxHash] = useState('');
  const [withdrawalPin, setWithdrawalPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup PIN states
  const [showSetupPin, setShowSetupPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [platformConfig, setPlatformConfig] = useState({});

  const fetchData = React.useCallback(async () => {
    if (!currentClientExtended?.id) return;
    try {
      const [dRes, wRes, cRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/deposits/${currentClientExtended.id}`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/withdrawals/${currentClientExtended.id}`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/config`)
      ]);
      setDeposits(dRes.data);
      setWithdrawals(wRes.data);
      setPlatformConfig(cRes.data);
    } catch (err) {
      console.error('Failed to fetch financial data', err);
    } finally {
      setLoading(false);
    }
  }, [currentClientExtended?.id]);

  useEffect(() => {
    fetchData();

    if (socket) {
      socket.on('finance_update', fetchData);
      return () => {
        socket.off('finance_update', fetchData);
      };
    }
  }, [socket, fetchData]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/deposits', {
        clientId: currentClientExtended.id,
        amount: parseFloat(amount),
        method,
        status: 'pending',
        ref: txHash || ('REF' + Math.random().toString(36).substring(7).toUpperCase())
      });
      setDeposits([res.data, ...deposits]);
      setAmount('');
      setTxHash('');
      showAlert('Deposit request submitted! Please wait for administrative approval.', 'Request Received', 'success');
      setActiveTab('history');
    } catch (err) {
      console.error('Deposit failed', err);
      showAlert('Failed to submit deposit.', 'Submission Error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetupPin = async (e) => {
    e.preventDefault();
    if (newPin.length !== 4) return showAlert('PIN must be exactly 4 digits', 'Entry Error', 'warning');
    setIsSubmitting(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/auth/pin', { pin: newPin });
      showAlert('Withdrawal PIN secured successfully!', 'Success', 'success');
      setShowSetupPin(false);
      // Optional: trigger reload of client context if needed
    } catch(err) {
      showAlert(err.response?.data?.error || 'Failed to setup PIN', 'Error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    if (parseFloat(amount) > (currentClientExtended?.tradingMetrics?.balance || 0)) {
      showAlert('Insufficient balance.', 'Wait!', 'warning');
      return;
    }
    if (!withdrawalPin || withdrawalPin.length !== 4) {
      showAlert('Please enter your 4-digit Withdrawal PIN.', 'Missing Input', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/withdrawals', {
        clientId: currentClientExtended.id,
        amount: parseFloat(amount),
        method,
        pin: withdrawalPin,
        status: 'pending'
      });
      setWithdrawals([res.data, ...withdrawals]);
      setAmount('');
      setWithdrawalPin('');
      showAlert('Withdrawal request submitted! It will be processed after approval.', 'Request Successful', 'success');
      setActiveTab('history');
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.error?.includes('set up a Withdrawal PIN')) {
        setShowSetupPin(true);
      } else {
        console.error('Withdrawal failed', err);
        showAlert(err.response?.data?.error || 'Failed to submit withdrawal. Incorrect PIN?', 'Error', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const tm = currentClientExtended?.tradingMetrics || {};
  const history = [...deposits.map(d => ({...d, type: 'Deposit'})), ...withdrawals.map(w => ({...w, type: 'Withdrawal'}))]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  if (loading) {
    return (
      <div style={{ padding: '40px', color: '#94a3b8', textAlign: 'center' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '16px' }}></i>
        <p>Syncing Wallet...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      gridColumn: '1 / -1', 
      height: '100%', 
      overflowY: 'auto', 
      padding: '32px 24px', 
      width: '100%',
      background: 'var(--bg-deep)',
      color: '#e0e6ed' 
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif' }}>Financial Operations</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage your funds and track transaction history</p>
        </div>
        <div style={{ background: 'rgba(50,145,255,0.1)', border: '1px solid rgba(50,145,255,0.2)', padding: '12px 24px', borderRadius: '16px', textAlign: 'right' }}>
           <div style={{ fontSize: '11px', color: '#3291ff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Available Balance</div>
           <div style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'Space Mono, monospace' }}>${(tm.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
      </header>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
          <div className="card glass" style={{ flex: '2 1 500px', minWidth: 0, padding: '32px', borderRadius: '20px' }}>
           <nav style={{ display: 'flex', gap: '12px', marginBottom: '32px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '12px', width: 'fit-content' }}>
              {[
                { id: 'deposit', label: 'Deposit', icon: 'fa-plus-circle' },
                { id: 'withdrawal', label: 'Withdrawal', icon: 'fa-minus-circle' },
                { id: 'history', label: 'History', icon: 'fa-clock-rotate-left' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{ 
                    padding: '10px 20px', borderRadius: '10px', border: 'none', 
                    background: activeTab === t.id ? '#3291ff' : 'none',
                    color: activeTab === t.id ? '#fff' : '#64748b',
                    fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  <i className={`fa-solid ${t.icon}`}></i>
                  {t.label}
                </button>
              ))}
           </nav>

           {activeTab === 'deposit' && (
             <form onSubmit={handleDeposit} className="animate-fade">
               <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>New Deposit Request</h3>
               <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Amount (USD)</label>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '18px', fontWeight: 700 }}
                    required
                  />
               </div>
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Payment Method</label>
                  <select 
                    value={method} 
                    onChange={(e) => setMethod(e.target.value)}
                    style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '15px', marginBottom: '16px' }}
                  >
                    <option value="crypto">Cryptocurrency (USDT TRC20)</option>
                    <option value="bank_transfer">Bank Transfer / IBAN</option>
                  </select>

                  {/* Payment Instructions Box */}
                  <div style={{ background: 'rgba(50, 145, 255, 0.05)', border: '1px dashed rgba(50, 145, 255, 0.4)', borderRadius: '12px', padding: '16px' }}>
                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#e0e6ed', fontWeight: 600 }}>
                      <i className="fa-solid fa-circle-info" style={{ color: '#3291ff', marginRight: '8px' }}></i>
                      Transfer Instructions
                    </p>
                    
                    {method === 'crypto' ? (
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Network: <strong style={{color: '#fff'}}>Tron (TRC20)</strong></div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Send USDT to the address below:</div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#000', padding: '12px', borderRadius: '8px' }}>
                            <code style={{ color: '#00cc88', fontFamily: 'Space Mono', fontSize: '13px', wordBreak: 'break-all' }}>
                              {platformConfig.usdt_address || 'Loading...'}
                            </code>
                            <button type="button" onClick={() => navigator.clipboard.writeText(platformConfig.usdt_address)} style={{ background: 'transparent', border: 'none', color: '#3291ff', cursor: 'pointer' }}><i className="fa-regular fa-copy"></i></button>
                         </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Bank Name: <strong style={{color: '#fff'}}>{platformConfig.bank_name || 'Loading...'}</strong></div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Account Name: <strong style={{color: '#fff'}}>{platformConfig.account_name || 'Loading...'}</strong></div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>IBAN / Account No:</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#000', padding: '12px', borderRadius: '8px' }}>
                           <code style={{ color: '#3291ff', fontFamily: 'Space Mono', fontSize: '13px', wordBreak: 'break-all' }}>
                             {platformConfig.bank_iban || 'Loading...'}
                           </code>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Transaction Hash / Reference No.</label>
                  <input 
                    type="text" 
                    value={txHash} 
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder={method === 'crypto' ? "Paste TxID (e.g. abc123def456...)" : "Bank Reference / Cheque No."}
                    style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '14px' }}
                    required
                  />
                  <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#64748b' }}>Provide the confirmation number so Admin can verify your transfer.</p>
                </div>
               <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ width: '100%', padding: '18px', borderRadius: '14px', border: 'none', background: '#3291ff', color: '#fff', fontSize: '16px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
               >
                 {isSubmitting ? 'Processing...' : 'Submit Deposit Request'}
               </button>
               <p style={{ marginTop: '16px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
                  <i className="fa-solid fa-shield-halved" style={{ marginRight: '6px' }}></i>
                  All transactions are secure and encrypted.
               </p>
             </form>
           )}

           {activeTab === 'withdrawal' && (
             <form onSubmit={handleWithdrawal} className="animate-fade">
               <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Request Payout</h3>
               <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                  <p style={{ margin: 0, color: '#ef4444', fontSize: '13px' }}>
                     <strong>Constraint:</strong> Withdrawals are only available for verified accounts and must be sent back to the original source of funds.
                  </p>
               </div>
               <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Withdrawal Amount (USD)</label>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Min $100.00"
                    style={{ width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '18px', fontWeight: 700 }}
                    required
                  />
               </div>
               <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Security PIN</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <input 
                       type="password" 
                       maxLength="4"
                       value={withdrawalPin} 
                       onChange={(e) => setWithdrawalPin(e.target.value.replace(/\D/g, ''))} // only numbers
                       placeholder="4 Digits"
                       style={{ flex: 1, padding: '16px', letterSpacing: '4px', textAlign: 'center', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', color: '#fff', fontSize: '18px', fontWeight: 700 }}
                       required
                     />
                     <button type="button" onClick={() => setShowSetupPin(true)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '0 20px', borderRadius: '12px', cursor: 'pointer' }}>
                        Setup / Change
                     </button>
                  </div>
               </div>
               <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ width: '100%', padding: '18px', borderRadius: '14px', border: 'none', background: '#ef4444', color: '#fff', fontSize: '16px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
               >
                 {isSubmitting ? 'Processing...' : 'Initialize Withdrawal'}
               </button>
             </form>
           )}

           {activeTab === 'history' && (
             <div className="animate-fade">
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Transaction Log</h3>
                <div style={{ overflowX: 'auto' }}>
                   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                         <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ textAlign: 'left', padding: '12px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Type</th>
                            <th style={{ textAlign: 'left', padding: '12px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Amount</th>
                            <th style={{ textAlign: 'left', padding: '12px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Method</th>
                            <th style={{ textAlign: 'left', padding: '12px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                            <th style={{ textAlign: 'left', padding: '12px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                         </tr>
                      </thead>
                      <tbody>
                         {history.length === 0 ? (
                           <tr><td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No transactions found.</td></tr>
                         ) : (
                           history.map((tx, i) => (
                             <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600 }}>{tx.type}</td>
                                <td style={{ padding: '12px', fontSize: '15px', fontWeight: 800, color: tx.type === 'Deposit' ? '#00cc88' : '#ef4444', fontFamily: 'Space Mono' }}>
                                   {tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                                </td>
                                <td style={{ padding: '12px', fontSize: '13px', color: '#94a3b8', textTransform: 'capitalize' }}>{tx.method.replace('_', ' ')}</td>
                                <td style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>{tx.date}</td>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                       <span style={{ 
                                          padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, width: 'fit-content',
                                          background: tx.status === 'approved' ? 'rgba(0,204,136,0.1)' : tx.status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                                          color: tx.status === 'approved' ? '#00cc88' : tx.status === 'pending' ? '#f59e0b' : '#ef4444'
                                       }}>
                                          {tx.status}
                                       </span>
                                       {tx.status === 'rejected' && tx.reason && (
                                          <span style={{ fontSize: '10px', color: '#ff4d4d', fontStyle: 'italic' }}>
                                             Note: {tx.reason}
                                          </span>
                                       )}
                                    </div>
                                </td>
                             </tr>
                           ))
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
           )}
        </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: '1 1 300px', minWidth: 0 }}>
             <div className="card glass" style={{ padding: '24px', borderRadius: '20px' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <i className="fa-solid fa-chart-pie" style={{ color: '#3291ff' }}></i>
                 Account Metrics
              </div>
              {[
                { label: 'Equity', value: tm.equity || 0, color: '#3291ff' },
                { label: 'Margin Used', value: tm.marginUsed || 0, color: '#ef4444' },
                { label: 'Free Margin', value: tm.freeMargin || 0, color: '#00cc88' },
                { label: 'Margin Level', value: (tm.marginLevel || 0).toFixed(2) + '%', color: '#f59e0b', isPercent: true }
              ].map(m => (
                <div key={m.label} style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                   <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{m.label}</span>
                   <span style={{ fontSize: '16px', fontWeight: 800, color: m.color, fontFamily: 'Space Mono' }}>
                      {m.isPercent ? m.value : '$' + m.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   </span>
                </div>
              ))}
           </div>

           <div className="card glass" style={{ padding: '24px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(50,145,255,0.05), rgba(0,204,136,0.05))', border: '1px solid rgba(50,145,255,0.1)' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 800 }}>Need Help?</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                 Our support team is available 24/5 to assist with your funding and withdrawal needs.
              </p>
              <button style={{ marginTop: '16px', width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #3291ff', background: 'none', color: '#3291ff', fontWeight: 700, cursor: 'pointer' }}>
                 Contact Support
              </button>
           </div>
           </div>
        </div>
      </div>
      
      {/* PIN SETUP MODAL */}
      {showSetupPin && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
           <div className="card glass" style={{ width: '400px', padding: '32px', borderRadius: '24px', animation: 'scaleIn 0.3s ease' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 800 }}>Setup Withdrawal PIN</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#94a3b8' }}>Protect your funds with a 4-digit security PIN. You will need this for all future withdrawals.</p>
              
              <form onSubmit={handleSetupPin}>
                 <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>New PIN</label>
                    <input 
                      type="password" 
                      maxLength="4"
                      value={newPin} 
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      style={{ width: '100%', padding: '16px', letterSpacing: '8px', textAlign: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '24px', fontWeight: 700 }}
                      required
                      autoFocus
                    />
                 </div>
                 
                 <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" disabled={isSubmitting} onClick={() => setShowSetupPin(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" disabled={isSubmitting || newPin.length !== 4} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#3291ff', color: '#fff', fontWeight: 700, cursor: (isSubmitting || newPin.length !== 4) ? 'not-allowed' : 'pointer' }}>
                       {isSubmitting ? 'Saving...' : 'Save PIN'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Finances;
