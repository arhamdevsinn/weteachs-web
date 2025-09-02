// @ts-nocheck
'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { Login } from '@/src/components/auth/Login';
import UserProfile from '../components/auth/UserProfile';


export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <UserProfile user={user} />
      ) : (
        <Login />
      )}
    </div>
  );
}