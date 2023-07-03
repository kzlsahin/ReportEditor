using AspApp.Areas.Identity.Data;
using Microsoft.AspNetCore.Identity;

namespace AspApp.Models
{
    public class UsersModel
    {
        public List<AspAppUser> Users { get; set; }
        public string Message { get; set; }
    }
}
