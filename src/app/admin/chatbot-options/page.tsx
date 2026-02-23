'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useChatbotOptions } from '@/hooks/useChatbotOptions';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { ProtectedRoute } from '@/components/protected-route';

interface ChatbotOption {
  id: string;
  title: string;
  emoji: string;
  description: string;
  is_admin_chat: boolean;
  order_index: number;
  is_active: boolean;
  chatbot_option_content?: {
    title?: string;
    content?: string;
    bullet_points?: string[];
    additional_info?: string;
  };
}

export default function ChatbotOptionsPage() {
  const { options, loading, error, createOption, updateOption, deleteOption, toggleActive, updateOptionContent } = useChatbotOptions();
  const { getBooleanSetting, toggleBooleanSetting, loading: settingsLoading } = useSystemSettings();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [togglingChatbot, setTogglingChatbot] = useState(false);
  const [isChatbotEnabled, setIsChatbotEnabled] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    emoji: '',
    description: '',
    is_admin_chat: false,
  });

  const [contentFormData, setContentFormData] = useState({
    title: '',
    content: '',
    bullet_points: '',
    additional_info: '',
  });

  // Load chatbot enabled status
  const handleLoadChatbotStatus = () => {
    if (!settingsLoading) {
      const enabled = getBooleanSetting('chatbot_enabled');
      setIsChatbotEnabled(enabled);
    }
  };

  // Toggle chatbot system enabled/disabled
  const handleToggleChatbot = async () => {
    setTogglingChatbot(true);
    const result = await toggleBooleanSetting('chatbot_enabled');
    if (result.success && result.newValue !== undefined) {
      setIsChatbotEnabled(result.newValue);
      setMessage({
        type: 'success',
        text: `Chatbot system has been ${result.newValue ? 'enabled' : 'disabled'} successfully!`,
      });
    } else {
      setMessage({
        type: 'error',
        text: result.error || 'Failed to toggle chatbot system',
      });
    }
    setTogglingChatbot(false);
  };

  const handleAddNew = () => {
    setFormData({ title: '', emoji: '', description: '', is_admin_chat: false });
    setEditingId(null);
    setIsAddingNew(true);
  };

  const handleEdit = (option: ChatbotOption) => {
    setFormData({
      title: option.title,
      emoji: option.emoji,
      description: option.description,
      is_admin_chat: option.is_admin_chat,
    });
    setEditingId(option.id);
    setIsAddingNew(false);
  };

  const handleEditContent = (option: ChatbotOption) => {
    const content = option.chatbot_option_content;
    setContentFormData({
      title: content?.title || option.title,
      content: content?.content || '',
      bullet_points: content?.bullet_points ? content.bullet_points.join('\n') : '',
      additional_info: content?.additional_info || '',
    });
    setEditingContentId(option.id);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({ title: '', emoji: '', description: '', is_admin_chat: false });
  };

  const handleCancelContent = () => {
    setEditingContentId(null);
    setContentFormData({
      title: '',
      content: '',
      bullet_points: '',
      additional_info: '',
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.emoji.trim()) {
      setMessage({ type: 'error', text: 'Title and emoji are required' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      if (isAddingNew) {
        const maxOrder = Math.max(...options.map((o) => o.order_index), 0);
        const result = await createOption({
          title: formData.title,
          emoji: formData.emoji,
          description: formData.description,
          is_admin_chat: formData.is_admin_chat,
          order_index: maxOrder + 1,
          is_active: true,
        });

        if (result.success) {
          setMessage({ type: 'success', text: 'Chatbot option created successfully!' });
          setIsAddingNew(false);
          setFormData({ title: '', emoji: '', description: '', is_admin_chat: false });
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to create option' });
        }
      } else if (editingId) {
        const result = await updateOption(editingId, {
          title: formData.title,
          emoji: formData.emoji,
          description: formData.description,
          is_admin_chat: formData.is_admin_chat,
        });

        if (result.success) {
          setMessage({ type: 'success', text: 'Chatbot option updated successfully!' });
          setEditingId(null);
          setFormData({ title: '', emoji: '', description: '', is_admin_chat: false });
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to update option' });
        }
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContent = async () => {
    if (!contentFormData.title.trim() || !contentFormData.content.trim()) {
      setMessage({ type: 'error', text: 'Title and content are required' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const bulletPoints = contentFormData.bullet_points
        .split('\n')
        .map((point) => point.trim())
        .filter((point) => point.length > 0);

      const result = await updateOptionContent(editingContentId!, {
        title: contentFormData.title,
        content: contentFormData.content,
        bullet_points: bulletPoints,
        additional_info: contentFormData.additional_info,
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Content updated successfully!' });
        setEditingContentId(null);
        setContentFormData({
          title: '',
          content: '',
          bullet_points: '',
          additional_info: '',
        });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update content' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this option?')) {
      setSaving(true);
      const result = await deleteOption(id);
      if (result.success) {
        setMessage({ type: 'success', text: 'Chatbot option deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete option' });
      }
      setSaving(false);
    }
  };

  const handleToggleActive = async (option: ChatbotOption) => {
    setSaving(true);
    const result = await toggleActive(option.id, option.is_active);
    if (result.success) {
      setMessage({
        type: 'success',
        text: `Option ${!option.is_active ? 'activated' : 'deactivated'} successfully!`,
      });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update option' });
    }
    setSaving(false);
  };

  return (
    <ProtectedRoute>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px' }}>
        <div style={{ marginBottom: '12px' }}>
          <Link href="/admin/dashboard">← Back to Dashboard</Link>
        </div>

        {/* System Status Control */}
        {!settingsLoading && (
          <div
            style={{
              background: 'white',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>
                💬 Chatbot System Status
              </h3>
              <p style={{ margin: '0', fontSize: '13px', color: '#64748b' }}>
                Enable or disable the support chatbot for all users
              </p>
            </div>
            <button
              onClick={handleToggleChatbot}
              onMouseEnter={handleLoadChatbotStatus}
              disabled={togglingChatbot}
              style={{
                padding: '8px 16px',
                backgroundColor: isChatbotEnabled ? '#10b981' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: togglingChatbot ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                opacity: togglingChatbot ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}
              title={isChatbotEnabled ? 'Click to disable chatbot' : 'Click to enable chatbot'}
            >
              {togglingChatbot ? 'Updating...' : (isChatbotEnabled ? '✓ ENABLED' : '✕ DISABLED')}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1>Support Chatbot Options</h1>
          {!isAddingNew && !editingId && !editingContentId && (
            <button
              onClick={handleAddNew}
              style={{
                padding: '10px 20px',
                backgroundColor: '#9333ea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              + Add New Option
            </button>
          )}
        </div>

        {message && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              marginBottom: '12px',
              backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: message.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${message.type === 'success' ? '#86efac' : '#fca5a5'}`,
            }}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading chatbot options...</div>
        ) : error ? (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #fca5a5',
            }}
          >
            Error: {error}
          </div>
        ) : (
          <>
            {/* Option Form */}
            {isAddingNew || editingId ? (
              <div
                style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <h2 style={{ marginTop: 0, marginBottom: '12px', fontSize: '16px' }}>
                  {isAddingNew ? 'Create New Chatbot Option' : 'Edit Chatbot Option'}
                </h2>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Payment & Earnings"
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px' }}>
                    Emoji
                  </label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    placeholder="e.g., 💰🔒"
                    maxLength={10}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of what this option is about"
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      fontSize: '13px',
                      minHeight: '60px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_admin_chat}
                      onChange={(e) => setFormData({ ...formData, is_admin_chat: e.target.checked })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Direct chat with admin?</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#9333ea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: '500',
                      fontSize: '13px',
                      opacity: saving ? 0.6 : 1,
                    }}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#e2e8f0',
                      color: '#1e293b',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '13px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}

            {/* Content Form */}
            {editingContentId ? (
              <div
                style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f0f9ff',
                }}
              >
                <h2 style={{ marginTop: 0, marginBottom: '12px', fontSize: '16px' }}>
                  Edit Detailed Content
                </h2>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px' }}>
                    Content Title
                  </label>
                  <input
                    type="text"
                    value={contentFormData.title}
                    onChange={(e) => setContentFormData({ ...contentFormData, title: e.target.value })}
                    placeholder="e.g., Payment & Earnings Overview"
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      border: '1px solid #bfdbfe',
                      borderRadius: '4px',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px' }}>
                    Main Content (Paragraph)
                  </label>
                  <textarea
                    value={contentFormData.content}
                    onChange={(e) => setContentFormData({ ...contentFormData, content: e.target.value })}
                    placeholder="Write the main content that will appear first..."
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      border: '1px solid #bfdbfe',
                      borderRadius: '4px',
                      fontSize: '13px',
                      minHeight: '80px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px' }}>
                    Bullet Points (One per line)
                  </label>
                  <textarea
                    value={contentFormData.bullet_points}
                    onChange={(e) => setContentFormData({ ...contentFormData, bullet_points: e.target.value })}
                    placeholder="Competitive Rates: $15-25+ per hour&#10;Weekly/Monthly payments&#10;Direct bank transfer or PayPal"
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      border: '1px solid #bfdbfe',
                      borderRadius: '4px',
                      fontSize: '13px',
                      minHeight: '70px',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box',
                    }}
                  />
                  <small style={{ color: '#64748b', marginTop: '2px', display: 'block', fontSize: '11px' }}>
                    Each line will become a bullet point
                  </small>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '13px' }}>
                    Additional Info / Tips
                  </label>
                  <textarea
                    value={contentFormData.additional_info}
                    onChange={(e) => setContentFormData({ ...contentFormData, additional_info: e.target.value })}
                    placeholder="Optional: Add a tip or additional information that appears at the bottom..."
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      border: '1px solid #bfdbfe',
                      borderRadius: '4px',
                      fontSize: '13px',
                      minHeight: '60px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleSaveContent}
                    disabled={saving}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#0284c7',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: '500',
                      fontSize: '13px',
                      opacity: saving ? 0.6 : 1,
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Content'}
                  </button>
                  <button
                    onClick={handleCancelContent}
                    disabled={saving}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#e2e8f0',
                      color: '#1e293b',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '13px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}

            {/* Options Table */}
            <div
              style={{
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '12px',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '600', fontSize: '11px' }}>Order</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '600', fontSize: '11px' }}>Emoji</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '600', fontSize: '11px' }}>Title</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '600', fontSize: '11px' }}>Description</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '600', fontSize: '11px' }}>Admin</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '600', fontSize: '11px' }}>Status</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: '600', fontSize: '11px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {options.map((option) => (
                    <tr
                      key={option.id}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <td style={{ padding: '6px 8px' }}>{option.order_index}</td>
                      <td style={{ padding: '6px 8px', fontSize: '14px' }}>{option.emoji}</td>
                      <td style={{ padding: '6px 8px', fontWeight: '500', fontSize: '12px' }}>{option.title}</td>
                      <td style={{ padding: '6px 8px', color: '#64748b', fontSize: '11px' }}>
                        {option.description ? option.description.substring(0, 25) + (option.description.length > 25 ? '...' : '') : '-'}
                      </td>
                      <td style={{ padding: '6px 8px', fontSize: '11px' }}>
                        {option.is_admin_chat ? '✓' : '✗'}
                      </td>
                      <td style={{ padding: '6px 8px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 6px',
                            borderRadius: '3px',
                            fontSize: '10px',
                            fontWeight: '500',
                            backgroundColor: option.is_active ? '#dcfce7' : '#fee2e2',
                            color: option.is_active ? '#166534' : '#991b1b',
                          }}
                        >
                          {option.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleEditContent(option)}
                          style={{
                            padding: '3px 6px',
                            marginRight: '2px',
                            backgroundColor: '#dbeafe',
                            color: '#0284c7',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '10px',
                            fontWeight: '500',
                          }}
                          title="Edit content"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleEdit(option)}
                          style={{
                            padding: '3px 6px',
                            marginRight: '2px',
                            backgroundColor: '#e0e7ff',
                            color: '#4f46e5',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '10px',
                          }}
                        >
                          Opts
                        </button>
                        <button
                          onClick={() => handleToggleActive(option)}
                          disabled={saving}
                          style={{
                            padding: '3px 6px',
                            marginRight: '2px',
                            backgroundColor: option.is_active ? '#fecaca' : '#a7f3d0',
                            color: option.is_active ? '#7f1d1d' : '#065f46',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontSize: '10px',
                            opacity: saving ? 0.6 : 1,
                          }}
                        >
                          {option.is_active ? '◉' : '◯'}
                        </button>
                        <button
                          onClick={() => handleDelete(option.id)}
                          disabled={saving}
                          style={{
                            padding: '3px 6px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontSize: '10px',
                            opacity: saving ? 0.6 : 1,
                          }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {options.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '13px' }}>
                No chatbot options found. Create one to get started!
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
