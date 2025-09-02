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
  redirectTo = '/' 
}: AuthRedirectProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to login with current path as redirect parameter
        router.push(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`);
      } else if (!requireAuth && user) {
        // If user is logged in but shouldn't be on this page (like login page)
        router.push('/?userId=' + user.uid);
      }
    }
  }, [user, loading, requireAuth, router, redirectTo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (requireAuth && !user) {
    return <div>Redirecting to login...</div>;
  }

  return <>{children}</>;
};