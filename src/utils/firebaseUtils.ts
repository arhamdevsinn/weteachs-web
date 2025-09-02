// src/utils/firebaseUtils.ts
import { FirebaseTimestamp, UserProfileData, TeacherDetails, UserCallManagement } from '@/src/types/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase/config';

// Convert Firebase timestamp to JavaScript Date
export const convertFirebaseTimestamp = (timestamp: FirebaseTimestamp | any): Date | undefined => {
  if (!timestamp) return undefined;
  
  // If it's already a Date object
  if (timestamp instanceof Date) return timestamp;
  
  // If it's a Firebase timestamp with seconds and nanoseconds
  if (timestamp.seconds !== undefined) {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }
  
  // If it's a string representation
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  
  return undefined;
};

// Convert raw Firebase data to UserProfileData
export const convertToUserProfileData = (data: any): UserProfileData => {
  return {
    ...data,
    Birthday: convertFirebaseTimestamp(data.Birthday),
    created_time: convertFirebaseTimestamp(data.created_time),
    // Ensure essential fields have defaults
    display_name: data.display_name || '',
    email: data.email || '',
    photo_url: data.photo_url || '',
    uid: data.uid || ''
  };
};

// Resolve Firebase references
export const resolveFirebaseRef = async (refPath: string): Promise<any> => {
  if (!refPath) return null;
  
  try {
    const docRef = doc(db, refPath);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error resolving Firebase reference:', error);
    return null;
  }
};

// Get teacher details from reference
export const getTeacherDetails = async (teacherRefPath: string): Promise<TeacherDetails | null> => {
  const teacherData = await resolveFirebaseRef(teacherRefPath);
  return teacherData as TeacherDetails;
};

// Get user call management data from reference
export const getUserCallManagement = async (callManageRefPath: string): Promise<UserCallManagement | null> => {
  const callData = await resolveFirebaseRef(callManageRefPath);
  return callData as UserCallManagement;
};