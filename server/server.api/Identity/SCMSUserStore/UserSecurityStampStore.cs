using Microsoft.AspNetCore.Identity;

namespace server.api.Identity.SCMSUserStore;

public partial class SCMSUserStore : IUserSecurityStampStore<SCMSUser>
{
    public Task<string> GetSecurityStampAsync(SCMSUser user, CancellationToken cancellationToken)
    {

        return Task.FromResult(user.SecurityStamp);
    }

    public Task SetSecurityStampAsync(SCMSUser user, string stamp, CancellationToken cancellationToken)
    {
        user.SecurityStamp = stamp; 
        return Task.CompletedTask;
    }
}
