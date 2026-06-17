import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'gb-dashboard',
  standalone: true,
  imports: [IonContent],
  host: { class: 'ion-page' },
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss'
})
export class DashboardPage {}
