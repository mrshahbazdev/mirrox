import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTrading } from '../context/TradingContext';

/**
 * VisitorTracker: Captures navigation events and sends them to the backend.
 * Now collects deep device metrics (Resolution, Browser, Language).
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

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    let os = "Unknown";
    let deviceType = "Desktop";

    // Browser Detection
    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("SamsungBrowser")) browser = "Samsung Browser";
    else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
    else if (ua.includes("Trident")) browser = "Internet Explorer";
    else if (ua.includes("Edge")) browser = "Edge";
    else if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";

    // OS Detection
    if (ua.includes("Win")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("like Mac")) os = "iOS";

    // Device Type Detection
    if (/tablet|ipad|playbook|silk/i.test(ua)) deviceType = "Tablet";
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) deviceType = "Mobile";

    return {
       browser,
       os,
       deviceType,
       screenResolution: `${window.screen.width}x${window.screen.height}`,
       language: navigator.language
    };
  };

  // Tracking Function
  const trackPath = (path) => {
    if (socket && visitorIdRef.current) {
        const deviceData = getDeviceInfo();
        socket.emit('visitor:track', {
            visitorId: visitorIdRef.current,
            userId: clientId,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct',
            path: path,
            ...deviceData
        });
    }
  };

  // Track page changes & Manage Heartbeat
  useEffect(() => {
    if (!socket || !visitorIdRef.current) return;

    trackPath(location.pathname);

    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    heartbeatRef.current = setInterval(() => {
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

  return null;
};

export default VisitorTracker;
