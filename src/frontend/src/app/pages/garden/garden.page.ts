import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { GardenPlotDto } from '../../models/contracts';

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, RouterLink, IonContent],
  templateUrl: './garden.page.html',
  styleUrl: './garden.page.scss'
})
export class GardenPage {
  private readonly api = inject(ApiService);
  readonly loadError = signal<string | null>(null);
  readonly garden$ = this.api.getGarden().pipe(
    catchError(() => {
      this.loadError.set('Backend is unavailable. Start GardenBattle.Api on http://localhost:5232.');
      return of(null);
    })
  );

  readonly cropMeta: Record<string, { name: string; role: string; ability: string; level: number }> = {
    potato: { name: 'Картошка', role: 'Танк', ability: 'Земляной щит', level: 3 },
    cucumber: { name: 'Огурец', role: 'Атака', ability: 'Скользкий маневр', level: 2 },
    tomato: { name: 'Помидор', role: 'Урон', ability: 'Томатный взрыв', level: 4 },
    corn: { name: 'Кукуруза', role: 'Стрелок', ability: 'Кукурузный залп', level: 3 },
    pepper: { name: 'Перец', role: 'Магия', ability: 'Огненный рывок', level: 5 },
    zucchini: { name: 'Кабачок', role: 'Защита', ability: 'Лозовая стража', level: 2 }
  };

  cropName(plot: GardenPlotDto): string {
    return plot.crop ? this.cropMeta[plot.crop.cropCode]?.name ?? plot.crop.cropCode : 'Новая грядка';
  }

  cropRole(plot: GardenPlotDto): string {
    return plot.crop ? this.cropMeta[plot.crop.cropCode]?.role ?? 'Боец' : 'Заблокировано';
  }

  cropAbility(plot: GardenPlotDto): string {
    return plot.crop ? this.cropMeta[plot.crop.cropCode]?.ability ?? 'Навык скрыт' : 'Открыть за семена';
  }

  cropLevel(plot: GardenPlotDto): number {
    return plot.crop ? this.cropMeta[plot.crop.cropCode]?.level ?? 1 : plot.plotIndex + 1;
  }
}
