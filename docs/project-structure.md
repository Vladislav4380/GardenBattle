# Project Structure

## Angular Application

```text
src/frontend/
  public/assets/crops/
  src/
    app/
      core/
        api.service.ts
        auth.interceptor.ts
        battle-realtime.service.ts
        telegram-mini-app.service.ts
      models/
        contracts.ts
      pages/
        garden/
        team/
        battle/
        tournament/
        market/
        profile/
      app.component.ts
      app.routes.ts
    theme/
      variables.scss
    main.ts
```

The frontend uses standalone Angular components and Ionic standalone imports. Battle realtime traffic goes through `BattleRealtimeService`, while persistent game data goes through `ApiService`.

## .NET Solution

```text
src/backend/
  GardenBattle.slnx
  NuGet.Config
  src/
    GardenBattle.Api/
      Program.cs
    GardenBattle.Gateway/
      Program.cs
    GardenBattle.Shared.Contracts/
    GardenBattle.BattleEngine/
  modules/
    GardenBattle.Modules.Identity/
    GardenBattle.Modules.Garden/
    GardenBattle.Modules.Battle/
    GardenBattle.Modules.Reward/
    GardenBattle.Modules.Tournament/
    GardenBattle.Modules.Market/
    GardenBattle.Modules.Payment/
```

`GardenBattle.Api` hosts REST and SignalR for the MVP. Each module exposes service interfaces and demo implementations that can be replaced by PostgreSQL, Redis, and external payment adapters.
