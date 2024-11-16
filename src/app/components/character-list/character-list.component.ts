import { Component, EventEmitter, Output } from '@angular/core';
import { Character } from '../../models/character.interface';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CharacterListComponent {
  @Output() characterSelected = new EventEmitter<Character>();

  characters: Character[] = [
    { id: 1, name: 'Character 1', description: 'Description 1' },
    { id: 2, name: 'Character 2', description: 'Description 2' },
    { id: 3, name: 'Character 3', description: 'Description 3' },
    { id: 4, name: 'Character 4', description: 'Description 4' }
  ];

  onSelect(character: Character): void {
    this.characterSelected.emit(character);
  }
}
