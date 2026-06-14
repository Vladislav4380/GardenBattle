import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar],
  template: '<ion-header><ion-toolbar><ion-title>Market</ion-title></ion-toolbar></ion-header><ion-content class="ion-padding">Beds, greenhouses, boosters, and Telegram Stars offers.</ion-content>'
})
export class MarketPage {}
