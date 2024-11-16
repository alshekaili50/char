import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { CharacterListComponent } from '../components/character-list/character-list.component';
import { CharacterFormComponent } from '../components/character-form/character-form.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    Tab1Page,
    CharacterListComponent,
    CharacterFormComponent
  ]
})
export class Tab1PageModule {} 