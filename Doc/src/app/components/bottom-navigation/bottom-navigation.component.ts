import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationItem } from '../../pages/dashboard/models/dashboard.models';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss'],
})
export class BottomNavigationComponent {
  @Input({ required: true }) items: NavigationItem[] = [];
  @Output() tabClick = new EventEmitter<string>();
}
