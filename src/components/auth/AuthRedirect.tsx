'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';

interface AuthRedirectProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthRedirect = ({
  children,
  requireAuth = true,
  redirectTo = '/auth/login', // ✅ better default redirect
}: AuthRedirectProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // 🔒 Redirect unauthenticated users to login
        const currentPath = encodeURIComponent(window.location.pathname);
        router.push(`${redirectTo}?redirect=${currentPath}`);
      } else if (!requireAuth && user) {
        // 🚫 Prevent logged-in users from visiting guest-only pages
        router.push('/profile');
      }
    }
  }, [user, loading, requireAuth, router, redirectTo]);

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  }

  if (requireAuth && !user) {
    return <div className="text-center py-8 text-gray-600">Redirecting to login...</div>;
  }

  return <>{children}</>;
};
