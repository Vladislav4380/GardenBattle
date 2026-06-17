import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { GardenPanelComponent } from './components/garden-panel/garden-panel.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { RewardsCardComponent } from './components/rewards-card/rewards-card.component';
import { TeamPanelComponent } from './components/team-panel/team-panel.component';
import { TournamentCardComponent } from './components/tournament-card/tournament-card.component';
import {
  CurrencyModel,
  DashboardTabModel,
  GardenPlotModel,
  PlayerModel,
  RewardModel,
  TeamFighterModel,
  TournamentModel
} from './dashboard.models';

@Component({
  selector: 'gb-dashboard',
  standalone: true,
  imports: [
    IonContent,
    ProfileHeaderComponent,
    GardenPanelComponent,
    TeamPanelComponent,
    TournamentCardComponent,
    RewardsCardComponent,
    BottomNavComponent
  ],
  host: { class: 'ion-page' },
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss'
})
export class DashboardPage {
  readonly player: PlayerModel = {
    name: 'Молодой садовник',
    level: 1,
    experience: 120,
    nextLevelExperience: 300,
    avatarUrl: 'assets/dashboard/mock-avatar-frame.webp'
  };

  readonly currencies: CurrencyModel = {
    coins: 1250,
    gems: 30
  };

  readonly gardenPlots: GardenPlotModel[] = [
    {
      cropName: 'Морковь',
      cropUrl: 'assets/dashboard/plot-carrot-mock.webp',
      state: 'ready'
    },
    {
      cropName: 'Помидор',
      cropUrl: 'assets/dashboard/plot-tomato-mock.webp',
      state: 'growing',
      timer: '23м 45с'
    },
    {
      cropName: 'Огурец',
      cropUrl: 'assets/dashboard/plot-cucumber-mock.webp',
      state: 'ready'
    },
    {
      cropName: 'Закрыто',
      state: 'locked',
      note: 'Откроется на 5 уровне'
    }
  ];

  readonly team: TeamFighterModel[] = [
    {
      name: 'Помидор',
      level: 1,
      power: 40,
      maxPower: 50,
      imageUrl: 'assets/dashboard/fighter-tomato-mock.webp'
    },
    {
      name: 'Огурец',
      level: 1,
      power: 30,
      maxPower: 50,
      imageUrl: 'assets/dashboard/fighter-cucumber-mock.webp'
    },
    {
      name: 'Морковь',
      level: 1,
      power: 25,
      maxPower: 50,
      imageUrl: 'assets/dashboard/fighter-carrot-mock.webp'
    }
  ];

  readonly teamPower = 120;

  readonly tournament: TournamentModel = {
    league: 'Бронзовая лига I',
    place: 1253,
    participants: 1523
  };

  readonly rewards: RewardModel = {
    coins: 500,
    gems: 10,
    cards: 1,
    chestProgress: 2,
    chestTarget: 10
  };

  readonly tabs: DashboardTabModel[] = [
    { key: 'home', label: 'Главная', iconUrl: 'assets/dashboard/mock-nav-home.webp', active: true },
    { key: 'garden', label: 'Огород', iconUrl: 'assets/dashboard/mock-nav-garden.webp', active: false },
    { key: 'battle', label: 'Бой', iconUrl: 'assets/dashboard/mock-nav-battle.webp', active: false },
    { key: 'team', label: 'Команда', iconUrl: 'assets/dashboard/mock-nav-team.webp', active: false },
    { key: 'profile', label: 'Профиль', iconUrl: 'assets/dashboard/mock-nav-profile.webp', active: false }
  ];

  openShop(): void {
    console.log('openShop');
  }

  harvest(): void {
    console.log('harvest');
  }

  startBattle(): void {
    console.log('startBattle');
  }

  openTournament(): void {
    console.log('openTournament');
  }

  claimReward(): void {
    console.log('claimReward');
  }

  navigateTab(tab: string): void {
    console.log('navigateTab', tab);
  }
}
