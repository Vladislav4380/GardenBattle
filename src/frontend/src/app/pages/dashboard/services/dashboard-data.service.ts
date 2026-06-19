import { Injectable } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import {
  DashboardGardenCardData,
  DashboardHeaderData,
  DashboardRewardsCardData,
  DashboardTeamCardData,
  DashboardTournamentCardData
} from '../models/dashboard.models';

interface DashboardImageData {
  imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  readonly header$: Observable<DashboardHeaderData> = of(this.createHeader()).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly gardenCard$: Observable<DashboardGardenCardData> = of(this.createGardenCard({
    tomato: this.createImageData('assets/dashboard/plot-tomato.webp'),
    carrot: this.createImageData('assets/dashboard/plot-carrot.webp'),
    cucumber: this.createImageData('assets/dashboard/plot-cucumber.webp')
  })).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly teamCard$: Observable<DashboardTeamCardData> = of(this.createTeamCard({
    tomato: this.createImageData('assets/dashboard/tomatto.webp'),
    carrot: this.createImageData('assets/dashboard/carrot.webp'),
    cucumber: this.createImageData('assets/dashboard/cucumber.webp')
  })).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly tournamentCard$: Observable<DashboardTournamentCardData> = of(this.createTournamentCard()).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly rewardsCard$: Observable<DashboardRewardsCardData> = of(this.createRewardsCard()).pipe(
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
      iconSrc: 'assets/shared/hud/hud-nav-garden.png',
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
      iconSrc: 'assets/shared/hud/hud-battle-swords.png',
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
      chestProgressCurrent: 5,
      chestProgressTarget: 10
    };
  }

  private createImageData(imageUrl: string): DashboardImageData {
    return {
      imageUrl
    };
  }
}
