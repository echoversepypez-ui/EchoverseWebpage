'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { supabase } from '@/lib/supabase';

interface TeachingAccount {
  id: string;
  country: string;
  rate_per_hour: number;
  available_slots: number;
  description: string;
  shift: string;
  benefits?: string[];
  is_active: boolean;
  status: string;
  created_at: string;
}

export default function TeachingAccountsAdminPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [accounts, setAccounts] = useState<TeachingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    country: string;
    rate_per_hour: number;
    available_slots: number;
    description: string;
    shift: string;
    benefits: string[];
    is_active: boolean;
    status: string;
  }>({
    country: '',
    rate_per_hour: 0,
    available_slots: 0,
    description: '',
    shift: '',
    benefits: [],
    is_active: true,
    status: 'Active',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const { data, error } = await supabase.from('teaching_accounts').select('*');
      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('teaching_accounts')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from('teaching_accounts').insert([formData]);
        if (error) throw error;
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ country: '', rate_per_hour: 0, available_slots: 0, description: '', shift: '', benefits: [], is_active: true, status: 'Active' });
      loadAccounts();
    } catch (error) {
      console.error('Error saving account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    try {
      const { error } = await supabase.from('teaching_accounts').delete().eq('id', id);
      if (error) throw error;
      loadAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleEdit = (account: TeachingAccount) => {
    setEditingId(account.id);
    setFormData({
      country: account.country,
      rate_per_hour: account.rate_per_hour,
      available_slots: account.available_slots,
      description: account.description,
      shift: account.shift || '',
      benefits: account.benefits || [],
      is_active: account.is_active,
      status: account.status || 'Active',
    });
    setShowForm(true);
  };

  const handleAddBenefit = () => {
    setFormData(prev => ({ ...prev, benefits: [...(prev.benefits || []), ''] }));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...(formData.benefits || [])];
    newBenefits[index] = value;
    setFormData(prev => ({ ...prev, benefits: newBenefits }));
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_, i) => i !== index),
    }));
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
        {/* Navigation */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition">
              🎓 Echoverse
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-purple-600 hover:text-pink-600 font-medium transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-linear-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Teaching Accounts</h1>
              <p className="text-gray-600">Manage teaching accounts and availability</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({ country: '', rate_per_hour: 0, available_slots: 0, description: '', shift: '', benefits: [], is_active: true, status: 'Active' });
              }}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
            >
              + Add New Teaching Account
            </button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border-t-4 border-purple-600">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {editingId ? '✏️ Edit Teaching Account' : '➕ Create New Teaching Account'}
                </h2>
                <p className="text-gray-500 text-sm">Update account details, benefits, and hiring status</p>
              </div>
              <form onSubmit={handleSave} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b-2 border-purple-300 pb-2">
                    <span className="text-xl">📋</span>
                    <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1">Country/Region <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g., Japan, Korea, China"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition bg-gray-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1">Hourly Rate ($) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        placeholder="e.g., 18"
                        value={formData.rate_per_hour}
                        onChange={(e) => setFormData({ ...formData, rate_per_hour: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition bg-gray-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1">Available Slots <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        placeholder="e.g., 5200"
                        value={formData.available_slots}
                        onChange={(e) => setFormData({ ...formData, available_slots: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition bg-gray-50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1">Shift Time <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g., Evening (JPT), Morning (CST)"
                        value={formData.shift}
                        onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition bg-gray-50"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b-2 border-purple-300 pb-2">
                    <span className="text-xl">📝</span>
                    <h3 className="text-lg font-bold text-black">Description</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Account Description <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500 mb-2">Describe the teaching opportunity, target audience, and market details</p>
                    <textarea
                      placeholder="Describe this teaching opportunity, target audience, and market details..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      rows={5}
                      required
                    />
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-gray-300 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⭐</span>
                      <h3 className="text-lg font-bold text-black">Key Benefits</h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddBenefit}
                      className="text-sm bg-linear-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition font-semibold shadow-md"
                    >
                      + Add Benefit
                    </button>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {(formData.benefits || []).length === 0 ? (
                      <p className="text-gray-500 italic text-sm py-6 text-center">No benefits added yet. Click "Add Benefit" to add one.</p>
                    ) : (
                      (formData.benefits || []).map((benefit, idx) => (
                        <div key={idx} className="flex gap-3 bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition">
                          <span className="text-lg text-green-500 shrink-0">✓</span>
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) => handleBenefitChange(idx, e.target.value)}
                            placeholder="e.g., Competitive hourly rates, Flexible scheduling"
                            className="flex-1 border-0 bg-transparent px-2 py-1 text-sm focus:outline-none text-black"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(idx)}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition font-semibold shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="space-y-4 bg-linear-to-br from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 border-b-2 border-blue-300 pb-2">
                    <span className="text-xl">📊</span>
                    <h3 className="text-lg font-bold text-black">Account Status</h3>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hiring Status <span className="text-red-500">*</span></label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2.5 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-semibold transition"
                      >
                        <option value="Active">🟢 Active - Actively Hiring</option>
                        <option value="Hiring">🔵 Hiring - Limited Spots Available</option>
                        <option value="Not Hiring">🔴 Not Hiring - Closed</option>
                        <option value="Paused">⏸️ Paused - Temporarily Unavailable</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-300 hover:border-green-300 transition">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-5 h-5 cursor-pointer accent-green-600 rounded"
                      />
                      <div className="flex-1">
                        <label htmlFor="is_active" className="text-sm font-semibold text-black cursor-pointer block mb-1">
                          {formData.is_active ? '✓ Enabled' : '✗ Disabled'}
                        </label>
                        <p className="text-xs text-gray-600">
                          {formData.is_active ? 'Visible to public users on the careers page' : 'Hidden from public view'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition disabled:from-gray-400 disabled:to-gray-500 shadow-md flex-1 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        Save Account
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Accounts List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600 font-semibold">Loading teaching accounts...</span>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-lg font-semibold">No teaching accounts yet</p>
              <p className="text-gray-400 text-sm mt-1">Click "+ Add New Teacher Account" above to create one</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div key={account.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all border-t-4 border-blue-500 hover:border-blue-600 overflow-hidden group">
                  {/* Card Header */}
                  <div className="bg-linear-to-r from-blue-50 to-blue-100 p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">📍 Location</p>
                        <h3 className="text-2xl font-bold text-gray-800">{account.country}</h3>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <span className="px-2.5 py-1 bg-gray-800 text-white rounded text-xs font-bold">Admin</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    {/* Status Badge - Now Clickable */}
                    <div className="mb-4">
                      <button
                        onClick={() => handleEdit(account)}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-bold cursor-pointer hover:opacity-90 transition transform hover:scale-105 ${
                          !account.is_active ? 'bg-gray-200 text-gray-700' :
                          account.status === 'Active' ? 'bg-green-100 text-green-800' :
                          account.status === 'Hiring' ? 'bg-blue-100 text-blue-800' :
                          account.status === 'Not Hiring' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {!account.is_active ? '❌ DISABLED' : `🔘 ${account.status || 'ACTIVE'}`}
                      </button>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-xs font-semibold">💰 Hourly Rate</span>
                        <span className="font-bold text-green-600">${account.rate_per_hour}/hr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-xs font-semibold">👥 Available Slots</span>
                        <span className="font-bold text-blue-600">{account.available_slots}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-xs font-semibold">🕐 Shift Time</span>
                        <span className="font-bold text-gray-700 text-xs">{account.shift}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 bg-gray-50 p-3 rounded border border-gray-200">
                        {account.description || 'No description provided'}
                      </p>
                    </div>

                    {/* Benefits Preview */}
                    {account.benefits && account.benefits.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-600 mb-2">⭐ Key Benefits:</p>
                        <div className="space-y-1">
                          {account.benefits.slice(0, 2).map((b, i) => (
                            <p key={i} className="text-xs text-green-700 font-medium">✓ {b}</p>
                          ))}
                          {account.benefits.length > 2 && (
                            <p className="text-xs text-gray-500 italic">+ {account.benefits.length - 2} more</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer - Action Buttons */}
                  <div className="bg-gray-50 p-4 border-t border-gray-200 flex gap-2">
                    <button
                      onClick={() => handleEdit(account)}
                      className="flex-1 px-3 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xs font-bold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition transform hover:scale-105 shadow-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
