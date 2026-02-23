import { useState, useEffect, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/realtime-js';
import { supabase } from '@/lib/supabase';

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  sender_type: 'guest' | 'admin' | 'system';
  sender_id: string | null;
  sender_name: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function useConversationMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Fetch messages for conversation
  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      console.log('[Messages] No conversation ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('[Messages] Fetching messages for conversation:', conversationId);
      const { data, error: fetchError } = await supabase
        .from('conversation_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('[Messages] Fetch error:', fetchError.code, fetchError.message);
        throw fetchError;
      }
      console.log('[Messages] Fetched messages:', data?.length || 0);
      setMessages(data || []);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      console.error('[Messages] Error fetching messages:', errorMsg, err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Send a new message
  const sendMessage = useCallback(
    async (
      message: string,
      senderType: 'guest' | 'admin',
      senderId?: string,
      senderName?: string
    ) => {
      if (!conversationId || !message.trim()) {
        const msg = 'Cannot send message - missing conversation ID or message content';
        console.error('[Messages]', msg);
        throw new Error(msg);
      }

      try {
        console.log('[Messages] Inserting message:', { conversationId, senderType, message });
        const { data, error: insertError } = await supabase
          .from('conversation_messages')
          .insert([
            {
              conversation_id: conversationId,
              sender_type: senderType,
              sender_id: senderId || null,
              sender_name: senderName || null,
              message: message.trim(),
              is_read: false,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error('[Messages] Insert error:', insertError.code, insertError.message);
          throw insertError;
        }
        console.log('[Messages] Message inserted successfully:', data.id);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('[Messages] Error sending message:', errorMsg, err);
        throw err;
      }
    },
    [conversationId]
  );

  // Mark messages as read
  const markMessagesAsRead = useCallback(
    async (messageIds: string[]) => {
      if (messageIds.length === 0) return;

      try {
        const { error: updateError } = await supabase
          .from('conversation_messages')
          .update({ is_read: true })
          .in('id', messageIds);

        if (updateError) throw updateError;
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    },
    []
  );

  // Subscribe to real-time updates
  useEffect(() => {
    if (!conversationId) {
      console.log('[Messages] No conversation ID, skipping subscription');
      return;
    }

    console.log('[Messages] Setting up real-time subscription for:', conversationId);
    fetchMessages();

    const messageChannel = supabase
      .channel(`conversation-messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('[Messages] Real-time INSERT received:', payload.new);
          setMessages((prev) => {
            const updated = [...prev, payload.new as ConversationMessage];
            console.log('[Messages] Messages updated, total:', updated.length);
            return updated;
          });
        }
      )
      .subscribe((status) => {
        console.log('[Messages] Subscription status:', status);
      });

    setChannel(messageChannel);

    return () => {
      console.log('[Messages] Unsubscribing from channel');
      messageChannel.unsubscribe();
    };
  }, [conversationId, fetchMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    markMessagesAsRead,
  };
}
