'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTeachersProfiles } from '@/hooks/useProfileManagement';
import type { TeacherProfile } from '@/hooks/useProfileManagement';

export default function TeachersPublicPage() {
  const { data: teachers, loading, error } = useTeachersProfiles();
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);
  const [sortBy, setSortBy] = useState('rating');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterExperience, setFilterExperience] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');

  const filteredAndSortedTeachers = useMemo(() => {
    // Filter teachers
    let result = teachers.filter(teacher => {
      const matchesSearch = 
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.qualification?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.bio?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesExperience = 
        filterExperience === 'all' || 
        (filterExperience === 'beginner' && (teacher.experience_years || 0) < 3) ||
        (filterExperience === 'intermediate' && (teacher.experience_years || 0) >= 3 && (teacher.experience_years || 0) < 8) ||
        (filterExperience === 'expert' && (teacher.experience_years || 0) >= 8);
      
      const matchesAvailability = 
        filterAvailability === 'all' ||
        (teacher.availability?.toLowerCase() || 'flexible').includes(filterAvailability.toLowerCase());
      
      return matchesSearch && matchesExperience && matchesAvailability;
    });

    // Sort teachers
    result.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 4.5) - (a.rating || 4.5);
      if (sortBy === 'experience') return (b.experience_years || 0) - (a.experience_years || 0);
      if (sortBy === 'lessons') return (b.lessons_completed || 0) - (a.lessons_completed || 0);
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [teachers, searchQuery, sortBy, filterExperience, filterAvailability]);

  const sortedTeachers = filteredAndSortedTeachers;

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-md">
          <p className="text-red-800 font-semibold">Error loading teachers</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Meet Our Expert Teachers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our qualified ESL teachers offering flexible schedules and personalized learning experiences. Find the perfect teacher for your English learning journey.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search teachers by name, qualification, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition text-lg"
          />
        </div>

        {/* Filters & Sort */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="name">Name (A-Z)</option>
                <option value="rating">Highest Rated</option>
                <option value="lessons">Most Lessons</option>
                <option value="experience">Most Experience</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Experience Level</label>
              <select
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">&lt; 3 years</option>
                <option value="intermediate">3-8 years</option>
                <option value="expert">8+ years</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Availability</label>
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="flexible">Flexible</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center h-12 md:col-span-2">
              <div className="text-sm font-semibold text-gray-700">
                {loading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : (
                  <span className="text-purple-600">
                    {sortedTeachers.length} of {teachers.length} teacher{sortedTeachers.length !== 1 ? 's' : ''} found
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedTeachers.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {sortedTeachers.map(teacher => {
              // Extract experience level badge
              const yearsExperience = teacher.experience_years || 0;
              const expLevel = yearsExperience >= 8 ? 'Expert' : yearsExperience >= 3 ? 'Intermediate' : 'Beginner';
              const expColor = yearsExperience >= 8 ? 'bg-emerald-100 text-emerald-700' : yearsExperience >= 3 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700';

              return (
                <div
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-8 cursor-pointer border-t-4 border-purple-500 group relative overflow-hidden"
                >
                  {/* Background accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-3xl -z-10 group-hover:bg-purple-100 transition"></div>

                  {/* Trust Badge */}
                  {(teacher.rating || 0) >= 4.8 && (
                    <div className="absolute top-4 right-4 bg-amber-50 border-2 border-amber-300 rounded-full p-2" title="Top Rated">
                      <span className="text-sm font-bold text-amber-700">★ Top Rated</span>
                    </div>
                  )}

                  {/* Teacher Avatar/Image */}
                  <div className="relative w-20 h-20 mb-4 group-hover:scale-110 transition">
                    {teacher.image ? (
                      <Image
                        src={`/teachers/${teacher.image}`}
                        alt={teacher.name || 'Teacher'}
                        fill
                        className="rounded-full object-cover shadow-lg"
                        sizes="80px"
                        priority={false}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
                        {teacher.name?.charAt(0) || '👨'}
                      </div>
                    )}
                  </div>

                  {/* Experience Badge */}
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${expColor}`}>
                    {expLevel} • {yearsExperience} yrs
                  </div>

                  {/* Teacher Name & Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{teacher.name}</h3>
                  <p className="text-purple-600 font-semibold text-sm mb-4">{teacher.qualification || 'Certified Teacher'}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">⭐</span>
                    <span className="text-lg font-bold text-gray-900">{(teacher.rating || 4.5).toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({(teacher.lessons_completed || 0).toLocaleString()} lessons)</span>
                  </div>

                  {/* Spec Divider */}
                  <div className="border-t-2 border-gray-100 my-4"></div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <p className="text-gray-600 text-xs font-semibold">🌍 Languages</p>
                      <p className="font-bold text-gray-900 text-xs mt-1">{teacher.language || 'English'}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg">
                      <p className="text-gray-600 text-xs font-semibold">🕐 Availability</p>
                      <p className="font-bold text-gray-900 text-xs mt-1">{teacher.availability || 'Flexible'}</p>
                    </div>
                  </div>

                  {/* Bio Preview */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2 min-h-10">{teacher.bio || 'Experienced educator'}</p>

                  {/* CTA Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTeacher(teacher);
                      }}
                      className="flex-1 py-3 px-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition shadow-md hover:shadow-lg"
                    >
                      View Profile
                    </button>
                    <Link
                      href="/contact"
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition"
                      title="Book a lesson with this teacher"
                    >
                      📅
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg font-semibold">No teachers found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Modal - Teacher Details */}
      {selectedTeacher && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTeacher(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white p-8 flex justify-between items-start relative">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative w-16 h-16">
                    {selectedTeacher.image ? (
                      <Image
                        src={`/teachers/${selectedTeacher.image}`}
                        alt={selectedTeacher.name || 'Teacher'}
                        fill
                        className="rounded-full object-cover shadow-lg"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
                        {selectedTeacher.name?.charAt(0) || '👨'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{selectedTeacher.name}</h2>
                    <p className="text-purple-100">{selectedTeacher.qualification || 'Certified Teacher'}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="text-white hover:text-gray-200 text-2xl p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-purple-50 p-4 rounded-xl text-center border-l-4 border-purple-500">
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Rating</p>
                  <p className="text-3xl font-bold text-purple-600">⭐ {(selectedTeacher.rating || 4.5).toFixed(1)}</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-xl text-center border-l-4 border-pink-500">
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Lessons</p>
                  <p className="text-3xl font-bold text-pink-600">{(selectedTeacher.lessons_completed || 0).toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Experience</p>
                  <p className="text-3xl font-bold text-blue-600">{selectedTeacher.experience_years || 5} yrs</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl text-center border-l-4 border-emerald-500">
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Availability</p>
                  <p className="text-lg font-bold text-emerald-600">{selectedTeacher.availability || 'Flexible'}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border-l-4 border-gray-400">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">📞 Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                    <a href={`mailto:${selectedTeacher.email}`} className="text-purple-600 font-semibold hover:underline text-lg">
                      {selectedTeacher.email}
                    </a>
                  </div>
                  {selectedTeacher.phone && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Phone</p>
                      <a href={`tel:${selectedTeacher.phone}`} className="text-purple-600 font-semibold hover:underline text-lg">
                        {selectedTeacher.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Details */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-400">
                  <p className="text-sm text-gray-600 font-semibold mb-2">🌍 Languages</p>
                  <p className="text-gray-900 font-semibold text-lg">{selectedTeacher.language || 'English'}</p>
                </div>
                <div className="bg-green-50 p-5 rounded-xl border-l-4 border-green-400">
                  <p className="text-sm text-gray-600 font-semibold mb-2">🕐 Availability</p>
                  <p className="text-gray-900 font-semibold text-lg">{selectedTeacher.availability || 'Flexible'}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-purple-50 p-6 rounded-xl mb-6 border-l-4 border-purple-400">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">👤 Professional Bio</h3>
                <p className="text-gray-800 leading-relaxed text-base">{selectedTeacher.bio || 'Experienced educator'}</p>
              </div>

              {/* Story */}
              {selectedTeacher.story && (
                <div className="bg-linear-to-r from-pink-50 to-purple-50 p-6 rounded-xl border-l-4 border-pink-400 mb-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">📖 Personal Story</h3>
                  <p className="text-gray-800 leading-relaxed italic text-base">{selectedTeacher.story}</p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <Link
                  href="/contact"
                  className="flex-1 block text-center py-4 px-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition shadow-lg text-lg"
                >
                  📅 Book a Lesson
                </Link>
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
