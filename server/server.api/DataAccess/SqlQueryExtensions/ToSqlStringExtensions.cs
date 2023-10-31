using System.Text.RegularExpressions;

namespace server.api.DataAccess.SqlQueryExtensions;

public static partial class ToSqlStringExtensions
{
    public static string ToSqlString(this string s)
    {
        if (s == null) return "null";
        var ret = MyRegex1().Replace(s, @"\\");
        ret = MyRegex2().Replace(ret, @"\'");
        return $"'{ret}'";
    }

    public static string ToSqlString(this int? i)
    {
        if (i == null) return "null";
        return i.ToString();
    }

    public static string ToSqlString(this int i)
    {
        return i.ToString();
    }

    public static string ToSqlString(this long? i)
    {
        if (i == null) return "null";
        return i.ToString();
    }

    public static string ToSqlString(this long i)
    {
        return i.ToString();
    }

    public static string ToSqlString(this uint? i)
    {
        if (i == null) return "null";
        return i.ToString();
    }

    public static string ToSqlString(this uint i)
    {
        return i.ToString();
    }

    public static string ToSqlString(this ulong? i)
    {
        if (i == null) return "null";
        return i.ToString();
    }

    public static string ToSqlString(this ulong i)
    {
        return i.ToString();
    }

    public static string ToSqlString(this bool? b)
    {
        if (b == null) return "null";
        return b.ToString();
    }

    public static string ToSqlString(this bool b)
    {
        return b.ToString();
    }

    public static string ToSqlString(this DateTimeOffset? d)
    {
        if (d == null) return "null";
        return d.Value.ToString("'yyyy-MM-dd HH-mm-ss'");
    }

    [GeneratedRegex("\\\\")]
    private static partial Regex MyRegex1();
    [GeneratedRegex("'")]
    private static partial Regex MyRegex2();
}
