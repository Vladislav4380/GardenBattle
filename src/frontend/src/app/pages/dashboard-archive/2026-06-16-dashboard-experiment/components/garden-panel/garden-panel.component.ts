import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GardenPlotModel } from '../../dashboard.models';

@Component({
  selector: 'gb-garden-panel',
  standalone: true,
  imports: [NgClass, NgFor, NgIf],
  templateUrl: './garden-panel.component.html',
  styleUrl: './garden-panel.component.scss'
})
export class GardenPanelComponent {
  @Input({ required: true }) plots: GardenPlotModel[] = [];

  @Output() harvestClicked = new EventEmitter<void>();

  get occupiedPlotsText(): string {
    const occupied = this.plots.filter((plot) => plot.state !== 'locked').length;
    return `${occupied}/${this.plots.length} грядки занято`;
  }
}
