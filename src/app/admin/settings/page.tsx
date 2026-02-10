'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [changePassword, setChangePassword] = React.useState(false);

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Settings</h1>
            <p className="text-gray-600">Configure your admin settings and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Security Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">🔐 Security Settings</h2>
                  <p className="text-gray-600">Manage your admin password and security</p>
                </div>
              </div>
              <div className="border-t-2 border-gray-200 pt-4">
                <div className="bg-purple-50 p-4 rounded-lg mb-4 border border-purple-200">
                  <div className="text-sm text-gray-600 mb-2">Current Admin Password</div>
                  <div className="text-lg font-mono text-gray-900">••••••••••••••••</div>
                </div>
                <button
                  onClick={() => setChangePassword(!changePassword)}
                  className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
                >
                  {changePassword ? 'Cancel' : 'Change Password'}
                </button>

                {changePassword && (
                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800 mb-4">
                      To change your admin password, please contact the system administrator. Password changes must
                      be made directly in the authentication system for security reasons.
                    </p>
                    <code className="text-xs bg-yellow-100 px-2 py-1 rounded">src/lib/auth-context.tsx</code>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">👤 Account Information</h2>
              <p className="text-gray-600 mb-4">Your admin account details</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Status</label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      ✓ Active
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Access Level</label>
                  <p className="text-gray-600 font-medium">Full Administrator</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Session Status</label>
                  <p className="text-gray-600 font-medium">Active and Protected</p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">⚠️ Danger Zone</h2>
              <p className="text-gray-600 mb-4">Irreversible actions</p>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
              >
                Logout
              </button>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ℹ️ System Information</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-semibold text-gray-900">Application</label>
                  <p className="text-gray-600">Echoverse Admin Panel</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-900">Version</label>
                  <p className="text-gray-600">1.0.0</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-900">Framework</label>
                  <p className="text-gray-600">Next.js 16+</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-900">Database</label>
                  <p className="text-gray-600">Supabase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
