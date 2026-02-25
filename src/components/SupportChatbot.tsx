'use client';

declare global {
  interface Window {
    Tawk_API?: any;
  }
}

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useChatbotOptions } from '@/hooks/useChatbotOptions';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useAdminConversations } from '@/hooks/useAdminConversations';
import { useConversationMessages } from '@/hooks/useConversationMessages';
// previously used Tawk.to chat widget – now using internal chat support
import { supabase } from '@/lib/supabase';
import styles from './SupportChatbot.module.css';

interface Message {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: Date;
  senderName?: string;
}

interface CategoryGroup {
  name: string;
  icon: string;
  items: any[];
}

export function SupportChatbot() {
  const pathname = usePathname();
  const { options, loading } = useChatbotOptions();
  const { getBooleanSetting, loading: settingsLoading, refresh } = useSystemSettings();
  const { createConversation } = useAdminConversations();
  
  // using internal chat support; external widget initialization removed
  
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'menu' | 'category' | 'content' | 'guest-info' | 'admin-chat'>('menu');
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "How can I help? 👋",
      timestamp: new Date(),
    },
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [adminChatting, setAdminChatting] = useState(false);
  const [isChatbotEnabled, setIsChatbotEnabled] = useState(true);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [openingHubSpot, setOpeningHubSpot] = useState(false);
  // whether the external Tawk.to widget is active
  const [showTawk, setShowTawk] = useState(false);
  
  // Hook for conversation messages - will subscribe when conversationId is set
  const { messages: dbMessages, loading: messagesLoading } = useConversationMessages(conversationId);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  
  const prevEnabledRef = useRef<boolean>(true);
  const guestIdRef = useRef<string | null>(null);

  // Check if on admin page
  const isAdminPage = pathname.startsWith('/admin');

  // Initialize guest ID on mount
  useEffect(() => {
    const storedGuestId = localStorage.getItem('chatbot_guest_id');
    if (storedGuestId) {
      setGuestId(storedGuestId);
      guestIdRef.current = storedGuestId;
    } else {
      const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatbot_guest_id', newGuestId);
      setGuestId(newGuestId);
      guestIdRef.current = newGuestId;
    }
  }, []);

  // Initialize chatbot enabled state - only on mount
  useEffect(() => {
    if (isAdminPage) {
      setIsChatbotEnabled(false);
      prevEnabledRef.current = false;
    } else if (!settingsLoading) {
      const chatbotEnabled = getBooleanSetting('chatbot_enabled');
      setIsChatbotEnabled(chatbotEnabled);
      prevEnabledRef.current = chatbotEnabled;
    }
  }, [isAdminPage, settingsLoading]);

  // when using external widget, the internal UI is suppressed.
  // load tawk script lazily and register event callbacks
  useEffect(() => {
    // Toggling external widget visibility
    if (showTawk) {
      // add the tawk script if it hasn't been loaded
      if (!window.Tawk_API) {
        const s1 = document.createElement('script');
        const s0 = document.getElementsByTagName('script')[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/699d0106d737701c38a644a1/1ji6ko0f9';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode?.insertBefore(s1, s0);
      }

      window.Tawk_API = window.Tawk_API || {};

      // show / maximize widget
      const openCheck = setInterval(() => {
        if (window.Tawk_API && window.Tawk_API.maximize) {
          window.Tawk_API.showWidget && window.Tawk_API.showWidget();
          window.Tawk_API.maximize();
          clearInterval(openCheck);
        }
      }, 500);

      // when widget is minimized (closed) we return to our UI
      window.Tawk_API.onChatMinimized = () => {
        setShowTawk(false);
        setIsOpen(true);
      };

      return () => {
        clearInterval(openCheck);
      };
    } else {
      // if widget exists, hide it completely (no icon)
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    }
  }, [showTawk]);

  // Group options by category for better organization
  const groupedOptions = options.reduce((acc: { [key: string]: CategoryGroup }, option: any) => {
    const category = option.category || 'General';
    if (!acc[category]) {
      acc[category] = {
        name: category,
        icon: option.emoji?.charAt(0) || '📋',
        items: []
      };
    }
    acc[category].items.push(option);
    return acc;
  }, {});

  // Get combined display messages (local bot/system messages + active conversation messages)
  const getDisplayMessages = (): Message[] => {
    if (!adminChatting || !conversationId) {
      return localMessages;
    }
    // When in admin chat, show all conversation messages from database
    // These include both guest and admin messages with their actual names
    const convertedMessages = dbMessages.map((msg) => ({
      id: msg.id,
      type: msg.sender_type as 'bot' | 'user' | 'system',
      content: msg.message,
      timestamp: new Date(msg.created_at),
      senderName: msg.sender_name || 'Unknown', // Include the actual sender name
    }));
    
    return convertedMessages;
  };

  const handleCategoryClick = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const handleOptionClick = (option: any) => {
    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: option.title,
      timestamp: new Date(),
    };

    setLocalMessages((prev) => [...prev, newMessage]);

    if (option.is_admin_chat) {
      // Show guest info form before creating conversation
      setCurrentStep('guest-info');
      setSelectedOption(option);
      setGuestName('');
      setGuestEmail('');
    } else {
      // Show detailed content
      setCurrentStep('content');
      setSelectedOption(option);
    }
  };

  const handleGuestInfoSubmit = async () => {
    if (!guestName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!guestId) {
      alert('Unable to establish connection. Please try again.');
      return;
    }

    try {
      setIsCreatingConversation(true);
      setShowFallback(false);
      
      console.log('[Chat] Creating conversation with guest info:', { guestId, guestName, guestEmail });
      
      const conversation = await createConversation(guestId, guestEmail || undefined, guestName);
      
      if (conversation && conversation.id) {
        console.log('[Chat] Conversation created successfully:', conversation.id);
        setConversationId(conversation.id);
        setIsCreatingConversation(false);
        setRetryCount(0);
        setShowFallback(false);
        setCurrentStep('admin-chat');
        setAdminChatting(true);
      } else {
        throw new Error('Invalid conversation response - no ID returned');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('[Chat] Failed to create conversation:', errorMsg, error);
      setIsCreatingConversation(false);
      setShowFallback(true);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: `⚠️ Connection error: ${errorMsg}. Please try email support instead.`,
        timestamp: new Date(),
      };
      setLocalMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    
    if (!conversationId) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: '⚠️ Still connecting to support. Please wait a moment and try again.',
        timestamp: new Date(),
      };
      setLocalMessages((prev) => [...prev, errorMessage]);
      return;
    }

    if (!guestId) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: '❌ Unable to establish connection. Please refresh and try again.',
        timestamp: new Date(),
      };
      setLocalMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const messageContent = userMessage;
    setUserMessage('');

    try {
      // Save message to database
      console.log('[Chat] Sending message with conversationId:', conversationId, 'guestId:', guestId);
      
      const { error } = await supabase
        .from('conversation_messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_type: 'guest',
            sender_id: guestId,
            sender_name: guestName || 'Guest',
            message: messageContent,
            is_read: false,
          },
        ]);

      if (error) {
        console.error('[Chat] Error saving message:', error.code, error.message, error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'system',
          content: `❌ Error: ${error.message || 'Failed to send message. Please try again.'}`,
          timestamp: new Date(),
        };
        setLocalMessages((prev) => [...prev, errorMessage]);
      } else {
        console.log('[Chat] Message sent successfully - will appear via real-time update');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('[Chat] Error sending message:', errorMsg, err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: `❌ Error: ${errorMsg || 'Failed to send message. Please try again.'}`,
        timestamp: new Date(),
      };
      setLocalMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleGoBack = () => {
    setCurrentStep('menu');
    setAdminChatting(false);
    setSelectedOption(null);
  };

  // Don't render chatbot if on admin page
  if (isAdminPage) {
    return null;
  }

  // Wait for settings to load before deciding whether to show chatbot
  if (settingsLoading) {
    return null;
  }

  // Hide chatbot if disabled (but keep component mounted to prevent flickering)
  if (!isChatbotEnabled) {
    return null;
  }

  // show nothing while tawk widget is active - it lives outside React UI
  if (showTawk) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        className={styles.chatbotToggle}
        onClick={() => setIsOpen(true)}
        aria-label="Open support chatbot"
      >
        💬
      </button>
    );
  }

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatbotHeader}>
        <h3>Echoverse Support</h3>
        <button
          className={styles.closeButton}
          onClick={() => setIsOpen(false)}
          aria-label="Close chatbot"
        >
          ✕
        </button>
      </div>

      <div className={styles.chatbotMessages}>
        {getDisplayMessages().map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${styles[message.type]}`}
          >
            {message.senderName && message.type !== 'bot' && (
              <div className={styles.senderName}>
                {message.senderName}
              </div>
            )}
            <div className={styles.messageContent}>{message.content}</div>
          </div>
        ))}
      </div>

      {currentStep === 'menu' && !adminChatting && (
        <div className={styles.compactMenu}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <>
              {/* Primary action: start a live conversation using internal chat system */}
              <button
                className={styles.startChatButton}
                onClick={() => {
                  // open external Tawk widget instead of internal chat
                  setShowTawk(true);
                  setIsOpen(false); // hide our own panel while the widget runs
                }}
              >
                <span style={{ fontSize: '20px' }}>💬</span>
                <span>Chat with Support Team</span>
              </button>

              {/* Built-in support only: show FAQ label and options directly */}

              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#666',
                marginBottom: '8px',
                paddingLeft: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Browse FAQs & Live Chat
              </div>

              {showFallback && (
                <div className={styles.fallbackSection}>
                  <p className={styles.fallbackTitle}>Unable to connect to live chat</p>
                  <button
                    className={styles.fallbackBtn}
                    onClick={() => {
                      setRetryCount(0);
                      setShowFallback(false);
                      // Re-trigger the chat with admin
                      const adminChatOption = Object.values(groupedOptions)
                        .flatMap((cat: any) => cat.items)
                        .find((opt: any) => opt.is_admin_chat);
                      if (adminChatOption) {
                        handleOptionClick(adminChatOption);
                      }
                    }}
                  >
                    🔄 Retry Live Chat
                  </button>
                  <button
                    className={styles.fallbackBtn}
                    onClick={() => {
                      window.location.href = '/contact';
                    }}
                  >
                    📧 Email Support
                  </button>
                  <button
                    className={styles.fallbackBtn}
                    onClick={() => {
                      setShowFallback(false);
                      setCurrentStep('menu');
                    }}
                  >
                    📋 Back to FAQ
                  </button>
                </div>
              )}
              <div className={styles.categoryList}>
                {Object.entries(groupedOptions).map(([catName, category]: [string, any]) => (
                  <div key={catName} className={styles.categoryItem}>
                    <button
                      className={styles.categoryButton}
                      onClick={() => handleCategoryClick(catName)}
                    >
                      <span className={styles.catIcon}>{category.icon}</span>
                      <span className={styles.catName}>{catName}</span>
                      <span className={styles.caretIcon}>
                        {expandedCategory === catName ? '▼' : '▶'}
                      </span>
                    </button>
                    {expandedCategory === catName && (
                      <div className={styles.categoryOptions}>
                        {category.items.map((option: any) => (
                          <button
                            key={option.id}
                            className={styles.quickOptionButton}
                            onClick={() => handleOptionClick(option)}
                          >
                            <span className={styles.optEmoji}>{option.emoji}</span>
                            <span className={styles.optTitle}>{option.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {currentStep === 'content' && selectedOption && !adminChatting && (
        <div className={styles.contentView}>
          <div className={styles.contentHeader}>
            <h3>{selectedOption.emoji} {selectedOption.chatbot_option_content?.title || selectedOption.title}</h3>
          </div>

          <div className={styles.contentBody}>
            {selectedOption.chatbot_option_content?.content && (
              <p className={styles.contentParagraph}>
                {selectedOption.chatbot_option_content.content}
              </p>
            )}

            {selectedOption.chatbot_option_content?.bullet_points && selectedOption.chatbot_option_content.bullet_points.length > 0 && (
              <ul className={styles.bulletPoints}>
                {selectedOption.chatbot_option_content.bullet_points.map((point: string, idx: number) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            )}

            {selectedOption.chatbot_option_content?.additional_info && (
              <div className={styles.additionalInfo}>
                <p><strong>💡 Note:</strong> {selectedOption.chatbot_option_content.additional_info}</p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedOption.title === 'Application' && (
              <button
                className={styles.actionButton}
                onClick={() => {
                  // Dispatch a custom event to open the application modal
                  window.dispatchEvent(new CustomEvent('openApplicationModal'));
                  setIsOpen(false);
                }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#ec4899',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#be185d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ec4899'}
              >
                📋 Fill Out Application Now
              </button>
            )}
            <button
              className={styles.backButton}
              onClick={handleGoBack}
            >
              ← Back to Menu
            </button>
          </div>
        </div>
      )}

      {currentStep === 'guest-info' && (
        <div className={styles.guestInfoContainer}>
          <div className={styles.guestInfoHeader}>
            <h3>Let us know who you are</h3>
            <p>Please provide your details so our team can assist you better</p>
          </div>

          <div className={styles.guestInfoForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Full Name *</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Enter your full name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isCreatingConversation) {
                    handleGuestInfoSubmit();
                  }
                }}
                disabled={isCreatingConversation}
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email (Optional)</label>
              <input
                type="email"
                className={styles.formInput}
                placeholder="Enter your email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isCreatingConversation) {
                    handleGuestInfoSubmit();
                  }
                }}
                disabled={isCreatingConversation}
              />
            </div>

            <button
              className={styles.submitButton}
              onClick={handleGuestInfoSubmit}
              disabled={isCreatingConversation || !guestName.trim()}
            >
              {isCreatingConversation ? '⏳ Connecting...' : 'Start Chat'}
            </button>
          </div>

          <button
            className={styles.backButton}
            onClick={handleGoBack}
            disabled={isCreatingConversation}
          >
            ← Back to Menu
          </button>
        </div>
      )}

      {currentStep === 'admin-chat' && (
        <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.messageInput}
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isCreatingConversation) {
                  handleSendMessage();
                }
              }}
              disabled={isCreatingConversation || !conversationId}
              autoFocus
            />
            <button
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={isCreatingConversation || !userMessage.trim() || !conversationId}
              title={!conversationId ? "Connecting to support..." : "Send message"}
            >
              {isCreatingConversation ? '⏳' : 'Send'}
            </button>
          </div>
          <button
            className={styles.backButton}
            onClick={handleGoBack}
            disabled={isCreatingConversation}
          >
            ← Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}
