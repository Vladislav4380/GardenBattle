# API Specification v1 — правила идентификации игрока

## Общий принцип

Все методы, которые работают с текущим игроком, не принимают `playerId` в параметрах.

Игрок определяется по JWT токену.

---

# Authorization Header

```http
Authorization: Bearer {token}
```

---

# JWT Claims

JWT должен содержать минимум:

```json
{
  "sub": "player_id",
  "telegram_id": "123456789"
}
```

| Claim       | Назначение               |
| ----------- | ------------------------ |
| sub         | Внутренний `playerId`    |
| telegram_id | Telegram ID пользователя |

---

# Как backend получает playerId

```csharp
var playerId = User.FindFirst("sub")?.Value;
```

или через extension:

```csharp
var playerId = User.GetPlayerId();
```

---

# GET /api/player/profile

Получение профиля текущего игрока.

## Authorization

```http
Authorization: Bearer {token}
```

## Path Parameters

Отсутствуют.

## Query Parameters

Отсутствуют.

## Request Body

Отсутствует.

## Источник playerId

`playerId` берётся из JWT claim `sub`.

## Response

```json
{
  "playerId": "uuid",
  "telegramId": 123456789,
  "username": "player",
  "firstName": "Vlad",
  "avatar": {
    "code": "gardener_01",
    "name": "Молодой садовник"
  },
  "currencies": {
    "seeds": 1000,
    "stars": 0,
    "tournamentTokens": 10
  }
}
```

---

# GET /api/player/dashboard

Получение данных главного экрана текущего игрока.

## Authorization

```http
Authorization: Bearer {token}
```

## Path Parameters

Отсутствуют.

## Query Parameters

Отсутствуют.

## Request Body

Отсутствует.

## Источник playerId

`playerId` берётся из JWT claim `sub`.

---

# GET /api/garden

Получение огорода текущего игрока.

## Authorization

```http
Authorization: Bearer {token}
```

## Path Parameters

Отсутствуют.

## Query Parameters

Отсутствуют.

## Request Body

Отсутствует.

## Источник playerId

`playerId` берётся из JWT claim `sub`.

---

# POST /api/garden/plant

Посадить культуру на грядку текущего игрока.

## Authorization

```http
Authorization: Bearer {token}
```

## Path Parameters

Отсутствуют.

## Query Parameters

Отсутствуют.

## Request Body

```json
{
  "plotId": "uuid",
  "cropTypeId": "uuid"
}
```

## Источник playerId

`playerId` берётся из JWT claim `sub`.

## Валидация

* `plotId` обязателен.
* `cropTypeId` обязателен.
* Грядка должна принадлежать текущему игроку.
* Грядка должна быть открыта.
* На грядке не должно быть другой культуры.
* Культура должна быть доступна игроку.

---

# POST /api/garden/harvest

Собрать урожай с грядки текущего игрока.

## Authorization

```http
Authorization: Bearer {token}
```

## Request Body

```json
{
  "plotId": "uuid"
}
```

## Источник playerId

`playerId` берётся из JWT claim `sub`.

## Валидация

* `plotId` обязателен.
* Грядка должна принадлежать текущему игроку.
* На грядке должна быть культура.
* Культура должна быть готова к сбору.

---

# GET /api/team

Получение боевой команды текущего игрока.

## Authorization

```http
Authorization: Bearer {token}
```

## Path Parameters

Отсутствуют.

## Query Parameters

Отсутствуют.

## Request Body

Отсутствует.

## Источник playerId

`playerId` берётся из JWT claim `sub`.

---

# POST /api/team

Сохранить боевую команду текущего игрока.

## Authorization

```http
Authorization: Bearer {token}
```

## Request Body

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

## Источник playerId

`playerId` берётся из JWT claim `sub`.

## Валидация

* Должно быть ровно 3 слота.
* `slot` должен быть от 1 до 3.
* `playerCropId` должен принадлежать текущему игроку.
* Культура должна иметь статус `active`.
* Одна культура не может быть выбрана в несколько слотов.

---

# Когда playerId можно передавать явно

`playerId` передаётся явно только в админских или публичных методах.

Например:

```http
GET /api/admin/players/{playerId}
```

или

```http
GET /api/public/player/{playerId}
```

Но для методов текущего игрока `playerId` не передаётся.
