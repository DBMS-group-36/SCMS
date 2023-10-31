using Grpc.Core;
using server.api.Identity.Services;
using server.api.gRPC.Authentication;

namespace server.api.gRPC.Services.Authentication;

public class AuthService : Auth.AuthBase
{
    private readonly IUserService userService;

    public AuthService(IUserService userService)
    {
        this.userService = userService;
    }
    public async override Task<StatusReply> Register(RegisterRequest request, ServerCallContext context)
    {
        return await userService.RegisterUserAsync(request);
    }
    public async override Task<TokenResponseReply> Login(LoginRequest request, ServerCallContext context)
    {
        return await userService.LoginUserAsync(request);
    }
}
