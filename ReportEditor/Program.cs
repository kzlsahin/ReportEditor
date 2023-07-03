using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AspApp.Data;
using AspApp.Areas.Identity.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddJsonFile("ConnectionStrings.json",
        optional: false,
        reloadOnChange: true);
var connectionString = builder.Configuration.GetConnectionString("AspAppContextConnection") ?? throw new InvalidOperationException("Connection string 'AspAppContextConnection' not found.");

builder.Services
    .AddDbContext<AspAppContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services
    .AddDefaultIdentity<AspAppUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AspAppContext>()
    .AddDefaultUI();
//builder.Services.AddTransient<UserManager<AspAppUser>>();
// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseDefaultFiles();
app.UseRouting();
app.UseAuthentication();;

app.UseAuthorization();
app.MapAreaControllerRoute(
    name: "AreaReportEditor",
    areaName: "ReportEditor",
    pattern: "ReportEditor/{controller=Editor}/{action=Index}/{id?}");
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();
app.Run();
