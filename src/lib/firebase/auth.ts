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
import { Router } from 'lucide-react';

export class AuthService {
  
// Inside AuthService
  static async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        // store credentials for verify-email page
        if (typeof window !== "undefined") {
          localStorage.setItem("pending_verification_email", email);
          localStorage.setItem("pending_verification_password", password);
          localStorage.setItem("pending_origin", "login");
        }

        try {
          await sendEmailVerification(user);
        } catch (err) {
          if (err.code === "auth/too-many-requests") {
            throw new Error("Too many verification attempts. Please wait a few minutes.");
          }
        }

        await signOut(auth);
        if (typeof window !== "undefined") window.location.href = "/auth/verify-email";
        throw new Error("Email not verified. Verification email sent.");
      }

      // Clear storage if verified
      localStorage.removeItem("pending_verification_email");
      localStorage.removeItem("pending_verification_password");
      localStorage.removeItem("pending_origin");
      return userCredential;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

    static async signup(email: string, password: string, teacherData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      // Store teacher details
      await setDoc(doc(db, "TeacherDetails", uid), {
        email,
        ...teacherData,
        uid,
        createdAt: new Date().toISOString(),
        emailVerified: false,
      });

      // Store credentials for verify-email
      if (typeof window !== "undefined") {
        localStorage.setItem("pending_verification_email", email);
        localStorage.setItem("pending_verification_password", password);
        localStorage.setItem("pending_origin", "signup");
      }

      // Send verification email
      await sendEmailVerification(user);
      console.log("📧 Verification email sent to:", email);

      await signOut(auth);
      return {
        success: true,
        message: "Signup successful! Please verify your email before logging in.",
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
  // Add this inside your AuthService class
static async resendVerificationEmail(): Promise<void> {
    const email = localStorage.getItem("pending_verification_email");
    const password = localStorage.getItem("pending_verification_password");

    if (!email || !password) {
      throw new Error("No pending verification found. Please login again.");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        localStorage.removeItem("pending_verification_email");
        localStorage.removeItem("pending_verification_password");
        localStorage.removeItem("pending_origin");
        throw new Error("Your email is already verified. Please log in again.");
      }

      await sendEmailVerification(user);
      console.log("📧 Verification email re-sent to:", email);
      await signOut(auth);
    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        throw new Error("Too many resend attempts. Try again later.");
      }
      throw error;
    }
  }
}