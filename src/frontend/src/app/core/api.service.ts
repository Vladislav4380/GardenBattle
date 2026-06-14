import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BattleStateChangedEvent, CropTypeDto, GardenResponse, LoginResponse, TeamSlotDto } from '../models/contracts';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  login(initData: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { initData });
  }

  getCrops(): Observable<CropTypeDto[]> {
    return this.http.get<CropTypeDto[]>(`${this.baseUrl}/crops`);
  }

  getGarden(): Observable<GardenResponse> {
    return this.http.get<GardenResponse>(`${this.baseUrl}/garden`);
  }

  getTeam(): Observable<{ slots: TeamSlotDto[] }> {
    return this.http.get<{ slots: TeamSlotDto[] }>(`${this.baseUrl}/team`);
  }

  searchBattle(): Observable<{ battleId: string; status: string }> {
    return this.http.post<{ battleId: string; status: string }>(`${this.baseUrl}/battle/search`, { battleType: 'Normal' });
  }

  getBattleState(battleId: string): Observable<BattleStateChangedEvent> {
    return this.http.get<BattleStateChangedEvent>(`${this.baseUrl}/battle/${battleId}/state`);
  }
}
