import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';
import { useModal } from '../context/ModalContext';

const PositionTabs = () => {
  const { activeTrades, prices, closePosition, currentClientExtended, allTrades, clientId, currentUser } = useTrading();
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
  const [newSL, setNewSL] = useState('');
  const [newTP, setNewTP] = useState('');
  const [isModifying, setIsModifying] = useState(false);

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

  // Health indicator for Margin Level (Image notes: mini = 300)
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
    
    // Merge In-memory closed trades (pre-sync) with historical DB result
    const closedFromMemory = clientTrades.filter(t => t.status === 'Closed');
    const combinedHistory = [...closedFromMemory, ...historyTrades];
    
    // Deduplicate by ID to prevent double-showing during the 1s sync window
    return Array.from(new Map(combinedHistory.map(item => [item.id, item])).values());
  })().sort((a, b) => (new Date(b.closeTime || b.openTime || 0)) - (new Date(a.closeTime || a.openTime || 0)));

  const handleOpenConfirm = (trade) => {
    setClosingTrade(trade);
    setShowConfirm(true);
  };

  const handleConfirmClose = () => {
    if (closingTrade) {
      closePosition(closingTrade.id);
      setShowConfirm(false);
      setClosingTrade(null);
    }
  };

  const handleOpenModify = (trade) => {
    setModifyingTrade(trade);
    setNewSL(trade.stopLoss || '');
    setNewTP(trade.takeProfit || '');
    setShowModify(true);
  };

  const submitModifyTrade = async () => {
    if (!modifyingTrade) return;
    setIsModifying(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/trades/${modifyingTrade.id}`, {
        clientId,
        stopLoss: newSL,
        takeProfit: newTP
      });
      setShowModify(false);
      setModifyingTrade(null);
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to modify trade', 'Adjustment Error', 'error');
    } finally {
      setIsModifying(false);
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="card positions-card">
      <div className="tabs-header">
        <div className={`tab-item ${activeTab === 'open' ? 'active' : ''}`} onClick={() => setActiveTab('open')}>
          Open ({openTrades.length})
        </div>
        <div className={`tab-item ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
          Pending ({pendingTrades.length})
        </div>
        <div className={`tab-item ${activeTab === 'closed' ? 'active' : ''}`} onClick={() => setActiveTab('closed')}>
          History
        </div>
        {!isMobile && <div className="tab-item">Finance</div>}
      </div>

      <div className="table-container">
        {!isMobile ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Volume</th>
                <th>{activeTab === 'pending' ? 'Target Price' : 'Open Price'}</th>
                {activeTab === 'open' && <th>Current Price</th>}
                {(activeTab === 'open' || activeTab === 'closed') && <th>Target / Close Price</th>}
                {activeTab !== 'pending' && <th>Profit / Loss</th>}
                {activeTab !== 'pending' && <th>Swap</th>}
                {activeTab !== 'closed' && <th style={{ textAlign: 'right' }}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {displayTrades.map(trade => {
                  const profit = trade.profit || 0;
                  const swap = trade.swap || 0;
                  return (
                    <tr key={trade.id}>
                      <td style={{ fontWeight: 600 }}>{trade.symbol}</td>
                      <td style={{ color: trade.type === 'BUY' ? 'var(--success)' : 'var(--danger)' }}>{trade.type}</td>
                      <td>{trade.lots}</td>
                      <td>{(trade.openPrice || 0).toFixed(2)}</td>
                      
                      {activeTab === 'open' && (
                        <td>{prices.find(p=>p.symbol===trade.symbol)?.price || '...'}</td>
                      )}

                      {(activeTab === 'open' || activeTab === 'closed') && (
                        <td>
                          {(() => {
                            const precision = prices.find(p => p.symbol === trade.symbol)?.precision || 2;
                            if (activeTab === 'open') {
                                const target = trade.takeProfit || trade.selectedPrice;
                                return target ? parseFloat(target).toFixed(precision) : '---';
                            }
                            return trade.closePrice ? parseFloat(trade.closePrice).toFixed(precision) : '...';
                          })()}
                        </td>
                      )}

                      {activeTab !== 'pending' && (
                        <>
                          <td style={{ color: profit >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                              {profit >= 0 ? '+' : ''}{profit.toFixed(2)} USD
                          </td>
                          <td style={{ color: swap < 0 ? 'var(--danger)' : 'var(--success)', fontWeight: '500' }}>
                              {(() => {
                                const tradeAgeMs = Date.now() - new Date(trade.openTime).getTime();
                                const isOldEnough = tradeAgeMs >= 24 * 60 * 60 * 1000;
                                const shouldShowSwap = trade.status === 'Closed' || isOldEnough;
                                const visibleSwap = shouldShowSwap ? swap : 0;
                                
                                return (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span>{visibleSwap >= 0 ? '+' : ''}{visibleSwap.toFixed(2)} USD</span>
                                    {trade.swapLocked && <span title="Swap manually set by admin" style={{ fontSize: '10px' }}>🔒</span>}
                                  </div>
                                );
                              })()}
                          </td>
                        </>
                      )}

                      {activeTab !== 'closed' && (
                        <td style={{ textAlign: 'right' }}>
                          {activeTab === 'pending' && (
                            <button 
                              className="close-trade-btn" style={{ background: 'transparent', color: 'var(--success)', marginRight: '8px' }}
                              onClick={() => handleOpenModify(trade)}
                            >
                              <i className="fa-solid fa-pen"></i>
                            </button>
                          )}
                          <button className="close-trade-btn" onClick={() => handleOpenConfirm(trade)}>
                            {activeTab === 'pending' ? 'Cancel' : 'Close'}
                          </button>
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
                return (
                  <div key={trade.id} className="mobile-trade-card">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[var(--text-main)] font-bold">{trade.symbol}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${trade.type === 'BUY' ? 'bg-[var(--success-muted)] text-[var(--success)]' : 'bg-[var(--danger-muted)] text-[var(--danger)]'}`}>
                            {trade.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">Vol: <span className="text-[var(--text-dim)] font-mono">{trade.lots}</span></div>
                      </div>
                      <div className="text-right">
                        <div className={`text-base font-bold ${profit >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                           {profit >= 0 ? '+' : ''}{profit.toFixed(2)} <span className="text-[10px] opacity-60">USD</span>
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">Net Return</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-3 bg-[var(--bg-hover)] rounded-xl mb-3">
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-tight">Open Price</div>
                        <div className="text-xs text-[var(--text-main)] font-mono">{(trade.openPrice || 0).toFixed(p?.precision || 2)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-tight">Market</div>
                        <div className="text-xs text-[var(--accent)] font-mono">{p?.price || '...'}</div>
                      </div>
                    </div>

                    {activeTab !== 'closed' && (
                      <div className="flex gap-2">
                        {activeTab === 'pending' && (
                          <button 
                            className="flex-1 bg-[var(--bg-hover)] text-[var(--text-muted)] py-2.5 rounded-xl font-bold text-xs"
                            onClick={() => handleOpenModify(trade)}
                          >
                            Modify
                          </button>
                        )}
                        <button 
                          className={`flex-1 ${activeTab === 'pending' ? 'bg-[var(--danger-muted)] text-[var(--danger)] border border-[var(--danger)]' : 'bg-[var(--danger)] text-white'} py-2.5 rounded-xl font-bold text-xs shadow-lg`}
                          onClick={() => handleOpenConfirm(trade)}
                        >
                          {activeTab === 'pending' ? 'Cancel Order' : 'Close Position'}
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
               {activeTab === 'open' ? "You don't have any open positions." : "No trade history available yet."}
             </p>
             <p className="empty-subtitle">Start trading and here you'll see your activity.</p>
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

      {/* Custom Global Confirmation Modal */}
      {showConfirm && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-content animate-pop">
            <div className="modal-header-simple">
              <i className="fa-solid fa-circle-exclamation" style={{ color: 'var(--danger)', fontSize: '24px' }}></i>
              <h3>Close Position?</h3>
            </div>
            <div className="modal-body-simple">
              <p>Are you sure you want to close <strong>{closingTrade?.symbol}</strong> ({closingTrade?.type}) at market price?</p>
              <div className="confirm-profit-preview">
                <span className="label">Estimated Result</span>
                <span className={`value ${(closingTrade?.profit || 0) >= 0 ? 'up' : 'down'}`}>
                  {(closingTrade?.profit || 0) >= 0 ? '+' : ''}{(closingTrade?.profit || 0).toFixed(2)} USD
                </span>
              </div>
            </div>
            <div className="modal-footer-simple">
              <button className="confirm-btn secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="confirm-btn danger" onClick={handleConfirmClose}>Close Position</button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Trade Modal */}
      {showModify && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-content animate-pop" style={{ maxWidth: '400px' }}>
            <div className="modal-header-simple">
              <i className="fa-solid fa-pen-to-square" style={{ color: 'var(--success)', fontSize: '24px' }}></i>
              <h3>Modify Order</h3>
            </div>
            <div className="modal-body-simple">
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                Modify Stop Loss and Take Profit for <strong>{modifyingTrade?.symbol}</strong> ({modifyingTrade?.type})
              </p>
              
              <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Stop Loss Price</label>
                <input 
                  type="number" 
                  step="0.00001"
                  value={newSL} 
                  onChange={e => setNewSL(e.target.value)}
                  placeholder="0.00"
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '16px' }}
                />
              </div>
 
              <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Take Profit Price</label>
                <input 
                  type="number" 
                  step="0.00001"
                  value={newTP} 
                  onChange={e => setNewTP(e.target.value)}
                  placeholder="0.00"
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '16px' }}
                />
              </div>
            </div>
            <div className="modal-footer-simple">
               <button className="confirm-btn secondary" onClick={() => setShowModify(false)}>Cancel</button>
               <button className="confirm-btn" style={{ background: 'var(--success)', color: 'white' }} onClick={submitModifyTrade} disabled={isModifying}>
                 {isModifying ? 'Saving...' : 'Save Settings'}
               </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .close-trade-btn {
          background: var(--danger-muted);
          color: var(--danger);
          border: 1px solid var(--danger-muted);
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .close-trade-btn:hover { background: var(--danger); color: white; }

        /* Confirm Modal Styles */
        .confirm-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .confirm-modal-content {
          background: var(--bg-card);
          border: 1px solid var(--border);
          width: 90%;
          max-width: 380px;
          border-radius: 28px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 40px 60px -15px rgba(0, 0, 0, 0.1);
        }
        .modal-header-simple h3 { margin: 16px 0 8px; font-size: 20px; color: var(--text-main); font-weight: 800; }
        .modal-body-simple p { color: var(--text-muted); font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
        
        .confirm-profit-preview {
          background: var(--bg-hover);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 32px;
          border: 1px dashed var(--border);
        }
        .confirm-profit-preview .label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; font-weight: 800; }
        .confirm-profit-preview .value { font-size: 20px; font-weight: 800; }
        .confirm-profit-preview .value.up { color: var(--success); }
        .confirm-profit-preview .value.down { color: var(--danger); }

        .modal-footer-simple { display: flex; gap: 12px; }
        .confirm-btn { flex: 1; padding: 14px; border-radius: 14px; font-weight: 700; cursor: pointer; border: none; font-size: 14px; transition: all 0.2s; }
        .confirm-btn.danger { background: var(--danger); color: white; }
        .confirm-btn.danger:hover { background: #dc2626; transform: translateY(-2px); }
        .confirm-btn.secondary { background: var(--bg-hover); color: var(--text-muted); }
        .confirm-btn.secondary:hover { background: var(--border); }

        /* Mobile Card Styles */
        .mobile-trade-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px;
          background: var(--bg-deep);
        }
        .mobile-trade-card {
           background: var(--bg-card);
           backdrop-filter: blur(10px);
           border: 1px solid var(--border);
           border-radius: 20px;
           padding: 16px;
           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .text-emerald-400 { color: var(--success); }
        .bg-emerald-500\/20 { background: var(--success-muted); }
        .text-rose-400 { color: var(--danger); }
        .bg-rose-500\/20 { background: var(--danger-muted); }
        .text-slate-500 { color: var(--text-muted); }
        .text-slate-300 { color: var(--text-main); }
        .tracking-tight { letter-spacing: -0.025em; }

        @media (max-width: 600px) {
           .tabs-header { overflow-x: auto; white-space: nowrap; gap: 8px; height: 48px; }
           .tab-item { flex-shrink: 0; padding: 0 12px; font-size: 12px; }
           .positions-footer { font-size: 10px; padding: 10px; gap: 8px; }
        }
      `}</style>
    </div>
  );
};

export default PositionTabs;
