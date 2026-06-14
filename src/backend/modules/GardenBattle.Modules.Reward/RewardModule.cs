using GardenBattle.Shared.Contracts;

namespace GardenBattle.Modules.Reward;

public interface IRewardService
{
    IReadOnlyList<ChestDto> GetChests(Guid playerId);
}

public sealed class InMemoryRewardService : IRewardService
{
    public IReadOnlyList<ChestDto> GetChests(Guid playerId) =>
    [
        new(Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"), "starter", "ready")
    ];
}
