using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace AspApp.Areas.Identity.Data;

// Add profile data for application users by adding properties to the AspAppUser class
public class AspAppUser : IdentityUser
{
    List<ReportDoc>? Documents { get; set; }
}

