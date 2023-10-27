using Microsoft.AspNetCore.Identity;

namespace server.api.Identity.SCMSUserStore;

public partial class SCMSUserStore : IUserLoginStore<SCMSUser>
{
    public Task AddLoginAsync(SCMSUser user, UserLoginInfo login, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<SCMSUser> FindByLoginAsync(string loginProvider, string providerKey, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<IList<UserLoginInfo>> GetLoginsAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task RemoveLoginAsync(SCMSUser user, string loginProvider, string providerKey, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
