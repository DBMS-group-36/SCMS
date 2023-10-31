using Microsoft.AspNetCore.Identity;

using server.api.Identity;

namespace server.api.DataAccess.SqlQueryExtensions;

public static class ToSqlTableRowExtensions
{
    public static string ToSqlTableRow(this SCMSUser obj)
    {
        var t = (
            obj.Id.ToSqlString(),
            obj.UserName.ToSqlString(),
            obj.NormalizedUserName.ToSqlString(),
            obj.Email.ToSqlString(),
            obj.NormalizedEmail.ToSqlString(),
            obj.EmailConfirmed.ToSqlString(),
            obj.PasswordHash.ToSqlString(),
            obj.SecurityStamp.ToSqlString(),
            obj.ConcurrencyStamp.ToSqlString(),
            obj.PhoneNumber.ToSqlString(),
            obj.PhoneNumberConfirmed.ToSqlString(),
            obj.TwoFactorEnabled.ToSqlString(),
            obj.LockoutEnd.ToSqlString(),
            obj.LockoutEnabled.ToSqlString(),
            obj.AccessFailedCount.ToSqlString()
        ); ;
        return t.ToString();
    }

    public static string ToSqlTableRow(this SCMSRole obj)
    {
        var t = (
            obj.Id.ToSqlString(),
            obj.Name.ToSqlString(),
            obj.NormalizedName.ToSqlString(),
            obj.ConcurrencyStamp.ToSqlString()
        ); ;
        return t.ToString();
    }

    public static string ToSqlTableRow(this IdentityUserRole<string> obj)
    {
        var t = (
            obj.UserId.ToSqlString(),
            obj.RoleId.ToSqlString()
        ); ;
        return t.ToString();
    }

    public static string ToSqlTableRow(this IdentityUserClaim<string> obj)
    {
        var t = (
            obj.Id.ToSqlString(),
            obj.UserId.ToSqlString(),
            obj.ClaimType.ToSqlString(),
            obj.ClaimValue.ToSqlString()
        ); ;
        return t.ToString();
    }

    public static string ToSqlTableRow(this IdentityRoleClaim<string> obj)
    {
        var t = (
            obj.Id.ToSqlString(),
            obj.RoleId.ToSqlString(),
            obj.ClaimType.ToSqlString(),
            obj.ClaimValue.ToSqlString()
        ); ;
        return t.ToString();
    }

    public static string ToSqlTableRow(this IdentityUserLogin<string> obj)
    {
        var t = (
            obj.LoginProvider.ToSqlString(),
            obj.ProviderKey.ToSqlString(),
            obj.ProviderDisplayName.ToSqlString(),
            obj.UserId.ToSqlString()
        ); ;
        return t.ToString();
    }

    public static string ToSqlTableRow(this IdentityUserToken<string> obj)
    {
        var t = (
            obj.UserId.ToSqlString(),
            obj.LoginProvider.ToSqlString(),
            obj.Name.ToSqlString(),
            obj.Value.ToSqlString()
        ); ;
        return t.ToString();
    }
}
