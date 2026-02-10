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

export const CurrentlyHiringSection = () => {
  const [accounts, setAccounts] = useState<TeachingAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('teaching_accounts')
        .select('id, country, icon, rate_per_hour, shift, available_slots, description, is_active, status')
        .eq('is_active', true)
        .order('rate_per_hour', { ascending: false });

      if (!error && data) {
        setAccounts(data as TeachingAccount[]);
      }
    } catch (err) {
      console.error('Error loading teaching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const getHighlight = (index: number, ratePerHour: number) => {
    if (index === 0) return 'Highest paying';
    if (index === accounts.length - 1) return 'Emerging opportunities';
    if (ratePerHour > 18) return 'Fast growing';
    return 'Great opportunity';
  };

  return (
    <section className="py-20 bg-linear-to-r from-blue-50 to-purple-50" id="jobs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">Currently Hiring</h2>
          <p className="text-lg text-gray-600">Active job postings with immediate availability</p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading job opportunities...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No teaching accounts available at the moment.</p>
            <Link href="/courses" className="text-black font-bold hover:underline">Check back soon →</Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {accounts.map((account, idx) => (
                <div key={account.id} className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-black hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{account.icon || '🌍'}</span>
                      <h3 className="text-lg font-bold text-black">ESL Teachers - {account.country}</h3>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold whitespace-nowrap">
                        {account.available_slots}+ Slots
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        account.status === 'Active' ? 'bg-green-100 text-green-800' :
                        account.status === 'Hiring' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {account.status || 'Active'}
                      </span>
                    </div>
                  </div>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold mb-3">
                    {getHighlight(idx, account.rate_per_hour)}
                  </span>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary:</span>
                      <span className="font-bold text-black">${account.rate_per_hour}/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Schedule:</span>
                      <span className="font-bold text-black">{account.shift || 'TBD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Slots:</span>
                      <span className="font-bold text-black">{account.available_slots}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-4 line-clamp-2">{account.description}</p>
                  <Link href="/courses" className="block w-full text-center px-3 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition">
                    Apply Now
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/courses" className="inline-block px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition">
                Browse All Positions
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
