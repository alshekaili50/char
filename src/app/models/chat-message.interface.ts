export interface ChatMessage {
  id: number;
  text?: string;
  content?: string;
  type?: 'text' | 'image' | 'file';
  sender: string;
  senderId?: string;
  fileName?: string;
  timestamp: Date;
} 