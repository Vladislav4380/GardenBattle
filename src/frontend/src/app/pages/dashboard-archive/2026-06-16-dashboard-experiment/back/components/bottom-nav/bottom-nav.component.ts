import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DashboardTabModel } from '../../dashboard.models';

@Component({
  selector: 'gb-bottom-nav',
  standalone: true,
  imports: [NgFor],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss'
})
export class BottomNavComponent {
  @Input({ required: true }) tabs: DashboardTabModel[] = [];

  @Output() tabSelected = new EventEmitter<string>();
}
