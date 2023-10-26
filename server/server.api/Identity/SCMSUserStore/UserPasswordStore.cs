using Microsoft.AspNetCore.Identity;

namespace server.api.Identity.SCMSUserStore;

public partial class SCMSUserStore : IUserPasswordStore<SCMSUser>
{
    public async Task<string> GetPasswordHashAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        return await Task.FromResult(user.PasswordHash);
    }

    public async Task<bool> HasPasswordAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        return await Task.FromResult(user.PasswordHash != null);
    }

    public Task SetPasswordHashAsync(SCMSUser user, string passwordHash, CancellationToken cancellationToken)
    {
        user.PasswordHash = passwordHash;
        return Task.CompletedTask;
    }
}
