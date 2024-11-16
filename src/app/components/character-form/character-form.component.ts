import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Character } from '../../models/character.interface';

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
  
  characterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['']
    });
  }

  onSubmit() {
    if (this.characterForm.valid) {
      this.formSubmit.emit(this.characterForm.value);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}
