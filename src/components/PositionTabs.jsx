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
    if (marginLevel === 0) return '#94a3b8';
    if (marginLevel < 300) return '#ef4444'; // Red
    if (marginLevel < 500) return '#f59e0b'; // Orange/Yellow
    return '#10b981'; // Green
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

  return (
    <div className="card positions-card">
      <div className="tabs-header">
        <div className={`tab-item ${activeTab === 'open' ? 'active' : ''}`} onClick={() => setActiveTab('open')}>
          Open Positions ({openTrades.length})
        </div>
        <div className={`tab-item ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
          Pending Orders ({pendingTrades.length})
        </div>
        <div className={`tab-item ${activeTab === 'closed' ? 'active' : ''}`} onClick={() => setActiveTab('closed')}>
          Closed History
        </div>
        <div className="tab-item">Finance</div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Type</th>
              <th>Volume</th>
              <th>{activeTab === 'pending' ? 'Target Price' : 'Open Price'}</th>
              {activeTab === 'open' && <th>Current Price</th>}
              {(activeTab === 'open' || activeTab === 'closed') && <th>Close Price</th>}
              {activeTab !== 'pending' && <th>Profit / Loss</th>}
              {activeTab !== 'pending' && <th>Swap</th>}
              {activeTab !== 'closed' && <th style={{ textAlign: 'right' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
             {displayTrades.map(trade => {
                const profit = trade.profit || 0;
                const swap = trade.swap || 0;
                const total = profit + swap;
                const isClosed = trade.status === 'Closed';
                return (
                  <tr key={trade.id}>
                    <td style={{ fontWeight: 600 }}>{trade.symbol}</td>
                    <td style={{ color: trade.type === 'BUY' ? '#10b981' : '#ef4444' }}>{trade.type}</td>
                    <td>{trade.lots}</td>
                    <td>{(trade.openPrice || 0).toFixed(2)}</td>
                    
                    {activeTab === 'open' && (
                       <td>{prices.find(p=>p.name===trade.symbol)?.price || '...'}</td>
                    )}

                    {(activeTab === 'open' || activeTab === 'closed') && (
                       <td>
                          {activeTab === 'open' 
                            ? (trade.takeProfit 
                                ? trade.takeProfit.toFixed(prices.find(p=>p.name===trade.symbol)?.precision || 2) 
                                : (trade.selectedPrice ? trade.selectedPrice.toFixed(prices.find(p=>p.name===trade.symbol)?.precision || 2) : '---'))
                            : (trade.closePrice?.toFixed(prices.find(p=>p.name===trade.symbol)?.precision || 2) || '...')
                          }
                       </td>
                    )}

                    {activeTab !== 'pending' && (
                       <>
                         <td style={{ color: profit >= 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                            {profit >= 0 ? '+' : ''}{profit.toFixed(2)} USD
                         </td>
                         <td style={{ color: swap < 0 ? '#ef4444' : '#10b981', fontWeight: '500' }}>
                            {(() => {
                              const tradeAgeMs = Date.now() - new Date(trade.openTime).getTime();
                              const isOldEnough = tradeAgeMs >= 24 * 60 * 60 * 1000;
                              const shouldShowSwap = trade.status === 'Closed' || isOldEnough;
                              const visibleSwap = shouldShowSwap ? swap : 0;
                              
                              return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                   <span>{visibleSwap >= 0 ? '+' : ''}{visibleSwap.toFixed(2)} USD</span>
                                   {trade.swapLocked && <span title="Swap manually set by admin" style={{ fontSize: '10px' }}>🔒</span>}
                                   {!shouldShowSwap && trade.status === 'Open' && (
                                     <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: '9px', opacity: 0.5 }} title="Swap appears after 24h"></i>
                                   )}
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
                             className="close-trade-btn" style={{ background: 'transparent', color: '#10b981', marginRight: '8px' }}
                             onClick={() => handleOpenModify(trade)}
                             title="Modify TP/SL"
                           >
                             <i className="fa-solid fa-pen"></i>
                           </button>
                         )}
                         <button 
                           className="close-trade-btn"
                           onClick={() => handleOpenConfirm(trade)}
                         >
                           {activeTab === 'pending' ? 'Cancel' : 'Close'}
                         </button>
                      </td>
                    )}
                  </tr>
                  );
               })}
            </tbody>
        </table>
        
        {activeTab === 'closed' && isLoadingHistory && (
           <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
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
              <i className="fa-solid fa-circle-exclamation" style={{ color: '#ef4444', fontSize: '24px' }}></i>
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
              <i className="fa-solid fa-pen-to-square" style={{ color: '#10b981', fontSize: '24px' }}></i>
              <h3>Modify Order</h3>
            </div>
            <div className="modal-body-simple">
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#94a3b8' }}>
                Modify Stop Loss and Take Profit for <strong>{modifyingTrade?.symbol}</strong> ({modifyingTrade?.type})
              </p>
              
              <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Stop Loss Price</label>
                <input 
                  type="number" 
                  step="0.00001"
                  value={newSL} 
                  onChange={e => setNewSL(e.target.value)}
                  placeholder="0.00"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '16px' }}
                />
              </div>

              <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Take Profit Price</label>
                <input 
                  type="number" 
                  step="0.00001"
                  value={newTP} 
                  onChange={e => setNewTP(e.target.value)}
                  placeholder="0.00"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '16px' }}
                />
              </div>
            </div>
            <div className="modal-footer-simple">
              <button className="confirm-btn secondary" onClick={() => setShowModify(false)}>Cancel</button>
              <button className="confirm-btn" style={{ background: '#10b981' }} onClick={submitModifyTrade} disabled={isModifying}>
                {isModifying ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .close-trade-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .close-trade-btn:hover { background: #ef4444; color: white; }

        /* Confirm Modal Styles */
        .confirm-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.88);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .confirm-modal-content {
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 90%;
          max-width: 380px;
          border-radius: 28px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 40px 60px -15px rgba(0, 0, 0, 0.7);
        }
        .modal-header-simple h3 { margin: 16px 0 8px; font-size: 20px; color: white; font-weight: 800; }
        .modal-body-simple p { color: #94a3b8; font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
        
        .confirm-profit-preview {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 32px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
        }
        .confirm-profit-preview .label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 800; }
        .confirm-profit-preview .value { font-size: 20px; font-weight: 800; }
        .confirm-profit-preview .value.up { color: #10b981; }
        .confirm-profit-preview .value.down { color: #ef4444; }

        .modal-footer-simple { display: flex; gap: 12px; }
        .confirm-btn { flex: 1; padding: 14px; border-radius: 14px; font-weight: 700; cursor: pointer; border: none; font-size: 14px; transition: all 0.2s; }
        .confirm-btn.danger { background: #ef4444; color: white; }
        .confirm-btn.danger:hover { background: #dc2626; transform: translateY(-2px); }
        .confirm-btn.secondary { background: rgba(255, 255, 255, 0.05); color: #94a3b8; }
        .confirm-btn.secondary:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};

export default PositionTabs;
