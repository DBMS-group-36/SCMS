namespace server.api.DataAccess;

public interface IDatabase
{
    public Task<IEnumerable<T>> QueryAllAsync<T>(string sql, IDictionary<string, object> parameters = null);
    public Task<T> QueryFirstAsync<T>(string sql, IDictionary<string, object> parameters = null);
    public Task<int> ExecuteAsync(string sql, IDictionary<string, object> parameters = null);
    public Task<T> ExecuteScalarAsync<T>(string sql, IDictionary<string, object> parameters = null);
    Task BeginTransactionAsync();
    Task CommitAsync();
    Task RollbackAsync();
}
