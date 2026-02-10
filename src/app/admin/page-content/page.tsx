'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePageSections } from '@/hooks/usePageSections';
import { ProtectedRoute } from '@/components/protected-route';

type TabType = 'how_it_works' | 'requirements' | 'faq' | 'why_join';

export default function PageContentPage() {
  const { sections, loading, error, updateSection } = usePageSections();
  const [activeTab, setActiveTab] = useState<TabType>('how_it_works');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const section = sections.find((s) => s.section_name === activeTab);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!section) return;
    const newContent = { ...section };
    newContent.title = e.target.value;
    // Update local state immediately for better UX
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!section) return;
    const newContent = { ...section };
    newContent.subtitle = e.target.value;
  };

  const handleSave = async () => {
    if (!section) return;
    setSaving(true);
    setMessage(null);

    const success = await updateSection(activeTab, {
      title: section.title,
      subtitle: section.subtitle,
      content: section.content,
    });

    setSaving(false);
    if (success) {
      setMessage({ type: 'success', text: 'Changes saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to save changes. Please try again.' });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
        {/* Navigation */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/admin/dashboard" className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition">
              🎓 Echoverse Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-md"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Edit Page Content</h1>
            <p className="text-gray-600">Manage the content displayed on your home page sections</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-gray-300">
            {(['how_it_works', 'requirements', 'faq', 'why_join'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold border-b-2 transition ${
                  activeTab === tab
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-purple-600'
                }`}
              >
                {tab === 'how_it_works' && '📚 How It Works'}
                {tab === 'requirements' && '✅ Requirements'}
                {tab === 'faq' && '❓ FAQ'}
                {tab === 'why_join' && '🎯 Why Join'}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading section content...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-semibold">Error: {error}</p>
            </div>
          )}

          {/* Content Editor */}
          {!loading && section && (
            <div className="bg-white rounded-xl shadow-xl p-8 border border-purple-100">
              {/* Success/Error Message */}
              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg font-semibold ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* How It Works Section */}
              {activeTab === 'how_it_works' && (
                <HowItWorksEditor section={section} onUpdate={updateSection} setSaving={setSaving} setMessage={setMessage} />
              )}

              {/* Requirements Section */}
              {activeTab === 'requirements' && (
                <RequirementsEditor section={section} onUpdate={updateSection} setSaving={setSaving} setMessage={setMessage} />
              )}

              {/* FAQ Section */}
              {activeTab === 'faq' && (
                <FAQEditor section={section} onUpdate={updateSection} setSaving={setSaving} setMessage={setMessage} />
              )}

              {/* Why Join Section */}
              {activeTab === 'why_join' && (
                <WhyJoinEditor section={section} onUpdate={updateSection} setSaving={setSaving} setMessage={setMessage} />
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

// How It Works Editor Component
function HowItWorksEditor({
  section,
  onUpdate,
  setSaving,
  setMessage,
}: {
  section: any;
  onUpdate: (name: string, updates: any) => Promise<boolean>;
  setSaving: (s: boolean) => void;
  setMessage: (m: any) => void;
}) {
  const [localContent, setLocalContent] = useState(section.content);

  const handleStepChange = (index: number, field: string, value: string) => {
    const newSteps = [...localContent.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setLocalContent({ ...localContent, steps: newSteps });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const success = await onUpdate('how_it_works', {
      title: section.title,
      subtitle: section.subtitle,
      content: localContent,
    });
    setSaving(false);
    if (success) {
      setMessage({ type: 'success', text: 'How It Works section updated!' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">How It Works Steps</h2>

      <div className="space-y-6 mb-8">
        {localContent.steps?.map((step: any, i: number) => (
          <div key={i} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Step Number</label>
                <input
                  type="number"
                  value={step.number}
                  onChange={(e) => handleStepChange(i, 'number', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Title</label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleStepChange(i, 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Description</label>
              <textarea
                value={step.description}
                onChange={(e) => handleStepChange(i, 'description', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black resize-none"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition"
      >
        Save Changes
      </button>
    </div>
  );
}

// Requirements Editor Component
function RequirementsEditor({
  section,
  onUpdate,
  setSaving,
  setMessage,
}: {
  section: any;
  onUpdate: (name: string, updates: any) => Promise<boolean>;
  setSaving: (s: boolean) => void;
  setMessage: (m: any) => void;
}) {
  const [localContent, setLocalContent] = useState(section.content);

  const handleRequirementChange = (type: 'essential' | 'nice_to_have', index: number, field: string, value: string) => {
    const newContent = { ...localContent };
    newContent[type][index] = { ...newContent[type][index], [field]: value };
    setLocalContent(newContent);
  };

  const handleAddRequirement = (type: 'essential' | 'nice_to_have') => {
    const newContent = { ...localContent };
    newContent[type].push({ text: '', icon: type === 'essential' ? '✓' : '⭐' });
    setLocalContent(newContent);
  };

  const handleRemoveRequirement = (type: 'essential' | 'nice_to_have', index: number) => {
    const newContent = { ...localContent };
    newContent[type].splice(index, 1);
    setLocalContent(newContent);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const success = await onUpdate('requirements', {
      title: section.title,
      subtitle: section.subtitle,
      content: localContent,
    });
    setSaving(false);
    if (success) {
      setMessage({ type: 'success', text: 'Requirements section updated!' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Requirements & Eligibility</h2>

      {/* Essential Requirements */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Essential Requirements</h3>
        <div className="space-y-4 mb-4">
          {localContent.essential?.map((req: any, i: number) => (
            <div key={i} className="flex gap-4 items-start border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex-1">
                <input
                  type="text"
                  value={req.text}
                  onChange={(e) => handleRequirementChange('essential', i, 'text', e.target.value)}
                  placeholder="Requirement text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                />
              </div>
              <button
                onClick={() => handleRemoveRequirement('essential', i)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => handleAddRequirement('essential')}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          + Add Requirement
        </button>
      </div>

      {/* Nice to Have */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Nice to Have</h3>
        <div className="space-y-4 mb-4">
          {localContent.nice_to_have?.map((req: any, i: number) => (
            <div key={i} className="flex gap-4 items-start border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex-1">
                <input
                  type="text"
                  value={req.text}
                  onChange={(e) => handleRequirementChange('nice_to_have', i, 'text', e.target.value)}
                  placeholder="Nice to have text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                />
              </div>
              <button
                onClick={() => handleRemoveRequirement('nice_to_have', i)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => handleAddRequirement('nice_to_have')}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          + Add Item
        </button>
      </div>

      <button
        onClick={handleSave}
        className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition"
      >
        Save Changes
      </button>
    </div>
  );
}

// FAQ Editor Component
function FAQEditor({
  section,
  onUpdate,
  setSaving,
  setMessage,
}: {
  section: any;
  onUpdate: (name: string, updates: any) => Promise<boolean>;
  setSaving: (s: boolean) => void;
  setMessage: (m: any) => void;
}) {
  const [localContent, setLocalContent] = useState(section.content);

  const handleQuestionChange = (index: number, field: 'q' | 'a', value: string) => {
    const newQuestions = [...localContent.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setLocalContent({ ...localContent, questions: newQuestions });
  };

  const handleAddQuestion = () => {
    const newContent = { ...localContent };
    newContent.questions.push({ q: '', a: '' });
    setLocalContent(newContent);
  };

  const handleRemoveQuestion = (index: number) => {
    const newContent = { ...localContent };
    newContent.questions.splice(index, 1);
    setLocalContent(newContent);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const success = await onUpdate('faq', {
      title: section.title,
      subtitle: section.subtitle,
      content: localContent,
    });
    setSaving(false);
    if (success) {
      setMessage({ type: 'success', text: 'FAQ section updated!' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

      <div className="space-y-6 mb-8">
        {localContent.questions?.map((faq: any, i: number) => (
          <div key={i} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-black mb-2">Question</label>
              <input
                type="text"
                value={faq.q}
                onChange={(e) => handleQuestionChange(i, 'q', e.target.value)}
                placeholder="Enter question"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-black mb-2">Answer</label>
              <textarea
                value={faq.a}
                onChange={(e) => handleQuestionChange(i, 'a', e.target.value)}
                placeholder="Enter answer"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black resize-none"
              />
            </div>
            <button
              onClick={() => handleRemoveQuestion(i)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Remove Question
            </button>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <button
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          + Add Question
        </button>
      </div>

      <button
        onClick={handleSave}
        className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition"
      >
        Save Changes
      </button>
    </div>
  );
}

// Why Join Editor Component
function WhyJoinEditor({
  section,
  onUpdate,
  setSaving,
  setMessage,
}: {
  section: any;
  onUpdate: (name: string, updates: any) => Promise<boolean>;
  setSaving: (s: boolean) => void;
  setMessage: (m: any) => void;
}) {
  const [localContent, setLocalContent] = useState(section.content);

  const handleBenefitChange = (index: number, field: string, value: string) => {
    const newBenefits = [...localContent.benefits];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    setLocalContent({ ...localContent, benefits: newBenefits });
  };

  const handleAddBenefit = () => {
    const newContent = { ...localContent };
    newContent.benefits.push({ icon: '✨', title: '', description: '' });
    setLocalContent(newContent);
  };

  const handleRemoveBenefit = (index: number) => {
    const newContent = { ...localContent };
    newContent.benefits.splice(index, 1);
    setLocalContent(newContent);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const success = await onUpdate('why_join', {
      title: section.title,
      subtitle: section.subtitle,
      content: localContent,
    });
    setSaving(false);
    if (success) {
      setMessage({ type: 'success', text: 'Why Join section updated!' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Benefits</h2>

      <div className="space-y-6 mb-8">
        {localContent.benefits?.map((benefit: any, i: number) => (
          <div key={i} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Icon (emoji)</label>
                <input
                  type="text"
                  value={benefit.icon}
                  onChange={(e) => handleBenefitChange(i, 'icon', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black text-center text-2xl"
                  maxLength={2}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">Title</label>
                <input
                  type="text"
                  value={benefit.title}
                  onChange={(e) => handleBenefitChange(i, 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-black mb-2">Description</label>
              <textarea
                value={benefit.description}
                onChange={(e) => handleBenefitChange(i, 'description', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black resize-none"
              />
            </div>
            <button
              onClick={() => handleRemoveBenefit(i)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Remove Benefit
            </button>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <button
          onClick={handleAddBenefit}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          + Add Benefit
        </button>
      </div>

      <button
        onClick={handleSave}
        className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition"
      >
        Save Changes
      </button>
    </div>
  );
}
