import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Fighter } from '../../pages/dashboard/models/dashboard.models';

@Component({
  selector: 'app-team-panel',
  templateUrl: './team-panel.component.html',
  styleUrls: ['./team-panel.component.scss'],
})
export class TeamPanelComponent {
  @Input({ required: true }) fighters: Fighter[] = [];
  @Input() teamPower = 0;
  @Output() battleClick = new EventEmitter<void>();
}
