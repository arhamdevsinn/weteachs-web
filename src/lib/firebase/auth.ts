import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  User, 
  UserCredential,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from './config';


export class AuthService {
  static async login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  static async signup(
    email: string,
    password: string,
    displayName?: string
  ): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
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