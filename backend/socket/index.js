const axios = require('axios');
const { activeTrades, symbolsList, saveData, clients } = require('../store');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const SupportTicket = require('../models/SupportTicket');
const Admin = require('../models/Admin');
const Trade = require('../models/Trade');
const Visitor = require('../models/Visitor');

// Set up Live Binance Feed for Crypto Markets
let binanceWs = null;
const connectBinance = () => {
  binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
  
  binanceWs.on('message', (data) => {
    try {
      const tickers = JSON.parse(data);
      tickers.forEach(t => {
        const symbol = t.s; // e.g. BTCUSDT
        const price = t.c;  // Last price
        
        const mappedSymbol = symbolsList.find(sym => 
          sym.category === 'Crypto' && 
          symbol.includes(sym.symbol.replace('USD', 'USDT'))
        );
        
        if (mappedSymbol) {
          mappedSymbol.price = parseFloat(price).toFixed(mappedSymbol.precision);
        }
      });
    } catch(err) {
      // ignore parse errors
    }
  });

  binanceWs.on('close', () => {
    console.log('Binance WS closed, reconnecting in 5s...');
    setTimeout(connectBinance, 5000);
  });
  
  binanceWs.on('error', (err) => {
    console.error('Binance WS Error:', err.message);
  });
};

connectBinance();

module.exports = (io) => {
  // Middleware to verify JWT token
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.log('Socket Connection Refused: No Token');
      return next(new Error('Authentication error: No Token'));
    }

    // JWT_SECRET is guaranteed to be set because server.js aborts boot if it
    // is missing. Reading from env here keeps the socket layer aligned with
    // the REST layer; never fall back to a hardcoded literal.
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('Socket Connection Refused: Invalid Token');
        return next(new Error('Authentication error: Invalid Token'));
      }
      socket.decoded = decoded;
      next();
    });
  });

    // ─── Online Visitor Tracking ────────────────────────────────────────────────
  const onlineVisitors = new Map(); // clientId → { clientName, clientUid, page, joinedAt, socketId }
  const adminOnline = new Map(); // adminId → { name, role, page, socketId }

  const broadcastVisitors = () => {
    const now = Date.now();
    const list = Array.from(onlineVisitors.values()).map(v => ({
      ...v,
      duration: Math.floor((now - v.joinedAt) / 1000)
    }));
    io.emit('visitors:update', list);
  };

  // Update visitor durations every 5 seconds
  setInterval(broadcastVisitors, 5000);

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

  // Price Ticker Generator for Non-Crypto Symbols (GBM)
  setInterval(() => {
    symbolsList.forEach(s => {
      // Crypto is powered purely by Binance Real-Time Live Feed. Do not mutate.
      if (s.category === 'Crypto') return; 

      // Geometric Brownian Motion (GBM) for Realistic Forex/Metals Modeling
      const dt = 1 / 86400; 
      const mu = 0.00005; // Base drift
      const sigma = s.category === 'Metals' ? 0.02 : 0.005; // Metals more volatile than Forex
      const currentPrice = parseFloat(s.price);

      // Box-Muller transform for normal distribution
      const u1 = Math.max(Math.random(), 0.0001);
      const u2 = Math.max(Math.random(), 0.0001);
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      const change = currentPrice * (mu * dt + sigma * Math.sqrt(dt) * z0);
      s.price = (currentPrice + change).toFixed(s.precision);
    });

    // Automatically calculate floating PNL for active trades based on new prices
    for (const clientId in activeTrades) {
      const userTrades = activeTrades[clientId];
      userTrades.forEach(t => {
        const symData = symbolsList.find(sym => sym.symbol === t.symbol);
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
          // 2. Accrue Swap (4% of Margin after 24h 1m)
          // Only auto-accrue if admin has NOT manually locked this swap value
          if (!t.swapLocked) {
            const tradeAgeMs = Date.now() - new Date(t.openTime).getTime();
            const thresholdMs = (24 * 60 + 1) * 60 * 1000; // 24 hours + 1 minute
            
            if (tradeAgeMs > thresholdMs) {
              // Calculate days held (at least 1 day if over threshold)
              const daysHeld = Math.max(1, Math.floor(tradeAgeMs / (24 * 60 * 60 * 1000)));
              
              // Apply 4% of margin used per day held
              const swapAmount = (t.marginUsed || 0) * 0.04 * daysHeld;
              t.swap = -swapAmount;
            } else {
              // No swap charge before 24h 1m
              t.swap = 0;
            }
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
          let hitLimit = false;

          if (t.type === 'BUY') {
             if (t.stopLoss && currentPrice <= t.stopLoss) hitSL = true;
             if (t.takeProfit && currentPrice >= t.takeProfit) hitTP = true;
             if (t.selectedPrice) {
                if (t.selectedPrice > t.openPrice && currentPrice >= t.selectedPrice) hitLimit = true;
                if (t.selectedPrice < t.openPrice && currentPrice <= t.selectedPrice) hitLimit = true;
             }
          } else {
             if (t.stopLoss && currentPrice >= t.stopLoss) hitSL = true;
             if (t.takeProfit && currentPrice <= t.takeProfit) hitTP = true;
             if (t.selectedPrice) {
                if (t.selectedPrice < t.openPrice && currentPrice <= t.selectedPrice) hitLimit = true;
                if (t.selectedPrice > t.openPrice && currentPrice >= t.selectedPrice) hitLimit = true;
             }
          }

          if (hitSL || hitTP || hitLimit) {
             t.status = 'Closed';
             t.closePrice = hitLimit ? t.selectedPrice : currentPrice;
             t.closeTime = new Date().toISOString();
             t.closedBy = hitLimit ? 'Admin (Limit)' : (hitSL ? 'System SL' : 'System TP');
             t.comment = hitLimit ? `Target price ${t.selectedPrice} reached` : `Hit ${hitSL ? 'Stop Loss' : 'Take Profit'} at ${currentPrice}`;
             
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
          const symData = symbolsList.find(s => s.symbol === worstTrade.symbol);
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

    // Broadcast updated market prices, trades, AND sanitized client balances
    const sanitizedClients = clients.map(c => {
      const { withdrawalPin, password, ...rest } = c;
      return { ...rest, hasPin: !!withdrawalPin };
    });

    io.emit('market_update', { 
      prices: symbolsList,
      trades: activeTrades,
      clients: sanitizedClients 
    });
  }, 1000);

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Initial state push
    socket.emit('market_update', { prices: symbolsList, trades: activeTrades, clients: clients });

    // ─── User Visit Tracking ─────────────────────────────────────────────────
    socket.on('user:visit', ({ clientId, clientName, clientUid, page }) => {
      if (!clientId || socket.decoded?.role !== 'user') return;
      onlineVisitors.set(clientId, {
        clientId, clientName, clientUid, page,
        joinedAt: Date.now(),
        socketId: socket.id
      });
      broadcastVisitors();
      console.log(`[VISITOR] ${clientName} (${clientId}) visiting ${page}`);
    });

    socket.on('visitor:track', async (data) => {
        const { visitorId, userId, userAgent, referrer, path } = data;
        if (!visitorId) return;

        // Detect Real IP (handle proxies like Vercel/Cloudflare)
        const ip = socket.handshake.headers['x-forwarded-for']?.split(',')[0].trim() || 
                   socket.handshake.address || 
                   'Unknown';

        try {
            // 1. Find or create visitor
            let visitor = await Visitor.findOne({ visitorId });
            
            let country = visitor?.country || 'Unknown';
            let city = visitor?.city || 'Unknown';

            // 2. If country is unknown, attempt GeoIP lookup (Server-side avoids CORS)
            if (country === 'Unknown' && ip !== 'Unknown' && ip !== '::1' && ip !== '127.0.0.1') {
                try {
                    const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
                    if (geoRes.data && !geoRes.data.error) {
                        country = geoRes.data.country_name || 'Unknown';
                        city = geoRes.data.city || 'Unknown';
                    }
                } catch (geoErr) {
                    console.error('[GEOIP ERR]', geoErr.message);
                }
            }

            // 3. Update or Insert
            visitor = await Visitor.findOneAndUpdate(
                { visitorId },
                {
                    $set: { 
                        userId, 
                        ip, 
                        country, 
                        city, 
                        userAgent, 
                        referrer, 
                        lastActive: new Date() 
                    },
                    $push: { pathHistory: { path, timestamp: new Date() } }
                },
                { upsert: true, new: true }
            );
            
            // Increment session count if it's the first historical entry
            if (visitor.pathHistory.length === 1) {
                await Visitor.updateOne({ visitorId }, { $inc: { sessionCount: 1 } });
            }

            // Emit to all connected admins for real-time dashboard updates
            io.emit('admin:visitor_update', visitor);
        } catch (err) {
            console.error('[VISITOR TRACK ERR]', err.message);
        }
    });

    socket.on('user:leave', ({ clientId }) => {
      onlineVisitors.delete(clientId);
      broadcastVisitors();
    });

    socket.on('open_trade', (data) => {
      const { symbol, volume, type, pendingPrice, stopLoss, takeProfit } = data;
      const clientId = socket.decoded.id; // Enforce ID from Token
      const symData = symbolsList.find(s => s.symbol === symbol);
      const client = clients.find(c => c.id === clientId);
      
      if (!symData || !client) return;
      
      // Force sync metrics before check to ensure balance/equity is up to date
      syncClientMetrics(clientId);

      const isPending = !!pendingPrice;
      
      // Apply Spread only for Market orders
      const precisionFactor = Math.pow(10, symData.precision || 2);
      const spreadValue = (symData.spread || 0) / precisionFactor; // Safety fallback for spread
      
      let entryPrice;
      if (isPending) {
         entryPrice = parseFloat(pendingPrice);
      } else {
         entryPrice = type === 'BUY' 
          ? parseFloat(symData.price) + spreadValue 
          : parseFloat(symData.price);
      }

      const contractSize = symData.category === 'Metals' ? 100 : 100000;
      const leverageString = client.accountSummary?.leverage || "1:100";
      const leverage = parseInt(leverageString.split(':')[1] || leverageString.split(':')[0]) || 100;
      const marginUsed = (entryPrice * parseFloat(volume) * contractSize) / leverage;

      // Free Margin Validation
      const currentFreeMargin = client.tradingMetrics?.freeMargin || 0;
      if (currentFreeMargin < marginUsed && !isPending) {
         console.log(`[TRADE BLOCKED] ${clientId} insufficient free margin: ${currentFreeMargin.toFixed(2)} < ${marginUsed.toFixed(2)}`);
         socket.emit('trade_error', { message: 'Insufficient Free Margin (Available: $' + currentFreeMargin.toFixed(2) + '). Please deposit more funds or close active trades.' });
         return;
      }

      const newTrade = {
        id: 'T' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 900 + 100),
        clientId: clientId, // ATTACH OWNER ID
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
        const symData = symbolsList.find(s => s.symbol === trade.symbol);
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

    // Socket-level helper. Any admin socket event is gated so that only
    // authenticated staff (role !== 'user') can invoke it. Previously these
    // handlers could be triggered by any authenticated client, letting users
    // manipulate any trade's bias / swap / profit / force-close state.
    const isAdminSocket = () => socket.decoded?.role && socket.decoded.role !== 'user';

    // ADMIN manipulates trade bias (Trend)
    socket.on('admin_set_bias', (data) => {
      if (!isAdminSocket()) return;
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
      if (!isAdminSocket()) return;
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

    // ADMIN sets a target closing price (Limit)
    socket.on('admin_set_selected_price', (data) => {
      if (!isAdminSocket()) return;
      const { clientId, tradeId, selectedPrice } = data;
      const trade = activeTrades[clientId]?.find(t => t.id === tradeId);
      if (trade) {
        trade.selectedPrice = selectedPrice ? parseFloat(selectedPrice) : null;
        console.log(`[ADMIN LIMIT] Trade ${tradeId} selected price set to: ${trade.selectedPrice}`);
        saveData();
        io.emit('trade_update', activeTrades);
        io.emit('client_update', clients);
      }
    });

    // ADMIN updates swap for a trade (works for both Open and Closed trades)
    socket.on('admin_update_swap', (data) => {
      if (!isAdminSocket()) return;
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
      if (!isAdminSocket()) return;
      const { clientId, tradeId } = data;
      const trade = activeTrades[clientId]?.find(t => t.id === tradeId);
      if (trade) {
        const symData = symbolsList.find(s => s.symbol === trade.symbol);
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
        io.emit('trade_killed', { tradeId, reason: 'Admin Force Close' }); 
        io.emit('trade_update', activeTrades);
        io.emit('client_update', clients);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // ─── LIVE SUPPORT CHAT ────────────────────────────────────────────────────

    // Join a support ticket room (both user and admin)
    socket.on('chat:join', async ({ ticketId }) => {
      socket.join(`ticket:${ticketId}`);
      console.log(`[CHAT] ${socket.decoded.role} ${socket.decoded.id} joined room ticket:${ticketId}`);
    });

    // Send a chat message
    socket.on('chat:message', async ({ ticketId, text, attachment }) => {
      if (!ticketId || (!text?.trim() && !attachment)) return;

      try {
        const role = socket.decoded.role;
        const senderId = socket.decoded.id;

        // Determine sender name
        let senderName = 'Support Team';
        if (role === 'user') {
          const client = clients.find(c => c.id === senderId);
          senderName = client?.name || 'Client';
        }

        const message = {
          senderId,
          senderRole: role,
          senderName,
          text: (text || '').trim(),
          attachment: attachment || null,
          timestamp: new Date(),
          read: false
        };

        // Persist to DB
        const updateObj = {
          $push: { messages: message },
          $set: { lastMessageAt: new Date() },
          $inc: role === 'user' ? { unreadByAdmin: 1 } : { unreadByClient: 1 }
        };
        const ticket = await SupportTicket.findOneAndUpdate(
          { id: ticketId },
          updateObj,
          { new: true }
        );

        if (!ticket) return;

        // Broadcast to everyone in the room
        io.to(`ticket:${ticketId}`).emit('chat:message', {
          ticketId,
          message: { ...message, timestamp: message.timestamp.toISOString() }
        });

        // Notify admin panel of new ticket activity
        if (role === 'user') {
          io.emit('chat:ticket_update', {
            ticketId,
            clientName: ticket.clientName,
            clientUid: ticket.clientUid,
            lastMessage: text.trim(),
            lastMessageAt: message.timestamp.toISOString(),
            unreadByAdmin: ticket.unreadByAdmin
          });
        }
      } catch (err) {
        console.error('[CHAT] Message error:', err.message);
      }
    });

    // Typing indicator (dots only)
    socket.on('chat:typing', ({ ticketId, isTyping }) => {
      const role = socket.decoded.role;
      socket.to(`ticket:${ticketId}`).emit('chat:typing', { role, isTyping });
    });

    // Real-time typing text (user → admin only)
    socket.on('chat:typing_text', ({ ticketId, text }) => {
      if (socket.decoded.role !== 'user') return;
      // Broadcast only to admins in the room (not back to the user)
      socket.to(`ticket:${ticketId}`).emit('chat:typing_text', { ticketId, text });
    });

    // Admin closes a ticket — notify user
    socket.on('chat:close_ticket', async ({ ticketId }) => {
      if (!isAdminSocket()) return;
      try {
        await SupportTicket.findOneAndUpdate({ id: ticketId }, { status: 'closed' });
        io.to(`ticket:${ticketId}`).emit('chat:ticket_closed', { ticketId });
        io.emit('chat:ticket_update', { ticketId, status: 'closed' });
        console.log(`[CHAT] Ticket ${ticketId} closed by admin.`);
      } catch (err) {
        console.error('[CHAT] Close ticket error:', err.message);
      }
    });

    // Admin reopens a ticket
    socket.on('chat:reopen_ticket', async ({ ticketId }) => {
      if (!isAdminSocket()) return;
      try {
        await SupportTicket.findOneAndUpdate({ id: ticketId }, { status: 'open' });
        io.to(`ticket:${ticketId}`).emit('chat:ticket_reopened', { ticketId });
        io.emit('chat:ticket_update', { ticketId, status: 'open' });
      } catch (err) {
        console.error('[CHAT] Reopen ticket error:', err.message);
      }
    });

    // Admin blocks a ticket
    socket.on('chat:block_ticket', async ({ ticketId }) => {
      if (!isAdminSocket()) return;
      try {
        await SupportTicket.findOneAndUpdate({ id: ticketId }, { status: 'blocked' });
        io.to(`ticket:${ticketId}`).emit('chat:ticket_blocked', { ticketId });
        io.emit('chat:ticket_update', { ticketId, status: 'blocked' });
        console.log(`[CHAT] Ticket ${ticketId} blocked by admin.`);
      } catch (err) {
        console.error('[CHAT] Block ticket error:', err.message);
      }
    });

    // Admin or ticket owner deletes a message. Users may only delete from
    // tickets they own; admins may delete from any ticket.
    socket.on('chat:delete_message', async ({ ticketId, timestamp }) => {
      try {
        if (!isAdminSocket()) {
          const owned = await SupportTicket.exists({ id: ticketId, clientId: socket.decoded.id });
          if (!owned) return;
        }
        await SupportTicket.updateOne(
          { id: ticketId },
          { $pull: { messages: { timestamp: new Date(timestamp) } } } // Mongoose handles string dating occasionally, but be safe
        );
        // Fallback for direct string vs Date schema
        await SupportTicket.updateOne(
          { id: ticketId },
          { $pull: { messages: { timestamp: timestamp } } }
        );
        io.to(`ticket:${ticketId}`).emit('chat:message_deleted', { ticketId, timestamp });
      } catch (err) {
        console.error('[CHAT] Delete message error:', err.message);
      }
    });

    // ─── SOVEREIGN ADMIN CONTROL ─────────────────────────────────────────────
    
    if (socket.decoded.role !== 'user') {
      const adminId = socket.decoded.id;
      
      socket.on('admin:presence', async ({ page }) => {
        const admin = await Admin.findById(adminId);
        if (!admin) return;

        adminOnline.set(adminId, {
          id: adminId,
          name: admin.name,
          role: admin.role,
          page: page,
          socketId: socket.id
        });

        // Broadcast to all admins who is where
        io.emit('admin:presence_update', Array.from(adminOnline.values()));
      });

      socket.on('admin:broadcast', ({ message, type }) => {
        if (socket.decoded.role !== 'super') return; // Only super can broadcast
        io.emit('admin:global_alert', { 
          message, 
          type: type || 'info', 
          sender: adminOnline.get(adminId)?.name || 'System'
        });
      });

      socket.on('admin:kick', ({ targetAdminId, sessionId }) => {
        if (socket.decoded.role !== 'super') return;
        io.emit('admin:force_logout', { adminId: targetAdminId, sessionId });
      });

      // Auto-Assign logic for new tickets
      socket.on('chat:auto_assign', async ({ ticketId }) => {
          try {
              const ticket = await SupportTicket.findOne({ id: ticketId });
              if (ticket && !ticket.assignedAdminId) {
                  // Find least busy online support member
                  const candidates = Array.from(adminOnline.values())
                    .filter(a => a.role === 'support' || a.role === 'admin');
                  
                  if (candidates.length > 0) {
                      const selected = candidates[0]; // Simple logic for now
                      ticket.assignedAdminId = selected.id;
                      ticket.assignedAdminName = selected.name;
                      await ticket.save();
                      io.emit('chat:ticket_update', { ticketId, assignedTo: selected.name });
                  }
              }
          } catch(err) {}
      });
    }

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      const adminId = socket.decoded.id;
      if (adminOnline.has(adminId)) {
        adminOnline.delete(adminId);
        io.emit('admin:presence_update', Array.from(adminOnline.values()));
      }

      // Auto-remove from online visitors on disconnect
      if (socket.decoded?.role === 'user') {
        const clientId = socket.decoded.id;
        if (onlineVisitors.has(clientId)) {
          onlineVisitors.delete(clientId);
          broadcastVisitors();
        }
      }
    });
  });
};

