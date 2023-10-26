using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using server.api.Identity;

using System.Text;

namespace server.api.Pages.Page
{
    public class ConfirmEmailModel : PageModel
    {
        private readonly UserManager<SCMSUser> userManager;

        public ConfirmEmailModel(UserManager<SCMSUser> userManager)
        {
            this.userManager = userManager;
        }

        [TempData]
        public string StatusMessage { get; set; }

        public async Task<IActionResult> OnGetAsync(string userId, string code)
        {
            if (userId == null || code == null)
            {
                StatusMessage = "Invalid email confirmation link.";
                return Page();
            }

            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                StatusMessage = "Invalid email confirmation link.";
                return Page();
            }

            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
            var result = await userManager.ConfirmEmailAsync(user, code);
            StatusMessage = result.Succeeded ? "Thank you for confirming your email." : "Error confirming your email.";
            return Page();
        }
    }
}
