using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

using server.api.Identity;
using server.api.Identity.SCMSRoleStore;
using server.api.Identity.SCMSUserStore;
using server.api.DataAccess;

using System.Text;
using server.api.Identity.Services;
using server.api.gRPC.Services;
using server.api.BusinessLogic;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container.
builder.Services.AddScoped<IDatabase, MySQLDatabase>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddTransient<IUserStore<SCMSUser>, SCMSUserStore>();
builder.Services.AddTransient<IRoleStore<SCMSRole>, SCMSRoleStore>();
builder.Services.AddTransient<IEmailSender, SendGridEmailSender>();

builder.Services.AddIdentity<SCMSUser, SCMSRole>(options =>
{
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 5;
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
}).AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = configuration["JWT:Audience"],
        ValidIssuer = configuration["JWT:Issuer"],
        RequireExpirationTime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Key"])),
        ValidateIssuerSigningKey = true,
    };
});

builder.Services.AddAuthorization();
//builder.Services.AddControllers();
builder.Services.AddGrpc().AddJsonTranscoding();
builder.Services.AddGrpcReflection();
builder.Services.AddRazorPages();

var app = builder.Build();


// Configure the HTTP request pipeline.
app.UseAuthorization();
//app.MapControllers();
app.MapGrpcService<AuthService>();
app.MapGrpcService<TruckService>();
app.MapGrpcService<StoreService>();
app.MapGrpcService<WeatherService>();
app.MapGrpcReflectionService();
app.MapRazorPages();

app.Run();


// For integration testing
public partial class Program { }
