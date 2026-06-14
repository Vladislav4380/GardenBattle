using GardenBattle.Shared.Contracts;

namespace GardenBattle.BattleEngine;

public sealed class BattleEngine
{
    private readonly BattleRuntimeOptions _options;

    public BattleEngine(BattleRuntimeOptions? options = null)
    {
        _options = options ?? new BattleRuntimeOptions();
    }

    public BattleTickResult Tick(BattleRuntimeState state)
    {
        if (state.Status is not BattleStatus.InProgress)
        {
            return new BattleTickResult(state, []);
        }

        var events = new List<object>();

        foreach (var unit in state.Units.Where(x => x.IsAlive))
        {
            unit.TargetUnitId = ResolveTarget(state, unit);
            unit.AbilityCharge = Math.Min(100, unit.AbilityCharge + _options.AbilityChargePerTick);

            if (unit.AbilityCharge == 100)
            {
                events.Add(new AbilityReadyEvent(unit.UnitId, unit.AbilityCode));
            }

            unit.TicksUntilAttack--;
            if (unit.TicksUntilAttack > 0 || unit.TargetUnitId is null)
            {
                continue;
            }

            unit.TicksUntilAttack = unit.AttackEveryTicks;
            var target = state.Units.FirstOrDefault(x => x.UnitId == unit.TargetUnitId && x.IsAlive);
            if (target is null)
            {
                unit.TargetUnitId = null;
                continue;
            }

            var damage = Math.Max(1, unit.Attack - target.Defense);
            target.Hp = Math.Max(0, target.Hp - damage);
            events.Add(new DamageAppliedEvent(unit.UnitId, target.UnitId, damage, target.Hp));

            if (!target.IsAlive)
            {
                target.TargetUnitId = null;
                events.Add(new CharacterDiedEvent(target.UnitId));
            }
        }

        var winnerId = ResolveWinner(state);
        if (winnerId is not null)
        {
            state.Status = BattleStatus.Finished;
            events.Add(new BattleFinishedEvent(state.BattleId, winnerId.Value, 100, 10, "silver"));
        }

        state.UpdatedAt = DateTimeOffset.UtcNow;
        return new BattleTickResult(state, events);
    }

    public IReadOnlyList<object> Apply(BattleRuntimeState state, IBattleCommand command)
    {
        var events = new List<object>();

        switch (command)
        {
            case SelectTargetCommand select:
                SetTarget(state, select.UnitId, select.TargetUnitId, events);
                break;
            case SelectGroupTargetCommand group:
                foreach (var unitId in group.UnitIds)
                {
                    SetTarget(state, unitId, group.TargetUnitId, events);
                }
                break;
            case UseAbilityCommand ability:
                UseAbility(state, ability.UnitId, ability.TargetUnitId, events);
                break;
            case LeaveBattleCommand leave:
                state.Status = BattleStatus.Cancelled;
                events.Add(new BattleFinishedEvent(state.BattleId, OpponentOf(state, leave.PlayerId), 0, 0, null));
                break;
        }

        state.UpdatedAt = DateTimeOffset.UtcNow;
        return events;
    }

    private static void SetTarget(BattleRuntimeState state, Guid unitId, Guid targetUnitId, List<object> events)
    {
        var unit = state.Units.FirstOrDefault(x => x.UnitId == unitId && x.IsAlive);
        var target = state.Units.FirstOrDefault(x => x.UnitId == targetUnitId && x.IsAlive);
        if (unit is null || target is null || unit.PlayerId == target.PlayerId)
        {
            return;
        }

        unit.TargetUnitId = targetUnitId;
        events.Add(new TargetChangedEvent(unitId, targetUnitId));
    }

    private static void UseAbility(BattleRuntimeState state, Guid unitId, Guid? targetUnitId, List<object> events)
    {
        var unit = state.Units.FirstOrDefault(x => x.UnitId == unitId && x.IsAlive && x.AbilityCharge >= 100);
        if (unit is null)
        {
            return;
        }

        unit.AbilityCharge = 0;
        events.Add(new AbilityUsedEvent(unit.UnitId, unit.AbilityCode));

        if (unit.AbilityCode == "tomato_bomb")
        {
            var enemies = state.Units.Where(x => x.PlayerId != unit.PlayerId && x.IsAlive).ToList();
            foreach (var enemy in enemies)
            {
                enemy.Hp = Math.Max(0, enemy.Hp - 25);
                events.Add(new DamageAppliedEvent(unit.UnitId, enemy.UnitId, 25, enemy.Hp));
            }
        }
        else if (targetUnitId is Guid targetId)
        {
            var target = state.Units.FirstOrDefault(x => x.UnitId == targetId && x.IsAlive);
            if (target is not null && target.PlayerId != unit.PlayerId)
            {
                target.Hp = Math.Max(0, target.Hp - 35);
                events.Add(new DamageAppliedEvent(unit.UnitId, target.UnitId, 35, target.Hp));
            }
        }
    }

    private static Guid? ResolveTarget(BattleRuntimeState state, BattleUnitState unit)
    {
        if (unit.TargetUnitId is Guid currentTargetId &&
            state.Units.Any(x => x.UnitId == currentTargetId && x.IsAlive && x.PlayerId != unit.PlayerId))
        {
            return currentTargetId;
        }

        return state.Units
            .Where(x => x.IsAlive && x.PlayerId != unit.PlayerId)
            .OrderBy(x => x.Slot)
            .Select(x => (Guid?)x.UnitId)
            .FirstOrDefault();
    }

    private static Guid? ResolveWinner(BattleRuntimeState state)
    {
        var leftAlive = state.Units.Any(x => x.PlayerId == state.LeftPlayerId && x.IsAlive);
        var rightAlive = state.Units.Any(x => x.PlayerId == state.RightPlayerId && x.IsAlive);

        return (leftAlive, rightAlive) switch
        {
            (true, false) => state.LeftPlayerId,
            (false, true) => state.RightPlayerId,
            _ => null
        };
    }

    private static Guid OpponentOf(BattleRuntimeState state, Guid playerId) =>
        state.LeftPlayerId == playerId ? state.RightPlayerId : state.LeftPlayerId;
}
