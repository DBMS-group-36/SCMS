using Grpc.Core;
using server.api.gRPC;
using server.api.Identity.Services;

namespace server.api.gRPC.Services;

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
