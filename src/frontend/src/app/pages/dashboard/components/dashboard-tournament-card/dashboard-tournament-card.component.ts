import { Component, Input } from '@angular/core';

@Component({
  selector: 'gb-dashboard-tournament-card',
  standalone: true,
  templateUrl: './dashboard-tournament-card.component.html',
  styleUrl: './dashboard-tournament-card.component.scss'
})
export class DashboardTournamentCardComponent {
  @Input() leagueName = '';
  @Input() playerPlace = 0;
  @Input() participantsCount = 0;
}
