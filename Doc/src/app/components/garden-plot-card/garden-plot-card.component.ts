import { Component, Input } from '@angular/core';
import { GardenPlot } from '../../pages/dashboard/models/dashboard.models';

@Component({
  selector: 'app-garden-plot-card',
  templateUrl: './garden-plot-card.component.html',
  styleUrls: ['./garden-plot-card.component.scss'],
})
export class GardenPlotCardComponent {
  @Input({ required: true }) plot!: GardenPlot;
}
