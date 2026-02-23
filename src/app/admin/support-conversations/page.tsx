'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminConversations } from '@/hooks/useAdminConversations';
import styles from './support-conversations.module.css';

export default function SupportConversationsPage() {
  const { conversations, loading, error, fetchConversations, assignToAdmin, closeConversation } = useAdminConversations();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentAdminId] = useState('admin-001'); // In real app, get from auth

  // Refresh conversations when component mounts or filter changes
  useEffect(() => {
    console.log('[ConversationsPage] Filter changed to:', filterStatus);
  }, [filterStatus]);

  const filteredConversations = conversations.filter((conv) => 
    filterStatus === 'all' ? true : conv.status === filterStatus
  );

  const handleAssign = async (conversationId: string) => {
    try {
      await assignToAdmin(conversationId, currentAdminId);
      alert('Conversation assigned successfully');
    } catch (error) {
      alert('Failed to assign conversation');
      console.error(error);
    }
  };

  const handleClose = async (conversationId: string) => {
    if (confirm('Are you sure you want to close this conversation?')) {
      try {
        await closeConversation(conversationId);
        alert('Conversation closed');
      } catch (error) {
        alert('Failed to close conversation');
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className={styles.container}><p>Loading conversations...</p></div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '20px', background: '#fee', border: '1px solid #fcc', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ color: '#c00', fontWeight: 'bold' }}>❌ Error loading conversations</p>
          <p style={{ color: '#600', marginTop: '8px' }}>{error}</p>
          <button 
            onClick={() => fetchConversations()}
            style={{ marginTop: '12px', padding: '8px 16px', background: '#9333ea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('[ConversationsPage] Total conversations:', conversations.length, conversations);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Support Conversations</h1>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Open</span>
            <span className={styles.statValue}>
              {conversations.filter((c) => c.status === 'open').length}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>In Progress</span>
            <span className={styles.statValue}>
              {conversations.filter((c) => c.status === 'in-progress').length}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Closed</span>
            <span className={styles.statValue}>
              {conversations.filter((c) => c.status === 'closed').length}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.filterSection}>
        <button
          className={`${styles.filterBtn} ${filterStatus === 'open' ? styles.active : ''}`}
          onClick={() => setFilterStatus('open')}
        >
          Open
        </button>
        <button
          className={`${styles.filterBtn} ${filterStatus === 'in-progress' ? styles.active : ''}`}
          onClick={() => setFilterStatus('in-progress')}
        >
          In Progress
        </button>
        <button
          className={`${styles.filterBtn} ${filterStatus === 'closed' ? styles.active : ''}`}
          onClick={() => setFilterStatus('closed')}
        >
          Closed
        </button>
        <button
          className={`${styles.filterBtn} ${filterStatus === 'all' ? styles.active : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All
        </button>
        <button
          className={styles.filterBtn}
          onClick={() => {
            console.log('[ConversationsPage] Manual refresh clicked');
            fetchConversations();
          }}
          title="Refresh conversations"
        >
          🔄 Refresh
        </button>
      </div>

      {filteredConversations.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px', marginTop: '20px' }}>
          <p className={styles.noData} style={{ marginBottom: '16px' }}>
            {conversations.length === 0 
              ? '📭 No conversations yet. Guests will start chats from the support widget.' 
              : `📭 No ${filterStatus} conversations found.`}
          </p>
          {conversations.length > 0 && (
            <button
              onClick={() => setFilterStatus('all')}
              style={{ padding: '8px 16px', background: '#9333ea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              View All Conversations
            </button>
          )}
        </div>
      ) : (
        <div className={styles.conversationsList}>
          {filteredConversations.map((conversation) => (
            <div key={conversation.id} className={styles.conversationCard}>
              <div className={styles.cardHeader}>
                <div className={styles.conversationInfo}>
                  <h3>{conversation.guest_name || conversation.guest_id}</h3>
                  {conversation.guest_email && (
                    <p className={styles.email}>{conversation.guest_email}</p>
                  )}
                </div>
                <span className={`${styles.statusBadge} ${styles[conversation.status]}`}>
                  {conversation.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.meta}>
                  <span>Messages: {conversation.total_messages}</span>
                  <span>
                    Created: {new Date(conversation.created_at).toLocaleDateString()}
                  </span>
                  {conversation.last_message_at && (
                    <span>
                      Last: {new Date(conversation.last_message_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.cardFooter}>
                <Link href={`/admin/support-conversations/${conversation.id}`}>
                  <button className={styles.viewBtn}>View Conversation</button>
                </Link>
                {conversation.status !== 'closed' && (
                  <button
                    className={styles.closeBtn}
                    onClick={() => handleClose(conversation.id)}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
