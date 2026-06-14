export interface LoginResponse {
  playerId: string;
  token: string;
  isNewPlayer: boolean;
}

export interface CropTypeDto {
  cropTypeId: string;
  code: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  abilityCode: string;
  abilityName: string;
  growthSeconds: number;
}

export interface GardenPlotDto {
  plotId: string;
  plotIndex: number;
  isUnlocked: boolean;
  isGreenhouse: boolean;
  crop?: {
    playerCropId: string;
    cropCode: string;
    status: string;
  };
}

export interface GardenResponse {
  gardenId: string;
  plots: GardenPlotDto[];
}

export interface TeamSlotDto {
  slot: number;
  playerCropId: string;
  cropCode: string;
}

export interface BattleUnitDto {
  unitId: string;
  playerId: string;
  cropCode: string;
  slot: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  abilityCharge: number;
  targetUnitId?: string;
  isAlive: boolean;
}

export interface BattleStateChangedEvent {
  battleId: string;
  status: string;
  leftTeam: BattleUnitDto[];
  rightTeam: BattleUnitDto[];
}
