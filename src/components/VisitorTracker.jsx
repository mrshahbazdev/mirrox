import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTrading } from '../context/TradingContext';

/**
 * VisitorTracker: Captures navigation events and sends them to the backend.
 * The backend handles IP and GeoIP resolution to avoid CORS issues.
 */
const VisitorTracker = () => {
  const location = useLocation();
  const { socket, clientId } = useTrading();
  const visitorIdRef = useRef(null);

  // Initialize/Retrieve Persistent Visitor ID
  useEffect(() => {
    let vid = localStorage.getItem('mirrox_vid');
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem('mirrox_vid', vid);
    }
    visitorIdRef.current = vid;

    // Initial track on mount
    if (socket) {
      socket.emit('visitor:track', {
        visitorId: vid,
        userId: clientId,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Direct',
        path: window.location.pathname
      });
    }
  }, [socket, clientId]);

  // Track page changes
  useEffect(() => {
    if (socket && visitorIdRef.current) {
      socket.emit('visitor:track', {
        visitorId: visitorIdRef.current,
        userId: clientId,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Direct',
        path: location.pathname
      });
    }
  }, [location.pathname, socket, clientId]);

  return null; // Side-effect only component
};

export default VisitorTracker;
