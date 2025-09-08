import { useEffect, useState } from 'react';
import { UserProfileAPI } from '@/src/lib/api/userProfile';

export const useUserProfile = (uid?: string) => {
  const [profile, setProfile] = useState<any>(null);
  const [teacherDetails, setTeacherDetails] = useState<any>(null);
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
    } catch (err: any) {
      setError(err.message);
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
