using Grpc.Core;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

using MySql.Data.MySqlClient;
using NuGet.Protocol.Plugins;

using server.api.DataAccess;
using server.api.DataAccess.SqlQueryExtensions;
using server.api.gRPC.Customer;
using server.api.Identity.Services;

using System.Configuration;
using System.Runtime.CompilerServices;
using System.Security.Claims;

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
        var sql = "SELECT * FROM orders";
        var countSql = "SELECT COUNT(*) FROM orders";


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

        var orders = await database.QueryAllAsync<OrderMessage>(sql);

        reply.Orders.AddRange(orders);

        reply.Count = await database.ExecuteScalarAsync<long>(countSql);

        return reply;
    }

    public async override Task<OrderMessage> PlaceOrder(PlaceOrderRequest request, ServerCallContext context)
    {
        if (!OrderAvailable(request.OrderProducts))
            throw new RpcException(new Status(StatusCode.Aborted, "Order items are not available."));

        OrderMessage reply;

        ulong deliveryAddressId = 0;

        ulong customerId = ulong.Parse(context.GetHttpContext().User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

        switch (request.OneOfDeliveryAddressOrIdCase)
        {
            case PlaceOrderRequest.OneOfDeliveryAddressOrIdOneofCase.None:
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Provide deiveryAddress or deliveryAddressId ."));
            case PlaceOrderRequest.OneOfDeliveryAddressOrIdOneofCase.DeliveryAddressId:
                deliveryAddressId = request.DeliveryAddressId; 
                break;
            case PlaceOrderRequest.OneOfDeliveryAddressOrIdOneofCase.DeliveryAddress:
                var deliveryAddressSql = "CALL insert_delivery_address(@CustomerId, @AddressLine1, @AddressLine2, @Province, @PostalCode)";
                var deliveryAddressParameters = new Dictionary<string, object>();
                deliveryAddressParameters["@CustomerId"] = customerId;
                deliveryAddressParameters["@AddressLine1"] = request.DeliveryAddress.AddressLine1;
                deliveryAddressParameters["@AddressLine2"] = request.DeliveryAddress.AddressLine2;
                deliveryAddressParameters["@Province"] = request.DeliveryAddress.Province;
                deliveryAddressParameters["@PostalCode"] = request.DeliveryAddress.PostalCode;
                deliveryAddressId = await database.ExecuteScalarAsync<ulong>(deliveryAddressSql, deliveryAddressParameters);
                break;
            default:
                throw new RpcException(new Status(StatusCode.Unknown, "Unknown request type."));
        }

        await database.BeginTransactionAsync();

        try
        {
            var orderSql = "CALL insert_order(@DeliveryDate, @DeliveryAddressId, @RouteId)";
            var orderParameters = new Dictionary<string, object>();

            orderParameters["@DeliveryDate"] = request.DeliveryDate.ToDateTime();
            orderParameters["@DeliveryAddressId"] = request.DeliveryAddressId;
            orderParameters["@RouteId"] = request.RouteId;

            var orderId = await database.ExecuteScalarAsync<ulong>(orderSql, orderParameters);

            var itemSql = "CALL insert_order_product(@OrderId, @ProductId, @Quantity)";
            var itemParameters = new Dictionary<string, object>();
            itemParameters["@OrderId"] = orderId;

            foreach (var item in request.OrderProducts)
            {
                itemParameters["@ProductId"] = item.ProductId;
                itemParameters["@Quantity"] = item.Quantity;

                var orderProductId = await database.ExecuteScalarAsync<ulong>(itemSql, itemParameters);
            }

            reply = new OrderMessage()
            {
                Id = orderId,
                DeliveryAddressId = deliveryAddressId,
                RouteId = request.RouteId,
                DeliveryDate = request.DeliveryDate,
                Status = "",
                OrderDate = request.DeliveryDate,
                Price = "10.00"
            };

            await database.CommitAsync();
        }
        catch (Exception)
        {
            await database.RollbackAsync();
            throw new RpcException(new Status(StatusCode.Aborted, "Order was not placed due to an error.")); ;
        }

        return reply;

    }

    public override Task<OrderMessage> CancelOrder(CancelOrderRequest request, ServerCallContext context)
    {
        return base.CancelOrder(request, context);
    }

    private static bool OrderAvailable(IEnumerable<OrderProduct> orderItems)
    {
        return true;
    }
}
