import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Character } from '../../models/character.interface';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.page.html',
  styleUrls: ['./character-details.page.scss']
})
export class CharacterDetailsPage implements OnInit {
  character?: Character;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // Mock data for now
    this.character = {
      id: id!,
      name: `Character ${id}`,
      description: `Description for character ${id}`,
      image: `https://picsum.photos/id/${id}/200/200`,
      avatarUrl: `https://picsum.photos/id/${id}/100/100`
    };
  }
}
