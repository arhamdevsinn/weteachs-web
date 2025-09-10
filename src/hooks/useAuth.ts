"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/lib/firebase/config";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // ✅ Sync only when user logs in
      if (user && typeof window !== "undefined") {
        const currentUrl = new URL(window.location.href);
        const currentUserId = searchParams.get("userId");

        if (currentUserId !== user.uid) {
          // Update URL with current user ID
          currentUrl.searchParams.set("userId", user.uid);
          router.replace(currentUrl.toString(), { scroll: false });
        }
      }

      // ❌ Do not remove userId when user logs out
      // We keep the URL intact so you can still access public pages with ?userId
    });

    return () => unsubscribe();
  }, [router, searchParams]);

  return { user, loading };
};
