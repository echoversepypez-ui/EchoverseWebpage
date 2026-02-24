'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePageSections } from '@/hooks/usePageSections';
import { useTestimonials } from '@/hooks/useTestimonials';
import { ProtectedRoute } from '@/components/protected-route';

type TabType = 'how_it_works' | 'requirements' | 'faq' | 'why_join' | 'testimonials';

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
            {(['how_it_works', 'requirements', 'faq', 'why_join', 'testimonials'] as TabType[]).map((tab) => (
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
                {tab === 'testimonials' && '💬 Testimonials'}
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

              {/* Testimonials Section */}
              {activeTab === 'testimonials' && (
                <TestimonialsEditor section={section} onUpdate={updateSection} setSaving={setSaving} setMessage={setMessage} />
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

// Testimonials Editor Component
function TestimonialsEditor({
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
  const { testimonials, loading, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({});
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    duration: '',
    rating: 5,
    quote: '',
  });

  const validateTestimonial = (testimonial: any): string[] => {
    const errors: string[] = [];
    
    if (!testimonial.name || testimonial.name.trim() === '') {
      errors.push('Name is required');
    }
    if (!testimonial.role || testimonial.role.trim() === '') {
      errors.push('Role is required');
    }
    if (!testimonial.duration || testimonial.duration.trim() === '') {
      errors.push('Duration is required');
    }
    if (!testimonial.quote || testimonial.quote.trim() === '') {
      errors.push('Quote is required');
    }
    if (!testimonial.rating || testimonial.rating < 1 || testimonial.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }
    
    return errors;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      duration: '',
      rating: 5,
      quote: '',
    });
    setEditingId(null);
    setValidationErrors({});
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors({});
  };

  const handleAddTestimonial = async () => {
    const errors = validateTestimonial(formData);
    if (errors.length > 0) {
      setValidationErrors({ new: errors });
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const result = await addTestimonial({
      name: formData.name,
      role: formData.role,
      duration: formData.duration,
      quote: formData.quote,
      rating: formData.rating,
      display_order: 0, // Will be auto-assigned by hook
      is_active: true,
    });

    setSaving(false);

    if (result) {
      setMessage({ type: 'success', text: '✅ Testimonial added successfully!' });
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to add testimonial. Please try again.' });
    }
  };

  const handleUpdateTestimonial = async (id: string) => {
    const errors = validateTestimonial(formData);
    if (errors.length > 0) {
      setValidationErrors({ [id]: errors });
      setMessage({ type: 'error', text: 'Please fix validation errors.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const success = await updateTestimonial(id, {
      name: formData.name,
      role: formData.role,
      duration: formData.duration,
      quote: formData.quote,
      rating: formData.rating,
    });

    setSaving(false);

    if (success) {
      setMessage({ type: 'success', text: '✏️ Testimonial updated successfully!' });
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to update testimonial.' });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    setSaving(true);
    setMessage(null);

    const success = await deleteTestimonial(id);

    setSaving(false);

    if (success) {
      setMessage({ type: 'success', text: '🗑️ Testimonial deleted successfully!' });
      setEditingId(null);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to delete testimonial.' });
    }
  };

  const handleEditTestimonial = (testimonial: any) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      duration: testimonial.duration,
      quote: testimonial.quote,
      rating: testimonial.rating,
    });
    setValidationErrors({});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Testimonials</h2>
          <p className="text-gray-600">Manage teacher testimonials displayed on the homepage</p>
        </div>
        <div className="bg-linear-to-r from-purple-100 to-pink-100 rounded-lg px-4 py-2">
          <p className="text-sm font-semibold text-purple-900">Total: {testimonials?.length || 0} testimonials</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Loading testimonials...</p>
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="bg-linear-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-8 mb-8">
        <h3 className="text-2xl font-bold mb-6">
          {editingId ? '✏️ Edit Testimonial' : '➕ Add New Testimonial'}
        </h3>

        {/* Validation Errors */}
        {validationErrors.new && validationErrors.new.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <p className="text-sm font-semibold text-red-700 mb-2">⚠️ Validation Errors:</p>
            <ul className="text-sm text-red-600 list-disc list-inside">
              {validationErrors.new.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">👤 Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="e.g. Maria Santos"
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">💼 Role *</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => handleFormChange('role', e.target.value)}
                placeholder="e.g. Full-time Teacher"
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">⏱️ Duration *</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleFormChange('duration', e.target.value)}
                placeholder="e.g. 6 months in"
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">⭐ Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={`form-star-${star}`}
                  onClick={() => handleFormChange('rating', star)}
                  className={`text-3xl px-2 py-1 rounded transition ${
                    star <= formData.rating
                      ? 'bg-yellow-100 scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">💬 Testimonial Quote *</label>
            <textarea
              value={formData.quote}
              onChange={(e) => handleFormChange('quote', e.target.value)}
              placeholder="Enter the testimonial quote..."
              rows={4}
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.quote.length}/300 characters</p>
          </div>

          {/* Form Preview */}
          <div className="mt-6 pt-4 border-t-2 border-purple-200">
            <p className="text-xs font-semibold text-gray-600 mb-3">📋 Preview:</p>
            <div className="bg-white p-4 rounded-lg border border-purple-300">
              <div className="flex gap-1 mb-2">
                {[...Array(formData.rating)].map((_, idx) => (
                  <span key={`preview-st-${idx}`} className="text-lg">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 italic mb-2">"{formData.quote || '(Quote preview)'}"</p>
              <p className="font-semibold text-gray-900 text-sm">{formData.name || '(Name)'}</p>
              <p className="text-purple-600 text-xs font-semibold">{formData.role || '(Role)'} • {formData.duration || '(Duration)'}</p>
            </div>
          </div>
        </div>

        {/* Form Buttons */}
        <div className="flex gap-3 mt-6">
          {editingId ? (
            <>
              <button
                onClick={() => handleUpdateTestimonial(editingId)}
                className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
              >
                ✏️ Update Testimonial
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAddTestimonial}
              className="flex-1 px-6 py-3 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition shadow-md"
            >
              ➕ Add Testimonial
            </button>
          )}
        </div>
      </div>

      {/* Testimonials List */}
      {!loading && (
        <>
          {testimonials && testimonials.length > 0 ? (
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Existing Testimonials ({testimonials.length})</h3>
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className={`bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${
                    editingId === testimonial.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {testimonials.indexOf(testimonial) + 1}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order: {testimonial.display_order}</p>
                        <p className="font-semibold text-gray-900 text-lg">{testimonial.name}</p>
                        <p className="text-purple-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{'⭐'.repeat(testimonial.rating)}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 italic mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    "{testimonial.quote}"
                  </p>

                  <p className="text-sm text-gray-500 mb-4">
                    ⏱️ {testimonial.duration} • Updated: {new Date(testimonial.updated_at).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTestimonial(testimonial)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                        editingId === testimonial.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-600 border border-blue-300 hover:bg-blue-100'
                      }`}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-600 border border-red-300 rounded-lg font-semibold hover:bg-red-100 hover:border-red-400 transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mb-8">
              <p className="text-gray-600 text-lg">No testimonials yet. Add your first one above!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
