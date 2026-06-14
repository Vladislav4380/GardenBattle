using GardenBattle.BattleEngine;
using GardenBattle.Modules.Battle;
using GardenBattle.Modules.Garden;
using GardenBattle.Modules.Identity;
using GardenBattle.Modules.Market;
using GardenBattle.Modules.Payment;
using GardenBattle.Modules.Reward;
using GardenBattle.Modules.Tournament;
using GardenBattle.Shared.Contracts;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddSingleton<IIdentityService, InMemoryIdentityService>();
builder.Services.AddSingleton<IGardenService, InMemoryGardenService>();
builder.Services.AddSingleton<IBattleRoomManager, InMemoryBattleRoomManager>();
builder.Services.AddSingleton<IRewardService, InMemoryRewardService>();
builder.Services.AddSingleton<ITournamentService, InMemoryTournamentService>();
builder.Services.AddSingleton<IMarketService, InMemoryMarketService>();
builder.Services.AddSingleton<IPaymentService, InMemoryPaymentService>();
builder.Services.AddHostedService<BattleTickerHostedService>();

var app = builder.Build();

app.MapGet("/", () => Results.Ok(new
{
    name = "Garden Battle API",
    architecture = "Microservice Ready Modular Monolith",
    signalR = "/battleHub"
}));

app.MapPost("/api/auth/login", (LoginRequest request, IIdentityService identity) =>
    Results.Ok(identity.Login(request)));

app.MapGet("/api/player/profile", (IIdentityService identity) =>
    Results.Ok(identity.GetProfile(AppIdentity.CurrentPlayerId())));

app.MapGet("/api/player/dashboard", (IIdentityService identity) =>
    Results.Ok(identity.GetDashboard(AppIdentity.CurrentPlayerId())));

app.MapGet("/api/crops", (IGardenService garden) => Results.Ok(garden.GetCropTypes()));

app.MapGet("/api/garden", (IGardenService garden) => Results.Ok(garden.GetGarden(AppIdentity.CurrentPlayerId())));
app.MapPost("/api/garden/plant", (PlantCropRequest request, IGardenService garden) => Results.Ok(garden.Plant(AppIdentity.CurrentPlayerId(), request)));
app.MapPost("/api/garden/harvest", (HarvestCropRequest request, IGardenService garden) => Results.Ok(garden.Harvest(AppIdentity.CurrentPlayerId(), request)));
app.MapPost("/api/garden/plots/unlock", (UnlockPlotRequest request, IGardenService garden) => Results.Ok(garden.UnlockPlot(AppIdentity.CurrentPlayerId(), request)));
app.MapPost("/api/garden/greenhouse", (BuildGreenhouseRequest request, IGardenService garden) => Results.Ok(garden.BuildGreenhouse(AppIdentity.CurrentPlayerId(), request)));

app.MapGet("/api/team", (IGardenService garden) => Results.Ok(garden.GetTeam(AppIdentity.CurrentPlayerId())));
app.MapPost("/api/team", (SaveTeamRequest request, IGardenService garden) => Results.Ok(garden.SaveTeam(AppIdentity.CurrentPlayerId(), request)));

app.MapPost("/api/battle/search", (BattleSearchRequest request, IBattleRoomManager battles) =>
{
    var battle = battles.CreateDemoBattle(AppIdentity.CurrentPlayerId(), request.BattleType);
    return Results.Ok(new BattleSearchResponse(battle.BattleId, battle.Status.ToString()));
});

app.MapGet("/api/battle/{battleId:guid}", (Guid battleId, IBattleRoomManager battles) =>
{
    var battle = battles.Get(battleId);
    return battle is null
        ? Results.NotFound()
        : Results.Ok(new BattleInfoResponse(battle.BattleId, battle.Status, battle.BattleType));
});

app.MapGet("/api/battle/{battleId:guid}/state", (Guid battleId, IBattleRoomManager battles) =>
{
    var battle = battles.Get(battleId);
    return battle is null ? Results.NotFound() : Results.Ok(BattleMappings.ToStateChangedEvent(battle));
});

app.MapGet("/api/battle/{battleId:guid}/result", (Guid battleId, IBattleRoomManager battles) =>
{
    var battle = battles.Get(battleId);
    if (battle is null)
    {
        return Results.NotFound();
    }

    var winnerId = battle.Units
        .Where(x => x.IsAlive)
        .GroupBy(x => x.PlayerId)
        .OrderByDescending(x => x.Sum(unit => unit.Hp))
        .Select(x => x.Key)
        .FirstOrDefault();

    return Results.Ok(new BattleResultResponse(battleId, winnerId, 100, 10, "silver"));
});

app.MapGet("/api/rewards/chests", (IRewardService rewards) => Results.Ok(rewards.GetChests(AppIdentity.CurrentPlayerId())));
app.MapGet("/api/tournament/rating", (ITournamentService tournament) => Results.Ok(tournament.GetRating(AppIdentity.CurrentPlayerId())));
app.MapGet("/api/market/lots", (IMarketService market) => Results.Ok(market.GetLots()));
app.MapPost("/api/payment/stars/invoice", (PaymentInvoiceRequest request, IPaymentService payment) => Results.Ok(payment.CreateTelegramStarsInvoice(request)));

app.MapHub<BattleHub>("/battleHub");

app.Run();

public static class AppIdentity
{
    public static Guid CurrentPlayerId() => InMemoryIdentityService.DemoPlayerId;
}

public static class BattleMappings
{
    public static BattleStateChangedEvent ToStateChangedEvent(BattleRuntimeState state)
    {
        var leftTeam = state.Units.Where(x => x.PlayerId == state.LeftPlayerId).Select(ToDto).ToList();
        var rightTeam = state.Units.Where(x => x.PlayerId == state.RightPlayerId).Select(ToDto).ToList();
        return new BattleStateChangedEvent(state.BattleId, state.Status, leftTeam, rightTeam);
    }

    private static BattleUnitDto ToDto(BattleUnitState unit) =>
        new(
            unit.UnitId,
            unit.PlayerId,
            unit.CropCode,
            unit.Slot,
            unit.Hp,
            unit.MaxHp,
            unit.Attack,
            unit.Defense,
            unit.AbilityCharge,
            unit.TargetUnitId,
            unit.IsAlive);
}

public sealed class BattleHub(IBattleRoomManager battles) : Hub
{
    public async Task JoinBattle(JoinBattleRequest request)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, request.BattleId.ToString());
        var battle = battles.Get(request.BattleId);
        if (battle is null)
        {
            return;
        }

        await Clients.Caller.SendAsync("BattleStarted", new BattleStartedEvent(request.BattleId, 3));
        await Clients.Caller.SendAsync("BattleStateChanged", BattleMappings.ToStateChangedEvent(battle));
    }

    public async Task SelectTarget(SelectTargetRequest request)
    {
        await Publish(request.BattleId, battles.Apply(new SelectTargetCommand(request.BattleId, request.UnitId, request.TargetUnitId)));
    }

    public async Task SelectGroupTarget(SelectGroupTargetRequest request)
    {
        await Publish(request.BattleId, battles.Apply(new SelectGroupTargetCommand(request.BattleId, request.UnitIds, request.TargetUnitId)));
    }

    public async Task UseAbility(UseAbilityRequest request)
    {
        await Publish(request.BattleId, battles.Apply(new UseAbilityCommand(request.BattleId, request.UnitId, request.TargetUnitId)));
    }

    public async Task LeaveBattle(LeaveBattleRequest request)
    {
        await Publish(request.BattleId, battles.Apply(new LeaveBattleCommand(request.BattleId, AppIdentity.CurrentPlayerId())));
    }

    private async Task Publish(Guid battleId, IReadOnlyList<object> events)
    {
        foreach (var battleEvent in events)
        {
            await Clients.Group(battleId.ToString()).SendAsync(battleEvent.GetType().Name.Replace("Event", ""), battleEvent);
        }

        var battle = battles.Get(battleId);
        if (battle is not null)
        {
            await Clients.Group(battleId.ToString()).SendAsync("BattleStateChanged", BattleMappings.ToStateChangedEvent(battle));
        }
    }
}

public sealed class BattleTickerHostedService(
    IBattleRoomManager battles,
    IHubContext<BattleHub> hubContext) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromMilliseconds(250));

        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            foreach (var battleId in battles.GetActiveBattleIds())
            {
                var result = battles.Tick(battleId);
                foreach (var battleEvent in result.Events)
                {
                    await hubContext.Clients.Group(battleId.ToString()).SendAsync(
                        battleEvent.GetType().Name.Replace("Event", ""),
                        battleEvent,
                        stoppingToken);
                }

                await hubContext.Clients.Group(battleId.ToString()).SendAsync(
                    "BattleStateChanged",
                    BattleMappings.ToStateChangedEvent(result.State),
                    stoppingToken);
            }
        }
    }
}
