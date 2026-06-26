namespace GardenBattle.Shared.Contracts;

public sealed record DashboardDto(
    DashboardHeaderData Header,
    DashboardGardenCardData GardenCard,
    DashboardTeamCardData TeamCard,
    DashboardTournamentCardData TournamentCard,
    DashboardRewardsCardData RewardsCard);

public sealed record DashboardHeaderData(
    string PlayerName,
    int Coins,
    int Gems,
    int XpCurrent,
    int XpTarget);

public sealed record DashboardGardenCardData(
    string Title,
    string IconSrc,
    string SummaryText,
    IReadOnlyList<DashboardGardenPlotData> Plots);

public sealed record DashboardGardenPlotData(
    string Id,
    int Slot,
    string State,
    string? ImageUrl,
    string? ImageBase64,
    string? ImageMimeType,
    string? StatusText,
    int? UnlockLevel);

public sealed record DashboardTeamCardData(
    string Title,
    string IconSrc,
    string SummaryText,
    IReadOnlyList<DashboardTeamMemberData> Members);

public sealed record DashboardTeamMemberData(
    string Id,
    int Slot,
    string State,
    string? ImageUrl,
    string? ImageBase64,
    string? ImageMimeType,
    string? StatusText,
    int? UnlockLevel);

public sealed record DashboardTournamentCardData(
    string LeagueName,
    int PlayerPlace,
    int ParticipantsCount);

public sealed record DashboardRewardsCardData(
    int Coins,
    int Gems,
    int Cards,
    int ChestProgressCurrent,
    int ChestProgressTarget);
