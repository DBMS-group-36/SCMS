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

public class TruckService : Truck.TruckBase
{
    private readonly IDatabase database;

    public TruckService(IDatabase database)
    {
        this.database = database;
    }

    public async override Task<GetTrucksReply> GetTrucks(GetTrucksRequest request, ServerCallContext context)
    {

        var reply = new GetTrucksReply();
        var sql = "SELECT * FROM trucks";
        var countSql = "SELECT COUNT(*) FROM trucks";
        Console.WriteLine(request.OneOfGetTruckRequestCase);
        switch (request.OneOfGetTruckRequestCase)
        {
            case GetTrucksRequest.OneOfGetTruckRequestOneofCase.None:
                break;
            case GetTrucksRequest.OneOfGetTruckRequestOneofCase.StoreId:
                sql += $" WHERE StoreId = {request.StoreId.ToSqlString()}";
                countSql += $" WHERE StoreId = {request.StoreId.ToSqlString()}";
                break;
            case GetTrucksRequest.OneOfGetTruckRequestOneofCase.Id:
                sql += $" WHERE Id = {request.Id.ToSqlString()}";
                countSql += $" WHERE Id = {request.Id.ToSqlString()}";
                break;
            default:
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Unknown request type."));
        }

        if (request.P is not null)
        {
            if (request.P.Limit < 1)
            {
                request.P.Limit = 20;
            }
            sql += $" LIMIT {request.P.Limit.ToSqlString()} OFFSET {request.P.Offset.ToSqlString()}";
        }

        else
        {
            sql += $" LIMIT {20.ToSqlString()} OFFSET {0.ToSqlString()}";
        }

        var trucks = await database.QueryAllAsync<TruckMessage>(sql);

        reply.Trucks.AddRange(trucks);

        reply.Count = await database.ExecuteScalarAsync<long>(countSql);

        return reply;
    }


    public override async Task<TruckMessage> AddTruck(TruckMessage request, ServerCallContext context)
    {
        var reply = request;

        var sql = $"CALL insert_truck(" +
            $"{request.Capacity.ToSqlString()}, " +
            $"{request.StoreId.ToSqlString()})";


        var Id = await database.ExecuteScalarAsync<ulong>(sql);

        reply.Id = Id;

        return reply;
    }

    public override async Task<TruckMessage> EditTruck(TruckMessage request, ServerCallContext context)
    {
        var updateRequest = new TruckMessage(request);

        var t = typeof(TruckMessage);


        var sql = $"SELECT * from trucks WHERE Id = {request.Id.ToSqlString()}";
        var existing = await database.QueryFirstAsync<TruckMessage>(sql);
        if (existing is null) return null;


        t.GetProperties().ToList().ForEach((p) =>
        {
            if (p.Name == "Parser" || p.Name == "Descriptor") return;
            if (p.GetValue(updateRequest) is null) p.SetValue(updateRequest, p.GetValue(existing));
        });

        return await UpdateTruck(updateRequest, context);
    }

    public override async Task<TruckMessage> UpdateTruck(TruckMessage request, ServerCallContext context)
    {

        var sql = $"UPDATE trucks SET " +
            $"Capacity = {request.Capacity.ToSqlString()}, " +
            $"StoreId = {request.StoreId.ToSqlString()}" +
            $"WHERE Id = {request.Id.ToSqlString()}";

        var result = await database.ExecuteAsync(sql);

        if (result == 1)
        {
            var sqlUpdated = $"SELECT * from trucks WHERE Id = {request.Id.ToSqlString()}";
            return await database.QueryFirstAsync<TruckMessage>(sqlUpdated);
        }

        return null;
    }

    public override async Task<TruckMessage> RemoveTruck(TruckMessage request, ServerCallContext context)
    {
        var sql = $"SELECT * from trucks WHERE Id = {request.Id.ToSqlString()}";
        var reply = await database.QueryFirstAsync<TruckMessage>(sql);
        if (reply is null) return null;

        sql = $"DELETE FROM trucks WHERE Id = {request.Id.ToSqlString()}";
        var result = await database.ExecuteAsync(sql);
        if (result != 1) return null;

        return reply;
    }
}
