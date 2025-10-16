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

  // ✅ Extract username from URL like `/profile?Isaiah`
  useEffect(() => {
    if (pathname === "/profile" && typeof window !== "undefined") {
      const rawParam = decodeURIComponent(window.location.search.replace("?", "").trim());
      if (rawParam) setUsernameT(rawParam);
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
      pathname === "/profile" &&
      profile?.isTeacher &&
      teacherDetails?.usernameT &&
      typeof window !== "undefined"
    ) {
      const currentParam = window.location.search.replace("?", "");
      if (currentParam !== teacherDetails.usernameT) {
        router.replace(`/profile?${teacherDetails.usernameT}`, { scroll: false });
      }
    }
  }, [pathname, profile, teacherDetails, router]);

  return {
    user,
    loading,
    userId,
    usernameT, // for when no UID is found
    teacherDetails,
    profile,
  };
};
