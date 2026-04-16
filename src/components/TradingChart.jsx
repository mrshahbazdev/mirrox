import React, { useEffect, useRef, useState, useCallback } from 'react';

const timeframeMap = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1h': 3600,
  '4h': 14400,
  'D': 86400
};

const TradingChart = ({ symbol, currentPrice, isMobile = false }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();
  const lastUpdateRef = useRef(0);
  const currentItemRef = useRef(null); 
  const isInitializedRef = useRef(false);
  const allDataRef = useRef([]);
  const isLoadingHistoryRef = useRef(false);
  
  const [chartType, setChartType] = useState(isMobile ? 'area' : 'candles'); 
  const [timeframe, setTimeframe] = useState('1m');
  const [legendData, setLegendData] = useState({ o: 0, h: 0, l: 0, c: 0, ch: 0, chp: 0 });

  const interval = timeframeMap[timeframe] || 60;

  // Helper to generate bars
  const generateBars = (count, endTime, startPrice) => {
    const bars = [];
    let currentC = startPrice;
    for (let i = 0; i < count; i++) {
       const time = endTime - (i * interval);
       const rand = (Math.random() - 0.5) * 0.001 * currentC;
       const close = currentC;
       const open = currentC - rand;
       const high = Math.max(open, close) + (Math.random() * 0.0002 * currentC);
       const low = Math.min(open, close) - (Math.random() * 0.0002 * currentC);
       
       if (chartType === 'candles') {
         bars.unshift({ time, open, high, low, close });
       } else {
         bars.unshift({ time, value: close });
       }
       currentC = open;
    }
    return bars;
  };

  const loadMoreHistory = useCallback(() => {
    if (isLoadingHistoryRef.current || !allDataRef.current.length || !seriesRef.current) return;
    
    isLoadingHistoryRef.current = true;
    const firstBar = allDataRef.current[0];
    const firstPrice = chartType === 'candles' ? firstBar.open : firstBar.value;
    
    // Generate 500 more older bars
    const olderBars = generateBars(500, firstBar.time - interval, firstPrice);
    
    const combined = [...olderBars, ...allDataRef.current];
    allDataRef.current = combined;
    seriesRef.current.setData(combined);
    
    // Small timeout to prevent multiple rapid triggers
    setTimeout(() => {
       isLoadingHistoryRef.current = false;
    }, 500);
  }, [chartType, interval]);

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    
    const initChart = () => {
      const LC = window.LightweightCharts;
      if (!LC || chartRef.current) return;
      
      const width = container.clientWidth;
      if (width === 0) return;

      const chart = LC.createChart(container, {
        layout: {
          background: { type: 'solid', color: 'transparent' },
          textColor: '#94a3b8',
          fontSize: 11,
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
        },
        crosshair: {
          mode: LC.CrosshairMode.Normal,
          vertLine: { color: '#6366f1', width: 0.5, style: LC.LineStyle.Dash },
          horzLine: { color: '#6366f1', width: 0.5, style: LC.LineStyle.Dash },
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        timeScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          timeVisible: true,
          secondsVisible: false,
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
        width: width,
        height: 480,
      });

      chartRef.current = chart;
      createSeries();
      
      chart.subscribeCrosshairMove(param => {
        if (param.time && seriesRef.current) {
          const data = param.seriesData.get(seriesRef.current);
          if (data) {
            localUpdateLegend(data);
          }
        } else {
          if (currentItemRef.current) localUpdateLegend(currentItemRef.current);
        }
      });

      // Lazy load history on scroll
      chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        if (!range || isLoadingHistoryRef.current) return;
        const firstVisibleTime = range.from;
        const firstDataTime = allDataRef.current[0]?.time;
        
        // If we are getting close to the start of our data (within 100 bars)
        if (firstVisibleTime && firstDataTime && (firstVisibleTime - firstDataTime) < (interval * 100)) {
           loadMoreHistory();
        }
      });
    };

    const createSeries = () => {
      const LC = window.LightweightCharts;
      if (!LC || !chartRef.current) return;
      
      if (seriesRef.current) {
        chartRef.current.removeSeries(seriesRef.current);
      }

      let series;
      if (chartType === 'candles') {
        series = chartRef.current.addSeries(LC.CandlestickSeries, {
          upColor: '#10b981',
          downColor: '#ef4444',
          borderVisible: false,
          wickUpColor: '#10b981',
          wickDownColor: '#ef4444',
        });
      } else if (chartType === 'area') {
        series = chartRef.current.addSeries(LC.AreaSeries, {
          lineColor: '#00d2ff',
          topColor: 'rgba(0, 210, 255, 0.3)',
          bottomColor: 'rgba(0, 210, 255, 0.01)',
          lineWidth: 2,
        });
      } else {
        series = chartRef.current.addSeries(LC.LineSeries, {
          color: '#00d2ff',
          lineWidth: 2,
        });
      }

      seriesRef.current = series;
      loadInitialData();
    };

    const loadInitialData = () => {
      if (!seriesRef.current) return;
      
      const now = Math.floor(Date.now() / 1000);
      const data = generateBars(1000, now, Number(symbol.price) || 0);
      
      allDataRef.current = data;
      seriesRef.current.setData(data);
      chartRef.current.timeScale().fitContent();
      
      const last = data[data.length - 1];
      lastUpdateRef.current = Number(last.time);
      currentItemRef.current = last;
      isInitializedRef.current = true;
      localUpdateLegend(last);
    };

    const handleResize = () => {
      if (chartRef.current && container) {
        chartRef.current.applyOptions({ width: container.clientWidth });
      } else {
        initChart();
      }
    };

    initChart();
    const timer = setTimeout(initChart, 500);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
        lastUpdateRef.current = 0;
        currentItemRef.current = null;
        isInitializedRef.current = false;
        allDataRef.current = [];
      }
    };
  }, [chartType, timeframe, loadMoreHistory]);

  // Update chart when symbol changes
  useEffect(() => {
    if (seriesRef.current && chartRef.current) {
      lastUpdateRef.current = 0;
      currentItemRef.current = null;
      isInitializedRef.current = false;
      allDataRef.current = [];
      
      const now = Math.floor(Date.now() / 1000);
      const data = generateBars(1000, now, Number(symbol.price) || 0);
      
      allDataRef.current = data;
      seriesRef.current.setData(data);
      chartRef.current.timeScale().fitContent();
      
      const last = data[data.length - 1];
      lastUpdateRef.current = Number(last.time);
      currentItemRef.current = last;
      isInitializedRef.current = true;
      localUpdateLegend(last);
    }
  }, [symbol.name, chartType, timeframe]);

  // Update chart with real-time price
  useEffect(() => {
    if (seriesRef.current && chartRef.current && isInitializedRef.current) {
      const now = Math.floor(Date.now() / 1000);
      const currentInterval = timeframeMap[timeframe] || 60;
      const barTime = Math.floor(now / currentInterval) * currentInterval;
      
      try {
        if (barTime < lastUpdateRef.current) return;

        if (!currentItemRef.current || barTime > lastUpdateRef.current) {
          const newItem = chartType === 'candles' 
            ? { time: barTime, open: currentPrice, high: currentPrice, low: currentPrice, close: currentPrice }
            : { time: barTime, value: currentPrice };
          
          currentItemRef.current = newItem;
          lastUpdateRef.current = barTime;
          allDataRef.current = [...allDataRef.current, newItem];
        } else {
          const b = currentItemRef.current;
          let updatedItem;
          if (chartType === 'candles') {
            updatedItem = {
              ...b,
              high: Math.max(Number(b.high || currentPrice), currentPrice),
              low: Math.min(Number(b.low || currentPrice), currentPrice),
              close: currentPrice
            };
          } else {
            updatedItem = { time: barTime, value: currentPrice };
          }
          currentItemRef.current = updatedItem;
          // Update last item in allDataRef
          allDataRef.current[allDataRef.current.length - 1] = updatedItem;
        }

        seriesRef.current.update(currentItemRef.current);
        localUpdateLegend(currentItemRef.current);
      } catch (err) {
        console.error("Chart update error details:", {
            error: err.message,
            barTime,
            lastUpdate: lastUpdateRef.current,
            chartType,
            data: currentItemRef.current
        });
      }
    }
  }, [currentPrice, timeframe, chartType, symbol.name]);

  const localUpdateLegend = (data) => {
    if (!data) return;
    if (chartType === 'candles' && data.open !== undefined) {
      const close = Number(data.close) || 0;
      const open = Number(data.open) || 0;
      const change = close - open;
      const changeP = (open !== 0) ? (change / open) * 100 : 0;
      setLegendData({
        o: open, h: Number(data.high) || 0, l: Number(data.low) || 0, c: close,
        ch: change, chp: changeP
      });
    } else {
      const c = Number(data.value || data.close || 0);
      setLegendData({ c, o: 0, h: 0, l: 0, ch: 0, chp: 0 });
    }
  };

  return (
    <div className="trading-chart-container">
      <div className="chart-toolbar">
        <div className="tf-group">
          {['1m', '5m', '15m', '1h', '4h', 'D'].map(tf => (
            <button 
              key={tf} 
              className={timeframe === tf ? 'active' : ''} 
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="divider"></div>
        <div className="type-group">
          <button className={chartType === 'candles' ? 'active' : ''} onClick={() => setChartType('candles')}><i className="fa-solid fa-chart-simple"></i></button>
          <button className={chartType === 'area' ? 'active' : ''} onClick={() => setChartType('area')}><i className="fa-solid fa-chart-area"></i></button>
          <button className={chartType === 'line' ? 'active' : ''} onClick={() => setChartType('line')}><i className="fa-solid fa-chart-line"></i></button>
        </div>
        <div className="divider"></div>
        <button className="tool-btn" onClick={() => chartRef.current && chartRef.current.timeScale().fitContent()}>
          <i className="fa-solid fa-arrows-to-eye"></i> Reset
        </button>
        <div className="divider"></div>
        <button className="tool-btn"><i className="fa-solid fa-flask"></i> Indicators</button>
      </div>

      <div className="chart-legend">
        <div className="legend-symbol">{symbol.name}</div>
        <div className="legend-values">
          <span>O <small>{(legendData.o || 0).toFixed(5)}</small></span>
          <span>H <small>{(legendData.h || 0).toFixed(5)}</small></span>
          <span>L <small>{(legendData.l || 0).toFixed(5)}</small></span>
          <span>C <small>{(legendData.c || 0).toFixed(5)}</small></span>
          <span className={(legendData.ch || 0) >= 0 ? 'up' : 'down'}>
            {(legendData.ch || 0).toFixed(5)} ({(legendData.chp || 0).toFixed(2)}%)
          </span>
        </div>
      </div>

      <div ref={chartContainerRef} className="chart-main" />
    </div>
  );
};

export default TradingChart;
