using Grpc.Core;

using Microsoft.AspNetCore.Identity;

using MySql.Data.MySqlClient;
using NuGet.Protocol.Plugins;

using server.api.DataAccess;
using server.api.DataAccess.SqlQueryExtensions;
using server.api.gRPC.Admin;
using server.api.Identity.Services;

using System.Configuration;

namespace server.api.gRPC.Services.Admin;

public class StoreService : Store.StoreBase
{
    private readonly IDatabase database;

    public StoreService(IDatabase database)
    {
        this.database = database;
    }

    public async override Task<GetStoresReply> GetStores(GetStoresRequest request, ServerCallContext context)
    {

        var reply = new GetStoresReply();
        var sql = "SELECT * FROM stores";
        var parameters = new Dictionary<string, object>();
        var countSql = "SELECT COUNT(*) FROM stores";
        Console.WriteLine(request.Id);
        if (request.Id != 0)
        {
            sql += $" WHERE Id = @Id";
            parameters.Add("@Id", request.Id.ToSqlString());
            countSql += $" WHERE Id = {request.Id.ToSqlString()}";
        }
        Console.WriteLine(sql);
        if (request.P is not null)
        {
            if (request.P.Limit < 1)
            {
                request.P.Limit = 200;
            }
            sql += $" LIMIT {request.P.Limit.ToSqlString()} OFFSET {request.P.Offset.ToSqlString()}";
        }

        else
        {
            sql += $" LIMIT {20.ToSqlString()} OFFSET {0.ToSqlString()}";
        }

        var stores = await database.QueryAllAsync<StoreMessage>(sql, parameters);

        reply.Stores.AddRange(stores);

        reply.Count = await database.ExecuteScalarAsync<long>(countSql);

        return reply;
    }


    public override async Task<StoreMessage> AddStore(StoreMessage request, ServerCallContext context)
    {
        var reply = request;

        var sql = $"CALL insert_store(" +
            $"{request.City.ToSqlString()}, " +
            $"{request.Capacity.ToSqlString()})";

        MySqlParameter[] parameters = new MySqlParameter[]
            {
                new("@City", request.City),
                new("@Capacity", request.Capacity)
            };

        reply.Id = await database.ExecuteScalarAsync<ulong>(sql);

        return reply;
    }

    public override async Task<StoreMessage> EditStore(StoreMessage request, ServerCallContext context)
    {
        var updateRequest = new StoreMessage(request);

        var t = typeof(StoreMessage);


        var sql = $"SELECT * from stores WHERE Id = {request.Id.ToSqlString()}";
        var existing = await database.QueryFirstAsync<StoreMessage>(sql);
        if (existing is null) return null;


        t.GetProperties().ToList().ForEach((p) =>
        {
            if (p.Name == "Parser" || p.Name == "Descriptor") return;
            if (p.GetValue(updateRequest) is null) p.SetValue(updateRequest, p.GetValue(existing));
        });

        return await UpdateStore(updateRequest, context);
    }

    public override async Task<StoreMessage> UpdateStore(StoreMessage request, ServerCallContext context)
    {

        var sql = $"UPDATE stores SET " +
            $"Capacity = {request.Capacity.ToSqlString()}, " +
            $"City = {request.City.ToSqlString()}" +
            $"WHERE Id = {request.Id.ToSqlString()}";

        var result = await database.ExecuteAsync(sql);

        if (result == 1)
        {
            var sqlUpdated = $"SELECT * from stores WHERE Id = {request.Id.ToSqlString()}";
            return await database.QueryFirstAsync<StoreMessage>(sqlUpdated);
        }

        return null;
    }

    public override async Task<StoreMessage> RemoveStore(StoreMessage request, ServerCallContext context)
    {
        var sql = $"SELECT * from stores WHERE Id = {request.Id.ToSqlString()}";

        var reply = await database.QueryFirstAsync<StoreMessage>(sql);

        if (reply is null) return null;

        sql = $"DELETE FROM stores WHERE Id = {request.Id.ToSqlString()}";

        var result = await database.ExecuteAsync(sql);

        if (result != 1) return null;

        return reply;
    }
}
