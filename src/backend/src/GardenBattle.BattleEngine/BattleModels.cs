using GardenBattle.Shared.Contracts;

namespace GardenBattle.BattleEngine;

public sealed record BattleRuntimeOptions(int TickMilliseconds = 250, int AbilityChargePerTick = 1);

public sealed class BattleRuntimeState
{
    public Guid BattleId { get; init; }
    public BattleStatus Status { get; set; } = BattleStatus.Created;
    public BattleType BattleType { get; init; } = BattleType.Normal;
    public Guid LeftPlayerId { get; init; }
    public Guid RightPlayerId { get; init; }
    public List<BattleUnitState> Units { get; } = [];
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class BattleUnitState
{
    public Guid UnitId { get; init; } = Guid.NewGuid();
    public Guid PlayerId { get; init; }
    public string CropCode { get; init; } = "";
    public int Slot { get; init; }
    public int MaxHp { get; init; }
    public int Hp { get; set; }
    public int Attack { get; init; }
    public int Defense { get; init; }
    public int AbilityCharge { get; set; }
    public string AbilityCode { get; init; } = "";
    public Guid? TargetUnitId { get; set; }
    public int AttackEveryTicks { get; init; } = 8;
    public int TicksUntilAttack { get; set; } = 8;
    public bool IsAlive => Hp > 0;
}

public interface IBattleCommand
{
    Guid BattleId { get; }
}

public sealed record SelectTargetCommand(Guid BattleId, Guid UnitId, Guid TargetUnitId) : IBattleCommand;

public sealed record SelectGroupTargetCommand(Guid BattleId, IReadOnlyList<Guid> UnitIds, Guid TargetUnitId) : IBattleCommand;

public sealed record UseAbilityCommand(Guid BattleId, Guid UnitId, Guid? TargetUnitId) : IBattleCommand;

public sealed record LeaveBattleCommand(Guid BattleId, Guid PlayerId) : IBattleCommand;

public sealed record BattleTickResult(
    BattleRuntimeState State,
    IReadOnlyList<object> Events);
