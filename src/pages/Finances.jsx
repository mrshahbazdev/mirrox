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
  const [activeTab, setActiveTab] = useState('deposit');

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [txHash, setTxHash] = useState('');
  const [withdrawalPin, setWithdrawalPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      return () => { socket.off('finance_update', fetchData); };
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

  if (loading) {
    return (
      <div className="fin-loading">
        <RefreshCw className="fin-loading-spinner" size={40} />
        <p className="fin-loading-text">Syncing Financial Node...</p>
      </div>
    );
  }

  return (
    <div className="fin-page">
      <div className="fin-bg-orb fin-bg-orb--top"></div>
      <div className="fin-bg-orb fin-bg-orb--bottom"></div>

      <div className="fin-container">
        {/* --- HEADER --- */}
        <header className="fin-header">
          <div className="fin-title-group">
            <h1 className="fin-title">
              <span className="fin-title-bar"></span>
              Wallet
            </h1>
            <p className="fin-subtitle">
              Institutional Asset Management &bull; Bullvera
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
        <div className="fin-main-grid">
          {/* LEFT COLUMN */}
          <div>
            {/* TABS */}
            <div className="fin-tabs">
              {[
                { id: 'deposit', label: 'Deposit', icon: <PlusCircle size={18} /> },
                { id: 'withdrawal', label: 'Withdraw', icon: <MinusCircle size={18} /> },
                { id: 'history', label: 'History', icon: <History size={18} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`fin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* FORM CARD */}
            <div className="fin-form-card" style={{ marginTop: 32 }}>
              <div className="fin-form-card__inner">

                {/* === DEPOSIT === */}
                {activeTab === 'deposit' && (
                  <div>
                    <div className="fin-section-header">
                      <div className="fin-section-icon">
                        <PlusCircle size={32} />
                      </div>
                      <div>
                        <h3 className="fin-section-title">Fund Account</h3>
                        <p className="fin-section-subtitle">Select methodology &amp; amount</p>
                      </div>
                    </div>

                    <form onSubmit={handleDeposit}>
                      <div className="fin-form-grid">
                        {/* LEFT: Method & Amount */}
                        <div className="fin-form-section">
                          <div className="fin-form-group">
                            <label className="fin-form-label">Payment Methodology</label>
                            <div className="fin-method-grid">
                              <button
                                type="button"
                                onClick={() => setMethod('crypto')}
                                className={`fin-method-btn ${method === 'crypto' ? 'active' : ''}`}
                              >
                                <div className="fin-method-icon">
                                  <Zap size={20} />
                                </div>
                                <span className="fin-method-name">USDT (TRC20)</span>
                                <span className="fin-method-desc">Instant Crypto</span>
                                {method === 'crypto' && <div className="fin-method-dot"></div>}
                              </button>

                              <button
                                type="button"
                                onClick={() => setMethod('bank_transfer')}
                                className={`fin-method-btn ${method === 'bank_transfer' ? 'active' : ''}`}
                              >
                                <div className="fin-method-icon">
                                  <Landmark size={20} />
                                </div>
                                <span className="fin-method-name">Bank Wire</span>
                                <span className="fin-method-desc">Global IBAN</span>
                                {method === 'bank_transfer' && <div className="fin-method-dot"></div>}
                              </button>
                            </div>
                          </div>

                          <div className="fin-form-group">
                            <label className="fin-form-label">Deposit Amplitude (USD)</label>
                            <div className="fin-amount-wrap">
                              <span className="fin-amount-symbol">$</span>
                              <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="fin-amount-input"
                                required
                              />
                            </div>
                            <div className="fin-quick-amounts">
                              {[500, 1000, 5000].map(v => (
                                <button key={v} type="button" onClick={() => setAmount(v.toString())} className="fin-quick-btn">+${v.toLocaleString()}</button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT: Instructions */}
                        <div>
                          <div className="fin-instructions">
                            <h4 className="fin-instructions-title">
                              <Info size={14} />
                              Transfer Protocol
                            </h4>

                            {method === 'crypto' ? (
                              <div>
                                <div className="fin-wallet-label-row">
                                  <span className="fin-wallet-label">Destination Wallet</span>
                                  <span className="fin-wallet-active-badge">Active</span>
                                </div>
                                <div className="fin-wallet-address-row">
                                  <code className="fin-wallet-address">{platformConfig.usdt_address}</code>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(platformConfig.usdt_address);
                                      showAlert('Address copied to clipboard', 'Copied', 'success');
                                    }}
                                    className="fin-copy-btn"
                                  >
                                    <Copy size={16} />
                                  </button>
                                </div>
                                <p className="fin-warning-text">
                                  <AlertCircle size={10} style={{ display: 'inline', marginRight: 4, color: 'var(--accent)' }} />
                                  Only transmit <strong>USDT via the TRC20 (Tron)</strong> network. Assets sent over other bridges will be permanently lost.
                                </p>
                              </div>
                            ) : (
                              <div>
                                <div className="fin-bank-rows">
                                  <div className="fin-bank-row">
                                    <span className="fin-bank-row__label">Bank</span>
                                    <span className="fin-bank-row__value">{platformConfig.bank_name}</span>
                                  </div>
                                  <div className="fin-bank-row">
                                    <span className="fin-bank-row__label">Holder</span>
                                    <span className="fin-bank-row__value">{platformConfig.account_name}</span>
                                  </div>
                                </div>
                                <span className="fin-iban-label">Transfer IBAN</span>
                                <div className="fin-iban-value">
                                  {platformConfig.bank_iban}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="fin-proof-group">
                        <label className="fin-form-label">Transaction Proof / Hash</label>
                        <input
                          type="text"
                          value={txHash}
                          onChange={(e) => setTxHash(e.target.value)}
                          placeholder="Paste your transaction hash or reference here..."
                          className="fin-proof-input"
                          required
                        />
                      </div>

                      <button type="submit" disabled={isSubmitting} className="fin-submit-btn">
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="fin-loading-spinner" size={24} />
                            Validating Transmission...
                          </>
                        ) : (
                          <>
                            <Send size={24} />
                            Submit Funding Request
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* === WITHDRAWAL === */}
                {activeTab === 'withdrawal' && (
                  <div className="fin-withdraw-section">
                    <div className="fin-withdraw-header">
                      <div className="fin-withdraw-icon">
                        <Shield size={44} />
                      </div>
                      <div>
                        <h3 className="fin-withdraw-title">Withdraw Assets</h3>
                        <p className="fin-withdraw-subtitle">Authorized Secure Payout Gateway</p>
                      </div>
                    </div>

                    <form onSubmit={handleWithdrawal} className="fin-withdraw-form">
                      <div className="fin-withdraw-badge">
                        <span>Digital Authentication Required</span>
                      </div>

                      <div className="fin-withdraw-amount-group">
                        <label className="fin-form-label" style={{ marginBottom: 0 }}>Capital Amount (USD)</label>
                        <div className="fin-withdraw-amount-wrap">
                          <span className="fin-withdraw-amount-symbol">$</span>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="fin-withdraw-amount-input"
                            required
                          />
                        </div>
                        <p className="fin-withdraw-balance">
                          Liquid Balance: <span>${formatCurrency(tm.balance)}</span>
                        </p>
                      </div>

                      <div className="fin-pin-group">
                        <div className="fin-pin-label-row">
                          <label className="fin-pin-label">Access Key</label>
                          <button type="button" onClick={() => setShowSetupPin(true)} className="fin-pin-reset">Reset PIN</button>
                        </div>
                        <input
                          type="password"
                          maxLength="4"
                          value={withdrawalPin}
                          onChange={(e) => setWithdrawalPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••"
                          className="fin-pin-input"
                          required
                        />
                      </div>

                      <button type="submit" disabled={isSubmitting} className="fin-withdraw-btn">
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="fin-loading-spinner" size={24} />
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

                {/* === HISTORY === */}
                {activeTab === 'history' && (
                  <div>
                    <div className="fin-history-header">
                      <div className="fin-history-header-left">
                        <div className="fin-section-icon">
                          <History size={32} />
                        </div>
                        <div>
                          <h3 className="fin-section-title">Ledger Matrix</h3>
                          <p className="fin-section-subtitle">Historical Asset Activity</p>
                        </div>
                      </div>
                      <button className="fin-export-btn">Export Ledger</button>
                    </div>

                    <div className="fin-ledger-rows">
                      {history.length === 0 ? (
                        <div className="fin-empty-state">
                          <AlertCircle size={80} />
                          <p>Vault Uninitialized</p>
                        </div>
                      ) : (
                        history.map((tx, idx) => (
                          <div key={idx} className="fin-tx-row">
                            <div className="fin-tx-left">
                              <div className={`fin-tx-icon ${tx.type === 'Deposit' ? 'deposit' : 'withdrawal'}`}>
                                {tx.type === 'Deposit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                <div className={`fin-tx-status-dot ${tx.status}`}></div>
                              </div>
                              <div className="fin-tx-info">
                                <div className="fin-tx-type-row">
                                  <h4 className="fin-tx-type">{tx.type}</h4>
                                  <span className="fin-tx-method-badge">{tx.method.replace('_', ' ')}</span>
                                </div>
                                <p className="fin-tx-date">
                                  {tx.date}
                                  <span className="fin-tx-date-dot"></span>
                                  BVR-{tx._id?.substring(0, 8).toUpperCase() || 'EXTERNAL'}
                                </p>
                              </div>
                            </div>

                            <div className="fin-tx-right">
                              <div>
                                <p className={`fin-tx-amount ${tx.type === 'Deposit' ? 'deposit' : 'withdrawal'}`}>
                                  {tx.type === 'Deposit' ? '+' : '-'}${formatCurrency(tx.amount)}
                                </p>
                                <div className={`status-badge-v3 ${tx.status}`}>
                                  <div className="dot"></div>
                                  <span>{tx.status}</span>
                                </div>
                              </div>
                              <button className="fin-tx-action-btn">
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

          {/* RIGHT COLUMN */}
          <div className="fin-right-col">
            {/* METRICS CARD */}
            <div className="fin-metrics-card">
              <div className="fin-metrics-glow"></div>
              <div className="fin-metrics-inner">
                <div className="fin-metrics-header">
                  <div className="fin-metrics-header-icon">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 className="fin-metrics-title">Risk Assessment</h4>
                    <p className="fin-metrics-subtitle">Institutional Grade Metrics</p>
                  </div>
                </div>

                <div className="fin-metrics-rows">
                  {[
                    { label: 'Total Equity', value: tm.equity, colorClass: 'accent', icon: <Wallet size={14} /> },
                    { label: 'Utilized Margin', value: tm.marginUsed, colorClass: 'danger', icon: <CreditCard size={14} /> },
                    { label: 'Free Liquidity', value: tm.freeMargin, colorClass: 'success', icon: <Zap size={14} /> },
                    { label: 'Security Level', value: (tm.marginLevel || 0).toFixed(2) + '%', colorClass: 'warning', icon: <Shield size={14} />, isPercent: true }
                  ].map(metric => (
                    <div key={metric.label} className="fin-metric-row">
                      <div className="fin-metric-left">
                        <div className="fin-metric-icon">
                          {metric.icon}
                        </div>
                        <span className="fin-metric-label">{metric.label}</span>
                      </div>
                      <span className={`fin-metric-value ${metric.colorClass}`}>
                        {metric.isPercent ? metric.value : '$' + formatCurrency(metric.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SUPPORT CARD */}
            <div className="fin-support-card">
              <div className="fin-support-glow"></div>
              <div className="fin-support-inner">
                <div className="fin-support-icon">
                  <Headphones size={24} />
                </div>
                <div>
                  <h4 className="fin-support-title">Financial Desk</h4>
                  <p className="fin-support-desc">
                    Prioritized support for capital deployments and payout verification.
                  </p>
                </div>
                <button className="fin-support-btn">
                  <Smartphone size={14} />
                  Connect With Specialist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PIN MODAL --- */}
      {showSetupPin && (
        <div className="fin-modal-overlay">
          <div className="fin-modal-card">
            <div className="fin-modal-glow"></div>
            <div className="fin-modal-inner">
              <div className="fin-modal-header">
                <div className="fin-modal-icon">
                  <Key size={36} />
                </div>
                <div>
                  <h3 className="fin-modal-title">Security Access</h3>
                  <p className="fin-modal-subtitle">Platform Withdrawal Credentials</p>
                </div>
              </div>

              <form onSubmit={handleSetupPin} className="fin-modal-form">
                <div>
                  <label className="fin-form-label">Define New 4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength="4"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    className="fin-modal-pin-input"
                    placeholder="••••"
                    required
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="fin-modal-submit">
                  {isSubmitting ? 'Securing Access...' : 'Commit Security PIN'}
                </button>

                <button type="button" onClick={() => setShowSetupPin(false)} className="fin-modal-cancel">
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finances;
