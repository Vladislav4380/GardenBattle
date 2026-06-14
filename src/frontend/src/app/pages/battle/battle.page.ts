import { Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ApiService } from '../../core/api.service';
import { BattleRealtimeService } from '../../core/battle-realtime.service';
import { BattleUnitDto } from '../../models/contracts';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, IonButton, IonContent, IonHeader, IonTitle, IonToolbar],
  templateUrl: './battle.page.html',
  styleUrl: './battle.page.scss'
})
export class BattlePage {
  private readonly api = inject(ApiService);
  readonly realtime = inject(BattleRealtimeService);
  readonly selectedUnitIds = signal<string[]>([]);
  readonly battleId = signal<string | null>(null);
  readonly canUseAbility = computed(() => this.selectedUnitIds().length === 1);

  startBattle(): void {
    this.api.searchBattle().subscribe(async (battle) => {
      this.battleId.set(battle.battleId);
      await this.realtime.connect(battle.battleId);
    });
  }

  selectAlly(unit: BattleUnitDto): void {
    this.selectedUnitIds.set([unit.unitId]);
  }

  targetEnemy(unit: BattleUnitDto): void {
    const battleId = this.battleId();
    const selected = this.selectedUnitIds();
    if (!battleId || selected.length === 0) {
      return;
    }

    if (selected.length === 1) {
      void this.realtime.selectTarget(battleId, selected[0], unit.unitId);
    } else {
      void this.realtime.selectGroupTarget(battleId, selected, unit.unitId);
    }
  }

  useAbility(unit: BattleUnitDto): void {
    const battleId = this.battleId();
    if (battleId) {
      void this.realtime.useAbility(battleId, unit.unitId, unit.targetUnitId);
    }
  }
}
