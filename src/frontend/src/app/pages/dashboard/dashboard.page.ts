import { NgComponentOutlet } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
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
export class DashboardPage implements OnInit {
  readonly dashboardCardsComponent = DashboardCardsComponent;

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
