using Microsoft.AspNetCore.Mvc;

namespace LibraryChatMvc.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
