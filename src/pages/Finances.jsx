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
  const [oldPin, setOldPin] = useState('');
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
      await axios.post(import.meta.env.VITE_API_URL + '/api/auth/pin', { pin: newPin, oldPin });
      showAlert('Withdrawal PIN secured successfully!', 'Success', 'success');
      setOldPin('');
      setNewPin('');
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', color: '#94a3b8', textAlign: 'center' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '16px' }}></i>
        <p>Syncing Wallet...</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="mobile-finances no-scrollbar">
        {/* Modern Mobile Wallet Header */}
        <header className="px-4 pt-6 pb-2">
            <div className="flex justify-between items-center mb-6">
                <div>
                   <h2 className="text-xl font-black text-white tracking-tight">My Wallet</h2>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Account #MRX-{currentClientExtended?.id}</p>
                </div>
                <div className="flex space-x-2">
                   <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <i className="fa-solid fa-bell"></i>
                   </div>
                </div>
            </div>

            {/* Premium Digital Wallet Card */}
            <div className="premium-wallet-card relative overflow-hidden rounded-[2rem] p-6 shadow-2xl shadow-indigo-500/30">
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[10px] text-indigo-100/60 font-bold uppercase tracking-[0.2em] mb-1">Available Funds</p>
                        <h3 className="text-3xl font-black text-white tracking-tight">
                           ${(tm.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                     </div>
                     <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                        <span className="text-[10px] font-black text-white uppercase">{currentClientExtended?.accountType || 'DEMO'}</span>
                     </div>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between">
                     <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-[10px] font-bold text-white uppercase">M</div>
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-300 uppercase">X</div>
                     </div>
                     <p className="text-[10px] text-indigo-100/40 font-mono tracking-widest uppercase">**** 2026</p>
                  </div>
               </div>
               {/* Pattern / Mesh Overlays */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
            </div>
        </header>

        {/* Action Grid */}
        <div className="px-4 py-6">
            <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setActiveTab('deposit')}
                  className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${activeTab === 'deposit' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}
                >
                    <i className="fa-solid fa-circle-plus text-lg"></i>
                    <span className="text-[10px] font-bold uppercase">Deposit</span>
                </button>
                <button 
                  onClick={() => setActiveTab('withdrawal')}
                  className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${activeTab === 'withdrawal' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}
                >
                    <i className="fa-solid fa-circle-minus text-lg"></i>
                    <span className="text-[10px] font-bold uppercase">Withdraw</span>
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${activeTab === 'history' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}
                >
                    <i className="fa-solid fa-clock-rotate-left text-lg"></i>
                    <span className="text-[10px] font-bold uppercase">History</span>
                </button>
            </div>
        </div>

        {/* Dynamic Content Area */}
        <section className="px-4 pb-12 animate-fade">
           {activeTab === 'deposit' && (
             <div className="glass-card p-6 space-y-6">
                <div className="flex justify-between items-center">
                   <h4 className="font-bold text-white text-lg">Deposit Funds</h4>
                   <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded-lg border border-emerald-500/20">Fast Processing</div>
                </div>

                <div className="space-y-5">
                   <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black ml-1 tracking-widest">Select Method</label>
                      <select 
                        value={method} 
                        onChange={(e) => setMethod(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 text-white text-xs outline-none appearance-none"
                      >
                         <option value="crypto">USDT (TRC20)</option>
                         <option value="bank_transfer">Bank Transfer (IBAN)</option>
                      </select>
                   </div>
                   
                   <div className="p-4 bg-indigo-500/5 border border-dashed border-indigo-500/20 rounded-2xl shadow-inner">
                      <p className="text-[9px] font-bold text-indigo-400 uppercase mb-3 flex items-center"><i className="fa-solid fa-credit-card mr-2"></i> Destination Details</p>
                      {method === 'crypto' ? (
                        <div className="space-y-3">
                           <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                              <code className="block text-[11px] text-emerald-400 break-all font-mono leading-relaxed">{platformConfig.usdt_address}</code>
                           </div>
                           <button onClick={() => navigator.clipboard.writeText(platformConfig.usdt_address)} className="w-full py-3 bg-white/5 text-slate-300 text-[10px] font-black uppercase rounded-xl border border-white/5 active:scale-95 transition-all">Copy Address</button>
                        </div>
                      ) : (
                        <div className="text-[11px] space-y-2 text-slate-300">
                           <div className="flex justify-between border-b border-white/5 pb-2"><span>Bank</span> <span className="text-white font-bold">{platformConfig.bank_name}</span></div>
                           <div className="flex flex-col space-y-1"><span>IBAN</span> <span className="text-white font-mono break-all text-[10px] bg-black/20 p-2 rounded-lg">{platformConfig.bank_iban}</span></div>
                        </div>
                      )}
                   </div>

                   <div className="space-y-2">
                       <label className="text-[9px] text-slate-500 uppercase font-black ml-1 tracking-widest">Amount to Fund</label>
                       <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                          <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl pl-8 pr-4 py-4 text-white text-xl font-black outline-none focus:border-indigo-500/50 transition-all"
                          />
                       </div>
                   </div>

                   <button 
                    onClick={handleDeposit}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
                   >
                     {isSubmitting ? 'Processing...' : 'Confirm Deposit'}
                   </button>
                </div>
             </div>
           )}

           {activeTab === 'withdrawal' && (
             <div className="glass-card p-6 space-y-6">
                <div className="flex justify-between items-center">
                   <h4 className="font-bold text-white text-lg">Instant Payout</h4>
                   <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase rounded-lg border border-indigo-500/20">Secure</div>
                </div>

                <div className="space-y-5">
                   <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black ml-1 tracking-widest">Withdrawal Amount</label>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                         <input 
                           type="number" 
                           value={amount} 
                           onChange={(e) => setAmount(e.target.value)}
                           placeholder="0.00"
                           className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl pl-8 pr-4 py-4 text-white text-xl font-black outline-none focus:border-indigo-500/50 transition-all"
                         />
                      </div>
                      <p className="text-[10px] text-rose-400/80 font-bold ml-1">Available: ${(tm.balance || 0).toLocaleString()}</p>
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black ml-1 tracking-widest">Security Pin</label>
                      <input 
                        type="password" 
                        maxLength="4"
                        value={withdrawalPin} 
                        onChange={(e) => setWithdrawalPin(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 text-white text-center text-3xl font-black tracking-[0.5em] outline-none"
                      />
                   </div>
                   
                   <button 
                    onClick={handleWithdrawal}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-slate-100 text-slate-900 font-black rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50"
                   >
                     {isSubmitting ? 'Verifying...' : 'Initialize Payout'}
                   </button>
                </div>
             </div>
           )}

           {activeTab === 'history' && (
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-1">
                    <h4 className="font-bold text-white text-lg">Activity</h4>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{history.length} Transactions</span>
                 </div>
                 <div className="space-y-3">
                    {history.length === 0 ? (
                       <div className="glass-card p-10 text-center opacity-40">
                          <i className="fa-solid fa-box-open text-3xl mb-3"></i>
                          <p className="text-xs font-bold uppercase tracking-widest">No Recent Activity</p>
                       </div>
                    ) : (
                       history.map((tx, i) => (
                          <div key={i} className="glass-card p-4 flex items-center justify-between transition-transform active:scale-[0.98]">
                             <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm shadow-inner ${tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                   <i className={`fa-solid ${tx.type === 'Deposit' ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                                </div>
                                <div>
                                   <p className="text-xs font-black text-white uppercase tracking-tight">{tx.type}</p>
                                   <p className="text-[9px] text-slate-500 font-bold uppercase">{tx.date}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className={`text-sm font-black ${tx.type === 'Deposit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                   {tx.type === 'Deposit' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString()}
                                </p>
                                <div className="flex items-center justify-end space-x-1 mt-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'approved' ? 'bg-emerald-500' : tx.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{tx.status}</span>
                                </div>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           )}
        </section>

        <style>{`
           .mobile-finances {
             display: flex;
             flex-direction: column;
             gap: 0;
             padding-bottom: 80px;
             max-width: 500px;
             margin: 0 auto;
           }
           .premium-wallet-card {
              background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%);
              border: 1px solid rgba(255, 255, 255, 0.15);
              min-height: 180px;
           }
        `}</style>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="desktop-finances-container p-8 animate-fade w-full max-w-[1400px] mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Finances</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Fund Management & Transaction Log</p>
        </div>
        <div className="premium-wallet-card px-8 py-6 rounded-[2rem] shadow-2xl flex flex-col justify-center min-w-[300px]">
           <p className="text-indigo-100/60 text-[9px] font-black uppercase tracking-widest mb-1">Available Balance</p>
           <h2 className="text-3xl font-black text-white tracking-tight">
              ${(tm.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
           </h2>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Interaction Area */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-card p-1">
             <nav className="flex bg-slate-900/40 rounded-2xl p-1.5 border border-white/5">
                {[
                  { id: 'deposit', label: 'Deposit Funds', icon: 'fa-plus-circle' },
                  { id: 'withdrawal', label: 'Withdrawal', icon: 'fa-minus-circle' },
                  { id: 'history', label: 'Transactions', icon: 'fa-clock-rotate-left' }
                ].map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex-1 py-4 px-6 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <i className={`fa-solid ${t.icon} text-sm`}></i>
                    {t.label}
                  </button>
                ))}
             </nav>
           </div>

           <div className="glass-card p-10 min-h-[500px]">
              {activeTab === 'deposit' && (
                <div className="animate-fade">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                         <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-white">Deposit Request</h3>
                         <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Select your funding source</p>
                      </div>
                   </div>

                   <form onSubmit={handleDeposit} className="grid grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase font-black ml-1 tracking-widest">Amount (USD)</label>
                            <div className="relative">
                               <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">$</span>
                               <input 
                                 type="number" 
                                 value={amount} 
                                 onChange={(e) => setAmount(e.target.value)}
                                 placeholder="5,000"
                                 className="w-full bg-slate-900/60 border border-slate-700/50 rounded-2xl pl-10 pr-6 py-5 text-white text-2xl font-black outline-none focus:border-indigo-500 transition-all shadow-inner"
                                 required
                               />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase font-black ml-1 tracking-widest">Payment Method</label>
                            <div className="grid grid-cols-2 gap-4">
                               <button 
                                type="button" 
                                onClick={() => setMethod('crypto')}
                                className={`p-4 rounded-2xl border transition-all text-left ${method === 'crypto' ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-900/40 border-slate-700/50 text-slate-500'}`}
                               >
                                  <i className="fa-brands fa-bitcoin mb-2 text-xl block"></i>
                                  <span className="text-[10px] font-black uppercase">Crypto (USDT)</span>
                               </button>
                               <button 
                                type="button" 
                                onClick={() => setMethod('bank_transfer')}
                                className={`p-4 rounded-2xl border transition-all text-left ${method === 'bank_transfer' ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-900/40 border-slate-700/50 text-slate-500'}`}
                               >
                                  <i className="fa-solid fa-building-columns mb-2 text-xl block"></i>
                                  <span className="text-[10px] font-black uppercase">Bank / IBAN</span>
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="p-6 bg-indigo-500/5 border border-dashed border-indigo-500/30 rounded-[2rem] h-full relative overflow-hidden">
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center">
                               <i className="fa-solid fa-shield-check mr-2"></i> Payment Instructions
                            </h4>
                            
                            {method === 'crypto' ? (
                               <div className="space-y-5">
                                  <div>
                                     <p className="text-[11px] text-slate-400 mb-2">Network: <strong className="text-white">TRC20 (Tron)</strong></p>
                                     <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                                        <code className="text-xs text-emerald-400 font-mono break-all">{platformConfig.usdt_address}</code>
                                        <button type="button" onClick={() => navigator.clipboard.writeText(platformConfig.usdt_address)} className="text-indigo-400 hover:text-white transition-colors"><i className="fa-regular fa-copy"></i></button>
                                     </div>
                                  </div>
                               </div>
                            ) : (
                               <div className="space-y-4 text-xs text-slate-300">
                                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Bank</span> <strong className="text-white">{platformConfig.bank_name}</strong></div>
                                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Account</span> <strong className="text-white">{platformConfig.account_name}</strong></div>
                                  <div className="space-y-2 pt-2">
                                     <span>IBAN / Account No.</span>
                                     <div className="bg-black/30 p-4 rounded-xl border border-white/5 font-mono text-indigo-400 text-[11px] break-all">{platformConfig.bank_iban}</div>
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>

                      <div className="col-span-2 pt-4">
                         <div className="space-y-2 mb-8">
                            <label className="text-[10px] text-slate-400 uppercase font-black ml-1 tracking-widest">Transaction Hash / Ref Number</label>
                            <input 
                              type="text" 
                              value={txHash} 
                              onChange={(e) => setTxHash(e.target.value)}
                              placeholder="Paste of TxID or Bank Reference"
                              className="w-full bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 text-white text-sm outline-none focus:border-indigo-500 transition-all font-mono"
                              required
                            />
                         </div>
                         <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-6 bg-indigo-600 text-white font-black text-lg rounded-[1.5rem] shadow-2xl shadow-indigo-500/30 hover:bg-indigo-500 active:scale-[0.99] transition-all disabled:opacity-50"
                         >
                            {isSubmitting ? 'Verifying Transaction...' : 'Submit Funding Request'}
                         </button>
                      </div>
                   </form>
                </div>
              )}

              {activeTab === 'withdrawal' && (
                <div className="animate-fade max-w-2xl mx-auto py-8">
                   <div className="text-center space-y-4 mb-12">
                      <div className="w-20 h-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 mx-auto">
                         <i className="fa-solid fa-vault text-3xl"></i>
                      </div>
                      <h3 className="text-3xl font-black text-white">Withdraw Funds</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Secure payout to your verified destination</p>
                   </div>

                   <form onSubmit={handleWithdrawal} className="space-y-8">
                      <div className="space-y-2">
                         <label className="text-[10px] text-slate-400 uppercase font-black ml-1 tracking-widest text-center block">Amount to Payout</label>
                         <div className="relative max-w-sm mx-auto">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-2xl">$</span>
                            <input 
                              type="number" 
                              value={amount} 
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-slate-900/60 border border-slate-700/50 rounded-3xl pl-12 pr-8 py-6 text-white text-4xl font-black outline-none focus:border-rose-500/50 text-center transition-all shadow-xl"
                              required
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] text-slate-400 uppercase font-black ml-1 tracking-widest text-center block">Verification PIN</label>
                         <div className="flex gap-4 max-w-sm mx-auto">
                            <input 
                              type="password" 
                              maxLength="4"
                              value={withdrawalPin} 
                              onChange={(e) => setWithdrawalPin(e.target.value.replace(/\D/g, ''))}
                              placeholder="••••"
                              className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-3xl p-6 text-white text-4xl font-black outline-none focus:border-rose-500/50 text-center tracking-[0.5em] transition-all shadow-xl"
                              required
                            />
                            <button type="button" onClick={() => setShowSetupPin(true)} className="px-6 rounded-3xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50 transition-all font-bold text-[10px] uppercase">Reset</button>
                         </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-6 bg-slate-100 text-slate-900 font-black text-lg rounded-[2rem] shadow-2xl hover:bg-white active:scale-[0.99] transition-all"
                      >
                         {isSubmitting ? 'Securing Transaction...' : 'Initialize Payout'}
                      </button>
                   </form>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="animate-fade">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-white">Activity Log</h3>
                      <div className="flex space-x-2">
                         <div className="px-4 py-2 bg-slate-800/60 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5">Export CSV</div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      {history.length === 0 ? (
                        <div className="py-20 text-center opacity-30">
                           <i className="fa-solid fa-receipt text-6xl mb-6"></i>
                           <p className="text-lg font-black uppercase tracking-[0.2em]">No History Found</p>
                        </div>
                      ) : (
                        history.map((tx, i) => (
                           <div key={i} className="glass-card hover:bg-white/5 transition-all p-6 flex items-center justify-between group">
                              <div className="flex items-center space-x-6">
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    <i className={`fa-solid ${tx.type === 'Deposit' ? 'fa-arrow-down-left' : 'fa-arrow-up-right'}`}></i>
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="font-black text-white uppercase text-base tracking-tight">{tx.type}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">{tx.date} • {tx.method.replace('_', ' ')}</p>
                                 </div>
                              </div>
                              <div className="text-right flex items-center space-x-12">
                                 <div className="space-y-1">
                                    <p className={`text-xl font-black ${tx.type === 'Deposit' ? 'text-emerald-400' : 'text-rose-400'} font-mono`}>
                                       {tx.type === 'Deposit' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                    <div className="flex items-center justify-end space-x-2">
                                       <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'approved' ? 'bg-emerald-500' : tx.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                       <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.1em]">{tx.status}</span>
                                    </div>
                                 </div>
                                 <div className="w-10 h-10 rounded-xl bg-slate-800/40 hidden group-hover:flex items-center justify-center text-slate-500 cursor-pointer hover:text-white transition-all border border-white/5">
                                    <i className="fa-solid fa-chevron-right"></i>
                                 </div>
                              </div>
                           </div>
                        ))
                      )}
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-8">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-white/5">Account Metrics</h4>
              <div className="space-y-6">
                 {[
                   { label: 'Equity', value: tm.equity || 0, color: 'text-indigo-400' },
                   { label: 'Margin Used', value: tm.marginUsed || 0, color: 'text-rose-400' },
                   { label: 'Free Margin', value: tm.freeMargin || 0, color: 'text-emerald-400' },
                   { label: 'Margin Level', value: (tm.marginLevel || 0).toFixed(2) + '%', color: 'text-amber-400', isPercent: true }
                 ].map(m => (
                   <div key={m.label} className="flex justify-between items-end bg-slate-900/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">{m.label}</span>
                      <span className={`text-lg font-black ${m.color} font-mono`}>
                         {m.isPercent ? m.value : '$' + m.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-10 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/5 relative overflow-hidden">
              <div className="relative z-10">
                 <h4 className="text-xl font-black text-white mb-3">Priority Support</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-bold">
                    Need instant assistance with your withdrawal? Our financial desk is open 24/5.
                 </p>
                 <button className="mt-8 w-full py-4 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-500/30 rounded-2xl transition-all font-black text-xs uppercase tracking-widest">
                    Open Ticket
                 </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16"></div>
           </div>
        </div>
      </div>
      
      {/* SHARED MODAL STYLES & PIN SETUP */}
      {showSetupPin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-fade">
           <div className="glass-card w-full max-w-md p-10 space-y-8 animate-scale-up">
              <div className="text-center">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20 mx-auto mb-6">
                    <i className="fa-solid fa-lock-keyhole text-2xl"></i>
                 </div>
                 <h3 className="text-2xl font-black text-white">Security PIN</h3>
                 <p className="text-xs text-slate-400 font-bold mt-2">Protect your withdrawals with a secret 4-digit code</p>
              </div>
              
              <form onSubmit={handleSetupPin} className="space-y-6">
                 {currentClientExtended?.hasPin && (
                   <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase font-black ml-1 block text-center">Existing PIN</label>
                      <input 
                        type="password" 
                        maxLength="4"
                        value={oldPin} 
                        onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 text-white text-3xl font-black text-center tracking-[1em] outline-none"
                        required
                      />
                   </div>
                 )}
                 <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-black ml-1 block text-center">Set New PIN</label>
                    <input 
                      type="password" 
                      maxLength="4"
                      value={newPin} 
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 text-white text-3xl font-black text-center tracking-[1em] outline-none"
                      required
                    />
                 </div>
                 
                 <div className="flex gap-4 pt-4">
                    <button type="button" disabled={isSubmitting} onClick={() => setShowSetupPin(false)} className="flex-1 py-4 bg-slate-800 text-slate-400 hover:text-white font-black rounded-2xl transition-all uppercase text-xs">Cancel</button>
                    <button type="submit" disabled={isSubmitting || newPin.length !== 4} className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/30 transition-all uppercase text-xs">
                       {isSubmitting ? 'Saving...' : 'Lock Access'}
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
