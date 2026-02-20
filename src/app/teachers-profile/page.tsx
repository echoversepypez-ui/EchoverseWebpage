'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Footer } from '@/components/Footer';

type TeacherProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  qualification?: string;
  experience_years?: number;
  language?: string;
  rating?: number;
  lessons_completed?: number;
  bio?: string;
  story?: string;
  availability?: string;
  created_at: string;
  updated_at: string;
};

export default function TeachersProfilePage() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*')
        .order('rating', { ascending: false });

      if (error || !data) {
        console.error('Error loading teachers:', error);
        setLoading(false);
        return;
      }

      setTeachers(data as TeacherProfile[]);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.qualification?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.language?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage =
      filterLanguage === 'all' ||
      teacher.language?.toLowerCase().includes(filterLanguage.toLowerCase());

    return matchesSearch && matchesLanguage;
  });

  const allLanguages = Array.from(
    new Set(teachers.map(t => t.language).filter(Boolean))
  );

  const getStarRating = (rating?: number) => {
    const r = rating || 0;
    return '⭐'.repeat(Math.floor(r)) + (r % 1 > 0 ? '✨' : '');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-linear-to-b from-purple-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Our Experienced Teachers
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet our talented team of certified ESL educators from around the world. Each teacher is carefully vetted and brings years of teaching experience.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div>
              <input
                type="text"
                placeholder="Search by name, qualification, or language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Filter by Language</label>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition"
              >
                <option value="all">All Languages</option>
                {allLanguages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading teacher profiles...</p>
            </div>
          ) : filteredTeachers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-purple-400 overflow-hidden"
                >
                  {/* Avatar/Icon */}
                  <div className="h-48 bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center text-7xl">
                    {teacher.name?.charAt(0).toUpperCase() || '👨‍🏫'}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{teacher.name}</h3>
                      
                      {/* Rating */}
                      {teacher.rating && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">{getStarRating(teacher.rating)}</span>
                          <span className="text-sm font-semibold text-gray-700">{teacher.rating}/5</span>
                        </div>
                      )}

                      {/* Qualification Badge */}
                      {teacher.qualification && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                            {teacher.qualification}
                          </span>
                        </div>
                      )}

                      {/* Bio */}
                      {teacher.bio && (
                        <p className="text-gray-700 text-sm leading-relaxed">{teacher.bio}</p>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                      {teacher.experience_years !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-bold text-gray-900">{teacher.experience_years}+ years</span>
                        </div>
                      )}

                      {teacher.language && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Language:</span>
                          <span className="font-bold text-purple-600">{teacher.language}</span>
                        </div>
                      )}

                      {teacher.lessons_completed !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lessons:</span>
                          <span className="font-bold text-gray-900">{teacher.lessons_completed}</span>
                        </div>
                      )}

                      {teacher.availability && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Availability:</span>
                          <span className="font-bold text-green-600">{teacher.availability}</span>
                        </div>
                      )}
                    </div>

                    {/* Story */}
                    {teacher.story && (
                      <div className="mb-6">
                        <p className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">About</p>
                        <p className="text-gray-700 text-sm leading-relaxed italic">{teacher.story}</p>
                      </div>
                    )}

                    {/* CTA Button */}
                    <button className="w-full px-4 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600 mb-4">No teachers found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterLanguage('all');
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Showing {filteredTeachers.length} of {teachers.length} teacher{teachers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-br from-purple-50 to-pink-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Become a Teacher
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our growing community of ESL educators and earn premium income teaching international students.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition"
          >
            Apply to Teach with Us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
