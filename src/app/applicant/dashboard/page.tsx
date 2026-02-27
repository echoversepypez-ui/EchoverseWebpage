'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

function displayName(user: User | null): string {
  const name = (user?.user_metadata?.full_name as string)?.trim();
  if (name) return name;
  return user?.email?.split('@')[0] || user?.email || 'Applicant';
}

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'reviewed' | 'contacted' | 'approved' | 'rejected';
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Received',
  reviewed: 'Under review',
  contacted: 'Contacted',
  approved: 'Approved',
  rejected: 'Not accepted',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  contacted: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function ApplicantDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.replace('/applicant/login');
        return;
      }
      setUser(session.user);
      loadApplications(session.user.email!);
    });
  }, [router]);

  const loadApplications = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id, name, email, phone, status, created_at')
        .eq('email', email)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApplications(data || []);
    } catch (e) {
      console.error('Error loading applications:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/applicant/login');
    router.refresh();
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80"
          >
            🎓 Echoverse
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/applicant/profile"
              className="text-sm font-medium text-gray-600 hover:text-purple-600 transition"
            >
              Profile
            </Link>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-600 truncate max-w-[180px]" title={user?.email ?? ''}>
              {user?.email}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Hi, {displayName(user)} 👋
          </h1>
          <p className="text-gray-600 mb-6">
            Applications linked to <strong>{user?.email}</strong> are listed below.
          </p>

          {applications.length === 0 ? (
            <div className="p-6 md:p-8 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <p className="text-gray-600 mb-2 font-medium">No applications yet</p>
              <p className="text-sm text-gray-500 mb-6">
                Use the same email when you submit from the homepage; it will appear here once received.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition"
              >
                Submit your first application →
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {applications.map((app) => (
                <li
                  key={app.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-purple-200 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{app.name}</p>
                      <p className="text-sm text-gray-500">
                        Submitted {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_COLORS[app.status] ?? 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {STATUS_LABELS[app.status] ?? app.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-block px-4 py-2 rounded-lg font-medium text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Back to homepage
            </Link>
            <Link
              href="/applicant/profile"
              className="inline-block px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200"
            >
              Profile & password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
