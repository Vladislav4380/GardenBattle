namespace GardenBattle.Shared.Contracts;

public sealed record TournamentRatingResponse(Guid PlayerId, int Rating, int WeeklyWins, int Rank);

public sealed record ChestDto(Guid ChestId, string ChestType, string Status);

public sealed record MarketLotDto(Guid LotId, string Code, string Name, int PriceSeeds, int PriceStars);

public sealed record PaymentInvoiceRequest(string ProductCode, int Stars);

public sealed record PaymentInvoiceResponse(string InvoiceId, string PaymentUrl);
