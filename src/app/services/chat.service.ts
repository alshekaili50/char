import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, where, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private http: HttpClient
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
    try {
      // 1. Upload to Storage
      const filePath = `chats/${characterId}/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadResult.ref);

      // 2. If it's an image, get AI description
      let description = '';
      if (file.type.startsWith('image/')) {
        try {
          // Convert file to base64
          const base64Image = await this.fileToBase64(file);

          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${environment.openAIKey}`
          };

          const body = {
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Please describe this image in detail but concisely."
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:${file.type};base64,${base64Image}`
                    }
                  }
                ]
              }
            ],
            max_tokens: 150
          };

          console.log('Sending request with body:', JSON.stringify(body)); // Debug log

          const response = await firstValueFrom(
            this.http.post<any>(this.OPENAI_API_URL, body, { headers })
          );

          description = response.choices[0]?.message?.content || 'Unable to describe the image.';
        } catch (error) {
          console.error('Error getting image description:', error);
          console.error('Full error object:', JSON.stringify(error)); // Debug log
          description = 'Error analyzing the image.';
        }
      }

      // 3. Save to Firestore
      const chatsRef = collection(this.firestore, 'chats');
      await addDoc(chatsRef, {
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

      // 4. If there's a description, send it as a follow-up message
      if (description) {
        await addDoc(chatsRef, {
          characterId,
          type: 'text',
          content: `Image Description: ${description}`,
          sender: 'assistant',
          timestamp: new Date()
        });
      }

    } catch (error) {
      console.error('Error sending file message:', error);
      throw error;
    }
  }

  // Helper method to convert File to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  async getAIResponse(characterId: string, userMessage: string): Promise<string> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${environment.openAIKey}`
      };

      const body = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant responding to users in a chat application."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      };

      const response = await firstValueFrom(
        this.http.post<any>(this.OPENAI_API_URL, body, { headers })
      );

      return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Error getting AI response:', error);
      return 'Sorry, there was an error generating a response.';
    }
  }
} 