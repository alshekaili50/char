import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CharacterDetailsPage } from './character-details.page';
import { RouterModule } from '@angular/router';
import { CharacterChatDialogComponent } from '../../components/character-chat-dialog/character-chat-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{
      path: '',
      component: CharacterDetailsPage
    }])
  ],
  declarations: [CharacterDetailsPage, CharacterChatDialogComponent]
})
export class CharacterDetailsPageModule {}
