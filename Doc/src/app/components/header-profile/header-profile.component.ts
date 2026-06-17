import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerProfile } from '../../pages/dashboard/models/dashboard.models';

@Component({
  selector: 'app-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.scss'],
})
export class HeaderProfileComponent {
  @Input({ required: true }) player!: PlayerProfile;
  @Output() shopClick = new EventEmitter<void>();

  get expPercent(): number {
    if (!this.player?.nextLevelExp) {
      return 0;
    }

    return Math.min(100, Math.round(this.player.exp / this.player.nextLevelExp * 100));
  }
}
