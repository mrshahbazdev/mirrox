import React, { useState, useEffect } from 'react';
import MarketWatch from '../components/MarketWatch';
import PositionTabs from '../components/PositionTabs';
import AssetInfo from '../components/AssetInfo';
import TradingChart from '../components/TradingChart';
import ErrorBoundary from '../components/ErrorBoundary';
import { useTrading } from '../context/TradingContext';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const { prices, openPosition } = useTrading();

  // Wait for prices to load
  if (!prices || prices.length === 0) {
    return (
      <div style={{ padding: 40, color: '#94a3b8' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
        Connecting to Trading Server...
      </div>
    );
  }

  // Ensure selectedSymbolId defaults to the first available symbol's ID
  const [selectedSymbolId, setSelectedSymbolId] = useState(prices[0]?.id || 1);
  const selectedSymbol = prices.find(s => s.id === selectedSymbolId) || prices[0];
  
  const { currentClientExtended } = useTrading();
  const isVerified = currentClientExtended?.kyc?.status === 'approved';

  return (
    <>
      {/* Left Column */}
      <div className="market-column">
        <MarketWatch 
          symbols={prices} 
          selectedSymbol={selectedSymbol}
          onSelectSymbol={(sym) => setSelectedSymbolId(sym.id)}
        />
      </div>

      {/* Center/Main Column */}
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
