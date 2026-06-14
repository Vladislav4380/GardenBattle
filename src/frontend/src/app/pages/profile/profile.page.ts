import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar],
  template: '<ion-header><ion-toolbar><ion-title>Guardian Avatar</ion-title></ion-toolbar></ion-header><ion-content class="ion-padding">Cosmetic guardian skins without battle stats.</ion-content>'
})
export class ProfilePage {}
