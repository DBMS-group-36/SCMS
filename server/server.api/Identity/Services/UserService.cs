using Grpc.Core;

using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.Tokens;

using server.api.gRPC.Admin;
using server.api.gRPC.Authentication;
using server.api.Validators;

using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;

namespace server.api.Identity.Services;

public class UserService : IUserService
{
    private readonly UserManager<SCMSUser> userManager;
    private readonly RoleManager<SCMSRole> roleManager;
    private readonly SignInManager<SCMSUser> signInManager;
    private readonly IEmailSender emailSender;
    private readonly IConfiguration configuration;

    public UserService(UserManager<SCMSUser> userManager, RoleManager<SCMSRole> roleManager, SignInManager<SCMSUser> signInManager, IEmailSender emailSender, IConfiguration configuration)
    {
        this.userManager = userManager;
        this.roleManager = roleManager;
        this.signInManager = signInManager;
        this.emailSender = emailSender;
        this.configuration = configuration;
    }
    public async Task<StatusReply> RegisterUserAsync(RegisterRequest request)
    {
        var reply = new StatusReply();

        var validator = new RegisterRequestValidator();
        var validationResult = await validator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            reply.Message = "User creation failed";
            reply.IsSuccess = false;
            reply.Errors.AddRange(validationResult.Errors.Select(e => e.ErrorMessage));
            return reply;
        }

        var user = new SCMSUser
        {
            UserName = request.UserName,
            Email = request.Email
        };
        
        var result = await userManager.CreateAsync(user, request.Password);



        if (result.Succeeded)
        {
            var userId = await userManager.GetUserIdAsync(user);
            var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
            var callbackUrl = new UriBuilder() {
                Scheme = "https",
                Host = "localhost:7114",
                Path = "/page/ConfirmEmail",
                Query = new QueryBuilder(new Dictionary<string, string> { { "userId", userId }, { "code", code } }).ToQueryString().Value
            }.ToString();

            if (userManager.Options.SignIn.RequireConfirmedAccount)
            {
                await emailSender.SendEmailAsync(request.Email, request.UserName, "Confirm your email for Company A",
                    $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.");

                reply.Message = "Confirm email to continue";
                reply.IsSuccess = true;
                return reply;
            }

       
            reply.Message = "User created successfully";
            reply.IsSuccess = true;
            return reply;
        }

        reply.Message = "User creation failed";
        reply.IsSuccess = false;
        reply.Errors.AddRange(result.Errors.Select(e => e.Description));
        return reply;
    }

    public async Task<TokenResponseReply> LoginUserAsync(LoginRequest request)
    {
        Console.WriteLine(request.UserName);
        var reply = new TokenResponseReply();
        string userName = null;

        switch (request.OneOfIdentityCase)
        {
            case LoginRequest.OneOfIdentityOneofCase.None:
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Provide userName or email."));
            case LoginRequest.OneOfIdentityOneofCase.UserName:
                userName = request.UserName;
                break;
            case LoginRequest.OneOfIdentityOneofCase.Email:
                userName = (await userManager.FindByEmailAsync(request.Email))?.UserName;
                break;
            default:
                throw new RpcException(new Status(StatusCode.Unknown, "Unknown request type."));
        }

        userName ??= "";

        var result = await signInManager.PasswordSignInAsync(userName, request.Password, true, lockoutOnFailure: true);
        
        if (result.Succeeded)
        {
            var user = await userManager.FindByNameAsync(userName);

            //await userManager.AddToRoleAsync(user, "admin");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.AuthenticationMethod, "passwordSignIn")
            };

            var userClaims = await userManager.GetClaimsAsync(user);
            claims.AddRange(userClaims);

            var roles = await userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
                var roleClaims = await roleManager.GetClaimsAsync(await roleManager.FindByNameAsync(role));
                claims.AddRange(roleClaims);
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Key"]));

            var accessToken = new JwtSecurityToken(
                issuer: configuration["JWT:Issuer"],
                audience: configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.Now.AddSeconds(int.Parse(configuration["JWT:TTL"])),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha512)
            );

            string JWT = new JwtSecurityTokenHandler().WriteToken(accessToken);

            //var refreshToken = await userManager.GenerateUserTokenAsync(user, configuration["JWT:Issuer"], "refresh");
            //var tokenResult = await userManager.SetAuthenticationTokenAsync(user, "password", "refresh", refreshToken);

            //if (!tokenResult.Succeeded)
            //{
            //    refreshToken = null;
            //}


            reply.AccessToken = JWT;
            reply.RefreshToken = "He he";
            reply.Expire = accessToken.ValidTo.ToString("o");
            reply.Response = new()
            {
                Message = "Login successful",
                IsSuccess = true
            };
            //reply.Response.Errors.AddRange(tokenResult.Errors.Select(e => e.Description));
            return reply;
        }
        if (result.RequiresTwoFactor)
        {
            reply.Response = new()
            {
                Message = "Login win 2fa",
                IsSuccess = false
            };
            return reply;
        }
        if (result.IsLockedOut)
        {
            reply.Response = new()
            {
                Message = "User account locked out",
                IsSuccess = false
            };
            return reply;
        }

        reply.Response = new()
        {
            Message = "Invalid login attempt",
            IsSuccess = false
        };
        return reply;
    }
}
