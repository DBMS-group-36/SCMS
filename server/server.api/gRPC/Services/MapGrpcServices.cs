namespace server.api.gRPC.Services;

public static class MapSCMSGrpcServicesExtension
{
    public static void MapSCMSGrpcServices(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGrpcService<Authentication.AuthService>()
            .EnableGrpcWeb()
            .RequireCors("AllowAll");
        endpoints.MapGrpcService<Admin.TruckService>()
            .EnableGrpcWeb()
            .RequireCors("AllowAll");
        endpoints.MapGrpcService<Admin.StoreService>()
            .EnableGrpcWeb()
            .RequireCors("AllowAll");
        endpoints.MapGrpcService<Customer.ProductService>()
            .EnableGrpcWeb()
            .RequireCors("AllowAll");
    }
}
