# API Specification v1

## Battle API + Matchmaking + SignalR Contracts

---

# Общие правила

Все REST API методы, кроме публичных, требуют JWT.

```http
Authorization: Bearer {token}
```

PlayerId текущего игрока извлекается из JWT Claim `sub`.

---

# Battle API

---

# POST /api/battle/search

Поиск соперника и создание боя.

## Authorization

```http
Authorization: Bearer {token}
```

## Request Body

```json
{
  "battleType": "normal"
}
```

## Описание полей

| Поле       | Обязательное | Назначение                     |
| ---------- | ------------ | ------------------------------ |
| battleType | Да           | Тип боя: обычный или турнирный |

## Возможные значения battleType

```text
normal
tournament
```

## Источник PlayerId

PlayerId берётся из JWT Claim `sub`.

## Validation Rules

* Игрок должен быть авторизован.
* У игрока должна быть собрана команда из 3 персонажей.
* Все персонажи команды должны иметь статус `active`.
* Игрок не должен уже находиться в активном бою.
* Для `tournament` должен существовать активный турнир.

## Success Response

```json
{
  "battleId": "uuid",
  "status": "waiting",
  "battleType": "normal"
}
```

## Error Codes

```json
{
  "code": "TEAM_NOT_READY",
  "message": "Player team must contain exactly 3 active units"
}
```

```json
{
  "code": "PLAYER_ALREADY_IN_BATTLE",
  "message": "Player already has active battle"
}
```

```json
{
  "code": "TOURNAMENT_NOT_ACTIVE",
  "message": "No active tournament found"
}
```

---

# GET /api/battle/{battleId}

Получить информацию о бое.

## Authorization

```http
Authorization: Bearer {token}
```

## Path Parameters

| Параметр | Обязательный | Назначение        |
| -------- | ------------ | ----------------- |
| battleId | Да           | Идентификатор боя |

## Query Parameters

Отсутствуют.

## Request Body

Отсутствует.

## Источник PlayerId

PlayerId берётся из JWT Claim `sub`.

## Validation Rules

* Бой должен существовать.
* Игрок должен быть участником боя.

## Success Response

```json
{
  "battleId": "uuid",
  "battleType": "normal",
  "status": "in_progress",
  "leftPlayerId": "uuid",
  "rightPlayerId": "uuid",
  "startedAt": "2026-06-11T15:00:00Z"
}
```

## Error Codes

```json
{
  "code": "BATTLE_NOT_FOUND",
  "message": "Battle not found"
}
```

```json
{
  "code": "ACCESS_DENIED",
  "message": "Player is not participant of this battle"
}
```

---

# GET /api/battle/{battleId}/state

Получить текущее состояние боя.

Используется как fallback, если клиент переподключился или пропустил SignalR события.

## Authorization

```http
Authorization: Bearer {token}
```

## Path Parameters

| Параметр | Обязательный | Назначение        |
| -------- | ------------ | ----------------- |
| battleId | Да           | Идентификатор боя |

## Request Body

Отсутствует.

## Источник PlayerId

PlayerId берётся из JWT Claim `sub`.

## Validation Rules

* Бой должен существовать.
* Игрок должен быть участником боя.
* Бой должен быть активен или недавно завершён.

## Success Response

```json
{
  "battleId": "uuid",
  "status": "in_progress",
  "tickNumber": 128,
  "leftTeam": [
    {
      "unitId": "uuid",
      "playerCropId": "uuid",
      "cropCode": "tomato",
      "slot": 1,
      "currentHp": 80,
      "maxHp": 100,
      "targetUnitId": "uuid",
      "ability": {
        "abilityCode": "tomato_bomb",
        "chargePercent": 100,
        "isReady": true
      },
      "isDead": false
    }
  ],
  "rightTeam": []
}
```

## Описание ответа

| Поле         | Назначение                          |
| ------------ | ----------------------------------- |
| battleId     | Идентификатор боя                   |
| status       | Текущий статус боя                  |
| tickNumber   | Номер последнего обработанного тика |
| leftTeam     | Левая команда                       |
| rightTeam    | Правая команда                      |
| unitId       | Идентификатор персонажа внутри боя  |
| playerCropId | Культура игрока                     |
| cropCode     | Код культуры                        |
| currentHp    | Текущее здоровье                    |
| maxHp        | Максимальное здоровье               |
| targetUnitId | Текущая цель                        |
| ability      | Состояние суперспособности          |
| isDead       | Персонаж погиб или нет              |

---

# GET /api/battle/{battleId}/result

Получить результат завершённого боя.

## Authorization

```http
Authorization: Bearer {token}
```

## Path Parameters

| Параметр | Обязательный | Назначение        |
| -------- | ------------ | ----------------- |
| battleId | Да           | Идентификатор боя |

## Request Body

Отсутствует.

## Источник PlayerId

PlayerId берётся из JWT Claim `sub`.

## Validation Rules

* Бой должен существовать.
* Игрок должен быть участником боя.
* Бой должен быть завершён.

## Success Response

```json
{
  "battleId": "uuid",
  "winnerPlayerId": "uuid",
  "loserPlayerId": "uuid",
  "isWinner": true,
  "winnerRemainingHp": 120,
  "loserRemainingHp": 0,
  "hpDelta": 120,
  "seedsReward": 100,
  "ratingDelta": 10,
  "chestRewardCode": "silver"
}
```

## Error Codes

```json
{
  "code": "BATTLE_NOT_FINISHED",
  "message": "Battle is not finished yet"
}
```

---

# SignalR

---

# Hub URL

```text
/battleHub
```

---

# Авторизация SignalR

SignalR подключение также должно передавать JWT.

Frontend подключается с access token.

Пример логики:

```text
accessTokenFactory: () => token
```

PlayerId на backend извлекается из JWT Claim `sub`.

---

# Client → Server Events

---

# JoinBattle

Подключиться к группе боя.

## Payload

```json
{
  "battleId": "uuid"
}
```

## Описание полей

| Поле     | Обязательное | Назначение        |
| -------- | ------------ | ----------------- |
| battleId | Да           | Идентификатор боя |

## Validation Rules

* Игрок авторизован.
* Бой существует.
* Игрок является участником боя.

## Server Action

Backend добавляет SignalR connection в группу:

```text
battle:{battleId}
```

## Possible Errors

```json
{
  "code": "BATTLE_NOT_FOUND",
  "message": "Battle not found"
}
```

```json
{
  "code": "ACCESS_DENIED",
  "message": "Player is not participant of this battle"
}
```

---

# SelectTarget

Назначить цель одному своему персонажу.

## Payload

```json
{
  "battleId": "uuid",
  "unitId": "uuid",
  "targetUnitId": "uuid"
}
```

## Описание полей

| Поле         | Обязательное | Назначение         |
| ------------ | ------------ | ------------------ |
| battleId     | Да           | Идентификатор боя  |
| unitId       | Да           | Свой персонаж      |
| targetUnitId | Да           | Вражеский персонаж |

## Validation Rules

* Бой должен быть в статусе `in_progress`.
* `unitId` должен принадлежать текущему игроку.
* `targetUnitId` должен принадлежать противнику.
* `unitId` не должен быть мёртв.
* `targetUnitId` не должен быть мёртв.

## Server Action

Backend обновляет `TargetUnitId` у выбранного персонажа в Redis.

## Success Server Event

```text
TargetChanged
```

## Possible Errors

```json
{
  "code": "UNIT_NOT_FOUND",
  "message": "Unit not found"
}
```

```json
{
  "code": "TARGET_DEAD",
  "message": "Target already dead"
}
```

```json
{
  "code": "INVALID_TARGET",
  "message": "Target must belong to enemy team"
}
```

---

# SelectGroupTarget

Назначить цель группе своих персонажей.

## Payload

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

## Описание полей

| Поле         | Обязательное | Назначение                        |
| ------------ | ------------ | --------------------------------- |
| battleId     | Да           | Идентификатор боя                 |
| unitIds      | Да           | Список выбранных своих персонажей |
| targetUnitId | Да           | Вражеская цель                    |

## Validation Rules

* Бой должен быть активен.
* `unitIds` не должен быть пустым.
* Все `unitIds` должны принадлежать текущему игроку.
* Все выбранные персонажи должны быть живы.
* `targetUnitId` должен принадлежать противнику.
* Цель должна быть жива.

## Server Action

Backend назначает `TargetUnitId` всем выбранным персонажам.

## Success Server Event

```text
GroupTargetChanged
```

## Possible Errors

```json
{
  "code": "EMPTY_UNIT_SELECTION",
  "message": "At least one unit must be selected"
}
```

```json
{
  "code": "UNIT_NOT_OWNER",
  "message": "Unit does not belong to current player"
}
```

---

# UseAbility

Использовать суперспособность персонажа.

## Payload

```json
{
  "battleId": "uuid",
  "unitId": "uuid",
  "targetUnitId": "uuid"
}
```

## Описание полей

| Поле         | Обязательное | Назначение                               |
| ------------ | ------------ | ---------------------------------------- |
| battleId     | Да           | Идентификатор боя                        |
| unitId       | Да           | Персонаж, который использует способность |
| targetUnitId | Нет          | Цель способности                         |

## Когда targetUnitId может отсутствовать

`targetUnitId` может быть `null`, если способность:

* применяется на себя;
* применяется на всех союзников;
* применяется на всех врагов;
* не требует конкретной цели.

## Validation Rules

* Бой должен быть активен.
* `unitId` должен принадлежать текущему игроку.
* Персонаж должен быть жив.
* Способность должна быть готова.
* Если способность требует цель, `targetUnitId` обязателен.
* Если цель указана, она должна соответствовать типу способности.

## Server Action

Backend применяет эффект способности через Battle Engine.

## Success Server Event

```text
AbilityUsed
```

## Possible Errors

```json
{
  "code": "ABILITY_NOT_READY",
  "message": "Ability is not ready"
}
```

```json
{
  "code": "ABILITY_TARGET_REQUIRED",
  "message": "Ability requires target"
}
```

```json
{
  "code": "INVALID_ABILITY_TARGET",
  "message": "Invalid ability target"
}
```

---

# LeaveBattle

Покинуть бой.

## Payload

```json
{
  "battleId": "uuid"
}
```

## Validation Rules

* Игрок должен быть участником боя.

## Server Action

Backend удаляет connection из группы боя.

В MVP выход из боя не обязательно означает поражение.

---

# Server → Client Events

---

# BattleStarted

Бой начался.

## Payload

```json
{
  "battleId": "uuid",
  "status": "in_progress",
  "startedAt": "2026-06-11T15:00:00Z",
  "leftTeam": [],
  "rightTeam": []
}
```

---

# CountdownChanged

Обновление обратного отсчёта.

## Payload

```json
{
  "battleId": "uuid",
  "secondsLeft": 3
}
```

---

# TargetChanged

Один персонаж сменил цель.

## Payload

```json
{
  "battleId": "uuid",
  "unitId": "uuid",
  "targetUnitId": "uuid"
}
```

---

# GroupTargetChanged

Группа персонажей сменила цель.

## Payload

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

# DamageApplied

Нанесён урон.

## Payload

```json
{
  "battleId": "uuid",
  "attackerUnitId": "uuid",
  "targetUnitId": "uuid",
  "damage": 15,
  "targetCurrentHp": 85
}
```

---

# AbilityReady

Суперспособность готова.

## Payload

```json
{
  "battleId": "uuid",
  "unitId": "uuid",
  "abilityCode": "tomato_bomb"
}
```

---

# AbilityUsed

Суперспособность использована.

## Payload

```json
{
  "battleId": "uuid",
  "unitId": "uuid",
  "abilityCode": "tomato_bomb",
  "targetUnitId": "uuid"
}
```

---

# AbilityCooldownChanged

Изменение перезарядки способности.

## Payload

```json
{
  "battleId": "uuid",
  "unitId": "uuid",
  "abilityCode": "tomato_bomb",
  "chargePercent": 45,
  "isReady": false
}
```

---

# CharacterDied

Персонаж погиб.

## Payload

```json
{
  "battleId": "uuid",
  "unitId": "uuid"
}
```

---

# BattleStateChanged

Периодическое обновление состояния.

Не обязательно отправлять каждый тик.

Можно отправлять 2-4 раза в секунду.

## Payload

```json
{
  "battleId": "uuid",
  "tickNumber": 128,
  "leftTeam": [],
  "rightTeam": []
}
```

---

# BattleFinished

Бой завершён.

## Payload

```json
{
  "battleId": "uuid",
  "winnerPlayerId": "uuid",
  "loserPlayerId": "uuid",
  "winnerRemainingHp": 120,
  "loserRemainingHp": 0,
  "hpDelta": 120,
  "seedsReward": 100,
  "ratingDelta": 10,
  "chestRewardCode": "silver"
}
```

---

# CommandRejected

Команда игрока отклонена.

## Payload

```json
{
  "battleId": "uuid",
  "command": "SelectTarget",
  "code": "TARGET_DEAD",
  "message": "Target already dead"
}
```

---

# Последовательность запуска боя

```text
1. Игрок нажимает кнопку "Бой".

2. Frontend вызывает:
   POST /api/battle/search

3. Backend проверяет команду игрока.

4. Backend ищет соперника.

5. Backend создает battleId.

6. Backend создает BattleState в Redis.

7. Frontend подключается к SignalR:
   /battleHub

8. Frontend вызывает:
   JoinBattle

9. Backend добавляет игрока в группу:
   battle:{battleId}

10. Когда оба игрока подключены:
    CountdownChanged

11. После countdown:
    BattleStarted

12. Бой переходит в статус:
    in_progress

13. Игроки отправляют команды:
    SelectTarget
    SelectGroupTarget
    UseAbility

14. Battle Engine обновляет состояние в Redis.

15. Backend отправляет события:
    DamageApplied
    AbilityReady
    CharacterDied

16. После смерти одной команды:
    BattleFinished

17. Результат сохраняется в PostgreSQL.
```

---

# Главный принцип

REST API отвечает за создание боя, получение состояния и результата.

SignalR отвечает за realtime-команды и события.

Redis хранит активное состояние боя.

PostgreSQL хранит историю и результат.
