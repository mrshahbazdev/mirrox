const { activeTrades, symbolsList, saveData, clients } = require('../store');
const jwt = require('jsonwebtoken');

module.exports = (io) => {
  // Middleware to verify JWT token
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.log('Socket Connection Refused: No Token');
      return next(new Error('Authentication error: No Token'));
    }

    jwt.verify(token, process.env.JWT_SECRET || 'super_secret_mirrox_key_2026', (err, decoded) => {
      if (err) {
        console.log('Socket Connection Refused: Invalid Token');
        return next(new Error('Authentication error: Invalid Token'));
      }
      socket.decoded = decoded; // Store decoded info (id, role)
      next();
    });
  });

  // Helper to recalculate a specific client's financial metrics based on their open trades
  const syncClientMetrics = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const userTrades = activeTrades[clientId] || [];
    const totalPL = userTrades
      .filter(t => t.status === 'Open')
      .reduce((sum, t) => sum + (t.profit || 0), 0);

    const totalMarginUsed = userTrades
      .filter(t => t.status === 'Open')
      .reduce((sum, t) => sum + (t.marginUsed || 0), 0);

    const totalSwap = userTrades
      .filter(t => t.status === 'Open')
      .reduce((sum, t) => sum + (t.swap || 0), 0);

    // Update real-time metrics
    if (!client.tradingMetrics) client.tradingMetrics = {};
    if (!client.accountSummary) client.accountSummary = {};

    const balance = client.tradingMetrics.balance || 0;
    const credit = client.tradingMetrics.creditDeposit || 0;

    // Equity = Balance + Credit + Profit/Loss (Real-time value including P/L)
    const equity = balance + credit + totalPL + totalSwap;
    
    client.tradingMetrics.equity = equity;
    client.tradingMetrics.marginUsed = totalMarginUsed;
    client.tradingMetrics.freeMargin = equity - totalMarginUsed;
    client.tradingMetrics.swap = totalSwap; // <-- expose swap total for admin dashboard
    
    // Margin Level = (Equity / Margin Used) * 100
    client.tradingMetrics.marginLevel = totalMarginUsed > 0 
      ? (equity / totalMarginUsed) * 100 
      : 0;

    client.accountSummary.profitLoss = totalPL;
    client.accountSummary.equity = equity;
    client.accountSummary.swap = totalSwap; // <-- expose for account summary panel
  };

  // Price Ticker Generator
  setInterval(() => {
    symbolsList.forEach(s => {
      // Different volatility for different categories
      let volatility = 0.0001; 
      if (s.category === 'Crypto') volatility = 10;
      if (s.category === 'Metals') volatility = 0.5;
      if (s.name === 'US30') volatility = 5;

      const change = (Math.random() - 0.5) * volatility;
      s.price = (parseFloat(s.price) + change).toFixed(s.precision);
    });

    // Automatically calculate floating PNL for active trades based on new prices
    for (const clientId in activeTrades) {
      const userTrades = activeTrades[clientId];
      userTrades.forEach(t => {
        const symData = symbolsList.find(sym => sym.name === t.symbol);
        if (!symData) return;
        const currentPrice = parseFloat(symData.price);

        // 1. Activate Pending Orders
        if (t.status === 'Pending') {
          const triggered = t.type === 'BUY' ? (currentPrice >= t.openPrice) : (currentPrice <= t.openPrice);
          if (triggered) {
             t.status = 'Open';
             t.openTime = new Date().toISOString(); // Start trade timer
             console.log(`[ACTIVATED] Pending trade ${t.id} for ${clientId} triggered at ${currentPrice}`);
          }
          return; // Pending trades don't have PNL yet
        }

        if (t.status === 'Open') {
          // 2. Accrue Swap (Dynamic rate from symbolsList)
          // Only auto-accrue if admin has NOT manually locked this swap value
          if (!t.swapLocked) {
            const swapRate = symData.swapRate || 0.01;
            t.swap = (t.swap || 0) - (swapRate * t.lots);
          }

          if (t.bias === 'lock') return;

          const diff = t.type === 'BUY' ? (currentPrice - t.openPrice) : (t.openPrice - currentPrice);
          const multiplier = t.symbol.includes('USD') && !t.symbol.includes('BTC') ? 10000 : 1;
          const marketProfit = diff * t.lots * multiplier;

          // Apply Bias
          if (t.bias === 'profit') {
            t.profit = Math.abs(marketProfit) * (t.multiplier || 1) + (Math.random() * 0.5);
          } else if (t.bias === 'loss') {
            t.profit = -Math.abs(marketProfit) * (t.multiplier || 1) - (Math.random() * 0.5);
          } else {
            t.profit = marketProfit;
          }

          // 2.5 Stop Loss / Take Profit Hit Check
          let hitSL = false;
          let hitTP = false;

          if (t.type === 'BUY') {
             if (t.stopLoss && currentPrice <= t.stopLoss) hitSL = true;
             if (t.takeProfit && currentPrice >= t.takeProfit) hitTP = true;
          } else {
             if (t.stopLoss && currentPrice >= t.stopLoss) hitSL = true;
             if (t.takeProfit && currentPrice <= t.takeProfit) hitTP = true;
          }

          if (hitSL || hitTP) {
             t.status = 'Closed';
             t.closePrice = currentPrice;
             t.closeTime = new Date().toISOString();
             t.closedBy = hitSL ? 'System SL' : 'System TP';
             t.comment = `Hit ${hitSL ? 'Stop Loss' : 'Take Profit'} at ${currentPrice}`;
             
             // Queue balance update for sync loop outside
             const client = clients.find(c => c.id === clientId);
             if (client && client.tradingMetrics) {
                client.tradingMetrics.balance += t.profit + (t.swap || 0);
             }
             console.log(`[${t.closedBy}] ${clientId} trade ${t.id} closed at ${currentPrice}.`);
             saveData();
             io.emit('trade_killed', { tradeId: t.id, reason: t.closedBy });
          }
        }
      });

      // Sync client metrics in real-time
      syncClientMetrics(clientId);

      // 3. Stop Out Logic (System Protection)
      const client = clients.find(c => c.id === clientId);
      if (client && client.tradingMetrics?.marginLevel > 0 && client.tradingMetrics.marginLevel < 50) {
        // Find worst performing open trade
        const worstTrade = userTrades
          .filter(t => t.status === 'Open')
          .sort((a, b) => a.profit - b.profit)[0];
        
        if (worstTrade) {
          const symData = symbolsList.find(s => s.name === worstTrade.symbol);
          worstTrade.status = 'Closed';
          worstTrade.closePrice = parseFloat(symData.price);
          worstTrade.closeTime = new Date().toISOString();
          worstTrade.closedBy = 'System'; // Margin Call / Stop Out
          worstTrade.comment = 'Stop Out: Margin Level < 50%';
          
          client.tradingMetrics.balance += worstTrade.profit + (worstTrade.swap || 0);
          syncClientMetrics(clientId);
          
          console.log(`[STOP OUT] ${clientId} trade ${worstTrade.id} closed by system.`);
          saveData();
          io.emit('trade_killed', { tradeId: worstTrade.id, reason: 'Stop Out' });
        }
      }
    }

    // Broadcast updated market prices, trades, AND client balances
    io.emit('market_update', { 
      prices: symbolsList,
      trades: activeTrades,
      clients: clients 
    });
  }, 1000);

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Initial state push
    socket.emit('market_update', { prices: symbolsList, trades: activeTrades, clients: clients });

    // USER opens a trade frontend
    socket.on('open_trade', (data) => {
      const { symbol, volume, type, pendingPrice, stopLoss, takeProfit } = data;
      const clientId = socket.decoded.id; // Enforce ID from Token
      const symData = symbolsList.find(s => s.name === symbol);
      const client = clients.find(c => c.id === clientId);
      
      if (!symData || !client) return;

      const isPending = !!pendingPrice;
      
      // Apply Spread only for Market orders
      const precisionFactor = Math.pow(10, symData.precision);
      const spreadValue = symData.spread / precisionFactor;
      
      let entryPrice;
      if (isPending) {
         entryPrice = parseFloat(pendingPrice);
      } else {
         entryPrice = type === 'BUY' 
          ? parseFloat(symData.price) + spreadValue 
          : parseFloat(symData.price);
      }

      const contractSize = symData.category === 'Metals' ? 100 : 100000;
      const leverage = parseInt(client.accountSummary?.leverage?.split(':')[1]) || 100;
      const marginUsed = (entryPrice * parseFloat(volume) * contractSize) / leverage;

      // Free Margin Validation
      const currentFreeMargin = client.tradingMetrics?.freeMargin || 0;
      if (currentFreeMargin < marginUsed && !isPending) {
         console.log(`[TRADE BLOCKED] ${clientId} attempted to open ${volume} ${symbol} but has insufficient free margin.`);
         socket.emit('trade_error', { message: 'Insufficient Free Margin. Please deposit more funds or close active trades.' });
         return;
      }

      const newTrade = {
        id: 'T' + Date.now().toString().slice(-4),
        symbol,
        type,
        lots: parseFloat(volume),
        openPrice: entryPrice,
        stopLoss: stopLoss || null,
        takeProfit: takeProfit || null,
        profit: 0,
        marginUsed: marginUsed,
        swap: 0,
        status: isPending ? 'Pending' : 'Open',
        openTime: isPending ? null : new Date().toISOString(),
        pendingAt: isPending ? new Date().toISOString() : null,
        bias: 'none', 
        multiplier: 1
      };

      if (!activeTrades[clientId]) activeTrades[clientId] = [];
      activeTrades[clientId].push(newTrade);

      console.log(`[TRADE ${newTrade.status.toUpperCase()}] ${clientId} ${type} ${volume} ${symbol} @${entryPrice}`);
      syncClientMetrics(clientId);
      saveData();
      io.emit('trade_update', activeTrades);
      io.emit('client_update', clients);
    });

    // USER closes a trade
    socket.on('close_trade', (data) => {
      const { tradeId } = data;
      const clientId = socket.decoded.id; // Enforce ID from Token
      const trade = activeTrades[clientId]?.find(t => t.id === tradeId);
      if (trade && (trade.status === 'Open' || trade.status === 'Pending')) {
        const symData = symbolsList.find(s => s.name === trade.symbol);
        trade.status = 'Closed';
        trade.closePrice = trade.status === 'Pending' ? trade.openPrice : parseFloat(symData.price);
        trade.closeTime = new Date().toISOString();
        trade.closedBy = 'Self';
        
        // Realize the profit into the balance
        const client = clients.find(c => c.id === clientId);
        if (client) {
          client.tradingMetrics.balance += (trade.profit || 0) + (trade.swap || 0);
          syncClientMetrics(clientId);
        }

        console.log(`[TRADE CLOSED BY USER] ${clientId} closed ${tradeId}.`);
        saveData();
        io.emit('trade_update', activeTrades);
        io.emit('client_update', clients);
      }
    });

    // ADMIN manipulates trade bias (Trend)
    socket.on('admin_set_bias', (data) => {
      const { clientId, tradeId, bias, multiplier } = data;
      const trade = activeTrades[clientId]?.find(t => t.id === tradeId);
      if (trade) {
        trade.bias = bias || 'none';
        trade.multiplier = parseFloat(multiplier) || 1;
        
        // Sync immediate change
        syncClientMetrics(clientId);

        console.log(`[ADMIN BIAS] Trade ${tradeId} bias: ${bias}, intensity: ${multiplier}.`);
        saveData();
        io.emit('trade_update', activeTrades);
        io.emit('client_update', clients);
      }
    });

    // ADMIN legacy support or forced override
    socket.on('admin_set_pl', (data) => {
      const { clientId, tradeId, forcedProfit } = data;
      const trade = activeTrades[clientId]?.find(t => t.id === tradeId);
      if (trade) {
        trade.profit = parseFloat(forcedProfit);
        trade.bias = 'lock'; // Special state for fixed lock
        syncClientMetrics(clientId);
        saveData();
        io.emit('trade_update', activeTrades);
        io.emit('client_update', clients);
      }
    });

    // ADMIN updates swap for a trade (works for both Open and Closed trades)
    socket.on('admin_update_swap', (data) => {
      const { clientId, tradeId, swap } = data;
      const trade = activeTrades[clientId]?.find(t => t.id === tradeId);
      if (trade) {
        const oldSwap = trade.swap || 0;
        const newSwap = parseFloat(swap);
        trade.swap = newSwap;
        trade.swapLocked = true; // Prevent ticker from overwriting admin-set swap

        // If trade is already Closed, adjust the realized balance with the swap delta
        if (trade.status === 'Closed') {
          const client = clients.find(c => c.id === clientId);
          if (client) {
            client.tradingMetrics.balance += (newSwap - oldSwap);
          }
        }

        syncClientMetrics(clientId);
        saveData();
        io.emit('trade_update', activeTrades);
        io.emit('client_update', clients);
        console.log(`[ADMIN SWAP UPDATE] Trade ${tradeId} swap set to ${swap} (was ${oldSwap}) by Admin.`);
      } else {
        console.warn(`[ADMIN SWAP UPDATE] Trade ${tradeId} not found for client ${clientId}`);
      }
    });

    // ADMIN forcibly closes a trade
    socket.on('admin_force_close', (data) => {
      const { clientId, tradeId } = data;
      const trade = activeTrades[clientId]?.find(t => t.id === tradeId);
      if (trade) {
        const symData = symbolsList.find(s => s.name === trade.symbol);
        trade.status = 'Closed';
        trade.closePrice = symData ? parseFloat(symData.price) : trade.openPrice;
        trade.closeTime = new Date().toISOString();
        trade.closedBy = 'Admin';
        
        // ADDED: Realize the profit into the balance
        const client = clients.find(c => c.id === clientId);
        if (client) {
          client.tradingMetrics.balance += (trade.profit || 0) + (trade.swap || 0);
          syncClientMetrics(clientId);
        }

        console.log(`[ADMIN KILLED] Trade ${tradeId} closed by Admin.`);
        saveData();
        io.emit('trade_killed', { tradeId }); 
        io.emit('trade_update', activeTrades);
        io.emit('client_update', clients);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

