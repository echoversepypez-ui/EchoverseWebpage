'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AdminHeader } from '@/components/AdminHeader';
import { ProtectedRoute } from '@/components/protected-route';

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  permissions: string[];
  bio: string;
  created_at: string;
  last_login: string;
  managed_accounts: number;
  active_contacts: number;
  status: 'active' | 'inactive';
}

export default function AdminProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [profile, setProfile] = useState<AdminProfile>({
    id: 'admin_001',
    name: 'Alex Thompson',
    email: 'admin@echoverse.com',
    phone: '+1-555-123-4567',
    role: 'Super Admin',
    department: 'Administration',
    permissions: ['manage_users', 'manage_teaching_accounts', 'manage_applications', 'manage_contacts', 'system_settings', 'analytics'],
    bio: 'Senior administrator responsible for overseeing platform operations, user management, and system maintenance. Ensuring platform security and optimal performance.',
    created_at: '2023-06-01',
    last_login: '2024-02-18',
    managed_accounts: 1250,
    active_contacts: 485,
    status: 'active',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'managed_accounts' || name === 'active_contacts' ? parseInt(value) : value,
    });
  };

  const handleSaveChanges = () => {
    setProfile(formData);
    setIsEditing(false);
    alert('Admin profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
        <AdminHeader 
          title="👤 Admin Profile" 
          subtitle="Manage your admin account and preferences"
          backHref="/admin/dashboard"
        />

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  isEditing
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                profile.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                Status: {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
              </span>
            </div>

            {/* Profile Content */}
            {!isEditing ? (
              <div className="space-y-6">
                {/* Admin Information */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Full Name</p>
                      <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="text-lg font-semibold text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="text-lg font-semibold text-gray-900">{profile.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Role</p>
                      <p className="text-lg font-semibold text-gray-900">{profile.role}</p>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Department</p>
                      <p className="text-lg font-semibold text-gray-900">{profile.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Member Since</p>
                      <p className="text-lg font-semibold text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Last Login</p>
                      <p className="text-lg font-semibold text-gray-900">{new Date(profile.last_login).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Permissions</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {profile.permissions.map((permission, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-700 capitalize">{permission.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Bio</h2>
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </div>

                {/* Management Stats */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Management Overview</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Managed Teacher Profiles</p>
                      <p className="text-3xl font-bold text-purple-600">{profile.managed_accounts}</p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Active Contacts</p>
                      <p className="text-3xl font-bold text-pink-600">{profile.active_contacts}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Account Status</p>
                      <p className="text-lg font-bold text-blue-600 capitalize">{profile.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form className="space-y-6">
                {/* Edit Admin Information */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Admin Information</h2>
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Edit Job Details */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Job Details</h2>
                  <div className="grid md:grid-cols-2 gap-4">
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
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Managed Accounts</label>
                      <input
                        type="number"
                        name="managed_accounts"
                        value={formData.managed_accounts}
                        onChange={handleInputChange}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Edit Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
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
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
