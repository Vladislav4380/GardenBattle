export interface PlayerModel {
  name: string;
  level: number;
  experience: number;
  nextLevelExperience: number;
  avatarUrl: string;
}

export interface CurrencyModel {
  coins: number;
  gems: number;
}

export interface GardenPlotModel {
  cropName: string;
  cropUrl?: string;
  state: 'ready' | 'growing' | 'locked';
  timer?: string;
  note?: string;
}

export interface TeamFighterModel {
  name: string;
  level: number;
  power: number;
  maxPower: number;
  imageUrl: string;
}

export interface TournamentModel {
  league: string;
  place: number;
  participants: number;
}

export interface RewardModel {
  coins: number;
  gems: number;
  cards: number;
  chestProgress: number;
  chestTarget: number;
}

export interface DashboardTabModel {
  key: string;
  label: string;
  iconUrl: string;
  active: boolean;
}
