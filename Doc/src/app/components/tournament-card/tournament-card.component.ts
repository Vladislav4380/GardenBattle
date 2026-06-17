import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TournamentInfo } from '../../pages/dashboard/models/dashboard.models';

@Component({
  selector: 'app-tournament-card',
  templateUrl: './tournament-card.component.html',
  styleUrls: ['./tournament-card.component.scss'],
})
export class TournamentCardComponent {
  @Input({ required: true }) tournament!: TournamentInfo;
  @Output() openTournamentClick = new EventEmitter<void>();
}
