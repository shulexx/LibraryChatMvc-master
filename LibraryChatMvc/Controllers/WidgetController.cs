using Microsoft.AspNetCore.Mvc;

namespace LibraryChatMvc.Controllers
{
    public class WidgetController : Controller
    {
        public IActionResult ChatWidget()
        {
            return PartialView();
        }
    }
}
