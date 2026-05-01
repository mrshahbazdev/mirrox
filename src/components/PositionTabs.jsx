import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';
import { useModal } from '../context/ModalContext';

const PositionTabs = () => {
  const { prices, closePosition, currentClientExtended, allTrades, clientId, currentUser } = useTrading();
  const { showAlert } = useModal();
  const [activeTab, setActiveTab] = useState('open'); 
  const [showConfirm, setShowConfirm] = useState(false);
  const [closingTrade, setClosingTrade] = useState(null);
  
  // Dedicated state for fetching historical closed trades from DB
  const [historyTrades, setHistoryTrades] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Trade Modification State
  const [showModify, setShowModify] = useState(false);
  const [modifyingTrade, setModifyingTrade] = useState(null);
  const [modSL, setModSL] = useState('');
  const [modTP, setModTP] = useState('');
  const [modSlEnabled, setModSlEnabled] = useState(false);
  const [modTpEnabled, setModTpEnabled] = useState(false);
  const [modTrailingStop, setModTrailingStop] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  // Position info tooltip
  const [infoTrade, setInfoTrade] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (activeTab === 'closed' && clientId) {
      setIsLoadingHistory(true);
      axios.get(`${import.meta.env.VITE_API_URL}/api/trades/${clientId}/history`)
        .then(res => setHistoryTrades(res.data))
        .catch(err => console.error('Failed to load history', err))
        .finally(() => setIsLoadingHistory(false));
    }
  }, [activeTab, clientId]);
  
  // Robust financial data with fallbacks
  const financialSource = currentClientExtended || currentUser;
  const metrics = financialSource?.tradingMetrics || {};
  
  const balance = metrics.balance || 0;
  const equity = metrics.equity || balance;
  const margin = metrics.marginUsed || 0;
  const freeMargin = metrics.freeMargin || (equity - margin);
  const marginLevel = metrics.marginLevel || 0;

  // Health indicator for Margin Level
  const getMarginLevelColor = () => {
    if (marginLevel === 0) return 'var(--text-muted)';
    if (marginLevel < 300) return 'var(--danger)';
    if (marginLevel < 500) return 'var(--warning)';
    return 'var(--success)';
  };

  // The definitive source for ALL trades for this client
  const clientTrades = allTrades[clientId] || [];
  const openTrades = clientTrades.filter(t => t.status === 'Open');
  const pendingTrades = clientTrades.filter(t => t.status === 'Pending');

  const displayTrades = (() => {
    if (activeTab === 'open') return openTrades;
    if (activeTab === 'pending') return pendingTrades;
    
    const closedFromMemory = clientTrades.filter(t => t.status === 'Closed');
    const combinedHistory = [...closedFromMemory, ...historyTrades];
    return Array.from(new Map(combinedHistory.map(item => [item.id, item])).values());
  })().sort((a, b) => (new Date(b.closeTime || b.openTime || 0)) - (new Date(a.closeTime || a.openTime || 0)));

  const handleOpenConfirm = (trade) => {
    setClosingTrade(trade);
    setShowConfirm(true);
  };

  const handleConfirmClose = () => {
    if (closingTrade) {
      const sym = closingTrade.symbol;
      const type = closingTrade.type;
      const lots = closingTrade.lots;
      const p = prices.find(it => it.symbol === sym);
      const price = p?.price || '---';
      closePosition(closingTrade.id);
      setShowConfirm(false);
      setClosingTrade(null);
      showToast(`Position closed — ${type} ${lots} ${sym} at ${price}`);
    }
  };

  const handleOpenModify = (trade) => {
    setModifyingTrade(trade);
    setModSL(trade.stopLoss || '');
    setModTP(trade.takeProfit || '');
    setModSlEnabled(!!trade.stopLoss);
    setModTpEnabled(!!trade.takeProfit);
    setModTrailingStop(false);
    setShowModify(true);
  };

  const submitModifyTrade = async () => {
    if (!modifyingTrade) return;
    setIsModifying(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/trades/${modifyingTrade.id}`, {
        clientId,
        stopLoss: modSlEnabled ? modSL : '',
        takeProfit: modTpEnabled ? modTP : ''
      });
      setShowModify(false);
      setModifyingTrade(null);
      showToast('Trade modified successfully');
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to modify trade', 'Adjustment Error', 'error');
    } finally {
      setIsModifying(false);
    }
  };

  const getModSlInfo = () => {
    if (!modifyingTrade || !modSL) return null;
    const p = prices.find(it => it.symbol === modifyingTrade.symbol);
    const precision = p?.precision || 5;
    const precisionFactor = Math.pow(10, precision);
    const openPrice = modifyingTrade.openPrice || 0;
    const slPrice = parseFloat(modSL) || 0;
    const diff = modifyingTrade.type === 'BUY' ? (slPrice - openPrice) : (openPrice - slPrice);
    const points = Math.round(diff * precisionFactor);
    const contractSize = p?.category === 'Metals' ? 100 : 100000;
    const usdVal = (diff * (modifyingTrade.lots || 0.01) * contractSize).toFixed(2);
    const pct = openPrice ? ((diff / openPrice) * 100).toFixed(2) : '0.00';
    return { usdVal, pct, points };
  };

  const getModTpInfo = () => {
    if (!modifyingTrade || !modTP) return null;
    const p = prices.find(it => it.symbol === modifyingTrade.symbol);
    const precision = p?.precision || 5;
    const precisionFactor = Math.pow(10, precision);
    const openPrice = modifyingTrade.openPrice || 0;
    const tpPrice = parseFloat(modTP) || 0;
    const diff = modifyingTrade.type === 'BUY' ? (tpPrice - openPrice) : (openPrice - tpPrice);
    const points = Math.round(diff * precisionFactor);
    const contractSize = p?.category === 'Metals' ? 100 : 100000;
    const usdVal = (diff * (modifyingTrade.lots || 0.01) * contractSize).toFixed(2);
    const pct = openPrice ? ((diff / openPrice) * 100).toFixed(2) : '0.00';
    return { usdVal, pct, points };
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="card positions-card">
      {/* Toast notification */}
      {toast && (
        <div className={`pos-toast ${toast.type}`}>
          <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
          <span>{toast.message}</span>
          <i className="fa-solid fa-xmark pos-toast-close" onClick={() => setToast(null)}></i>
        </div>
      )}

      <div className="tabs-header">
        <div className={`tab-item ${activeTab === 'open' ? 'active' : ''}`} onClick={() => setActiveTab('open')}>
          Open Positions {openTrades.length > 0 && <span className="pos-tab-count">{openTrades.length}</span>}
        </div>
        <div className={`tab-item ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
          Pending Orders
        </div>
        <div className={`tab-item ${activeTab === 'closed' ? 'active' : ''}`} onClick={() => setActiveTab('closed')}>
          Closed Positions
        </div>
        {!isMobile && <div className="tab-item">Finance</div>}
        {activeTab === 'closed' && displayTrades.length > 0 && (
          <div className="pos-closed-total">
            <span className="pos-closed-total-label">Total</span>
            <span className={`pos-closed-total-value ${displayTrades.reduce((s, t) => s + (t.profit || 0), 0) >= 0 ? 'up' : 'down'}`}>
              {displayTrades.reduce((s, t) => s + (t.profit || 0), 0).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="table-container">
        {!isMobile ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Volume</th>
                <th>{activeTab === 'pending' ? 'Target Price' : 'Open Price'}</th>
                {activeTab === 'closed' && <th>Close Price</th>}
                {activeTab === 'open' && <th>TP/SL</th>}
                {activeTab === 'closed' && <th>Open Time</th>}
                {activeTab === 'closed' && <th>Close Time</th>}
                {activeTab !== 'pending' && <th>Profit</th>}
                {activeTab !== 'closed' && <th style={{ textAlign: 'right' }}>Actions</th>}
                {activeTab === 'closed' && <th style={{ textAlign: 'right' }}></th>}
              </tr>
            </thead>
            <tbody>
              {displayTrades.map(trade => {
                  const profit = trade.profit || 0;
                  const p = prices.find(it => it.symbol === trade.symbol);
                  const openPrice = trade.openPrice || 0;
                  const pctReturn = openPrice ? ((profit / (openPrice * (trade.lots || 0.01) * (p?.category === 'Metals' ? 100 : 100000))) * 100).toFixed(2) : '0.00';
                  return (
                    <tr key={trade.id}>
                      <td>
                        <div className="pos-symbol-cell">
                          <span className="pos-symbol-name">{p?.name || trade.symbol}</span>
                          <span className={`pos-type-badge ${trade.type === 'BUY' ? 'buy' : 'sell'}`}>{trade.type === 'BUY' ? 'Buy' : 'Sell'}</span>
                        </div>
                      </td>
                      <td>{trade.lots}</td>
                      <td>{openPrice.toFixed(p?.precision || 2)}</td>

                      {activeTab === 'closed' && (
                        <td>{(trade.closePrice || 0).toFixed(p?.precision || 2)}</td>
                      )}
                      
                      {activeTab === 'open' && (
                        <td>
                          <div className="pos-tpsl-cell">
                            <span className="pos-tpsl-line">TP: {trade.takeProfit ? parseFloat(trade.takeProfit).toFixed(p?.precision || 2) : '-'}</span>
                            <span className="pos-tpsl-line">SL: {trade.stopLoss ? parseFloat(trade.stopLoss).toFixed(p?.precision || 2) : '-'}</span>
                          </div>
                        </td>
                      )}

                      {activeTab !== 'pending' && (
                        <td>
                          <div className="pos-profit-cell">
                            <span className={`pos-profit-val ${profit >= 0 ? 'up' : 'down'}`}>
                              {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
                            </span>
                            <span className={`pos-profit-pct ${profit >= 0 ? 'up' : 'down'}`}>
                              {profit >= 0 ? '+' : ''}{pctReturn}%
                            </span>
                          </div>
                        </td>
                      )}

                      {activeTab === 'closed' && (
                        <td>{trade.openTime ? new Date(trade.openTime).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}<br /><span className="pos-time-sub">{trade.openTime ? new Date(trade.openTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}</span></td>
                      )}

                      {activeTab === 'closed' && (
                        <td>{trade.closeTime ? new Date(trade.closeTime).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}<br /><span className="pos-time-sub">{trade.closeTime ? new Date(trade.closeTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}</span></td>
                      )}

                      {activeTab !== 'closed' && (
                        <td>
                          <div className="pos-actions-cell">
                            <button className="pos-action-btn" title="Edit TP/SL" onClick={() => handleOpenModify(trade)}>
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="pos-action-btn" title="Position Info" onClick={() => setInfoTrade(infoTrade?.id === trade.id ? null : trade)}>
                              <i className="fa-solid fa-circle-info"></i>
                            </button>
                            <button className="pos-action-btn close" title="Close Position" onClick={() => handleOpenConfirm(trade)}>
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                          {infoTrade?.id === trade.id && (
                            <div className="pos-info-tooltip">
                              <div className="pos-info-row"><span>ID:</span><span>{trade.id}</span></div>
                              <div className="pos-info-row"><span>Open Time:</span><span>{trade.openTime ? new Date(trade.openTime).toLocaleDateString() : '-'}</span></div>
                              <div className="pos-info-row"><span>Swap:</span><span>{(trade.swap || 0).toFixed(2)}</span></div>
                              <div className="pos-info-row"><span>Commission:</span><span>{(trade.commission || 0).toFixed(2)}</span></div>
                            </div>
                          )}
                        </td>
                      )}

                      {activeTab === 'closed' && (
                        <td>
                          <div className="pos-actions-cell">
                            <button className="pos-action-btn" title="Position Info" onClick={() => setInfoTrade(infoTrade?.id === trade.id ? null : trade)}>
                              <i className="fa-solid fa-circle-info"></i>
                            </button>
                            <button className="pos-action-btn" title="Share">
                              <i className="fa-solid fa-share-nodes"></i>
                            </button>
                          </div>
                          {infoTrade?.id === trade.id && (
                            <div className="pos-info-tooltip">
                              <div className="pos-info-row"><span>ID:</span><span>{trade.id}</span></div>
                              <div className="pos-info-row"><span>Open Time:</span><span>{trade.openTime ? new Date(trade.openTime).toLocaleDateString() : '-'}</span></div>
                              <div className="pos-info-row"><span>Close Time:</span><span>{trade.closeTime ? new Date(trade.closeTime).toLocaleDateString() : '-'}</span></div>
                              <div className="pos-info-row"><span>Swap:</span><span>{(trade.swap || 0).toFixed(2)}</span></div>
                              <div className="pos-info-row"><span>Commission:</span><span>{(trade.commission || 0).toFixed(2)}</span></div>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
          </table>
        ) : (
          <div className="mobile-trade-list">
             {displayTrades.map(trade => {
                const profit = trade.profit || 0;
                const p = prices.find(it => it.symbol === trade.symbol);
                const openPrice = trade.openPrice || 0;
                const pctReturn = openPrice ? ((profit / (openPrice * (trade.lots || 0.01) * (p?.category === 'Metals' ? 100 : 100000))) * 100).toFixed(2) : '0.00';
                return (
                  <div key={trade.id} className="mobile-trade-card">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[var(--text-main)] font-bold">{p?.name || trade.symbol}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${trade.type === 'BUY' ? 'bg-[var(--success-muted)] text-[var(--success)]' : 'bg-[var(--danger-muted)] text-[var(--danger)]'}`}>
                            {trade.type === 'BUY' ? 'Buy' : 'Sell'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">Vol: <span className="text-[var(--text-dim)] font-mono">{trade.lots}</span></div>
                      </div>
                      <div className="text-right">
                        <div className={`text-base font-bold ${profit >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                           {profit >= 0 ? '+' : ''}{profit.toFixed(2)} <span className="text-[10px] opacity-60">USD</span>
                        </div>
                        <div className={`text-[10px] ${profit >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>{profit >= 0 ? '+' : ''}{pctReturn}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-3 bg-[var(--bg-hover)] rounded-xl mb-3">
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-tight">Open Price</div>
                        <div className="text-xs text-[var(--text-main)] font-mono">{openPrice.toFixed(p?.precision || 2)}</div>
                      </div>
                      {activeTab === 'open' && (
                        <div>
                          <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-tight">TP / SL</div>
                          <div className="text-xs text-[var(--text-main)] font-mono">
                            {trade.takeProfit ? parseFloat(trade.takeProfit).toFixed(p?.precision || 2) : '-'} / {trade.stopLoss ? parseFloat(trade.stopLoss).toFixed(p?.precision || 2) : '-'}
                          </div>
                        </div>
                      )}
                    </div>

                    {activeTab !== 'closed' && (
                      <div className="flex gap-2">
                        <button 
                          className="flex-1 bg-[var(--bg-hover)] text-[var(--text-muted)] py-2.5 rounded-xl font-bold text-xs"
                          onClick={() => handleOpenModify(trade)}
                        >
                          <i className="fa-solid fa-pen" style={{ marginRight: '4px' }}></i> Modify
                        </button>
                        <button 
                          className="flex-1 bg-[var(--danger)] text-white py-2.5 rounded-xl font-bold text-xs shadow-lg"
                          onClick={() => handleOpenConfirm(trade)}
                        >
                          <i className="fa-solid fa-xmark" style={{ marginRight: '4px' }}></i> Close
                        </button>
                      </div>
                    )}
                  </div>
                );
             })}
          </div>
        )}
        
        {activeTab === 'closed' && isLoadingHistory && (
           <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-spinner fa-spin"></i> Loading historical trades...
           </div>
        )}

        {!isLoadingHistory && displayTrades.length === 0 && (
          <div className="empty-state">
             <i className="fa-solid fa-book-open"></i>
             <p className="empty-title">
               {activeTab === 'open' ? "You don't have any open positions." : activeTab === 'pending' ? "No pending orders." : "No trade history available yet."}
             </p>
             <p className="empty-subtitle">Start trading and here you'll see your {activeTab === 'open' ? 'open positions' : 'activity'}.</p>
          </div>
        )}
      </div>

      <div className="positions-footer glass">
         <div className="stat-item">Balance: <strong>{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> <small>USD</small></div>
         <div className="stat-item">Credit: <strong>{(financialSource?.accountSummary?.creditDeposit || 0).toLocaleString()}</strong> <small>USD</small></div>
         <div className="stat-item">Equity: <strong>{equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> <small>USD</small></div>
         <div className="stat-item">Margin: <strong>{margin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div>
         <div className="stat-item">Free Margin: <strong>{freeMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div>
         <div className="stat-item">
            Margin Level: <strong style={{ color: getMarginLevelColor() }}>
              {marginLevel > 0 ? `${marginLevel.toFixed(2)}%` : '0.00%'}
            </strong>
         </div>
      </div>

      {/* Close Position Confirmation Modal */}
      {showConfirm && closingTrade && (
        <div className="pos-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="pos-modal" onClick={e => e.stopPropagation()}>
            <div className="pos-modal-header">
              <h3>Close Position</h3>
              <i className="fa-solid fa-xmark pos-modal-close" onClick={() => setShowConfirm(false)}></i>
            </div>
            <div className="pos-modal-body">
              <p className="pos-modal-text">
                Do you want to close <span className={`pos-modal-type ${closingTrade.type === 'BUY' ? 'buy' : 'sell'}`}>{closingTrade.type === 'BUY' ? 'BUY' : 'SELL'}</span> {closingTrade.lots} <span className="pos-modal-sym">{closingTrade.symbol}</span> at {prices.find(it => it.symbol === closingTrade.symbol)?.price || '---'} ?
              </p>
              <label className="pos-modal-checkbox">
                <input type="checkbox" />
                <span>Turn off trade confirmations</span>
              </label>
            </div>
            <div className="pos-modal-footer">
              <button className="pos-modal-btn cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="pos-modal-btn confirm" onClick={handleConfirmClose}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Modify TP/SL Modal */}
      {showModify && modifyingTrade && (
        <div className="pos-modal-overlay" onClick={() => setShowModify(false)}>
          <div className="pos-modify-modal" onClick={e => e.stopPropagation()}>
            {/* Stop Loss */}
            <div className="pos-mod-section">
              <div className="pos-mod-toggle-row" onClick={() => setModSlEnabled(!modSlEnabled)}>
                <div className={`mw-toggle ${modSlEnabled ? 'on' : ''}`}>
                  <span className="mw-toggle-knob" />
                </div>
                <span className="pos-mod-label">Stop Loss</span>
              </div>
              {modSlEnabled && (
                <>
                  <div className="pos-mod-input-row">
                    <button className="pos-mod-btn" onClick={() => {
                      const p = prices.find(it => it.symbol === modifyingTrade.symbol);
                      const step = 1 / Math.pow(10, p?.precision || 5);
                      setModSL(prev => (parseFloat(prev || modifyingTrade.openPrice) - step).toFixed(p?.precision || 5));
                    }}>
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <input
                      type="number"
                      className="pos-mod-input"
                      value={modSL}
                      onChange={e => setModSL(e.target.value)}
                      placeholder={String(modifyingTrade.openPrice || '')}
                    />
                    <button className="pos-mod-btn" onClick={() => {
                      const p = prices.find(it => it.symbol === modifyingTrade.symbol);
                      const step = 1 / Math.pow(10, p?.precision || 5);
                      setModSL(prev => (parseFloat(prev || modifyingTrade.openPrice) + step).toFixed(p?.precision || 5));
                    }}>
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  {(() => {
                    const info = getModSlInfo();
                    if (!info) return null;
                    return (
                      <div className={`pos-mod-info ${parseFloat(info.usdVal) >= 0 ? 'up' : 'down'}`}>
                        <i className={`fa-solid ${parseFloat(info.usdVal) >= 0 ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                        <span>{info.usdVal} USD</span>
                        <span>{info.pct}%</span>
                        <span>{info.points} Points</span>
                      </div>
                    );
                  })()}
                  <label className="pos-mod-trailing">
                    <input type="checkbox" checked={modTrailingStop} onChange={() => setModTrailingStop(!modTrailingStop)} />
                    <span>Trailing Stop</span>
                    <i className="fa-solid fa-circle-info" style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: '4px' }}></i>
                  </label>
                </>
              )}
            </div>

            {/* Take Profit */}
            <div className="pos-mod-section">
              <div className="pos-mod-toggle-row" onClick={() => setModTpEnabled(!modTpEnabled)}>
                <div className={`mw-toggle ${modTpEnabled ? 'on' : ''}`}>
                  <span className="mw-toggle-knob" />
                </div>
                <span className="pos-mod-label">Take Profit</span>
              </div>
              {modTpEnabled && (
                <>
                  <div className="pos-mod-input-row">
                    <button className="pos-mod-btn" onClick={() => {
                      const p = prices.find(it => it.symbol === modifyingTrade.symbol);
                      const step = 1 / Math.pow(10, p?.precision || 5);
                      setModTP(prev => (parseFloat(prev || modifyingTrade.openPrice) - step).toFixed(p?.precision || 5));
                    }}>
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <input
                      type="number"
                      className="pos-mod-input"
                      value={modTP}
                      onChange={e => setModTP(e.target.value)}
                      placeholder={String(modifyingTrade.openPrice || '')}
                    />
                    <button className="pos-mod-btn" onClick={() => {
                      const p = prices.find(it => it.symbol === modifyingTrade.symbol);
                      const step = 1 / Math.pow(10, p?.precision || 5);
                      setModTP(prev => (parseFloat(prev || modifyingTrade.openPrice) + step).toFixed(p?.precision || 5));
                    }}>
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  {(() => {
                    const info = getModTpInfo();
                    if (!info) return null;
                    return (
                      <div className={`pos-mod-info ${parseFloat(info.usdVal) >= 0 ? 'up' : 'down'}`}>
                        <i className={`fa-solid ${parseFloat(info.usdVal) >= 0 ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                        <span>{info.usdVal} USD</span>
                        <span>{info.pct}%</span>
                        <span>{info.points} Points</span>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>

            <div className="pos-modal-footer">
              <button className="pos-modal-btn cancel" onClick={() => setShowModify(false)}>Cancel</button>
              <button className="pos-modal-btn save" onClick={submitModifyTrade} disabled={isModifying}>
                {isModifying ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionTabs;
