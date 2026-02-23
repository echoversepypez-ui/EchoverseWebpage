import { useState, useEffect, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/realtime-js';
import { supabase } from '@/lib/supabase';

export interface SupportConversation {
  id: string;
  guest_id: string;
  guest_email: string | null;
  guest_name: string | null;
  status: 'open' | 'in-progress' | 'closed' | 'waiting';
  assigned_admin_id: string | null;
  total_messages: number;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

export function useAdminConversations() {
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all conversations
  const fetchConversations = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      console.log('[AdminConv] Fetching conversations, filter:', status || 'all');
      
      let query = supabase
        .from('admin_support_conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('[AdminConv] Fetch error:', fetchError.code, fetchError.message);
        throw fetchError;
      }
      
      console.log('[AdminConv] Fetched conversations:', data?.length || 0, data);
      setConversations(data || []);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      console.error('[AdminConv] Error fetching conversations:', errorMsg, err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a specific conversation
  const getConversation = useCallback(
    async (conversationId: string) => {
      try {
        const { data, error: fetchError } = await supabase
          .from('admin_support_conversations')
          .select('*')
          .eq('id', conversationId)
          .single();

        if (fetchError) throw fetchError;
        return data;
      } catch (err) {
        console.error('Error fetching conversation:', err);
        return null;
      }
    },
    []
  );

  // Create a new conversation
  const createConversation = useCallback(
    async (guestId: string, guestEmail?: string, guestName?: string) => {
      try {
        console.log('[Chat] Creating new conversation for guest:', guestId, { guestName, guestEmail });
        
        // Always create a new conversation - allow multiple conversations per guest
        const { data, error: insertError } = await supabase
          .from('admin_support_conversations')
          .insert([
            {
              guest_id: guestId,
              guest_email: guestEmail || null,
              guest_name: guestName || null,
              status: 'open',
              total_messages: 0,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error('[Chat] Insert error:', insertError.code, insertError.message);
          throw insertError;
        }
        
        console.log('[Chat] Successfully created new conversation:', data.id);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('[Chat] Conversation creation failed:', errorMsg, err);
        throw err;
      }
    },
    []
  );

  // Update conversation status
  const updateConversationStatus = useCallback(
    async (conversationId: string, status: string, assignedAdminId?: string) => {
      try {
        const updateData: any = { status };
        if (assignedAdminId) {
          updateData.assigned_admin_id = assignedAdminId;
        }
        if (status === 'closed') {
          updateData.closed_at = new Date().toISOString();
        }

        const { error: updateError } = await supabase
          .from('admin_support_conversations')
          .update(updateData)
          .eq('id', conversationId);

        if (updateError) throw updateError;
      } catch (err) {
        console.error('Error updating conversation status:', err);
        throw err;
      }
    },
    []
  );

  // Assign conversation to admin
  const assignToAdmin = useCallback(
    async (conversationId: string, adminId: string) => {
      return updateConversationStatus(conversationId, 'in-progress', adminId);
    },
    [updateConversationStatus]
  );

  // Close conversation
  const closeConversation = useCallback(
    async (conversationId: string) => {
      return updateConversationStatus(conversationId, 'closed');
    },
    [updateConversationStatus]
  );

  // Get unread message count
  const getUnreadCount = useCallback(
    async (conversationId: string) => {
      try {
        const { count, error: countError } = await supabase
          .from('conversation_messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conversationId)
          .eq('is_read', false)
          .eq('sender_type', 'guest');

        if (countError) throw countError;
        return count || 0;
      } catch (err) {
        console.error('Error getting unread count:', err);
        return 0;
      }
    },
    []
  );

  // Subscribe to real-time updates
  useEffect(() => {
    console.log('[AdminConv] Setting up real-time subscriptions');
    fetchConversations();

    const channel = supabase
      .channel('admin-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_support_conversations',
        },
        (payload) => {
          console.log('[AdminConv] Real-time event received:', payload.eventType, payload);
          
          if (payload.eventType === 'INSERT') {
            console.log('[AdminConv] New conversation added:', payload.new.id);
            setConversations((prev) => [payload.new as SupportConversation, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            console.log('[AdminConv] Conversation updated:', payload.new.id);
            setConversations((prev) =>
              prev.map((conv) =>
                conv.id === payload.new.id ? (payload.new as SupportConversation) : conv
              )
            );
          } else if (payload.eventType === 'DELETE') {
            console.log('[AdminConv] Conversation deleted:', payload.old.id);
            setConversations((prev) =>
              prev.filter((conv) => conv.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('[AdminConv] Subscription status:', status);
      });

    return () => {
      console.log('[AdminConv] Unsubscribing from real-time updates');
      channel.unsubscribe();
    };
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    getConversation,
    createConversation,
    updateConversationStatus,
    assignToAdmin,
    closeConversation,
    getUnreadCount,
  };
}
