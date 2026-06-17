import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeamFighterModel } from '../../dashboard.models';

@Component({
  selector: 'gb-team-panel',
  standalone: true,
  imports: [NgFor],
  templateUrl: './team-panel.component.html',
  styleUrl: './team-panel.component.scss'
})
export class TeamPanelComponent {
  @Input({ required: true }) fighters: TeamFighterModel[] = [];
  @Input({ required: true }) teamPower = 0;

  @Output() battleStarted = new EventEmitter<void>();
}
