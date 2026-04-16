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
      <div style={{ padding: 40, color: '#94a3b8' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
        Connecting to Trading Server...
      </div>
    );
  }

  const selectedSymbol = prices.find(s => s.id === selectedSymbolId) || prices[0];
  const isVerified = currentClientExtended?.kyc?.status === 'verified' || currentClientExtended?.accountType === 'live';

  const totalEquity = currentClientExtended?.tradingMetrics?.equity || 0;
  const floatingPL = currentClientExtended?.accountSummary?.profitLoss || activeTrades.reduce((sum, t) => sum + (t.profit || 0), 0);

  if (isMobile) {
    return (
      <div className="mobile-dashboard-content w-full overflow-x-hidden">
        {/* Equity Section */}
        <section className="px-4">
          <div className="dashboard-equity-card">
            <div className="equity-card-header">
              <div className="min-w-0">
                <p className="equity-card-subtitle">Total Equity</p>
                <h1 className="equity-card-title">${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>
              </div>
              <span className="equity-card-badge">
                {currentClientExtended?.accountType || 'DEMO'}
              </span>
            </div>
            <div className={`equity-card-pl ${floatingPL >= 0 ? 'positive' : 'negative'}`}>
              <i className={`fa-solid ${floatingPL >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-xs`}></i>
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
        <section className="pt-4">
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="font-bold text-lg text-white">Market Watch</h3>
            <Link to="/app/explore" className="text-indigo-400 text-xs font-semibold">See All</Link>
          </div>
          <div className="m-asset-row no-scrollbar">
            {prices.slice(0, 5).map(sym => (
              <div 
                key={sym.id} 
                className={`m-asset-card ${selectedSymbolId === sym.id ? 'border-indigo-500/50 bg-indigo-500/10' : ''}`}
                onClick={() => setSelectedSymbolId(sym.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <i className="fa-solid fa-coins"></i>
                  </div>
                  <span className={`text-[10px] font-bold ${parseFloat(sym.change) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {parseFloat(sym.change) >= 0 ? '+' : ''}{sym.change}%
                  </span>
                </div>
                <p className="text-xs font-bold text-white uppercase">{sym.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{parseFloat(sym.price).toFixed(selectedSymbolId === sym.id ? 5 : 2)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Simplified Asset Info / Quick Trade */}
        <section className="py-2">
          <div className="glass-card p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{selectedSymbol.name} LIVE</span>
              </div>
              <div className="flex space-x-1">
                <button className="px-2 py-1 text-[10px] bg-indigo-500 rounded-lg text-white">1H</button>
                <button className="px-2 py-1 text-[10px] text-slate-400">1D</button>
              </div>
            </div>
            
            <div className="h-56 w-full relative chart-gradient rounded-xl mb-4 overflow-hidden">
               <ErrorBoundary>
                 <TradingChart 
                  symbol={selectedSymbol} 
                  currentPrice={parseFloat(selectedSymbol.price)} 
                />
               </ErrorBoundary>
            </div>

            <AssetInfo symbol={selectedSymbol} onTrade={openPosition} compact />
          </div>
        </section>

        {/* Active Positions */}
        <section className="pb-10">
           <PositionTabs />
        </section>

        <style>{`
          .mobile-dashboard-content {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding-top: 4px;
            width: 100%;
            overflow-x: hidden;
          }
        `}</style>
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
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
             <i className="fa-solid fa-triangle-exclamation" style={{ color: '#f59e0b', fontSize: '20px' }}></i>
             <div style={{ flex: 1 }}>
               <h4 style={{ color: '#f59e0b', margin: '0 0 4px 0', fontSize: '13px', fontWeight: 800 }}>DEMO ACCOUNT MODE</h4>
               <p style={{ margin: 0, fontSize: '12px', color: '#fbbf24' }}>Please verify your identity with a valid ID card to unlock Real Trading.</p>
             </div>
             <Link to="/app/documents" style={{ background: '#f59e0b', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>Verify Now</Link>
          </div>
        )}

        <div className="chart-wrapper">
          <ErrorBoundary>
            <TradingChart 
              symbol={selectedSymbol} 
              currentPrice={parseFloat(selectedSymbol.price)} 
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
