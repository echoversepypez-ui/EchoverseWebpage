'use client';

import Link from 'next/link';
import { StatsCard } from '@/components/StatsCard';
import { BenefitCard } from '@/components/BenefitCard';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-lg">🎓</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Echoverse</span>
            </Link>
            <div className="hidden md:flex space-x-1">
              <Link href="/" className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition font-medium">Home</Link>
              <Link href="/courses" className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition font-medium">Teaching Accounts</Link>
              <Link href="/about" className="px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold">About</Link>
              <Link href="/contact" className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-24">
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
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Our Mission</h2>
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
            <StatsCard icon="👥" number="500+" label="Active Teachers" />
            <StatsCard icon="👨‍🎓" number="12,000+" label="Students Taught" />
            <StatsCard icon="🌍" number="8+" label="Countries Served" />
            <StatsCard icon="⭐" number="4.9/5" label="Average Rating" />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center mb-16">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Maria Santos', role: 'Founder & CEO', bio: 'ESL educator with 10+ years of experience building educational platforms' },
              { name: 'Juan Dela Cruz', role: 'Operations Manager', bio: 'Passionate about teacher support and ensuring educator success' },
              { name: 'Ana Reyes', role: 'Community Manager', bio: 'Building meaningful relationships with educators and students worldwide' },
            ].map((member, i) => (
              <div key={i} className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-purple-500 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
                <div className="text-6xl mb-4 group-hover:scale-110 transition duration-300">👤</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="font-semibold text-purple-600 mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center mb-16">Our Core Values</h2>
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

      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Join Our Growing Community</h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">Start earning money teaching English to passionate international students today.</p>
          <Link href="/courses" className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition transform hover:scale-105">
            View Teaching Opportunities →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
