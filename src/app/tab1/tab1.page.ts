import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CharacterListComponent } from '../components/character-list/character-list.component';
import { CharacterFormComponent } from '../components/character-form/character-form.component';
import { Character } from '../models/character.interface';
import { CharacterService } from '../services/character.service';

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
export class Tab1Page implements OnInit {
  characters: Character[] = [];

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private characterService: CharacterService
  ) {}

  ngOnInit() {
    this.loadCharacters();
  }

  loadCharacters() {
    this.characterService.getCharacters().subscribe(characters => {
      this.characters = characters;
    });
  }

  onCharacterSelected(character: Character): void {
    this.router.navigate([`/tabs/tab1/character/${character.id}`]);
  }

  async openAddCharacterModal() {
    const modal = await this.modalCtrl.create({
      component: CharacterFormComponent,
      componentProps: {
        isModal: true,
        character: {} // Pass empty character for new character creation
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.loadCharacters(); // Refresh the list after adding
    }
  }
}
