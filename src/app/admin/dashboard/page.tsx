'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  teachingAccounts: number;
  contacts: number;
  unreadContacts: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { logout, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    teachingAccounts: 0,
    contacts: 0,
    unreadContacts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    loadStats();
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadStats = async () => {
    try {
      // Load teaching accounts count
      const { count: accountsCount } = await supabase
        .from('teaching_accounts')
        .select('*', { count: 'exact', head: true });

      // Load contacts count
      const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      // Load unread contacts count
      const { count: unreadCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      setStats({
        teachingAccounts: accountsCount || 0,
        contacts: contactsCount || 0,
        unreadContacts: unreadCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
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
              <span className="text-sm font-semibold">
                <span className="text-green-600">✓</span> <span className="text-gray-700">Admin Panel</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-linear-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12 bg-linear-to-r from-purple-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
            <h1 className="text-4xl font-bold mb-2">Welcome, Admin 👋</h1>
            <p className="text-purple-100 mb-2">Here's an overview of your Echoverse platform</p>
            <p className="text-purple-100 text-sm">Last updated: {new Date().toLocaleString()}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500 hover:shadow-xl transition transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Teaching Accounts</h3>
                  <p className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{loading ? '...' : stats.teachingAccounts}</p>
                </div>
                <div className="text-5xl opacity-30">👨‍🏫</div>
              </div>
              <Link href="/admin/teaching-accounts" className="mt-4 text-purple-600 font-semibold text-sm hover:text-pink-600 transition flex items-center gap-1">
                Manage <span>→</span>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500 hover:shadow-xl transition transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Total Contacts</h3>
                  <p className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{loading ? '...' : stats.contacts}</p>
                </div>
                <div className="text-5xl opacity-30">📧</div>
              </div>
              <Link href="/admin/contacts" className="mt-4 text-purple-600 font-semibold text-sm hover:text-pink-600 transition flex items-center gap-1">
                Review <span>→</span>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-pink-500 hover:shadow-xl transition transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Unread Messages</h3>
                  <p className="text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{loading ? '...' : stats.unreadContacts}</p>
                </div>
                <div className="text-5xl opacity-30">💬</div>
              </div>
              <Link href="/admin/contacts" className="mt-4 text-pink-600 font-semibold text-sm hover:text-purple-600 transition flex items-center gap-1">
                View Now <span>→</span>
              </Link>
            </div>
          </div>

          {/* Management Sections */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Management Panels</h2>
          </div>

          {/* Admin Panel Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Teaching Accounts Management */}
            <Link href="/admin/teaching-accounts">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-6 cursor-pointer border-l-4 border-purple-500 group">
                <div className="text-5xl mb-4 group-hover:scale-125 transition transform">👨‍🏫</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Teaching Accounts</h2>
                <p className="text-gray-600 text-sm mb-4">Create and manage teaching account opportunities</p>
                <div className="text-sm text-gray-600 font-medium">
                  Active: <span className="font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.teachingAccounts}</span>
                </div>
                <div className="mt-4 text-purple-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition">
                  Manage <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </Link>

            {/* Contact Submissions */}
            <Link href="/admin/contacts">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-6 cursor-pointer border-l-4 border-purple-500 group">
                <div className="text-5xl mb-4 group-hover:scale-125 transition transform">📧</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Submissions</h2>
                <p className="text-gray-600 text-sm mb-4">Review and respond to contact messages</p>
                <div className="text-sm text-gray-600 font-medium">
                  Unread: <span className="font-bold text-pink-600">{stats.unreadContacts}</span> / Total: <span className="font-bold text-purple-600">{stats.contacts}</span>
                </div>
                <div className="mt-4 text-purple-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition">
                  Review <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </Link>

            {/* Page Content Editor */}
            <Link href="/admin/page-content">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-6 cursor-pointer border-l-4 border-purple-500 group">
                <div className="text-5xl mb-4 group-hover:scale-125 transition transform">📝</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Page Content</h2>
                <p className="text-gray-600 text-sm mb-4">Edit home page sections and text</p>
                <div className="text-sm text-gray-600 font-medium">Manage all page content</div>
                <div className="mt-4 text-purple-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition">
                  Edit <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </Link>

            {/* Settings */}
            <Link href="/admin/settings">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-6 cursor-pointer border-l-4 border-pink-500 group">
                <div className="text-5xl mb-4 group-hover:scale-125 transition transform">⚙️</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Settings</h2>
                <p className="text-gray-600 text-sm mb-4">Configure platform settings and preferences</p>
                <div className="text-sm text-gray-600 font-medium">Manage admin settings</div>
                <div className="mt-4 text-pink-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition">
                  Configure <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/admin/teaching-accounts" className="bg-linear-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-xl p-6 border-2 border-purple-300 transition flex items-center justify-between group shadow-md hover:shadow-lg">
                <span className="font-bold text-gray-900">+ Add New Teaching Account</span>
                <span className="text-2xl group-hover:scale-125 transition">➕</span>
              </Link>
              <Link href="/admin/contacts" className="bg-linear-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-xl p-6 border-2 border-purple-300 transition flex items-center justify-between group shadow-md hover:shadow-lg">
                <span className="font-bold text-gray-900">View Unread Messages</span>
                <span className="text-2xl group-hover:scale-125 transition">💬</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
