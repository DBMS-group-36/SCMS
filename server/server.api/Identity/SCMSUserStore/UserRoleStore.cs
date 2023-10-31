using Microsoft.AspNetCore.Identity;

using server.api.DataAccess.SqlQueryExtensions;

namespace server.api.Identity.SCMSUserStore;

public partial class SCMSUserStore : IUserRoleStore<SCMSUser>
{
    public async Task AddToRoleAsync(SCMSUser user, string roleName, CancellationToken cancellationToken)
    {
        var roleId = (await roleStore.FindByNameAsync(roleName, cancellationToken)).Id;
        var sql = $"INSERT IGNORE INTO userroles VALUES ({user.Id.ToSqlString()}, {roleId.ToSqlString()})";
        var result = await database.ExecuteAsync(sql);
    }

    public async Task<IList<string>> GetRolesAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        var sql = $"SELECT * FROM roles WHERE Id IN (SELECT RoleId FROM userroles WHERE UserId = '{user.Id}');";
        var result = await database.QueryAllAsync<SCMSRole>(sql);
        return result.Select(role => role.Name).ToList();
    }

    public async Task<IList<SCMSUser>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
    {
        var roleId = (await roleStore.FindByNameAsync(roleName, cancellationToken)).Id;
        var sql = $"SELECT * FROM users WHERE Id IN (SELECT UserId FROM userroles WHERE RoleId = '{roleId}');";
        var result = await database.QueryAllAsync<SCMSUser>(sql);
        return result.ToList();
    }

    public async Task<bool> IsInRoleAsync(SCMSUser user, string roleName, CancellationToken cancellationToken)
    {
        var roleId = (await roleStore.FindByNameAsync(roleName, cancellationToken))?.Id;
        var sql = $"SELECT COUNT(*) AS role_count FROM userroles WHERE UserId = '{user.Id}' AND RoleId = '{roleId}';";
        var result = await database.ExecuteScalarAsync<long>(sql);
        return result > 0;
    }

    public async Task RemoveFromRoleAsync(SCMSUser user, string roleName, CancellationToken cancellationToken)
    {
        var roleId = (await roleStore.FindByNameAsync(roleName, cancellationToken)).Id;
        var sql = $"DELETE FROM userroles WHERE UserId = '{user.Id}' AND RoleId = '{roleId}';";
        var result = await database.ExecuteAsync(sql);
    }
}
