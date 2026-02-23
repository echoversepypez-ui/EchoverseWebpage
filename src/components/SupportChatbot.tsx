'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useChatbotOptions } from '@/hooks/useChatbotOptions';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import styles from './SupportChatbot.module.css';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
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
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'menu' | 'category' | 'content' | 'admin-chat'>('menu');
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "How can I help? 👋",
      timestamp: new Date(),
    },
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [adminChatting, setAdminChatting] = useState(false);
  const [isChatbotEnabled, setIsChatbotEnabled] = useState(true);
  const prevEnabledRef = useRef<boolean>(true);

  // Check if on admin page
  const isAdminPage = pathname.startsWith('/admin');

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

    setMessages((prev) => [...prev, newMessage]);

    if (option.is_admin_chat) {
      // Switch to admin chat mode
      setCurrentStep('admin-chat');
      setAdminChatting(true);
      setSelectedOption(option);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content:
          'Connecting you to support... We\'ll assist you shortly.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } else {
      // Show detailed content
      setCurrentStep('content');
      setSelectedOption(option);
    }
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setUserMessage('');

    // Simulate admin response
    if (adminChatting) {
      setTimeout(() => {
        const adminResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content:
            'Thank you for your message. An admin will review this and get back to you as soon as possible. Is there anything else I can help you with?',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, adminResponse]);
      }, 500);
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${styles[message.type]}`}
          >
            {message.content}
          </div>
        ))}
      </div>

      {currentStep === 'menu' && !adminChatting && (
        <div className={styles.compactMenu}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
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

          <button
            className={styles.backButton}
            onClick={handleGoBack}
          >
            ← Back to Menu
          </button>
        </div>
      )}

      {currentStep === 'admin-chat' && adminChatting && (
        <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.messageInput}
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button
              className={styles.sendButton}
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
          <button
            className={styles.backButton}
            onClick={handleGoBack}
          >
            ← Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}
