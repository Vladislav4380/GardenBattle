import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { GARDEN_SEEDLINGS, GardenSeedlingCatalogItem } from '../garden/garden-seedlings.data';

@Component({
  standalone: true,
  imports: [IonContent],
  host: { class: 'ion-page' },
  templateUrl: './garden-seedlings.page.html',
  styleUrl: './garden-seedlings.page.scss'
})
export class GardenSeedlingsPage {
  readonly seedlings = GARDEN_SEEDLINGS;
  private readonly router = inject(Router);

  grow(event: MouseEvent, seedling: GardenSeedlingCatalogItem): void {
    void this.router.navigate(['/garden'], {
      queryParams: {
        seedling: seedling.id,
        cursorX: Math.round(event.clientX),
        cursorY: Math.round(event.clientY)
      }
    });
  }

  backToGarden(): void {
    void this.router.navigateByUrl('/garden');
  }
}
