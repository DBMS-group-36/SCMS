using Microsoft.AspNetCore.Identity;

using server.api.DataAccess;
using server.api.DataAccess.SqlQueryExtensions;

namespace server.api.Identity.SCMSUserStore;

public partial class SCMSUserStore : IUserStore<SCMSUser>
{
    private readonly IDatabase database;
    private readonly IRoleStore<SCMSRole> roleStore;

    public SCMSUserStore(IDatabase database, IRoleStore<SCMSRole> roleStore)
    {
        this.database = database;
        this.roleStore = roleStore;
    }
    public async Task<IdentityResult> CreateAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        var sql = $"INSERT INTO users VALUES (" +
            $"{user.Id.ToSqlString()}, " +
            $"{user.UserName.ToSqlString()}, " +
            $"{user.NormalizedUserName.ToSqlString()}, " +
            $"{user.Email.ToSqlString()}, " +
            $"{user.NormalizedEmail.ToSqlString()}, " +
            $"{user.EmailConfirmed.ToSqlString()}, " +
            $"{user.PasswordHash.ToSqlString()}, " +
            $"{user.SecurityStamp.ToSqlString()}, " +
            $"{user.ConcurrencyStamp.ToSqlString()}, " +
            $"{user.PhoneNumber.ToSqlString()}, " +
            $"{user.PhoneNumberConfirmed.ToSqlString()}, " +
            $"{user.TwoFactorEnabled.ToSqlString()}, " +
            $"{user.LockoutEnd.ToSqlString()}, " +
            $"{user.LockoutEnabled.ToSqlString()}, " +
            $"{user.AccessFailedCount.ToSqlString()} " +
            $");";

        //Console.WriteLine( sql );
        var result = await database.ExecuteAsync(sql);
        if (result == 1) return IdentityResult.Success;
        else return IdentityResult.Failed(new IdentityError { Description = $"{result} rows affected." });
    }

    public async Task<IdentityResult> DeleteAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        var sql = $"DELETE FROM users WHERE Id = @userId";
        var result = await database.ExecuteAsync(sql);
        if (result == 1) return IdentityResult.Success;
        else return IdentityResult.Failed(new IdentityError { Description = $"{result} rows affected." });
    }

    public void Dispose()
    {
        // TODO : Implement
        GC.SuppressFinalize(this);
    }

    public async Task<SCMSUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
    {
        return await database.QueryFirstAsync<SCMSUser>($"SELECT * FROM users WHERE Id = '{userId}'");
    }

    public async Task<SCMSUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
    {
        return await database.QueryFirstAsync<SCMSUser>($"SELECT * FROM users WHERE NormalizedUserName = '{normalizedUserName}'");
    }

    public async Task<string> GetNormalizedUserNameAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        //string normalizedUserName = (await database.QueryFirstAsync<SCMSUser>($"SELECT * FROM user WHERE Id = '{user.Id}'")).NormalizedUserName;
        //return normalizedUserName;
        return await Task.FromResult(user.NormalizedUserName);
    }

    public async Task<string> GetUserIdAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        //string userId = (await database.QueryFirstAsync<SCMSUser>($"SELECT * FROM user WHERE NormalizedUserName = '{user.NormalizedUserName}'")).Id;
        //return userId;
        return await Task.FromResult(user.Id.ToString());
    }

    public async Task<string> GetUserNameAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        //string userName = (await database.QueryFirstAsync<SCMSUser>($"SELECT * FROM user WHERE Id = '{user.Id}'")).UserName;
        //return userName;
        return await Task.FromResult(user.UserName);
    }

    public Task SetNormalizedUserNameAsync(SCMSUser user, string normalizedName, CancellationToken cancellationToken)
    {
        //var sql = $"UPDATE user SET NormalizedUserName = '{normalizedName}' WHERE id = '{user.Id}'";
        //var result = await  database.ExecuteAsync(sql);
        //await new Task(() => {
            user.NormalizedUserName = normalizedName;
        //});

        return Task.CompletedTask;
    }

    public Task SetUserNameAsync(SCMSUser user, string userName, CancellationToken cancellationToken)
    {
        //var sql = $"UPDATE user SET UserName = '{userName}' WHERE id = '{user.Id}'";
        //var result = await database.ExecuteAsync(sql);
        //await new Task(() => {
            user.UserName = userName;
        //});

        return Task.CompletedTask;
    }

    public async Task<IdentityResult> UpdateAsync(SCMSUser user, CancellationToken cancellationToken)
    {
        var sql = $"UPDATE users SET " +
            $"UserName = {user.UserName.ToSqlString()}, " +
            $"NormalizedUserName = {user.NormalizedUserName.ToSqlString()}, " +
            $"Email = {user.Email.ToSqlString()}, " +
            $"NormalizedEmail = {user.NormalizedEmail.ToSqlString()}, " +
            $"EmailConfirmed = {user.EmailConfirmed.ToSqlString()}, " +
            $"PasswordHash = {user.PasswordHash.ToSqlString()}, " +
            $"SecurityStamp = {user.SecurityStamp.ToSqlString()}, " +
            $"ConcurrencyStamp = '{user.ConcurrencyStamp}', " +
            $"PhoneNumber = {user.PhoneNumber.ToSqlString()}, " +
            $"PhoneNumberConfirmed = {user.PhoneNumberConfirmed.ToSqlString()}, " +
            $"TwoFactorEnabled = {user.TwoFactorEnabled.ToSqlString()}, " +
            $"LockoutEnd = {user.LockoutEnd.ToSqlString()}, " +
            $"LockoutEnabled = {user.LockoutEnabled.ToSqlString()}, " +
            $"AccessFailedCount = {user.AccessFailedCount.ToSqlString()} " +
            $"WHERE Id = {user.Id.ToSqlString()};";

        var result = await database.ExecuteAsync(sql);

        if (result == 1) return IdentityResult.Success;
        else return IdentityResult.Failed(new IdentityError { Description = $"{result} rows affected." });
    }
}
