import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  async createUserDocument(user: User) {
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastSeen: new Date(),
      // Only set createdAt if it's a new document
      ...(!await this.userExists(user.uid) && { createdAt: new Date() })
    };

    // Use setDoc with merge option to update existing documents
    await setDoc(userDoc, userData, { merge: true });
  }

  private async userExists(uid: string): Promise<boolean> {
    const docRef = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }
} 