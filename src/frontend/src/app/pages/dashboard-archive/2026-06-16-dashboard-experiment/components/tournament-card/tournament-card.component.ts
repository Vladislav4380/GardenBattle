import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TournamentModel } from '../../dashboard.models';

@Component({
  selector: 'gb-tournament-card',
  standalone: true,
  templateUrl: './tournament-card.component.html',
  styleUrl: './tournament-card.component.scss'
})
export class TournamentCardComponent {
  @Input({ required: true }) tournament!: TournamentModel;

  @Output() tournamentOpened = new EventEmitter<void>();
}
