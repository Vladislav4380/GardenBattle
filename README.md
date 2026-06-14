# Garden Battle MVP

Telegram Mini App game where players grow crops, build a 3 vs 3 team, and fight realtime PvP battles.

## Stack

- Frontend: Angular, Ionic, Telegram Mini App SDK, SignalR client
- Backend: .NET 10, SignalR, modular monolith, CQRS-ready module boundaries
- Data: PostgreSQL for persistent data, Redis for active battle runtime state

## Repository Layout

```text
src/
  backend/
    GardenBattle.slnx
    src/
      GardenBattle.Api
      GardenBattle.Gateway
      GardenBattle.Shared.Contracts
      GardenBattle.BattleEngine
    modules/
      GardenBattle.Modules.Identity
      GardenBattle.Modules.Garden
      GardenBattle.Modules.Battle
      GardenBattle.Modules.Reward
      GardenBattle.Modules.Tournament
      GardenBattle.Modules.Market
      GardenBattle.Modules.Payment
  frontend/
    Angular + Ionic Telegram Mini App shell
database/
  001_initial_schema.sql
docs/
  architecture.md
  api.md
  signalr-contracts.md
  roadmap.md
```

## Run Backend

```powershell
dotnet restore src\backend\GardenBattle.slnx --configfile src\backend\NuGet.Config
dotnet run --project src\backend\src\GardenBattle.Api\GardenBattle.Api.csproj
```

## Run Frontend

```powershell
cd src\frontend
npm install
npm run start
```

The frontend expects `/api/*` and `/battleHub` under the same origin or behind the gateway.
