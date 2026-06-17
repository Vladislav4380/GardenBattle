import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GardenPlot } from '../../pages/dashboard/models/dashboard.models';

@Component({
  selector: 'app-garden-panel',
  templateUrl: './garden-panel.component.html',
  styleUrls: ['./garden-panel.component.scss'],
})
export class GardenPanelComponent {
  @Input({ required: true }) plots: GardenPlot[] = [];
  @Output() harvestClick = new EventEmitter<void>();

  get occupiedCount(): number {
    return this.plots.filter(plot => plot.status !== 'locked').length;
  }
}
