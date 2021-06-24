using Microsoft.AspNetCore.Mvc;
using Nancy.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Tamirci_Bul.Models;
using Microsoft.AspNetCore.Components;
using Newtonsoft.Json;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Tamirci_Bul.Controllers
{
    public class AnasayfaController : Controller
    {
        public string baseUrl = "http://localhost:3000/api/";

        public IActionResult Index()
        {
            return View();
        }

        //bu metod kullanıcının oturum açması için kullanılır.
        [AllowAnonymous]
        [HttpPost]
        public async Task<JsonResult> Login(LoginModel loginmodel)
        {

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseUrl + "login/");
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage responseTask = await client.PostAsJsonAsync(
                    baseUrl + "login/kullaniciGiris", loginmodel);

                if (responseTask.StatusCode == HttpStatusCode.OK)
                {
                    var readTask = responseTask.Content.ReadAsAsync<IList<LoginModel>>();
                    readTask.Wait();
                    var claims = new List<Claim>
                    {
                    new Claim(ClaimTypes.Name ,readTask.Result.ToList()[0].email),
                    new Claim(ClaimTypes.Role, readTask.Result.ToList()[0].role),
                    new Claim(ClaimTypes.NameIdentifier, readTask.Result.ToList()[0]._id)
                    };
                    var useridentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    ClaimsPrincipal principal = new ClaimsPrincipal(useridentity);
                    await HttpContext.SignInAsync(principal);

                    return Json(readTask.Result);
                }
                else return Json("404");
            }
        }
        //kullanıcının çıkış yapması için kullanılan metot
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> LogOut()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Json("200");
        }

    }
}
