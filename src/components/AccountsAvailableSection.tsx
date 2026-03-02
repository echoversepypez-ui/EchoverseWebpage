'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface TeachingAccount {
  id: string;
  country: string;
  rate_per_hour: number;
  available_slots: number;
  description: string;
  shift: string;
  benefits?: string[];
  icon?: string;
  is_active: boolean;
  status: string;
  is_hiring?: boolean;
  created_at: string;
}

export function AccountsAvailableSection() {
  const [accounts, setAccounts] = useState<TeachingAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<TeachingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'hiring' | 'available'>('all');
  const [searchCountry, setSearchCountry] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<TeachingAccount | null>(null);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    let filtered = accounts;

    if (filterStatus === 'hiring') {
      filtered = filtered.filter(acc => acc.is_hiring === true);
    } else if (filterStatus === 'available') {
      filtered = filtered.filter(acc => acc.available_slots > 0);
    }

    if (searchCountry) {
      filtered = filtered.filter(acc =>
        acc.country.toLowerCase().includes(searchCountry.toLowerCase())
      );
    }

    setFilteredAccounts(filtered);
  }, [accounts, filterStatus, searchCountry]);

  const handleLearnMore = (account: TeachingAccount) => {
    setSelectedAccount(account);
    setShowBenefitsModal(true);
  };

  const closeModal = () => {
    setShowBenefitsModal(false);
    setSelectedAccount(null);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showBenefitsModal) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showBenefitsModal]);

  const loadAccounts = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('teaching_accounts')
        .select('*')
        .eq('is_active', true)
        .order('rate_per_hour', { ascending: false });

      if (error) {
        console.error('Error loading accounts:', error);
        setLoading(false);
        return;
      }

      setAccounts(data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="accounts-available" className="py-20 bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-4">
            💼 OPPORTUNITY LISTINGS
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            ESL Teaching Accounts Available
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover premium ESL teaching opportunities across Asia. Each account offers competitive rates, flexible scheduling, and access to thousands of engaged learners.
          </p>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'hiring' | 'available')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:outline-none font-semibold bg-white hover:border-purple-400 transition"
            >
              <option value="all">All Accounts ({accounts.length})</option>
              <option value="hiring">Actively Hiring ({accounts.filter(a => a.is_hiring).length})</option>
              <option value="available">Has Slots ({accounts.filter(a => a.available_slots > 0).length})</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Search by Country</label>
            <input
              type="text"
              placeholder="Japan, Korea, China, Thailand..."
              value={searchCountry}
              onChange={(e) => setSearchCountry(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:outline-none font-semibold bg-white hover:border-purple-400 transition"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus('all');
                setSearchCountry('');
              }}
              className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition transform hover:scale-105 duration-200"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Accounts Grid */}
        {!loading && filteredAccounts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg mb-4 font-semibold">No accounts match your filters.</p>
            <button
              onClick={() => {
                setFilterStatus('all');
                setSearchCountry('');
              }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition transform hover:scale-105"
            >
              View All Accounts
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
                  <div className="h-12 bg-gray-200 rounded w-20 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                </div>
              ))
            ) : (
              filteredAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 hover:-translate-y-2 duration-300 p-6 border-t-4 border-purple-600 group"
                >
                  {/* Top Section */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-5xl mb-3 group-hover:scale-110 transition duration-300">{account.icon || '🌍'}</div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1">{account.country}</h3>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{account.shift}</p>
                    </div>
                    <div className="text-right space-y-2">
                      {account.is_hiring && (
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-black rounded-lg shadow-sm animate-pulse">
                          🎯 HIRING NOW
                        </span>
                      )}
                      {account.available_slots > 0 && (
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg">
                          {account.available_slots.toLocaleString()} Slots
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-purple-200 to-transparent mb-4"></div>

                  {/* Status & Rate */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                    <p className="text-sm font-semibold text-gray-700 mb-3">{account.status}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ${account.rate_per_hour}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">/hour</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">{account.description}</p>

                  {/* Benefits */}
                  {account.benefits && account.benefits.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Benefits</p>
                      <div className="flex flex-wrap gap-2">
                        {account.benefits.slice(0, 3).map((benefit, idx) => (
                          <span key={idx} className="text-xs bg-purple-100 text-purple-800 px-2.5 py-1.5 rounded-lg font-semibold">
                            ✓ {benefit}
                          </span>
                        ))}
                        {account.benefits.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2.5 py-1.5 rounded-lg font-semibold">
                            +{account.benefits.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={() => handleLearnMore(account)}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition transform hover:scale-105 duration-200 group-hover:from-purple-700 group-hover:to-pink-700"
                  >
                    Learn More →
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-8 rounded-2xl text-center border-2 border-purple-200 shadow-lg">
              <p className="text-5xl font-black text-purple-600 mb-2">{accounts.length}</p>
              <p className="text-gray-700 font-bold">Total Accounts Available</p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-50 p-8 rounded-2xl text-center border-2 border-green-200 shadow-lg">
              <p className="text-5xl font-black text-green-600 mb-2">{accounts.filter(a => a.is_hiring).length}</p>
              <p className="text-gray-700 font-bold">Actively Hiring Now</p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-8 rounded-2xl text-center border-2 border-blue-200 shadow-lg">
              <p className="text-5xl font-black text-blue-600 mb-2">
                {accounts.reduce((sum, a) => sum + (a.available_slots || 0), 0).toLocaleString()}
              </p>
              <p className="text-gray-700 font-bold">Total Slots Open</p>
            </div>
          </div>
        )}
      </div>

      {/* Benefits Modal */}
      {showBenefitsModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-purple-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">{selectedAccount.icon || '🌍'}</span>
                  {selectedAccount.country} Account
                </h3>
                <p className="text-purple-100 text-sm mt-1">Complete Benefits & Details</p>
              </div>
              <button
                onClick={closeModal}
                className="text-3xl hover:scale-110 transition-transform font-bold bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Account Status */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Status</p>
                  <p className="text-lg font-bold text-gray-900">{selectedAccount.status}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Hourly Rate</p>
                  <p className="text-2xl font-bold text-purple-600">${selectedAccount.rate_per_hour}/hour</p>
                </div>
              </div>

              {/* Shift Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-1">Working Hours</p>
                <p className="text-lg font-bold text-blue-900">{selectedAccount.shift}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
                <p className="text-gray-600 leading-relaxed">{selectedAccount.description}</p>
              </div>

              {/* All Benefits */}
              {selectedAccount.benefits && selectedAccount.benefits.length > 0 && (
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-4">✨ All Benefits</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedAccount.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-purple-50 p-3 rounded-lg">
                        <span className="text-green-600 font-bold text-lg mt-0.5">✓</span>
                        <span className="text-gray-800 text-sm font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Slots */}
              {selectedAccount.available_slots > 0 && (
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm font-semibold text-green-800 mb-1">Available Positions</p>
                  <p className="text-3xl font-bold text-green-600">{selectedAccount.available_slots.toLocaleString()} slots</p>
                </div>
              )}

              {/* Hiring Badge */}
              {selectedAccount.is_hiring && (
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg text-center">
                  <p className="text-sm font-semibold text-green-800 mb-1">🎯 Status</p>
                  <p className="text-xl font-bold text-green-600">ACTIVELY HIRING NOW!</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
              <div className="flex gap-4">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Close
                </button>
                <Link
                  href="/contact"
                  onClick={closeModal}
                  className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                >
                  Apply Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
