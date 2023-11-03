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

public class ProductService : Product.ProductBase
{
    private readonly IDatabase database;

    public ProductService(IDatabase database)
    {
        this.database = database;
    }

    public async override Task<GetProductsReply> GetProducts(GetProductsRequest request, ServerCallContext context)
    {
        Console.WriteLine("fuck");
        var reply = new GetProductsReply();
        var sql = "SELECT * FROM products";
        var countSql = "SELECT COUNT(*) FROM products";
   
        if (request.Id != 0)
        {
            sql += $" WHERE Id = {request.Id.ToSqlString()}";
            countSql += $" WHERE Id = {request.Id.ToSqlString()}";
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

        var products = await database.QueryAllAsync<ProductMessage>(sql);

        reply.Products.AddRange(products);

        reply.Count = await database.ExecuteScalarAsync<long>(countSql);

        return reply;
    }


    public override async Task<ProductMessage> AddProduct(ProductMessage request, ServerCallContext context)
    {
        var reply = request;

        var sql = $"CALL insert_product(" +
            $"{request.Name.ToSqlString()}, " +
            $"{request.Price.ToSqlString()}, " +
            $"{request.CapacityPerUnit.ToSqlString()}, " +
            $"{request.Listed.ToSqlString()}, " +
            $"{request.ImgUrl.ToSqlString()})";


        var Id = await database.ExecuteScalarAsync<ulong>(sql);

        reply.Id = Id;

        return reply;
    }

    public override async Task<ProductMessage> EditProduct(ProductMessage request, ServerCallContext context)
    {
        var updateRequest = new ProductMessage(request);

        var t = typeof(ProductMessage);


        var sql = $"SELECT * from products WHERE Id = {request.Id.ToSqlString()}";
        var existing = await database.QueryFirstAsync<ProductMessage>(sql);
        if (existing is null) return null;


        t.GetProperties().ToList().ForEach((p) =>
        {
            if (p.Name == "Parser" || p.Name == "Descriptor") return;
            if (p.GetValue(updateRequest) is null) p.SetValue(updateRequest, p.GetValue(existing));
        });

        return await UpdateProduct(updateRequest, context);
    }

    public override async Task<ProductMessage> UpdateProduct(ProductMessage request, ServerCallContext context)
    {

        var sql = $"UPDATE products SET " +
            $"Name = {request.Name.ToSqlString()}" +
            $"Price = {request.Price.ToSqlString()}" +
            $"CapacityPerUnit = {request.CapacityPerUnit.ToSqlString()}, " +
            $"Listed = {request.Listed.ToSqlString()}, " +
            $"ImgUrl = {request.ImgUrl.ToSqlString()}, " +
            $"WHERE Id = {request.Id.ToSqlString()}";

        var result = await database.ExecuteAsync(sql);

        if (result == 1)
        {
            var sqlUpdated = $"SELECT * from products WHERE Id = {request.Id.ToSqlString()}";
            return await database.QueryFirstAsync<ProductMessage>(sqlUpdated);
        }

        return null;
    }

    public override async Task<ProductMessage> RemoveProduct(ProductMessage request, ServerCallContext context)
    {

        var sql = $"SELECT * from products WHERE Id = {request.Id.ToSqlString()}";

        var reply = await database.QueryFirstAsync<ProductMessage>(sql);

        if (reply is null) return null;

        sql = $"DELETE FROM products WHERE Id = {request.Id.ToSqlString()}";

        var result = await database.ExecuteAsync(sql);

        if (result != 1) return null;

        return reply;
    }
}
