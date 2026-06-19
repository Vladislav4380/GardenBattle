import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, forkJoin, from, map, of, shareReplay, switchMap } from 'rxjs';
import {
  DashboardGardenCardData,
  DashboardHeaderData,
  DashboardRewardsCardData,
  DashboardTeamCardData,
  DashboardTournamentCardData
} from '../models/dashboard.models';

interface DashboardImageData {
  imageBase64: string;
  imageMimeType: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private readonly http = inject(HttpClient);

  readonly header$: Observable<DashboardHeaderData> = of(this.createHeader()).pipe(
    delay(120),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly gardenCard$: Observable<DashboardGardenCardData> = forkJoin({
    tomato: this.loadAssetImage('assets/dashboard/plot-tomato.png'),
    carrot: this.loadAssetImage('assets/dashboard/plot-carrot.png'),
    cucumber: this.loadAssetImage('assets/dashboard/plot-cucumber.png')
  }).pipe(
    map((images) => this.createGardenCard(images)),
    delay(120),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly teamCard$: Observable<DashboardTeamCardData> = forkJoin({
    tomato: this.loadAssetImage('assets/dashboard/tomatto.png'),
    carrot: this.loadAssetImage('assets/dashboard/carrot.png'),
    cucumber: this.loadAssetImage('assets/dashboard/cucumber.png')
  }).pipe(
    map((images) => this.createTeamCard(images)),
    delay(120),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly tournamentCard$: Observable<DashboardTournamentCardData> = of(this.createTournamentCard()).pipe(
    delay(120),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly rewardsCard$: Observable<DashboardRewardsCardData> = of(this.createRewardsCard()).pipe(
    delay(120),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private createHeader(): DashboardHeaderData {
    return {
      playerName: 'Молодой\nсадовник',
      coins: 1250,
      gems: 30,
      xpCurrent: 120,
      xpTarget: 300
    };
  }

  private createGardenCard(images: Record<'tomato' | 'carrot' | 'cucumber', DashboardImageData>): DashboardGardenCardData {
    return {
      title: 'ОГОРОД',
      iconSrc: 'assets/dashboard/hud-nav-garden.png',
      summaryText: '3/4 грядки занято',
      plots: [
        {
          id: 1,
          slot: 1,
          state: 'ready',
          ...images.tomato,
          statusText: 'Готово!'
        },
        {
          id: 2,
          slot: 2,
          state: 'growing',
          ...images.carrot,
          statusText: '23м 45с'
        },
        {
          id: 3,
          slot: 3,
          state: 'ready',
          ...images.cucumber,
          statusText: 'Готово!'
        },
        {
          id: 4,
          slot: 4,
          state: 'locked',
          ...images.tomato,
          unlockLevel: 20
        },
        {
          id: 5,
          slot: 5,
          state: 'ready',
          ...images.tomato,
          statusText: 'Готово!'
        },
        {
          id: 6,
          slot: 6,
          state: 'growing',
          ...images.carrot,
          statusText: '23м 45с'
        },
        {
          id: 7,
          slot: 7,
          state: 'ready',
          ...images.cucumber,
          statusText: 'Готово!'
        },
        {
          id: 8,
          slot: 8,
          state: 'locked',
          ...images.tomato,
          unlockLevel: 2
        }
      ]
    };
  }

  private createTeamCard(images: Record<'tomato' | 'carrot' | 'cucumber', DashboardImageData>): DashboardTeamCardData {
    return {
      title: 'КОМАНДА',
      iconSrc: 'assets/dashboard/hud-battle-swords.png',
      summaryText: 'Сила команды: 120',
      members: [
        {
          id: 'team-1',
          slot: 1,
          state: 'ready',
          ...images.tomato,
          statusText: 'Готово!'
        },
        {
          id: 'team-2',
          slot: 2,
          state: 'growing',
          ...images.carrot,
          statusText: '23м 45с'
        },
        {
          id: 'team-3',
          slot: 3,
          state: 'ready',
          ...images.cucumber,
          statusText: 'Готово!'
        }
      ]
    };
  }

  private createTournamentCard(): DashboardTournamentCardData {
    return {
      leagueName: 'Бронзовая лига I',
      playerPlace: 1253,
      participantsCount: 1523
    };
  }

  private createRewardsCard(): DashboardRewardsCardData {
    return {
      coins: 500,
      gems: 10,
      cards: 1,
      chestProgressCurrent: 2,
      chestProgressTarget: 10,
      chestProgressValue: 27
    };
  }

  private loadAssetImage(assetPath: string): Observable<DashboardImageData> {
    return this.http.get(assetPath, { responseType: 'blob' }).pipe(
      switchMap((blob) => from(this.blobToDataUrl(blob))),
      map((dataUrl) => this.toImageData(dataUrl))
    );
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  private toImageData(dataUrl: string): DashboardImageData {
    const [metadata, imageBase64] = dataUrl.split(',');
    const imageMimeType = metadata.match(/^data:(.*);base64$/)?.[1] ?? 'image/png';

    return {
      imageBase64,
      imageMimeType
    };
  }
}
