// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { UserProfileAPI } from '@/src/lib/api/userProfile';
import {UserProfileData, TeacherDetails} from '@/src/types/firebase';

export const useUserProfile = (uid?: string) => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [teacherDetails, setTeacherDetails] = useState<TeacherDetails | null>(null);
  const [gallery, setGallery] = useState<string[]>([]); // 🔹 add gallery state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!uid) return;

    try {
      setLoading(true);
      const { profile, teacherDetails, gallery } = await UserProfileAPI.getProfile(uid);
      setProfile(profile);
      setTeacherDetails(teacherDetails);
      setGallery(gallery); // 🔹 store gallery
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setProfile(null);
      setTeacherDetails(null);
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [uid]);

  return {
    profile,
    teacherDetails,
    gallery, // 🔹 expose gallery to components
    loading,
    error,
    refreshData: fetchProfile,
  };
};
