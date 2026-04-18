import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTrading } from '../context/TradingContext';

const VisitorTracker = () => {
  const location = useLocation();
  const { socket, clientId } = useTrading();
  const visitorDataRef = useRef(null);

  // Initialize Visitor ID
  useEffect(() => {
    let vid = localStorage.getItem('mirrox_vid');
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem('mirrox_vid', vid);
    }

    const fetchGeoData = async () => {
      try {
        // Fetch GeoIP info (Free service)
        const res = await axios.get('https://ipapi.co/json/');
        visitorDataRef.current = {
          visitorId: vid,
          ip: res.data.ip,
          country: res.data.country_name,
          city: res.data.city,
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'Direct'
        };
        
        // Initial track for entry page
        if (socket) {
          socket.emit('visitor:track', {
            ...visitorDataRef.current,
            userId: clientId,
            path: window.location.pathname
          });
        }
      } catch (err) {
        console.warn('GeoIP fetch failed, tracking with basic info');
        visitorDataRef.current = {
          visitorId: vid,
          ip: 'Unknown',
          country: 'Unknown',
          city: 'Unknown',
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'Direct'
        };
      }
    };

    fetchGeoData();
  }, [socket, clientId]);

  // Track page changes
  useEffect(() => {
    if (socket && visitorDataRef.current) {
      socket.emit('visitor:track', {
        ...visitorDataRef.current,
        userId: clientId,
        path: location.pathname
      });
    }
  }, [location.pathname, socket, clientId]);

  return null; // Side-effect only component
};

export default VisitorTracker;
