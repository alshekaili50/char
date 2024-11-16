import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() characters: Character[] = [];
  @Output() characterSelected = new EventEmitter<Character>();

  onSelect(character: Character): void {
    this.characterSelected.emit(character);
  }
}
