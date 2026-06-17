import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-panel',
  standalone: true,
  imports: [NgIf],
  templateUrl: './game-panel.component.html',
  styleUrls: ['./game-panel.component.scss'],
})
export class GamePanelComponent {
  @Input() title = '';
  @Input() icon = '';
  @Input() rightText = '';
  @Input() variant: 'default' | 'purple' = 'default';
}
