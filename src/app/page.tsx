'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useJourneySteps } from '@/hooks/useProfileManagement';
import { RequirementsSection } from '@/components/RequirementsSection';
import { FAQSection } from '@/components/FAQSection';
import { WhyJoinSection } from '@/components/WhyJoinSection';
import { AccountsAvailableSection } from '@/components/AccountsAvailableSection';
import { TableOfContents } from '@/components/SectionNavigation';
import { TestimonialCard } from '@/components/TestimonialCard';
import { StatsCard } from '@/components/StatsCard';
import { BenefitCard } from '@/components/BenefitCard';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const journeySteps = useJourneySteps();
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: 'user' | 'bot'; buttons?: Array<{ label: string; action: 'link' | 'modal'; href?: string; keyword?: string; onClick?: () => void }> }>>([
    { id: 1, text: '👋 Welcome to Echoverse! I\'m here to help you start your ESL teaching journey. What would you like to know?', sender: 'bot', buttons: [
      { label: '💰 Payment & Earnings', action: 'modal', keyword: 'payment' },
      { label: '📋 Requirements', action: 'modal', keyword: 'requirement' },
      { label: '🎓 Qualifications', action: 'modal', keyword: 'qualification' },
      { label: '⏰ Schedule', action: 'modal', keyword: 'schedule' },
      { label: '🌟 Benefits', action: 'modal', keyword: 'benefit' },
      { label: '👨‍🏫 Experience', action: 'modal', keyword: 'experience' },
      { label: '🎓 Training', action: 'modal', keyword: 'training' },
      { label: '📝 Application', action: 'modal', keyword: 'apply' },
      { label: '🎯 View Jobs', action: 'link', href: '/teachers-profile' },
      { label: '📞 Contact Us', action: 'link', href: '/contact' }
    ] },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [openSectionKeyword, setOpenSectionKeyword] = useState<string | null>(null);
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
    agreed_to_terms: false,
  });

  const autoReplies: { [key: string]: { text: string; buttons?: Array<{ label: string; action: 'link' | 'modal'; href?: string }> } } = {
    'hello': { text: 'Hello! 👋 Welcome to Echoverse ESL platform. How can I assist you?', buttons: [
      { label: 'Meet Our Teachers', action: 'link', href: '/teachers-profile' },
      { label: 'More Information', action: 'link', href: '/about' },
      { label: 'I\'m Interested', action: 'modal' }
    ]},
    'hi': { text: 'Hi there! 👋 Thanks for reaching out. What would you like to know?', buttons: [
      { label: 'Meet Our Teachers', action: 'link', href: '/teachers-profile' },
      { label: 'More Information', action: 'link', href: '/about' },
      { label: 'I\'m Interested', action: 'modal' }
    ]},
    'requirement': { text: '📋 **Basic Requirements to Teach with Echoverse:**\n\n✓ Bachelor\'s degree (any field)\n✓ Native English speaker or C1/C2 proficiency\n✓ TEFL, TESOL, TEYL, or equivalent certificate (preferred)\n✓ Teaching experience (1-2 years preferred)\n✓ Reliable internet connection\n✓ Professional setup (microphone, headset)\n✓ Available for consistent hours\n\n**No experience?** We provide training and support!', buttons: [
      { label: 'Start Application', action: 'modal' },
      { label: 'Learn More', action: 'link', href: '/about' }
    ]},
    'qualification': { text: '🎓 **Qualifications We Accept:**\n\n✓ TEFL (Teaching English as a Foreign Language)\n✓ TESOL (Teaching English to Speakers of Other Languages)\n✓ TEYL (Teaching English to Young Learners)\n✓ DELTA (Diploma in Teaching English)\n✓ Bachelor in Education/Linguistics\n✓ Other ESL/EFL certificates\n\n**Don\'t have a certificate yet?** Many international programs offer online TEFL certification quickly!', buttons: [
      { label: 'Apply Now', action: 'modal' },
      { label: 'View Opportunities', action: 'link', href: '/teachers-profile' }
    ]},
    'benefit': { text: '🌟 **Benefits of Teaching with Echoverse:**\n\n💰 Competitive rates ($15-25+/hour)\n⏰ 100% flexible schedule (part-time or full-time)\n🌍 Teach international students from home\n📈 Career growth opportunities\n🎓 Professional development support\n👥 Join a supportive community\n🚀 No commute, work from anywhere\n💪 Build teaching portfolio\n🤝 Networking with educators worldwide\n📊 Transparent feedback system', buttons: [
      { label: 'See Rates', action: 'link', href: '/teachers-profile' },
      { label: 'Apply Today', action: 'modal' }
    ]},
    'payment': { text: '💵 **Payment Information:**\n\n💳 Competitive Rates: $15-25+ per hour\n📅 Weekly/Monthly payments\n🏦 Direct bank transfer or PayPal\n📝 Transparent billing system\n✅ No hidden fees\n🎯 Performance bonuses available\n\nRates vary based on:\n- Your experience level\n- Student level/demand\n- Subject specialization\n- Teaching location', buttons: [
      { label: 'View All Accounts', action: 'link', href: '/teachers-profile' },
      { label: 'Start Application', action: 'modal' }
    ]},
    'schedule': { text: '⏰ **Schedule Flexibility:**\n\n✅ Choose your own hours\n✅ Part-time or full-time options\n✅ Multiple shift times available\n✅ Minimum 5 hours/week commitment\n✅ Can adjust hours anytime\n✅ Perfect for students, professionals, or full-time teachers\n✅ Holiday breaks available\n✅ No 9-5 commitment\n\nWe have students in different time zones so you can find slots that work for you!', buttons: [
      { label: 'View Opportunities', action: 'link', href: '/teachers-profile' },
      { label: 'Apply', action: 'modal' }
    ]},
    'countries': { text: '🌏 **Countries & Languages We Offer:**\n\n🇯🇵 Japan - Japanese Students\n🇰🇷 Korea - Korean Students\n🇨🇳 China - Chinese Students\n🇹🇭 Thailand - Thai Students\n🇻🇳 Vietnam - Vietnamese Students\n + Many more across Asia!\n\nEach market has different student levels and teaching styles. Experienced teachers can specialize!', buttons: [
      { label: 'See All Courses', action: 'link', href: '/teachers-profile' },
      { label: 'Apply Now', action: 'modal' }
    ]},
    'experience': { text: '👨‍🏫 **Teaching Experience Needed:**\n\n**Minimum:** 1-2 years teaching experience preferred\n**BUT:** We welcome passionate educators with less experience!\n\n📚 Your experience can include:\n✓ Professional ESL/EFL teaching\n✓ Tutoring\n✓ Corporate training\n✓ Classroom teaching\n✓ Online teaching\n✓ Even community volunteering\n\n**New to teaching?** We provide full training and mentorship!', buttons: [
      { label: 'Start Application', action: 'modal' },
      { label: 'Learn More', action: 'link', href: '/about' }
    ]},
    'training': { text: '🎓 **Support & Training Provided:**\n\n📖 Comprehensive onboarding program\n👨‍🏫 Mentorship from experienced teachers\n📹 Video tutorials & resources\n📋 Lesson planning support\n💬 Active community forum\n📞 24/7 technical support\n🎯 Regular feedback & coaching\n📈 Professional development opportunities\n🤝 Peer learning network\n✅ Quality assurance team\n\nOur goal is your success!', buttons: [
      { label: 'Get Started', action: 'modal' },
      { label: 'Contact Support', action: 'link', href: '/contact' }
    ]},
    'apply': { text: '📝 **Application Process:**\n\n**Step 1:** Fill out your profile (5 mins)\n**Step 2:** Submit application form\n**Step 3:** Our team reviews (2-3 days)\n**Step 4:** Interview call (if selected)\n**Step 5:** Trial lesson\n**Step 6:** Start teaching!\n\n✅ Simple & straightforward\n✅ Fast approval process\n✅ Support at every step', buttons: [
      { label: 'Fill Application Form', action: 'modal' },
      { label: 'View Jobs', action: 'link', href: '/teachers-profile' }
    ]},
    'certificate': { text: '📜 **Do I Need a Teaching Certificate?**\n\n✅ **Certificates We Accept:**\n- TEFL / TESOL / TEYL\n- DELTA\n- Master\'s in Education/Linguistics\n- Bachelor\'s in Education\n- Other ESL/EFL certifications\n\n❓ **Don\'t Have One?**\nCertificates are highly preferred but not always mandatory. Your experience and passion matter too!\n\n💡 Consider getting certified - it increases earning potential!', buttons: [
      { label: 'Apply Now', action: 'modal' },
      { label: 'View Opportunities', action: 'link', href: '/teachers-profile' }
    ]},
    'student': { text: '👨‍🎓 **Who Are Our Students?**\n\n👶 Young learners (5-12 years)\n👦 Teenagers (13-17 years)\n👨‍💼 Adults & professionals\n🎯 Various English levels (A1-C2)\n📚 Different learning goals:\n- Conversation practice\n- Business English\n- Exam preparation (IELTS, TOEFL)\n- General English\n- Specialized courses\n\nYou\'ll work with diverse, motivated international students!', buttons: [
      { label: 'View All Courses', action: 'link', href: '/teachers-profile' },
      { label: 'Apply', action: 'modal' }
    ]},
    'hours': { text: '⏰ Our teachers work flexible hours that fit their schedules. We have various shift times to accommodate part-time and full-time teaching. Most teachers work:\\n\\n🌅 Morning hours (6am-12pm)\\n☀️ Afternoon hours (12pm-6pm)\\n🌙 Evening hours (6pm-11pm)\\n🌃 Late night hours (available)\\n\\nFind teachers that match your learning needs!', buttons: [
      { label: 'Meet Our Teachers', action: 'link', href: '/teachers-profile' },
      { label: 'Get Started', action: 'modal' }
    ]},
    'courses': { text: '🎓 We have experienced ESL teachers from Japanese, Korean, Chinese, Thai, Vietnamese, and more! Each brings unique specializations. Check our Teachers Profile page for details.', buttons: [
      { label: 'View All Teachers', action: 'link', href: '/teachers-profile' },
      { label: 'Apply Now', action: 'modal' }
    ]},
    'account': { text: '📊 Our teachers typically offer $15-25+ per hour, flexible scheduling, and access to international students. Would you like more details?', buttons: [
      { label: 'Meet Our Teachers', action: 'link', href: '/teachers-profile' },
      { label: 'I\'m Interested', action: 'modal' }
    ]},
    'teaching': { text: '✅ Yes! We connect students with experienced ESL teachers across Asia. We have teachers from Japan, Korea, China, Thailand, Vietnam, and more. Perfect for all learning levels!', buttons: [
      { label: 'Meet Our Teachers', action: 'link', href: '/teachers-profile' },
      { label: 'Apply', action: 'modal' }
    ]},
    'opportunity': { text: '🎯 Great! We have experienced teachers available for various specialties. Visit our Teachers Profile page to learn more. Each brings unique skills and experience.', buttons: [
      { label: 'Browse Teachers', action: 'link', href: '/teachers-profile' },
      { label: 'I\'m Interested', action: 'modal' }
    ]},
    'earn': { text: '💰 Our teachers earn $15-25+ per hour with flexible scheduling. Experienced educators can earn even higher rates! Earnings depend on hours and performance.', buttons: [
      { label: 'Meet Teachers', action: 'link', href: '/teachers-profile' },
      { label: 'Apply Now', action: 'modal' }
    ]},
    'contact': { text: '📧 You can reach us at support@echoverse.com or use our Contact page for more information. We\'re here to help! You can also ask questions right here in the chat.', buttons: [
      { label: 'Contact Us', action: 'link', href: '/contact' },
      { label: 'I\'m Interested', action: 'modal' }
    ]},
    'thanks': { text: '😊 You\'re welcome! Is there anything else I can help you with? Feel free to ask about requirements, benefits, pay, or anything else!', buttons: [
      { label: 'Meet Our Teachers', action: 'link', href: '/teachers-profile' },
      { label: 'More Info', action: 'link', href: '/about' }
    ]},
    'help': { text: '🤝 I can assist you with:\n✅ Requirements to teach\n✅ Qualifications & certificates\n✅ Payment & earnings\n✅ Schedule flexibility\n✅ Application process\n✅ Training & support\n✅ Benefits\n✅ Teacher profiles\n\nWhat would you like to know?', buttons: [
      { label: 'Meet Our Teachers', action: 'link', href: '/teachers-profile' },
      { label: 'Start Application', action: 'modal' }
    ]},
    'about': { text: '🌍 **About Echoverse:**\n\nEchoverse is a leading ESL teaching platform connecting passionate educators from around the world with international students. We started in Antique, Philippines, and now connect teachers globally with students in Asia.\n\n🎯 Our Mission: Make quality English education accessible worldwide while providing teachers with flexible, rewarding opportunities.', buttons: [
      { label: 'Learn More', action: 'link', href: '/about' },
      { label: 'I\'m Interested', action: 'modal' }
    ]},
    'interested': { text: '🎉 Fantastic! Let\'s get you started on your journey with Echoverse. Fill out the application form and our team will review it within 2-3 business days!', buttons: [
      { label: 'Fill Application Form', action: 'modal' },
      { label: 'View Courses', action: 'link', href: '/teachers-profile' }
    ]},
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '' || isProcessing) return;
    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    processMessage(inputValue);
  };

  const processMessage = (input: string) => {
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
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
          { label: 'View Courses', action: 'link', href: '/teachers-profile' }
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
      
      setIsProcessing(false);
    }, 500);
  };

  const handleQuickInquiry = (keyword: string) => {
    if (isProcessing) return;
    
    // Toggle accordion - if clicking the same keyword, close it
    if (openSectionKeyword === keyword) {
      setOpenSectionKeyword(null);
      return;
    }
    
    // Open the new section
    setOpenSectionKeyword(keyword);
  };

  const handleButtonClick = (button: { label: string; action: 'link' | 'modal'; href?: string; keyword?: string }) => {
    if (isProcessing) return;
    if (button.action === 'link' && button.href) {
      window.location.href = button.href;
    } else if (button.action === 'modal' && button.keyword) {
      handleQuickInquiry(button.keyword);
    } else if (button.action === 'modal') {
      setShowApplicationModal(true);
    }
  };

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
        agreed_to_terms: false,
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
      {/* Hero Section */}
      <section className="bg-linear-to-b from-slate-50 to-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <div className="space-y-3">
              <p className="text-sm font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider">Welcome to Echoverse Online Tutorials</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Teach English,<br />Earn Premium Income
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed">
              Join thousands of ESL educators earning flexible income teaching international students across Asia. Start your journey with Echoverse Online Tutorials Services today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="#accounts-available" className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition transform hover:scale-105">
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
      <section id="home" className="py-24 bg-linear-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Why Join Echoverse?</h2>
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

      {/* Statistics Section */}
      <section className="py-24 bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
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
            <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">What Teachers Say</h2>
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

      {/* Detailed Journey Timeline */}
      <section className="py-24 bg-linear-to-br from-purple-50 via-white to-pink-50">
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

      {/* CTA Section */}
      <section className="bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Earn Premium Income Teaching English?</h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join Echoverse Online Tutorials Services and connect with thousands of eager international learners. Quick approval, flexible scheduling, premium pay.
          </p>
          <Link href="/teachers-profile" className="inline-block px-10 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition transform hover:scale-105">
            Get Started Now →
          </Link>
        </div>
      </section>

      {/* Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        {isChatOpen && (
          <div className="mb-4 w-96 max-w-[calc(100vw-2rem)] bg-white border-2 border-gray-300 rounded-2xl shadow-2xl flex flex-col max-h-screen min-h-96">
            <div className="bg-black text-white rounded-t-2xl p-4 flex justify-between items-center border-b-2 border-gray-300">
              <div>
                <h3 className="font-bold text-lg">Echoverse Support</h3>
                <p className="text-xs text-gray-300">Ask me anything! 👋</p>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-gray-800 rounded-lg p-2 transition text-xl font-bold">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar" style={{scrollBehavior: 'smooth'}}>
              {openSectionKeyword ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setOpenSectionKeyword(null)}
                    className="text-left px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold text-sm transition rounded-lg hover:bg-gray-100"
                  >
                    ← Back to Menu
                  </button>
                  <div className="bg-gray-100 text-gray-900 border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-medium rounded-bl-none whitespace-pre-wrap">
                    {autoReplies[openSectionKeyword as keyof typeof autoReplies]?.text || 'Loading...'}
                  </div>
                  {autoReplies[openSectionKeyword as keyof typeof autoReplies]?.buttons && (
                    <div className="flex flex-col gap-2 mt-2">
                      {autoReplies[openSectionKeyword as keyof typeof autoReplies]?.buttons?.map((button: { label: string; action: 'link' | 'modal'; href?: string }, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleButtonClick(button)}
                          disabled={isProcessing}
                          className={`w-full text-left px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs rounded-lg transition font-semibold shadow-sm ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:shadow-md'}`}
                        >
                          {button.action === 'link' ? '🔗 ' : '📝 '}{button.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} flex-col gap-2`}>
                      <div className={`max-w-xs px-4 py-3 rounded-xl text-sm font-medium ${msg.sender === 'user' ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 border-2 border-gray-300 rounded-bl-none'}`}>
                        {msg.text}
                      </div>
                      {msg.buttons && msg.sender === 'bot' && (
                        <div className="flex flex-col gap-2 w-full">
                          {msg.buttons.map((button, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleButtonClick(button)}
                              disabled={isProcessing}
                              className={`w-full text-left px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs rounded-lg transition font-semibold shadow-sm ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:shadow-md'}`}
                            >
                              {button.action === 'link' ? '🔗 ' : '📝 '}{button.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                  disabled={isProcessing}
                  className={`text-white px-5 py-2.5 rounded-lg font-bold text-sm border transition shadow-sm ${isProcessing ? 'bg-gray-600 border-gray-500 cursor-not-allowed opacity-70' : 'bg-black border-gray-600 hover:bg-gray-800 hover:shadow-md'}`}
                >
                  {isProcessing ? '...' : 'Send'}
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
              <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Application Form</h2>
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

              <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                <button type="submit" disabled={applicationLoading || !applicationData.agreed_to_terms} className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
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
