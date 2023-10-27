using Grpc.Core;

using Microsoft.AspNetCore.Authorization;

using server.api.gRPC;
using server.api.Identity.Services;

namespace server.api.gRPC.Services;


[Authorize(Roles = "admin")]
public class WeatherService : Weather.WeatherBase
{
    private readonly IUserService userService;

    public async override Task<WeatherReply> GetWet(WeatherRequest request, ServerCallContext context)
    {
        return await Task.FromResult(new WeatherReply { Wadup = "Rainy"});
    }
}
