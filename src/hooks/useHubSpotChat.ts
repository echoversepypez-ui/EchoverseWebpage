'use client';

import { useEffect } from 'react';

export function useHubSpotChat() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.hsConversationsOnReady) {
      window.hsConversationsOnReady = [];
    }

    console.log('[HubSpot] registering hsConversationsOnReady callback');

    window.hsConversationsOnReady.push(() => {
      console.log('[HubSpot] hsConversationsOnReady fired');
    });
  }, []);
}

/**
 * Simple helper to open the widget if it's ready.
 * No polling—if the widget isn't ready yet, just warn.
 */
export function openHubSpotWidget() {
  if (typeof window === 'undefined') return;

  const conv = window.HubSpotConversations;
  if (!conv || !conv.widget) {
    console.warn('[HubSpot] HubSpotConversations not yet ready');
    return;
  }

  try {
    console.log('[HubSpot] Opening widget');
    conv.widget.open();
  } catch (e) {
    console.error('[HubSpot] Failed to open chat widget', e);
  }
}
