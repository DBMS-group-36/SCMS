using FluentValidation;

using server.api.gRPC.Authentication;

namespace server.api.Validators;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(request => request.Email).EmailAddress().NotEmpty();
        RuleFor(request => request.UserName).NotEmpty();
        RuleFor(request => request.Password).MinimumLength(0);
    }
}
