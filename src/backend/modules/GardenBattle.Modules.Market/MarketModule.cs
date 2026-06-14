using GardenBattle.Shared.Contracts;

namespace GardenBattle.Modules.Market;

public interface IMarketService
{
    IReadOnlyList<MarketLotDto> GetLots();
}

public sealed class InMemoryMarketService : IMarketService
{
    public IReadOnlyList<MarketLotDto> GetLots() =>
    [
        new(Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1"), "plot_unlock", "Unlock garden plot", 500, 10),
        new(Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2"), "greenhouse", "Build greenhouse", 750, 15)
    ];
}
