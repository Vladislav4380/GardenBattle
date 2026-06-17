import { Component } from '@angular/core';
import {
  DailyReward,
  Fighter,
  GardenPlot,
  NavigationItem,
  PlayerProfile,
  TournamentInfo,
} from './models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  player: PlayerProfile = {
    name: 'Молодой садовник',
    level: 1,
    exp: 120,
    nextLevelExp: 300,
    avatarImage: 'assets/dashboard/avatar-young-gardener.png',
    coins: 1250,
    gems: 30,
  };

  gardenPlots: GardenPlot[] = [
    {
      id: 1,
      name: 'Морковь',
      image: 'assets/dashboard/plot-carrot.png',
      status: 'ready',
    },
    {
      id: 2,
      name: 'Помидор',
      image: 'assets/dashboard/plot-tomato.png',
      status: 'growing',
      remainingText: '23м 45с',
    },
    {
      id: 3,
      name: 'Огурец',
      image: 'assets/dashboard/plot-cucumber.png',
      status: 'ready',
    },
    {
      id: 4,
      name: 'Грядка',
      image: '',
      status: 'locked',
      unlockLevel: 5,
    },
  ];

  team: Fighter[] = [
    {
      id: 1,
      name: 'Помидор',
      image: 'assets/dashboard/fighter-tomato.png',
      level: 1,
      currentHp: 40,
      maxHp: 50,
    },
    {
      id: 2,
      name: 'Огурец',
      image: 'assets/dashboard/fighter-cucumber.png',
      level: 1,
      currentHp: 30,
      maxHp: 50,
    },
    {
      id: 3,
      name: 'Морковь',
      image: 'assets/dashboard/fighter-carrot.png',
      level: 1,
      currentHp: 25,
      maxHp: 50,
    },
  ];

  tournament: TournamentInfo = {
    leagueName: 'Бронзовая лига I',
    rank: 1253,
    participants: 1523,
  };

  reward: DailyReward = {
    coins: 500,
    gems: 10,
    cards: 1,
    chestProgress: 2,
    chestTarget: 10,
    canClaim: true,
  };

  navigation: NavigationItem[] = [
    { key: 'home', title: 'Главная', icon: '🏠', active: true },
    { key: 'garden', title: 'Огород', icon: '🌱' },
    { key: 'battle', title: 'Бой', icon: '⚔️' },
    { key: 'team', title: 'Команда', icon: '🥕' },
    { key: 'profile', title: 'Профиль', icon: '👒' },
  ];

  get teamPower(): number {
    return 120;
  }

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
