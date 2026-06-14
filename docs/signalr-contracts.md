# SignalR Contracts MVP

Hub path:

```text
/battleHub
```

## Client to Server

### `JoinBattle`

```json
{ "battleId": "uuid" }
```

### `SelectTarget`

```json
{
  "battleId": "uuid",
  "unitId": "uuid",
  "targetUnitId": "uuid"
}
```

### `SelectGroupTarget`

```json
{
  "battleId": "uuid",
  "unitIds": ["uuid", "uuid"],
  "targetUnitId": "uuid"
}
```

### `UseAbility`

```json
{
  "battleId": "uuid",
  "unitId": "uuid",
  "targetUnitId": "uuid"
}
```

### `LeaveBattle`

```json
{ "battleId": "uuid" }
```

## Server to Client

### `BattleStarted`

```json
{ "battleId": "uuid", "countdown": 3 }
```

### `BattleStateChanged`

```json
{
  "battleId": "uuid",
  "status": "InProgress",
  "leftTeam": [],
  "rightTeam": []
}
```

### `TargetChanged`

```json
{ "unitId": "uuid", "targetUnitId": "uuid" }
```

### `DamageApplied`

```json
{
  "attackerId": "uuid",
  "targetId": "uuid",
  "damage": 15,
  "targetHp": 85
}
```

### `AbilityReady`

```json
{ "unitId": "uuid", "abilityCode": "tomato_bomb" }
```

### `AbilityUsed`

```json
{ "unitId": "uuid", "abilityCode": "tomato_bomb" }
```

### `CharacterDied`

```json
{ "unitId": "uuid" }
```

### `BattleFinished`

```json
{
  "battleId": "uuid",
  "winnerPlayerId": "uuid",
  "seedsReward": 100,
  "ratingDelta": 10,
  "chestReward": "silver"
}
```

## Battle Flow

```text
POST /api/battle/search
  -> connect /battleHub
  -> JoinBattle
  -> BattleStarted
  -> BattleStateChanged every 250 ms
  -> SelectTarget / SelectGroupTarget / UseAbility
  -> DamageApplied / AbilityReady / CharacterDied
  -> BattleFinished
```
