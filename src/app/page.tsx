'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useJourneySteps } from '@/hooks/useProfileManagement';
import { usePageSections } from '@/hooks/usePageSections';
import { RequirementsSection } from '@/components/RequirementsSection';
import { FAQSection } from '@/components/FAQSection';
import { WhyJoinSection } from '@/components/WhyJoinSection';
import { AccountsAvailableSection } from '@/components/AccountsAvailableSection';
import { TableOfContents } from '@/components/SectionNavigation';
import { Footer } from '@/components/Footer';
import { TestimonialCarousel, type Testimonial } from '@/components/TestimonialCarousel';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export default function Home() {
  const journeySteps = useJourneySteps();
  const { sections: pageSections, loading: sectionsLoading } = usePageSections();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [visibleTestimonials, setVisibleTestimonials] = useState(6);
  const [applicationData, setApplicationData] = useState({
    name: '',
    age: '',
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

  const handleApplicationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setApplicationData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationLoading(true);
    
    try {
      await supabase
        .from('applications')
        .insert([
          {
            name: applicationData.name,
            age: applicationData.age,
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
      
      setShowApplicationModal(false);
      setApplicationData({
        name: '',
        age: '',
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
    } catch (err) {
      console.error('Error submitting application:', err);
    } finally {
      setApplicationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">


      {/* Welcome Section - Welcoming Introduction */}
      <section className="py-24 bg-linear-to-b from-purple-50 via-pink-50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-5 text-5xl opacity-10 animate-bounce">🌟</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-bounce" style={{animationDelay: '0.5s'}}>✨</div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Warm Welcome */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-block">
              <div className="text-6xl mb-4">👋 Welcome!</div>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
              Welcome to <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Echoverse Online Tutorial Services</span>
            </h2>
            
            <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
              {`We're more than just a platform—we're a thriving community of passionate educators empowering learners around the globe. Whether you're an experienced teacher or just starting your journey, Echoverse is your partner in success.`}
            </p>
          </div>

          {/* What We Offer - 3 columns */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Column 1 */}
            <div className="text-center p-8 bg-white rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Education</h3>
              <p className="text-gray-600 leading-relaxed">
                Deliver engaging lessons to motivated students worldwide. We provide all the tools and resources you need.
              </p>
            </div>

            {/* Column 2 */}
            <div className="text-center p-8 bg-white rounded-2xl border-2 border-pink-100 hover:border-pink-300 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Career</h3>
              <p className="text-gray-600 leading-relaxed">
                Work on your schedule. No 9-to-5 commitment. Full control over your hours and workload.
              </p>
            </div>

            {/* Column 3 */}
            <div className="text-center p-8 bg-white rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real Growth</h3>
              <p className="text-gray-600 leading-relaxed">
                Build your reputation, grow your earnings, and advance your career with us.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Facts Strip */}
        <div className="bg-linear-to-br from-purple-600 via-purple-500 to-pink-600 rounded-3xl p-12 sm:p-16 text-white shadow-2xl transform hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-32 -mb-32"></div>
          
          <div className="relative z-10">
            <h3 className="text-4xl sm:text-5xl font-black mb-3 text-center">Why Thousands Love Teaching With Us 💜</h3>
            <p className="text-center text-white/80 mb-12 text-lg max-w-2xl mx-auto">Join our thriving community of educators and unlock unlimited potential</p>
            
            {sectionsLoading ? (
              <div className="text-center py-8">
                <p className="opacity-90 text-lg">Loading benefits...</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const section = pageSections.find((s) => s.section_name === 'why_join');
                  const benefits = (section?.content as { benefits?: Benefit[] } | undefined)?.benefits;
                  return benefits && benefits.length > 0
                    ? benefits.map((benefit: Benefit, index: number) => (
                        <div 
                          key={index} 
                          className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-white/30 hover:border-white/60"
                        >
                          {/* Icon container */}
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                            <div className="text-5xl">{benefit.icon}</div>
                          </div>
                          
                          <h4 className="text-xl font-bold mb-4 leading-tight group-hover:text-white transition-colors">{benefit.title}</h4>
                          <p className="text-base leading-relaxed text-white/90 group-hover:text-white transition-colors">{benefit.description}</p>
                          
                          {/* Decorative hover effect */}
                          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ))
                    : (
                      <>
                        <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-white/30 hover:border-white/60">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                            <div className="text-5xl">💰</div>
                          </div>
                          <h4 className="text-xl font-bold mb-4">Competitive Pay</h4>
                          <p className="text-base leading-relaxed text-white/90">Earn $15-25+ per hour with rates based on your experience and qualifications</p>
                        </div>
                        
                        <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-white/30 hover:border-white/60">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                            <div className="text-5xl">⏰</div>
                          </div>
                          <h4 className="text-xl font-bold mb-4">Flexible Schedule</h4>
                          <p className="text-base leading-relaxed text-white/90">Work on your terms. Choose your hours and the number of students you teach</p>
                        </div>
                        
                        <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-white/30 hover:border-white/60">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                            <div className="text-5xl">🌍</div>
                          </div>
                          <h4 className="text-xl font-bold mb-4">Global Students</h4>
                          <p className="text-base leading-relaxed text-white/90">Teach learners from Japan, Korea, China, Thailand, Vietnam and beyond</p>
                        </div>
                        
                        <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-white/30 hover:border-white/60">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                            <div className="text-5xl">👥</div>
                          </div>
                          <h4 className="text-xl font-bold mb-4">24/7 Support</h4>
                          <p className="text-base leading-relaxed text-white/90">Our dedicated team is always ready to help you succeed</p>
                        </div>
                        
                        <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-white/30 hover:border-white/60">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                            <div className="text-5xl">📈</div>
                          </div>
                          <h4 className="text-xl font-bold mb-4">Career Growth</h4>
                          <p className="text-base leading-relaxed text-white/90">Access multiple teaching opportunities and advance your career</p>
                        </div>
                      </>
                    )
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-700 mb-6">
            Ready to join our community and transform your teaching career?
          </p>
          <Link href="#accounts-available" className="group relative inline-flex px-10 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Get Started Now <span className="group-hover:translate-x-1 transition">→</span>
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </section>



      {/* Statistics Section - Premium Dark */}
      <section className="relative py-32 bg-linear-to-br from-slate-950 via-purple-900 to-slate-950 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl sm:text-6xl font-black">Trusted by Educators</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Join our thriving global community of successful language teachers</p>
            <div className="w-24 h-1 bg-linear-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-white/10 backdrop-blur border border-white/20 rounded-2xl hover:border-purple-400 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-5xl font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">500+</div>
              <h3 className="text-xl font-bold mb-1">Active Teachers</h3>
              <p className="text-gray-300">Growing every single day</p>
              <div className="mt-4 h-1 w-8 bg-linear-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all rounded-full"></div>
            </div>
            
            <div className="p-8 bg-white/10 backdrop-blur border border-white/20 rounded-2xl hover:border-purple-400 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-5xl font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">12,000+</div>
              <h3 className="text-xl font-bold mb-1">Students Taught</h3>
              <p className="text-gray-300">From 50+ countries worldwide</p>
              <div className="mt-4 h-1 w-8 bg-linear-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all rounded-full"></div>
            </div>
            
            <div className="p-8 bg-white/10 backdrop-blur border border-white/20 rounded-2xl hover:border-purple-400 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-5xl font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">$2.5M+</div>
              <h3 className="text-xl font-bold mb-1">Total Earnings Paid</h3>
              <p className="text-gray-300">Straight to our teachers</p>
              <div className="mt-4 h-1 w-8 bg-linear-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all rounded-full"></div>
            </div>
            
            <div className="p-8 bg-white/10 backdrop-blur border border-white/20 rounded-2xl hover:border-purple-400 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-5xl font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">4.9/5 ⭐</div>
              <h3 className="text-xl font-bold mb-1">Average Rating</h3>
              <p className="text-gray-300">Based on student reviews</p>
              <div className="mt-4 h-1 w-8 bg-linear-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-linear-to-br from-slate-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900">What Teachers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real stories from successful educators in our community</p>
            <div className="w-24 h-1 bg-linear-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
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
      <section className="py-24 bg-linear-to-b from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Your Journey to Success</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Follow our streamlined 4-step process from application to your first class. Each step is designed to set you up for success with comprehensive support every step of the way.</p>
          </div>

          {/* Timeline Steps */}
          {journeySteps.loading ? (
            <div className="text-center py-12">Loading journey steps...</div>
          ) : journeySteps.error ? (
            <div className="text-center py-12 text-red-600">Error loading journey steps: {journeySteps.error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-5 mb-12 relative">
              {/* Connecting Lines */}
              <div className="hidden lg:block absolute top-28 left-0 right-0 h-1 bg-linear-to-r from-purple-600 via-pink-600 to-green-600 -z-10"></div>

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
                          <div className={`space-y-2 bg-${bgColor} p-3 rounded-lg mb-4`}>
                            <div className="text-xs md:text-sm">
                              <p className="font-semibold text-gray-900 mb-1.5">✓ What Happens:</p>
                              <ul className="text-gray-700 space-y-0.5 text-xs ml-2">
                                {step.what_happens.split('|').map((item, idx) => (
                                  <li key={idx}>• {item.trim()}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5 text-xs md:text-sm">
                          {step.time_to_complete && (
                            <div className="flex items-start gap-2 pt-1">
                              <span className="font-bold">⏱️</span>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">Time to Complete</p>
                                <p className="text-gray-600 text-xs">{step.time_to_complete}</p>
                              </div>
                            </div>
                          )}
                          {step.duration_detail && (
                            <div className="flex items-start gap-2">
                              <span className="font-bold">📋</span>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">Details</p>
                                <p className="text-gray-600 text-xs">{step.duration_detail}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {step.pro_tip && (
                          <div className="mt-4 p-2.5 md:p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded text-xs text-gray-700">
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
      <section className="relative py-32 bg-linear-to-br from-slate-950 via-purple-900 to-slate-950 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
              Ready to Transform <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Your Teaching Career?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join 500+ educators earning premium income with Echoverse. <span className="font-bold">Quick approval</span> • <span className="font-bold">100% flexible</span> • <span className="font-bold">24/7 support</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button onClick={() => setShowApplicationModal(true)} className="group relative px-10 py-5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Your Journey Now <span className="group-hover:translate-x-1 transition">🚀</span>
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <Link href="/teachers-profile" className="px-10 py-5 border-2 border-purple-400 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-linear-to-r from-purple-600 to-pink-600 text-white p-8 flex justify-between items-center rounded-t-xl">
              <div>
                <h2 className="text-3xl font-black">Join Echoverse</h2>
                <p className="text-purple-100 text-sm mt-1">Start earning in 3-5 days</p>
              </div>
              <button onClick={() => setShowApplicationModal(false)} className="text-3xl hover:scale-110 transition-transform font-bold">✕</button>
            </div>
            
            <form onSubmit={handleApplicationSubmit} className="space-y-6 p-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Name *</label>
                  <input type="text" name="name" value={applicationData.name} onChange={handleApplicationInputChange} required placeholder="Full Name" className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Age *</label>
                  <input type="number" name="age" value={applicationData.age} onChange={handleApplicationInputChange} required placeholder="Age" className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Address *</label>
                <textarea name="address" value={applicationData.address} onChange={handleApplicationInputChange} required placeholder="Full Address" rows={2} className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone no. *</label>
                <input type="tel" name="phone" value={applicationData.phone} onChange={handleApplicationInputChange} required placeholder="+63 9XX XXX XXXX" className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Educational attainment/ Course *</label>
                  <input type="text" name="educational_attainment" value={applicationData.educational_attainment} onChange={handleApplicationInputChange} required placeholder="e.g., Bachelor of Science" className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">University/School Attended *</label>
                  <input type="text" name="university_school" value={applicationData.university_school} onChange={handleApplicationInputChange} required placeholder="School Name" className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Teaching experience *</label>
                <textarea name="teaching_experience" value={applicationData.teaching_experience} onChange={handleApplicationInputChange} required placeholder="Years and type of experience" rows={2} className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Attained Certificates (TESOL, TEFL, TEYL etc.) *</label>
                <input type="text" name="certificates" value={applicationData.certificates} onChange={handleApplicationInputChange} required placeholder="List certificates" className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition" />
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Applied for DepEd ranking? *</label>
                <select name="deped_ranking" value={applicationData.deped_ranking} onChange={handleApplicationInputChange} required className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Currently Working? *</label>
                <select name="currently_working" value={applicationData.currently_working} onChange={handleApplicationInputChange} required className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Job Department/Agency/Company (if applicable)</label>
                <input type="text" name="job_details" value={applicationData.job_details} onChange={handleApplicationInputChange} placeholder="Employer details" className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Preferred Working time/hours *</label>
                <input type="text" name="preferred_hours" value={applicationData.preferred_hours} onChange={handleApplicationInputChange} required placeholder="e.g., Evening, Weekends, Flexible" className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Residing in Antique? *</label>
                <select name="residing_antique" value={applicationData.residing_antique} onChange={handleApplicationInputChange} required className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-600 transition">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="space-y-4 p-6 bg-linear-to-br from-blue-50 via-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl shadow-md">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <input 
                      type="checkbox" 
                      id="agreeToTerms" 
                      name="agreed_to_terms" 
                      checked={applicationData.agreed_to_terms} 
                      onChange={handleApplicationInputChange} 
                      className="mt-1 w-6 h-6 text-purple-600 rounded focus:ring-2 focus:ring-purple-600 cursor-pointer accent-purple-600 shadow-sm" 
                    />
                  </div>
                  <div className="flex-1">
                    <label 
                      htmlFor="agreeToTerms" 
                      className="text-base font-bold text-gray-900 cursor-pointer flex items-center gap-2 mb-1"
                    >
                      <span className="text-lg">🔒</span> 
                      Profile Sharing Agreement <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      By checking this box, you agree that your profile and teaching information may be shared with verified international clients and educational institutions for introduction, evaluation, and connection purposes. This is how we connect qualified educators with opportunities.
                    </p>

                    {/* Key Details Card */}
                    <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm mb-4">
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
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
              {!applicationData.agreed_to_terms && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                  <span className="text-red-600 font-bold text-lg mt-0.5">⚠️</span>
                  <div>
                    <p className="text-red-700 text-sm font-semibold">Agreement Required</p>
                    <p className="text-red-600 text-xs mt-1">You must agree to the profile sharing terms to submit your application</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-8 border-t-2 border-gray-200">
                <button type="submit" disabled={applicationLoading || !applicationData.agreed_to_terms} className="flex-1 relative bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden">
                  <span className="relative z-10">{applicationLoading ? '⏳ Submitting...' : '🚀 Submit Application'}</span>
                  <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                <button type="button" onClick={() => setShowApplicationModal(false)} className="flex-1 bg-gray-100 text-gray-900 px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 hover:shadow-md transition-all duration-300 border-2 border-gray-200">
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
