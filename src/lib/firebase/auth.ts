// @ts-nocheck
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  updateProfile, User,
  signOut, 
  UserCredential,
   signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, db } from "@/src/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";

export class AuthService {
  // 🔹 LOGIN - block unverified users
  static async login(email: string, password: string): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await signOut(auth);
      throw new Error("Please verify your email before logging in.");
    }

    return userCredential;
  }

  // 🔹 SIGNUP - send verification email
  static async signup(email: string, password: string, teacherData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      // Save teacher details in Firestore
      await setDoc(doc(db, "TeacherDetails", uid), {
        email,
        ...teacherData,
        uid,
        createdAt: new Date().toISOString(),
        emailVerified: false,
      });

      // Send verification email
      await sendEmailVerification(user);

      console.log("📧 Verification email sent to:", email);

      // Immediately sign out so they can’t access the app yet
      await signOut(auth);

      return {
        success: true,
        message: "Signup successful! Go to your email and verify your account before logging in.",
      };
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