# API & SignalR Contracts MVP

## Овощные Войны

---

# Общие правила

## REST API

Используется для:

* авторизации;
* получения данных;
* управления огородом;
* управления командой;
* получения результатов.

---

## SignalR

Используется для:

* управления боем;
* передачи игровых событий;
* синхронизации игроков в реальном времени.

---

# Авторизация

Авторизация происходит через Telegram Mini App.

Frontend передает:

```json
{
  "initData": "..."
}
```

---

# POST /api/auth/login

Авторизация игрока.

## Request

```json
{
  "initData": "telegram_init_data"
}
```

## Response

```json
{
  "playerId": "uuid",
  "token": "jwt_token",
  "isNewPlayer": false
}
```

---

# GET /api/player/profile

Получение профиля игрока.

## Response

```json
{
  "playerId": "uuid",
  "telegramId": 123456789,
  "firstName": "Vlad",
  "avatarCode": "gardener_01",

  "currencies": {
    "seeds": 1000,
    "stars": 0,
    "tournamentTokens": 10
  }
}
```

---

# GET /api/player/dashboard

Главный экран.

## Response

```json
{
  "profile": {},
  "currencies": {},
  "activeTournament": {},
  "battleStatistics": {}
}
```

---

# Огород

# GET /api/garden

Получить огород игрока.

## Response

```json
{
  "gardenId": "uuid",

  "plots": [
    {
      "plotId": "uuid",
      "plotIndex": 1,
      "isUnlocked": true,
      "isGreenhouse": false,

      "crop": {
        "playerCropId": "uuid",
        "cropCode": "tomato",
        "status": "active"
      }
    }
  ]
}
```

---

# POST /api/garden/plant

Посадить культуру.

## Request

```json
{
  "plotId": "uuid",
  "cropTypeId": "uuid"
}
```

## Response

```json
{
  "success": true
}
```

---

# POST /api/garden/harvest

Собрать урожай.

## Request

```json
{
  "plotId": "uuid"
}
```

---

# Команда

# GET /api/team

Получить текущую команду.

## Response

```json
{
  "slots": [
    {
      "slot": 1,
      "playerCropId": "uuid",
      "cropCode": "potato"
    }
  ]
}
```

---

# POST /api/team

Сохранить команду.

## Request

```json
{
  "slots": [
    {
      "slot": 1,
      "playerCropId": "uuid"
    },
    {
      "slot": 2,
      "playerCropId": "uuid"
    },
    {
      "slot": 3,
      "playerCropId": "uuid"
    }
  ]
}
```

---

# Бой

# POST /api/battle/search

Поиск соперника.

## Request

```json
{}
```

## Response

```json
{
  "battleId": "uuid",
  "status": "waiting"
}
```

---

# GET /api/battle/{battleId}

Получить информацию о бое.

## Response

```json
{
  "battleId": "uuid",
  "status": "in_progress",
  "battleType": "normal"
}
```

---

# GET /api/battle/{battleId}/result

Получить результат завершенного боя.

## Response

```json
{
  "winnerPlayerId": "uuid",

  "seedsReward": 100,

  "ratingDelta": 10,

  "chestReward": "silver"
}
```

---

# SignalR

# Hub

```text
/battleHub
```

---

# Подключение к бою

## Client → Server

```csharp
JoinBattle
```

### Payload

```json
{
  "battleId": "uuid"
}
```

---

# Выбор одной цели

## Client → Server

```csharp
SelectTarget
```

### Payload

```json
{
  "battleId": "uuid",

  "unitId": "uuid",

  "targetUnitId": "uuid"
}
```

---

# Выбор группы

## Client → Server

```csharp
SelectGroupTarget
```

### Payload

```json
{
  "battleId": "uuid",

  "unitIds": [
    "uuid",
    "uuid"
  ],

  "targetUnitId": "uuid"
}
```

---

# Использование способности

## Client → Server

```csharp
UseAbility
```

### Payload

```json
{
  "battleId": "uuid",

  "unitId": "uuid",

  "targetUnitId": "uuid"
}
```

---

# Покинуть бой

## Client → Server

```csharp
LeaveBattle
```

### Payload

```json
{
  "battleId": "uuid"
}
```

---

# События сервера

# BattleStarted

Отправляется после старта боя.

## Server → Client

```json
{
  "battleId": "uuid",

  "countdown": 3
}
```

---

# TargetChanged

Изменение цели.

## Server → Client

```json
{
  "unitId": "uuid",

  "targetUnitId": "uuid"
}
```

---

# DamageApplied

Нанесен урон.

## Server → Client

```json
{
  "attackerId": "uuid",

  "targetId": "uuid",

  "damage": 15,

  "targetHp": 85
}
```

---

# AbilityReady

Способность заряжена.

## Server → Client

```json
{
  "unitId": "uuid",

  "abilityCode": "tomato_bomb"
}
```

---

# AbilityUsed

Способность использована.

## Server → Client

```json
{
  "unitId": "uuid",

  "abilityCode": "tomato_bomb"
}
```

---

# CharacterDied

Персонаж погиб.

## Server → Client

```json
{
  "unitId": "uuid"
}
```

---

# BattleStateChanged

Периодическая синхронизация состояния.

## Server → Client

```json
{
  "battleId": "uuid",

  "leftTeam": [],

  "rightTeam": []
}
```

---

# BattleFinished

Бой завершен.

## Server → Client

```json
{
  "battleId": "uuid",

  "winnerPlayerId": "uuid",

  "seedsReward": 100,

  "ratingDelta": 10,

  "chestReward": "silver"
}
```

---

# Последовательность запуска боя

```text
1. Игрок нажимает "Бой"

2. POST /api/battle/search

3. Backend создает battleId

4. Frontend подключается к SignalR

5. JoinBattle

6. BattleStarted

7. Countdown

8. InProgress

9. Игрок отправляет:
   SelectTarget
   SelectGroupTarget
   UseAbility

10. Backend отправляет:
    DamageApplied
    AbilityReady
    CharacterDied

11. BattleFinished

12. Frontend открывает экран результата
```

---

# Что уже спроектировано

✅ Игровая концепция

✅ Экономика

✅ PostgreSQL модель

✅ Redis BattleState

✅ Battle Engine MVP

✅ REST API

✅ SignalR контракты

---

# Следующий этап

Структура .NET решения:

```text
VegetableWars.Api
VegetableWars.Application
VegetableWars.Domain
VegetableWars.Infrastructure
VegetableWars.Realtime
VegetableWars.BattleEngine
```

После этого можно переходить к проектированию конкретных сервисов:

```text
BattleService
MatchmakingService
BattleEngineService
GardenService
PlayerService
TournamentService
```
