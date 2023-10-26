using System.Text.RegularExpressions;

namespace server.api.DataAccess.SqlQueryExtensions;

public static class ToSqlString
{
    public static string toSqlString(this string s)
    {
        if (s == null) return "null";
        var ret = Regex.Replace(s, @"\\", @"\\");
        ret = Regex.Replace(ret, @"'", @"\'");
        return $"'{ret}'";
    }

    public static string toSqlString(this int? i)
    {
        if (i == null) return "null";
        return i.ToString();
    }

    public static string toSqlString(this int i)
    {
        return i.ToString();
    }

    public static string toSqlString(this bool? b)
    {
        if (b == null) return "null";
        return b.ToString();
    }

    public static string toSqlString(this bool b)
    {
        return b.ToString();
    }

    public static string toSqlString(this DateTimeOffset? d)
    {
        if (d == null) return "null";
        return d.Value.ToString("'yyyy-MM-dd HH-mm-ss'");
    }
}
