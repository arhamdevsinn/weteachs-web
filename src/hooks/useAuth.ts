"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/lib/firebase/config';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // Sync user ID with URL if user is logged in
      if (user && typeof window !== 'undefined') {
        const currentUrl = new URL(window.location.href);
        const currentUserId = searchParams.get('userId');
        
        if (currentUserId !== user.uid) {
          // Update URL with current user ID
          currentUrl.searchParams.set('userId', user.uid);
          router.replace(currentUrl.toString(), { scroll: false });
        }
      } else if (!user && searchParams.get('userId')) {
        // Remove userId param if user logs out
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete('userId');
        router.replace(currentUrl.toString(), { scroll: false });
      }
    });

    return () => unsubscribe();
  }, [router, searchParams]);

  return { user, loading };
};