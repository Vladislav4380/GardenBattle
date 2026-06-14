using GardenBattle.Shared.Contracts;

namespace GardenBattle.Modules.Identity;

public interface IIdentityService
{
    LoginResponse Login(LoginRequest request);
    PlayerProfileResponse GetProfile(Guid playerId);
    PlayerDashboardResponse GetDashboard(Guid playerId);
}

public sealed class InMemoryIdentityService : IIdentityService
{
    public static readonly Guid DemoPlayerId = Guid.Parse("11111111-1111-1111-1111-111111111111");

    private readonly PlayerProfileResponse _profile = new(
        DemoPlayerId,
        123456789,
        "Garden Commander",
        "gardener_01",
        new CurrencyBalance(Seeds: 1000, Stars: 0, TournamentTokens: 10));

    public LoginResponse Login(LoginRequest request)
    {
        var token = $"dev-jwt-for-{DemoPlayerId:N}";
        return new LoginResponse(DemoPlayerId, token, IsNewPlayer: false);
    }

    public PlayerProfileResponse GetProfile(Guid playerId) => _profile with { PlayerId = playerId };

    public PlayerDashboardResponse GetDashboard(Guid playerId) =>
        new(
            GetProfile(playerId),
            new { code = "weekly_garden_brawl", endsAt = DateTimeOffset.UtcNow.AddDays(5) },
            new { wins = 0, losses = 0 });
}
