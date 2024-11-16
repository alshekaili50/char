import { Injectable } from '@angular/core';
import { Storage, ref, uploadString, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private storage: Storage) {}

  async uploadFile(file: string | Blob, path: string): Promise<string> {
    const timestamp = Date.now();
    const storageRef = ref(this.storage, `${path}/${timestamp}`);

    if (typeof file === 'string') {
      // Handle base64 string uploads
      await uploadString(storageRef, file, 'data_url');
    } else {
      // Handle blob uploads
      await uploadBytes(storageRef, file);
    }

    return await getDownloadURL(storageRef);
  }
} 