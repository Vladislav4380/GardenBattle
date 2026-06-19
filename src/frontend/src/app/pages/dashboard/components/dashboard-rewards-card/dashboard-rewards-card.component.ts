import { Component, Input } from '@angular/core';

@Component({
  selector: 'gb-dashboard-rewards-card',
  standalone: true,
  templateUrl: './dashboard-rewards-card.component.html',
  styleUrl: './dashboard-rewards-card.component.scss'
})
export class DashboardRewardsCardComponent {
  @Input() coins = 0;
  @Input() gems = 0;
  @Input() cards = 0;
  @Input() chestProgressCurrent = 0;
  @Input() chestProgressTarget = 0;
  @Input() chestProgressValue = 0;
}
