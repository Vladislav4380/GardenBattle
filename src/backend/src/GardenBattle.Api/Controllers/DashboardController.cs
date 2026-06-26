using GardenBattle.Modules.Garden;
using GardenBattle.Modules.Identity;
using GardenBattle.Modules.Reward;
using GardenBattle.Modules.Tournament;
using GardenBattle.Shared.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace GardenBattle.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public sealed class DashboardController(
    IIdentityService identity,
    IGardenService garden,
    ITournamentService tournament,
    IRewardService rewards) : ControllerBase
{
    private static readonly IReadOnlyDictionary<string, string> PlotImages = new Dictionary<string, string>
    {
        ["potato"] = "assets/dashboard/plot-carrot.webp",
        ["cucumber"] = "assets/dashboard/plot-cucumber.webp",
        ["tomato"] = "assets/dashboard/plot-tomato.webp"
    };

    private static readonly IReadOnlyDictionary<string, string> TeamImages = new Dictionary<string, string>
    {
        ["potato"] = "assets/dashboard/carrot.webp",
        ["cucumber"] = "assets/dashboard/cucumber.webp",
        ["tomato"] = "assets/dashboard/tomatto.webp"
    };

    [HttpGet]
    public ActionResult<DashboardDto> Get()
    {
        var playerId = InMemoryIdentityService.DemoPlayerId;
        var profile = identity.GetProfile(playerId);
        var gardenState = garden.GetGarden(playerId);
        var team = garden.GetTeam(playerId);
        var rating = tournament.GetRating(playerId);
        var chests = rewards.GetChests(playerId);

        return Ok(ToDashboard(profile, gardenState, team, rating, chests));
    }

    private static DashboardDto ToDashboard(
        PlayerProfileResponse profile,
        GardenResponse garden,
        TeamResponse team,
        TournamentRatingResponse rating,
        IReadOnlyList<ChestDto> chests)
    {
        var plots = garden.Plots
            .OrderBy(plot => plot.PlotIndex)
            .Select(ToGardenPlot)
            .ToList();

        var members = team.Slots
            .OrderBy(slot => slot.Slot)
            .Select(ToTeamMember)
            .ToList();

        var unlockedPlots = garden.Plots.Count(plot => plot.IsUnlocked);
        var occupiedPlots = garden.Plots.Count(plot => plot.Crop is not null);
        var readyChests = chests.Count(chest => string.Equals(chest.Status, "ready", StringComparison.OrdinalIgnoreCase));

        return new DashboardDto(
            Header: new DashboardHeaderData(
                PlayerName: profile.FirstName,
                Coins: profile.Currencies.Seeds,
                Gems: profile.Currencies.Stars,
                XpCurrent: 120,
                XpTarget: 300),
            GardenCard: new DashboardGardenCardData(
                Title: "ОГОРОД",
                IconSrc: "assets/shared/hud/hud-nav-garden.png",
                SummaryText: $"{occupiedPlots}/{unlockedPlots} грядки занято",
                Plots: plots),
            TeamCard: new DashboardTeamCardData(
                Title: "КОМАНДА",
                IconSrc: "assets/shared/hud/hud-battle-swords.png",
                SummaryText: "Сила команды: 120",
                Members: members),
            TournamentCard: new DashboardTournamentCardData(
                LeagueName: "Бронзовая лига I",
                PlayerPlace: rating.Rank,
                ParticipantsCount: 1523),
            RewardsCard: new DashboardRewardsCardData(
                Coins: 500,
                Gems: 10,
                Cards: readyChests,
                ChestProgressCurrent: 5,
                ChestProgressTarget: 10));
    }

    private static DashboardGardenPlotData ToGardenPlot(GardenPlotDto plot)
    {
        var state = GetPlotState(plot);
        var cropCode = plot.Crop?.CropCode ?? "tomato";

        return new DashboardGardenPlotData(
            Id: plot.PlotId.ToString(),
            Slot: plot.PlotIndex,
            State: state,
            ImageUrl: GetImageUrl(PlotImages, cropCode),
            ImageBase64: null,
            ImageMimeType: null,
            StatusText: state switch
            {
                "ready" => "Готово!",
                "growing" => "23м 45с",
                _ => null
            },
            UnlockLevel: state == "locked" ? GetUnlockLevel(plot.PlotIndex) : null);
    }

    private static DashboardTeamMemberData ToTeamMember(TeamSlotDto member)
    {
        return new DashboardTeamMemberData(
            Id: member.PlayerCropId.ToString(),
            Slot: member.Slot,
            State: "ready",
            ImageUrl: GetImageUrl(TeamImages, member.CropCode),
            ImageBase64: null,
            ImageMimeType: null,
            StatusText: "Готово!",
            UnlockLevel: null);
    }

    private static string GetPlotState(GardenPlotDto plot)
    {
        if (!plot.IsUnlocked)
        {
            return "locked";
        }

        if (plot.Crop is null)
        {
            return "empty";
        }

        return plot.PlotIndex % 2 == 0 ? "growing" : "ready";
    }

    private static string GetImageUrl(IReadOnlyDictionary<string, string> images, string cropCode) =>
        images.TryGetValue(cropCode, out var imageUrl)
            ? imageUrl
            : images["tomato"];

    private static int GetUnlockLevel(int plotIndex) => plotIndex switch
    {
        <= 4 => 2,
        <= 6 => 5,
        _ => 10
    };
}
