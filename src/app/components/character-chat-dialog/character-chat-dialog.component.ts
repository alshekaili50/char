import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Character } from '../../models/character.interface';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';
import { FileUploadService } from '../../services/file-upload.service';
import { AlertController, PopoverController } from '@ionic/angular';

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
    private fileUploadService: FileUploadService,
    private alertController: AlertController,
    private popoverController: PopoverController
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

  async sendMessage(messageData?: { type: "text" | "image" | "file", content: string, fileName?: string, timestamp: Date, senderId: string }) {
    try {
      if (messageData) {
        if (messageData.type === 'image' || messageData.type === 'file') {
          // File messages are handled by handleFileUpload
          return;
        }
      } else if (this.newMessage.trim()) {
        // Send user message
        await this.chatService.sendTextMessage(
          this.character.id,
          this.newMessage,
          'user'
        );

        const userMessage = this.newMessage;
        this.newMessage = ''; // Clear input

        // Get AI response
        this.isTyping = true;
        try {
          // Get AI response
          const aiResponse = await this.chatService.getAIResponse(
            this.character.id,
            userMessage
          );

          // Send AI response as character message
          await this.chatService.sendTextMessage(
            this.character.id,
            aiResponse,
            'character'
          );
        } catch (error) {
          console.error('Error getting AI response:', error);
          // Send fallback message
          await this.chatService.sendTextMessage(
            this.character.id,
            'Sorry, I encountered an error while processing your message.',
            'character'
          );
        } finally {
          this.isTyping = false;
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
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

  async onTextBoxClick(event: Event) {
    event.preventDefault(); // Prevent default focus behavior
    await this.showInputOptions();
  }

  private async showInputOptions() {
    const alert = await this.alertController.create({
      header: 'Choose Input Type',
      buttons: [
        {
          text: 'Text Message',
          handler: async () => {
            const textAlert = await this.alertController.create({
              header: 'Send Message',
              inputs: [
                {
                  name: 'message',
                  type: 'textarea',
                  placeholder: 'Type your message...'
                }
              ],
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'Send',
                  handler: (data) => {
                    if (data.message?.trim()) {
                      this.newMessage = data.message;
                      this.sendMessage();
                    }
                  }
                }
              ]
            });
            await textAlert.present();
          }
        },
        {
          text: 'Image',
          handler: () => {
            this.attachImage();
          }
        },
        {
          text: 'Audio',
          handler: () => {
            // Implement audio recording/upload logic
            console.log('Audio option selected');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  private attachImage() {
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    // Handle file selection
    fileInput.onchange = (e) => this.handleFileUpload(e);
    
    // Trigger file selection dialog
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  async onMessageClick(event: Event, message: any) {
    if (message.sender === 'user') {
      message.showPopover = true;
      event.stopPropagation(); // Prevent event bubbling
    }
  }

  async getNewAIResponse(message: any) {
    try {
      // Close the popover
      message.showPopover = false;
      
      // Show loading state
      this.isTyping = true;

      // Get new AI response
      const aiResponse = await this.chatService.getAIResponse(
        this.character.id,
        message.content
      );

      // Send AI response as character message
      await this.chatService.sendTextMessage(
        this.character.id,
        aiResponse,
        'character'
      );
    } catch (error) {
      console.error('Error getting new AI response:', error);
      // Send error message
      await this.chatService.sendTextMessage(
        this.character.id,
        'Sorry, I encountered an error while processing your request.',
        'character'
      );
    } finally {
      this.isTyping = false;
    }
  }
}
