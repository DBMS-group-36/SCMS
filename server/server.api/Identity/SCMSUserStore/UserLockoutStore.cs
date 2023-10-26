using Google.Type;

using Microsoft.AspNetCore.Identity;

namespace server.api.Identity.SCMSUserStore;

public partial class SCMSUserStore : IUserLockoutStore<SCMSUser>
{
    public async Task<int> GetAccessFailedCountAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        return await Task.FromResult(user.AccessFailedCount);
    }

    public async Task<bool> GetLockoutEnabledAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        return await Task.FromResult(user.LockoutEnabled);
    }

    public async Task<DateTimeOffset?> GetLockoutEndDateAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        return await Task.FromResult(user.LockoutEnd);
    }

    public async Task<int> IncrementAccessFailedCountAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        user.AccessFailedCount++;
        return await Task.FromResult(user.AccessFailedCount);
    }

    public Task ResetAccessFailedCountAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        user.AccessFailedCount = 0;
        return Task.CompletedTask;
    }

    public Task SetLockoutEnabledAsync(SCMSUser user, bool enabled, CancellationToken cancellationToken)
    {
        user.LockoutEnabled = enabled;
        return Task.CompletedTask;
    }

    public Task SetLockoutEndDateAsync(SCMSUser user, DateTimeOffset? lockoutEnd, CancellationToken cancellationToken)
    {
        user.LockoutEnd = lockoutEnd;
        return Task.CompletedTask;
    }
}
