import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [selectedSymbolId, setSelectedSymbolId] = useState(prices?.[0]?.id || 1);

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

            <AssetInfo symbol={selectedSymbol} onTrade={openPosition} compact />
          </div>
        </section>

        {/* Active Positions */}
        <section className="dash-section-positions">
           <PositionTabs />
        </section>
      </div>
    );
  }

  // Desktop View
  return (
    <>
      <div className="market-column">
        <MarketWatch 
          symbols={prices} 
          selectedSymbol={selectedSymbol}
          onSelectSymbol={(sym) => setSelectedSymbolId(sym.id)}
        />
      </div>

      <div className="main-column">
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

        <div className="bottom-sections">
           <AssetInfo symbol={selectedSymbol} onTrade={openPosition} />
           <PositionTabs />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
