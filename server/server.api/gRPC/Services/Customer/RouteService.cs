using Grpc.Core;

using Microsoft.AspNetCore.Identity;

using MySql.Data.MySqlClient;
using NuGet.Protocol.Plugins;

using server.api.DataAccess;
using server.api.DataAccess.SqlQueryExtensions;
using server.api.gRPC.Customer;
using server.api.Identity.Services;

using System.Configuration;

using Route = server.api.gRPC.Customer.Route;

namespace server.api.gRPC.Services.Customer;

public class RouteService : Route.RouteBase
{
    private readonly IDatabase database;

    public RouteService(IDatabase database)
    {
        this.database = database;
    }

    public async override Task<GetRoutesReply> GetDeliveryRoutes(GetRoutesRequest request, ServerCallContext context)
    {

        var reply = new GetRoutesReply();
        var sql = "SELECT * FROM routes";
        var countSql = "SELECT COUNT(*) FROM routes";
        // check here
        Console.WriteLine(request);
       
            sql += $" WHERE StoreId = {request.StoreId.ToSqlString()}";
            Console.WriteLine(sql);
            countSql += $" WHERE StoreId = {request.StoreId.ToSqlString()}";
//         sql += $" WHERE StoreId = 61";
// countSql += $" WHERE StoreId = 61";
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

        var products = await database.QueryAllAsync<RouteMessage>(sql);
        
        reply.Routes.AddRange(products);
        Console.WriteLine(reply.Routes);
        reply.Count = await database.ExecuteScalarAsync<long>(countSql);

        return reply;
    }



    public async override Task<GetDriversReply> GetDrivers(GetDriversRequest request, ServerCallContext context)
    {
        var sql = "";
        var countSql = "";
        var reply = new GetDriversReply();
        Console.WriteLine("driver");
        Console.WriteLine(request.StoreId);
        if(request.Type == 1){
             sql = $"SELECT EmployeeId,WorkHours,StoreId FROM drivers WHERE StoreId = {request.StoreId} ORDER BY WorkHours DESC";
                   countSql = $"SELECT COUNT(*) FROM drivers WHERE StoreId = {request.StoreId}";
        }else{
                     sql = $"SELECT EmployeeId,WorkHours,StoreId FROM driver_assisstants WHERE StoreId = {request.StoreId} ORDER BY WorkHours ASC";
                 countSql = $"SELECT COUNT(*) FROM driver_assisstants WHERE StoreId = {request.StoreId}";
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

        var drivers = await database.QueryAllAsync<ListedDriverMessage>(sql);
        
        reply.Drivers.AddRange(drivers);

        reply.Count = await database.ExecuteScalarAsync<long>(countSql);

        return reply;
    }
}
