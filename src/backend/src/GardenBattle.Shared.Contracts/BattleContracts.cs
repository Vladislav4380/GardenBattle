namespace GardenBattle.Shared.Contracts;

public enum BattleType
{
    Normal,
    Tournament
}

public enum BattleStatus
{
    Created,
    WaitingPlayers,
    Countdown,
    InProgress,
    Finished,
    Cancelled
}

public sealed record TeamSlotDto(int Slot, Guid PlayerCropId, string CropCode);

public sealed record TeamResponse(IReadOnlyList<TeamSlotDto> Slots);

public sealed record SaveTeamRequest(IReadOnlyList<SaveTeamSlot> Slots);

public sealed record SaveTeamSlot(int Slot, Guid PlayerCropId);

public sealed record BattleSearchRequest(BattleType BattleType = BattleType.Normal);

public sealed record BattleSearchResponse(Guid BattleId, string Status);

public sealed record BattleInfoResponse(Guid BattleId, BattleStatus Status, BattleType BattleType);

public sealed record BattleResultResponse(
    Guid BattleId,
    Guid WinnerPlayerId,
    int SeedsReward,
    int RatingDelta,
    string? ChestReward);

public sealed record JoinBattleRequest(Guid BattleId);

public sealed record SelectTargetRequest(Guid BattleId, Guid UnitId, Guid TargetUnitId);

public sealed record SelectGroupTargetRequest(Guid BattleId, IReadOnlyList<Guid> UnitIds, Guid TargetUnitId);

public sealed record UseAbilityRequest(Guid BattleId, Guid UnitId, Guid? TargetUnitId);

public sealed record LeaveBattleRequest(Guid BattleId);

public sealed record BattleUnitDto(
    Guid UnitId,
    Guid PlayerId,
    string CropCode,
    int Slot,
    int Hp,
    int MaxHp,
    int Attack,
    int Defense,
    int AbilityCharge,
    Guid? TargetUnitId,
    bool IsAlive);

public sealed record BattleStateChangedEvent(
    Guid BattleId,
    BattleStatus Status,
    IReadOnlyList<BattleUnitDto> LeftTeam,
    IReadOnlyList<BattleUnitDto> RightTeam);

public sealed record BattleStartedEvent(Guid BattleId, int Countdown);

public sealed record TargetChangedEvent(Guid UnitId, Guid TargetUnitId);

public sealed record DamageAppliedEvent(Guid AttackerId, Guid TargetId, int Damage, int TargetHp);

public sealed record AbilityReadyEvent(Guid UnitId, string AbilityCode);

public sealed record AbilityUsedEvent(Guid UnitId, string AbilityCode);

public sealed record CharacterDiedEvent(Guid UnitId);

public sealed record BattleFinishedEvent(
    Guid BattleId,
    Guid WinnerPlayerId,
    int SeedsReward,
    int RatingDelta,
    string? ChestReward);
