'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Signing you in…');

  useEffect(() => {
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/applicant/dashboard';

    if (!code) {
      router.replace('/applicant/login?error=missing_code');
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(() => {
        setMessage('Success! Redirecting…');
        router.replace(next);
      })
      .catch((err) => {
        console.error('Auth callback error:', err);
        router.replace(`/applicant/login?error=${encodeURIComponent(err.message)}`);
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
