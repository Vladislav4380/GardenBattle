import { Component, Input } from '@angular/core';
import { DashboardTeamMemberData } from '../../models/dashboard.models';
import { DashboardGardenPlotComponent } from '../dashboard-garden-plot/dashboard-garden-plot.component';

@Component({
  selector: 'gb-dashboard-team-card',
  standalone: true,
  imports: [DashboardGardenPlotComponent],
  templateUrl: './dashboard-team-card.component.html',
  styleUrl: './dashboard-team-card.component.scss'
})
export class DashboardTeamCardComponent {
  @Input() title = '';
  @Input() iconSrc = '';
  @Input() summaryText = '';
  @Input() members: DashboardTeamMemberData[] = [];
}
