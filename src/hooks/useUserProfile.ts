// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { UserProfileAPI } from '@/src/lib/api/userProfile';
import { UserProfileData, TeacherDetails, Category } from '@/src/types/firebase';

export const useUserProfile = (uid?: string) => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [teacherDetails, setTeacherDetails] = useState<TeacherDetails | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [subcollections, setSubcollections] = useState({
    videos: [],
    reviews: [],
    galleryCollection: [],
    expertTexts: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!uid) return;

    try {
      setLoading(true);
      const { profile, teacherDetails, gallery, categories, subcollections } =
        await UserProfileAPI.getProfile(uid);

      setProfile(profile);
      setCategories(categories);
      setTeacherDetails(teacherDetails);
      setGallery(gallery);
      setSubcollections(subcollections);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setProfile(null);
      setTeacherDetails(null);
      setGallery([]);
      setSubcollections({
        videos: [],
        reviews: [],
        galleryCollection: [],
        expertTexts: [],
      });
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
    gallery,
    categories,
    subcollections, // ✅ use state, not undefined variables
    loading,
    error,
    refreshData: fetchProfile,
  };
};
