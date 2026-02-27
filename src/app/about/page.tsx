'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { BenefitCard } from '@/components/BenefitCard';
import { Footer } from '@/components/Footer';
import { useAdminProfiles, useTeachersProfiles, useStaffProfiles } from '@/hooks/useProfileManagement';

export default function AboutPage() {
  const admins = useAdminProfiles();
  const teachers = useTeachersProfiles();
  const staff = useStaffProfiles();
  const [isClient, setIsClient] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate total active team members
  const totalTeamMembers = teachers.data.length + admins.data.length + staff.data.length;
  const totalLessonsDelivered = (teachers.data.reduce((sum, t) => sum + (t.lessons_completed || 0), 0)) || 0;
  const averageRating = teachers.data.length > 0 
    ? (teachers.data.reduce((sum, t) => sum + (t.rating || 0), 0) / teachers.data.length).toFixed(1)
    : '4.9';

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">About Echoverse</h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            We're on a mission to connect passionate ESL educators with international students, creating opportunities for flexible income and meaningful work.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Echoverse is an ESL teaching platform based in Antique, Philippines, dedicated to connecting qualified English teachers with students across Asia.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">What We Do</h3>
              <p className="text-gray-700 leading-relaxed">
                We provide flexible, high-paying teaching opportunities for part-time workers, students, and full-time educators looking to earn competitive income while helping international students improve their English skills.
              </p>
            </div>
            <div className="space-y-3">
              {['Fair pay for quality work', 'Flexible scheduling on your terms', '24/7 professional support', 'International student community', 'Career growth opportunities'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-2xl text-purple-600">✓</span>
                  <span className="text-gray-700 font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-6">
            <StatsCard icon="👥" number={`${totalTeamMembers}+`} label="Active Educators" />
            <StatsCard icon="👨‍🎓" number={`${totalLessonsDelivered}+`} label="Lessons Delivered" />
            <StatsCard icon="🌍" number="8+" label="Countries Served" />
            <StatsCard icon="⭐" number={`${averageRating}/5`} label="Average Rating" />
          </div>
        </div>
      </section>

      <section className="bg-linear-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center mb-16">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {admins.loading ? (
              <div className="col-span-full text-center py-12 text-gray-600">Loading team members...</div>
            ) : admins.error ? (
              <div className="col-span-full text-center py-12 text-red-600">Error loading team: {admins.error}</div>
            ) : admins.data.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl">No team members available</div>
            ) : (
              admins.data.map((member) => (
                <div key={member.id} className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition duration-300">👤</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="font-semibold text-purple-600 mb-4">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.bio || member.story || 'Team member'}</p>
                  {member.department && (
                    <p className="text-sm text-gray-500 mt-3">📍 {member.department}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center mb-16">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '💰', title: 'Fair Compensation', description: 'We believe educators deserve competitive compensation for their expertise and dedication.' },
            { icon: '⏰', title: 'Work Flexibility', description: 'Work on your own schedule and choose opportunities that fit your lifestyle perfectly.' },
            { icon: '🤝', title: 'Quality Support', description: '24/7 professional support team dedicated to your success and growth.' },
          ].map((value, i) => (
            <BenefitCard key={i} {...value} />
          ))}
        </div>
      </section>

      <section className="bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Join Our Growing Community</h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">Start earning money teaching English to passionate international students today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#accounts-available" className="inline-block px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition transform hover:scale-105">
              View Teaching Opportunities →
            </Link>
            <Link href="/contact" className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Why Choose Echoverse?</h2>
          <p className="text-xl text-gray-600">Everything you need to succeed as an ESL educator</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { emoji: '💵', title: 'Competitive Pay', desc: '$15-25+ per hour depending on experience', detail: 'Highest rates in the industry. Earn $500-$2,000+ monthly' },
            { emoji: '🎯', title: 'Flexible Schedule', desc: 'Work when you want, set your own hours', detail: 'Teach 5 hours/week or 40+. You\'re always in control' },
            { emoji: '🚀', title: 'Quick Start', desc: 'Get approved and start teaching in 48 hours', detail: 'Simple verification process with instant onboarding' },
            { emoji: '👥', title: 'Global Community', desc: 'Connect with motivated students worldwide', detail: 'Students from 8+ countries eager to learn English' },
            { emoji: '📈', title: 'Career Growth', desc: 'Advance to senior roles and mentorship positions', detail: 'Become a mentor, trainer, or curriculum developer' },
            { emoji: '🎓', title: 'Complete Support', desc: '24/7 support team & continuous training', detail: 'Materials, lesson plans, and pro tips provided' }
          ].map((item, i) => (
            <div key={i} className="bg-linear-to-br from-purple-50 to-pink-50 p-8 rounded-xl border-2 border-purple-200 hover:border-purple-500 hover:shadow-lg transition-all duration-300 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">{item.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-700 font-semibold mb-3">{item.desc}</p>
              <p className="text-sm text-purple-700 italic">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center mb-16">What Teachers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'ESL Teacher', quote: 'Echoverse made it so easy to earn from home! The pay is fair and the students are incredibly motivated.', rating: 5 },
              { name: 'Marco Rodriguez', role: 'Part-time Educator', quote: 'I love the flexibility. I can teach around my main job and still earn substantial income. Great support team!', rating: 5 },
              { name: 'Elena Chen', role: 'Full-time Teacher', quote: 'Best platform I\'ve worked with. Professional, organized, and my students are awesome. Highly recommended!', rating: 5 }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-purple-600">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How much can I earn teaching with Echoverse?', a: 'Teachers typically earn $15-25+ per hour depending on their experience, qualifications, and student feedback. Many teachers earn $500-2000+ per month on a part-time basis.' },
            { q: 'What qualifications do I need?', a: 'You need to be a native English speaker or have near-native proficiency, have a high school diploma minimum (bachelor\'s degree preferred), and pass our background check.' },
            { q: 'How flexible is the schedule?', a: 'Very flexible! You set your availability. You can teach as few as 5 hours per week or 40+ hours. You\'re in complete control.' },
            { q: 'Do you provide training?', a: 'Yes! We provide comprehensive onboarding, teaching materials, and ongoing professional development. Our support team is available 24/7.' },
            { q: 'How do I get paid?', a: 'We pay via bank transfer, PayPal, or other local methods. Payments are processed weekly. You\'ll see your earnings dashboard in real-time.' },
            { q: 'What technical requirements do I need?', a: 'A stable internet connection (minimum 5Mbps), a computer/laptop with a webcam, and a microphone. Most modern laptops have these built-in.' }
          ].map((faq, i) => (
            <div key={i} className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-purple-500 transition">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                className="w-full px-6 py-4 bg-white hover:bg-purple-50 transition flex justify-between items-center"
              >
                <span className="text-lg font-bold text-gray-900 text-left">{faq.q}</span>
                <span className={`text-purple-600 transition transform ${expandedFAQ === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandedFAQ === i && (
                <div className="px-6 py-4 bg-purple-50 border-t-2 border-purple-200">
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-linear-to-br from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">Why Teachers Trust Echoverse</h2>
            <p className="text-sm sm:text-base text-purple-100 max-w-2xl mx-auto">
              Clear protections for both teachers and students, explained in plain language so you
              can quickly see how we keep your work safe.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="bg-white text-slate-900 p-7 rounded-xl shadow-md shadow-purple-900/30 border border-purple-200/70">
              <div className="text-4xl mb-3">🔒</div>
              <p className="font-semibold text-base mb-2">Secure Platform</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                SSL-encrypted classrooms and secure payment processing that follow industry-best
                security practices.
              </p>
            </div>
            <div className="bg-white text-slate-900 p-7 rounded-xl shadow-md shadow-purple-900/30 border border-purple-200/70">
              <div className="text-4xl mb-3">🛡️</div>
              <p className="font-semibold text-base mb-2">Background Verified</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Every teacher and staff member passes ID and background checks before working on the
                platform.
              </p>
            </div>
            <div className="bg-white text-slate-900 p-7 rounded-xl shadow-md shadow-purple-900/30 border border-purple-200/70">
              <div className="text-4xl mb-3">📜</div>
              <p className="font-semibold text-base mb-2">Professionally Certified</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                TESOL, CELTA, and other internationally recognized certifications from our teaching
                community.
              </p>
            </div>
            <div className="bg-white text-slate-900 p-7 rounded-xl shadow-md shadow-purple-900/30 border border-purple-200/70">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-semibold text-base mb-2">Trusted Since 2020</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                10,000+ successful teacher–student matches and consistently high satisfaction
                ratings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Start Teaching?</h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">Join thousands of teachers earning flexible income while making a global impact.</p>
          <Link href="/teachers-profile" className="inline-block px-10 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition transform hover:scale-105">
            Apply Now & Start Earning →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
