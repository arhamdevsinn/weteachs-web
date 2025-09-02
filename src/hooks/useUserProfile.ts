// src/hooks/useUserProfile.ts
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/lib/firebase/config';
import { UserProfileAPI } from '@/src/lib/api/userProfile';
import { UserProfileData, TeacherDetails, UserCallManagement } from '@/src/types/firebase';
import { convertToUserProfileData } from '@/src/utils/firebaseUtils';

export const useUserProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [teacherDetails, setTeacherDetails] = useState<TeacherDetails | null>(null);
  const [callManagement, setCallManagement] = useState<UserCallManagement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Set up real-time listener for user profile
    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      async (doc) => {
        try {
          if (doc.exists()) {
            const userData = convertToUserProfileData({ id: doc.id, ...doc.data() });
            setProfile(userData);
            
            // Resolve references if they exist
            if (userData.teacher_ref) {
              const teacherData = await UserProfileAPI.getTeacherProfile(userId);
              setTeacherDetails(teacherData);
            }
            
            if (userData.user_call_manage) {
              // You would need to implement getUserCallManagement similarly
              // For now, we'll just set it to null
              setCallManagement(null);
            }
          } else {
            setError('User profile not found');
          }
          setLoading(false);
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const refreshData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { profile, teacherDetails, callManagement } = await UserProfileAPI.getUserProfile(userId);
      setProfile(profile);
      setTeacherDetails(teacherDetails || null);
      setCallManagement(callManagement || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    teacherDetails,
    callManagement,
    loading,
    error,
    refreshData
  };
};