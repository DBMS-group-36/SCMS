namespace server.api.DataAccess;

public interface IDatabase
{
    public Task<IEnumerable<T>> QueryAllAsync<T>(string sql, params object[] args);
    public Task<T> QueryFirstAsync<T>(string sql, params object[] args);
    public Task<int> ExecuteAsync(string sql, params object[] args);
    public Task<T> ExecuteScalarAsync<T>(string sql, params object[] args);
}
