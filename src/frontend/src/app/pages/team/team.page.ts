import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from '../../core/api.service';

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor, IonContent, IonHeader, IonTitle, IonToolbar],
  template: `
    <ion-header><ion-toolbar><ion-title>Battle Team</ion-title></ion-toolbar></ion-header>
    <ion-content>
      <section class="team" *ngIf="team$ | async as team">
        <article *ngFor="let slot of team.slots">
          <img [src]="'/assets/crops/' + slot.cropCode + '.webp'" [alt]="slot.cropCode">
          <strong>Slot {{ slot.slot }}</strong>
          <span>{{ slot.cropCode }}</span>
        </article>
      </section>
    </ion-content>
  `,
  styles: [`.team{display:grid;gap:12px;padding:16px}.team article{display:flex;align-items:center;gap:12px;border:1px solid #d6e6c8;border-radius:8px;padding:10px}.team img{width:56px;height:56px;object-fit:contain}`]
})
export class TeamPage {
  private readonly api = inject(ApiService);
  readonly team$ = this.api.getTeam();
}
