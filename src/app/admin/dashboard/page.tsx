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
  pendingDemoRecordings: number;
  approvedDemoRecordings: number;
  rejectedDemoRecordings: number;
}

const NavItem = ({ href, icon, label, isActive, badge, collapsed }: { 
  href: string; 
  icon: string; 
  label: string; 
  isActive: boolean; 
  badge?: string | number;
  collapsed?: boolean;
}) => (
  <Link
    href={href}
    className={`group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
      isActive
        ? 'bg-white text-purple-700 shadow-lg border-l-4 border-purple-600'
        : 'text-purple-100 hover:bg-white/10 hover:text-white hover:shadow-md border-l-4 border-transparent'
    }`}
    title={collapsed ? label : undefined}
  >
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <span className={`text-xl transition-transform duration-300 shrink-0 w-6 text-center ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
        {!collapsed && (
          <span className="ml-3 font-medium text-sm">{label}</span>
        )}
      </div>
      {badge && !collapsed && (
        <span className="bg-linear-to-r from-pink-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
          {badge}
        </span>
      )}
    </div>
    {collapsed && badge && (
      <span className="absolute -top-1 -right-1 bg-linear-to-r from-pink-500 to-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
        {badge}
      </span>
    )}
  </Link>
);

export default function AdminDashboardPage() {
  const router = useRouter();
  const { logout, isAdmin, isLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    teachingAccounts: 0,
    contacts: 0,
    unreadContacts: 0,
    applications: 0,
    newApplications: 0,
    pendingDemoRecordings: 0,
    approvedDemoRecordings: 0,
    rejectedDemoRecordings: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/admin/login');
      return;
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    // Mark component as client-side rendered
    setIsClient(true);
    // Set sidebar based on window width on client
    setSidebarOpen(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (isAdmin && isClient) {
      loadStats();
    }
  }, [isAdmin, isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, [isClient]);

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

      // Load demo recording statistics
      const { count: pendingDemoCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('demo_recording_status', 'pending_review');

      const { count: approvedDemoCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('demo_recording_status', 'approved');

      const { count: rejectedDemoCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('demo_recording_status', 'rejected');

      setStats({
        teachingAccounts: accountsCount || 0,
        contacts: contactsCount || 0,
        unreadContacts: unreadCount || 0,
        applications: applicationsCount || 0,
        newApplications: newAppsCount || 0,
        pendingDemoRecordings: pendingDemoCount || 0,
        approvedDemoRecordings: approvedDemoCount || 0,
        rejectedDemoRecordings: rejectedDemoCount || 0,
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'w-72' : 'w-20'
        } bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 backdrop-blur-lg text-white transition-all duration-500 ease-in-out flex flex-col shadow-2xl fixed md:static bottom-0 left-0 right-0 md:h-auto h-20 border-r border-purple-700/50 ${
          sidebarOpen ? 'md:w-72' : 'md:w-20'
        } z-50`}>
          {/* Logo Section */}
          <div className="p-4 md:p-6 border-b border-purple-700/50 bg-linear-to-r from-purple-800/50 to-indigo-800/50 backdrop-blur-sm">
            <Link href="/" className="flex items-center gap-3 group hover:opacity-90 transition-all duration-300">
              <div className="relative flex items-center justify-center">
                <span className="text-3xl transition-transform duration-300 group-hover:rotate-12 inline-block w-8 text-center">🎓</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
              </div>
              {sidebarOpen && (
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent">Echoverse</span>
                  <span className="text-xs text-purple-200 font-medium">Admin Panel</span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex flex-1 overflow-y-auto p-4 space-y-1 flex-col scrollbar-thin scrollbar-thumb-purple-600/20 scrollbar-track-transparent">
            {navigationItems
              .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => {
                // Calculate badges for specific items
                let badge = undefined;
                if (item.name === 'Messages' && stats.unreadContacts > 0) {
                  badge = stats.unreadContacts;
                } else if (item.name === 'Applications' && stats.newApplications > 0) {
                  badge = stats.newApplications;
                } else if (item.name === 'Applications' && stats.pendingDemoRecordings > 0) {
                  badge = `${stats.pendingDemoRecordings}📹`;
                }
                
                return (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.name}
                    isActive={false} // You can implement active state logic here if needed
                    badge={badge}
                    collapsed={!sidebarOpen}
                  />
                );
              })}
          </nav>

          {/* Bottom Section - Issues & Logout */}
          <div className="hidden md:block p-4 border-t border-purple-700/50 space-y-2">
            {/* Issues Alert */}
            {(stats.unreadContacts > 0 || stats.newApplications > 0 || stats.pendingDemoRecordings > 0) && (
              <div className="bg-linear-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="text-lg">⚠️</span>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {(stats.unreadContacts + stats.newApplications + stats.pendingDemoRecordings) || 1}
                    </span>
                  </div>
                  {sidebarOpen && (
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">Issues</p>
                      <p className="text-xs text-purple-200">
                        {stats.unreadContacts > 0 && `${stats.unreadContacts} messages`}
                        {stats.unreadContacts > 0 && stats.newApplications > 0 && ', '}
                        {stats.newApplications > 0 && `${stats.newApplications} apps`}
                        {stats.pendingDemoRecordings > 0 && ` + ${stats.pendingDemoRecordings} demos`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 hover:border-red-400/50 transition-all duration-300 group"
            >
              <span className="text-xl transition-transform duration-300 group-hover:scale-110">🚪</span>
              {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-auto w-full mb-20 md:mb-0">
          {/* Top Header */}
          <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center gap-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  {sidebarOpen ? '◀️' : '▶️'}
                </button>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">Admin</h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden lg:flex bg-gray-100 rounded-lg px-4 py-2">
                  <input
                    type="text"
                    placeholder="Quick search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-sm flex-1"
                  />
                  <span>🔍</span>
                </div>

                <div className="hidden md:block text-right">
                  <div className="text-xs text-gray-600">
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
          <main className="p-4 md:p-8">
            {/* Alert Section */}
            {(stats.unreadContacts > 0 || stats.newApplications > 0 || stats.pendingDemoRecordings > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {stats.unreadContacts > 0 && (
                  <Link href="/admin/contacts">
                    <div className="bg-linear-to-r from-pink-500 to-red-500 text-white rounded-xl p-4 md:p-6 cursor-pointer hover:shadow-lg transition transform hover:scale-105 shadow-lg">
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
                    <div className="bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 md:p-6 cursor-pointer hover:shadow-lg transition transform hover:scale-105 shadow-lg">
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

                {stats.pendingDemoRecordings > 0 && (
                  <Link href="/admin/applications">
                    <div className="bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 md:p-6 cursor-pointer hover:shadow-lg transition transform hover:scale-105 shadow-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg mb-1">📹 Demo Reviews</h3>
                          <p className="text-yellow-100">{stats.pendingDemoRecordings} recording{stats.pendingDemoRecordings !== 1 ? 's' : ''} pending review</p>
                        </div>
                        <span className="bg-white text-orange-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                          {stats.pendingDemoRecordings}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            )}

            {/* Welcome Section */}
            <div className="mb-8 bg-linear-to-r from-purple-600 via-purple-600 to-pink-600 rounded-2xl p-4 md:p-8 text-white shadow-xl">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Admin 👋</h1>
              <p className="text-purple-100">Here&apos;s your platform overview</p>
            </div>

            {/* Key Metrics */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Key Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
                {/* Teachers */}
                <div className="bg-white rounded-lg md:rounded-xl shadow-md p-3 md:p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:block">Teachers</p>
                      <p className="text-lg md:text-3xl font-bold text-purple-600 mt-1 md:mt-2">{statsLoading ? '...' : stats.teachingAccounts}</p>
                    </div>
                    <span className="text-xl md:text-3xl">👨‍🏫</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 hidden md:block">Active profiles</p>
                </div>

                {/* Job Listings */}
                <div className="bg-white rounded-lg md:rounded-xl shadow-md p-3 md:p-6 border-l-4 border-green-500 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:block">Jobs</p>
                      <p className="text-lg md:text-3xl font-bold text-green-600 mt-1 md:mt-2">{statsLoading ? '...' : stats.teachingAccounts}</p>
                    </div>
                    <span className="text-xl md:text-3xl">🏢</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 hidden md:block">Positions</p>
                </div>

                {/* Total Contacts */}
                <div className="bg-white rounded-lg md:rounded-xl shadow-md p-3 md:p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:block">Messages</p>
                      <p className="text-lg md:text-3xl font-bold text-blue-600 mt-1 md:mt-2">{statsLoading ? '...' : stats.contacts}</p>
                    </div>
                    <span className="text-xl md:text-3xl">📧</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 hidden md:block">
                    <span className={stats.unreadContacts > 0 ? 'text-red-500 font-bold' : ''}>
                      {stats.unreadContacts} unread
                    </span>
                  </p>
                </div>

                {/* Total Applications */}
                <div className="bg-white rounded-lg md:rounded-xl shadow-md p-3 md:p-6 border-l-4 border-orange-500 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:block">Apps</p>
                      <p className="text-lg md:text-3xl font-bold text-orange-600 mt-1 md:mt-2">{statsLoading ? '...' : stats.applications}</p>
                    </div>
                    <span className="text-xl md:text-3xl">📝</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 hidden md:block">
                    <span className={stats.newApplications > 0 ? 'text-red-500 font-bold' : ''}>
                      {stats.newApplications} new
                    </span>
                  </p>
                </div>

                {/* Demo Recordings - Pending */}
                <div className="bg-white rounded-lg md:rounded-xl shadow-md p-3 md:p-6 border-l-4 border-yellow-500 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:block">Demo</p>
                      <p className="text-lg md:text-3xl font-bold text-yellow-600 mt-1 md:mt-2">{statsLoading ? '...' : stats.pendingDemoRecordings}</p>
                    </div>
                    <span className="text-xl md:text-3xl">📹</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 hidden md:block">
                    <span className={stats.pendingDemoRecordings > 0 ? 'text-orange-500 font-bold' : ''}>
                      Pending review
                    </span>
                  </p>
                </div>

                {/* Demo Recordings - Approved */}
                <div className="bg-white rounded-lg md:rounded-xl shadow-md p-3 md:p-6 border-l-4 border-green-500 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:block">Approved</p>
                      <p className="text-lg md:text-3xl font-bold text-green-600 mt-1 md:mt-2">{statsLoading ? '...' : stats.approvedDemoRecordings}</p>
                    </div>
                    <span className="text-xl md:text-3xl">✅</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 hidden md:block">Demo recordings</p>
                </div>

                {/* Quick Actions */}
                <div className="hidden lg:col-span-6 md:col-span-3 md:block">
                  <Link href="/admin/teaching-accounts" className="block h-full">
                    <div className="bg-linear-to-r from-purple-100 to-pink-100 rounded-lg md:rounded-xl shadow-md p-3 md:p-6 border-l-4 border-purple-500 hover:shadow-lg transition cursor-pointer h-full flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs md:text-sm font-semibold text-gray-700">Add New</p>
                        <p className="text-lg md:text-2xl mt-1 md:mt-2">➕</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Management Sections */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Management Panels</h2>
            </div>

            {/* Admin Panel Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {/* Teacher Profiles Management */}
              <Link href="/admin/manage-profiles">
                <div className="bg-white rounded-lg md:rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-4 md:p-8 cursor-pointer border-t-4 border-purple-600 group">
                  <div className="text-4xl md:text-5xl mb-2 md:mb-4 group-hover:scale-125 transition transform">👨‍🏫</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Teachers</h3>
                  <span className="inline-block px-2 md:px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full mb-2 md:mb-4">
                    🔐 Admin
                  </span>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 hidden md:block">
                    Create and manage teaching account opportunities.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 transition text-xs md:text-sm">
                    Manage →
                  </button>
                </div>
              </Link>

              {/* Accounts Available */}
              <Link href="/admin/teaching-accounts">
                <div className="bg-white rounded-lg md:rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-4 md:p-8 cursor-pointer border-t-4 border-green-600 group">
                  <div className="text-4xl md:text-5xl mb-2 md:mb-4 group-hover:scale-125 transition transform">🏢</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Jobs</h3>
                  <span className="inline-block px-2 md:px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-2 md:mb-4">
                    💼 Active
                  </span>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 hidden md:block">
                    Post and manage ESL teaching job accounts.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition text-xs md:text-sm">
                    Manage →
                  </button>
                </div>
              </Link>

              {/* Contact Submissions */}
              <Link href="/admin/contacts">
                <div className="bg-white rounded-lg md:rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-4 md:p-8 cursor-pointer border-t-4 border-pink-600 group">
                  <div className="text-4xl md:text-5xl mb-2 md:mb-4 group-hover:scale-125 transition transform">💬</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Messages</h3>
                  <span className="inline-block px-2 md:px-3 py-1 bg-pink-100 text-pink-800 text-xs font-semibold rounded-full mb-2 md:mb-4">
                    📧 {stats.unreadContacts > 0 ? `${stats.unreadContacts}` : 'No New'}
                  </span>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 hidden md:block">
                    Review and respond to contact messages from visitors.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-pink-600 hover:bg-pink-700 transition text-xs md:text-sm">
                    Review →
                  </button>
                </div>
              </Link>

              {/* Applications Management */}
              <Link href="/admin/applications">
                <div className="bg-white rounded-lg md:rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-4 md:p-8 cursor-pointer border-t-4 border-orange-600 group">
                  <div className="text-4xl md:text-5xl mb-2 md:mb-4 group-hover:scale-125 transition transform">📋</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Apps</h3>
                  <span className="inline-block px-2 md:px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full mb-2 md:mb-4">
                    📝 {stats.newApplications > 0 ? `${stats.newApplications}` : 'Reviewed'}
                  </span>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 hidden md:block">
                    Review and manage teacher applications.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-700 transition text-xs md:text-sm">
                    Review →
                  </button>
                </div>
              </Link>

              {/* Page Content */}
              <Link href="/admin/page-content">
                <div className="bg-white rounded-lg md:rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-4 md:p-8 cursor-pointer border-t-4 border-indigo-600 group">
                  <div className="text-4xl md:text-5xl mb-2 md:mb-4 group-hover:scale-125 transition transform">📝</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Content</h3>
                  <span className="inline-block px-2 md:px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full mb-2 md:mb-4">
                    ✏️ Edit
                  </span>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 hidden md:block">
                    Edit home page sections and content.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition text-xs md:text-sm">
                    Edit →
                  </button>
                </div>
              </Link>

              {/* Chatbot Options */}
              <Link href="/admin/chatbot-options">
                <div className="bg-white rounded-lg md:rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-4 md:p-8 cursor-pointer border-t-4 border-cyan-600 group">
                  <div className="text-4xl md:text-5xl mb-2 md:mb-4 group-hover:scale-125 transition transform">🤖</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Chatbot</h3>
                  <span className="inline-block px-2 md:px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-semibold rounded-full mb-2 md:mb-4">
                    💬 Bot
                  </span>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 hidden md:block">
                    Manage support chatbot menu options.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-cyan-600 hover:bg-cyan-700 transition text-xs md:text-sm">
                    Manage →
                  </button>
                </div>
              </Link>

              {/* Settings */}
              <Link href="/admin/settings">
                <div className="bg-white rounded-lg md:rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 p-4 md:p-8 cursor-pointer border-t-4 border-red-600 group">
                  <div className="text-4xl md:text-5xl mb-2 md:mb-4 group-hover:scale-125 transition transform">⚙️</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Settings</h3>
                  <span className="inline-block px-2 md:px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full mb-2 md:mb-4">
                    🔧 Config
                  </span>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 hidden md:block">
                    Configure platform settings and preferences.
                  </p>
                  <button className="w-full py-2 px-4 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition text-xs md:text-sm">
                    Config →
                  </button>
                </div>
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-8 md:mt-12 p-4 md:p-6 bg-white rounded-xl shadow-md text-center text-gray-600 text-xs md:text-sm">
              <p>Echoverse Admin Panel • Last updated: {isClient ? new Date().toLocaleString() : 'Loading...'}</p>
              <p className="mt-2 hidden md:block">Need help? Check our <Link href="#" className="text-purple-600 hover:underline">documentation</Link></p>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
