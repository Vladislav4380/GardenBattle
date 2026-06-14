# BattleState MVP

## Runtime-состояние боя в Redis

---

# 1. Общая идея

PostgreSQL хранит постоянные данные:

* игроков;
* огород;
* культуры;
* историю боёв;
* результаты.

Redis хранит только активный бой.

После завершения боя данные из Redis сохраняются в PostgreSQL.

---

# 2. Redis key

```text
battle:{battleId}:state
```

Пример:

```text
battle:7f3a...:state
```

---

# 3. BattleState

```csharp
public class BattleState
{
    public Guid BattleId { get; set; }

    public BattleStatus Status { get; set; }

    public Guid LeftPlayerId { get; set; }

    public Guid RightPlayerId { get; set; }

    public List<BattleUnitState> LeftTeam { get; set; } = new();

    public List<BattleUnitState> RightTeam { get; set; } = new();

    public DateTime StartedAt { get; set; }

    public DateTime? FinishedAt { get; set; }

    public long TickNumber { get; set; }

    public DateTime LastTickAt { get; set; }
}
```

---

# 4. BattleStatus

```csharp
public enum BattleStatus
{
    Created = 0,
    WaitingPlayers = 1,
    Countdown = 2,
    InProgress = 3,
    Finished = 4,
    Cancelled = 5
}
```

---

# 5. BattleUnitState

```csharp
public class BattleUnitState
{
    public Guid UnitId { get; set; }

    public Guid PlayerId { get; set; }

    public Guid PlayerCropId { get; set; }

    public Guid CropTypeId { get; set; }

    public string CropCode { get; set; } = string.Empty;

    public int Slot { get; set; }

    public BattleSide Side { get; set; }

    public int MaxHp { get; set; }

    public int CurrentHp { get; set; }

    public int Attack { get; set; }

    public int Defense { get; set; }

    public int AttackSpeedMs { get; set; }

    public DateTime NextAttackAt { get; set; }

    public Guid? TargetUnitId { get; set; }

    public AbilityState Ability { get; set; } = new();

    public bool IsDead { get; set; }

    public int TotalDamageDone { get; set; }

    public int TotalDamageTaken { get; set; }

    public int AbilityUsedCount { get; set; }
}
```

---

# 6. BattleSide

```csharp
public enum BattleSide
{
    Left = 1,
    Right = 2
}
```

---

# 7. AbilityState

```csharp
public class AbilityState
{
    public string AbilityCode { get; set; } = string.Empty;

    public int ChargePercent { get; set; }

    public bool IsReady { get; set; }

    public DateTime? LastUsedAt { get; set; }

    public int CooldownMs { get; set; }

    public DateTime? ReadyAt { get; set; }
}
```

---

# 8. Пример JSON в Redis

```json
{
  "battleId": "7f3a2c8a-2f87-4c4e-a62e-08f7b1c11111",
  "status": "InProgress",
  "leftPlayerId": "11111111-1111-1111-1111-111111111111",
  "rightPlayerId": "22222222-2222-2222-2222-222222222222",
  "tickNumber": 42,
  "startedAt": "2026-06-11T15:00:00Z",
  "lastTickAt": "2026-06-11T15:00:10Z",
  "leftTeam": [
    {
      "unitId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "playerId": "11111111-1111-1111-1111-111111111111",
      "cropCode": "tomato",
      "slot": 1,
      "side": "Left",
      "maxHp": 100,
      "currentHp": 80,
      "attack": 20,
      "defense": 5,
      "attackSpeedMs": 2000,
      "targetUnitId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "isDead": false,
      "ability": {
        "abilityCode": "tomato_bomb",
        "chargePercent": 100,
        "isReady": true,
        "cooldownMs": 15000
      }
    }
  ],
  "rightTeam": []
}
```

---

# 9. Команда выбора одной цели

Когда игрок выбирает своего персонажа и нажимает на врага, frontend отправляет:

```csharp
public class SelectTargetCommand
{
    public Guid BattleId { get; set; }

    public Guid PlayerId { get; set; }

    public Guid UnitId { get; set; }

    public Guid TargetUnitId { get; set; }
}
```

## Что делает backend

1. Загружает BattleState из Redis.
2. Проверяет, что бой активен.
3. Проверяет, что UnitId принадлежит игроку.
4. Проверяет, что TargetUnitId принадлежит противнику.
5. Проверяет, что оба персонажа живы.
6. Меняет TargetUnitId у выбранного персонажа.
7. Сохраняет BattleState обратно в Redis.
8. Отправляет SignalR событие TargetChanged.

---

# 10. Команда выбора группы

Когда игрок выделяет областью несколько своих персонажей и нажимает на врага:

```csharp
public class SelectGroupTargetCommand
{
    public Guid BattleId { get; set; }

    public Guid PlayerId { get; set; }

    public List<Guid> UnitIds { get; set; } = new();

    public Guid TargetUnitId { get; set; }
}
```

## Что делает backend

Для каждого UnitId:

* проверяет владельца;
* проверяет, что персонаж жив;
* назначает TargetUnitId.

---

# 11. Команда применения способности

```csharp
public class UseAbilityCommand
{
    public Guid BattleId { get; set; }

    public Guid PlayerId { get; set; }

    public Guid UnitId { get; set; }

    public Guid? TargetUnitId { get; set; }
}
```

## TargetUnitId может быть null

Например:

* щит на себя;
* лечение всех союзников;
* массовая атака по всем врагам.

---

# 12. Battle Engine tick

Каждые 250 мс backend вызывает:

```csharp
public interface IBattleEngine
{
    Task ProcessTickAsync(Guid battleId, CancellationToken cancellationToken);
}
```

---

# 13. Что делает ProcessTickAsync

```text
1. Загрузить BattleState из Redis.

2. Проверить статус боя.

3. Найти всех живых персонажей.

4. Для каждого персонажа:
   - проверить, пришло ли время обычной атаки;
   - если цели нет или цель мертва — выбрать новую;
   - рассчитать урон;
   - применить урон;
   - обновить NextAttackAt;
   - зарядить суперспособность.

5. Проверить смерть персонажей.

6. Проверить окончание боя.

7. Сохранить BattleState в Redis.

8. Отправить изменения клиентам через SignalR.
```

---

# 14. Формула урона MVP

```csharp
damage = attacker.Attack - target.Defense;
```

Минимальный урон:

```csharp
damage = Math.Max(1, damage);
```

---

# 15. Выбор цели по умолчанию

Если цель не назначена игроком:

```text
Выбрать первого живого врага
```

Позже можно заменить на умнее:

```text
ближайший враг
самый слабый враг
враг с минимальным HP
враг-лекарь
```

---

# 16. Завершение боя

Бой завершается, если:

```text
у одной команды нет живых персонажей
```

Backend:

1. Определяет победителя.
2. Считает оставшееся HP.
3. Считает hp_delta.
4. Начисляет награду.
5. Сохраняет результат в PostgreSQL.
6. Удаляет BattleState из Redis.
7. Отправляет SignalR событие BattleFinished.

---

# 17. Что сохраняется в PostgreSQL после боя

В таблицу battles:

* status = finished;
* winner_player_id;
* finished_at.

В таблицу battle_units:

* start_hp;
* end_hp;
* total_damage_done;
* total_damage_taken;
* ability_used_count.

В таблицу battle_results:

* winner_player_id;
* loser_player_id;
* winner_remaining_hp;
* loser_remaining_hp;
* hp_delta;
* seeds_reward;
* chest_reward_code;
* rating_delta.

---

# 18. Главный принцип

Redis — это состояние активного боя.

PostgreSQL — это история и результат.

SignalR — это доставка событий на frontend.

Battle Engine — единственный источник истины по бою.
