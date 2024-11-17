import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Character } from '../../models/character.interface';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class CharacterListComponent {
  @Input() characters: Character[] = [];
  @Output() characterSelected = new EventEmitter<Character>();
  
  filteredCharacters: Character[] = [];

  ngOnInit() {
    this.filterCharacters();
  }

  ngOnChanges() {
    this.filterCharacters();
  }

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filterCharacters(query);
  }

  filterCharacters(searchQuery: string = '') {
    if (searchQuery) {
      this.filteredCharacters = this.characters.filter(char => 
        char.name.toLowerCase().includes(searchQuery)
      );
    } else {
      this.filteredCharacters = this.characters;
    }
  }

  deleteCharacter(character: Character) {
    // Implement delete logic
    console.log('Delete character:', character);
  }

  openCharacterForm() {
    // Implement character form opening logic
    console.log('Open character form');
  }

  getRelationIcon(relation: string | undefined): string {
    switch(relation) {
      case 'formal': return 'business';
      case 'casual': return 'people';
      case 'friends': return 'heart-half';
      case 'romance': return 'heart';
      default: return 'person';
    }
  }

  getRelationColor(relation: string | undefined): string {
    switch(relation) {
      case 'formal': return 'primary';
      case 'casual': return 'secondary';
      case 'friends': return 'tertiary';
      case 'romance': return 'danger';
      default: return 'medium';
    }
  }

  onSelect(character: Character): void {
    this.characterSelected.emit(character);
  }
}
