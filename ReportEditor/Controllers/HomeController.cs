using AspApp.Data;
using AspApp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace AspApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AspAppContext _context;

        public HomeController(ILogger<HomeController> logger, AspAppContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Users()
        {
            UsersModel model = new();
            model.Users = (from user in _context.Users select user).ToList();
            if (model.Users.Any())
            {
                model.Message = "here is the users in db";
            }
            else
            {
                model.Message = "no user is found";

            }
            return View(model);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}