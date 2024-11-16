import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from '../models/character.interface';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc, docData, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly COLLECTION_NAME = 'characters';

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  // Create
  async addCharacter(character: Character): Promise<string> {
    try {
      const characterData = {
        ...character,
        userId: this.auth.currentUser?.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        age: character.age || '',
        name: character.name || '',
        photoURL: character.photoURL || '',
        relation: character.relation || ''
      };
      
      const charactersRef = collection(this.firestore, this.COLLECTION_NAME);
      const docRef = await addDoc(charactersRef, characterData);
      const characterId = docRef.id;

      const userCharacterRef = doc(
        this.firestore, 
        `users/${this.auth.currentUser?.uid}/characters/${characterId}`
      );
      await setDoc(userCharacterRef, characterData);

      return characterId;
    } catch (error) {
      console.error('Error adding character:', error);
      throw error;
    }
  }

  // Read all
  getCharacters(): Observable<Character[]> {
    const charactersRef = collection(this.firestore, this.COLLECTION_NAME);
    return collectionData(charactersRef, { idField: 'id' }) as Observable<Character[]>;
  }

  // Read one
  getCharacter(id: string): Observable<Character | undefined> {
    const characterRef = doc(this.firestore, `${this.COLLECTION_NAME}/${id}`);
    return docData(characterRef, { idField: 'id' }) as Observable<Character>;
  }

  // Update
  async updateCharacter(character: Character): Promise<void> {
    const characterRef = doc(this.firestore, `${this.COLLECTION_NAME}/${character.id}`);
    await updateDoc(characterRef, {
      ...character,
      updatedAt: new Date()
    });
  }

  // Delete
  async deleteCharacter(id: string): Promise<void> {
    const characterRef = doc(this.firestore, `${this.COLLECTION_NAME}/${id}`);
    await deleteDoc(characterRef);
  }
}