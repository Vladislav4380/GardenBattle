namespace GardenBattle.Shared.Contracts;

public interface IDomainEvent
{
    Guid EventId { get; }
    DateTimeOffset OccurredAt { get; }
}

public sealed record DomainEventEnvelope<TEvent>(
    Guid EventId,
    DateTimeOffset OccurredAt,
    string EventType,
    TEvent Payload) : IDomainEvent;
