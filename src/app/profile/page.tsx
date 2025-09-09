'use client';

import UserProfile from '@/src/components/auth/UserProfile';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <UserProfile />
      </div>
    </div>
  );
}
