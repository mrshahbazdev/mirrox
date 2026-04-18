import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';

const AssetInfo = ({ symbol, onTrade, compact }) => {
  const { currentClientExtended } = useTrading();
  const isVerified = currentClientExtended?.kyc?.status === 'approved';
  const [activeTab, setActiveTab] = useState('Market');

  const MarketView = () => (
    <div className="market-tab-content animate-fade">
       {!compact && (
         <div className="market-empty-msg">
            <i className="fa-solid fa-chart-pie market-empty-icon"></i>
            Market data for {symbol?.name || 'this asset'} is currently being updated.
         </div>
       )}
    </div>
  );

  const SymbolInfoView = () => {
    const precisionFactor = Math.pow(10, symbol?.precision || 5);
    const spreadInQuote = (symbol?.spread || 0) / precisionFactor;
    
    const contractSize = symbol?.category === 'Metals' ? 100 : 100000;
    const leverage = 100;
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
              <span className="val spec-val-accent">{symbol?.spread} points</span>
              <small className="spec-val-sub">≈ {spreadInQuote.toFixed(symbol?.precision)} {symbol?.quoteCurrency}</small>
           </div>
           <div className="spec-item">
              <span className="label">Required Margin</span>
              <span className="val spec-val-warning">{marginReq.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span>
              <small className="spec-val-sub">for {volume} lot(s)</small>
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
              <i className="fa-solid fa-chevron-up hours-chevron"></i>
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
                    <i className="fa-solid fa-moon moon-icon"></i>
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
  const [execMode, setExecMode] = useState('Market');
  const [atPrice, setAtPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [lastPopulatedSymbol, setLastPopulatedSymbol] = useState(null);

  useEffect(() => {
    if (symbol && symbol.id !== lastPopulatedSymbol) {
      const price = parseFloat(symbol.price || 0);
      if (price > 0) {
        const precision = symbol.precision || 2;
        const offset = 100 / Math.pow(10, precision);
        
        setTakeProfit((price + offset).toFixed(precision));
        setStopLoss((price - offset).toFixed(precision));
        setLastPopulatedSymbol(symbol.id);
      }
    }
  }, [symbol, lastPopulatedSymbol]);

  const handleModeToggle = (mode) => {
    setExecMode(mode);
    if (mode === 'Pending' && !atPrice) {
      setAtPrice(symbol?.price || '');
    }
  };

  const handleBuy = () => {
     if (symbol && onTrade) {
       onTrade(symbol.symbol, parseFloat(volume), 'BUY', execMode === 'Pending' ? parseFloat(atPrice) : null, parseFloat(stopLoss) || null, parseFloat(takeProfit) || null);
     }
  }

  const handleSell = () => {
     if (symbol && onTrade) {
       onTrade(symbol.symbol, parseFloat(volume), 'SELL', execMode === 'Pending' ? parseFloat(atPrice) : null, parseFloat(stopLoss) || null, parseFloat(takeProfit) || null);
     }
  }

  return (
    <div className="card asset-info-card">
      {!compact && (
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
      )}

      <div className="asset-info-body">
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
                 <div className="lot-input-wrapper">
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
                   <div className="lot-input-wrapper animate-pop">
                      <span className="lot-label">At Price</span>
                      <div className="lot-control accent-border">
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
                 <div className="lot-input-wrapper">
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
                 
                 <div className="lot-input-wrapper">
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
                    <div className="exec-side">{execMode === 'Market' ? 'SELL' : 'SELL LIMIT'}</div>
                    <div className="exec-price">
                       {parseFloat(symbol?.price || 0).toFixed(symbol?.precision || 2)}
                    </div>
                 </button>
                 <button 
                   className="exec-btn buy"
                   onClick={handleBuy}
                 >
                    <div className="exec-side">{execMode === 'Market' ? 'BUY' : 'BUY LIMIT'}</div>
                    <div className="exec-price">
                       {(() => {
                          const precisionFactor = Math.pow(10, symbol?.precision || 5);
                          const spreadInQuote = (symbol?.spread || 0) / precisionFactor;
                          return (parseFloat(symbol?.price || 0) + spreadInQuote).toFixed(symbol?.precision || 2);
                       })()}
                    </div>
                 </button>
              </div>
           </div>
         )}

         {activeTab === 'Market' && <MarketView />}
         {activeTab === 'Symbol info' && <SymbolInfoView />}
         {activeTab === 'Calendar' && <CalendarView />}
      </div>
    </div>
  );
};

export default AssetInfo;
