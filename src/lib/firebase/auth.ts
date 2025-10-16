// @ts-nocheck
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  User, 
  signOut,
  UserCredential,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, db } from "@/src/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";


export class AuthService {
  static async login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }
  static async signup(email: string, password: string, teacherData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // ✅ Store teacher details
      await setDoc(doc(db, "TeacherDetails", uid), {
        email,
        ...teacherData,
        uid,
        createdAt: new Date().toISOString(),
      });

      console.log("✅ Teacher registered and details stored!");

      // ✅ Immediately sign out user so they must log in manually
      await signOut(auth);

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }


  static async logout(redirectTo: string = '/auth/login'): Promise<void> {
    try {
      await firebaseSignOut(auth);
      
      // Clear any user-related data from localStorage if needed
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
      }
      
      // Redirect after logout if a path is provided
      if (redirectTo && typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
      
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  static async updateUserProfile(updates: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    if (!auth.currentUser) throw new Error('No user logged in');
    await updateProfile(auth.currentUser, updates);
  }
}