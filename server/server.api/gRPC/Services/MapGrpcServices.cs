namespace server.api.gRPC.Services;

public static class MapSCMSGrpcServicesExtension
{
    public static void MapSCMSGrpcServices(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGrpcService<Authentication.AuthService>().RequireCors("AllowAll");
        endpoints.MapGrpcService<Admin.TruckService>().RequireCors("AllowAll");
        endpoints.MapGrpcService<Admin.StoreService>().RequireCors("AllowAll");
        endpoints.MapGrpcService<Admin.ProductService>().RequireCors("AllowAll");
        endpoints.MapGrpcService<Customer.ProductService>().RequireCors("AllowAll");
        endpoints.MapGrpcService<Customer.OrderService>().RequireCors("AllowAll");
        endpoints.MapGrpcService<Customer.RouteService>().RequireCors("AllowAll");
    }
}
