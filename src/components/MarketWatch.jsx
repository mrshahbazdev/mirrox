import React, { useState } from 'react';

const MarketWatch = ({ symbols, selectedSymbol, onSelectSymbol }) => {
  const [activeTab, setActiveTab] = useState('Favorites');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering Logic: Combines tab selection, real-time search, and robust sorting
  const displaySymbols = (() => {
    let baseList = [...symbols];
    
    // 1. Sort by Change for Top Movers
    if (activeTab === 'Top Movers') {
      baseList = baseList.sort((a, b) => {
        const changeA = Math.abs(parseFloat(a.change) || 0);
        const changeB = Math.abs(parseFloat(b.change) || 0);
        return changeB - changeA;
      });
    }
    
    // 2. Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return baseList.filter(s => 
        s.name.toLowerCase().includes(q) || 
        (s.symbol && s.symbol.toLowerCase().includes(q))
      );
    }
    return baseList;
  })();

  return (
    <div className="card market-watch-card">
      <div className="tabs-header">
        {!showSearch ? (
          <>
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
            <div className="search-icon-wrapper" style={{ marginLeft: 'auto', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowSearch(true)}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </>
        ) : (
          <div className="search-input-wrapper" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--accent)', fontSize: '13px' }}></i>
            <input 
              type="text" 
              className="market-search-input"
              style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }}
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <i 
              className="fa-solid fa-xmark" 
              style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '14px' }}
              onClick={() => { setShowSearch(false); setSearchQuery(''); }}
            ></i>
          </div>
        )}
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
