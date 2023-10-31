using SendGrid.Helpers.Mail;
using SendGrid;

namespace server.api.Identity.Services;

public class SendGridEmailSender : IEmailSender
{
    private readonly IConfiguration configuration;

    public SendGridEmailSender(IConfiguration configuration)
    {
        this.configuration = configuration;
    }
    public async Task SendEmailAsync(string email, string userName, string subject, string htmlMessage)
    {
        var apiKey =configuration["SendGridApiKey"];
        var client = new SendGridClient(apiKey);
        var from = new EmailAddress("SCMSg36@gmail.com", "Company A");
        var to = new EmailAddress(email, userName);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, htmlMessage, htmlMessage);
        _ = await client.SendEmailAsync(msg);
    }
}
