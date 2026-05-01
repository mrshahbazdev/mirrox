import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';

const MarketWatch = ({ symbols, selectedSymbol, onSelectSymbol, onTrade }) => {
  const { currentClientExtended } = useTrading();
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
  const [riskPercent, setRiskPercent] = useState(0);
  const [advSide, setAdvSide] = useState('Sell');
  const [riskSlPrice, setRiskSlPrice] = useState('');
  const [riskAmount, setRiskAmount] = useState('0.00');
  const [trailingStop, setTrailingStop] = useState(false);

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
    setRiskPercent(0);
    setAdvSide('Sell');
    setRiskSlPrice('');
    setRiskAmount('0.00');
    setTrailingStop(false);
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
      const sym = symbols.find(s => s.id === advancedOrderSymbol.id) || advancedOrderSymbol;
      const currentPrice = parseFloat(sym?.price || 0);
      const isPending = advExecMode === 'Pending';

      let tp = tpEnabled ? (parseFloat(advTakeProfit) || null) : null;
      let sl = slEnabled ? (parseFloat(advStopLoss) || null) : null;

      // Validate TP/SL direction for market orders
      if (!isPending && tp) {
        if (side === 'BUY' && tp <= currentPrice) tp = null;
        if (side === 'SELL' && tp >= currentPrice) tp = null;
      }
      if (!isPending && sl) {
        if (side === 'BUY' && sl >= currentPrice) sl = null;
        if (side === 'SELL' && sl <= currentPrice) sl = null;
      }

      onTrade(
        sym.symbol,
        parseFloat(advVolume),
        side,
        isPending ? parseFloat(advAtPrice) : null,
        sl,
        tp
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
    const currentPrice = parseFloat(sym?.price || 0);
    const slPriceNum = parseFloat(riskSlPrice) || 0;
    const riskPoints = slPriceNum && currentPrice ? Math.abs(Math.round((currentPrice - slPriceNum) * precisionFactor)) : 0;
    const riskPctOfPrice = currentPrice ? ((riskPoints / precisionFactor) / currentPrice * 100).toFixed(2) : '0.00';

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
                <i className="fa-solid fa-circle-info mw-risk-info-icon"></i>
                <div className={`mw-toggle mw-toggle-sm ${riskMode ? 'on' : ''}`}>
                  <span className="mw-toggle-knob" />
                </div>
              </div>
            </div>

            {riskMode ? (
              <>
                {(!riskSlPrice || parseFloat(riskAmount) <= 0) && (
                  <div className="mw-risk-invalid">
                    <span className="mw-risk-invalid-title">Invalid volume</span>
                    <span className="mw-risk-invalid-sub">Change Stop Loss or Risk Amount</span>
                  </div>
                )}
                <div className="mw-risk-slider-section">
                  <input
                    type="range"
                    className="mw-risk-slider"
                    min="0"
                    max="100"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(Number(e.target.value))}
                  />
                  <span className="mw-risk-slider-label">{riskPercent}%</span>
                </div>
              </>
            ) : (
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
            )}
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

          {riskMode ? (
            <>
              <div className="mw-risk-sl-header">
                <div className="mw-risk-sl-left">
                  <span className="mw-risk-sl-title">Stop Loss</span>
                  <span className="mw-risk-sl-type">Price</span>
                </div>
                <div className="mw-risk-sl-right">
                  <span className="mw-risk-sl-title">Risk Amount</span>
                  <span className="mw-risk-sl-type">Value</span>
                </div>
              </div>
              <div className="mw-risk-sl-inputs">
                <div className="mw-risk-input-group">
                  <button className="mw-adv-vol-btn" onClick={() => setRiskSlPrice(prev => (parseFloat(prev || currentPrice) - 1 / precisionFactor).toFixed(sym?.precision || 5))}>
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    className="mw-risk-input"
                    value={riskSlPrice}
                    onChange={(e) => setRiskSlPrice(e.target.value)}
                    placeholder={currentPrice.toFixed(sym?.precision || 5)}
                    step={1 / precisionFactor}
                  />
                  <button className="mw-adv-vol-btn" onClick={() => setRiskSlPrice(prev => (parseFloat(prev || currentPrice) + 1 / precisionFactor).toFixed(sym?.precision || 5))}>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
                <div className="mw-risk-input-group">
                  <button className="mw-adv-vol-btn" onClick={() => setRiskAmount(prev => Math.max(0, parseFloat(prev) - 0.10).toFixed(2))}>
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    className="mw-risk-input"
                    value={riskAmount}
                    onChange={(e) => setRiskAmount(e.target.value)}
                    step="0.10"
                    min="0"
                  />
                  <button className="mw-adv-vol-btn" onClick={() => setRiskAmount(prev => (parseFloat(prev) + 0.10).toFixed(2))}>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
              <div className="mw-risk-sl-meta">
                <span className="mw-risk-sl-points">
                  <i className="fa-solid fa-caret-down" style={{ color: 'var(--accent)' }}></i>
                  {riskPoints} Points
                </span>
                <span className="mw-risk-sl-pct">{riskPctOfPrice} %</span>
              </div>

              <div className="mw-adv-toggle-row" onClick={() => setTrailingStop(!trailingStop)}>
                <div className={`mw-toggle ${trailingStop ? 'on' : ''}`}>
                  <span className="mw-toggle-knob" />
                </div>
                <span className="mw-adv-toggle-label">Trailing Stop</span>
                <i className="fa-solid fa-circle-info mw-risk-info-icon" style={{ marginLeft: '6px' }}></i>
              </div>

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

              <div className="mw-risk-side-section">
                <span className="mw-risk-side-label">Side</span>
                <div className="mw-risk-side-btns">
                  <button
                    className={`mw-risk-side-btn ${advSide === 'Sell' ? 'active sell' : ''}`}
                    onClick={() => setAdvSide('Sell')}
                  >
                    <i className="fa-solid fa-arrow-trend-down"></i> Sell
                  </button>
                  <button
                    className={`mw-risk-side-btn ${advSide === 'Buy' ? 'active buy' : ''}`}
                    onClick={() => setAdvSide('Buy')}
                  >
                    <i className="fa-solid fa-arrow-trend-up"></i> Buy
                  </button>
                </div>
              </div>

              <div className="mw-adv-info-grid">
                <div className="mw-adv-info-row">
                  <span>Required margin:</span>
                  <span>{marginReq.toFixed(2)} USD</span>
                </div>
                <div className="mw-adv-info-row">
                  <span>Free funds:</span>
                  <span>{(currentClientExtended?.tradingMetrics?.freeMargin || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span>
                </div>
              </div>

              <div className="mw-adv-exec-buttons">
                <button className={`mw-adv-exec-btn sell ${advSide === 'Sell' ? 'side-active' : 'side-dimmed'}`} onClick={() => handleAdvancedTrade('SELL')}>
                  <span className="mw-adv-exec-label">SELL</span>
                  <span className="mw-adv-exec-price">{getBidPrice(sym)}</span>
                </button>
                <button className={`mw-adv-exec-btn buy ${advSide === 'Buy' ? 'side-active' : 'side-dimmed'}`} onClick={() => handleAdvancedTrade('BUY')}>
                  <span className="mw-adv-exec-label">BUY</span>
                  <span className="mw-adv-exec-price">{getAskPrice(sym)}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mw-adv-sl-header">
                <div className="mw-adv-toggle-row" onClick={() => { setSlEnabled(!slEnabled); if (!slEnabled && !advStopLoss) setAdvStopLoss(currentPrice.toFixed(sym?.precision || 5)); }}>
                  <div className={`mw-toggle ${slEnabled ? 'on' : ''}`}>
                    <span className="mw-toggle-knob" />
                  </div>
                  <span className="mw-adv-toggle-label">Stop Loss</span>
                </div>
                {slEnabled && <span className="mw-adv-price-type">Price</span>}
              </div>
              {slEnabled && (
                <>
                  <div className="mw-adv-tpsl-input-row">
                    <button className="mw-adv-vol-btn" onClick={() => setAdvStopLoss(prev => (parseFloat(prev || currentPrice) - 1 / precisionFactor).toFixed(sym?.precision || 5))}>
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <input
                      type="number"
                      className="mw-adv-tpsl-input"
                      value={advStopLoss}
                      onChange={(e) => setAdvStopLoss(e.target.value)}
                      step={1 / precisionFactor}
                    />
                    <button className="mw-adv-vol-btn" onClick={() => setAdvStopLoss(prev => (parseFloat(prev || currentPrice) + 1 / precisionFactor).toFixed(sym?.precision || 5))}>
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  {(() => {
                    const slVal = parseFloat(advStopLoss) || 0;
                    const diff = slVal - currentPrice;
                    const pts = Math.abs(Math.round(diff * precisionFactor));
                    const usd = (diff * parseFloat(advVolume) * contractSize).toFixed(2);
                    const pct = currentPrice ? ((Math.abs(diff) / currentPrice) * 100).toFixed(2) : '0.00';
                    const isUp = parseFloat(usd) >= 0;
                    return (
                      <div className={`mw-adv-tpsl-info ${isUp ? 'up' : 'down'}`}>
                        <i className={`fa-solid ${isUp ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                        <span>{usd} USD</span>
                        <span>{pct}%</span>
                        <span>{pts} Points</span>
                      </div>
                    );
                  })()}
                  <div className="mw-adv-toggle-row" onClick={() => setTrailingStop(!trailingStop)}>
                    <div className={`mw-toggle ${trailingStop ? 'on' : ''}`}>
                      <span className="mw-toggle-knob" />
                    </div>
                    <span className="mw-adv-toggle-label">Trailing Stop</span>
                    <i className="fa-solid fa-circle-info mw-risk-info-icon" style={{ marginLeft: '6px' }}></i>
                  </div>
                </>
              )}

              <div className="mw-adv-sl-header">
                <div className="mw-adv-toggle-row" onClick={() => { setTpEnabled(!tpEnabled); if (!tpEnabled && !advTakeProfit) setAdvTakeProfit(currentPrice.toFixed(sym?.precision || 5)); }}>
                  <div className={`mw-toggle ${tpEnabled ? 'on' : ''}`}>
                    <span className="mw-toggle-knob" />
                  </div>
                  <span className="mw-adv-toggle-label">Take Profit</span>
                </div>
                {tpEnabled && <span className="mw-adv-price-type">Price</span>}
              </div>
              {tpEnabled && (
                <>
                  <div className="mw-adv-tpsl-input-row">
                    <button className="mw-adv-vol-btn" onClick={() => setAdvTakeProfit(prev => (parseFloat(prev || currentPrice) - 1 / precisionFactor).toFixed(sym?.precision || 5))}>
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <input
                      type="number"
                      className="mw-adv-tpsl-input"
                      value={advTakeProfit}
                      onChange={(e) => setAdvTakeProfit(e.target.value)}
                      step={1 / precisionFactor}
                    />
                    <button className="mw-adv-vol-btn" onClick={() => setAdvTakeProfit(prev => (parseFloat(prev || currentPrice) + 1 / precisionFactor).toFixed(sym?.precision || 5))}>
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  {(() => {
                    const tpVal = parseFloat(advTakeProfit) || 0;
                    const diff = tpVal - currentPrice;
                    const pts = Math.abs(Math.round(diff * precisionFactor));
                    const usd = (diff * parseFloat(advVolume) * contractSize).toFixed(2);
                    const pct = currentPrice ? ((Math.abs(diff) / currentPrice) * 100).toFixed(2) : '0.00';
                    const isUp = parseFloat(usd) >= 0;
                    return (
                      <div className={`mw-adv-tpsl-info ${isUp ? 'up' : 'down'}`}>
                        <i className={`fa-solid ${isUp ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                        <span>{usd} USD</span>
                        <span>{pct}%</span>
                        <span>{pts} Points</span>
                      </div>
                    );
                  })()}
                </>
              )}

              <div className="mw-risk-side-section">
                <span className="mw-risk-side-label">Side</span>
                <div className="mw-risk-side-btns">
                  <button
                    className={`mw-risk-side-btn ${advSide === 'Sell' ? 'active sell' : ''}`}
                    onClick={() => setAdvSide('Sell')}
                  >
                    <i className="fa-solid fa-arrow-trend-down"></i> Sell
                  </button>
                  <button
                    className={`mw-risk-side-btn ${advSide === 'Buy' ? 'active buy' : ''}`}
                    onClick={() => setAdvSide('Buy')}
                  >
                    <i className="fa-solid fa-arrow-trend-up"></i> Buy
                  </button>
                </div>
              </div>

              <div className="mw-adv-info-grid">
                <div className="mw-adv-info-row">
                  <span>Required margin:</span>
                  <span>{marginReq.toFixed(2)} USD</span>
                </div>
                <div className="mw-adv-info-row">
                  <span>Free funds:</span>
                  <span>{(currentClientExtended?.tradingMetrics?.freeMargin || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span>
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
                <button className={`mw-adv-exec-btn sell ${advSide === 'Sell' ? 'side-active' : 'side-dimmed'}`} onClick={() => handleAdvancedTrade('SELL')}>
                  <span className="mw-adv-exec-label">SELL</span>
                  <span className="mw-adv-exec-price">{getBidPrice(sym)}</span>
                </button>
                <button className={`mw-adv-exec-btn buy ${advSide === 'Buy' ? 'side-active' : 'side-dimmed'}`} onClick={() => handleAdvancedTrade('BUY')}>
                  <span className="mw-adv-exec-label">BUY</span>
                  <span className="mw-adv-exec-price">{getAskPrice(sym)}</span>
                </button>
              </div>
            </>
          )}
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
