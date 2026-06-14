# MVP Roadmap

## Milestone 1: Playable Local Prototype

- Start Telegram Mini App shell.
- Login through Telegram `initData` with dev fallback.
- Show starter garden with potato, cucumber, tomato.
- Show 3-slot team.
- Start demo battle against bot.
- Support target selection and ability button.
- Stream battle state through SignalR.

## Milestone 2: Persistent Garden

- Add PostgreSQL infrastructure.
- Implement Identity, Garden, and Team repositories.
- Seed crop types.
- Implement planting, harvesting, plot unlocks, and greenhouse speed modifier.
- Add JWT validation.

## Milestone 3: Real Battle Rooms

- Replace in-memory battle manager with Redis state adapter.
- Add per-room command queue based on `System.Threading.Channels`.
- Add reconnect support through `GET /api/battle/{battleId}/state`.
- Persist battle result and outbox event.

## Milestone 4: Rewards and Economy

- Grant seeds for normal PvP victory.
- Add chest generation.
- Add boosters and artifacts as reward content.
- Add market lots for plots and greenhouses.

## Milestone 5: Tournament PvP

- Add weekly tournament lifecycle.
- Add rating calculation.
- Add leaderboard endpoint.
- Add tournament reward distribution job.

## Milestone 6: Telegram Production Readiness

- Validate Telegram Mini App `initData` signature.
- Add Telegram Stars invoice creation and payment callbacks.
- Add rate limits and request logging in gateway.
- Add production CORS, HTTPS, monitoring, and deployment pipeline.
