var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => Results.Ok(new
{
    name = "Garden Battle Gateway",
    purpose = "YARP-compatible edge placeholder for auth, rate limits, request logging, and future service routing.",
    routes = new[]
    {
        "/api/auth/*",
        "/api/player/*",
        "/api/garden/*",
        "/api/team/*",
        "/api/battle/*",
        "/api/tournament/*",
        "/api/market/*",
        "/battleHub"
    }
}));

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();
