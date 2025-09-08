
'use client';
import { useEffect, useState } from 'react';
import { UserProfileAPI } from '@/src/lib/api/userProfile';
import { UserProfileData as Profile, TeacherDetails } from '@/src/types/firebase';

export const useUserProfile = (uid?: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teacherDetails, setTeacherDetails] = useState<TeacherDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 
  const fetchProfile = async () => {
    if (!uid) return;
    try {
      setLoading(true);
      const { profile , teacherDetails }: { profile: Profile; teacherDetails: TeacherDetails } =
        await UserProfileAPI.getProfile(uid);

      setProfile(profile);
      setTeacherDetails(teacherDetails);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
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
