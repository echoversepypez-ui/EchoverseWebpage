'use client';

import { useState, useEffect } from 'react';
import { useChatbotOptions } from '@/hooks/useChatbotOptions';
import styles from './SupportChatbot.module.css';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

export function SupportChatbot() {
  const { options, loading } = useChatbotOptions();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'menu' | 'content' | 'admin-chat'>('menu');
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Welcome to Echoverse! I'm here to help you start your ESL teaching journey. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [adminChatting, setAdminChatting] = useState(false);

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
          'Connecting you to an admin... One of our team members will be with you shortly to help with your inquiry.',
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
    setMessages([
      {
        id: Math.random().toString(),
        type: 'bot',
        content: "Let's start fresh! What can I help you with today?",
        timestamp: new Date(),
      },
    ]);
  };

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
        <div className={styles.headerContent}>
          <h3>Echoverse Support</h3>
          <p>Ask me anything! 👋</p>
        </div>
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
        <div className={styles.optionsGrid}>
          {loading ? (
            <div className={styles.loading}>Loading options...</div>
          ) : (
            options.map((option) => (
              <button
                key={option.id}
                className={styles.optionButton}
                onClick={() => handleOptionClick(option)}
              >
                <span className={styles.emoji}>{option.emoji}</span>
                <span className={styles.title}>{option.title}</span>
              </button>
            ))
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
