using Microsoft.AspNetCore.Identity;

using server.api.DataAccess.SqlQueryExtensions;

using System.Data;
using System.Security.Claims;


namespace server.api.Identity.SCMSUserStore;

public partial class SCMSUserStore : IUserClaimStore<SCMSUser>
{
    public async Task AddClaimsAsync(SCMSUser user, IEnumerable<Claim> claims, CancellationToken cancellationToken)
    {
        foreach (var claim in claims)
        {
            var userClaim = new IdentityUserClaim<ulong>();
            userClaim.InitializeFromClaim(claim);
            userClaim.UserId = user.Id;

            var sql = $"INSERT INTO roleclaims VALUES (" +
                $"{userClaim.Id.ToSqlString()}, " +
                $"{userClaim.UserId.ToSqlString()}, " +
                $"{userClaim.ClaimType.ToSqlString()}, " +
                $"{userClaim.ClaimValue.ToSqlString()} " +
                $");";
            _ = await database.ExecuteAsync(sql);
        }
    }

    public async Task<IList<Claim>> GetClaimsAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        var sql = $"SELECT * FROM userclaims WHERE UserId = '{user.Id}';";
        var result = await database.QueryAllAsync<IdentityUserClaim<string>>(sql);
        return result.Select(claim => claim.ToClaim()).ToList();
    }

    public Task<IList<SCMSUser>> GetUsersForClaimAsync(Claim claim, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task RemoveClaimsAsync(SCMSUser user, IEnumerable<Claim> claims, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task ReplaceClaimAsync(SCMSUser user, Claim claim, Claim newClaim, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
