import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useModal } from './ModalContext';

// Global Axios Interceptor for JWT Authentication
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('bullvera_token') || localStorage.getItem('bullvera_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const TradingContext = createContext();

export const useTrading = () => useContext(TradingContext);

export const TradingProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [prices, setPrices] = useState([]);
  const [activeTrades, setActiveTrades] = useState([]);
  const [allTrades, setAllTrades] = useState({});
  const [allClients, setAllClients] = useState([]); // Store all client data from socket
  const { showAlert } = useModal();
  
  // Initialize clientId and token from localStorage if available
  const [clientId, setClientIdState] = useState(() => localStorage.getItem('bullvera_client_id'));
  const [token, setTokenState] = useState(() => localStorage.getItem('bullvera_token') || localStorage.getItem('bullvera_admin_token'));

  const setClientId = (id, newToken = null) => {
    if (id) {
      localStorage.setItem('bullvera_client_id', id);
    } else {
      localStorage.removeItem('bullvera_client_id');
    }
    
    if (newToken) {
      localStorage.setItem('bullvera_token', newToken);
      setTokenState(newToken);
    } else if (id === null) {
      localStorage.removeItem('bullvera_token');
      setTokenState(null);
    }

    setClientIdState(id);
  };

  // Helper to get the current client's real-time data from the socket stream
  const currentClientExtended = allClients.find(c => c.id === clientId) || null;

  useEffect(() => {
    // Connect socket even without token (for guest visitor tracking)
    const socketOptions = token ? { auth: { token } } : {};
    
    const s = io(import.meta.env.VITE_API_URL + '', socketOptions);
    setSocket(s);

    s.on('connect', () => {
      console.log('Connected to Trading Server', token ? 'with Token' : 'as Guest');
    });

    s.on('connect_error', (err) => {
      console.error('Socket Connection Error:', err.message);
    });

    s.on('market_update', (data) => {
      setPrices(data.prices);
      
      // Update trades if provided by server
      if (data.trades) {
        setAllTrades(data.trades);
      }
      // Update clients if provided by server
      if (data.clients) {
        setAllClients(data.clients);
      }
    });

    s.on('trade_update', (newAllTrades) => {
       setAllTrades(newAllTrades);
    });

    s.on('client_update', (newClients) => {
       setAllClients(newClients);
    });
    
    s.on('trade_killed', (data) => {
      console.log('Trade closed by system/admin:', data.tradeId, 'Reason:', data.reason);
      // showAlert(`Position ${data.tradeId} closed: ${data.reason}`, 'Position Closed', 'info');
    });

    s.on('margin_call', (data) => {
      console.log('MARGIN CALL! Liquidation at', data.marginLevel);
      showAlert(`⚠️ MARGIN CALL: Your margin level dropped below 50% (${data.marginLevel.toFixed(2)}%). System liquidations have started to protect your account.`, 'Margin Call', 'error');
    });

    s.on('trade_error', (data) => {
      showAlert(data.message, 'Execution Error', 'warning');
    });

    return () => s.disconnect();
  }, [token]);

  // Update activeTrades whenever allTrades or clientId changes
  useEffect(() => {
    if (clientId && allTrades[clientId]) {
      // Trades with status 'Open' or 'Pending' are visible in the active list
      setActiveTrades(allTrades[clientId].filter(t => t.status === 'Open' || t.status === 'Pending'));
    } else {
      setActiveTrades([]);
    }
  }, [clientId, allTrades]);

  // Method to open a trade from Frontend
  const openPosition = (symbol, volume, type, pendingPrice = null, stopLoss = null, takeProfit = null) => {
    if (!socket) {
      showAlert('Not connected to trading server. Please refresh the page.', 'Connection Error', 'error');
      return;
    }
    if (!clientId || !token) {
      showAlert('Please log in to execute trades.', 'Authentication Required', 'warning');
      return;
    }
    socket.emit('open_trade', {
      symbol, volume, type, clientId, pendingPrice, stopLoss, takeProfit
    });
  };

  // Method to close a trade from Frontend
  const closePosition = (tradeId) => {
    if (socket && clientId) {
      console.log(`[CLIENT] Closing trade ${tradeId} for client ${clientId}`);
      socket.emit('close_trade', { clientId, tradeId });
    }
  };

  return (
    <TradingContext.Provider value={{
      socket,
      prices,
      activeTrades,
      allTrades,
      allClients,
      currentClientExtended,
      clientId,
      setClientId,
      openPosition,
      closePosition
    }}>
      {children}
    </TradingContext.Provider>
  );
};
