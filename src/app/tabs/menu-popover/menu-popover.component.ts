import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu-popover',
  template: `
    <ion-list lines="none">
      <ion-item>
        <ion-label>
          <h2>{{ user?.email }}</h2>
          <p [ngClass]="isSubscribed ? 'subscribed' : 'not-subscribed'">
            {{ isSubscribed ? 'Premium Member' : 'Free Member' }}
          </p>
        </ion-label>
      </ion-item>
      
      <ion-item button (click)="onItemClick('profile')">
        <ion-icon name="person-outline" slot="start"></ion-icon>
        <ion-label>Profile</ion-label>
      </ion-item>
      
      <ion-item button (click)="onItemClick('settings')">
        <ion-icon name="settings-outline" slot="start"></ion-icon>
        <ion-label>Settings</ion-label>
      </ion-item>
      
      <ion-item button (click)="onItemClick('signout')" class="signout-item">
        <ion-icon name="log-out-outline" slot="start"></ion-icon>
        <ion-label>Sign Out</ion-label>
      </ion-item>
    </ion-list>
  `,
  styles: [`
    .subscribed {
      color: var(--ion-color-success);
      font-weight: bold;
    }
    .not-subscribed {
      color: var(--ion-color-medium);
    }
    .signout-item {
      color: var(--ion-color-danger);
    }
    ion-item {
      --padding-start: 16px;
      --padding-end: 16px;
    }
  `]
})
export class MenuPopoverComponent {
  user: any
  isSubscribed: boolean = false;

  constructor(private popoverCtrl: PopoverController, private authService: AuthService) {
    this.authService.getUser().subscribe(user => {
      this.user = user;
      this.authService.isSubscribed().subscribe(isSubscribed => {
        this.isSubscribed = isSubscribed;
      });
    });
  }

  onItemClick(action: string) {
    this.popoverCtrl.dismiss(action);
  }
} 