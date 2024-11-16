import { Component, Input } from '@angular/core';
import { Character } from '../../models/character.interface';
import { ChatMessage } from '../../models/chat-message.interface';

@Component({
  selector: 'app-character-chat-dialog',
  templateUrl: './character-chat-dialog.component.html',
  styleUrls: ['./character-chat-dialog.component.scss']
})
export class CharacterChatDialogComponent {
  @Input() character!: Character;
  messages: ChatMessage[] = [];
  newMessage: string = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      // Add user message
      this.messages.push({
        id: this.messages.length + 1,
        text: this.newMessage,
        sender: 'user',
        timestamp: new Date()
      });

      // Simulate character response
      setTimeout(() => {
        this.messages.push({
          id: this.messages.length + 1,
          text: `Response from ${this.character.name}`,
          sender: 'character',
          timestamp: new Date()
        });
      }, 1000);

      this.newMessage = '';
    }
  }
}
