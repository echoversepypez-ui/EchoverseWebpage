'use client';

import { useAuth } from '@/lib/auth-context';
import { SupportChatbot } from './SupportChatbot';

/**
 * ConditionalChat Component
 * 
 * Routes between two chat systems based on authentication:
 * - Anonymous Visitors → HubSpot Chat (messages stored in HubSpot)
 * - Authenticated Admins → Custom SupportChatbot (messages in Supabase)
 */
export function ConditionalChat() {
  const { isAdmin, isLoading } = useAuth();

  // Wait for auth to initialize to avoid hydration mismatch
  if (isLoading) {
    return null;
  }

  // Authenticated admins use custom chatbot (Supabase storage)
  if (isAdmin) {
    return <SupportChatbot />;
  }

  // Anonymous visitors use HubSpot (HubSpot storage)
  // HubSpot widget loads automatically from script in layout.tsx
  return null;
}
