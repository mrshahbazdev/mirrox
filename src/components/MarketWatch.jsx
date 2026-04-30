import React, { useState } from 'react';

const MarketWatch = ({ symbols, selectedSymbol, onSelectSymbol, onTrade }) => {
  const [activeTab, setActiveTab] = useState('Favorites');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSymbolId, setExpandedSymbolId] = useState(null);
  const [advancedOrderSymbol, setAdvancedOrderSymbol] = useState(null);

  // Quick trade state
  const [quickVolume, setQuickVolume] = useState('0.01');

  // Advanced order state
  const [advExecMode, setAdvExecMode] = useState('Market');
  const [advVolume, setAdvVolume] = useState('0.01');
  const [advAtPrice, setAdvAtPrice] = useState('');
  const [advStopLoss, setAdvStopLoss] = useState('');
  const [advTakeProfit, setAdvTakeProfit] = useState('');
  const [slEnabled, setSlEnabled] = useState(false);
  const [tpEnabled, setTpEnabled] = useState(false);
  const [riskMode, setRiskMode] = useState(false);

  const displaySymbols = (() => {
    let baseList = [...symbols];
    if (activeTab === 'Top Movers') {
      baseList = baseList.sort((a, b) => {
        const changeA = Math.abs(parseFloat(a.change) || 0);
        const changeB = Math.abs(parseFloat(b.change) || 0);
        return changeB - changeA;
      });
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return baseList.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.symbol && s.symbol.toLowerCase().includes(q))
      );
    }
    return baseList;
  })();

  const handleSymbolClick = (sym) => {
    onSelectSymbol(sym);
    if (expandedSymbolId === sym.id) {
      setExpandedSymbolId(null);
    } else {
      setExpandedSymbolId(sym.id);
      setQuickVolume('0.01');
    }
  };

  const openAdvancedOrder = (sym) => {
    setAdvancedOrderSymbol(sym);
    setAdvExecMode('Market');
    setAdvVolume(quickVolume);
    setAdvAtPrice(sym.price || '');
    setAdvStopLoss('');
    setAdvTakeProfit('');
    setSlEnabled(false);
    setTpEnabled(false);
    setRiskMode(false);
  };

  const closeAdvancedOrder = () => {
    setAdvancedOrderSymbol(null);
  };

  const handleQuickTrade = (sym, side) => {
    if (onTrade) {
      onTrade(sym.symbol, parseFloat(quickVolume), side, null, null, null);
    }
  };

  const handleAdvancedTrade = (side) => {
    if (onTrade && advancedOrderSymbol) {
      const sym = advancedOrderSymbol;
      onTrade(
        sym.symbol,
        parseFloat(advVolume),
        side,
        advExecMode === 'Pending' ? parseFloat(advAtPrice) : null,
        slEnabled ? (parseFloat(advStopLoss) || null) : null,
        tpEnabled ? (parseFloat(advTakeProfit) || null) : null
      );
    }
  };

  const getAskPrice = (sym) => {
    const precisionFactor = Math.pow(10, sym?.precision || 5);
    const spreadInQuote = (sym?.spread || 0) / precisionFactor;
    return (parseFloat(sym?.price || 0) + spreadInQuote).toFixed(sym?.precision || 2);
  };

  const getBidPrice = (sym) => {
    return parseFloat(sym?.price || 0).toFixed(sym?.precision || 2);
  };

  const getContractValue = (sym, vol) => {
    const contractSize = sym?.category === 'Metals' ? 100 : 100000;
    return (parseFloat(sym?.price || 0) * parseFloat(vol || 0.01) * contractSize).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  // Advanced Order Panel
  if (advancedOrderSymbol) {
    const sym = symbols.find(s => s.id === advancedOrderSymbol.id) || advancedOrderSymbol;
    const contractSize = sym?.category === 'Metals' ? 100 : 100000;
    const leverage = 100;
    const marginReq = (parseFloat(sym?.price || 0) * parseFloat(advVolume) * contractSize) / leverage;
    const precisionFactor = Math.pow(10, sym?.precision || 5);
    const spreadVal = (sym?.spread || 0) / precisionFactor;

    return (
      <div className="card market-watch-card mw-advanced-panel">
        <div className="mw-adv-header">
          <div className="mw-adv-title-wrap">
            <h3 className="mw-adv-symbol">{sym.name}</h3>
            <span className="mw-adv-category">{sym.category || 'FOREX'}</span>
          </div>
          <div className="mw-adv-header-actions">
            <i className="fa-solid fa-star mw-adv-star"></i>
            <i className="fa-solid fa-xmark mw-adv-close" onClick={closeAdvancedOrder}></i>
          </div>
        </div>

        <div className="mw-adv-tabs">
          <button className={`mw-adv-tab ${advExecMode === 'Market' ? 'active' : ''}`} onClick={() => setAdvExecMode('Market')}>Market</button>
          <button className={`mw-adv-tab ${advExecMode === 'Pending' ? 'active' : ''}`} onClick={() => setAdvExecMode('Pending')}>Pending</button>
        </div>

        <div className="mw-adv-body">
          <div className="mw-adv-volume-section">
            <div className="mw-adv-volume-label">
              <span>Volume</span>
              <div className="mw-adv-risk-mode" onClick={() => setRiskMode(!riskMode)}>
                <span>Risk Mode</span>
                <div className={`mw-toggle mw-toggle-sm ${riskMode ? 'on' : ''}`}>
                  <span className="mw-toggle-knob" />
                </div>
              </div>
            </div>
            {riskMode && (
              <div className="mw-adv-risk-info">
                <i className="fa-solid fa-circle-info"></i>
                <span>Volume is calculated as % of your free margin</span>
              </div>
            )}
            <div className="mw-adv-volume-control">
              <button className="mw-adv-vol-btn" onClick={() => setAdvVolume(prev => Math.max(0.01, parseFloat(prev) - 0.01).toFixed(2))}>
                <i className="fa-solid fa-minus"></i>
              </button>
              <div className="mw-adv-vol-display">
                <input
                  type="number"
                  className="mw-adv-vol-input"
                  value={advVolume}
                  onChange={(e) => setAdvVolume(e.target.value)}
                  step="0.01"
                  min="0.01"
                />
                <span className="mw-adv-vol-usd">≈ {getContractValue(sym, advVolume)} USD</span>
              </div>
              <button className="mw-adv-vol-btn" onClick={() => setAdvVolume(prev => (parseFloat(prev) + 0.01).toFixed(2))}>
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          {advExecMode === 'Pending' && (
            <div className="mw-adv-field">
              <span className="mw-adv-field-label">At Price</span>
              <input
                type="number"
                className="mw-adv-field-input"
                value={advAtPrice}
                onChange={(e) => setAdvAtPrice(e.target.value)}
                step="0.0001"
              />
            </div>
          )}

          <div className="mw-adv-toggle-row" onClick={() => setSlEnabled(!slEnabled)}>
            <div className={`mw-toggle ${slEnabled ? 'on' : ''}`}>
              <span className="mw-toggle-knob" />
            </div>
            <span className="mw-adv-toggle-label">Stop Loss</span>
          </div>
          {slEnabled && (
            <div className="mw-adv-field">
              <input
                type="number"
                className="mw-adv-field-input"
                value={advStopLoss}
                onChange={(e) => setAdvStopLoss(e.target.value)}
                placeholder="Stop Loss price"
                step="0.0001"
              />
            </div>
          )}

          <div className="mw-adv-toggle-row" onClick={() => setTpEnabled(!tpEnabled)}>
            <div className={`mw-toggle ${tpEnabled ? 'on' : ''}`}>
              <span className="mw-toggle-knob" />
            </div>
            <span className="mw-adv-toggle-label">Take Profit</span>
          </div>
          {tpEnabled && (
            <div className="mw-adv-field">
              <input
                type="number"
                className="mw-adv-field-input"
                value={advTakeProfit}
                onChange={(e) => setAdvTakeProfit(e.target.value)}
                placeholder="Take Profit price"
                step="0.0001"
              />
            </div>
          )}

          <div className="mw-adv-info-grid">
            <div className="mw-adv-info-row">
              <span>Required margin:</span>
              <span>{marginReq.toFixed(2)} USD</span>
            </div>
            <div className="mw-adv-info-row">
              <span>Spread:</span>
              <span>{spreadVal.toFixed(sym?.precision || 2)} USD</span>
            </div>
            <div className="mw-adv-info-row">
              <span>Commission:</span>
              <span>0.00 USD</span>
            </div>
          </div>

          <div className="mw-adv-exec-buttons">
            <button className="mw-adv-exec-btn sell" onClick={() => handleAdvancedTrade('SELL')}>
              <span className="mw-adv-exec-label">SELL</span>
              <span className="mw-adv-exec-price">{getBidPrice(sym)}</span>
            </button>
            <button className="mw-adv-exec-btn buy" onClick={() => handleAdvancedTrade('BUY')}>
              <span className="mw-adv-exec-label">BUY</span>
              <span className="mw-adv-exec-price">{getAskPrice(sym)}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <div key={sym.id}>
            <div
              className={`symbol-row ${selectedSymbol.id === sym.id ? 'active' : ''}`}
              onClick={() => handleSymbolClick(sym)}
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

            {expandedSymbolId === sym.id && (
              <div className="mw-quick-trade">
                <div className="mw-qt-row">
                  <button className="mw-qt-btn sell" onClick={() => handleQuickTrade(sym, 'SELL')}>
                    <span className="mw-qt-label">SELL</span>
                    <span className="mw-qt-price">{getBidPrice(sym)}</span>
                  </button>
                  <div className="mw-qt-volume">
                    <div className="mw-qt-vol-control">
                      <span className="mw-qt-vol-value">{quickVolume}</span>
                      <span className="mw-qt-vol-usd">≈ {getContractValue(sym, quickVolume)} USD</span>
                    </div>
                    <div className="mw-qt-vol-btns">
                      <button className="mw-qt-vol-btn" onClick={(e) => { e.stopPropagation(); setQuickVolume(prev => Math.max(0.01, parseFloat(prev) - 0.01).toFixed(2)); }}>
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <button className="mw-qt-vol-btn" onClick={(e) => { e.stopPropagation(); setQuickVolume(prev => (parseFloat(prev) + 0.01).toFixed(2)); }}>
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <button className="mw-qt-btn buy" onClick={() => handleQuickTrade(sym, 'BUY')}>
                    <span className="mw-qt-label">BUY</span>
                    <span className="mw-qt-price">{getAskPrice(sym)}</span>
                  </button>
                </div>
                <div className="mw-qt-advanced-row">
                  <span className="mw-qt-advanced-link" onClick={(e) => { e.stopPropagation(); openAdvancedOrder(sym); }}>
                    <i className="fa-solid fa-sliders"></i> Advanced Order
                  </span>
                  <div className="mw-qt-actions">
                    <i className="fa-solid fa-circle-info mw-qt-action-icon"></i>
                    <i className="fa-solid fa-star mw-qt-action-icon"></i>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketWatch;
