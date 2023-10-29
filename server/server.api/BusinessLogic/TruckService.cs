﻿using Grpc.Core;

using Microsoft.AspNetCore.Identity;

using MySql.Data.MySqlClient;
using NuGet.Protocol.Plugins;

using server.api.DataAccess;
using server.api.DataAccess.SqlQueryExtensions;
using server.api.gRPC;
using server.api.Identity.Services;

using System.Configuration;

namespace server.api.BusinessLogic;

public class TruckService : Truck.TruckBase
{
    private readonly IDatabase database;

    public TruckService(IDatabase database)
    {
        this.database = database;
    }

    public async override Task<GetTruckReply> GetTrucks(GetTruckRequest request, ServerCallContext context)
    {

        var reply = new GetTruckReply();
        var sql = "SELECT * FROM trucks";
        var countSql = "SELECT COUNT(*) FROM trucks";

        switch (request.OneOfGetTruckRequestCase)
        {
            case GetTruckRequest.OneOfGetTruckRequestOneofCase.None:
                break;
            case GetTruckRequest.OneOfGetTruckRequestOneofCase.StoreId:
                sql += $" WHERE StoreId = {request.StoreId.toSqlString()}";
                countSql += $" WHERE StoreId = {request.StoreId.toSqlString()}";
                break;
            case GetTruckRequest.OneOfGetTruckRequestOneofCase.Id:
                sql += $" WHERE Id = {request.Id.toSqlString()}";
                countSql += $" WHERE Id = {request.Id.toSqlString()}";
                break;
            default:
                throw new ArgumentException("Unknown request type.");
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

        var trucks = await database.QueryAllAsync<TruckMessage>(sql);

        reply.Trucks.AddRange(trucks);

        reply.Count = (int)await database.ExecuteScalarAsync<long>(countSql);

        return reply;
    }


    public override async Task<TruckMessage> AddTruck(TruckMessage request, ServerCallContext context)
    {
        var reply = request;

        var sql = $"CALL insert_truck(" +
            $"{request.Capacity.toSqlString()}, " +
            $"{request.StoreId.toSqlString()})";


        var Id = await database.ExecuteScalarAsync<string>(sql);

        reply.Id = Id;

        return reply;
    }

    public override async Task<TruckMessage> EditTruck(TruckMessage request, ServerCallContext context)
    {
        var updateRequest = new TruckMessage(request);

        var t = typeof(TruckMessage);


        var sql = $"SELECT * from trucks WHERE Id = {request.Id.toSqlString()}";
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
            $"Capacity = {request.Capacity.toSqlString()}, " +
            $"StoreId = {request.StoreId.toSqlString()}" +
            $"WHERE Id = {request.Id.toSqlString()}";

        var result = await database.ExecuteAsync(sql);

        if (result == 1)
        {
            var sqlUpdated = $"SELECT * from trucks WHERE Id = {request.Id.toSqlString()}";
            return await database.QueryFirstAsync<TruckMessage>(sqlUpdated);
        }

        return null;
    }

    public override async Task<TruckMessage> RemoveTruck(TruckMessage request, ServerCallContext context)
    {
        var reply = new TruckMessage();

        var sql = $"SELECT * from trucks WHERE Id = {request.Id.toSqlString()}";

        reply = await database.QueryFirstAsync<TruckMessage>(sql);

        if (reply is null) return null;

        sql = $"DELETE FROM trucks WHERE Id = {request.Id.toSqlString()}";

        var result = await database.ExecuteAsync(sql);

        if (result != 1) return null;

        return reply;
    }
}
