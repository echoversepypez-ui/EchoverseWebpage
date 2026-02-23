'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminConversations } from '@/hooks/useAdminConversations';
import { useConversationMessages } from '@/hooks/useConversationMessages';
import { supabase } from '@/lib/supabase';
import styles from './conversation-detail.module.css';

export default function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const conversationId = resolvedParams.id;
  
  const { getConversation, updateConversationStatus } = useAdminConversations();
  const { messages, loading: messagesLoading, error: messagesError, sendMessage, markMessagesAsRead } = useConversationMessages(conversationId);
  
  const [conversation, setConversation] = useState<any>(null);
  const [adminMessage, setAdminMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Generate a UUID-like ID for this session
  const [currentAdminId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('admin_session_id');
      if (stored) return stored;
      const id = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('admin_session_id', id);
      return id;
    }
    return `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMarkedAsRead = useRef(false);

  // Fetch conversation details
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        console.log('[Detail] Fetching conversation:', conversationId);
        const conv = await getConversation(conversationId);
        if (conv) {
          console.log('[Detail] Conversation loaded:', conv);
          setConversation(conv);
          setError(null);
        } else {
          console.warn('[Detail] Conversation not found');
          setError('Conversation not found');
          setTimeout(() => router.push('/admin/support-conversations'), 1000);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('[Detail] Error fetching conversation:', err);
        setError(errorMsg);
        setTimeout(() => router.push('/admin/support-conversations'), 1000);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId, getConversation, router]);

  // Mark unread guest messages as read
  useEffect(() => {
    if (messages.length > 0 && !hasMarkedAsRead.current) {
      const unreadMessages = messages
        .filter((m) => m.is_read === false && m.sender_type === 'guest')
        .map((m) => m.id);
      if (unreadMessages.length > 0) {
        console.log('[Detail] Marking messages as read:', unreadMessages);
        markMessagesAsRead(unreadMessages);
        hasMarkedAsRead.current = true;
      }
    }
  }, [messages, markMessagesAsRead]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!adminMessage.trim()) return;

    const messageContent = adminMessage; // Save before clearing

    try {
      setIsSending(true);
      setAdminMessage('');

      // Ensure conversation is in-progress (without assigning admin_id to avoid UUID error)
      if (conversation?.status === 'open') {
        console.log('[Detail] Updating conversation status to in-progress');
        await updateConversationStatus(conversationId, 'in-progress');
        setConversation((prev: any) => ({
          ...prev,
          status: 'in-progress',
        }));
      }

      // Send message
      console.log('[Detail] Sending message:', messageContent);
      await sendMessage(messageContent, 'admin', currentAdminId, 'Support Agent');
      console.log('[Detail] Message sent successfully');
      
      // Wait a moment for the database to persist, then manually refresh messages
      setTimeout(async () => {
        console.log('[Detail] Refreshing messages after send...');
        const { data } = await supabase
          .from('conversation_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
        console.log('[Detail] Refreshed messages:', data?.length || 0);
      }, 500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('[Detail] Error sending message:', errorMsg, err);
      alert(`Failed to send message: ${errorMsg}`);
      setAdminMessage(messageContent); // Restore message if failed
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseConversation = async () => {
    if (
      confirm(
        'Are you sure you want to close this conversation? Users will see it as closed.'
      )
    ) {
      try {
        await updateConversationStatus(conversationId, 'closed');
        router.push('/admin/support-conversations');
      } catch (err) {
        console.error('Error closing conversation:', err);
        alert('Failed to close conversation');
      }
    }
  };

  if (loading) {
    return <div className={styles.container}><p>Loading conversation...</p></div>;
  }

  if (error || !conversation) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '20px', background: '#fee', border: '1px solid #fcc', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ color: '#c00', fontWeight: 'bold' }}>❌ Error loading conversation</p>
          <p style={{ color: '#600', marginTop: '8px' }}>{error || 'Conversation not found'}</p>
          <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>This may be a database access issue. Please ensure RLS policies are configured correctly.</p>
          <button 
            onClick={() => router.push('/admin/support-conversations')}
            style={{ marginTop: '12px', padding: '8px 16px', background: '#9333ea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            ← Back to Conversations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1>{conversation.guest_name || conversation.guest_id}</h1>
          <p className={styles.email}>{conversation.guest_email || 'No email'}</p>
          <span className={`${styles.statusBadge} ${styles[conversation.status]}`}>
            {conversation.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        <button className={styles.closeBtn} onClick={handleCloseConversation}>
          Close Conversation
        </button>
      </div>

      <div className={styles.messagesContainer}>
        <div className={styles.messagesList}>
          {messages.length === 0 ? (
            <p className={styles.noMessages}>No messages yet</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${styles[message.sender_type]}`}
              >
                <div className={styles.messageMeta}>
                  <span className={styles.sender}>
                    {message.sender_type === 'guest' ? 'Guest' : 'Support Agent'}
                  </span>
                  <span className={styles.timestamp}>
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className={styles.messageContent}>{message.message}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <textarea
            className={styles.messageInput}
            placeholder="Type your response..."
            value={adminMessage}
            onChange={(e) => setAdminMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.ctrlKey && !isSending) {
                handleSendMessage();
              }
            }}
            disabled={isSending}
            rows={3}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSendMessage}
            disabled={isSending || !adminMessage.trim()}
          >
            {isSending ? '⏳ Sending...' : 'Send Reply'}
          </button>
        </div>
        <p className={styles.hint}>Press Ctrl+Enter to send</p>
      </div>

      <div className={styles.conversationMeta}>
        <p>Message Count: {messages.length}</p>
        <p>Created: {new Date(conversation.created_at).toLocaleString()}</p>
        {conversation.last_message_at && (
          <p>Last Message: {new Date(conversation.last_message_at).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}
