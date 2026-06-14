using GardenBattle.Shared.Contracts;

namespace GardenBattle.Modules.Tournament;

public interface ITournamentService
{
    TournamentRatingResponse GetRating(Guid playerId);
}

public sealed class InMemoryTournamentService : ITournamentService
{
    public TournamentRatingResponse GetRating(Guid playerId) => new(playerId, Rating: 1000, WeeklyWins: 0, Rank: 128);
}
