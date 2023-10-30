using Grpc.Core;

using Microsoft.AspNetCore.Identity;

using MySql.Data.MySqlClient;
using NuGet.Protocol.Plugins;

using server.api.DataAccess;
using server.api.DataAccess.SqlQueryExtensions;
using server.api.gRPC;
using server.api.Identity.Services;

using System.Configuration;

namespace server.api.BusinessLogic;

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
        var countSql = "SELECT COUNT(*) FROM stores";

        if (!string.IsNullOrEmpty(request.Id))
        {
            sql += $" WHERE Id = {request.Id.toSqlString()}";
            countSql += $" WHERE Id = {request.Id.toSqlString()}";
        }

        if (request.P is not null)
        {
            if (request.P.Limit < 1)
            {
                request.P.Limit = 20;
            }
            sql += $" LIMIT {request.P.Limit.toSqlString()} OFFSET {request.P.Offset.toSqlString()}";
        }

        else
        {
            sql += $" LIMIT {20.toSqlString()} OFFSET {0.toSqlString()}";
        }

        var stores = await database.QueryAllAsync<StoreMessage>(sql);

        reply.Stores.AddRange(stores);

        reply.Count = (int)await database.ExecuteScalarAsync<long>(countSql);

        return reply;
    }


    public override async Task<StoreMessage> AddStore(StoreMessage request, ServerCallContext context)
    {
        var reply = request;

        var sql = $"CALL insert_store(" +
            $"{request.City.toSqlString()}, " +
            $"{request.Capacity.toSqlString()})";


        var Id = await database.ExecuteScalarAsync<string>(sql);

        reply.Id = Id;

        return reply;
    }

    public override async Task<StoreMessage> EditStore(StoreMessage request, ServerCallContext context)
    {
        var updateRequest = new StoreMessage(request);

        var t = typeof(StoreMessage);


        var sql = $"SELECT * from stores WHERE Id = {request.Id.toSqlString()}";
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
            $"Capacity = {request.Capacity.toSqlString()}, " +
            $"City = {request.City.toSqlString()}" +
            $"WHERE Id = {request.Id.toSqlString()}";

        var result = await database.ExecuteAsync(sql);

        if (result == 1)
        {
            var sqlUpdated = $"SELECT * from stores WHERE Id = {request.Id.toSqlString()}";
            return await database.QueryFirstAsync<StoreMessage>(sqlUpdated);
        }

        return null;
    }

    public override async Task<StoreMessage> RemoveStore(StoreMessage request, ServerCallContext context)
    {
        var reply = new StoreMessage();

        var sql = $"SELECT * from stores WHERE Id = {request.Id.toSqlString()}";

        reply = await database.QueryFirstAsync<StoreMessage>(sql);

        if (reply is null) return null;

        sql = $"DELETE FROM stores WHERE Id = {request.Id.toSqlString()}";

        var result = await database.ExecuteAsync(sql);

        if (result != 1) return null;

        return reply;
    }
}
