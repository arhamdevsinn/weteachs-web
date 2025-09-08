'use client';
import { useEffect, useState } from 'react';
import { UserProfileAPI } from '@/src/lib/api/userProfile';
import {UserProfileData, TeacherDetails} from '@/src/types/firebase';

export const useUserProfile = (uid?: string) => {
  const [profile, setProfile] = useState<UserProfileData|null>(null);
  const [teacherDetails, setTeacherDetails] = useState<TeacherDetails|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!uid) return;
    console.log('Fetching profile for UID:', uid);

    try {
      setLoading(true);
      const { profile, teacherDetails } = await UserProfileAPI.getProfile(uid);
      setProfile(profile);
      setTeacherDetails(teacherDetails);
   } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setProfile(null);
      setTeacherDetails(null);
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
    loading,
    error,
    refreshData: fetchProfile,
  };
};
