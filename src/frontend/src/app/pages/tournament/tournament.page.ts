import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar],
  template: '<ion-header><ion-toolbar><ion-title>Weekly Tournament</ion-title></ion-toolbar></ion-header><ion-content class="ion-padding">Rating, weekly wins, and reward tiers live here.</ion-content>'
})
export class TournamentPage {}
