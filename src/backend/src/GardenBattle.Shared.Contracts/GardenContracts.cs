namespace GardenBattle.Shared.Contracts;

public sealed record CropTypeDto(
    Guid CropTypeId,
    string Code,
    string Name,
    int Hp,
    int Attack,
    int Defense,
    string AbilityCode,
    string AbilityName,
    int GrowthSeconds);

public sealed record PlayerCropDto(
    Guid PlayerCropId,
    string CropCode,
    string Status);

public sealed record GardenPlotDto(
    Guid PlotId,
    int PlotIndex,
    bool IsUnlocked,
    bool IsGreenhouse,
    PlayerCropDto? Crop);

public sealed record GardenResponse(Guid GardenId, IReadOnlyList<GardenPlotDto> Plots);

public sealed record PlantCropRequest(Guid PlotId, Guid CropTypeId);

public sealed record HarvestCropRequest(Guid PlotId);

public sealed record UnlockPlotRequest(int PlotIndex, string PaymentMethod);

public sealed record BuildGreenhouseRequest(Guid PlotId);

public sealed record CommandResult(bool Success, string? Error = null);
