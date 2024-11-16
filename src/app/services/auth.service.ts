import { Injectable, OnDestroy } from '@angular/core';
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
  authState,
  onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserService } from './user.service';

interface CustomUser extends User {
  subscriptionStatus?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private user = new BehaviorSubject<User | null>(null);
  currentUser$ = this.user.asObservable();
  user$: Observable<User | null>;
  private unsubscribeAuth: any;

  constructor(
    private auth: Auth,
    private userService: UserService
  ) {
    auth.onAuthStateChanged(user => this.user.next(user));
    this.user$ = authState(this.auth);
    this.unsubscribeAuth = onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userService.createUserDocument(user);
      }
    });
  }

  ngOnDestroy() {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
    }
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
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.userService.createUserDocument(credential.user);
      return credential;
    } catch (error) {
      throw error;
    }
  }

  async googleSignIn() {
    try {
      const credential = await signInWithPopup(this.auth, new GoogleAuthProvider());
      await this.userService.createUserDocument(credential.user);
      return credential;
    } catch (error) {
      throw error;
    }
  }

  async facebookSignIn() {
    try {
      const credential = await signInWithPopup(this.auth, new FacebookAuthProvider());
      await this.userService.createUserDocument(credential.user);
      return credential;
    } catch (error) {
      throw error;
    }
  }

  async appleSignIn() {
    try {
      const provider = new OAuthProvider('apple.com');
      const credential = await signInWithPopup(this.auth, provider);
      await this.userService.createUserDocument(credential.user);
      return credential;
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