import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  UserCredential 
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private injector: Injector
  ) {}

  async signup(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (error: any) {
      console.error('❌ Signup failed:', error.code, error.message);
      throw error;
    }
  }



  async login(email: string, password: string): Promise<{ userCredential: UserCredential; userData: any }> {
    try {
      const userCredential = await runInInjectionContext(this.injector, () =>
        signInWithEmailAndPassword(this.auth, email, password)
      );

      const uid = userCredential.user.uid;


      console.log('✅ User logged in successfully:', uid);
      return { userCredential, userData: userCredential.user };
    } catch (e: any) {
      console.error('❌ Login failed:', e.code, e.message);
      throw new Error(this.getFirebaseErrorMessage(e.code));
    }
  }

  /**
   * 🔹 LOGOUT:
   * Ends the user's Firebase session.
   */
  logout() {
    return signOut(this.auth);
  }

  /**
   * 🔹 FIND USER BY EMAIL:
   * Checks Firestore to see if a user exists with the given email.
   */
  async findUserByEmail(email: string): Promise<any | null> {
    try {
      return await runInInjectionContext(this.injector, async () => {
        const q = query(collection(this.firestore, 'users'), where('email', '==', email));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        return snap.docs[0].data();
      });
    } catch (e: any) {
      console.error('❌ findUserByEmail failed:', e.code, e.message);
      return null;
    }
  }

  /**
   * 🔹 ERROR HANDLER:
   * Converts Firebase error codes to user-friendly messages.
   */
  private getFirebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already in use. Please try logging in.';
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 6 characters.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid login credentials. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  }
}
