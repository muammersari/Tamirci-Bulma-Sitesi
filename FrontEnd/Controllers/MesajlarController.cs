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
using System.IO;
using System.Collections;

namespace Tamirci_Bul.Controllers
{
    public class MesajlarController : Controller
    {
        public string baseUrl = "http://localhost:3000/api/";
        public IActionResult Index()
        {
            return View();
        }
        public async Task<ActionResult> Chat()
        {
            if (User.Identity.IsAuthenticated)
            {
                string role = User.FindFirstValue(ClaimTypes.Role).ToString();
                string id = User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();
                List<string> list = new List<string>();
                list.Add(role);
                list.Add(id);

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(baseUrl + "mesajlar/");
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    HttpResponseMessage responseTask = await client.PostAsJsonAsync(
                        baseUrl + "mesajlar/mesajGetir", list);

                    if (responseTask.StatusCode == HttpStatusCode.OK)
                    {
                        var readTask = responseTask.Content.ReadAsAsync<IList<Mesajlar>>();
                        readTask.Wait();
                        if (role == "kullanici")
                        {
                            ViewBag.role = "kullanici";
                        }
                        else
                        {
                            ViewBag.role = "tamirci";
                        }
                        return View(readTask.Result);
                    }
                    else return RedirectToAction("Tamirciler", "Tamirci");
                }
            }
            else
            {
                return View("çıkış yapılmış");
            }
        }

        public async Task<JsonResult> MesajGonder(Mesajlar mesajlar)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseUrl + "mesajlar/");
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage responseTask = await client.PostAsJsonAsync(
                    baseUrl + "mesajlar/mesajEkle/", mesajlar);

                return Json(responseTask.StatusCode);

            }
        }

        public async Task<JsonResult> Mesajicerigigetir(Mesajlar mesajlar)
        {
            if (User.Identity.IsAuthenticated)
            {
                string role = User.FindFirstValue(ClaimTypes.Role).ToString();

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(baseUrl + "mesajlar/");
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    HttpResponseMessage responseTask = await client.PostAsJsonAsync(
                        baseUrl + "mesajlar/MesajicerigiGetir/" + role, mesajlar);

                    if (responseTask.StatusCode == HttpStatusCode.OK)
                    {
                        var readTask = responseTask.Content.ReadAsAsync<IList<Mesajlar>>();
                        readTask.Wait();
                        return Json(readTask.Result);
                    }
                    else return Json(responseTask.StatusCode);
                }
            }
            else
            {
                return Json("çıkış yapılmış");
            }
        }

        public async Task<JsonResult> MesajSil(Mesajlar mesajlar)
        {
            if (User.Identity.IsAuthenticated)
            {
                using (var client = new HttpClient())
                {
                    string role = User.FindFirstValue(ClaimTypes.Role).ToString();

                    client.BaseAddress = new Uri(baseUrl + "mesajlar/");
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    HttpResponseMessage responseTask = await client.PostAsJsonAsync(
                        baseUrl + "mesajlar/MesajSil/" + role.ToString(), mesajlar);

                    if (responseTask.StatusCode == HttpStatusCode.OK)
                    {
                        return Json(responseTask.StatusCode);
                    }
                    else return Json("505");
                }
            }
            else
            {
                return Json("çıkış yapılmış");
            }
        }
    }
}
