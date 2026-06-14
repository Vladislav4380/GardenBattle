using GardenBattle.Shared.Contracts;

namespace GardenBattle.Modules.Payment;

public interface IPaymentService
{
    PaymentInvoiceResponse CreateTelegramStarsInvoice(PaymentInvoiceRequest request);
}

public sealed class InMemoryPaymentService : IPaymentService
{
    public PaymentInvoiceResponse CreateTelegramStarsInvoice(PaymentInvoiceRequest request) =>
        new(Guid.NewGuid().ToString("N"), $"https://t.me/$stars/{request.ProductCode}/{request.Stars}");
}
