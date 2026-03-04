'use client';

import { useState, useEffect } from 'react';

export function RealtimeIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showUpdate = (msg: string) => {
    setMessage(msg);
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 2000);
  };

  useEffect(() => {
    // Listen for custom events from real-time updates
    const handleRealtimeUpdate = (event: CustomEvent) => {
      showUpdate(event.detail.message || 'Content updated');
    };

    window.addEventListener('realtime-update', handleRealtimeUpdate as EventListener);
    
    return () => {
      window.removeEventListener('realtime-update', handleRealtimeUpdate as EventListener);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
