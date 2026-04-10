import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';

const AssetInfo = ({ symbol, onTrade }) => {
  const { currentClientExtended } = useTrading();
  const isVerified = currentClientExtended?.kyc?.status === 'approved';
  const [activeTab, setActiveTab] = useState('Market');

  const MarketView = () => (
    <div className="market-tab-content animate-fade">
      {/* Sentiment Section */}
      <div className="market-sentiment-section">
        <div className="hours-title ms-header">Market sentiment</div>
        <div className="sent-bar-layout">
           <span className="buy-val">50%</span>
           <div className="ms-rail">
              <div className="ms-fill" style={{ width: '50%' }}></div>
           </div>
           <span className="sell-val">50%</span>
        </div>
      </div>

      {/* Change Section */}
      <div className="change-section">
        <div className="hours-title ms-header">Change</div>
        <div className="change-stat-grid">
           <div className="change-stat-card">
              <span className="label">Daily</span>
              <span className="val neg">- 0.18%</span>
           </div>
           <div className="change-stat-card">
              <span className="label">Weekly</span>
              <span className="val neg">- 0.42%</span>
           </div>
           <div className="change-stat-card">
              <span className="label">Monthly</span>
              <span className="val neg">- 2.53%</span>
           </div>
        </div>
      </div>

      {/* Range Section */}
      <div className="range-section">
        <div className="hours-title ms-header">Range</div>
        <div className="range-ui-group">
           <div className="range-ui-row">
              <div className="range-header">
                 <span className="range-label">Daily</span>
                 <div className="range-prices" style={{display: 'flex', gap: '8px'}}>
                    <span className="range-price down">L: 1.14997</span>
                    <span className="range-price up">H: 1.15458</span>
                 </div>
              </div>
              <div className="range-track">
                 <div className="range-indicator" style={{ left: '42%' }}>
                    <i className="fa-solid fa-caret-up"></i>
                 </div>
              </div>
           </div>

           <div className="range-ui-row">
              <div className="range-header">
                 <span className="range-label">Weekly</span>
                 <div className="range-prices" style={{display: 'flex', gap: '8px'}}>
                    <span className="range-price down">L: 1.14825</span>
                    <span className="range-price up">H: 1.16378</span>
                 </div>
              </div>
              <div className="range-track">
                 <div className="range-indicator" style={{ left: '35%' }}>
                    <i className="fa-solid fa-caret-up"></i>
                 </div>
              </div>
           </div>

           <div className="range-ui-row">
              <div className="range-header">
                 <span className="range-label">Monthly</span>
                 <div className="range-prices" style={{display: 'flex', gap: '8px'}}>
                    <span className="range-price down">L: 1.14088</span>
                    <span className="range-price up">H: 1.17939</span>
                 </div>
              </div>
              <div className="range-track">
                 <div className="range-indicator" style={{ left: '55%' }}>
                    <i className="fa-solid fa-caret-up"></i>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const SymbolInfoView = () => {
    const precisionFactor = Math.pow(10, symbol?.precision || 5);
    const spreadInQuote = (symbol?.spread || 0) / precisionFactor;
    
    // Margin Prediction for the UI
    const contractSize = symbol?.category === 'Metals' ? 100 : 100000;
    const leverage = 100; // Simplified for UI, actual is per client
    const marginReq = (parseFloat(symbol?.price || 0) * parseFloat(volume) * contractSize) / leverage;

    return (
      <div className="symbol-info-content animate-fade">
        <div className="spec-grid">
           <div className="spec-item">
              <span className="label">Details</span>
              <span className="val">{symbol?.name || '---'}</span>
           </div>
           <div className="spec-item">
              <span className="label">Symbol Class</span>
              <span className="val">{symbol?.category || '---'}</span>
           </div>
           <div className="spec-item">
              <span className="label">Current Spread</span>
              <span className="val" style={{ color: 'var(--accent)' }}>{symbol?.spread} points</span>
              <small style={{ opacity: 0.6 }}>≈ {spreadInQuote.toFixed(symbol?.precision)} {symbol?.quoteCurrency}</small>
           </div>
           <div className="spec-item">
              <span className="label">Required Margin</span>
              <span className="val" style={{ color: '#f59e0b', fontWeight: 800 }}>{marginReq.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span>
              <small style={{ opacity: 0.6 }}>for {volume} lot(s)</small>
           </div>
           <div className="spec-item">
              <span className="label">Min. Position Size</span>
              <span className="val">{symbol?.lotMin || '0.01'}</span>
           </div>
           <div className="spec-item">
              <span className="label">Point Size</span>
              <span className="val">{(1 / precisionFactor).toFixed(symbol?.precision)}</span>
           </div>
           <div className="spec-item">
              <span className="label">Nominal Value of 1 Lot</span>
              <span className="val">{(parseFloat(symbol?.price) * contractSize).toLocaleString()} USD</span>
           </div>
           <div className="spec-item">
              <span className="label">Leverage</span>
              <span className="val">1 : {leverage}</span>
           </div>
           <div className="spec-item">
              <span className="label">Trading Session</span>
              <span className="val">24/5 GMT</span>
           </div>
        </div>

        <div className="market-hours-section">
           <div className="hours-title">
              Market Hours
              <i className="fa-solid fa-chevron-up" style={{fontSize: '12px', color: 'var(--accent)'}}></i>
           </div>
           <div className="hours-grid">
              {[ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' ].map(day => (
                <div key={day} className="hours-day-card">
                   <span className="day-name">{day}</span>
                   <div className="day-times">
                      <span className="time-slot">00:00-24:00</span>
                   </div>
                </div>
              ))}
              <div className="hours-day-card">
                 <span className="day-name">Sat / Sun</span>
                 <span className="market-closed">
                    <i className="fa-solid fa-moon" style={{marginRight: '6px', color: '#fbbf24'}}></i>
                    Market closed
                 </span>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const CalendarView = () => (
    <div className="empty-state animate-fade">
       <div className="placeholder-icon">
          <i className="fa-solid fa-calendar-days"></i>
       </div>
       <p className="empty-title">No calendar events</p>
       <p className="empty-subtitle">Upcoming market events will appear here.</p>
    </div>
  );

  const [volume, setVolume] = useState('0.10');
  const [execMode, setExecMode] = useState('Market'); // Market or Pending
  const [atPrice, setAtPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  // Sync At Price with market price when switching to Pending for convenience
  const handleModeToggle = (mode) => {
    setExecMode(mode);
    if (mode === 'Pending' && !atPrice) {
      setAtPrice(symbol?.price || '');
    }
  };

  const handleBuy = () => {
     if (symbol && onTrade) {
       onTrade(symbol.name, parseFloat(volume), 'BUY', execMode === 'Pending' ? parseFloat(atPrice) : null, parseFloat(stopLoss) || null, parseFloat(takeProfit) || null);
     }
  }

  const handleSell = () => {
     if (symbol && onTrade) {
       onTrade(symbol.name, parseFloat(volume), 'SELL', execMode === 'Pending' ? parseFloat(atPrice) : null, parseFloat(stopLoss) || null, parseFloat(takeProfit) || null);
     }
  }

  return (
    <div className="card asset-info-card">
      <div className="tabs-header">
        <div 
          className={`tab-item ${activeTab === 'Calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('Calendar')}
        >
          Calendar
        </div>
        <div 
          className={`tab-item ${activeTab === 'Market' ? 'active' : ''}`}
          onClick={() => setActiveTab('Market')}
        >
          Market
        </div>
        <div 
          className={`tab-item ${activeTab === 'Symbol info' ? 'active' : ''}`}
          onClick={() => setActiveTab('Symbol info')}
        >
          Symbol info
        </div>
      </div>

      <div className="asset-info-body">
         {/* Trading Input Area */}
         {symbol && (
           <div className="trading-execution-panel animate-fade">
              <div className="exec-mode-selector">
                 <button 
                   className={`mode-btn ${execMode === 'Market' ? 'active' : ''}`}
                   onClick={() => handleModeToggle('Market')}
                 >
                   Market Execution
                 </button>
                 <button 
                   className={`mode-btn ${execMode === 'Pending' ? 'active' : ''}`}
                   onClick={() => handleModeToggle('Pending')}
                 >
                   Pending Order
                 </button>
              </div>

              <div className="input-row-group">
                 <div className="lot-input-wrapper" style={{ flex: 1, marginBottom: 0 }}>
                    <span className="lot-label">Volume (Lots)</span>
                    <div className="lot-control">
                       <button className="lot-btn" onClick={() => setVolume((prev) => Math.max(0.01, parseFloat(prev) - 0.01).toFixed(2))}>-</button>
                       <input 
                         type="number" 
                         className="lot-input" 
                         value={volume} 
                         onChange={(e) => setVolume(e.target.value)}
                         step="0.01"
                         min="0.01"
                       />
                       <button className="lot-btn" onClick={() => setVolume((prev) => (parseFloat(prev) + 0.01).toFixed(2))}>+</button>
                    </div>
                 </div>

                 {execMode === 'Pending' && (
                   <div className="lot-input-wrapper animate-pop" style={{ flex: 1, marginBottom: 0 }}>
                      <span className="lot-label">At Price</span>
                      <div className="lot-control" style={{ borderColor: 'var(--accent)' }}>
                         <input 
                           type="number" 
                           className="lot-input" 
                           value={atPrice} 
                           onChange={(e) => setAtPrice(e.target.value)}
                           step="0.0001"
                        />
                      </div>
                   </div>
                 )}
              </div>

              <div className="input-row-group">
                 <div className="lot-input-wrapper" style={{ flex: 1, marginBottom: 0 }}>
                    <span className="lot-label">Take Profit (TP)</span>
                    <div className="lot-control">
                       <input 
                         type="number" 
                         className="lot-input" 
                         value={takeProfit} 
                         onChange={(e) => setTakeProfit(e.target.value)}
                         placeholder="Optional"
                         step="0.0001"
                       />
                    </div>
                 </div>
                 
                 <div className="lot-input-wrapper" style={{ flex: 1, marginBottom: 0 }}>
                    <span className="lot-label">Stop Loss (SL)</span>
                    <div className="lot-control">
                       <input 
                         type="number" 
                         className="lot-input" 
                         value={stopLoss} 
                         onChange={(e) => setStopLoss(e.target.value)}
                         placeholder="Optional"
                         step="0.0001"
                       />
                    </div>
                 </div>
              </div>

              <div className="exec-buttons">
                 <button 
                   className="exec-btn sell"
                   onClick={handleSell}
                 >
                    <div className="exec-side">
                       {execMode === 'Market' ? 'SELL' : 'SELL LIMIT'}
                       {!isVerified && <span style={{ marginLeft: 8, background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' }}>DEMO</span>}
                    </div>
                    <div className="exec-symbol">{symbol.name}</div>
                 </button>
                 <button 
                   className="exec-btn buy"
                   onClick={handleBuy}
                 >
                    <div className="exec-side">
                       {execMode === 'Market' ? 'BUY' : 'BUY LIMIT'}
                       {!isVerified && <span style={{ marginLeft: 8, background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' }}>DEMO</span>}
                    </div>
                    <div className="exec-symbol">{symbol.name}</div>
                 </button>
              </div>
           </div>
         )}

         {activeTab === 'Market' && <MarketView />}
         {activeTab === 'Symbol info' && <SymbolInfoView />}
         {activeTab === 'Calendar' && <CalendarView />}

         <style>{`
            .trading-execution-panel {
               margin-bottom: 24px;
               background: rgba(255, 255, 255, 0.02);
               padding: 20px;
               border-radius: 16px;
               border: 1px solid rgba(255, 255, 255, 0.05);
            }
            .exec-mode-selector {
               display: flex;
               gap: 8px;
               margin-bottom: 20px;
               background: rgba(0, 0, 0, 0.2);
               padding: 4px;
               border-radius: 10px;
            }
            .mode-btn {
               flex: 1;
               padding: 8px;
               border-radius: 8px;
               border: none;
               background: none;
               color: var(--text-muted);
               font-size: 11px;
               font-weight: 700;
               cursor: pointer;
               transition: all 0.2s;
            }
            .mode-btn.active {
               background: var(--accent);
               color: white;
               box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            }
            .lot-input-wrapper {
               margin-bottom: 20px;
               display: flex;
               flex-direction: column;
               gap: 8px;
            }
            .lot-label {
               font-size: 11px;
               font-weight: 700;
               text-transform: uppercase;
               letter-spacing: 1px;
               color: var(--text-muted);
            }
            .lot-control {
               display: flex;
               align-items: center;
               background: rgba(0, 0, 0, 0.2);
               border: 1px solid var(--border-color);
               border-radius: 12px;
               overflow: hidden;
            }
            .lot-btn {
               width: 48px;
               height: 48px;
               background: none;
               border: none;
               color: var(--text-primary);
               font-size: 20px;
               cursor: pointer;
               transition: all 0.2s;
            }
            .lot-btn:hover {
               background: rgba(255, 255, 255, 0.05);
               color: var(--accent-color);
            }
            .lot-input {
               flex: 1;
               background: none;
               border: none;
               border-left: 1px solid var(--border-color);
               border-right: 1px solid var(--border-color);
               color: #fff;
               text-align: center;
               font-family: 'Space Mono', monospace;
               font-size: 16px;
               font-weight: 700;
            }
            .exec-buttons {
               display: flex;
               gap: 12px;
            }
            .exec-btn {
               flex: 1;
               padding: 16px;
               border-radius: 14px;
               border: none;
               cursor: pointer;
               transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
               display: flex;
               flex-direction: column;
               align-items: center;
               gap: 4px;
            }
            .exec-btn.sell {
               background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.2) 100%);
               border: 1px solid rgba(239, 68, 68, 0.3);
               color: #f87171;
            }
            .exec-btn.buy {
               background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.2) 100%);
               border: 1px solid rgba(16, 185, 129, 0.3);
               color: #34d399;
            }
            .exec-btn:hover {
               transform: translateY(-2px);
               filter: brightness(1.2);
            }
            .exec-btn:active {
               transform: translateY(0);
            }
            .exec-btn.sell:hover {
               box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
            }
            .exec-btn.buy:hover {
               box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
            }
            .exec-side {
               font-size: 11px;
               font-weight: 800;
               letter-spacing: 2px;
            }
            .exec-symbol {
               font-size: 14px;
               font-weight: 700;
               font-family: 'Outfit', sans-serif;
            }

            @media (max-width: 600px) {
               .trading-execution-panel { padding: 12px; }
               .lot-btn { width: 40px; height: 40px; }
               .lot-input { font-size: 14px; }
               .exec-btn { padding: 12px; }
            }

            @media (max-width: 480px) {
               .exec-buttons { flex-direction: column; }
               .input-row-group { flex-direction: column; gap: 0; }
               .exec-btn { width: 100%; flex-direction: row; justify-content: space-between; padding: 14px 20px; }
               .exec-side { font-size: 12px; }
               .exec-symbol { font-size: 16px; }
            }
         `}</style>
      </div>
    </div>
  );
};

export default AssetInfo;
