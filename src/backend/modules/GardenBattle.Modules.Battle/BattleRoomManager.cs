using GardenBattle.BattleEngine;
using GardenBattle.Shared.Contracts;

namespace GardenBattle.Modules.Battle;

public interface IBattleRoomManager
{
    BattleRuntimeState CreateDemoBattle(Guid playerId, BattleType battleType);
    IReadOnlyList<Guid> GetActiveBattleIds();
    BattleRuntimeState? Get(Guid battleId);
    IReadOnlyList<object> Apply(IBattleCommand command);
    BattleTickResult Tick(Guid battleId);
}

public sealed class InMemoryBattleRoomManager : IBattleRoomManager
{
    private static readonly Guid BotPlayerId = Guid.Parse("99999999-9999-9999-9999-999999999999");
    private readonly Dictionary<Guid, BattleRuntimeState> _battles = [];
    private readonly BattleEngine.BattleEngine _engine = new();

    public BattleRuntimeState CreateDemoBattle(Guid playerId, BattleType battleType)
    {
        var battle = new BattleRuntimeState
        {
            BattleId = Guid.NewGuid(),
            BattleType = battleType,
            Status = BattleStatus.InProgress,
            LeftPlayerId = playerId,
            RightPlayerId = BotPlayerId
        };

        AddTeam(battle, playerId, ["potato", "cucumber", "tomato"]);
        AddTeam(battle, BotPlayerId, ["corn", "pepper", "zucchini"]);
        _battles[battle.BattleId] = battle;
        return battle;
    }

    public BattleRuntimeState? Get(Guid battleId) =>
        _battles.TryGetValue(battleId, out var battle) ? battle : null;

    public IReadOnlyList<Guid> GetActiveBattleIds() =>
        _battles.Values
            .Where(x => x.Status is BattleStatus.InProgress or BattleStatus.Countdown)
            .Select(x => x.BattleId)
            .ToList();

    public IReadOnlyList<object> Apply(IBattleCommand command)
    {
        if (!_battles.TryGetValue(command.BattleId, out var battle))
        {
            return [];
        }

        return _engine.Apply(battle, command);
    }

    public BattleTickResult Tick(Guid battleId)
    {
        if (!_battles.TryGetValue(battleId, out var battle))
        {
            throw new InvalidOperationException("Battle room not found.");
        }

        return _engine.Tick(battle);
    }

    private static void AddTeam(BattleRuntimeState battle, Guid playerId, IReadOnlyList<string> cropCodes)
    {
        for (var index = 0; index < cropCodes.Count; index++)
        {
            var stats = StatsFor(cropCodes[index]);
            battle.Units.Add(new BattleUnitState
            {
                PlayerId = playerId,
                CropCode = cropCodes[index],
                Slot = index + 1,
                MaxHp = stats.Hp,
                Hp = stats.Hp,
                Attack = stats.Attack,
                Defense = stats.Defense,
                AbilityCode = stats.AbilityCode,
                AttackEveryTicks = stats.AttackEveryTicks,
                TicksUntilAttack = stats.AttackEveryTicks
            });
        }
    }

    private static (int Hp, int Attack, int Defense, string AbilityCode, int AttackEveryTicks) StatsFor(string cropCode) =>
        cropCode switch
        {
            "potato" => (140, 14, 8, "earth_shield", 8),
            "cucumber" => (95, 18, 4, "slippery_maneuver", 6),
            "tomato" => (105, 22, 5, "tomato_bomb", 10),
            "corn" => (120, 19, 6, "corn_barrage", 8),
            "pepper" => (90, 24, 3, "spicy_burst", 9),
            "zucchini" => (130, 16, 7, "vine_guard", 8),
            _ => (100, 15, 5, "basic_strike", 8)
        };
}
