'use client';

import { AuthRedirect } from '@/src/components/auth/AuthRedirect';
import  UserProfile from '@/src/components/auth/UserProfile';

export default function ProfilePage() {
  return (
    <AuthRedirect requireAuth={true}>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <UserProfile />
        </div>
      </div>
    </AuthRedirect>
  );
}