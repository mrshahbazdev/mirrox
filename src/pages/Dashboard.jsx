import React, { useState, useEffect, useRef, useCallback } from 'react';
import MarketWatch from '../components/MarketWatch';
import PositionTabs from '../components/PositionTabs';
import AssetInfo from '../components/AssetInfo';
import TradingChart from '../components/TradingChart';
import ErrorBoundary from '../components/ErrorBoundary';
import { useTrading } from '../context/TradingContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { prices, openPosition, currentClientExtended, activeTrades } = useTrading();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [openConfirm, setOpenConfirm] = useState(null);
  const [openToast, setOpenToast] = useState(null);
  const [bottomHeight, setBottomHeight] = useState(340);
  const [marketWidth, setMarketWidth] = useState(320);
  const isDragging = useRef(false);
  const mainColRef = useRef(null);
  const marketColRef = useRef(null);

  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent) => {
      if (!isDragging.current || !marketColRef.current) return;
      const dashEl = marketColRef.current.parentElement;
      if (!dashEl) return;
      const rect = dashEl.getBoundingClientRect();
      const newBottom = rect.bottom - moveEvent.clientY;
      setBottomHeight(Math.max(120, Math.min(newBottom, rect.height - 120)));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  const handleHorizResizeStart = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent) => {
      if (!isDragging.current || !marketColRef.current) return;
      const parentRect = marketColRef.current.parentElement.getBoundingClientRect();
      const newWidth = moveEvent.clientX - parentRect.left;
      setMarketWidth(Math.max(200, Math.min(newWidth, 500)));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [selectedSymbolId, setSelectedSymbolId] = useState(prices?.[0]?.id || 1);

  const handleTradeRequest = (symbol, volume, type, pendingPrice, stopLoss, takeProfit) => {
    const sym = prices.find(s => s.symbol === symbol);
    setOpenConfirm({ symbol, volume, type, pendingPrice, stopLoss, takeProfit, price: sym?.price || '---', name: sym?.name || symbol });
  };

  const confirmOpenTrade = () => {
    if (!openConfirm) return;
    const { symbol, volume, type, pendingPrice, stopLoss, takeProfit, price, name } = openConfirm;
    openPosition(symbol, volume, type, pendingPrice, stopLoss, takeProfit);
    setOpenConfirm(null);
    setOpenToast({ message: `Position opened — ${type} ${volume} ${name} at ${price}` });
    setTimeout(() => setOpenToast(null), 4000);
  };

  if (!prices || prices.length === 0) {
    return (
      <div className="fin-loading">
        <i className="fa-solid fa-spinner fa-spin"></i>
        <p className="fin-loading-text">Connecting to Trading Server...</p>
      </div>
    );
  }

  const selectedSymbol = prices.find(s => s.id === selectedSymbolId) || prices[0];
  const isVerified = currentClientExtended?.kyc?.status === 'verified' || currentClientExtended?.accountType === 'live';

  const totalEquity = currentClientExtended?.tradingMetrics?.equity || 0;
  const floatingPL = currentClientExtended?.accountSummary?.profitLoss || activeTrades.reduce((sum, t) => sum + (t.profit || 0), 0);

  const openConfirmModal = openConfirm && (
    <div className="pos-modal-overlay" onClick={() => setOpenConfirm(null)}>
      <div className="pos-modal" onClick={e => e.stopPropagation()}>
        <div className="pos-modal-header">
          <h3>Open Position</h3>
          <i className="fa-solid fa-xmark pos-modal-close" onClick={() => setOpenConfirm(null)}></i>
        </div>
        <div className="pos-modal-body">
          <p className="pos-modal-text">
            Do you want to open <span className={`pos-modal-type ${openConfirm.type === 'BUY' ? 'buy' : 'sell'}`}>{openConfirm.type}</span> {openConfirm.volume} <span className="pos-modal-sym">{openConfirm.name}</span> at {openConfirm.price} ?
          </p>
          <label className="pos-modal-checkbox">
            <input type="checkbox" />
            <span>Turn off trade confirmations</span>
          </label>
        </div>
        <div className="pos-modal-footer">
          <button className="pos-modal-btn cancel" onClick={() => setOpenConfirm(null)}>Cancel</button>
          <button className="pos-modal-btn confirm" onClick={confirmOpenTrade}>Confirm</button>
        </div>
      </div>
    </div>
  );

  const toastEl = openToast && (
    <div className="pos-toast success" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 10001 }}>
      <i className="fa-solid fa-circle-check"></i>
      <span>{openToast.message}</span>
      <i className="fa-solid fa-xmark pos-toast-close" onClick={() => setOpenToast(null)}></i>
    </div>
  );

  if (isMobile) {
    return (
      <div className="mobile-dashboard-content">
        {/* Verification Alert */}
        {!isVerified && (
          <section className="dash-section-verify">
              <div className="verification-banner">
                  <div className="banner-icon">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <div className="banner-content">
                      <p className="banner-title">Verify Account</p>
                      <p className="banner-desc">Verification is required for real trading.</p>
                  </div>
                  <Link to="/app/documents" className="banner-btn">VERIFY</Link>
              </div>
          </section>
        )}

        {/* Equity Section */}
        <section className="dash-section-equity">
          <div className="dashboard-equity-card">
            <div className="equity-card-header">
              <div className="dash-equity-title-wrap">
                <p className="equity-card-subtitle">Total Equity</p>
                <h1 className="equity-card-title">${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>
              </div>
              <span className="equity-card-badge">
                {currentClientExtended?.accountType || 'DEMO'}
              </span>
            </div>
            <div className={`equity-card-pl ${floatingPL >= 0 ? 'positive' : 'negative'}`}>
              <i className={`fa-solid ${floatingPL >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} dash-pl-icon`}></i>
              <span>
                {floatingPL >= 0 ? '+' : ''}${floatingPL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="equity-card-actions">
              <Link to="/app/finances" className="equity-btn-primary">Deposit</Link>
              <Link to="/app/finances" className="equity-btn-secondary">Withdraw</Link>
            </div>
          </div>
        </section>

        {/* Market Watch Horizontal */}
        <section className="m-market-watch-section">
          <div className="m-market-watch-header">
            <h3>Market Watch</h3>
            <Link to="/app/explore" className="m-see-all-link">See All</Link>
          </div>
          <div className="m-asset-row no-scrollbar">
            {prices.slice(0, 5).map(sym => (
              <div 
                key={sym.id} 
                className={`m-asset-mini-card ${selectedSymbolId === sym.id ? 'selected' : ''}`}
                onClick={() => setSelectedSymbolId(sym.id)}
              >
                <div className="m-mini-card-top">
                  <div className="m-mini-icon">
                    <i className="fa-solid fa-coins"></i>
                  </div>
                  <span className={`m-mini-change ${parseFloat(sym.change) >= 0 ? 'positive' : 'negative'}`}>
                    {parseFloat(sym.change) >= 0 ? '+' : ''}{sym.change}%
                  </span>
                </div>
                <div className="m-mini-card-bottom">
                  <p className="m-symbol">{sym.name}</p>
                  <p className="m-price">{parseFloat(sym.price).toFixed(selectedSymbolId === sym.id ? 5 : 2)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Simplified Asset Info / Quick Trade */}
        <section className="dash-section-chart">
          <div className="mobile-chart-card">
            <div className="chart-card-header">
              <div className="chart-asset-info">
                <div className="chart-status-dot"></div>
                <span className="chart-symbol-label">{selectedSymbol.name} LIVE</span>
              </div>
              <div className="chart-timeframe-selector">
                <button className="chart-pill-btn active">1H</button>
                <button className="chart-pill-btn">1D</button>
              </div>
            </div>
            
            <div className="chart-viewport-mobile">
               <ErrorBoundary>
                 <TradingChart 
                  symbol={selectedSymbol} 
                  currentPrice={parseFloat(selectedSymbol.price)} 
                  isMobile={true}
                  height={520}
                />
               </ErrorBoundary>
            </div>

            <AssetInfo symbol={selectedSymbol} onTrade={handleTradeRequest} compact />
          </div>
        </section>

        {/* Active Positions */}
        <section className="dash-section-positions">
           <PositionTabs />
        </section>
        {openConfirmModal}
        {toastEl}
      </div>
    );
  }

  // Desktop View
  return (
    <>
      {openConfirmModal}
      {toastEl}
      <div className="market-column" ref={marketColRef} style={{ width: marketWidth }}>
        <MarketWatch 
          symbols={prices} 
          selectedSymbol={selectedSymbol}
          onSelectSymbol={(sym) => setSelectedSymbolId(sym.id)}
          onTrade={handleTradeRequest}
        />
      </div>

      <div className="horiz-resize-handle" onMouseDown={handleHorizResizeStart}>
        <span className="horiz-resize-icon">&#x25C7;</span>
      </div>

      <div className="main-column" ref={mainColRef}>
        {!isVerified && (
          <div className="dash-desktop-verify">
             <i className="fa-solid fa-triangle-exclamation dash-verify-icon"></i>
             <div className="dash-verify-content">
                <h4 className="dash-verify-title">DEMO ACCOUNT MODE</h4>
                <p className="dash-verify-desc">Please verify your identity with a valid ID card to unlock Real Trading.</p>
             </div>
             <Link to="/app/documents" className="dash-verify-btn">Verify Now</Link>
          </div>
        )}

        <div className="chart-wrapper">
          <ErrorBoundary>
            <TradingChart 
              symbol={selectedSymbol} 
              currentPrice={parseFloat(selectedSymbol.price)} 
              isMobile={false}
            />
          </ErrorBoundary>
        </div>
      </div>

      <div className="bottom-resize-handle" onMouseDown={handleResizeStart}>
        <span className="bottom-resize-icon">&#x25C7;</span>
      </div>

      <div className="bottom-sections" style={{ gridTemplateColumns: `${marketWidth}px 1fr`, height: bottomHeight }}>
         <AssetInfo symbol={selectedSymbol} onTrade={handleTradeRequest} />
         <PositionTabs />
      </div>
    </>
  );
};

export default Dashboard;
