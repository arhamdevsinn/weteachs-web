'use client';

import UserProfile from '@/src/components/auth/UserProfile';
import { useSearchParams } from "next/navigation";

export default function ProfilePage() {
   const searchParams = useSearchParams();
  const name = searchParams.get("name");

  return (
   
      <>
        <UserProfile />
      </>
   
  );
}
