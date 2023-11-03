﻿using Grpc.Core;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

using MySql.Data.MySqlClient;
using NuGet.Protocol.Plugins;

using server.api.DataAccess;
using server.api.DataAccess.SqlQueryExtensions;
using server.api.gRPC.Customer;
using server.api.Identity.Services;

using System.Configuration;

namespace server.api.gRPC.Services.Customer;


public class OrderService : Order.OrderBase
{
    private readonly IDatabase database;

    public OrderService(IDatabase database)
    {
        this.database = database;
    }

    public async override Task<GetOrdersReply> GetOrders(GetOrdersRequest request, ServerCallContext context)
    {
     
        var reply = new GetOrdersReply();
         


var sql = $"SELECT routeId, deliveryDate, orderDate, deliveryAddressId, orderCapacity, price, storeId, Id,Status FROM orders ";
var countSql = $"SELECT COUNT(*) FROM orders ";

        if (request.UserName != "")
        {
            Console.WriteLine("user");
            Console.WriteLine(request.UserName);
            var getUserIdQuery = $"SELECT Id FROM users WHERE UserName = {request.UserName.ToSqlString()} ;";
            int userId = await database.ExecuteScalarAsync<int>(getUserIdQuery);
                    Console.WriteLine("user");
        Console.WriteLine(userId);
            sql += $" JOIN user_order ON orders.Id = user_order.orderId WHERE userId = {userId} ORDER BY orders.Id DESC";
            countSql += $" JOIN user_order ON orders.Id = user_order.orderId WHERE userId = {userId}";
        }
    
        else if (request.StoreId != 0 && request.RouteId == 0)

        {
                    Console.WriteLine("store");
        Console.WriteLine(request.StoreId);
            sql += $" WHERE StoreId = {request.StoreId.ToSqlString()} ORDER BY orders.Id DESC";
            countSql += $" WHERE StoreId = {request.StoreId.ToSqlString()}";
        }

        else if(request.StoreId != 0 && request.RouteId != 0){
            sql += $" WHERE StoreId = {request.StoreId.ToSqlString()} AND RouteId = {request.RouteId.ToSqlString()} ORDER BY orders.Id DESC";
            countSql += $" WHERE StoreId = {request.StoreId.ToSqlString()} AND RouteId = {request.RouteId.ToSqlString()}";
            Console.WriteLine(sql);
        } else if(request.Status != ""){
            sql += $" WHERE Status ={request.Status.ToSqlString()} ORDER BY orders.Id DESC";
            countSql += $" WHERE Status ={request.Status.ToSqlString()}";
            Console.WriteLine(sql);
        }

        // {
        //     sql += $" AND Status = {request.StoreId.ToSqlString()} ORDER BY orders.Id DESC";
        //     countSql += $" AND Status = {request.StoreId.ToSqlString()}";
        // }

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
            sql += $" LIMIT {40.ToSqlString()} OFFSET {0.ToSqlString()}";
        }

        var orders = await database.QueryAllAsync<OrderMessage>(sql);

        reply.Orders.AddRange(orders);

        reply.Count = await database.ExecuteScalarAsync<long>(countSql);

        return reply;
    }
    public async override Task<PlaceOrderReply> PlaceOrder(PlaceOrderRequest request, ServerCallContext context)
    {

        Console.WriteLine(request);
        await database.QueryAllAsync<ListedProductMessage>("start transaction;");
        Console.WriteLine("user");
        Console.WriteLine(request.UserName);
        var reply = new PlaceOrderReply();



        var sql = $"INSERT INTO orders (OrderDate, DeliveryDate, DeliveryAddressId, RouteId, OrderCapacity,  price, StoreId) VALUES ({request.OrderDate.ToSqlString()}, {request.DeliveryDate.ToSqlString()}, {request.DeliveryAddressId.ToSqlString()}, {request.RouteId}, {request.OrderCapacity}, {request.Price}, {request.StoreId});";




         await database.QueryAllAsync<ListedProductMessage>(sql);

        reply.OrderId = await database.ExecuteScalarAsync<ulong>("SELECT LAST_INSERT_ID();");

        foreach (OrderItem i in request.OrderItems)
        {
            sql = $"INSERT INTO order_products (OrderId, ProductId, Quantity,UnitPrice) VALUES ({reply.OrderId}, {i.ItemId}, {i.Quantity}, {i.UnitPrice});";
             await database.QueryAllAsync<ListedProductMessage>(sql);
        }
         var getUserIdQuery = $"SELECT Id FROM users WHERE UserName = {request.UserName.ToSqlString()};";
    int userId = await database.ExecuteScalarAsync<int>(getUserIdQuery);
     sql = $"INSERT INTO user_order (userId, orderId) VALUES ({userId}, {reply.OrderId});";
        await database.QueryAllAsync<ListedProductMessage>(sql);
        await database.QueryAllAsync<ListedProductMessage>("commit;");
        return reply;
    }
        public async override Task<UpdateOrderReply> UpdateOrder(UpdateOrderRequest request, ServerCallContext context)
    {
        Console.WriteLine(request);
        var reply = new UpdateOrderReply();
        return reply;
    }
}