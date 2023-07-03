using AspApp.Areas.Identity.Data;
using AspApp.Areas.ReportEditor.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.StaticFiles;
using System.Net.Mime;
using System.Text;

namespace AspApp.Areas.ReportEditor.Controllers
{
    [Area("ReportEditor")]
    public class EditorController : Controller
    {
        private readonly IWebHostEnvironment _env;
        private string _dir;

        public EditorController(IWebHostEnvironment env)
        {
            _env = env;
            //_dir = Path.Combine(_env.ContentRootPath, "Areas", "ReportEditor", "Data", "ReportDocuments");
            _dir = Path.Combine("wwwroot", "Report");
        }
        private string _getReportPath(int reportId, string userName)
        {
            return Path.Combine(_dir, userName, $"Report_{reportId}.xml");
        }

        private string _getAssetPath(string userName)
        {
            return Path.Combine(_env.WebRootPath, "Report", userName, "assets");
        }

        private string CheckAnonymUser(HttpContext context)
        {
            if (User.Identity?.Name != null)
            {
                return User.Identity.Name;
            }
            if (string.IsNullOrEmpty(context.Session.GetString("anonym_user")))
            {
                string newId = (new Guid()).ToString();
                context.Session.SetString("anonym_user", newId);
            }
            return context.Session.GetString("anonym_user") ?? string.Empty;
        }
        public  IActionResult Index()
        {            
            var model = new EditorPage();
            model.User.UserName = User?.Identity?.Name ?? "Anonymous User";
            return View(model);
        }
        [HttpGet]
        public ActionResult Images(string fileName)
        {            
            string? contentType;
            new FileExtensionContentTypeProvider().TryGetContentType(fileName, out contentType);
            string path = string.Empty;
            if (User.Identity?.Name != null)
            {
                path = Path.Combine(_getAssetPath(User.Identity.Name), fileName);
                Console.WriteLine("Images is called from" + path);
            }
            return PhysicalFile(path, "image/jpeg");
        } 

        [HttpPost()]
        public async Task<string> Report(int id)
        {
            HttpContext.Response.Headers.Add("Cache-Control", "no-store");
            if(User?.Identity?.Name == null)
            {
                return "<p>User not available!</p>";
            }
            string path = _getReportPath(id, User.Identity.Name);
            try
            {
                if (System.IO.File.Exists(path))
                {
                    string f = await System.IO.File.ReadAllTextAsync(path);
                    return f;
                }
                return "<p>No content is Found!</p>";
            }
            catch (Exception ex)
            {
                return $"<p>{ex.Message}</p>";

            }
        }

        [HttpPost()]
        public async Task<string> Save(int reportId)
        {
            Console.WriteLine("Save request come");
            string inp;
            if(User?.Identity?.Name == null)
            {
                return "user is not available";
            }
                string path = _getReportPath(reportId, User.Identity.Name );
            try
            {
                using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
                {
                    inp = await reader.ReadToEndAsync();
                }
                await System.IO.File.WriteAllTextAsync(path, inp);
                return "Report is saved.";
            }
            catch(Exception ex)
            {
                return $"<p>{ex.Message}</p>";
            }
        }
    }
}
