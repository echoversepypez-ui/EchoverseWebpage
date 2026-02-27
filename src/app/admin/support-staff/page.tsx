'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AdminHeader } from '@/components/AdminHeader';
import { ProtectedRoute } from '@/components/protected-route';
import { supabase } from '@/lib/supabase';

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

export default function SupportStaffAdminPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<StaffProfile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    specialization: '',
    responsibilities: [],
    bio: '',
    story: '',
    availability: '',
    created_at: new Date().toISOString(),
    support_tickets_resolved: 0,
    customer_satisfaction: 4.5,
    status: 'active',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadStaffMembers();
  }, []);

  const loadStaffMembers = async () => {
    try {
      const { data, error } = await supabase.from('support_staff').select('*');
      if (error) throw error;
      setStaffMembers(data || []);
    } catch (error) {
      console.error('Error loading staff members:', error);
      // For demo, use sample data
      setStaffMembers([
        {
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
            'Provide technical assistance',
          ],
          bio: 'Dedicated customer success specialist with 6 years of experience in EdTech.',
          story: 'Hi! I\'m Maria from the Support & Success team. My passion is helping educators thrive.',
          availability: 'Monday - Friday, 9 AM - 6 PM EST',
          created_at: '2023-09-10',
          support_tickets_resolved: 1847,
          customer_satisfaction: 4.7,
          status: 'active',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('support_staff')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('support_staff').insert([formData]);
        if (error) throw error;
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadStaffMembers();
    } catch (error) {
      console.error('Error saving staff member:', error);
      alert('Error saving staff member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    try {
      const { error } = await supabase.from('support_staff').delete().eq('id', id);
      if (error) throw error;
      loadStaffMembers();
    } catch (error) {
      console.error('Error deleting staff member:', error);
      alert('Error deleting staff member');
    }
  };

  const handleEdit = (staff: StaffProfile) => {
    setEditingId(staff.id);
    setFormData(staff);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      specialization: '',
      responsibilities: [],
      bio: '',
      story: '',
      availability: '',
      created_at: new Date().toISOString(),
      support_tickets_resolved: 0,
      customer_satisfaction: 4.5,
      status: 'active',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'support_tickets_resolved' ? parseInt(value) : name === 'customer_satisfaction' ? parseFloat(value) : value,
    }));
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
        <AdminHeader 
          title="💬 Support Staff" 
          subtitle="Manage support staff profiles and availability"
          backHref="/admin/dashboard"
        />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              {/* Title and subtitle are now in AdminHeader */}
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                resetForm();
              }}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
            >
              + Add New Staff Member
            </button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border-t-4 border-purple-600">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {editingId ? '✏️ Edit Staff Member' : '➕ Add New Staff Member'}
                </h2>
                <p className="text-gray-500 text-sm">Update profile details, contact information, and responsibilities</p>
              </div>
              <form onSubmit={handleSave} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b-2 border-purple-300 pb-2">
                    <span className="text-xl">👤</span>
                    <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
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
                        required
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
                        placeholder="e.g., Monday - Friday, 9 AM - 6 PM EST"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b-2 border-purple-300 pb-2">
                    <span className="text-xl">💼</span>
                    <h3 className="text-lg font-bold text-gray-900">Job Information</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
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
                    <div>
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
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="on-leave">On Leave</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Bio & Story */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b-2 border-purple-300 pb-2">
                    <span className="text-xl">✍️</span>
                    <h3 className="text-lg font-bold text-gray-900">Bio & Story</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Personal Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Brief professional summary..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Personal Story</label>
                    <textarea
                      name="story"
                      value={formData.story}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Tell your story about your journey and what drives you..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b-2 border-purple-300 pb-2">
                    <span className="text-xl">📊</span>
                    <h3 className="text-lg font-bold text-gray-900">Performance Metrics</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Support Tickets Resolved</label>
                      <input
                        type="number"
                        name="support_tickets_resolved"
                        value={formData.support_tickets_resolved}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Satisfaction (0-5)</label>
                      <input
                        type="number"
                        name="customer_satisfaction"
                        value={formData.customer_satisfaction}
                        onChange={handleInputChange}
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : editingId ? '✓ Update Staff Member' : '✓ Add Staff Member'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-6 py-3 bg-gray-300 text-black rounded-lg font-bold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Staff List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Staff Members ({staffMembers.length})</h2>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Loading staff members...</p>
              </div>
            ) : staffMembers.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-600 text-lg mb-4">No staff members yet. Create your first staff member!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {staffMembers.map((staff) => (
                  <div key={staff.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{staff.name}</h3>
                        <p className="text-purple-600 font-semibold">{staff.position}</p>
                        <p className="text-gray-600 text-sm">{staff.department}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(staff)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(staff.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          staff.status === 'active' ? 'bg-green-100 text-green-800' :
                          staff.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {staff.status === 'on-leave' ? 'On Leave' : staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                        </span>
                      </div>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Tickets Resolved</p>
                        <p className="text-lg font-bold text-pink-600">{staff.support_tickets_resolved}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Satisfaction</p>
                        <p className="text-lg font-bold text-blue-600">{staff.customer_satisfaction}★</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 border-t pt-3">
                      <p>{staff.email}</p>
                      <p>{staff.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
