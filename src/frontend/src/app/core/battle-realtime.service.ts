import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BattleStateChangedEvent } from '../models/contracts';

@Injectable({ providedIn: 'root' })
export class BattleRealtimeService {
  readonly state = signal<BattleStateChangedEvent | null>(null);
  private connection?: signalR.HubConnection;

  async connect(battleId: string): Promise<void> {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/battleHub')
      .withAutomaticReconnect()
      .build();

    this.connection.on('BattleStateChanged', (event: BattleStateChangedEvent) => this.state.set(event));
    await this.connection.start();
    await this.connection.invoke('JoinBattle', { battleId });
  }

  selectTarget(battleId: string, unitId: string, targetUnitId: string): Promise<void> {
    return this.connection?.invoke('SelectTarget', { battleId, unitId, targetUnitId }) ?? Promise.resolve();
  }

  selectGroupTarget(battleId: string, unitIds: string[], targetUnitId: string): Promise<void> {
    return this.connection?.invoke('SelectGroupTarget', { battleId, unitIds, targetUnitId }) ?? Promise.resolve();
  }

  useAbility(battleId: string, unitId: string, targetUnitId?: string): Promise<void> {
    return this.connection?.invoke('UseAbility', { battleId, unitId, targetUnitId }) ?? Promise.resolve();
  }
}
