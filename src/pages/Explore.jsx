import React, { useMemo, useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';

const categoryIcons = {
  'Trending': 'fa-fire',
  'Forex': 'fa-money-bill-transfer',
  'Crypto': 'fa-bitcoin-sign',
  'Stocks': 'fa-chart-line',
  'Indices': 'fa-landmark',
};

const categoryLabels = {
  'Trending': 'Markets',
  'Forex': 'FX',
  'Crypto': 'Crypto',
  'Stocks': 'Stocks',
  'Indices': 'Indices',
};

const categories = ['Trending', 'Forex', 'Crypto', 'Stocks', 'Indices'];

const sentimentSymbolsByCategory = {
  'Trending': ['XAUUSD', 'EURUSD', 'GBPUSD', 'BTCUSDT', 'US30', 'XAGUSD', 'US500', 'ETHUSDT', 'NVDA', 'USDJPY'],
  'Forex': ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD'],
  'Crypto': ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT'],
  'Stocks': ['AAPL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META'],
  'Indices': ['US500', 'US30', 'US100', 'GER40', 'UK100', 'FRA40'],
};

const sentimentIcons = {
  'XAUUSD': 'fa-coins', 'EURUSD': 'fa-euro-sign', 'GBPUSD': 'fa-sterling-sign',
  'BTCUSDT': 'fa-bitcoin-sign', 'US30': 'fa-flag-usa', 'XAGUSD': 'fa-circle-notch',
  'US500': 'fa-chart-line', 'ETHUSDT': 'fa-ethereum', 'NVDA': 'fa-microchip',
  'USDJPY': 'fa-yen-sign', 'USDCHF': 'fa-franc-sign', 'AUDUSD': 'fa-dollar-sign',
  'USDCAD': 'fa-dollar-sign', 'BNBUSDT': 'fa-coins', 'SOLUSDT': 'fa-coins',
  'XRPUSDT': 'fa-coins', 'ADAUSDT': 'fa-coins', 'AAPL': 'fa-apple-whole',
  'MSFT': 'fa-windows', 'AMZN': 'fa-cart-shopping', 'TSLA': 'fa-car',
  'META': 'fa-meta', 'US100': 'fa-chart-line', 'GER40': 'fa-chart-line',
  'UK100': 'fa-chart-line', 'FRA40': 'fa-chart-line', 'DOGEUSDT': 'fa-dog',
};

const Explore = () => {
  const { prices, allTrades } = useTrading();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [activeCategory, setActiveCategory] = useState('Trending');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter prices based on active category
  const filteredPrices = useMemo(() => {
    if (!prices) return [];
    if (activeCategory === 'Trending') return prices;
    return prices.filter(p => p.category === activeCategory);
  }, [prices, activeCategory]);

  // Category-filtered assets list with price/change data
  const categoryAssets = useMemo(() => {
    return filteredPrices.slice(0, 10).map(p => ({
      symbol: p.symbol || p.name,
      name: p.name,
      price: p.price,
      change: ((Math.random() * 0.4) - 0.2).toFixed(2) + '%',
      up: Math.random() > 0.5,
      category: p.category,
      iconClassName: p.iconClassName || 'fa-chart-line',
      precision: p.precision
    }));
  }, [filteredPrices]);

  const sentiment = useMemo(() => {
    const syms = sentimentSymbolsByCategory[activeCategory] || sentimentSymbolsByCategory['Trending'];

    return syms.map(symName => {
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

      return {
        symbol: symName,
        buy: buyPct,
        sell: 100 - buyPct,
        icon: sentimentIcons[symName] || 'fa-chart-line'
      };
    });
  }, [allTrades, activeCategory]);

  // Top Movers filtered by category
  const topMovers = useMemo(() => {
    return filteredPrices
      .sort(() => 0.5 - Math.random())
      .map(p => {
        const cur = parseFloat(p.price);
        const high = (cur * (1 + Math.random() * 0.05)).toFixed(p.precision);
        const low = (cur * (1 - Math.random() * 0.05)).toFixed(p.precision);
        const dailyChange = (Math.random() * 5).toFixed(2);
        const upD = Math.random() > 0.5;

        return {
          symbol: p.symbol || p.name,
          name: p.name,
          high,
          low,
          daily: (upD ? '+' : '-') + dailyChange + '%',
          weekly: ((Math.random() * 2) - 1).toFixed(2) + '%',
          upD,
          upW: Math.random() > 0.5,
          icon: (p.symbol || p.name).charAt(0),
          iconClassName: p.iconClassName || 'fa-chart-line'
        };
      });
  }, [filteredPrices]);

  // ─── MOBILE VIEW ───
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
                <i className={`fa-solid ${categoryIcons[cat]}`} style={{ marginRight: '6px', fontSize: '11px' }}></i>
                {cat}
              </button>
            ))}
        </div>

        {/* Category Assets */}
        <section className="py-2 px-4">
            <div className="m-section-header">
                <h3 className="text-[var(--text-main)]">
                  {activeCategory === 'Trending' ? 'Trending' : activeCategory} <span className="text-[var(--accent)]">{categoryLabels[activeCategory]}</span>
                </h3>
                <i className="fa-solid fa-chevron-right text-[var(--text-dim)] text-xs"></i>
            </div>
            <div className="m-asset-list-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {categoryAssets.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No assets available in this category
                  </div>
                )}
                {categoryAssets.map(item => (
                  <div key={item.symbol} className="m-trending-item" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="m-asset-info-row">
                          <div style={{ 
                            width: '36px', height: '36px', borderRadius: '10px', 
                            background: 'var(--accent-muted)', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0
                          }}>
                            <i className={`fa-solid ${item.iconClassName}`} style={{ color: 'var(--accent)', fontSize: '14px' }}></i>
                          </div>
                          <div className="m-asset-name-group">
                              <p className="m-symbol" style={{ color: 'var(--text-main)' }}>{item.symbol}</p>
                              <p className="m-label" style={{ color: 'var(--text-muted)' }}>{item.name}</p>
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
                {sentiment.slice(0, 4).map(item => (
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
                {topMovers.map(item => (
                  <div key={item.symbol} className={`m-mover-card ${item.upD ? 'positive' : 'negative'}`} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div className="m-asset-info-row">
                          <div className="m-mover-icon" style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}>
                            <i className={`fa-solid ${item.iconClassName}`} style={{ fontSize: '12px' }}></i>
                          </div>
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

  // ─── DESKTOP VIEW ───
  return (
    <div className="explore-container redesign animate-fade" style={{ 
      gridColumn: '1 / -1', 
      height: '100%', 
      overflowY: 'auto',
      padding: '24px',
      width: '100%',
      color: 'var(--text-main)'
    }}>
      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: '100px',
              border: activeCategory === cat ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-card)',
              color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <i className={`fa-solid ${categoryIcons[cat]}`} style={{ fontSize: '11px' }}></i>
            {cat}
          </button>
        ))}
      </div>

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
        
        {/* Category Assets */}
        <div className="explore-m-card glass" style={{ borderRadius: '16px', padding: '20px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="card-top" style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
              {activeCategory === 'Trending' ? 'Trending in' : ''} <span style={{ color: 'var(--accent)' }}>{categoryLabels[activeCategory]}</span>
            </h4>
          </div>
          {categoryAssets.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No assets available
            </div>
          ) : (
            <table className="m-ref-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Symbol</th>
                  <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Price</th>
                  <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily</th>
                </tr>
              </thead>
              <tbody>
                {categoryAssets.map(item => (
                  <tr key={item.symbol} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="td-symbol" style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                      <div style={{ 
                        width: '24px', height: '24px', borderRadius: '6px', 
                        background: 'var(--accent-muted)', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <i className={`fa-solid ${item.iconClassName}`} style={{ color: 'var(--accent)', fontSize: '10px' }}></i>
                      </div>
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
          )}
        </div>

        {/* Market Sentiment */}
        <div className="explore-m-card glass" style={{ borderRadius: '16px', padding: '20px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="card-top" style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
              {activeCategory === 'Trending' ? 'Global' : activeCategory} Trader Sentiment
            </h4>
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
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
              {activeCategory === 'Trending' ? 'Market' : activeCategory} <span className="text-[var(--accent)]">Movers</span>
            </h4>
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
              {topMovers.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '40px 8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No movers available
                  </td>
                </tr>
              ) : topMovers.map(item => (
                <tr key={item.symbol} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 8px' }}>
                    <div className="td-mover-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="mover-icon" style={{ width: '28px', height: '28px', background: 'var(--accent-muted)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>
                          <i className={`fa-solid ${item.iconClassName}`} style={{ fontSize: '11px' }}></i>
                        </div>
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
