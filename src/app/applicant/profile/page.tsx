'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import NetworkingSection from '@/components/NetworkingSection';
import DemoRecordingModal from '@/components/DemoRecordingModal';
import RecentApplications from '@/components/RecentApplications';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'reviewed' | 'contacted' | 'approved' | 'rejected';
  demo_recording_status: 'not_submitted' | 'pending_review' | 'approved' | 'rejected' | 'needs_revision';
  demo_recording_review_result?: string;
  demo_recording_submitted_date?: string;
  demo_recording_review_notes?: string;
  demo_recording_reviewed_date?: string;
  demo_recording_url?: string;
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

const DEMO_RECORDING_STATUS_LABELS: Record<string, string> = {
  not_submitted: 'Not Submitted',
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  needs_revision: 'Needs Revision',
};

const DEMO_RECORDING_STATUS_COLORS: Record<string, string> = {
  not_submitted: 'bg-gray-100 text-gray-800',
  pending_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  needs_revision: 'bg-orange-100 text-orange-800',
};

type TabType = 'overview' | 'applications' | 'profile' | 'network';

export default function ProfileDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string; full_name?: string } | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>();

  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMessage, setNameMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [isProfilePublic, setIsProfilePublic] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileVisibilitySaving, setProfileVisibilitySaving] = useState(false);
  const [profileVisibilityMessage, setProfileVisibilityMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.replace('/applicant/login');
        return;
      }
      const u = session.user;
      setUser({
        id: u.id,
        email: u.email ?? undefined,
        full_name: (u.user_metadata?.full_name as string) ?? undefined,
      });
      setDisplayName((u.user_metadata?.full_name as string)?.trim() ?? '');
      loadApplications(u.email!);
      loadUserProfile(u.id, u.email!);
      setLoading(false);
    });
  }, [router]);

  const loadApplications = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id, name, email, phone, status, created_at, demo_recording_status, demo_recording_review_result, demo_recording_submitted_date, demo_recording_review_notes, demo_recording_reviewed_date, demo_recording_url')
        .eq('email', email)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApplications(data || []);
    } catch (e) {
      console.error('Error loading applications:', e);
    }
  };

  const loadUserProfile = async (userId: string, email: string) => {
    try {
      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id, is_profile_public')
        .eq('user_id', userId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows returned, which is expected if profile doesn't exist
        throw fetchError;
      }

      if (existingProfile) {
        setProfileId(existingProfile.id);
        setIsProfilePublic(existingProfile.is_profile_public ?? false);
      } else {
        // Profile doesn't exist, try to get application data to populate it
        const { data: applicationData } = await supabase
          .from('applications')
          .select('name, address, phone, teaching_experience, job_details')
          .eq('email', email)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Create new user profile
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: userId,
            headline: applicationData?.name || 'Applicant',
            job_title: applicationData?.job_details || applicationData?.teaching_experience || 'Teacher',
            location: applicationData?.address || '',
            is_profile_public: true, // Default to public for networking
          })
          .select('id, is_profile_public')
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          return;
        }

        if (newProfile) {
          setProfileId(newProfile.id);
          setIsProfilePublic(newProfile.is_profile_public ?? true);
        }
      }
    } catch (e) {
      console.error('Error loading user profile:', e);
    }
  };

  const handleToggleProfileVisibility = async () => {
    if (!profileId) return;
    setProfileVisibilitySaving(true);
    setProfileVisibilityMessage(null);
    try {
      const newValue = !isProfilePublic;
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_profile_public: newValue })
        .eq('id', profileId);
      if (error) throw error;
      setIsProfilePublic(newValue);
      setProfileVisibilityMessage({ 
        type: 'ok', 
        text: newValue ? 'Profile is now public. Others can find you in suggestions.' : 'Profile is now private. You won\'t appear in suggestions.' 
      });
    } catch {
      setProfileVisibilityMessage({ type: 'err', text: 'Failed to update profile visibility.' });
    } finally {
      setProfileVisibilitySaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/applicant/login');
    router.refresh();
  };

  const handleDemoRecordingSubmit = async () => {
    if (user?.email) {
      await loadApplications(user.email);
    }
  };

  const openDemoRecordingModal = (applicationId?: string) => {
    setSelectedApplicationId(applicationId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicationId(undefined);
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameMessage(null);
    setNameSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName.trim() || undefined },
      });
      if (error) throw error;
      setNameMessage({ type: 'ok', text: 'Name updated.' });
    } catch (e) {
      setNameMessage({ type: 'err', text: e instanceof Error ? e.message : 'Could not update name.' });
    } finally {
      setNameSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'err', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'err', text: 'Password must be at least 6 characters.' });
      return;
    }
    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMessage({ type: 'ok', text: 'Password updated. Use it next time you sign in.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setPasswordMessage({ type: 'err', text: e instanceof Error ? e.message : 'Could not update password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600 text-sm">Loading your profile dashboard...</p>
        </div>
      </div>
    );
  }

  const displayNameUser = (user?.full_name?.trim() || user?.email?.split('@')[0] || user?.email || 'Applicant');
  
  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'new' || app.status === 'reviewed').length,
    approvedApplications: applications.filter(app => app.status === 'approved').length,
    pendingDemos: applications.filter(app => app.demo_recording_status === 'pending_review').length,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Modern Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition-all duration-200 flex items-center gap-2"
            >
              <span className="text-2xl">🎓</span>
              Echoverse
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-purple-700">{displayNameUser}</span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden mb-6">
          <div className="bg-linear-to-r from-purple-600 via-purple-500 to-pink-600 text-white px-6 sm:px-8 py-6 sm:py-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {displayNameUser}! 👋</h1>
              <p className="text-purple-100 text-sm sm:text-base">Manage your applications and profile in one place</p>
            </div>
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
          
          {/* Stats Cards */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-600 text-2xl">📋</span>
                  <span className="text-xs font-medium text-purple-600 bg-purple-200 px-2 py-1 rounded-full">Total</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{stats.totalApplications}</p>
                <p className="text-xs text-purple-700 mt-1">Applications</p>
              </div>
              
              <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-600 text-2xl">⏳</span>
                  <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">Pending</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{stats.pendingApplications}</p>
                <p className="text-xs text-blue-700 mt-1">In Review</p>
              </div>
              
              <div className="bg-linear-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-600 text-2xl">✅</span>
                  <span className="text-xs font-medium text-green-600 bg-green-200 px-2 py-1 rounded-full">Approved</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{stats.approvedApplications}</p>
                <p className="text-xs text-green-700 mt-1">Applications</p>
              </div>
              
              <div className="bg-linear-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-amber-600 text-2xl">📹</span>
                  <span className="text-xs font-medium text-amber-600 bg-amber-200 px-2 py-1 rounded-full">Demo</span>
                </div>
                <p className="text-2xl font-bold text-amber-900">{stats.pendingDemos}</p>
                <p className="text-xs text-amber-700 mt-1">Pending Review</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 mb-6">
          <div className="flex flex-col sm:flex-row border-b border-gray-200">
            {[
              { id: 'overview' as TabType, label: 'Overview', icon: '📊' },
              { id: 'applications' as TabType, label: 'Applications', icon: '📋' },
              { id: 'profile' as TabType, label: 'Profile Settings', icon: '👤' },
              { id: 'network' as TabType, label: 'Network', icon: '🌐' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-purple-600 bg-purple-50'
                    : 'text-gray-600 border-transparent hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Dashboard Overview</h2>
                
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📝</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600 mb-6">Submit your first application to get started with your teaching journey</p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      <span>🚀</span>
                      Submit Application
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentApplications 
                      applications={applications}
                      onViewAll={() => setActiveTab('applications')}
                      onOpenDemoRecordingModal={openDemoRecordingModal}
                    />

                    {/* Quick Actions */}
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span>⚡</span>
                        Quick Actions
                      </h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setActiveTab('profile')}
                          className="w-full text-left px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-purple-600">👤</span>
                            <div>
                              <p className="font-medium text-gray-900">Update Profile</p>
                              <p className="text-xs text-gray-500">Manage your personal information</p>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => openDemoRecordingModal()}
                          className="w-full text-left px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-blue-600">📹</span>
                            <div>
                              <p className="font-medium text-gray-900">Submit Demo</p>
                              <p className="text-xs text-gray-500">Record your teaching demo</p>
                            </div>
                          </div>
                        </button>
                        
                        <Link
                          href="/"
                          className="block text-left px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-green-600">📝</span>
                            <div>
                              <p className="font-medium text-gray-900">New Application</p>
                              <p className="text-xs text-gray-500">Submit another application</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Applications</h2>
                
                {applications.length === 0 ? (
                  <div className="space-y-6">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📝</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                      <p className="text-gray-600 mb-6">Submit your first application to get started</p>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        <span>🚀</span>
                        Submit Application
                      </Link>
                    </div>
                    
                    {/* Demo Recording Status - Empty State */}
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span>📹</span>
                        Demo Recording Status
                      </h3>
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-xl">📹</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">No demo recording submitted yet</p>
                        <p className="text-xs text-gray-500 mb-4">Submit your application first, then record your demo</p>
                        <button 
                          onClick={() => openDemoRecordingModal()}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          <span>📹</span>
                          Submit Demo Recording
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-200 transition-all duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.name}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <span>📧 {app.email}</span>
                              <span>📱 {app.phone}</span>
                              <span>📅 {new Date(app.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${
                              STATUS_COLORS[app.status] ?? 'bg-gray-100 text-gray-800'
                            }`}>
                              {STATUS_LABELS[app.status] ?? app.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${
                              DEMO_RECORDING_STATUS_COLORS[app.demo_recording_status] || 'bg-gray-100 text-gray-800'
                            }`}>
                              Demo: {DEMO_RECORDING_STATUS_LABELS[app.demo_recording_status] || app.demo_recording_status}
                            </span>
                          </div>
                        </div>
                        
                        {/* Demo Recording Section */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-xl p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    app.demo_recording_status === 'pending_review' ? 'bg-yellow-400 animate-pulse' :
                                    app.demo_recording_status === 'approved' ? 'bg-green-400' :
                                    app.demo_recording_status === 'rejected' ? 'bg-red-400' :
                                    app.demo_recording_status === 'needs_revision' ? 'bg-orange-400' :
                                    'bg-gray-400'
                                  }`}></div>
                                  <span className="text-sm font-medium text-gray-900">Demo Status</span>
                                </div>
                                <span className={`text-sm font-bold px-2 py-1 rounded ${
                                  DEMO_RECORDING_STATUS_COLORS[app.demo_recording_status] || 'bg-gray-100 text-gray-800'
                                }`}>
                                  {DEMO_RECORDING_STATUS_LABELS[app.demo_recording_status] || app.demo_recording_status}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-600 mb-1">Submitted</p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {app.demo_recording_submitted_date 
                                      ? new Date(app.demo_recording_submitted_date).toLocaleDateString()
                                      : 'Not submitted'
                                    }
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-600 mb-1">Review Result</p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {app.demo_recording_review_result || 'Awaiting Review'}
                                  </p>
                                </div>
                              </div>
                              
                              {app.demo_recording_review_notes && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                  <p className="text-xs font-medium text-amber-900 mb-1">Review Notes:</p>
                                  <p className="text-sm text-amber-800">{app.demo_recording_review_notes}</p>
                                </div>
                              )}
                              
                              {app.demo_recording_url && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <a 
                                    href={app.demo_recording_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-800 hover:text-green-900 text-sm font-medium flex items-center gap-2"
                                  >
                                    <span>🔗</span>
                                    View Demo Recording
                                  </a>
                                </div>
                              )}
                              
                              {(app.demo_recording_status === 'not_submitted' || app.demo_recording_status === 'needs_revision') && (
                                <button 
                                  onClick={() => openDemoRecordingModal(app.id)}
                                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200"
                                >
                                  {app.demo_recording_status === 'needs_revision' ? '🔄 Resubmit Demo' : '📹 Submit Demo Recording'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Settings</h2>
                
                {/* Account info */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm sm:text-base">👤</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Account Information</h3>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
                      <label className="inline-flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                        <span className="text-gray-400 text-sm sm:text-base">📧</span>
                        Email address
                      </label>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <p className="text-gray-900 font-medium flex-1 bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 text-sm sm:text-base break-all">
                          {user.email}
                        </p>
                        <div className="px-3 py-1 bg-gray-200 rounded-full self-start sm:self-auto">
                          <span className="text-xs font-medium text-gray-600">Read-only</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <span>ℹ️</span>
                        <span className="hidden sm:inline">Email cannot be changed here. Contact support if you need to update it.</span>
                        <span className="sm:hidden">Email cannot be changed here.</span>
                      </p>
                    </div>
                    
                    <form onSubmit={handleSaveName} className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-5 border border-purple-200 space-y-4">
                      <div>
                        <label htmlFor="display-name" className="inline-flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                          <span className="text-purple-600 text-sm sm:text-base">✏️</span>
                          Display name
                        </label>
                        <input
                          id="display-name"
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Enter your display name"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 hover:border-purple-300 text-sm sm:text-base"
                          aria-describedby="display-name-help"
                        />
                        <p id="display-name-help" className="text-xs text-gray-500 mt-1">This name will be displayed in your application form</p>
                      </div>
                      
                      {nameMessage && (
                        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                          nameMessage.type === 'ok' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          <span>{nameMessage.type === 'ok' ? '✓' : '⚠️'}</span>
                          {nameMessage.text}
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        disabled={nameSaving}
                        className="w-full px-4 sm:px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm sm:text-base"
                        aria-live="polite"
                      >
                        {nameSaving ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></span>
                            Saving...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span aria-hidden="true">💾</span>
                            Save name
                          </span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Change password */}
                <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm sm:text-base">🔒</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Security Settings</h3>
                  </div>
                  
                  <form onSubmit={handleChangePassword} className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-200 space-y-4">
                    <div>
                      <label htmlFor="new-pwd" className="inline-flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                        <span className="text-blue-600 text-sm sm:text-base">🔑</span>
                        New password
                      </label>
                      <div className="relative">
                        <input
                          id="new-pwd"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-12 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 hover:border-blue-300 text-sm sm:text-base"
                          placeholder="Enter new password"
                          minLength={6}
                          aria-describedby="new-password-help"
                          aria-required="true"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-hidden="true">
                          <span className="text-gray-400 text-sm">👁️</span>
                        </div>
                      </div>
                      <p id="new-password-help" className="text-xs text-gray-500 mt-1">Minimum 6 characters for security</p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-pwd" className="inline-flex text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                        <span className="text-blue-600 text-sm sm:text-base">🔐</span>
                        Confirm new password
                      </label>
                      <div className="relative">
                        <input
                          id="confirm-pwd"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-12 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 hover:border-blue-300 text-sm sm:text-base"
                          placeholder="Confirm new password"
                          minLength={6}
                          aria-describedby="confirm-password-help"
                          aria-required="true"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-hidden="true">
                          <span className="text-gray-400 text-sm">👁️</span>
                        </div>
                      </div>
                      <div id="confirm-password-help">
                        {newPassword && confirmPassword && (
                          <p className={`text-xs mt-1 flex items-center gap-1 ${
                            newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <span aria-hidden="true">{newPassword === confirmPassword ? '✓' : '✗'}</span>
                            <span>{newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {passwordMessage && (
                      <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                        passwordMessage.type === 'ok' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span>{passwordMessage.type === 'ok' ? '✓' : '⚠️'}</span>
                        {passwordMessage.text}
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={passwordSaving || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                      className="w-full px-4 sm:px-6 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm sm:text-base"
                      aria-live="polite"
                    >
                      {passwordSaving ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></span>
                          Updating...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span aria-hidden="true">🔄</span>
                          Update password
                        </span>
                      )}
                    </button>
                  </form>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4">
                    <p className="text-sm text-amber-800 flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5" aria-hidden="true">💡</span>
                      <span>
                        <span className="hidden sm:inline">Forgot your current password? Use{' '}</span>
                        <span className="sm:hidden">Forgot password? Use{' '}</span>
                        <Link href="/applicant/login" className="text-amber-700 font-semibold hover:underline underline decoration-amber-300">
                          Forgot password
                        </Link>{' '}
                        <span className="hidden sm:inline">on the login page.</span>
                        <span className="sm:hidden">on login page.</span>
                      </span>
                    </p>
                  </div>
                </div>

                {/* Profile Visibility */}
                <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm sm:text-base">🌐</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Profile Visibility</h3>
                  </div>
                  
                  <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 border border-green-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Make profile public</p>
                        <p className="text-sm text-gray-600">Allow others to find and connect with you</p>
                      </div>
                      <button
                        onClick={handleToggleProfileVisibility}
                        disabled={profileVisibilitySaving || !profileId}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isProfilePublic ? 'bg-green-600' : 'bg-gray-300'
                        } ${profileVisibilitySaving || !profileId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isProfilePublic ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {profileVisibilityMessage && (
                      <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                        profileVisibilityMessage.type === 'ok' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <span>{profileVisibilityMessage.type === 'ok' ? '✓' : '⚠️'}</span>
                        {profileVisibilityMessage.text}
                      </div>
                    )}
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>💡 Tip:</strong> {isProfilePublic 
                          ? 'Your profile is visible to other professionals. You will appear in their suggestions.' 
                          : 'Your profile is private. Others cannot find you in suggestions. Enable this to network with others.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Network Tab */}
            {activeTab === 'network' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Network</h2>
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 border border-green-200">
                  <NetworkingSection currentUserId={user.id} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Demo Recording Modal */}
        <DemoRecordingModal
          isOpen={isModalOpen}
          onClose={closeModal}
          applicationId={selectedApplicationId}
          applicantEmail={user?.email}
          applicantName={user?.full_name}
          onSubmit={handleDemoRecordingSubmit}
        />
      </div>
    </div>
  );
}
