import { Component, Input } from '@angular/core';

@Component({
  selector: 'gb-dashboard-header',
  standalone: true,
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss'
})
export class DashboardHeaderComponent {
  @Input() playerName = '';
  @Input() coins = 0;
  @Input() gems = 0;
  @Input() xpCurrent = 0;
  @Input() xpTarget = 0;

  get xpText(): string {
    return `${this.xpCurrent}/${this.xpTarget}`;
  }

  get xpProgressPercent(): number {
    if (this.xpTarget <= 0) {
      return 0;
    }

    return Math.max(0, Math.min((this.xpCurrent / this.xpTarget) * 100, 100));
  }
}
