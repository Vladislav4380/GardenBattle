export interface PlayerProfile {
  name: string;
  level: number;
  exp: number;
  nextLevelExp: number;
  avatarImage: string;
  coins: number;
  gems: number;
}

export type GardenPlotStatus = 'ready' | 'growing' | 'locked';

export interface GardenPlot {
  id: number;
  name: string;
  image: string;
  status: GardenPlotStatus;
  remainingText?: string;
  unlockLevel?: number;
}

export interface Fighter {
  id: number;
  name: string;
  image: string;
  level: number;
  currentHp: number;
  maxHp: number;
}

export interface TournamentInfo {
  leagueName: string;
  rank: number;
  participants: number;
}

export interface DailyReward {
  coins: number;
  gems: number;
  cards: number;
  chestProgress: number;
  chestTarget: number;
  canClaim: boolean;
}

export interface NavigationItem {
  key: string;
  title: string;
  icon: string;
  active?: boolean;
}
