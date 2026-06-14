# Garden Battle Architecture

## Architecture Style

Garden Battle starts as a Microservice Ready Modular Monolith.

The MVP is deployed as one backend runtime, but module boundaries are explicit:

```text
Telegram Mini App
  -> Gateway
    -> GardenBattle.Api
      -> Identity
      -> Garden
      -> Battle
      -> Reward
      -> Tournament
      -> Market
      -> Payment
      -> PostgreSQL
      -> Redis
```

## Backend Projects

```text
GardenBattle.Api
```

Public REST API and SignalR hub host.

```text
GardenBattle.Gateway
```

YARP-compatible edge placeholder for routing, JWT validation, rate limiting, request logging, and future module/service split.

```text
GardenBattle.Shared.Contracts
```

DTOs, SignalR payloads, and domain-event contracts shared across modules.

```text
GardenBattle.BattleEngine
```

Pure battle rules: ticks, target selection, damage, abilities, win condition.

```text
GardenBattle.Modules.*
```

Business module boundaries. MVP uses in-memory implementations, but interfaces are shaped for PostgreSQL, Redis, and event-driven adapters.

## Module Ownership

| Module | Owns |
| --- | --- |
| Identity | Telegram login, JWT, player profile, currencies |
| Garden | plots, crops, growth, greenhouses, battle team |
| Battle | matchmaking, battle rooms, command queue, runtime state |
| Reward | victory rewards, chests, boosters, artifacts |
| Tournament | weekly tournament, rating, leaderboard |
| Market | lots, soft currency purchases |
| Payment | Telegram Stars invoices and payment callbacks |

## CQRS

Commands mutate state:

- `LoginCommand`
- `PlantCropCommand`
- `HarvestCropCommand`
- `SaveTeamCommand`
- `StartBattleCommand`
- `SelectTargetCommand`
- `SelectGroupTargetCommand`
- `UseAbilityCommand`

Queries read state:

- `GetProfileQuery`
- `GetGardenQuery`
- `GetTeamQuery`
- `GetBattleStateQuery`
- `GetBattleResultQuery`
- `GetTournamentRatingQuery`

## BattleRoom Actor Pattern

Each active battle is a separate room actor:

```text
BattleHub
  -> BattleRoomManager
    -> BattleRoom
      -> Command Queue
      -> BattleEngine Tick
      -> Redis battle:{battleId}:state
      -> SignalR events
```

MVP code includes an in-memory manager and a 250 ms hosted ticker. The production adapter should move active state to Redis:

```text
battle:{battleId}:state
player:{playerId}:battle
matchmaking:normal
matchmaking:tournament
```

## Persistence Rule

PostgreSQL stores permanent facts:

- players
- crop ownership
- garden plots
- battle results
- rewards
- rating
- market/payment transactions
- outbox messages

PostgreSQL does not store active HP, cooldown, selected targets, or per-tick runtime state.

## Event-Driven Boundary

Modules do not update each other's tables directly.

Example:

```text
BattleFinishedEvent
  -> Reward module grants seeds/chest
  -> Tournament module updates rating
  -> Outbox stores delivery
```
