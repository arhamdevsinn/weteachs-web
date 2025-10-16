// @ts-nocheck
"use client";

import { useAuth } from "./useAuth";

export const useUserIdFromUrl = () => {
  const { user, profile, teacherDetails, usernameT } = useAuth();

  const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const currentUserId = user?.uid || storedUserId;
  const isTeacher = profile?.isTeacher ?? false;

  return {
    userId: currentUserId,
    usernameT, // ✅ will come from URL if no userId
    isTeacher,
  };
};
