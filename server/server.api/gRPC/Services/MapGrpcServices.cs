namespace server.api.gRPC.Services;

public static class MapSCMSGrpcServicesExtension
{
    public static void MapSCMSGrpcServices(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGrpcService<Authentication.AuthService>();
        endpoints.MapGrpcService<Admin.TruckService>();
        endpoints.MapGrpcService<Admin.StoreService>();
        endpoints.MapGrpcService<Admin.ProductService>();
        endpoints.MapGrpcService<Customer.ProductService>();
        endpoints.MapGrpcService<Customer.OrderService>();
    }
}
