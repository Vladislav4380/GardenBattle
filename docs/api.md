# REST API MVP

Base path: `/api`

## Identity

### POST `/api/auth/login`

Request:

```json
{ "initData": "telegram_init_data" }
```

Response:

```json
{ "playerId": "uuid", "token": "jwt", "isNewPlayer": false }
```

### GET `/api/player/profile`

Returns player profile, guardian avatar, and currencies.

### GET `/api/player/dashboard`

Returns profile, currencies, active tournament summary, and battle statistics.

## Crops and Garden

### GET `/api/crops`

Returns available crop types with stats and ability metadata.

### GET `/api/garden`

Returns garden plots, greenhouse flags, and planted crops.

### POST `/api/garden/plant`

```json
{ "plotId": "uuid", "cropTypeId": "uuid" }
```

### POST `/api/garden/harvest`

```json
{ "plotId": "uuid" }
```

### POST `/api/garden/plots/unlock`

```json
{ "plotIndex": 4, "paymentMethod": "seeds" }
```

### POST `/api/garden/greenhouse`

```json
{ "plotId": "uuid" }
```

## Team

### GET `/api/team`

Returns the active 3-slot battle team.

### POST `/api/team`

```json
{
  "slots": [
    { "slot": 1, "playerCropId": "uuid" },
    { "slot": 2, "playerCropId": "uuid" },
    { "slot": 3, "playerCropId": "uuid" }
  ]
}
```

## Battle

### POST `/api/battle/search`

```json
{ "battleType": "Normal" }
```

Response:

```json
{ "battleId": "uuid", "status": "InProgress" }
```

### GET `/api/battle/{battleId}`

Returns battle status and battle type.

### GET `/api/battle/{battleId}/state`

Returns current state snapshot for reconnect and debug.

### GET `/api/battle/{battleId}/result`

Returns winner, seeds, rating delta, and chest reward.

## Reward

### GET `/api/rewards/chests`

Returns player chests.

## Tournament

### GET `/api/tournament/rating`

Returns weekly rating, wins, and rank.

## Market

### GET `/api/market/lots`

Returns purchasable lots.

## Payment

### POST `/api/payment/stars/invoice`

```json
{ "productCode": "greenhouse", "stars": 15 }
```
