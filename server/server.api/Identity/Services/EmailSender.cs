namespace server.api.Identity.Services;

public class EmailSender : IEmailSender
{
    public async Task SendEmailAsync(string email, string userName, string subject, string htmlMessage)
    {
        // TODO: Implement
        await Console.Out.WriteLineAsync("\n\nEmail -------------------------------------------------------------------------");
        await Console.Out.WriteLineAsync(email);
        await Console.Out.WriteLineAsync(userName);
        await Console.Out.WriteLineAsync(subject);
        await Console.Out.WriteLineAsync(htmlMessage);
        await Console.Out.WriteLineAsync("\n");
    }
}
