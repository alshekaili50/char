import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Character } from '../../models/character.interface';
import { CharacterService } from '../../services/character.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-character-form',
  templateUrl: './character-form.component.html',
  styleUrls: ['./character-form.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class CharacterFormComponent {
  @Output() formSubmit = new EventEmitter<Partial<Character>>();
  @Output() formCancel = new EventEmitter<void>();
  @Input() isModal = false;
  
  characterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private characterService: CharacterService,
    private modalCtrl: ModalController
  ) {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      photoURL: [''],
      relation: ['casual', Validators.required]
    });
  }

  async onSubmit() {
    if (this.characterForm.valid) {
      try {
        await this.characterService.addCharacter(this.characterForm.value);
        if (this.isModal) {
          this.modalCtrl.dismiss(true);
        }
      } catch (error) {
        console.error('Error saving character:', error);
      }
    }
  }

  onCancel() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
    }
  }
}
