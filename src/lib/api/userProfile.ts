// src/lib/api/userProfile.ts
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  UserProfileData, 
  TeacherDetails, 
  UserCallManagement 
} from '@/src/types/firebase';
import { 
  convertToUserProfileData, 
  getTeacherDetails, 
  getUserCallManagement 
} from '@/src/utils/firebaseUtils';

export const UserProfileAPI = {
  // Get user profile data with all complex fields
  async getUserProfile(userId: string): Promise<{
    profile: UserProfileData;
    teacherDetails?: TeacherDetails | null;
    callManagement?: UserCallManagement | null;
  }> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      const userData = userDoc.data();
      const profile = convertToUserProfileData({ id: userDoc.id, ...userData });
      
      // Resolve references in parallel
      const [teacherDetails, callManagement] = await Promise.all([
        userData.teacher_ref ? getTeacherDetails(userData.teacher_ref) : Promise.resolve(null),
        userData.user_call_manage ? getUserCallManagement(userData.user_call_manage) : Promise.resolve(null)
      ]);
      
      return {
        profile,
        teacherDetails,
        callManagement
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfileData>): Promise<void> {
    try {
      // Convert Date objects to Firebase timestamps if needed
      const firebaseUpdates: any = { ...updates };
      
      if (updates.Birthday && updates.Birthday instanceof Date) {
        firebaseUpdates.Birthday = updates.Birthday;
      }
      
      await updateDoc(doc(db, 'users', userId), firebaseUpdates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Get user's work samples (if applicable)
  async getUserWorkSamples(userId: string, type?: 'image' | 'video', limitCount: number = 6): Promise<any[]> {
    try {
      let q;
      if (type) {
        q = query(
          collection(db, 'workSamples'),
          where('userId', '==', userId),
          where('type', '==', type),
          orderBy('uploadDate', 'desc'),
          limit(limitCount)
        );
      } else {
        q = query(
          collection(db, 'workSamples'),
          where('userId', '==', userId),
          orderBy('uploadDate', 'desc'),
          limit(limitCount)
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching work samples:', error);
      return [];
    }
  },

  // Check if user is a teacher
  async checkIsTeacher(userId: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() && userDoc.data().isTeacher === true;
    } catch (error) {
      console.error('Error checking teacher status:', error);
      return false;
    }
  },

  // Get teacher profile if user is a teacher
  async getTeacherProfile(userId: string): Promise<TeacherDetails | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists() || !userDoc.data().isTeacher) {
        return null;
      }
      
      const teacherRef = userDoc.data().teacher_ref;
      if (!teacherRef) return null;
      
      return await getTeacherDetails(teacherRef);
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      return null;
    }
  }
};