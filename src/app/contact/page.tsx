'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Navigation } from '@/components/Navigation';
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <div className="min-h-screen bg-white">
      <Navigation activeLink="contact" />

      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-300">We&apos;re here to help! Reach out with any questions.</p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {[
            { icon: '📍', title: 'Location', content: '3rd Floor, Gian\'s Enterprises\nC.O. Zaldivar Street\nSan Jose de Buenavista, Antique' },
            { icon: '✉️', title: 'Email', content: 'support@echoverse.com' },
            { icon: '📱', title: 'Phone', content: '+1 (555) 123-4567' },
            { icon: '💬', title: 'Live Chat', content: 'Available 24/7' },
          ].map((info, i) => (
            <div key={i} className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-gray-200 rounded-xl text-center hover:border-purple-500 hover:shadow-lg transition-all">
              <p className="text-4xl mb-3">{info.icon}</p>
              <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-gray-600 whitespace-pre-line text-sm">{info.content}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your Name" className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition" />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition" />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition" />
              </div>
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Subject *</label>
                <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition">
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Teaching Opportunities">Teaching Opportunities</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Partnership">Partnership</option>
                </select>
                {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label className="block font-semibold text-gray-900 mb-2">Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Your message..." className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition resize-none"></textarea>
                {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105">
                {loading ? 'Sending...' : '→ Send Message'}
              </button>
              {submitted && <div className="bg-green-50 border-2 border-green-600 text-green-700 px-4 py-3 rounded-lg font-semibold">✓ Message sent successfully! We&apos;ll be in touch soon.</div>}
              {serverError && <div className="bg-red-50 border-2 border-red-600 text-red-700 px-4 py-3 rounded-lg font-semibold">✗ {serverError}</div>}
            </form>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-black mb-8">Why Contact Us?</h2>
            <div className="space-y-6">
              {[
                { icon: '🎯', title: 'Teaching Opportunities', desc: 'Learn about available ESL teaching positions' },
                { icon: '💰', title: 'Earnings Info', desc: 'Find out about rates and payment schedules' },
                { icon: '⏰', title: 'Flexible Schedule', desc: 'Understand how flexible our work arrangements are' },
                { icon: '👥', title: 'Support Team', desc: 'Get help from our professional support team' },
                { icon: '📈', title: 'Career Growth', desc: 'Explore advancement opportunities' },
                { icon: '🌍', title: 'International Network', desc: 'Connect with educators worldwide' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <p className="text-3xl">{item.icon}</p>
                  <div>
                    <h3 className="font-bold text-black">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-black mb-8">Our Location</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3872.8957476428743!2d122.19827!3d11.27619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sEchoverse%20Tutorial%20Online%20Services!2sC.O.%20Zaldivar%20St%2C%20San%20Jose%20de%20Buenavista%2C%20Antique!5e0!3m2!1sen!2sph!4v1706856000000"
            width="100%"
            height="400"
            style={{ border: '2px solid #ccc', borderRadius: '8px' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Teaching?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Browse our available teaching opportunities and apply today!</p>
          <Link href="/courses" className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
            View Opportunities →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
