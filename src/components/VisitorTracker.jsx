import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTrading } from '../context/TradingContext';

/**
 * VisitorTracker: Captures navigation events and sends them to the backend.
 * Also sends periodic heartbeats to track "Stay Time" on each page.
 */
const VisitorTracker = () => {
  const location = useLocation();
  const { socket, clientId } = useTrading();
  const visitorIdRef = useRef(null);
  const heartbeatRef = useRef(null);

  // Initialize/Retrieve Persistent Visitor ID
  useEffect(() => {
    let vid = localStorage.getItem('mirrox_vid');
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem('mirrox_vid', vid);
    }
    visitorIdRef.current = vid;
  }, []);

  // Tracking Function
  const trackPath = (path) => {
    if (socket && visitorIdRef.current) {
        socket.emit('visitor:track', {
            visitorId: visitorIdRef.current,
            userId: clientId,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct',
            path: path
        });
    }
  };

  // Track page changes & Manage Heartbeat
  useEffect(() => {
    if (!socket || !visitorIdRef.current) return;

    // 1. Initial Track for the new path
    trackPath(location.pathname);

    // 2. Start Heartbeat Timer (Every 5 seconds)
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    
    heartbeatRef.current = setInterval(() => {
        // Only send heartbeat if browser is active (tab not hidden)
        if (document.visibilityState === 'visible') {
            socket.emit('visitor:heartbeat', { 
                visitorId: visitorIdRef.current 
            });
        }
    }, 5000);

    return () => {
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [location.pathname, socket, clientId]);

  return null; // Side-effect only component
};

export default VisitorTracker;
