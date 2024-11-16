import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, where, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  getMessages(characterId: string): Observable<any[]> {
    const messagesRef = collection(this.firestore, 'chats');
    const q = query(
      messagesRef,
      where('characterId', '==', characterId),
      orderBy('timestamp', 'asc')
    );
    return collectionData(q);
  }

  async sendTextMessage(characterId: string, text: string, sender: string) {
    const chatsRef = collection(this.firestore, 'chats');
    return addDoc(chatsRef, {
      characterId,
      type: 'text',
      content: text,
      sender,
      timestamp: new Date()
    });
  }

  async sendFileMessage(characterId: string, file: File, sender: string) {
    // 1. Upload to Storage
    const filePath = `chats/${characterId}/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(uploadResult.ref);

    // 2. Save to Firestore
    const chatsRef = collection(this.firestore, 'chats');
    return addDoc(chatsRef, {
      characterId,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      content: downloadUrl,
      sender,
      timestamp: new Date(),
      fileMetadata: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        storageUrl: filePath
      }
    });
  }
} 