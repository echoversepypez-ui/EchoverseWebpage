'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { FormField, FormContainer } from '@/components/FormComponents';
import { validateContactForm, ValidationError } from '@/lib/validation';
import { Footer } from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<ValidationError>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate form
    const formErrors = validateContactForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (!supabase) {
        throw new Error('Service unavailable');
      }

      const { error } = await supabase.from('contacts').insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          status: 'new',
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setServerError('Failed to send message. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Enhanced Header */}
      <section className="bg-linear-to-br from-purple-600 via-purple-700 to-pink-600 text-white py-20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -ml-36 -mb-36"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-6xl font-bold mb-4 tracking-tight">Get In Touch</h1>
          <p className="text-xl text-purple-100 mb-3">We're here to help! Reach out with any questions or inquiries.</p>
          <div className="flex justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>Fast Response Time</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🌍</span>
              <span>Global Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✨</span>
              <span>Friendly Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards - Improved */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {[
            { icon: '🏢', title: 'Location', content: '3rd Floor, Gian\'s Enterprises - Main Branch\nPWWV+X33\nC.O. Zaldivar Street\nSan Jose de Buenavista, Antique\nPhilippines', link: null },
            { icon: '✉️', title: 'Email', content: 'support@echoverse.com', link: 'mailto:support@echoverse.com' },
            { icon: '📱', title: 'Phone', content: '+1 (555) 123-4567', link: 'tel:+15551234567' },
            { icon: '💬', title: 'Response Time', content: 'Usually replies within\n24 hours\n\nAvailable 24/7', link: null },
          ].map((info, i) => {
            const isClickable = info.link !== null;
            return (
              <div 
                key={i} 
                className={`p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 ${
                  isClickable ? 'cursor-pointer group' : ''
                }`}
              >
                <p className="text-5xl mb-4 group-hover:scale-110 transition-transform">{info.icon}</p>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{info.title}</h3>
                {info.link ? (
                  <a 
                    href={info.link}
                    className="text-purple-600 hover:text-pink-600 whitespace-pre-line text-sm font-semibold transition group-hover:underline"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">{info.content}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Contact Section */}
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Contact Form - Takes up 2 columns */}
          <div className="md:col-span-2">
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Send us a Message</h2>
              <p className="text-gray-600">Tell us what's on your mind. We'll get back to you as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-2xl border border-gray-100 shadow-lg">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-semibold text-gray-900 mb-2 text-sm">Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="Your Name" 
                    className={`w-full border-2 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none transition ${
                      errors.name ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-purple-600'
                    }`}
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">❌ {errors.name}</p>}
                </div>
                <div>
                  <label className="block font-semibold text-gray-900 mb-2 text-sm">Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="your@email.com" 
                    className={`w-full border-2 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none transition ${
                      errors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-purple-600'
                    }`}
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">❌ {errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-semibold text-gray-900 mb-2 text-sm">Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="+1 (555) 000-0000" 
                    className={`w-full border-2 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none transition ${
                      errors.phone ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-purple-600'
                    }`}
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-1">❌ {errors.phone}</p>}
                </div>
                <div>
                  <label className="block font-semibold text-gray-900 mb-2 text-sm">Subject *</label>
                  <select 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required 
                    className={`w-full border-2 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none transition ${
                      errors.subject ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-purple-600'
                    }`}
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Teaching Opportunities">Teaching Opportunities</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.subject && <p className="text-red-600 text-xs mt-1">❌ {errors.subject}</p>}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-2 text-sm">Message *</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  rows={4} 
                  placeholder="Tell us about your inquiry or concern..." 
                  className={`w-full border-2 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none transition resize-none ${
                    errors.message ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-purple-600'
                  }`}
                ></textarea>
                {errors.message && <p className="text-red-600 text-xs mt-1">❌ {errors.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 shadow-lg"
              >
                {loading ? '⏳ Sending...' : '✉️ Send Message'}
              </button>

              {submitted && (
                <div className="bg-green-50 border-2 border-green-300 text-green-800 px-4 py-3 rounded-lg font-semibold flex items-center gap-2 animate-pulse">
                  ✓ Message sent successfully! We'll be in touch within 24 hours.
                </div>
              )}
              {serverError && (
                <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg font-semibold flex items-center gap-2">
                  ✗ {serverError}
                </div>
              )}
            </form>
          </div>

          {/* Why Contact Us Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Contact Us?</h2>
            <div className="space-y-4">
              {[
                { icon: '🎯', title: 'Teaching Opportunities', desc: 'Learn about ESL positions' },
                { icon: '💰', title: 'Earnings Info', desc: 'Rates & schedules' },
                { icon: '⏰', title: 'Flexible Schedule', desc: 'How we work' },
                { icon: '👥', title: 'Support Team', desc: 'Professional help' },
                { icon: '📈', title: 'Career Growth', desc: 'Advance your career' },
                { icon: '🌍', title: 'Global Network', desc: 'Worldwide educators' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition">
                  <p className="text-3xl shrink-0">{item.icon}</p>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                    <p className="text-gray-600 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="bg-linear-to-r from-purple-900 via-purple-800 to-pink-900 text-white py-16 mt-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Teaching with Echoverse?</h2>
          <p className="text-lg text-purple-100 mb-8">Explore available ESL teaching opportunities and join our global educator community today!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/teachers-profile" className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition shadow-lg hover:shadow-xl transform hover:scale-105">
              🚀 View Opportunities
            </Link>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-purple-600 transition">
              ↑ Back to Form
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
