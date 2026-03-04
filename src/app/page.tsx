'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useApplicantAuth } from '@/lib/applicant-auth-context';
import { useJourneySteps } from '@/hooks/useProfileManagement';
import { usePageSections } from '@/hooks/usePageSections';
import { usePageStats } from '@/hooks/usePageStats';
import { RequirementsSection } from '@/components/RequirementsSection';
import { FAQSection } from '@/components/FAQSection';
import { WhyJoinSection } from '@/components/WhyJoinSection';
import { WhatWeOfferSection } from '@/components/WhatWeOfferSection';
import { AccountsAvailableSection } from '@/components/AccountsAvailableSection';
import { TableOfContents } from '@/components/SectionNavigation';
import { Footer } from '@/components/Footer';
import { TestimonialCarousel, type Testimonial } from '@/components/TestimonialCarousel';
import { RealtimeIndicator } from '@/components/RealtimeIndicator';


export default function Home() {
  const { user: applicantUser } = useApplicantAuth();
  const journeySteps = useJourneySteps();
  const { sections: pageSections, loading: sectionsLoading } = usePageSections();
  const { stats: pageStats, loading: statsLoading } = usePageStats();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [visibleTestimonials, setVisibleTestimonials] = useState(6);
  const [applicationData, setApplicationData] = useState({
    name: '',
    age: '',
    email: '',
    address: '',
    phone: '',
    educational_attainment: '',
    university_school: '',
    teaching_experience: '',
    certificates: '',
    board_exam: '',
    board_exam_date: '',
    deped_ranking: '',
    currently_working: '',
    job_details: '',
    preferred_hours: '',
    residing_antique: '',
    agreed_to_terms: false,
  });

  // Listen for custom event from chatbot to open application modal
  useEffect(() => {
    const handleOpenApplicationModal = () => {
      setShowApplicationModal(true);
      // Scroll to the modal
      setTimeout(() => {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    };

    window.addEventListener('openApplicationModal', handleOpenApplicationModal);
    return () => {
      window.removeEventListener('openApplicationModal', handleOpenApplicationModal);
    };
  }, []);

  // Pre-fill name and email in application form when applicant is logged in and modal opens
  useEffect(() => {
    if (!showApplicationModal || !applicantUser) return;
    const name = (applicantUser.user_metadata?.full_name as string)?.trim() || '';
    const email = applicantUser.email ?? '';
    setApplicationData((prev) => ({
      ...prev,
      name: prev.name || name,
      email: prev.email || email,
    }));
  }, [showApplicationModal, applicantUser]);

  const handleApplicationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setApplicationData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationLoading(true);
    setApplicationError(null);
    setApplicationSuccess(false);
    
    try {
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            name: applicationData.name,
            age: applicationData.age,
            email: applicationData.email,
            address: applicationData.address,
            phone: applicationData.phone,
            educational_attainment: applicationData.educational_attainment,
            university_school: applicationData.university_school,
            teaching_experience: applicationData.teaching_experience,
            certificates: applicationData.certificates,
            board_exam: applicationData.board_exam,
            board_exam_date: applicationData.board_exam_date,
            deped_ranking: applicationData.deped_ranking,
            currently_working: applicationData.currently_working,
            job_details: applicationData.job_details,
            preferred_hours: applicationData.preferred_hours,
            residing_antique: applicationData.residing_antique,
            agreed_to_terms: applicationData.agreed_to_terms,
          },
        ]);
      
      if (error) {
        throw error;
      }
      
      setApplicationSuccess(true);
      setApplicationData({
        name: '',
        age: '',
        email: '',
        address: '',
        phone: '',
        educational_attainment: '',
        university_school: '',
        teaching_experience: '',
        certificates: '',
        board_exam: '',
        board_exam_date: '',
        deped_ranking: '',
        currently_working: '',
        job_details: '',
        preferred_hours: '',
        residing_antique: '',
        agreed_to_terms: false,
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowApplicationModal(false);
        setApplicationSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error submitting application:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application. Please try again.';
      setApplicationError(errorMessage);
    } finally {
      setApplicationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <RealtimeIndicator />

      {/* Welcome Section - Welcoming Introduction */}
      <section className="py-8 bg-linear-to-b from-purple-50 via-pink-50 to-white relative overflow-hidden">
                
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Warm Welcome */}
          <div className="text-center mb-6 space-y-3">
            <div className="inline-block">
              <div className="text-4xl mb-2">👋 Welcome!</div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              Welcome to <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Echoverse Online Tutorial Services</span>
            </h2>
            
            <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto">
              {`We're more than just a platform—we're a thriving community of passionate educators empowering learners around the globe. Whether you're an experienced teacher or just starting your journey, Echoverse is your partner in success.`}
            </p>
          </div>

        {/* What We Offer Section */}
        <WhatWeOfferSection />

        {/* Call to Action */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16">
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 px-4">
            Ready to join our community and transform your teaching career?
          </p>
          <Link href="#accounts-available" className="group relative inline-flex px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Get Started Now <span className="group-hover:translate-x-1 transition">→</span>
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
        </div>
      </section>



      {/* Statistics Section - Premium Dark */}
      <section className="relative py-6 sm:py-8 bg-linear-to-br from-slate-950 via-purple-900 to-slate-950 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="text-center mb-4 sm:mb-6 space-y-1 sm:space-y-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black">Trusted by Educators</h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-4">Join our thriving global community of successful language teachers</p>
            <div className="w-12 sm:w-16 h-0.5 bg-linear-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>
          
          {statsLoading ? (
            <div className="text-center text-gray-300 text-sm sm:text-base">Loading statistics...</div>
          ) : pageStats.length === 0 ? (
            <div className="text-center text-gray-300 text-sm sm:text-base">No statistics available</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {pageStats.map((stat) => (
                <div key={stat.stat_key} className="p-3 sm:p-4 bg-white/10 backdrop-blur border border-white/20 rounded-lg hover:border-purple-400 hover:bg-white/15 transition-all duration-300 group">
                  <div className="text-2xl sm:text-3xl font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">{stat.stat_value}</div>
                  <h3 className="text-xs sm:text-sm font-bold mb-0.5">{stat.stat_label}</h3>
                  <p className="text-xs text-gray-300">{stat.stat_description}</p>
                  <div className="mt-2 h-0.5 w-4 sm:w-6 bg-linear-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all rounded-full"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 bg-linear-to-br from-slate-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">What Teachers Say</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-light px-4">Real stories from successful educators in our community</p>
            <div className="flex justify-center gap-2">
              <div className="w-8 sm:w-12 h-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-full"></div>
              <div className="w-8 sm:w-12 h-0.5 bg-linear-to-r from-pink-600 to-purple-600 rounded-full"></div>
            </div>
          </div>
          
          {(() => {
            const section = pageSections.find((s) => s.section_name === 'testimonials');
            const testimonials = ((section?.content as { testimonials?: Testimonial[] } | undefined)?.testimonials || []).slice(0, visibleTestimonials);
            const hasMore = (section?.content as { testimonials?: Testimonial[] } | undefined)?.testimonials && ((section?.content as { testimonials?: Testimonial[] } | undefined)?.testimonials || []).length > visibleTestimonials;
            
            return (
              <TestimonialCarousel
                testimonials={testimonials}
                loading={sectionsLoading}
                onLoadMore={() => {
                  setVisibleTestimonials(prev => prev + 6);
                }}
                hasMore={hasMore || false}
              />
            );
          })()}
        </div>
      </section>

      {/* Detailed Journey Timeline */}
      <section className="py-8 bg-linear-to-b from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Your Journey to Success</h2>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">Follow our streamlined 4-step process from application to your first class. Each step is designed to set you up for success with comprehensive support every step of the way.</p>
          </div>

          {/* Timeline Steps */}
          {journeySteps.loading ? (
            <div className="text-center py-12">Loading journey steps...</div>
          ) : journeySteps.error ? (
            <div className="text-center py-12 text-red-600">Error loading journey steps: {journeySteps.error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-2 md:gap-3 mb-4 sm:mb-6 relative">
              {/* Connecting Lines */}
              <div className="hidden lg:block absolute top-24 sm:top-28 left-0 right-0 h-1 bg-linear-to-r from-purple-600 via-pink-600 to-green-600 -z-10"></div>

              {journeySteps.data.map((step) => {
                const colorThemes: { [key: string]: string } = {
                  'purple': 'purple-200 purple-600 purple-600 purple-700 purple-50 purple-600',
                  'blue': 'blue-200 blue-600 blue-600 blue-700 blue-50 blue-600',
                  'pink': 'pink-200 pink-600 pink-600 pink-700 pink-50 pink-600',
                  'green': 'green-200 green-600 green-600 green-700 green-50 green-600',
                  'orange': 'orange-200 orange-600 orange-600 orange-700 orange-50 orange-600'
                };
                const colors = (colorThemes[step.color_theme || 'purple'] || colorThemes['purple']).split(' ');
                const borderColor = colors[0];
                const hoverColor = colors[1];
                const fromColor = colors[2];
                const toColor = colors[3];
                const bgColor = colors[4];

                return (
                  <div key={step.id} className="relative group">
                    <div className={`bg-white rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-5 shadow-md hover:shadow-xl transition duration-300 border-2 border-${borderColor} hover:border-${hoverColor} h-full flex flex-col`}>
                      <div className={`absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 md:w-12 h-10 md:h-12 bg-linear-to-r from-${fromColor} to-${toColor} text-white rounded-full flex items-center justify-center font-bold text-lg md:text-lg group-hover:scale-110 transition`}>
                        {step.emoji}
                      </div>
                      
                      <div className="pt-4 md:pt-6 flex-1 flex flex-col">
                        <h3 className="text-lg md:text-xl lg:text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600 text-xs md:text-sm mb-4 flex-1">{step.description}</p>
                        
                        {step.what_happens && (
                          <div className={`space-y-2 bg-${bgColor} p-2 sm:p-3 rounded-lg mb-3 sm:mb-4`}>
                            <div className="text-xs sm:text-sm">
                              <p className="font-semibold text-gray-900 mb-1 sm:mb-1.5">✓ What Happens:</p>
                              <ul className="text-gray-700 space-y-0.5 text-xs ml-2">
                                {step.what_happens.split('|').map((item, idx) => (
                                  <li key={idx}>• {item.trim()}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5 text-xs sm:text-sm">
                          {step.time_to_complete && (
                            <div className="flex items-start gap-2 pt-1">
                              <span className="font-bold text-sm sm:text-base">⏱️</span>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-xs sm:text-sm">Time to Complete</p>
                                <p className="text-gray-600 text-xs">{step.time_to_complete}</p>
                              </div>
                            </div>
                          )}
                          {step.duration_detail && (
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-sm sm:text-base">📋</span>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-xs sm:text-sm">Details</p>
                                <p className="text-gray-600 text-xs">{step.duration_detail}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {step.pro_tip && (
                          <div className="mt-3 sm:mt-4 p-2 sm:p-2.5 md:p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded text-xs text-gray-700">
                            <p className="font-semibold text-yellow-900 mb-1">💡 Pro Tip:</p>
                            <p className="text-xs leading-snug">{step.pro_tip}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );

              })}
            </div>
          )}

          {/* Additional Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-purple-600 hover:border-purple-700">
              <h4 className="text-lg font-bold text-purple-900 mb-3">❓ What If I Don&apos;t Get Selected?</h4>
              <p className="text-purple-800 text-sm leading-relaxed">Don&apos;t worry! You&apos;ll receive constructive feedback on areas to improve. You can reapply after 30 days with updated qualifications or certifications. We want to see you succeed! 💪</p>
            </div>

            <div className="bg-linear-to-br from-pink-50 to-pink-100 rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-pink-600 hover:border-pink-700">
              <h4 className="text-lg font-bold text-pink-900 mb-3">❓ How Much Will I Earn?</h4>
              <p className="text-pink-800 text-sm leading-relaxed"><span className="font-bold">$15-25+/hour</span> depending on your qualifications and experience level. Earn premium rates ($25-35/hour) for specialized skills like TOEFL, Business English, or specific niches. 📈</p>
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-green-600 hover:border-green-700">
              <h4 className="text-lg font-bold text-green-900 mb-3">❓ When Do I Get Paid?</h4>
              <p className="text-green-800 text-sm leading-relaxed">Monthly payments on the <span className="font-bold">1st of each month</span> for all lessons taught. Choose between direct bank transfer or PayPal. Fast, reliable, and transparent. 💰</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-20">
            <button onClick={() => setShowApplicationModal(true)} className="px-12 py-5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:opacity-90 transition transform hover:scale-105 shadow-xl hover:shadow-2xl">
              🚀 Start Your Journey Today
            </button>
            <p className="text-gray-600 text-sm mt-6 font-medium">From application to first class in as little as <span className="font-bold text-purple-600">3-5 days</span> • 98% acceptance rate • Zero experience needed</p>
          </div>
        </div>
      </section>

      {/* Accounts Available Section */}
      <AccountsAvailableSection />

      {/* Table of Contents */}
      <TableOfContents />

      {/* Requirements Section */}
      <RequirementsSection />

      {/* Why Join Section */}
      <WhyJoinSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA Section - Premium */}
      <section className="relative py-8 bg-linear-to-br from-slate-950 via-purple-900 to-slate-950 text-white overflow-hidden">
                
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
              Ready to Transform <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Your Teaching Career?</span>
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join 500+ educators earning premium income with Echoverse. <span className="font-bold">Quick approval</span> • <span className="font-bold">100% flexible</span> • <span className="font-bold">24/7 support</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-4">
              <button onClick={() => setShowApplicationModal(true)} className="group relative px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Your Journey Now <span className="group-hover:translate-x-1 transition">🚀</span>
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <Link href="/teachers-profile" className="px-6 py-2 border-2 border-purple-400 text-white rounded-lg font-bold text-sm hover:bg-white/10 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Explore Opportunities
              </Link>
            </div>
            
            <p className="text-gray-400 text-sm pt-4">💡 No experience needed • Full training provided • Start earning in 3-5 days</p>
          </div>
        </div>
      </section>

      {/* Chat widget is now provided by global SupportChatbot component */}

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-linear-to-r from-purple-600 to-pink-600 text-white p-4 sm:p-6 lg:p-8 flex justify-between items-center rounded-t-xl">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black">Join Echoverse</h2>
                <p className="text-purple-100 text-xs sm:text-sm mt-1">Start earning in 3-5 days</p>
              </div>
              <button onClick={() => setShowApplicationModal(false)} className="text-2xl sm:text-3xl hover:scale-110 transition-transform font-bold p-1">✕</button>
            </div>
            
            <form onSubmit={handleApplicationSubmit} className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
              {applicantUser && (
                <p className="text-xs sm:text-sm text-purple-600 font-medium">
                  Logged in as {applicantUser.user_metadata?.full_name || applicantUser.email}. Name and email are pre-filled.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Name *</label>
                  <input type="text" name="name" value={applicationData.name} onChange={handleApplicationInputChange} required placeholder="Full Name" className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Age *</label>
                  <input type="number" name="age" value={applicationData.age} onChange={handleApplicationInputChange} required placeholder="Age" className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition text-sm sm:text-base" />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Email *</label>
                <input type="email" name="email" value={applicationData.email} onChange={handleApplicationInputChange} required placeholder="your.email@example.com" className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition text-sm sm:text-base" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Address *</label>
                <textarea name="address" value={applicationData.address} onChange={handleApplicationInputChange} required placeholder="Full Address" rows={2} className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition resize-none text-sm sm:text-base" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Phone no. *</label>
                <input type="tel" name="phone" value={applicationData.phone} onChange={handleApplicationInputChange} required placeholder="+63 9XX XXX XXXX" className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition text-sm sm:text-base" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Educational attainment/ Course *</label>
                  <input type="text" name="educational_attainment" value={applicationData.educational_attainment} onChange={handleApplicationInputChange} required placeholder="e.g., Bachelor of Science" className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition text-sm sm:text-base" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">University/School Attended *</label>
                  <input type="text" name="university_school" value={applicationData.university_school} onChange={handleApplicationInputChange} required placeholder="School Name" className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition text-sm sm:text-base" />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Teaching experience *</label>
                <textarea name="teaching_experience" value={applicationData.teaching_experience} onChange={handleApplicationInputChange} required placeholder="Years and type of experience" rows={2} className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition resize-none text-sm sm:text-base" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Attained Certificates (TESOL, TEFL, TEYL etc.) *</label>
                <input type="text" name="certificates" value={applicationData.certificates} onChange={handleApplicationInputChange} required placeholder="List certificates" className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition text-sm sm:text-base" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Will you be taking the Board Exam? *</label>
                  <select name="board_exam" value={applicationData.board_exam} onChange={handleApplicationInputChange} required className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition">
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Board Exam Date (if yes)</label>
                  <input type="text" name="board_exam_date" value={applicationData.board_exam_date} onChange={handleApplicationInputChange} placeholder="Date or timeframe" className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition" />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Applied for DepEd ranking? *</label>
                <select name="deped_ranking" value={applicationData.deped_ranking} onChange={handleApplicationInputChange} required className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition text-sm sm:text-base">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Currently Working? *</label>
                <select name="currently_working" value={applicationData.currently_working} onChange={handleApplicationInputChange} required className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition text-sm sm:text-base">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Job Department/Agency/Company (if applicable)</label>
                <input type="text" name="job_details" value={applicationData.job_details} onChange={handleApplicationInputChange} placeholder="Employer details" className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition text-sm sm:text-base" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Preferred Working time/hours *</label>
                <input type="text" name="preferred_hours" value={applicationData.preferred_hours} onChange={handleApplicationInputChange} required placeholder="e.g., Evening, Weekends, Flexible" className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition text-sm sm:text-base" />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Residing in Antique? *</label>
                <select name="residing_antique" value={applicationData.residing_antique} onChange={handleApplicationInputChange} required className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-gray-900 focus:outline-none focus:border-purple-600 transition text-sm sm:text-base">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-linear-to-br from-blue-50 via-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl sm:rounded-2xl shadow-md">
                {/* Header */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="shrink-0">
                    <input 
                      type="checkbox" 
                      id="agreeToTerms" 
                      name="agreed_to_terms" 
                      checked={applicationData.agreed_to_terms} 
                      onChange={handleApplicationInputChange} 
                      className="mt-1 w-5 h-5 sm:w-6 sm:h-6 text-purple-600 rounded focus:ring-2 focus:ring-purple-600 cursor-pointer accent-purple-600 shadow-sm" 
                    />
                  </div>
                  <div className="flex-1">
                    <label 
                      htmlFor="agreeToTerms" 
                      className="text-sm sm:text-base font-bold text-gray-900 cursor-pointer flex items-center gap-2 mb-1"
                    >
                      <span className="text-base sm:text-lg">🔒</span> 
                      Profile Sharing Agreement <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      By checking this box, you agree that your profile and teaching information may be shared with verified international clients and educational institutions for introduction, evaluation, and connection purposes. This is how we connect qualified educators with opportunities.
                    </p>

                    {/* Key Details Card */}
                    <div className="bg-white rounded-xl p-3 sm:p-4 border border-blue-200 shadow-sm mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 sm:mb-3 flex items-center gap-2">
                        <span className="text-blue-600">ℹ️</span> What This Means:
                      </p>
                      <ul className="text-sm text-gray-700 space-y-2.5">
                        <li className="flex items-start gap-3">
                          <span className="text-green-600 font-bold text-lg leading-none shrink-0 mt-0.5">✓</span>
                          <div>
                            <span className="font-medium text-gray-900">Profile Visibility</span>
                            <p className="text-xs text-gray-600 mt-0.5">Your name, qualifications, teaching experience, and credentials will be visible to potential employers and clients</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-green-600 font-bold text-lg leading-none shrink-0 mt-0.5">✓</span>
                          <div>
                            <span className="font-medium text-gray-900">Direct Contact</span>
                            <p className="text-xs text-gray-600 mt-0.5">Clients may reach out to you directly with teaching opportunity inquiries and interview requests</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-green-600 font-bold text-lg leading-none shrink-0 mt-0.5">✓</span>
                          <div>
                            <span className="font-medium text-gray-900">Marketing & Directories</span>
                            <p className="text-xs text-gray-600 mt-0.5">Your profile may be featured in marketing materials, job directories, and searchable databases of educators</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-green-600 font-bold text-lg leading-none shrink-0 mt-0.5">✓</span>
                          <div>
                            <span className="font-medium text-gray-900">Secure & Professional</span>
                            <p className="text-xs text-gray-600 mt-0.5">All information is shared securely with vetted partners and protected under strict confidentiality agreements</p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Trust & Security Section */}
                    <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200 mb-3">
                      <div className="flex items-start gap-2">
                        <span className="text-lg shrink-0">🛡️</span>
                        <div>
                          <p className="text-xs font-bold text-green-900">Your Privacy is Protected</p>
                          <p className="text-xs text-green-700 mt-1">Your personal data is encrypted, secured, and only shared with verified partners. You can manage your sharing preferences or withdraw consent anytime.</p>
                        </div>
                      </div>
                    </div>

                    {/* Documentation Link */}
                    <button
                      type="button"
                      onClick={() => window.open('#privacy', '_blank')}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition flex items-center gap-1"
                    >
                      📄 Read Full Privacy Policy & Terms
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
              {applicationError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <span className="text-red-600 font-bold text-lg mt-0.5">❌</span>
                <div>
                  <p className="text-red-700 text-sm font-semibold">Submission Error</p>
                  <p className="text-red-600 text-xs mt-1">{applicationError}</p>
                </div>
              </div>
            )}

            {applicationSuccess && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <span className="text-green-600 font-bold text-lg mt-0.5">✅</span>
                <div>
                  <p className="text-green-700 text-sm font-semibold">Success!</p>
                  <p className="text-green-600 text-xs mt-1">Your application has been submitted successfully. We&apos;ll review it and contact you soon!</p>
                </div>
              </div>
            )}

            {!applicationData.agreed_to_terms && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                  <span className="text-red-600 font-bold text-lg mt-0.5">⚠️</span>
                  <div>
                    <p className="text-red-700 text-sm font-semibold">Agreement Required</p>
                    <p className="text-red-600 text-xs mt-1">You must agree to the profile sharing terms to submit your application</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 sm:gap-4 pt-6 sm:pt-8 border-t-2 border-gray-200">
                <button type="submit" disabled={applicationLoading || !applicationData.agreed_to_terms} className="flex-1 relative bg-linear-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden">
                  <span className="relative z-10">{applicationLoading ? '⏳ Submitting...' : '🚀 Submit Application'}</span>
                  <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                <button type="button" onClick={() => setShowApplicationModal(false)} className="flex-1 bg-gray-100 text-gray-900 px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg hover:bg-gray-200 hover:shadow-md transition-all duration-300 border-2 border-gray-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}


