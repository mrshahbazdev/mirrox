import React, { useMemo, useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';

const Explore = () => {
  const { prices, allTrades } = useTrading();

  // 1. Trending FX (Real Live Symbols)
  const trendingFX = useMemo(() => {
    return (prices || [])
      .filter(p => p.category === 'Forex')
      .slice(0, 6)
      .map(p => ({
        symbol: p.name,
        price: p.price,
        change: ((Math.random() * 0.4) - 0.2).toFixed(2) + '%', // In a real app, this would come from OHLC data
        up: Math.random() > 0.5
      }));
  }, [prices]);

  // 2. Real-Time Sentiment Engine
  const sentimentSymbols = ['XAUUSD', 'EURUSD', 'GBPUSD', 'BTCUSD', 'US30', 'XAGUSD'];
  const sentiment = useMemo(() => {
    return sentimentSymbols.map(symName => {
      let buyCount = 0;
      let sellCount = 0;
      
      Object.keys(allTrades || {}).forEach(clientId => {
        (allTrades[clientId] || []).forEach(t => {
          if (t.symbol === symName && t.status === 'Open') {
            if (t.type === 'BUY') buyCount++;
            else if (t.type === 'SELL') sellCount++;
          }
        });
      });

      const total = buyCount + sellCount;
      const buyPct = total === 0 ? 50 : Math.round((buyCount / total) * 100);
      
      const icons = { 'XAUUSD': 'fa-coins', 'EURUSD': 'fa-euro-sign', 'GBPUSD': 'fa-sterling-sign', 'BTCUSD': 'fa-bitcoin-sign', 'US30': 'fa-flag-usa', 'XAGUSD': 'fa-circle-notch' };

      return {
        symbol: symName,
        buy: buyPct,
        sell: 100 - buyPct,
        icon: icons[symName] || 'fa-chart-line'
      };
    });
  }, [allTrades]);

  // 3. Top Movers (Dynamic High/Low Simulation based on live feed)
  const topMovers = useMemo(() => {
    return (prices || [])
      .sort(() => 0.5 - Math.random()) // Randomize for variety
      .slice(0, 8)
      .map(p => {
        const cur = parseFloat(p.price);
        const high = (cur * (1 + Math.random() * 0.05)).toFixed(p.precision);
        const low = (cur * (1 - Math.random() * 0.05)).toFixed(p.precision);
        const dailyChange = (Math.random() * 5).toFixed(2);
        const upD = Math.random() > 0.5;

        return {
          symbol: p.name,
          high,
          low,
          daily: (upD ? '+' : '-') + dailyChange + '%',
          weekly: ((Math.random() * 2) - 1).toFixed(2) + '%',
          upD,
          upW: Math.random() > 0.5,
          icon: p.name.charAt(0)
        };
      });
  }, [prices]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = ['Trending', 'Forex', 'Crypto', 'Stocks', 'Indices'];
  const [activeCategory, setActiveCategory] = React.useState('Trending');

  if (isMobile) {
    return (
      <div className="mobile-explore no-scrollbar">
        <header className="m-explore-header" style={{ background: 'var(--bg-deep)' }}>
            <h1 className="text-[var(--text-main)]">Explore</h1>
            <div className="m-search-wrapper" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                <i className="fa-solid fa-magnifying-glass m-search-icon" style={{ color: 'var(--text-muted)' }}></i>
                <input 
                  type="text" 
                  placeholder="Search markets, assets, news..." 
                  className="m-search-input"
                  style={{ color: 'var(--text-main)' }}
                />
            </div>
        </header>

        {/* Categories */}
        <div className="m-categories-scroller no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`m-category-pill ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
        </div>

        {/* Trending Section */}
        <section className="py-2 px-4">
            <div className="m-section-header">
                <h3 className="text-[var(--text-main)]">Trending in <span className="text-[var(--accent)]">FX</span></h3>
                <i className="fa-solid fa-chevron-right text-[var(--text-dim)] text-xs"></i>
            </div>
            <div className="m-asset-list-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {trendingFX.slice(0, 3).map(item => (
                  <div key={item.symbol} className="m-trending-item" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="m-asset-info-row">
                          <img 
                            src={`https://flagcdn.com/w40/${item.symbol.substring(0,2).toLowerCase()}.png`} 
                            className="m-asset-flag"
                            alt="" 
                            onError={(e) => { e.target.src = 'https://flagcdn.com/w40/eu.png'; }}
                          />
                          <div className="m-asset-name-group">
                              <p className="m-symbol" style={{ color: 'var(--text-main)' }}>{item.symbol}</p>
                              <p className="m-label" style={{ color: 'var(--text-muted)' }}>Euro / US Dollar</p>
                          </div>
                      </div>
                      <div className="m-asset-price-group">
                          <p className="m-price" style={{ color: 'var(--text-main)' }}>{item.price}</p>
                          <p className={`m-change ${item.up ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>{item.change}</p>
                      </div>
                  </div>
                ))}
            </div>
        </section>

        {/* Sentiment Section */}
        <section className="py-4 px-4">
            <div className="m-section-header">
               <h3 className="text-[var(--text-main)]">Trader Sentiment</h3>
            </div>
            <div className="m-asset-list-card" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {sentiment.slice(0, 3).map(item => (
                  <div key={item.symbol} className="m-sentiment-item">
                      <div className="m-sentiment-meta">
                          <div className="m-sentiment-symbol">
                              <i className={`fa-solid ${item.icon}`} style={{ color: 'var(--accent)' }}></i>
                              <span style={{ color: 'var(--text-main)' }}>{item.symbol}</span>
                          </div>
                          <span className="m-sentiment-pct" style={{ color: 'var(--success)' }}>{item.buy}% Bullish</span>
                      </div>
                      <div className="m-sentiment-rail" style={{ background: 'var(--danger-muted)' }}>
                          <div className="m-sentiment-fill" style={{ width: `${item.buy}%`, background: 'var(--success)' }}></div>
                      </div>
                  </div>
                ))}
            </div>
        </section>

        {/* Market Movers */}
        <section className="py-4 pb-8 px-4">
            <div className="m-section-header">
                <h3 className="text-[var(--text-main)]">Market <span className="text-[var(--accent)]">Movers</span></h3>
            </div>
            <div className="m-movers-list">
                {topMovers.slice(0, 3).map(item => (
                  <div key={item.symbol} className={`m-mover-card ${item.upD ? 'positive' : 'negative'}`} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div className="m-asset-info-row">
                          <div className="m-mover-icon" style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}>{item.icon}</div>
                          <div>
                              <p className="m-symbol" style={{ color: 'var(--text-main)' }}>{item.symbol}</p>
                              <p className="m-mover-range" style={{ color: 'var(--text-muted)' }}>Range: {item.low} - {item.high}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <span className={`m-mover-pct ${item.upD ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>{item.daily}</span>
                      </div>
                  </div>
                ))}
            </div>
        </section>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="explore-container redesign animate-fade" style={{ 
      gridColumn: '1 / -1', 
      height: '100%', 
      overflowY: 'auto',
      padding: '24px',
      width: '100%',
      color: 'var(--text-main)'
    }}>
      {/* Top Panel: Upcoming Events */}
      <div className="upcoming-events-panel" style={{ background: 'var(--accent-muted)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>Upcoming Events</h3>
          <div className="panel-tools" style={{ display: 'flex', gap: '8px' }}>
             <div className="tool-icon-btn"><i className="fa-regular fa-calendar" style={{ color: 'var(--text-muted)' }}></i></div>
             <div className="tool-icon-btn"><i className="fa-solid fa-filter" style={{ color: 'var(--text-muted)' }}></i></div>
          </div>
        </div>
        
        <div className="no-events-placeholder" style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="placeholder-icon" style={{ fontSize: '32px', color: 'var(--text-dim)', marginBottom: '16px' }}>
            <i className="fa-solid fa-binoculars"></i>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>No economic events scheduled for today</p>
        </div>
      </div>

      {/* Bottom Grid: 3 Columns */}
      <div className="explore-reference-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Trending in FX */}
        <div className="explore-m-card glass" style={{ borderRadius: '16px', padding: '20px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="card-top" style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>Trending in <span style={{ color: 'var(--accent)' }}>FX</span></h4>
          </div>
          <table className="m-ref-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Symbol</th>
                <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Price</th>
                <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily</th>
              </tr>
            </thead>
            <tbody>
              {trendingFX.map(item => (
                <tr key={item.symbol} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="td-symbol" style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                    <img 
                      src={`https://flagcdn.com/w40/${item.symbol.substring(0,2).toLowerCase()}.png`} 
                      style={{ width: '18px', borderRadius: '4px' }} 
                      alt="" 
                      onError={(e) => { e.target.src = 'https://flagcdn.com/w40/eu.png'; }}
                    />
                    {item.symbol}
                  </td>
                  <td className="price" style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 800, fontFamily: 'Space Mono', color: 'var(--text-main)' }}>{item.price}</td>
                  <td className={`change ${item.up ? 'up' : 'down'}`} style={{ padding: '12px 8px', fontSize: '12px', fontWeight: 700, color: item.up ? 'var(--success)' : 'var(--danger)' }}>
                    {item.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Market Sentiment */}
        <div className="explore-m-card glass" style={{ borderRadius: '16px', padding: '20px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="card-top" style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>Global Trader Sentiment</h4>
          </div>
          <div className="sentiment-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sentiment.map(item => (
              <div key={item.symbol} className="sentiment-row">
                <div className="sent-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <i className={`fa-solid ${item.icon}`} style={{ color: 'var(--accent)', width: '16px', fontSize: '13px' }}></i>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{item.symbol}</span>
                </div>
                <div className="sent-bar-layout" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="buy-val" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--success)' }}>{item.buy}%</span>
                  <div className="sent-rail" style={{ flex: 1, height: '6px', background: 'var(--danger-muted)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
                    <div className="sent-fill" style={{ width: `${item.buy}%`, height: '100%', background: 'var(--success)', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                  </div>
                  <span className="sell-val" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--danger)' }}>{item.sell}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Movers */}
        <div className="explore-m-card glass" style={{ borderRadius: '16px', padding: '20px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="card-top" style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>Market <span className="text-[var(--accent)]">movers</span></h4>
          </div>
          <table className="m-table-detailed" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Symbol</th>
                <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Range</th>
                <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>24h</th>
              </tr>
            </thead>
            <tbody>
              {topMovers.map(item => (
                <tr key={item.symbol} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 8px' }}>
                    <div className="td-mover-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="mover-icon" style={{ width: '28px', height: '28px', background: 'var(--accent-muted)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>{item.icon}</div>
                        <span className="mover-name" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{item.symbol}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 8px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>
                    <div style={{ color: 'var(--success)' }}>{item.high}</div>
                    <div style={{ color: 'var(--danger)' }}>{item.low}</div>
                  </td>
                  <td className={`mover-change ${item.upD ? 'up' : 'down'}`} style={{ padding: '10px 8px', fontSize: '13px', fontWeight: 800, color: item.upD ? 'var(--success)' : 'var(--danger)', textAlign: 'right' }}>
                     {item.daily}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <style>{`
        .explore-container { padding: 24px; color: var(--text-main); }
        .glass { background: var(--bg-card); backdrop-filter: blur(12px); border: 1px solid var(--border); }
        .td-symbol img { width: 18px; margin-right: 8px; vertical-align: middle; }
        .animate-fade { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Explore;
