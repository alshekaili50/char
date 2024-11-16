export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'character';
  timestamp: Date;
} 