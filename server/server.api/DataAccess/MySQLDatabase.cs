using MySql.Data.MySqlClient;

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

    public async Task<T> ExecuteScalarAsync<T> (string sql, params object[] args)
    {
        T result = default(T);

        var command = new MySqlCommand(sql, connection);
        command.Parameters.AddRange(args);

        result = (T)await command.ExecuteScalarAsync();

        return result;
    }


    public async Task<IEnumerable<T>> QueryAllAsync<T>(string sql, params object[] args)
    {
        var t = typeof(T);
        var result = new List<T>();

        var command = new MySqlCommand(sql, connection);
        command.Parameters.AddRange(args);
        using var reader = await command.ExecuteReaderAsync();


        while (await reader.ReadAsync())
        {
            var item = (T)Activator.CreateInstance(t);
            t.GetProperties().ToList().ForEach((p) =>
            {
                if (p.Name == "Parser" || p.Name == "Descriptor") return;
                var val = reader[p.Name];
                if (val is not DBNull) p.SetValue(item, val);
            });

            result.Add(item);
        }

        return result;
    }

    public async Task<T> QueryFirstAsync<T>(string sql, params object[] args)
    {
        var t = typeof(T);
        var result = default(T);

        var command = new MySqlCommand(sql, connection);
        command.Parameters.AddRange(args);
        using var reader = await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            var item = (T)Activator.CreateInstance(t);

            t.GetProperties().ToList().ForEach((p) =>
            {
                if (p.Name == "Parser" || p.Name == "Descriptor") return;
                var val = reader[p.Name];
                if (val is not DBNull) p.SetValue(item, val);
            });

            result = item;
        }

        return result;
    }

    public async Task<int> ExecuteAsync(string sql, params object[] args)
    {
        var command = new MySqlCommand(sql, connection);
        return await command.ExecuteNonQueryAsync();
    }

    ~MySQLDatabase()
    {
        connection.Close();
    }
}
