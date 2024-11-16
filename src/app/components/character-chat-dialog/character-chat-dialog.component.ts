import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Character } from '../../models/character.interface';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-character-chat-dialog',
  templateUrl: './character-chat-dialog.component.html',
  styleUrls: ['./character-chat-dialog.component.scss']
})
export class CharacterChatDialogComponent implements OnInit, OnDestroy {
  @Input() character!: Character;
  messages: any[] = [];
  newMessage: string = '';
  private messagesSubscription?: Subscription;
  isLoading: boolean = false;
  @ViewChild('chatContent') private chatContent!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  isTyping: boolean = false;

  constructor(
    private chatService: ChatService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit() {
    this.loadMessages();
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  private async loadMessages() {
    if (!this.character.id) return;
    
    try {
      // Show loading state if needed
      this.isLoading = true;
      
      this.messagesSubscription = this.chatService
        .getMessages(this.character.id)
        .subscribe({
          next: (messages) => {
            this.messages = messages;
            // Scroll to bottom after messages load
            setTimeout(() => this.scrollToBottom(), 100);
          },
          error: (error) => {
            console.error('Error loading messages:', error);
            // Handle error (maybe show a user-friendly message)
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    } catch (error) {
      console.error('Error in loadMessages:', error);
      this.isLoading = false;
    }
  }

  // Add this helper method for scrolling
  private scrollToBottom() {
    try {
      setTimeout(() => {
        const element = this.chatContent.nativeElement;
        element.scrollTop = element.scrollHeight;
      }, 100);
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  async sendMessage() {
    if (this.newMessage.trim()) {
      try {
        if (this.character.id) {
          await this.chatService.sendTextMessage(
            this.character.id,
            this.newMessage,
            'user'
          );
        }
        // Simulate character response
        setTimeout(async () => {
          if (this.character.id) {
            await this.chatService.sendTextMessage(
              this.character.id,
              `Response from ${this.character.name}`,
              'character'
            );
          }
        }, 1000);

        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  async handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Add file validation
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      console.error('File is too large. Maximum size is 5MB.');
      return;
    }

    // Add type validation - adjust allowed types as needed
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type. Allowed types are: JPEG, PNG, PDF');
      return;
    }

    if (this.character.id) {
      try {
        await this.chatService.sendFileMessage(
          this.character.id,
          file,
          'user'
        );
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  }

  openFile(message: any) {
    if (message.fileUrl) {
      window.open(message.fileUrl, '_blank');
    }
  }

  openImage(message: any) {
    if (message.fileUrl) {
      window.open(message.fileUrl, '_blank');
    }
  }

  // Add this method to handle typing indicator
  private simulateTyping() {
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
      this.scrollToBottom();
    }, 2000); // Adjust timing as needed
  }

  dismiss() {
    // Add your dismiss logic here
    // For example, if you're using a modal/dialog service:
    // this.dialogRef.close();
  }
}
