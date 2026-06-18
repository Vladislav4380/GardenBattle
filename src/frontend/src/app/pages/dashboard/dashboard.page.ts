import { NgComponentOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { DashboardCardsComponent } from './components/dashboard-cards/dashboard-cards.component';

@Component({
  selector: 'gb-dashboard',
  standalone: true,
  imports: [IonContent, NgComponentOutlet],
  host: { class: 'ion-page' },
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss'
})
export class DashboardPage {
  readonly dashboardCardsComponent = DashboardCardsComponent;
}
