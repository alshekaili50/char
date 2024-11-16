import { Injectable } from '@angular/core';
import { Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  TwitterAuthProvider,
  GithubAuthProvider,
  signOut,
  User,
  OAuthProvider,
  authState } from '@angular/fire/auth';
import { BehaviorSubject, Observable, map } from 'rxjs';

interface CustomUser extends User {
  subscriptionStatus?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<User | null>(null);
  currentUser$ = this.user.asObservable();
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    auth.onAuthStateChanged(user => this.user.next(user));
    this.user$ = authState(this.auth);
  }

  async emailSignIn(email: string, password: string) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  async emailSignUp(email: string, password: string) {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  async googleSignIn() {
    try {
      return await signInWithPopup(this.auth, new GoogleAuthProvider());
    } catch (error) {
      throw error;
    }
  }

  async facebookSignIn() {
    try {
      return await signInWithPopup(this.auth, new FacebookAuthProvider());
    } catch (error) {
      throw error;
    }
  }
  async appleSignIn() {
    try {
      const provider = new OAuthProvider('apple.com');
      return await signInWithPopup(this.auth, provider);
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    try {
      return await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  getUser(): Observable<any> {
    return this.user$;
  }

  isSubscribed(): Observable<boolean> {
    return this.user$.pipe(
      map((user) => (user as CustomUser)?.subscriptionStatus === 'active' || false)
    );
  }
} 