'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import UserProfile from '../components/auth/UserProfile';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user && <UserProfile />}
    </div>
  );
}