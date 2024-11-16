export interface Message {
  type: 'text' | 'image' | 'file';
  content: string;
  fileName?: string;
  timestamp: Date;
  senderId: string;
} 