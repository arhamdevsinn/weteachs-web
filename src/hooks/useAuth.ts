// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/lib/firebase/config";
import { useUserProfile } from "@/src/hooks/useUserProfile";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [usernameT, setUsernameT] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // ✅ Extract username from URL like `/profile=Isaiah`
  useEffect(() => {
    
    if (typeof window !== "undefined") {
      const urlPath = window.location.pathname;
      // match /profile=username
      const match = urlPath.match(/^\/profile=([^/]+)/);
      if (match && match[1]) {
        const decodedUsername = decodeURIComponent(match[1].trim());
        setUsernameT(decodedUsername);
      }
    }
  }, [pathname]);

  // ✅ Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setUserId(firebaseUser.uid);
        localStorage.setItem("userId", firebaseUser.uid);
      } else {
        setUser(null);
        setUserId(null);
        localStorage.removeItem("userId");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Restore UID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && !userId) {
      const storedId = localStorage.getItem("userId");
      if (storedId) setUserId(storedId);
    }
  }, [userId]);

  const { teacherDetails, profile } = useUserProfile(userId);

  // ✅ Rewrite URL if teacher logged in
  useEffect(() => {
    if (
      pathname.startsWith("/profile") &&
      profile?.isTeacher &&
      teacherDetails?.usernameT &&
      typeof window !== "undefined"
    ) {
      const currentMatch = window.location.pathname.match(/^\/profile=([^/]+)/);
      const currentParam = currentMatch ? currentMatch[1] : null;

      // if (currentParam !== teacherDetails.usernameT) {
      //   router.replace(`/profile?name=${teacherDetails.usernameT}`, { scroll: false });
      // }
    }
  }, [pathname, profile, teacherDetails, router]);

  return {
    user,
    loading,
    userId,
    usernameT, // extracted from /profile=username
    teacherDetails,
    profile,
  };
};
