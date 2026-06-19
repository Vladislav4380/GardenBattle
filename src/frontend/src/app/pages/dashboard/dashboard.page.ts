import { AsyncPipe } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { DashboardComponentsModule } from './components/dashboard-components.module';
import { DashboardDataService } from './services/dashboard-data.service';

@Component({
  selector: 'gb-dashboard',
  standalone: true,
  imports: [AsyncPipe, IonContent, DashboardComponentsModule],
  host: { class: 'ion-page' },
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss'
})
export class DashboardPage implements OnInit {
  readonly dashboardData = inject(DashboardDataService);

  dashboardScale = 1;

  private readonly designWidth = 390;
  private readonly designHeight = 844;

  ngOnInit(): void {
    this.updateDashboardScale();
  }

  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  updateDashboardScale(): void {
    const viewport = window.visualViewport;
    const width = viewport?.width ?? window.innerWidth;
    const height = viewport?.height ?? window.innerHeight;
    const scale = Math.min(width / this.designWidth, height / this.designHeight);

    this.dashboardScale = Number(Math.max(0.75, Math.min(scale, 1.15)).toFixed(4));
  }
}
