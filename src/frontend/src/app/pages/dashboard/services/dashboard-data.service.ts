import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import {
  DashboardDto,
  DashboardGardenCardData,
  DashboardHeaderData,
  DashboardRewardsCardData,
  DashboardTeamCardData,
  DashboardTournamentCardData
} from '../models/dashboard.models';
import { environment } from '../../../../environments/environment';
import { DashboardApiDataService } from './dashboard-api-data.service';
import { DashboardFakeDataService } from './dashboard-fake-data.service';

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private readonly apiDataSource = inject(DashboardApiDataService);
  private readonly fakeDataSource = inject(DashboardFakeDataService);

  readonly dashboard$: Observable<DashboardDto> = this.getDashboard().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly header$: Observable<DashboardHeaderData> = this.dashboard$.pipe(
    map((dashboard) => dashboard.header)
  );

  readonly gardenCard$: Observable<DashboardGardenCardData> = this.dashboard$.pipe(
    map((dashboard) => dashboard.gardenCard)
  );

  readonly teamCard$: Observable<DashboardTeamCardData> = this.dashboard$.pipe(
    map((dashboard) => dashboard.teamCard)
  );

  readonly tournamentCard$: Observable<DashboardTournamentCardData> = this.dashboard$.pipe(
    map((dashboard) => dashboard.tournamentCard)
  );

  readonly rewardsCard$: Observable<DashboardRewardsCardData> = this.dashboard$.pipe(
    map((dashboard) => dashboard.rewardsCard)
  );

  private getDashboard(): Observable<DashboardDto> {
    if (environment.appConfig.dataSources.dashboard === 'api') {
      return this.apiDataSource.getDashboard();
    }

    return this.fakeDataSource.getDashboard();
  }
}
