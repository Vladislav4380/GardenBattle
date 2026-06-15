import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TelegramMiniAppService } from './core/telegram-mini-app.service';

@Component({
  selector: 'gb-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: '<ion-app><ion-router-outlet [animated]="false" /></ion-app>'
})
export class AppComponent {
  private readonly telegram = inject(TelegramMiniAppService);

  constructor() {
    this.telegram.ready();
  }
}
