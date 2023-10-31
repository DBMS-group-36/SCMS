using Microsoft.AspNetCore.Identity;

using server.api.DataAccess.SqlQueryExtensions;

using System.Security.Claims;

namespace server.api.Identity.SCMSRoleStore;

public partial class SCMSRoleStore : IRoleClaimStore<SCMSRole>
{
    public async Task AddClaimAsync(SCMSRole role, Claim claim, CancellationToken cancellationToken = default)
    {
        var roleClaim = new IdentityRoleClaim<ulong>();
        roleClaim.InitializeFromClaim(claim);
        roleClaim.RoleId = role.Id;

        var sql = $"INSERT INTO roleclaims VALUES (" +
            $"{roleClaim.Id.ToSqlString()}, " +
            $"{roleClaim.RoleId.ToSqlString()}, " +
            $"{roleClaim.ClaimType.ToSqlString()}, " +
            $"{roleClaim.ClaimValue.ToSqlString()} " +
            $");";
        _ = await database.ExecuteAsync(sql);
    }

    public async Task<IList<Claim>> GetClaimsAsync(SCMSRole role, CancellationToken cancellationToken = default)
    {
        var sql = $"SELECT * FROM roleclaims WHERE RoleId = '{role.Id}';";
        var result = await database.QueryAllAsync<IdentityRoleClaim<string>>(sql);
        return result.Select(claim => claim.ToClaim()).ToList();
    }

    public Task RemoveClaimAsync(SCMSRole role, Claim claim, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}
