import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'gb-splash',
  standalone: true,
  imports: [IonContent],
  templateUrl: './splash.page.html',
  styleUrl: './splash.page.scss'
})
export class SplashPage implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private timerId: number | undefined;
  private redirectTimerId: number | undefined;
  progress = 0;

  ngOnInit(): void {
    this.timerId = window.setInterval(() => {
      this.progress = Math.min(100, this.progress + 2);

      if (this.progress >= 100) {
        this.clearTimer();
        this.redirectTimerId = window.setTimeout(() => {
          void this.router.navigateByUrl('/garden');
        }, 700);
      }
    }, 120);
  }

  ngOnDestroy(): void {
    this.clearTimer();
    if (this.redirectTimerId !== undefined) {
      window.clearTimeout(this.redirectTimerId);
      this.redirectTimerId = undefined;
    }
  }

  private clearTimer(): void {
    if (this.timerId !== undefined) {
      window.clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }
}
