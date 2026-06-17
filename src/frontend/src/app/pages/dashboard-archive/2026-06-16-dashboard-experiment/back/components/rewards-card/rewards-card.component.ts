import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RewardModel } from '../../dashboard.models';

@Component({
  selector: 'gb-rewards-card',
  standalone: true,
  templateUrl: './rewards-card.component.html',
  styleUrl: './rewards-card.component.scss'
})
export class RewardsCardComponent {
  @Input({ required: true }) rewards!: RewardModel;

  @Output() rewardClaimed = new EventEmitter<void>();
}
