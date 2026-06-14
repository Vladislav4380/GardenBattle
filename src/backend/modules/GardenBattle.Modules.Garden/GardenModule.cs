using GardenBattle.Shared.Contracts;

namespace GardenBattle.Modules.Garden;

public interface IGardenService
{
    IReadOnlyList<CropTypeDto> GetCropTypes();
    GardenResponse GetGarden(Guid playerId);
    CommandResult Plant(Guid playerId, PlantCropRequest request);
    CommandResult Harvest(Guid playerId, HarvestCropRequest request);
    CommandResult UnlockPlot(Guid playerId, UnlockPlotRequest request);
    CommandResult BuildGreenhouse(Guid playerId, BuildGreenhouseRequest request);
    TeamResponse GetTeam(Guid playerId);
    CommandResult SaveTeam(Guid playerId, SaveTeamRequest request);
}

public sealed class InMemoryGardenService : IGardenService
{
    private static readonly Guid GardenId = Guid.Parse("22222222-2222-2222-2222-222222222222");
    private static readonly Guid PotatoTypeId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1");
    private static readonly Guid CucumberTypeId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2");
    private static readonly Guid TomatoTypeId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3");

    private readonly List<CropTypeDto> _cropTypes =
    [
        new(PotatoTypeId, "potato", "Potato", 140, 14, 8, "earth_shield", "Earth Shield", 60),
        new(CucumberTypeId, "cucumber", "Cucumber", 95, 18, 4, "slippery_maneuver", "Slippery Maneuver", 45),
        new(TomatoTypeId, "tomato", "Tomato", 105, 22, 5, "tomato_bomb", "Tomato Bomb", 75)
    ];

    private readonly List<GardenPlotDto> _plots =
    [
        new(Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1"), 1, true, false, new(Guid.Parse("cccccccc-cccc-cccc-cccc-ccccccccccc1"), "potato", "active")),
        new(Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2"), 2, true, false, new(Guid.Parse("cccccccc-cccc-cccc-cccc-ccccccccccc2"), "cucumber", "active")),
        new(Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3"), 3, true, true, new(Guid.Parse("cccccccc-cccc-cccc-cccc-ccccccccccc3"), "tomato", "active")),
        new(Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4"), 4, false, false, null),
        new(Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5"), 5, false, false, null),
        new(Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6"), 6, false, false, null)
    ];

    private readonly List<TeamSlotDto> _team =
    [
        new(1, Guid.Parse("cccccccc-cccc-cccc-cccc-ccccccccccc1"), "potato"),
        new(2, Guid.Parse("cccccccc-cccc-cccc-cccc-ccccccccccc2"), "cucumber"),
        new(3, Guid.Parse("cccccccc-cccc-cccc-cccc-ccccccccccc3"), "tomato")
    ];

    public IReadOnlyList<CropTypeDto> GetCropTypes() => _cropTypes;

    public GardenResponse GetGarden(Guid playerId) => new(GardenId, _plots);

    public CommandResult Plant(Guid playerId, PlantCropRequest request) => new(true);

    public CommandResult Harvest(Guid playerId, HarvestCropRequest request) => new(true);

    public CommandResult UnlockPlot(Guid playerId, UnlockPlotRequest request) => new(true);

    public CommandResult BuildGreenhouse(Guid playerId, BuildGreenhouseRequest request) => new(true);

    public TeamResponse GetTeam(Guid playerId) => new(_team);

    public CommandResult SaveTeam(Guid playerId, SaveTeamRequest request) =>
        request.Slots.Count == 3 ? new(true) : new(false, "A battle team must contain exactly 3 slots.");
}
