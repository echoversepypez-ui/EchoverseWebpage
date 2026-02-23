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
  applications: number;
  newApplications: number;
}

interface NavItem {
  name: string;
  href: string;
  icon: string;
  current: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { logout, isAdmin, isLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    teachingAccounts: 0,
    contacts: 0,
    unreadContacts: 0,
    applications: 0,
    newApplications: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin/login');
      return;
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      // Load teacher profiles count
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

      // Load applications count
      const { count: applicationsCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });

      // Load new applications count
      const { count: newAppsCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      setStats({
        teachingAccounts: accountsCount || 0,
        contacts: contactsCount || 0,
        unreadContacts: unreadCount || 0,
        applications: applicationsCount || 0,
        newApplications: newAppsCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Teacher Profiles', href: '/admin/manage-profiles', icon: '👨‍🏫' },
    { name: 'Teaching Accounts', href: '/admin/teaching-accounts', icon: '🏢' },
    { name: 'Applications', href: '/admin/applications', icon: '📋' },
    { name: 'Messages', href: '/admin/contacts', icon: '💬' },
    { name: 'Support Chat', href: '/admin/support-conversations', icon: '💻' },
    { name: 'Page Content', href: '/admin/page-content', icon: '📝' },
    { name: 'Chatbot', href: '/admin/chatbot-options', icon: '🤖' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAdmin) {
    return null;
  }

  const filteredNavItems = navigationItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-linear-to-b from-purple-900 via-purple-800 to-purple-900 text-white transition-all duration-300 flex flex-col shadow-xl`}>
          {/* Logo Section */}
          <div className="p-6 border-b border-purple-700">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <span className="text-3xl">🎓</span>
              {sidebarOpen && <span className="text-xl font-bold">Echoverse</span>}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-700 transition group"
              >
                <span className="text-2xl">{item.icon}</span>
                {sidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-purple-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition"
            >
              <span className="text-xl">🚪</span>
              {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Top Header */}
          <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  {sidebarOpen ? '◀️' : '▶️'}
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex bg-gray-100 rounded-lg px-4 py-2">
                  <input
                    type="text"
                    placeholder="Quick search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-sm flex-1"
                  />
                  <span>🔍</span>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <p className="text-xs text-gray-500">{currentTime}</p>
                </div>

                <Link
                  href="/admin/profile"
                  className="p-2 hover:bg-gray-100 rounded-lg transition text-lg"
                >
                  👤
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-8">
            {/* Alert Section */}
            {(stats.unreadContacts > 0 || stats.newApplications > 0) && (
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {stats.unreadContacts > 0 && (
                  <Link href="/admin/contacts">
                    <div className="bg-linear-to-r from-pink-500 to-red-500 text-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition transform hover:scale-105 shadow-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg mb-1">💬 Unread Messages</h3>
                          <p className="text-pink-100">You have {stats.unreadContacts} unread message{stats.unreadContacts !== 1 ? 's' : ''}</p>
                        </div>
                        <span className="bg-white text-red-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                          {stats.unreadContacts}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                {stats.newApplications > 0 && (
                  <Link href="/admin/applications">
                    <div className="bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition transform hover:scale-105 shadow-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg mb-1">📋 New Applications</h3>
                          <p className="text-green-100">You have {stats.newApplications} new application{stats.newApplications !== 1 ? 's' : ''} to review</p>
                        </div>
                        <span className="bg-white text-green-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                          {stats.newApplications}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            )}

            {/* Welcome Section */}
            <div className="mb-8 bg-linear-to-r from-purple-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
              <h1 className="text-3xl font-bold mb-2">Welcome back, Admin 👋</h1>
              <p className="text-purple-100">Here's your platform overview</p>
            </div>

            {/* Key Metrics */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Metrics</h2>
              <div className="grid md:grid-cols-5 gap-4">
                {/* Teachers */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Teachers</p>
                      <p className="text-3xl font-bold text-purple-600 mt-2">{statsLoading ? '...' : stats.teachingAccounts}</p>
                    </div>
                    <span className="text-3xl">👨‍🏫</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Active profiles</p>
                </div>

                {/* Job Listings */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Listings</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{statsLoading ? '...' : stats.teachingAccounts}</p>
                    </div>
                    <span className="text-3xl">🏢</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Available positions</p>
                </div>

                {/* Total Contacts */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Messages</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{statsLoading ? '...' : stats.contacts}</p>
                    </div>
                    <span className="text-3xl">📧</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    <span className={stats.unreadContacts > 0 ? 'text-red-500 font-bold' : ''}>
                      {stats.unreadContacts} unread
                    </span>
                  </p>
                </div>

                {/* Total Applications */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Applications</p>
                      <p className="text-3xl font-bold text-orange-600 mt-2">{statsLoading ? '...' : stats.applications}</p>
                    </div>
                    <span className="text-3xl">📝</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    <span className={stats.newApplications > 0 ? 'text-red-500 font-bold' : ''}>
                      {stats.newApplications} new
                    </span>
                  </p>
                </div>

                {/* Quick Actions */}
                <Link href="/admin/teaching-accounts">
                  <div className="bg-linear-to-r from-purple-100 to-pink-100 rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition cursor-pointer h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700">Add New Account</p>
                      <p className="text-2xl mt-2">➕</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Management Sections */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Management Panels</h2>
            </div>

            {/* Admin Panel Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Teacher Profiles Management */}
              <Link href="/admin/manage-profiles">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-8 cursor-pointer border-t-4 border-purple-600 group">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition transform">👨‍🏫</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Teacher Profiles</h3>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full mb-4">
                    🔐 Admin Access
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Create and manage teaching account opportunities.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 transition text-sm">
                    Manage Teachers →
                  </button>
                </div>
              </Link>

              {/* Accounts Available */}
              <Link href="/admin/teaching-accounts">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-8 cursor-pointer border-t-4 border-green-600 group">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition transform">🏢</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Job Listings</h3>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-4">
                    💼 Active
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Post and manage ESL teaching job accounts.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition text-sm">
                    Manage Jobs →
                  </button>
                </div>
              </Link>

              {/* Contact Submissions */}
              <Link href="/admin/contacts">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-8 cursor-pointer border-t-4 border-pink-600 group">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition transform">💬</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Messages</h3>
                  <span className="inline-block px-3 py-1 bg-pink-100 text-pink-800 text-xs font-semibold rounded-full mb-4">
                    📧 {stats.unreadContacts > 0 ? `${stats.unreadContacts} Unread` : 'No New'}
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Review and respond to contact messages from visitors.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-pink-600 hover:bg-pink-700 transition text-sm">
                    Review Messages →
                  </button>
                </div>
              </Link>

              {/* Applications Management */}
              <Link href="/admin/applications">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-8 cursor-pointer border-t-4 border-orange-600 group">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition transform">📋</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Applications</h3>
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full mb-4">
                    📝 {stats.newApplications > 0 ? `${stats.newApplications} New` : 'Reviewed'}
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Review and manage teacher applications.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-700 transition text-sm">
                    Review Apps →
                  </button>
                </div>
              </Link>

              {/* Page Content */}
              <Link href="/admin/page-content">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-8 cursor-pointer border-t-4 border-indigo-600 group">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition transform">📝</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Page Content</h3>
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full mb-4">
                    ✏️ Edit
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Edit home page sections and content.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition text-sm">
                    Edit Content →
                  </button>
                </div>
              </Link>

              {/* Chatbot Options */}
              <Link href="/admin/chatbot-options">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-8 cursor-pointer border-t-4 border-cyan-600 group">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition transform">🤖</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Chatbot</h3>
                  <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-semibold rounded-full mb-4">
                    💬 Support
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Manage support chatbot menu options.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-cyan-600 hover:bg-cyan-700 transition text-sm">
                    Manage Bot →
                  </button>
                </div>
              </Link>

              {/* Settings */}
              <Link href="/admin/settings">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-8 cursor-pointer border-t-4 border-red-600 group">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition transform">⚙️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Settings</h3>
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full mb-4">
                    🔧 Config
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Configure platform settings and preferences.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition text-sm">
                    Configure →
                  </button>
                </div>
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-12 p-6 bg-white rounded-xl shadow-md text-center text-gray-600 text-sm">
              <p>Echoverse Admin Panel • Last updated: {new Date().toLocaleString()}</p>
              <p className="mt-2">Need help? Check our <Link href="#" className="text-purple-600 hover:underline">documentation</Link></p>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
