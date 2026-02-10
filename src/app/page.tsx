'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { RequirementsSection } from '@/components/RequirementsSection';
import { CurrentlyHiringSection } from '@/components/CurrentlyHiringSection';
import { FAQSection } from '@/components/FAQSection';
import { WhyJoinSection } from '@/components/WhyJoinSection';
import { SectionNavigation, TableOfContents } from '@/components/SectionNavigation';
import { TestimonialCard } from '@/components/TestimonialCard';
import { StatsCard } from '@/components/StatsCard';
import { BenefitCard } from '@/components/BenefitCard';
import { CTAButton } from '@/components/CTAButton';
import { Footer } from '@/components/Footer';

type TeachingAccount = {
  id: string;
  country: string;
  icon: string;
  rate_per_hour: number;
  shift: string;
  available_slots: number;
};

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [teachingAccounts, setTeachingAccounts] = useState<TeachingAccount[]>([]);
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: 'user' | 'bot'; buttons?: Array<{ label: string; action: 'link' | 'modal'; href?: string; onClick?: () => void }> }>>([
    { id: 1, text: 'Hello! 👋 Welcome to Echoverse Online Tutorials Services. How can I help you start your teaching journey today?', sender: 'bot', buttons: [
      { label: 'View Courses', action: 'link', href: '/courses' },
      { label: 'More Information', action: 'link', href: '/about' },
      { label: 'I\'m Interested', action: 'modal' }
    ] },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
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
  });

  useEffect(() => {
    loadTeachingAccounts();
  }, []);

  const loadTeachingAccounts = async () => {
    try {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('teaching_accounts')
        .select('id, country, icon, rate_per_hour, shift, available_slots')
        .limit(6);

      if (!error && data && data.length > 0) {
        setTeachingAccounts(data as TeachingAccount[]);
      }
    } catch {
      // Silently fail - teaching accounts section will show nothing if error
    }
  };

  const autoReplies: { [key: string]: { text: string; buttons?: Array<{ label: string; action: 'link' | 'modal'; href?: string }> } } = {
    'hello': { text: 'Hello! Welcome to Echoverse ESL teaching platform. How can I assist you?', buttons: [
      { label: 'View Teaching Accounts', action: 'link', href: '/courses' },
      { label: 'More Information', action: 'link', href: '/about' },
      { label: 'I\'m Interested', action: 'modal' }
    ]},
    'hi': { text: 'Hi there! 👋 Thanks for reaching out. What would you like to know?', buttons: [
      { label: 'View Teaching Accounts', action: 'link', href: '/courses' },
      { label: 'More Information', action: 'link', href: '/about' },
      { label: 'I\'m Interested', action: 'modal' }
    ]},
    'courses': { text: 'We offer ESL teaching accounts in Japanese, Korean, Chinese, Thai, Vietnamese, and more! Check our Teaching Accounts page for details.', buttons: [
      { label: 'View All Accounts', action: 'link', href: '/courses' },
      { label: 'Apply Now', action: 'modal' }
    ]},
    'account': { text: 'Teaching accounts typically offer $15-25+ per hour, flexible scheduling, and access to international students. Would you like more details?', buttons: [
      { label: 'View Teaching Accounts', action: 'link', href: '/courses' },
      { label: 'I\'m Interested', action: 'modal' }
    ]},
    'teaching': { text: 'Yes! We connect ESL teachers with students across Asia. We have opportunities in Japan, Korea, China, Thailand, Vietnam, and more.', buttons: [
      { label: 'View Teaching Accounts', action: 'link', href: '/courses' },
      { label: 'Apply', action: 'modal' }
    ]},
    'opportunity': { text: 'Great! We have multiple ESL teaching opportunities available. Visit our Teaching Accounts page to see what\'s available.', buttons: [
      { label: 'Browse Accounts', action: 'link', href: '/courses' },
      { label: 'I\'m Interested', action: 'modal' }
    ]},
    'earn': { text: 'Teachers can earn $15-25+ per hour with flexible scheduling. Some accounts offer even higher rates for experienced educators!', buttons: [
      { label: 'See All Rates', action: 'link', href: '/courses' },
      { label: 'Apply Now', action: 'modal' }
    ]},
    'hours': { text: 'You can choose flexible hours that fit your schedule. We have various shift times to accommodate part-time and full-time options.', buttons: [
      { label: 'View Teaching Accounts', action: 'link', href: '/courses' },
      { label: 'Get Started', action: 'modal' }
    ]},
    'contact': { text: 'You can reach us at support@echoverse.com or use our Contact page for more information. We\'re here to help!', buttons: [
      { label: 'Contact Us', action: 'link', href: '/contact' },
      { label: 'I\'m Interested', action: 'modal' }
    ]},
    'thanks': { text: 'You\'re welcome! Is there anything else I can help you with?', buttons: [
      { label: 'View Teaching Accounts', action: 'link', href: '/courses' },
      { label: 'More Info', action: 'link', href: '/about' }
    ]},
    'help': { text: 'I can assist you with questions about teaching opportunities, earnings, flexible hours, and more. What would you like to know?', buttons: [
      { label: 'View Teaching Accounts', action: 'link', href: '/courses' },
      { label: 'Contact Support', action: 'link', href: '/contact' }
    ]},
    'about': { text: 'Echoverse is an ESL teaching platform connecting educators from Antique, Philippines with international students. Learn more on our About page!', buttons: [
      { label: 'Learn More', action: 'link', href: '/about' },
      { label: 'I\'m Interested', action: 'modal' }
    ]},
    'interested': { text: 'Great! Let\'s get you started with your application.', buttons: [
      { label: 'Fill Application Form', action: 'modal' },
      { label: 'View Courses', action: 'link', href: '/courses' }
    ]},
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setTimeout(() => {
      const lowerInput = inputValue.toLowerCase();
      let botReply: typeof autoReplies['hello'] | null = null;
      let showModal = false;
      
      for (const [keyword, reply] of Object.entries(autoReplies)) {
        if (lowerInput.includes(keyword)) {
          botReply = reply;
          if (['interested', 'apply', 'join'].includes(keyword)) {
            showModal = true;
          }
          break;
        }
      }
      
      if (!botReply) {
        botReply = { text: 'Thank you for your message! We\'ll get back to you shortly. Feel free to visit our Contact page for more information.', buttons: [
          { label: 'Contact Us', action: 'link', href: '/contact' },
          { label: 'View Courses', action: 'link', href: '/courses' }
        ]};
      }
      
      const botMessage = { 
        id: Date.now() + 1, 
        text: botReply.text, 
        sender: 'bot' as const,
        buttons: botReply.buttons
      };
      setMessages(prev => [...prev, botMessage]);
      
      if (showModal) {
        setTimeout(() => setShowApplicationModal(true), 1000);
      }
    }, 500);
  };

  const handleButtonClick = (button: { label: string; action: 'link' | 'modal'; href?: string }) => {
    if (button.action === 'link' && button.href) {
      window.location.href = button.href;
    } else if (button.action === 'modal') {
      setShowApplicationModal(true);
    }
  };

  const handleApplicationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({ ...prev, [name]: value }));
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
          },
        ]);
      
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: 'Thank you for submitting your application! Our team will review your details and get back to you soon. 🎉', 
        sender: 'bot' 
      }]);
      
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
      });
    } catch (err) {
      console.error('Error submitting application:', err);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: 'There was an error submitting your application. Please try again or contact us directly.', 
        sender: 'bot' 
      }]);
    } finally {
      setApplicationLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Side Navigation */}
      <SectionNavigation />
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-lg shadow-lg">🎓</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:opacity-80 transition">Echoverse</span>
            </Link>
            <div className="hidden md:flex space-x-1">
              {[
                { label: 'Home', href: '#home' },
                { label: 'Teaching Accounts', href: '/courses' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map(item => (
                <Link key={item.label} href={item.href} className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-all duration-300 font-medium">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-linear-to-b from-slate-50 to-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <div className="space-y-3">
              <p className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider">Welcome to Echoverse Online Tutorials</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Teach English,<br />Earn Premium Income
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed">
              Join thousands of ESL educators earning flexible income teaching international students across Asia. Start your journey with Echoverse Online Tutorials Services today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/courses" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition transform hover:scale-105">
                View Teaching Opportunities →
              </Link>
              <Link href="/about" className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition transform hover:scale-105">
                Learn More
              </Link>
            </div>
            <div className="flex justify-center gap-8 pt-8 text-sm text-gray-600">
              <div>✓ 10K+ Active Learners</div>
              <div>✓ 200+ Certified Teachers</div>
              <div>✓ 6+ Markets Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Home Page Section */}
      <section id="home" className="py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Why Join Echoverse?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">Premium benefits for professional ESL educators worldwide</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '💰', title: 'Competitive Pay', description: 'Earn $15-25+ per hour with rates based on your experience and qualifications' },
              { icon: '⏰', title: 'Flexible Schedule', description: 'Work on your terms. Choose your hours and the number of students you teach' },
              { icon: '🌍', title: 'Global Students', description: 'Teach learners from Japan, Korea, China, Thailand, Vietnam and beyond' },
              { icon: '👥', title: '24/7 Support', description: 'Our dedicated team is always ready to help you succeed' },
              { icon: '📈', title: 'Career Growth', description: 'Access multiple teaching opportunities and advance your career' },
              { icon: '⚡', title: 'Quick Setup', description: 'Simple application process with quick approval and easy onboarding' },
            ].map((feature, i) => (
              <BenefitCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Accounts Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">Available Teaching Accounts</h2>
            <p className="text-xl text-gray-600">Choose your preferred market and start earning today</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {teachingAccounts.length > 0 ? (
              teachingAccounts.map((account) => (
                <div key={account.id} className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:shadow-xl hover:border-black transition group">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{account.icon}</span>
                    <h3 className="text-2xl font-bold text-black">{account.country}</h3>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-bold text-black text-lg">${account.rate_per_hour}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-bold text-black">{account.available_slots > 0 ? `${account.available_slots}+` : 'TBD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shift:</span>
                      <span className="font-bold text-black">{account.shift}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-gray-600 mb-4">No teaching accounts available yet.</p>
                <Link href="/courses" className="text-black font-bold hover:underline">Add teaching accounts →</Link>
              </div>
            )}
          </div>
          <div className="text-center">
            <Link href="/courses" className="inline-block px-8 py-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition transform hover:scale-105">
              View All Accounts
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Trusted by Educators Worldwide</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Join our growing community of successful teachers</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <StatsCard icon="👨‍🏫" number="500+" label="Active Teachers" description="And counting daily" />
            <StatsCard icon="👥" number="12,000+" label="Students Taught" description="From 8+ countries" />
            <StatsCard icon="💰" number="$2.5M+" label="Total Earnings" description="Paid to teachers" />
            <StatsCard icon="⭐" number="4.9/5" label="Average Rating" description="From student reviews" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">What Teachers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real stories from educators earning with us</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Maria Santos" 
              role="Full-time ESL Teacher" 
              content="Echoverse has changed my teaching career! Flexible hours, amazing students, and I've earned over $15,000 in just 6 months. The support team is incredible." 
              rating={5} 
            />
            <TestimonialCard 
              name="John Smith" 
              role="Part-time Educator" 
              content="I started as a side hustle and now I teach 20+ hours a week. The application process was smooth and I got my first student within 48 hours. Highly recommended!" 
              rating={5} 
            />
            <TestimonialCard 
              name="Sarah Johnson" 
              role="Career Development Specialist" 
              content="The best part is the flexibility. I teach whenever I want, as much as I want. Students from Korea, Japan, and Thailand - it's a truly global experience!" 
              rating={5} 
            />
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <TableOfContents />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Requirements Section */}
      <RequirementsSection />

      {/* Why Join Section */}
      <WhyJoinSection />

      {/* Currently Hiring Section */}
      <CurrentlyHiringSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Earn Premium Income Teaching English?</h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join Echoverse Online Tutorials Services and connect with thousands of eager international learners. Quick approval, flexible scheduling, premium pay.
          </p>
          <Link href="/courses" className="inline-block px-10 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition transform hover:scale-105">
            Get Started Now →
          </Link>
        </div>
      </section>

      {/* Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        {isChatOpen && (
          <div className="mb-4 w-96 max-w-[calc(100vw-2rem)] bg-white border-2 border-gray-300 rounded-2xl shadow-2xl flex flex-col max-h-[600px] min-h-96">
            <div className="bg-black text-white rounded-t-2xl p-4 flex justify-between items-center border-b-2 border-gray-300">
              <div>
                <h3 className="font-bold text-lg">Echoverse Support</h3>
                <p className="text-xs text-gray-300">Ask me anything! 👋</p>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-gray-800 rounded-lg p-2 transition text-xl font-bold">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar" style={{scrollBehavior: 'smooth'}}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} flex-col gap-2`}>
                  <div className={`max-w-xs px-4 py-3 rounded-xl text-sm font-medium ${msg.sender === 'user' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 border-2 border-gray-300 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                  {msg.buttons && msg.sender === 'bot' && (
                    <div className="flex flex-col gap-2 w-full">
                      {msg.buttons.map((button, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleButtonClick(button)}
                          className="w-full text-left px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs rounded-lg hover:opacity-90 transition font-semibold shadow-sm hover:shadow-md"
                        >
                          {button.action === 'link' ? '🔗 ' : '📝 '}{button.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t-2 border-gray-300 p-4 bg-gray-50">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                  placeholder="Type your message..." 
                  className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-4 py-2.5 text-black text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium" 
                />
                <button 
                  onClick={handleSendMessage} 
                  className="bg-black text-white px-5 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition text-sm border border-gray-600 shadow-sm hover:shadow-md"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-16 h-16 rounded-full bg-linear-to-br from-purple-600 to-pink-600 text-white shadow-xl hover:shadow-2xl flex items-center justify-center text-3xl transition hover:opacity-90 hover:scale-110 border-4 border-white font-bold">
          {isChatOpen ? '✕' : '💬'}
        </button>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Application Form</h2>
              <button onClick={() => setShowApplicationModal(false)} className="text-2xl text-gray-600 hover:text-gray-900 transition">✕</button>
            </div>
            
            <form onSubmit={handleApplicationSubmit} className="space-y-4">
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

              <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                <button type="submit" disabled={applicationLoading} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {applicationLoading ? 'Submitting...' : 'Submit Application'}
                </button>
                <button type="button" onClick={() => setShowApplicationModal(false)} className="flex-1 bg-gray-300 text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition">
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
