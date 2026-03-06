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
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);

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

  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-linear-to-b from-purple-50 to-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Our Experienced Teachers
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Meet our talented team of certified ESL educators from around the world. Each teacher is carefully vetted and brings years of teaching experience.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div>
              <input
                type="text"
                placeholder="Search by name, qualification, or language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">Filter by Language</label>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition text-sm sm:text-base"
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
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-base sm:text-lg text-gray-600">Loading teacher profiles...</p>
            </div>
          ) : filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-purple-400 overflow-hidden"
                >
                  {/* Avatar/Icon */}
                  <div className="h-36 sm:h-40 lg:h-48 bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center text-4xl sm:text-5xl lg:text-7xl">
                    {teacher.name?.charAt(0).toUpperCase() || '👨‍🏫'}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="mb-3 sm:mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{teacher.name}</h3>
                       
                      {/* Qualification Badge */}
                      {teacher.qualification && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full font-semibold">
                            {teacher.qualification}
                          </span>
                        </div>
                      )}

                      {/* Bio */}
                      {teacher.bio && (
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{teacher.bio}</p>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                      {teacher.experience_years !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">Experience:</span>
                          <span className="font-bold text-gray-900 text-xs sm:text-sm">{teacher.experience_years}+ years</span>
                        </div>
                      )}

                      {teacher.language && (
                        <div className="flex justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">Language:</span>
                          <span className="font-bold text-purple-600 text-xs sm:text-sm">{teacher.language}</span>
                        </div>
                      )}

                      {teacher.availability && (
                        <div className="flex justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">Availability:</span>
                          <span className="font-bold text-green-600 text-xs sm:text-sm">{teacher.availability}</span>
                        </div>
                      )}
                    </div>

                    {/* Story */}
                    {teacher.story && (
                      <div className="mb-4 sm:mb-6">
                        <p className="text-xs font-semibold text-gray-900 mb-1 sm:mb-2 uppercase tracking-wide">About</p>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed italic">{teacher.story}</p>
                      </div>
                    )}

                    {/* CTA Button */}
                    <button 
                      onClick={() => setSelectedTeacher(teacher)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-sm sm:text-base hover:opacity-90 transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-base sm:text-lg text-gray-600 mb-4">No teachers found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterLanguage('all');
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg font-bold text-sm sm:text-base hover:bg-purple-700 transition"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-sm sm:text-base text-gray-600">
              Showing {filteredTeachers.length} of {teachers.length} teacher{teachers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-br from-purple-50 to-pink-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Become a Teacher
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
            Join our growing community of ESL educators and earn premium income teaching international students.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-sm sm:text-base hover:opacity-90 transition"
          >
            Apply to Teach with Us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Teacher Profile Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedTeacher.name}</h2>
                  <p className="text-purple-100">{selectedTeacher.qualification || 'Certified Teacher'}</p>
                </div>
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="text-white hover:text-gray-200 text-2xl p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Teacher Info Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h3 className="font-bold text-purple-900 mb-3">📞 Contact Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Email:</span>{' '}
                      <a href={`mailto:${selectedTeacher.email}`} className="text-purple-600 hover:underline">
                        {selectedTeacher.email}
                      </a>
                    </p>
                    {selectedTeacher.phone && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Phone:</span>{' '}
                        <a href={`tel:${selectedTeacher.phone}`} className="text-purple-600 hover:underline">
                          {selectedTeacher.phone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="font-bold text-blue-900 mb-3">🎓 Professional Details</h3>
                  <div className="space-y-2">
                    {selectedTeacher.experience_years && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Experience:</span> {selectedTeacher.experience_years}+ years
                      </p>
                    )}
                    {selectedTeacher.language && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Languages:</span> {selectedTeacher.language}
                      </p>
                    )}
                    {selectedTeacher.availability && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Availability:</span> {selectedTeacher.availability}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {selectedTeacher.bio && (
                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">📝 Bio</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedTeacher.bio}</p>
                </div>
              )}

              {/* Personal Story */}
              {selectedTeacher.story && (
                <div className="bg-green-50 p-4 rounded-xl mb-6">
                  <h3 className="font-bold text-green-900 mb-3">🌟 Personal Story</h3>
                  <p className="text-gray-700 leading-relaxed italic">{selectedTeacher.story}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <a
                  href={`mailto:${selectedTeacher.email}`}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  📧 Contact Teacher
                </a>
                {selectedTeacher.phone && (
                  <a
                    href={`tel:${selectedTeacher.phone}`}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    📞 Call Teacher
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
