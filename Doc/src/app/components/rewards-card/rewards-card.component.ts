import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DailyReward } from '../../pages/dashboard/models/dashboard.models';

@Component({
  selector: 'app-rewards-card',
  templateUrl: './rewards-card.component.html',
  styleUrls: ['./rewards-card.component.scss'],
})
export class RewardsCardComponent {
  @Input({ required: true }) reward!: DailyReward;
  @Output() claimClick = new EventEmitter<void>();

  get chestPercent(): number {
    return Math.min(100, Math.round(this.reward.chestProgress / this.reward.chestTarget * 100));
  }
}
