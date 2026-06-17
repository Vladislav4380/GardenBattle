import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyModel, PlayerModel } from '../../dashboard.models';

@Component({
  selector: 'gb-profile-header',
  standalone: true,
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  @Input({ required: true }) player!: PlayerModel;
  @Input({ required: true }) currencies!: CurrencyModel;

  @Output() shopOpened = new EventEmitter<void>();

  get experiencePercent(): number {
    return Math.round((this.player.experience / this.player.nextLevelExperience) * 100);
  }
}
