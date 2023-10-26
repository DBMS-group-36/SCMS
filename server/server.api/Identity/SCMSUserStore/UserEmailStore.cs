using Microsoft.AspNetCore.Identity;

namespace server.api.Identity.SCMSUserStore;

public partial class SCMSUserStore : IUserEmailStore<SCMSUser>
{
    public async Task<SCMSUser> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
    {
        return await database.QueryFirstAsync<SCMSUser>($"SELECT * FROM users WHERE NormalizedEmail = '{normalizedEmail}'");
    }

    public async Task<string> GetEmailAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        return await Task.FromResult(user.Email);
    }

    public async Task<bool> GetEmailConfirmedAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        return await Task.FromResult(user.EmailConfirmed);
    }

    public async Task<string> GetNormalizedEmailAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        return await Task.FromResult(user.NormalizedEmail);
    }

    public Task SetEmailAsync(SCMSUser user, string email, CancellationToken cancellationToken)
    {
        user.Email = email;
        return Task.CompletedTask;
    }

    public Task SetEmailConfirmedAsync(SCMSUser user, bool confirmed, CancellationToken cancellationToken)
    {
        user.EmailConfirmed = confirmed;
        return Task.CompletedTask;
    }

    public Task SetNormalizedEmailAsync(SCMSUser user, string normalizedEmail, CancellationToken cancellationToken)
    {
        user.NormalizedEmail = normalizedEmail;
        return Task.CompletedTask;
    }
}
