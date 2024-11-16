import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MenuPopoverComponent } from './menu-popover/menu-popover.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html'
})
export class TabsPage {
  constructor(
    private popoverCtrl: PopoverController,
    private authService: AuthService,
    private router: Router
  ) {}

  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MenuPopoverComponent,
      event: ev,
      translucent: true,
      size: 'auto'
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data) {
      switch(data) {
        case 'profile':
          this.router.navigate(['/profile']);
          break;
        case 'settings':
          this.router.navigate(['/settings']);
          break;
        case 'signout':
          await this.authService.signOut();
          this.router.navigate(['/login']);
          break;
      }
    }
  }
}
