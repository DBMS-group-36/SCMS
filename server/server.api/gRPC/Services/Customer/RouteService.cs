using Grpc.Core;

using Microsoft.AspNetCore.Identity;

using MySql.Data.MySqlClient;
using NuGet.Protocol.Plugins;

using server.api.DataAccess;
using server.api.DataAccess.SqlQueryExtensions;
using server.api.gRPC.Customer;
using server.api.Identity.Services;

using System.Configuration;

namespace server.api.gRPC.Services.Customer;

public class RouteService : Route.RouteBase
{
    private readonly IDatabase database;

    public RouteService(IDatabase database)
    {
        this.database = database;
    }

    public async override Task<GetRoutesReply> GetRoutes(GetRoutesRequest request, ServerCallContext context)
    {

        var reply = new GetRoutesReply();
        var sql = "SELECT * FROM routes";
        var countSql = "SELECT COUNT(*) FROM routes";

        if (request.Id != 0)
        {
            sql += $" WHERE StoreId = {request.Id.ToSqlString()}";
            countSql += $" WHERE StoreId = {request.Id.ToSqlString()}";
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

        var routes = await database.QueryAllAsync<RouteMessage>(sql);

        reply.Routes.AddRange(products);

        reply.Count = await database.ExecuteScalarAsync<long>(countSql);

        return reply;
    }
}
