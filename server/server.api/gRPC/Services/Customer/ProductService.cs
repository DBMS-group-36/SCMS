using Grpc.Core;

using Microsoft.AspNetCore.Identity;

using MySql.Data.MySqlClient;
using NuGet.Protocol.Plugins;

using server.api.DataAccess;
using server.api.DataAccess.SqlQueryExtensions;
using server.api.gRPC.Admin;
using server.api.gRPC.Customer;
using server.api.Identity.Services;

using System.Configuration;

namespace server.api.gRPC.Services.Customer;

public class ProductService : Product.ProductBase
{
    private readonly IDatabase database;

    public ProductService(IDatabase database)
    {
        this.database = database;
    }

    public async override Task<GetProductsReply> GetProducts(GetProductsRequest request, ServerCallContext context)
    {

        var reply = new GetProductsReply();
        var sql = "SELECT * FROM products";
        var countSql = "SELECT COUNT(*) FROM products";

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

        var products = await database.QueryAllAsync<ProductMessage>(sql);

        reply.Stores.AddRange(products);

        reply.Count = (int)await database.ExecuteScalarAsync<long>(countSql);

        return reply;
    }
}
