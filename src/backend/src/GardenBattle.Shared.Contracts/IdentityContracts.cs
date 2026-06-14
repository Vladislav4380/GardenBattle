namespace GardenBattle.Shared.Contracts;

public sealed record LoginRequest(string InitData);

public sealed record LoginResponse(Guid PlayerId, string Token, bool IsNewPlayer);

public sealed record CurrencyBalance(int Seeds, int Stars, int TournamentTokens);

public sealed record PlayerProfileResponse(
    Guid PlayerId,
    long TelegramId,
    string FirstName,
    string AvatarCode,
    CurrencyBalance Currencies);

public sealed record PlayerDashboardResponse(
    PlayerProfileResponse Profile,
    object ActiveTournament,
    object BattleStatistics);
