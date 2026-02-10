'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Footer } from '@/components/Footer';

type ESLAccount = {
  id: string | number;
  country: string;
  icon: string;
  hourly_rate: string;
  shift: string;
  students_count: string;
  description: string;
  students?: number;
  rating?: number;
  benefits: string[];
  is_active?: boolean;
  status?: string;
};

export default function TeachingAccountsPage() {
  const [accounts, setAccounts] = useState<ESLAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const ADMIN_PASSWORD = 'echoverse2026'; // Admin password
  const [formData, setFormData] = useState<ESLAccount>({
    id: 0,
    country: '',
    icon: '🌍',
    hourly_rate: '$0',
    shift: '',
    students_count: '',
    description: '',
    benefits: [],
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = account.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || account.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const loadAccounts = async () => {
    try {
      if (!supabase) {
        return;
      }

      const { data, error } = await supabase
        .from('teaching_accounts')
        .select('*');

      if (error || !data || data.length === 0) {
        return;
      }

      const supabaseAccounts = data.map((acc: Record<string, unknown>) => ({
        id: acc.id as string,
        country: acc.country as string,
        icon: (acc.icon as string) || '🌍',
        hourly_rate: acc.rate_per_hour ? `$${acc.rate_per_hour}` : '$0',
        shift: (acc.shift as string) || 'TBD',
        students_count: acc.available_slots ? `${acc.available_slots} slots` : 'TBD',
        description: (acc.description as string) || '',
        benefits: (acc.benefits as string[]) || [],
        is_active: (acc.is_active as boolean) ?? true,
        status: (acc.status as string) || 'Active',
      }));
      setAccounts(supabaseAccounts);
    } catch {
      // Silently fail - use default accounts
    }
  };

  const handleEdit = (account: ESLAccount) => {
    if (!isAdminAuthenticated) {
      setShowPasswordModal(true);
      return;
    }
    setEditingId(account.id);
    setFormData(account);
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    if (!isAdminAuthenticated) {
      setShowPasswordModal(true);
      return;
    }
    setShowAddForm(true);
    setEditingId(null);
    setFormData({
      id: 0,
      country: '',
      icon: '🌍',
      hourly_rate: '$0',
      shift: '',
      students_count: '',
      description: '',
      benefits: [],
    });
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Try again.');
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData(prev => ({ ...prev, benefits: newBenefits }));
  };

  const handleAddBenefit = () => {
    setFormData(prev => ({ ...prev, benefits: [...prev.benefits, ''] }));
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editingId && typeof editingId === 'string') {
        // Update existing account from Supabase
        const { error } = await supabase
          .from('teaching_accounts')
          .update({
            country: formData.country,
            description: formData.description,
            icon: formData.icon,
            shift: formData.shift,
            rate_per_hour: parseFloat(formData.hourly_rate.replace('$', '').split('-')[0]) || 0,
            available_slots: parseInt(formData.students_count.replace(' slots', '')) || 0,
            benefits: formData.benefits,
          })
          .eq('id', editingId);

        if (error) {
          console.error('Error updating account:', error);
        } else {
          await loadAccounts();
          setEditingId(null);
        }
      } else {
        // Add new account to Supabase
        const { error } = await supabase
          .from('teaching_accounts')
          .insert([
            {
              country: formData.country,
              icon: formData.icon,
              shift: formData.shift,
              description: formData.description,
              rate_per_hour: parseFloat(formData.hourly_rate.replace('$', '').split('-')[0]) || 0,
              available_slots: 0,
              benefits: formData.benefits,
            },
          ]);

        if (error) {
          console.error('Error adding account:', error);
        } else {
          await loadAccounts();
          setShowAddForm(false);
        }
      }
    } catch (err) {
      console.error('Error saving account:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (id === 6 || typeof id !== 'string') return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('teaching_accounts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting account:', error);
      } else {
        await loadAccounts();
      }
    } catch (err) {
      console.error('Error deleting account:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
  };

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
              <Link href="/courses" className="px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold">Teaching Accounts</Link>
              <Link href="/about" className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition font-medium">About</Link>
              <Link href="/contact" className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Teaching Accounts</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose your preferred market and start earning today. All accounts offer flexible scheduling and competitive rates.</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-12 space-y-4 bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl border border-gray-200">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search by country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Hiring">Hiring</option>
              <option value="Not Hiring">Not Hiring</option>
            </select>
            <div className="text-sm text-gray-600 flex items-center">
              <span className="font-semibold">Found {filteredAccounts.length} account{filteredAccounts.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div className="mb-12">
          {isAdminAuthenticated && (
            <button onClick={handleLogout} className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition">
              🔒 Logout
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAccounts.map((account) => (
            <div key={account.id} className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-3xl mb-2">{account.icon}</div>
                  <h2 className="text-xl font-bold text-gray-900">{account.country}</h2>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex gap-2">
                    {isAdminAuthenticated ? (
                      <>
                        <button onClick={() => handleEdit(account)} className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 transition" disabled={loading}>Edit</button>
                        {typeof account.id === 'string' && <button onClick={() => handleDelete(account.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50" disabled={loading}>Delete</button>}
                      </>
                    ) : (
                      <span className="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded">View Only</span>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                    !account.is_active ? 'bg-gray-300 text-gray-700' :
                    account.status === 'Active' ? 'bg-green-100 text-green-800' :
                    account.status === 'Hiring' ? 'bg-blue-100 text-blue-800' :
                    account.status === 'Not Hiring' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {!account.is_active ? '❌ Disabled' : `● ${account.status || 'Active'}`}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600 text-sm">Hourly Rate:</span>
                  <span className="font-bold text-black">{account.hourly_rate}/hr</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600 text-sm">Students:</span>
                  <span className="font-bold text-black">{account.students_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Shift:</span>
                  <span className="font-bold text-black">{account.shift}</span>
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-4">{account.description}</p>
              <div className="space-y-1 text-xs text-gray-700">
                {account.benefits.slice(0, 3).map((b, i) => <p key={i} className="text-blue-600">{b}</p>)}
              </div>
            </div>
          ))}
        </div>

        {(editingId || showAddForm) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-3xl font-bold text-black mb-6">{editingId ? 'Edit Account' : 'Add New Account'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Country</label>
                  <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Icon</label>
                  <input type="text" name="icon" value={formData.icon} onChange={handleInputChange} placeholder="Icon" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Hourly Rate</label>
                  <input type="text" name="hourly_rate" value={formData.hourly_rate} onChange={handleInputChange} placeholder="$15-20" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Shift Time</label>
                  <input type="text" name="shift" value={formData.shift} onChange={handleInputChange} placeholder="Evening (KST)" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Demand Level</label>
                  <input type="text" name="students_count" value={formData.students_count} onChange={handleInputChange} placeholder="High Demand" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-black resize-none" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-semibold text-black">Benefits</label>
                    <button onClick={handleAddBenefit} className="text-xs bg-gray-200 text-black px-2 py-1 rounded hover:bg-gray-300 transition">+ Add</button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {formData.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => handleBenefitChange(idx, e.target.value)}
                          placeholder={`Benefit ${idx + 1}`}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black"
                        />
                        <button onClick={() => handleRemoveBenefit(idx)} className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition">✕</button>
                      </div>
                    ))}
                    {formData.benefits.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No benefits added yet</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={handleSave} disabled={loading} className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Saving...' : 'Save'}</button>
                  <button onClick={handleCancel} disabled={loading} className="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-500 transition disabled:opacity-50">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-black mb-4 text-center">🔐 Admin Access Required</h2>
              <p className="text-gray-600 text-center mb-6">Enter password to edit teaching accounts</p>
              <div className="space-y-4">
                <div>
                  <input 
                    type="password" 
                    value={passwordInput} 
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError('');
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                    placeholder="Enter admin password" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-black"
                    autoFocus
                  />
                </div>
                {passwordError && (
                  <p className="text-red-600 text-sm font-semibold text-center">{passwordError}</p>
                )}
                <div className="flex gap-4 pt-4">
                  <button onClick={handlePasswordSubmit} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                    Unlock
                  </button>
                  <button onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordInput('');
                    setPasswordError('');
                  }} className="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-500 transition">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
