'use client';

import { useState } from 'react';

interface WhatWeOfferEditorProps {
  section: any;
  onUpdate: (name: string, updates: any) => Promise<boolean>;
  setSaving: (s: boolean) => void;
  setMessage: (m: any) => void;
}

export function WhatWeOfferEditor({
  section,
  onUpdate,
  setSaving,
  setMessage,
}: WhatWeOfferEditorProps) {
  const [localContent, setLocalContent] = useState(section.content);
  const [isLoading, setIsLoading] = useState(false);

  const handleCardChange = (index: number, field: string, value: string) => {
    const newCards = [...localContent.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setLocalContent({ ...localContent, cards: newCards });
  };

  const handleAddCard = () => {
    const newContent = { ...localContent };
    newContent.cards.push({ icon: '✨', title: '', description: '' });
    setLocalContent(newContent);
  };

  const handleRemoveCard = (index: number) => {
    const newContent = { ...localContent };
    newContent.cards.splice(index, 1);
    setLocalContent(newContent);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaving(true);
    setMessage(null);
    
    try {
      console.log('Saving What We Offer with content:', localContent);
      const success = await onUpdate('what_we_offer', {
        title: section.title,
        subtitle: section.subtitle,
        content: localContent,
      });
      setSaving(false);
      setIsLoading(false);
      if (success) {
        setMessage({ type: 'success', text: '✅ What We Offer section updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: '❌ Failed to save changes. Please check your browser console for details.' });
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaving(false);
      setIsLoading(false);
      setMessage({ type: 'error', text: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">What We Offer Cards</h2>

      <div className="space-y-6 mb-8">
        {localContent.cards?.map((card: any, i: number) => (
          <div key={i} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Icon (emoji)</label>
                <input
                  type="text"
                  value={card.icon}
                  onChange={(e) => handleCardChange(i, 'icon', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black text-center text-2xl"
                  maxLength={2}
                  disabled={isLoading}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">Title</label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => handleCardChange(i, 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-black mb-2">Description</label>
              <textarea
                value={card.description}
                onChange={(e) => handleCardChange(i, 'description', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black resize-none"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => handleRemoveCard(i)}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-lg font-semibold transition ${
                isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Remove Card
            </button>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <button
          onClick={handleAddCard}
          disabled={isLoading}
          className={`px-4 py-2 text-white rounded-lg font-semibold transition ${
            isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          + Add Card
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={isLoading}
        className={`${
          isLoading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-black hover:bg-gray-800'
        } text-white px-8 py-3 rounded-lg font-bold transition`}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
