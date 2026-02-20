'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  qualification: string;
  experience_years: number;
  hourly_rate: number;
  bio: string;
  story: string;
  availability: string;
  created_at: string;
  lessons_completed: number;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
}

export default function TeacherProfilePage() {
  const { isAdmin } = useAuth();
  const [profile, setProfile] = useState<TeacherProfile>({
    id: 'teacher_001',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1-234-567-8900',
    country: 'United States',
    qualification: 'TESOL Certified',
    experience_years: 5,
    hourly_rate: 25,
    bio: 'Experienced ESL teacher with a passion for helping students achieve their language goals.',
    story: 'Hi! I\'m Teacher Sarah. My journey in education started when I realized how much joy comes from helping someone break through language barriers. After earning my TESOL certification, I\'ve dedicated the last 5 years to making English learning engaging and effective for students worldwide.',
    availability: 'Part-time (Weekends)',
    created_at: '2024-01-15',
    lessons_completed: 156,
    rating: 4.8,
    status: 'active',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!isAdmin) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'experience_years' || name === 'hourly_rate' || name === 'lessons_completed' ? parseInt(value) : name === 'rating' ? parseFloat(value) : value,
    });
  };

  const handleSaveChanges = () => {
    if (!isAdmin) return;
    setProfile(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 pt-20">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Teacher Profile</h1>
              <p className="text-gray-600 text-lg">Excellence in teaching starts with knowing your educator</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-8 py-3 rounded-lg font-semibold transition whitespace-nowrap ml-4 ${
                  isEditing
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                }`}
              >
                {isEditing ? '✕ Cancel Editing' : '✎ Edit Profile'}
              </button>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3 mb-8">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              profile.status === 'active'
                ? 'bg-green-100 text-green-800'
                : profile.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {profile.status === 'active' && '🟢'} Status: {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
            </span>
          </div>

          {/* Profile Content */}
          {!isEditing ? (
            <div className="space-y-8">
              {/* Personal Story Section */}
              <div className="bg-linear-to-br from-purple-50 to-pink-50 p-8 rounded-xl border-2 border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-3xl">📖</span> My Story
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg italic">{profile.story}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 p-6 rounded-xl text-center border-2 border-purple-200 hover:shadow-lg transition">
                  <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide font-semibold">Lessons Completed</p>
                  <p className="text-4xl font-bold text-purple-600">{profile.lessons_completed}</p>
                </div>
                <div className="bg-pink-50 p-6 rounded-xl text-center border-2 border-pink-200 hover:shadow-lg transition">
                  <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide font-semibold">Rating</p>
                  <p className="text-4xl font-bold text-pink-600">{profile.rating}★</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl text-center border-2 border-blue-200 hover:shadow-lg transition">
                  <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide font-semibold">Member Since</p>
                  <p className="text-lg font-bold text-blue-600">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">👤</span> Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Full Name</p>
                    <p className="text-xl font-bold text-gray-900">{profile.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Email</p>
                    <p className="text-xl font-bold text-gray-900 break-all">{profile.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Phone</p>
                    <p className="text-xl font-bold text-gray-900">{profile.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Country</p>
                    <p className="text-xl font-bold text-gray-900">{profile.country}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">💼</span> Professional Information
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Qualification</p>
                    <p className="text-xl font-bold text-gray-900">{profile.qualification}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Experience</p>
                    <p className="text-xl font-bold text-gray-900">{profile.experience_years} years</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Hourly Rate</p>
                    <p className="text-xl font-bold text-gray-900">${profile.hourly_rate}/hour</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Availability</p>
                    <p className="text-xl font-bold text-gray-900">{profile.availability}</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">✍️</span> Professional Bio
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">{profile.bio}</p>
              </div>
            </div>
          ) : isAdmin ? (
            <form className="space-y-8">
              {/* Edit Personal Story */}
              <div className="bg-linear-to-br from-purple-50 to-pink-50 p-8 rounded-xl border-2 border-purple-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-3xl">📖</span> Edit My Story
                </h2>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Share your teaching journey</label>
                <textarea
                  name="story"
                  value={formData.story}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tell a compelling story about your teaching journey, inspiration, and what drives you..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Edit Personal Information */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">👤</span> Edit Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Edit Professional Information */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">💼</span> Edit Professional Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Qualification</label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (years)</label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($)</label>
                    <input
                      type="number"
                      name="hourly_rate"
                      value={formData.hourly_rate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Part-time (Weekends)"
                    />
                  </div>
                </div>
              </div>

              {/* Edit Bio */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">✍️</span> Edit Professional Bio
                </h2>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Brief professional summary and teaching specializations..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 sticky bottom-0 bg-white p-6 rounded-lg shadow-lg border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:shadow-lg transition"
                >
                  ✓ Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-lg font-bold hover:bg-gray-500 transition"
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl text-amber-900">
              <p className="text-lg font-bold flex items-center gap-2">🔒 Profile is read-only</p>
              <p className="text-sm mt-2">Contact an administrator to request editing permissions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
