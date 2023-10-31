using Microsoft.AspNetCore.Identity;

using server.api.DataAccess;
using server.api.DataAccess.SqlQueryExtensions;


namespace server.api.Identity.SCMSRoleStore;

public partial class SCMSRoleStore : IRoleStore<SCMSRole>
{

    private readonly IDatabase database;

    public SCMSRoleStore(IDatabase database)
    {
        this.database = database;
    }

    public async Task<IdentityResult> CreateAsync(SCMSRole role, CancellationToken cancellationToken)
    {
        var sql = $"INSERT INTO roles VALUES (" +
            $"{role.Id.ToSqlString()}, " +
            $"{role.Name.ToSqlString()}, " +
            $"{role.NormalizedName.ToSqlString()}, " +
            $"{role.ConcurrencyStamp.ToSqlString()} " +
            $");";
        var result = await database.ExecuteAsync(sql);
        if (result == 1) return IdentityResult.Success;
        else return IdentityResult.Failed(new IdentityError { Description = $"{result} rows affected." });
    }

    public async Task<IdentityResult> DeleteAsync(SCMSRole role, CancellationToken cancellationToken)
    {
        var sql = $"DELETE FROM roles WHERE Id = '{role.Id}'";
        var result = await database.ExecuteAsync(sql);
        if (result == 1) return IdentityResult.Success;
        else return IdentityResult.Failed(new IdentityError { Description = $"{result} rows affected." });
    }

    public void Dispose()
    {
        // TODO : Implement
        GC.SuppressFinalize(this);
    }

    public async Task<SCMSRole> FindByIdAsync(string roleId, CancellationToken cancellationToken)
    {
        return await database.QueryFirstAsync<SCMSRole>($"SELECT * FROM roles WHERE Id = '{roleId}'");
    }

    public async Task<SCMSRole> FindByNameAsync(string normalizedRoleName, CancellationToken cancellationToken)
    {
        return await database.QueryFirstAsync<SCMSRole>($"SELECT * FROM roles WHERE NormalizedName = '{normalizedRoleName}'");
    }

    public async Task<string> GetNormalizedRoleNameAsync(SCMSRole role, CancellationToken cancellationToken)
    {
        return await Task.FromResult(role.NormalizedName);
    }

    public async Task<string> GetRoleIdAsync(SCMSRole role, CancellationToken cancellationToken)
    {
        return await Task.FromResult(role.Id.ToString());
    }

    public async Task<string> GetRoleNameAsync(SCMSRole role, CancellationToken cancellationToken)
    {
        return await Task.FromResult(role.Name);
    }

    public Task SetNormalizedRoleNameAsync(SCMSRole role, string normalizedName, CancellationToken cancellationToken)
    {
        role.NormalizedName = normalizedName;
        return Task.CompletedTask;
    }

    public Task SetRoleNameAsync(SCMSRole role, string roleName, CancellationToken cancellationToken)
    {
        role.Name = roleName;
        return Task.CompletedTask;
    }

    public async Task<IdentityResult> UpdateAsync(SCMSRole role, CancellationToken cancellationToken)
    {
        var sql = $"UPDATE roles SET " +
            $"Name = {role.Name.ToSqlString()}, " +
            $"NormalizedName = {role.NormalizedName.ToSqlString()}, " +
            $"ConcurrencyStamp = {role.ConcurrencyStamp.ToSqlString()}, " +
            $"WHARE Id = {role.Id.ToSqlString()}";

        var result = await database.ExecuteAsync(sql);

        if (result == 1) return IdentityResult.Success;
        else return IdentityResult.Failed(new IdentityError { Description = $"{result} rows affected." });
    }
}
