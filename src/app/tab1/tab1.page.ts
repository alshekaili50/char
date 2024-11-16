import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CharacterListComponent } from '../components/character-list/character-list.component';
import { Character } from '../models/character.interface';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CharacterListComponent]
})
export class Tab1Page {
  constructor(private router: Router) {}

  onCharacterSelected(character: Character): void {
    this.router.navigate([`/tabs/tab1/character/${character.id}`]);
  }
}
