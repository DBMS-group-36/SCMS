using Microsoft.AspNetCore.Identity;

using server.api.Identity;

namespace server.api.DataAccess.SqlQueryExtensions;

public static class ToSqlTableRow
{
    public static string toSqlTableRow(this SCMSUser obj)
    {
        var t = (
            obj.Id.toSqlString(),
            obj.UserName.toSqlString(),
            obj.NormalizedUserName.toSqlString(),
            obj.Email.toSqlString(),
            obj.NormalizedEmail.toSqlString(),
            obj.EmailConfirmed.toSqlString(),
            obj.PasswordHash.toSqlString(),
            obj.SecurityStamp.toSqlString(),
            obj.ConcurrencyStamp.toSqlString(),
            obj.PhoneNumber.toSqlString(),
            obj.PhoneNumberConfirmed.toSqlString(),
            obj.TwoFactorEnabled.toSqlString(),
            obj.LockoutEnd.toSqlString(),
            obj.LockoutEnabled.toSqlString(),
            obj.AccessFailedCount.toSqlString()
        ); ;
        return t.ToString();
    }

    public static string toSqlTableRow(this SCMSRole obj)
    {
        var t = (
            obj.Id.toSqlString(),
            obj.Name.toSqlString(),
            obj.NormalizedName.toSqlString(),
            obj.ConcurrencyStamp.toSqlString()
        ); ;
        return t.ToString();
    }

    public static string toSqlTableRow(this IdentityUserRole<string> obj)
    {
        var t = (
            obj.UserId.toSqlString(),
            obj.RoleId.toSqlString()
        ); ;
        return t.ToString();
    }

    public static string toSqlTableRow(this IdentityUserClaim<string> obj)
    {
        var t = (
            obj.Id.toSqlString(),
            obj.UserId.toSqlString(),
            obj.ClaimType.toSqlString(),
            obj.ClaimValue.toSqlString()
        ); ;
        return t.ToString();
    }

    public static string toSqlTableRow(this IdentityRoleClaim<string> obj)
    {
        var t = (
            obj.Id.toSqlString(),
            obj.RoleId.toSqlString(),
            obj.ClaimType.toSqlString(),
            obj.ClaimValue.toSqlString()
        ); ;
        return t.ToString();
    }

    public static string toSqlTableRow(this IdentityUserLogin<string> obj)
    {
        var t = (
            obj.LoginProvider.toSqlString(),
            obj.ProviderKey.toSqlString(),
            obj.ProviderDisplayName.toSqlString(),
            obj.UserId.toSqlString()
        ); ;
        return t.ToString();
    }

    public static string toSqlTableRow(this IdentityUserToken<string> obj)
    {
        var t = (
            obj.UserId.toSqlString(),
            obj.LoginProvider.toSqlString(),
            obj.Name.toSqlString(),
            obj.Value.toSqlString()
        ); ;
        return t.ToString();
    }
}
