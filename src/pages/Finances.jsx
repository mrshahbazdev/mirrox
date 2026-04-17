import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';
import { useModal } from '../context/ModalContext';
import { 
    Wallet, PlusCircle, MinusCircle, History, Shield, 
    ArrowDownLeft, ArrowUpRight, Copy, CheckCircle2, 
    CreditCard, Building2, Landmark, Smartphone, 
    Zap, Headphones, Info, ExternalLink, RefreshCw,
    Lock, Key, Send, AlertCircle
} from 'lucide-react';

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

  const formatCurrency = (val) => (val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[var(--text-muted)]">
        <RefreshCw className="animate-spin mb-4 text-[var(--accent)]" size={40} />
        <p className="font-bold uppercase tracking-widest text-xs">Syncing Financial Node...</p>
      </div>
    );

  return (
    <div className="finances-page-v3 animate-fade-in no-scrollbar">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-muted)] blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--accent-muted)] blur-[100px] rounded-full pointer-events-none"></div>

      <div className="finances-container max-w-[1400px] mx-auto p-4 md:p-8 xl:p-12">
        {/* --- HEADER --- */}
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--text-main)] tracking-tighter flex items-center gap-4">
              <span className="w-2 h-10 bg-[var(--accent)] rounded-full"></span>
              Wallet
            </h1>
            <p className="text-[var(--text-muted)] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] ml-6">
              Institutional Asset Management • Bullvera
            </p>
          </div>

          <div className="premium-wallet-card-v3">
            <div className="card-top">
              <div className="balance-group">
                <span className="label">Portfolio Balance</span>
                <h2 className="balance">${formatCurrency(tm.balance)}</h2>
              </div>
              <div className="wallet-chip">
                <Wallet size={24} strokeWidth={1.5} />
              </div>
            </div>
            <div className="card-bottom">
              <div className="account-info">
                <span className="label">Account Node</span>
                <span className="value">BVR-{currentClientExtended?.id?.toString().padStart(6, '0')}</span>
              </div>
              <div className="network-labels">
                <span className="network">USDT</span>
                <span className="network">BANK</span>
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: ACTIONS & LEDGER */}
          <div className="lg:col-span-8 space-y-8">
            {/* SEGMENTED TABS */}
            <div className="segmented-tabs-v3 p-1.5 flex bg-black/40 border border-white/5 rounded-2xl backdrop-blur-xl">
              {[
                { id: 'deposit', label: 'Deposit', icon: <PlusCircle size={18} /> },
                { id: 'withdrawal', label: 'Withdraw', icon: <MinusCircle size={18} /> },
                { id: 'history', label: 'History', icon: <History size={18} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* DYNAMIC FORM AREA */}
            <div className="fin-action-card-v3 bg-black/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-3xl relative overflow-hidden group">
              {/* CONTENT */}
              <div className="relative z-10 transition-all duration-500 animate-slide-up">
                {activeTab === 'deposit' && (
                  <div className="space-y-10">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                      <div className="w-14 h-14 bg-[#FF4D5E]/10 text-[#FF4D5E] rounded-2xl flex items-center justify-center border border-[#FF4D5E]/20">
                        <PlusCircle size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Fund Account</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Select methodology & amount</p>
                      </div>
                    </div>

                    <form onSubmit={handleDeposit} className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* LEFT COLUMN: METHOD & AMOUNT */}
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-1">Payment Methodology</label>
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                type="button"
                                onClick={() => setMethod('crypto')}
                                className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group/method ${method === 'crypto' ? 'bg-[#FF4D5E]/10 border-[#FF4D5E]/40 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                                >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${method === 'crypto' ? 'bg-[#FF4D5E] text-white' : 'bg-white/5 text-slate-600'}`}>
                                  <Zap size={20} />
                                </div>
                                <span className="block text-xs font-black uppercase tracking-widest">USDT (TRC20)</span>
                                <span className="text-[9px] font-bold text-slate-600 block mt-1">Instant Crypto</span>
                                {method === 'crypto' && <div className="absolute top-3 right-3 w-2 h-2 bg-[#FF4D5E] rounded-full animate-pulse"></div>}
                              </button>

                              <button
                                type="button"
                                onClick={() => setMethod('bank_transfer')}
                                className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group/method ${method === 'bank_transfer' ? 'bg-[#FF4D5E]/10 border-[#FF4D5E]/40 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                                >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${method === 'bank_transfer' ? 'bg-[#FF4D5E] text-white' : 'bg-white/5 text-slate-600'}`}>
                                  <Landmark size={20} />
                                </div>
                                <span className="block text-xs font-black uppercase tracking-widest">Bank Wire</span>
                                <span className="text-[9px] font-bold text-slate-600 block mt-1">Global IBAN</span>
                                {method === 'bank_transfer' && <div className="absolute top-3 right-3 w-2 h-2 bg-[#FF4D5E] rounded-full animate-pulse"></div>}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-1">Deposit Amplitude (USD)</label>
                            <div className="relative group">
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-2xl group-focus-within:text-[#FF4D5E] transition-colors">$</span>
                              <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-white/5 border border-white/5 rounded-[2rem] pl-12 pr-8 py-8 text-white text-4xl font-black outline-none focus:border-[#FF4D5E]/40 focus:bg-[#FF4D5E]/5 transition-all"
                                required
                              />
                            </div>
                            <div className="flex gap-2">
                              {[500, 1000, 5000].map(v => (
                                <button key={v} type="button" onClick={() => setAmount(v.toString())} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black text-slate-400 hover:bg-white/10 hover:text-white transition-all">+${v.toLocaleString()}</button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: INSTRUCTIONS */}
                        <div className="space-y-6">
                          <div className="instructions-card p-8 rounded-[2rem] bg-[#FF4D5E]/5 border border-dashed border-[#FF4D5E]/20">
                            <h4 className="flex items-center gap-3 text-[10px] font-black text-[#FF4D5E] uppercase tracking-widest mb-6">
                              <Info size={14} />
                              Transfer Protocol
                            </h4>

                            {method === 'crypto' ? (
                              <div className="space-y-6">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] text-slate-500 uppercase font-black">Destination Wallet</span>
                                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-black">Active</span>
                                  </div>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-4 rounded-2xl group/copy">
                                    <code className="flex-1 text-xs text-emerald-400 font-mono break-all leading-relaxed">{platformConfig.usdt_address}</code>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(platformConfig.usdt_address);
                                        showAlert('Address copied to clipboard', 'Copied', 'success');
                                      }}
                                      className="shrink-0 w-10 h-10 bg-white/5 hover:bg-white/10 text-[#FF4D5E] rounded-xl transition-all flex items-center justify-center"
                                    >
                                      <Copy size={16} />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                                  <AlertCircle size={10} className="inline mr-1 text-[#FF4D5E]" />
                                  Only transmit <strong className="text-white">USDT via the TRC20 (Tron)</strong> network. Assets sent over other bridges will be permanently lost.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[11px] p-3 rounded-xl bg-black/20 border border-white/5">
                                    <span className="text-slate-500 uppercase font-black">Bank</span>
                                    <span className="text-white font-bold">{platformConfig.bank_name}</span>
                                  </div>
                                  <div className="flex justify-between text-[11px] p-3 rounded-xl bg-black/20 border border-white/5">
                                    <span className="text-slate-500 uppercase font-black">Holder</span>
                                    <span className="text-white font-bold">{platformConfig.account_name}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <span className="text-[9px] text-slate-500 uppercase font-black ml-1">Transfer IBAN</span>
                                  <div className="p-4 bg-black/50 border border-[#FF4D5E]/20 rounded-2xl text-[#FF4D5E] font-mono text-xs break-all shadow-inner">
                                    {platformConfig.bank_iban}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-1">Transaction Proof / Hash</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                            placeholder="Paste your transaction hash or reference here..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-white text-sm outline-none font-mono focus:border-[#FF4D5E]/40 transition-all"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-8 bg-[#FF4D5E] hover:bg-[#ff7582] text-white rounded-[2.5rem] font-black text-lg tracking-widest shadow-2xl shadow-[#FF4D5E]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="animate-spin" size={24} />
                            Validating Transmission...
                          </>
                        ) : (
                          <>
                            <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Submit Funding Request
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'withdrawal' && (
                  <div className="max-w-2xl mx-auto py-10 space-y-12">
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-[#FF4D5E]/10 text-[#FF4D5E] flex items-center justify-center border border-[#FF4D5E]/20 mx-auto shadow-2xl shadow-[#FF4D5E]/10">
                        <Shield size={44} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-4xl font-black text-white uppercase tracking-tight">Withdraw Assets</h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Authorized Secure Payout Gateway</p>
                      </div>
                    </div>

                    <form onSubmit={handleWithdrawal} className="space-y-12 bg-black/40 p-10 rounded-[3rem] border border-white/5 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-white/10 px-6 py-2 rounded-full shadow-2xl">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Digital Authentication Required</span>
                      </div>

                      <div className="space-y-5 text-center">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Capital Amount (USD)</label>
                        <div className="relative max-w-sm mx-auto group">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-4xl group-focus-within:text-white transition-colors">$</span>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-white/5 border border-white/5 rounded-[2.5rem] text-center text-5xl font-black text-white py-10 outline-none focus:bg-white/10 focus:border-white/10 transition-all"
                            required
                          />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Liquid Balance: <span className="text-[#FF4D5E]">${formatCurrency(tm.balance)}</span>
                        </p>
                      </div>

                      <div className="space-y-5 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Access Key</label>
                          <button type="button" onClick={() => setShowSetupPin(true)} className="text-[10px] text-[#FF4D5E] font-black uppercase hover:underline">Reset PIN</button>
                        </div>
                        <input
                          type="password"
                          maxLength="4"
                          value={withdrawalPin}
                          onChange={(e) => setWithdrawalPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••"
                          className="w-48 bg-white/5 border border-white/5 rounded-2xl mx-auto block text-center text-5xl font-black text-white tracking-[0.6em] py-6 outline-none focus:border-[#FF4D5E]/40 transition-all"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-white/5"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="animate-spin" size={24} />
                            Encrypting Payout...
                          </>
                        ) : (
                          <>
                            <Lock size={24} />
                            Initialize Payout
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#FF4D5E]/10 text-[#FF4D5E] rounded-2xl flex items-center justify-center border border-[#FF4D5E]/10">
                          <History size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Ledger Matrix</h3>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Historical Asset Activity</p>
                        </div>
                      </div>
                      <div className="flex gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-6 py-4 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-xl border border-slate-200 hover:bg-slate-200 transition-all tracking-widest">Export Ledger</button>
                      </div>
                    </div>

                    <div className="ledger-rows-v3 space-y-3 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
                      {history.length === 0 ? (
                        <div className="py-32 flex flex-col items-center opacity-30">
                          <AlertCircle size={80} className="mb-6" />
                          <p className="text-xl font-black uppercase tracking-[0.4em]">Vault Uninitialized</p>
                        </div>
                      ) : (
                        history.map((tx, idx) => (
                          <div key={idx} className="tx-row-v3 group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm">
                            <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative shadow-sm ${tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-pub-red/10 text-pub-red'}`}>
                                {tx.type === 'Deposit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${tx.status === 'approved' ? 'bg-emerald-500' : tx.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-3">
                                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{tx.type}</h4>
                                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-500 rounded">{tx.method.replace('_', ' ')}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                  {tx.date}
                                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                  BVR-{tx._id?.substring(0, 8).toUpperCase() || 'EXTERNAL'}
                                </p>
                              </div>
                            </div>

                            <div className="text-right flex items-center gap-8">
                              <div className="space-y-1.5">
                                <p className={`text-2xl font-black font-mono leading-none ${tx.type === 'Deposit' ? 'text-emerald-600' : 'text-pub-red'}`}>
                                  {tx.type === 'Deposit' ? '+' : '-'}${formatCurrency(tx.amount)}
                                </p>
                                <div className={`status-badge-v3 ${tx.status}`}>
                                  <div className="dot"></div>
                                  <span>{tx.status}</span>
                                </div>
                              </div>
                              <button className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:text-slate-900 hover:bg-slate-200">
                                <ExternalLink size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: METRICS & SUPPORT */}
          <div className="lg:col-span-4 space-y-8">
            {/* PORTFOLIO METRICS */}
            <div className="glass-metric-card-v3 p-10 bg-white border border-slate-200 rounded-[2.5rem] relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4D5E]/5 blur-[80px] -mr-16 -mt-16 group-hover:bg-[#FF4D5E]/10 transition-all duration-700"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Risk Assessment</h4>
                    <p className="text-[8px] text-slate-300 font-black uppercase">Institutional Grade Metrics</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Total Equity', value: tm.equity, color: 'text-[#FF4D5E]', icon: <Wallet size={14} /> },
                    { label: 'Utilized Margin', value: tm.marginUsed, color: 'text-pub-red', icon: <CreditCard size={14} /> },
                    { label: 'Free Liquidity', value: tm.freeMargin, color: 'text-emerald-600', icon: <zap size={14} /> },
                    { label: 'Security Level', value: (tm.marginLevel || 0).toFixed(2) + '%', color: 'text-amber-600', icon: <Shield size={14} />, isPercent: true }
                  ].map(metric => (
                    <div key={metric.label} className="metric-row-v3 flex justify-between items-center p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-slate-200 transition-all group/m">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover/m:${metric.color} transition-colors shadow-sm`}>
                          {metric.icon}
                        </div>
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{metric.label}</span>
                      </div>
                      <span className={`text-xl font-black font-mono tracking-tighter ${metric.color}`}>
                        {metric.isPercent ? metric.value : '$' + formatCurrency(metric.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK SUPPORT */}
            <div className="support-promo-v3 p-10 bg-[#FF4D5E] rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-[#FF4D5E]/20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[100px] -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
              
              <div className="relative z-10 space-y-8 flex flex-col h-full">
                <div className="w-16 h-16 bg-white text-[#FF4D5E] rounded-2xl flex items-center justify-center text-2xl shadow-xl transform group-hover:rotate-6 transition-transform">
                  <Headphones size={32} />
                </div>
                <div className="space-y-4">
                  <h4 className="text-3xl font-black text-white uppercase tracking-tight leading-none">Financial Desk</h4>
                  <p className="text-white/60 text-xs font-bold leading-relaxed">
                    Prioritized assistance for high-volume capital deployments and expedited payout verification cycles.
                  </p>
                </div>
                <button className="w-full py-5 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
                  <Smartphone size={14} />
                  Connect With Specialist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SETUP PIN MODAL --- */}
      {showSetupPin && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/40 animate-fade-in">
          <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-muted)] blur-[80px] -mr-16 -mt-16"></div>
             
             <div className="relative z-10">
                <div className="text-center space-y-6 mb-12">
                   <div className="w-20 h-20 rounded-[1.8rem] bg-[var(--accent-muted)] text-[var(--accent)] flex items-center justify-center border border-[var(--accent-muted)] mx-auto">
                      <Key size={36} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tight">Security Access</h3>
                      <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">Platform Withdrawal Credentials</p>
                   </div>
                </div>

                <form onSubmit={handleSetupPin} className="space-y-8">
                   <div className="space-y-4">
                      <label className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] ml-2">Define New 4-Digit PIN</label>
                      <input
                        type="password"
                        maxLength="4"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-[var(--bg-hover)] border border-[var(--border)] rounded-2xl text-center text-4xl font-black text-[var(--text-main)] py-6 tracking-[0.8em] outline-none focus:border-[var(--accent)] transition-all"
                        placeholder="••••"
                        required
                      />
                   </div>

                   <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-[var(--accent)] text-white rounded-[1.8rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-[var(--accent-muted)] hover:filter hover:brightness-110 transition-all"
                   >
                     {isSubmitting ? 'Securing Access...' : 'Commit Security PIN'}
                   </button>
                   
                   <button
                    type="button"
                    onClick={() => setShowSetupPin(false)}
                    className="w-full text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest hover:text-[var(--text-main)] transition-colors"
                   >
                     Cancel
                   </button>
                </form>
             </div>
          </div>
        </div>
      )}

      {/* --- STYLES --- */}
      <style>{`
        .finances-page-v3 {
          min-height: 100vh;
          background: var(--bg-deep);
          color: var(--text-main);
          font-family: 'Inter', 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .premium-wallet-card-v3 {
          width: 100%;
          max-width: 440px;
          padding: 32px;
          background: linear-gradient(135deg, #FF4D5E 0%, #ff7582 100%);
          border-radius: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 32px;
          box-shadow: 0 30px 60px -15px rgba(255, 77, 94, 0.3);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .premium-wallet-card-v3::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent);
          pointer-events: none;
        }

        .premium-wallet-card-v3 .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          z-index: 10;
        }

        .premium-wallet-card-v3 .balance-group .label {
          display: block;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
        }

        .premium-wallet-card-v3 .balance-group .balance {
          font-size: 40px;
          font-weight: 950;
          letter-spacing: -2px;
          line-height: 1;
        }

        .premium-wallet-card-v3 .wallet-chip {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .premium-wallet-card-v3 .card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 10;
        }

        .premium-wallet-card-v3 .account-info .label {
          display: block;
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15rem;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 4px;
        }

        .premium-wallet-card-v3 .account-info .value {
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          color: white;
        }

        .premium-wallet-card-v3 .network-labels {
          display: flex;
          gap: 8px;
        }

        .premium-wallet-card-v3 .network {
          font-size: 8px;
          font-weight: 900;
          padding: 4px 10px;
          background: white;
          color: #FF4D5E;
          border-radius: 100px;
          text-transform: uppercase;
        }

        .status-badge-v3 {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1rem;
          background: var(--bg-hover);
        }

        .status-badge-v3 .dot {
          width: 6px;
          height: 6px;
          border-radius: 100px;
        }

        .status-badge-v3.approved { color: var(--success); }
        .status-badge-v3.approved .dot { background: var(--success); }
        .status-badge-v3.pending { color: var(--warning); }
        .status-badge-v3.pending .dot { background: var(--warning); }
        .status-badge-v3.rejected { color: var(--danger); }
        .status-badge-v3.rejected .dot { background: var(--danger); }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }

        @media (max-width: 768px) {
          .premium-wallet-card-v3 {
            max-width: 100%;
            padding: 24px;
          }
          .premium-wallet-card-v3 .balance { font-size: 32px; }
          .fin-action-card-v3 { padding: 32px 24px; border-radius: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Finances;
