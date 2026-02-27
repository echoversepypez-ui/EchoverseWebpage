'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ApplicantProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string; full_name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const [displayName, setDisplayName] = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMessage, setNameMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

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
      setLoading(false);
    });
  }, [router]);

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
          <div className="flex items-center gap-4">
            <Link
              href="/applicant/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-purple-600 transition"
            >
              My applications
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-purple-600 hover:text-pink-600 transition"
            >
              Homepage
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
          <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
            <h1 className="text-xl font-bold">Profile & account</h1>
            <p className="text-purple-100 text-sm mt-0.5">Manage your name and password</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Account info */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Account info</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed here.</p>
              </div>
              <form onSubmit={handleSaveName} className="space-y-3">
                <div>
                  <label htmlFor="display-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Display name
                  </label>
                  <input
                    id="display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name (used in application form)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                {nameMessage && (
                  <p
                    className={`text-sm ${
                      nameMessage.type === 'ok' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {nameMessage.text}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={nameSaving}
                  className="px-4 py-2 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition"
                >
                  {nameSaving ? 'Saving…' : 'Save name'}
                </button>
              </form>
            </section>

            {/* Change password */}
            <section className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Change password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label htmlFor="new-pwd" className="block text-sm font-medium text-gray-700 mb-1">
                    New password (min 6 characters)
                  </label>
                  <input
                    id="new-pwd"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-pwd" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm new password
                  </label>
                  <input
                    id="confirm-pwd"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="••••••••"
                  />
                </div>
                {passwordMessage && (
                  <p
                    className={`text-sm ${
                      passwordMessage.type === 'ok' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {passwordMessage.text}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={passwordSaving || !newPassword || !confirmPassword}
                  className="px-4 py-2 rounded-lg font-medium text-white bg-gray-800 hover:bg-gray-900 disabled:opacity-50 transition"
                >
                  {passwordSaving ? 'Updating…' : 'Update password'}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-3">
                Forgot your current password? Use{' '}
                <Link href="/applicant/login" className="text-purple-600 hover:underline">
                  Forgot password
                </Link>{' '}
                on the login page.
              </p>
            </section>
          </div>

          <div className="px-6 pb-6">
            <Link
              href="/applicant/dashboard"
              className="text-sm font-medium text-purple-600 hover:text-pink-600"
            >
              ← Back to My applications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
