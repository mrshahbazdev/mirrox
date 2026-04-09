import React, { useState } from 'react';

const MarketWatch = ({ symbols, selectedSymbol, onSelectSymbol }) => {
  const [activeTab, setActiveTab] = useState('Favorites');

  // Sort symbols by absolute percentage change when in Top Movers tab
  const displaySymbols = activeTab === 'Top Movers' 
    ? [...symbols].sort((a, b) => Math.abs(parseFloat(b.change)) - Math.abs(parseFloat(a.change)))
    : symbols;

  return (
    <div className="card market-watch-card">
      <div className="tabs-header">
        <div 
          className={`tab-item ${activeTab === 'Favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('Favorites')}
        >
          Favorites
        </div>
        <div 
          className={`tab-item ${activeTab === 'Top Movers' ? 'active' : ''}`}
          onClick={() => setActiveTab('Top Movers')}
        >
          Top Movers
        </div>
        <div className="search-icon-wrapper" style={{ marginLeft: 'auto' }}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      <div className="marketwatch-list">
        {displaySymbols.map((sym) => (
          <div 
            key={sym.id} 
            className={`symbol-row ${selectedSymbol.id === sym.id ? 'active' : ''}`}
            onClick={() => onSelectSymbol(sym)}
          >
            <div className="sym-icon">
               <i className={`fa-solid ${sym.iconClassName || 'fa-coins'}`}></i>
            </div>
            <div className="sym-info">
              <span className="sym-name">{sym.name}</span>
              <span className="sym-spread">Spread: {sym.spread} · {sym.quoteCurrency || 'USD'}</span>
            </div>
            <div className="price-block">
              {sym.price}
            </div>
            <div className={`change-block ${sym.change >= 0 ? 'up' : 'down'}`}>
              {sym.change >= 0 ? '+' : ''}{sym.change}%
            </div>
          </div>
        ))}
      </div>

      <div className="trade-panel glass">
        <div className="trade-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
           <span style={{ fontSize: '14px', fontWeight: 700 }}>{selectedSymbol.name}</span>
           <div className="lot-selector">
              <i className="fa-solid fa-minus"></i>
              <span>0.01</span>
              <i className="fa-solid fa-plus"></i>
           </div>
        </div>

        <div className="order-controls">
          <button className="btn-trade btn-sell">
            <div className="order-label">SELL</div>
            <div className="order-price">{selectedSymbol.price}</div>
          </button>
          <button className="btn-trade btn-buy">
            <div className="order-label">BUY</div>
            <div className="order-price">{(parseFloat(selectedSymbol.price) + 0.0001).toFixed(selectedSymbol.precision)}</div>
          </button>
        </div>
        
        <div className="advanced-toggle" style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
           <span>Advanced Order</span>
           <i className="fa-solid fa-toggle-off" style={{ fontSize: '16px', cursor: 'pointer' }}></i>
        </div>
      </div>

      <style>{`
        .lot-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-hover);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          border: 1px solid var(--border);
        }
        .lot-selector i {
          cursor: pointer;
          opacity: 0.6;
          transition: 0.2s;
        }
        .lot-selector i:hover { opacity: 1; color: var(--accent); }
        .order-label { font-size: 10px; font-weight: 800; margin-bottom: 2px; }
        .order-price { font-size: 15px; font-family: 'Space Mono', monospace; }
        .btn-trade {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid transparent;
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default MarketWatch;
