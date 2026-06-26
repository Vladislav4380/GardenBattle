import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'splash' },
  { path: 'splash', loadComponent: () => import('./pages/splash/splash.page').then((m) => m.SplashPage) },
  { path: 'welcome', loadComponent: () => import('./pages/welcome/welcome.page').then((m) => m.WelcomePage) },
  { path: 'avatar-select', loadComponent: () => import('./pages/avatar-select/avatar-select.page').then((m) => m.AvatarSelectPage) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage) },
  { path: 'starter-garden', pathMatch: 'full', redirectTo: 'garden' },
  { path: 'garden', loadComponent: () => import('./pages/garden/garden.page').then((m) => m.GardenPage) },
  { path: 'team', loadComponent: () => import('./pages/team/team.page').then((m) => m.TeamPage) },
  { path: 'fight', loadComponent: () => import('./pages/fight/fight.page').then((m) => m.FightPage) },
  { path: 'battle', loadComponent: () => import('./pages/battle/battle.page').then((m) => m.BattlePage) },
  { path: 'tournament', loadComponent: () => import('./pages/tournament/tournament.page').then((m) => m.TournamentPage) },
  { path: 'market', loadComponent: () => import('./pages/market/market.page').then((m) => m.MarketPage) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage) }
];
