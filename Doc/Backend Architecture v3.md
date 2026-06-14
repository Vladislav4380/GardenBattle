# Backend Architecture v3

## Microservice Ready Modular Monolith

---

# Архитектурное решение

На этапе MVP используется модульный монолит.

Архитектура проектируется таким образом, чтобы в будущем любой модуль можно было вынести в отдельный микросервис без существенной переработки frontend части и основной бизнес-логики.

---

# Основные принципы

Используем следующие паттерны:

```text
Clean Architecture

CQRS

Actor Pattern

State Machine

Event Driven

Outbox Pattern
```

---

# Технологический стек

```text
Angular

Ionic

.NET 10

SignalR

PostgreSQL

Redis

YARP

JWT

Entity Framework Core
```

---

# Общая схема

```text
Angular / Ionic Telegram Mini App

            ↓

      YARP Gateway

            ↓

    VegetableWars.Monolith

            ↓

 ┌──────────────────────┐
 │ Identity Module      │
 │ Garden Module        │
 │ Battle Module        │
 │ Reward Module        │
 │ Tournament Module    │
 │ Market Module        │
 │ Payment Module       │
 └──────────────────────┘

            ↓

Redis + PostgreSQL
```

---

# Почему YARP используется сразу

Frontend никогда не обращается напрямую к backend модулям.

Frontend знает только один адрес:

```text
https://api.game.com
```

---

# Пример маршрутов

```text
/api/auth/*
/api/player/*
/api/garden/*
/api/team/*
/api/battle/*
/api/tournament/*
/api/market/*
```

---

# SignalR

```text
/battleHub
```

---

# Что дает YARP

Позволяет вынести любой модуль в отдельный сервис без изменения frontend.

---

# MVP

```text
Angular

      ↓

YARP

      ↓

Monolith
```

---

# Будущее

```text
Angular

      ↓

YARP

      ↓

Identity Service

Garden Service

Battle Service

Reward Service

Tournament Service

Market Service

Payment Service
```

---

# Структура Solution

```text
VegetableWars.sln

src/

    VegetableWars.Gateway

    VegetableWars.Monolith

    VegetableWars.Shared.Contracts
```

---

# VegetableWars.Gateway

Отвечает за:

```text
YARP

Routing

JWT Validation

SignalR Proxy

Rate Limiting

Request Logging
```

---

# VegetableWars.Monolith

Содержит все игровые модули.

---

# Внутренняя структура Monolith

```text
Modules/

    Identity

    Garden

    Battle

    Reward

    Tournament

    Market

    Payment
```

---

# Главное правило модулей

Модуль не имеет права обращаться к таблицам другого модуля напрямую.

---

# Пример

Плохо:

```text
Battle Module

    ↓

UPDATE player_currencies
```

---

Правильно:

```text
BattleFinishedEvent

      ↓

Reward Module

      ↓

Начисление награды
```

---

# Схемы PostgreSQL

Каждый модуль владеет своей схемой.

---

# Identity

```text
identity.players

identity.player_currencies
```

---

# Garden

```text
garden.gardens

garden.garden_plots

garden.player_crops
```

---

# Battle

```text
battle.battles

battle.battle_units

battle.battle_results
```

---

# Tournament

```text
tournament.tournaments

tournament.player_ratings
```

---

# Reward

```text
reward.player_rewards

reward.player_chests
```

---

# Market

```text
market.lots

market.transactions
```

---

# CQRS

---

# Commands

Изменяют состояние системы.

```text
LoginCommand

PlantCropCommand

HarvestCropCommand

SaveTeamCommand

StartBattleCommand

SelectTargetCommand

SelectGroupTargetCommand

UseAbilityCommand
```

---

# Queries

Только чтение.

```text
GetProfileQuery

GetGardenQuery

GetTeamQuery

GetBattleStateQuery

GetBattleResultQuery

GetTournamentRatingQuery
```

---

# Actor Pattern

Каждый бой является отдельным Actor.

---

# BattleRoom

Один BattleRoom обслуживает только один бой.

```text
BattleRoom
```

---

# BattleRoom содержит

```text
BattleState

Command Queue

TickLoop
```

---

# BattleRoomManager

Управляет всеми активными комнатами.

---

# Runtime схема

```text
BattleHub

      ↓

BattleRoomManager

      ↓

BattleRoom

      ↓

Command Queue

      ↓

Battle Engine
```

---

# Command Queue

Используется:

```text
System.Threading.Channels
```

---

Все команды сначала попадают в очередь.

---

# Пример

```text
SelectTarget

      ↓

Queue

      ↓

Process Tick

      ↓

State Updated
```

---

# State Machine

Состояния боя:

```text
Created

WaitingPlayers

Countdown

InProgress

Finished

Cancelled
```

---

# Redis

Используется только для Runtime данных.

---

# Battle State

```text
battle:{battleId}:state
```

---

# Active Battle

```text
player:{playerId}:battle
```

---

# Matchmaking Queue

```text
matchmaking:normal

matchmaking:tournament
```

---

# PostgreSQL

Используется только для постоянных данных.

---

Не хранит:

```text
HP

Cooldown

Target

Runtime State
```

---

# Event Driven Architecture

Модули взаимодействуют через события.

---

# Примеры событий

```text
BattleFinishedEvent

RewardGrantedEvent

ChestGrantedEvent

TournamentPointsAddedEvent
```

---

# Outbox Pattern

Все важные события сначала сохраняются в БД.

---

# Таблица

```text
outbox_messages
```

---

# Зачем

Если приложение упало после завершения боя:

```text
BattleResult сохранен

BattleFinishedEvent не потерян
```

---

# План миграции в микросервисы

Шаг 1

```text
Модульный монолит
```

Шаг 2

```text
Выделение Battle Module
```

Шаг 3

```text
Battle Service
```

Шаг 4

```text
RabbitMQ
```

Шаг 5

```text
Остальные сервисы
```

---

# Главный принцип

Архитектура MVP должна выглядеть как микросервисная.

Но физически оставаться модульным монолитом.

Это обеспечивает:

```text
Быструю разработку

Простую отладку

Высокую производительность

Подготовку к будущему масштабированию
```
