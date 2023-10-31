using Microsoft.CodeAnalysis.CSharp.Syntax;

using MySql.Data.MySqlClient;

using System.Data;
using System.Data.Common;

namespace server.api.DataAccess;

public class MySQLDatabase : IDatabase
{
    private readonly string connectionString;

    public readonly MySqlConnection connection;

    public MySQLDatabase(IConfiguration configuration)
    {
        connectionString = configuration.GetConnectionString("DefaulConnection");
        connection = new MySqlConnection(connectionString);
        connection.Open();
    }

    public async Task<T> ExecuteScalarAsync<T> (string sql, IDictionary<string, object> parameters = null)
    {
        return (T)await CreateCommand(sql, parameters).ExecuteScalarAsync();
    }


    public async Task<IEnumerable<T>> QueryAllAsync<T>(string sql, IDictionary<string, object> parameters = null)
    {
        var result = new List<T>();
        using var reader = await CreateCommand(sql, parameters).ExecuteReaderAsync();
        while (await reader.ReadAsync()) result.Add(ReadRowToObject<T>(reader));
        return result;
    }

    public async Task<T> QueryFirstAsync<T>(string sql, IDictionary<string, object> parameters = null)
    {
        using var reader = await CreateCommand(sql, parameters).ExecuteReaderAsync();
        if (await reader.ReadAsync()) return ReadRowToObject<T>(reader);
        return default;
    }

    public async Task<int> ExecuteAsync(string sql, IDictionary<string, object> parameters = null)
    {
        return await CreateCommand(sql, parameters).ExecuteNonQueryAsync();
    }

    private DbCommand CreateCommand(string sql, IDictionary<string, object> parameters = null)
    {
        var command = new MySqlCommand(sql, connection);
        if(parameters is not null)
            foreach (var param in parameters) 
                command.Parameters.AddWithValue(param.Key, param.Value);
        return command;
    }

    private static T ReadRowToObject<T>(IDataReader reader)
    {
        var t = typeof(T);
        var item = (T)Activator.CreateInstance(t);
        t.GetProperties().ToList().ForEach((p) =>
        {
            if (p.Name == "Parser" || p.Name == "Descriptor") return;
            var val = reader[p.Name];
            if (val is DBNull) return;
            if (p.PropertyType == typeof(ulong)) val = Convert.ToUInt64(val);
            if (p.PropertyType == typeof(string)) val = val.ToString();
            p.SetValue(item, val);
        });

        return item;
    }

    ~MySQLDatabase()
    {
        connection.Close();
    }
}
