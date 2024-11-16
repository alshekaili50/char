import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CharacterListComponent } from '../components/character-list/character-list.component';
import { CharacterFormComponent } from '../components/character-form/character-form.component';
import { Character } from '../models/character.interface';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    CharacterListComponent,
    CharacterFormComponent
  ]
})
export class Tab1Page {
  constructor(
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  onCharacterSelected(character: Character): void {
    this.router.navigate([`/tabs/tab1/character/${character.id}`]);
  }

  async openAddCharacterModal() {
    const modal = await this.modalCtrl.create({
      component: CharacterFormComponent
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      console.log('New character:', data);
    }
  }
}
