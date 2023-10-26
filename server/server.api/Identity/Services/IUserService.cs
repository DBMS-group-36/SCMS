using server.api.gRPC;

namespace server.api.Identity.Services;

public interface IUserService
{
    Task<StatusReply> RegisterUserAsync(RegisterRequest model);
    Task<TokenResponseReply> LoginUserAsync(LoginRequest model);
}
