'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface StaffProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  specialization: string;
  responsibilities: string[];
  bio: string;
  story: string;
  availability: string;
  created_at: string;
  support_tickets_resolved: number;
  customer_satisfaction: number;
  status: 'active' | 'on-leave' | 'inactive';
}

export default function StaffProfilePage() {
  const { isAdmin } = useAuth();
  const [profile, setProfile] = useState<StaffProfile>({
    id: 'staff_001',
    name: 'Maria Rodriguez',
    email: 'maria@echoverse.com',
    phone: '+1-555-789-0123',
    position: 'Customer Support Specialist',
    department: 'Support & Success',
    specialization: 'Teacher Onboarding & Training',
    responsibilities: [
      'Respond to teacher inquiries and support tickets',
      'Onboard new teachers',
      'Provide technical assistance to platform users',
      'Maintain customer support documentation',
      'Monitor and improve support metrics',
    ],
    bio: 'Dedicated customer success specialist with 6 years of experience in EdTech. Passionate about helping teachers succeed.',
    story: 'Hi! I\'m Maria from the Support & Success team. My passion is helping educators thrive on our platform. With 6 years in EdTech, I\'ve learned that great support is about understanding your needs and delivering solutions quickly. I love connecting with teachers and turning their challenges into success stories!',
    availability: 'Monday - Friday, 9 AM - 6 PM EST',
    created_at: '2023-09-10',
    support_tickets_resolved: 1847,
    customer_satisfaction: 4.7,
    status: 'active',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!isAdmin) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'support_tickets_resolved' ? parseInt(value) : name === 'customer_satisfaction' ? parseFloat(value) : value,
    });
  };

  const handleSaveChanges = () => {
    if (!isAdmin) return;
    setProfile(formData);
    setIsEditing(false);
    alert('Staff profile updated successfully!');
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
              <h1 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Staff Profile</h1>
              <p className="text-gray-600 text-lg">Support excellence through dedicated team members</p>
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
                : profile.status === 'on-leave'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {profile.status === 'active' && '🟢'} Status: {profile.status === 'on-leave' ? 'On Leave' : profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
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
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="bg-purple-50 p-6 rounded-xl text-center border-2 border-purple-200 hover:shadow-lg transition">
                  <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide font-semibold">Tickets Resolved</p>
                  <p className="text-4xl font-bold text-purple-600">{profile.support_tickets_resolved.toLocaleString()}</p>
                </div>
                <div className="bg-pink-50 p-6 rounded-xl text-center border-2 border-pink-200 hover:shadow-lg transition">
                  <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide font-semibold">Satisfaction</p>
                  <p className="text-4xl font-bold text-pink-600">{profile.customer_satisfaction}★</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl text-center border-2 border-blue-200 hover:shadow-lg transition md:col-span-1 col-span-2">
                  <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide font-semibold">Team Since</p>
                  <p className="text-lg font-bold text-blue-600">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">👤</span> Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Full Name</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
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
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Availability</p>
                    <p className="text-xl font-bold text-gray-900">{profile.availability}</p>
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">💼</span> Job Information
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Position</p>
                    <p className="text-xl font-bold text-gray-900">{profile.position}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Department</p>
                    <p className="text-xl font-bold text-gray-900">{profile.department}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Specialization</p>
                    <p className="text-xl font-bold text-gray-900">{profile.specialization}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Member Since</p>
                    <p className="text-xl font-bold text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">✓</span> Key Responsibilities
                </h2>
                <ul className="space-y-3">
                  {profile.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-purple-600 font-bold text-xl">✓</span>
                      <span className="text-gray-700 text-lg leading-relaxed">{responsibility}</span>
                    </li>
                  ))}
                </ul>
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
                <label className="block text-sm font-semibold text-gray-700 mb-3">Share your support journey</label>
                <textarea
                  name="story"
                  value={formData.story}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tell a compelling story about your journey, what you love about helping others, and your approach to support..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Edit Contact Information */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">👤</span> Edit Contact Information
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Edit Job Information */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">💼</span> Edit Job Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Edit Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : isAdmin ? (
            <form className="space-y-6">
              {/* Edit Contact Information */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2\">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2\">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Edit Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2\">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4\">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800">
              <p className="font-semibold">✓ Profile is read-only</p>
              <p className="text-sm mt-1">Contact an admin to request editing permissions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
