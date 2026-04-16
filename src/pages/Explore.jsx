import React, { useMemo } from 'react';
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
        <header className="px-2 pt-4 pb-2">
            <h1 className="text-2xl font-black text-white mb-6">Explore</h1>
            <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                <input 
                  type="text" 
                  placeholder="Search markets, assets, news..." 
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-white"
                />
            </div>
        </header>

        {/* Categories */}
        <div className="flex space-x-3 overflow-x-auto py-4 no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-xs font-bold transition-all border ${activeCategory === cat ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800/40 text-slate-400 border-slate-700'}`}
              >
                {cat}
              </button>
            ))}
        </div>

        {/* Trending Section */}
        <section className="py-4">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-lg text-white">Trending in <span className="text-indigo-400">FX</span></h3>
                <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
            </div>
            <div className="glass-card p-4 space-y-4">
                {trendingFX.slice(0, 3).map(item => (
                  <div key={item.symbol} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                          <img 
                            src={`https://flagcdn.com/w40/${item.symbol.substring(0,2).toLowerCase()}.png`} 
                            className="w-8 h-8 rounded-full border border-slate-700/50"
                            alt="" 
                            onError={(e) => { e.target.src = 'https://flagcdn.com/w40/eu.png'; }}
                          />
                          <div>
                              <p className="text-xs font-bold text-white uppercase">{item.symbol}</p>
                              <p className="text-[10px] text-slate-500">Euro / US Dollar</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-xs font-bold text-white font-mono">{item.price}</p>
                          <p className={`text-[10px] font-bold ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>{item.change}</p>
                      </div>
                  </div>
                ))}
            </div>
        </section>

        {/* Sentiment Section */}
        <section className="py-4">
            <h3 className="font-bold text-lg text-white mb-4 px-1">Global Trader Sentiment</h3>
            <div className="glass-card p-5 space-y-6">
                {sentiment.slice(0, 3).map(item => (
                  <div key={item.symbol}>
                      <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                              <i className={`fa-solid ${item.icon} text-indigo-400 text-xs`}></i>
                              <span className="text-xs font-bold text-white">{item.symbol}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{item.buy}% Bullish</span>
                      </div>
                      <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden flex">
                          <div className="h-full bg-indigo-500" style={{ width: `${item.buy}%` }}></div>
                          <div className="h-full bg-slate-700/50 flex-1"></div>
                      </div>
                  </div>
                ))}
            </div>
        </section>

        {/* Market Movers */}
        <section className="py-4 pb-8">
            <h3 className="font-bold text-lg text-white mb-4 px-1">Market <span className="text-indigo-400">Movers</span></h3>
            <div className="space-y-3">
                {topMovers.slice(0, 3).map(item => (
                  <div key={item.symbol} className={`glass-card p-4 flex items-center justify-between border-l-4 ${item.upD ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
                      <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 text-sm">{item.icon}</div>
                          <div>
                              <p className="text-xs font-bold text-white uppercase">{item.symbol}</p>
                              <p className="text-[9px] text-slate-500">Range: {item.low} - {item.high}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <span className={`font-bold text-sm ${item.upD ? 'text-emerald-400' : 'text-rose-400'}`}>{item.daily}</span>
                      </div>
                  </div>
                ))}
            </div>
        </section>

        <style>{`
          .mobile-explore {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-bottom: 20px;
          }
          .glass-card {
            background: rgba(30, 41, 59, 0.4);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
          }
        `}</style>
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
      width: '100%'
    }}>
      {/* Top Panel: Upcoming Events */}
      <div className="upcoming-events-panel" style={{ background: 'rgba(50,145,255,0.02)', border: '1px solid rgba(50,145,255,0.05)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Upcoming Events</h3>
          <div className="panel-tools" style={{ display: 'flex', gap: '8px' }}>
             <div className="tool-icon-btn"><i className="fa-regular fa-calendar" style={{ color: '#64748b' }}></i></div>
             <div className="tool-icon-btn"><i className="fa-solid fa-filter" style={{ color: '#64748b' }}></i></div>
          </div>
        </div>
        
        <div className="no-events-placeholder" style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="placeholder-icon" style={{ fontSize: '32px', color: '#1e293b', marginBottom: '16px' }}>
            <i className="fa-solid fa-binoculars"></i>
          </div>
          <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>No economic events scheduled for today</p>
        </div>
      </div>

      {/* Bottom Grid: 3 Columns */}
      <div className="explore-reference-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Trending in FX */}
        <div className="explore-m-card glass" style={{ borderRadius: '16px', padding: '20px' }}>
          <div className="card-top" style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Trending in <span style={{ color: '#3291ff' }}>FX</span></h4>
          </div>
          <table className="m-ref-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '8px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Symbol</th>
                <th style={{ padding: '8px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Price</th>
                <th style={{ padding: '8px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Daily</th>
              </tr>
            </thead>
            <tbody>
              {trendingFX.map(item => (
                <tr key={item.symbol} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td className="td-symbol" style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img 
                      src={`https://flagcdn.com/w40/${item.symbol.substring(0,2).toLowerCase()}.png`} 
                      style={{ width: '18px', borderRadius: '4px' }} 
                      alt="" 
                      onError={(e) => { e.target.src = 'https://flagcdn.com/w40/eu.png'; }}
                    />
                    {item.symbol}
                  </td>
                  <td className="price" style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 800, fontFamily: 'Space Mono', color: '#e0e6ed' }}>{item.price}</td>
                  <td className={`change ${item.up ? 'up' : 'down'}`} style={{ padding: '12px 8px', fontSize: '12px', fontWeight: 700, color: item.up ? '#00cc88' : '#ef4444' }}>
                    {item.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Market Sentiment */}
        <div className="explore-m-card glass" style={{ borderRadius: '16px', padding: '20px' }}>
          <div className="card-top" style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Global Trader Sentiment</h4>
          </div>
          <div className="sentiment-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sentiment.map(item => (
              <div key={item.symbol} className="sentiment-row">
                <div className="sent-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <i className={`fa-solid ${item.icon}`} style={{ color: '#3291ff', width: '16px', fontSize: '13px' }}></i>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>{item.symbol}</span>
                </div>
                <div className="sent-bar-layout" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="buy-val" style={{ fontSize: '11px', fontWeight: 800, color: '#10b981' }}>{item.buy}%</span>
                  <div className="sent-rail" style={{ flex: 1, height: '6px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
                    <div className="sent-fill" style={{ width: `${item.buy}%`, height: '100%', background: '#10b981', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                  </div>
                  <span className="sell-val" style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444' }}>{item.sell}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Movers */}
        <div className="explore-m-card glass" style={{ borderRadius: '16px', padding: '20px' }}>
          <div className="card-top" style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Market <span>movers</span></h4>
          </div>
          <table className="m-table-detailed" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '8px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Symbol</th>
                <th style={{ padding: '8px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Range</th>
                <th style={{ padding: '8px', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>24h</th>
              </tr>
            </thead>
            <tbody>
              {topMovers.map(item => (
                <tr key={item.symbol} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '10px 8px' }}>
                    <div className="td-mover-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="mover-icon" style={{ width: '28px', height: '28px', background: 'rgba(50,145,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#3291ff' }}>{item.icon}</div>
                        <span className="mover-name" style={{ fontSize: '13px', fontWeight: 700 }}>{item.symbol}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 8px', fontSize: '11px', color: '#64748b', fontFamily: 'Space Mono' }}>
                    <div style={{ color: '#00cc88' }}>{item.high}</div>
                    <div style={{ color: '#ef4444' }}>{item.low}</div>
                  </td>
                  <td className={`mover-change ${item.upD ? 'up' : 'down'}`} style={{ padding: '10px 8px', fontSize: '13px', fontWeight: 800, color: item.upD ? '#10b981' : '#ef4444', textAlign: 'right' }}>
                     {item.daily}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <style>{`
        .explore-container { padding: 24px; color: #e0e6ed; }
        .glass { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .td-symbol img { width: 18px; margin-right: 8px; vertical-align: middle; }
        .animate-fade { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Explore;
