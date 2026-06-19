import { Component, Input } from '@angular/core';
import { GardenPlotState } from '../../models/dashboard.models';

@Component({
  selector: 'gb-dashboard-garden-plot',
  standalone: true,
  templateUrl: './dashboard-garden-plot.component.html',
  styleUrl: './dashboard-garden-plot.component.scss'
})
export class DashboardGardenPlotComponent {
  @Input() state: GardenPlotState = 'empty';
  @Input() slot = 0;

  @Input() imageBase64 = '';
  @Input() imageMimeType = 'image/png';
  @Input() statusText = '';
  @Input() unlockLevel?: number;

  get ariaLabel(): string {
    if (this.state === 'locked') {
      return `Грядка ${this.slot}: закрыта до ${this.lockedLevelText}`;
    }

    if (this.state === 'growing') {
      return `Грядка ${this.slot}: растет`;
    }

    if (this.state === 'empty') {
      return `Грядка ${this.slot}: пустая`;
    }

    return `Грядка ${this.slot}: готово`;
  }

  get imageSrc(): string {
    if (!this.imageBase64) {
      return '';
    }

    if (this.imageBase64.startsWith('data:')) {
      return this.imageBase64;
    }

    return `data:${this.imageMimeType};base64,${this.imageBase64}`;
  }

  get actionIconSrc(): string {
    if (this.state === 'ready') {
      return 'assets/dashboard/hub-ok.png';
    }

    if (this.state === 'growing') {
      return 'assets/dashboard/hub-timer.png';
    }

    return '';
  }

  get lockedLevelText(): string {
    return `уровень ${this.unlockLevel ?? 2}`;
  }
}
