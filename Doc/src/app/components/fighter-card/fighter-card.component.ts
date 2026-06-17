import { Component, Input } from '@angular/core';
import { Fighter } from '../../pages/dashboard/models/dashboard.models';

@Component({
  selector: 'app-fighter-card',
  templateUrl: './fighter-card.component.html',
  styleUrls: ['./fighter-card.component.scss'],
})
export class FighterCardComponent {
  @Input({ required: true }) fighter!: Fighter;

  get hpPercent(): number {
    return Math.min(100, Math.round(this.fighter.currentHp / this.fighter.maxHp * 100));
  }
}
