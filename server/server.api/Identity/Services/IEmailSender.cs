namespace server.api.Identity.Services;

public interface IEmailSender
{
    Task SendEmailAsync(string email, string userName, string subject, string htmlMessage);
}
