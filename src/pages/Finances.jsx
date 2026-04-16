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
      <div className="mobile-finances no-scrollbar" style={{ paddingBottom: '80px' }}>
        {/* Modern Mobile Wallet Header */}
        <header className="pt-4 pb-2">
            <div className="flex justify-between items-center mb-5">
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
            <div className="relative overflow-hidden rounded-[2rem] p-6 shadow-2xl shadow-indigo-500/30 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 w-full shrink-0">
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest mb-1">Available Funds</p>
                        <h3 className="text-3xl font-black text-white tracking-tight truncate max-w-[200px]">
                           ${(tm.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                     </div>
                     <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shrink-0">
                        <span className="text-[10px] font-black text-white uppercase">{currentClientExtended?.accountType || 'DEMO'}</span>
                     </div>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between">
                     <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-[10px] font-bold text-white uppercase">M</div>
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-300 uppercase">X</div>
                     </div>
                     <p className="text-[10px] text-indigo-100/60 font-mono tracking-widest uppercase">**** 2026</p>
                  </div>
               </div>
               {/* Pattern / Mesh Overlays */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl"></div>
            </div>
        </header>

        {/* Action Grid */}
        <div className="py-5">
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
        <section className="pb-4 animate-fade">
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
      </div>
    );
  }

  // Desktop View
  return (
    <div className="desktop-finances-container p-6 xl:p-8 animate-fade w-full h-full relative" style={{ gridColumn: '1 / -1', minWidth: '100%' }}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
              <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tighter">Finances</h1>
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] ml-5">Institutional Grade Asset Management</p>
          </div>
          
          {/* Dynamic Global Wallet Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-8 py-6 rounded-[2rem] shadow-2xl flex flex-col justify-between w-full md:w-[400px] animate-slide-up shrink-0 border border-white/10" style={{ minHeight: '180px' }}>
             {/* Radial Glare */}
             <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>
             
             <div className="relative z-10 flex justify-between items-start">
                <div>
                   <p className="text-indigo-100 font-bold text-[10px] uppercase tracking-widest mb-1">Available Portfolio Balance</p>
                   <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight truncate max-w-[220px]">
                      ${(tm.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                   </h2>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0">
                   <i className="fa-solid fa-wallet"></i>
                </div>
             </div>
             
             <div className="relative z-10 flex justify-between items-end border-t border-white/20 pt-4 mt-6">
                <div className="space-y-1">
                   <p className="text-indigo-200 text-[9px] font-bold uppercase tracking-widest">Account ID</p>
                   <p className="text-white text-xs font-mono">MRX-{currentClientExtended?.id?.toString().padStart(6, '0')}</p>
                </div>
                <div className="flex -space-x-3 shrink-0">
                   <div className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white shadow-md">VISA</div>
                   <div className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-slate-900 flex items-center justify-center text-[10px] font-black text-indigo-400 shadow-md">MC</div>
                </div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          {/* Main Interaction Area */}
          <div className="col-span-1 lg:col-span-8 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
             <div className="segmented-control p-1">
                {[
                  { id: 'deposit', label: 'Fund Account', icon: 'fa-plus-circle' },
                  { id: 'withdrawal', label: 'Secure Payout', icon: 'fa-minus-circle' },
                { id: 'history', label: 'Global Ledger', icon: 'fa-clock-rotate-left' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 relative py-3 px-4 xl:py-4 xl:px-6 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2 xl:gap-3 uppercase tracking-[0.1em] xl:tracking-[0.2em] z-10 ${activeTab === t.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {activeTab === t.id && (
                    <div className="absolute inset-0 bg-indigo-600 rounded-lg shadow-xl shadow-indigo-500/20 -z-10 animate-fade"></div>
                  )}
                  <i className={`fa-solid ${t.icon} ${activeTab === t.id ? 'text-white' : 'text-slate-600'} text-sm`}></i>
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
           </div>

           <div className="glass-card p-6 xl:p-10 relative overflow-hidden">
              {/* Decorative Mesh background for content area */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[120px] -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/5 blur-[120px] -ml-32 -mb-32"></div>
              
              <div className="relative z-10">
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
                   <form onSubmit={handleDeposit} className="space-y-8">
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                         <div className="space-y-6">
                            <div className="space-y-3">
                               <label className="text-[10px] text-slate-500 uppercase font-black ml-1 tracking-[0.2em]">Select Payment Methodology</label>
                               <div className="grid grid-cols-2 gap-4">
                                  <button 
                                   type="button" 
                                   onClick={() => setMethod('crypto')}
                                   className={`method-card p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 text-center ${method === 'crypto' ? 'active' : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'}`}
                                  >
                                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${method === 'crypto' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-600'}`}>
                                        <i className="fa-brands fa-bitcoin"></i>
                                     </div>
                                     <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest block">USDT (TRC20)</span>
                                        <span className="text-[8px] font-bold text-slate-500 uppercase">Instant Crypto</span>
                                     </div>
                                  </button>
                                  <button 
                                   type="button" 
                                   onClick={() => setMethod('bank_transfer')}
                                   className={`method-card p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 text-center ${method === 'bank_transfer' ? 'active' : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'}`}
                                  >
                                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${method === 'bank_transfer' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-600'}`}>
                                        <i className="fa-solid fa-building-columns"></i>
                                     </div>
                                     <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest block">Bank Wire</span>
                                        <span className="text-[8px] font-bold text-slate-500 uppercase">SWIFT / SEPA / IBAN</span>
                                     </div>
                                  </button>
                               </div>
                            </div>

                            <div className="space-y-3">
                               <label className="text-[10px] text-slate-500 uppercase font-black ml-1 tracking-[0.2em]">Deposit Amount (USD)</label>
                               <div className="relative group">
                                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xl group-focus-within:text-indigo-500 transition-colors">$</div>
                                  <input 
                                    type="number" 
                                    value={amount} 
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="5,000"
                                    className="w-full input-premium rounded-2xl pl-10 pr-6 py-5 text-white text-2xl font-black outline-none"
                                    required
                                  />
                               </div>
                               <div className="flex gap-2">
                                  {[100, 500, 1000, 5000].map(v => (
                                    <button key={v} type="button" onClick={() => setAmount(v.toString())} className="flex-1 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-[9px] font-black text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all uppercase">+${v}</button>
                                  ))}
                               </div>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="p-6 bg-indigo-600/5 border border-dashed border-indigo-500/20 rounded-3xl relative overflow-hidden backdrop-blur-sm">
                               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                  Payment Instructions
                               </h4>
                               
                               {method === 'crypto' ? (
                                  <div className="space-y-4">
                                     <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                                        <div className="flex justify-between items-center">
                                           <p className="text-[9px] text-slate-500 font-black uppercase">TRC20 Wallet Address</p>
                                           <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-black">Active</span>
                                        </div>
                                        <div className="flex items-start gap-3 bg-slate-900 border border-white/5 p-3 rounded-xl">
                                           <code className="flex-1 text-xs text-emerald-400 font-mono break-all leading-relaxed">{platformConfig.usdt_address}</code>
                                           <button type="button" onClick={() => {
                                             navigator.clipboard.writeText(platformConfig.usdt_address);
                                             showAlert('Address copied to clipboard', 'Copied', 'success');
                                           }} className="w-8 h-8 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400 hover:bg-white/10 transition-all"><i className="fa-regular fa-copy text-xs"></i></button>
                                        </div>
                                     </div>
                                     <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                                        <i className="fa-solid fa-circle-info mr-2 text-indigo-500"></i>
                                        Only send <strong className="text-indigo-400">USDT via TRC20</strong> network.
                                     </p>
                                  </div>
                               ) : (
                                  <div className="space-y-3 text-xs text-slate-400">
                                     <div className="flex justify-between bg-slate-900/40 p-3 rounded-xl border border-white/5"><span>Bank Name</span> <strong className="text-white uppercase font-black">{platformConfig.bank_name}</strong></div>
                                     <div className="flex justify-between bg-slate-900/40 p-3 rounded-xl border border-white/5"><span>Beneficiary</span> <strong className="text-white uppercase font-black">{platformConfig.account_name}</strong></div>
                                     <div className="space-y-2">
                                        <p className="text-[9px] text-slate-500 font-black uppercase">IBAN / Account Number</p>
                                        <div className="bg-slate-900 p-4 rounded-2xl border border-indigo-500/20 font-mono text-indigo-400 text-xs break-all shadow-inner">
                                           {platformConfig.bank_iban}
                                        </div>
                                     </div>
                                  </div>
                               )}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] text-slate-500 uppercase font-black ml-1 tracking-[0.2em]">Transaction Hash / Digital Receipt</label>
                         <input 
                           type="text" 
                           value={txHash} 
                           onChange={(e) => setTxHash(e.target.value)}
                           placeholder="e.g. 0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                           className="w-full input-premium rounded-2xl p-5 text-white text-sm outline-none font-mono"
                           required
                         />
                      </div>
                      <button 
                         type="submit" 
                         disabled={isSubmitting}
                         className="w-full py-6 bg-indigo-600 text-white font-black text-lg rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] hover:bg-indigo-500 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                      >
                         {isSubmitting ? (
                           <>
                             <i className="fa-solid fa-circle-notch fa-spin"></i>
                             VALIDATING...
                           </>
                         ) : (
                           <>
                             <i className="fa-solid fa-shield-check"></i>
                             INITIATE DEPOSIT REQUEST
                           </>
                         )}
                      </button>
                   </form>
                </div>
              )}

              {activeTab === 'withdrawal' && (
                <div className="animate-fade max-w-2xl mx-auto py-12">
                   <div className="text-center space-y-6 mb-16 px-4">
                      <div className="w-24 h-24 rounded-[3rem] bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 mx-auto shadow-2xl shadow-rose-500/10">
                         <i className="fa-solid fa-vault text-4xl"></i>
                      </div>
                      <div className="space-y-2">
                         <h3 className="text-4xl font-black text-white tracking-tight">Withdrawal Hub</h3>
                         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Authorized Secure Payout Gateway</p>
                      </div>
                   </div>

                   <form onSubmit={handleWithdrawal} className="space-y-12 bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-slate-900 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-xl">Verification Required</div>
                      
                      <div className="space-y-4">
                         <label className="text-[10px] text-slate-500 uppercase font-black ml-1 tracking-[0.2em] text-center block">Capital Amount for Payout</label>
                         <div className="relative max-w-md mx-auto group">
                            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-3xl group-focus-within:text-rose-500 transition-colors">$</span>
                            <input 
                              type="number" 
                              value={amount} 
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full input-premium rounded-[2.5rem] pl-16 pr-8 py-8 text-white text-5xl font-black outline-none text-center shadow-2xl transition-all"
                              required
                            />
                         </div>
                         <div className="flex justify-center items-center gap-3">
                            <div className="h-px w-8 bg-slate-800"></div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Available: <span className="text-rose-400">${(tm.balance || 0).toLocaleString()}</span></p>
                            <div className="h-px w-8 bg-slate-800"></div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] text-slate-500 uppercase font-black ml-1 tracking-[0.2em] text-center block">Security Access Pin</label>
                         <div className="flex flex-col items-center gap-6">
                            <div className="relative max-w-sm w-full">
                               <input 
                                 type="password" 
                                 maxLength="4"
                                 value={withdrawalPin} 
                                 onChange={(e) => setWithdrawalPin(e.target.value.replace(/\D/g, ''))}
                                 placeholder="••••"
                                 className="w-full input-premium rounded-2xl p-6 text-white text-5xl font-black outline-none text-center tracking-[0.8em] shadow-xl"
                                 required
                               />
                               <button type="button" onClick={() => setShowSetupPin(true)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all flex items-center justify-center"><i className="fa-solid fa-key text-xs"></i></button>
                            </div>
                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed text-center max-w-xs transition-opacity hover:opacity-100 opacity-60">
                               Forgotten your PIN? Click the key icon to reset your secure withdrawal access.
                            </p>
                         </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-8 bg-white text-slate-950 font-black text-xl rounded-[2.5rem] shadow-2xl shadow-rose-500/10 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                      >
                         {isSubmitting ? (
                           <>
                             <i className="fa-solid fa-spinner-third fa-spin"></i>
                             ENCRYPTING PAYOUT...
                           </>
                         ) : (
                           <>
                             <i className="fa-solid fa-paper-plane-top"></i>
                             AUTHORIZE INSTANT WITHDRAWAL
                           </>
                         )}
                      </button>
                   </form>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="animate-fade">
                   <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                            <i className="fa-solid fa-list-timeline text-xl"></i>
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white tracking-tight">Financial Ledger</h3>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Global Activity Records</p>
                         </div>
                      </div>
                      <div className="flex gap-3">
                         <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5 transition-all">Filter by Date</button>
                         <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all">Export Archive</button>
                      </div>
                   </div>

                   <div className="space-y-2 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
                      {history.length === 0 ? (
                        <div className="py-32 text-center opacity-20">
                           <i className="fa-solid fa-receipt text-8xl mb-8"></i>
                           <p className="text-xl font-black uppercase tracking-[0.4em]">Vault Archive Empty</p>
                        </div>
                      ) : (
                        history.map((tx, i) => (
                          <div key={i} className="transaction-row p-6 flex items-center justify-between group rounded-2xl hover:border-white/10 border border-transparent">
                             <div className="flex items-center space-x-8">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner relative ${tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                   <i className={`fa-solid ${tx.type === 'Deposit' ? 'fa-arrow-down-left' : 'fa-arrow-up-right'}`}></i>
                                   <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0f172a] ${tx.status === 'approved' ? 'bg-emerald-500' : tx.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                </div>
                                <div className="space-y-1.5">
                                   <div className="flex items-center gap-3">
                                      <h4 className="font-black text-white uppercase text-lg tracking-tight">{tx.type}</h4>
                                      <span className="text-[8px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded uppercase font-black">{tx.method.replace('_', ' ')}</span>
                                   </div>
                                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
                                      <i className="fa-regular fa-calendar text-[8px]"></i>
                                      {tx.date}
                                      <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                      ID: MRX-{tx._id?.substring(0,6).toUpperCase()}
                                   </p>
                                </div>
                             </div>
                             <div className="text-right flex items-center space-x-12">
                                <div className="space-y-1.5">
                                   <p className={`text-2xl font-black ${tx.type === 'Deposit' ? 'text-emerald-400' : 'text-rose-400'} font-mono leading-none`}>
                                      {tx.type === 'Deposit' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                   </p>
                                   <div className={`status-pill ${tx.status === 'approved' ? 'status-approved' : tx.status === 'pending' ? 'status-pending' : 'status-rejected'}`}>
                                      {tx.status}
                                   </div>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-slate-800/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-500 cursor-pointer hover:text-white hover:bg-indigo-600 transition-all border border-white/5 active:scale-95">
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

        <div className="lg:col-span-4 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
           <div className="glass-card p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
              
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 border border-white/5 shadow-inner">
                       <i className="fa-solid fa-chart-line-up text-sm"></i>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Capital Metrics</h4>
                       <p className="text-[8px] text-slate-600 font-bold uppercase">Real-time valuation</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {[
                      { label: 'Portfolio Equity', value: tm.equity || 0, color: 'text-indigo-400', icon: 'fa-layer-group' },
                      { label: 'Utilized Margin', value: tm.marginUsed || 0, color: 'text-rose-400', icon: 'fa-shield-halved' },
                      { label: 'Liquidity Available', value: tm.freeMargin || 0, color: 'text-emerald-400', icon: 'fa-droplet' },
                      { label: 'Security Level', value: (tm.marginLevel || 0).toFixed(2) + '%', color: 'text-amber-400', icon: 'fa-gauge-high', isPercent: true }
                    ].map(m => (
                      <div key={m.label} className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/20 hover:bg-slate-900/80 transition-all group/metric">
                         <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-xs text-slate-500 group-hover/metric:${m.color} transition-colors`}>
                               <i className={`fa-solid ${m.icon}`}></i>
                            </div>
                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{m.label}</span>
                         </div>
                         <span className={`text-xl font-black ${m.color} font-mono tracking-tighter`}>
                            {m.isPercent ? m.value : '$' + m.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                         </span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="glass-card p-10 bg-gradient-to-br from-indigo-600/10 via-transparent to-fuchsia-600/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-[100px] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                 <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-indigo-600/20 mb-8 transform group-hover:rotate-6 transition-transform">
                    <i className="fa-solid fa-headset"></i>
                 </div>
                 <h4 className="text-2xl font-black text-white mb-4 tracking-tight">Institutional Support</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium mb-10">
                    Access our dedicated financial engineering desk for prioritized withdrawal facilitation and capital deployment assistance.
                 </p>
                 <button className="w-full py-5 bg-indigo-600 text-white hover:bg-indigo-500 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                    <i className="fa-solid fa-messages"></i>
                    Open Priority Ticket
                 </button>
              </div>
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
  </div>
  </div>
  );
};

export default Finances;
