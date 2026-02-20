'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface TeachingAccount {
  id: string;
  country: string;
  icon: string;
  rate_per_hour: number;
  shift: string;
  available_slots: number;
  description: string;
  is_active: boolean;
  status: string;
}

type ViewMode = 'grid' | 'list';

export const TeachingOpportunitiesSection = () => {
  const [accounts, setAccounts] = useState<TeachingAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<TeachingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'salary' | 'slots' | 'country'>('salary');

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    filterAndSortAccounts();
  }, [accounts, selectedShift, sortBy]);

  const loadAccounts = async () => {
    try {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('teaching_accounts')
        .select('id, country, icon, rate_per_hour, shift, available_slots, description, is_active, status')
        .eq('is_active', true);

      if (!error && data) {
        setAccounts(data as TeachingAccount[]);
      }
    } catch (err) {
      console.error('Error loading teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAccounts = () => {
    let filtered = accounts;

    // Filter by shift
    if (selectedShift !== 'all') {
      filtered = filtered.filter(acc => acc.shift === selectedShift);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'salary':
          return b.rate_per_hour - a.rate_per_hour;
        case 'slots':
          return b.available_slots - a.available_slots;
        case 'country':
          return a.country.localeCompare(b.country);
        default:
          return 0;
      }
    });

    setFilteredAccounts(sorted);
  };

  const getHighlight = (ratePerHour: number, index: number) => {
    if (ratePerHour >= 18) return { label: 'Highest paying', color: 'bg-yellow-100 text-yellow-800' };
    if (ratePerHour >= 16) return { label: 'Great opportunity', color: 'bg-green-100 text-green-800' };
    return { label: 'Growing market', color: 'bg-blue-100 text-blue-800' };
  };

  const uniqueShifts = ['all', ...Array.from(new Set(accounts.map(a => a.shift)))];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-linear-to-b from-white to-gray-50" id="opportunities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Mobile optimized */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-3 sm:mb-4">
            Teaching Opportunities
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Explore active positions across different markets and find the perfect fit for you
          </p>
        </div>

        {/* Controls - Mobile responsive */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-8 shadow-sm overflow-x-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-max sm:min-w-full">
            {/* View Toggle */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">View</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg font-medium transition text-sm sm:text-base min-h-10 ${
                    viewMode === 'grid'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg font-medium transition text-sm sm:text-base min-h-10 ${
                    viewMode === 'list'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  List
                </button>
              </div>
            </div>

            {/* Shift Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Shift</label>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full px-2 sm:px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm min-h-10"
              >
                {uniqueShifts.map(shift => (
                  <option key={shift} value={shift}>
                    {shift === 'all' ? 'All Shifts' : shift}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'salary' | 'slots' | 'country')}
                className="w-full px-2 sm:px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm min-h-10"
              >
                <option value="salary">Highest Salary</option>
                <option value="slots">Most Slots</option>
                <option value="country">Country (A-Z)</option>
              </select>
            </div>

            {/* Results Count - Mobile friendly */}
            <div className="col-span-2 sm:col-span-1 flex items-end justify-center sm:justify-start">
              <div className="text-xs sm:text-sm font-semibold text-gray-700 text-center sm:text-left">
                <div className="text-lg sm:text-xl font-bold text-black">{filteredAccounts.length}</div>
                <div className="text-xs text-gray-500">{filteredAccounts.length === 1 ? 'opportunity' : 'opportunities'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-block animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-t-2 border-b-2 border-black mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600">Loading opportunities...</p>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-lg border border-gray-200">
            <p className="text-base sm:text-lg text-gray-600 mb-4">No opportunities match your filters.</p>
            <button
              onClick={() => {
                setSelectedShift('all');
                setSortBy('salary');
              }}
              className="text-black font-semibold hover:underline min-h-10 px-4"
            >
              Reset filters →
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View - Mobile responsive
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
              {filteredAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white rounded-lg border-2 border-gray-200 hover:border-black hover:shadow-xl transition-all overflow-hidden group flex flex-col"
                >
                  {/* Header */}
                  <div className="bg-linear-to-r from-blue-50 to-purple-50 p-3 sm:p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
                        <span className="text-3xl sm:text-4xl shrink-0">{account.icon || '🌍'}</span>
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-black truncate">{account.country}</h3>
                          <p className="text-xs text-gray-600">Account</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getHighlight(account.rate_per_hour, 0).color}`}>
                        {getHighlight(account.rate_per_hour, 0).label}
                      </span>
                      <span className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${
                        account.status === 'Active' ? 'bg-green-100 text-green-800' :
                        account.status === 'Hiring' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {account.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 flex flex-col grow">
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">Hourly Rate</span>
                        <span className="text-xl sm:text-2xl font-bold text-black shrink-0">${account.rate_per_hour}<span className="text-xs sm:text-sm">/hr</span></span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">Schedule</span>
                        <span className="font-semibold text-black text-right text-xs sm:text-base">{account.shift}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">Slots</span>
                        <span className="font-semibold text-black text-xs sm:text-base">{account.available_slots}+</span>
                      </div>
                    </div>

                    {account.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 line-clamp-3">
                        {account.description}
                      </p>
                    )}

                    <Link
                      href="/teachers-profile"
                      className="w-full text-center px-4 py-2.5 sm:py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition transform hover:scale-105 text-sm sm:text-base min-h-10 flex items-center justify-center mt-auto"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // List View - Mobile optimized
          <>
            <div className="space-y-3 sm:space-y-4 mb-12">
              {filteredAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white rounded-lg border border-gray-200 hover:border-black hover:shadow-lg transition-all p-4 sm:p-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 items-center">
                    {/* Account Info */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-3xl sm:text-4xl shrink-0">{account.icon || '🌍'}</span>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-black truncate">{account.country}</h3>
                        <div className="flex gap-2 mt-1 sm:mt-2 flex-wrap">
                          <span className={`inline-block px-1.5 sm:px-2 py-0.5 rounded text-xs font-semibold ${getHighlight(account.rate_per_hour, 0).color}`}>
                            {getHighlight(account.rate_per_hour, 0).label}
                          </span>
                          <span className={`inline-block px-1.5 sm:px-2 py-0.5 rounded text-xs font-semibold ${
                            account.status === 'Active' ? 'bg-green-100 text-green-800' :
                            account.status === 'Hiring' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {account.status || 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-gray-600">Hourly Rate</div>
                      <div className="text-lg sm:text-2xl font-bold text-black">${account.rate_per_hour}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-gray-600">Schedule</div>
                      <div className="font-semibold text-black text-xs sm:text-base">{account.shift}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-gray-600">Slots</div>
                      <div className="font-semibold text-black text-xs sm:text-base">{account.available_slots}+</div>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 sm:text-right">
                      <Link
                        href="/teachers-profile"
                        className="inline-flex sm:inline-block px-4 sm:px-6 py-2.5 sm:py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition text-sm sm:text-base min-h-10 items-center justify-center"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>

                  {account.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                      {account.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA Footer - Mobile optimized */}
        {filteredAccounts.length > 0 && (
          <div className="text-center pt-6 sm:pt-8 border-t border-gray-200">
            <Link
              href="/teachers-profile"
              className="inline-flex px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-black to-gray-800 text-white rounded-lg font-bold hover:shadow-xl transition transform hover:scale-105 text-sm sm:text-base min-h-11 items-center justify-center"
            >
              Explore All Positions
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
